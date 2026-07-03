import { useState, useEffect } from 'react';
import { Building2, MapPin, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/public/properties');
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (propId) => {
    if (!currentUser) {
      alert('Please login as a customer to book a plot.');
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'customer') {
      alert('Only customers can book plots.');
      return;
    }

    if (!confirm('Would you like to pay the booking token amount of ₹5000 to reserve this plot? (Offline mock mode)')) return;

    try {
      await api.post('/customer/bookings', { property_id: propId });
      alert('Plot booked successfully! Check your customer dashboard.');
      navigate('/customer/bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book plot.');
    }
  };

  const filteredProperties = properties.filter(p => 
    p.title.toLowerCase().includes(filter.toLowerCase()) || 
    p.district.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="bg-brand-cream min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-wider mb-2">Real Estate</p>
          <h1 className="text-4xl font-bold text-brand-text mb-3">Available Properties & Plots</h1>
          <p className="text-brand-text-muted text-lg max-w-2xl mx-auto">
            Browse through our verified land listings and secure your dream plot today.
          </p>
        </div>

        <div className="mb-8 max-w-md mx-auto relative">
          <input 
            type="text" 
            placeholder="Search by title or district..."
            className="w-full pl-10 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:border-brand-green outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <p className="col-span-full text-center">Loading properties...</p>
          ) : filteredProperties.length === 0 ? (
            <div className="col-span-full text-center p-12 bg-white rounded-2xl shadow-soft">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-semibold text-brand-text">No properties found</p>
              <p className="text-brand-text-muted">Check back later for new listings.</p>
            </div>
          ) : (
            filteredProperties.map(prop => (
              <div key={prop.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden group flex flex-col">
                <div className="h-56 bg-brand-green-pale relative overflow-hidden">
                  {prop.images?.length > 0 ? (
                    <img src={prop.images[0]} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-brand-green opacity-50">
                      <Building2 className="w-16 h-16" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-brand-green shadow-sm capitalize">
                    {prop.status}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-brand-text mb-2 line-clamp-2">{prop.title}</h3>
                  <div className="flex items-center gap-2 text-brand-text-muted mb-4">
                    <MapPin className="w-4 h-4 text-brand-green" /> {prop.block_name}, {prop.district}
                  </div>
                  <div className="flex justify-between items-end mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-brand-text-muted">Price</p>
                      <p className="font-bold text-brand-green text-xl">₹{prop.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-brand-text-muted text-right">Area</p>
                      <p className="font-semibold text-brand-text text-lg">{prop.area_sqft} sqft</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleBook(prop.id)}
                    disabled={prop.status !== 'available'}
                    className={`w-full mt-6 py-3 rounded-xl font-semibold transition-colors ${
                      prop.status === 'available' 
                        ? 'bg-brand-green text-white hover:bg-brand-green/90 shadow-md shadow-brand-green/20'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {prop.status === 'available' ? 'Book Now' : 'Not Available'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
