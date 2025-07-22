import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
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

// Cinematic entrance variants for desktop
const containerVariants = {
  hidden: { 
    opacity: 0,
    scale: 0.95,
    rotateY: -5,
  },
  visible: { 
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: {
      duration: 1,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.15
    }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.5 }
  }
};

const leftPanelVariants = {
  hidden: { 
    x: -100, 
    opacity: 0,
    rotateY: 15
  },
  visible: { 
    x: 0, 
    opacity: 1,
    rotateY: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.2
    }
  }
};

const rightPanelVariants = {
  hidden: { 
    x: 100, 
    opacity: 0,
    rotateY: -15
  },
  visible: { 
    x: 0, 
    opacity: 1,
    rotateY: 0,
    transition: { 
      duration: 0.8, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.4
    }
  }
};

const headerVariants = {
  hidden: { y: -80, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.7, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.1
    }
  }
};

const imageVariants = {
  hidden: { 
    scale: 1.4, 
    opacity: 0,
    filter: "blur(15px)"
  },
  visible: { 
    scale: 1.1, 
    opacity: 1,
    filter: "blur(0px)",
    transition: { 
      duration: 1.5, 
      ease: [0.25, 0.46, 0.45, 0.94],
      delay: 0.6
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
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-background overflow-hidden flex perspective-1000"
    >
      {/* Left Side - Interactive Car Image with Glass Morphism */}
      <motion.div 
        variants={leftPanelVariants}
        className="w-1/2 h-full relative bg-gradient-to-br from-muted/30 to-card/30"
      >
        {/* Header overlay on image with Glass Morphism */}
        <motion.div 
          variants={headerVariants}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 glass backdrop-blur-xl border-b border-border/20"
        >
          <motion.button
            onClick={step > 1 ? goBack : onClose}
            className="p-3 rounded-xl glass backdrop-blur-xl border border-border/30 hover:bg-secondary/20 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {step > 1 ? (
              <ArrowLeft className="h-6 w-6 text-foreground" />
            ) : (
              <X className="h-6 w-6 text-foreground" />
            )}
          </motion.button>

          <div className="text-center">
            <motion.h1 
              className="text-2xl font-bold text-foreground"
              animate={{ scale: [1, 1.01, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Build Your {vehicle.name}
            </motion.h1>
            <p className="text-sm text-primary font-medium">Step {step} of 7</p>
          </div>

          <div className="w-12" />
        </motion.div>

        {/* Full height interactive car image */}
        <motion.div 
          variants={imageVariants}
          className="relative w-full h-full overflow-hidden"
          layoutId="vehicle-image"
          key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        >
          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="w-full h-full object-cover scale-110"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />
          
          {/* Vehicle Info Overlay with Glass Morphism */}
          <motion.div 
            className="absolute bottom-8 left-8 right-8 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="glass backdrop-blur-xl rounded-2xl p-6 border border-border/30 max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold mb-2">{config.modelYear} {vehicle.name}</h3>
              <p className="text-primary text-lg font-medium">{config.grade} • {config.engine}</p>
              <p className="text-muted-foreground text-base">{config.exteriorColor} Exterior</p>
              <div className="mt-4 text-3xl font-black text-primary">
                AED {calculateTotalPrice().toLocaleString()}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Side - Configuration Panel with Glass Morphism */}
      <motion.div 
        variants={rightPanelVariants}
        className="w-1/2 h-full flex flex-col glass backdrop-blur-xl border-l border-border/30"
      >
        {/* Progress with Glass Effect */}
        <div className="px-6 py-4 glass backdrop-blur-sm border-b border-border/20">
          <MobileProgress currentStep={step} totalSteps={7} />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Choice Collector & Specs with Glass Morphism */}
          <div className="px-6 py-4 glass backdrop-blur-sm border-b border-border/20">
            <ChoiceCollector config={config} step={step} />
            {showSpecs && (
              <CollapsibleSpecs config={config} />
            )}
          </div>

          {/* Step Content */}
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
              />
            </AnimatePresence>
          </div>

          {/* Summary with Glass Morphism */}
          <div className="glass backdrop-blur-xl border-t border-border/30">
            <MobileSummary 
              config={config}
              totalPrice={calculateTotalPrice()}
              step={step}
              reserveAmount={reserveAmount}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DesktopCarBuilder;
