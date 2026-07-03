import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, User, MapPin, Lock, ChevronRight, ChevronLeft, CheckCircle2, Eye, EyeOff, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const STEPS = ['Personal Info', 'Location Details', 'Security'];

export default function CustomerRegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [form, setForm] = useState({
    name: '', fatherName: '', mobile: '', email: '',
    state: 'Bihar', district: '', block: '', village: '',
    wardNumber: '', panchayat: '', mouza: '', policeStation: '',
    pincode: '', address: '',
    password: '', confirmPassword: '',
  });

  useEffect(() => {
    api.get('/applications/public/districts').then(res => {
      setDistricts(res.data.districts || []);
    }).catch(() => {});
  }, []);

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  // Validation per step
  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!form.name.trim()) return 'Full name is required.';
      if (!form.mobile.trim() || form.mobile.length !== 10) return 'Valid 10-digit mobile number is required.';
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) return 'Invalid email format.';
    }
    if (step === 2) {
      if (!form.state) return 'State is required.';
      if (!form.district) return 'District is required.';
    }
    if (step === 3) {
      if (!form.password || form.password.length < 6) return 'Password must be at least 6 characters.';
      if (form.password !== form.confirmPassword) return 'Passwords do not match.';
      if (!acceptTerms) return 'You must accept the Terms & Conditions.';
    }
    return null;
  };

  const handleNext = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setStep(s => s + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      await register({
        name: form.name, fatherName: form.fatherName,
        mobile: form.mobile, email: form.email || undefined,
        password: form.password,
        state: form.state, district: form.district,
        block: form.block, village: form.village,
        wardNumber: form.wardNumber, panchayat: form.panchayat,
        mouza: form.mouza, policeStation: form.policeStation,
        pincode: form.pincode, address: form.address,
      });
      navigate('/customer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stateDistricts = districts.filter(d => d.state === form.state);

  return (
    <div className="min-h-screen flex bg-brand-cream animate-fade-in relative">
      <Link to="/" className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-sm text-brand-text font-semibold hover:text-brand-green transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-soft z-50 border border-gray-100">
        <ArrowLeft className="w-4 h-4" /> Back to Website
      </Link>
      {/* Left: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-lg">
          <div className="mb-6">
            <Link to="/" className="flex items-center gap-2 text-brand-green font-bold text-xl mb-4">
              <Leaf className="w-7 h-7" /> SP MAPI
            </Link>
            <h1 className="text-2xl font-bold text-brand-text">Create Your Account</h1>
            <p className="text-brand-text-muted text-sm mt-1">Register to apply for land survey services</p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            {STEPS.map((label, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                  step > i + 1 ? 'bg-brand-green text-white' :
                  step === i + 1 ? 'bg-brand-green text-white ring-4 ring-brand-green/20' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${step >= i + 1 ? 'text-brand-green' : 'text-gray-400'}`}>{label}</span>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-brand-green' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Personal Info */}
            {step === 1 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input className="input pl-10" placeholder="Enter full name" required value={form.name} onChange={set('name')} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Father / Husband Name</label>
                    <input className="input" placeholder="Father or husband name" value={form.fatherName} onChange={set('fatherName')} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Mobile Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input className="input pl-10" placeholder="10-digit mobile" maxLength={10} required value={form.mobile} onChange={set('mobile')} />
                    </div>
                  </div>
                  <div>
                    <label className="label">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input className="input pl-10" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location Details */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">State *</label>
                    <select className="input" value={form.state} onChange={set('state')}>
                      <option value="Bihar">Bihar</option>
                      <option value="Jharkhand">Jharkhand</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">District *</label>
                    <select className="input" value={form.district} onChange={set('district')}>
                      <option value="">-- Select District --</option>
                      {stateDistricts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className="label">Block</label><input className="input" placeholder="Block name" value={form.block} onChange={set('block')} /></div>
                  <div><label className="label">Village</label><input className="input" placeholder="Village name" value={form.village} onChange={set('village')} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="label">Panchayat</label><input className="input" placeholder="Panchayat" value={form.panchayat} onChange={set('panchayat')} /></div>
                  <div><label className="label">Ward Number</label><input className="input" placeholder="Ward no." value={form.wardNumber} onChange={set('wardNumber')} /></div>
                  <div><label className="label">Mouza</label><input className="input" placeholder="Mouza" value={form.mouza} onChange={set('mouza')} /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div><label className="label">Police Station (Thana)</label><input className="input" placeholder="Thana" value={form.policeStation} onChange={set('policeStation')} /></div>
                  <div><label className="label">PIN Code</label><input className="input" placeholder="PIN" maxLength={6} value={form.pincode} onChange={set('pincode')} /></div>
                </div>
                <div>
                  <label className="label">Full Address</label>
                  <textarea className="input min-h-[70px]" placeholder="Complete address..." value={form.address} onChange={set('address')} />
                </div>
              </div>
            )}

            {/* Step 3: Security */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-in">
                <div>
                  <label className="label">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input className="input pl-10 pr-10" type={showPwd ? 'text' : 'password'} placeholder="Min 6 characters" required value={form.password} onChange={set('password')} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-green">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="label">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input className="input pl-10" type="password" placeholder="Re-enter password" required value={form.confirmPassword} onChange={set('confirmPassword')} />
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>
                <label className="flex items-start gap-3 p-3 bg-brand-green-pale/30 rounded-xl cursor-pointer border border-brand-green-pale">
                  <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-0.5 accent-brand-green" />
                  <span className="text-sm text-brand-text">
                    I accept the <a href="#" className="text-brand-green font-medium underline">Terms & Conditions</a> and <a href="#" className="text-brand-green font-medium underline">Privacy Policy</a>
                  </span>
                </label>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <button type="button" onClick={() => { setStep(s => s - 1); setError(''); }} className="btn-outline flex-1 justify-center">
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="btn-primary flex-1 justify-center">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Creating Account...</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" /> Create Account</>
                  )}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-sm text-brand-text-muted mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-green font-semibold hover:underline">Login here</Link>
          </p>
        </div>
      </div>

      {/* Right: Visual Side */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-green via-emerald-600 to-teal-700 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 border-2 border-white rounded-full" />
          <div className="absolute bottom-32 right-16 w-56 h-56 border-2 border-white rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-white rounded-full" />
        </div>
        <div className="text-center text-white z-10 max-w-md">
          <Leaf className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl font-bold mb-4">SP MAPI</h2>
          <p className="text-lg opacity-90 mb-6">Land Survey & Property Management System</p>
          <div className="space-y-3 text-left">
            {[
              'Apply for Mapi, Batwara, Map & Tools',
              'Track your applications in real-time',
              'Download survey reports & maps',
              'Manage all documents in one place'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
