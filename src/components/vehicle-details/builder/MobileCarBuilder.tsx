import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  exteriorColor: string; // label or canonical
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

/* --- Normalize + DAM map --- */
const normalizeColor = (s = "") =>
  s.replace(/exterior|interior/gi, "").replace(/\s+/g, " ").trim().toLowerCase();

const EXTERIOR_IMG: Record<string, string> = {
  "pearl white":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
  "midnight black":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
  "silver metallic":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
};
const FIRST_DAM = EXTERIOR_IMG["pearl white"] || Object.values(EXTERIOR_IMG)[0];
const LOCAL_FALLBACK = "/images/vehicles/generic.png";

const MobileCarBuilder: React.FC<MobileCarBuilderProps> = ({
  vehicle, step, config, setConfig, showConfirmation,
  calculateTotalPrice, handlePayment, goBack, goNext, onClose, onReset, deviceCategory,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const { touchTarget } = useResponsiveSize();

  // keep the old, reliable interaction wiring
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const wire = (ref: React.RefObject<HTMLButtonElement>, type: "luxuryPress" | "premiumError") => {
      if (ref.current) addLuxuryHapticToButton(ref.current, { type, onPress: true, onHover: false });
    };
    wire(backButtonRef, "luxuryPress");
    wire(closeButtonRef, "luxuryPress");
    wire(resetButtonRef, "premiumError");
    wire(exitButtonRef, "luxuryPress");
  }, []);

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => { if (step >= 1 && step < 4) { contextualHaptic.swipeNavigation(); goNext(); } },
    onSwipeRight: () => { if (step > 1) { contextualHaptic.swipeNavigation(); goBack(); } else { onClose(); } },
    threshold: 80,
  });

  const buttonClass =
    `${touchTarget} rounded-xl bg-background border border-border/50 hover:border-primary/40 transition-all duration-150 flex items-center justify-center shadow-sm hover:shadow p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`;

  /* --- CRITICAL: fixed, device-class heights (no vh) --- */
  const heroH =
    {
      smallMobile: "h-40",
      standardMobile: "h-44",
      largeMobile: "h-52",
      extraLargeMobile: "h-56",
      tablet: "h-64",
    }[deviceCategory] || "h-44";

  const colorKey = normalizeColor(config.exteriorColor);
  const imgSrc = EXTERIOR_IMG[colorKey] || FIRST_DAM;

  const t = { duration: prefersReducedMotion ? 0 : 0.22 };

  return (
    <motion.div
      ref={swipeableRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: t }}
      exit={{ opacity: 0, transition: t }}
      className="relative w-full min-h-screen bg-background overflow-y-auto flex flex-col"
    >
      {/* Header */}
      <div className="z-30 flex items-center justify-between bg-background border-b border-border/20 px-2 py-1 sticky top-0">
        <div className="flex items-center gap-1.5">
          <button
            ref={step > 1 ? backButtonRef : closeButtonRef}
            onClick={() => (step > 1 ? (contextualHaptic.stepProgress(), goBack()) : onClose())}
            className={buttonClass}
            aria-label={step > 1 ? "Go back" : "Close builder"}
          >
            {step > 1 ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
          <button
            ref={resetButtonRef}
            onClick={() => { contextualHaptic.resetAction(); onReset(); }}
            className={buttonClass}
            aria-label="Reset configuration"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center flex-1 mx-2">
          <h1 className="text-[10px] font-semibold truncate leading-none">Build Your <span className="text-primary">{vehicle.name}</span></h1>
          <p className="text-[8px] text-muted-foreground font-medium leading-none">Step {step} of 4</p>
        </div>
        <button
          ref={exitButtonRef}
          onClick={() => { contextualHaptic.exitAction(); onClose(); }}
          className={buttonClass}
          aria-label="Exit builder"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Hero image – no overlays, no vh, no crop */}
      <section className={`relative w-full ${heroH} bg-gradient-to-b from-black via-black to-background flex items-center justify-center border-b border-border/10`}>
        <img
          src={imgSrc}
          alt="Vehicle Preview"
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => { if (!e.currentTarget.src.includes(LOCAL_FALLBACK)) e.currentTarget.src = LOCAL_FALLBACK; }}
        />
      </section>

      {/* Progress */}
      <div className="bg-background border-b border-border/10">
        <MobileProgress currentStep={step} totalSteps={4} />
      </div>

      {/* Choices */}
      <div className="px-2 py-2 bg-background border-b border-border/10">
        <ChoiceCollector config={config} step={step} />
      </div>

      {/* Step Content */}
      <div className="px-2 py-2 bg-background">
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
      <div className="bg-background border-t border-border/20 px-2 py-2 sticky bottom-0">
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
