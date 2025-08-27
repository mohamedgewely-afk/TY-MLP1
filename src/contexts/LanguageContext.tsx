
import React, { createContext, useContext, useState, useEffect } from 'react';

type LanguageType = 'en' | 'ar';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

// Simple translations object
const translations = {
  en: {
    welcome: 'Welcome',
    home: 'Home',
    vehicles: 'Vehicles',
    about: 'About',
    contact: 'Contact',
    // Add more translations as needed
  },
  ar: {
    welcome: 'مرحبا',
    home: 'الرئيسية',
    vehicles: 'المركبات',
    about: 'حول',
    contact: 'اتصل بنا',
    // Add more translations as needed
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<LanguageType>('en');

  const isRTL = language === 'ar';

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  // Apply RTL class to document when language changes
  useEffect(() => {
    if (isRTL) {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
      document.body.classList.add('rtl');
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = 'en';
      document.body.classList.remove('rtl');
    }
  }, [isRTL]);

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    isRTL,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
