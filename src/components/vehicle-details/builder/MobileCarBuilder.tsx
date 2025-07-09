
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

  const showSpecs = step > 1 && (config.modelYear && config.grade);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative h-full w-full bg-background overflow-hidden flex flex-col"
    >
      {/* Header with Back Button - Simplified */}
      <motion.div 
        className="relative z-10 flex items-center justify-between p-4 bg-card/95 backdrop-blur-xl border-b border-border flex-shrink-0"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className="p-3 rounded-xl bg-secondary/50 backdrop-blur-xl border border-border hover:bg-secondary/70 transition-all duration-200 min-h-[44px] min-w-[44px]"
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
        </div>

        <div className="w-12" />
      </motion.div>

      {/* Enhanced Vehicle Image - MUCH BIGGER AND FULL VISIBILITY */}
      <motion.div 
        className="relative w-full h-80 bg-gradient-to-br from-muted/50 to-card/50 overflow-hidden border-b border-border flex-shrink-0"
        layoutId="vehicle-image"
        key={config.exteriorColor + config.grade + config.modelYear + config.engine}
      >
        {/* Loading skeleton */}
        <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-pulse" />
        
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain scale-125 relative z-10"
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1.25, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onLoad={(e) => {
            // Hide loading skeleton
            const skeleton = e.currentTarget.previousElementSibling;
            if (skeleton) skeleton.style.display = 'none';
          }}
        />
        
        {/* Minimal gradient overlay - reduced opacity */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent" />
        
        {/* Vehicle Info Overlay - More compact and better positioned */}
        <motion.div 
          className="absolute bottom-4 left-4 right-4 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <div className="bg-card/80 backdrop-blur-lg rounded-xl p-4 border border-border shadow-lg">
            <h3 className="text-lg font-bold">{config.modelYear} {vehicle.name}</h3>
            <p className="text-primary text-sm font-medium">{config.grade} • {config.engine} • {config.exteriorColor}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Content Area - Enhanced spacing */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Choice Collector - More spacious with better padding */}
        <div className="px-6 py-4 flex-shrink-0 space-y-4">
          <ChoiceCollector config={config} step={step} />
          
          {/* Collapsible Specs - Enhanced visibility and prominence */}
          {showSpecs && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl p-4 border border-primary/20"
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

      {/* Price Summary - HIGHLIGHT RESERVE AMOUNT */}
      <div className="flex-shrink-0 relative z-20">
        <MobileSummary 
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
          reserveAmount={2000} // HIGHLIGHTED RESERVE AMOUNT
        />
      </div>
    </motion.div>
  );
};

export default MobileCarBuilder;
