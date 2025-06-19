
import React from "react";
import { motion } from "framer-motion";

interface MobileProgressProps {
  currentStep: number;
}

const steps = [
  "Model Year",
  "Grade",
  "Exterior",
  "Interior", 
  "Accessories",
  "Review"
];

const MobileProgress: React.FC<MobileProgressProps> = ({ currentStep }) => {
  return (
    <motion.div 
      className="px-4 py-3 bg-card/50 backdrop-blur-xl border-b border-border"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, index) => (
          <motion.div
            key={step}
            className={`text-xs font-medium transition-colors duration-300 ${
              index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'
            }`}
            animate={index + 1 === currentStep ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {step}
          </motion.div>
        ))}
      </div>
      
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        
        {/* Progress dots */}
        {steps.map((_, index) => (
          <motion.div
            key={index}
            className={`absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full border-2 ${
              index + 1 <= currentStep 
                ? 'bg-primary border-primary' 
                : 'bg-background border-border'
            }`}
            style={{ left: `${(index / (steps.length - 1)) * 100}%`, marginLeft: '-6px' }}
            animate={index + 1 === currentStep ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default MobileProgress;
