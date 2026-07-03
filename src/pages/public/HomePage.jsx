import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, Search, Users, Star, Phone, CheckCircle2, TrendingUp, Shield, Leaf, ClipboardCheck, AlertCircle, Loader2 } from 'lucide-react';
import { services, testimonials } from '../../data/index';
import { useLanguage } from '../../context/LanguageContext';

function StatCard({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-brand-green">{number}</div>
      <div className="text-sm text-brand-text-muted mt-1">{label}</div>
    </div>
  );
}

function ServiceCard({ service, t }) {
  const colorMap = { green: 'bg-brand-green-pale text-brand-green', yellow: 'bg-brand-yellow-pale text-yellow-700' };
  const nameKey = `service_${service.id}_name`;
  const descKey = `service_${service.id}_desc`;
  return (
    <Link to={`/services/${service.id}`} className="card-hover group p-8 text-center">
      <div className={`w-16 h-16 rounded-2xl ${colorMap[service.color]} flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
        {service.icon}
      </div>
      <h3 className="font-bold text-brand-text text-lg mb-2 whitespace-pre-line">{t(nameKey)}</h3>
      <p className="text-brand-text-muted text-sm leading-relaxed mb-4 whitespace-pre-line">{t(descKey)}</p>
      <div className="flex items-center justify-center gap-1.5 text-brand-green text-sm font-semibold">
        {t('services_learn_more')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

  const handleCheck = (e) => {
    e.preventDefault();
    if (!requestId.trim()) {
      setError(t('request_empty'));
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    // Simulate API call — replace with real API later
    setTimeout(() => {
      // Demo: if ID starts with "SP" show a result, otherwise not found
      const id = requestId.trim().toUpperCase();
      if (id.startsWith('SP') || id.startsWith('REQ')) {
        setResult({
          id: id,
          service: t('service_maapi_name'),
          status: 'assigned',
          date: '15 Jun 2026',
          surveyTime: '10:30 AM',
          amin: 'Ram Chandra Mahto',
          district: 'Madhepura',
          remarks: t('request_demo_remark'),
        });
      } else {
        setResult('not_found');
      }
      setLoading(false);
    }, 1200);
  };

  const statusConfig = {
    pending:     { label: t('request_status_pending'),     color: 'badge-yellow' },
    assigned:    { label: t('request_status_assigned'),    color: 'badge-green' },
    in_progress: { label: t('request_status_in_progress'), color: 'bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold' },
    completed:   { label: t('request_status_completed'),   color: 'bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold' },
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-green-800 via-green-700 to-green-900 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-10 -left-10 w-48 h-48 border-2 border-white rounded-full" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 border-2 border-white rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 text-white rounded-full text-xs font-semibold mb-4 backdrop-blur-md border border-white/30">
            <ClipboardCheck className="w-3.5 h-3.5" /> {t('request_label')}
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 whitespace-pre-line">{t('request_title')}</h2>
          <p className="text-white/70 text-sm max-w-lg mx-auto whitespace-pre-line">{t('request_subtitle')}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <ClipboardCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted" />
              <input
                type="text"
                value={requestId}
                onChange={(e) => { setRequestId(e.target.value); setError(''); setResult(null); }}
                placeholder={t('request_placeholder')}
                className="input pl-12 w-full !rounded-xl !border-2 !border-brand-green-light focus:!border-brand-green"
                id="request-id-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 justify-center whitespace-nowrap disabled:opacity-60 !rounded-xl !py-3"
              id="request-status-btn"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {t('request_btn')}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-600 text-sm animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          {/* Not Found */}
          {result === 'not_found' && (
            <div className="mt-6 text-center py-6 bg-red-50 rounded-2xl animate-fade-in">
              <div className="text-3xl mb-2">🔍</div>
              <p className="text-red-600 font-medium text-sm">{t('request_not_found')}</p>
            </div>
          )}

          {/* Found Result */}
          {result && result !== 'not_found' && (
            <div className="mt-6 bg-brand-green-pale/50 rounded-2xl p-6 animate-fade-in border border-brand-green-light">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-5 h-5 text-brand-green" />
                <h3 className="font-bold text-brand-text">{t('request_found_title')}</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-brand-green-pale">
                  <span className="text-brand-text-muted">{t('request_id_label')}</span>
                  <span className="font-bold text-brand-text font-mono">{result.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-brand-green-pale">
                  <span className="text-brand-text-muted">{t('request_service_label')}</span>
                  <span className="font-semibold text-brand-text">{result.service}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-brand-green-pale">
                  <span className="text-brand-text-muted">{t('request_status_label')}</span>
                  <span className={statusConfig[result.status]?.color || 'badge-grey'}>
                    {statusConfig[result.status]?.label || result.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-brand-green-pale">
                  <span className="text-brand-text-muted">{t('request_date_label')}</span>
                  <span className="font-medium text-brand-text">{result.date}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-brand-green-pale">
                  <span className="text-brand-text-muted">{t('request_assigned_amin')}</span>
                  <span className="font-medium text-brand-text">{result.amin}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-brand-green-pale">
                  <span className="text-brand-text-muted">{t('request_survey_time')}</span>
                  <span className="font-medium text-brand-text">{result.surveyTime}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-brand-text-muted">{t('detail_district')}</span>
                  <span className="font-medium text-brand-text">{result.district}</span>
                </div>
                <div className="pt-2">
                  <span className="text-brand-text-muted">{t('request_remarks')}</span>
                  <p className="font-medium text-brand-text mt-1 whitespace-pre-line">{result.remarks}</p>
                </div>
              </div>
              <p className="text-xs text-brand-text-muted mt-4 text-center">{t('request_note')}</p>
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
      <section
        className="relative overflow-hidden pt-16 pb-20 px-4 bg-cover bg-center"
        style={{ backgroundImage: 'url("/hero-bg.png")' }}
      >
        {/* Dark overlay to make text readable over the bright background image */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />

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
      </section>

      {/* ── Stats Section ── */}
      <section className="bg-white py-12 border-y border-brand-green-pale">
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
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-brand-green font-semibold text-sm uppercase tracking-wider mb-2">{t('why_label')}</p>
            <h2 className="section-title">{t('why_title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: t('why_1_title'), desc: t('why_1_desc'), color: 'green' },
              { icon: TrendingUp, title: t('why_2_title'), desc: t('why_2_desc'), color: 'yellow' },
              { icon: Users, title: t('why_3_title'), desc: t('why_3_desc'), color: 'green' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="card text-center p-8">
                <div className={`w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center ${color === 'green' ? 'bg-brand-green-pale' : 'bg-brand-yellow-pale'}`}>
                  <Icon className={`w-6 h-6 ${color === 'green' ? 'text-brand-green' : 'text-yellow-600'}`} />
                </div>
                <h3 className="font-bold text-brand-text text-lg mb-2 whitespace-pre-line">{title}</h3>
                <p className="text-brand-text-muted text-sm leading-relaxed whitespace-pre-line">{desc}</p>
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

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-green-gradient rounded-3xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 left-4 w-24 h-24 border-2 border-white rounded-full" />
              <div className="absolute bottom-4 right-4 w-40 h-40 border-2 border-white rounded-full" />
            </div>
            <Leaf className="w-12 h-12 mx-auto mb-4 opacity-80 animate-float" />
            <h2 className="text-3xl font-bold mb-3">{t('cta_title')}</h2>
            <p className="text-white/80 mb-8 text-lg">{t('cta_subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/services" className="bg-white text-brand-green font-semibold px-8 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 inline-flex items-center gap-2 justify-center">
                <ClipboardCheck className="w-4 h-4" /> Explore Services
              </Link>
              <Link to="/under-construction" className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 inline-flex items-center gap-2 justify-center">
                <Phone className="w-4 h-4" /> {t('cta_register')}
              </Link>
            </div>
          </div>
        </div>
      </section>

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
