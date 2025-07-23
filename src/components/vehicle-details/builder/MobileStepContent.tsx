
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import ModelYearEngineStep from "./steps/ModelYearEngineStep";
import GradeCarouselStep from "./steps/GradeCarouselStep";
import ColorsAccessoriesStep from "./steps/ColorsAccessoriesStep";
import SwipeableGradeStep from "./steps/SwipeableGradeStep";
import SwipeableColorStep from "./steps/SwipeableColorStep";
import ReviewStep from "./steps/ReviewStep";

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
}

const MobileStepContent: React.FC<MobileStepContentProps> = ({
  step,
  config,
  setConfig,
  vehicle,
  calculateTotalPrice,
  handlePayment,
  goNext,
  deviceCategory
}) => {
  const { t } = useLanguage();
  const { containerPadding, buttonSize, textSize } = useResponsiveSize();

  // Determine stock status based on selected colors
  const getStockStatus = () => {
    const exteriorColors = [
      { name: "Pearl White", stock: 'available' },
      { name: "Midnight Black", stock: 'pipeline' },
      { name: "Silver Metallic", stock: 'unavailable' }
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
    if (step >= 3) {
      const stockStatus = getStockStatus();
      switch (stockStatus) {
        case 'available':
          return t('builder.buyNow');
        case 'pipeline':
          return t('builder.reserveNow');
        case 'unavailable':
          return t('builder.registerInterest');
        default:
          return t('builder.continue');
      }
    }
    return t('builder.continue');
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
        return <SwipeableGradeStep config={config} setConfig={setConfig} />;
      case 3:
        return <SwipeableColorStep config={config} setConfig={setConfig} />;
      case 4:
        return <ReviewStep config={config} calculateTotalPrice={calculateTotalPrice} handlePayment={handlePayment} />;
      default:
        return null;
    }
  };

  const getStockBadge = () => {
    if (step < 3) return null;
    
    const stockStatus = getStockStatus();
    const badgeSize = deviceCategory === 'smallMobile' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs';
    
    switch (stockStatus) {
      case 'available':
        return (
          <div className={`flex items-center gap-2 ${badgeSize} bg-green-100 text-green-800 rounded-full font-medium`}>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            In Stock
          </div>
        );
      case 'pipeline':
        return (
          <div className={`flex items-center gap-2 ${badgeSize} bg-orange-100 text-orange-800 rounded-full font-medium`}>
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            Pipeline - 2-3 weeks
          </div>
        );
      case 'unavailable':
        return (
          <div className={`flex items-center gap-2 ${badgeSize} bg-red-100 text-red-800 rounded-full font-medium`}>
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
      case 'smallMobile': return 'min-h-[44px]';
      case 'standardMobile': return 'min-h-[48px]';
      case 'largeMobile': return 'min-h-[52px]';
      default: return 'min-h-[44px]';
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 120, damping: 20 }}
        className="flex-1 overflow-hidden"
      >
        <div className={`h-full ${containerPadding} ${deviceCategory === 'smallMobile' ? 'py-1.5' : 'py-2'} overflow-y-auto`}>
          {renderContent()}
        </div>
      </motion.div>
      
      {/* Stock Status Badge */}
      {getStockBadge() && (
        <motion.div 
          className={`${containerPadding} ${deviceCategory === 'smallMobile' ? 'py-1.5' : 'py-2'} flex justify-center`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {getStockBadge()}
        </motion.div>
      )}
      
      {/* Continue Button */}
      <motion.div 
        className={`sticky bottom-0 left-0 right-0 ${containerPadding} ${deviceCategory === 'smallMobile' ? 'py-2' : 'py-3'} bg-gradient-to-t from-background via-background/98 to-background/90 backdrop-blur-xl z-30 border-t border-border/30`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Button 
          onClick={step === 4 ? handlePayment : goNext}
          disabled={!canProceed()}
          className={`w-full text-primary-foreground rounded-lg font-bold shadow-lg transition-all duration-300 relative overflow-hidden ${getButtonHeight()} ${
            !canProceed() 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : step >= 3 && getStockStatus() === 'available'
                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600'
                : step >= 3 && getStockStatus() === 'pipeline'
                  ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600'
                  : step >= 3 && getStockStatus() === 'unavailable'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600'
                    : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
          } ${buttonSize}`}
          size="sm"
        >
          <span className="relative z-10 flex items-center justify-center">
            <span className={textSize.sm}>{getCTAText()}</span>
            {step < 4 && <ArrowRight className={`ml-2 ${deviceCategory === 'smallMobile' ? 'h-3 w-3' : 'h-4 w-4'}`} />}
          </span>
        </Button>
      </motion.div>
    </div>
  );
};

export default MobileStepContent;
