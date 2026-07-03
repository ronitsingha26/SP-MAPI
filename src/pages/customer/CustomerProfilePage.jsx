import { useState } from 'react';
import { UserCircle, Phone, Mail, MapPin, Save } from 'lucide-react';

export default function CustomerProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ramesh Kumar Singh',
    mobile: '9876543210',
    email: 'ramesh@example.com',
    district: 'Patna',
    aadhaar: '****-****-7890',
  });

  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">Manage your account details</p>
        </div>
        <button onClick={() => setEditing(!editing)} className={editing ? 'btn-outline' : 'btn-primary'}>
          {editing ? 'Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      <div className="card p-8">
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-brand-green-pale">
          <div className="w-20 h-20 bg-brand-green-pale rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-brand-green">{profile.name.charAt(0)}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-brand-text">{profile.name}</h2>
            <p className="text-brand-text-muted text-sm">Customer · SP MAPI</p>
            <span className="badge-green mt-2 inline-flex">✓ Verified</span>
          </div>
        </div>

        <div className="space-y-5">
          {[
            { label: 'Full Name', key: 'name', icon: UserCircle, type: 'text' },
            { label: 'Mobile Number', key: 'mobile', icon: Phone, type: 'tel' },
            { label: 'Email Address', key: 'email', icon: Mail, type: 'email' },
            { label: 'District', key: 'district', icon: MapPin, type: 'text' },
            { label: 'Aadhaar Number', key: 'aadhaar', icon: UserCircle, type: 'text', disabled: true },
          ].map(({ label, key, icon: Icon, type, disabled }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <div className="relative">
                <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
                <input
                  type={type}
                  value={profile[key]}
                  disabled={!editing || disabled}
                  onChange={e => setProfile({...profile, [key]: e.target.value})}
                  className={`input pl-10 ${(!editing || disabled) ? 'bg-brand-green-pale cursor-default' : ''}`}
                />
              </div>
              {disabled && <p className="text-xs text-brand-text-muted mt-1">Contact support to update Aadhaar number.</p>}
            </div>
          ))}

          {editing && (
            <button onClick={() => setEditing(false)} className="btn-primary w-full justify-center">
              <Save className="w-4 h-4" /> Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
