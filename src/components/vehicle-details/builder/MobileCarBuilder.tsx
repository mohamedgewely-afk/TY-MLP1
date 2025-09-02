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

const headerVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }
  }
};

const imageVariants = {
  hidden: { scale: 1.05, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }
  }
};

const contentVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.1 }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: -10,
    transition: { duration: 0.3 }
  }
};

const exteriorColorImageMap: Record<string, string> = {
  "Pearl White": "https://...white.jpg",
  "Midnight Black": "https://...black.jpg",
  "Silver Metallic": "https://...silver.jpg",
  "Deep Blue": "https://...blue.jpg",
  "Ruby Red": "https://...red.jpg"
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
  deviceCategory
}) => {
  const { touchTarget } = useResponsiveSize();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const register = (ref: React.RefObject<HTMLButtonElement>, type: "luxuryPress" | "premiumError") => {
      if (ref.current) {
        addLuxuryHapticToButton(ref.current, {
          type,
          onPress: true,
          onHover: false
        });
      }
    };
    register(backButtonRef, "luxuryPress");
    register(closeButtonRef, "luxuryPress");
    register(resetButtonRef, "premiumError");
    register(exitButtonRef, "luxuryPress");
  }, []);

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (step >= 1 && step < 4) {
        contextualHaptic.swipeNavigation();
        goNext();
      }
    },
    onSwipeRight: () => {
      if (step > 1) {
        contextualHaptic.swipeNavigation();
        goBack();
      } else {
        onClose();
      }
    },
    threshold: 80,
    preventDefaultTouchmoveEvent: false
  });

  const handleBackClick = () => {
    contextualHaptic.stepProgress();
    step > 1 ? goBack() : onClose();
  };

  const handleResetClick = () => {
    contextualHaptic.resetAction();
    onReset();
  };

  const handleExitClick = () => {
    contextualHaptic.exitAction();
    onClose();
  };

  const imageHeight = {
    smallMobile: "h-28",
    standardMobile: "h-32",
    largeMobile: "h-36",
    extraLargeMobile: "h-40",
    tablet: "h-44"
  }[deviceCategory] || "h-32";

  const vehicleImage = exteriorColorImageMap[config.exteriorColor] || exteriorColorImageMap["Pearl White"];

  const buttonClass = `${touchTarget} rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-background/95 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md p-2.5`;

  return (
    <motion.div
      ref={swipeableRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/5 overflow-y-auto flex flex-col"
    >
      {/* Header */}
      <motion.div variants={headerVariants} className="relative z-30 flex items-center justify-between bg-background/95 backdrop-blur-xl border-b border-border/20 px-2 py-1">
        <div className="flex items-center gap-1.5">
          <motion.button ref={step > 1 ? backButtonRef : closeButtonRef} onClick={handleBackClick} className={buttonClass}>
            {step > 1 ? <ArrowLeft className="h-4 w-4 text-foreground" /> : <X className="h-4 w-4 text-foreground" />}
          </motion.button>
          <motion.button ref={resetButtonRef} onClick={handleResetClick} className={buttonClass}>
            <RotateCcw className="h-4 w-4 text-foreground" />
          </motion.button>
        </div>
        <motion.div className="text-center flex-1 mx-2">
          <h1 className="text-[10px] font-semibold text-foreground truncate leading-none">
            Build Your <span className="text-primary">{vehicle.name}</span>
          </h1>
          <p className="text-[8px] text-muted-foreground font-medium leading-none">
            Step {step} of 4
          </p>
        </motion.div>
        <motion.button ref={exitButtonRef} onClick={handleExitClick} className={buttonClass}>
          <LogOut className="h-4 w-4 text-foreground" />
        </motion.button>
      </motion.div>

      {/* Vehicle Image */}
      <motion.div variants={imageVariants} className={`relative w-full ${imageHeight} overflow-hidden border-b border-border/10 flex-shrink-0 bg-muted/20`}>
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent z-10" />
        <motion.img
          src={vehicleImage}
          alt="Vehicle Preview"
          className="w-full h-full object-contain object-center scale-95"
          loading="lazy"
        />
        <motion.div className="absolute bottom-2 left-2 right-2 z-20">
          <div className="p-1.5 bg-background/80 backdrop-blur rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-[9px] font-semibold text-foreground truncate mb-0.5 leading-tight">
                  {config.modelYear} {vehicle.name}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5 text-[8px]">
                  <span>{config.grade}</span>
                  {config.grade && <><div className="w-0.5 h-0.5 bg-muted-foreground rounded-full"></div><span>{config.engine}</span></>}
                </div>
                <p className="text-muted-foreground text-[10px]">{config.exteriorColor} Exterior</p>
              </div>
              <div className="text-right ml-2">
                <div className="text-sm font-bold text-primary mb-0.5">AED {calculateTotalPrice().toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">From AED 2,850/mo</div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Progress */}
      <motion.div variants={contentVariants} className="flex-shrink-0 bg-background/95 border-b border-border/10">
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Choice Collector */}
      <motion.div variants={contentVariants} className="px-2 py-1 flex-shrink-0 bg-background/95 border-b border-border/10">
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Step Content */}
      <motion.div variants={contentVariants} className="flex-1 overflow-hidden bg-background/95 px-2 py-2">
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
      <motion.div variants={contentVariants} className="flex-shrink-0 relative z-30 bg-background/98 border-t border-border/20 backdrop-blur-xl px-2 py-1">
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
