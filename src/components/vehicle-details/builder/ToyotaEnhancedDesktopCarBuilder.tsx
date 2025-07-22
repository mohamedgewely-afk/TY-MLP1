
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Car, Star } from "lucide-react";
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

interface ToyotaEnhancedDesktopCarBuilderProps {
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

// Clean, performance-optimized variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.2, staggerChildren: 0.05 }
  },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

const panelVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const ToyotaEnhancedDesktopCarBuilder: React.FC<ToyotaEnhancedDesktopCarBuilderProps> = ({
  vehicle,
  step,
  config,
  setConfig,
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
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  };

  const showSpecs = step > 3 && (config.modelYear && config.grade);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-full w-full overflow-hidden flex bg-background"
    >
      {/* Left Panel - Vehicle Image */}
      <motion.div 
        variants={panelVariants}
        className="w-1/2 h-full relative overflow-hidden"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between toyota-spacing-lg toyota-glass-light">
          <motion.button
            onClick={step > 1 ? goBack : onClose}
            className="toyota-spacing-md toyota-border-radius-lg toyota-glass-light toyota-hover-lift flex items-center justify-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {step > 1 ? (
              <ArrowLeft className="h-6 w-6 text-toyota-red" />
            ) : (
              <X className="h-6 w-6 text-toyota-red" />
            )}
          </motion.button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">
              Build Your {vehicle.name}
            </h1>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <Star className="h-4 w-4 text-toyota-red" />
              <span className="text-sm text-toyota-red font-medium">
                Step {step} of 7
              </span>
              <Star className="h-4 w-4 text-toyota-red" />
            </div>
          </div>

          <div className="w-16" />
        </div>

        {/* Vehicle Image */}
        <motion.div 
          className="w-full h-full"
          key={config.exteriorColor + config.grade}
        >
          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="w-full h-full object-cover"
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
          />
          
          {/* Vehicle Info Overlay */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="toyota-glass-light toyota-border-radius-lg toyota-spacing-lg toyota-shadow-md max-w-lg">
              <div className="flex items-center gap-3 mb-3">
                <Car className="h-6 w-6 text-toyota-red" />
                <h3 className="text-xl font-bold">{config.modelYear} {vehicle.name}</h3>
              </div>
              <p className="text-toyota-red text-lg font-medium mb-2">
                {config.grade} • {config.engine}
              </p>
              <p className="text-muted-foreground mb-4">
                {config.exteriorColor} Exterior
              </p>
              <div className="text-3xl font-black text-toyota-red">
                AED {calculateTotalPrice().toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Panel - Configuration */}
      <motion.div 
        variants={panelVariants}
        className="w-1/2 h-full flex flex-col toyota-glass-light border-l border-toyota-red/10"
      >
        {/* Progress */}
        <div className="toyota-spacing-md border-b border-border/10">
          <MobileProgress currentStep={step} totalSteps={7} />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Choice Collector & Specs */}
          <div className="toyota-spacing-md border-b border-border/10">
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
                deviceCategory={deviceCategory}
              />
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="toyota-glass-light border-t border-toyota-red/10 toyota-shadow-sm">
            <MobileSummary 
              config={config}
              totalPrice={calculateTotalPrice()}
              step={step}
              reserveAmount={5000}
              deviceCategory={deviceCategory}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToyotaEnhancedDesktopCarBuilder;
