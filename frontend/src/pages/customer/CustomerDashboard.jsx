import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Wrench, FileText, ArrowRight, ClipboardList, Map, GitBranch, RefreshCw, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const STATUS_LABEL = {
  draft: 'Draft', pending: 'Pending', under_review: 'Under Review',
  approved: 'Approved', assigned: 'Assigned', in_progress: 'In Progress',
  completed: 'Completed', delivered: 'Delivered', rejected: 'Rejected', cancelled: 'Cancelled',
  submitted: 'Submitted', verification: 'Verification', processing: 'Processing',
  map_preparation: 'Map Preparation', ready: 'Ready',
};
const STATUS_COLOR = {
  draft: 'badge-grey', pending: 'badge-yellow', under_review: 'badge-yellow',
  approved: 'badge-green', assigned: 'badge-yellow', in_progress: 'badge-blue',
  completed: 'badge-green', delivered: 'badge-green', rejected: 'badge-red', cancelled: 'badge-grey',
  submitted: 'badge-yellow', verification: 'badge-yellow', processing: 'badge-yellow',
  map_preparation: 'badge-yellow', ready: 'badge-green',
};

export default function CustomerDashboard() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, completed: 0 });
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, appsRes] = await Promise.all([
          api.get('/applications/customer/dashboard'),
          api.get('/applications')
        ]);
        if (dashRes.data.stats) setStats(dashRes.data.stats);
        setRecentApps((appsRes.data.applications || []).slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (!currentUser) return null;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Good Morning, {currentUser.name?.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">Here's an overview of your account activity</p>
        </div>
        <Link to="/customer/services" className="btn-primary">
          <Plus className="w-4 h-4" /> New Application
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <RefreshCw className="w-8 h-8 text-brand-green animate-spin" />
        </div>
      ) : error ? (
        <div className="p-6 text-center text-red-500 card">⚠️ {error}</div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Applications', value: stats.total || 0, color: 'bg-brand-green-pale text-brand-green', icon: FileText },
              { label: 'Pending', value: stats.pending || 0, color: 'bg-brand-yellow-pale text-yellow-700', icon: Wrench },
              { label: 'Approved', value: stats.approved || 0, color: 'bg-blue-50 text-blue-600', icon: Building2 },
              { label: 'Completed', value: stats.completed || 0, color: 'bg-emerald-50 text-emerald-600', icon: ClipboardList },
            ].map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="card-hover p-6 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color.split(' ')[0]}`}>
                  <Icon className={`w-6 h-6 ${color.split(' ')[1]}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-text">{value}</p>
                  <p className="text-sm text-brand-text-muted">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Apply — 4 Services */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { to: '/customer/services/mapi', icon: ClipboardList, label: 'Apply for Mapi', desc: 'Land Measurement', color: 'bg-brand-green-pale text-brand-green' },
              { to: '/customer/services/bantwara', icon: GitBranch, label: 'Apply for Bantwara', desc: 'Division Survey', color: 'bg-brand-yellow-pale text-yellow-600' },
              { to: '/customer/services/map', icon: Map, label: 'Request Map', desc: 'Digital Map Request', color: 'bg-blue-50 text-blue-500' },
              { to: '/customer/services/tools', icon: Wrench, label: 'Amin Tools', desc: 'Request Survey Tools', color: 'bg-purple-50 text-purple-500' },
            ].map(({ to, icon: Icon, label, desc, color }) => (
              <Link key={to} to={to} className="card-hover flex items-center gap-4 p-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color.split(' ')[0]}`}>
                  <Icon className={`w-6 h-6 ${color.split(' ')[1]}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-text">{label}</p>
                  <p className="text-xs text-brand-text-muted">{desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-text-muted" />
              </Link>
            ))}
          </div>

          {/* Recent Applications */}
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-brand-text text-lg">Recent Applications</h2>
              <Link to="/customer/applications" className="text-sm text-brand-green font-semibold hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {recentApps.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-brand-text-muted mb-4">You have no active applications.</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Link to="/customer/services/mapi" className="btn-primary text-sm">+ Mapi Registration</Link>
                  <Link to="/customer/services/bantwara" className="btn-outline text-sm">+ Bantwara</Link>
                </div>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>App ID</th>
                      <th>Type</th>
                      <th>District</th>
                      <th>Submitted</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApps.map(app => (
                      <tr key={app.id}>
                        <td className="font-mono text-xs font-semibold text-brand-green">{app.app_id}</td>
                        <td className="capitalize">{app.service_type}</td>
                        <td className="text-brand-text-muted">{app.district || '—'}</td>
                        <td className="text-brand-text-muted">{new Date(app.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td>
                          <span className={STATUS_COLOR[app.status] || 'badge-grey'}>
                            {STATUS_LABEL[app.status] || app.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
