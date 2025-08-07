
import React from "react";
import { motion } from "framer-motion";
import { DeviceCategory } from "@/hooks/use-device-info";
import { VehicleModel } from "@/types/vehicle";
import UnifiedConfigurationStep from "./steps/UnifiedConfigurationStep";
import ReviewStep from "./steps/ReviewStep";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileStepContentProps {
  step: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  vehicle: VehicleModel;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goNext: () => void;
  deviceCategory: DeviceCategory;
}

const stepVariants = {
  enter: {
    x: 50,
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
  },
  exit: {
    x: -50,
    opacity: 0,
  },
};

const MobileStepContent: React.FC<MobileStepContentProps> = ({
  step,
  config,
  setConfig,
  vehicle,
  calculateTotalPrice,
  handlePayment,
  goNext,
  deviceCategory
}) => {
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <UnifiedConfigurationStep
            config={config}
            setConfig={setConfig}
          />
        );
      case 2:
      case 3:
      case 4:
        return (
          <ReviewStep
            config={config}
            totalPrice={calculateTotalPrice()}
            onPayment={handlePayment}
            deviceCategory={deviceCategory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      key={step}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="h-full"
    >
      {renderStep()}
    </motion.div>
  );
};

export default MobileStepContent;
