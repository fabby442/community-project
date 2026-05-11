const User                              = require('../models/User');
const { signAccess, signRefresh, verifyRefresh } = require('../utils/tokens');
const { asyncHandler, AppError }        = require('../middleware/error');

// ── Register ─────────────────────────────────────
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password, name } = req.body;
  if (!username || !email || !password || !name)
    throw new AppError('All fields are required', 400);

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw new AppError('Email or username already taken', 409);

  const user = await User.create({ username, email, password, name });

  const accessToken  = signAccess(user._id);
  const refreshToken = signRefresh(user._id);
  await User.findByIdAndUpdate(user._id, { $push: { refreshTokens: refreshToken } });

  res.status(201).json({ success: true, accessToken, refreshToken, user });
});

// ── Login ─────────────────────────────────────────
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Email and password required', 400);

  const user = await User.findOne({ email }).select('+password +refreshTokens');
  if (!user || !(await user.matchPassword(password)))
    throw new AppError('Invalid credentials', 401);

  const accessToken  = signAccess(user._id);
  const refreshToken = signRefresh(user._id);
  user.refreshTokens.push(refreshToken);
  await user.save();

  res.json({ success: true, accessToken, refreshToken, user });
});

// ── Refresh token ─────────────────────────────────
exports.refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError('Refresh token required', 400);

  let decoded;
  try { decoded = verifyRefresh(refreshToken); }
  catch { throw new AppError('Invalid or expired refresh token', 401); }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user || !user.refreshTokens.includes(refreshToken))
    throw new AppError('Refresh token not recognised', 401);

  // Rotate refresh token
  user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
  const newAccess  = signAccess(user._id);
  const newRefresh = signRefresh(user._id);
  user.refreshTokens.push(newRefresh);
  await user.save();

  res.json({ success: true, accessToken: newAccess, refreshToken: newRefresh });
});

// ── Logout ────────────────────────────────────────
exports.logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await User.findByIdAndUpdate(req.user._id, { $pull: { refreshTokens: refreshToken } });
  }
  res.json({ success: true, message: 'Logged out' });
});

// ── Get current user ──────────────────────────────
exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});