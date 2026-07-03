import { useState, useEffect } from 'react';
import { Search, RefreshCw, CheckCircle2 } from 'lucide-react';
import { formatDate, statusColor, statusLabel, serviceTypeLabel, formatCurrency } from '../../utils/helpers';
import api from '../../utils/api';

export default function AdminServicesPage() {
  const [requests, setRequests] = useState([]);
  const [amins, setAmins] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [assignedAmin, setAssignedAmin] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, aminsRes] = await Promise.all([
        api.get('/admin/applications'),
        api.get('/admin/amins')
      ]);
      setRequests(reqRes.data.applications || []);
      setAmins(aminsRes.data.amins || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async () => {
    if (!assignedAmin || !selectedRequest) return;
    setAssigning(true);
    setError('');
    setSuccess('');
    try {
      await api.post(`/admin/applications/${selectedRequest.id}/assign-amin`, { amin_id: assignedAmin });
      setSuccess('Amin assigned successfully!');
      fetchData(); // Refresh list
      setSelectedRequest(prev => ({ ...prev, status: 'assigned', assigned_amin_id: assignedAmin }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign Amin.');
    } finally {
      setAssigning(false);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = r.app_id?.toLowerCase().includes(searchLower) || 
                          r.applicant_name?.toLowerCase().includes(searchLower) ||
                          r.applicant_mobile?.includes(searchLower);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Service Requests</h1>
          <p className="page-subtitle">Assign Amins to incoming service requests</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}
      {success && <div className="mb-4 p-4 bg-brand-green-pale border border-brand-green-light rounded-xl text-brand-green text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table List */}
        <div className="lg:col-span-2">
          <div className="card !p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-brand-green-pale flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 bg-brand-green-pale rounded-xl px-3 py-2">
                <Search className="w-4 h-4 text-brand-text-muted" />
                <input 
                  type="text" 
                  placeholder="Search by ID, Name or Mobile..." 
                  className="bg-transparent text-sm outline-none flex-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select className="input w-36 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="pending">Pending</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            {loading ? (
              <div className="flex justify-center p-12"><RefreshCw className="w-6 h-6 text-brand-green animate-spin" /></div>
            ) : filteredRequests.length === 0 ? (
              <p className="text-center text-brand-text-muted p-12">No requests found.</p>
            ) : (
              <div className="divide-y divide-brand-green-pale max-h-[600px] overflow-y-auto">
                {filteredRequests.map(s => (
                  <div
                    key={s.id}
                    onClick={() => { setSelectedRequest(s); setSuccess(''); setError(''); setAssignedAmin(''); }}
                    className={`px-5 py-4 cursor-pointer hover:bg-brand-green-pale/40 transition-colors ${selectedRequest?.id === s.id ? 'bg-brand-green-pale' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-semibold text-brand-text text-sm">{serviceTypeLabel(s.service_type)}</p>
                        <p className="text-xs text-brand-text-muted">{s.app_id} · {s.applicant_name} · {s.district}</p>
                      </div>
                      <span className={`${statusColor(s.status)} flex-shrink-0`}>{statusLabel(s.status)}</span>
                    </div>
                    {s.amin_name && <p className="text-xs text-brand-green mt-1 font-medium">📐 Amin: {s.amin_name}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Panel */}
        <div>
          {selectedRequest ? (
            <div className="card p-6 sticky top-20">
              <h3 className="font-bold text-brand-text text-lg mb-4">Request Detail</h3>
              <div className="space-y-3 text-sm mb-6">
                {[
                  ['ID', selectedRequest.app_id],
                  ['Service', serviceTypeLabel(selectedRequest.service_type)],
                  ['Customer', selectedRequest.applicant_name],
                  ['Mobile', selectedRequest.applicant_mobile],
                  ['District', selectedRequest.district],
                  ['Payment Status', selectedRequest.payment_status || 'Pending'],
                  ['Date', formatDate(selectedRequest.created_at)],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-brand-text-muted">{label}</span>
                    <span className="font-medium text-brand-text">{val}</span>
                  </div>
                ))}
                <div className="pt-2 flex justify-between items-center">
                  <span className="text-brand-text-muted">Status</span>
                  <div><span className={statusColor(selectedRequest.status)}>{statusLabel(selectedRequest.status)}</span></div>
                </div>
              </div>

              {(selectedRequest.status === 'submitted' || selectedRequest.status === 'pending') && (
                <div className="border-t border-brand-green-pale pt-4 space-y-3">
                  <h4 className="font-semibold text-brand-text text-sm">Assign Amin</h4>
                  <select className="input" value={assignedAmin} onChange={e => setAssignedAmin(e.target.value)}>
                    <option value="">Select an Amin</option>
                    <optgroup label="Recommended (In this Block)">
                      {amins.filter(a => a.status === 'active' && selectedRequest.block_id && a.operating_block_ids?.includes(selectedRequest.block_id)).map(a => (
                        <option key={a.id} value={a.id}>{a.name} ({a.district_name})</option>
                      ))}
                    </optgroup>
                    <optgroup label="Other Amins">
                      {amins.filter(a => a.status === 'active' && !(selectedRequest.block_id && a.operating_block_ids?.includes(selectedRequest.block_id))).map(a => (
                        <option key={a.id + '_all'} value={a.id}>{a.name} ({a.district_name})</option>
                      ))}
                    </optgroup>
                  </select>
                  <button 
                    onClick={handleAssign}
                    disabled={!assignedAmin || assigning} 
                    className="btn-primary w-full justify-center disabled:opacity-50"
                  >
                    {assigning ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Assign & Notify'}
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
