import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CheckSquare, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(user.role === 'Admin' ? '/admin' : '/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'var(--bg)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: 'var(--accent-light)', fontSize: '1.5rem', fontWeight: 700 }}>
            <CheckSquare size={28} /> TaskFlow
          </div>
          <p style={{ color: 'var(--text-muted)', marginTop: 8, fontSize: '0.9rem' }}>Sign in to your workspace</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
            </div>
            <button className="btn btn-primary w-full" style={{ marginTop: 8, justifyContent: 'center' }} disabled={loading}>
              {loading ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Signing in…</> : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            No account? <Link to="/register" style={{ color: 'var(--accent-light)', textDecoration: 'none' }}>Create one</Link>
          </div>
        </div>

        <div style={{ marginTop: 20, padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text)' }}>Demo accounts</strong><br />
          Admin: admin@demo.com / admin123<br />
          User: user@demo.com / user123
        </div>
      </div>
    </div>
  );
}
