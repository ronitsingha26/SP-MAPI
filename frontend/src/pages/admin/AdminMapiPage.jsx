import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Filter, Search, UserCheck, RefreshCw, ChevronDown, Eye, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import AssignAminModal from '../../components/admin/AssignAminModal';
import AminReportsViewer from '../../components/admin/AminReportsViewer';
import ApplicationDocumentsViewer from '../../components/admin/ApplicationDocumentsViewer';

const STATUS_LABEL = {
  pending: 'Submitted', under_review: 'Verification', in_progress: 'Processing',
  approved: 'Approved', rejected: 'Rejected', completed: 'Completed', assigned: 'Assigned', withdrawn: 'Withdrawn'
};
const STATUS_COLOR = {
  pending: 'badge-grey', under_review: 'badge-yellow', in_progress: 'badge-yellow',
  approved: 'badge-green', rejected: 'badge-red', completed: 'badge-blue', assigned: 'badge-yellow', withdrawn: 'badge-red'
};
const MAPI_STATUSES = ['pending', 'under_review', 'in_progress', 'approved', 'rejected', 'completed', 'assigned'];

export default function AdminMapiPage() {
  const [apps, setApps] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [assigningAppId, setAssigningAppId] = useState(null);
  const { currentUser } = useAuth();

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ service_type: 'mapi', limit: 100 });
      if (filter !== 'all') params.set('status', filter);
      if (search) params.set('search', search);
      const res = await api.get(`/admin/applications?${params}`);
      setApps(res.data.applications || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchApps, 300);
    return () => clearTimeout(timer);
  }, [fetchApps]);

  const handleStatusUpdate = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await api.put(`/admin/applications/${appId}/status`, { status: newStatus });
      setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/applications/${id}`);
      fetchApps();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete application.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-brand-green" /> Mapi Applications
          </h1>
          <p className="page-subtitle">Review and manage land measurement requests</p>
        </div>
        <button onClick={fetchApps} className="btn-outline text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2 bg-brand-green-pale rounded-xl px-3 py-2 max-w-sm flex-1">
            <Search className="w-4 h-4 text-brand-text-muted" />
            <input
              type="text" placeholder="Search by ID, Name, or Mobile..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-text-muted" />
            <select className="input py-2 bg-brand-green-pale border-none" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              {MAPI_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">⚠️ {error}</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>App ID & Date</th>
                  <th>Applicant</th>
                  <th>Location</th>
                  <th>Amin</th>
                  <th>Status</th>
                  <th>Update Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {apps.map(app => (
                  <>
                    <tr 
                      key={app.id}
                      onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                      className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                    >
                      <td>
                        <p className="font-mono text-xs font-semibold text-brand-green">{app.app_id}</p>
                        <p className="text-xs text-brand-text-muted">{new Date(app.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </td>
                      <td>
                        <p className="font-medium text-brand-text">{app.applicant_name}</p>
                        <p className="text-xs text-brand-text-muted">{app.applicant_mobile}</p>
                      </td>
                      <td>
                        <p className="text-sm text-brand-text-muted">{app.district || '—'}</p>
                      </td>
                      <td className="text-xs">
                        {app.amin_name
                          ? <span className="text-brand-green font-medium">{app.amin_name}</span>
                          : <span className="text-yellow-600 font-semibold">Not Assigned</span>}
                      </td>
                      <td>
                        <span className={STATUS_COLOR[app.status] || 'badge-grey'}>{STATUS_LABEL[app.status] || app.status}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                          <select
                            className={`text-xs border border-gray-200 rounded-lg p-1.5 ${app.status === 'withdrawn' ? 'bg-gray-100 text-gray-500' : 'bg-white'}`}
                            value={app.status}
                            disabled={updatingId === app.id || app.status === 'withdrawn'}
                            onChange={e => handleStatusUpdate(app.id, e.target.value)}
                          >
                            {app.status === 'withdrawn' && <option value="withdrawn">{STATUS_LABEL['withdrawn'] || 'Withdrawn'}</option>}
                            {MAPI_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                          </select>
                          {updatingId === app.id && <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-green" />}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 hover:bg-brand-green-pale rounded-lg text-brand-green transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedId(expandedId === app.id ? null : app.id);
                            }}
                            title="View Details"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${expandedId === app.id ? 'rotate-180' : ''}`} />
                          </button>
                          {(currentUser?.role === 'superadmin' || currentUser?.role === 'admin') && (
                            <button
                              className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(app.id);
                              }}
                              title="Delete Application"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedId === app.id && (
                      <tr key={`${app.id}-expanded`} className="bg-brand-green-pale/30">
                        <td colSpan="7" className="p-4">
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                            <div><span className="text-brand-text-muted text-xs">Email</span><p className="font-medium">{app.applicant_email || '—'}</p></div>
                            <div><span className="text-brand-text-muted text-xs">Payment</span><p className="font-medium capitalize">{app.payment_status || '—'}</p></div>
                            <div><span className="text-brand-text-muted text-xs">Service</span><p className="font-medium capitalize">{app.service_type}</p></div>
                            <div><span className="text-brand-text-muted text-xs">Updated</span><p className="font-medium">{app.updated_at ? new Date(app.updated_at).toLocaleDateString('en-IN') : '—'}</p></div>
                            <AminReportsViewer documents={app.documents || []} />
                          </div>
                          <ApplicationDocumentsViewer documents={app.documents || []} />
                          {!app.amin_name && (
                            <div className="flex justify-end mt-4 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => setAssigningAppId(app.id)}
                                className="px-3 py-1.5 bg-brand-green text-white text-xs font-semibold rounded-lg hover:bg-brand-green-dark transition-colors flex items-center gap-1.5"
                              >
                                <UserCheck className="w-3.5 h-3.5" /> Assign Amin
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
                {apps.length === 0 && (
                  <tr><td colSpan="7" className="text-center py-12 text-brand-text-muted">No Mapi applications found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-4 text-sm text-brand-text-muted">Total: {apps.length} applications</div>
      </div>

      {assigningAppId && (
        <AssignAminModal
          applicationId={assigningAppId}
          onClose={() => setAssigningAppId(null)}
          onSuccess={() => {
            setAssigningAppId(null);
            fetchApps();
          }}
        />
      )}
    </div>
  );
}
