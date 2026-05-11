import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// FIXED IMPORT PATH
import { auth, removeToken, removeMe, getMe } from '../api';

const NAV = [
  { to: '/',              icon: 'home',           label: 'Home' },
  { to: '/explore',       icon: 'grid',           label: 'Explore' },
  { to: '/stories',       icon: 'play-circle',    label: 'Stories' },
  { to: '/messages',      icon: 'message-circle', label: 'Messages' },
  { to: '/notifications', icon: 'bell',           label: 'Notifications' },
  { to: '/profile',       icon: 'user',           label: 'Profile' },
];

function Icon({ name }) {
  const icons = {
    home: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),

    grid: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),

    'play-circle': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="10 8 16 12 10 16 10 8"/>
      </svg>
    ),

    'message-circle': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),

    bell: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),

    user: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),

    logout: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),

    menu: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    ),
  };

  return (
    <span
      style={{
        width: 20,
        height: 20,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {icons[name]}
    </span>
  );
}

export { Icon };

export default function AppLayout() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  const me = getMe();

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (err) {
      console.error(err);
    }

    removeToken();
    removeMe();

    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{
          width: 240,
          flexShrink: 0,
          background: 'var(--bg2)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 100,
          overflowY: 'auto',
          transition: 'transform 0.25s ease',
          transform: mobileOpen ? 'translateX(0)' : undefined,
        }}
      >
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px' }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: '-0.5px',
              color: 'var(--amber)',
            }}
          >
            Lumina
          </span>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 10,
                marginBottom: 2,
                color: isActive ? 'var(--amber)' : 'var(--text2)',
                background: isActive
                  ? 'var(--amber-glow)'
                  : 'transparent',
                fontWeight: isActive ? 500 : 400,
                transition: 'var(--transition)',
                textDecoration: 'none',
              })}
            >
              <Icon name={icon} />

              <span style={{ fontSize: 14 }}>
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div
          style={{
            padding: '16px 12px 24px',
            borderTop: '1px solid var(--border)',
          }}
        >
          {me && (
            <NavLink
              to="/profile"
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  borderRadius: 10,
                  background: 'var(--bg3)',
                  marginBottom: 8,
                }}
              >
                <div className="avatar-ring">
                  {me.avatar ? (
                    <img
                      src={me.avatar}
                      alt={me.username}
                      style={{
                        width: 32,
                        height: 32,
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'var(--amber)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#111',
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      {me.username?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>

                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'var(--text)',
                    }}
                  >
                    {me.name || me.username}
                  </div>

                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text2)',
                    }}
                  >
                    @{me.username}
                  </div>
                </div>
              </div>
            </NavLink>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              color: 'var(--text2)',
              fontSize: 13,
              transition: 'var(--transition)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <Icon name="logout" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 99,
          }}
        />
      )}

      {/* Mobile Top Bar */}
      <div
        className="mobile-bar"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 98,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            color: 'var(--amber)',
          }}
        >
          Lumina
        </span>

        <button
          onClick={() => setMobileOpen(v => !v)}
          style={{
            color: 'var(--text)',
            width: 20,
            height: 20,
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Icon name="menu" />
        </button>
      </div>

      {/* Main */}
      <main
        style={{
          marginLeft: 240,
          flex: 1,
          minHeight: '100vh',
          background: 'var(--bg)',
        }}
      >
        <Outlet />
      </main>

      <style>{`
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }

          .mobile-bar {
            display: flex !important;
          }

          main {
            margin-left: 0 !important;
            padding-top: 56px;
          }
        }
      `}</style>
    </div>
  );
}