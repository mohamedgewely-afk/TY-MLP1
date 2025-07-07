
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import StepContent from "./StepContent";
import BuilderProgress from "./BuilderProgress";
import ChoicesSummary from "./ChoicesSummary";

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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative h-full w-full bg-background overflow-hidden"
    >
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-6 border-b border-border bg-card/50 backdrop-blur-xl"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={onClose}
            className="p-3 rounded-xl bg-secondary/50 backdrop-blur-xl border border-border hover:bg-secondary/70 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-6 w-6 text-foreground" />
          </motion.button>
          
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Build Your {vehicle.name}
            </h1>
            <p className="text-sm text-muted-foreground">Step {step} of 7</p>
          </div>
        </div>
      </motion.div>

      <div className="flex h-full">
        {/* Left Panel */}
        <div className="w-1/2 p-8 overflow-y-auto">
          <BuilderProgress currentStep={step} />
          
          <AnimatePresence mode="wait">
            <StepContent
              key={step}
              step={step}
              config={config}
              setConfig={setConfig}
              calculateTotalPrice={calculateTotalPrice}
              handlePayment={handlePayment}
              goNext={goNext}
            />
          </AnimatePresence>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 bg-muted/30 p-8">
          <ChoicesSummary 
            config={config}
            totalPrice={calculateTotalPrice()}
            vehicle={vehicle}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopCarBuilder;
