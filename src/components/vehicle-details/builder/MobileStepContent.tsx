
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Car, Palette, Cog, CheckCircle, ArrowRight } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import ModelYearEngineStep from "./steps/ModelYearEngineStep";
import GradeCarouselStep from "./steps/GradeCarouselStep";
import ColorsAccessoriesStep from "./steps/ColorsAccessoriesStep";
import ReviewStep from "./steps/ReviewStep";
import { contextualHaptic } from "@/utils/haptic";

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

const stepVariants = {
  hidden: { 
    opacity: 0, 
    x: 30,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0, 
    x: -30,
    scale: 0.98,
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

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
  const { buttonSize, mobilePadding, touchTarget } = useResponsiveSize();

  const getButtonHeight = React.useCallback(() => {
    switch (deviceCategory) {
      case 'smallMobile': return 'h-9';
      case 'standardMobile': return 'h-10';
      case 'largeMobile': 
      case 'extraLargeMobile': return 'h-11';
      case 'tablet': return 'h-12';
      default: return 'h-10';
    }
  }, [deviceCategory]);

  const getStockBadgeText = React.useCallback(() => {
    switch (deviceCategory) {
      case 'smallMobile': return 'In Stock';
      case 'standardMobile': 
      case 'largeMobile': 
      case 'extraLargeMobile': return 'Available in Stock';
      default: return 'Available in Stock - Ready for Delivery';
    }
  }, [deviceCategory]);

  const canContinue = React.useMemo(() => {
    switch (step) {
      case 1: return config.modelYear && config.engine;
      case 2: return config.grade;
      case 3: return config.exteriorColor && config.interiorColor;
      case 4: return true;
      default: return false;
    }
  }, [step, config]);

  const handleContinueClick = React.useCallback(() => {
    contextualHaptic.stepProgress();
    goNext();
  }, [goNext]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <ModelYearEngineStep config={config} setConfig={setConfig} />;
      case 2:
        return <GradeCarouselStep config={config} setConfig={setConfig} vehicle={vehicle} />;
      case 3:
        return <ColorsAccessoriesStep config={config} setConfig={setConfig} />;
      case 4:
        return (
          <ReviewStep 
            config={config} 
            vehicle={vehicle} 
            calculateTotalPrice={calculateTotalPrice}
            handlePayment={handlePayment}
            onReset={onReset}
          />
        );
      default:
        return null;
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1: return <Car className="h-4 w-4" />;
      case 2: return <Cog className="h-4 w-4" />;
      case 3: return <Palette className="h-4 w-4" />;
      case 4: return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Engine & Year";
      case 2: return "Grade Selection";
      case 3: return "Colors & Style";
      case 4: return "Review & Order";
      default: return "";
    }
  };

  return (
    <div className="h-full flex flex-col bg-background/95">
      <motion.div
        variants={stepVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="flex-1 overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {renderStepContent()}
      </motion.div>

      {/* Continue Button - Optimized */}
      {step < 4 && (
        <motion.div 
          className="flex-shrink-0 bg-background/98 border-t border-border/20 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* Stock Badge - Compact */}
          <div className="px-4 py-1">
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                {getStockBadgeText()}
              </div>
            </div>
          </div>

          {/* Button Container - Reduced Padding */}
          <div className="px-4 py-1.5">
            <motion.button
              onClick={handleContinueClick}
              disabled={!canContinue}
              className={`
                w-full ${getButtonHeight()} ${touchTarget}
                bg-gradient-to-r from-primary to-primary/90 
                hover:from-primary/90 hover:to-primary/80
                disabled:from-muted disabled:to-muted
                text-primary-foreground disabled:text-muted-foreground
                font-semibold rounded-xl
                transition-all duration-200
                shadow-lg hover:shadow-xl disabled:shadow-none
                flex items-center justify-center gap-2
                active:scale-[0.98]
              `}
              whileHover={canContinue ? { y: -2 } : {}}
              whileTap={canContinue ? { scale: 0.98 } : {}}
            >
              <div className="flex items-center gap-2">
                {getStepIcon()}
                <span className="text-sm font-semibold">
                  Continue to {getStepTitle()}
                </span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MobileStepContent;
