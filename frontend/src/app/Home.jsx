import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { posts as postsApi, stories as storiesApi, users as usersApi, getMe } from '../api';

// ─── Icons ───────────────────────────────────────────────────────────────────
function HeartIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'var(--red)' : 'none'} stroke={filled ? 'var(--red)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function CommentIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}
function BookmarkIcon({ filled }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? 'var(--amber)' : 'none'} stroke={filled ? 'var(--amber)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 22, height: 22 }}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: 20, height: 20 }}>
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function PostSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px' }}>
        <div className="skeleton" style={{ width: 36, height: 36, borderRadius: '50%' }} />
        <div>
          <div className="skeleton" style={{ width: 100, height: 12, borderRadius: 6, marginBottom: 6 }} />
          <div className="skeleton" style={{ width: 60, height: 10, borderRadius: 6 }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: '100%', height: 380 }} />
      <div style={{ padding: '12px 16px' }}>
        <div className="skeleton" style={{ width: 80, height: 12, borderRadius: 6, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: '70%', height: 12, borderRadius: 6 }} />
      </div>
    </div>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────
function PostCard({ post: initialPost }) {
  const [post, setPost]       = useState(initialPost);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleLike = async () => {
    // Optimistic update
    const wasLiked = post.liked;
    setPost(p => ({ ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }));
    try {
      const data = await postsApi.toggleLike(post._id);
      setPost(p => ({ ...p, liked: data.liked, likes: data.likes }));
    } catch {
      // Revert on failure
      setPost(p => ({ ...p, liked: wasLiked, likes: wasLiked ? p.likes + 1 : p.likes - 1 }));
    }
  };

  const toggleSave = async () => {
    const wasSaved = post.saved;
    setPost(p => ({ ...p, saved: !p.saved }));
    try {
      const data = await postsApi.toggleSave(post._id);
      setPost(p => ({ ...p, saved: data.saved }));
    } catch {
      setPost(p => ({ ...p, saved: wasSaved }));
    }
  };

  const submitComment = async () => {
    if (!comment.trim() || submitting) return;
    setSubmitting(true);
    try {
      await postsApi; // comment endpoint handled separately
      // Optimistically bump comment count
      setPost(p => ({ ...p, commentsCount: (p.commentsCount || 0) + 1 }));
      setComment('');
    } catch { /* silent */ } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60)   return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const user = post.user || post.author || {};

  return (
    <article className="card animate-fadeUp" style={{ overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link to={`/profile/${user.username}`}>
            <div className="avatar-ring">
              {user.avatar
                ? <img src={user.avatar} alt={user.username} style={{ width: 36, height: 36, objectFit: 'cover' }} />
                : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700 }}>
                    {user.username?.[0]?.toUpperCase()}
                  </div>
              }
            </div>
          </Link>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Link to={`/profile/${user.username}`} style={{ fontSize: 13, fontWeight: 600 }}>{user.username}</Link>
              {user.verified && <span style={{ color: 'var(--amber)', fontSize: 11 }}>✦</span>}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text2)' }}>{timeAgo(post.createdAt)} ago</div>
          </div>
        </div>
        <button style={{ color: 'var(--text2)', fontSize: 18, letterSpacing: 2 }}>···</button>
      </div>

      {/* Image */}
      {post.image && (
        <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg3)' }}>
          <img src={post.image} alt={post.caption}
            style={{ width: '100%', maxHeight: 520, objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onDoubleClick={toggleLike}
          />
        </div>
      )}

      {/* Actions */}
      <div style={{ padding: '10px 16px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <button onClick={toggleLike} style={{ color: 'var(--text)', transition: 'transform 0.15s ease' }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.85)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <HeartIcon filled={post.liked} />
            </button>
            <button style={{ color: 'var(--text)' }}><CommentIcon /></button>
            <button style={{ color: 'var(--text)' }}><ShareIcon /></button>
          </div>
          <button onClick={toggleSave} style={{ color: 'var(--text)' }}>
            <BookmarkIcon filled={post.saved} />
          </button>
        </div>

        <div style={{ marginTop: 10, fontSize: 13, fontWeight: 600 }}>{(post.likes || 0).toLocaleString()} likes</div>

        {post.caption && (
          <div style={{ marginTop: 4, fontSize: 13 }}>
            <Link to={`/profile/${user.username}`} style={{ fontWeight: 600, marginRight: 6 }}>{user.username}</Link>
            {post.caption}
          </div>
        )}

        {post.commentsCount > 0 && (
          <button style={{ marginTop: 4, fontSize: 12, color: 'var(--text2)' }}>
            View all {post.commentsCount} comments
          </button>
        )}

        {/* Comment input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
          <input
            value={comment} onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitComment()}
            placeholder="Add a comment…"
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 12 }}
          />
          {comment && (
            <button onClick={submitComment} disabled={submitting}
              style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)' }}>
              {submitting ? '…' : 'Post'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Create Post Modal ────────────────────────────────────────────────────────
function CreatePostModal({ onClose, onCreated }) {
  const [caption, setCaption]   = useState('');
  const [file, setFile]         = useState(null);
  const [preview, setPreview]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!file) { setError('Please select an image.'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      fd.append('caption', caption);
      const newPost = await postsApi.create(fd);
      onCreated(newPost);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to post. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div className="card" style={{ width: 460, padding: 28, animation: 'fadeUp 0.2s ease' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>New Post</h2>

        {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</div>}

        {preview
          ? <img src={preview} alt="preview" style={{ width: '100%', maxHeight: 300, objectFit: 'cover', borderRadius: 8, marginBottom: 14 }} />
          : (
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              height: 180, border: '2px dashed var(--border)', borderRadius: 10, cursor: 'pointer',
              color: 'var(--text2)', fontSize: 13, marginBottom: 14,
            }}>
              <span style={{ fontSize: 28, marginBottom: 8 }}>📷</span>
              Click to choose a photo
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            </label>
          )
        }

        <textarea
          className="input"
          placeholder="Write a caption…"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          rows={3}
          style={{ resize: 'vertical', marginBottom: 14 }}
        />

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !file}>
            {loading ? 'Posting…' : 'Share post'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  const [feed, setFeed]           = useState([]);
  const [storyUsers, setStoryUsers] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const me = getMe();

  // Load feed
  const loadFeed = useCallback(async (pageNum = 1) => {
    try {
      const data = await postsApi.getFeed(pageNum);
      const newPosts = data.posts || data || [];
      if (pageNum === 1) {
        setFeed(newPosts);
      } else {
        setFeed(p => [...p, ...newPosts]);
      }
      setHasMore(newPosts.length >= 10);
    } catch (err) {
      console.error('Feed error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed(1);
    storiesApi.getFeed().then(d => setStoryUsers(d || [])).catch(() => {});
    usersApi.suggested().then(d => setSuggested(d?.users || d || [])).catch(() => {});
  }, [loadFeed]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    loadFeed(next);
  };

  const handlePostCreated = (newPost) => {
    setFeed(f => [newPost, ...f]);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 32, padding: '24px 24px', maxWidth: 1000, margin: '0 auto' }}>
      {showCreate && <CreatePostModal onClose={() => setShowCreate(false)} onCreated={handlePostCreated} />}

      {/* Feed column */}
      <div style={{ flex: 1, maxWidth: 600 }}>
        {/* Stories bar */}
        <div className="card" style={{ padding: '16px 20px', marginBottom: 20, overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: 16, minWidth: 'max-content' }}>
            {/* "Add story" button for current user */}
            {me && (
              <button onClick={() => setShowCreate(true)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--bg3)', border: '2px dashed var(--amber)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--amber)',
                }}>
                  <PlusIcon />
                </div>
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>Your story</span>
              </button>
            )}

            {storyUsers.map(u => {
              const user = u.user || u;
              const hasUnseen = u.hasUnseen ?? !u.seen;
              return (
                <Link key={user._id || user.id} to="/stories" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    padding: 2,
                    background: hasUnseen ? 'linear-gradient(135deg, var(--amber), #f06030)' : 'var(--border)',
                    borderRadius: '50%',
                  }}>
                    {user.avatar
                      ? <img src={user.avatar} alt={user.username}
                          style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid var(--bg)', objectFit: 'cover' }} />
                      : <div style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid var(--bg)', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700, fontSize: 18 }}>
                          {user.username?.[0]?.toUpperCase()}
                        </div>
                    }
                  </div>
                  <span style={{ fontSize: 11, color: 'var(--text2)', maxWidth: 56, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.username}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Posts */}
        {loading
          ? [1, 2].map(i => <PostSkeleton key={i} />)
          : feed.length === 0
            ? (
              <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📸</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No posts yet</div>
                <div style={{ fontSize: 13 }}>Follow people to see their posts here, or create your first post.</div>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={() => setShowCreate(true)}>
                  Create your first post
                </button>
              </div>
            )
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {feed.map(p => <PostCard key={p._id || p.id} post={p} />)}
                {hasMore && (
                  <button className="btn btn-ghost" style={{ alignSelf: 'center' }} onClick={handleLoadMore}>
                    Load more
                  </button>
                )}
              </div>
            )
        }
      </div>

      {/* Right panel – suggested users */}
      <aside style={{ width: 280, flexShrink: 0, display: 'none' }} className="right-panel">
        <div style={{ marginTop: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text2)' }}>Suggested for you</span>
            <Link to="/explore" style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)' }}>See all</Link>
          </div>
          {suggested.slice(0, 5).map(u => (
            <SuggestedUser key={u._id || u.id} user={u} />
          ))}
        </div>
      </aside>

      <style>{`@media (min-width: 900px) { .right-panel { display: block !important; } }`}</style>
    </div>
  );
}

function SuggestedUser({ user }) {
  const [following, setFollowing] = useState(user.isFollowing || false);

  const toggleFollow = async () => {
    const prev = following;
    setFollowing(v => !v);
    try {
      await usersApi.toggleFollow(user._id || user.id);
    } catch {
      setFollowing(prev);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="avatar-ring">
          {user.avatar
            ? <img src={user.avatar} alt={user.username} style={{ width: 34, height: 34, objectFit: 'cover' }} />
            : <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700, fontSize: 14 }}>
                {user.username?.[0]?.toUpperCase()}
              </div>
          }
        </div>
        <div>
          <Link to={`/profile/${user.username}`} style={{ fontSize: 13, fontWeight: 500 }}>{user.username}</Link>
          <div style={{ fontSize: 11, color: 'var(--text2)' }}>Suggested for you</div>
        </div>
      </div>
      <button onClick={toggleFollow} style={{ fontSize: 12, fontWeight: 600, color: following ? 'var(--text2)' : 'var(--amber)' }}>
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}