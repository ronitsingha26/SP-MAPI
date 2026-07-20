import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw, Lock, Phone, Compass, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { aminLogin } = useAuth();

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await aminLogin(form.email, form.password);
      navigate('/amin/dashboard');
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
          <div className="w-14 h-14 bg-yellow-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-hover">
            <Compass className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-brand-text">Amin Portal</h1>
          <p className="text-brand-text-muted text-sm">SP MAPI — Field Surveyor Dashboard</p>
        </div>
        <div className="card p-8 shadow-hover">
          <h2 className="text-xl font-bold text-brand-text mb-1">Amin Login</h2>
          <p className="text-brand-text-muted text-sm mb-6">Sign in with your Amin credentials</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input className="input pl-10" type="email" placeholder="youremail@example.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input className="input pl-10" type="password" placeholder="••••••••" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-secondary w-full justify-center disabled:opacity-50">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Compass className="w-4 h-4" /> Sign In as Amin</>}
            </button>
          </form>

          <p className="text-center text-sm text-brand-text-muted mt-6 border-t border-gray-100 pt-4">
            Want to join our team?{' '}
            <Link to="/apply-amin" className="text-yellow-600 font-semibold hover:underline">Apply as Amin</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
