import { Link } from 'react-router-dom';
import { FileText, ArrowRight, ClipboardList, Map, GitBranch } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApplicationsByUser, STATUS_CONFIG, formatDisplayDate } from '../../utils/storage';

function StatusBadge({ type, status }) {
  const cfg = STATUS_CONFIG[type]?.[status] || { label: status, color: 'badge-grey' };
  return <span className={cfg.color}>{cfg.label}</span>;
}

function TypeIcon({ type }) {
  if (type === 'mapi') return <ClipboardList className="w-4 h-4 text-brand-green" />;
  if (type === 'bantwara') return <GitBranch className="w-4 h-4 text-yellow-600" />;
  return <Map className="w-4 h-4 text-blue-500" />;
}

const TYPE_LABELS = { mapi: 'Mapi Registration', bantwara: 'Bantwara Registration', map: 'Map Request' };
const TYPE_LINKS  = { mapi: '/customer/mapi', bantwara: '/customer/bantwara', map: '/customer/map-requests' };

export default function CustomerApplicationsPage() {
  const { currentUser } = useAuth();
  const applications = currentUser ? getApplicationsByUser(currentUser.id) : [];

  const total = applications.length;
  const pending = applications.filter(a => ['submitted','verification','processing','map_preparation'].includes(a.status)).length;
  const approved = applications.filter(a => ['approved','ready','delivered'].includes(a.status)).length;
  const completed = applications.filter(a => a.status === 'completed').length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">All your service applications in one place</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/services/mapi" className="btn-primary text-sm">+ Mapi Registration</Link>
          <Link to="/services/bantwara" className="btn-outline text-sm">+ Bantwara</Link>
          <Link to="/services/provide-map" className="btn-outline text-sm">+ Map Request</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applications', value: total, color: 'bg-brand-green-pale text-brand-green' },
          { label: 'Pending', value: pending, color: 'bg-brand-yellow-pale text-yellow-700' },
          { label: 'Approved', value: approved, color: 'bg-blue-50 text-blue-600' },
          { label: 'Completed', value: completed, color: 'bg-emerald-50 text-emerald-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center p-6">
            <p className={`text-3xl font-bold ${color.split(' ')[1]}`}>{value}</p>
            <p className="text-sm text-brand-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Shortcut cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { type: 'mapi', icon: ClipboardList, color: 'brand-green', desc: 'Land Measurement requests' },
          { type: 'bantwara', icon: GitBranch, color: 'yellow', desc: 'Division Survey requests' },
          { type: 'map', icon: Map, color: 'blue', desc: 'Digital Map requests' },
        ].map(({ type, icon: Icon, color, desc }) => {
          const count = applications.filter(a => a.serviceType === type).length;
          return (
            <Link key={type} to={TYPE_LINKS[type]}
              className="card-hover flex items-center gap-4 p-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color === 'brand-green' ? 'bg-brand-green-pale' : color === 'yellow' ? 'bg-brand-yellow-pale' : 'bg-blue-50'}`}>
                <Icon className={`w-6 h-6 ${color === 'brand-green' ? 'text-brand-green' : color === 'yellow' ? 'text-yellow-600' : 'text-blue-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-brand-text">{TYPE_LABELS[type]}</p>
                <p className="text-xs text-brand-text-muted">{desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-brand-text">{count}</span>
                <ArrowRight className="w-4 h-4 text-brand-text-muted" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* All applications table */}
      <div className="card">
        <h2 className="font-bold text-brand-text text-lg mb-5 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-green" /> All Applications
        </h2>
        {applications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-semibold text-brand-text mb-2">No applications yet</p>
            <p className="text-sm text-brand-text-muted mb-6">Submit your first service application to get started.</p>
            <Link to="/services/mapi" className="btn-primary">Start Mapi Registration</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr>
                <th>App ID</th><th>Service Type</th><th>District</th>
                <th>Submitted</th><th>Status</th><th></th>
              </tr></thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.appId}>
                    <td className="font-mono text-xs font-semibold text-brand-green">{app.appId}</td>
                    <td>
                      <span className="flex items-center gap-1.5">
                        <TypeIcon type={app.serviceType} /> {TYPE_LABELS[app.serviceType]}
                      </span>
                    </td>
                    <td className="text-brand-text-muted">{app.district || '—'}</td>
                    <td className="text-brand-text-muted">{formatDisplayDate(app.createdAt)}</td>
                    <td><StatusBadge type={app.serviceType} status={app.status} /></td>
                    <td>
                      <Link to={TYPE_LINKS[app.serviceType]} className="text-xs text-brand-green font-semibold hover:underline">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
