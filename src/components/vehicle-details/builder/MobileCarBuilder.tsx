
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

// Luxury entrance variants with professional automotive styling
const getContainerVariants = (deviceCategory: DeviceCategory) => ({
  hidden: { 
    opacity: 0,
    scale: 0.96,
    y: 20
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: -20,
    transition: { duration: 0.4 }
  }
});

// Premium header animation with automotive flair
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

// Enhanced image reveal with professional photography style
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
      delay: 0.3
    }
  }
};

// Content animation with luxury timing
const contentVariants = {
  hidden: { 
    y: 30, 
    opacity: 0
  },
  visible: { 
    y: 0, 
    opacity: 1,
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

  // Enhanced responsive image height with professional aspect ratios
  const getImageHeight = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'h-48';
      case 'standardMobile': return 'h-56';
      case 'largeMobile': return 'h-64';
      default: return 'h-56';
    }
  };

  // Premium button styling with automotive-grade design
  const getTouchButtonClass = () => {
    const baseClass = 'touch-target rounded-2xl bg-gradient-to-b from-background/98 to-background/95 backdrop-blur-xl border border-border/30 hover:border-primary/20 hover:bg-background/98 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl';
    const sizeClass = deviceCategory === 'smallMobile' ? 'p-3 min-h-[48px] min-w-[48px]' : 'p-4 min-h-[52px] min-w-[52px]';
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
      className="relative h-full w-full bg-gradient-to-br from-background via-background to-muted/5 overflow-hidden flex flex-col mobile-viewport"
      ref={swipeableRef}
    >
      {/* Premium Header with Automotive Luxury Styling */}
      <motion.div 
        variants={headerVariants}
        className={`relative z-30 flex items-center justify-between bg-gradient-to-b from-background/98 via-background/95 to-background/90 backdrop-blur-xl border-b border-border/20 flex-shrink-0 ${containerPadding} py-5 safe-area-inset-top`}
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background)/0.98) 0%, hsl(var(--background)/0.95) 50%, hsl(var(--background)/0.90) 100%)',
        }}
      >
        <div className="flex items-center gap-4">
          <motion.button
            ref={step > 1 ? backButtonRef : closeButtonRef}
            onClick={handleBackClick}
            className={`${getTouchButtonClass()}`}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {step > 1 ? (
              <ArrowLeft className={`${deviceCategory === 'smallMobile' ? 'h-5 w-5' : 'h-6 w-6'} text-foreground`} />
            ) : (
              <X className={`${deviceCategory === 'smallMobile' ? 'h-5 w-5' : 'h-6 w-6'} text-foreground`} />
            )}
          </motion.button>

          <motion.button
            ref={resetButtonRef}
            onClick={handleResetClick}
            className={`${getTouchButtonClass()}`}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <RotateCcw className={`${deviceCategory === 'smallMobile' ? 'h-5 w-5' : 'h-6 w-6'} text-foreground`} />
          </motion.button>
        </div>

        <motion.div 
          className="text-center flex-1 mx-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className={`${textSize.lg} font-bold text-foreground truncate`}>
            Build Your <span className="text-primary">{vehicle.name}</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-8"></div>
            <p className={`${textSize.xs} text-muted-foreground font-medium`}>
              Step {step} of 4
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-8"></div>
          </div>
        </motion.div>

        <motion.button
          ref={exitButtonRef}
          onClick={handleExitClick}
          className={`${getTouchButtonClass()}`}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <LogOut className={`${deviceCategory === 'smallMobile' ? 'h-5 w-5' : 'h-6 w-6'} text-foreground`} />
        </motion.button>
      </motion.div>

      {/* Enhanced Vehicle Image with Professional Photography Style */}
      <motion.div 
        variants={imageVariants}
        className={`relative w-full ${getImageHeight()} overflow-hidden border-b border-border/20 flex-shrink-0`}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--muted)/0.08) 0%, hsl(var(--muted)/0.12) 50%, hsl(var(--muted)/0.15) 100%)'
        }}
        key={config.exteriorColor + config.grade}
      >
        {/* Professional photography gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/15 via-transparent to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-transparent to-background/5 z-10" />
        
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-cover relative z-5"
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
          loading="lazy"
        />
        
        {/* Premium Vehicle Info Overlay with Automotive Styling */}
        <motion.div 
          className={`absolute bottom-4 left-4 right-4 z-20`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className={`bg-gradient-to-r from-background/98 to-background/95 backdrop-blur-xl rounded-2xl ${mobilePadding.md} border border-border/20 shadow-2xl`}>
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`${textSize.base} font-bold text-foreground truncate mb-1`}>
                  {config.modelYear} {vehicle.name}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <span className={`${textSize.xs} font-medium`}>{config.grade}</span>
                  <div className="w-1 h-1 bg-muted-foreground/60 rounded-full"></div>
                  <span className={`${textSize.xs}`}>{config.engine}</span>
                </div>
                <p className={`text-muted-foreground ${textSize.xs} opacity-80`}>
                  {config.exteriorColor} Exterior
                </p>
              </div>
              <div className="text-right ml-4">
                <div className={`${textSize.lg} font-bold text-primary mb-1`}>
                  AED {calculateTotalPrice().toLocaleString()}
                </div>
                <div className={`${textSize.xs} text-muted-foreground`}>
                  From AED 2,850/mo
                </div>
              </div>
            </div>
            
            {/* Premium accent line */}
            <div className="mt-3 h-px bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress Bar with Luxury Styling */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 bg-gradient-to-b from-background/98 to-background/95 border-b border-border/10"
      >
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Choice Collector with Premium Styling */}
      <motion.div 
        variants={contentVariants}
        className={`${containerPadding} py-4 flex-shrink-0 bg-gradient-to-b from-background/98 to-background/95 border-b border-border/10`}
      >
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Step Content with Enhanced Styling */}
      <motion.div 
        variants={contentVariants}
        className="flex-1 overflow-hidden bg-gradient-to-b from-background/95 to-background/90"
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

      {/* Premium Summary with Luxury Styling */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 relative z-30 bg-gradient-to-t from-background/98 to-background/95 border-t border-border/20 backdrop-blur-xl safe-area-inset-bottom"
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
