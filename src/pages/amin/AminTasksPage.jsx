import { serviceRequests } from '../../data/index';
import { statusColor, statusLabel, serviceTypeLabel, formatDate } from '../../utils/helpers';
import { MapPin, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const myTasks = serviceRequests.filter(s => s.assigned_amin === 'A001');

export default function AminTasksPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">{myTasks.length} total assigned tasks</p>
        </div>
      </div>
      <div className="space-y-4">
        {myTasks.map(t => (
          <Link key={t.id} to={`/amin/tasks/${t.id}`} className="card-hover block p-6">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="font-bold text-brand-text text-lg">{serviceTypeLabel(t.service_type)}</h3>
                <p className="text-sm text-brand-text-muted">{t.id}</p>
              </div>
              <span className={`${statusColor(t.status)} flex-shrink-0`}>{statusLabel(t.status)}</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-brand-text-muted">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-brand-green" /> {t.customer_name}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-green" /> {t.district}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formatDate(t.created_at)}</span>
              <span className="font-semibold text-brand-green">₹{t.amount.toLocaleString()}</span>
            </div>
            {t.description && <p className="text-sm text-brand-text-muted mt-3 bg-brand-green-pale/50 px-3 py-2 rounded-lg">{t.description}</p>}
          </Link>
        ))}
      </div>
    </div>
  );
}
