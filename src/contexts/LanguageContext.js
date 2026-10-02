import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
export const useOptionalLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('ko'); // 기본값은 한국어
  const [languageTransitioning, setLanguageTransitioning] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const switchLanguage = (lang) => {
    if (lang === language || timer.current !== null) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setLanguage(lang);
      return;
    }
    setLanguageTransitioning(true);
    timer.current = window.setTimeout(() => {
      setLanguage(lang);
      setLanguageTransitioning(false);
      timer.current = null;
    }, 220);
  };

  return (
    <LanguageContext.Provider value={{ language, switchLanguage, languageTransitioning }}>
      {children}
    </LanguageContext.Provider>
  );
};
