
import React from "react";
import { motion } from "framer-motion";
import { useResponsiveSize } from "@/hooks/use-device-info";

interface MobileProgressProps {
  currentStep: number;
  totalSteps?: number;
}

const MobileProgress: React.FC<MobileProgressProps> = ({ 
  currentStep, 
  totalSteps = 7 
}) => {
  const { containerPadding, mobilePadding } = useResponsiveSize();
  
  return (
    <div className={`${containerPadding} py-1`}>
      <div className="w-full bg-muted/30 rounded-full h-1 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default MobileProgress;
