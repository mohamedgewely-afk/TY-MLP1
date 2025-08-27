
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
        className={`absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full transition-all duration-300 ${
          currentStep === 1 
            ? 'opacity-30 cursor-not-allowed bg-white/10' 
            : 'hover:bg-white/20 bg-white/10 hover:shadow-2xl backdrop-blur-xl border border-white/20'
        }`}
        whileHover={currentStep > 1 ? { scale: 1.1, x: -5 } : {}}
        whileTap={currentStep > 1 ? { scale: 0.9 } : {}}
      >
        <ChevronLeft className="h-8 w-8 text-white" />
      </motion.button>

      <motion.button
        onClick={() => currentStep < totalSteps && onNextStep()}
        disabled={currentStep === totalSteps}
        className={`absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full transition-all duration-300 ${
          currentStep === totalSteps 
            ? 'opacity-30 cursor-not-allowed bg-white/10' 
            : 'hover:bg-white/20 bg-white/10 hover:shadow-2xl backdrop-blur-xl border border-white/20'
        }`}
        whileHover={currentStep < totalSteps ? { scale: 1.1, x: 5 } : {}}
        whileTap={currentStep < totalSteps ? { scale: 0.9 } : {}}
      >
        <ChevronRight className="h-8 w-8 text-white" />
      </motion.button>
    </>
  );
};

export default BuilderNavigation;
