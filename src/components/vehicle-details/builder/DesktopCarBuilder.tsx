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

/** Normalize + DAM map */
const normalizeColor = (s = "") =>
  s.replace(/exterior|interior/gi, "").replace(/\s+/g, " ").trim().toLowerCase();

const exteriorColorImageMap: Record<string, string> = {
  "pearl white":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
  "midnight black":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
  "silver metallic":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
};
const FIRST_DAM = exteriorColorImageMap["pearl white"] || Object.values(exteriorColorImageMap)[0];
const LOCAL_FALLBACK = "/images/vehicles/generic.jpg";

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
    const addHaptics = (ref: React.RefObject<HTMLButtonElement>, type: "luxuryPress" | "premiumError") => {
      if (ref.current) {
        addLuxuryHapticToButton(ref.current, { type, onPress: true, onHover: true });
      }
    };
    addHaptics(backButtonRef, "luxuryPress");
    addHaptics(closeButtonRef, "luxuryPress");
    addHaptics(resetButtonRef, "premiumError");
  }, []);

  const panelWidths = {
    laptop: { left: "w-[65%]", right: "w-[35%]" },
    largeDesktop: { left: "w-[60%]", right: "w-[40%]" },
    default: { left: "w-[68%]", right: "w-[32%]" }
  }[deviceCategory] || { left: "w-[68%]", right: "w-[32%]" };

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
    largeDesktop: "p-8",
    default: "p-7"
  }[deviceCategory] || "p-7";

  const vehicleInfoPosition = {
    laptop: "bottom-10 left-10 right-10",
    largeDesktop: "bottom-14 left-14 right-14",
    default: "bottom-12 left-12 right-12"
  }[deviceCategory] || "bottom-12 left-12 right-12";

  const rightPanelPadding = {
    laptop: "px-6 py-6",
    largeDesktop: "px-10 py-8",
    default: "px-8 py-6"
  }[deviceCategory] || "px-8 py-6";

  const handleBackClick = () => { contextualHaptic.stepProgress(); step > 1 ? goBack() : onClose(); };
  const handleResetClick = () => { contextualHaptic.resetAction(); onReset(); };

  const vehicleImage = exteriorColorImageMap[normalizeColor(config.exteriorColor)] || FIRST_DAM;

  return (
    <LazyMotion features={domAnimation} strict>
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.26 }}
        className="relative h-full w-full bg-background overflow-hidden flex"
      >
        {/* Left Visual Panel */}
        <div className={`${panelWidths.left} relative h-full overflow-hidden`}>
          {/* Header */}
          <div className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between ${headerPadding} bg-background/95 backdrop-blur-xl border-b border-border/20`}>
            <div className="flex items-center gap-6">
              <button
                ref={step > 1 ? backButtonRef : closeButtonRef}
                onClick={handleBackClick}
                className="group p-4 rounded-2xl bg-background border border-border/50 hover:border-primary/30 hover:bg-background shadow-sm hover:shadow"
              >
                {step > 1 ? <ArrowLeft /> : <X />}
              </button>
              <button
                ref={resetButtonRef}
                onClick={handleResetClick}
                className="group p-4 rounded-2xl bg-background border border-border/50 hover:border-destructive/30 hover:bg-background shadow-sm hover:shadow"
              >
                <RotateCcw />
              </button>
            </div>
            <h1 className={`${headerTextSize} font-bold`}>Build Your <span className="text-primary">{vehicle.name}</span></h1>
            <div className="w-32" />
          </div>

          {/* Hero image (no overlays, no crop) */}
          <div className="relative w-full h-full bg-black">
            <img
              src={vehicleImage}
              alt="Vehicle Preview"
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => { if (!e.currentTarget.src.includes(LOCAL_FALLBACK)) e.currentTarget.src = LOCAL_FALLBACK; }}
            />
            <div className={`absolute ${vehicleInfoPosition} z-20`}>
              <div className={`bg-background/92 backdrop-blur-xl rounded-3xl ${vehicleInfoPadding} border border-border/20 max-w-xl shadow`}>
                <h3 className="text-3xl font-bold mb-1">{config.modelYear} {vehicle.name}</h3>
                <div className="text-lg text-muted-foreground mb-1">{config.grade || "—"} · {config.engine}</div>
                <p className="text-muted-foreground mb-4 capitalize">{normalizeColor(config.exteriorColor)} exterior</p>
                <div className="flex justify-between items-end">
                  <div className="text-4xl font-bold text-primary">AED {calculateTotalPrice().toLocaleString()}</div>
                  <div className="text-right text-muted-foreground">
                    <div className="text-sm">From</div>
                    <div className="text-lg font-semibold">AED 2,850/mo</div>
                  </div>
                </div>
                <div className="mt-4 h-px bg-border" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Workflow Panel */}
        <div className={`${panelWidths.right} h-full flex flex-col bg-background border-l border-border/20`}>
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            <div className={`${rightPanelPadding} border-b border-border/20 sticky top-0 z-20 bg-background/95`}>
              <MobileProgress currentStep={step} totalSteps={4} />
            </div>

            <div className={`${rightPanelPadding} border-b border-border/10`}>
              <ChoiceCollector config={config} step={step} />
              {step > 3 && config.modelYear && config.grade && <CollapsibleSpecs config={config} />}
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className={rightPanelPadding}>
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
                reserveAmount={5000}
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
