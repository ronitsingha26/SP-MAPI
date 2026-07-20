import { useState, useEffect } from 'react';
import { User, MapPin, Briefcase, FileText, CheckCircle, Upload, X } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import CustomDatePicker from '../../components/CustomDatePicker';

export default function AdminAminOnboardModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', father_name: '', mobile: '', email: '', password: '', dob: '', gender: 'Male',
    state: 'Bihar', district: '', block_name: '', village: '', pin_code: '',
    highest_qualification: '', experience_years: 0, previous_organization: ''
  });

  const [files, setFiles] = useState({});
  const [districtsList, setDistrictsList] = useState([]);

  useEffect(() => {
    fetchDistricts('Bihar');
  }, []);

  const fetchDistricts = async (stateName) => {
    try {
      const res = await api.get(`/public/districts?state=${stateName}`);
      if (res.data?.success) {
        setDistrictsList(res.data.districts.map(d => d.name));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'state') {
      fetchDistricts(value);
      setFormData(prev => ({ ...prev, district: '' }));
    }
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // File validation
    const requiredFiles = ['aadhaar_front', 'aadhaar_back', 'pan', 'educational_certificate', 'passport_photo'];
    const missing = requiredFiles.filter(f => !files[f]);
    
    if (missing.length > 0) {
      setError(`Please upload all required documents: ${missing.join(', ')}`);
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => submitData.append(key, formData[key]));
    Object.keys(files).forEach(key => submitData.append(key, files[key]));

    try {
      const res = await api.post('/admin/amins/onboard', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        alert('Amin onboarded successfully!');
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to onboard Amin. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <h2 className="font-bold text-brand-text text-xl">Onboard New Amin</h2>
            <p className="text-sm text-brand-text-muted">Fill out the complete profile to auto-generate the Amin account.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 scrollbar-hide">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm border border-red-100 flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Details */}
            <section>
              <h2 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2 border-b pb-2">
                <User className="w-5 h-5 text-brand-green" /> Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="label">Full Name <span className="text-red-500">*</span></label>
                  <input type="text" name="name" required className="input" value={formData.name} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">Father's Name</label>
                  <input type="text" name="father_name" className="input" value={formData.father_name} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">Mobile Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="mobile" required className="input" maxLength="10" pattern="[0-9]{10}" title="Mobile number must be exactly 10 digits" value={formData.mobile} onChange={handleInputChange} onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />
                </div>
                <div>
                  <label className="label">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" required className="input" value={formData.email} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">Password <span className="text-red-500">*</span></label>
                  <input type="password" name="password" required className="input" value={formData.password} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">Date of Birth <span className="text-red-500">*</span></label>
                  <CustomDatePicker name="dob" value={formData.dob} onChange={handleInputChange} required />
                </div>
                <div>
                  <label className="label">Gender <span className="text-red-500">*</span></label>
                  <select name="gender" className="input" value={formData.gender} onChange={handleInputChange}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Address */}
            <section>
              <h2 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2 border-b pb-2">
                <MapPin className="w-5 h-5 text-brand-green" /> Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="label">State <span className="text-red-500">*</span></label>
                  <select name="state" required className="input" value={formData.state} onChange={handleInputChange}>
                    <option value="Bihar">Bihar</option>
                    <option value="Jharkhand">Jharkhand</option>
                  </select>
                </div>
                <div>
                  <label className="label">District <span className="text-red-500">*</span></label>
                  <select name="district" required className="input" value={formData.district} onChange={handleInputChange} disabled={!formData.state}>
                    <option value="">Select District</option>
                    {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Block <span className="text-red-500">*</span></label>
                  <input type="text" name="block_name" required className="input" value={formData.block_name} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">Village <span className="text-red-500">*</span></label>
                  <input type="text" name="village" required className="input" value={formData.village} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">PIN Code <span className="text-red-500">*</span></label>
                  <input type="text" name="pin_code" required className="input" value={formData.pin_code} onChange={handleInputChange} />
                </div>
              </div>
            </section>

            {/* Professional Details */}
            <section>
              <h2 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2 border-b pb-2">
                <Briefcase className="w-5 h-5 text-brand-green" /> Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="label">Highest Qualification <span className="text-red-500">*</span></label>
                  <input type="text" name="highest_qualification" required className="input" value={formData.highest_qualification} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">Years of Experience</label>
                  <input type="number" name="experience_years" className="input" value={formData.experience_years} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">Previous Organization</label>
                  <input type="text" name="previous_organization" className="input" value={formData.previous_organization} onChange={handleInputChange} />
                </div>
              </div>
            </section>

            {/* Documents */}
            <section>
              <h2 className="text-lg font-bold text-brand-text mb-4 flex items-center gap-2 border-b pb-2">
                <FileText className="w-5 h-5 text-brand-green" /> Documents (Mandatory)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <label className="label">Aadhaar Front <span className="text-red-500">*</span></label>
                  <input type="file" name="aadhaar_front" accept=".pdf,.jpg,.jpeg,.png" required className="input p-2 bg-white" onChange={handleFileChange} />
                </div>
                <div>
                  <label className="label">Aadhaar Back <span className="text-red-500">*</span></label>
                  <input type="file" name="aadhaar_back" accept=".pdf,.jpg,.jpeg,.png" required className="input p-2 bg-white" onChange={handleFileChange} />
                </div>
                <div>
                  <label className="label">PAN Card <span className="text-red-500">*</span></label>
                  <input type="file" name="pan" accept=".pdf,.jpg,.jpeg,.png" required className="input p-2 bg-white" onChange={handleFileChange} />
                </div>
                <div>
                  <label className="label">Educational Certificate <span className="text-red-500">*</span></label>
                  <input type="file" name="educational_certificate" accept=".pdf,.jpg,.jpeg,.png" required className="input p-2 bg-white" onChange={handleFileChange} />
                </div>
                <div>
                  <label className="label">Passport Photo <span className="text-red-500">*</span></label>
                  <input type="file" name="passport_photo" accept=".jpg,.jpeg,.png" required className="input p-2 bg-white" onChange={handleFileChange} />
                </div>
                <div>
                  <label className="label">Experience Cert (Optional)</label>
                  <input type="file" name="experience_certificate" accept=".pdf,.jpg,.jpeg,.png" className="input p-2 bg-white" onChange={handleFileChange} />
                </div>
              </div>
            </section>
            
            <div className="flex gap-4 pt-4 border-t sticky bottom-0 bg-white py-4 mt-8 -mx-6 px-6">
              <button type="button" onClick={onClose} className="btn-outline flex-1">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-50">
                {loading ? 'Onboarding Amin...' : 'Onboard Amin'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
