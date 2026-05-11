import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { stories as storiesApi, getMe } from '../api';

const DURATION = 5000;

export default function Stories() {
  const navigate = useNavigate();
  const me = getMe();

  const [storyGroups, setStoryGroups] = useState([]);  // [{ user, slides: [{ _id, image, caption }] }]
  const [loading, setLoading]         = useState(true);
  const [storyIdx, setStoryIdx]       = useState(0);
  const [slideIdx, setSlideIdx]       = useState(0);
  const [paused, setPaused]           = useState(false);
  const [progress, setProgress]       = useState(0);
  const rafRef   = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    storiesApi.getFeed()
      .then(data => {
        // Backend returns an array of story groups, each with { user, stories/slides: [] }
        const groups = (data || []).map(g => ({
          user:   g.user   || g,
          slides: g.stories || g.slides || [g],
        })).filter(g => g.slides.length > 0);
        setStoryGroups(groups);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const story = storyGroups[storyIdx];
  const slide = story?.slides?.[slideIdx];

  const goNext = () => {
    if (!story) return;
    if (slideIdx < story.slides.length - 1) {
      setSlideIdx(s => s + 1); setProgress(0);
    } else if (storyIdx < storyGroups.length - 1) {
      setStoryIdx(s => s + 1); setSlideIdx(0); setProgress(0);
    } else {
      navigate('/');
    }
  };

  const goPrev = () => {
    if (slideIdx > 0) { setSlideIdx(s => s - 1); setProgress(0); }
    else if (storyIdx > 0) { setStoryIdx(s => s - 1); setSlideIdx(0); setProgress(0); }
  };

  // Mark story viewed
  useEffect(() => {
    if (slide?._id) {
      storiesApi.markViewed(slide._id).catch(() => {});
    }
  }, [slide?._id]);

  // Progress animation
  useEffect(() => {
    if (paused || !slide) return;
    setProgress(0);
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        goNext();
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [storyIdx, slideIdx, paused, slide]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', color: '#fff', fontSize: 14 }}>
        Loading stories…
      </div>
    );
  }

  if (storyGroups.length === 0) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#111', color: '#fff', gap: 16 }}>
        <div style={{ fontSize: 40 }}>📷</div>
        <div style={{ fontSize: 16, fontWeight: 500 }}>No stories yet</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Follow people to see their stories here</div>
        <button onClick={() => navigate('/')} style={{ marginTop: 8, padding: '10px 24px', borderRadius: 8, background: 'var(--amber)', color: '#111', fontWeight: 600, fontSize: 14 }}>
          Back to feed
        </button>
      </div>
    );
  }

  const storyUser = story?.user || {};

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Story image */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 400, height: '100%', maxHeight: 800, overflow: 'hidden' }}>
        {slide?.image && (
          <img src={slide.image} alt={slide.caption || ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        )}

        {/* Overlay top gradient */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 160, background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />

        {/* Progress bars */}
        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', gap: 4 }}>
          {story?.slides.map((_, i) => (
            <div key={i} style={{ flex: 1, height: 2, background: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: '#fff', borderRadius: 2,
                width: i < slideIdx ? '100%' : i === slideIdx ? `${progress}%` : '0%',
                transition: i === slideIdx ? 'none' : 'none',
              }} />
            </div>
          ))}
        </div>

        {/* User info */}
        <div style={{ position: 'absolute', top: 24, left: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          {storyUser.avatar
            ? <img src={storyUser.avatar} alt={storyUser.username} style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }} />
            : <div style={{ width: 38, height: 38, borderRadius: '50%', border: '2px solid #fff', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700, fontSize: 16 }}>
                {storyUser.username?.[0]?.toUpperCase()}
              </div>
          }
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{storyUser.username}</div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
              {slide?.createdAt ? new Date(slide.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </div>
          </div>
        </div>

        {/* Close */}
        <button onClick={() => navigate('/')} style={{
          position: 'absolute', top: 24, right: 16, color: '#fff', fontSize: 22, width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>✕</button>

        {/* Caption */}
        {slide?.caption && (
          <div style={{ position: 'absolute', bottom: 30, left: 16, right: 16, color: '#fff', fontSize: 15, fontWeight: 500, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            {slide.caption}
          </div>
        )}

        {/* Story group dots */}
        {storyGroups.length > 1 && (
          <div style={{ position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {storyGroups.map((g, i) => (
              <button key={i} onClick={() => { setStoryIdx(i); setSlideIdx(0); setProgress(0); }} style={{
                width: i === storyIdx ? 20 : 6, height: 6, borderRadius: 3,
                background: i === storyIdx ? '#fff' : 'rgba(255,255,255,0.4)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>
        )}

        {/* Tap zones */}
        <div onClick={goPrev} style={{ position: 'absolute', left: 0, top: 0, width: '35%', height: '100%', cursor: 'pointer' }} />
        <div onClick={goNext} style={{ position: 'absolute', right: 0, top: 0, width: '35%', height: '100%', cursor: 'pointer' }} />
      </div>
    </div>
  );
}