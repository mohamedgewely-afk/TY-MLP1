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
import type { BuilderConfig } from "../CarBuilder";

/** Normalize + DAM map (canonical keys) */
const normalizeColor = (s = "") =>
  s.replace(/exterior|interior/gi, "").replace(/\s+/g, " ").trim().toLowerCase();

const EXTERIOR_IMG: Record<string, string> = {
  "pearl white":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
  "midnight black":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
  "silver metallic":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
  // add your other color URLs when available
};

const FIRST_DAM = EXTERIOR_IMG["pearl white"] || Object.values(EXTERIOR_IMG)[0];
const LOCAL_FALLBACK = "/images/vehicles/generic.png";

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

const MobileCarBuilder: React.FC<MobileCarBuilderProps> = (props) => {
  const {
    vehicle, step, config, setConfig, showConfirmation, calculateTotalPrice,
    handlePayment, goBack, goNext, onClose, onReset, deviceCategory,
  } = props;

  const prefersReducedMotion = useReducedMotion();
  const { touchTarget } = useResponsiveSize();

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
    preventDefaultTouchmoveEvent: false,
  });

  const stageH = {
    smallMobile: "h-[44svh]",
    standardMobile: "h-[45svh]",
    largeMobile: "h-[46svh]",
    extraLargeMobile: "h-[47svh]",
    tablet: "h-[50svh]",
  }[deviceCategory] || "h-[45svh]";

  const buttonClass =
    `${touchTarget} rounded-xl bg-background border border-border/50 hover:border-primary/40 transition-all duration-150 flex items-center justify-center shadow-sm hover:shadow p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`;

  const colorKey = normalizeColor(config.exteriorColor);
  const vehicleImage = EXTERIOR_IMG[colorKey] || FIRST_DAM;

  const fade = { duration: prefersReducedMotion ? 0 : 0.24 };

  return (
    <motion.div
      ref={swipeableRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: fade }}
      exit={{ opacity: 0, transition: fade }}
      className="relative w-full min-h-[100svh] bg-background overflow-hidden"
      aria-label="Mobile vehicle builder"
    >
      {/* Top bar */}
      <div className="relative z-30 flex items-center justify-between bg-background border-b border-border/20 px-2 py-1">
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
          <h1 className="text-[10px] font-semibold truncate leading-none">
            Build Your <span className="text-primary">{vehicle.name}</span>
          </h1>
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

      {/* Cinematic Stage */}
      <section className={`relative ${stageH} w-full bg-black flex items-center justify-center`}>
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full opacity-20 blur-3xl bg-[radial-gradient(ellipse_at_center,theme(colors.primary/25),transparent_60%)]" />
        </div>
        <img
          src={vehicleImage}
          alt="Vehicle Preview"
          className="relative z-10 w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            if (!e.currentTarget.src.includes(LOCAL_FALLBACK)) e.currentTarget.src = LOCAL_FALLBACK;
          }}
        />
      </section>

      {/* Bottom sheet (sticky, with internal scroll) */}
      <section className="relative z-40 -mt-2">
        <div
          className="mx-auto w-full rounded-t-3xl bg-background border-t border-border/20 shadow-xl"
          style={{ paddingBottom: "max(env(safe-area-inset-bottom), 12px)" }}
        >
          <div className="pt-2 flex justify-center">
            <div className="h-1.5 w-10 rounded-full bg-muted" />
          </div>
          <div className="sticky top-0 z-10 bg-background/95 border-b border-border/10">
            <MobileProgress currentStep={step} totalSteps={4} />
          </div>
          <div className="max-h-[52svh] overflow-y-auto">
            <div className="px-3 py-2 border-b border-border/10">
              <ChoiceCollector config={config} step={step} />
            </div>
            <div className="px-3 py-2">
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
            <div className="px-3 py-2 border-t border-border/20">
              <MobileSummary
                config={config}
                totalPrice={calculateTotalPrice()}
                step={step}
                reserveAmount={2000}
                deviceCategory={deviceCategory}
                showPaymentButton={step !== 4}
              />
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default MobileCarBuilder;
