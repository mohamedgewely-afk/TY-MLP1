import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, RotateCcw } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useDeviceInfo } from "@/hooks/use-device-info";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import CollapsibleSpecs from "./CollapsibleSpecs";
import { addLuxuryHapticToButton, contextualHaptic, LuxuryHapticType } from "@/utils/haptic";

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

const vehicleImages = [
  { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
  { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
  { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" },
];

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
  onReset,
}) => {
  const { deviceCategory } = useDeviceInfo();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const attachHaptic = (ref: React.RefObject<HTMLButtonElement>, type: LuxuryHapticType) => {
      if (ref.current) {
        addLuxuryHapticToButton(ref.current, {
          type,
          onPress: true,
          onHover: true,
        });
      }
    };
    attachHaptic(backButtonRef, "luxuryPress");
    attachHaptic(closeButtonRef, "luxuryPress");
    attachHaptic(resetButtonRef, "premiumError");
  }, []);

  const getCurrentVehicleImage = useCallback(() => {
    const match = vehicleImages.find((v) => v.name === config.exteriorColor);
    return match?.image ?? vehicleImages[0].image;
  }, [config.exteriorColor]);

  const showSpecs = useMemo(
    () => step > 3 && config.modelYear && config.grade,
    [step, config.modelYear, config.grade]
  );

  const handleBackClick = useCallback(() => {
    contextualHaptic.stepProgress();
    step > 1 ? goBack() : onClose();
  }, [step, goBack, onClose]);

  const handleResetClick = useCallback(() => {
    contextualHaptic.resetAction();
    onReset();
  }, [onReset]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex bg-background overflow-hidden"
    >
      <div className="w-3/5 h-full relative bg-muted/10">
        <div className="absolute top-4 left-4 flex gap-4 z-20">
          <button ref={step > 1 ? backButtonRef : closeButtonRef} onClick={handleBackClick}>
            {step > 1 ? <ArrowLeft /> : <X />}
          </button>
          <button ref={resetButtonRef} onClick={handleResetClick}>
            <RotateCcw />
          </button>
        </div>

        <motion.img
          key={getCurrentVehicleImage()}
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        <div className="absolute bottom-6 left-6 bg-background/80 backdrop-blur-md p-6 rounded-xl shadow-xl z-10">
          <h2 className="text-3xl font-bold text-foreground">
            {config.modelYear} {vehicle.name}
          </h2>
          <p className="text-muted-foreground text-lg">
            {config.grade} • {config.engine} • {config.exteriorColor} Exterior
          </p>
          <p className="text-primary text-4xl font-semibold mt-2">
            AED {calculateTotalPrice().toLocaleString()}
          </p>
        </div>
      </div>

      <div className="w-2/5 h-full flex flex-col bg-background border-l border-border">
        <div className="p-4 border-b border-border">
          <MobileProgress currentStep={step} totalSteps={4} />
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4">
          <ChoiceCollector config={config} step={step} />
          {showSpecs && <CollapsibleSpecs config={config} />}
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
        <div className="border-t border-border p-4">
          <MobileSummary
            config={config}
            totalPrice={calculateTotalPrice()}
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
