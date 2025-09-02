import React, { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, RotateCcw, LogOut } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import { useSwipeable } from "@/hooks/use-swipeable";
import { contextualHaptic, addLuxuryHapticToButton } from "@/utils/haptic";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileCarBuilderProps {
  vehicle: VehicleModel;
  step: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  showConfirmation: boolean;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goBack: () => void;
  goNext: () => void;
  onClose: () => void;
  onReset: () => void;
  deviceCategory: DeviceCategory;
}

const MobileCarBuilder: React.FC<MobileCarBuilderProps> = ({
  vehicle,
  step,
  config,
  setConfig,
  showConfirmation,
  calculateTotalPrice,
  handlePayment,
  goBack,
  goNext,
  onClose,
  onReset,
  deviceCategory,
}) => {
  const { containerPadding, buttonSize, cardSpacing, textSize, mobilePadding, touchTarget } =
    useResponsiveSize();

  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const map = [
      { ref: backButtonRef, type: "luxuryPress" },
      { ref: closeButtonRef, type: "luxuryPress" },
      { ref: resetButtonRef, type: "premiumError" },
      { ref: exitButtonRef, type: "luxuryPress" },
    ];
    map.forEach(({ ref, type }) => {
      if (ref.current) {
        addLuxuryHapticToButton(ref.current, {
          type,
          onPress: true,
          onHover: false,
        });
      }
    });
  }, []);

  const getCurrentVehicleImage = useCallback(() => {
    const exteriorColors = [
      {
        name: "Pearl White",
        image:
          "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
      },
      {
        name: "Midnight Black",
        image:
          "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
      },
      {
        name: "Silver Metallic",
        image:
          "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
      },
      {
        name: "Deep Blue",
        image:
          "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
      },
      {
        name: "Ruby Red",
        image:
          "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
      },
    ];
    const colorData = exteriorColors.find((c) => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  }, [config.exteriorColor]);

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (step === 1 && step < 4) {
        contextualHaptic.swipeNavigation();
        goNext();
      }
    },
    onSwipeRight: () => {
      if (step === 1 && step > 1) {
        contextualHaptic.swipeNavigation();
        goBack();
      } else if (step === 1) {
        onClose();
      }
    },
    threshold: 80,
    preventDefaultTouchmoveEvent: false,
  });

  const handleBackClick = useCallback(() => {
    contextualHaptic.stepProgress();
    step > 1 ? goBack() : onClose();
  }, [step, goBack, onClose]);

  const handleResetClick = useCallback(() => {
    contextualHaptic.resetAction();
    onReset();
  }, [onReset]);

  const handleExitClick = useCallback(() => {
    contextualHaptic.exitAction();
    onClose();
  }, [onClose]);

  return (
    <motion.div
      ref={swipeableRef}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/5 overflow-y-auto flex flex-col"
    >
      {/* Header */}
      <div className="z-30 flex items-center justify-between bg-background/95 px-3 py-2 border-b">
        <div className="flex gap-2">
          <button ref={step > 1 ? backButtonRef : closeButtonRef} onClick={handleBackClick}><ArrowLeft className="h-5 w-5" /></button>
          <button ref={resetButtonRef} onClick={handleResetClick}><RotateCcw className="h-5 w-5" /></button>
        </div>
        <h1 className="text-sm font-semibold">Build Your {vehicle.name}</h1>
        <button ref={exitButtonRef} onClick={handleExitClick}><LogOut className="h-5 w-5" /></button>
      </div>

      {/* Vehicle Image */}
      <div className="relative w-full h-40 bg-muted/10 border-b">
        <img
          src={getCurrentVehicleImage()}
          alt="Vehicle"
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Progress */}
      <div className="bg-background/95 border-b">
        <MobileProgress currentStep={step} totalSteps={4} />
      </div>

      {/* Choices */}
      <div className="px-3 py-2 bg-background/95 border-b">
        <ChoiceCollector config={config} step={step} />
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-auto px-2 py-2">
        <AnimatePresence mode="wait">
          <MobileStepContent
            key={step}
            step={step}
            config={config}
            setConfig={setConfig}
            vehicle={vehicle}
            calculateTotalPrice={calculateTotalPrice}
            handlePayment={handlePayment}
            goNext={goNext}
            deviceCategory={deviceCategory}
            onReset={onReset}
          />
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="bg-background/98 border-t px-3 py-2">
        <MobileSummary
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
          reserveAmount={2000}
          deviceCategory={deviceCategory}
          showPaymentButton={step !== 4}
        />
      </div>
    </motion.div>
  );
};

export default MobileCarBuilder;