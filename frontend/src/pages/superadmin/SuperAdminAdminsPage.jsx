import { useState, useEffect } from 'react';
import { statusColor, statusLabel } from '../../utils/helpers';
import { Plus, Edit2, Trash2, X, RefreshCw, CheckSquare, Square } from 'lucide-react';
import api from '../../utils/api';

export default function SuperAdminAdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', districts: [] });

  const [allDistricts, setAllDistricts] = useState([]);
  const [selectedState, setSelectedState] = useState('');

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/superadmin/admins');
      setAdmins(res.data.admins || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admins.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await api.get('/superadmin/districts');
      setAllDistricts(res.data.districts || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchDistricts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/superadmin/admins', form);
      setShowModal(false);
      setForm({ name: '', email: '', mobile: '', password: '', districts: [] });
      setSelectedState('');
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to deactivate this admin?')) return;
    try {
      await api.delete(`/superadmin/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      alert('Failed to deactivate admin.');
    }
  };

  const states = [...new Set(allDistricts.map(d => d.state))];
  const stateDistricts = allDistricts.filter(d => d.state === selectedState);

  const toggleDistrict = (districtName) => {
    setForm(prev => {
      const isSelected = prev.districts.includes(districtName);
      if (isSelected) {
        return { ...prev, districts: prev.districts.filter(d => d !== districtName) };
      } else {
        return { ...prev, districts: [...prev.districts, districtName] };
      }
    });
  };

  return (
    <div className="animate-fade-in relative">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Management</h1>
          <p className="page-subtitle">Create and manage district administrators</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Create Admin
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      <div className="card !p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Assigned Districts</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <RefreshCw className="w-6 h-6 text-brand-green animate-spin mx-auto" />
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-brand-text-muted">No admins found.</td>
                </tr>
              ) : admins.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-green-pale rounded-full flex items-center justify-center font-bold text-brand-green text-sm uppercase">
                        {a.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-brand-text">{a.name}</span>
                    </div>
                  </td>
                  <td className="text-brand-text-muted text-sm">{a.email}</td>
                  <td className="font-mono text-sm">{a.mobile}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {a.districts && a.districts.length > 0 
                        ? a.districts.map(d => <span key={d} className="badge-grey text-xs">{d}</span>)
                        : <span className="text-xs text-brand-text-muted">None</span>
                      }
                    </div>
                  </td>
                  <td><span className={statusColor(a.status)}>{statusLabel(a.status)}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        title={a.status === 'active' ? 'Deactivate' : 'Already Inactive'}
                        disabled={a.status !== 'active'}
                      >
                        <Trash2 className={`w-4 h-4 ${a.status === 'active' ? 'text-red-400' : 'text-gray-300'}`} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Admin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col max-h-[90vh] overflow-hidden animate-fade-in shadow-xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-brand-text text-lg">Create New Admin</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input className="input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="label">Mobile Number *</label>
                <input className="input" required maxLength={10} value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
              </div>
              <div>
                <label className="label">Password *</label>
                <input className="input" required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div>
                <label className="label">State</label>
                <select 
                  className="input" 
                  value={selectedState} 
                  onChange={e => setSelectedState(e.target.value)}
                >
                  <option value="">-- Select State --</option>
                  {states.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {selectedState && (
                <div>
                  <label className="label">Assigned Districts (Multi-Select)</label>
                  <div className="border border-gray-200 rounded-xl max-h-48 overflow-y-auto p-2 bg-gray-50/50">
                    <div className="grid grid-cols-2 gap-2">
                      {stateDistricts.map(d => {
                        const isSelected = form.districts.includes(d.name);
                        return (
                          <div 
                            key={d.id} 
                            onClick={() => toggleDistrict(d.name)}
                            className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors text-sm ${isSelected ? 'bg-brand-green/10 border border-brand-green/30 text-brand-green' : 'hover:bg-gray-100 border border-transparent text-gray-700'}`}
                          >
                            {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-gray-400" />}
                            <span className="truncate">{d.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {form.districts.length > 0 && (
                    <p className="text-xs text-brand-text-muted mt-2">
                      Selected: {form.districts.join(', ')}
                    </p>
                  )}
                </div>
              )}

              <div className="pt-4 flex gap-3 sticky bottom-0 bg-white mt-4 border-t border-gray-100 py-3 -mx-5 -mb-5 px-5 z-10">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {saving ? 'Creating...' : 'Create Admin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
