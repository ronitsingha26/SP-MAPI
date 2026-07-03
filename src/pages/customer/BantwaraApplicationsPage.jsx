import { Link } from 'react-router-dom';
import { GitBranch, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getApplicationsByType, STATUS_CONFIG, STATUS_STEPS, formatDisplayDate } from '../../utils/storage';

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG.bantwara[status] || { label: status, color: 'badge-grey' };
  return <span className={cfg.color}>{cfg.label}</span>;
}

function StatusTimeline({ status }) {
  const steps = STATUS_STEPS.bantwara;
  const currentIdx = steps.indexOf(status);
  const isRejected = status === 'rejected';
  return (
    <div className="flex items-center gap-1 mt-2 flex-wrap">
      {steps.map((step, idx) => {
        const isDone = idx <= currentIdx && !isRejected;
        const cfg = STATUS_CONFIG.bantwara[step];
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

export default function BantwaraApplicationsPage() {
  const { currentUser } = useAuth();
  const allApps = getApplicationsByType('bantwara');
  const myApps = currentUser ? allApps.filter(a => a.email === currentUser.email || a.userId === currentUser.id) : [];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2"><GitBranch className="w-6 h-6 text-yellow-600" /> Bantwara Applications</h1>
          <p className="page-subtitle">Track your division survey requests</p>
        </div>
        <Link to="/services/bantwara" className="btn-primary">+ New Bantwara Request</Link>
      </div>

      {myApps.length === 0 ? (
        <div className="card text-center py-14">
          <div className="text-5xl mb-4">🏡</div>
          <p className="font-semibold text-brand-text mb-2">No Bantwara applications yet</p>
          <p className="text-sm text-brand-text-muted mb-6">Submit a division survey request to get started.</p>
          <Link to="/services/bantwara" className="btn-primary">Start Bantwara Registration</Link>
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
                    {app.status === 'rejected' && <span className="badge-red">Rejected</span>}
                  </div>
                  <p className="text-sm font-medium text-brand-text">{app.name} · {app.village}, {app.district}</p>
                  <p className="text-xs text-brand-text-muted mt-1">Submitted: {formatDisplayDate(app.createdAt)}</p>
                  {app.remark && <p className="text-xs text-brand-text-muted mt-1 italic">Remark: {app.remark}</p>}
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
