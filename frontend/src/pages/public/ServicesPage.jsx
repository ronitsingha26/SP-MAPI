import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { services } from '../../data/index';
import { useLanguage } from '../../context/LanguageContext';

function ServiceCard({ service, t }) {
  const nameKey = `service_${service.id}_name`;
  const descKey = `service_${service.id}_desc`;
  const Icon = service.icon;

  const serviceRoutes = {
    maapi: '/customer/services/mapi',
    division: '/customer/services/bantwara',
    map: '/customer/services/map',
    boundary: '/customer/services/mapi',
    digital: '/customer/services/map',
    tools: '/customer/services/tools',
  };

  return (
    <div className="group relative bg-white border border-gray-100 rounded-[2rem] p-8 md:p-10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_40px_rgba(34,197,94,0.15)] transition-all duration-500 hover:-translate-y-2 overflow-hidden flex flex-col h-full">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-brand-green/10 to-transparent rounded-bl-[4rem] opacity-70 group-hover:scale-125 transition-transform duration-700 ease-out z-0" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-brand-green/5 to-transparent rounded-tr-[3rem] opacity-70 group-hover:scale-110 transition-transform duration-500 ease-out z-0" />
      <div className="absolute inset-0 border-[3px] border-transparent group-hover:border-brand-green/5 rounded-[2rem] transition-colors duration-500 pointer-events-none z-0" />
      
      <div className="relative z-10 mx-auto mb-8">
        <div className="absolute inset-0 bg-brand-green-light/40 blur-xl rounded-full scale-50 group-hover:scale-110 transition-transform duration-500" />
        <div className="relative w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-white to-brand-green-pale flex items-center justify-center text-brand-green mx-auto shadow-sm border border-brand-green/10 group-hover:rotate-[8deg] group-hover:scale-110 group-hover:shadow-md transition-all duration-500">
          {typeof Icon === 'function' || typeof Icon === 'object' ? <Icon className="w-10 h-10 stroke-[1.5]" /> : <span className="text-4xl">{Icon}</span>}
        </div>
      </div>
      
      <div className="relative z-10 flex-grow flex flex-col">
        <h3 className="font-extrabold text-brand-text text-2xl mb-4 whitespace-pre-line group-hover:text-brand-green transition-colors duration-300 tracking-tight">{t(nameKey)}</h3>
        <p className="text-gray-500 text-[15px] leading-relaxed mb-8 whitespace-pre-line flex-grow">{t(descKey)}</p>
        
        <Link to={serviceRoutes[service.id] || '/login'} className="mt-auto inline-flex items-center justify-center gap-3 w-full bg-brand-green text-white font-bold text-sm py-4 px-6 rounded-xl hover:bg-brand-green-dark hover:shadow-lg transition-all duration-300">
          Apply Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Premium Hero Section */}
      <div className="relative bg-brand-text py-24 px-4 overflow-hidden mb-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-green/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-green-light/20 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-brand-green/10 text-brand-green-light border border-brand-green/20 rounded-full text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <CheckCircle2 className="w-4 h-4" /> {t('services_page_label')}
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm whitespace-pre-line">
            {t('services_page_title')}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto whitespace-pre-line font-light">
            {t('services_page_subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(s => <ServiceCard key={s.id} service={s} t={t} />)}
        </div>
      </div>
    </div>
  );
}
