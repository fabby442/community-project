const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type:      { type: String, enum: ['like', 'comment', 'follow', 'mention', 'reply'], required: true },
  post:      { type: mongoose.Schema.Types.ObjectId, ref: 'Post',    default: null },
  comment:   { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  read:      { type: Boolean, default: false },
}, { timestamps: true });

// Prevent duplicate notifications (e.g. same user liking again after unlike)
notificationSchema.index({ recipient: 1, sender: 1, type: 1, post: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Notification', notificationSchema);