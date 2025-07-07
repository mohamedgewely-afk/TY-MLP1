
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { ArrowRight } from "lucide-react";
import ModelYearStep from "./steps/ModelYearStep";
import EngineStep from "./steps/EngineStep";
import GradeStep from "./steps/GradeStep";
import ExteriorColorStep from "./steps/ExteriorColorStep";
import InteriorColorStep from "./steps/InteriorColorStep";
import AccessoriesStep from "./steps/AccessoriesStep";
import ReviewStep from "./steps/ReviewStep";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileStepContentProps {
  step: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  vehicle: VehicleModel;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goNext: () => void;
}

const MobileStepContent: React.FC<MobileStepContentProps> = ({
  step,
  config,
  setConfig,
  vehicle,
  calculateTotalPrice,
  handlePayment,
  goNext
}) => {
  const renderContent = () => {
    switch (step) {
      case 1:
        return <ModelYearStep config={config} setConfig={setConfig} />;
      case 2:
        return <EngineStep config={config} setConfig={setConfig} />;
      case 3:
        return <GradeStep config={config} setConfig={setConfig} />;
      case 4:
        return <ExteriorColorStep config={config} setConfig={setConfig} />;
      case 5:
        return <InteriorColorStep config={config} setConfig={setConfig} />;
      case 6:
        return <AccessoriesStep config={config} setConfig={setConfig} />;
      case 7:
        return <ReviewStep config={config} calculateTotalPrice={calculateTotalPrice} handlePayment={handlePayment} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 150, damping: 20 }}
        className="flex-1 overflow-hidden"
      >
        <div className="h-full p-4 overflow-y-auto">
          {renderContent()}
        </div>
      </motion.div>
      
      {/* Fixed Continue Button - Above price summary */}
      {step < 7 && (
        <motion.div 
          className="sticky bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/95 to-transparent backdrop-blur-xl z-30 border-t border-border/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            onClick={goNext}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200"
            size="lg"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MobileStepContent;
