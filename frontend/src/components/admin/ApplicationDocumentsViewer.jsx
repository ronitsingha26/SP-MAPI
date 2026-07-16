import { FileText, ExternalLink } from 'lucide-react';
import { getFileUrl } from '../../utils/api';

export default function ApplicationDocumentsViewer({ documents = [] }) {
  let parsedDocs = documents;
  if (typeof documents === 'string') {
    try {
      parsedDocs = JSON.parse(documents);
    } catch (e) {
      parsedDocs = [];
    }
  }
  if (!Array.isArray(parsedDocs)) {
    parsedDocs = [];
  }

  // Filter for customer documents (exclude amin field reports)
  const customerDocs = parsedDocs.filter(doc => doc.doc_type !== 'field_report' && doc.uploaded_by !== 'amin');

  if (customerDocs.length === 0) {
    return (
      <div className="mt-4 pt-4 border-t border-gray-100 col-span-full">
        <span className="text-brand-text-muted text-xs font-semibold uppercase tracking-wider block mb-2">Documents</span>
        <p className="text-sm font-medium text-gray-400">No documents uploaded</p>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 col-span-full">
      <span className="text-brand-text-muted text-xs font-semibold uppercase tracking-wider block mb-3">Documents</span>
      <div className="flex flex-wrap gap-3">
        {customerDocs.map(doc => {
          // Format document type for display (e.g. aadhaar_front -> Aadhaar Front)
          const docTypeLabel = doc.doc_type 
            ? doc.doc_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
            : 'Document';

          return (
            <a
              key={doc.id}
              href={getFileUrl(doc.file_url)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-white border border-gray-200 hover:border-brand-green hover:shadow-sm px-3 py-2 rounded-lg transition-all"
              title={doc.original_name}
            >
              <FileText className="w-4 h-4 text-brand-green" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-brand-text group-hover:text-brand-green transition-colors">
                  {docTypeLabel}
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-green transition-colors ml-1" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
