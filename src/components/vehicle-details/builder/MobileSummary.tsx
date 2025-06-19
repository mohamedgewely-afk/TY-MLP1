
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
      className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-card/95 backdrop-blur-xl border-t border-border"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-foreground text-sm font-semibold mb-1">Current Configuration</p>
          <p className="text-primary text-xs font-medium">
            {config.modelYear} {config.grade} • {config.exteriorColor}
          </p>
          {config.accessories.length > 0 && (
            <p className="text-muted-foreground text-xs mt-1">
              +{config.accessories.length} accessories
            </p>
          )}
        </div>
        
        <motion.div
          className="text-right"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <p className="text-xs text-muted-foreground mb-1">Total Price</p>
          <p className="text-2xl font-bold text-primary">
            AED {totalPrice.toLocaleString()}
          </p>
        </motion.div>
      </div>
      
      <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-primary shadow-lg"
          initial={{ width: 0 }}
          animate={{ width: `${(step / 6) * 100}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
};

export default MobileSummary;
