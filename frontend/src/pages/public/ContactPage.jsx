import { Mail, Phone, MapPin, Send, CheckCircle2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';

export default function ContactPage() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', mobile: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/public', form);
      setSent(true);
      setForm({ name: '', mobile: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <p className="text-brand-green font-semibold text-sm uppercase tracking-wider mb-2 whitespace-pre-line">{t('contact_label')}</p>
        <h1 className="text-4xl font-bold text-brand-text mb-3 whitespace-pre-line">{t('contact_title')}</h1>
        <p className="text-brand-text-muted text-lg whitespace-pre-line">{t('contact_subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-5">
          {[
            { icon: Mail, label: t('contact_email_us'), value: 'office@spmapi.co.in', sub: 'spmapi@zohomail.in', color: 'green' },
            { icon: Phone, label: t('contact_call_us'), value: '+91 7979835440', sub: '', color: 'yellow' },
            { icon: MapPin, label: 'Head Office', value: 'Plot No. 432, VCT - Kumhra\nPost - Mirzapur\nDist - Araria\nBihar - 854312', sub: '', color: 'green' },
            { icon: MapPin, label: 'Branch Office', value: 'Chaudhary Tola, Ward - 05\nVCT - Ghailarh Jiwachhpur\nNear by Hanuman Mandir\nGamharia – Baijnathpur Road\nDist - Madhepura\nBihar - 852124', sub: '', color: 'green' },
          ].map(({ icon: Icon, label, value, sub, color }, idx) => (
            <div key={idx} className="card p-6 flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color === 'green' ? 'bg-brand-green-pale' : 'bg-brand-yellow-pale'}`}>
                <Icon className={`w-5 h-5 ${color === 'green' ? 'text-brand-green' : 'text-yellow-600'}`} />
              </div>
              <div>
                <p className="text-xs text-brand-text-muted font-medium uppercase tracking-wide whitespace-pre-line">{label}</p>
                <p className="font-semibold text-brand-text text-sm mt-0.5 whitespace-pre-line">{value}</p>
                {sub && <p className="text-brand-text-muted text-xs mt-0.5 whitespace-pre-line">{sub}</p>}
              </div>
            </div>
          ))}

          {/* Office Hours */}
          <div className="card p-6">
            <h3 className="font-semibold text-brand-text mb-3">{t('contact_office_hours')}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-brand-text-muted">{t('contact_mon_sat')}</span><span className="font-medium text-brand-text">9:00 AM – 6:00 PM</span></div>
              <div className="flex justify-between"><span className="text-brand-text-muted">{t('contact_sunday')}</span><span className="badge-yellow">{t('contact_closed')}</span></div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="card p-8">
            {!sent ? (
              <>
                <h2 className="text-xl font-bold text-brand-text mb-6">{t('contact_form_title')}</h2>
                {error && <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">⚠️ {error}</div>}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">{t('contact_name')} *</label>
                      <input className="input" placeholder="Ramesh Kumar" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="label">{t('contact_mobile')} *</label>
                      <input className="input" placeholder="9876543210" required type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">{t('contact_email')}</label>
                      <input className="input" placeholder="ramesh@email.com" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div>
                      <label className="label">{t('contact_subject')} *</label>
                      <select className="input" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                        <option value="">{t('contact_select_subject')}</option>
                        <option>{t('contact_plot_enquiry')}</option>
                        <option>{t('contact_land_enquiry')}</option>
                        <option>{t('contact_payment_issue')}</option>
                        <option>{t('contact_doc_issue')}</option>
                        <option>{t('contact_other')}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="label">{t('contact_message')} *</label>
                    <textarea className="input resize-none" rows="5" placeholder={t('contact_msg_placeholder')} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                    {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Sending...</> : <><Send className="w-4 h-4" /> {t('contact_send')}</>}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-brand-green-pale rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-brand-green" />
                </div>
                <h3 className="text-xl font-bold text-brand-text mb-2">{t('contact_sent_title')}</h3>
                <p className="text-brand-text-muted">{t('contact_sent_desc')}</p>
                <button onClick={() => setSent(false)} className="btn-outline mt-6">{t('contact_send_another')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
