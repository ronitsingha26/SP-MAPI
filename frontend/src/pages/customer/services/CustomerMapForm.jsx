import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Upload, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const STATES = ['Bihar', 'Jharkhand', 'Uttar Pradesh', 'West Bengal', 'Other'];

const MAP_PURPOSES = ['Property Sale', 'Court Case', 'Bank Loan / Mortgage', 'Land Division', 'Construction', 'Government Work', 'Other'];

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {children}
    </div>
  );
}

function FileUploadBox({ label, required, file, onChange }) {
  return (
    <div>
      <label className="label">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all ${file ? 'border-brand-green bg-brand-green-pale' : 'border-brand-green-pale hover:border-brand-green hover:bg-brand-green-pale/50'}`}>
        <Upload className={`w-6 h-6 mb-2 ${file ? 'text-brand-green' : 'text-brand-text-muted'}`} />
        {file ? (
          <><p className="text-sm font-semibold text-brand-green">✓ {file.name}</p><p className="text-xs text-brand-text-muted mt-1">Click to change</p></>
        ) : (
          <><p className="text-sm font-medium text-brand-text">Click to upload</p><p className="text-xs text-brand-text-muted mt-1">PDF, JPG, PNG (max 5MB)</p></>
        )}
        <input type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" className="hidden" onChange={e => onChange(e.target.files[0] || null)} />
      </label>
    </div>
  );
}

export default function CustomerMapForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState('');

  const [form, setForm] = useState({
    state: currentUser?.state || 'Bihar',
    districtId: '', districtName: currentUser?.district || '',
    blockId: '', blockName: currentUser?.block || '',
    panchayatId: '', panchayatName: currentUser?.panchayat || '',
    villageId: '', villageName: currentUser?.village || '',
    pincode: currentUser?.pincode || '',
    khataNumber: '', khasraNumber: '', mapPurpose: '',
    sheetNumber: '', csNumber: '', rsNumber: '', ssNumber: '',
    aadhaarFront: null, aadhaarBack: null,
  });

  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json')
      .then(res => res.json())
      .then(data => setStatesList(data.states || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (form.state) {
      const selectedStateObj = statesList.find(s => s.state === form.state);
      setDistrictsList(selectedStateObj ? selectedStateObj.districts : []);
      if (selectedStateObj && !selectedStateObj.districts.includes(form.districtName)) {
        set('districtName', '');
      }
    } else {
      setDistrictsList([]);
    }
  }, [form.state, statesList]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.districtName) { setError('Please select a district'); return; }
    if (!form.blockName.trim()) { setError('Please enter a block'); return; }
    if (!form.mapPurpose) { setError('Please select purpose of map'); return; }
    if (!form.aadhaarFront || !form.aadhaarBack) { setError('Aadhaar Front and Back are required'); return; }
    setSubmitting(true); setError('');

    try {
      const formData = new FormData();
      formData.append('customer_id', currentUser.id);
      formData.append('name', currentUser.name);
      formData.append('mobile', currentUser.mobile);
      if (currentUser.email) formData.append('email', currentUser.email);
      formData.append('father_name', currentUser.father_name || '');
      const fields = { state: form.state, district: form.districtName, village: form.villageName, block_name: form.blockName, pincode: form.pincode, khata_number: form.khataNumber, khasra_number: form.khasraNumber, map_purpose: form.mapPurpose };
      Object.entries(fields).forEach(([k, v]) => { if (v) formData.append(k, v); });
      formData.append('aadhaar_front', form.aadhaarFront);
      formData.append('aadhaar_back', form.aadhaarBack);

      const res = await api.post('/applications/map', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccessId(res.data.app_id);
      setTimeout(() => navigate('/customer/applications'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (successId) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 bg-brand-green-pale rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-brand-green" />
          </div>
          <h2 className="text-2xl font-bold text-brand-text mb-2">Map Request Submitted!</h2>
          <p className="font-mono text-lg font-bold text-brand-green mb-4">{successId}</p>
          <p className="text-sm text-brand-text-muted">Redirecting to your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-green mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Map className="w-6 h-6 text-blue-500" /> Map Copy Request</h1>
          <p className="page-subtitle">Request a digital map / Naksha of your land</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">⚠️ {error}</div>}

      <div className="card p-6 sm:p-8 space-y-5">
        <h2 className="text-lg font-bold text-brand-text mb-2">Land & Location Details</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="State" required>
            <select className="input" value={form.state} onChange={e => { set('state', e.target.value); }}>
              <option value="">-- Select State --</option>
              {statesList.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
            </select>
          </FormField>
          <FormField label="District" required>
            <select className="input" value={form.districtName} onChange={e => { set('districtName', e.target.value); }}>
              <option value="">-- Select District --</option>
              {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </FormField>
          
          <FormField label="Block" required>
            <input className="input" placeholder="Type Block name" value={form.blockName} onChange={e => set('blockName', e.target.value)} />
          </FormField>

          <FormField label="Panchayat">
            <input className="input" placeholder="Type Panchayat name (Optional)" value={form.panchayatName} onChange={e => set('panchayatName', e.target.value)} />
          </FormField>

          <FormField label="Village / Town / Nagar" required>
            <input className="input" placeholder="Type village name manually" value={form.villageName} onChange={e => set('villageName', e.target.value)} />
          </FormField>
          <FormField label="Khata Number">
            <input className="input" placeholder="Khata number" value={form.khataNumber} onChange={e => set('khataNumber', e.target.value)} />
          </FormField>
          <FormField label="Khasra Number">
            <input className="input" placeholder="Khasra / Plot number" value={form.khasraNumber} onChange={e => set('khasraNumber', e.target.value)} />
          </FormField>
          <FormField label="Pincode">
            <input className="input" placeholder="6-digit pincode" maxLength={6} value={form.pincode} onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))} />
          </FormField>
          <FormField label="Purpose of Map" required>
            <select className="input" value={form.mapPurpose} onChange={e => set('mapPurpose', e.target.value)}>
              <option value="">-- Select Purpose --</option>
              {MAP_PURPOSES.map(p => <option key={p}>{p}</option>)}
            </select>
          </FormField>
        </div>

        <h2 className="text-lg font-bold text-brand-text mt-4 mb-2">Documents Upload</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FileUploadBox label="Aadhaar Card — Front" required file={form.aadhaarFront} onChange={f => set('aadhaarFront', f)} />
          <FileUploadBox label="Aadhaar Card — Back" required file={form.aadhaarBack} onChange={f => set('aadhaarBack', f)} />
        </div>

        <button
          className="btn-primary w-full justify-center mt-4 disabled:opacity-60"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Map Request'}
        </button>
      </div>
    </div>
  );
}
