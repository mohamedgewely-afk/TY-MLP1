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
  exteriorColor: string; // label or canonical
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

/** Normalization + DAM map */
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

const FIRST_DAM_FALLBACK =
  exteriorColorImageMap["pearl white"] || Object.values(exteriorColorImageMap)[0];
const LOCAL_GENERIC_FALLBACK = "/images/vehicles/generic.jpg";

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
    const wire = (ref: React.RefObject<HTMLButtonElement>, type: "luxuryPress" | "premiumError") => {
      if (ref.current) addLuxuryHapticToButton(ref.current, { type, onPress: true, onHover: true });
    };
    wire(backButtonRef, "luxuryPress");
    wire(closeButtonRef, "luxuryPress");
    wire(resetButtonRef, "premiumError");
  }, []);

  const panelWidths =
    {
      laptop: { left: "w-[62%]", right: "w-[38%]" },
      largeDesktop: { left: "w-[60%]", right: "w-[40%]" },
      default: { left: "w-[65%]", right: "w-[35%]" },
    }[deviceCategory] || { left: "w-[65%]", right: "w-[35%]" };

  const headerPadding =
    {
      laptop: "p-8",
      largeDesktop: "p-12",
      default: "p-10",
    }[deviceCategory] || "p-10";

  const headerTextSize =
    {
      laptop: "text-3xl",
      largeDesktop: "text-5xl",
      default: "text-4xl",
    }[deviceCategory] || "text-4xl";

  const cardPadding =
    {
      laptop: "p-6",
      largeDesktop: "p-8",
      default: "p-7",
    }[deviceCategory] || "p-7";

  const handleBackClick = () => {
    contextualHaptic.stepProgress();
    step > 1 ? goBack() : onClose();
  };
  const handleResetClick = () => {
    contextualHaptic.resetAction();
    onReset();
  };

  const key = normalizeColor(config.exteriorColor);
  const imgSrc = exteriorColorImageMap[key] || FIRST_DAM_FALLBACK;

  return (
    <LazyMotion features={domAnimation} strict>
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.3 }}
        className="relative h-full w-full bg-background overflow-hidden flex"
      >
        {/* Left: Cinematic Stage */}
        <div className={`${panelWidths.left} relative h-full overflow-hidden`}>
          {/* Toolbar */}
          <div
            className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between ${headerPadding} bg-background/90 backdrop-blur-md border-b border-border/20`}
          >
            <div className="flex items-center gap-6">
              <button
                ref={step > 1 ? backButtonRef : closeButtonRef}
                onClick={handleBackClick}
                className="group p-4 rounded-2xl bg-background border border-border/50 hover:border-primary/30 shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                aria-label={step > 1 ? "Go back" : "Close builder"}
              >
                {step > 1 ? <ArrowLeft /> : <X />}
              </button>
              <button
                ref={resetButtonRef}
                onClick={handleResetClick}
                className="group p-4 rounded-2xl bg-background border border-border/50 hover:border-destructive/30 shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40"
                aria-label="Reset configuration"
              >
                <RotateCcw />
              </button>
            </div>
            <h1 className={`${headerTextSize} font-bold`}>
              Build Your <span className="text-primary">{vehicle.name}</span>
            </h1>
            <div className="w-32" />
          </div>

          {/* Ambient glow behind the car */}
          <div className="absolute inset-0">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] rounded-full opacity-25 blur-3xl bg-[radial-gradient(ellipse_at_center,theme(colors.primary/20),transparent_55%)]" />
          </div>

          {/* Vehicle Stage */}
          <div className="relative w-full h-full bg-gradient-to-b from-muted/10 via-background to-background">
            <img
              src={imgSrc}
              alt="Vehicle Preview"
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src !== window.location.origin + LOCAL_GENERIC_FALLBACK) {
                  e.currentTarget.src = LOCAL_GENERIC_FALLBACK;
                }
              }}
            />

            {/* Info Card (minimal, non-obscuring) */}
            <div className="absolute bottom-12 left-12 right-12 z-20 max-w-xl">
              <div className={`bg-background/92 rounded-3xl ${cardPadding} border border-border/20 shadow`}>
                <h3 className="text-3xl font-bold mb-1">
                  {config.modelYear} {vehicle.name}
                </h3>
                <div className="text-lg text-muted-foreground mb-1">
                  {config.grade || "—"} · {config.engine}
                </div>
                <p className="text-muted-foreground mb-4 capitalize">
                  {key} exterior
                </p>
                <div className="flex justify-between items-end">
                  <div className="text-4xl font-bold text-primary">
                    AED {calculateTotalPrice().toLocaleString()}
                  </div>
                  <div className="text-right text-muted-foreground">
                    <div className="text-sm">From</div>
                    <div className="text-lg font-semibold">AED 2,850/mo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Configurator Panel */}
        <div className={`${panelWidths.right} h-full flex flex-col bg-background border-l border-border/20`}>
          <Suspense fallback={<div className="p-6">Loading…</div>}>
            {/* Sticky Progress */}
            <div className="sticky top-0 z-20 bg-background/95 border-b border-border/20">
              <MobileProgress currentStep={step} totalSteps={4} />
            </div>

            {/* Choices */}
            <div className={`px-8 py-6 border-b border-border/10`}>
              <ChoiceCollector config={config} step={step} />
              {step > 3 && config.modelYear && config.grade && (
                <div className="mt-4">
                  <CollapsibleSpecs config={config} />
                </div>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-8 py-6">
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

            {/* Summary (anchored) */}
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
