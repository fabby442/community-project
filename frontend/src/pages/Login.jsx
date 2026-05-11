import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, setToken, setMe } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    try {
      const data = await auth.login(form.email, form.password);
      // Backend should return { token, user }
      setToken(data.token);
      setMe(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)',
      backgroundImage: 'radial-gradient(ellipse 60% 60% at 50% 0%, rgba(232,160,48,0.08) 0%, transparent 70%)',
    }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }} className="animate-fadeUp">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--amber)', fontWeight: 600, letterSpacing: '-1px' }}>
            Lumina
          </h1>
          <p style={{ color: 'var(--text2)', marginTop: 6, fontSize: 14 }}>Share your world in golden light</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Sign in</h2>

          {error && (
            <div style={{
              background: 'rgba(224,85,85,0.12)', border: '1px solid rgba(224,85,85,0.3)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              color: 'var(--red)', fontSize: 13,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Email</label>
              <input className="input" type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} autoComplete="email" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>Password</label>
              <input className="input" type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} autoComplete="current-password" />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a href="#" style={{ fontSize: 12, color: 'var(--amber)' }}>Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', padding: '11px', marginTop: 4, fontSize: 14 }} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: 13 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--amber)', fontWeight: 500 }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}