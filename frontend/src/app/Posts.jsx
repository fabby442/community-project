import { useState, useEffect, useCallback } from 'react';
import { posts as postsApi, users as usersApi } from '../api';

function HeartIcon() {
  return <svg viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" style={{ width: 16, height: 16 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l7.78 7.78 7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function ChatIcon() {
  return <svg viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1.5" style={{ width: 16, height: 16 }}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}

function GridItem({ post, index }) {
  const [hover, setHover] = useState(false);
  // Every 4th post (0-indexed: 0, 4, 8, …) spans 2 rows for visual variety
  const big = index % 7 === 0;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        gridRowEnd: big ? 'span 2' : 'span 1',
        borderRadius: 8, background: 'var(--bg3)',
      }}
    >
      {post.image
        ? <img src={post.image} alt={post.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.35s ease', transform: hover ? 'scale(1.05)' : 'scale(1)' }} />
        : <div style={{ width: '100%', height: '100%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 24 }}>📷</div>
      }
      {hover && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20,
          animation: 'fadeUp 0.18s ease both',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontWeight: 600, fontSize: 14 }}>
            <HeartIcon /> {(post.likes || 0).toLocaleString()}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#fff', fontWeight: 600, fontSize: 14 }}>
            <ChatIcon /> {post.commentsCount || post.comments || 0}
          </span>
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ borderRadius: 8, gridRowEnd: i % 7 === 0 ? 'span 2' : 'span 1' }} />
      ))}
    </>
  );
}

const TABS = ['For you', 'Photos', 'Videos', 'Trending'];

export default function Posts() {
  const [explorePosts, setExplorePosts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Load explore
  useEffect(() => {
    postsApi.getExplore(1)
      .then(data => {
        const ps = data?.posts || data || [];
        setExplorePosts(ps);
        setHasMore(ps.length >= 12);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Search users when query changes
  useEffect(() => {
    if (!query.trim()) { setSearchResults([]); return; }
    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const data = await usersApi.search(query);
        setSearchResults(data?.users || data || []);
      } catch { /* silent */ } finally {
        setSearching(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [query]);

  const loadMore = async () => {
    const next = page + 1;
    setPage(next);
    const data = await postsApi.getExplore(next);
    const ps = data?.posts || data || [];
    setExplorePosts(p => [...p, ...ps]);
    setHasMore(ps.length >= 12);
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 20px' }}>
      {/* Search */}
      <div style={{ marginBottom: 20, position: 'relative' }}>
        <input
          className="input"
          placeholder="Search people, photos, tags…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ maxWidth: 400 }}
        />
        {searching && <span style={{ position: 'absolute', right: 'calc(100% - 390px)', top: '50%', transform: 'translateY(-50%)', fontSize: 12, color: 'var(--text2)' }}>…</span>}

        {/* Search results dropdown */}
        {query && searchResults.length > 0 && (
          <div className="card" style={{
            position: 'absolute', top: '110%', left: 0, width: 400,
            zIndex: 50, maxHeight: 300, overflowY: 'auto',
          }}>
            {searchResults.map(u => (
              <a key={u._id} href={`/profile/${u.username}`} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', textDecoration: 'none',
                borderBottom: '1px solid var(--border)',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {u.avatar
                  ? <img src={u.avatar} alt={u.username} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700 }}>
                      {u.username?.[0]?.toUpperCase()}
                    </div>
                }
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{u.username}</div>
                  <div style={{ fontSize: 11, color: 'var(--text2)' }}>{u.name}</div>
                </div>
              </a>
            ))}
          </div>
        )}

        {query && !searching && searchResults.length === 0 && (
          <div className="card" style={{ position: 'absolute', top: '110%', left: 0, width: 400, zIndex: 50, padding: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>No users found for "{query}"</div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} style={{
            padding: '8px 18px', fontSize: 13, fontWeight: activeTab === i ? 600 : 400,
            color: activeTab === i ? 'var(--amber)' : 'var(--text2)',
            borderBottom: activeTab === i ? '2px solid var(--amber)' : '2px solid transparent',
            marginBottom: -1, transition: 'var(--transition)',
          }}>{t}</button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridAutoRows: 220, gap: 4 }}>
        {loading
          ? <SkeletonGrid />
          : explorePosts.length === 0
            ? <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0', color: 'var(--text2)' }}>
                No posts to explore yet.
              </div>
            : explorePosts.map((p, i) => <GridItem key={p._id || p.id || i} post={p} index={i} />)
        }
      </div>

      {!loading && hasMore && explorePosts.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn btn-ghost" onClick={loadMore}>Load more</button>
        </div>
      )}
    </div>
  );
}