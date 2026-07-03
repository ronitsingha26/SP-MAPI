import { useState } from 'react';
import { Upload, FileText, CheckCircle2, Clock, XCircle, Plus } from 'lucide-react';

const myDocs = [
  { id: 'D001', name: 'Aadhaar Card', file: 'aadhaar_ramesh.pdf', status: 'approved', uploaded_at: '2026-05-04', size: '1.2 MB' },
  { id: 'D002', name: 'Land Patta Document', file: 'patta_land_namkum.pdf', status: 'pending', uploaded_at: '2026-05-10', size: '3.4 MB' },
];

const statusIcon = { approved: CheckCircle2, pending: Clock, rejected: XCircle };
const statusClass = { approved: 'text-brand-green', pending: 'text-yellow-500', rejected: 'text-red-500' };

export default function CustomerDocumentsPage() {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Documents</h1>
          <p className="page-subtitle">Upload and manage your KYC and land documents</p>
        </div>
      </div>

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
          <h2 className="font-bold text-brand-text">Uploaded Documents ({myDocs.length})</h2>
        </div>
        <div className="divide-y divide-brand-green-pale">
          {myDocs.map(doc => {
            const Icon = statusIcon[doc.status];
            return (
              <div key={doc.id} className="flex items-center gap-4 px-6 py-4 hover:bg-brand-green-pale/30 transition-colors">
                <div className="w-10 h-10 bg-brand-yellow-pale rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-brand-text text-sm">{doc.name}</p>
                  <p className="text-xs text-brand-text-muted">{doc.file} · {doc.size} · {doc.uploaded_at}</p>
                </div>
                <div className={`flex items-center gap-1.5 text-sm font-semibold ${statusClass[doc.status]}`}>
                  <Icon className="w-4 h-4" />
                  {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
