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

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
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

/** Normalize + use canonical keys for the DAM map */
const normalizeColor = (s = "") =>
  s.replace(/exterior|interior/gi, "").replace(/\s+/g, " ").trim().toLowerCase();

/** DAM images: same set used on desktop */
const exteriorColorImageMap: Record<string, string> = {
  "pearl white":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
  "midnight black":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
  "silver metallic":
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
};
const FIRST_DAM = exteriorColorImageMap["pearl white"] || Object.values(exteriorColorImageMap)[0];
const LOCAL_FALLBACK = "/images/vehicles/generic.png";

/** Motion (subtle, safe) */
const headerVariants = { hidden: { y: -8, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.18 } } };
const imageVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.22 } } };
const contentVariants = { hidden: { y: 8, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.18 } } };
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.2, staggerChildren: 0.04 } }, exit: { opacity: 0, transition: { duration: 0.15 } } };

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

  /** Fixed heights per device class (no vh, no jank) */
  const imageHeight = {
    smallMobile: "h-40",
    standardMobile: "h-44",
    largeMobile: "h-52",
    extraLargeMobile: "h-56",
    tablet: "h-64",
  }[deviceCategory] || "h-44";

  const vehicleImage = exteriorColorImageMap[normalizeColor(config.exteriorColor)] || FIRST_DAM;

  const buttonClass =
    `${touchTarget} rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-all duration-150 flex items-center justify-center shadow-sm hover:shadow p-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50`;

  return (
    <motion.div
      ref={swipeableRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full min-h-screen bg-background overflow-y-auto flex flex-col"
    >
      {/* Header */}
      <motion.div variants={headerVariants} className="sticky top-0 z-30 flex items-center justify-between bg-background border-b border-border/20 px-2 py-1">
        <div className="flex items-center gap-1.5">
          <motion.button ref={step > 1 ? backButtonRef : closeButtonRef} onClick={handleBackClick} className={buttonClass}>
            {step > 1 ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </motion.button>
          <motion.button ref={resetButtonRef} onClick={handleResetClick} className={buttonClass}>
            <RotateCcw className="h-4 w-4" />
          </motion.button>
        </div>
        <motion.div className="text-center flex-1 mx-2">
          <h1 className="text-[10px] font-semibold truncate leading-none">
            Build Your <span className="text-primary">{vehicle.name}</span>
          </h1>
          <p className="text-[8px] text-muted-foreground font-medium leading-none">Step {step} of 4</p>
        </motion.div>
        <motion.button ref={exitButtonRef} onClick={handleExitClick} className={buttonClass}>
          <LogOut className="h-4 w-4" />
        </motion.button>
      </motion.div>

      {/* Vehicle Image */}
      <motion.div variants={imageVariants} className={`relative w-full ${imageHeight} overflow-hidden border-b border-border/10 flex-shrink-0 bg-black`}>
        <img
          src={vehicleImage}
          alt="Vehicle Preview"
          className="w-full h-full object-contain"
          loading="lazy"
          onError={(e) => { if (!e.currentTarget.src.includes(LOCAL_FALLBACK)) e.currentTarget.src = LOCAL_FALLBACK; }}
        />
      </motion.div>

      {/* Progress */}
      <motion.div variants={contentVariants} className="flex-shrink-0 bg-background border-b border-border/10">
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Choice Collector */}
      <motion.div variants={contentVariants} className="px-2 py-2 flex-shrink-0 bg-background border-b border-border/10">
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Step Content */}
      <motion.div variants={contentVariants} className="flex-1 overflow-hidden bg-background px-2 py-2">
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
      </motion.div>

      {/* Summary */}
      <motion.div variants={contentVariants} className="flex-shrink-0 bg-background border-t border-border/20 px-2 py-2 sticky bottom-0">
        <MobileSummary
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
          reserveAmount={2000}
          deviceCategory={deviceCategory}
          showPaymentButton={step !== 4}
        />
      </motion.div>
    </motion.div>
  );
};

export default MobileCarBuilder;
