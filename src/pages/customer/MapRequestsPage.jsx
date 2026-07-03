import { Link } from 'react-router-dom';
import { Map, CheckCircle2, Clock, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApplicationsByType, STATUS_CONFIG, STATUS_STEPS, formatDisplayDate } from '../../utils/storage';

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG.map[status] || { label: status, color: 'badge-grey' };
  return <span className={cfg.color}>{cfg.label}</span>;
}

function StatusTimeline({ status }) {
  const steps = STATUS_STEPS.map;
  const currentIdx = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      {steps.map((step, idx) => {
        const isDone = idx <= currentIdx;
        const cfg = STATUS_CONFIG.map[step];
        return (
          <div key={step} className="flex items-center gap-1">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isDone ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400'}`}>
              {isDone ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              <span className="hidden sm:inline">{cfg?.label || step}</span>
            </div>
            {idx < steps.length - 1 && <div className={`h-px w-3 ${isDone ? 'bg-brand-green' : 'bg-gray-200'}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function MapRequestsPage() {
  const { currentUser } = useAuth();
  const allApps = getApplicationsByType('map');
  const myApps = currentUser ? allApps.filter(a => a.email === currentUser.email || a.userId === currentUser.id) : [];

  const canDownload = (status) => ['ready', 'delivered', 'completed'].includes(status);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><Map className="w-6 h-6 text-blue-500" /> Map Requests</h1>
          <p className="page-subtitle">Track your digital map requests</p>
        </div>
        <Link to="/services/provide-map" className="btn-primary">+ New Map Request</Link>
      </div>

      {myApps.length === 0 ? (
        <div className="card text-center py-14">
          <div className="text-5xl mb-4">🗺️</div>
          <p className="font-semibold text-brand-text mb-2">No map requests yet</p>
          <p className="text-sm text-brand-text-muted mb-6">Request a digital map for your land plot.</p>
          <Link to="/services/provide-map" className="btn-primary">Request a Map</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myApps.map(app => (
            <div key={app.appId} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-mono text-sm font-bold text-brand-green">{app.appId}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-sm font-medium text-brand-text">{app.name} · {app.village}, {app.district}</p>
                  <p className="text-xs text-brand-text-muted mt-1">Submitted: {formatDisplayDate(app.createdAt)}</p>
                  {app.remark && <p className="text-xs text-brand-text-muted mt-1 italic">Remark: {app.remark}</p>}
                  {(app.thanaNumber || app.sheetNumber || app.landType || app.thanaName || app.sheetName) && (
                    <p className="text-xs text-brand-text-muted mt-1">
                      Thana No: {app.thanaNumber || app.thanaName || '—'} · Sheet No: {app.sheetNumber || app.sheetName || '—'} · Land Type: {app.landType || '—'}
                    </p>
                  )}
                </div>
                {canDownload(app.status) && (
                  <a
                    href={app.mapDownloadUrl || '#'}
                    className={`btn-outline text-sm flex items-center gap-2 ${!app.mapDownloadUrl ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <Download className="w-4 h-4" /> Download Map
                  </a>
                )}
              </div>
              <StatusTimeline status={app.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
