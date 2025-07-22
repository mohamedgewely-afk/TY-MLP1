
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Sparkles, Star } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useDeviceInfo } from "@/hooks/use-device-info";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import CollapsibleSpecs from "./CollapsibleSpecs";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface EnhancedDesktopCarBuilderProps {
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

// Enhanced cinematic variants
const enhancedContainerVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.98,
    rotateX: 2,
    filter: "blur(10px)"
  },
  visible: { 
    opacity: 1,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.2
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(5px)",
    transition: { duration: 0.6 }
  }
};

const enhancedLeftPanelVariants = {
  hidden: { 
    x: -120, 
    opacity: 0,
    rotateY: 20,
    filter: "blur(10px)"
  },
  visible: { 
    x: 0, 
    opacity: 1,
    rotateY: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 1, 
      ease: [0.16, 1, 0.3, 1],
      delay: 0.3
    }
  }
};

const enhancedRightPanelVariants = {
  hidden: { 
    x: 120, 
    opacity: 0,
    rotateY: -20,
    filter: "blur(10px)"
  },
  visible: { 
    x: 0, 
    opacity: 1,
    rotateY: 0,
    filter: "blur(0px)",
    transition: { 
      duration: 1, 
      ease: [0.16, 1, 0.3, 1],
      delay: 0.5
    }
  }
};

const enhancedHeaderVariants = {
  hidden: { 
    y: -100, 
    opacity: 0,
    backdropFilter: "blur(0px)"
  },
  visible: { 
    y: 0, 
    opacity: 1,
    backdropFilter: "blur(25px)",
    transition: { 
      duration: 0.8, 
      ease: [0.16, 1, 0.3, 1],
      delay: 0.1
    }
  }
};

const enhancedImageVariants = {
  hidden: { 
    scale: 1.6, 
    opacity: 0,
    filter: "blur(20px)",
    rotateY: 15
  },
  visible: { 
    scale: 1.08, 
    opacity: 1,
    filter: "blur(0px)",
    rotateY: 0,
    transition: { 
      duration: 1.8, 
      ease: [0.16, 1, 0.3, 1],
      delay: 0.8
    }
  }
};

// Enhanced parallax background
const ParallaxBackground = ({ config }: { config: BuilderConfig }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Layer 1 - Far background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/3"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Layer 2 - Mid ground particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          style={{
            left: `${10 + i * 10}%`,
            top: `${20 + Math.sin(i) * 30}%`,
          }}
          animate={{
            y: [-30, 30, -30],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Layer 3 - Foreground glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary/5 to-transparent rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

const EnhancedDesktopCarBuilder: React.FC<EnhancedDesktopCarBuilderProps> = ({
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

  return (
    <motion.div
      variants={enhancedContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full overflow-hidden flex"
      style={{
        background: `radial-gradient(ellipse at top left, hsl(var(--primary) / 0.05), transparent 50%),
                     radial-gradient(ellipse at bottom right, hsl(var(--primary) / 0.03), transparent 50%),
                     linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted) / 0.2))`
      }}
    >
      {/* Enhanced Parallax Background */}
      <ParallaxBackground config={config} />

      {/* Enhanced Left Side - Interactive Car Image */}
      <motion.div 
        variants={enhancedLeftPanelVariants}
        className="w-1/2 h-full relative overflow-hidden"
      >
        {/* Premium Header Overlay */}
        <motion.div 
          variants={enhancedHeaderVariants}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-8"
          style={{
            background: `linear-gradient(180deg, 
                        rgba(255, 255, 255, 0.15) 0%,
                        rgba(255, 255, 255, 0.05) 70%,
                        transparent 100%)`,
            backdropFilter: "blur(25px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <motion.button
            onClick={step > 1 ? goBack : onClose}
            className="p-4 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 shadow-xl transition-all duration-300 group"
            whileHover={{ 
              scale: 1.05, 
              rotateZ: step > 1 ? -5 : 45,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            {step > 1 ? (
              <ArrowLeft className="h-7 w-7 text-foreground group-hover:-translate-x-1 transition-transform duration-300" />
            ) : (
              <X className="h-7 w-7 text-foreground group-hover:rotate-90 transition-transform duration-300" />
            )}
          </motion.button>

          <div className="text-center">
            <motion.h1 
              className="text-3xl font-bold text-foreground mb-2"
              animate={{ 
                textShadow: [
                  "0 0 0 rgba(0,0,0,0)",
                  "0 0 20px rgba(239, 68, 68, 0.3)",
                  "0 0 0 rgba(0,0,0,0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Build Your {vehicle.name}
            </motion.h1>
            <motion.div
              className="flex items-center justify-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                Step {step} of 7 • Premium Configuration
              </span>
              <Star className="h-4 w-4 text-primary" />
            </motion.div>
          </div>

          <div className="w-16" />
        </motion.div>

        {/* Cinematic Car Image Display */}
        <motion.div 
          variants={enhancedImageVariants}
          className="relative w-full h-full overflow-hidden"
          layoutId="vehicle-image"
          key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        >
          {/* Dynamic lighting overlay */}
          <motion.div
            className="absolute inset-0 z-10"
            animate={{
              background: [
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)",
                "linear-gradient(45deg, rgba(239,68,68,0.05) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.05) 100%)",
                "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.1) 100%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="w-full h-full object-cover relative z-5"
            initial={{ scale: 1.3, opacity: 0, rotateY: 15 }}
            animate={{ scale: 1.08, opacity: 1, rotateY: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.16, 1, 0.3, 1],
              delay: 0.4
            }}
            whileHover={{ 
              scale: 1.12,
              rotateY: -3,
              transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }}
          />
          
          {/* Enhanced gradient overlays */}
          <div 
            className="absolute inset-0 z-15"
            style={{
              background: `
                radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.1) 80%),
                linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.1) 100%),
                linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.05) 100%)
              `
            }}
          />
          
          {/* Premium Vehicle Info Overlay */}
          <motion.div 
            className="absolute bottom-10 left-10 right-10 text-foreground z-20"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div 
              className="backdrop-blur-xl rounded-3xl p-8 border border-white/20 max-w-lg shadow-2xl"
              style={{
                background: `linear-gradient(135deg, 
                            rgba(255, 255, 255, 0.25) 0%,
                            rgba(255, 255, 255, 0.1) 100%)`,
                boxShadow: `
                  0 25px 80px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.4),
                  0 0 0 1px rgba(255, 255, 255, 0.1)
                `
              }}
            >
              <motion.h3 
                className="text-3xl font-bold mb-3"
                animate={{
                  backgroundImage: [
                    "linear-gradient(90deg, hsl(var(--foreground)), hsl(var(--foreground)))",
                    "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--foreground)))",
                    "linear-gradient(90deg, hsl(var(--foreground)), hsl(var(--primary)))",
                    "linear-gradient(90deg, hsl(var(--foreground)), hsl(var(--foreground)))"
                  ]
                }}
                style={{ WebkitBackgroundClip: "text" }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {config.modelYear} {vehicle.name}
              </motion.h3>
              <p className="text-primary text-xl font-medium mb-2">
                {config.grade} • {config.engine}
              </p>
              <p className="text-muted-foreground text-lg mb-4">
                {config.exteriorColor} Exterior
              </p>
              <motion.div 
                className="text-4xl font-black text-primary"
                animate={{ 
                  scale: [1, 1.02, 1],
                  textShadow: [
                    "0 0 0 rgba(0,0,0,0)",
                    "0 0 30px rgba(239, 68, 68, 0.2)",
                    "0 0 0 rgba(0,0,0,0)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                AED {calculateTotalPrice().toLocaleString()}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Right Side - Configuration Panel */}
      <motion.div 
        variants={enhancedRightPanelVariants}
        className="w-1/2 h-full flex flex-col"
        style={{
          background: `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.1) 0%,
                      rgba(255, 255, 255, 0.05) 100%)`,
          backdropFilter: "blur(25px)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Enhanced Progress */}
        <div 
          className="px-8 py-6 border-b border-white/10"
          style={{
            background: `linear-gradient(180deg, 
                        rgba(255, 255, 255, 0.1) 0%,
                        rgba(255, 255, 255, 0.05) 100%)`,
            backdropFilter: "blur(15px)"
          }}
        >
          <MobileProgress currentStep={step} totalSteps={7} />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Choice Collector & Specs */}
          <div 
            className="px-8 py-6 border-b border-white/10"
            style={{
              background: `rgba(255, 255, 255, 0.03)`,
              backdropFilter: "blur(10px)"
            }}
          >
            <ChoiceCollector config={config} step={step} />
            {showSpecs && (
              <CollapsibleSpecs config={config} />
            )}
          </div>

          {/* Enhanced Step Content */}
          <div className="flex-1 overflow-hidden">
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
          </div>

          {/* Enhanced Summary */}
          <div 
            className="border-t border-white/10"
            style={{
              background: `linear-gradient(180deg, 
                          rgba(255, 255, 255, 0.15) 0%,
                          rgba(255, 255, 255, 0.1) 100%)`,
              backdropFilter: "blur(25px)",
              boxShadow: `0 -15px 50px rgba(0, 0, 0, 0.1),
                          inset 0 1px 0 rgba(255, 255, 255, 0.2)`
            }}
          >
            <MobileSummary 
              config={config}
              totalPrice={calculateTotalPrice()}
              step={step}
              reserveAmount={reserveAmount}
              deviceCategory={deviceCategory}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedDesktopCarBuilder;
