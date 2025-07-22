
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileCarBuilderProps {
  vehicle: VehicleModel;
  step: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  showConfirmation: boolean;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goBack: () => void;
  goNext: () => void;
  onClose: () => void;
  deviceCategory: DeviceCategory;
}

// Enhanced responsive variants
const getContainerVariants = (deviceCategory: DeviceCategory) => ({
  hidden: { 
    opacity: 0,
    scale: 0.98,
    y: 10,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.2 }
  }
});

const headerVariants = {
  hidden: { y: -30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const imageVariants = {
  hidden: { 
    scale: 1.1, 
    opacity: 0,
    filter: "blur(4px)"
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const contentVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const MobileCarBuilder: React.FC<MobileCarBuilderProps> = ({
  vehicle,
  step,
  config,
  setConfig,
  showConfirmation,
  calculateTotalPrice,
  handlePayment,
  goBack,
  goNext,
  onClose,
  deviceCategory
}) => {
  const { containerPadding, buttonSize, cardSpacing, textSize, mobilePadding } = useResponsiveSize();

  const getCurrentVehicleImage = () => {
    const exteriorColors = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
      { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  };

  // Enhanced responsive image height
  const getImageHeight = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'h-40';
      case 'standardMobile': return 'h-48';
      case 'largeMobile': return 'h-52';
      default: return 'h-48';
    }
  };

  // Touch-optimized button sizing
  const getTouchButtonClass = () => {
    const baseClass = 'touch-target rounded-xl glass-mobile backdrop-blur-xl border border-border/20 hover:bg-secondary/20 transition-all duration-200 flex items-center justify-center';
    const sizeClass = deviceCategory === 'smallMobile' ? 'p-2 min-h-[44px] min-w-[44px]' : 'p-2.5 min-h-[48px] min-w-[48px]';
    return `${baseClass} ${sizeClass}`;
  };

  return (
    <motion.div
      variants={getContainerVariants(deviceCategory)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-background overflow-hidden flex flex-col mobile-viewport"
    >
      {/* Enhanced Header with Better Safe Area Support */}
      <motion.div 
        variants={headerVariants}
        className={`relative z-30 flex items-center justify-between glass-mobile backdrop-blur-xl border-b border-border/20 flex-shrink-0 ${containerPadding} py-3 safe-area-inset-top`}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className={getTouchButtonClass()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {step > 1 ? (
            <ArrowLeft className={`${deviceCategory === 'smallMobile' ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
          ) : (
            <X className={`${deviceCategory === 'smallMobile' ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
          )}
        </motion.button>

        <div className="text-center flex-1 mx-3">
          <motion.h1 
            className={`${textSize.base} font-bold text-foreground truncate`}
          >
            Build Your {vehicle.name}
          </motion.h1>
        </div>

        <div className="w-11" />
      </motion.div>

      {/* Enhanced Vehicle Image */}
      <motion.div 
        variants={imageVariants}
        className={`relative w-full ${getImageHeight()} bg-gradient-to-br from-muted/20 to-card/20 overflow-hidden border-b border-border/10 flex-shrink-0`}
        key={config.exteriorColor + config.grade}
      >
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain relative z-10"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent" />
        
        <motion.div 
          className={`absolute bottom-2 left-2 right-2`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className={`glass-mobile backdrop-blur-xl rounded-lg ${mobilePadding.xs} border border-border/20 shadow-lg`}>
            <h3 className={`${textSize.sm} font-bold truncate`}>{config.modelYear} {vehicle.name}</h3>
            <p className={`text-primary ${textSize.xs} font-medium truncate`}>{config.grade} • {config.engine}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 glass-mobile backdrop-blur-sm border-b border-border/10"
      >
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Choice Collector */}
      <motion.div 
        variants={contentVariants}
        className={`${containerPadding} py-2 flex-shrink-0 glass-mobile backdrop-blur-sm border-b border-border/5`}
      >
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Step Content */}
      <motion.div 
        variants={contentVariants}
        className="flex-1 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          <MobileStepContent
            key={step}
            step={step}
            config={config}
            setConfig={setConfig}
            vehicle={vehicle}
            calculateTotalPrice={calculateTotalPrice}
            handlePayment={handlePayment}
            goNext={goNext}
            deviceCategory={deviceCategory}
          />
        </AnimatePresence>
      </motion.div>

      {/* Summary with Enhanced Safe Area */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 relative z-30 glass-mobile backdrop-blur-xl border-t border-border/20 safe-area-inset-bottom"
      >
        <MobileSummary 
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
          reserveAmount={2000}
          deviceCategory={deviceCategory}
        />
      </motion.div>
    </motion.div>
  );
};

export default MobileCarBuilder;
