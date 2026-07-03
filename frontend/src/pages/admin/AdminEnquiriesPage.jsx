import { useState, useEffect } from 'react';
import { Mail, RefreshCw, Eye } from 'lucide-react';
import api from '../../utils/api';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/enquiries');
      setEnquiries(res.data.enquiries || []);
    } catch (err) {
      setError('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Contact Enquiries</h1>
          <p className="text-brand-text-muted text-sm mt-1">Manage leads from the public website</p>
        </div>
        <button onClick={fetchEnquiries} className="btn-secondary flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-brand-green-pale text-brand-text font-semibold">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Name</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Subject</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-brand-text-muted">No enquiries found</td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-gray-50">
                    <td className="p-4 text-brand-text-muted">{new Date(enq.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-medium">{enq.name}</td>
                    <td className="p-4">{enq.mobile}</td>
                    <td className="p-4 text-brand-text-muted">{enq.subject || 'General'}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedEnquiry(enq)}
                        className="p-1.5 text-brand-green hover:bg-brand-green-pale rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden animate-fade-in shadow-xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Mail className="w-5 h-5 text-brand-green" /> Enquiry Details
              </h2>
              <button onClick={() => setSelectedEnquiry(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-brand-text-muted">Name</p>
                  <p className="font-semibold">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-text-muted">Mobile</p>
                  <p className="font-semibold">{selectedEnquiry.mobile}</p>
                </div>
                {selectedEnquiry.email && (
                  <div className="col-span-2">
                    <p className="text-xs text-brand-text-muted">Email</p>
                    <p className="font-semibold">{selectedEnquiry.email}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-xs text-brand-text-muted">Subject</p>
                  <p className="font-semibold">{selectedEnquiry.subject || 'General'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-brand-text-muted mb-1">Message</p>
                <div className="p-4 bg-brand-green-pale rounded-xl text-sm whitespace-pre-wrap">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button onClick={() => setSelectedEnquiry(null)} className="btn-secondary">Close</button>
              <a href={`tel:${selectedEnquiry.mobile}`} className="btn-primary">Call Customer</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
