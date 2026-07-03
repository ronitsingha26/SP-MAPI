import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, ToggleLeft, ToggleRight, X, RefreshCw, Search } from 'lucide-react';
import api from '../../utils/api';

export default function SuperAdminDistrictsPage() {
  const [activeTab, setActiveTab] = useState('districts');
  
  // Data
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [panchayats, setPanchayats] = useState([]);
  const [villages, setVillages] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'districts') {
        const res = await api.get('/superadmin/districts');
        setDistricts(res.data.districts || []);
      } else if (activeTab === 'blocks') {
        const [resBlocks, resDistricts] = await Promise.all([
          api.get('/superadmin/blocks'),
          api.get('/superadmin/districts')
        ]);
        setBlocks(resBlocks.data.blocks || []);
        setDistricts(resDistricts.data.districts || []);
      } else if (activeTab === 'panchayats') {
        const [resPanchayats, resBlocks] = await Promise.all([
          api.get('/superadmin/panchayats'),
          api.get('/superadmin/blocks')
        ]);
        setPanchayats(resPanchayats.data.panchayats || []);
        setBlocks(resBlocks.data.blocks || []);
      } else if (activeTab === 'villages') {
        const [resVillages, resPanchayats] = await Promise.all([
          api.get('/superadmin/villages'),
          api.get('/superadmin/panchayats')
        ]);
        setVillages(resVillages.data.villages || []);
        setPanchayats(resPanchayats.data.panchayats || []);
      }
    } catch (err) {
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'districts') {
        if (editingData) await api.put(`/superadmin/districts/${editingData.id}`, form);
        else await api.post('/superadmin/districts', form);
      } else if (activeTab === 'blocks') {
        if (editingData) await api.put(`/superadmin/blocks/${editingData.id}`, form);
        else await api.post('/superadmin/blocks', form);
      } else if (activeTab === 'panchayats') {
        if (editingData) await api.put(`/superadmin/panchayats/${editingData.id}`, form);
        else await api.post('/superadmin/panchayats', form);
      } else if (activeTab === 'villages') {
        if (editingData) await api.put(`/superadmin/villages/${editingData.id}`, form);
        else await api.post('/superadmin/villages', form);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save');
    }
  };

  const handleToggle = async (id, isActive) => {
    try {
      if (activeTab === 'districts') await api.put(`/superadmin/districts/${id}`, { is_active: !isActive });
      else if (activeTab === 'blocks') await api.put(`/superadmin/blocks/${id}`, { is_active: !isActive });
      else if (activeTab === 'panchayats') await api.put(`/superadmin/panchayats/${id}`, { is_active: !isActive });
      else if (activeTab === 'villages') await api.put(`/superadmin/villages/${id}`, { is_active: !isActive });
      fetchData();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const openAddModal = () => {
    setEditingData(null);
    if (activeTab === 'districts') setForm({ name: '', state: 'Bihar' });
    else if (activeTab === 'blocks') setForm({ name: '', district_id: '' });
    else if (activeTab === 'panchayats') setForm({ name: '', block_id: '' });
    else if (activeTab === 'villages') setForm({ name: '', panchayat_id: '' });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setEditingData(item);
    setForm({ ...item });
    setShowModal(true);
  };

  const getFilteredData = () => {
    let list = [];
    if (activeTab === 'districts') list = districts;
    else if (activeTab === 'blocks') list = blocks;
    else if (activeTab === 'panchayats') list = panchayats;
    else if (activeTab === 'villages') list = villages;

    if (!search) return list;
    return list.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
  };

  const filteredData = getFilteredData();

  return (
    <div className="animate-fade-in relative">
      <div className="page-header flex justify-between items-end">
        <div>
          <h1 className="page-title">Location Hierarchy</h1>
          <p className="page-subtitle">Manage Districts, Blocks, Panchayats, and Villages</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add {activeTab.slice(0,-1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
        </button>
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">
        {['districts', 'blocks', 'panchayats', 'villages'].map(tab => (
          <button
            key={tab}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${activeTab === tab ? 'border-brand-green text-brand-green' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-brand-green-pale flex-1 max-w-sm">
          <Search className="w-4 h-4 text-brand-text-muted" />
          <input type="text" placeholder={`Search ${activeTab}...`} className="bg-transparent text-sm outline-none flex-1" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                {activeTab === 'districts' && <th>State</th>}
                {activeTab === 'blocks' && <th>District</th>}
                {activeTab === 'panchayats' && <th>Block</th>}
                {activeTab === 'villages' && <th>Panchayat</th>}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8"><RefreshCw className="w-6 h-6 text-brand-green animate-spin mx-auto" /></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-brand-text-muted">No records found.</td></tr>
              ) : filteredData.map(item => (
                <tr key={item.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-brand-green" />
                      <span className="font-semibold text-brand-text">{item.name}</span>
                    </div>
                  </td>
                  {activeTab === 'districts' && <td>{item.state}</td>}
                  {activeTab === 'blocks' && <td>{item.district_name}</td>}
                  {activeTab === 'panchayats' && <td>{item.block_name}</td>}
                  {activeTab === 'villages' && <td>{item.panchayat_name}</td>}
                  <td>
                    <span className={item.is_active ? 'badge-green' : 'badge-red'}>
                      {item.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(item)} className="p-1.5 hover:bg-brand-green-pale rounded-lg">
                        <Edit2 className="w-4 h-4 text-brand-green" />
                      </button>
                      <button onClick={() => handleToggle(item.id, item.is_active)} className="p-1.5 hover:bg-brand-green-pale rounded-lg">
                        {item.is_active ? <ToggleRight className="w-5 h-5 text-brand-green" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">{editingData ? 'Edit' : 'Add'} {activeTab.slice(0,-1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label">Name *</label>
                <input required className="input" value={form.name || ''} onChange={e => setForm({...form, name: e.target.value})} />
              </div>

              {activeTab === 'districts' && (
                <div>
                  <label className="label">State *</label>
                  <select className="input" value={form.state} onChange={e => setForm({...form, state: e.target.value})}>
                    <option value="Bihar">Bihar</option>
                    <option value="Jharkhand">Jharkhand</option>
                  </select>
                </div>
              )}

              {activeTab === 'blocks' && (
                <div>
                  <label className="label">District *</label>
                  <select required className="input" value={form.district_id || ''} onChange={e => setForm({...form, district_id: e.target.value})}>
                    <option value="">Select District...</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              )}

              {activeTab === 'panchayats' && (
                <div>
                  <label className="label">Block *</label>
                  <select required className="input" value={form.block_id || ''} onChange={e => setForm({...form, block_id: e.target.value})}>
                    <option value="">Select Block...</option>
                    {blocks.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
              )}

              {activeTab === 'villages' && (
                <div>
                  <label className="label">Panchayat *</label>
                  <select required className="input" value={form.panchayat_id || ''} onChange={e => setForm({...form, panchayat_id: e.target.value})}>
                    <option value="">Select Panchayat...</option>
                    {panchayats.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
