import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
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

interface DesktopCarBuilderProps {
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
}

const DesktopCarBuilder: React.FC<DesktopCarBuilderProps> = ({
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
  onReset
}) => {
  const { deviceCategory } = useDeviceInfo();

  const backRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (backRef.current) addLuxuryHapticToButton(backRef.current, { type: "luxuryPress", onPress: true });
    if (closeRef.current) addLuxuryHapticToButton(closeRef.current, { type: "luxuryPress", onPress: true });
    if (resetRef.current) addLuxuryHapticToButton(resetRef.current, { type: "premiumError", onPress: true });
  }, []);

  const handleBack = useCallback(() => {
    contextualHaptic.stepProgress();
    step > 1 ? goBack() : onClose();
  }, [step, goBack, onClose]);

  const handleReset = useCallback(() => {
    contextualHaptic.resetAction();
    onReset();
  }, [onReset]);

  const getVehicleImage = useCallback(() => {
    const images = {
      "Pearl White": "https://...white.jpg",
      "Midnight Black": "https://...black.jpg",
      // Add other mappings
    };
    return images[config.exteriorColor] || images["Pearl White"];
  }, [config.exteriorColor]);

  const price = useMemo(() => calculateTotalPrice(), [calculateTotalPrice]);

  return (
    <motion.div
      className="relative flex w-full h-full bg-background overflow-hidden"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
    >
      {/* Left panel: Vehicle preview */}
      <div className="w-[65%] h-full relative bg-muted/5">
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-background/90 backdrop-blur border-b border-border z-10">
          <div className="flex gap-4">
            <button ref={step > 1 ? backRef : closeRef} onClick={handleBack} className="btn">
              {step > 1 ? <ArrowLeft /> : <X />}
            </button>
            <button ref={resetRef} onClick={handleReset} className="btn">
              <RotateCcw />
            </button>
          </div>
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold text-foreground">Build Your <span className="text-primary">{vehicle.name}</span></h1>
            <p className="text-sm text-muted-foreground">Step {step} of 4</p>
          </div>
          <div className="w-12" />
        </header>

        <motion.img
          src={getVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        />

        <motion.div className="absolute bottom-6 left-6 bg-background/90 rounded-xl p-6 backdrop-blur border border-border shadow-xl max-w-md">
          <h3 className="text-xl font-bold text-foreground mb-1">{config.modelYear} {vehicle.name}</h3>
          <p className="text-muted-foreground mb-2">{config.grade} • {config.engine} • {config.exteriorColor}</p>
          <div className="text-primary text-2xl font-bold mb-1">AED {price.toLocaleString()}</div>
          <div className="text-muted-foreground text-sm">From AED 2,850/mo</div>
        </motion.div>
      </div>

      {/* Right panel: Configuration */}
      <div className="w-[35%] h-full flex flex-col border-l border-border bg-background">
        <div className="p-6 border-b border-border">
          <MobileProgress currentStep={step} totalSteps={4} />
        </div>
        <div className="p-6 border-b border-border overflow-y-auto">
          <ChoiceCollector config={config} step={step} />
        </div>
        <div className="flex-1 overflow-y-auto p-6">
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
        </div>
        <div className="p-6 border-t border-border">
          <MobileSummary
            config={config}
            totalPrice={price}
            step={step}
            reserveAmount={5000}
            deviceCategory={deviceCategory}
            showPaymentButton={step !== 4}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopCarBuilder;
