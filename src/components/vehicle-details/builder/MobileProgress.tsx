
import React from "react";
import { motion } from "framer-motion";

interface MobileProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const MobileProgress: React.FC<MobileProgressProps> = ({ 
  currentStep, 
  totalSteps = 4 
}) => {
  return (
    <div className="px-2 py-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-bold text-muted-foreground">Configuration Progress</span>
        <span className="text-sm font-black text-primary">{currentStep}/{totalSteps}</span>
      </div>
      
      <div className="relative w-full bg-muted/40 rounded-full h-2 overflow-hidden shadow-inner">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20" />
        
        {/* Progress bar with Toyota styling */}
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary rounded-full relative overflow-hidden shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "200%"] }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              repeatDelay: 1 
            }}
          />
        </motion.div>
        
        {/* Step indicators */}
        <div className="absolute inset-0 flex items-center justify-between px-1">
          {Array.from({ length: totalSteps }, (_, i) => (
            <motion.div
              key={i}
              className={`w-1.5 h-1.5 rounded-full border ${
                i < currentStep 
                  ? 'bg-white border-white shadow-lg' 
                  : 'bg-muted border-muted-foreground/30'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            />
          ))}
        </div>
      </div>
      
      {/* Step labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Model</span>
        <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Grade</span>
        <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>Colors</span>
        <span className={currentStep >= 4 ? 'text-primary font-medium' : ''}>Review</span>
      </div>
    </div>
  );
};

export default MobileProgress;
