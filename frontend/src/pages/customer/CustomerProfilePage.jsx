import { useState } from 'react';
import { UserCircle, Phone, Mail, MapPin, Save, RefreshCw, AlertCircle, Home, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

export default function CustomerProfilePage() {
  const { currentUser, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({
    name:           currentUser?.name           || '',
    father_name:    currentUser?.father_name    || '',
    mobile:         currentUser?.mobile         || '',
    email:          currentUser?.email          || '',
    state:          currentUser?.state          || 'Bihar',
    district:       currentUser?.district       || '',
    block:          currentUser?.block          || '',
    village:        currentUser?.village        || '',
    ward_number:    currentUser?.ward_number    || '',
    panchayat:      currentUser?.panchayat      || '',
    mouja:          currentUser?.mouja          || '',
    police_station: currentUser?.police_station || '',
    pincode:        currentUser?.pincode        || '',
    address:        currentUser?.address        || '',
  });

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/applications/customer/profile', {
        name:           profile.name,
        father_name:    profile.father_name,
        email:          profile.email,
        state:          profile.state,
        district:       profile.district,
        block:          profile.block,
        village:        profile.village,
        ward_number:    profile.ward_number,
        panchayat:      profile.panchayat,
        mouja:          profile.mouja,
        police_station: profile.police_station,
        pincode:        profile.pincode,
        address:        profile.address,
      });
      updateUser(res.data.profile);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account details. These will auto-fill in every application.</p>
        </div>
        <button onClick={() => { setEditing(!editing); setError(''); setSuccess(''); }}
          className={editing ? 'btn-outline' : 'btn-primary'}>
          {editing ? 'Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-brand-green-pale border border-brand-green-light rounded-xl text-brand-green text-sm">
          ✓ {success}
        </div>
      )}

      <div className="card p-8">
        {/* Avatar & Customer ID */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-brand-green-pale">
          <div className="w-20 h-20 bg-brand-green-pale rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-brand-green">{(profile.name || 'U').charAt(0).toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-text">{profile.name}</h2>
            {currentUser?.customer_id_display && (
              <p className="text-sm text-brand-green font-semibold">ID: {currentUser.customer_id_display}</p>
            )}
            <p className="text-brand-text-muted text-sm">Customer · SP MAPI</p>
            {currentUser?.is_mobile_verified && <span className="badge-green mt-2 inline-flex">✓ Verified</span>}
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Info */}
          <div>
            <p className="text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <UserCircle className="w-4 h-4" /> Personal Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name',       key: 'name',        icon: UserCircle, type: 'text' },
                { label: "Father's Name",   key: 'father_name', icon: UserCircle, type: 'text' },
                { label: 'Mobile Number',   key: 'mobile',      icon: Phone,      type: 'tel', disabled: true },
                { label: 'Email Address',   key: 'email',       icon: Mail,       type: 'email' },
              ].map(({ label, key, icon: Icon, type, disabled }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                    <input
                      type={type}
                      value={profile[key] || ''}
                      disabled={!editing || disabled}
                      onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                      className={`input pl-10 ${(!editing || disabled) ? 'bg-brand-green-pale cursor-default' : ''}`}
                    />
                  </div>
                  {disabled && <p className="text-xs text-brand-text-muted mt-1">Mobile number cannot be changed.</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Location Info */}
          <div>
            <p className="text-xs font-bold text-brand-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Location Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'State',              key: 'state' },
                { label: 'District',           key: 'district' },
                { label: 'Block',              key: 'block' },
                { label: 'Village',            key: 'village' },
                { label: 'Panchayat',          key: 'panchayat' },
                { label: 'Ward Number',        key: 'ward_number' },
                { label: 'Mouja',              key: 'mouja' },
                { label: 'Police Station',     key: 'police_station' },
                { label: 'PIN Code',           key: 'pincode' },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input
                    type="text"
                    value={profile[key] || ''}
                    disabled={!editing}
                    onChange={e => setProfile({ ...profile, [key]: e.target.value })}
                    className={`input ${!editing ? 'bg-brand-green-pale cursor-default' : ''}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="label">Full Address</label>
              <textarea
                value={profile.address || ''}
                disabled={!editing}
                onChange={e => setProfile({ ...profile, address: e.target.value })}
                className={`input min-h-[70px] ${!editing ? 'bg-brand-green-pale cursor-default' : ''}`}
                placeholder="Full address..."
              />
            </div>
          </div>

          {editing && (
            <button onClick={handleSave} disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
