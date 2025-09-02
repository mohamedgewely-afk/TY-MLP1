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

/** Normalization + DAM map (same host, premium reliability) */
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
const LOCAL_GENERIC_FALLBACK = "/images/vehicles/generic.png";

/** Motion (premium but restrained) */
const headerVariants = { hidden: { y: -8, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.22 } } };
const stageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.28 } } };
const contentVariants = { hidden: { y: 8, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.22 } } };
const containerVariants = {
  hidden: { opacity: 0, scale: 0.99, y: 4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.26, staggerChildren: 0.06 } },
  exit: { opacity: 0, scale: 0.99, y: -4, transition: { duration: 0.18 } },
};

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
    smallMobile: "h-[40vh]",
    standardMobile: "h-[42vh]",
    largeMobile: "h-[44vh]",
    extraLargeMobile: "h-[46vh]",
    tablet: "h-[48vh]",
  }[deviceCategory] || "h-[42vh]";

  const buttonClass =
    `${touchTarget} rounded-xl bg-background border border-border/50 hover:border-primary/40 transition-all duration-150 flex items-center justify-center shadow-sm hover:shadow p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`;

  const key = normalizeColor(config.exteriorColor);
  const vehicleImage = exteriorColorImageMap[key] || FIRST_DAM_FALLBACK;

  return (
    <motion.div
      ref={swipeableRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full min-h-screen bg-background overflow-hidden"
    >
      {/* Header */}
      <motion.div
        variants={headerVariants}
        className="relative z-30 flex items-center justify-between bg-background/95 border-b border-border/20 px-2 py-1"
        aria-label="Builder header"
      >
        <div className="flex items-center gap-1.5">
          <motion.button
            ref={step > 1 ? backButtonRef : closeButtonRef}
            onClick={handleBackClick}
            className={buttonClass}
            aria-label={step > 1 ? "Go back" : "Close builder"}
          >
            {step > 1 ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </motion.button>
          <motion.button
            ref={resetButtonRef}
            onClick={handleResetClick}
            className={buttonClass}
            aria-label="Reset configuration"
          >
            <RotateCcw className="h-4 w-4" />
          </motion.button>
        </div>
        <div className="text-center flex-1 mx-2">
          <h1 className="text-[10px] font-semibold truncate leading-none">
            Build Your <span className="text-primary">{vehicle.name}</span>
          </h1>
          <p className="text-[8px] text-muted-foreground font-medium leading-none">Step {step} of 4</p>
        </div>
        <motion.button
          ref={exitButtonRef}
          onClick={handleExitClick}
          className={buttonClass}
          aria-label="Exit builder"
        >
          <LogOut className="h-4 w-4" />
        </motion.button>
      </motion.div>

      {/* Cinematic Stage */}
      <motion.section
        variants={stageVariants}
        className={`relative ${stageHeight} w-full flex items-center justify-center bg-gradient-to-b from-muted/10 via-background to-background`}
      >
        {/* Ambient glow */}
        <div className="absolute -z-0 inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full opacity-30 blur-3xl bg-[radial-gradient(ellipse_at_center,theme(colors.primary/25),transparent_55%)]" />
        </div>

        {/* Vehicle image (persist across steps) */}
        <img
          src={vehicleImage}
          alt="Vehicle Preview"
          className="relative z-10 w-full h-full object-contain"
          loading="lazy"
          onError={(e) => {
            if (e.currentTarget.src !== window.location.origin + LOCAL_GENERIC_FALLBACK) {
              e.currentTarget.src = LOCAL_GENERIC_FALLBACK;
            }
          }}
        />
      </motion.section>

      {/* Bottom Sheet: Progress + Choices + Step Content + Summary */}
      <section className="relative -mt-3 rounded-t-3xl bg-background border-t border-border/20 shadow-xl">
        <div className="sticky top-0 z-10 border-b border-border/10">
          <MobileProgress currentStep={step} totalSteps={4} />
        </div>

        <div className="px-2 py-2 border-b border-border/10">
          <ChoiceCollector config={config} step={step} />
        </div>

        <div className="px-2 py-2">
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

        <div className="px-2 py-2 border-t border-border/20">
          <MobileSummary
            config={config}
            totalPrice={calculateTotalPrice()}
            step={step}
            reserveAmount={2000}
            deviceCategory={deviceCategory}
            showPaymentButton={step !== 4}
          />
        </div>
      </section>
    </motion.div>
  );
};

export default MobileCarBuilder;
