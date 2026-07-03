import { Link } from 'react-router-dom';
import { ClipboardList, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApplicationsByType, STATUS_CONFIG, STATUS_STEPS, formatDisplayDate } from '../../utils/storage';

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG.mapi[status] || { label: status, color: 'badge-grey' };
  return <span className={cfg.color}>{cfg.label}</span>;
}

function StatusTimeline({ status }) {
  const steps = STATUS_STEPS.mapi;
  const currentIdx = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      {steps.map((step, idx) => {
        const isDone = idx <= currentIdx;
        const isRejected = status === 'rejected';
        const cfg = STATUS_CONFIG.mapi[step];
        return (
          <div key={step} className="flex items-center gap-1">
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
              isDone && !isRejected ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {isDone && !isRejected ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
              <span className="hidden sm:inline">{cfg?.label || step}</span>
            </div>
            {idx < steps.length - 1 && <div className={`h-px w-3 ${isDone && !isRejected ? 'bg-brand-green' : 'bg-gray-200'}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function MapiApplicationsPage() {
  const { currentUser } = useAuth();
  const allMapi = getApplicationsByType('mapi');
  const myApps = currentUser
    ? allMapi.filter(a => a.email === currentUser.email || a.userId === currentUser.id)
    : [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><ClipboardList className="w-6 h-6 text-brand-green" /> Mapi Applications</h1>
          <p className="page-subtitle">Track your land measurement requests</p>
        </div>
        <Link to="/services/mapi" className="btn-primary">+ New Mapi Request</Link>
      </div>

      {myApps.length === 0 ? (
        <div className="card text-center py-14">
          <div className="text-5xl mb-4">📐</div>
          <p className="font-semibold text-brand-text mb-2">No Mapi applications yet</p>
          <p className="text-sm text-brand-text-muted mb-6">Submit a land measurement request to get started.</p>
          <Link to="/services/mapi" className="btn-primary">Start Mapi Registration</Link>
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
                </div>
                <div className="flex items-center gap-2 text-sm text-brand-text-muted">
                  <span className="hidden sm:inline">Block: {app.blockName || '—'}</span>
                </div>
              </div>
              <StatusTimeline status={app.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
