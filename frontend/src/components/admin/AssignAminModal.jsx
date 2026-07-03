import { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertCircle } from 'lucide-react';
import api from '../../utils/api';

export default function AssignAminModal({ applicationId, onClose, onSuccess }) {
  const [amins, setAmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    amin_id: '',
    survey_date: '',
    survey_time: '',
    priority: 'normal',
    remarks: ''
  });

  useEffect(() => {
    fetchAmins();
  }, []);

  const fetchAmins = async () => {
    try {
      const res = await api.get('/admin/amins');
      if (res.data?.success) {
        setAmins(res.data.amins || []);
      }
    } catch (err) {
      setError('Failed to fetch amins.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.amin_id) {
      setError('Please select an Amin.');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    try {
      await api.post(`/admin/applications/${applicationId}/assign-amin`, form);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to assign Amin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Assign Amin</h3>
            <p className="text-sm text-gray-500 mt-1">Select a field surveyor for this application</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm flex gap-2 items-start border border-red-100">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm">Loading available amins...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Amin *</label>
                <select
                  required
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green block p-3 transition-colors"
                  value={form.amin_id}
                  onChange={(e) => setForm({ ...form, amin_id: e.target.value })}
                >
                  <option value="">-- Choose an Amin --</option>
                  {amins.map(amin => (
                    <option key={amin.id} value={amin.id}>
                      {amin.name} ({amin.district_name})
                    </option>
                  ))}
                </select>
                {amins.length === 0 && <p className="text-xs text-orange-500 mt-1">No active amins available in the system.</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Survey Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green block p-3 pl-10"
                      value={form.survey_date}
                      onChange={(e) => setForm({ ...form, survey_date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Survey Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="time"
                      className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green block p-3 pl-10"
                      value={form.survey_time}
                      onChange={(e) => setForm({ ...form, survey_time: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
                <select
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green block p-3"
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                >
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks / Instructions (Optional)</label>
                <textarea
                  rows="2"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-brand-green focus:border-brand-green block p-3 resize-none"
                  placeholder="Any specific instructions for the amin..."
                  value={form.remarks}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || amins.length === 0}
                  className="flex-1 px-4 py-2.5 bg-brand-green text-white font-medium rounded-xl hover:bg-brand-green-dark transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? 'Assigning...' : 'Assign Amin'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
