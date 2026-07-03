import { useState, useEffect } from 'react';
import { Plus, X, RefreshCw } from 'lucide-react';
import { statusColor, statusLabel } from '../../utils/helpers';
import api from '../../utils/api';

export default function AdminAminsPage() {
  const [amins, setAmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', district: '', license_number: '' });
  
  const fetchAmins = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/amins');
      setAmins(res.data.amins || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch Amins.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmins();
  }, []);

  const handleAddAmin = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post('/admin/amins', form);
      setShowModal(false);
      setForm({ name: '', mobile: '', email: '', password: '', district: '', license_number: '' });
      fetchAmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add Amin');
    } finally {
      setAdding(false);
    }
  };

  const toggleStatus = async (amin) => {
    const newStatus = amin.status === 'active' ? 'inactive' : 'active';
    try {
      await api.put(`/admin/amins/${amin.id}`, { status: newStatus });
      fetchAmins();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (aminId) => {
    if (window.confirm('Are you sure you want to completely delete this Amin? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/amins/${aminId}`);
        fetchAmins();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete Amin.');
      }
    }
  };

  return (
    <div className="animate-fade-in relative">
      <div className="page-header">
        <div>
          <h1 className="page-title">Amin Management</h1>
          <p className="page-subtitle">{amins.length} registered field surveyors</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Amin
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      {loading ? (
        <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>
      ) : amins.length === 0 ? (
        <p className="text-center text-brand-text-muted p-12">No Amins registered in your districts yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {amins.map(a => (
            <div key={a.id} className="card hover:shadow-hover transition-all duration-200">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-green-pale rounded-full flex items-center justify-center font-bold text-brand-green text-lg flex-shrink-0 uppercase">
                  {a.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-brand-text truncate">{a.name}</h3>
                    <span className={statusColor(a.status)}>{statusLabel(a.status)}</span>
                  </div>
                  <p className="text-xs text-brand-text-muted truncate">{a.license_number || 'No License'}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-brand-text-muted">District</span><span className="font-medium text-brand-text">{a.district_name || '—'}</span></div>
                <div className="flex justify-between"><span className="text-brand-text-muted">Mobile</span><span className="font-medium text-brand-text">{a.mobile}</span></div>
                <div className="flex justify-between"><span className="text-brand-text-muted">Tasks Done</span><span className="font-bold text-brand-green">{a.tasks_completed}</span></div>
                <div className="flex justify-between"><span className="text-brand-text-muted">Active Tasks</span><span className="font-medium text-brand-text">{a.active_tasks}</span></div>
                <div className="flex justify-between"><span className="text-brand-text-muted">Rating</span>
                  <span className="font-semibold text-yellow-600">⭐ {a.rating || 'N/A'}</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-brand-green-pale">
                <button 
                  onClick={() => toggleStatus(a)}
                  className={`flex-1 py-2 text-xs justify-center rounded-xl font-semibold transition-all ${a.status === 'active' ? 'bg-orange-50 text-orange-500 hover:bg-orange-100' : 'bg-brand-green-pale text-brand-green hover:bg-brand-green hover:text-white'}`}
                >
                  {a.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleDelete(a.id)}
                  className="flex-1 py-2 text-xs justify-center rounded-xl font-semibold transition-all bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Amin Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-fade-in shadow-xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="font-bold text-brand-text text-lg">Add New Amin</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAmin} className="p-5 space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
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
                <label className="label">District *</label>
                <input className="input" required placeholder="E.g. Patna" value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
              </div>
              <div>
                <label className="label">License Number</label>
                <input className="input" value={form.license_number} onChange={e => setForm({...form, license_number: e.target.value})} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={adding} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {adding ? 'Adding...' : 'Save Amin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
