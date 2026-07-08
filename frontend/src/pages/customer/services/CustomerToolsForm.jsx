import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, Plus, Minus, CheckCircle2, ArrowLeft, Send, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../utils/api';

export default function CustomerToolsForm() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successId, setSuccessId] = useState('');
  const [remarks, setRemarks] = useState('');
  const [toolsList, setToolsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Track selected tools with quantities
  const [selected, setSelected] = useState({});

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const res = await api.get('/applications/public/tools');
        setToolsList(res.data.tools || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const toggleTool = (name) => {
    setSelected(prev => {
      if (prev[name]) {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      }
      return { ...prev, [name]: 1 };
    });
  };

  const setQty = (name, qty) => {
    if (qty < 1) return;
    setSelected(prev => ({ ...prev, [name]: qty }));
  };

  const selectedCount = Object.keys(selected).length;

  const handleSubmit = async () => {
    if (selectedCount === 0) {
      setError('Please select at least one tool.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const tools = Object.entries(selected).map(([name, quantity]) => ({ name, quantity }));
      const res = await api.post('/applications/tools', {
        customer_id: currentUser.id,
        tools,
        remarks,
      });
      setSuccessId(res.data.app_id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit tool request.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (successId) {
    return (
      <div className="max-w-lg mx-auto text-center animate-fade-in py-12">
        <div className="w-20 h-20 bg-brand-green-pale rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-brand-green" />
        </div>
        <h2 className="text-2xl font-bold text-brand-text mb-2">Tool Request Submitted!</h2>
        <p className="text-brand-text-muted mb-6">Your request has been submitted successfully. Track it using:</p>
        <div className="bg-brand-green-pale rounded-2xl p-6 mb-6">
          <p className="text-xs text-brand-text-muted font-medium uppercase mb-1">Application ID</p>
          <p className="text-2xl font-bold text-brand-green tracking-wider">{successId}</p>
        </div>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/customer/applications')} className="btn-primary">
            My Applications
          </button>
          <button onClick={() => navigate('/customer/dashboard')} className="btn-outline">
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-brand-green-pale rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-brand-text" />
        </button>
        <div>
          <h1 className="page-title flex items-center gap-2"><Wrench className="w-6 h-6 text-brand-green" /> Apply for Amin Tools</h1>
          <p className="text-sm text-brand-text-muted">Select the surveying tools you need and specify quantities.</p>
        </div>
      </div>

      {/* Customer Info */}
      <div className="card p-4 mb-6">
        <p className="text-xs font-bold text-brand-text-muted uppercase mb-2">Applicant</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div><span className="text-brand-text-muted">Name:</span> <strong>{currentUser?.name}</strong></div>
          <div><span className="text-brand-text-muted">Mobile:</span> <strong>{currentUser?.mobile}</strong></div>
          <div><span className="text-brand-text-muted">District:</span> <strong>{currentUser?.district || 'N/A'}</strong></div>
          <div><span className="text-brand-text-muted">ID:</span> <strong>{currentUser?.customer_id_display || 'N/A'}</strong></div>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>
      )}

      {/* Tool Grid */}
      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 text-brand-green animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
          {toolsList.map((tool) => {
            const isSelected = !!selected[tool.name];
            const qty = selected[tool.name] || 0;
            const icon = tool.description ? Array.from(tool.description)[0] : '🛠️';
            const price = Number(tool.rental_price) > 0 ? `₹${Number(tool.rental_price)}` : 'Free';
            return (
              <div
                key={tool.id}
                className={`card p-4 cursor-pointer transition-all border-2 ${isSelected ? 'border-brand-green bg-brand-green-pale/30 shadow-hover' : 'border-transparent hover:border-brand-green-pale'}`}
                onClick={() => toggleTool(tool.name)}
              >
                <div className="text-2xl mb-1">{icon}</div>
                <p className="text-sm font-semibold text-brand-text mb-1">{tool.name}</p>
                <p className="text-xs text-brand-green font-medium mb-2">{price}</p>
                {isSelected && (
                  <div className="flex items-center gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setQty(tool.name, qty - 1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-bold text-brand-green w-6 text-center">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(tool.name, qty + 1)}
                    className="w-7 h-7 rounded-lg bg-brand-green-pale hover:bg-brand-green/20 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      {/* Remarks */}
      <div className="card p-4 mb-6">
        <label className="label">Remarks / Additional Notes</label>
        <textarea
          className="input min-h-[80px]"
          placeholder="Any specific requirements or notes..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      {/* Summary & Submit */}
      {selectedCount > 0 && (
        <div className="card p-4 mb-6 bg-brand-green-pale/20">
          <p className="text-sm font-bold text-brand-text mb-2">Selected Tools ({selectedCount})</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selected).map(([name, qty]) => (
              <span key={name} className="badge-green text-xs">
                {name} × {qty}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting || selectedCount === 0}
        className="btn-primary w-full justify-center py-3 disabled:opacity-50"
      >
        {submitting ? (
          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
        ) : (
          <><Send className="w-4 h-4" /> Submit Tool Request ({selectedCount} tools selected)</>
        )}
      </button>
    </div>
  );
}
