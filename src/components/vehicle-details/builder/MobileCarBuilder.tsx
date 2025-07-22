
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      exit={{ opacity: 0, scale: 0.95, rotateY: 15 }}
      transition={{ 
        duration: 0.6, 
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.1
      }}
      className="relative h-full w-full bg-gradient-to-br from-background/95 via-background to-background/95 backdrop-blur-xl overflow-hidden flex flex-col"
      style={{
        backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
      }}
    >
      {/* Header with Back Button */}
      <motion.div 
        className="relative z-10 flex items-center justify-between p-3 bg-white/10 backdrop-blur-2xl border-b border-white/20 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className="p-2 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 transition-all duration-200 min-h-[44px] min-w-[44px]"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {step > 1 ? (
            <ArrowLeft className="h-5 w-5 text-foreground" />
          ) : (
            <X className="h-5 w-5 text-foreground" />
          )}
        </motion.button>

        <div className="text-center">
          <motion.h1 
            className="text-lg font-bold text-foreground"
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Build Your {vehicle.name}
          </motion.h1>
        </div>

        <div className="w-10" />
      </motion.div>

      {/* Vehicle Image - Larger */}
      <motion.div 
        className="relative w-full h-64 bg-gradient-to-br from-black/5 via-white/5 to-black/5 overflow-hidden border-b border-white/20 flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.02) 50%, rgba(255,255,255,0.05) 100%)',
        }}
        layoutId="vehicle-image"
        key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 animate-pulse" />
        
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain scale-110 relative z-10"
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onLoad={(e) => {
            const skeleton = (e.currentTarget.previousElementSibling as HTMLElement);
            if (skeleton) {
              skeleton.style.display = 'none';
            }
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background/10 via-transparent to-transparent" />
        
        <motion.div 
          className="absolute bottom-2 left-2 right-2 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div 
            className="bg-white/10 backdrop-blur-2xl rounded-xl p-3 border border-white/20 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
            }}
          >
            <h3 className="text-sm font-bold">{config.modelYear} {vehicle.name}</h3>
            <p className="text-primary text-xs font-medium">{config.grade} • {config.engine}</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Minimal Progress Bar */}
      <div className="flex-shrink-0">
        <MobileProgress currentStep={step} totalSteps={4} />
      </div>

      {/* Choice Collector */}
      <div className="px-3 py-2 flex-shrink-0">
        <ChoiceCollector config={config} step={step} />
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

      {/* Price Summary */}
      <motion.div 
        className="flex-shrink-0 relative z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div 
          className="bg-white/10 backdrop-blur-2xl border-t border-white/20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            boxShadow: '0 -8px 32px 0 rgba(31, 38, 135, 0.2)',
          }}
        >
          <MobileSummary 
            config={config}
            totalPrice={calculateTotalPrice()}
            step={step}
            reserveAmount={2000}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobileCarBuilder;
