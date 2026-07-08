const fs = require('fs');

let content = fs.readFileSync('frontend/src/pages/amin/AminTasksPage.jsx', 'utf8');

// 1. Imports
content = content.replace(
  "import { User, MapPin, Clock, CheckCircle2, Upload, X, RefreshCw } from 'lucide-react';",
  "import { User, MapPin, Clock, CheckCircle2, Upload, ChevronDown, RefreshCw } from 'lucide-react';\nimport ApplicationDocumentsViewer from '../../components/admin/ApplicationDocumentsViewer';"
);

// 2. State
content = content.replace(
  "const [selectedTask, setSelectedTask] = useState(null);",
  "const [expandedId, setExpandedId] = useState(null);"
);

// 3. handleStatusChange
content = content.replace(
  /const handleStatusChange = async \(newStatus\) => \{[\s\S]*?setSelectedTask\(\{ \.\.\.selectedTask, status: newStatus \}\);\n\s*\}\n/m,
  `const handleStatusChange = async (taskId, newStatus) => {
    setStatusUpdating(true);
    try {
      await api.put(\`/amin/tasks/\${taskId}/status\`, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
`
);

// 4. handleUpload
content = content.replace(
  /const handleUpload = async \(e\) => \{[\s\S]*?const res = await api\.post\(`\/amin\/tasks\/\$\{selectedTask\.id\}\/upload`, formData\);\n\s*setTasks\(tasks\.map\(t => t\.id === selectedTask\.id \? \{ \.\.\.t, report_url: res\.data\.file_url \} : t\)\);/m,
  `const handleUpload = async (e, taskId) => {
    e.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('report', reportFile);
      const res = await api.post(\`/amin/tasks/\${taskId}/upload\`, formData);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, report_url: res.data.file_url } : t));`
);

// 5. Layout and Modal
const mapRegex = /\{\s*tasks\.map\(t => \([\s\S]*?\)\s*\)\s*\}/m;
const newMap = `{tasks.map(t => (
            <div key={t.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-4 hover:border-brand-green transition-all">
              {/* Collapsed Card */}
              <div 
                onClick={() => setExpandedId(expandedId === t.id ? null : t.id)} 
                className="p-6 cursor-pointer flex justify-between items-center bg-white"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div>
                      <h3 className="font-bold text-brand-text text-lg">{serviceTypeLabel(t.service_type)}</h3>
                      <p className="text-sm text-brand-text-muted">{t.app_id}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-brand-text-muted">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-brand-green" /> {t.applicant_name}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-green" /> {t.district}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formatDate(t.amin_assigned_at)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <span className={\`\${statusColor(t.status)} flex-shrink-0\`}>{statusLabel(t.status)}</span>
                  <button className="p-1.5 hover:bg-brand-green-pale rounded-lg text-brand-green">
                    <ChevronDown className={\`w-5 h-5 transition-transform \${expandedId === t.id ? 'rotate-180' : ''}\`} />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === t.id && (
                <div className="p-6 bg-brand-green-pale/30 border-t border-gray-100 space-y-6">
                  {/* Customer Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-brand-text-muted text-xs">Customer Name</p>
                      <p className="font-semibold">{t.applicant_name}</p>
                    </div>
                    <div>
                      <p className="text-brand-text-muted text-xs">Customer Mobile</p>
                      <p className="font-semibold">{t.applicant_mobile}</p>
                    </div>
                    <div>
                      <p className="text-brand-text-muted text-xs">Address</p>
                      <p className="font-semibold">{[t.village, t.panchayat, t.block_name, t.district].filter(Boolean).join(', ')}</p>
                    </div>
                  </div>

                  {/* Customer Documents */}
                  <ApplicationDocumentsViewer documents={t.documents || []} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                    {/* Status Update */}
                    <div>
                      <h3 className="font-bold text-sm mb-3">Update Status</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleStatusChange(t.id, 'in_progress')}
                          disabled={t.status === 'in_progress' || statusUpdating}
                          className={\`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors \${t.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}\`}
                        >
                          Start Work
                        </button>
                        <button 
                          onClick={() => handleStatusChange(t.id, 'completed')}
                          disabled={t.status === 'completed' || statusUpdating}
                          className={\`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors \${t.status === 'completed' ? 'bg-brand-green-pale text-brand-green border border-brand-green' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}\`}
                        >
                          Mark Completed
                        </button>
                      </div>
                    </div>

                    {/* Upload Report */}
                    <div>
                      <h3 className="font-bold text-sm mb-3">Upload Amin Report</h3>
                      {t.report_url ? (
                        <div className="flex items-center gap-2 p-3 bg-brand-green-pale rounded-lg text-brand-green text-sm font-semibold">
                          <CheckCircle2 className="w-5 h-5" /> Report Uploaded
                        </div>
                      ) : (
                        <form onSubmit={(e) => handleUpload(e, t.id)} className="space-y-3">
                          <label htmlFor={\`report-upload-\${t.id}\`} className="block cursor-pointer border-2 border-dashed border-brand-green-light rounded-xl p-4 text-center hover:bg-brand-green-pale/20 transition-colors bg-white">
                            <Upload className="w-6 h-6 text-brand-green mx-auto mb-2" />
                            <input 
                              type="file" 
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={e => setReportFile(e.target.files?.[0])}
                              className="hidden" 
                              id={\`report-upload-\${t.id}\`}
                            />
                            <span className="block text-sm font-medium text-brand-text hover:text-brand-green">
                              {reportFile ? reportFile.name : 'Click to select report file (PDF/Image)'}
                            </span>
                          </label>
                          <button type="submit" disabled={!reportFile || uploading} className="btn-primary w-full justify-center disabled:opacity-50">
                            {uploading ? 'Uploading...' : 'Submit Report'}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>
          ))}`;

content = content.replace(mapRegex, newMap);

// Remove the modal entirely
content = content.replace(/\{\/\* Task Detail Modal \*\/\}[\s\S]*?(?=\s*<\/div>\s*\)\;\s*\})/m, '');

// Fix grid-cols of the list
content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">/, '<div className="space-y-4">');

fs.writeFileSync('frontend/src/pages/amin/AminTasksPage.jsx', content);
