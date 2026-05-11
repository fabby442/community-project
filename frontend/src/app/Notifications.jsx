import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notifications as notifApi, users as usersApi } from '../api';

const TYPE_ICON = {
  like:    { emoji: '❤️', color: 'var(--red)' },
  follow:  { emoji: '👤', color: 'var(--amber)' },
  comment: { emoji: '💬', color: '#4a9cf5' },
  mention: { emoji: '@',  color: 'var(--green)' },
};

function Skeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
      <div className="skeleton" style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: '65%', height: 12, borderRadius: 6, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: '30%', height: 10, borderRadius: 6 }} />
      </div>
    </div>
  );
}

function NotifRow({ n, last, onFollowChanged }) {
  const [following, setFollowing] = useState(n.sender?.isFollowing || false);
  const icon = TYPE_ICON[n.type] || TYPE_ICON.like;

  const toggleFollow = async () => {
    const prev = following;
    setFollowing(v => !v);
    try {
      await usersApi.toggleFollow(n.sender?._id);
      onFollowChanged?.();
    } catch {
      setFollowing(prev);
    }
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = (Date.now() - new Date(dateStr)) / 1000;
    if (diff < 60)    return `${Math.floor(diff)}s`;
    if (diff < 3600)  return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const sender = n.sender || {};
  const thumb  = n.post?.image || n.thumb;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderBottom: last ? 'none' : '1px solid var(--border)',
      background: n.read ? 'transparent' : 'rgba(232,160,48,0.04)',
      transition: 'background var(--transition)',
    }}>
      {/* Avatar + badge */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        {sender.avatar
          ? <img src={sender.avatar} alt={sender.username} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
          : <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', fontWeight: 700 }}>
              {sender.username?.[0]?.toUpperCase() || '?'}
            </div>
        }
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          width: 18, height: 18, borderRadius: '50%',
          background: icon.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, border: '2px solid var(--bg2)',
        }}>{icon.emoji}</div>
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13 }}>
          <Link to={`/profile/${sender.username}`} style={{ fontWeight: 600 }}>{sender.username}</Link>
          {' '}
          <span style={{ color: 'var(--text2)' }}>{n.message || n.text}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>{timeAgo(n.createdAt)}</div>
      </div>

      {/* Right action */}
      {n.type === 'follow' ? (
        <button onClick={toggleFollow} className={`btn ${following ? 'btn-ghost' : 'btn-primary'}`} style={{ padding: '6px 14px', fontSize: 12 }}>
          {following ? 'Following' : 'Follow'}
        </button>
      ) : thumb ? (
        <img src={thumb} alt="" style={{ width: 42, height: 42, objectFit: 'cover', borderRadius: 6 }} />
      ) : null}

      {/* Unread dot */}
      {!n.read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />}
    </div>
  );
}

export default function Notifications() {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    notifApi.getAll()
      .then(data => setNotifs(data?.notifications || data || []))
      .catch(err => setError(err.message || 'Failed to load notifications'))
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = async () => {
    setNotifs(n => n.map(x => ({ ...x, read: true })));
    try {
      await notifApi.markAllRead();
    } catch { /* silent */ }
  };

  const unreadCount = notifs.filter(n => !n.read).length;
  const unread = notifs.filter(n => !n.read);
  const read   = notifs.filter(n => n.read);

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600 }}>Notifications</h1>
          {unreadCount > 0 && <p style={{ fontSize: 12, color: 'var(--text2)', marginTop: 2 }}>{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ fontSize: 12, fontWeight: 600, color: 'var(--amber)' }}>
            Mark all read
          </button>
        )}
      </div>

      {loading && [1, 2, 3, 4].map(i => (
        <div key={i} className="card" style={{ marginBottom: 8, overflow: 'hidden' }}><Skeleton /></div>
      ))}

      {!loading && error && (
        <div style={{ color: 'var(--red)', fontSize: 13, padding: '20px 0' }}>{error}</div>
      )}

      {!loading && !error && notifs.length === 0 && (
        <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--text2)' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔔</div>
          <div style={{ fontSize: 14 }}>No notifications yet</div>
        </div>
      )}

      {!loading && unread.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>New</div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {unread.map((n, i) => (
              <NotifRow key={n._id || n.id} n={n} last={i === unread.length - 1} />
            ))}
          </div>
        </div>
      )}

      {!loading && read.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Earlier</div>
          <div className="card" style={{ overflow: 'hidden' }}>
            {read.map((n, i) => (
              <NotifRow key={n._id || n.id} n={n} last={i === read.length - 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}