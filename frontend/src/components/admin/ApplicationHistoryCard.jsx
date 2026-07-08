import { useState } from 'react';
import { ChevronDown, ChevronRight, MapPin, User, Clock, FileText } from 'lucide-react';
import { statusColor, statusLabel, serviceTypeLabel, formatDate } from '../../utils/helpers';
import ApplicationDocumentsViewer from './ApplicationDocumentsViewer';
import AminReportsViewer from './AminReportsViewer';

export default function ApplicationHistoryCard({ app }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-brand-green transition-all">
      {/* Header */}
      <div 
        onClick={() => setExpanded(!expanded)} 
        className="p-4 sm:p-5 cursor-pointer flex justify-between items-center bg-white"
      >
        <div className="flex-1 pr-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <h3 className="font-bold text-brand-text text-base sm:text-lg">{serviceTypeLabel(app.service_type)}</h3>
            <span className="text-xs sm:text-sm text-brand-text-muted font-mono bg-gray-50 px-2 py-0.5 rounded">{app.app_id}</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-brand-text-muted">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {formatDate(app.created_at)}</span>
            {app.amin_name && <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-brand-green" /> Amin: {app.amin_name}</span>}
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 sm:gap-3">
          <span className={`${statusColor(app.status)} flex-shrink-0 text-[10px] sm:text-xs`}>{statusLabel(app.status)}</span>
          <button className="p-1 hover:bg-brand-green-pale rounded text-brand-green">
            {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 sm:p-5 bg-brand-green-pale/20 border-t border-gray-100 space-y-5 animate-fade-in">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-brand-text-muted text-xs mb-1">Status</p>
              <p className="font-semibold text-brand-text">{statusLabel(app.status)}</p>
            </div>
            <div>
              <p className="text-brand-text-muted text-xs mb-1">Payment</p>
              <p className="font-semibold text-brand-text capitalize">{app.payment_status || 'Unpaid'}</p>
            </div>
            <div>
              <p className="text-brand-text-muted text-xs mb-1">Assigned Amin</p>
              <p className="font-semibold text-brand-text">{app.amin_name || '—'}</p>
            </div>
            <div>
              <p className="text-brand-text-muted text-xs mb-1">Last Updated</p>
              <p className="font-semibold text-brand-text">{app.updated_at ? new Date(app.updated_at).toLocaleDateString('en-IN') : '—'}</p>
            </div>
          </div>

          <AminReportsViewer documents={app.documents || []} />
          
          <ApplicationDocumentsViewer documents={app.documents || []} />
          
        </div>
      )}
    </div>
  );
}
