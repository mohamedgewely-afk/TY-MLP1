
import React from "react";
import { motion } from "framer-motion";

interface MobileProgressProps {
  currentStep: number;
}

const MobileProgress: React.FC<MobileProgressProps> = ({ currentStep }) => {
  const steps = ["Year", "Grade", "Exterior", "Interior", "Accessories", "Review"];

  return (
    <div className="px-4 py-4 relative z-10">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex flex-col items-center relative">
            <motion.div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold relative overflow-hidden border-2 ${
                currentStep > index + 1
                  ? "bg-toyota-red border-toyota-red text-toyota-white shadow-lg shadow-toyota-red/30"
                  : currentStep === index + 1
                  ? "bg-gradient-to-r from-toyota-red to-toyota-darkred border-toyota-red text-toyota-white"
                  : "bg-toyota-gray/20 text-toyota-white/60 border-toyota-gray/40"
              }`}
              animate={currentStep === index + 1 ? {
                boxShadow: [
                  "0 0 0px rgba(229, 0, 0, 0)",
                  "0 0 25px rgba(229, 0, 0, 0.6)",
                  "0 0 0px rgba(229, 0, 0, 0)"
                ],
                scale: [1, 1.05, 1]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.1 }}
            >
              {currentStep > index + 1 ? (
                <motion.span
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="text-lg"
                >
                  ✓
                </motion.span>
              ) : (
                index + 1
              )}
              
              {currentStep === index + 1 && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-toyota-red/30 to-toyota-darkred/30 rounded-xl"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              )}
            </motion.div>
            
            <motion.span 
              className={`text-xs mt-2 font-medium ${
                currentStep >= index + 1 ? "text-toyota-white" : "text-toyota-white/50"
              }`}
              animate={currentStep === index + 1 ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {step}
            </motion.span>
            
            {index < steps.length - 1 && (
              <motion.div
                className={`absolute top-5 left-12 w-8 h-0.5 ${
                  currentStep > index + 1 
                    ? "bg-toyota-red shadow-lg shadow-toyota-red/30" 
                    : "bg-toyota-gray/30"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: currentStep > index + 1 ? 1 : 0.3,
                  opacity: currentStep > index + 1 ? 1 : 0.5
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Overall progress bar */}
      <motion.div 
        className="mt-4 h-1 bg-toyota-gray/20 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-toyota-red to-toyota-darkred shadow-lg shadow-toyota-red/50"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / 6) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </motion.div>
    </div>
  );
};

export default MobileProgress;
