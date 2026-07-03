import { useState, useEffect } from 'react';
import { Shield, Plus, RefreshCw, Trash2 } from 'lucide-react';
import api from '../../utils/api';

export default function AdminPermissionsPage() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [rolesRes, permsRes] = await Promise.all([
          api.get('/admin/roles').catch(() => ({ data: { roles: [] } })),
          api.get('/admin/permissions').catch(() => ({ data: { permissions: [] } })),
        ]);
        setRoles(rolesRes.data.roles || []);
        setPermissions(permsRes.data.permissions || []);
      } catch (err) {
        setError('Failed to load permissions data.');
      } finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="flex justify-center py-24"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Shield className="w-6 h-6 text-brand-green" />Roles & Permissions</h1>
          <p className="page-subtitle">Manage access control roles and permissions</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">ℹ️ {error} — Showing read-only view.</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-bold text-brand-text mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-brand-green" />Roles ({roles.length})</h2>
          {roles.length === 0 ? (
            <div className="text-center py-8 text-brand-text-muted">
              <Shield className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No roles configured yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {roles.map(r => (
                <div key={r.id} className="flex items-center justify-between p-3 bg-brand-green-pale/50 rounded-xl border border-brand-green-pale">
                  <div>
                    <p className="font-semibold text-brand-text text-sm">{r.name}</p>
                    {r.description && <p className="text-xs text-brand-text-muted">{r.description}</p>}
                  </div>
                  <span className="badge-green">{r.permissions?.length || 0} perms</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-bold text-brand-text mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-yellow-600" />Permissions ({permissions.length})</h2>
          {permissions.length === 0 ? (
            <div className="text-center py-8 text-brand-text-muted">
              <p>No permissions defined yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {permissions.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-brand-yellow-pale/50 rounded-xl border border-brand-yellow-light">
                  <div>
                    <p className="font-semibold text-brand-text text-sm font-mono">{p.name}</p>
                    {p.description && <p className="text-xs text-brand-text-muted">{p.description}</p>}
                  </div>
                  <span className="badge-yellow capitalize">{p.resource || 'global'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="card mt-6 p-6 bg-brand-green-pale/30 border border-brand-green-pale">
        <h3 className="font-semibold text-brand-text mb-3">Default System Roles</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          {['superadmin', 'admin', 'amin', 'customer'].map(role => (
            <div key={role} className="bg-white rounded-xl p-3 text-center shadow-soft border border-brand-green-pale">
              <p className="font-bold text-brand-green capitalize">{role}</p>
              <p className="text-xs text-brand-text-muted mt-1">System role</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
