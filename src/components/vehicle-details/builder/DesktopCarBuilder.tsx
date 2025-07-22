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

  const reserveAmount = 5000; // Standard reservation amount

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.95, 
        rotateY: -10,
        filter: "blur(10px)"
      }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        rotateY: 0,
        filter: "blur(0px)"
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.98, 
        rotateY: 10,
        filter: "blur(5px)"
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.23, 1, 0.32, 1],
        staggerChildren: 0.1
      }}
      className="relative h-full w-full bg-gradient-to-br from-background/95 via-background to-background/95 backdrop-blur-xl overflow-hidden flex"
      style={{
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
      }}
    >
      {/* Left Side - Interactive Car Image (50% width) */}
      <motion.div 
        className="w-1/2 h-full relative bg-gradient-to-br from-black/5 via-white/5 to-black/5"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.02) 50%, rgba(255,255,255,0.05) 100%)',
        }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Header overlay on image */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 backdrop-blur-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.button
            onClick={step > 1 ? goBack : onClose}
            className="p-3 rounded-xl bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              boxShadow: '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
            }}
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
          
          {/* Vehicle Info Overlay - Bottom */}
          <motion.div 
            className="absolute bottom-8 left-8 right-8 text-foreground"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div 
              className="bg-white/10 backdrop-blur-2xl rounded-2xl p-6 border border-white/20 max-w-md"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.2)',
              }}
            >
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

      {/* Right Side - Configuration Panel (50% width) */}
      <motion.div 
        className="w-1/2 h-full flex flex-col bg-white/5 backdrop-blur-2xl border-l border-white/20"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Progress */}
        <motion.div 
          className="px-6 py-4 border-b border-white/20"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <MobileProgress currentStep={step} totalSteps={7} />
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Choice Collector & Specs */}
          <motion.div 
            className="px-6 py-4 border-b border-white/20"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <ChoiceCollector config={config} step={step} />
            {showSpecs && (
              <CollapsibleSpecs config={config} />
            )}
          </motion.div>

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

          {/* Summary */}
          <motion.div 
            className="border-t border-white/20"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <MobileSummary 
              config={config}
              totalPrice={calculateTotalPrice()}
              step={step}
              reserveAmount={reserveAmount}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DesktopCarBuilder;
