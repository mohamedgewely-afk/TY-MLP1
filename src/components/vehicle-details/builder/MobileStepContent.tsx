
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { ArrowRight } from "lucide-react";
import ModelYearEngineStep from "./steps/ModelYearEngineStep";
import GradeCarouselStep from "./steps/GradeCarouselStep";
import ColorsAccessoriesStep from "./steps/ColorsAccessoriesStep";
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
        return <ModelYearEngineStep config={config} setConfig={setConfig} />;
      case 2:
        return <GradeCarouselStep config={config} setConfig={setConfig} />;
      case 3:
        return <ColorsAccessoriesStep config={config} setConfig={setConfig} />;
      case 4:
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
        transition={{ duration: 0.4, type: "spring", stiffness: 120, damping: 20 }}
        className="flex-1 overflow-hidden"
      >
        <div className="h-full px-3 py-2 overflow-y-auto">
          {renderContent()}
        </div>
      </motion.div>
      
      {/* Compact Continue Button */}
      {step < 4 && (
        <motion.div 
          className="sticky bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background via-background/98 to-background/90 backdrop-blur-xl z-30 border-t border-border/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Button 
            onClick={goNext}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-2 rounded-lg font-bold text-sm shadow-lg transition-all duration-300 relative overflow-hidden min-h-[40px]"
            size="sm"
          >
            <span className="relative z-10 flex items-center justify-center">
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MobileStepContent;
