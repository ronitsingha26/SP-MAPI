import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Upload, CheckCircle2, FileText, Leaf } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { saveApplication, generateAppId } from '../../../utils/storage';

const STATES = ['Bihar', 'Jharkhand', 'Uttar Pradesh', 'West Bengal', 'Other'];
const DISTRICTS = ['Araria','Arwal','Aurangabad','Banka','Begusarai','Bhagalpur','Bhojpur','Buxar','Darbhanga','East Champaran','Gaya','Gopalganj','Jamui','Jehanabad','Kaimur','Katihar','Khagaria','Kishanganj','Lakhisarai','Madhepura','Madhubani','Munger','Muzaffarpur','Nalanda','Nawada','Patna','Purnia','Rohtas','Saharsa','Samastipur','Saran','Sheikhpura','Sheohar','Sitamarhi','Siwan','Supaul','Vaishali','West Champaran'];

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

export default function BantwaraRegistrationPage() {
  const { currentUser, register } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState('');

  const [form, setForm] = useState({
    name: currentUser?.name || '', mobile: currentUser?.mobile || '',
    email: currentUser?.email || '', fatherName: currentUser?.fatherName || '',
    state: 'Bihar', district: currentUser?.district || '',
    panchayat: '', policeStation: '', village: '', wardName: '',
    mojaName: '', blockName: '', pincode: '',
    password: '', confirmPassword: '',
    aadhaarFront: null, aadhaarBack: null, khatian: null, vanshavali: null,
  });

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.mobile || !form.district) { setError('Please fill all required fields'); return; }
    if (!form.aadhaarFront || !form.aadhaarBack) { setError('Aadhaar Front and Back are required'); return; }
    if (!form.khatian) { setError('Khatiyan / Land Record Copy is required'); return; }
    if (!currentUser && (!form.email || !form.password)) { setError('Email and password are required to create an account'); return; }
    if (!currentUser && form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }

    setSubmitting(true); setError('');
    try {
      if (!currentUser) {
        register({ name: form.name, email: form.email, password: form.password, mobile: form.mobile, fatherName: form.fatherName, district: form.district, state: form.state });
      }
      const appId = generateAppId('BAN');
      saveApplication('bantwara', {
        appId, userId: currentUser?.id || null,
        name: form.name, mobile: form.mobile, email: form.email,
        fatherName: form.fatherName, state: form.state, district: form.district,
        panchayat: form.panchayat, policeStation: form.policeStation,
        village: form.village, wardName: form.wardName, mojaName: form.mojaName,
        blockName: form.blockName, pincode: form.pincode,
        status: 'submitted', remark: '', statusHistory: [],
        documents: { aadhaarFront: form.aadhaarFront?.name, aadhaarBack: form.aadhaarBack?.name, khatian: form.khatian?.name, vanshavali: form.vanshavali?.name },
      });
      setSuccessId(appId);
      setTimeout(() => navigate('/customer/dashboard'), 2500);
    } catch (err) { setError(err.message || 'Submission failed. Try again.'); }
    setSubmitting(false);
  };

  if (successId) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center p-10 animate-fade-in">
          <div className="w-20 h-20 bg-brand-green-pale rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-brand-green" />
          </div>
          <h2 className="text-2xl font-bold text-brand-text mb-2">Application Submitted!</h2>
          <p className="text-brand-text-muted mb-4">Your Bantwara application has been received.</p>
          <div className="bg-brand-green-pale rounded-2xl p-4 mb-6">
            <p className="text-xs text-brand-text-muted mb-1">Application ID</p>
            <p className="text-xl font-bold text-brand-green font-mono">{successId}</p>
          </div>
          <p className="text-sm text-brand-text-muted">Redirecting to your dashboard…</p>
        </div>
      </div>
    );
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
                <FormField label="Email Address" required>
                  <input className="input" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} />
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
                <select className="input" value={form.state} onChange={e => set('state', e.target.value)}>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </FormField>
              <FormField label="District" required>
                <select className="input" value={form.district} onChange={e => set('district', e.target.value)}>
                  <option value="">-- Select District --</option>
                  {DISTRICTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </FormField>
              <FormField label="Panchayat"><input className="input" placeholder="Panchayat name" value={form.panchayat} onChange={e => set('panchayat', e.target.value)} /></FormField>
              <FormField label="Police Station"><input className="input" placeholder="Police Station" value={form.policeStation} onChange={e => set('policeStation', e.target.value)} /></FormField>
              <FormField label="Village / Town / Nagar" required><input className="input" placeholder="Village name" value={form.village} onChange={e => set('village', e.target.value)} /></FormField>
              <FormField label="Ward Name / Number"><input className="input" placeholder="Ward" value={form.wardName} onChange={e => set('wardName', e.target.value)} /></FormField>
              <FormField label="Moja Name / Number"><input className="input" placeholder="Moja" value={form.mojaName} onChange={e => set('mojaName', e.target.value)} /></FormField>
              <FormField label="Block Name" required><input className="input" placeholder="Block name" value={form.blockName} onChange={e => set('blockName', e.target.value)} /></FormField>
              <FormField label="Pincode" required><input className="input" placeholder="6-digit pincode" value={form.pincode} onChange={e => set('pincode', e.target.value)} maxLength={6} /></FormField>
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
              <FileUpload label="Khatiyan / Land Record Copy" required fieldKey="khatian" form={form} set={set} />
              <FileUpload label="Vanshawali (Family Tree)" fieldKey="vanshavali" form={form} set={set} />
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
