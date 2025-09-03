
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

const getContainerVariants = (deviceCategory: DeviceCategory) => ({
  hidden: { 
    opacity: 0,
    scale: 0.98,
    y: 10
  },
  visible: { 
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    transition: { duration: 0.3 }
  }
});

const headerVariants = {
  hidden: { 
    y: -20, 
    opacity: 0
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.3, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.1
    }
  }
};

const imageVariants = {
  hidden: { 
    scale: 1.05, 
    opacity: 0
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2
    }
  }
};

const contentVariants = {
  hidden: { 
    y: 15, 
    opacity: 0
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.4, 
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
  const { containerPadding, buttonSize, cardSpacing, textSize, mobilePadding, touchTarget } = useResponsiveSize();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (backButtonRef.current) {
      addLuxuryHapticToButton(backButtonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: false
      });
    }
    if (closeButtonRef.current) {
      addLuxuryHapticToButton(closeButtonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: false
      });
    }
    if (resetButtonRef.current) {
      addLuxuryHapticToButton(resetButtonRef.current, {
        type: 'premiumError',
        onPress: true,
        onHover: false
      });
    }
    if (exitButtonRef.current) {
      addLuxuryHapticToButton(exitButtonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: false
      });
    }
  }, []);

  const getCurrentVehicleImage = React.useCallback(() => {
    const exteriorColors = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
      { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" },
      { name: "Deep Blue", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Ruby Red", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  }, [config.exteriorColor]);

  const getImageHeight = React.useCallback(() => {
    switch (deviceCategory) {
      case 'smallMobile': return 'h-28';
      case 'standardMobile': return 'h-32';
      case 'largeMobile': return 'h-36';
      case 'extraLargeMobile': return 'h-40';
      case 'tablet': return 'h-44';
      default: return 'h-32';
    }
  }, [deviceCategory]);

  const getTouchButtonClass = React.useCallback(() => {
    const baseClass = `${touchTarget} rounded-xl bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm border border-border/30 hover:border-primary/40 hover:from-background/98 hover:to-background/95 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95`;
    const sizeClass = deviceCategory === 'smallMobile' ? 'p-2.5' : 'p-3';
    return `${baseClass} ${sizeClass}`;
  }, [deviceCategory, touchTarget]);

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      // Only allow step navigation on specific steps that don't have internal swipe content
      if (step === 1 && step < 4) {
        contextualHaptic.swipeNavigation();
        goNext();
      }
    },
    onSwipeRight: () => {
      if (step === 1 && step > 1) {
        contextualHaptic.swipeNavigation();
        goBack();
      } else if (step === 1) {
        onClose();
      }
    },
    threshold: 80,
    preventDefaultTouchmoveEvent: false
  });

  const handleBackClick = React.useCallback(() => {
    contextualHaptic.stepProgress();
    if (step > 1) {
      goBack();
    } else {
      onClose();
    }
  }, [step, goBack, onClose]);

  const handleResetClick = React.useCallback(() => {
    contextualHaptic.resetAction();
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  const handleExitClick = React.useCallback(() => {
    contextualHaptic.exitAction();
    onClose();
  }, [onClose]);

  return (
    <motion.div
      variants={getContainerVariants(deviceCategory)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full min-h-screen bg-gradient-to-br from-background via-muted/2 to-background overflow-y-auto flex flex-col safe-area-inset-top safe-area-inset-bottom"
      ref={swipeableRef}
    >
      {/* Premium Toyota Header */}
      <motion.div 
        variants={headerVariants}
        className="relative z-30 flex items-center justify-between bg-gradient-to-r from-background/98 via-background/95 to-background/98 backdrop-blur-xl border-b border-border/10 flex-shrink-0 px-3 py-2.5 shadow-sm"
        style={{
          background: 'linear-gradient(90deg, hsl(var(--background)/0.98) 0%, hsl(var(--muted)/0.02) 50%, hsl(var(--background)/0.98) 100%)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="flex items-center gap-1.5">
          <motion.button
            ref={step > 1 ? backButtonRef : closeButtonRef}
            onClick={handleBackClick}
            className={getTouchButtonClass()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {step > 1 ? (
              <ArrowLeft className="h-4 w-4 text-foreground" />
            ) : (
              <X className="h-4 w-4 text-foreground" />
            )}
          </motion.button>

          <motion.button
            ref={resetButtonRef}
            onClick={handleResetClick}
            className={getTouchButtonClass()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RotateCcw className="h-4 w-4 text-foreground" />
          </motion.button>
        </div>

        <motion.div className="text-center flex-1 mx-3">
          <h1 className="text-sm font-bold text-foreground truncate leading-none">
            Build Your <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">{vehicle.name}</span>
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i <= step ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {step}/4
            </span>
          </div>
        </motion.div>

        <motion.button
          ref={exitButtonRef}
          onClick={handleExitClick}
          className={getTouchButtonClass()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="h-4 w-4 text-foreground" />
        </motion.button>
      </motion.div>

      {/* Premium Vehicle Showcase */}
      <motion.div 
        variants={imageVariants}
        className={`relative w-full ${getImageHeight()} overflow-hidden border-b border-border/5 flex-shrink-0 bg-gradient-to-br from-muted/10 via-muted/5 to-background/50`}
        key={config.exteriorColor + config.grade}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--muted)/0.08) 0%, hsl(var(--background)/0.95) 50%, hsl(var(--muted)/0.03) 100%)'
        }}
      >
        {/* Premium overlay for enhanced contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-background/10 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/5 via-transparent to-background/5 z-10" />
        
        <motion.img 
          src={getCurrentVehicleImage()}
          alt={`${config.exteriorColor} ${vehicle.name}`}
          className="w-full h-full object-contain object-center scale-110"
          initial={{ scale: 1.15, opacity: 0, rotateY: 10 }}
          animate={{ 
            scale: 1.1, 
            opacity: 1,
            rotateY: 0
          }}
          transition={{ 
            duration: 0.8, 
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.3
          }}
          whileHover={{
            scale: 1.12,
            transition: { duration: 0.4 }
          }}
          loading="lazy"
        />
        
        {/* Premium Vehicle Info Overlay */}
        <motion.div 
          className="absolute bottom-3 left-3 right-3 z-20"
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div 
            className="p-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--background)/0.95) 0%, hsl(var(--background)/0.85) 100%)',
              backdropFilter: 'blur(24px)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-foreground truncate mb-1 leading-tight">
                  {config.modelYear} {vehicle.name}
                </h3>
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <span className="text-xs font-semibold">{config.grade || 'Select Grade'}</span>
                  {config.grade && (
                    <>
                      <div className="w-1 h-1 bg-muted-foreground/60 rounded-full"></div>
                      <span className="text-xs">{config.engine}</span>
                    </>
                  )}
                </div>
                <p className="text-muted-foreground text-xs font-medium">
                  {config.exteriorColor} Exterior
                </p>
              </div>
              <div className="text-right ml-3">
                <div className="text-lg font-black text-primary mb-0.5">
                  AED {calculateTotalPrice().toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  From AED 2,850/mo
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Progress Bar */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 bg-gradient-to-r from-background/98 via-background/95 to-background/98 border-b border-border/5"
      >
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Premium Choice Collector */}
      <motion.div 
        variants={contentVariants}
        className="px-3 py-2 flex-shrink-0 bg-gradient-to-r from-background/98 via-muted/2 to-background/98 border-b border-border/5"
      >
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Premium Step Content */}
      <motion.div 
        variants={contentVariants}
        className="flex-1 overflow-hidden bg-gradient-to-b from-background/98 to-background/95 px-3 py-3"
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
            onReset={onReset}
          />
        </AnimatePresence>
      </motion.div>

      {/* Premium Summary */}
      <motion.div 
        variants={contentVariants}
        className="flex-shrink-0 relative z-30 bg-gradient-to-t from-background/98 via-background/95 to-background/98 border-t border-border/10 backdrop-blur-xl px-3 py-3 shadow-lg pb-safe-area-inset-bottom"
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background)/0.98) 0%, hsl(var(--muted)/0.02) 50%, hsl(var(--background)/0.98) 100%)',
          backdropFilter: 'blur(24px)'
        }}
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
