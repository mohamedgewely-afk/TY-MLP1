
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Sparkles } from "lucide-react";
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative h-full w-full overflow-hidden flex flex-col"
    >
      {/* Enhanced Header with Glass Effect */}
      <motion.div 
        className="relative z-10 flex items-center justify-between p-4 bg-gradient-to-r from-card/95 via-card/98 to-card/95 backdrop-blur-xl border-b border-primary/20 flex-shrink-0 shadow-lg"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        {/* Elegant glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5" />
        
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className="relative p-3 rounded-xl bg-secondary/80 backdrop-blur-md border border-border/50 hover:bg-secondary/90 transition-all duration-300 min-h-[48px] min-w-[48px] shadow-md hover:shadow-lg"
          whileHover={{ scale: 1.05, rotateZ: step > 1 ? 0 : 90 }}
          whileTap={{ scale: 0.95 }}
        >
          {step > 1 ? (
            <ArrowLeft className="h-5 w-5 text-foreground" />
          ) : (
            <X className="h-5 w-5 text-foreground" />
          )}
        </motion.button>

        <motion.div 
          className="text-center relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.h1 
            className="text-xl font-black text-foreground flex items-center gap-2"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="h-5 w-5 text-primary" />
            Build Your {vehicle.name.split(' ').pop()}
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mt-1"
          />
        </motion.div>

        <div className="w-12" />
      </motion.div>

      {/* Stylish Vehicle Image with 3D Effects */}
      <motion.div 
        className="relative w-full h-72 bg-gradient-to-br from-muted/30 via-card/20 to-muted/40 overflow-hidden border-b border-primary/10 flex-shrink-0 shadow-inner"
        layoutId="vehicle-image"
        key={config.exteriorColor + config.grade + config.modelYear + config.engine}
      >
        {/* Animated background patterns */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10"
          animate={{ 
            background: [
              "linear-gradient(45deg, rgba(239,68,68,0.1), transparent, rgba(239,68,68,0.1))",
              "linear-gradient(135deg, rgba(239,68,68,0.1), transparent, rgba(239,68,68,0.1))",
              "linear-gradient(45deg, rgba(239,68,68,0.1), transparent, rgba(239,68,68,0.1))"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain scale-110 relative z-10 drop-shadow-2xl"
          initial={{ scale: 1.3, opacity: 0, rotateY: 15 }}
          animate={{ scale: 1.1, opacity: 1, rotateY: 0 }}
          transition={{ 
            duration: 1, 
            ease: [0.22, 1, 0.36, 1],
            delay: 0.4 
          }}
          style={{ 
            filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
            transformStyle: 'preserve-3d'
          }}
        />
        
        {/* Luxury gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
        
        {/* Elegant vehicle info overlay */}
        <motion.div 
          className="absolute bottom-4 left-4 right-4 text-foreground"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-card/90 via-card/95 to-card/90 backdrop-blur-lg rounded-2xl p-4 border border-primary/20 shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-foreground">{config.modelYear} {vehicle.name}</h3>
                <p className="text-primary text-sm font-bold">{config.grade} • {config.engine}</p>
                <p className="text-muted-foreground text-xs">{config.exteriorColor} Exterior</p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-right"
              >
                <div className="text-2xl font-black text-primary">
                  AED {calculateTotalPrice().toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Price</div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Progress Bar */}
      <motion.div 
        className="flex-shrink-0 bg-gradient-to-r from-muted/50 to-muted/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Stylish Choice Collector */}
      <motion.div 
        className="px-4 py-3 flex-shrink-0 bg-gradient-to-r from-card/50 to-card/30 border-b border-primary/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Step Content with Enhanced Transitions */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ 
              duration: 0.6, 
              ease: [0.22, 1, 0.36, 1]
            }}
            className="h-full"
          >
            <MobileStepContent
              step={step}
              config={config}
              setConfig={setConfig}
              vehicle={vehicle}
              calculateTotalPrice={calculateTotalPrice}
              handlePayment={handlePayment}
              goNext={goNext}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Premium Price Summary */}
      <motion.div 
        className="flex-shrink-0 relative z-20 bg-gradient-to-t from-card via-card/98 to-card/95 backdrop-blur-xl border-t border-primary/20 shadow-2xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <MobileSummary 
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
          reserveAmount={2000}
        />
      </motion.div>
    </motion.div>
  );
};

export default MobileCarBuilder;
