
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
}

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

  const showSpecs = step > 2 && (config.modelYear && config.grade);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative h-full w-full bg-background overflow-hidden flex flex-col"
    >
      {/* Header with Back Button */}
      <motion.div 
        className="relative z-10 flex items-center justify-between p-4 bg-card/95 backdrop-blur-xl border-b border-border flex-shrink-0"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className="p-3 rounded-xl bg-secondary/50 backdrop-blur-xl border border-border hover:bg-secondary/70 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
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
            className="text-xl font-bold text-foreground"
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Build Your {vehicle.name}
          </motion.h1>
          <p className="text-sm text-primary font-medium">Step {step} of 4</p>
        </div>

        <div className="w-12" />
      </motion.div>

      {/* Enhanced Vehicle Image - Larger */}
      <motion.div 
        className="relative w-full h-64 bg-gradient-to-br from-muted/50 to-card/50 overflow-hidden border-b border-border flex-shrink-0"
        layoutId="vehicle-image"
        key={config.exteriorColor + config.grade + config.modelYear + config.engine}
      >
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-cover scale-110"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        
        {/* Vehicle Info Overlay - Positioned better */}
        <motion.div 
          className="absolute bottom-3 left-3 right-3 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-card/90 backdrop-blur-lg rounded-lg p-3 border border-border">
            <h3 className="text-lg font-bold">{config.modelYear} {vehicle.name}</h3>
            <p className="text-primary text-sm font-medium">{config.grade} • {config.engine} • {config.exteriorColor}</p>
            {/* Reserve Amount Highlight */}
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Reserve Amount:</span>
              <span className="text-lg font-black text-primary">د.إ 2,000</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress - Compact */}
      <div className="px-4 py-2 flex-shrink-0">
        <MobileProgress currentStep={step} totalSteps={4} />
      </div>

      {/* Content Area - Fixed height, no scroll */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Choice Collector & Specs - More space */}
        <div className="px-4 pb-3 flex-shrink-0">
          <ChoiceCollector config={config} step={step} />
          
          {/* Expanded Collapsible Specs */}
          {showSpecs && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3"
            >
              <CollapsibleSpecs config={config} expanded={true} />
            </motion.div>
          )}
        </div>

        {/* Step Content - Takes remaining space */}
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
      </div>

      {/* Price Summary - Fixed at bottom */}
      <div className="flex-shrink-0 relative z-20">
        <MobileSummary 
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
        />
      </div>
    </motion.div>
  );
};

export default MobileCarBuilder;
