import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
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
}

// Premium cinematic entrance variants for desktop
const containerVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.92,
    rotateY: -10,
    filter: "blur(20px)"
  },
  visible: { 
    opacity: 1,
    scale: 1,
    rotateY: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    filter: "blur(10px)",
    transition: { duration: 0.6 }
  }
};

// Enhanced left panel with 3D depth
const leftPanelVariants = {
  hidden: { 
    x: -150, 
    opacity: 0,
    rotateY: 25,
    filter: "blur(15px)"
  },
  visible: { 
    x: 0, 
    opacity: 1,
    rotateY: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 1.0, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.3
    }
  }
};

// Enhanced right panel with premium entrance
const rightPanelVariants = {
  hidden: { 
    x: 150, 
    opacity: 0,
    rotateY: -25,
    filter: "blur(15px)"
  },
  visible: { 
    x: 0, 
    opacity: 1,
    rotateY: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 1.0, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.5
    }
  }
};

// Premium header animation with floating effect
const headerVariants = {
  hidden: { 
    y: -100, 
    opacity: 0,
    scale: 0.9,
    filter: "blur(10px)"
  },
  visible: { 
    y: 0, 
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2
    }
  }
};

// Enhanced image reveal with cinematic effects
const imageVariants = {
  hidden: { 
    scale: 1.6, 
    opacity: 0,
    filter: "blur(30px)",
    rotateY: 15
  },
  visible: { 
    scale: 1.1, 
    opacity: 1,
    filter: "blur(0px)",
    rotateY: 0,
    transition: { 
      duration: 2.0, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.8
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
  onClose
}) => {
  const { deviceCategory } = useDeviceInfo();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
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
  }, []);

  // Enhanced mouse tracking for premium effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Subtle parallax effect
        containerRef.current.style.setProperty('--mouse-x', `${x}`);
        containerRef.current.style.setProperty('--mouse-y', `${y}`);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
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

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-background overflow-hidden flex perspective-1000"
      style={{
        background: `radial-gradient(circle at ${50 + (parseInt(containerRef.current?.style.getPropertyValue('--mouse-x') || '0') * 20)}% ${50 + (parseInt(containerRef.current?.style.getPropertyValue('--mouse-y') || '0') * 10)}%, rgba(255,255,255,0.05) 0%, transparent 50%)`
      }}
    >
      {/* Enhanced Left Side - Interactive Car Image */}
      <motion.div 
        variants={leftPanelVariants}
        className="w-1/2 h-full relative bg-gradient-to-br from-muted/30 to-card/30 overflow-hidden"
      >
        {/* Premium Header with Glass Morphism */}
        <motion.div 
          variants={headerVariants}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 glass-desktop backdrop-blur-xl border-b border-border/20"
        >
          <motion.button
            ref={step > 1 ? backButtonRef : closeButtonRef}
            onClick={handleBackClick}
            className="p-4 rounded-xl glass-desktop backdrop-blur-xl border border-border/30 hover:bg-secondary/20 transition-all duration-300 luxury-button cursor-magnetic"
            whileHover={{ 
              scale: 1.1, 
              y: -4,
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {step > 1 ? (
              <ArrowLeft className="h-6 w-6 text-foreground" />
            ) : (
              <X className="h-6 w-6 text-foreground" />
            )}
          </motion.button>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.h1 
              className="text-3xl font-bold text-foreground luxury-text"
              animate={{ 
                scale: [1, 1.02, 1],
                textShadow: [
                  '0 4px 8px rgba(0,0,0,0.1)',
                  '0 6px 12px rgba(0,0,0,0.15)',
                  '0 4px 8px rgba(0,0,0,0.1)'
                ]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Build Your {vehicle.name}
            </motion.h1>
            <motion.p 
              className="text-sm text-primary font-medium"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Step {step} of 4
            </motion.p>
          </motion.div>

          <div className="w-16" />
        </motion.div>

        {/* Enhanced Full Height Interactive Car Image */}
        <motion.div 
          variants={imageVariants}
          className="relative w-full h-full overflow-hidden"
          layoutId="vehicle-image"
          key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        >
          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="w-full h-full object-cover scale-110 gpu-accelerated"
            initial={{ scale: 1.4, opacity: 0, filter: "blur(30px)" }}
            animate={{ 
              scale: 1.1, 
              opacity: 1, 
              filter: "blur(0px)"
            }}
            transition={{ 
              duration: 1.5, 
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.8
            }}
            whileHover={{
              scale: 1.15,
              transition: { duration: 0.8 }
            }}
          />
          
          {/* Premium gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
          
          {/* Enhanced floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-primary/5 rounded-full"
                style={{
                  top: `${10 + i * 7}%`,
                  left: `${5 + i * 8}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  rotate: [0, 360],
                  opacity: [0.2, 0.6, 0.2],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 4 + i * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
          
          {/* Enhanced Vehicle Info Overlay */}
          <motion.div 
            className="absolute bottom-8 left-8 right-8 text-foreground"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.div 
              className="glass-desktop backdrop-blur-xl rounded-2xl p-8 border border-border/30 max-w-md shadow-2xl premium-card"
              whileHover={{ 
                scale: 1.05,
                y: -8,
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
              }}
              transition={{ duration: 0.4 }}
            >
              <motion.h3 
                className="text-2xl font-bold mb-2 premium-gradient-text"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {config.modelYear} {vehicle.name}
              </motion.h3>
              <p className="text-primary text-lg font-medium">{config.grade} • {config.engine}</p>
              <p className="text-muted-foreground text-base">{config.exteriorColor} Exterior</p>
              <motion.div 
                className="mt-4 text-3xl font-black text-primary"
                animate={{ 
                  scale: [1, 1.05, 1],
                  textShadow: [
                    '0 2px 4px rgba(0,0,0,0.1)',
                    '0 4px 8px rgba(0,0,0,0.2)',
                    '0 2px 4px rgba(0,0,0,0.1)'
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                AED {calculateTotalPrice().toLocaleString()}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Right Side - Configuration Panel */}
      <motion.div 
        variants={rightPanelVariants}
        className="w-1/2 h-full flex flex-col glass-desktop backdrop-blur-xl border-l border-border/30"
      >
        {/* Enhanced Progress with Premium Effects */}
        <motion.div 
          className="px-6 py-4 glass-desktop backdrop-blur-sm border-b border-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <MobileProgress currentStep={step} totalSteps={4} />
        </motion.div>

        {/* Enhanced Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Choice Collector & Specs */}
          <motion.div 
            className="px-6 py-4 glass-desktop backdrop-blur-sm border-b border-border/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <ChoiceCollector config={config} step={step} />
            {showSpecs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
              >
                <CollapsibleSpecs config={config} />
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Step Content */}
          <motion.div 
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
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

          {/* Enhanced Summary with Premium Effects */}
          <motion.div 
            className="glass-desktop backdrop-blur-xl border-t border-border/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
          >
            <MobileSummary 
              config={config}
              totalPrice={calculateTotalPrice()}
              step={step}
              reserveAmount={reserveAmount}
              deviceCategory={deviceCategory}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DesktopCarBuilder;
