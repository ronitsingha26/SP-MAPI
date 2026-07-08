import { useState, useEffect } from 'react';
import { X, RefreshCw, User, Mail, Phone, MapPin, Calendar, Activity } from 'lucide-react';
import api from '../../utils/api';
import ApplicationHistoryCard from './ApplicationHistoryCard';
import { formatDate } from '../../utils/helpers';

export default function CustomerProfileModal({ customerId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!customerId) return;
    const fetchDetails = async () => {
      try {
        const res = await api.get(`/admin/customers/${customerId}/details`);
        setData(res.data.data || res.data); // handles {success:true, data} or just {data}
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load customer details.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [customerId]);

  if (!customerId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-fade-in relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 sm:p-6 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="font-bold text-brand-text text-xl sm:text-2xl flex items-center gap-2">
              <User className="w-6 h-6 text-brand-green" /> Customer Profile
            </h2>
            {data?.customer && (
              <p className="text-sm text-brand-text-muted mt-1 font-mono">
                {data.customer.customer_id_display || data.customer.id.substring(0, 8)}
              </p>
            )}
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-gray-50/50">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-brand-green">
              <RefreshCw className="w-8 h-8 animate-spin mb-4" />
              <p className="font-medium">Loading 360° Profile...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
              {error}
            </div>
          ) : data ? (
            <div className="space-y-8">
              
              {/* Profile Details Grid */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-brand-text mb-4 pb-3 border-b border-gray-100 text-lg">Personal Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  <div>
                    <p className="text-brand-text-muted text-xs mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> Name</p>
                    <p className="font-semibold text-brand-text text-base">{data.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-brand-text-muted text-xs mb-1 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> Mobile</p>
                    <p className="font-semibold text-brand-text text-base">{data.customer.mobile}</p>
                  </div>
                  <div>
                    <p className="text-brand-text-muted text-xs mb-1 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5"/> Email</p>
                    <p className="font-semibold text-brand-text text-base truncate" title={data.customer.email}>{data.customer.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-brand-text-muted text-xs mb-1 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5"/> District</p>
                    <p className="font-semibold text-brand-text text-base">{data.customer.district || '—'}</p>
                  </div>
                  <div>
                    <p className="text-brand-text-muted text-xs mb-1 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Joined</p>
                    <p className="font-semibold text-brand-text text-base">{formatDate(data.customer.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-brand-text-muted text-xs mb-1 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5"/> Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${data.customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {data.customer.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Application Summary */}
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-brand-text mb-4 pb-3 border-b border-gray-100 text-lg">Application Summary</h3>
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="bg-brand-green-pale/50 px-4 py-3 rounded-lg border border-brand-green-pale">
                    <p className="text-brand-text-muted text-xs font-medium">Total Applications</p>
                    <p className="text-2xl font-bold text-brand-green">{(data.applications?.length || 0) + (data.toolOrders?.length || 0)}</p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                    <div>
                      <p className="text-gray-500 text-xs">Mapi</p>
                      <p className="font-semibold text-lg">{data.applications?.filter(a => a.service_type === 'mapi').length || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Bantwara</p>
                      <p className="font-semibold text-lg">{data.applications?.filter(a => a.service_type === 'bantwara').length || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Map Request</p>
                      <p className="font-semibold text-lg">{data.applications?.filter(a => a.service_type === 'map').length || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Tool Orders</p>
                      <p className="font-semibold text-lg">{data.toolOrders?.length || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* History */}
              <div className="space-y-4">
                <h3 className="font-bold text-brand-text text-xl">Application History</h3>
                
                {data.applications?.length === 0 && data.toolOrders?.length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-brand-text-muted">
                    No applications or orders found.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.applications?.map(app => (
                      <ApplicationHistoryCard key={app.id} app={app} />
                    ))}
                    
                    {data.toolOrders?.map(order => (
                      <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <div className="p-4 sm:p-5">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                            <h3 className="font-bold text-brand-text text-base sm:text-lg">Amin Tools Request</h3>
                            <span className="text-xs sm:text-sm text-brand-text-muted font-mono bg-gray-50 px-2 py-0.5 rounded">{order.app_id}</span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                            <div>
                              <p className="text-brand-text-muted text-xs mb-1">Status</p>
                              <span className="font-semibold text-brand-text capitalize">{order.status}</span>
                            </div>
                            <div>
                              <p className="text-brand-text-muted text-xs mb-1">Payment</p>
                              <p className="font-semibold text-brand-text">₹{order.payment_required}</p>
                            </div>
                            <div>
                              <p className="text-brand-text-muted text-xs mb-1">Requested On</p>
                              <p className="font-semibold text-brand-text">{formatDate(order.created_at)}</p>
                            </div>
                          </div>
                          {order.tools && (
                            <div className="pt-4 border-t border-gray-100">
                              <p className="text-brand-text-muted text-xs mb-2">Requested Tools</p>
                              <div className="flex flex-wrap gap-2">
                                {typeof order.tools === 'string' 
                                  ? JSON.parse(order.tools).map((t, i) => (
                                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-lg">
                                        {t.name} x{t.quantity}
                                      </span>
                                    ))
                                  : order.tools.map((t, i) => (
                                      <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2.5 py-1 rounded-lg">
                                        {t.name} x{t.quantity}
                                      </span>
                                    ))
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
