
import React from "react";
import { motion } from "framer-motion";

interface MobileProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const MobileProgress: React.FC<MobileProgressProps> = ({ 
  currentStep, 
  totalSteps = 7 
}) => {
  return (
    <div className="px-6 py-4 bg-card/50 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between mt-3">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index + 1 <= currentStep
                ? "bg-primary shadow-lg"
                : "bg-muted-foreground/30"
            }`}
            whileHover={{ scale: 1.2 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileProgress;
