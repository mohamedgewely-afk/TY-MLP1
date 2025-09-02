import React, { useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence, LazyMotion, domAnimation, useReducedMotion } from "framer-motion";
import { X, ArrowLeft, RotateCcw } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import CollapsibleSpecs from "./CollapsibleSpecs";
import type { BuilderConfig } from "../CarBuilder";

/** Normalize + DAM map */
const normalizeColor = (s = "") =>
  s.replace(/exterior|interior/gi, "").replace(/\s+/g, " ").trim().toLowerCase();

const EXTERIOR_IMG: Record<string, string> = {
  "pearl white":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
  "midnight black":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
  "silver metallic":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
  "deep blue":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/2a7a2a80-3c8f-4b20-bb3b-0c33b8b92a23/renditions/0fb2f3ae-1b0f-4a19-9a5a-9b7d3b116b2d?binary=true&mformat=true",
  "ruby red":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/0a8f9a6a-82db-4b52-9e75-f5c3b1f3a111/renditions/5a2c2e15-5f4a-4b46-9f0f-5b22f996bd01?binary=true&mformat=true",
};

const FIRST_DAM = EXTERIOR_IMG["pearl white"] || Object.values(EXTERIOR_IMG)[0];
const LOCAL_FALLBACK = "/images/vehicles/generic.jpg";

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
  vehicle, step, config, setConfig, showConfirmation,
  calculateTotalPrice, handlePayment, goBack, goNext, onClose, onReset,
}) => {
  const { deviceCategory } = useDeviceInfo();
  const prefersReducedMotion = useReducedMotion();

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

  const widths =
    {
      laptop: { left: "w-[62%]", right: "w-[38%]" },
      largeDesktop: { left: "w-[60%]", right: "w-[40%]" },
      default: { left: "w-[65%]", right: "w-[35%]" },
    }[deviceCategory] || { left: "w-[65%]", right: "w-[35%]" };

  const pad =
    {
      laptop: "p-8",
      largeDesktop: "p-12",
      default: "p-10",
    }[deviceCategory] || "p-10";

  const titleText =
    {
      laptop: "text-3xl",
      largeDesktop: "text-5xl",
      default: "text-4xl",
    }[deviceCategory] || "text-4xl";

  const t = { duration: prefersReducedMotion ? 0 : 0.3 };

  const handleBackClick = () => { contextualHaptic.stepProgress(); step > 1 ? goBack() : onClose(); };
  const handleResetClick = () => { contextualHaptic.resetAction(); onReset(); };

  const key = normalizeColor(config.exteriorColor);
  const imgSrc = EXTERIOR_IMG[key] || FIRST_DAM;

  return (
    <LazyMotion features={domAnimation} strict>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: t }}
        exit={{ opacity: 0, transition: t }}
        className="relative h-full w-full bg-background overflow-hidden flex"
      >
        {/* Left: Cinematic Stage */}
        <div className={`${widths.left} relative h-full overflow-hidden`}>
          {/* Toolbar */}
          <div className={`absolute top-0 left-0 right-0 z-30 flex items-center justify-between ${pad} bg-background/90 backdrop-blur-md border-b border-border/20`}>
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
            <h1 className={`${titleText} font-bold`}>
              Build Your <span className="text-primary">{vehicle.name}</span>
            </h1>
            <div className="w-32" />
          </div>

          {/* Ambient + Hero */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] rounded-full opacity-25 blur-3xl bg-[radial-gradient(ellipse_at_center,theme(colors.primary/20),transparent_60%)]" />
          </div>

          <div className="relative w-full h-full bg-black">
            <img
              src={imgSrc}
              alt="Vehicle Preview"
              className="w-full h-full object-contain"
              loading="lazy"
              onError={(e) => {
                if (!e.currentTarget.src.includes(LOCAL_FALLBACK)) e.currentTarget.src = LOCAL_FALLBACK;
              }}
            />

            {/* Minimal info chip */}
            <div className="absolute bottom-12 left-12 right-12 z-20 max-w-xl">
              <div className="bg-background/92 rounded-3xl px-8 py-6 border border-border/20 shadow">
                <h3 className="text-3xl font-bold mb-1">
                  {config.modelYear} {vehicle.name}
                </h3>
                <div className="text-lg text-muted-foreground mb-1">
                  {config.grade || "—"} · {config.engine}
                </div>
                <p className="text-muted-foreground mb-4 capitalize">{key} exterior</p>
                <div className="flex justify-between items-end">
                  <div className="text-4xl font-bold text-primary">AED {calculateTotalPrice().toLocaleString()}</div>
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
        <div className={`${widths.right} h-full flex flex-col bg-background border-l border-border/20`}>
          <Suspense fallback={<div className="p-6">Loading…</div>}>
            <div className="sticky top-0 z-20 bg-background/95 border-b border-border/20">
              <MobileProgress currentStep={step} totalSteps={4} />
            </div>

            <div className="px-8 py-6 border-b border-border/10">
              <ChoiceCollector config={config} step={step} />
              {step > 3 && config.modelYear && config.grade && (
                <div className="mt-4">
                  <CollapsibleSpecs config={config} />
                </div>
              )}
            </div>

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
