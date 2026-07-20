import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, ArrowLeft, CheckCircle2, ShoppingCart, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="label font-bold uppercase tracking-wide">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {children}
    </div>
  );
}

export default function CustomerMapForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successIds, setSuccessIds] = useState([]);

  const [form, setForm] = useState({
    state: currentUser?.state || 'Bihar',
    areaType: '',
    mapType: '',
    districtName: currentUser?.district || '',
    thanaMunicipal: '',
    moujaWard: '',
    noOfSheets: 1,
  });

  const [cart, setCart] = useState([]);

  const [statesList, setStatesList] = useState([]);
  const [districtsList, setDistrictsList] = useState([]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/sab99r/Indian-States-And-Districts/master/states-and-districts.json')
      .then(res => res.json())
      .then(data => setStatesList(data.states || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (form.state) {
      const selectedStateObj = statesList.find(s => s.state === form.state);
      setDistrictsList(selectedStateObj ? selectedStateObj.districts : []);
      if (selectedStateObj && !selectedStateObj.districts.includes(form.districtName)) {
        set('districtName', '');
      }
    } else {
      setDistrictsList([]);
    }
  }, [form.state, statesList]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const estimatedPrice = form.noOfSheets ? Number(form.noOfSheets) * 400 : 0;

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Validate form and add item to cart
  const handleAddToCart = () => {
    if (!form.state) { setError('Please select State'); return; }
    if (!form.areaType) { setError('Please select Area Type'); return; }
    if (!form.mapType) { setError('Please select Map Type'); return; }
    if (!form.districtName) { setError('Please select District'); return; }
    if (!form.thanaMunicipal.trim()) { setError('Please enter Thana/Municipal'); return; }
    if (!form.moujaWard.trim()) { setError('Please enter Mauja/Ward'); return; }
    if (!form.noOfSheets || form.noOfSheets < 1) { setError('Please enter valid number of sheets'); return; }

    setError('');
    const newItem = {
      id: Date.now(),
      state: form.state,
      areaType: form.areaType,
      mapType: form.mapType,
      districtName: form.districtName,
      thanaMunicipal: form.thanaMunicipal,
      moujaWard: form.moujaWard,
      noOfSheets: Number(form.noOfSheets),
      price: Number(form.noOfSheets) * 400,
    };
    setCart(prev => [...prev, newItem]);

    // Reset form for next item (keep state & district)
    setForm(f => ({ ...f, areaType: '', mapType: '', thanaMunicipal: '', moujaWard: '', noOfSheets: 1 }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  // Submit all cart items as separate applications
  const handleBuyNow = async () => {
    if (cart.length === 0) { setError('Your cart is empty. Please add at least one map.'); return; }
    setSubmitting(true); setError('');
    const ids = [];

    try {
      for (const item of cart) {
        const formData = new FormData();
        formData.append('customer_id', currentUser.id);
        formData.append('name', currentUser.name);
        formData.append('mobile', currentUser.mobile);
        if (currentUser.email) formData.append('email', currentUser.email);

        const fields = {
          state: item.state,
          area_type: item.areaType,
          map_type: item.mapType,
          district: item.districtName,
          thana_municipal: item.thanaMunicipal,
          mouja_ward: item.moujaWard,
          no_of_sheets: item.noOfSheets,
        };
        Object.entries(fields).forEach(([k, v]) => { if (v) formData.append(k, v); });

        const res = await api.post('/applications/map', formData);
        ids.push(res.data.app_id);
      }
      setSuccessIds(ids);
      setCart([]);
      setTimeout(() => navigate('/customer/applications'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Order submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (successIds.length > 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center animate-fade-in max-w-md">
          <div className="w-20 h-20 bg-brand-green-pale rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-brand-green" />
          </div>
          <h2 className="text-2xl font-bold text-brand-text mb-3">Order Placed Successfully!</h2>
          <p className="text-sm text-brand-text-muted mb-4">{successIds.length} map(s) ordered</p>
          <div className="space-y-1 mb-4">
            {successIds.map(id => (
              <p key={id} className="font-mono text-sm font-bold text-brand-green">{id}</p>
            ))}
          </div>
          <p className="text-sm text-brand-text-muted">Redirecting to your applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-green mb-6">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="card overflow-hidden">
        <div className="bg-[#0b1031] p-6 text-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">Search Your Map Here</h1>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField label="State :" required>
              <select className="input font-semibold" value={form.state} onChange={e => set('state', e.target.value)}>
                <option value="">--Select--</option>
                {statesList.map(s => <option key={s.state} value={s.state}>{s.state}</option>)}
              </select>
            </FormField>

            <FormField label="Area Type :" required>
              <select className="input font-semibold" value={form.areaType} onChange={e => set('areaType', e.target.value)}>
                <option value="">--Select--</option>
                <option value="Rural">Rural</option>
                <option value="Municipal">Municipal</option>
              </select>
            </FormField>

            <FormField label="Map Type :" required>
              <select className="input font-semibold" value={form.mapType} onChange={e => set('mapType', e.target.value)}>
                <option value="">--Select--</option>
                <option value="CS">CS</option>
                <option value="RS">RS</option>
                <option value="CK">CK</option>
              </select>
            </FormField>

            <FormField label="District :" required>
              <select className="input font-semibold" value={form.districtName} onChange={e => set('districtName', e.target.value)}>
                <option value="">--Select--</option>
                {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </FormField>

            <FormField label="Thana/Municipal :" required>
              <input className="input font-semibold" placeholder="Enter Thana/Municipal" value={form.thanaMunicipal} onChange={e => set('thanaMunicipal', e.target.value)} />
            </FormField>

            <FormField label="Mauja/Ward :" required>
              <input className="input font-semibold" placeholder="Enter Mauja/Ward" value={form.moujaWard} onChange={e => set('moujaWard', e.target.value)} />
            </FormField>

            <FormField label="Number of Sheets :" required>
              <input className="input font-semibold" type="number" min="1" value={form.noOfSheets} onChange={e => set('noOfSheets', e.target.value)} />
            </FormField>
          </div>

          {/* Per-item Price */}
          <div className="bg-brand-green-pale rounded-xl p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-brand-text-muted">Item Cost</p>
                <p className="text-xs text-brand-text-muted">@ ₹400 per sheet</p>
              </div>
              <p className="text-2xl font-bold text-brand-green">₹{estimatedPrice.toLocaleString()}</p>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            className="w-full bg-[#0b1031] hover:bg-[#161b4a] text-white font-bold text-lg py-4 rounded-lg transition-colors flex items-center justify-center gap-3"
            onClick={handleAddToCart}
          >
            <Plus className="w-5 h-5" /> Add to Cart
          </button>
        </div>
      </div>

      {/* ========== CART SECTION ========== */}
      {cart.length > 0 && (
        <div className="card overflow-hidden mt-6">
          <div className="bg-[#0b1031] px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" /> Your Cart
            </h2>
            <span className="bg-white text-[#0b1031] text-sm font-bold px-3 py-1 rounded-full">
              {cart.length} item{cart.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {cart.map((item, idx) => (
              <div key={item.id} className="p-4 sm:p-5 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-green-pale text-brand-green flex items-center justify-center text-sm font-bold shrink-0">
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-brand-text">
                        {item.mapType} Map — {item.areaType}
                      </p>
                      <p className="text-sm text-brand-text-muted mt-0.5">
                        {item.districtName} → {item.thanaMunicipal} → {item.moujaWard}
                      </p>
                      <p className="text-xs text-brand-text-muted mt-0.5">
                        {item.noOfSheets} sheet{item.noOfSheets > 1 ? 's' : ''} • {item.state}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-brand-green">₹{item.price.toLocaleString()}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 mt-1 p-1 transition-colors" title="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Total & Buy Button */}
          <div className="border-t border-gray-200 p-5 space-y-4 bg-gray-50/50">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold text-brand-text">Total Amount</p>
              <p className="text-2xl font-bold text-brand-green">₹{cartTotal.toLocaleString()}</p>
            </div>

            <button
              className="w-full bg-[#ef8b01] hover:bg-[#d67b00] text-black font-bold text-lg py-4 rounded-lg transition-colors border border-black/20 shadow-sm disabled:opacity-60"
              onClick={handleBuyNow}
              disabled={submitting}
            >
              {submitting ? 'Placing Order...' : `Buy Now — ₹${cartTotal.toLocaleString()}`}
            </button>

            <button
              className="w-full bg-white hover:bg-gray-100 text-brand-text font-semibold py-3 rounded-lg transition-colors border border-gray-200"
              onClick={() => navigate('/customer/applications')}
            >
              Track Your Order
            </button>
          </div>
        </div>
      )}

      {/* Show Track Order even when cart is empty */}
      {cart.length === 0 && (
        <div className="mt-6">
          <button
            className="w-full bg-[#ef8b01] hover:bg-[#d67b00] text-black font-bold text-lg py-4 rounded-lg transition-colors border border-black/20 shadow-sm"
            onClick={() => navigate('/customer/applications')}
          >
            Track Your Order
          </button>
        </div>
      )}
    </div>
  );
}
