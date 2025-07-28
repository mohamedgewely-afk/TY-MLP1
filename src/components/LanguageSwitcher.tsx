
import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isRTL } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center space-x-2 hover:bg-muted/50 transition-colors duration-200 text-xs"
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs font-medium">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher;
