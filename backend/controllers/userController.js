const User               = require('../models/User');
const Post               = require('../models/Post');
const { asyncHandler, AppError } = require('../middleware/error');
const { createNotification }     = require('../utils/notify');

// ── Get profile ───────────────────────────────────
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username })
    .populate('followers', 'username avatar name')
    .populate('following', 'username avatar name');
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, user });
});

// ── Update profile ────────────────────────────────
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'website', 'private'];
  const updates = {};
  allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

  // Avatar uploaded via multer → cloudinary
  if (req.file) updates.avatar = req.file.path;

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, user });
});

// ── Follow / Unfollow ─────────────────────────────
exports.toggleFollow = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) throw new AppError('User not found', 404);
  if (String(target._id) === String(req.user._id))
    throw new AppError('You cannot follow yourself', 400);

  const alreadyFollowing = target.followers.includes(req.user._id);

  if (alreadyFollowing) {
    await User.findByIdAndUpdate(target._id,    { $pull: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id,  { $pull: { following: target._id } });
  } else {
    await User.findByIdAndUpdate(target._id,    { $addToSet: { followers: req.user._id } });
    await User.findByIdAndUpdate(req.user._id,  { $addToSet: { following: target._id } });
    await createNotification({ recipient: target._id, sender: req.user._id, type: 'follow' });
  }

  res.json({ success: true, following: !alreadyFollowing });
});

// ── Search users ──────────────────────────────────
exports.searchUsers = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, users: [] });

  const regex = new RegExp(q, 'i');
  const users = await User.find({
    $or: [{ username: regex }, { name: regex }],
    _id: { $ne: req.user?._id },
  }).select('username name avatar verified').limit(20);

  res.json({ success: true, users });
});

// ── Suggested users (not yet followed) ───────────────
exports.suggested = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id);
  const users = await User.find({
    _id: { $ne: req.user._id, $nin: me.following },
  }).select('username name avatar verified followers').limit(10);
  res.json({ success: true, users });
});

// ── Get user posts ────────────────────────────────
exports.getUserPosts = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) throw new AppError('User not found', 404);

  const posts = await Post.find({ author: user._id, isArchived: false })
    .sort({ createdAt: -1 })
    .populate('author', 'username avatar verified');
  res.json({ success: true, posts });
});

// ── Saved posts ───────────────────────────────────
exports.getSaved = asyncHandler(async (req, res) => {
  const me = await User.findById(req.user._id).populate({
    path: 'savedPosts',
    populate: { path: 'author', select: 'username avatar verified' },
  });
  res.json({ success: true, posts: me.savedPosts });
});

// ── Followers / Following lists ───────────────────
exports.getFollowers = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).populate('followers', 'username name avatar verified');
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, users: user.followers });
});

exports.getFollowing = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).populate('following', 'username name avatar verified');
  if (!user) throw new AppError('User not found', 404);
  res.json({ success: true, users: user.following });
});