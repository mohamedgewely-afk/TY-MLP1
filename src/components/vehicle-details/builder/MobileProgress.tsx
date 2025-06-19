
import React from "react";
import { motion } from "framer-motion";

interface MobileProgressProps {
  currentStep: number;
}

const MobileProgress: React.FC<MobileProgressProps> = ({ currentStep }) => {
  const steps = ["Year", "Grade", "Exterior", "Interior", "Accessories", "Review"];

  return (
    <div className="px-4 py-3 relative z-10">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold relative overflow-hidden ${
                currentStep > index + 1
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white"
                  : currentStep === index + 1
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  : "bg-white/10 text-white/50 border border-white/20"
              }`}
              animate={currentStep === index + 1 ? {
                boxShadow: [
                  "0 0 0px rgba(168, 85, 247, 0)",
                  "0 0 20px rgba(168, 85, 247, 0.5)",
                  "0 0 0px rgba(168, 85, 247, 0)"
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStep > index + 1 ? "✓" : index + 1}
              
              {currentStep === index + 1 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            
            <span className={`text-xs mt-1 ${
              currentStep >= index + 1 ? "text-white" : "text-white/50"
            }`}>
              {step}
            </span>
            
            {index < steps.length - 1 && (
              <motion.div
                className={`absolute top-4 w-8 h-0.5 ${
                  currentStep > index + 1 
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500" 
                    : "bg-white/20"
                }`}
                style={{ left: `${((index + 1) / steps.length) * 100 + 8}%` }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentStep > index + 1 ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileProgress;
