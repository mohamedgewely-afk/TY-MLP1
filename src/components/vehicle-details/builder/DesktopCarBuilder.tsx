
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, RotateCcw } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useDeviceInfo } from "@/hooks/use-device-info";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import CollapsibleSpecs from "./CollapsibleSpecs";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface DesktopCarBuilderProps {
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
  onReset: () => void;
}

// Premium entrance variants optimized for desktop
const containerVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.98
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.4 }
  }
};

// Enhanced left panel
const leftPanelVariants = {
  hidden: { 
    x: -50, 
    opacity: 0
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2
    }
  }
};

// Enhanced right panel
const rightPanelVariants = {
  hidden: { 
    x: 50, 
    opacity: 0
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3
    }
  }
};

// Premium header animation
const headerVariants = {
  hidden: { 
    y: -40, 
    opacity: 0
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.1
    }
  }
};

// Enhanced image reveal
const imageVariants = {
  hidden: { 
    scale: 1.1, 
    opacity: 0
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.4
    }
  }
};

const DesktopCarBuilder: React.FC<DesktopCarBuilderProps> = ({
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
  onReset
}) => {
  const { deviceCategory } = useDeviceInfo();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Desktop-specific haptic feedback
  useEffect(() => {
    if (backButtonRef.current) {
      addLuxuryHapticToButton(backButtonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: true
      });
    }
    if (closeButtonRef.current) {
      addLuxuryHapticToButton(closeButtonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: true
      });
    }
    if (resetButtonRef.current) {
      addLuxuryHapticToButton(resetButtonRef.current, {
        type: 'premiumError',
        onPress: true,
        onHover: true
      });
    }
  }, []);
  
  const getCurrentVehicleImage = () => {
    const exteriorColors = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
      { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  };

  const showSpecs = step > 3 && (config.modelYear && config.grade);
  const reserveAmount = 5000;

  // Premium button click handlers
  const handleBackClick = () => {
    contextualHaptic.stepProgress();
    if (step > 1) {
      goBack();
    } else {
      onClose();
    }
  };

  const handleResetClick = () => {
    contextualHaptic.resetAction();
    onReset();
  };

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-background overflow-hidden flex"
    >
      {/* Enhanced Left Side - Interactive Car Image */}
      <motion.div 
        variants={leftPanelVariants}
        className="w-3/5 h-full relative bg-gradient-to-br from-muted/5 to-muted/10 overflow-hidden"
      >
        {/* Premium Header */}
        <motion.div 
          variants={headerVariants}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-8 bg-background/95 backdrop-blur-sm border-b border-border"
        >
          <div className="flex items-center gap-4">
            <motion.button
              ref={step > 1 ? backButtonRef : closeButtonRef}
              onClick={handleBackClick}
              className="p-4 rounded-xl bg-background/95 backdrop-blur-sm border border-border hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md"
              whileHover={{ 
                scale: 1.05, 
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              {step > 1 ? (
                <ArrowLeft className="h-6 w-6 text-foreground" />
              ) : (
                <X className="h-6 w-6 text-foreground" />
              )}
            </motion.button>

            <motion.button
              ref={resetButtonRef}
              onClick={handleResetClick}
              className="p-4 rounded-xl bg-background/95 backdrop-blur-sm border border-border hover:bg-muted transition-all duration-200 shadow-sm hover:shadow-md"
              whileHover={{ 
                scale: 1.05, 
                y: -2
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <RotateCcw className="h-6 w-6 text-foreground" />
            </motion.button>
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h1 className="text-3xl font-semibold text-foreground">
              Build Your {vehicle.name}
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">
              Step {step} of 4
            </p>
          </motion.div>

          <div className="w-32" />
        </motion.div>

        {/* Enhanced Full Height Interactive Car Image */}
        <motion.div 
          variants={imageVariants}
          className="relative w-full h-full overflow-hidden"
          layoutId="vehicle-image"
          key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/10 z-10" />
          
          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="w-full h-full object-cover"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ 
              scale: 1.05, 
              opacity: 1
            }}
            transition={{ 
              duration: 1.0, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.5
            }}
            whileHover={{
              scale: 1.08,
              transition: { duration: 0.6 }
            }}
          />
          
          {/* Enhanced Vehicle Info Overlay */}
          <motion.div 
            className="absolute bottom-8 left-8 right-8 z-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <motion.div 
              className="bg-background/95 backdrop-blur-sm rounded-2xl p-6 border border-border max-w-md shadow-xl"
              whileHover={{ 
                scale: 1.02,
                y: -4
              }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                {config.modelYear} {vehicle.name}
              </h3>
              <p className="text-muted-foreground text-lg mb-1">{config.grade} • {config.engine}</p>
              <p className="text-muted-foreground text-base mb-4">{config.exteriorColor} Exterior</p>
              <div className="text-3xl font-bold text-primary">
                AED {calculateTotalPrice().toLocaleString()}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Right Side - Configuration Panel */}
      <motion.div 
        variants={rightPanelVariants}
        className="w-2/5 h-full flex flex-col bg-background/95 backdrop-blur-sm border-l border-border"
      >
        {/* Progress */}
        <motion.div 
          className="px-8 py-6 bg-background/95 backdrop-blur-sm border-b border-border"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <MobileProgress currentStep={step} totalSteps={4} />
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Choice Collector & Specs */}
          <motion.div 
            className="px-8 py-6 bg-background/95 backdrop-blur-sm border-b border-border"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <ChoiceCollector config={config} step={step} />
            {showSpecs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.4 }}
                className="mt-4"
              >
                <CollapsibleSpecs config={config} />
              </motion.div>
            )}
          </motion.div>

          {/* Step Content */}
          <motion.div 
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
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

          {/* Summary */}
          <motion.div 
            className="bg-background/95 backdrop-blur-sm border-t border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <MobileSummary 
              config={config}
              totalPrice={calculateTotalPrice()}
              step={step}
              reserveAmount={reserveAmount}
              deviceCategory={deviceCategory}
              showPaymentButton={step !== 4}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DesktopCarBuilder;
