
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
      {/* Header with Back Button */}
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

      {/* Enhanced Vehicle Image - Larger and Full Visibility */}
      <motion.div 
        className="relative w-full h-96 bg-gradient-to-br from-muted/30 to-card/30 overflow-hidden border-b border-border flex-shrink-0"
        layoutId="vehicle-image"
        key={config.exteriorColor + config.grade + config.modelYear + config.engine}
      >
        {/* Skeleton Loading */}
        <div className="absolute inset-0 bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 animate-pulse" />
        
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain scale-110 relative z-10"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onLoad={(e) => {
            const skeleton = e.currentTarget.previousElementSibling as HTMLElement;
            if (skeleton) {
              skeleton.style.display = 'none';
            }
          }}
        />
        
        {/* Reduced opacity overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
        
        {/* Vehicle Info Overlay - Compact and better positioned */}
        <motion.div 
          className="absolute bottom-6 left-4 right-4 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="bg-card/70 backdrop-blur-lg rounded-xl p-3 border border-border shadow-lg">
            <h3 className="text-base font-bold">{config.modelYear} {vehicle.name}</h3>
            <p className="text-primary text-xs font-medium">{config.grade} • {config.engine} • {config.exteriorColor}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Choice Collector - Enhanced spacing */}
        <div className="px-6 py-6 flex-shrink-0 space-y-6">
          <ChoiceCollector config={config} step={step} />
          
          {/* Enhanced Collapsible Specs */}
          {showSpecs && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-primary/8 to-primary/12 rounded-2xl p-5 border border-primary/30 shadow-lg"
            >
              <CollapsibleSpecs config={config} />
            </motion.div>
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
      </div>

      {/* Price Summary */}
      <div className="flex-shrink-0 relative z-20">
        <MobileSummary 
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
          reserveAmount={2000}
        />
      </div>
    </motion.div>
  );
};

export default MobileCarBuilder;
