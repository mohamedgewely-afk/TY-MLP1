import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// English translations
const translations = {
  en: {
    // Navigation
    'nav.vehicles': 'Vehicles',
    'nav.preowned': 'Pre-Owned',
    'nav.service': 'Service',
    'nav.menu': 'Menu',
    'nav.motorsport': 'Motorsport',
    'nav.locations': 'Locations',
    'nav.offers': 'Offers',
    'nav.owners': 'Owners',
    'nav.bookService': 'Book a Service',
    
    // Hero Section
    'hero.bookTestDrive': 'Book Test Drive',
    'hero.configureYourCar': 'Configure Your Car',
    'hero.fuelEfficiency': 'Fuel Efficiency',
    'hero.electricRange': 'Electric Range',
    'hero.totalPower': 'Total Power',
    'hero.startingFrom': 'Starting from',
    'hero.warranty': '5-Year Warranty',
    'hero.toyotaSafety': 'Toyota Safety Sense',
    'hero.premiumFeatures': 'Premium Features',
    'hero.bestSeller': 'Best Seller',
    'hero.hybrid': 'Hybrid',
    'hero.starSafety': '5-Star Safety',
    'hero.experienceHarmony': 'Experience the perfect harmony of innovation, efficiency, and luxury.',
    'hero.hybridTech': 'Advanced hybrid technology meets premium comfort.',
    'hero.electricPower': 'Pure electric power for the future of driving.',
    
    // Car Builder
    'builder.buildYour': 'Build Your',
    'builder.modelYear': 'Model Year',
    'builder.engine': 'Engine',
    'builder.grade': 'Grade',
    'builder.exteriorColor': 'Exterior Color',
    'builder.interiorColor': 'Interior Color',
    'builder.accessories': 'Accessories',
    'builder.continue': 'Continue',
    'builder.buyNow': 'Buy Now',
    'builder.reserveNow': 'Reserve Now',
    'builder.registerInterest': 'Register Your Interest',
    'builder.totalPrice': 'Total Price',
    'builder.monthly': 'Monthly',
    'builder.reserve': 'Reserve',
    'builder.inStock': 'In Stock',
    'builder.pipeline': 'Pipeline',
    'builder.noStock': 'No Stock',
    'builder.eta': 'ETA',
    'builder.delivery': 'Delivery',
    
    // Finance
    'finance.calculator': 'Finance Calculator',
    'finance.cashPayment': 'Cash Payment',
    'finance.bankFinance': 'Bank Finance',
    'finance.islamicFinance': 'Islamic Finance',
    'finance.leasing': 'Leasing',
    
    // FAQ
    'faq.title': 'Frequently Asked Questions',
    'faq.general': 'General',
    'faq.financing': 'Financing',
    'faq.warranty': 'Warranty',
    'faq.maintenance': 'Maintenance',
    
    // Common
    'common.loading': 'Loading...',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.view': 'View',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.add': 'Add',
    'common.remove': 'Remove',
    'common.select': 'Select',
    'common.deselect': 'Deselect',
    'common.clear': 'Clear',
    'common.reset': 'Reset',
    'common.apply': 'Apply',
    'common.confirm': 'Confirm',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info'
  },
  ar: {
    // Navigation
    'nav.vehicles': 'المركبات',
    'nav.preowned': 'مستعملة',
    'nav.service': 'الخدمة',
    'nav.menu': 'القائمة',
    'nav.motorsport': 'رياضة السيارات',
    'nav.locations': 'المواقع',
    'nav.offers': 'العروض',
    'nav.owners': 'الملاك',
    'nav.bookService': 'احجز خدمة',
    
    // Hero Section
    'hero.bookTestDrive': 'احجز تجربة قيادة',
    'hero.configureYourCar': 'صمم سيارتك',
    'hero.fuelEfficiency': 'كفاءة الوقود',
    'hero.electricRange': 'المدى الكهربائي',
    'hero.totalPower': 'القوة الإجمالية',
    'hero.startingFrom': 'يبدأ من',
    'hero.warranty': 'ضمان 5 سنوات',
    'hero.toyotaSafety': 'تويوتا للأمان',
    'hero.premiumFeatures': 'مميزات فاخرة',
    'hero.bestSeller': 'الأكثر مبيعاً',
    'hero.hybrid': 'هجين',
    'hero.starSafety': 'أمان 5 نجوم',
    'hero.experienceHarmony': 'اختبر الانسجام المثالي بين الابتكار والكفاءة والفخامة.',
    'hero.hybridTech': 'تقنية هجين متقدمة تلتقي مع الراحة الفاخرة.',
    'hero.electricPower': 'قوة كهربائية خالصة لمستقبل القيادة.',
    
    // Car Builder
    'builder.buildYour': 'اصنع',
    'builder.modelYear': 'سنة الطراز',
    'builder.engine': 'المحرك',
    'builder.grade': 'الفئة',
    'builder.exteriorColor': 'اللون الخارجي',
    'builder.interiorColor': 'اللون الداخلي',
    'builder.accessories': 'الإكسسوارات',
    'builder.continue': 'متابعة',
    'builder.buyNow': 'اشتري الآن',
    'builder.reserveNow': 'احجز الآن',
    'builder.registerInterest': 'سجل اهتمامك',
    'builder.totalPrice': 'السعر الإجمالي',
    'builder.monthly': 'شهرياً',
    'builder.reserve': 'احجز',
    'builder.inStock': 'متوفر',
    'builder.pipeline': 'قيد التحضير',
    'builder.noStock': 'غير متوفر',
    'builder.eta': 'موعد التسليم',
    'builder.delivery': 'التسليم',
    
    // Finance
    'finance.calculator': 'حاسبة التمويل',
    'finance.cashPayment': 'دفع نقدي',
    'finance.bankFinance': 'تمويل بنكي',
    'finance.islamicFinance': 'تمويل إسلامي',
    'finance.leasing': 'إيجار',
    
    // FAQ
    'faq.title': 'الأسئلة الشائعة',
    'faq.general': 'عام',
    'faq.financing': 'التمويل',
    'faq.warranty': 'الضمان',
    'faq.maintenance': 'الصيانة',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.submit': 'إرسال',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.view': 'عرض',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.add': 'إضافة',
    'common.remove': 'إزالة',
    'common.select': 'اختيار',
    'common.deselect': 'إلغاء الاختيار',
    'common.clear': 'محو',
    'common.reset': 'إعادة تعيين',
    'common.apply': 'تطبيق',
    'common.confirm': 'تأكيد',
    'common.yes': 'نعم',
    'common.no': 'لا',
    'common.ok': 'موافق',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.warning': 'تحذير',
    'common.info': 'معلومات'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
