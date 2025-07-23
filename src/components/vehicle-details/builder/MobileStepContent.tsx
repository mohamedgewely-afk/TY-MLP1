import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory } from "@/hooks/use-device-info";
import ModelYearEngineStep from "./steps/ModelYearEngineStep";
import GradeCarouselStep from "./steps/GradeCarouselStep";
import ColorsAccessoriesStep from "./steps/ColorsAccessoriesStep";
import ReviewStep from "./steps/ReviewStep";
import { useSwipeable } from "@/hooks/use-swipeable";
import { contextualHaptic } from "@/utils/haptic";

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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const getCurrentVehicleImage = () => {
    const exteriorColors = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
      { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe || isRightSwipe) {
      contextualHaptic.swipeNavigation();
    }
  };

  const containerRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      contextualHaptic.swipeNavigation();
    },
    onSwipeRight: () => {
      contextualHaptic.swipeNavigation();
    },
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  const stepVariants = {
    initial: { opacity: 0, x: 100, scale: 0.95 },
    animate: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    exit: { 
      opacity: 0, 
      x: -100, 
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  const renderStep = () => {
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
            vehicle={vehicle}
            config={config}
            totalPrice={calculateTotalPrice()}
            getCurrentVehicleImage={getCurrentVehicleImage}
            onPayment={handlePayment}
            showPaymentButton={false}
          />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="h-full w-full overflow-hidden"
      variants={stepVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      key={step}
    >
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </motion.div>
  );
};

export default MobileStepContent;
