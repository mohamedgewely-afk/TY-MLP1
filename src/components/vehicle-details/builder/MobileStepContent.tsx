
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

const getCurrentVehicleImage = () => {
  return "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true";
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
            vehicle={vehicle}
            config={config}
            totalPrice={calculateTotalPrice()}
            getCurrentVehicleImage={getCurrentVehicleImage}
            onPayment={handlePayment}
            handleTouchStart={() => {}}
            handleTouchMove={() => {}}
            handleTouchEnd={() => {}}
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
