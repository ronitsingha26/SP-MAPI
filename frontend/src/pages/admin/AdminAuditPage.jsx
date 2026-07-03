import { useState, useEffect } from 'react';
import { FileText, Search, RefreshCw, Filter } from 'lucide-react';
import api from '../../utils/api';

const ACTION_COLOR = {
  ADMIN_CREATED: 'badge-green', ADMIN_DELETED: 'badge-red',
  APPLICATION_STATUS_CHANGED: 'badge-yellow', DISTRICT_CREATED: 'badge-green',
  DISTRICT_UPDATED: 'badge-yellow', LOGIN: 'bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-semibold',
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const limit = 50;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/audit-logs', { params: { page, limit } });
      setLogs(res.data.logs || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load audit logs.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, [page]);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><FileText className="w-6 h-6 text-brand-green" />Audit Logs</h1>
          <p className="page-subtitle">Full activity trail — all admin and system actions</p>
        </div>
        <span className="badge-grey">{total.toLocaleString()} events</span>
      </div>

      <div className="card">
        {loading ? (
          <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-brand-green animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">⚠️ {error}</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="data-table">
                <thead><tr>
                  <th>Timestamp</th><th>Actor</th><th>Action</th><th>Entity</th><th>IP Address</th>
                </tr></thead>
                <tbody>
                  {logs.map((log, i) => (
                    <tr key={log.id || i} className="hover:bg-brand-green-pale/20">
                      <td className="text-xs text-brand-text-muted whitespace-nowrap">
                        {log.created_at ? new Date(log.created_at).toLocaleString('en-IN') : '—'}
                      </td>
                      <td className="font-medium">{log.actor_name || '—'}</td>
                      <td><span className={ACTION_COLOR[log.action] || 'badge-grey'}>{log.action?.replace(/_/g, ' ')}</span></td>
                      <td className="text-brand-text-muted text-sm">{log.entity_type}{log.entity_id ? ` #${log.entity_id?.slice(0, 8)}…` : ''}</td>
                      <td className="text-xs text-brand-text-muted font-mono">{log.ip_address || '—'}</td>
                    </tr>
                  ))}
                  {logs.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-8 text-brand-text-muted">No audit logs found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {total > limit && (
              <div className="flex justify-center gap-2 mt-4 pt-4 border-t border-brand-green-pale">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline text-sm disabled:opacity-40">← Previous</button>
                <span className="text-sm text-brand-text-muted px-4 py-2">Page {page} of {Math.ceil(total / limit)}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / limit)} className="btn-outline text-sm disabled:opacity-40">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
