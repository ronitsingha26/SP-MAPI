import React, { useState, useEffect, useCallback } from 'react';
import { Wrench, Filter, Search, RefreshCw, ChevronDown, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const STATUS_LABEL = {
  pending: 'Pending', approved: 'Approved', dispatched: 'Dispatched',
  returned: 'Returned', rejected: 'Rejected', cancelled: 'Cancelled', withdrawn: 'Withdrawn'
};
const STATUS_COLOR = {
  pending: 'badge-yellow', approved: 'badge-green', dispatched: 'badge-blue',
  returned: 'badge-grey', rejected: 'badge-red', cancelled: 'badge-red', withdrawn: 'badge-red'
};
const TOOL_STATUSES = ['pending', 'approved', 'dispatched', 'returned', 'rejected', 'cancelled'];

export default function AdminToolsOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [adminRemark, setAdminRemark] = useState({});
  const { currentUser } = useAuth();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      if (search) params.set('search', search);
      const res = await api.get(`/admin/tools-orders?${params}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tool orders.');
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchOrders, 300);
    return () => clearTimeout(timer);
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/admin/tools-orders/${orderId}`, { 
        status: newStatus,
        admin_remark: adminRemark[orderId] || ''
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      alert(`Status updated to ${STATUS_LABEL[newStatus]}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tool order? This action cannot be undone.')) return;
    try {
      await api.delete(`/admin/tool-requests/${id}`);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete tool request.');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Wrench className="w-6 h-6 text-brand-green" /> Amin Tool Orders
          </h1>
          <p className="page-subtitle">Manage customer bookings for surveying tools</p>
        </div>
        <button onClick={fetchOrders} className="btn-outline text-sm">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2 bg-brand-green-pale rounded-xl px-3 py-2 max-w-sm flex-1">
            <Search className="w-4 h-4 text-brand-text-muted" />
            <input
              type="text" placeholder="Search by App ID or Customer Name..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="bg-transparent text-sm outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-text-muted" />
            <select className="input py-2 bg-brand-green-pale border-none" value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="all">All Statuses</option>
              {TOOL_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card">
        {loading ? (
          <div className="flex justify-center py-12"><RefreshCw className="w-8 h-8 text-brand-green animate-spin" /></div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">⚠️ {error}</div>
        ) : (
          <div className="table-wrapper">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-green-pale/30 border-b border-brand-green-pale">
                  <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider rounded-tl-xl">Order ID</th>
                  <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Customer</th>
                  <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Date</th>
                  <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Payment</th>
                  <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-semibold text-brand-green uppercase tracking-wider text-right rounded-tr-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => {
                  const tools = typeof order.tools === 'string' ? JSON.parse(order.tools) : (order.tools || []);
                  const isExpanded = expandedId === order.id;
                  
                  return (
                    <React.Fragment key={order.id}>
                      <tr 
                        className={`cursor-pointer hover:bg-gray-50/50 transition-colors ${isExpanded ? 'bg-gray-50/50' : ''}`}
                        onClick={() => setExpandedId(isExpanded ? null : order.id)}
                      >
                        <td className="p-4">
                          <p className="font-semibold text-brand-text">{order.app_id}</p>
                        </td>
                        <td className="p-4">
                          <p className="font-medium text-sm text-brand-text">{order.customer_name}</p>
                          <p className="text-xs text-brand-text-muted">{order.customer_mobile}</p>
                        </td>
                        <td className="p-4 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="p-4">
                          <p className="text-sm font-semibold">₹{Number(order.payment_required || 0).toLocaleString()}</p>
                          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {order.payment_status || 'Unpaid'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={STATUS_COLOR[order.status] || 'badge-grey'}>{STATUS_LABEL[order.status]}</span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(isExpanded ? null : order.id);
                              }}
                              className="p-1.5 hover:bg-brand-green-pale rounded-lg text-brand-green transition-colors"
                              title="View Details"
                            >
                              <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            {(currentUser?.role === 'superadmin' || currentUser?.role === 'admin') && (
                              <button
                                className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(order.id);
                                }}
                                title="Delete Order"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                          <td colSpan="6" className="p-4 sm:p-6">
                            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Details</h3>
                                  <div className="space-y-2 text-sm">
                                    <p><span className="text-gray-500 w-24 inline-block">District:</span> <strong>{order.customer_district || 'N/A'}</strong></p>
                                    <p><span className="text-gray-500 w-24 inline-block">Block:</span> <strong>{order.customer_block || 'N/A'}</strong></p>
                                    <p><span className="text-gray-500 w-24 inline-block">Village:</span> <strong>{order.customer_village || 'N/A'}</strong></p>
                                    <p><span className="text-gray-500 w-24 inline-block">Address:</span> <strong>{order.customer_address || 'N/A'}</strong></p>
                                  </div>
                                </div>
                                <div>
                                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Requested Tools</h3>
                                  <div className="flex flex-wrap gap-2">
                                    {tools.map((t, idx) => (
                                      <span key={idx} className="badge-green text-xs">
                                        <Wrench className="w-3 h-3 mr-1 inline" /> {t.name} (x{t.quantity})
                                      </span>
                                    ))}
                                  </div>
                                  {order.remarks && (
                                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                                      <strong>Customer Remarks:</strong> {order.remarks}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="border-t border-gray-100 pt-6">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Update Status</h3>
                                <div className="flex flex-col sm:flex-row gap-4 items-end">
                                  <div className="flex-1 w-full">
                                    <label className="label text-xs">Admin Remark (Optional)</label>
                                    <input
                                      type="text"
                                      className="input py-2"
                                      placeholder="Add a remark for the customer..."
                                      value={adminRemark[order.id] !== undefined ? adminRemark[order.id] : (order.admin_remark || '')}
                                      onChange={(e) => setAdminRemark(prev => ({ ...prev, [order.id]: e.target.value }))}
                                    />
                                  </div>
                                  {order.status === 'withdrawn' ? (
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                      <p className="text-sm text-gray-500 font-semibold italic">This order was withdrawn by the customer and cannot be updated.</p>
                                    </div>
                                  ) : (
                                    <div className="flex gap-2 flex-wrap">
                                      {TOOL_STATUSES.map(s => {
                                        if (s === order.status) return null; // Don't show current status button
                                        return (
                                          <button
                                            key={s}
                                            onClick={() => handleStatusUpdate(order.id, s)}
                                            disabled={updatingId === order.id}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                                              s === 'approved' ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' :
                                              s === 'dispatched' ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' :
                                              s === 'returned' ? 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100' :
                                              s === 'rejected' || s === 'cancelled' ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100' :
                                              'border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                                            } disabled:opacity-50`}
                                          >
                                            Mark {STATUS_LABEL[s]}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
                {orders.length === 0 && (
                  <tr><td colSpan="6" className="text-center py-12 text-brand-text-muted">No tool orders found matching criteria.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
