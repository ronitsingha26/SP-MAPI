import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Building2, Wrench, Info, Phone, LogIn,
  Menu, X, ChevronDown, MapPin, Globe, User, LogOut,
  ClipboardList, GitBranch, Map, ClipboardCheck, UserPlus
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();
  const { currentUser, logout } = useAuth();

  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    if (currentUser?.role === 'admin') {
      navigate('/admin/login');
    } else if (currentUser?.role === 'amin') {
      navigate('/amin/login');
    } else if (currentUser?.role === 'superadmin') {
      navigate('/superadmin/login');
    } else {
      navigate('/');
    }
  };

  // Service links redirect to customer forms (require login)
  const getServiceLink = (service) => {
    if (currentUser && currentUser.role === 'customer') {
      return `/customer/services/${service}`;
    }
    return `/login?redirect=/customer/services/${service}`;
  };

  const servicesDropdown = [
    { label: 'Apply for MAPI', service: 'mapi', icon: ClipboardList },
    { label: 'Apply for Batwara', service: 'bantwara', icon: GitBranch },
    { label: 'Apply for Map', service: 'map', icon: Map },
    { label: 'Apply for Amin Tools', service: 'tools', icon: Wrench },
    { label: 'Apply as Amin', service: null, icon: UserPlus, directTo: '/apply-amin' },
  ];
  const languageLabel = language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'English + हिन्दी';

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <>
      <header className="sticky top-0 z-50 glass border-b border-brand-green-light shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="SP MAPI Logo"
              className="w-20 h-20 rounded-xl object-contain shadow-soft group-hover:shadow-hover transition-all"
            />
            <div>
              <span className="font-bold text-brand-text text-lg leading-none">SP MAPI</span>
              <p className="text-[10px] text-brand-text-muted leading-none">{t('nav_subtitle')}</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive('/') ? 'bg-brand-green-pale text-brand-green font-semibold' : 'text-brand-text-muted hover:bg-brand-green-pale hover:text-brand-green'}`}>
              {t('nav_home')}
            </Link>

            <Link to="/about" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive('/about') ? 'bg-brand-green-pale text-brand-green font-semibold' : 'text-brand-text-muted hover:bg-brand-green-pale hover:text-brand-green'}`}>
              {t('nav_about')}
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive('/services') || isActive('/customer/services') ? 'bg-brand-green-pale text-brand-green font-semibold' : 'text-brand-text-muted hover:bg-brand-green-pale hover:text-brand-green'}`}
              >
                {t('nav_services')} <ChevronDown className={`w-3 h-3 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 animate-fade-in">
                  <div className="bg-white rounded-2xl shadow-card border border-brand-green-pale p-2 flex flex-col gap-1">
                    <Link
                      to="/services"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-brand-green-pale transition-colors group mb-1 border-b border-gray-100"
                    >
                      <div className="p-1.5 rounded-lg bg-gray-50 text-brand-text-muted group-hover:bg-brand-green group-hover:text-white transition-colors">
                        <ClipboardCheck className="w-4 h-4" />
                      </div>
                      <div className="flex items-center h-full">
                        <p className="text-sm font-bold text-brand-text group-hover:text-brand-green">
                          View All Services
                        </p>
                      </div>
                    </Link>
                    {servicesDropdown.map((item) => {
                      const Icon = item.icon;
                      const to = item.directTo || getServiceLink(item.service);
                      return (
                        <Link
                          key={item.label}
                          to={to}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-start gap-3 p-3 rounded-xl hover:bg-brand-green-pale transition-colors group`}
                        >
                          <div className={`p-1.5 rounded-lg bg-gray-50 text-brand-text-muted group-hover:bg-brand-green group-hover:text-white transition-colors`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex items-center h-full pt-1">
                            <p className={`text-sm font-semibold text-brand-text group-hover:text-brand-green`}>
                              {item.label}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={(e) => {
                e.preventDefault();
                if (location.pathname === '/') {
                  const el = document.getElementById('track-application');
                  if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                } else {
                  navigate('/', { state: { scrollTo: 'track-application' } });
                }
              }}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 text-brand-text-muted hover:bg-brand-green-pale hover:text-brand-green"
            >
              Track Application
            </button>

            <Link to="/contact" className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${isActive('/contact') ? 'bg-brand-green-pale text-brand-green font-semibold' : 'text-brand-text-muted hover:bg-brand-green-pale hover:text-brand-green'}`}>
              {t('nav_contact')}
            </Link>
          </nav>

          {/* CTA Buttons + Language Toggle */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border-2 border-brand-green-light hover:border-brand-green hover:bg-brand-green-pale"
              title="Switch language"
            >
              <Globe className="w-4 h-4 text-brand-green" />
              <span className="text-brand-text">{languageLabel}</span>
            </button>

            {currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-brand-green-pale hover:bg-brand-green-pale transition-colors"
                >
                  <div className="w-7 h-7 bg-brand-green text-white rounded-full flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-sm font-semibold text-brand-text">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-brand-text-muted" />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-card border border-brand-green-pale p-2 animate-fade-in">
                    <Link
                      to={currentUser.role === 'amin' ? '/amin/dashboard' : currentUser.role === 'admin' || currentUser.role === 'superadmin' ? '/admin/dashboard' : '/customer/dashboard'}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 w-full p-2 text-sm text-brand-text hover:bg-brand-green-pale hover:text-brand-green rounded-xl transition-colors font-medium"
                    >
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full p-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-outline">
                  <LogIn className="w-4 h-4" /> Login
                </Link>
                <Link to="/register" className="btn-primary">
                  <User className="w-4 h-4" /> Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Language Toggle + Menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border-2 border-brand-green-light hover:border-brand-green transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-brand-green" />
              {language === 'en' ? 'हिंदी' : language === 'hi' ? 'EN+हिं' : 'EN'}
            </button>
            <button
              className="p-2 rounded-lg hover:bg-brand-green-pale transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-brand-green-pale shadow-card animate-fade-in overflow-y-auto max-h-[80vh]">
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-green-pale"><Home className="w-4 h-4" /> {t('nav_home')}</Link>
            <Link to="/properties" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-green-pale"><Building2 className="w-4 h-4" /> {t('nav_properties')}</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-green-pale"><Info className="w-4 h-4" /> {t('nav_about')}</Link>

            {/* Mobile Services Section */}
            <div className="py-2">
              <p className="px-4 py-1 text-xs font-bold text-brand-text-muted uppercase tracking-wider">Services</p>
              {servicesDropdown.map(item => {
                const Icon = item.icon;
                const to = item.directTo || getServiceLink(item.service);
                return (
                  <Link key={item.label} to={to} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 ml-2 border-l-2 border-brand-green-pale rounded-r-xl text-sm font-medium text-brand-text hover:bg-brand-green-pale hover:border-brand-green">
                    <Icon className="w-4 h-4 text-brand-green" /> {item.label}
                  </Link>
                );
              })}
            </div>

            <Link to="/contact" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-text hover:bg-brand-green-pale"><Phone className="w-4 h-4" /> {t('nav_contact')}</Link>

            <div className="pt-3 pb-1 flex flex-col gap-2 border-t border-brand-green-pale mt-2">
              {currentUser && (
                <>
                  <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)} className="btn-primary justify-center">
                    <User className="w-4 h-4" /> Go to Dashboard
                  </Link>
                  <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="btn-outline justify-center !text-red-500 !border-red-200 hover:!bg-red-50">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>

      {/* Appointment Modal */}
      {appointmentModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setAppointmentModalOpen(false)} className="absolute top-4 right-4 text-brand-text-muted hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6 mt-2">
              <h2 className="text-xl font-bold text-brand-text mb-1">Book an Appointment</h2>
              <p className="text-sm text-brand-text-muted mb-6">Fill out the details below and we will get back to you shortly.</p>
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Appointment booked successfully!'); setAppointmentModalOpen(false); }}>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-1 uppercase tracking-wider">Full Name</label>
                  <input type="text" required className="w-full px-4 py-2.5 rounded-xl border-2 border-brand-green-pale focus:border-brand-green focus:outline-none transition-colors" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-1 uppercase tracking-wider">Email ID</label>
                  <input type="email" required className="w-full px-4 py-2.5 rounded-xl border-2 border-brand-green-pale focus:border-brand-green focus:outline-none transition-colors" placeholder="Enter your email" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-1 uppercase tracking-wider">Phone Number</label>
                  <input type="tel" required className="w-full px-4 py-2.5 rounded-xl border-2 border-brand-green-pale focus:border-brand-green focus:outline-none transition-colors" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-1 uppercase tracking-wider">Service</label>
                  <select required className="w-full px-4 py-2.5 rounded-xl border-2 border-brand-green-pale focus:border-brand-green focus:outline-none transition-colors bg-white">
                    <option value="">Select a service</option>
                    <option value="mapi">Apply for MAPI</option>
                    <option value="batwara">Apply for Batwara</option>
                    <option value="map">Apply for Map</option>
                    <option value="tools">Apply for all Amin Tools</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-brand-text-muted mb-1 uppercase tracking-wider">Query</label>
                  <textarea rows="3" className="w-full px-4 py-2.5 rounded-xl border-2 border-brand-green-pale focus:border-brand-green focus:outline-none transition-colors resize-none" placeholder="Enter your query here..."></textarea>
                </div>
                <button type="submit" className="w-full btn-primary justify-center pt-3 pb-3 mt-2">Book Appointment</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
