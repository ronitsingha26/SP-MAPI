import { useState, useEffect } from 'react';
import { statusColor, statusLabel, formatDate } from '../../utils/helpers';
import { Search, RefreshCw } from 'lucide-react';
import api from '../../utils/api';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/customers', { params: { search: search || undefined } });
      setCustomers(res.data.customers || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCustomers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const filtered = statusFilter
    ? customers.filter(c => c.status === statusFilter)
    : customers;

  const searchFiltered = search
    ? filtered.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile?.includes(search))
    : filtered;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Customers</h1>
          <p className="page-subtitle">{customers.length} registered customers</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 bg-white border border-brand-green-light rounded-xl px-4 py-3 shadow-soft">
          <Search className="w-4 h-4 text-brand-text-muted" />
          <input type="text" placeholder="Search by name or mobile..." className="bg-transparent text-sm outline-none flex-1" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-40" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </form>

      <div className="card !p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Mobile</th>
                <th>District</th>
                <th>Joined</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center py-8"><RefreshCw className="w-6 h-6 text-brand-green animate-spin mx-auto" /></td></tr>
              ) : searchFiltered.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-brand-text-muted">No customers found.</td></tr>
              ) : searchFiltered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-green-pale rounded-full flex items-center justify-center font-semibold text-brand-green text-sm flex-shrink-0">
                        {c.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-brand-text text-sm">{c.name}</p>
                        <p className="text-xs text-brand-text-muted">{c.email || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-sm">+91 {c.mobile}</td>
                  <td>{c.district || '—'}</td>
                  <td className="text-xs text-brand-text-muted">{c.created_at ? formatDate(c.created_at) : '—'}</td>
                  <td><span className={statusColor(c.status)}>{statusLabel(c.status)}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
