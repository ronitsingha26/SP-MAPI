import { useState, useEffect } from 'react';
import { statusColor, statusLabel, serviceTypeLabel, formatDate } from '../../utils/helpers';
import { MapPin, User, Clock, CheckCircle2, Upload, X, RefreshCw } from 'lucide-react';
import api from '../../utils/api';

export default function AminTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/amin/tasks');
      setTasks(res.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (newStatus) => {
    if (!selectedTask) return;
    setStatusUpdating(true);
    try {
      await api.put(`/amin/tasks/${selectedTask.id}/status`, { status: newStatus });
      setSelectedTask(prev => ({ ...prev, status: newStatus }));
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!reportFile || !selectedTask) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('report', reportFile);
      await api.post(`/amin/tasks/${selectedTask.id}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Report uploaded successfully!');
      setSelectedTask(prev => ({ ...prev, report_url: 'uploaded' }));
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      setReportFile(null);
    }
  };

  return (
    <div className="animate-fade-in relative">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">{tasks.length} total assigned tasks</p>
        </div>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      {loading ? (
        <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>
      ) : tasks.length === 0 ? (
        <p className="text-center text-brand-text-muted p-12">No tasks assigned to you right now.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map(t => (
            <div key={t.id} onClick={() => setSelectedTask(t)} className="card-hover block p-6 cursor-pointer">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-brand-text text-lg">{serviceTypeLabel(t.service_type)}</h3>
                  <p className="text-sm text-brand-text-muted">{t.app_id}</p>
                </div>
                <span className={`${statusColor(t.status)} flex-shrink-0`}>{statusLabel(t.status)}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-brand-text-muted">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-brand-green" /> {t.applicant_name}</span>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-green" /> {t.district}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {formatDate(t.amin_assigned_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-fade-in shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 flex-shrink-0">
              <div>
                <h2 className="font-bold text-brand-text text-lg">Task Details</h2>
                <p className="text-xs text-brand-text-muted font-mono">{selectedTask.app_id}</p>
              </div>
              <button onClick={() => { setSelectedTask(null); setReportFile(null); }} className="text-gray-400 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-brand-text-muted text-xs">Customer Name</p>
                  <p className="font-semibold">{selectedTask.applicant_name}</p>
                </div>
                <div>
                  <p className="text-brand-text-muted text-xs">Customer Mobile</p>
                  <p className="font-semibold">{selectedTask.applicant_mobile}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-brand-text-muted text-xs">Address</p>
                  <p className="font-semibold">{[selectedTask.village, selectedTask.panchayat, selectedTask.block_name, selectedTask.district].filter(Boolean).join(', ')}</p>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-brand-cream p-4 rounded-xl border border-brand-green-pale">
                <h3 className="font-bold text-sm mb-3">Update Status</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={selectedTask.status === 'in_progress' || statusUpdating}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${selectedTask.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Start Work
                  </button>
                  <button 
                    onClick={() => handleStatusChange('completed')}
                    disabled={selectedTask.status === 'completed' || statusUpdating}
                    className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${selectedTask.status === 'completed' ? 'bg-brand-green-pale text-brand-green border border-brand-green' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                  >
                    Mark Completed
                  </button>
                </div>
              </div>

              {/* Upload Report */}
              <div>
                <h3 className="font-bold text-sm mb-3">Upload Amin Report</h3>
                {selectedTask.report_url ? (
                  <div className="flex items-center gap-2 p-3 bg-brand-green-pale rounded-lg text-brand-green text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5" /> Report Uploaded
                  </div>
                ) : (
                  <form onSubmit={handleUpload} className="space-y-3">
                    <div className="border-2 border-dashed border-brand-green-light rounded-xl p-4 text-center hover:bg-brand-green-pale/20 transition-colors">
                      <Upload className="w-6 h-6 text-brand-green mx-auto mb-2" />
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={e => setReportFile(e.target.files?.[0])}
                        className="hidden" 
                        id="report-upload" 
                      />
                      <label htmlFor="report-upload" className="cursor-pointer text-sm font-medium text-brand-text hover:text-brand-green">
                        {reportFile ? reportFile.name : 'Click to select report file (PDF/Image)'}
                      </label>
                    </div>
                    <button type="submit" disabled={!reportFile || uploading} className="btn-primary w-full justify-center disabled:opacity-50">
                      {uploading ? 'Uploading...' : 'Submit Report'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
