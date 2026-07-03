import { createContext, useContext, useState, useCallback } from 'react';
import translations from '../data/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('spmapi_lang');
      return ['en', 'hi', 'both'].includes(saved) ? saved : 'en';
    } catch {
      return 'en';
    }
  });

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'hi' : prev === 'hi' ? 'both' : 'en';
      try {
        localStorage.setItem('spmapi_lang', next);
      } catch (error) {
        void error;
      }
      return next;
    });
  }, []);

  const t = useCallback((key) => {
    const entry = translations[key];
    if (!entry) return key;
    if (language === 'both') {
      return entry.both || `${entry.en || key}\n${entry.hi || entry.en || key}`;
    }
    return entry[language] || entry.en || key;
  }, [language]);

  const setAppLanguage = useCallback((next) => {
    if (!['en', 'hi', 'both'].includes(next)) return;
    setLanguage(next);
    try {
      localStorage.setItem('spmapi_lang', next);
    } catch (error) {
      void error;
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setAppLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
