import { FileText } from 'lucide-react';

export default function AdminDocumentsPage() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Documents Management</h1>
          <p className="page-subtitle">View and manage uploaded land documents and maps</p>
        </div>
      </div>
      <div className="card p-8 text-center text-brand-text-muted mt-6">
        <FileText className="w-12 h-12 mx-auto mb-4 text-brand-green" />
        <p className="font-semibold text-lg text-brand-text mb-2">All Documents</p>
        <p>The document management module allows admins to verify uploaded user documents such as Aadhaar cards and land patta.</p>
      </div>
    </div>
  );
}
