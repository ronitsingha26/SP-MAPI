import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Briefcase, FileText } from 'lucide-react';
import api from '../../utils/api';
import CustomDatePicker from '../../components/CustomDatePicker';

export default function AminApplicationPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', father_name: '', mobile: '', email: '', dob: '', gender: 'Male',
    state: '', district: '', block_name: '', village: '', pin_code: '',
    highest_qualification: '', experience_years: 0, previous_organization: ''
  });

  const [files, setFiles] = useState({
    aadhaar_front: null, aadhaar_back: null, pan: null, educational_certificate: null,
    experience_certificate: null, passport_photo: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json')
      .then(res => res.json())
      .then(data => setStatesList(data.states || []))
      .catch(err => console.error('Error fetching states data:', err));
  }, []);

  useEffect(() => {
    if (formData.state) {
      const selectedStateObj = statesList.find(s => s.state === formData.state);
      if (selectedStateObj) {
        setDistrictsList(selectedStateObj.districts || []);
        if (!selectedStateObj.districts.includes(formData.district)) {
          setFormData(prev => ({ ...prev, district: selectedStateObj.districts[0] || '' }));
        }
      } else {
        setDistrictsList([]);
      }
    }
  }, [formData.state, statesList]);

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target;
    if (fileList.length > 0) {
      const file = fileList[0];
      
      const rules = {
        aadhaar_front: { types: ['application/pdf', 'image/jpeg', 'image/png'], maxSize: 3 },
        aadhaar_back: { types: ['application/pdf', 'image/jpeg', 'image/png'], maxSize: 3 },
        pan: { types: ['application/pdf', 'image/jpeg', 'image/png'], maxSize: 3 },
        educational_certificate: { types: ['application/pdf', 'image/jpeg', 'image/png'], maxSize: 5 },
        experience_certificate: { types: ['application/pdf', 'image/jpeg', 'image/png'], maxSize: 5 },
        passport_photo: { types: ['image/jpeg', 'image/png'], maxSize: 2 }
      };

      const rule = rules[name];
      if (rule) {
        if (!rule.types.includes(file.type)) {
          setError(`Invalid file type for ${name.replace('_', ' ')}. Allowed types: PDF, JPG, PNG.`);
          e.target.value = '';
          return;
        }
        if (file.size > rule.maxSize * 1024 * 1024) {
          setError(`File size exceeds ${rule.maxSize}MB limit for ${name.replace('_', ' ')}.`);
          e.target.value = '';
          return;
        }
      }

      setError('');
      setFiles(prev => ({ ...prev, [name]: file }));
    } else {
      setFiles(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!files.aadhaar_front || !files.aadhaar_back || !files.pan || !files.educational_certificate || !files.passport_photo) {
      setError('Please upload all mandatory documents (Aadhaar Front, Aadhaar Back, PAN, Education, Photo).');
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      Object.keys(files).forEach(key => {
        if (files[key]) data.append(key, files[key]);
      });

      const res = await api.post('/public/amin-recruitment/apply', data);

      navigate('/apply-amin/success', { state: { appId: res.data.app_id, formData } });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream py-12 px-4 sm:px-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-brand-text font-semibold hover:text-brand-green mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        <div className="bg-white rounded-3xl shadow-soft p-6 sm:p-10 border border-gray-100">
          <h1 className="text-3xl font-bold text-brand-text mb-2">Apply as Amin</h1>
          <p className="text-brand-text-muted mb-8">Join our professional network of certified land surveyors.</p>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-start gap-2">
              <span className="text-lg leading-none">⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Personal Details */}
            <section>
              <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center gap-2 border-b pb-2">
                <User className="w-5 h-5 text-brand-green" /> Personal Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <input type="text" name="mobile" required className="input" value={formData.mobile} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">Email <span className="text-red-500">*</span></label>
                  <input type="email" name="email" required className="input" value={formData.email} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">Date of Birth <span className="text-red-500">*</span></label>
                  <CustomDatePicker 
                    name="dob" 
                    value={formData.dob} 
                    onChange={handleInputChange} 
                    required 
                  />
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
              <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center gap-2 border-b pb-2">
                <MapPin className="w-5 h-5 text-brand-green" /> Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">State <span className="text-red-500">*</span></label>
                  <select name="state" required className="input" value={formData.state} onChange={handleInputChange}>
                    <option value="">Select State</option>
                    {statesList.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
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
              <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center gap-2 border-b pb-2">
                <Briefcase className="w-5 h-5 text-brand-green" /> Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Highest Qualification <span className="text-red-500">*</span></label>
                  <input type="text" name="highest_qualification" required className="input" value={formData.highest_qualification} onChange={handleInputChange} />
                </div>
                <div>
                  <label className="label">Years of Experience</label>
                  <input type="number" name="experience_years" className="input" value={formData.experience_years} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="label">Previous Organization (if any)</label>
                  <input type="text" name="previous_organization" className="input" value={formData.previous_organization} onChange={handleInputChange} />
                </div>
              </div>
            </section>

            {/* Documents */}
            <section>
              <h2 className="text-xl font-bold text-brand-text mb-4 flex items-center gap-2 border-b pb-2">
                <FileText className="w-5 h-5 text-brand-green" /> Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Aadhaar Front <span className="text-red-500">*</span></label>
                  <input type="file" name="aadhaar_front" accept=".pdf,.jpg,.jpeg,.png" required className="input p-2.5" onChange={handleFileChange} />
                  <p className="text-xs text-brand-text-muted mt-1">Accepted: PDF, JPG, JPEG, PNG. Max: 3 MB</p>
                </div>
                <div>
                  <label className="label">Aadhaar Back <span className="text-red-500">*</span></label>
                  <input type="file" name="aadhaar_back" accept=".pdf,.jpg,.jpeg,.png" required className="input p-2.5" onChange={handleFileChange} />
                  <p className="text-xs text-brand-text-muted mt-1">Accepted: PDF, JPG, JPEG, PNG. Max: 3 MB</p>
                </div>
                <div>
                  <label className="label">PAN Card <span className="text-red-500">*</span></label>
                  <input type="file" name="pan" accept=".pdf,.jpg,.jpeg,.png" required className="input p-2.5" onChange={handleFileChange} />
                  <p className="text-xs text-brand-text-muted mt-1">Accepted: PDF, JPG, JPEG, PNG. Max: 3 MB</p>
                </div>
                <div>
                  <label className="label">Educational Certificate <span className="text-red-500">*</span></label>
                  <input type="file" name="educational_certificate" accept=".pdf,.jpg,.jpeg,.png" required className="input p-2.5" onChange={handleFileChange} />
                  <p className="text-xs text-brand-text-muted mt-1">Accepted: PDF, JPG, JPEG, PNG. Max: 5 MB</p>
                </div>
                <div>
                  <label className="label">Passport Photo <span className="text-red-500">*</span></label>
                  <input type="file" name="passport_photo" accept=".jpg,.jpeg,.png" required className="input p-2.5" onChange={handleFileChange} />
                  <p className="text-xs text-brand-text-muted mt-1">Accepted: JPG, JPEG, PNG. Max: 2 MB</p>
                </div>
                <div className="md:col-span-2">
                  <label className="label">Experience Certificate (Optional)</label>
                  <input type="file" name="experience_certificate" accept=".pdf,.jpg,.jpeg,.png" className="input p-2.5" onChange={handleFileChange} />
                  <p className="text-xs text-brand-text-muted mt-1">Accepted: PDF, JPG, JPEG, PNG. Max: 5 MB</p>
                </div>
              </div>
            </section>

            <div className="pt-6 flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto px-12 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
