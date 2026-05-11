const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  media: {
    url:           { type: String, required: true },
    public_id:     { type: String },
    resource_type: { type: String, enum: ['image', 'video'], default: 'image' },
  },
  caption:  { type: String, default: '', maxlength: 200 },
  viewers:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expiresAt:{ type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // 24h TTL
}, { timestamps: true });

// Auto-delete expired stories via MongoDB TTL index
storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Story', storySchema);