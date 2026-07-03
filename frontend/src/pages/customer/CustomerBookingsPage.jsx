import { useState, useEffect } from 'react';
import { MapPin, Info, Home } from 'lucide-react';
import api from '../../utils/api';
import { statusColor } from '../../utils/helpers';

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customer/bookings');
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError('Failed to load your plot bookings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-text">My Plot Bookings</h1>
        <p className="text-brand-text-muted text-sm mt-1">Track the status of your requested plots</p>
      </div>

      {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl text-center shadow-soft">
            <Home className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-lg font-semibold text-brand-text">No bookings found</p>
            <p className="text-brand-text-muted">You haven't requested any plots yet.</p>
          </div>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-soft p-5 flex flex-col relative overflow-hidden">
              {/* Top border colored by status */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-${statusColor(booking.status)}`} />
              
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{booking.property_title}</h3>
                  <div className="flex items-center gap-1 text-sm text-brand-text-muted mt-1">
                    <MapPin className="w-4 h-4" /> {booking.property_district}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-bold capitalize bg-${statusColor(booking.status)}/10 text-${statusColor(booking.status)}`}>
                  {booking.status}
                </div>
              </div>
              
              <div className="space-y-2 mb-4 bg-gray-50 p-3 rounded-xl text-sm">
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Booking Token</span>
                  <span className="font-semibold">₹{booking.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Property Price</span>
                  <span className="font-semibold">₹{booking.property_price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Payment</span>
                  <span className="font-semibold capitalize text-amber-600">{booking.payment_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-text-muted">Date</span>
                  <span className="font-semibold">{new Date(booking.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="mt-auto flex items-center gap-2 text-xs text-brand-text-muted bg-blue-50 p-3 rounded-xl">
                <Info className="w-4 h-4 text-blue-500 shrink-0" />
                <p>Our executive will contact you shortly regarding the site visit and payment process.</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
