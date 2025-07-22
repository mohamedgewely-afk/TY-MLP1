
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Sparkles } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import { useSwipeable } from "@/hooks/use-swipeable";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface EnhancedMobileCarBuilderProps {
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

// Enhanced particle system background
const ParticleBackground = ({ exteriorColor }: { exteriorColor: string }) => {
  const getColorFromName = (colorName: string) => {
    switch (colorName) {
      case "Pearl White": return "rgba(255, 255, 255, 0.3)";
      case "Midnight Black": return "rgba(0, 0, 0, 0.3)";
      case "Silver Metallic": return "rgba(192, 192, 192, 0.3)";
      default: return "rgba(239, 68, 68, 0.3)";
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: getColorFromName(exteriorColor),
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Enhanced glass morphism variants
const getEnhancedContainerVariants = (deviceCategory: DeviceCategory) => ({
  hidden: { 
    opacity: 0,
    scale: 0.96,
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
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    filter: "blur(5px)",
    transition: { duration: 0.4 }
  }
});

const enhancedHeaderVariants = {
  hidden: { 
    y: -50, 
    opacity: 0,
    backdropFilter: "blur(0px)"
  },
  visible: { 
    y: 0, 
    opacity: 1,
    backdropFilter: "blur(20px)",
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const enhancedImageVariants = {
  hidden: { 
    scale: 1.2, 
    opacity: 0,
    filter: "blur(15px)",
    rotateY: 10
  },
  visible: { 
    scale: 1, 
    opacity: 1,
    filter: "blur(0px)",
    rotateY: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1],
      delay: 0.3
    }
  }
};

const enhancedContentVariants = {
  hidden: { 
    y: 30, 
    opacity: 0,
    scale: 0.98
  },
  visible: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.4, 
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

const EnhancedMobileCarBuilder: React.FC<EnhancedMobileCarBuilderProps> = ({
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

  const getImageHeight = () => {
    switch (deviceCategory) {
      case 'smallMobile': return 'h-44';
      case 'standardMobile': return 'h-52';
      case 'largeMobile': return 'h-56';
      default: return 'h-52';
    }
  };

  const getTouchButtonClass = () => {
    const baseClass = 'touch-target rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 shadow-lg shadow-black/5 transition-all duration-300 flex items-center justify-center group';
    const sizeClass = deviceCategory === 'smallMobile' ? 'p-2.5 min-h-[48px] min-w-[48px]' : 'p-3 min-h-[52px] min-w-[52px]';
    return `${baseClass} ${sizeClass}`;
  };

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (step < 4) goNext();
    },
    onSwipeRight: () => {
      if (step > 1) goBack();
    },
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  return (
    <motion.div
      variants={getEnhancedContainerVariants(deviceCategory)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-gradient-to-br from-background via-background/95 to-muted/30 overflow-hidden flex flex-col mobile-viewport"
      ref={swipeableRef}
      style={{
        background: `radial-gradient(ellipse at top, hsl(var(--primary) / 0.02), transparent 50%),
                     linear-gradient(to bottom right, hsl(var(--background)), hsl(var(--muted) / 0.3))`
      }}
    >
      {/* Enhanced Particle Background */}
      <ParticleBackground exteriorColor={config.exteriorColor} />

      {/* Enhanced Header with Premium Glass Effect */}
      <motion.div 
        variants={enhancedHeaderVariants}
        className={`relative z-30 flex items-center justify-between backdrop-blur-xl bg-white/10 border-b border-white/10 flex-shrink-0 ${containerPadding} py-4 safe-area-inset-top`}
        style={{
          background: `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.15) 0%,
                      rgba(255, 255, 255, 0.05) 100%)`,
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)`
        }}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className={getTouchButtonClass()}
          whileHover={{ 
            scale: 1.05, 
            rotateZ: step > 1 ? 0 : 90,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          {step > 1 ? (
            <ArrowLeft className={`${deviceCategory === 'smallMobile' ? 'h-5 w-5' : 'h-6 w-6'} text-foreground group-hover:-translate-x-0.5 transition-transform duration-200`} />
          ) : (
            <X className={`${deviceCategory === 'smallMobile' ? 'h-5 w-5' : 'h-6 w-6'} text-foreground group-hover:rotate-90 transition-transform duration-200`} />
          )}
        </motion.button>

        <div className="text-center flex-1 mx-4">
          <motion.h1 
            className={`${textSize.lg} font-bold text-foreground mb-1`}
            animate={{ 
              backgroundImage: [
                'linear-gradient(90deg, hsl(var(--foreground)), hsl(var(--foreground)))',
                'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--foreground)))',
                'linear-gradient(90deg, hsl(var(--foreground)), hsl(var(--foreground)))'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Build Your {vehicle.name.split(' ').pop()}
          </motion.h1>
          <motion.div
            className="flex items-center justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="h-3 w-3 text-primary" />
            <span className={`${textSize.xs} text-primary font-medium`}>
              Step {step} of 4
            </span>
            <Sparkles className="h-3 w-3 text-primary" />
          </motion.div>
        </div>

        <div className="w-12" />
      </motion.div>

      {/* Enhanced Vehicle Image with 3D Effects */}
      <motion.div 
        variants={enhancedImageVariants}
        className={`relative w-full ${getImageHeight()} overflow-hidden border-b border-white/10 flex-shrink-0`}
        style={{
          background: `radial-gradient(ellipse at center, 
                      rgba(255, 255, 255, 0.1) 0%,
                      rgba(0, 0, 0, 0.05) 100%)`
        }}
        key={config.exteriorColor + config.grade}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain relative z-10"
          initial={{ scale: 1.1, opacity: 0, rotateY: 10 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.2
          }}
          whileHover={{ 
            scale: 1.02,
            rotateY: -2,
            transition: { duration: 0.3 }
          }}
          loading="lazy"
        />
        
        <div 
          className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent"
          style={{
            background: `linear-gradient(180deg, 
                        rgba(0, 0, 0, 0.1) 0%,
                        transparent 30%,
                        transparent 70%,
                        rgba(0, 0, 0, 0.05) 100%)`
          }}
        />
        
        {/* Enhanced Vehicle Info Card */}
        <motion.div 
          className={`absolute bottom-3 left-3 right-3`}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <div 
            className={`backdrop-blur-xl rounded-xl ${mobilePadding.sm} border border-white/20 shadow-xl`}
            style={{
              background: `linear-gradient(135deg, 
                          rgba(255, 255, 255, 0.2) 0%,
                          rgba(255, 255, 255, 0.1) 100%)`,
              boxShadow: `0 12px 40px rgba(0, 0, 0, 0.15),
                          inset 0 1px 0 rgba(255, 255, 255, 0.3)`
            }}
          >
            <motion.h3 
              className={`${textSize.base} font-bold mb-1`}
              animate={{ 
                backgroundImage: [
                  'linear-gradient(90deg, hsl(var(--foreground)), hsl(var(--foreground)))',
                  'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--foreground)))'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              {config.modelYear} {vehicle.name}
            </motion.h3>
            <p className={`text-primary ${textSize.sm} font-medium mb-1`}>
              {config.grade} • {config.engine}
            </p>
            <p className={`text-muted-foreground ${textSize.xs}`}>
              {config.exteriorColor} Exterior
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* Enhanced Progress Bar */}
      <motion.div 
        variants={enhancedContentVariants}
        className="flex-shrink-0 backdrop-blur-sm bg-white/5 border-b border-white/5"
      >
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Enhanced Choice Collector */}
      <motion.div 
        variants={enhancedContentVariants}
        className={`${containerPadding} py-3 flex-shrink-0 backdrop-blur-sm bg-white/5 border-b border-white/5`}
      >
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Enhanced Step Content */}
      <motion.div 
        variants={enhancedContentVariants}
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

      {/* Enhanced Summary */}
      <motion.div 
        variants={enhancedContentVariants}
        className="flex-shrink-0 relative z-30 backdrop-blur-xl bg-white/10 border-t border-white/10 safe-area-inset-bottom"
        style={{
          background: `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.15) 0%,
                      rgba(255, 255, 255, 0.05) 100%)`,
          boxShadow: `0 -8px 32px rgba(0, 0, 0, 0.1),
                      inset 0 1px 0 rgba(255, 255, 255, 0.2)`
        }}
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

export default EnhancedMobileCarBuilder;
