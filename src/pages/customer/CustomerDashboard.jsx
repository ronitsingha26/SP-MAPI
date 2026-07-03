import { Link } from 'react-router-dom';
import { Building2, Wrench, FileText, ArrowRight, ClipboardList, Map, GitBranch } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApplicationsByUser, STATUS_CONFIG, formatDisplayDate } from '../../utils/storage';

export default function CustomerDashboard() {
  const { currentUser } = useAuth();
  
  // Safety fallback if accessed without login (should be blocked by protected route)
  if (!currentUser) return null;

  const myApplications = getApplicationsByUser(currentUser.id);
  const recentApps = myApplications.slice(0, 5);

  const total = myApplications.length;
  const pending = myApplications.filter(a => ['submitted','verification','processing','map_preparation'].includes(a.status)).length;
  const approved = myApplications.filter(a => ['approved','ready','delivered'].includes(a.status)).length;
  const completed = myApplications.filter(a => a.status === 'completed').length;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Good Morning, {currentUser.name.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">Here's an overview of your account activity</p>
        </div>
        <Link to="/customer/applications" className="btn-primary">
          View All Applications
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applications', value: total, color: 'bg-brand-green-pale text-brand-green', icon: FileText },
          { label: 'Pending', value: pending, color: 'bg-brand-yellow-pale text-yellow-700', icon: Wrench },
          { label: 'Approved', value: approved, color: 'bg-blue-50 text-blue-600', icon: Building2 },
          { label: 'Completed', value: completed, color: 'bg-emerald-50 text-emerald-600', icon: ClipboardList },
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <Link to="/services/mapi" className="btn-primary text-sm">+ Mapi Registration</Link>
                <Link to="/services/bantwara" className="btn-outline text-sm">+ Bantwara</Link>
              </div>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>App ID</th>
                    <th>Type</th>
                    <th>Submitted</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApps.map(app => (
                    <tr key={app.appId}>
                      <td className="font-mono text-xs font-semibold text-brand-green">{app.appId}</td>
                      <td className="capitalize">{app.serviceType}</td>
                      <td className="text-brand-text-muted">{formatDisplayDate(app.createdAt)}</td>
                      <td>
                        {(() => {
                          const cfg = STATUS_CONFIG[app.serviceType]?.[app.status] || { label: app.status, color: 'badge-grey' };
                          return <span className={cfg.color}>{cfg.label}</span>;
                        })()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
