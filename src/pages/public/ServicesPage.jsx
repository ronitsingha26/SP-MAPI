import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { services } from '../../data/index';
import { useLanguage } from '../../context/LanguageContext';

function ServiceCard({ service, t }) {
  const bg = service.color === 'green' ? 'bg-brand-green-pale' : 'bg-brand-yellow-pale';
  const nameKey = `service_${service.id}_name`;

  const serviceRoutes = {
    maapi: '/services/mapi',
    division: '/services/bantwara',
    map: '/services/provide-map',
    boundary: '/services/mapi',
    digital: '/services/provide-map',
    tools: '/under-construction',
  };

  return (
    <div className="card p-8 hover:shadow-hover transition-all duration-200 flex flex-col items-center text-center">
      <div className={`w-16 h-16 ${bg} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
        {service.icon}
      </div>
      <h2 className="text-xl font-bold text-brand-text mb-6 whitespace-pre-line">{t(nameKey)}</h2>

      <Link to={serviceRoutes[service.id] || '/contact'} className="btn-primary w-full justify-center mt-auto">
        {t('service_book')} {t(nameKey)} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <p className="text-brand-green font-semibold text-sm uppercase tracking-wider mb-2 whitespace-pre-line">{t('services_page_label')}</p>
        <h1 className="text-4xl font-bold text-brand-text mb-3 whitespace-pre-line">{t('services_page_title')}</h1>
        <p className="text-brand-text-muted text-lg max-w-2xl mx-auto whitespace-pre-line">
          {t('services_page_subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(s => <ServiceCard key={s.id} service={s} t={t} />)}
      </div>
    </div>
  );
}
