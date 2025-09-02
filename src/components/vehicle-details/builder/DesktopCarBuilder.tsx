// ✅ FULL RESTORED AND FUNCTIONAL DESKTOP CAR BUILDER
import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, RotateCcw } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useDeviceInfo } from "@/hooks/use-device-info";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import CollapsibleSpecs from "./CollapsibleSpecs";
import MobileStepContent from "./MobileStepContent";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";

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
  onReset,
}) => {
  const { deviceCategory } = useDeviceInfo();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const setup = [
      { ref: backButtonRef, type: "luxuryPress" },
      { ref: closeButtonRef, type: "luxuryPress" },
      { ref: resetButtonRef, type: "premiumError" },
    ];
    setup.forEach(({ ref, type }) => {
      if (ref.current) {
        addLuxuryHapticToButton(ref.current, {
          type,
          onPress: true,
          onHover: true,
        });
      }
    });
  }, []);

  const getVehicleImage = useCallback(() => {
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
    ];
    const found = exteriorColors.find((c) => c.name === config.exteriorColor);
    return found?.image || exteriorColors[0].image;
  }, [config.exteriorColor]);

  const showSpecs = useMemo(
    () => step > 3 && config.modelYear && config.grade,
    [step, config]
  );

  const panelWidths = useMemo(() => {
    switch (deviceCategory) {
      case "laptop":
        return { left: "w-[65%]", right: "w-[35%]" };
      case "largeDesktop":
        return { left: "w-[60%]", right: "w-[40%]" };
      default:
        return { left: "w-[70%]", right: "w-[30%]" };
    }
  }, [deviceCategory]);

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
      className="relative h-full w-full flex overflow-hidden bg-background"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {/* LEFT PANEL */}
      <motion.div
        className={`${panelWidths.left} relative bg-muted/5 border-r border-border/10`}
      >
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-6 border-b border-border/10 z-10 bg-background/90 backdrop-blur">
          <button ref={step > 1 ? backButtonRef : closeButtonRef} onClick={handleBackClick}>
            {step > 1 ? <ArrowLeft /> : <X />}
          </button>
          <h1 className="text-lg font-bold">
            Build Your <span className="text-primary">{vehicle.name}</span>
          </h1>
          <button ref={resetButtonRef} onClick={handleResetClick}>
            <RotateCcw />
          </button>
        </div>

        <motion.img
          key={config.exteriorColor}
          src={getVehicleImage()}
          alt="Vehicle"
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />
      </motion.div>

      {/* RIGHT PANEL */}
      <motion.div className={`${panelWidths.right} flex flex-col h-full bg-background`}>
        <div className="border-b border-border/10 p-4">
          <MobileProgress currentStep={step} totalSteps={4} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
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
        <div className="border-t border-border/10 p-4">
          <MobileSummary
            config={config}
            totalPrice={calculateTotalPrice()}
            step={step}
            reserveAmount={5000}
            deviceCategory={deviceCategory}
            showPaymentButton={step !== 4}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DesktopCarBuilder;