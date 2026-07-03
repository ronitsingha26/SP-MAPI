import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  const footerLinks = {
    [t('footer_company')]: [
      { label: t('footer_about_us'), to: '/about' },
      { label: t('footer_our_team'), to: '/about#team' },
      { label: t('footer_careers'), to: '/about#careers' },
      { label: t('footer_contact'), to: '/contact' },
    ],
    [t('footer_services')]: [
      { label: t('footer_maapi'), to: '/services/maapi' },
      { label: t('footer_division'), to: '/services/division' },
      { label: t('footer_map'), to: '/services/map' },
      { label: t('footer_boundary'), to: '/services/boundary' },
    ],
    [t('footer_quick')]: [
      { label: t('footer_admin_login'), to: '/admin/login' },
    ],
  };

  return (
    <footer className="bg-white border-t-2 border-brand-green-pale mt-20">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img
                src="/logo.png"
                alt="SP MAPI Logo"
                className="w-10 h-10 rounded-xl object-contain shadow-soft"
              />
              <div>
                <span className="font-bold text-brand-text text-xl">{t('footer_brand_name')}</span>
                <p className="text-xs text-brand-text-muted whitespace-pre-line">{t('footer_brand_tagline')}</p>
              </div>
            </Link>
            <p className="text-brand-text-muted text-sm leading-relaxed mb-6 max-w-xs whitespace-pre-line">
              {t('footer_brand_desc')}
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-brand-text-muted">
                <Mail className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>office@spmapi.co.in</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-text-muted">
                <Phone className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span>+91 7979835440</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-text-muted">
                <MapPin className="w-4 h-4 text-brand-green flex-shrink-0" />
                <span className="whitespace-pre-line">{t('footer_head_office')}</span>
              </div>
            </div>
            {/* Social */}
            <div className="flex items-center gap-4 mt-6 text-sm font-medium text-brand-green">
              <Link to="/about" className="hover:underline">{t('footer_about_us')}</Link>
              <Link to="/contact" className="hover:underline">{t('footer_contact')}</Link>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-brand-text mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link to={to} className="text-sm text-brand-text-muted hover:text-brand-green transition-colors duration-150">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-brand-green-pale bg-brand-green-pale/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-brand-text-muted">
            {t('footer_copyright')}
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-brand-text-muted hover:text-brand-green transition-colors">{t('footer_privacy')}</Link>
            <Link to="/terms" className="text-xs text-brand-text-muted hover:text-brand-green transition-colors">{t('footer_terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
