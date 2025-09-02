import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, RotateCcw } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";
import MobileProgress from "./MobileProgress";
import MobileStepContent from "./MobileStepContent";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";

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
  deviceCategory: string;
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
  deviceCategory
}) => {
  const backRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (backRef.current)
      addLuxuryHapticToButton(backRef.current, { type: "luxuryPress", onPress: true });
    if (closeRef.current)
      addLuxuryHapticToButton(closeRef.current, { type: "luxuryPress", onPress: true });
    if (resetRef.current)
      addLuxuryHapticToButton(resetRef.current, { type: "premiumError", onPress: true });
  }, []);

  const handleBack = useCallback(() => {
    contextualHaptic.stepProgress();
    step > 1 ? goBack() : onClose();
  }, [step, goBack, onClose]);

  const handleReset = useCallback(() => {
    contextualHaptic.resetAction();
    onReset();
  }, [onReset]);

  const getImage = useCallback(() => {
    const map = {
      "Pearl White": "https://...white.jpg",
      "Midnight Black": "https://...black.jpg",
      // Add your real URLs
    };
    return map[config.exteriorColor] || map["Pearl White"];
  }, [config.exteriorColor]);

  const price = useMemo(() => calculateTotalPrice(), [calculateTotalPrice]);

  return (
    <motion.div
      className="flex flex-col w-full min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="flex items-center justify-between p-4 border-b border-border">
        <button ref={step > 1 ? backRef : closeRef} onClick={handleBack}>
          {step > 1 ? <ArrowLeft /> : <X />}
        </button>
        <h1 className="text-sm font-semibold">
          Step {step} of 4: Build Your <span className="text-primary">{vehicle.name}</span>
        </h1>
        <button ref={resetRef} onClick={handleReset}>
          <RotateCcw />
        </button>
      </header>

      <div className="relative w-full h-48">
        <motion.img
          src={getImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        />
        <div className="absolute bottom-2 left-2 right-2 bg-background/80 p-3 rounded-xl text-xs shadow">
          <div className="font-bold text-lg text-primary">AED {price.toLocaleString()}</div>
          <div className="text-muted-foreground">{config.modelYear} {vehicle.name} • {config.grade}</div>
        </div>
      </div>

      <MobileProgress currentStep={step} totalSteps={4} />
      <ChoiceCollector config={config} step={step} />

      <div className="flex-1 overflow-y-auto">
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
          />
        </AnimatePresence>
      </div>

      <MobileSummary
        config={config}
        totalPrice={price}
        step={step}
        reserveAmount={2000}
        deviceCategory={deviceCategory}
        showPaymentButton={step !== 4}
      />
    </motion.div>
  );
};

export default MobileCarBuilder;
