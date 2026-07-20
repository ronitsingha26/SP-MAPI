import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, Upload, CheckCircle2, ChevronRight, ChevronLeft, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

const STATES = ['Bihar', 'Jharkhand', 'Uttar Pradesh', 'West Bengal', 'Other'];

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

export default function CustomerBantwaraForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState('');

  const [form, setForm] = useState({
    state: currentUser?.state || 'Bihar',
    districtId: '', districtName: currentUser?.district || '',
    blockId: '', blockName: currentUser?.block || '',
    panchayatId: '', panchayatName: currentUser?.panchayat || '',
    villageId: '', villageName: currentUser?.village || '',
    policeStation: currentUser?.police_station || '',
    wardName: currentUser?.ward_number || '',
    moujaName: currentUser?.mouja || '',
    khataNumber: '', pincode: currentUser?.pincode || '',
    landArea: '', noOfDays: '', courtCaseNumber: '', vanshawaliDetails: '',
    aadhaarFront: null, aadhaarBack: null, khatiyan: null, vanshawali: null,
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
  const estimatedPrice = form.noOfDays ? (Number(form.noOfDays) * 2500).toLocaleString() : '0';

  const handleSubmit = async () => {
    if (!form.aadhaarFront || !form.aadhaarBack || !form.khatiyan) {
      setError('Aadhaar Front, Back and Khatiyan are required');
      return;
    }
    setSubmitting(true); setError('');
    try {
      const formData = new FormData();
      formData.append('customer_id', currentUser.id);
      formData.append('name', currentUser.name);
      formData.append('mobile', currentUser.mobile);
      if (currentUser.email) formData.append('email', currentUser.email);
      formData.append('father_name', currentUser.father_name || '');
      const fields = { state: form.state, district: form.districtName, panchayat: form.panchayatName, police_station: form.policeStation, village: form.villageName, ward_name: form.wardName, mouja_name: form.moujaName, khata_number: form.khataNumber, block_name: form.blockName, pincode: form.pincode, land_area: form.landArea, no_of_days: form.noOfDays, court_case_number: form.courtCaseNumber, vanshawali_details: form.vanshawaliDetails };
      Object.entries(fields).forEach(([k, v]) => { if (v) formData.append(k, v); });
      formData.append('aadhaar_front', form.aadhaarFront);
      formData.append('aadhaar_back', form.aadhaarBack);
      formData.append('khatiyan', form.khatiyan);
      if (form.vanshawali) formData.append('vanshawali', form.vanshawali);

      const res = await api.post('/applications/bantwara', formData);
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
          <h2 className="text-2xl font-bold text-brand-text mb-2">Bantwara Application Submitted!</h2>
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
          <h1 className="page-title flex items-center gap-2"><GitBranch className="w-6 h-6 text-yellow-600" /> Bantwara Registration</h1>
          <p className="page-subtitle">Land Division Survey Application</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8">
        {['Location Details', 'Documents & Submit'].map((label, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${step === idx + 1 ? 'bg-brand-green text-white' : step > idx + 1 ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400'}`}>
              {step > idx + 1 ? '✓' : idx + 1}. {label}
            </div>
            {idx === 0 && <div className={`h-0.5 w-6 rounded ${step > 1 ? 'bg-brand-green' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">⚠️ {error}</div>}

      <div className="card p-6 sm:p-8">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-brand-text mb-4">Location Details</h2>
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
              <FormField label="Police Station"><input className="input" placeholder="Thana name" value={form.policeStation} onChange={e => set('policeStation', e.target.value)} /></FormField>
              <FormField label="Ward Name"><input className="input" placeholder="Ward name or number" value={form.wardName} onChange={e => set('wardName', e.target.value)} /></FormField>
              <FormField label="Mouja Name"><input className="input" placeholder="Mouja name or number" value={form.moujaName} onChange={e => set('moujaName', e.target.value)} /></FormField>
              <FormField label="Khata Number"><input className="input" placeholder="Khata number" value={form.khataNumber} onChange={e => set('khataNumber', e.target.value)} /></FormField>
              <FormField label="Pincode" required><input className="input" placeholder="6-digit pincode" maxLength={6} value={form.pincode} onChange={e => set('pincode', e.target.value.replace(/\D/g, ''))} /></FormField>
              <FormField label="Land Area (sq. ft.)"><input className="input" type="number" min="0" placeholder="Total land area (optional)" value={form.landArea} onChange={e => set('landArea', e.target.value)} /></FormField>
              <FormField label="Number of Days for Amin" required><input className="input" type="number" min="1" placeholder="Enter number of days" value={form.noOfDays} onChange={e => set('noOfDays', e.target.value)} /></FormField>
              <FormField label="Court Case Number (if any)"><input className="input" placeholder="Case number if applicable" value={form.courtCaseNumber} onChange={e => set('courtCaseNumber', e.target.value)} /></FormField>
              {form.noOfDays && (
                <div className="sm:col-span-2 bg-brand-green-pale rounded-xl p-4">
                  <p className="text-sm text-brand-text-muted">Estimated Cost</p>
                  <p className="text-2xl font-bold text-brand-green">₹{estimatedPrice}</p>
                  <p className="text-xs text-brand-text-muted">@ ₹2,500 per day</p>
                </div>
              )}
            </div>
            <button className="btn-primary w-full justify-center mt-4"
              onClick={() => { if (!form.districtName) { setError('Please select a district'); } else if(!form.blockName) { setError('Please select a block'); } else if(!form.noOfDays) { setError('Please enter number of days'); } else { setError(''); setStep(2); window.scrollTo(0,0); } }}>
              Next: Upload Documents <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-brand-text mb-4">Documents Upload</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FileUploadBox label="Aadhaar Card — Front" required file={form.aadhaarFront} onChange={f => set('aadhaarFront', f)} />
              <FileUploadBox label="Aadhaar Card — Back" required file={form.aadhaarBack} onChange={f => set('aadhaarBack', f)} />
            </div>
            <FileUploadBox label="Khatiyan (Land Record)" required file={form.khatiyan} onChange={f => set('khatiyan', f)} />
            <FileUploadBox label="Vanshawali (if available)" file={form.vanshawali} onChange={f => set('vanshawali', f)} />
            <div className="flex gap-3 pt-2">
              <button className="btn-outline flex-1 justify-center" onClick={() => setStep(1)}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button className="btn-primary flex-1 justify-center disabled:opacity-60" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
