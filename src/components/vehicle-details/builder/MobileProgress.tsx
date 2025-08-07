
import React from "react";
import { motion } from "framer-motion";

interface MobileProgressProps {
  currentStep: number;
  totalSteps: number;
}

const MobileProgress: React.FC<MobileProgressProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Configuration Progress</span>
        <span>{currentStep} of {totalSteps}</span>
      </div>
      
      <div className="w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1]
          }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
          <div
            key={stepNum}
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium border-2 transition-all duration-300 ${
              stepNum === currentStep
                ? 'bg-primary text-primary-foreground border-primary shadow-md scale-110'
                : stepNum < currentStep
                ? 'bg-primary/20 text-primary border-primary/30'
                : 'bg-muted text-muted-foreground border-muted-foreground/20'
            }`}
          >
            {stepNum}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileProgress;
