import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, RefreshCw, Leaf, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { adminLogin } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => { 
      try {
        adminLogin(form.email, form.password);
        setLoading(false);
        navigate('/admin/dashboard');
      } catch (err) {
        setError(err.message || 'Invalid admin credentials');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-12 relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-brand-text font-semibold hover:text-brand-green transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-soft">
        <ArrowLeft className="w-4 h-4" /> Back to Website
      </Link>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-green-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-hover">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-text">Admin Portal</h1>
          <p className="text-brand-text-muted text-sm">SP MAPI — District Administration</p>
        </div>

        <div className="card p-8 shadow-hover">
          <h2 className="text-xl font-bold text-brand-text mb-1">Admin Login</h2>
          <p className="text-brand-text-muted text-sm mb-6">Use your admin credentials to sign in</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2 animate-fade-in">
                <span>⚠️</span> {error}
              </div>
            )}
            <div>
              <label className="label">Email Address or Admin ID</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input className="input pl-10" type="text" placeholder="admin or admin@spmapi.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input className="input pl-10" type="password" placeholder="••••••••" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Shield className="w-4 h-4" /> Sign In as Admin</>}
            </button>
          </form>

          <p className="text-center text-xs text-brand-text-muted mt-6">
            Credentials are assigned by Super Admin.
          </p>
          
          <div className="mt-6 pt-6 border-t border-brand-green-pale text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-green hover:underline">
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
