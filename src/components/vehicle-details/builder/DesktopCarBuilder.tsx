
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Sparkles, Zap } from "lucide-react";
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
  const reserveAmount = 5000;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative h-full w-full overflow-hidden flex"
    >
      {/* Left Side - Cinematic Car Showcase (55% width) */}
      <motion.div 
        className="w-[55%] h-full relative bg-gradient-to-br from-muted/40 via-card/30 to-muted/50 overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
      >
        {/* Premium header overlay */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-8 bg-gradient-to-b from-background/90 via-background/70 to-transparent backdrop-blur-xl"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          {/* Luxury accent border */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <motion.button
            onClick={step > 1 ? goBack : onClose}
            className="p-4 rounded-2xl bg-secondary/80 backdrop-blur-lg border border-border/50 hover:bg-secondary/90 transition-all duration-300 shadow-xl hover:shadow-2xl group"
            whileHover={{ scale: 1.05, rotateZ: step > 1 ? 0 : 45 }}
            whileTap={{ scale: 0.95 }}
          >
            {step > 1 ? (
              <ArrowLeft className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
            ) : (
              <X className="h-6 w-6 text-foreground group-hover:text-primary transition-colors" />
            )}
          </motion.button>

          <motion.div 
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.h1 
              className="text-3xl font-black text-foreground flex items-center gap-3 mb-2"
              animate={{ 
                textShadow: [
                  "0 0 0px rgba(239,68,68,0.5)", 
                  "0 0 20px rgba(239,68,68,0.3)", 
                  "0 0 0px rgba(239,68,68,0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="h-7 w-7 text-primary" />
              Build Your {vehicle.name.split(' ').pop()}
              <Zap className="h-7 w-7 text-primary" />
            </motion.h1>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.7 }}
              className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-full"
            />
            <p className="text-primary text-lg font-bold mt-2">Step {step} of 4</p>
          </motion.div>

          <div className="w-16" />
        </motion.div>

        {/* Cinematic car showcase */}
        <motion.div 
          className="relative w-full h-full overflow-hidden"
          layoutId="vehicle-image"
          key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        >
          {/* Dynamic background patterns */}
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              background: [
                "radial-gradient(circle at 30% 40%, rgba(239,68,68,0.15), transparent 50%)",
                "radial-gradient(circle at 70% 60%, rgba(239,68,68,0.15), transparent 50%)",
                "radial-gradient(circle at 30% 40%, rgba(239,68,68,0.15), transparent 50%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="w-full h-full object-cover scale-110 relative z-10"
            initial={{ scale: 1.3, opacity: 0, rotateY: 20 }}
            animate={{ scale: 1.1, opacity: 1, rotateY: 0 }}
            transition={{ 
              duration: 1.2, 
              ease: [0.22, 1, 0.36, 1],
              delay: 0.6
            }}
            style={{ 
              filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.4))',
              transformStyle: 'preserve-3d'
            }}
          />
          
          {/* Elegant overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
          
          {/* Premium vehicle info overlay */}
          <motion.div 
            className="absolute bottom-12 left-12 right-12 text-foreground"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-card/95 via-card/98 to-card/95 backdrop-blur-2xl rounded-3xl p-8 border border-primary/20 shadow-2xl max-w-lg"
              whileHover={{ scale: 1.02, y: -5 }}
              transition={{ duration: 0.4 }}
            >
              <div className="space-y-4">
                <div>
                  <h3 className="text-3xl font-black text-foreground mb-2">{config.modelYear} {vehicle.name}</h3>
                  <p className="text-primary text-xl font-bold">{config.grade} • {config.engine}</p>
                  <p className="text-muted-foreground text-lg">{config.exteriorColor} Exterior</p>
                </div>
                
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="border-t border-primary/20 pt-4"
                >
                  <div className="text-4xl font-black text-primary mb-1">
                    AED {calculateTotalPrice().toLocaleString()}
                  </div>
                  <div className="text-muted-foreground text-sm">Total Configuration Price</div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right Side - Elegant Configuration Panel (45% width) */}
      <motion.div 
        className="w-[45%] h-full flex flex-col bg-gradient-to-br from-background via-card/50 to-background border-l border-primary/20 shadow-2xl"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
      >
        {/* Luxury progress section */}
        <motion.div 
          className="px-8 py-6 border-b border-primary/10 bg-gradient-to-r from-card/30 to-card/50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <MobileProgress currentStep={step} totalSteps={4} />
        </motion.div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Choice Collector & Specs */}
          <motion.div 
            className="px-8 py-6 border-b border-primary/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <ChoiceCollector config={config} step={step} />
            {showSpecs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.5 }}
              >
                <CollapsibleSpecs config={config} />
              </motion.div>
            )}
          </motion.div>

          {/* Step Content with Enhanced Animations */}
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
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

          {/* Premium Summary */}
          <motion.div 
            className="border-t border-primary/20 bg-gradient-to-r from-card/50 to-card/30"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
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
