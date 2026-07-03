import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Search, Users, Star, Phone, CheckCircle2, TrendingUp, Shield, Leaf, ClipboardCheck, AlertCircle, Loader2, ChevronDown, Send, RefreshCw, Mail } from 'lucide-react';
import { services, testimonials } from '../../data/index';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../utils/api';
import FlowingMenu from '../../components/FlowingMenu';

function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-brand-green">{number}</div>
      <div className="text-sm text-brand-text-muted mt-1">{label}</div>
    </div>
  );
}

function ServiceCard({ service, t }) {
  const nameKey = `service_${service.id}_name`;
  const descKey = `service_${service.id}_desc`;
  const Icon = service.icon;

  return (
    <Link to="/services" className="group relative bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(34,197,94,0.15)] transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
      {/* Decorative premium gradients */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-brand-green/10 to-transparent rounded-bl-[4rem] opacity-70 group-hover:scale-125 transition-transform duration-700 ease-out z-0" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-brand-green/5 to-transparent rounded-tr-[3rem] opacity-70 group-hover:scale-110 transition-transform duration-500 ease-out z-0" />
      <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-brand-green/5 rounded-[2rem] transition-colors duration-500 pointer-events-none z-0" />
      
      {/* Floating Icon Wrapper */}
      <div className="relative z-10 mx-auto mb-8">
        <div className="absolute inset-0 bg-brand-green-light/40 blur-xl rounded-full scale-50 group-hover:scale-110 transition-transform duration-500" />
        <div className="relative w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-white to-brand-green-pale flex items-center justify-center text-brand-green mx-auto shadow-sm border border-brand-green/10 group-hover:rotate-[8deg] group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
          {typeof Icon === 'function' || typeof Icon === 'object' ? <Icon className="w-10 h-10 stroke-[1.5]" /> : <span className="text-4xl">{Icon}</span>}
        </div>
      </div>
      
      <div className="relative z-10 flex-grow flex flex-col">
        <h3 className="font-extrabold text-brand-text text-2xl mb-4 whitespace-pre-line group-hover:text-brand-green transition-colors duration-300 tracking-tight">{t(nameKey)}</h3>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-8 whitespace-pre-line flex-grow">{t(descKey)}</p>
        
        {/* Modern Button */}
        <div className="mt-auto inline-flex items-center justify-center gap-3 w-full bg-brand-green-pale/40 text-brand-green font-bold text-sm py-3 px-6 rounded-xl group-hover:bg-brand-green group-hover:text-white transition-all duration-300">
          {t('services_learn_more')}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
        </div>
      </div>
    </Link>
  );
}



function TestimonialCard({ t: tFn, testimonial, index }) {
  const textKey = `testimonial_${index + 1}`;
  return (
    <div className="card p-6">
      <div className="flex items-center gap-1 mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-brand-yellow text-brand-yellow" />
        ))}
      </div>
      <p className="text-brand-text-muted text-sm leading-relaxed mb-4">"{tFn(textKey)}"</p>
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-brand-green-pale flex items-center justify-center font-semibold text-brand-green">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-brand-text text-sm">{testimonial.name}</p>
          <p className="text-xs text-brand-text-muted">{testimonial.district} · {testimonial.service}</p>
        </div>
      </div>
    </div>
  );
}

// ── Request Status Check Component ──
function RequestStatusSection({ t }) {
  const [requestId, setRequestId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // null | 'not_found' | { ...data }
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!requestId.trim()) {
      setError(t('request_empty'));
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const res = await api.get(`/applications/track/${requestId.trim().toUpperCase()}`);
      const app = res.data.application;
      if (app) {
        setResult({
          id: app.app_id,
          service: app.service_type === 'mapi' ? 'Mapi Registration'
                 : app.service_type === 'bantwara' ? 'Bantwara Registration'
                 : 'Map Request',
          status: app.status,
          date: app.created_at ? new Date(app.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
          amin: app.amin_name || 'Not Assigned Yet',
          district: app.district || '—',
          remarks: app.admin_remark || 'No remarks yet.',
          updated_at: app.updated_at ? new Date(app.updated_at).toLocaleDateString('en-IN') : '—',
        });
      } else {
        setResult('not_found');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setResult('not_found');
      } else {
        setError(err.response?.data?.message || 'Error checking status. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending:     { label: t('request_status_pending'),     color: 'badge-yellow' },
    assigned:    { label: t('request_status_assigned'),    color: 'badge-green' },
    in_progress: { label: t('request_status_in_progress'), color: 'bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold' },
    completed:   { label: t('request_status_completed'),   color: 'bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold' },
  };

  return (
    <section id="track-application" className="py-24 px-4 relative overflow-hidden bg-brand-text">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-green/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-green-light/20 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-brand-green/10 text-brand-green-light border border-brand-green/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <ClipboardCheck className="w-4 h-4" /> {t('request_label')}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm whitespace-pre-line">
            {t('request_title')}
          </h2>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto whitespace-pre-line font-light">
            {t('request_subtitle')}
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-green-light via-brand-green to-brand-green-light rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#1A231E]/80 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-8 md:p-10">
            <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-green/10 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-brand-green-light" />
                </div>
                <input
                  type="text"
                  value={requestId}
                  onChange={(e) => { setRequestId(e.target.value); setError(''); setResult(null); }}
                  placeholder={t('request_placeholder')}
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-2xl py-4 pl-20 pr-6 text-lg focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all shadow-inner"
                  id="request-id-input"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-brand-green hover:bg-brand-green-light text-white font-bold py-4 px-10 rounded-2xl shadow-[0_8px_20px_rgba(34,197,94,0.3)] hover:shadow-[0_10px_25px_rgba(34,197,94,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:hover:translate-y-0"
                id="request-status-btn"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                <span className="text-lg">{t('request_btn')}</span>
              </button>
            </form>

            {/* Error */}
            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm animate-fade-in backdrop-blur-md">
                <AlertCircle className="w-5 h-5 flex-shrink-0" /> 
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Not Found */}
            {result === 'not_found' && (
              <div className="mt-8 text-center py-10 bg-white/5 border border-white/10 rounded-2xl animate-fade-in backdrop-blur-md">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-red-400 opacity-50" />
                </div>
                <p className="text-red-300 font-medium text-lg">{t('request_not_found')}</p>
                <p className="text-gray-400 text-sm mt-2">Please double-check your application ID.</p>
              </div>
            )}

            {/* Found Result */}
            {result && result !== 'not_found' && (
              <div className="mt-8 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-1 animate-fade-in border border-white/10 overflow-hidden">
                <div className="bg-[#1A231E] rounded-[22px] p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                    <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center border border-brand-green/30 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                      <CheckCircle2 className="w-6 h-6 text-brand-green-light" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{t('request_found_title')}</h3>
                      <p className="text-brand-green-light text-xs font-mono tracking-wider">{result.id}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1">
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{t('request_service_label')}</span>
                      <p className="font-medium text-white text-base">{result.service}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{t('request_status_label')}</span>
                      <div>
                        <span className={`inline-flex px-3 py-1 text-xs font-bold uppercase rounded-full ${result.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : result.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                          {statusConfig[result.status]?.label || result.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{t('request_date_label')}</span>
                      <p className="font-medium text-gray-200 text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
                        {result.date}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">{t('detail_district')}</span>
                      <p className="font-medium text-gray-200 text-sm">{result.district}</p>
                    </div>
                    <div className="space-y-1 sm:col-span-2 bg-white/5 p-4 rounded-xl border border-white/5">
                      <span className="text-brand-green-light text-xs font-semibold uppercase tracking-wider block mb-2">{t('request_assigned_amin')}</span>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-white text-base">{result.amin}</p>
                        <div className="text-right">
                          <span className="text-gray-400 text-[10px] uppercase tracking-wider block mb-0.5">{t('request_survey_time')}</span>
                          <p className="font-medium text-gray-200 text-sm">{result.surveyTime || '—'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-2 pt-2">
                      <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider block mb-2">{t('request_remarks')}</span>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line bg-black/20 p-4 rounded-xl border border-white/5 italic">"{result.remarks}"</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contact Section Component ──
function ContactSection({ t }) {
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
    <section className="py-24 px-4 bg-gray-50/50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-green/5 text-brand-green border border-brand-green/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Mail className="w-3.5 h-3.5" /> {t('contact_label') || 'Contact Us'}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text mb-4 tracking-tight">{t('contact_title') || 'Get in Touch'}</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">{t('contact_subtitle') || 'We are here to help. Send us a message and we will respond as soon as possible.'}</p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 relative">
          {!sent ? (
            <>
              {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2"><AlertCircle className="w-5 h-5"/> {error}</div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t('contact_name')} *</label>
                    <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all" placeholder="Ramesh Kumar" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t('contact_mobile')} *</label>
                    <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all" placeholder="9876543210" required type="tel" value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t('contact_email')}</label>
                    <input className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all" placeholder="ramesh@email.com" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">{t('contact_subject')} *</label>
                    <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                      <option value="">{t('contact_select_subject')}</option>
                      <option>{t('contact_plot_enquiry')}</option>
                      <option>{t('contact_land_enquiry')}</option>
                      <option>{t('contact_payment_issue')}</option>
                      <option>{t('contact_doc_issue')}</option>
                      <option>{t('contact_other')}</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">{t('contact_message')} *</label>
                  <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-green/20 focus:border-brand-green outline-none transition-all resize-none" rows="4" placeholder={t('contact_msg_placeholder')} required value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-brand-green hover:bg-brand-green-dark text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-brand-green/20 disabled:opacity-70">
                  {loading ? <><RefreshCw className="w-5 h-5 animate-spin" /> Sending...</> : <><Send className="w-5 h-5" /> {t('contact_send')}</>}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-brand-green" />
              </div>
              <h3 className="text-2xl font-bold text-brand-text mb-3">{t('contact_sent_title')}</h3>
              <p className="text-gray-500 mb-8">{t('contact_sent_desc')}</p>
              <button onClick={() => setSent(false)} className="px-8 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-brand-green hover:text-brand-green transition-all">{t('contact_send_another')}</button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <div>
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 animate-fade-in"
          src="/videos/hero-bg.mp4"
        />
        {/* Dark overlay to make text readable over the background video */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-0" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold mb-6 animate-fade-in backdrop-blur-md border border-white/30">
              <Leaf className="w-4 h-4" /> {t('hero_badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 animate-fade-in drop-shadow-lg whitespace-pre-line">
              {t('hero_title_1')}
              <span className="text-brand-green-pale block drop-shadow-md">{t('hero_title_2')}</span>
              <span className="text-brand-yellow block drop-shadow-md">{t('hero_title_3')}</span>
            </h1>
            <p className="text-white/90 text-lg mb-8 leading-relaxed animate-fade-in drop-shadow-md whitespace-pre-line">
              {t('hero_desc')}
            </p>

            {/* Service CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-8 animate-fade-in">
              <Link to="/services/mapi" className="btn-primary px-8 justify-center">
                <ClipboardCheck className="w-4 h-4" /> Apply for Jameen Mapi
              </Link>
              <Link to="/services" className="btn-secondary px-8 justify-center">
                <ArrowRight className="w-4 h-4" /> Explore Services
              </Link>
            </div>

            <div className="flex flex-wrap gap-3 animate-fade-in drop-shadow-md">
              <span className="flex items-center gap-1.5 text-sm text-white/90 font-medium"><CheckCircle2 className="w-4 h-4 text-brand-green-pale" /> {t('hero_feat_booking')}</span>
              <span className="flex items-center gap-1.5 text-sm text-white/90 font-medium"><CheckCircle2 className="w-4 h-4 text-brand-green-pale" /> {t('hero_feat_otp')}</span>
              <span className="flex items-center gap-1.5 text-sm text-white/90 font-medium"><CheckCircle2 className="w-4 h-4 text-brand-green-pale" /> {t('hero_feat_payment')}</span>
              <span className="flex items-center gap-1.5 text-sm text-white/90 font-medium"><CheckCircle2 className="w-4 h-4 text-brand-green-pale" /> {t('hero_feat_amins')}</span>
            </div>
          </div>
        </div>

        {/* Flowing Menu Banner (Ticker) */}
        <div className="absolute bottom-0 left-0 w-full h-10 sm:h-12 z-10 border-t border-white/20 backdrop-blur-sm">
          <FlowingMenu 
            items={[
              { link: '/services', text: t('hero_flowing_services') }
            ]}
            speed={25}
            bgColor="rgba(0, 0, 0, 0.4)"
            marqueeBgColor="rgba(250, 204, 21, 0.9)" /* vibrant yellow */
            marqueeTextColor="#000000"
            borderColor="transparent"
          />
        </div>

        {/* Scroll Down Button */}
        <button 
          onClick={() => document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-28 right-8 w-14 h-14 bg-brand-green text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-brand-green-dark hover:scale-110 transition-all duration-300 animate-bounce z-20 cursor-pointer border-2 border-white/20 backdrop-blur-sm"
          title="Scroll Down"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* ── Stats Section ── */}
      <section id="stats-section" className="bg-white py-12 border-y border-brand-green-pale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="500+" label={t('stat_plots')} />
            <StatCard number="1,200+" label={t('stat_customers')} />
            <StatCard number="35+" label={t('stat_amins')} />
            <StatCard number="15" label={t('stat_districts')} />
          </div>
        </div>
      </section>

      {/* ── Request Status Check ── */}
      <RequestStatusSection t={t} />

      {/* ── About Company Section with image.png ── */}
      <section className="py-20 px-4 bg-brand-cream-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-wider mb-2">{t('about_company_label')}</p>
            <h2 className="section-title whitespace-pre-line">{t('about_company_title')}</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-hover group">
              <img
                src="/image.png"
                alt="SP MAPI Land Survey Services"
                className="w-full h-auto object-cover rounded-3xl group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl" />
            </div>
            {/* Content */}
            <div>
            <p className="text-brand-text-muted text-base leading-relaxed mb-6 whitespace-pre-line">
                {t('about_company_desc')}
              </p>
              <div className="space-y-4 mb-8">
                {[
                  t('about_company_feat1'),
                  t('about_company_feat2'),
                  t('about_company_feat3'),
                  t('about_company_feat4'),
                  t('about_company_feat5'),
                ].map((feat, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                    <p className="text-brand-text text-sm font-medium whitespace-pre-line">{feat}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <Link to="/about" className="btn-primary">
                  {t('about_company_know_more')} <ArrowRight className="w-4 h-4" />
                </Link>
                <a href="tel:+917979835440" className="btn-outline">
                  <Phone className="w-4 h-4" /> +91 7979835440
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Section ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-wider mb-2">{t('services_label')}</p>
            <h2 className="section-title whitespace-pre-line">{t('services_title')}</h2>
            <p className="section-subtitle max-w-xl mx-auto mt-3 whitespace-pre-line">{t('services_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(s => <ServiceCard key={s.id} service={s} t={t} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline">{t('services_view_all')} <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>



      {/* ── Why Choose Us ── */}
      <section className="py-24 px-4 bg-gray-50/50 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-green-pale/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-yellow-pale/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-green/5 text-brand-green border border-brand-green/20 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
              <Star className="w-3.5 h-3.5" /> {t('why_label')}
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-brand-text mb-4 tracking-tight whitespace-pre-line">{t('why_title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: t('why_1_title'), desc: t('why_1_desc'), color: 'green' },
              { icon: TrendingUp, title: t('why_2_title'), desc: t('why_2_desc'), color: 'yellow' },
              { icon: Users, title: t('why_3_title'), desc: t('why_3_desc'), color: 'green' },
            ].map(({ icon: Icon, title, desc, color }, idx) => (
              <div key={title} className="group relative bg-white rounded-[2rem] p-10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgba(34,197,94,0.12)] transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1.5 ${color === 'green' ? 'bg-brand-green' : 'bg-brand-yellow'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl ${color === 'green' ? 'bg-brand-green/10' : 'bg-yellow-500/10'} group-hover:scale-150 transition-transform duration-700`} />
                
                <div className={`relative z-10 w-20 h-20 rounded-[1.5rem] mx-auto mb-8 flex items-center justify-center ${color === 'green' ? 'bg-gradient-to-br from-brand-green-pale to-white text-brand-green' : 'bg-gradient-to-br from-brand-yellow-pale to-white text-yellow-600'} shadow-sm border ${color === 'green' ? 'border-brand-green/10' : 'border-yellow-500/10'} group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}>
                  <Icon className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="relative z-10 font-bold text-brand-text text-xl mb-4 whitespace-pre-line group-hover:text-brand-green transition-colors duration-300">{title}</h3>
                <p className="relative z-10 text-gray-500 text-[15px] leading-relaxed whitespace-pre-line">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-20 px-4 bg-brand-yellow-pale/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-wider mb-2">{t('testimonials_label')}</p>
            <h2 className="section-title">{t('testimonials_title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => <TestimonialCard key={testimonial.id} t={t} testimonial={testimonial} index={index} />)}
          </div>
        </div>
      </section>

      {/* ── Contact Us Section ── */}
      <ContactSection t={t} />

      {/* ── Promotional Banner ── */}
      <section className="py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-card group">
            <img
              src="/image copy.png"
              alt="SP MAPI Promotional Banner"
              className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
