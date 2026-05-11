// ─── api.js ─────────────────────────────────────────────────────────────────
// Central API service. All components import from here.
// Set VITE_API_URL in your .env file: VITE_API_URL=http://localhost:5000/api
// ─────────────────────────────────────────────────────────────────────────────

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Token helpers ────────────────────────────────────────────────────────────
export const getToken   = ()        => localStorage.getItem('auth_token');
export const setToken   = (t)       => localStorage.setItem('auth_token', t);
export const removeToken = ()       => localStorage.removeItem('auth_token');
export const getMe      = ()        => { try { return JSON.parse(localStorage.getItem('auth_user')); } catch { return null; } };
export const setMe      = (u)       => localStorage.setItem('auth_user', JSON.stringify(u));
export const removeMe   = ()        => localStorage.removeItem('auth_user');

// ── Core fetch wrapper ───────────────────────────────────────────────────────
async function req(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Don't set Content-Type for FormData (let browser set boundary)
  if (options.body instanceof FormData) delete headers['Content-Type'];

  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const auth = {
  login: (email, password) =>
    req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (name, username, email, password) =>
    req('/auth/register', { method: 'POST', body: JSON.stringify({ name, username, email, password }) }),

  logout: () =>
    req('/auth/logout', { method: 'POST' }).catch(() => {}),

  me: () => req('/auth/me'),

  refreshToken: (refreshToken) =>
    req('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
};

// ── Users ────────────────────────────────────────────────────────────────────
export const users = {
  // GET /users/:username
  getProfile: (username) => req(`/users/${username}`),

  // GET /users/:username/posts
  getPosts: (username, page = 1) => req(`/users/${username}/posts?page=${page}`),

  // GET /users/:username/followers
  getFollowers: (username) => req(`/users/${username}/followers`),

  // GET /users/:username/following
  getFollowing: (username) => req(`/users/${username}/following`),

  // GET /users/me/saved
  getSaved: () => req('/users/me/saved'),

  // PUT /users/me  (multipart: name, bio, website, avatar file)
  updateProfile: (formData) =>
    req('/users/me', { method: 'PUT', body: formData }),

  // POST /users/:id/follow  → { following: true/false }
  toggleFollow: (userId) =>
    req(`/users/${userId}/follow`, { method: 'POST' }),

  // GET /users/search?q=
  search: (q) => req(`/users/search?q=${encodeURIComponent(q)}`),

  // GET /users/suggested
  suggested: () => req('/users/suggested'),
};

// ── Posts ─────────────────────────────────────────────────────────────────────
export const posts = {
  // GET /posts/feed?page=  (paginated feed of followed users)
  getFeed: (page = 1) => req(`/posts/feed?page=${page}`),

  // GET /posts/explore?page=
  getExplore: (page = 1) => req(`/posts/explore?page=${page}`),

  // GET /posts/:id
  getOne: (id) => req(`/posts/${id}`),

  // POST /posts  (multipart: caption, image)
  create: (formData) =>
    req('/posts', { method: 'POST', body: formData }),

  // DELETE /posts/:id
  delete: (id) =>
    req(`/posts/${id}`, { method: 'DELETE' }),

  // POST /posts/:id/like  → { liked: true/false, likes: N }
  toggleLike: (id) =>
    req(`/posts/${id}/like`, { method: 'POST' }),

  // POST /posts/:id/save  → { saved: true/false }
  toggleSave: (id) =>
    req(`/posts/${id}/save`, { method: 'POST' }),
};

// ── Comments ──────────────────────────────────────────────────────────────────
export const comments = {
  // GET /posts/:postId/comments
  getAll: (postId) => req(`/posts/${postId}/comments`),

  // POST /posts/:postId/comments  { text }
  add: (postId, text) =>
    req(`/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ text }) }),

  // DELETE /posts/:postId/comments/:commentId
  delete: (postId, commentId) =>
    req(`/posts/${postId}/comments/${commentId}`, { method: 'DELETE' }),
};

// ── Stories ───────────────────────────────────────────────────────────────────
export const stories = {
  // GET /stories/feed  (stories from followed users)
  getFeed: () => req('/stories/feed'),

  // GET /stories/mine
  getMine: () => req('/stories/mine'),

  // POST /stories  (multipart: image, caption)
  create: (formData) =>
    req('/stories', { method: 'POST', body: formData }),

  // DELETE /stories/:id
  delete: (id) =>
    req(`/stories/${id}`, { method: 'DELETE' }),

  // POST /stories/:id/view
  markViewed: (id) =>
    req(`/stories/${id}/view`, { method: 'POST' }),
};

// ── Notifications ─────────────────────────────────────────────────────────────
export const notifications = {
  // GET /notifications
  getAll: () => req('/notifications'),

  // POST /notifications/read-all
  markAllRead: () =>
    req('/notifications/read-all', { method: 'POST' }),

  // DELETE /notifications/:id
  delete: (id) =>
    req(`/notifications/${id}`, { method: 'DELETE' }),
};

// ── Messages (REST for conversation list; Firebase handles real-time thread) ──
export const messages = {
  // GET /messages/conversations
  getConversations: () => req('/messages/conversations'),

  // GET /messages/conversations/:userId
  getThread: (userId, limit = 50) =>
    req(`/messages/conversations/${userId}?limit=${limit}`),

  // POST /messages  { recipientId, text }  (fallback if Firebase unavailable)
  send: (recipientId, text) =>
    req('/messages', { method: 'POST', body: JSON.stringify({ recipientId, text }) }),

  // POST /messages/conversations/:userId/read
  markRead: (userId) =>
    req(`/messages/conversations/${userId}/read`, { method: 'POST' }),
};

// ── Firebase chat helper ──────────────────────────────────────────────────────
// Import and initialise Firebase in your main.jsx or a firebase.js file:
//
//   import { initializeApp } from 'firebase/app';
//   import { getDatabase }   from 'firebase/database';
//   export const db = getDatabase(initializeApp({ ...your config... }));
//
// Then use these helpers:
//
//   import { ref, push, onValue, serverTimestamp } from 'firebase/database';
//   import { db } from './firebase';
//
//   // Subscribe to a thread
//   const threadRef = ref(db, `threads/${threadId}`);
//   onValue(threadRef, snap => { ... });
//
//   // Send a message
//   push(threadRef, { senderId, text, createdAt: serverTimestamp() });
//
// threadId convention: sort the two user IDs alphabetically and join with '_'
// e.g. "abc123_xyz789"
export const getThreadId = (uid1, uid2) =>
  [uid1, uid2].sort().join('_');