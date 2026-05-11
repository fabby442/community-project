const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  post:    { type: mongoose.Schema.Types.ObjectId, ref: 'Post',    required: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User',    required: true },
  parent:  { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // for replies
  text:    { type: String, required: true, maxlength: 1000 },
  likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

commentSchema.virtual('likesCount').get(function () { return this.likes.length; });
commentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Comment', commentSchema);