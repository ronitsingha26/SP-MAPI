import { useState, useEffect } from 'react';
import { FileText, CheckCircle2, Clock, XCircle, RefreshCw, Eye, Search } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import api, { getFileUrl } from '../../utils/api';

const statusIcon = { approved: CheckCircle2, pending: Clock, rejected: XCircle };
const statusClass = { approved: 'text-brand-green', pending: 'text-yellow-500', rejected: 'text-red-500' };

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  const fetchDocs = async () => {
    setLoading(true);
    try {
      // Fetch documents from applications that have documents
      const res = await api.get('/admin/applications', { params: { limit: 100 } });
      const apps = res.data.applications || [];
      
      // Collect documents from applications (flatten)
      const allDocs = [];
      for (const app of apps) {
        let docs = app.documents;
        if (typeof docs === 'string') { try { docs = JSON.parse(docs); } catch(e) { docs = []; } }
        if (docs && Array.isArray(docs)) {
          docs.forEach(d => {
            allDocs.push({
              ...d,
              applicant_name: app.applicant_name,
              app_id: app.app_id,
              service_type: app.service_type,
              district: app.district,
            });
          });
        }
      }
      setDocs(allDocs);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  const filtered = filter
    ? docs.filter(d => d.verification_status === filter)
    : docs;

  const pendingCount = docs.filter(d => d.verification_status === 'pending').length;
  const approvedCount = docs.filter(d => d.verification_status === 'approved').length;
  const rejectedCount = docs.filter(d => d.verification_status === 'rejected').length;

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents Management</h1>
          <p className="page-subtitle">View and verify uploaded land documents and identity proofs</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card p-5 flex items-center gap-3">
          <Clock className="w-8 h-8 text-yellow-500" />
          <div>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-brand-text-muted">Pending Verification</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-brand-green" />
          <div>
            <p className="text-2xl font-bold text-brand-green">{approvedCount}</p>
            <p className="text-xs text-brand-text-muted">Approved</p>
          </div>
        </div>
        <div className="card p-5 flex items-center gap-3">
          <XCircle className="w-8 h-8 text-red-500" />
          <div>
            <p className="text-2xl font-bold text-red-500">{rejectedCount}</p>
            <p className="text-xs text-brand-text-muted">Rejected</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex bg-white rounded-xl border border-brand-green-pale p-1">
          {[
            { val: '', label: 'All' },
            { val: 'pending', label: 'Pending' },
            { val: 'approved', label: 'Approved' },
            { val: 'rejected', label: 'Rejected' },
          ].map(f => (
            <button key={f.val} onClick={() => setFilter(f.val)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === f.val ? 'bg-brand-green text-white' : 'text-brand-text-muted hover:bg-brand-green-pale'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>Applicant</th>
                <th>App ID</th>
                <th>Service</th>
                <th>Uploaded</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-8"><RefreshCw className="w-6 h-6 text-brand-green animate-spin mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="8" className="text-center py-8 text-brand-text-muted">
                  {docs.length === 0 ? 'No documents uploaded yet. Documents will appear here when customers submit applications with files.' : 'No documents match the filter.'}
                </td></tr>
              ) : filtered.map(doc => {
                const Icon = statusIcon[doc.verification_status] || Clock;
                return (
                  <tr key={doc.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-brand-green flex-shrink-0" />
                        <span className="text-sm font-medium text-brand-text truncate max-w-[150px]">{doc.original_name || 'Document'}</span>
                      </div>
                    </td>
                    <td><span className="badge-grey text-xs capitalize">{(doc.doc_type || '').replace(/_/g, ' ')}</span></td>
                    <td className="text-sm font-medium">{doc.applicant_name || '—'}</td>
                    <td className="font-mono text-xs text-brand-green">{doc.app_id || '—'}</td>
                    <td className="capitalize text-xs">{doc.service_type || '—'}</td>
                    <td className="text-xs text-brand-text-muted">{doc.created_at ? formatDate(doc.created_at) : '—'}</td>
                    <td>
                      <div className={`flex items-center gap-1 text-sm font-semibold ${statusClass[doc.verification_status] || 'text-gray-400'}`}>
                        <Icon className="w-4 h-4" />
                        <span className="capitalize">{doc.verification_status || 'pending'}</span>
                      </div>
                    </td>
                    <td>
                      {doc.file_url && (
                        <a href={getFileUrl(doc.file_url)} target="_blank" rel="noreferrer" className="p-1.5 hover:bg-brand-green-pale rounded-lg transition-colors inline-flex" title="View Document">
                          <Eye className="w-4 h-4 text-brand-green" />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
