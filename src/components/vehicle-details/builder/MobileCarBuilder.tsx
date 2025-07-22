
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

// Responsive variants based on device category
const getContainerVariants = (deviceCategory: DeviceCategory) => ({
  hidden: { 
    opacity: 0,
    scale: deviceCategory === 'smallMobile' ? 0.98 : 0.96,
    y: deviceCategory === 'smallMobile' ? 20 : 30,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: deviceCategory === 'smallMobile' ? 0.4 : 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.08
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.3 }
  }
});

const headerVariants = {
  hidden: { y: -40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.1
    }
  }
};

const imageVariants = {
  hidden: { 
    scale: 1.2, 
    opacity: 0,
    filter: "blur(8px)"
  },
  visible: { 
    scale: 1.05, 
    opacity: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2
    }
  }
};

const contentVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3
    }
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
  const { containerPadding, buttonSize, cardSpacing, textSize } = useResponsiveSize();

  const getCurrentVehicleImage = () => {
    const exteriorColors = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
      { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  };

  // Responsive image height based on device category
  const getImageHeight = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'h-44';
      case 'standardMobile': return 'h-52';
      case 'largeMobile': return 'h-60';
      default: return 'h-56';
    }
  };

  // Enhanced touch-friendly button sizing
  const getTouchButtonSize = () => {
    const baseSize = 'touch-target'; // min-h-[44px] min-w-[44px]
    const padding = deviceCategory === 'smallMobile' ? 'p-2' : 'p-2.5';
    return `${baseSize} ${padding}`;
  };

  return (
    <motion.div
      variants={getContainerVariants(deviceCategory)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-background overflow-hidden flex flex-col"
      style={{
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
      }}
    >
      {/* Enhanced Header with Safe Area */}
      <motion.div 
        variants={headerVariants}
        className={`relative z-20 flex items-center justify-between glass backdrop-blur-xl border-b border-border/20 flex-shrink-0 safe-area-inset-top ${containerPadding} py-2`}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className={`rounded-xl glass backdrop-blur-xl border border-border/20 hover:bg-secondary/20 transition-all duration-200 ${getTouchButtonSize()} flex items-center justify-center`}
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
            animate={{ scale: [1, 1.005, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Build Your {vehicle.name}
          </motion.h1>
        </div>

        <div className={getTouchButtonSize().split(' ').find(c => c.includes('w-')) || 'w-11'} />
      </motion.div>

      {/* Enhanced Vehicle Image with Better Mobile Handling */}
      <motion.div 
        variants={imageVariants}
        className={`relative w-full ${getImageHeight()} bg-gradient-to-br from-muted/15 to-card/15 overflow-hidden border-b border-border/20 flex-shrink-0`}
        layoutId="vehicle-image"
        key={config.exteriorColor + config.grade + config.modelYear + config.engine}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20 animate-pulse" />
        
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain scale-105 relative z-10"
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1.05, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          loading="lazy"
          onLoad={(e) => {
            const skeleton = (e.currentTarget.previousElementSibling as HTMLElement);
            if (skeleton) {
              skeleton.style.display = 'none';
            }
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background/5 via-transparent to-transparent" />
        
        <motion.div 
          className={`absolute bottom-2 left-2 right-2 text-foreground`}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className={`glass backdrop-blur-xl rounded-lg p-2 border border-border/20 shadow-lg`}>
            <h3 className={`${textSize.sm} font-bold truncate`}>{config.modelYear} {vehicle.name}</h3>
            <p className={`text-primary ${textSize.xs} font-medium truncate`}>{config.grade} • {config.engine}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Progress Bar */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 glass backdrop-blur-sm border-b border-border/10"
      >
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Choice Collector */}
      <motion.div 
        variants={contentVariants}
        className={`${containerPadding} py-2 flex-shrink-0 glass backdrop-blur-sm border-b border-border/5`}
      >
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Step Content with Enhanced Mobile Layout */}
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

      {/* Enhanced Summary with Safe Area */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 relative z-20 glass backdrop-blur-xl border-t border-border/20 safe-area-inset-bottom"
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
