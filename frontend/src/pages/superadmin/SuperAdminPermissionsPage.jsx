import { useState, useEffect } from 'react';
import { Shield, Lock, Users, UserCheck, Settings, RefreshCw, X, Plus, Edit2, Trash2 } from 'lucide-react';
import api from '../../utils/api';

const ICONS = {
  superadmin: { icon: Shield, color: 'bg-purple-100 text-purple-600' },
  admin: { icon: Users, color: 'bg-brand-green-pale text-brand-green' },
  amin: { icon: UserCheck, color: 'bg-brand-yellow-pale text-yellow-600' },
  customer: { icon: Lock, color: 'bg-blue-50 text-blue-600' }
};

export default function SuperAdminPermissionsPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleForm, setRoleForm] = useState({ name: '', description: '', permissions: [] });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resRoles, resPerms] = await Promise.all([
        api.get('/superadmin/roles'),
        api.get('/superadmin/permissions')
      ]);

      const rolesData = resRoles.data.roles || [];
      // Fetch details for each role to get its permissions
      const detailedRoles = await Promise.all(rolesData.map(async r => {
        const detailRes = await api.get(`/superadmin/roles/${r.id}`);
        return detailRes.data.role;
      }));

      setRoles(detailedRoles);
      setPermissions(resPerms.data.permissions || []);
    } catch (err) {
      alert('Failed to load RBAC data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveRole = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await api.put(`/superadmin/roles/${editingRole.id}`, roleForm);
      } else {
        await api.post('/superadmin/roles', roleForm);
      }
      setShowRoleModal(false);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving role');
    }
  };

  const handleDeleteRole = async (id) => {
    if(!window.confirm('Are you sure you want to delete this role?')) return;
    try {
      await api.delete(`/superadmin/roles/${id}`);
      fetchData();
    } catch (err) {
      alert('Error deleting role');
    }
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setRoleForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions.map(p => p.id)
    });
    setShowRoleModal(true);
  };

  const openAddModal = () => {
    setEditingRole(null);
    setRoleForm({ name: '', description: '', permissions: [] });
    setShowRoleModal(true);
  };

  const togglePermission = (permId) => {
    setRoleForm(prev => {
      if (prev.permissions.includes(permId)) {
        return { ...prev, permissions: prev.permissions.filter(id => id !== permId) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permId] };
      }
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>;
  }

  // Group permissions by module for the matrix
  const modules = [...new Set(permissions.map(p => p.module))];

  return (
    <div className="animate-fade-in">
      <div className="page-header flex justify-between items-end">
        <div>
          <h1 className="page-title">Role & Permissions 🔐</h1>
          <p className="page-subtitle">Manage role-based access control (RBAC)</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Role
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {roles.map(r => {
          const style = ICONS[r.name.toLowerCase()] || { icon: Settings, color: 'bg-gray-100 text-gray-600' };
          const Icon = style.icon;
          return (
            <div key={r.id} className="card p-6 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => openEditModal(r)} className="text-gray-400 hover:text-brand-green"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDeleteRole(r.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.color.split(' ')[0]}`}>
                  <Icon className={`w-5 h-5 ${style.color.split(' ')[1]}`} />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text capitalize">{r.name}</h3>
                  <p className="text-xs text-brand-text-muted">{r.permissions.length} permissions</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4">{r.description}</p>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                {r.permissions.map(p => (
                  <div key={p.id} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-green flex-shrink-0" />
                    <span className="text-brand-text capitalize">{p.name.replace(/_/g, ' ')}</span>
                  </div>
                ))}
                {r.permissions.length === 0 && <span className="text-xs text-gray-400">No permissions</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Permission Matrix */}
      <div className="card p-6">
        <h2 className="font-bold text-brand-text mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-green" /> Permission Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Permission</th>
                <th>Module</th>
                {roles.map(r => <th key={r.id} className="text-center capitalize">{r.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {permissions.map(p => (
                <tr key={p.id}>
                  <td className="font-medium text-sm capitalize">{p.name.replace(/_/g, ' ')}</td>
                  <td><span className="badge-grey">{p.module}</span></td>
                  {roles.map(r => {
                    const hasPerm = r.permissions.some(rp => rp.id === p.id);
                    return (
                      <td key={`${r.id}-${p.id}`} className="text-center">
                        {hasPerm ? <span className="text-brand-green text-lg">✓</span> : <span className="text-gray-300">✕</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Form Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <h2 className="font-bold text-lg">{editingRole ? 'Edit Role' : 'Create Role'}</h2>
              <button onClick={() => setShowRoleModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            
            <div className="p-5 overflow-y-auto">
              <form id="roleForm" onSubmit={handleSaveRole} className="space-y-4">
                <div>
                  <label className="label">Role Name *</label>
                  <input required className="input" value={roleForm.name} onChange={e => setRoleForm({...roleForm, name: e.target.value})} placeholder="e.g. manager" />
                </div>
                <div>
                  <label className="label">Description</label>
                  <input className="input" value={roleForm.description} onChange={e => setRoleForm({...roleForm, description: e.target.value})} />
                </div>
                
                <div className="pt-4">
                  <h3 className="font-bold text-sm mb-3">Assign Permissions</h3>
                  {modules.map(mod => (
                    <div key={mod} className="mb-4">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{mod}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {permissions.filter(p => p.module === mod).map(p => (
                          <label key={p.id} className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded border border-gray-100 cursor-pointer hover:bg-brand-green-pale">
                            <input 
                              type="checkbox" 
                              checked={roleForm.permissions.includes(p.id)}
                              onChange={() => togglePermission(p.id)}
                              className="text-brand-green rounded border-gray-300 focus:ring-brand-green"
                            />
                            <span className="capitalize">{p.name.replace(/_/g, ' ')}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </form>
            </div>

            <div className="p-5 border-t border-gray-100 shrink-0 flex gap-3">
              <button type="button" onClick={() => setShowRoleModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" form="roleForm" className="btn-primary flex-1">Save Role</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
