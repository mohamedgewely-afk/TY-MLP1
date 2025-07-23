
import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BuilderNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevStep: () => void;
  onNextStep: () => void;
}

const BuilderNavigation: React.FC<BuilderNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevStep,
  onNextStep
}) => {
  return (
    <>
      <motion.button
        onClick={() => currentStep > 1 && onPrevStep()}
        disabled={currentStep === 1}
        className={`absolute left-6 top-1/2 transform -translate-y-1/2 z-30 p-4 rounded-full transition-all duration-300 ${
          currentStep === 1 
            ? 'opacity-30 cursor-not-allowed bg-background/50 border border-border/30' 
            : 'hover:bg-background/80 bg-background/70 hover:shadow-xl backdrop-blur-sm border border-border/40 shadow-lg'
        }`}
        whileHover={currentStep > 1 ? { scale: 1.1, x: -5 } : {}}
        whileTap={currentStep > 1 ? { scale: 0.9 } : {}}
      >
        <ChevronLeft className="h-8 w-8 text-foreground" />
      </motion.button>

      <motion.button
        onClick={() => currentStep < totalSteps && onNextStep()}
        disabled={currentStep === totalSteps}
        className={`absolute right-6 top-1/2 transform -translate-y-1/2 z-30 p-4 rounded-full transition-all duration-300 ${
          currentStep === totalSteps 
            ? 'opacity-30 cursor-not-allowed bg-background/50 border border-border/30' 
            : 'hover:bg-background/80 bg-background/70 hover:shadow-xl backdrop-blur-sm border border-border/40 shadow-lg'
        }`}
        whileHover={currentStep < totalSteps ? { scale: 1.1, x: 5 } : {}}
        whileTap={currentStep < totalSteps ? { scale: 0.9 } : {}}
      >
        <ChevronRight className="h-8 w-8 text-foreground" />
      </motion.button>
    </>
  );
};

export default BuilderNavigation;
