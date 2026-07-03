import { useState, useEffect } from 'react';
import { Settings, Plus, Pencil, Trash2, RefreshCw, Save, X, AlertCircle, Wrench, FileText } from 'lucide-react';
import api from '../../utils/api';
import ToolsInventory from '../../components/admin/ToolsInventory';

function ServiceModal({ service, onClose, onSave }) {
  const [form, setForm] = useState({ 
    name: service?.name || '', 
    display_name: service?.display_name || '',
    description: service?.description || '', 
    base_price: service?.base_price || 0,
    unit_type: service?.unit_type || 'fixed',
    unit_price: service?.unit_price || 0,
    is_active: service?.is_active !== false 
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Service internal name is required'); return; }
    if (!form.display_name.trim()) { setError('Display name is required'); return; }
    
    setSaving(true); setError('');
    try {
      if (service?.id) {
        await api.put(`/admin/services/${service.id}`, form);
      } else {
        await api.post('/admin/services', form);
      }
      onSave(); onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save.');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">{service ? 'Edit Service Pricing' : 'Add Service'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Internal Name *</label>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. mapi" />
            </div>
            <div>
              <label className="label">Display Name *</label>
              <input className="input" value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} placeholder="e.g. Land Measurement" />
            </div>
          </div>
          
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="p-4 bg-brand-green-pale/20 rounded-xl border border-brand-green-pale space-y-4">
            <h3 className="font-semibold text-sm text-brand-green">Pricing Configuration</h3>
            <div>
              <label className="label">Fixed Base Price (₹)</label>
              <input className="input" type="number" min="0" value={form.base_price} onChange={e => setForm(f => ({ ...f, base_price: e.target.value }))} placeholder="0" />
              <p className="text-xs text-gray-500 mt-1">Fixed cost applied regardless of size.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Dynamic Unit Type</label>
                <select className="input" value={form.unit_type} onChange={e => setForm(f => ({ ...f, unit_type: e.target.value }))}>
                  <option value="fixed">None (Fixed Price Only)</option>
                  <option value="sqft">Per Sq. Ft</option>
                  <option value="acre">Per Acre</option>
                  <option value="katha">Per Katha</option>
                </select>
              </div>
              <div>
                <label className="label">Unit Price (₹)</label>
                <input className="input" type="number" min="0" value={form.unit_price} onChange={e => setForm(f => ({ ...f, unit_price: e.target.value }))} placeholder="0" disabled={form.unit_type === 'fixed'} />
              </div>
            </div>
            <p className="text-xs text-gray-500">Total = Base Price + (Unit Price × Quantity)</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-brand-green" />
            <label htmlFor="is_active" className="text-sm font-medium text-brand-text">Active (visible to users)</label>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center gap-2 disabled:opacity-60">
            <Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save Config'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminServicesConfigPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/services');
      setServices(res.data.services || res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load services.');
    } finally { setLoading(false); }
  };

  useEffect(() => { 
    if (activeTab === 'services') {
      fetchServices(); 
    }
  }, [activeTab]);

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service type?')) return;
    try {
      await api.delete(`/admin/services/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (e) { alert(e.response?.data?.message || 'Failed to delete'); }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header mb-6">
        <div>
          <h1 className="page-title flex items-center gap-2"><Settings className="w-6 h-6 text-brand-green" />Configuration</h1>
          <p className="page-subtitle">Manage service pricing rules and physical tool inventory</p>
        </div>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('services')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'services' ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <FileText className="w-4 h-4" /> Service Pricing
        </button>
        <button 
          onClick={() => setActiveTab('tools')}
          className={`pb-3 font-semibold text-sm flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'tools' ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Wrench className="w-4 h-4" /> Tools Inventory
        </button>
      </div>

      {activeTab === 'services' && (
        <div className="space-y-4">
          {modal && <ServiceModal service={modal.service} onClose={() => setModal(null)} onSave={fetchServices} />}
          
          <div className="flex justify-end">
            <button onClick={() => setModal({ service: null })} className="btn-primary"><Plus className="w-4 h-4" /> Add Service</button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-brand-green-pale overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-brand-green animate-spin" /></div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">⚠️ {error}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-brand-green-pale/30 border-b border-brand-green-pale">
                      <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Service</th>
                      <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Base Price</th>
                      <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Unit Config</th>
                      <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Status</th>
                      <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {services.map(s => (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold text-brand-text">{s.display_name}</p>
                          <p className="text-xs text-gray-500">{s.name}</p>
                        </td>
                        <td className="p-4 font-semibold text-brand-green">₹{Number(s.base_price || 0).toLocaleString()}</td>
                        <td className="p-4 text-sm">
                          {s.unit_type === 'fixed' ? (
                            <span className="text-gray-500">Fixed only</span>
                          ) : (
                            <span>₹{Number(s.unit_price)} per {s.unit_type}</span>
                          )}
                        </td>
                        <td className="p-4"><span className={s.is_active !== false ? 'px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-green-100 text-green-700' : 'px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-gray-100 text-gray-500'}>{s.is_active !== false ? 'Active' : 'Inactive'}</span></td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => setModal({ service: s })} className="p-1.5 hover:bg-brand-green-pale rounded-lg text-brand-green transition-colors"><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => deleteService(s.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {services.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-8 text-brand-text-muted">No services configured yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'tools' && (
        <ToolsInventory />
      )}
    </div>
  );
}
