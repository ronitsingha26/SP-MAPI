import { Shield, Users, Award, Target, Leaf } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AboutPage() {
  const { t } = useLanguage();


  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-gradient py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-hover">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-brand-text mb-4 whitespace-pre-line">{t('about_hero_title')}</h1>
          <p className="text-brand-text-muted text-lg leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
            {t('about_hero_desc')}
          </p>
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card p-8">
            <div className="w-12 h-12 bg-brand-green-pale rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-brand-green" />
            </div>
            <h2 className="text-xl font-bold text-brand-text mb-3 whitespace-pre-line">{t('about_mission_title')}</h2>
            <p className="text-brand-text-muted leading-relaxed whitespace-pre-line">
              {t('about_mission_desc')}
            </p>
          </div>
          <div className="card p-8">
            <div className="w-12 h-12 bg-brand-yellow-pale rounded-xl flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-brand-text mb-3 whitespace-pre-line">{t('about_vision_title')}</h2>
            <p className="text-brand-text-muted leading-relaxed whitespace-pre-line">
              {t('about_vision_desc')}
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 px-4 bg-brand-cream-dark">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-text text-center mb-10">{t('about_values_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: '🔒', title: t('about_val_transparency'), desc: t('about_val_transparency_desc') },
              { emoji: '⚡', title: t('about_val_speed'), desc: t('about_val_speed_desc') },
              { emoji: '🤝', title: t('about_val_trust'), desc: t('about_val_trust_desc') },
              { emoji: '🌱', title: t('about_val_access'), desc: t('about_val_access_desc') },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="card text-center p-6">
                <div className="text-3xl mb-3">{emoji}</div>
                <h3 className="font-bold text-brand-text mb-2 whitespace-pre-line">{title}</h3>
                <p className="text-sm text-brand-text-muted whitespace-pre-line">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Company Info */}
      <section className="py-12 px-4 bg-brand-green-pale/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-brand-text text-center mb-8">{t('about_company_title_page')}</h2>
          <div className="card p-8">
            <div className="space-y-4 text-sm">
              {[
                [t('about_company_label_page'), 'SPMAPI Private Limited'],
                [t('about_cin'), 'U74909BR2026PTC083930'],
                [t('about_reg'), '083930'],
                [t('about_head_office'), 'Plot No. 432, VCT - Kumhra\nPost - Mirzapur\nDist - Araria\nBihar - 854312'],
                [t('about_branch'), 'Chaudhary Tola, Ward - 05\nVCT - Ghailarh Jiwachhpur\nNear by Hanuman Mandir\nGamharia – Baijnathpur Road\nDist - Madhepura\nBihar - 852124'],
                [t('about_website'), 'https://spmapi.co.in'],
                [t('about_email'), 'office@spmapi.co.in'],
                [t('about_contact_lbl'), '+91 7979835440'],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col sm:flex-row sm:justify-between gap-1 py-3 border-b border-brand-green-pale last:border-0">
                  <span className="text-brand-text-muted font-medium w-32">{label}</span>
                  <span className="text-brand-text font-semibold whitespace-pre-line sm:text-right">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
