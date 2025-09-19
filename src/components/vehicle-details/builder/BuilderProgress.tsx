
import React from "react";
import { motion } from "framer-motion";
import { Check, Car, Palette, Settings, CreditCard, Sparkles, Zap, Star } from "lucide-react";

interface BuilderProgressProps {
  currentStep: number;
  totalSteps: number;
}

const BuilderProgress: React.FC<BuilderProgressProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, title: "Year", icon: <Star className="h-5 w-5" />, gradient: "from-blue-500 to-cyan-400" },
    { number: 2, title: "Grade", icon: <Zap className="h-5 w-5" />, gradient: "from-purple-500 to-pink-400" },
    { number: 3, title: "Exterior", icon: <Palette className="h-5 w-5" />, gradient: "from-green-500 to-emerald-400" },
    { number: 4, title: "Interior", icon: <Car className="h-5 w-5" />, gradient: "from-orange-500 to-red-400" },
    { number: 5, title: "Accessories", icon: <Settings className="h-5 w-5" />, gradient: "from-indigo-500 to-purple-400" },
    { number: 6, title: "Review", icon: <Check className="h-5 w-5" />, gradient: "from-teal-500 to-green-400" },
    { number: 7, title: "Order", icon: <CreditCard className="h-5 w-5" />, gradient: "from-pink-500 to-rose-400" }
  ];

  return (
    <div className="flex justify-center items-center mb-6 px-4 flex-shrink-0 relative z-10">
      <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-xl rounded-full p-4 border border-white/20">
        {steps.slice(0, totalSteps).map((stepData, index) => (
          <React.Fragment key={stepData.number}>
            <motion.div 
              className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                currentStep >= stepData.number 
                  ? `bg-gradient-to-r ${stepData.gradient} text-white shadow-2xl` 
                  : 'bg-white/10 text-muted-foreground border border-white/20'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={currentStep === stepData.number ? { 
                boxShadow: ["0 0 0px rgba(59, 130, 246, 0)", "0 0 20px rgba(59, 130, 246, 0.5)", "0 0 0px rgba(59, 130, 246, 0)"]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentStep > stepData.number ? (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <Check className="h-6 w-6" />
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
                className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium whitespace-nowrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentStep >= stepData.number ? 1 : 0.5 }}
              >
                {stepData.title}
              </motion.div>
            </motion.div>
            
            {index < steps.slice(0, totalSteps).length - 1 && (
              <motion.div 
                className={`w-8 h-1 rounded-full transition-all duration-500 ${
                  currentStep > stepData.number 
                    ? `bg-gradient-to-r ${stepData.gradient}` 
                    : 'bg-white/20'
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
