
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative h-full w-full bg-gradient-to-br from-toyota-black via-toyota-gray to-toyota-black overflow-hidden"
    >
      {/* Toyota-themed animated background */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-toyota-red rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        
        {/* Toyota geometric patterns */}
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 border border-toyota-red/20 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute bottom-32 left-10 w-24 h-24 border border-toyota-red/15 rounded-lg"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Header with Toyota styling */}
      <motion.div 
        className="relative z-10 flex items-center justify-between p-4 bg-toyota-black/70 backdrop-blur-xl border-b border-toyota-red/20"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className="p-3 rounded-xl bg-toyota-gray/20 backdrop-blur-xl border border-toyota-red/30 hover:bg-toyota-red/20 transition-all duration-300"
          whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(229, 0, 0, 0.3)" }}
          whileTap={{ scale: 0.9 }}
        >
          {step > 1 ? (
            <ArrowLeft className="h-6 w-6 text-toyota-white" />
          ) : (
            <X className="h-6 w-6 text-toyota-white" />
          )}
        </motion.button>

        <div className="text-center">
          <motion.h1 
            className="text-xl font-bold text-toyota-white"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Build Your {vehicle.name}
          </motion.h1>
          <p className="text-sm text-toyota-red font-medium">Step {step} of 6</p>
        </div>

        <div className="w-12" />
      </motion.div>

      {/* Progress */}
      <MobileProgress currentStep={step} />

      {/* Content Area */}
      <div className="flex-1 relative z-10 pb-20">
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
