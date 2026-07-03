import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, MapPin, User, Plus } from 'lucide-react';
import { serviceRequests } from '../../data/index';
import { formatDate, statusColor, statusLabel, serviceTypeLabel } from '../../utils/helpers';

const myServices = serviceRequests.filter(s => s.customer_id === 'C001');

const trackingSteps = ['pending', 'assigned', 'in_progress', 'completed'];
const stepLabels = { pending: 'Request Submitted', assigned: 'Amin Assigned', in_progress: 'Work In Progress', completed: 'Completed' };

function TrackingBar({ status }) {
  const idx = trackingSteps.indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-3">
      {trackingSteps.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= idx ? 'bg-brand-green text-white' : 'bg-brand-green-pale text-brand-text-muted'}`}>
              {i < idx ? '✓' : i + 1}
            </div>
            <p className="text-[10px] text-brand-text-muted mt-1 text-center w-16 leading-tight">{stepLabels[step]}</p>
          </div>
          {i < trackingSteps.length - 1 && (
            <div className={`flex-1 h-0.5 mb-4 transition-all ${i < idx ? 'bg-brand-green' : 'bg-brand-green-pale'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CustomerServicesPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Requests</h1>
          <p className="page-subtitle">Track your land measurement and survey requests</p>
        </div>
        <Link to="/customer/services/new" className="btn-primary"><Plus className="w-4 h-4" /> New Request</Link>
      </div>

      <div className="space-y-5">
        {myServices.map(s => (
          <div key={s.id} className="card">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-brand-yellow-pale rounded-xl flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-brand-text">{serviceTypeLabel(s.service_type)}</h3>
                  <p className="text-xs text-brand-text-muted">{s.id} · {formatDate(s.created_at)}</p>
                </div>
              </div>
              <span className={statusColor(s.status)}>{statusLabel(s.status)}</span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-brand-text-muted mb-3">
              <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-brand-green" />{s.district}</span>
              {s.amin_name && <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-brand-green" />Amin: {s.amin_name}</span>}
              <span>₹{s.amount.toLocaleString()}</span>
            </div>

            {s.description && <p className="text-sm text-brand-text-muted bg-brand-green-pale/50 rounded-lg px-3 py-2 mb-4">{s.description}</p>}

            <TrackingBar status={s.status} />
          </div>
        ))}

        {myServices.length === 0 && (
          <div className="card text-center py-16">
            <p className="text-5xl mb-4">📐</p>
            <h3 className="text-xl font-bold text-brand-text mb-2">No Service Requests</h3>
            <p className="text-brand-text-muted mb-6">Book a land measurement or survey service.</p>
            <Link to="/customer/services/new" className="btn-primary">Book a Service</Link>
          </div>
        )}
      </div>
    </div>
  );
}
