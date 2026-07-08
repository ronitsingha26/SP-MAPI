import { useState } from 'react';
import { FileText, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import { getFileUrl } from '../../utils/api';

export default function AminReportsViewer({ documents = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  // Filter for field reports and sort by newest first
  const reports = documents
    .filter(doc => doc.doc_type === 'field_report')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (reports.length === 0) {
    return (
      <div>
        <span className="text-brand-text-muted text-xs">Reports</span>
        <p className="text-sm font-medium text-gray-400 mt-0.5">No reports uploaded</p>
      </div>
    );
  }

  if (reports.length === 1) {
    const report = reports[0];
    return (
      <div>
        <span className="text-brand-text-muted text-xs">Reports</span>
        <div className="flex flex-col mt-0.5">
          <p className="text-sm font-medium text-brand-text truncate pr-2 flex items-center gap-1.5" title={report.original_name}>
            <FileText className="w-3.5 h-3.5 text-brand-green shrink-0" />
            <span className="truncate">{report.original_name}</span>
          </p>
          <a
            href={getFileUrl(report.file_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-brand-green hover:text-brand-green-dark flex items-center gap-1 mt-1"
          >
            [View] <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // Multiple reports
  return (
    <div className="relative">
      <span className="text-brand-text-muted text-xs">Reports</span>
      <div className="mt-0.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-sm font-medium text-brand-text hover:text-brand-green transition-colors w-full text-left"
        >
          {isOpen ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
          Survey Reports ({reports.length})
        </button>
        
        {isOpen && (
          <div className="absolute left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 w-64 z-10 space-y-3">
            {reports.map((report, idx) => (
              <div key={report.id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                <p className="text-sm font-medium text-brand-text truncate flex items-center gap-1.5 mb-1" title={report.original_name}>
                  <FileText className="w-3.5 h-3.5 text-brand-green shrink-0" />
                  <span className="truncate">{report.original_name || `Report ${reports.length - idx}`}</span>
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-gray-400">
                    Uploaded: {new Date(report.created_at).toLocaleString('en-IN', { 
                      day: '2-digit', month: 'short', year: 'numeric', 
                      hour: '2-digit', minute: '2-digit', hour12: true 
                    })}
                  </p>
                  <a
                    href={getFileUrl(report.file_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-brand-green hover:text-brand-green-dark flex items-center gap-1"
                  >
                    View <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
