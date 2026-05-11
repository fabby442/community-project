import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { users as usersApi, getMe } from '../api';

const TABS = ['Posts', 'Saved', 'Tagged'];

function EditModal({ profile, onClose, onSave }) {
  const [form, setForm]     = useState({ name: profile.name || '', bio: profile.bio || '', website: profile.website || '' });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(profile.avatar || null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setAvatar(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('bio', form.bio);
      fd.append('website', form.website);
      if (avatar) fd.append('avatar', avatar);
      const updated = await usersApi.updateProfile(fd);
      onSave(updated.user || updated);
    } catch (err) {
      setError(err.message || 'Failed to save.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div className="card" style={{ width: 460, padding: 32, animation: 'fadeUp 0.2s ease' }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Edit profile</h2>

        {error && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{error}</div>}

        {/* Avatar upload */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <label style={{ cursor: 'pointer' }}>
            {preview
              ? <img src={preview} alt="avatar" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }} />
              : <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text2)', fontSize: 12 }}>Photo</div>
            }
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
          </label>
          <div style={{ fontSize: 13, color: 'var(--text2)' }}>Click photo to change avatar</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'name',    label: 'Display name', placeholder: 'Your Name' },
            { key: 'website', label: 'Website',       placeholder: 'yoursite.com' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{f.label}</label>
              <input className="input" placeholder={f.placeholder} value={form[f.key]}
                onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Bio</label>
            <textarea className="input" rows={3} value={form.bio}
              onChange={e => setForm(v => ({ ...v, bio: e.target.value }))} style={{ resize: 'vertical' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', gap: 48, marginBottom: 40 }}>
        <div className="skeleton" style={{ width: 110, height: 110, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ width: 160, height: 20, borderRadius: 8, marginBottom: 16 }} />
          <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ width: 60, height: 36, borderRadius: 8 }} />)}
          </div>
          <div className="skeleton" style={{ width: '60%', height: 14, borderRadius: 6 }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ aspectRatio: '1' }} />
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const { username } = useParams();
  const me = getMe();
  const isMe = !username || username === me?.username;

  const [profile, setProfile]     = useState(null);
  const [posts, setPosts]         = useState([]);
  const [savedPosts, setSaved]    = useState([]);
  const [followed, setFollowed]   = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [editing, setEditing]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  useEffect(() => {
    const target = username || me?.username;
    if (!target) return;
    setLoading(true);

    Promise.all([
      usersApi.getProfile(target),
      usersApi.getPosts(target),
    ])
      .then(([prof, postsData]) => {
        const p = prof.user || prof;
        setProfile(p);
        setFollowed(p.isFollowing || false);
        setPosts(postsData.posts || postsData || []);
      })
      .catch(err => setError(err.message || 'Could not load profile'))
      .finally(() => setLoading(false));
  }, [username, me?.username]);

  // Load saved posts when tab switches to Saved (only for own profile)
  useEffect(() => {
    if (activeTab === 1 && isMe && savedPosts.length === 0) {
      usersApi.getSaved()
        .then(d => setSaved(d?.posts || d || []))
        .catch(() => {});
    }
  }, [activeTab, isMe]);

  const handleSave = (updated) => {
    setProfile(p => ({ ...p, ...updated }));
    // Update sidebar user data
    const stored = JSON.parse(localStorage.getItem('auth_user') || '{}');
    localStorage.setItem('auth_user', JSON.stringify({ ...stored, ...updated }));
    setEditing(false);
  };

  const toggleFollow = async () => {
    const prev = followed;
    setFollowed(v => !v);
    setProfile(p => ({ ...p, followersCount: followed ? p.followersCount - 1 : p.followersCount + 1 }));
    try {
      await usersApi.toggleFollow(profile._id);
    } catch {
      setFollowed(prev);
      setProfile(p => ({ ...p, followersCount: prev ? p.followersCount + 1 : p.followersCount - 1 }));
    }
  };

  const fmt = n => {
    if (!n && n !== 0) return '0';
    return n >= 1000 ? (n / 1000).toFixed(1) + 'k' : n;
  };

  if (loading) return <ProfileSkeleton />;
  if (error)   return <div style={{ padding: 40, color: 'var(--red)', textAlign: 'center' }}>{error}</div>;
  if (!profile) return null;

  const displayPosts = activeTab === 1 && isMe ? savedPosts : posts;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>
      {editing && <EditModal profile={profile} onClose={() => setEditing(false)} onSave={handleSave} />}

      {/* Profile header */}
      <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap' }}>
        <div className="avatar-ring" style={{ padding: 3, flexShrink: 0 }}>
          {profile.avatar
            ? <img src={profile.avatar} alt={profile.username}
                style={{ width: 110, height: 110, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--bg)' }} />
            : <div style={{ width: 110, height: 110, borderRadius: '50%', border: '3px solid var(--bg)', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700, fontSize: 36 }}>
                {profile.username?.[0]?.toUpperCase()}
              </div>
          }
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
            <span style={{ fontSize: 22, fontWeight: 400 }}>{profile.username}</span>
            {profile.verified && <span style={{ color: 'var(--amber)', fontSize: 16 }}>✦</span>}
            {isMe ? (
              <button className="btn btn-ghost" onClick={() => setEditing(true)} style={{ fontSize: 13 }}>Edit profile</button>
            ) : (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={toggleFollow} className={`btn ${followed ? 'btn-ghost' : 'btn-primary'}`} style={{ fontSize: 13 }}>
                  {followed ? 'Following' : 'Follow'}
                </button>
                <Link to="/messages" className="btn btn-ghost" style={{ fontSize: 13 }}>Message</Link>
              </div>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 32, marginBottom: 16 }}>
            {[
              { label: 'posts',     value: fmt(profile.postsCount     || profile.posts     || 0) },
              { label: 'followers', value: fmt(profile.followersCount || profile.followers || 0) },
              { label: 'following', value: fmt(profile.followingCount || profile.following || 0) },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 700 }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--text2)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Bio */}
          {profile.name && <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{profile.name}</div>}
          {profile.bio && (
            <div style={{ fontSize: 13, color: 'var(--text2)', maxWidth: 380, lineHeight: 1.6, whiteSpace: 'pre-line' }}>{profile.bio}</div>
          )}
          {profile.website && (
            <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
              target="_blank" rel="noreferrer"
              style={{ fontSize: 13, color: 'var(--amber)', fontWeight: 500, marginTop: 4, display: 'block' }}>
              {profile.website}
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderTop: '1px solid var(--border)', marginBottom: 4 }}>
        {(isMe ? TABS : TABS.filter(t => t !== 'Saved')).map((t, i) => (
          <button key={t} onClick={() => setActiveTab(i)} style={{
            flex: 1, padding: '12px 0', fontSize: 12, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: activeTab === i ? 'var(--text)' : 'var(--text3)',
            borderTop: activeTab === i ? '2px solid var(--text)' : '2px solid transparent',
            marginTop: -1, transition: 'var(--transition)',
          }}>{t}</button>
        ))}
      </div>

      {/* Grid */}
      {displayPosts.length === 0
        ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text2)', fontSize: 14 }}>
            {activeTab === 1 ? 'No saved posts yet.' : isMe ? 'Share your first photo.' : 'No posts yet.'}
          </div>
        )
        : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 3 }}>
            {displayPosts.map((p, i) => (
              <div key={p._id || p.id || i}
                style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--bg3)', cursor: 'pointer', position: 'relative' }}
                onMouseEnter={e => e.currentTarget.querySelector('img')?.style && (e.currentTarget.querySelector('img').style.transform = 'scale(1.06)')}
                onMouseLeave={e => e.currentTarget.querySelector('img')?.style && (e.currentTarget.querySelector('img').style.transform = 'scale(1)')}
              >
                {p.image
                  ? <img src={p.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s ease' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text3)', fontSize: 24 }}>📷</div>
                }
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
}