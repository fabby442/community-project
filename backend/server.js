require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const path     = require('path');
const connectDB = require('./config/db');

// ── Routes ───────────────────────────────────────
const authRoutes         = require('./routes/auth');
const userRoutes         = require('./routes/users');
const postRoutes         = require('./routes/posts');
const commentRoutes      = require('./routes/comments');
const storyRoutes        = require('./routes/stories');
const notificationRoutes = require('./routes/notifications');

const app = express();

// ── Connect DB ───────────────────────────────────
connectDB();

// ── Middleware ───────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// ── API Routes ───────────────────────────────────
app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/posts',         postRoutes);
app.use('/api/comments',      commentRoutes);
app.use('/api/stories',       storyRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Health check ─────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: Date.now() }));

// ── Global error handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status  = err.statusCode || 500;
  const message = err.message    || 'Internal Server Error';
  res.status(status).json({ success: false, message });
});

// ── Start ────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀  Lumina API running on port ${PORT}`));