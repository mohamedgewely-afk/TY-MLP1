
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";

interface BuilderConfig {
  modelYear: string;
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
      { name: "Pearl White", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80" },
      { name: "Midnight Black", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80" },
      { name: "Silver Metallic", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" },
      { name: "Ruby Red", image: "https://images.unsplash.com/photo-1494976688153-c785a34b9f61?auto=format&fit=crop&w=800&q=80" },
      { name: "Ocean Blue", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" },
      { name: "Storm Gray", image: "https://images.unsplash.com/photo-1570409073740-2f53eca0f9dd?auto=format&fit=crop&w=800&q=80" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full w-full bg-background overflow-hidden"
    >
      {/* Header */}
      <motion.div 
        className="relative z-10 flex items-center justify-between p-4 bg-card/95 backdrop-blur-xl border-b border-border"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className="p-3 rounded-xl bg-secondary/50 backdrop-blur-xl border border-border hover:bg-secondary/70 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Build Your {vehicle.name}
          </motion.h1>
          <p className="text-sm text-primary font-medium">Step {step} of 6</p>
        </div>

        <div className="w-12" />
      </motion.div>

      {/* Dynamic Vehicle Image */}
      <motion.div 
        className="relative w-full h-48 bg-card/50 overflow-hidden border-b border-border"
        layoutId="vehicle-image"
        key={config.exteriorColor + config.grade + config.modelYear}
      >
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        <motion.div 
          className="absolute bottom-4 left-4 text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold">{config.modelYear} {vehicle.name}</h3>
          <p className="text-primary text-sm font-medium">{config.grade} • {config.exteriorColor}</p>
        </motion.div>
      </motion.div>

      {/* Progress */}
      <MobileProgress currentStep={step} />

      {/* Content Area */}
      <div className="flex-1 relative z-10 pb-20 overflow-y-auto">
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
      <MobileSummary 
        config={config}
        totalPrice={calculateTotalPrice()}
        step={step}
      />
    </motion.div>
  );
};

export default MobileCarBuilder;
