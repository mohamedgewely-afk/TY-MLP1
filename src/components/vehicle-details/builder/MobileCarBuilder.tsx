import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, RotateCcw, LogOut } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import { useSwipeable } from "@/hooks/use-swipeable";
import { contextualHaptic, addLuxuryHapticToButton } from "@/utils/haptic";

/** Types */
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
  "deep blue":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/2a7a2a80-3c8f-4b20-bb3b-0c33b8b92a23/renditions/0fb2f3ae-1b0f-4a19-9a5a-9b7d3b116b2d?binary=true&mformat=true",
  "ruby red":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/0a8f9a6a-82db-4b52-9e75-f5c3b1f3a111/renditions/5a2c2e15-5f4a-4b46-9f0f-5b22f996bd01?binary=true&mformat=true",
};

const FIRST_DAM_FALLBACK = exteriorColorImageMap["pearl white"] || Object.values(exteriorColorImageMap)[0];
const LOCAL_GENERIC_FALLBACK = "/images/vehicles/generic.png";

/** Motion (subtle/premium) */
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.25 } }, exit: { opacity: 0, transition: { duration: 0.18 } } };

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
  deviceCategory,
}) => {
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

  const handleBackClick = () => { contextualHaptic.stepProgress(); step > 1 ? goBack() : onClose(); };
  const handleResetClick = () => { contextualHaptic.resetAction(); onReset(); };
  const handleExitClick = () => { contextualHaptic.exitAction(); onClose(); };

  const stageHeight = {
    smallMobile: "h-[44vh]",
    standardMobile: "h-[45vh]",
    largeMobile: "h-[46vh]",
    extraLargeMobile: "h-[47vh]",
    tablet: "h-[48vh]",
  }[deviceCategory] || "h-[45vh]";

  const buttonClass =
    `${touchTarget} rounded-xl bg-background border border-border/50 hover:border-primary/40 transition-all duration-150 flex items-center justify-center shadow-sm hover:shadow p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`;

  const colorKey = normalizeColor(config.exteriorColor);
  const vehicleImage = exteriorColorImageMap[colorKey] || FIRST_DAM_FALLBACK;

  return (
    <motion.div
      ref={swipeableRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full min-h-screen bg-background overflow-hidden"
    >
      {/* Top toolbar */}
      <div className="relative z-30 flex items-center justify-between bg-background border-b border-border/20 px-2 py-1">
        <div className="flex items-center gap-1.5">
          <button
            ref={step > 1 ? backButtonRef : closeButtonRef}
            onClick={handleBackClick}
            className={buttonClass}
            aria-label={step > 1 ? "Go back" : "Close builder"}
          >
            {step > 1 ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
          <button
            ref={resetButtonRef}
            onClick={handleResetClick}
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
          onClick={handleExitClick}
          className={buttonClass}
          aria-label="Exit builder"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Cinematic Stage */}
      <section className={`relative ${stageHeight} w-full bg-black flex items-center justify-center`}>
        {/* ambient radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full opacity-25 blur-3xl bg-[radial-gradient(ellipse_at_center,theme(colors.primary/25),transparent_60%)]" />
        </div>

        <img
          src={vehicleImage}
          alt="Vehicle Preview"
          className="relative z-10 w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src.indexOf(LOCAL_GENERIC_FALLBACK) === -1) {
              e.currentTarget.src = LOCAL_GENERIC_FALLBACK;
            }
          }}
        />
      </section>

      {/* Bottom Sheet */}
      <section className="fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-auto w-full rounded-t-3xl bg-background border-t border-border/20 shadow-2xl">
          {/* drag handle look */}
          <div className="pt-2 flex justify-center">
            <div className="h-1.5 w-10 rounded-full bg-muted" />
          </div>

          <div className="sticky top-0 z-10 bg-background/95 border-b border-border/10">
            <MobileProgress currentStep={step} totalSteps={4} />
          </div>

          <div className="max-h-[52vh] overflow-y-auto">
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
