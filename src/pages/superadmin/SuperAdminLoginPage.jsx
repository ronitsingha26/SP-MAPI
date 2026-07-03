import { useNavigate } from 'react-router-dom';
import { RefreshCw, Lock, Mail, Crown } from 'lucide-react';
import { useState } from 'react';

export default function SuperAdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handle = (e) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); navigate('/superadmin/dashboard'); }, 1500); };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-12">
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
          <form onSubmit={handle} className="space-y-5">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input className="input pl-10" type="email" placeholder="superadmin@spmapi.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
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
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Crown className="w-4 h-4" /> Sign In</>}
            </button>
          </form>
          <p className="text-center text-xs text-red-400 mt-4 flex items-center justify-center gap-1">🔒 Restricted access — Authorized personnel only</p>
        </div>
      </div>
    </div>
  );
}
