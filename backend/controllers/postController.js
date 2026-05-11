const Post               = require('../models/Post');
const User               = require('../models/User');
const Comment            = require('../models/Comment');
const { asyncHandler, AppError } = require('../middleware/error');
const { createNotification }     = require('../utils/notify');
const { cloudinary }             = require('../config/cloudinary');

// ── Create post ───────────────────────────────────
exports.createPost = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0)
    throw new AppError('At least one image or video is required', 400);

  const media = req.files.map(f => ({
    url:           f.path,
    public_id:     f.filename,
    resource_type: f.mimetype.startsWith('video') ? 'video' : 'image',
  }));

  const { caption = '', location = '' } = req.body;

  // Extract @mentions from caption
  const mentionHandles = (caption.match(/@(\w+)/g) || []).map(m => m.slice(1));
  const mentionedUsers = await User.find({ username: { $in: mentionHandles } }).select('_id');

  const post = await Post.create({
    author: req.user._id, media, caption, location,
    mentions: mentionedUsers.map(u => u._id),
  });

  // Notify mentioned users
  for (const mu of mentionedUsers) {
    await createNotification({ recipient: mu._id, sender: req.user._id, type: 'mention', post: post._id });
  }

  await post.populate('author', 'username avatar verified');
  res.status(201).json({ success: true, post });
});

// ── Feed (posts from followed users + self) ────────
exports.getFeed = asyncHandler(async (req, res) => {
  const me     = await User.findById(req.user._id);
  const ids    = [...me.following, req.user._id];
  const page   = parseInt(req.query.page)  || 1;
  const limit  = parseInt(req.query.limit) || 12;
  const skip   = (page - 1) * limit;

  const posts = await Post.find({ author: { $in: ids }, isArchived: false })
    .sort({ createdAt: -1 }).skip(skip).limit(limit)
    .populate('author', 'username avatar verified')
    .populate({ path: 'comments', options: { limit: 2 }, populate: { path: 'author', select: 'username avatar' } });

  const total = await Post.countDocuments({ author: { $in: ids }, isArchived: false });
  res.json({ success: true, posts, page, pages: Math.ceil(total / limit), total });
});

// ── Explore (all public posts, not in feed) ────────
exports.explore = asyncHandler(async (req, res) => {
  const me    = await User.findById(req.user._id);
  const ids   = [...me.following, req.user._id];
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 24;
  const skip  = (page - 1) * limit;
  const { tag } = req.query;

  const filter = { author: { $nin: ids }, isArchived: false };
  if (tag) filter.tags = tag.toLowerCase();

  const posts = await Post.find(filter)
    .sort({ likes: -1, createdAt: -1 }).skip(skip).limit(limit)
    .populate('author', 'username avatar verified');

  const total = await Post.countDocuments(filter);
  res.json({ success: true, posts, page, pages: Math.ceil(total / limit), total });
});

// ── Single post ───────────────────────────────────
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username avatar verified name')
    .populate({ path: 'comments', match: { parent: null }, sort: { createdAt: -1 },
      populate: [
        { path: 'author', select: 'username avatar' },
        { path: 'replies', populate: { path: 'author', select: 'username avatar' } },
      ]});
  if (!post) throw new AppError('Post not found', 404);
  res.json({ success: true, post });
});

// ── Like / Unlike ─────────────────────────────────
exports.toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  const liked = post.likes.includes(req.user._id);
  if (liked) {
    post.likes.pull(req.user._id);
  } else {
    post.likes.addToSet(req.user._id);
    await createNotification({ recipient: post.author, sender: req.user._id, type: 'like', post: post._id });
  }
  await post.save();
  res.json({ success: true, liked: !liked, likesCount: post.likes.length });
});

// ── Save / Unsave post ────────────────────────────
exports.toggleSave = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);

  const me    = await User.findById(req.user._id);
  const saved = me.savedPosts.includes(post._id);
  if (saved) me.savedPosts.pull(post._id);
  else        me.savedPosts.addToSet(post._id);
  await me.save();
  res.json({ success: true, saved: !saved });
});

// ── Delete post ───────────────────────────────────
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) throw new AppError('Post not found', 404);
  if (String(post.author) !== String(req.user._id))
    throw new AppError('Not authorised', 403);

  // Delete from Cloudinary
  for (const m of post.media) {
    if (m.public_id) await cloudinary.uploader.destroy(m.public_id, { resource_type: m.resource_type });
  }
  await Comment.deleteMany({ post: post._id });
  await post.deleteOne();
  res.json({ success: true, message: 'Post deleted' });
});

// ── Trending hashtags ─────────────────────────────
exports.trendingTags = asyncHandler(async (req, res) => {
  const tags = await Post.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
  ]);
  res.json({ success: true, tags });
});