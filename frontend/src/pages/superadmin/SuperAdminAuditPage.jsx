import { useState, useEffect } from 'react';
import { FileText, Search, RefreshCw, Filter } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import api from '../../utils/api';

export default function SuperAdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/superadmin/audit-logs', { params: { page, limit: 30 } });
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [page]);

  const filtered = actionFilter
    ? logs.filter(l => l.action?.toLowerCase().includes(actionFilter.toLowerCase()))
    : logs;

  const actionColor = (action) => {
    if (action?.includes('CREATE') || action?.includes('CREATED')) return 'badge-green';
    if (action?.includes('DELETE') || action?.includes('DELETED')) return 'badge-red';
    if (action?.includes('UPDATE') || action?.includes('UPDATED')) return 'badge-yellow';
    if (action?.includes('ASSIGN')) return 'badge-blue';
    return 'badge-grey';
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Audit Logs 📋</h1>
          <p className="page-subtitle">Track all administrative actions across the platform ({total} total)</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      {/* Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-brand-green-pale flex-1 max-w-sm">
          <Filter className="w-4 h-4 text-brand-text-muted" />
          <input type="text" placeholder="Filter by action (e.g. ADMIN_CREATED)..." className="bg-transparent text-sm outline-none flex-1"
            value={actionFilter} onChange={e => setActionFilter(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Actor</th>
                <th>Role</th>
                <th>Action</th>
                <th>Entity</th>
                <th>IP Address</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8"><RefreshCw className="w-6 h-6 text-brand-green animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-brand-text-muted">No audit logs found.</td></tr>
              ) : filtered.map(log => (
                <tr key={log.id}>
                  <td className="font-mono text-xs text-brand-text-muted">{log.id}</td>
                  <td className="font-medium text-sm">{log.actor_name || '—'}</td>
                  <td><span className="badge-grey text-xs capitalize">{log.actor_type || '—'}</span></td>
                  <td><span className={`${actionColor(log.action)} text-xs`}>{log.action}</span></td>
                  <td className="text-xs text-brand-text-muted">
                    {log.entity_type && <span className="capitalize">{log.entity_type}</span>}
                    {log.entity_id && <span className="font-mono ml-1">#{log.entity_id?.substring(0, 8)}</span>}
                  </td>
                  <td className="font-mono text-xs text-brand-text-muted">{log.ip_address || '—'}</td>
                  <td className="text-xs text-brand-text-muted">{log.created_at ? formatDate(log.created_at) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-brand-text-muted">Showing {filtered.length} of {total} logs</p>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn-outline py-1.5 px-4 text-sm disabled:opacity-40">← Previous</button>
          <span className="flex items-center px-4 text-sm text-brand-text-muted">Page {page}</span>
          <button disabled={logs.length < 30} onClick={() => setPage(p => p + 1)} className="btn-outline py-1.5 px-4 text-sm disabled:opacity-40">Next →</button>
        </div>
      </div>
    </div>
  );
}
