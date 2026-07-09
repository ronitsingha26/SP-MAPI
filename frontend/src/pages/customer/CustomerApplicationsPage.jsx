import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, ClipboardList, Map, GitBranch, RefreshCw, Plus, Pencil, X, Save, ChevronDown, ChevronUp, AlertCircle, Wrench, Trash2, XCircle } from 'lucide-react';
import api, { getFileUrl } from '../../utils/api';

const STATUS_LABEL = {
  submitted: 'Submitted', verification: 'Verification', processing: 'Processing',
  approved: 'Approved', rejected: 'Rejected', completed: 'Completed',
  map_preparation: 'Map Preparation', ready: 'Ready', delivered: 'Delivered', assigned: 'Assigned',
  withdrawn: 'Withdrawn'
};
const STATUS_COLOR = {
  submitted: 'badge-grey', verification: 'badge-yellow', processing: 'badge-yellow',
  approved: 'badge-green', rejected: 'badge-red', completed: 'badge-blue',
  map_preparation: 'badge-yellow', ready: 'badge-green', delivered: 'badge-green', assigned: 'badge-yellow',
  withdrawn: 'badge-red'
};
const TYPE_LABELS = { mapi: 'Mapi Registration', bantwara: 'Bantwara Registration', map: 'Map Request', tools: 'Amin Tools' };
const EDITABLE_STATUSES = ['submitted', 'pending'];

function TypeIcon({ type }) {
  if (type === 'mapi') return <ClipboardList className="w-4 h-4 text-brand-green" />;
  if (type === 'bantwara') return <GitBranch className="w-4 h-4 text-yellow-600" />;
  if (type === 'tools') return <Wrench className="w-4 h-4 text-indigo-500" />;
  return <Map className="w-4 h-4 text-blue-500" />;
}

// ── Edit Application Modal ──────────────────────────────────────────────────
function EditModal({ app, onClose, onSave }) {
  const [form, setForm] = useState({
    panchayat: app.panchayat || '',
    police_station: app.police_station || '',
    village: app.village || '',
    ward_name: app.ward_name || '',
    mouja_name: app.mouja_name || '',
    khata_number: app.khata_number || '',
    block_name: app.block_name || '',
    pincode: app.pincode || '',
    land_area: app.land_area || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await api.put(`/applications/${app.id}`, form);
      onSave(res.data.application);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-5 border-b border-brand-green-pale flex items-center justify-between rounded-t-3xl z-10">
          <div>
            <h2 className="font-bold text-brand-text text-lg flex items-center gap-2">
              <Pencil className="w-5 h-5 text-brand-green" /> Edit Application
            </h2>
            <p className="text-xs text-brand-text-muted mt-0.5">App ID: <span className="font-mono font-semibold text-brand-green">{app.app_id}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-green-pale rounded-xl text-brand-text-muted hover:text-brand-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            Only location/land details can be edited. Changes apply while status is "Submitted" or "Pending".
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'panchayat', label: 'Panchayat' },
              { key: 'police_station', label: 'Police Station / Thana' },
              { key: 'village', label: 'Village / Town / Nagar' },
              { key: 'ward_name', label: 'Ward Name / Number' },
              { key: 'mouja_name', label: 'Mouja Name' },
              { key: 'khata_number', label: 'Khata Number' },
              { key: 'block_name', label: 'Block Name' },
              { key: 'pincode', label: 'Pincode' },
              { key: 'land_area', label: 'Land Area (sq. ft.)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input
                  className="input"
                  placeholder={label}
                  value={form[key]}
                  onChange={e => set(key, e.target.value)}
                  type={key === 'land_area' ? 'number' : 'text'}
                  maxLength={key === 'pincode' ? 6 : undefined}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-brand-green-pale flex gap-3 rounded-b-3xl">
          <button onClick={onClose} className="btn-outline flex-1 justify-center">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center gap-2 disabled:opacity-60">
            <Save className="w-4 h-4" />
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Razorpay Script Loader ──────────────────────────────────────────────────
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// ── Application Detail Row ──────────────────────────────────────────────────
function AppRow({ app, onEdit, onUpdate, onWithdraw }) {
  const [expanded, setExpanded] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const canEdit = EDITABLE_STATUSES.includes(app.status);
  
  const canWithdraw = ['submitted', 'pending'].includes(app.status);

  const handlePayNow = async () => {
    setIsPaying(true);
    try {
      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsPaying(false);
        return;
      }

      // Create Order
      const orderRes = await api.post('/customer/payments/create-order', {
        application_id: app.id,
        amount: app.payment_required
      });

      if (!orderRes.data.success) {
        alert(orderRes.data.message || 'Failed to create payment order');
        setIsPaying(false);
        return;
      }

      const { order, key_id, payment_ref } = orderRes.data;

      const options = {
        key: key_id, 
        amount: order.amount,
        currency: order.currency,
        name: 'SP MAPI Services',
        description: `Payment for Application ${app.app_id}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/customer/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              application_id: app.id
            });
            if (verifyRes.data.success) {
              alert('Payment Successful!');
              onUpdate({ ...app, payment_status: 'paid' });
            } else {
              alert('Payment Verification Failed');
            }
          } catch (err) {
            alert('Payment Verification Error');
          }
        },
        prefill: {
          name: app.customer_name || 'Customer',
          email: app.applicant_email || '',
          contact: app.applicant_mobile || ''
        },
        theme: {
          color: '#16a34a' // brand green
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <>
      <tr 
        className="hover:bg-brand-green-pale/20 transition-colors cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <td className="font-mono text-xs font-semibold text-brand-green">{app.app_id}</td>
        <td>
          <span className="flex items-center gap-1.5">
            <TypeIcon type={app.service_type} />
            <span className="hidden sm:inline">{TYPE_LABELS[app.service_type] || app.service_type}</span>
            <span className="sm:hidden text-xs capitalize">{app.service_type}</span>
          </span>
        </td>
        <td className="text-brand-text-muted text-sm">{app.district || '—'}</td>
        <td className="text-brand-text-muted text-sm hidden md:table-cell">
          {new Date(app.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
        </td>
        <td>
          <span className={STATUS_COLOR[app.status] || 'badge-grey'}>{STATUS_LABEL[app.status] || app.status}</span>
        </td>
        <td className="text-xs text-brand-text-muted hidden lg:table-cell">
          {app.amin_name || <span className="text-yellow-600 font-medium">Not Assigned</span>}
        </td>
        <td>
          <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
            {canEdit && (
              <button
                onClick={() => onEdit(app)}
                title="Edit Application"
                className="p-1.5 hover:bg-brand-green-pale rounded-lg text-brand-green transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => setExpanded(e => !e)}
              title="View Details"
              className="p-1.5 hover:bg-brand-green-pale rounded-lg text-brand-text-muted hover:text-brand-green transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="bg-brand-green-pale/20">
          <td colSpan="7" className="px-4 py-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div><span className="text-brand-text-muted text-xs block">Mobile</span><p className="font-medium">{app.applicant_mobile || '—'}</p></div>
              <div><span className="text-brand-text-muted text-xs block">Email</span><p className="font-medium">{app.applicant_email || '—'}</p></div>
              <div>
                <span className="text-brand-text-muted text-xs block">Payment Status</span>
                <p className="font-medium capitalize">{app.payment_status || '—'}</p>
              </div>
              <div>
                <span className="text-brand-text-muted text-xs block">Amount Due</span>
                <div className="flex items-center gap-3">
                  <p className="font-medium">₹{app.payment_required || 0}</p>
                  {(app.status === 'approved' || app.status === 'map_preparation' || app.status === 'ready') && app.payment_status === 'unpaid' && Number(app.payment_required) > 0 && (
                    <button 
                      onClick={handlePayNow}
                      disabled={isPaying}
                      className="bg-brand-green text-white px-3 py-1 rounded-md text-xs font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isPaying ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                  {canWithdraw && (
                    <button
                      onClick={() => onWithdraw(app)}
                      className="border border-red-200 text-red-600 bg-white hover:bg-red-50 hover:border-red-300 px-3 py-1 rounded-md text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5 ml-auto"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Withdraw Application
                    </button>
                  )}
                </div>
              </div>
              {app.admin_remark && (
                <div className="col-span-2 sm:col-span-4">
                  <span className="text-brand-text-muted text-xs block">Admin Remarks</span>
                  <p className="font-medium text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-1 text-sm">{app.admin_remark}</p>
                </div>
              )}
              {app.service_type === 'tools' && app.tools?.length > 0 && (
                <div className="col-span-2 sm:col-span-4">
                  <span className="text-brand-text-muted text-xs block mb-2">Requested Tools</span>
                  <div className="flex flex-wrap gap-2">
                    {app.tools.map((t, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 text-xs bg-indigo-50 border border-indigo-200 rounded-lg px-3 py-1.5 text-indigo-700 font-medium">
                        <Wrench className="w-3.5 h-3.5" />
                        {t.name} (x{t.quantity})
                      </span>
                    ))}
                  </div>
                  {app.remarks && (
                    <div className="mt-3">
                      <span className="text-brand-text-muted text-xs block">Customer Remarks</span>
                      <p className="font-medium text-sm mt-1">{app.remarks}</p>
                    </div>
                  )}
                </div>
              )}
              {app.documents?.length > 0 && (
                <div className="col-span-2 sm:col-span-4">
                  <span className="text-brand-text-muted text-xs block mb-2">Documents</span>
                  <div className="flex flex-wrap gap-2">
                    {app.documents.map(d => (
                      <a
                        key={d.id}
                        href={getFileUrl(d.file_url)}
                        target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs bg-white border border-brand-green-light rounded-lg px-3 py-1.5 text-brand-green hover:bg-brand-green-pale transition-colors font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {d.doc_type?.replace(/_/g, ' ') || d.original_name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function CustomerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingApp, setEditingApp] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/applications');
        setApplications(res.data.applications || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const filtered = filter === 'all' ? applications : applications.filter(a => a.service_type === filter);
  const total = applications.length;
  const pending = applications.filter(a => ['submitted', 'verification', 'processing', 'map_preparation', 'assigned'].includes(a.status)).length;
  const approved = applications.filter(a => ['approved', 'ready', 'delivered'].includes(a.status)).length;
  const completed = applications.filter(a => a.status === 'completed').length;

  const handleSaveEdit = (updatedApp) => {
    setApplications(prev => prev.map(a => a.id === updatedApp.id ? { ...a, ...updatedApp } : a));
  };

  const handleWithdraw = async (app) => {
    if (!window.confirm("Are you sure you want to withdraw this application?\n\nThis action cannot be undone.\nThe application will no longer be processed.")) return;
    
    try {
      const isTools = app.service_type === 'tools';
      const endpoint = isTools ? `/applications/tool-requests/${app.id}/withdraw` : `/applications/${app.id}/withdraw`;
      
      await api.put(endpoint);
      setApplications(prev => prev.map(a => a.id === app.id ? { ...a, status: 'withdrawn' } : a));
      
      // We could use a toast here if a toast library is available, but alert guarantees visibility per requirements
      alert('Application withdrawn successfully.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Edit Modal */}
      {editingApp && (
        <EditModal
          app={editingApp}
          onClose={() => setEditingApp(null)}
          onSave={handleSaveEdit}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">My Applications</h1>
          <p className="page-subtitle">All your service applications in one place</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/customer/services/mapi" className="btn-primary text-sm"><Plus className="w-3.5 h-3.5" /> Mapi</Link>
          <Link to="/customer/services/bantwara" className="btn-outline text-sm"><Plus className="w-3.5 h-3.5" /> Bantwara</Link>
          <Link to="/customer/services/map" className="btn-outline text-sm"><Plus className="w-3.5 h-3.5" /> Map</Link>
          <Link to="/customer/services/tools" className="btn-outline text-sm"><Plus className="w-3.5 h-3.5" /> Tools</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Applications', value: total, color: 'text-brand-green' },
          { label: 'Pending', value: pending, color: 'text-yellow-700' },
          { label: 'Approved', value: approved, color: 'text-blue-600' },
          { label: 'Completed', value: completed, color: 'text-emerald-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card text-center p-6">
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
            <p className="text-sm text-brand-text-muted mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="card mb-4">
        <div className="flex gap-2 flex-wrap">
          {['all', 'mapi', 'bantwara', 'map', 'tools'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? 'bg-brand-green text-white' : 'bg-brand-green-pale text-brand-text-muted hover:text-brand-green'}`}
            >
              {f === 'all' ? 'All' : TYPE_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="card">
        <h2 className="font-bold text-brand-text text-lg mb-5 flex items-center gap-2">
          <FileText className="w-5 h-5 text-brand-green" /> All Applications
          <span className="ml-auto text-sm font-normal text-brand-text-muted flex items-center gap-1">
            <Pencil className="w-3.5 h-3.5" /> Pencil icon = Editable (Submitted/Pending only)
          </span>
        </h2>
        {loading ? (
          <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-brand-green animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">⚠️ {error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📋</div>
            <p className="font-semibold text-brand-text mb-2">No applications yet</p>
            <p className="text-sm text-brand-text-muted mb-6">Submit your first service application to get started.</p>
            <Link to="/customer/services/mapi" className="btn-primary">Start Mapi Registration</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead><tr>
                <th>App ID</th><th>Service Type</th><th>District</th>
                <th className="hidden md:table-cell">Submitted</th>
                <th>Status</th>
                <th className="hidden lg:table-cell">Amin</th>
                <th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(app => (
                  <AppRow
                    key={app.id}
                    app={app}
                    onEdit={setEditingApp}
                    onUpdate={handleSaveEdit}
                    onWithdraw={handleWithdraw}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
