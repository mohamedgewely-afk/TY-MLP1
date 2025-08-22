
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

// Premium entrance variants optimized for full-screen desktop
const containerVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95
  },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.5 }
  }
};

// Enhanced left panel for cinematic vehicle showcase
const leftPanelVariants = {
  hidden: { 
    x: -100, 
    opacity: 0
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2
    }
  }
};

// Enhanced right panel
const rightPanelVariants = {
  hidden: { 
    x: 100, 
    opacity: 0
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3
    }
  }
};

// Luxury header animation
const headerVariants = {
  hidden: { 
    y: -60, 
    opacity: 0
  },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.1
    }
  }
};

// Cinematic image reveal
const imageVariants = {
  hidden: { 
    scale: 1.2, 
    opacity: 0
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 1.2, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.5
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
  
  const getCurrentVehicleImage = React.useCallback(() => {
    const exteriorColors = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
      { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  }, [config.exteriorColor]);

  const showSpecs = React.useMemo(() => step > 3 && (config.modelYear && config.grade), [step, config.modelYear, config.grade]);
  const reserveAmount = 5000;

  // Premium button click handlers
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
    onReset();
  }, [onReset]);

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-gradient-to-br from-background via-background to-muted/10 overflow-hidden flex"
    >
      {/* Cinematic Left Side - Full Vehicle Showcase */}
      <motion.div 
        variants={leftPanelVariants}
        className="w-[70%] h-full relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--muted)/0.02) 0%, hsl(var(--muted)/0.05) 50%, hsl(var(--muted)/0.08) 100%)'
        }}
      >
        {/* Luxury Header with Premium Automotive Styling */}
        <motion.div 
          variants={headerVariants}
          className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-10 bg-gradient-to-b from-background/98 via-background/95 to-transparent backdrop-blur-xl border-b border-border/20"
        >
          <div className="flex items-center gap-6">
            <motion.button
              ref={step > 1 ? backButtonRef : closeButtonRef}
              onClick={handleBackClick}
              className="group p-4 rounded-2xl bg-background/90 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-background transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px]"
              whileHover={{ 
                scale: 1.05, 
                y: -3
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {step > 1 ? (
                <ArrowLeft className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
              ) : (
                <X className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
              )}
            </motion.button>

            <motion.button
              ref={resetButtonRef}
              onClick={handleResetClick}
              className="group p-4 rounded-2xl bg-background/90 backdrop-blur-sm border border-border/50 hover:border-destructive/30 hover:bg-background transition-all duration-300 shadow-lg hover:shadow-xl min-h-[48px] min-w-[48px]"
              whileHover={{ 
                scale: 1.05, 
                y: -3
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <RotateCcw className="h-6 w-6 text-foreground group-hover:text-destructive transition-colors" />
            </motion.button>
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Build Your <span className="text-primary">{vehicle.name}</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-16"></div>
              <p className="text-muted-foreground font-medium">
                Step {step} of 4
              </p>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-16"></div>
            </div>
          </motion.div>

          <div className="w-32" />
        </motion.div>

        {/* Cinematic Full Height Interactive Car Showcase */}
        <motion.div 
          variants={imageVariants}
          className="relative w-full h-full overflow-hidden"
          layoutId="vehicle-image"
          key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        >
          {/* Professional photography gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-background/20 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/10 via-transparent to-background/5 z-10" />
          
          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="w-full h-full object-cover"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ 
              scale: 1.1, 
              opacity: 1
            }}
            transition={{ 
              duration: 1.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.7
            }}
            whileHover={{
              scale: 1.15,
              transition: { duration: 0.8 }
            }}
            loading="lazy"
          />
          
          {/* Premium Vehicle Info Overlay - Automotive Style */}
          <motion.div 
            className="absolute bottom-12 left-12 right-12 z-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div 
              className="bg-background/95 backdrop-blur-xl rounded-3xl p-8 border border-border/20 max-w-lg shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--background)/0.95) 0%, hsl(var(--background)/0.90) 100%)',
                backdropFilter: 'blur(24px)'
              }}
              whileHover={{ 
                scale: 1.02,
                y: -6
              }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-foreground mb-1">
                    {config.modelYear} {vehicle.name}
                  </h3>
                  <div className="flex items-center gap-3 text-lg text-muted-foreground mb-1">
                    <span className="font-medium">{config.grade}</span>
                    <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                    <span>{config.engine}</span>
                  </div>
                  <p className="text-muted-foreground mb-6">{config.exteriorColor} Exterior</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-4xl font-bold text-primary">
                  AED {calculateTotalPrice().toLocaleString()}
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">From</div>
                  <div className="text-lg font-semibold text-foreground">AED 2,850/mo</div>
                </div>
              </div>
              
              {/* Premium accent line */}
              <div className="mt-4 h-px bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Right Side - Premium Configuration Panel */}
      <motion.div 
        variants={rightPanelVariants}
        className="w-[30%] h-full flex flex-col bg-gradient-to-b from-background/98 to-background/95 backdrop-blur-xl border-l border-border/20"
      >
        {/* Progress with Premium Styling */}
        <motion.div 
          className="px-10 py-8 bg-gradient-to-b from-background/98 to-background/95 border-b border-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <MobileProgress currentStep={step} totalSteps={4} />
        </motion.div>

        {/* Content Area with Premium Spacing */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Choice Collector & Specs with Luxury Styling */}
          <motion.div 
            className="px-10 py-8 bg-gradient-to-b from-background/98 to-background/95 border-b border-border/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <ChoiceCollector config={config} step={step} />
            {showSpecs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-6"
              >
                <CollapsibleSpecs config={config} />
              </motion.div>
            )}
          </motion.div>

          {/* Step Content with Premium Styling */}
          <motion.div 
            className="flex-1 overflow-hidden bg-gradient-to-b from-background/95 to-background/90"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.0, duration: 0.6 }}
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

          {/* Premium Summary */}
          <motion.div 
            className="bg-gradient-to-t from-background/98 to-background/95 border-t border-border/20 backdrop-blur-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
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
