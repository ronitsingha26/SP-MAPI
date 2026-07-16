import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Upload, CheckCircle2, FileText, Leaf, Lock, Eye, EyeOff, LogIn, Copy, Check } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const STATES = ['Bihar', 'Jharkhand', 'Uttar Pradesh', 'West Bengal', 'Other'];
const DISTRICTS_BY_STATE = {
  'Bihar': ['Araria','Arwal','Aurangabad','Banka','Begusarai','Bhagalpur','Bhojpur','Buxar','Darbhanga','East Champaran','Gaya','Gopalganj','Jamui','Jehanabad','Kaimur','Katihar','Khagaria','Kishanganj','Lakhisarai','Madhepura','Madhubani','Munger','Muzaffarpur','Nalanda','Nawada','Patna','Purnia','Rohtas','Saharsa','Samastipur','Saran','Sheikhpura','Sheohar','Sitamarhi','Siwan','Supaul','Vaishali','West Champaran'],
  'Jharkhand': ['Bokaro','Chatra','Deoghar','Dhanbad','Dumka','East Singhbhum','Garhwa','Giridih','Godda','Gumla','Hazaribagh','Jamtara','Khunti','Koderma','Latehar','Lohardaga','Pakur','Palamu','Ramgarh','Ranchi','Sahebganj','Seraikela Kharsawan','Simdega','West Singhbhum'],
  'Uttar Pradesh': ['Agra','Aligarh','Prayagraj','Ambedkar Nagar','Amethi','Amroha','Auraiya','Ayodhya','Azamgarh','Baghpat','Bahraich','Ballia','Balrampur','Banda','Barabanki','Bareilly','Basti','Bhadohi','Bijnor','Budaun','Bulandshahr','Chandauli','Chitrakoot','Deoria','Etah','Etawah','Farrukhabad','Fatehpur','Firozabad','Gautam Buddha Nagar','Ghaziabad','Ghazipur','Gonda','Gorakhpur','Hamirpur','Hapur','Hardoi','Hathras','Jalaun','Jaunpur','Jhansi','Kannauj','Kanpur Dehat','Kanpur Nagar','Kasganj','Kaushambi','Kheri','Kushinagar','Lalitpur','Lucknow','Maharajganj','Mahoba','Mainpuri','Mathura','Mau','Meerut','Mirzapur','Moradabad','Muzaffarnagar','Pilibhit','Pratapgarh','Raebareli','Rampur','Saharanpur','Sambhal','Sant Kabir Nagar','Shahjahanpur','Shamli','Shravasti','Siddharthnagar','Sitapur','Sonbhadra','Sultanpur','Unnao','Varanasi'],
  'West Bengal': ['Alipurduar','Bankura','Birbhum','Cooch Behar','Dakshin Dinajpur','Darjeeling','Hooghly','Howrah','Jalpaiguri','Jhargram','Kalimpong','Kolkata','Malda','Murshidabad','Nadia','North 24 Parganas','Paschim Bardhaman','Paschim Medinipur','Purba Bardhaman','Purba Medinipur','Purulia','South 24 Parganas','Uttar Dinajpur']
};

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {children}
    </div>
  );
}

function FileUpload({ label, required, fieldKey, form, set }) {
  const file = form[fieldKey];
  return (
    <div className={`border-2 border-dashed rounded-2xl p-5 text-center transition-colors ${file ? 'border-brand-green bg-brand-green-pale' : 'border-brand-green-light hover:border-brand-green'}`}>
      <FileText className={`w-7 h-7 mx-auto mb-2 ${file ? 'text-brand-green' : 'text-brand-text-muted'}`} />
      <p className="text-sm font-medium text-brand-text mb-1">{label}{required && <span className="text-red-500 ml-1">*</span>}</p>
      {file ? (
        <p className="text-xs text-brand-green font-semibold">{file.name} ✓</p>
      ) : (
        <p className="text-xs text-brand-text-muted">PDF, JPG, PNG up to 5MB</p>
      )}
      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id={`file-${fieldKey}`}
        onChange={e => set(fieldKey, e.target.files?.[0] || null)} />
      <label htmlFor={`file-${fieldKey}`} className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-green cursor-pointer hover:underline">
        <Upload className="w-3 h-3" /> {file ? 'Change' : 'Upload'}
      </label>
    </div>
  );
}

function SuccessScreen({ appId, userMobile, userEmail, userPassword }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [loginField, setLoginField] = useState(userMobile || userEmail || '');
  const [password, setPassword] = useState(userPassword || '');
  const [showPwd, setShowPwd] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginDone, setLoginDone] = useState(false);

  const copyAppId = () => { navigator.clipboard.writeText(appId); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginField || !password) { setLoginError('Please enter mobile/email and password.'); return; }
    setLoginLoading(true); setLoginError('');
    try {
      await login(loginField, password);
      setLoginDone(true);
      setTimeout(() => navigate('/customer/applications'), 1000);
    } catch (err) {
      setLoginError(err.response?.data?.message || 'Login failed. Try again.');
    } finally { setLoginLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
      </div>
      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-brand-green to-emerald-500 px-8 py-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20"><div className="absolute top-4 left-8 w-16 h-16 border-2 border-white rounded-full" /><div className="absolute bottom-4 right-8 w-24 h-24 border-2 border-white rounded-full" /></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 ring-4 ring-white/30">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">Application Submitted!</h1>
              <p className="text-green-100 text-sm">आपका आवेदन सफलतापूर्वक जमा हो गया है</p>
            </div>
          </div>
          <div className="px-8 py-6 bg-brand-green-pale/50 border-b border-brand-green-pale">
            <p className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider mb-2 text-center">Your Application Number</p>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm border border-brand-green-light">
              <div className="flex-1 font-mono text-xl font-bold text-brand-green tracking-wide text-center">{appId}</div>
              <button onClick={copyAppId} className="p-2 rounded-xl bg-brand-green-pale hover:bg-brand-green hover:text-white text-brand-green transition-all">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</button>
            </div>
            <p className="text-center text-xs text-brand-text-muted mt-2">💡 Save this ID to track your application status anytime</p>
          </div>
          <div className="px-8 py-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-px flex-1 bg-brand-green-pale" />
              <span className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider px-2">Login to Track Your Application</span>
              <div className="h-px flex-1 bg-brand-green-pale" />
            </div>
            {loginDone ? (
              <div className="text-center py-4"><CheckCircle2 className="w-10 h-10 text-brand-green mx-auto mb-2" /><p className="text-brand-green font-semibold">Logged in! Redirecting…</p></div>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {loginError}</div>}
                <div><label className="label">Mobile Number or Email<span className="text-red-500 ml-1">*</span></label>
                  <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                    <input className="input pl-10" placeholder="Mobile or email used during registration" value={loginField} onChange={e => setLoginField(e.target.value)} /></div></div>
                <div><label className="label">Password<span className="text-red-500 ml-1">*</span></label>
                  <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                    <input className="input pl-10 pr-10" type={showPwd ? 'text' : 'password'} placeholder="Password you set during registration" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPwd(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-text-muted hover:text-brand-green">{showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
                <button type="submit" disabled={loginLoading} className="btn-primary w-full justify-center gap-2 disabled:opacity-60">
                  <LogIn className="w-4 h-4" />{loginLoading ? 'Logging in…' : 'Login & View My Application'}
                </button>
              </form>
            )}
            <p className="text-center text-xs text-brand-text-muted mt-4">You can also login later at <Link to="/login" className="text-brand-green font-semibold hover:underline">Customer Portal</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BantwaraRegistrationPage() {
  const { currentUser, register, login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);
  const [serviceConfig, setServiceConfig] = useState(null);

  const [form, setForm] = useState({
    name: currentUser?.name || '', mobile: currentUser?.mobile || '',
    email: currentUser?.email || '', fatherName: currentUser?.father_name || '',
    state: 'Bihar', district: currentUser?.district || '',
    panchayat: '', policeStation: '', village: '', wardName: '',
    moujaName: '', blockName: '', pincode: '', khataNumber: '',
    password: '', confirmPassword: '',
    landArea: '',
    aadhaarFront: null, aadhaarBack: null, khatiyan: null, vanshawali: null,
  });

  useEffect(() => {
    api.get('/services').then(res => {
      const srv = res.data?.services?.find(s => s.name === 'bantwara');
      if (srv) setServiceConfig(srv);
    }).catch(console.error);
  }, []);

  const calculatePrice = () => {
    if (!serviceConfig) return form.landArea ? (Number(form.landArea) * 5).toLocaleString() : '0';
    let total = Number(serviceConfig.base_price || 0);
    if (serviceConfig.unit_type !== 'fixed' && form.landArea) {
      total += Number(form.landArea) * Number(serviceConfig.unit_price || 0);
    }
    return total.toLocaleString();
  };

  const estimatedPrice = calculatePrice();

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile || !form.district) { setError('Please fill all required fields'); return; }
    if (!form.aadhaarFront || !form.aadhaarBack) { setError('Aadhaar Front and Back are required'); return; }
    if (!form.khatiyan) { setError('Khatiyan / Land Record Copy is required'); return; }
    if (!currentUser && (!form.password)) { setError('Password is required to create an account'); return; }
    if (!currentUser && form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }

    setSubmitting(true); setError('');
    try {
      let registeredUser = (currentUser && currentUser.role === 'customer') ? currentUser : null;
      if (!registeredUser) {
        try {
          const { user } = await register({ 
            name: form.name, email: form.email, password: form.password, 
            mobile: form.mobile, fatherName: form.fatherName, 
            district: form.district, state: form.state 
          });
          registeredUser = user;
        } catch (e) {
          if (e.response?.status === 409) {
            try {
              const loggedInUser = await login(form.mobile, form.password);
              registeredUser = loggedInUser;
            } catch (loginErr) {
              throw new Error('This mobile number or email is already registered. Please use the correct password or login from the customer portal.');
            }
          } else {
            throw new Error(e.response?.data?.message || 'Registration failed. Please try again.');
          }
        }
      }
      
      const formData = new FormData();
      if (registeredUser) formData.append('customer_id', registeredUser.id);
      
      const fields = [
        'name', 'mobile', 'email', 'fatherName', 'state', 'district', 'panchayat', 
        'policeStation', 'village', 'wardName', 'moujaName', 'khataNumber', 
        'blockName', 'pincode', 'landArea'
      ];
      
      fields.forEach(field => {
        const keyName = field.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        if (form[field]) formData.append(keyName, form[field]);
      });

      formData.append('aadhaar_front', form.aadhaarFront);
      formData.append('aadhaar_back', form.aadhaarBack);
      formData.append('khatiyan', form.khatiyan);
      if (form.vanshawali) formData.append('vanshawali', form.vanshawali);

      const res = await api.post('/applications/bantwara', formData);
      
      setSuccessData({ appId: res.data.app_id, mobile: form.mobile, email: form.email, password: form.password });
    } catch (err) { 
      setError(err.message || 'Submission failed. Try again.'); 
    } finally {
      setSubmitting(false);
    }
  };

  if (successData) {
    return <SuccessScreen appId={successData.appId} userMobile={successData.mobile} userEmail={successData.email} userPassword={successData.password} />;
  }

  return (
    <div className="min-h-screen bg-brand-cream py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <img src="/logo.png" alt="SP MAPI" className="w-9 h-9 rounded-xl object-contain" />
            <span className="font-bold text-brand-text text-xl">SP MAPI</span>
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-green-pale text-brand-green rounded-full text-xs font-semibold mb-4">
            <Leaf className="w-3.5 h-3.5" /> Bantwara Registration
          </div>
          <h1 className="text-3xl font-bold text-brand-text">Bantwara (Division Survey) Registration</h1>
          <p className="text-brand-text-muted mt-2">Fill in all details and upload required documents</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

          {/* Personal Details */}
          <div>
            <h2 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-green" /> Personal Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Full Name" required>
                <input className="input" placeholder="Full name" value={form.name} onChange={e => set('name', e.target.value)} />
              </FormField>
              <FormField label="Mobile Number" required>
                <input className="input" placeholder="10-digit mobile" value={form.mobile} onChange={e => set('mobile', e.target.value)} maxLength={10} />
              </FormField>
              <FormField label="Father / Husband Name" required>
                <input className="input" placeholder="Father or Husband's name" value={form.fatherName} onChange={e => set('fatherName', e.target.value)} />
              </FormField>
              {!currentUser && (<>
                <FormField label="Email Address">
                  <input className="input" type="email" placeholder="Optional" value={form.email} onChange={e => set('email', e.target.value)} />
                </FormField>
                <FormField label="Password" required>
                  <input className="input" type="password" placeholder="Min 6 chars" value={form.password} onChange={e => set('password', e.target.value)} />
                </FormField>
                <FormField label="Confirm Password" required>
                  <input className="input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} />
                </FormField>
              </>)}
            </div>
          </div>

          {/* Location Details */}
          <div>
            <h2 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-brand-green" /> Location Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="State" required>
                <select className="input" value={form.state} onChange={e => { set('state', e.target.value); set('district', ''); }}>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="District" required>
                {DISTRICTS_BY_STATE[form.state] ? (
                  <select className="input" value={form.district} onChange={e => set('district', e.target.value)}>
                    <option value="">-- Select District --</option>
                    {DISTRICTS_BY_STATE[form.state].map(d => <option key={d}>{d}</option>)}
                  </select>
                ) : (
                  <input className="input" placeholder="Enter District" value={form.district} onChange={e => set('district', e.target.value)} />
                )}
              </FormField>
              <FormField label="Panchayat"><input className="input" placeholder="Panchayat name" value={form.panchayat} onChange={e => set('panchayat', e.target.value)} /></FormField>
              <FormField label="Police Station"><input className="input" placeholder="Police Station" value={form.policeStation} onChange={e => set('policeStation', e.target.value)} /></FormField>
              <FormField label="Village / Town / Nagar" required><input className="input" placeholder="Village name" value={form.village} onChange={e => set('village', e.target.value)} /></FormField>
              <FormField label="Ward Name / Number"><input className="input" placeholder="Ward" value={form.wardName} onChange={e => set('wardName', e.target.value)} /></FormField>
              <FormField label="Mouja Name / Number"><input className="input" placeholder="Mouja" value={form.moujaName} onChange={e => set('moujaName', e.target.value)} /></FormField>
              <FormField label="Khata Number"><input className="input" placeholder="Khata number" value={form.khataNumber} onChange={e => set('khataNumber', e.target.value)} /></FormField>
              <FormField label="Block Name" required><input className="input" placeholder="Block name" value={form.blockName} onChange={e => set('blockName', e.target.value)} /></FormField>
              <FormField label="Pincode" required><input className="input" placeholder="6-digit pincode" value={form.pincode} onChange={e => set('pincode', e.target.value)} maxLength={6} /></FormField>
              <FormField label="Total Land Area (sq. ft.)" required>
                <input className="input" type="number" placeholder="Enter land area in sq. ft." value={form.landArea} onChange={e => set('landArea', e.target.value)} />
              </FormField>
            </div>
            <div className="mt-4 p-4 bg-brand-green-pale rounded-xl flex justify-between items-center border border-brand-green">
              <span className="font-semibold text-brand-text">
                Estimated Price {serviceConfig ? `(Base: ₹${serviceConfig.base_price || 0}${serviceConfig.unit_type !== 'fixed' ? ` + ₹${serviceConfig.unit_price}/${serviceConfig.unit_type}` : ''})` : '(₹5 / sq.ft)'}:
              </span>
              <span className="text-xl font-bold text-brand-green">₹{estimatedPrice}</span>
            </div>
          </div>

          {/* Documents */}
          <div>
            <h2 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-brand-green" /> Document Upload
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUpload label="Aadhaar Front" required fieldKey="aadhaarFront" form={form} set={set} />
              <FileUpload label="Aadhaar Back" required fieldKey="aadhaarBack" form={form} set={set} />
              <FileUpload label="Khatiyan / Land Record Copy" required fieldKey="khatiyan" form={form} set={set} />
              <FileUpload label="Vanshawali (Family Tree)" fieldKey="vanshawali" form={form} set={set} />
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-brand-green-pale">
            <Link to="/services" className="btn-ghost">← Back</Link>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
              {submitting ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </form>

        {!currentUser && (
          <p className="text-center text-sm text-brand-text-muted mt-6">
            Already have an account? <Link to="/login" className="text-brand-green font-semibold hover:underline">Login here</Link>
          </p>
        )}
      </div>
    </div>
  );
}
