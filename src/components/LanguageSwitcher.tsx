
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
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`absolute top-5 ${isRTL ? 'left-5' : 'right-5'} z-40`}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={toggleLanguage}
        className="flex items-center gap-2 border-red-500 text-red-600 hover:bg-red-50 transition"
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {language === 'en' ? 'العربية' : 'English'}
        </span>
      </Button>
    </motion.div>
  );
};

export default LanguageSwitcher;
