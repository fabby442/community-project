const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String, required: true, unique: true, trim: true, lowercase: true,
    minlength: 3, maxlength: 30,
    match: [/^[a-z0-9_.]+$/, 'Username can only contain letters, numbers, underscores, and dots'],
  },
  email: {
    type: String, required: true, unique: true, trim: true, lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
  },
  password:    { type: String, required: true, minlength: 6, select: false },
  name:        { type: String, required: true, trim: true, maxlength: 60 },
  bio:         { type: String, default: '', maxlength: 150 },
  website:     { type: String, default: '' },
  avatar:      { type: String, default: '' },
  verified:    { type: Boolean, default: false },
  private:     { type: Boolean, default: false },

  followers:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  savedPosts:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],

  refreshTokens: [{ type: String, select: false }],
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Never expose password or refresh tokens
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

module.exports = mongoose.model('User', userSchema);