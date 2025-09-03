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

  // Get responsive panel widths based on device category
  const getPanelWidths = () => {
    switch (deviceCategory) {
      case 'laptop': return { left: 'w-[65%]', right: 'w-[35%]' };
      case 'largeDesktop': return { left: 'w-[60%]', right: 'w-[40%]' };
      default: return { left: 'w-[70%]', right: 'w-[30%]' };
    }
  };

  const getHeaderPadding = () => {
    switch (deviceCategory) {
      case 'laptop': return 'p-8';
      case 'largeDesktop': return 'p-12';
      default: return 'p-10';
    }
  };

  const getHeaderTextSize = () => {
    switch (deviceCategory) {
      case 'laptop': return 'text-3xl';
      case 'largeDesktop': return 'text-5xl';
      default: return 'text-4xl';
    }
  };

  const getVehicleInfoPadding = () => {
    switch (deviceCategory) {
      case 'laptop': return 'p-6';
      case 'largeDesktop': return 'p-10';
      default: return 'p-8';
    }
  };

  const getVehicleInfoPosition = () => {
    switch (deviceCategory) {
      case 'laptop': return 'bottom-8 left-8 right-8';
      case 'largeDesktop': return 'bottom-16 left-16 right-16';
      default: return 'bottom-12 left-12 right-12';
    }
  };

  const getRightPanelPadding = () => {
    switch (deviceCategory) {
      case 'laptop': return 'px-6 py-6';
      case 'largeDesktop': return 'px-12 py-10';
      default: return 'px-10 py-8';
    }
  };

  const panelWidths = getPanelWidths();

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
      className="relative h-full w-full bg-gradient-to-br from-background via-muted/2 to-background overflow-hidden flex"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.02) 30%, hsl(var(--background)) 70%, hsl(var(--muted)/0.01) 100%)'
      }}
    >
      {/* Premium Vehicle Theater */}
      <motion.div 
        variants={leftPanelVariants}
        className={`${panelWidths.left} h-full relative overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.03) 30%, hsl(var(--background)/0.98) 70%, hsl(var(--muted)/0.02) 100%)'
        }}
      >
        {/* Premium Toyota Header */}
        <motion.div 
          variants={headerVariants}
          className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between ${getHeaderPadding()} backdrop-blur-xl border-b border-border/10 shadow-lg`}
          style={{
            background: 'linear-gradient(180deg, hsl(var(--background)/0.98) 0%, hsl(var(--background)/0.95) 50%, hsl(var(--background)/0.85) 100%)',
            backdropFilter: 'blur(32px)'
          }}
        >
          <div className="flex items-center gap-6">
            <motion.button
              ref={step > 1 ? backButtonRef : closeButtonRef}
              onClick={handleBackClick}
              className="group p-4 rounded-2xl bg-gradient-to-br from-background/95 to-background/85 backdrop-blur-sm border border-border/30 hover:border-primary/40 hover:from-background/98 hover:to-background/95 transition-all duration-300 shadow-xl hover:shadow-2xl min-h-[52px] min-w-[52px]"
              whileHover={{ 
                scale: 1.05, 
                y: -4,
                rotateY: 5
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -40, rotateY: -15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              className="group p-4 rounded-2xl bg-gradient-to-br from-background/95 to-background/85 backdrop-blur-sm border border-border/30 hover:border-destructive/40 hover:from-background/98 hover:to-background/95 transition-all duration-300 shadow-xl hover:shadow-2xl min-h-[52px] min-w-[52px]"
              whileHover={{ 
                scale: 1.05, 
                y: -4,
                rotateY: -5
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -40, rotateY: 15 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <RotateCcw className="h-6 w-6 text-foreground group-hover:text-destructive transition-colors" />
            </motion.button>
          </div>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className={`${getHeaderTextSize()} font-black text-foreground tracking-tight`}>
              Build Your <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent">{vehicle.name}</span>
            </h1>
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent w-20"></div>
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i}
                      className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        i <= step ? 'bg-primary' : 'bg-muted-foreground/20'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + (i * 0.1), duration: 0.4 }}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground font-semibold">
                  Step {step} of 4
                </p>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent w-20"></div>
            </div>
          </motion.div>

          <div className="w-32" />
        </motion.div>

        {/* Cinematic Vehicle Theater */}
        <motion.div 
          variants={imageVariants}
          className="relative w-full h-full overflow-hidden"
          layoutId="vehicle-image"
          key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        >
          {/* Professional cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/5 z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/5 via-transparent to-background/5 z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-background/10 z-10" />
          
          <motion.img 
            src={getCurrentVehicleImage()}
            alt={`${config.exteriorColor} ${vehicle.name}`}
            className="w-full h-full object-cover"
            initial={{ scale: 1.4, opacity: 0, rotateY: 15 }}
            animate={{ 
              scale: 1.1, 
              opacity: 1,
              rotateY: 0
            }}
            transition={{ 
              duration: 1.8, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.8
            }}
            whileHover={{
              scale: 1.15,
              rotateY: -2,
              transition: { duration: 0.6 }
            }}
            loading="lazy"
          />
          
          {/* Premium Vehicle Information Card */}
          <motion.div 
            className={`absolute ${getVehicleInfoPosition()} z-20`}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.4, duration: 1.0, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.div 
              className={`backdrop-blur-xl rounded-3xl ${getVehicleInfoPadding()} border border-white/10 max-w-2xl shadow-2xl`}
              style={{
                background: 'linear-gradient(135deg, hsl(var(--background)/0.95) 0%, hsl(var(--background)/0.88) 50%, hsl(var(--background)/0.92) 100%)',
                backdropFilter: 'blur(32px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
              whileHover={{ 
                scale: 1.03,
                y: -8,
                rotateY: 2
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className={`${deviceCategory === 'largeDesktop' ? 'text-5xl' : deviceCategory === 'laptop' ? 'text-3xl' : 'text-4xl'} font-black text-foreground mb-2 tracking-tight`}>
                    {config.modelYear} {vehicle.name}
                  </h3>
                  <div className={`flex items-center gap-4 ${deviceCategory === 'largeDesktop' ? 'text-2xl' : deviceCategory === 'laptop' ? 'text-lg' : 'text-xl'} text-muted-foreground mb-2`}>
                    <span className="font-bold">{config.grade}</span>
                    <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                    <span className="font-medium">{config.engine}</span>
                  </div>
                  <p className={`text-muted-foreground ${deviceCategory === 'largeDesktop' ? 'text-lg' : 'text-base'} font-medium mb-8`}>
                    {config.exteriorColor} Exterior
                  </p>
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <div className={`${deviceCategory === 'largeDesktop' ? 'text-6xl' : deviceCategory === 'laptop' ? 'text-4xl' : 'text-5xl'} font-black text-primary mb-2 tracking-tight`}>
                    AED {calculateTotalPrice().toLocaleString()}
                  </div>
                  <div className={`${deviceCategory === 'largeDesktop' ? 'text-lg' : 'text-base'} text-muted-foreground font-medium`}>
                    Starting from
                  </div>
                </div>
                <div className="text-right">
                  <div className={`${deviceCategory === 'largeDesktop' ? 'text-2xl' : deviceCategory === 'laptop' ? 'text-xl' : 'text-xl'} font-bold text-foreground mb-1`}>
                    AED 2,850/mo
                  </div>
                  <div className={`${deviceCategory === 'largeDesktop' ? 'text-base' : 'text-sm'} text-muted-foreground`}>
                    48 months
                  </div>
                </div>
              </div>
              
              {/* Premium accent line with gradient */}
              <div className="mt-6 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              <div className="mt-1 h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 rounded-full"></div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Premium Configuration Panel */}
      <motion.div 
        variants={rightPanelVariants}
        className={`${panelWidths.right} h-full flex flex-col backdrop-blur-xl border-l border-border/10 shadow-2xl`}
        style={{
          background: 'linear-gradient(180deg, hsl(var(--background)/0.98) 0%, hsl(var(--muted)/0.02) 30%, hsl(var(--background)/0.95) 70%, hsl(var(--muted)/0.01) 100%)',
          backdropFilter: 'blur(32px)'
        }}
      >
        {/* Premium Progress Section */}
        <motion.div 
          className={`${getRightPanelPadding()} border-b border-border/10`}
          style={{
            background: 'linear-gradient(180deg, hsl(var(--background)/0.98) 0%, hsl(var(--muted)/0.02) 100%)'
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <MobileProgress currentStep={step} totalSteps={4} />
        </motion.div>

        {/* Content Area with Enhanced Spacing */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Premium Choice Collection */}
          <motion.div 
            className={`${getRightPanelPadding()} border-b border-border/5`}
            style={{
              background: 'linear-gradient(180deg, hsl(var(--background)/0.98) 0%, hsl(var(--muted)/0.01) 100%)'
            }}
            initial={{ opacity: 0, x: 30, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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

          {/* Premium Step Content Area */}
          <motion.div 
            className="flex-1 overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, hsl(var(--background)/0.98) 0%, hsl(var(--background)/0.95) 100%)'
            }}
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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

          {/* Premium Summary Footer */}
          <motion.div 
            className="border-t border-border/10 backdrop-blur-xl shadow-lg"
            style={{
              background: 'linear-gradient(180deg, hsl(var(--muted)/0.02) 0%, hsl(var(--background)/0.98) 100%)',
              backdropFilter: 'blur(32px)'
            }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
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
