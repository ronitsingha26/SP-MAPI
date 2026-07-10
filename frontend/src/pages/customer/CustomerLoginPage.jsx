import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Phone, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, Leaf, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function CustomerLoginPage() {
  const [showPwd, setShowPwd]         = useState(false);
  const [loginField, setLoginField]   = useState('');    // mobile or email
  const [password, setPassword]       = useState('');
  const [error, setError]             = useState('');
  const [loading, setLoading]         = useState(false);
  const navigate                       = useNavigate();
  const [searchParams]                 = useSearchParams();
  const { login }                      = useAuth();
  const { t }                          = useLanguage();
  const redirectTo                     = searchParams.get('redirect') || '/customer/dashboard';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginField || !password) {
      setError('Please enter your mobile/email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(loginField, password);
      navigate(redirectTo);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-brand-cream animate-fade-in relative">
      <Link to="/" className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-sm text-brand-text font-semibold hover:text-brand-green transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-soft z-50 border border-gray-100">
        <ArrowLeft className="w-4 h-4" /> Back to Website
      </Link>
      {/* Left Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-brand-text mb-2 flex items-center gap-2">
              <Leaf className="w-8 h-8 text-brand-green" /> Welcome Back!
            </h1>
            <p className="text-brand-text-muted">Login to track your applications and documents.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
                <span className="text-lg leading-none">⚠️</span> {error}
              </div>
            )}

            <div>
              <label className="label">Mobile Number or Email</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
                <input
                  type="text"
                  required
                  placeholder="10-digit mobile or email"
                  className="input pl-12"
                  value={loginField}
                  onChange={(e) => setLoginField(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-sm font-semibold text-brand-green hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  className="input pl-12 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green"
                >
                  {showPwd ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-brand-text-muted mt-8 flex flex-col gap-2">
            <span>
              Don't have an account?{' '}
              <Link to="/register" className="text-brand-green font-semibold hover:underline">Register as Customer</Link>
            </span>
            <span>
              Want to join our team?{' '}
              <Link to="/apply-amin" className="text-brand-green font-semibold hover:underline">Apply as Amin</Link>
            </span>
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex w-1/2 bg-green-gradient p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 border-4 border-white rounded-full" />
          <div className="absolute bottom-10 right-10 w-60 h-60 border-4 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-80 h-80 border-4 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative z-10 max-w-lg text-white">
          <h2 className="text-4xl font-bold mb-6 leading-tight">Your Trusted Land Measurement Partner</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Track Applications</h3>
                <p className="text-brand-green-pale">Easily monitor the status of your Mapi and Bantwara requests.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Secure Documents</h3>
                <p className="text-brand-green-pale">Access and download your digital maps and land documents securely.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
