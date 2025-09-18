import React from "react";
import { motion } from "framer-motion";
import { Check, Car, Palette, Settings, CreditCard, Star, Zap } from "lucide-react";

interface BuilderProgressProps {
  currentStep: number;
  totalSteps: number;
}

const BuilderProgress: React.FC<BuilderProgressProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: "Year", icon: <Star className="h-5 w-5" /> },
    { number: 2, title: "Grade", icon: <Zap className="h-5 w-5" /> },
    { number: 3, title: "Exterior", icon: <Palette className="h-5 w-5" /> },
    { number: 4, title: "Interior", icon: <Car className="h-5 w-5" /> },
    { number: 5, title: "Accessories", icon: <Settings className="h-5 w-5" /> },
    { number: 6, title: "Review", icon: <Check className="h-5 w-5" /> },
    { number: 7, title: "Order", icon: <CreditCard className="h-5 w-5" /> },
  ];

  return (
    <div className="flex justify-center items-center mb-6 -mt-1 px-6 relative z-10">
      <div className="flex items-center space-x-5 bg-white/10 backdrop-blur-2xl rounded-full px-8 py-5 border border-white/20 shadow-lg">
        {steps.slice(0, totalSteps).map((stepData, index) => (
          <React.Fragment key={stepData.number}>
            <motion.div
              className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                currentStep >= stepData.number
                  ? "bg-black text-white shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                  : "bg-white/10 text-neutral-400 border border-white/20"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              animate={
                currentStep === stepData.number
                  ? {
                      boxShadow: [
                        "0 0 0px rgba(0,0,0,0)",
                        "0 0 20px rgba(0,0,0,0.5)",
                        "0 0 0px rgba(0,0,0,0)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStep > stepData.number ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20 }}
                >
                  <Check className="h-6 w-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  animate={currentStep === stepData.number ? { rotate: [0, 360] } : {}}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  {stepData.icon}
                </motion.div>
              )}

              <motion.div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold tracking-wide whitespace-nowrap text-neutral-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentStep >= stepData.number ? 1 : 0.4 }}
              >
                {stepData.title}
              </motion.div>
            </motion.div>

            {index < steps.slice(0, totalSteps).length - 1 && (
              <motion.div
                className={`w-10 h-0.5 rounded-full transition-all duration-500 ${
                  currentStep > stepData.number ? "bg-black" : "bg-white/20"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: currentStep > stepData.number ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BuilderProgress;
