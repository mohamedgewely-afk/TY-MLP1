
import React from "react";
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
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default MobileProgress;
