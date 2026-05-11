import { useState, useEffect, useRef } from 'react';
import { messages as messagesApi, getMe, getThreadId } from '../api';

// ─── Firebase imports (install: npm install firebase) ────────────────────────
// Uncomment and configure once you have Firebase set up:
//
// import { initializeApp, getApps } from 'firebase/app';
// import { getDatabase, ref, push, onValue, serverTimestamp, query, limitToLast } from 'firebase/database';
//
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
// };
// const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
// const db  = getDatabase(app);
// ─────────────────────────────────────────────────────────────────────────────

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function ConvSkeleton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
      <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ width: '60%', height: 12, borderRadius: 6, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: '80%', height: 10, borderRadius: 6 }} />
      </div>
    </div>
  );
}

export default function Messages() {
  const me = getMe();
  const [conversations, setConversations] = useState([]);
  const [active, setActive]   = useState(null);
  const [thread, setThread]   = useState([]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [search, setSearch]   = useState('');
  const bottomRef = useRef(null);

  // ── Load conversations list ───────────────────────────────────────────────
  useEffect(() => {
    messagesApi.getConversations()
      .then(data => {
        const convs = data?.conversations || data || [];
        setConversations(convs);
        if (convs.length > 0) setActive(convs[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Load thread when active conversation changes ──────────────────────────
  useEffect(() => {
    if (!active) return;
    const otherUser = active.user || active.otherUser || active;

    // ── Option A: Firebase Realtime (uncomment when configured) ──────────────
    // const threadId = getThreadId(me._id, otherUser._id);
    // const threadRef = query(ref(db, `threads/${threadId}`), limitToLast(50));
    // const unsub = onValue(threadRef, snap => {
    //   const msgs = [];
    //   snap.forEach(child => msgs.push({ id: child.key, ...child.val() }));
    //   setThread(msgs);
    // });
    // Mark read
    // messagesApi.markRead(otherUser._id).catch(() => {});
    // return () => unsub();

    // ── Option B: REST fallback ───────────────────────────────────────────────
    messagesApi.getThread(otherUser._id)
      .then(data => setThread(data?.messages || data || []))
      .catch(console.error);
    messagesApi.markRead(otherUser._id).catch(() => {});
  }, [active]);

  // Scroll to bottom when thread updates
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  const sendMsg = async () => {
    if (!input.trim() || !active || sending) return;
    const otherUser = active.user || active.otherUser || active;
    const text = input.trim();
    setInput('');
    setSending(true);

    // Optimistic add
    const optimistic = {
      id: `opt_${Date.now()}`,
      senderId: me?._id,
      from: 'me',
      text,
      createdAt: new Date().toISOString(),
    };
    setThread(t => [...t, optimistic]);

    try {
      // ── Firebase send (uncomment when configured) ─────────────────────────
      // const threadId = getThreadId(me._id, otherUser._id);
      // await push(ref(db, `threads/${threadId}`), {
      //   senderId: me._id,
      //   text,
      //   createdAt: serverTimestamp(),
      // });

      // ── REST fallback ─────────────────────────────────────────────────────
      const saved = await messagesApi.send(otherUser._id, text);
      setThread(t => t.map(m => m.id === optimistic.id ? { ...saved, id: saved._id } : m));

      // Update last message in sidebar
      setConversations(cs => cs.map(c =>
        (c.user?._id || c._id) === (otherUser._id)
          ? { ...c, lastMessage: { text, createdAt: new Date().toISOString() } }
          : c
      ));
    } catch (err) {
      // Remove optimistic on failure
      setThread(t => t.filter(m => m.id !== optimistic.id));
      setInput(text);
    } finally {
      setSending(false);
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

  const filteredConvs = conversations.filter(c => {
    const u = c.user || c.otherUser || c;
    return u.username?.toLowerCase().includes(search.toLowerCase());
  });

  const activeUser = active ? (active.user || active.otherUser || active) : null;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Inbox sidebar */}
      <div style={{ width: 300, flexShrink: 0, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg2)' }}>
        <div style={{ padding: '20px 20px 14px', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Messages</h2>
        </div>
        <div style={{ padding: '12px 12px 0' }}>
          <input className="input" placeholder="Search messages…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ marginBottom: 8 }} />
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {loading
            ? [1, 2, 3].map(i => <ConvSkeleton key={i} />)
            : filteredConvs.length === 0
              ? <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>
                  No conversations yet.
                </div>
              : filteredConvs.map(c => {
                  const u = c.user || c.otherUser || c;
                  const lastMsg = c.lastMessage || c.lastMsg || {};
                  const unread  = c.unreadCount || 0;
                  const isActive = activeUser?._id === u._id;

                  return (
                    <div key={u._id || u.id} onClick={() => setActive(c)} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', cursor: 'pointer',
                      background: isActive ? 'var(--amber-glow)' : 'transparent',
                      borderLeft: isActive ? '2px solid var(--amber)' : '2px solid transparent',
                      transition: 'var(--transition)',
                    }}>
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        {u.avatar
                          ? <img src={u.avatar} alt={u.username} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                          : <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700, fontSize: 18 }}>
                              {u.username?.[0]?.toUpperCase()}
                            </div>
                        }
                        {u.isOnline && (
                          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, background: 'var(--green)', borderRadius: '50%', border: '2px solid var(--bg2)' }} />
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: unread ? 600 : 400 }}>{u.username}</span>
                          <span style={{ fontSize: 11, color: 'var(--text2)' }}>{timeAgo(lastMsg.createdAt)}</span>
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--text2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lastMsg.text || 'Start a conversation'}
                        </div>
                      </div>
                      {unread > 0 && (
                        <div style={{ width: 18, height: 18, background: 'var(--amber)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#111', flexShrink: 0 }}>
                          {unread}
                        </div>
                      )}
                    </div>
                  );
                })
          }
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        {!active
          ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text2)' }}>
              <div style={{ fontSize: 40 }}>💬</div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>Your messages</div>
              <div style={{ fontSize: 13 }}>Select a conversation to start chatting</div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, background: 'var(--bg2)' }}>
                {activeUser?.avatar
                  ? <img src={activeUser.avatar} alt={activeUser.username} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111', fontWeight: 700, fontSize: 16 }}>
                      {activeUser?.username?.[0]?.toUpperCase()}
                    </div>
                }
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{activeUser?.username}</div>
                  {activeUser?.isOnline && <div style={{ fontSize: 11, color: 'var(--green)' }}>● Active now</div>}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {thread.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text2)', fontSize: 13, marginTop: 40 }}>
                    No messages yet. Say hello! 👋
                  </div>
                )}
                {thread.map(msg => {
                  const isMe = msg.senderId === me?._id || msg.from === 'me';
                  return (
                    <div key={msg._id || msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '68%', padding: '10px 14px', borderRadius: 18,
                        background: isMe ? 'var(--amber)' : 'var(--bg3)',
                        color: isMe ? '#111' : 'var(--text)',
                        fontSize: 13, lineHeight: 1.5,
                        borderBottomRightRadius: isMe ? 4 : 18,
                        borderBottomLeftRadius: isMe ? 18 : 4,
                      }}>
                        {msg.text}
                        <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  className="input"
                  placeholder={`Message ${activeUser?.username}…`}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMsg()}
                  style={{ flex: 1 }}
                />
                <button onClick={sendMsg} className="btn btn-primary" style={{ padding: '10px 14px' }} disabled={!input.trim() || sending}>
                  <SendIcon />
                </button>
              </div>
            </>
          )
        }
      </div>
    </div>
  );
}