
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
    scale: deviceCategory === 'smallMobile' ? 0.95 : 0.9,
    rotateX: deviceCategory === 'smallMobile' ? -10 : -15,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      duration: deviceCategory === 'smallMobile' ? 0.6 : 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.4 }
  }
});

const headerVariants = {
  hidden: { y: -60, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2
    }
  }
};

const imageVariants = {
  hidden: { 
    scale: 1.3, 
    opacity: 0,
    filter: "blur(10px)"
  },
  visible: { 
    scale: 1.1, 
    opacity: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 1.2, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.4
    }
  }
};

const contentVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.6
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
      case 'smallMobile': return 'h-48';
      case 'standardMobile': return 'h-56';
      case 'largeMobile': return 'h-64';
      default: return 'h-64';
    }
  };

  // Responsive header padding and safe area
  const getHeaderPadding = () => {
    const basePadding = deviceCategory === 'smallMobile' ? 'p-2' : 'p-3';
    return `${basePadding} safe-area-inset-top`;
  };

  return (
    <motion.div
      variants={getContainerVariants(deviceCategory)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-background overflow-hidden flex flex-col perspective-1000"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      {/* Responsive Header with Glass Morphism */}
      <motion.div 
        variants={headerVariants}
        className={`relative z-10 flex items-center justify-between ${getHeaderPadding()} glass backdrop-blur-xl border-b border-border/30 flex-shrink-0`}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className={`rounded-lg glass backdrop-blur-xl border border-border/30 hover:bg-secondary/20 transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${deviceCategory === 'smallMobile' ? 'p-2' : 'p-2.5'}`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {step > 1 ? (
            <ArrowLeft className={`${deviceCategory === 'smallMobile' ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
          ) : (
            <X className={`${deviceCategory === 'smallMobile' ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
          )}
        </motion.button>

        <div className="text-center flex-1 mx-4">
          <motion.h1 
            className={`${textSize.base} font-bold text-foreground`}
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Build Your {vehicle.name}
          </motion.h1>
        </div>

        <div className="w-[44px]" />
      </motion.div>

      {/* Responsive Vehicle Image with Glass Morphism Overlay */}
      <motion.div 
        variants={imageVariants}
        className={`relative w-full ${getImageHeight()} bg-gradient-to-br from-muted/20 to-card/20 overflow-hidden border-b border-border/30 flex-shrink-0`}
        layoutId="vehicle-image"
        key={config.exteriorColor + config.grade + config.modelYear + config.engine}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 animate-pulse" />
        
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain scale-110 relative z-10"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onLoad={(e) => {
            const skeleton = (e.currentTarget.previousElementSibling as HTMLElement);
            if (skeleton) {
              skeleton.style.display = 'none';
            }
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent" />
        
        <motion.div 
          className={`absolute ${deviceCategory === 'smallMobile' ? 'bottom-1 left-1 right-1' : 'bottom-2 left-2 right-2'} text-foreground`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className={`glass backdrop-blur-xl rounded-lg ${deviceCategory === 'smallMobile' ? 'p-1.5' : 'p-2'} border border-border/30 shadow-lg`}>
            <h3 className={`${textSize.sm} font-bold`}>{config.modelYear} {vehicle.name}</h3>
            <p className={`text-primary ${textSize.xs} font-medium`}>{config.grade} • {config.engine}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress Bar with Glass Effect */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 glass backdrop-blur-sm border-b border-border/20"
      >
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Choice Collector with Glass Morphism */}
      <motion.div 
        variants={contentVariants}
        className={`${containerPadding} ${deviceCategory === 'smallMobile' ? 'py-1.5' : 'py-2'} flex-shrink-0 glass backdrop-blur-sm`}
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

      {/* Price Summary with Glass Morphism */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 relative z-20 glass backdrop-blur-xl border-t border-border/30"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
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
