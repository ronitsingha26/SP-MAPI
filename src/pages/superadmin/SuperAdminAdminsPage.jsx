import { admins } from '../../data/index';
import { statusColor, statusLabel } from '../../utils/helpers';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function SuperAdminAdminsPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Management</h1>
          <p className="page-subtitle">Create and manage district administrators</p>
        </div>
        <button className="btn-primary"><Plus className="w-4 h-4" /> Create Admin</button>
      </div>
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
              {admins.map(a => (
                <tr key={a.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-green-pale rounded-full flex items-center justify-center font-bold text-brand-green text-sm">
                        {a.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-brand-text">{a.name}</span>
                    </div>
                  </td>
                  <td className="text-brand-text-muted text-sm">{a.email}</td>
                  <td className="font-mono text-sm">{a.mobile}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {a.districts.map(d => <span key={d} className="badge-grey text-xs">{d}</span>)}
                    </div>
                  </td>
                  <td><span className={statusColor(a.status)}>{statusLabel(a.status)}</span></td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-brand-yellow-pale rounded-lg transition-colors"><Edit2 className="w-4 h-4 text-yellow-600" /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
