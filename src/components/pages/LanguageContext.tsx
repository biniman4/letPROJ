import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define an enum for supported languages
export enum SupportedLang {
  Am = 'am',
  En = 'en',
}

// Define the types for the language context
type LanguageContextType = {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
};

// Create the context
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<SupportedLang>(SupportedLang.Am);

  // Load language from localStorage if available
  useEffect(() => {
    const storedLang = localStorage.getItem('appLang') as SupportedLang;
    if (storedLang === SupportedLang.Am || storedLang === SupportedLang.En) {
      setLang(storedLang);
    }
  }, []);

  // Change the language and save it to localStorage
  const changeLang = (newLang: SupportedLang) => {
    localStorage.setItem('appLang', newLang);
    setLang(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
