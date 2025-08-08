
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { ArrowRight, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import ModelYearEngineStep from "./steps/ModelYearEngineStep";
import GradeCarouselStep from "./steps/GradeCarouselStep";
import ColorsAccessoriesStep from "./steps/ColorsAccessoriesStep";
import ReviewStep from "./steps/ReviewStep";
import { contextualHaptic, addLuxuryHapticToButton } from "@/utils/haptic";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileStepContentProps {
  step: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  vehicle: VehicleModel;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goNext: () => void;
  deviceCategory: DeviceCategory;
  onReset?: () => void;
}

const MobileStepContent: React.FC<MobileStepContentProps> = ({
  step,
  config,
  setConfig,
  vehicle,
  calculateTotalPrice,
  handlePayment,
  goNext,
  deviceCategory,
  onReset
}) => {
  const { t } = useLanguage();
  const { containerPadding, buttonSize, textSize } = useResponsiveSize();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Enhanced haptic feedback for CTA button
  useEffect(() => {
    if (buttonRef.current) {
      addLuxuryHapticToButton(buttonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: true
      });
    }
  }, [step]);

  // Determine stock status based on selected colors
  const getStockStatus = () => {
    const exteriorColors = [
      { name: "Pearl White", stock: 'available' },
      { name: "Midnight Black", stock: 'pipeline' },
      { name: "Silver Metallic", stock: 'unavailable' },
      { name: "Deep Blue", stock: 'available' },
      { name: "Ruby Red", stock: 'pipeline' }
    ];
    
    const interiorColors = [
      { name: "Black Leather", stock: 'available' },
      { name: "Beige Leather", stock: 'pipeline' },
      { name: "Gray Fabric", stock: 'unavailable' }
    ];

    const exteriorStock = exteriorColors.find(c => c.name === config.exteriorColor)?.stock || 'available';
    const interiorStock = interiorColors.find(c => c.name === config.interiorColor)?.stock || 'available';

    if (exteriorStock === 'unavailable' || interiorStock === 'unavailable') {
      return 'unavailable';
    }
    if (exteriorStock === 'pipeline' || interiorStock === 'pipeline') {
      return 'pipeline';
    }
    return 'available';
  };

  const getCTAText = () => {
    if (step >= 4) {
      const stockStatus = getStockStatus();
      switch (stockStatus) {
        case 'available':
          return t('builder.buyNow') || 'Buy Now';
        case 'pipeline':
          return t('builder.reserveNow') || 'Reserve Now';
        case 'unavailable':
          return t('builder.registerInterest') || 'Register Interest';
        default:
          return t('builder.continue') || 'Continue';
      }
    }
    return t('builder.continue') || 'Continue';
  };

  // Check if current step can proceed
  const canProceed = () => {
    switch (step) {
      case 1:
        return config.modelYear && config.engine;
      case 2:
        return config.grade;
      case 3:
        return config.exteriorColor && config.interiorColor;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return <ModelYearEngineStep config={config} setConfig={setConfig} />;
      case 2:
        return <GradeCarouselStep config={config} setConfig={setConfig} />;
      case 3:
        return <ColorsAccessoriesStep config={config} setConfig={setConfig} />;
      case 4:
        return (
          <ReviewStep 
            config={config} 
            calculateTotalPrice={calculateTotalPrice} 
            handlePayment={handlePayment} 
          />
        );
      default:
        return null;
    }
  };

  const getStockBadge = () => {
    if (step < 3) return null;
    
    const stockStatus = getStockStatus();
    const badgeSize = deviceCategory === 'smallMobile' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';
    
    switch (stockStatus) {
      case 'available':
        return (
          <div className={`inline-flex items-center gap-2 ${badgeSize} bg-green-50 text-green-700 rounded-full font-medium border border-green-200`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            In Stock
          </div>
        );
      case 'pipeline':
        return (
          <div className={`inline-flex items-center gap-2 ${badgeSize} bg-orange-50 text-orange-700 rounded-full font-medium border border-orange-200`}>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Pipeline - 2-3 weeks
          </div>
        );
      case 'unavailable':
        return (
          <div className={`inline-flex items-center gap-2 ${badgeSize} bg-red-50 text-red-700 rounded-full font-medium border border-red-200`}>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            No Stock
          </div>
        );
      default:
        return null;
    }
  };

  const getButtonHeight = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'min-h-[48px]';
      case 'standardMobile': return 'min-h-[52px]';
      case 'largeMobile': return 'min-h-[56px]';
      default: return 'min-h-[48px]';
    }
  };

  // Enhanced button click handler with haptic feedback
  const handleButtonClick = () => {
    if (step === 4) {
      contextualHaptic.configComplete();
      handlePayment();
    } else {
      contextualHaptic.stepProgress();
      goNext();
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        transition={{ 
          duration: 0.4, 
          type: "spring", 
          stiffness: 120, 
          damping: 20
        }}
        className="flex-1 overflow-hidden"
      >
        <div className={`h-full ${containerPadding} ${deviceCategory === 'smallMobile' ? 'py-3' : 'py-4'} overflow-y-auto`}>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Enhanced Stock Status Badge */}
      <AnimatePresence>
        {getStockBadge() && (
          <motion.div 
            className={`${containerPadding} ${deviceCategory === 'smallMobile' ? 'py-2' : 'py-3'} flex justify-center bg-background/95 backdrop-blur-sm border-t border-border/50`}
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {getStockBadge()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Continue Button */}
      <motion.div 
        className={`sticky bottom-0 left-0 right-0 ${containerPadding} ${deviceCategory === 'smallMobile' ? 'py-4' : 'py-5'} bg-background/98 backdrop-blur-sm z-30 border-t border-border`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Button 
            ref={buttonRef}
            onClick={handleButtonClick}
            disabled={!canProceed()}
            className={`w-full text-primary-foreground rounded-xl font-semibold shadow-lg transition-all duration-300 relative overflow-hidden ${getButtonHeight()} ${
              !canProceed() 
                ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border' 
                : step >= 3 && getStockStatus() === 'available'
                  ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-green-500/25'
                  : step >= 3 && getStockStatus() === 'pipeline'
                    ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-orange-500/25'
                    : step >= 3 && getStockStatus() === 'unavailable'
                      ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 shadow-red-500/25'
                      : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 shadow-primary/25'
            } ${buttonSize}`}
            size="sm"
          >
            {/* Enhanced button content */}
            <motion.span 
              className="relative z-10 flex items-center justify-center"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span className={textSize.sm}>
                {getCTAText()}
              </span>
              
              {step < 4 && (
                <motion.div
                  animate={{ 
                    x: [0, 3, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className={`ml-2 ${deviceCategory === 'smallMobile' ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </motion.div>
              )}
              
              {step === 4 && (
                <motion.div
                  animate={{ 
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <Sparkles className={`ml-2 ${deviceCategory === 'smallMobile' ? 'h-4 w-4' : 'h-5 w-5'}`} />
                </motion.div>
              )}
            </motion.span>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MobileStepContent;
