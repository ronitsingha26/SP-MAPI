import { useState, useEffect } from 'react';
import { Settings, RefreshCw, Save, Wrench, Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../utils/api';

export default function SuperAdminServicesPage() {
  const [services, setServices] = useState([]);
  const [pricingRules, setPricingRules] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '', display_name: '', description: '', base_price: 0, unit_type: 'sqft', unit_price: 0, is_active: true
  });

  const [showRuleForm, setShowRuleForm] = useState(false);
  const [ruleFormData, setRuleFormData] = useState({
    service_id: '', district_id: '', modifier_type: 'multiplier', modifier_value: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resServices, resRules] = await Promise.all([
        api.get('/superadmin/services'),
        api.get('/superadmin/pricing-rules')
      ]);
      setServices(resServices.data.services || []);
      setPricingRules(resRules.data.rules || []);
    } catch (err) {
      console.error(err);
      alert('Failed to load services and pricing');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await api.put(`/superadmin/services/${editingService.id}`, serviceFormData);
      } else {
        await api.post('/superadmin/services', serviceFormData);
      }
      setShowServiceForm(false);
      setEditingService(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving service');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/superadmin/services/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting service');
    }
  };

  const handleSaveRule = async (e) => {
    e.preventDefault();
    try {
      await api.post('/superadmin/pricing-rules', ruleFormData);
      setShowRuleForm(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving rule');
    }
  };

  const handleDeleteRule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this pricing rule?')) return;
    try {
      await api.delete(`/superadmin/pricing-rules/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting rule');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 text-brand-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">Service & Pricing Configuration ⚙️</h1>
          <p className="page-subtitle">Manage service types, dynamic pricing rules, and availability</p>
        </div>
        <button onClick={() => {
          setEditingService(null);
          setServiceFormData({ name: '', display_name: '', description: '', base_price: 0, unit_type: 'sqft', unit_price: 0, is_active: true });
          setShowServiceForm(true);
        }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {showServiceForm && (
        <div className="card p-6 mb-8 border-l-4 border-brand-green">
          <h2 className="font-bold text-lg mb-4">{editingService ? 'Edit Service' : 'New Service'}</h2>
          <form onSubmit={handleSaveService} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code Name (e.g. mapi)</label>
              <input type="text" className="input-field" required value={serviceFormData.name} onChange={e => setServiceFormData({...serviceFormData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Display Name</label>
              <input type="text" className="input-field" required value={serviceFormData.display_name} onChange={e => setServiceFormData({...serviceFormData, display_name: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input type="text" className="input-field" value={serviceFormData.description} onChange={e => setServiceFormData({...serviceFormData, description: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Base Price (₹)</label>
              <input type="number" className="input-field" required value={serviceFormData.base_price} onChange={e => setServiceFormData({...serviceFormData, base_price: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit Type</label>
              <select className="input-field" value={serviceFormData.unit_type} onChange={e => setServiceFormData({...serviceFormData, unit_type: e.target.value})}>
                <option value="sqft">Sq.Ft</option>
                <option value="acre">Acre</option>
                <option value="katha">Katha</option>
                <option value="fixed">Fixed Rate</option>
              </select>
            </div>
            {serviceFormData.unit_type !== 'fixed' && (
              <div>
                <label className="block text-sm font-medium mb-1">Unit Price (₹)</label>
                <input type="number" className="input-field" value={serviceFormData.unit_price} onChange={e => setServiceFormData({...serviceFormData, unit_price: e.target.value})} />
              </div>
            )}
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" checked={serviceFormData.is_active} onChange={e => setServiceFormData({...serviceFormData, is_active: e.target.checked})} className="w-4 h-4 text-brand-green border-gray-300 rounded focus:ring-brand-green" />
              <label className="text-sm font-medium">Is Active</label>
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowServiceForm(false)} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Save Service</button>
            </div>
          </form>
        </div>
      )}

      {/* Active Services */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {services.map(s => (
          <div key={s.id} className="card p-6 hover:shadow-hover transition-shadow relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <button onClick={() => {
                setEditingService(s);
                setServiceFormData({ ...s });
                setShowServiceForm(true);
              }} className="text-gray-400 hover:text-brand-green">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDeleteService(s.id)} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div>
                <h3 className="font-bold text-brand-text">{s.display_name}</h3>
                <span className={s.is_active ? "badge-green text-xs" : "badge-grey text-xs"}>
                  {s.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <p className="text-sm text-brand-text-muted mb-4 line-clamp-2">{s.description}</p>
            <div className="border-t border-brand-green-pale pt-4 flex justify-between">
              <div>
                <p className="text-xs text-brand-text-muted mb-1">Code</p>
                <p className="font-mono text-sm font-semibold text-brand-green">{s.name.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-brand-text-muted mb-1">Base Price</p>
                <p className="text-sm font-bold text-brand-text">₹{s.base_price}</p>
              </div>
              {s.unit_type !== 'fixed' && (
                <div className="text-right">
                  <p className="text-xs text-brand-text-muted mb-1">Per {s.unit_type}</p>
                  <p className="text-sm font-bold text-brand-text">₹{s.unit_price}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Rules Config */}
      <div className="card p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="font-bold text-brand-text mb-2 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-brand-green" /> Pricing Rules
            </h2>
            <p className="text-sm text-brand-text-muted">
              Configure modifiers (multipliers or flat additions) to pricing based on district or other criteria.
            </p>
          </div>
          <button onClick={() => setShowRuleForm(true)} className="btn-secondary text-sm flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Rule
          </button>
        </div>

        {showRuleForm && (
          <div className="bg-brand-green-pale p-4 rounded-xl mb-6">
            <form onSubmit={handleSaveRule} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              <div>
                <label className="block text-xs font-medium mb-1">Service</label>
                <select className="input-field text-sm py-2" required value={ruleFormData.service_id} onChange={e => setRuleFormData({...ruleFormData, service_id: e.target.value})}>
                  <option value="">Select Service...</option>
                  {services.map(s => <option key={s.id} value={s.id}>{s.display_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">District ID (Leave empty for global)</label>
                <input type="text" className="input-field text-sm py-2" placeholder="ID or empty" value={ruleFormData.district_id} onChange={e => setRuleFormData({...ruleFormData, district_id: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Modifier Type</label>
                <select className="input-field text-sm py-2" value={ruleFormData.modifier_type} onChange={e => setRuleFormData({...ruleFormData, modifier_type: e.target.value})}>
                  <option value="multiplier">Multiplier (e.g. 1.2x)</option>
                  <option value="fixed_addition">Fixed Addition (+₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Value</label>
                <input type="number" step="0.01" className="input-field text-sm py-2" required value={ruleFormData.modifier_value} onChange={e => setRuleFormData({...ruleFormData, modifier_value: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary w-full py-2 text-sm">Save</button>
                <button type="button" onClick={() => setShowRuleForm(false)} className="btn-secondary w-full py-2 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>District (Scope)</th>
                <th>Modifier Type</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pricingRules.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-4 text-gray-500">No custom pricing rules defined. Default pricing is used.</td></tr>
              ) : (
                pricingRules.map(r => (
                  <tr key={r.id}>
                    <td className="font-semibold">{r.service_name}</td>
                    <td>{r.district_name || <span className="badge-grey">Global</span>}</td>
                    <td>{r.modifier_type === 'multiplier' ? 'Multiplier (x)' : 'Fixed Addition (+)'}</td>
                    <td className="font-mono font-bold">
                      {r.modifier_type === 'multiplier' ? `${r.modifier_value}x` : `+₹${r.modifier_value}`}
                    </td>
                    <td>
                      <button onClick={() => handleDeleteRule(r.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
