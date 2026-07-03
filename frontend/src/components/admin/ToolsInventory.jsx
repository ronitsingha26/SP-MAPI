import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

function ToolModal({ tool, onClose, onSave }) {
  const [form, setForm] = useState({
    name: tool?.name || '',
    description: tool?.description || '',
    stock_quantity: tool?.stock_quantity || 0,
    rental_price: tool?.rental_price || 0,
    is_active: tool?.is_active !== false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Tool name is required'); return; }
    setSaving(true); setError('');
    try {
      if (tool?.id) {
        await api.put(`/admin/tools/${tool.id}`, form);
      } else {
        await api.post('/admin/tools', form);
      }
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">{tool ? 'Edit Tool' : 'Add Tool'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
        
        <div className="space-y-4">
          <div>
            <label className="label">Tool Name *</label>
            <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Measuring Tape" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input resize-none" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional details..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Stock Quantity</label>
              <input className="input" type="number" min="0" value={form.stock_quantity} onChange={e => setForm(f => ({ ...f, stock_quantity: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <label className="label">Rental Price (₹)</label>
              <input className="input" type="number" min="0" value={form.rental_price} onChange={e => setForm(f => ({ ...f, rental_price: e.target.value }))} placeholder="0.00" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="tool_active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-brand-green" />
            <label htmlFor="tool_active" className="text-sm font-medium text-brand-text">Active (Available for rent)</label>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center gap-2 disabled:opacity-60">
            <Save className="w-4 h-4" />{saving ? 'Saving…' : 'Save Tool'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ToolsInventory() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingTool, setEditingTool] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchTools = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/tools');
      setTools(res.data.tools || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tool?')) return;
    try {
      await api.delete(`/admin/tools/${id}`);
      fetchTools();
    } catch (err) {
      alert('Failed to delete tool');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading inventory...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Amin Tools Inventory</h2>
          <p className="text-sm text-gray-500 mt-1">Manage physical tools and their rental prices.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="btn-primary gap-2">
          <Plus className="w-4 h-4" /> Add Tool
        </button>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6">{error}</div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-brand-green-pale overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-green-pale/30 border-b border-brand-green-pale">
                <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Tool Name</th>
                <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Stock</th>
                <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Rental Price</th>
                <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tools.map(tool => (
                <tr key={tool.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-brand-text">{tool.name}</p>
                    <p className="text-xs text-brand-text-muted mt-0.5 truncate max-w-[250px]">{tool.description || 'No description'}</p>
                  </td>
                  <td className="p-4">
                    <span className={`font-semibold ${tool.stock_quantity > 0 ? 'text-gray-900' : 'text-red-500'}`}>
                      {tool.stock_quantity}
                    </span>
                  </td>
                  <td className="p-4 font-medium">₹{Number(tool.rental_price).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${tool.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {tool.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingTool(tool)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(tool.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tools.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No tools found in inventory. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {(isAdding || editingTool) && (
        <ToolModal
          tool={editingTool}
          onClose={() => { setIsAdding(false); setEditingTool(null); }}
          onSave={() => { fetchTools(); }}
        />
      )}
    </div>
  );
}
