const Story              = require('../models/Story');
const User               = require('../models/User');
const { asyncHandler, AppError } = require('../middleware/error');
const { cloudinary }             = require('../config/cloudinary');

// ── Create story ──────────────────────────────────
exports.createStory = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Media required', 400);

  const story = await Story.create({
    author: req.user._id,
    media: {
      url:           req.file.path,
      public_id:     req.file.filename,
      resource_type: req.file.mimetype.startsWith('video') ? 'video' : 'image',
    },
    caption: req.body.caption || '',
  });

  await story.populate('author', 'username avatar verified');
  res.status(201).json({ success: true, story });
});

// ── Get stories from followed users ───────────────
exports.getFeedStories = asyncHandler(async (req, res) => {
  const me  = await User.findById(req.user._id);
  const ids = [...me.following, req.user._id];

  // Group stories by author
  const stories = await Story.find({ author: { $in: ids } })
    .sort({ createdAt: -1 })
    .populate('author', 'username avatar verified');

  const grouped = {};
  for (const s of stories) {
    const uid = String(s.author._id);
    if (!grouped[uid]) {
      grouped[uid] = {
        user:   s.author,
        slides: [],
        seen:   s.viewers.includes(req.user._id),
      };
    }
    grouped[uid].slides.push({
      _id:       s._id,
      media:     s.media,
      caption:   s.caption,
      createdAt: s.createdAt,
      seen:      s.viewers.includes(req.user._id),
    });
  }

  res.json({ success: true, stories: Object.values(grouped) });
});

// ── Mark story as viewed ──────────────────────────
exports.viewStory = asyncHandler(async (req, res) => {
  await Story.findByIdAndUpdate(req.params.id, { $addToSet: { viewers: req.user._id } });
  res.json({ success: true });
});

// ── Delete story ──────────────────────────────────
exports.deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) throw new AppError('Story not found', 404);
  if (String(story.author) !== String(req.user._id)) throw new AppError('Not authorised', 403);

  if (story.media.public_id)
    await cloudinary.uploader.destroy(story.media.public_id, { resource_type: story.media.resource_type });

  await story.deleteOne();
  res.json({ success: true, message: 'Story deleted' });
});