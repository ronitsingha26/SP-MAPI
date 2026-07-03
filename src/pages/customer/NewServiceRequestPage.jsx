import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, FileText, CheckCircle2, ArrowLeft } from 'lucide-react';
import { districts, services } from '../../data/index';

const surveyTools = [
  'Book / Kitab',
  'Guniya',
  'Drafting Compass',
  'Measuring Tape',
  'Chain',
  'Feet Scale',
  'Tack',
  'Pencil',
  'Pen',
  'Scale',
  'Diagonal Scale',
  'ETS Machine',
];

export default function NewServiceRequestPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ service_type: '', district: '', description: '', tools: {} });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/customer/services'), 2500);
  };

  if (submitted) return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center animate-fade-in">
        <div className="w-20 h-20 bg-brand-green-pale rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-10 h-10 text-brand-green" />
        </div>
        <h2 className="text-2xl font-bold text-brand-text mb-2">Request Submitted!</h2>
        <p className="text-brand-text-muted">Our admin will review and assign an Amin shortly.</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl animate-fade-in">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-brand-text-muted hover:text-brand-green mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="page-header">
        <div>
          <h1 className="page-title">New Service Request</h1>
          <p className="page-subtitle">Book a professional land survey service</p>
        </div>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">Service Type *</label>
            <div className="grid grid-cols-2 gap-3">
              {services.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setForm({...form, service_type: s.id})}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    form.service_type === s.id
                      ? 'border-brand-green bg-brand-green-pale'
                      : 'border-brand-green-pale hover:border-brand-green-light'
                  }`}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className={`text-sm font-semibold ${form.service_type === s.id ? 'text-brand-green' : 'text-brand-text'}`}>{s.name}</p>
                    <p className="text-xs text-brand-text-muted">{s.price_range}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {form.service_type === 'tools' && (
            <div>
              <label className="label">Tool Requirements *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {surveyTools.map(tool => {
                  const selected = Boolean(form.tools[tool]);
                  return (
                    <div
                      key={tool}
                      className={'p-4 rounded-xl border-2 transition-all duration-200 ' + (selected ? 'border-brand-green bg-brand-green-pale' : 'border-brand-green-pale')}
                    >
                      <label className="flex items-center gap-3 text-sm font-semibold text-brand-text">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={e => setForm({
                            ...form,
                            tools: {
                              ...form.tools,
                              [tool]: e.target.checked ? 1 : 0,
                            },
                          })}
                        />
                        {tool}
                      </label>
                      {selected && (
                        <input
                          className="input mt-3"
                          type="number"
                          min="1"
                          placeholder="Quantity"
                          value={form.tools[tool]}
                          onChange={e => setForm({
                            ...form,
                            tools: {
                              ...form.tools,
                              [tool]: Number(e.target.value) || 1,
                            },
                          })}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="label">District *</label>
            <select className="input" required value={form.district} onChange={e => setForm({...form, district: e.target.value})}>
              <option value="">Select district where service is needed</option>
              {districts.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="label">Description / Notes</label>
            <textarea
              className="input resize-none"
              rows={4}
              placeholder="Describe your land, location details, and specific requirements..."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>

          <div className="bg-brand-yellow-pale rounded-xl p-4 text-sm">
            <p className="font-semibold text-brand-text mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-yellow-600" /> Documents to Upload After Submission:
            </p>
            <ul className="space-y-1 text-brand-text-muted">
              <li>• Aadhaar Card (both sides)</li>
              <li>• Land Documents / Patta</li>
              <li>• Any old measurement reports (if available)</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={!form.service_type || !form.district || (form.service_type === 'tools' && !Object.values(form.tools).some(Boolean))}
            className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Wrench className="w-4 h-4" /> Submit Service Request
          </button>
        </form>
      </div>
    </div>
  );
}
