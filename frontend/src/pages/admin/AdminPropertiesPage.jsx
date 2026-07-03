import { useState, useEffect } from 'react';
import { Building2, Plus, Edit2, Trash2, MapPin, Search } from 'lucide-react';
import api from '../../utils/api';

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', district: '', block_name: '', area_sqft: '', price: '', plot_type: 'residential', status: 'available' });
  const [editingId, setEditingId] = useState(null);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/properties');
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/properties/${editingId}`, form);
      } else {
        await api.post('/admin/properties', form);
      }
      setShowModal(false);
      setEditingId(null);
      setForm({ title: '', district: '', block_name: '', area_sqft: '', price: '', plot_type: 'residential', status: 'available' });
      fetchProperties();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save property');
    }
  };

  const handleEdit = (prop) => {
    setForm(prop);
    setEditingId(prop.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    try {
      await api.delete(`/admin/properties/${id}`);
      fetchProperties();
    } catch (err) {
      alert('Failed to delete property');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Properties & Plots</h1>
          <p className="text-brand-text-muted text-sm mt-1">Manage land plots available for sale</p>
        </div>
        <button onClick={() => { setEditingId(null); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-brand-text-muted col-span-full">No properties found.</p>
        ) : (
          properties.map(prop => (
            <div key={prop.id} className="bg-white rounded-2xl shadow-soft overflow-hidden flex flex-col">
              <div className="h-48 bg-brand-green-pale relative">
                {prop.images?.length > 0 ? (
                  <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-brand-green opacity-50">
                    <Building2 className="w-16 h-16" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-xs font-bold text-brand-green shadow-sm capitalize">
                  {prop.status}
                </div>
                <div className="absolute top-3 left-3 bg-brand-yellow px-3 py-1 rounded-full text-xs font-bold text-brand-text shadow-sm capitalize">
                  {prop.plot_type}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-brand-text mb-2 line-clamp-1">{prop.title}</h3>
                <div className="flex items-center gap-2 text-sm text-brand-text-muted mb-4">
                  <MapPin className="w-4 h-4" /> {prop.block_name}, {prop.district}
                </div>
                <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-brand-text-muted">Price / Area</p>
                    <p className="font-bold text-brand-green text-lg">₹{prop.price} <span className="text-sm font-normal text-brand-text-muted">/ {prop.area_sqft} sqft</span></p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(prop)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(prop.id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-lg">{editingId ? 'Edit Property' : 'Add Property'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5 overflow-y-auto">
              <form id="propertyForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Title / Name *</label>
                  <input className="input" required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. 500 sqft Plot in Patna" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">District *</label>
                    <input className="input" required value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Block / Area *</label>
                    <input className="input" required value={form.block_name} onChange={e => setForm({...form, block_name: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Area (sqft) *</label>
                    <input type="number" step="0.01" className="input" required value={form.area_sqft} onChange={e => setForm({...form, area_sqft: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Price (₹) *</label>
                    <input type="number" step="0.01" className="input" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Type</label>
                    <select className="input" value={form.plot_type} onChange={e => setForm({...form, plot_type: e.target.value})}>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="agricultural">Agricultural</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Status</label>
                    <select className="input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                      <option value="sold">Sold</option>
                    </select>
                  </div>
                </div>
                {/* File upload can be added here later */}
              </form>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              <button type="submit" form="propertyForm" className="btn-primary">Save Property</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
