import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import api from '../../utils/api';
import { statusColor } from '../../utils/helpers';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    if (!confirm(`Are you sure you want to mark this booking as ${status}?`)) return;
    try {
      await api.put(`/admin/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">Plot Bookings</h1>
          <p className="text-brand-text-muted text-sm mt-1">Manage customer plot bookings and payments</p>
        </div>
        <button onClick={fetchBookings} className="btn-secondary flex items-center gap-2">
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
                <th className="p-4">Customer</th>
                <th className="p-4">Property</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-brand-text-muted">No bookings found</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="p-4 text-brand-text-muted">{new Date(booking.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <p className="font-semibold">{booking.customer_name}</p>
                      <p className="text-xs text-brand-text-muted">{booking.customer_mobile}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold">{booking.property_title}</p>
                      <p className="text-xs text-brand-text-muted">{booking.property_district}</p>
                    </td>
                    <td className="p-4 font-semibold">₹{booking.amount}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-xs font-bold capitalize">
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold capitalize bg-${statusColor(booking.status)}/10 text-${statusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleStatusChange(booking.id, 'approved')}
                              className="p-1.5 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleStatusChange(booking.id, 'rejected')}
                              className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <a href={`tel:${booking.customer_mobile}`} className="btn-secondary text-xs p-1.5">Call</a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
