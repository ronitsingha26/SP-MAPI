import { useState, useEffect } from 'react';
import { Users, Search, RefreshCw, UserCircle, Phone, Mail, Calendar } from 'lucide-react';
import api from '../../utils/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('customers');
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users', { params: { type, page, limit: 30, search: search || undefined } });
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users.');
    } finally { setLoading(false); }
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
          <h1 className="page-title flex items-center gap-2"><Users className="w-6 h-6 text-brand-green" />All Users</h1>
          <p className="page-subtitle">Platform-wide user directory</p>
        </div>
      </div>

      {/* Type Filter */}
      <div className="card mb-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2">
          {['customers', 'admins', 'amins'].map(t => (
            <button key={t} onClick={() => { setType(t); setPage(1); }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${type === t ? 'bg-brand-green text-white' : 'bg-brand-green-pale text-brand-text-muted hover:text-brand-green'}`}>
              {t}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
            <input className="input pl-9 py-2 text-sm" placeholder="Search by name/mobile…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary py-2 px-4 text-sm">Search</button>
        </form>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-brand-green animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">⚠️ {error}</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr>
                <th>Name</th><th>Mobile</th><th>Email</th><th>District</th><th>Registered</th><th>Status</th>
              </tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-brand-green-pale/20">
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-green-pale rounded-full flex items-center justify-center flex-shrink-0">
                          <UserCircle className="w-4 h-4 text-brand-green" />
                        </div>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="text-brand-text-muted"><div className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{u.mobile || '—'}</div></td>
                    <td className="text-brand-text-muted"><div className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{u.email || '—'}</div></td>
                    <td className="text-brand-text-muted">{u.district || '—'}</td>
                    <td className="text-brand-text-muted text-sm">
                      <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('en-IN') : '—'}
                      </div>
                    </td>
                    <td>
                      <span className={u.status === 'active' ? 'badge-green' : 'badge-grey'}>{u.status || 'active'}</span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-8 text-brand-text-muted">No {type} found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
