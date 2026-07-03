import { useState } from 'react';
import { Search } from 'lucide-react';
import { serviceRequests, amins } from '../../data/index';
import { formatDate, statusColor, statusLabel, serviceTypeLabel } from '../../utils/helpers';

export default function AdminServicesPage() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignedAmin, setAssignedAmin] = useState('');

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Requests</h1>
          <p className="page-subtitle">Assign Amins to incoming service requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table */}
        <div className="lg:col-span-2">
          <div className="card !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-green-pale flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-brand-green-pale rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-brand-text-muted" />
                <input type="text" placeholder="Search requests..." className="bg-transparent text-sm outline-none flex-1" />
              </div>
              <select className="input w-36 py-2">
                <option>All Status</option>
                <option>Pending</option>
                <option>Assigned</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div className="divide-y divide-brand-green-pale">
              {serviceRequests.map(s => (
                <div
                  key={s.id}
                  onClick={() => setSelectedRequest(s)}
                  className={`px-5 py-4 cursor-pointer hover:bg-brand-green-pale/40 transition-colors ${selectedRequest?.id === s.id ? 'bg-brand-green-pale' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <p className="font-semibold text-brand-text text-sm">{serviceTypeLabel(s.service_type)}</p>
                      <p className="text-xs text-brand-text-muted">{s.id} · {s.customer_name} · {s.district}</p>
                    </div>
                    <span className={`${statusColor(s.status)} flex-shrink-0`}>{statusLabel(s.status)}</span>
                  </div>
                  <p className="text-xs text-brand-text-muted line-clamp-1">{s.description}</p>
                  {s.amin_name && <p className="text-xs text-brand-green mt-1 font-medium">📐 Amin: {s.amin_name}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div>
          {selectedRequest ? (
            <div className="card p-6 sticky top-20">
              <h3 className="font-bold text-brand-text text-lg mb-4">Request Detail</h3>
              <div className="space-y-3 text-sm mb-6">
                {[
                  ['ID', selectedRequest.id],
                  ['Service', serviceTypeLabel(selectedRequest.service_type)],
                  ['Customer', selectedRequest.customer_name],
                  ['District', selectedRequest.district],
                  ['Amount', `₹${selectedRequest.amount.toLocaleString()}`],
                  ['Date', formatDate(selectedRequest.created_at)],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-brand-text-muted">{label}</span>
                    <span className="font-medium text-brand-text">{val}</span>
                  </div>
                ))}
                <div className="pt-2">
                  <span className="text-brand-text-muted">Status</span>
                  <div className="mt-1"><span className={statusColor(selectedRequest.status)}>{statusLabel(selectedRequest.status)}</span></div>
                </div>
                {selectedRequest.description && (
                  <div className="pt-2">
                    <p className="text-brand-text-muted mb-1">Description</p>
                    <p className="text-brand-text bg-brand-green-pale rounded-lg p-3 text-xs">{selectedRequest.description}</p>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="border-t border-brand-green-pale pt-4 space-y-3">
                  <h4 className="font-semibold text-brand-text text-sm">Assign Amin</h4>
                  <select className="input" value={assignedAmin} onChange={e => setAssignedAmin(e.target.value)}>
                    <option value="">Select an Amin</option>
                    {amins.filter(a => a.status === 'active' && a.district === selectedRequest.district).map(a => (
                      <option key={a.id} value={a.id}>{a.name} ({a.district})</option>
                    ))}
                    {amins.filter(a => a.status === 'active').map(a => (
                      <option key={a.id + '_all'} value={a.id}>{a.name} ({a.district}) — Other</option>
                    ))}
                  </select>
                  <button disabled={!assignedAmin} className="btn-primary w-full justify-center disabled:opacity-50">
                    Assign & Notify
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="card p-8 text-center text-brand-text-muted">
              <p className="text-3xl mb-3">👆</p>
              <p className="text-sm">Click on a service request to view details and assign an Amin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
