import { useState, useEffect } from 'react';
import { Plus, X, RefreshCw, Search, Filter, Eye, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { statusColor, statusLabel } from '../../utils/helpers';
import api from '../../utils/api';
import ApplicationDocumentsViewer from '../../components/admin/ApplicationDocumentsViewer';

export default function AdminAminsPage() {
  const [activeTab, setActiveTab] = useState('amins'); // 'amins' | 'applications'
  
  // Amins State
  const [amins, setAmins] = useState([]);
  const [loadingAmins, setLoadingAmins] = useState(true);
  
  // Applications State
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [error, setError] = useState('');
  
  // Modals
  const [showModal, setShowModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: '', mobile: '', email: '', password: '', district: '', license_number: '' });
  
  const [viewApp, setViewApp] = useState(null);
  const [deleteAppModal, setDeleteAppModal] = useState(null);
  const [adminRemark, setAdminRemark] = useState('');
  const [processingApp, setProcessingApp] = useState(false);

  const fetchAmins = async () => {
    setLoadingAmins(true);
    try {
      const res = await api.get('/admin/amins');
      setAmins(res.data.amins || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch Amins.');
    } finally {
      setLoadingAmins(false);
    }
  };

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await api.get('/admin/amin-applications');
      setApplications(res.data.applications || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch Applications.');
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchAmins();
    fetchApplications();
  }, []);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (showModal && !adding) setShowModal(false);
        if (viewApp && !processingApp) setViewApp(null);
        if (deleteAppModal) setDeleteAppModal(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showModal, adding, viewApp, processingApp]);

  const handleAddAmin = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await api.post('/admin/amins', form);
      setShowModal(false);
      setForm({ name: '', mobile: '', email: '', password: '', district: '', license_number: '' });
      fetchAmins();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add Amin');
    } finally {
      setAdding(false);
    }
  };

  const toggleStatus = async (amin) => {
    const newStatus = amin.status === 'active' ? 'inactive' : 'active';
    try {
      await api.put(`/admin/amins/${amin.id}`, { status: newStatus });
      fetchAmins();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (aminId) => {
    if (window.confirm('Are you sure you want to completely delete this Amin? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/amins/${aminId}`);
        fetchAmins();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete Amin.');
      }
    }
  };

  const handleReviewApplication = async (status) => {

    setProcessingApp(true);
    try {
      if (viewApp.status !== status) {
        await api.put(`/admin/amin-applications/${viewApp.id}/status`, { status, admin_remark: adminRemark });
      }
      
      const updatedApp = { ...viewApp, status, admin_remark: viewApp.status !== status ? adminRemark : viewApp.admin_remark };
      setViewApp(updatedApp);
      
      // Update local list
      setApplications(applications.map(app => app.id === viewApp.id ? updatedApp : app));

      // If approved, trigger Amin Creation workflow
      if (status === 'approved') {
        setViewApp(null);
        setForm({
          name: viewApp.name,
          mobile: viewApp.mobile,
          email: viewApp.email,
          district: viewApp.district,
          password: '', // Needs to be generated or manually input
          license_number: ''
        });
        setShowModal(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${status} application.`);
    } finally {
      setProcessingApp(false);
    }
  };

  const handleDeleteApplication = async (appId) => {
    try {
      await api.delete(`/admin/amin-applications/${appId}`);
      setDeleteAppModal(null);
      fetchApplications();
      alert('Amin Application deleted successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete Application.');
    }
  };

  const filteredApps = applications.filter(app => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        app.name.toLowerCase().includes(q) ||
        app.app_id.toLowerCase().includes(q) ||
        app.mobile.includes(q) ||
        app.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="animate-fade-in relative">
      <div className="page-header">
        <div>
          <h1 className="page-title">Amin Management</h1>
          <p className="page-subtitle">Manage registered surveyors and job applications</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Amin
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

      {/* TABS */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('amins')}
          className={`py-3 px-6 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'amins' ? 'border-brand-green text-brand-green' : 'border-transparent text-brand-text-muted hover:text-brand-text'}`}
        >
          Registered Amins ({amins.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`py-3 px-6 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'applications' ? 'border-brand-green text-brand-green' : 'border-transparent text-brand-text-muted hover:text-brand-text'}`}
        >
          Job Applications ({applications.length})
        </button>
      </div>

      {/* AMINS TAB */}
      {activeTab === 'amins' && (
        <>
          {loadingAmins ? (
            <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>
          ) : amins.length === 0 ? (
            <p className="text-center text-brand-text-muted p-12">No Amins registered in your districts yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {amins.map(a => (
                <div key={a.id} className="card hover:shadow-hover transition-all duration-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-brand-green-pale rounded-full flex items-center justify-center font-bold text-brand-green text-lg flex-shrink-0 uppercase">
                      {a.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-bold text-brand-text truncate">{a.name}</h3>
                        <span className={statusColor(a.status)}>{statusLabel(a.status)}</span>
                      </div>
                      <p className="text-xs text-brand-text-muted truncate">{a.license_number || 'No License'}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-brand-text-muted">District</span><span className="font-medium text-brand-text">{a.district_name || '—'}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Mobile</span><span className="font-medium text-brand-text">{a.mobile}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Tasks Done</span><span className="font-bold text-brand-green">{a.tasks_completed}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Active Tasks</span><span className="font-medium text-brand-text">{a.active_tasks}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Rating</span>
                      <span className="font-semibold text-yellow-600">⭐ {a.rating || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-brand-green-pale">
                    <button 
                      onClick={() => toggleStatus(a)}
                      className={`flex-1 py-2 text-xs justify-center rounded-xl font-semibold transition-all ${a.status === 'active' ? 'bg-orange-50 text-orange-500 hover:bg-orange-100' : 'bg-brand-green-pale text-brand-green hover:bg-brand-green hover:text-white'}`}
                    >
                      {a.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleDelete(a.id)}
                      className="flex-1 py-2 text-xs justify-center rounded-xl font-semibold transition-all bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* APPLICATIONS TAB */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
              <input 
                type="text" 
                placeholder="Search by ID, Name, Mobile, or District..." 
                className="input pl-10"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-text-muted" />
              <select 
                className="input py-2" 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {loadingApps ? (
            <div className="flex justify-center p-12"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>
          ) : filteredApps.length === 0 ? (
            <p className="text-center text-brand-text-muted p-12">No applications found.</p>
          ) : (
            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-brand-text-muted uppercase bg-brand-cream/50">
                    <tr>
                      <th className="px-6 py-4">App ID & Date</th>
                      <th className="px-6 py-4">Applicant</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Experience</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredApps.map(app => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-mono font-semibold text-brand-text">{app.app_id}</div>
                          <div className="text-xs text-brand-text-muted">{new Date(app.created_at).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-brand-text">{app.name}</div>
                          <div className="text-xs text-brand-text-muted">{app.mobile}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-brand-text">{app.district}</div>
                          <div className="text-xs text-brand-text-muted">{app.state}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-brand-text">{app.highest_qualification}</div>
                          <div className="text-xs text-brand-text-muted">{app.experience_years} years</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={statusColor(app.status)}>{statusLabel(app.status)}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => { setViewApp(app); setAdminRemark(app.admin_remark || ''); }}
                              className="btn-outline py-1.5 px-3 text-xs gap-1 inline-flex items-center"
                            >
                              <Eye className="w-3.5 h-3.5" /> View
                            </button>
                            <button 
                              onClick={() => setDeleteAppModal(app)}
                              className="btn-outline border-red-200 text-red-600 hover:bg-red-50 py-1.5 px-3 text-xs gap-1 inline-flex items-center"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW APPLICATION MODAL */}
      {viewApp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            if (!processingApp) setViewApp(null);
          }}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-fade-in shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="font-bold text-brand-text text-lg">Application Details</h2>
                <p className="text-xs text-brand-text-muted font-mono">{viewApp.app_id}</p>
              </div>
              <button onClick={() => setViewApp(null)} className="text-gray-400 hover:text-red-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-6 flex-1 bg-gray-50/50">
              
              {/* Status Banner */}
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div>
                  <p className="text-xs text-brand-text-muted font-semibold uppercase tracking-wider mb-1">Current Status</p>
                  <span className={statusColor(viewApp.status)}>{statusLabel(viewApp.status)}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-brand-text-muted font-semibold uppercase tracking-wider mb-1">Applied On</p>
                  <p className="font-medium text-brand-text text-sm">{new Date(viewApp.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Personal Info */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-brand-text mb-3 border-b border-gray-50 pb-2">Personal Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-brand-text-muted">Name:</span> <span className="font-medium">{viewApp.name}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Father's Name:</span> <span className="font-medium">{viewApp.father_name || 'Not Provided'}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Mobile:</span> <span className="font-medium">{viewApp.mobile}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Email:</span> <span className="font-medium">{viewApp.email}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Gender:</span> <span className="font-medium">{viewApp.gender}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">DOB:</span> <span className="font-medium">{new Date(viewApp.dob).toLocaleDateString()}</span></div>
                  </div>
                </div>

                {/* Professional Info */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-bold text-brand-text mb-3 border-b border-gray-50 pb-2">Professional & Address</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-brand-text-muted">Qualification:</span> <span className="font-medium">{viewApp.highest_qualification}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Experience:</span> <span className="font-medium">{viewApp.experience_years} Years</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Previous Org:</span> <span className="font-medium truncate max-w-[150px]" title={viewApp.previous_organization}>{viewApp.previous_organization || 'N/A'}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">State/District:</span> <span className="font-medium">{viewApp.state}, {viewApp.district}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">Block/Village:</span> <span className="font-medium">{viewApp.block_name}, {viewApp.village}</span></div>
                    <div className="flex justify-between"><span className="text-brand-text-muted">PIN Code:</span> <span className="font-medium">{viewApp.pin_code}</span></div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <ApplicationDocumentsViewer documents={viewApp.documents || []} />
              </div>

              {/* Admin Remark (Read Only for non-pending) */}
              {viewApp.status !== 'pending' && viewApp.admin_remark && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                  <span className="text-orange-800 text-xs font-bold uppercase tracking-wider block mb-1">Admin Remark</span>
                  <p className="text-sm text-orange-900">{viewApp.admin_remark}</p>
                </div>
              )}

              {/* Approval Actions */}
              {(viewApp.status === 'pending' || (viewApp.status === 'approved' && !viewApp.is_amin_created)) && (
                <div className="bg-white p-4 rounded-xl border border-brand-green-pale shadow-sm mt-4">
                  <h3 className="text-sm font-bold text-brand-text mb-3">
                    {viewApp.status === 'pending' ? 'Review Decision' : 'Complete Amin Account Creation'}
                  </h3>
                  {viewApp.status === 'pending' && (
                    <textarea 
                      placeholder="Add remarks (optional)..." 
                      className="input min-h-[80px] mb-4"
                      value={adminRemark}
                      onChange={(e) => setAdminRemark(e.target.value)}
                    />
                  )}
                  <div className="flex gap-3">
                    {viewApp.status === 'pending' && (
                      <button 
                        onClick={() => handleReviewApplication('rejected')}
                        disabled={processingApp}
                        className="flex-1 py-2 rounded-xl font-bold bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    )}
                    <button 
                      onClick={() => handleReviewApplication('approved')}
                      disabled={processingApp}
                      className="flex-1 py-2 rounded-xl font-bold bg-brand-green text-white hover:bg-green-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> 
                      {viewApp.status === 'pending' ? 'Approve & Create Amin' : 'Create Amin Account'}
                    </button>
                  </div>
                </div>
              )}

              {/* Amin Created Badge */}
              {viewApp.status === 'approved' && viewApp.is_amin_created == 1 && (
                <div className="bg-brand-green-pale/50 p-4 rounded-xl border border-brand-green/20 mt-4 text-center">
                  <CheckCircle className="w-6 h-6 text-brand-green mx-auto mb-2" />
                  <p className="text-brand-green font-bold">Amin account already created.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE APPLICATION MODAL */}
      {deleteAppModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setDeleteAppModal(null)}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-fade-in shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="font-bold text-red-600 text-lg flex items-center gap-2">
                <Trash2 className="w-5 h-5" /> Delete Amin Application
              </h2>
              <button onClick={() => setDeleteAppModal(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-brand-text mb-4">Are you sure you want to permanently delete this Amin job application?</p>
              
              {deleteAppModal.status === 'approved' && deleteAppModal.is_amin_created == 1 && (
                <div className="bg-orange-50 text-orange-800 p-3 rounded-lg text-sm mb-4 border border-orange-100">
                  <strong>Warning:</strong> This will delete ONLY the recruitment application record. The registered Amin account will remain unchanged.
                </div>
              )}
              
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setDeleteAppModal(null)} 
                  className="btn-outline flex-1 justify-center"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleDeleteApplication(deleteAppModal.id)} 
                  className="py-2 px-4 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors flex-1 flex justify-center"
                >
                  Delete Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Amin Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => {
            if (!adding) setShowModal(false);
          }}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-fade-in shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="font-bold text-brand-text text-lg">Add New Amin</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddAmin} className="p-5 space-y-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <label className="label">Mobile Number *</label>
                <input className="input" required maxLength={10} value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
              </div>
              <div>
                <label className="label">Email *</label>
                <input className="input" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <label className="label">Password *</label>
                <input className="input" required type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div>
                <label className="label">District *</label>
                <input className="input" required placeholder="E.g. Patna" value={form.district} onChange={e => setForm({...form, district: e.target.value})} />
              </div>
              <div>
                <label className="label">License Number</label>
                <input className="input" value={form.license_number} onChange={e => setForm({...form, license_number: e.target.value})} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={adding} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {adding ? 'Adding...' : 'Save Amin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
