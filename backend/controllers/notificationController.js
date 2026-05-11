const Notification       = require('../models/Notification');
const { asyncHandler }   = require('../middleware/error');

// ── Get notifications ─────────────────────────────
exports.getNotifications = asyncHandler(async (req, res) => {
  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip  = (page - 1) * limit;

  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 }).skip(skip).limit(limit)
    .populate('sender', 'username avatar verified')
    .populate('post',   'media');

  const unread = await Notification.countDocuments({ recipient: req.user._id, read: false });
  res.json({ success: true, notifications, unread });
});

// ── Mark all as read ──────────────────────────────
exports.markRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
  res.json({ success: true });
});

// ── Mark single as read ───────────────────────────
exports.markOneRead = asyncHandler(async (req, res) => {
  await Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user._id }, { read: true });
  res.json({ success: true });
});