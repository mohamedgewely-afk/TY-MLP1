
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Car } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface ToyotaEnhancedMobileCarBuilderProps {
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

// Simplified, performance-optimized variants
const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, staggerChildren: 0.05 }
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 }
};

const ToyotaEnhancedMobileCarBuilder: React.FC<ToyotaEnhancedMobileCarBuilderProps> = ({
  vehicle,
  step,
  config,
  setConfig,
  calculateTotalPrice,
  handlePayment,
  goBack,
  goNext,
  onClose,
  deviceCategory
}) => {
  const { containerPadding, textSize, mobilePadding } = useResponsiveSize();

  const getCurrentVehicleImage = () => {
    const exteriorColors = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-background overflow-hidden flex flex-col"
    >
      {/* Toyota Header */}
      <motion.header 
        variants={itemVariants}
        className={`flex items-center justify-between toyota-glass-light toyota-spacing-md border-b border-toyota-red/10 ${containerPadding} safe-area-inset-top`}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className="toyota-spacing-sm toyota-border-radius toyota-glass flex items-center justify-center touch-target toyota-hover-lift"
          whileTap={{ scale: 0.98 }}
        >
          {step > 1 ? (
            <ArrowLeft className="h-5 w-5 text-toyota-red" />
          ) : (
            <X className="h-5 w-5 text-toyota-red" />
          )}
        </motion.button>

        <div className="text-center flex-1 mx-4">
          <h1 className={`${textSize.base} font-semibold text-foreground`}>
            Build Your {vehicle.name}
          </h1>
          <p className="text-xs text-toyota-red font-medium">
            Step {step} of 7
          </p>
        </div>

        <div className="w-11" />
      </motion.header>

      {/* Vehicle Image Section */}
      <motion.section 
        variants={itemVariants}
        className="relative h-48 bg-gradient-to-br from-muted/20 to-background overflow-hidden border-b border-border/10"
        key={config.exteriorColor}
      >
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-4">
          <div className="toyota-glass-light toyota-border-radius toyota-spacing-sm">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-toyota-red" />
              <div>
                <h3 className="text-sm font-semibold">{config.modelYear} {vehicle.name}</h3>
                <p className="text-xs text-toyota-red">{config.grade} • {config.engine}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Progress */}
      <motion.div variants={itemVariants} className="toyota-spacing-sm border-b border-border/5">
        <MobileProgress currentStep={step} totalSteps={7} />
      </motion.div>

      {/* Choice Collector */}
      <motion.div variants={itemVariants} className={`${containerPadding} toyota-spacing-sm border-b border-border/5`}>
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Step Content */}
      <motion.div variants={itemVariants} className="flex-1 overflow-hidden">
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

      {/* Summary */}
      <motion.footer 
        variants={itemVariants}
        className="toyota-glass-light border-t border-toyota-red/10 safe-area-inset-bottom"
      >
        <MobileSummary 
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
          reserveAmount={5000}
          deviceCategory={deviceCategory}
        />
      </motion.footer>
    </motion.div>
  );
};

export default ToyotaEnhancedMobileCarBuilder;
