import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, setToken, setMe } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ name: '', username: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.username || !form.email || !form.password) {
      setError('All fields are required.'); return;
    }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const data = await auth.register(form.name, form.username, form.email, form.password);
      // Backend should return { token, user }
      setToken(data.token);
      setMe(data.user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.');
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
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px' }} className="animate-fadeUp">
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 42, color: 'var(--amber)', fontWeight: 600, letterSpacing: '-1px' }}>Lumina</h1>
          <p style={{ color: 'var(--text2)', marginTop: 6, fontSize: 14 }}>Join millions sharing their stories</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Create account</h2>

          {error && (
            <div style={{
              background: 'rgba(224,85,85,0.12)', border: '1px solid rgba(224,85,85,0.3)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              color: 'var(--red)', fontSize: 13,
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { name: 'name',     label: 'Full name',  type: 'text',     placeholder: 'Jane Doe' },
              { name: 'username', label: 'Username',   type: 'text',     placeholder: 'janedoe' },
              { name: 'email',    label: 'Email',      type: 'email',    placeholder: 'jane@example.com' },
              { name: 'password', label: 'Password',   type: 'password', placeholder: '••••••••' },
            ].map(f => (
              <div key={f.name}>
                <label style={{ fontSize: 12, color: 'var(--text2)', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input className="input" {...f} value={form[f.name]} onChange={handleChange} autoComplete={f.name} />
              </div>
            ))}

            <button type="submit" className="btn btn-primary"
              style={{ width: '100%', padding: '11px', marginTop: 4, fontSize: 14 }} disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center', marginTop: 16 }}>
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, color: 'var(--text2)', fontSize: 13 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--amber)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}