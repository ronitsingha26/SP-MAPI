import { useState, useEffect } from 'react';
import { BarChart2, RefreshCw, Search, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatDate, statusColor, statusLabel } from '../../utils/helpers';
import api from '../../utils/api';

export default function AminHistoryPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('completed');

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await api.get('/amin/tasks', { params: { status: filter || undefined } });
        setTasks(res.data.tasks || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load task history.');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [filter]);

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Task History 📊</h1>
          <p className="page-subtitle">View your completed surveys and task records</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-5 flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-brand-green" />
          <div>
            <p className="text-2xl font-bold text-brand-green">{completedCount}</p>
            <p className="text-xs text-brand-text-muted">Completed</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-3">
          <Clock className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-2xl font-bold text-brand-text">{tasks.filter(t => t.status === 'in_progress').length}</p>
            <p className="text-xs text-brand-text-muted">In Progress</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-3">
          <BarChart2 className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-2xl font-bold text-brand-text">{tasks.length}</p>
            <p className="text-xs text-brand-text-muted">Total Tasks</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex bg-white rounded-xl border border-brand-green-pale p-1">
          {[
            { val: '', label: 'All' },
            { val: 'completed', label: 'Completed' },
            { val: 'in_progress', label: 'In Progress' },
            { val: 'assigned', label: 'Assigned' },
          ].map(f => (
            <button key={f.val} onClick={() => setFilter(f.val)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === f.val ? 'bg-brand-green text-white' : 'text-brand-text-muted hover:bg-brand-green-pale'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>App ID</th>
                <th>Service</th>
                <th>Applicant</th>
                <th>District</th>
                <th>Assigned Date</th>
                <th>Status</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8"><RefreshCw className="w-6 h-6 text-brand-green animate-spin mx-auto" /></td></tr>
              ) : tasks.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-brand-text-muted">No tasks found for this filter.</td></tr>
              ) : tasks.map(t => (
                <tr key={t.id}>
                  <td className="font-mono text-xs font-semibold text-brand-green">{t.app_id}</td>
                  <td className="capitalize text-sm">{t.service_type}</td>
                  <td className="font-medium text-sm">{t.applicant_name}</td>
                  <td className="text-sm text-brand-text-muted">{t.district || '—'}</td>
                  <td className="text-xs text-brand-text-muted">{t.amin_assigned_at ? formatDate(t.amin_assigned_at) : '—'}</td>
                  <td><span className={statusColor(t.status)}>{statusLabel(t.status)}</span></td>
                  <td className="text-xs text-brand-text-muted max-w-[200px] truncate">{t.admin_remark || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
