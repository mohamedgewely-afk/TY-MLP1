import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, RotateCcw, LogOut } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import { useSwipeable } from "@/hooks/use-swipeable";
import { contextualHaptic, addLuxuryHapticToButton } from "@/utils/haptic";

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
  onReset: () => void;
  deviceCategory: DeviceCategory;
}

// Enhanced luxury entrance variants
const getContainerVariants = (deviceCategory: DeviceCategory) => ({
  hidden: { 
    opacity: 0,
    scale: 0.95,
    y: 20,
    rotateX: 5,
    filter: "blur(10px)"
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    filter: "blur(5px)",
    transition: { duration: 0.4 }
  }
});

// Premium header animation with cinematic entrance
const headerVariants = {
  hidden: { 
    y: -60, 
    opacity: 0,
    rotateX: 45,
    filter: "blur(10px)"
  },
  visible: { 
    y: 0, 
    opacity: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2
    }
  }
};

// Enhanced image reveal with luxury effects
const imageVariants = {
  hidden: { 
    scale: 1.2, 
    opacity: 0,
    filter: "blur(20px)",
    rotateY: 15
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    filter: "blur(0px)",
    rotateY: 0,
    transition: { 
      duration: 1.2, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.4
    }
  }
};

// Premium content stagger animation
const contentVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
    scale: 0.95,
    filter: "blur(5px)"
  },
  visible: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94]
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
  onReset,
  deviceCategory
}) => {
  const { containerPadding, buttonSize, cardSpacing, textSize, mobilePadding } = useResponsiveSize();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  // Enhanced haptic feedback integration
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
    if (exitButtonRef.current) {
      addLuxuryHapticToButton(exitButtonRef.current, {
        type: 'luxuryPress',
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

  // Enhanced swipe with luxury haptic feedback
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (step < 4) {
        contextualHaptic.swipeNavigation();
        goNext();
      }
    },
    onSwipeRight: () => {
      if (step > 1) {
        contextualHaptic.swipeNavigation();
        goBack();
      }
    },
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  // Premium button click handlers with haptic feedback
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

  const handleExitClick = () => {
    contextualHaptic.exitAction();
    onClose();
  };

  return (
    <motion.div
      variants={getContainerVariants(deviceCategory)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-background overflow-hidden flex flex-col mobile-viewport perspective-1000"
      ref={swipeableRef}
    >
      {/* Enhanced Header with Reset and Exit buttons */}
      <motion.div 
        variants={headerVariants}
        className={`relative z-30 flex items-center justify-between glass-mobile backdrop-blur-xl border-b border-border/20 flex-shrink-0 ${containerPadding} py-3 safe-area-inset-top luxury-entrance`}
      >
        <div className="flex items-center gap-2">
          <motion.button
            ref={step > 1 ? backButtonRef : closeButtonRef}
            onClick={handleBackClick}
            className={`${getTouchButtonClass()} luxury-button cursor-magnetic`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {step > 1 ? (
              <ArrowLeft className={`${deviceCategory === 'smallMobile' ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
            ) : (
              <X className={`${deviceCategory === 'smallMobile' ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
            )}
          </motion.button>

          <motion.button
            ref={resetButtonRef}
            onClick={handleResetClick}
            className={`${getTouchButtonClass()} luxury-button cursor-magnetic`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <RotateCcw className={`${deviceCategory === 'smallMobile' ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
          </motion.button>
        </div>

        <motion.div 
          className="text-center flex-1 mx-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.h1 
            className={`${textSize.base} font-bold text-foreground truncate luxury-text`}
            animate={{ 
              scale: [1, 1.02, 1],
              textShadow: [
                '0 2px 4px rgba(0,0,0,0.1)',
                '0 4px 8px rgba(0,0,0,0.15)',
                '0 2px 4px rgba(0,0,0,0.1)'
              ]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            Build Your {vehicle.name}
          </motion.h1>
        </motion.div>

        <motion.button
          ref={exitButtonRef}
          onClick={handleExitClick}
          className={`${getTouchButtonClass()} luxury-button cursor-magnetic`}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <LogOut className={`${deviceCategory === 'smallMobile' ? 'h-4 w-4' : 'h-5 w-5'} text-foreground`} />
        </motion.button>
      </motion.div>

      {/* Enhanced Vehicle Image with Luxury Effects */}
      <motion.div 
        variants={imageVariants}
        className={`relative w-full ${getImageHeight()} bg-gradient-to-br from-muted/20 to-card/20 overflow-hidden border-b border-border/10 flex-shrink-0 premium-card`}
        key={config.exteriorColor + config.grade}
      >
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain relative z-10 gpu-accelerated"
          initial={{ scale: 1.3, opacity: 0, filter: "blur(20px)" }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            filter: "blur(0px)"
          }}
          transition={{ 
            duration: 1.2, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.6
          }}
          loading="lazy"
        />
        
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/10 rounded-full floating-particles"
              style={{
                top: `${20 + i * 10}%`,
                left: `${10 + i * 15}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        
        <motion.div 
          className={`absolute bottom-2 left-2 right-2`}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <motion.div 
            className={`glass-mobile backdrop-blur-xl rounded-lg ${mobilePadding.xs} border border-border/20 shadow-lg premium-card`}
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className={`${textSize.sm} font-bold truncate premium-gradient-text`}>
              {config.modelYear} {vehicle.name}
            </h3>
            <p className={`text-primary ${textSize.xs} font-medium truncate`}>
              {config.grade} • {config.engine}
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Progress Bar */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 glass-mobile backdrop-blur-sm border-b border-border/10"
      >
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Enhanced Choice Collector */}
      <motion.div 
        variants={contentVariants}
        className={`${containerPadding} py-2 flex-shrink-0 glass-mobile backdrop-blur-sm border-b border-border/5`}
      >
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Enhanced Step Content */}
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

      {/* Enhanced Summary - hide duplicate payment button on step 4 */}
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
          showPaymentButton={step !== 4}
        />
      </motion.div>
    </motion.div>
  );
};

export default MobileCarBuilder;
