import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw, Lock, Mail, Crown, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function SuperAdminLoginPage() {
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const navigate             = useNavigate();
  const { adminLogin }       = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await adminLogin(form.email, form.password);
      if (user.role === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else {
        setError('Access denied. This portal is for Super Admins only.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-12">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-brand-text font-semibold hover:text-brand-green transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-soft">
        <ArrowLeft className="w-4 h-4" /> Back to Website
      </Link>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-green-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-hover">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-text">Super Admin</h1>
          <p className="text-brand-text-muted text-sm">SP MAPI — Platform Control Center</p>
        </div>
        <div className="card p-8 shadow-hover border-2 border-brand-green-light">
          <h2 className="text-xl font-bold text-brand-text mb-6">Super Admin Login</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input className="input pl-10" type="email" placeholder="superadmin@spmapi.co.in" required
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input className="input pl-10" type="password" placeholder="••••••••" required
                  value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Crown className="w-4 h-4" /> Sign In</>}
            </button>
          </form>
          <p className="text-center text-xs text-red-400 mt-4 flex items-center justify-center gap-1">🔒 Restricted access — Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
}
