import React, { useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation } from "framer-motion";
import { X, ArrowLeft, RotateCcw } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";

const MobileStepContent = React.lazy(() => import("./MobileStepContent"));
const MobileProgress = React.lazy(() => import("./MobileProgress"));
const MobileSummary = React.lazy(() => import("./MobileSummary"));
const ChoiceCollector = React.lazy(() => import("./ChoiceCollector"));
const CollapsibleSpecs = React.lazy(() => import("./CollapsibleSpecs"));

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

const exteriorColorImageMap: Record<string, string> = {
  "Pearl White": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
  "Midnight Black": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
  "Silver Metallic": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true"
};

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
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const addHaptics = (ref: React.RefObject<HTMLButtonElement>, type: string) => {
      if (ref.current) {
        addLuxuryHapticToButton(ref.current, {
          type,
          onPress: true,
          onHover: true
        });
      }
    };
    addHaptics(backButtonRef, "luxuryPress");
    addHaptics(closeButtonRef, "luxuryPress");
    addHaptics(resetButtonRef, "premiumError");
  }, []);

  const panelWidths = {
    laptop: { left: "w-[65%]", right: "w-[35%]" },
    largeDesktop: { left: "w-[60%]", right: "w-[40%]" },
    default: { left: "w-[70%]", right: "w-[30%]" }
  }[deviceCategory] || { left: "w-[70%]", right: "w-[30%]" };

  const headerPadding = {
    laptop: "p-8",
    largeDesktop: "p-12",
    default: "p-10"
  }[deviceCategory] || "p-10";

  const headerTextSize = {
    laptop: "text-3xl",
    largeDesktop: "text-5xl",
    default: "text-4xl"
  }[deviceCategory] || "text-4xl";

  const vehicleInfoPadding = {
    laptop: "p-6",
    largeDesktop: "p-10",
    default: "p-8"
  }[deviceCategory] || "p-8";

  const vehicleInfoPosition = {
    laptop: "bottom-8 left-8 right-8",
    largeDesktop: "bottom-16 left-16 right-16",
    default: "bottom-12 left-12 right-12"
  }[deviceCategory] || "bottom-12 left-12 right-12";

  const rightPanelPadding = {
    laptop: "px-6 py-6",
    largeDesktop: "px-12 py-10",
    default: "px-10 py-8"
  }[deviceCategory] || "px-10 py-8";

  const handleBackClick = () => {
    contextualHaptic.stepProgress();
    step > 1 ? goBack() : onClose();
  };

  const handleResetClick = () => {
    contextualHaptic.resetAction();
    onReset();
  };

  const showSpecs = step > 3 && config.modelYear && config.grade;
  const reserveAmount = 5000;

  return (
    <LazyMotion features={domAnimation} strict>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5 }}
        className="relative h-full w-full bg-background overflow-hidden flex"
      >
        <div className={`${panelWidths.left} relative h-full overflow-hidden`}>
          <div
            className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between ${headerPadding} bg-background/95 backdrop-blur-xl border-b border-border/20`}
          >
            <div className="flex items-center gap-6">
              <button
                ref={step > 1 ? backButtonRef : closeButtonRef}
                onClick={handleBackClick}
                className="group p-4 rounded-2xl bg-background/90 border border-border/50 hover:border-primary/30 hover:bg-background shadow-lg hover:shadow-xl"
              >
                {step > 1 ? <ArrowLeft /> : <X />}
              </button>
              <button
                ref={resetButtonRef}
                onClick={handleResetClick}
                className="group p-4 rounded-2xl bg-background/90 border border-border/50 hover:border-destructive/30 hover:bg-background shadow-lg hover:shadow-xl"
              >
                <RotateCcw />
              </button>
            </div>
            <h1 className={`${headerTextSize} font-bold text-foreground`}>Build Your <span className="text-primary">{vehicle.name}</span></h1>
            <div className="w-32" />
          </div>

          <div className="relative w-full h-full">
            <img
              src={exteriorColorImageMap[config.exteriorColor] || exteriorColorImageMap["Pearl White"]}
              alt="Vehicle Preview"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className={`absolute ${vehicleInfoPosition} z-20`}>
              <div className={`bg-background/95 backdrop-blur-xl rounded-3xl ${vehicleInfoPadding} border border-border/20 max-w-lg shadow-2xl`}>
                <h3 className="text-3xl font-bold text-foreground mb-1">{config.modelYear} {vehicle.name}</h3>
                <div className="text-lg text-muted-foreground mb-1">{config.grade} · {config.engine}</div>
                <p className="text-muted-foreground mb-4">{config.exteriorColor} Exterior</p>
                <div className="flex justify-between items-end">
                  <div className="text-4xl font-bold text-primary">AED {calculateTotalPrice().toLocaleString()}</div>
                  <div className="text-right text-muted-foreground">
                    <div className="text-sm">From</div>
                    <div className="text-lg font-semibold text-foreground">AED 2,850/mo</div>
                  </div>
                </div>
                <div className="mt-4 h-px bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${panelWidths.right} h-full flex flex-col bg-background border-l border-border/20`}>
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            <div className={`${rightPanelPadding} border-b border-border/20`}>
              <MobileProgress currentStep={step} totalSteps={4} />
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className={`${rightPanelPadding} border-b border-border/10`}>
                <ChoiceCollector config={config} step={step} />
                {showSpecs && <CollapsibleSpecs config={config} />}
              </div>
              <div className="flex-1">
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
            </div>

            <div className="border-t border-border/20">
              <MobileSummary
                config={config}
                totalPrice={calculateTotalPrice()}
                step={step}
                reserveAmount={reserveAmount}
                deviceCategory={deviceCategory}
                showPaymentButton={step !== 4}
              />
            </div>
          </Suspense>
        </div>
      </motion.div>
    </LazyMotion>
  );
};

export default DesktopCarBuilder;
