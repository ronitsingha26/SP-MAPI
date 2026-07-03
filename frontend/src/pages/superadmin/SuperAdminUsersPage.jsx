import { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, UserCircle } from 'lucide-react';
import { statusColor, statusLabel, formatDate } from '../../utils/helpers';
import api from '../../utils/api';

export default function SuperAdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [type, setType] = useState('customers');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/superadmin/users', { params: { type, search, page, limit: 30 } });
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [type, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Users</h1>
          <p className="page-subtitle">View all platform users — customers and amins</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      {/* Type Tabs + Search */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="flex bg-white rounded-xl border border-brand-green-pale p-1">
          {['customers', 'amins'].map(t => (
            <button key={t} onClick={() => { setType(t); setPage(1); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors capitalize ${type === t ? 'bg-brand-green text-white' : 'text-brand-text-muted hover:bg-brand-green-pale'}`}>
              {t}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-brand-green-pale flex-1 max-w-sm">
          <Search className="w-4 h-4 text-brand-text-muted" />
          <input type="text" placeholder="Search by name or mobile..." className="bg-transparent text-sm outline-none flex-1"
            value={search} onChange={e => setSearch(e.target.value)} />
        </form>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>{type === 'amins' ? 'District' : 'District'}</th>
                {type === 'amins' && <th>License</th>}
                {type === 'amins' && <th>Tasks Done</th>}
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={type === 'amins' ? 8 : 6} className="text-center py-8"><RefreshCw className="w-6 h-6 text-brand-green animate-spin mx-auto" /></td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={type === 'amins' ? 8 : 6} className="text-center py-8 text-brand-text-muted">No {type} found.</td></tr>
              ) : users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-green-pale rounded-full flex items-center justify-center font-bold text-brand-green text-sm uppercase">
                        {u.name?.charAt(0)}
                      </div>
                      <span className="font-semibold text-brand-text">{u.name}</span>
                    </div>
                  </td>
                  <td className="font-mono text-sm">{u.mobile}</td>
                  <td className="text-sm text-brand-text-muted">{u.email || '—'}</td>
                  <td className="text-sm">{u.district || u.district_name || '—'}</td>
                  {type === 'amins' && <td className="font-mono text-xs">{u.license_number || '—'}</td>}
                  {type === 'amins' && <td className="text-center font-semibold">{u.tasks_completed || 0}</td>}
                  <td><span className={statusColor(u.status)}>{statusLabel(u.status)}</span></td>
                  <td className="text-xs text-brand-text-muted">{u.created_at ? formatDate(u.created_at) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-4">
        <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-outline py-1.5 px-4 text-sm disabled:opacity-40">← Previous</button>
        <span className="flex items-center px-4 text-sm text-brand-text-muted">Page {page}</span>
        <button disabled={users.length < 30} onClick={() => setPage(p => p + 1)} className="btn-outline py-1.5 px-4 text-sm disabled:opacity-40">Next →</button>
      </div>
    </div>
  );
}
