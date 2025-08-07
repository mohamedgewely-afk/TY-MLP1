
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory } from "@/hooks/use-device-info";
import ModelYearEngineStep from "./steps/ModelYearEngineStep";
import GradeCarouselStep from "./steps/GradeCarouselStep";
import ColorsAccessoriesStep from "./steps/ColorsAccessoriesStep";
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
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98
  })
};

const stepTransition = {
  x: { type: "spring", stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
  scale: { duration: 0.3 }
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
  console.log('📱 MobileStepContent - Current Step:', step);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <ModelYearEngineStep
            config={config}
            setConfig={setConfig}
          />
        );
      case 2:
        return (
          <GradeCarouselStep
            config={config}
            setConfig={setConfig}
          />
        );
      case 3:
        return (
          <ColorsAccessoriesStep
            config={config}
            setConfig={setConfig}
          />
        );
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
    <div className="h-full overflow-hidden">
      <AnimatePresence mode="wait" custom={1}>
        <motion.div
          key={step}
          custom={1}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={stepTransition}
          className="h-full overflow-y-auto scrollbar-hide"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MobileStepContent;
