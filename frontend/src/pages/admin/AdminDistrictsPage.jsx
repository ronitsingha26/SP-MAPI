import { useState, useEffect } from 'react';
import { MapPin, Plus, Pencil, Trash2, RefreshCw, CheckCircle2, X, Save, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import api from '../../utils/api';

function DistrictModal({ district, onClose, onSave }) {
  const [form, setForm] = useState({ name: district?.name || '', state: district?.state || 'Bihar' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const STATES = ['Bihar', 'Jharkhand', 'Uttar Pradesh', 'West Bengal', 'Other'];

  const handleSave = async () => {
    if (!form.name.trim()) { setError('District name is required'); return; }
    setSaving(true); setError('');
    try {
      if (district?.id) {
        await api.put(`/admin/districts/${district.id}`, form);
      } else {
        await api.post('/admin/districts', form);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-brand-text">{district ? 'Edit District' : 'Add District'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
        <div className="space-y-4">
          <div><label className="label">District Name *</label>
            <input className="input" placeholder="e.g. Patna" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
          <div><label className="label">State</label>
            <select className="input" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}>
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select></div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center gap-2 disabled:opacity-60">
            <Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDistrictsPage() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null); // null | { district? }

  const fetchDistricts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/districts');
      setDistricts(res.data.districts || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load districts.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDistricts(); }, []);

  const toggleStatus = async (d) => {
    try {
      await api.put(`/admin/districts/${d.id}`, { name: d.name, state: d.state, is_active: !d.is_active });
      setDistricts(prev => prev.map(x => x.id === d.id ? { ...x, is_active: !x.is_active } : x));
    } catch (e) { alert(e.response?.data?.message || 'Failed to update'); }
  };

  return (
    <div className="animate-fade-in">
      {modal && <DistrictModal district={modal.district} onClose={() => setModal(null)} onSave={fetchDistricts} />}

      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><MapPin className="w-6 h-6 text-brand-green" />Districts</h1>
          <p className="page-subtitle">Manage geographical districts for the platform</p>
        </div>
        <button onClick={() => setModal({ district: null })} className="btn-primary">
          <Plus className="w-4 h-4" /> Add District
        </button>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-brand-green animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">⚠️ {error}</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr>
                <th>#</th><th>District Name</th><th>State</th><th>Status</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {districts.map((d, i) => (
                  <tr key={d.id} className="hover:bg-brand-green-pale/20">
                    <td className="text-brand-text-muted">{i + 1}</td>
                    <td className="font-semibold">{d.name}</td>
                    <td className="text-brand-text-muted">{d.state}</td>
                    <td>
                      <button onClick={() => toggleStatus(d)} className="flex items-center gap-1.5 text-sm font-medium" title="Toggle status">
                        {d.is_active !== false
                          ? <><ToggleRight className="w-5 h-5 text-brand-green" /><span className="text-brand-green">Active</span></>
                          : <><ToggleLeft className="w-5 h-5 text-gray-400" /><span className="text-gray-400">Inactive</span></>}
                      </button>
                    </td>
                    <td>
                      <button onClick={() => setModal({ district: d })} className="p-1.5 hover:bg-brand-green-pale rounded-lg text-brand-green">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {districts.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-8 text-brand-text-muted">No districts found. Add one to get started.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
