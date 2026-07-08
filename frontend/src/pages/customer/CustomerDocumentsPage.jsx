import { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, Clock, XCircle, Plus, RefreshCw, Download } from 'lucide-react';
import { formatDate } from '../../utils/helpers';
import api, { getFileUrl } from '../../utils/api';

const statusIcon = { approved: CheckCircle2, pending: Clock, rejected: XCircle };
const statusClass = { approved: 'text-brand-green', pending: 'text-yellow-500', rejected: 'text-red-500' };

export default function CustomerDocumentsPage() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Fetch documents from customer's applications
        const res = await api.get('/applications');
        const apps = res.data.applications || [];
        
        // Collect all documents from applications
        const allDocs = [];
        for (const app of apps) {
          if (app.documents && Array.isArray(app.documents)) {
            app.documents.forEach(d => {
              allDocs.push({
                ...d,
                app_id: app.app_id,
                service_type: app.service_type,
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
    fetchDocs();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Documents</h1>
          <p className="page-subtitle">Upload and manage your KYC and land documents</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      {/* Upload Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); }}
        className={`card border-2 border-dashed mb-8 py-12 text-center transition-all duration-200 cursor-pointer ${dragging ? 'border-brand-green bg-brand-green-pale' : 'border-brand-green-light hover:border-brand-green hover:bg-brand-green-pale/50'}`}
      >
        <Upload className={`w-10 h-10 mx-auto mb-3 ${dragging ? 'text-brand-green' : 'text-brand-text-muted'}`} />
        <p className="font-semibold text-brand-text mb-1">Drop files here or click to upload</p>
        <p className="text-sm text-brand-text-muted mb-4">Supported: PDF, JPG, PNG · Max 10MB per file</p>
        <label className="btn-outline cursor-pointer">
          <Plus className="w-4 h-4" /> Choose File
          <input type="file" className="hidden" multiple accept=".pdf,.jpg,.jpeg,.png" />
        </label>
      </div>

      {/* Accepted Documents */}
      <div className="card mb-6">
        <h2 className="font-bold text-brand-text mb-1">Accepted Document Types</h2>
        <p className="text-sm text-brand-text-muted mb-4">Please upload clear, readable copies of the following:</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Aadhaar Card', 'Land Deed/Patta', 'Ownership Proof', 'Bank Statement'].map(doc => (
            <div key={doc} className="bg-brand-green-pale rounded-xl px-4 py-3 text-sm text-brand-text font-medium text-center">
              {doc}
            </div>
          ))}
        </div>
      </div>

      {/* My Documents Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-green-pale">
          <h2 className="font-bold text-brand-text">Uploaded Documents ({docs.length})</h2>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-6 h-6 text-brand-green animate-spin" />
          </div>
        ) : docs.length === 0 ? (
          <div className="p-12 text-center text-brand-text-muted">
            <FileText className="w-10 h-10 mx-auto mb-3 text-brand-green opacity-50" />
            <p className="font-medium text-brand-text mb-1">No documents uploaded yet</p>
            <p className="text-sm">Documents attached to your service applications will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-brand-green-pale">
            {docs.map(doc => {
              const Icon = statusIcon[doc.verification_status] || Clock;
              const status = doc.verification_status || 'pending';
              return (
                <div key={doc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-brand-green-pale/30 transition-colors">
                  <div className="w-10 h-10 bg-brand-yellow-pale rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-brand-text text-sm">{doc.original_name || 'Document'}</p>
                    <p className="text-xs text-brand-text-muted">
                      <span className="capitalize">{(doc.doc_type || '').replace(/_/g, ' ')}</span>
                      {doc.app_id && <span> · {doc.app_id}</span>}
                      {doc.file_size && <span> · {(doc.file_size / 1024 / 1024).toFixed(1)} MB</span>}
                      {doc.created_at && <span> · {formatDate(doc.created_at)}</span>}
                    </p>
                  </div>
                  <div className={`flex flex-col items-end gap-2 text-sm font-semibold ${statusClass[status]}`}>
                    <div className="flex items-center gap-1.5">
                      <Icon className="w-4 h-4" />
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                    {doc.file_url && (
                      <a href={getFileUrl(doc.file_url)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-brand-green bg-brand-green-pale px-2 py-1 rounded-lg hover:bg-brand-green-light transition-colors">
                        <Download className="w-3 h-3" /> View / Download
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
