
import React from "react";
import { motion } from "framer-motion";

interface BuilderConfig {
  modelYear: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileSummaryProps {
  config: BuilderConfig;
  totalPrice: number;
  step: number;
}

const MobileSummary: React.FC<MobileSummaryProps> = ({ 
  config, 
  totalPrice, 
  step 
}) => {
  if (step === 6) return null;

  return (
    <motion.div 
      className="relative z-10 p-4 bg-black/40 backdrop-blur-xl border-t border-white/10"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-medium">Current Configuration</p>
          <p className="text-cyan-400 text-xs">
            {config.modelYear} {config.grade} • {config.exteriorColor}
          </p>
        </div>
        
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            AED {totalPrice.toLocaleString()}
          </p>
        </motion.div>
      </div>
      
      <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${(step / 6) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
};

export default MobileSummary;
