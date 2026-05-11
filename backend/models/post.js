const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  media: [{
    url:          { type: String, required: true },
    public_id:    { type: String },
    resource_type:{ type: String, enum: ['image', 'video'], default: 'image' },
  }],
  caption:  { type: String, default: '', maxlength: 2200 },
  location: { type: String, default: '' },
  tags:     [{ type: String }],        // hashtags extracted from caption
  mentions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

  isArchived: { type: Boolean, default: false },
}, { timestamps: true });

// Extract hashtags from caption before save
postSchema.pre('save', function (next) {
  if (this.isModified('caption')) {
    this.tags = (this.caption.match(/#(\w+)/g) || []).map(t => t.slice(1).toLowerCase());
  }
  next();
});

postSchema.virtual('likesCount').get(function () { return this.likes.length; });
postSchema.virtual('commentsCount').get(function () { return this.comments.length; });

postSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Post', postSchema);