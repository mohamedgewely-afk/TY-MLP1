
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, Car, RotateCcw } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory, useResponsiveSize } from "@/hooks/use-device-info";
import { Button } from "@/components/ui/button";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import { useSwipeable } from "@/hooks/use-swipeable";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface ToyotaEnhancedMobileCarBuilderProps {
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
  deviceCategory: DeviceCategory;
}

const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.2, staggerChildren: 0.05 }
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 }
};

const ToyotaEnhancedMobileCarBuilder: React.FC<ToyotaEnhancedMobileCarBuilderProps> = ({
  vehicle,
  step,
  config,
  setConfig,
  calculateTotalPrice,
  handlePayment,
  goBack,
  goNext,
  onClose,
  deviceCategory
}) => {
  const { containerPadding, textSize, mobilePadding } = useResponsiveSize();

  const resetConfig = () => {
    setConfig({
      modelYear: "2025",
      engine: "3.5L V6",
      grade: "Base",
      exteriorColor: "Pearl White",
      interiorColor: "Black Leather",
      accessories: []
    });
  };

  const getGradeImage = (grade: string) => {
    const gradeImages = {
      "Base": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-base-grade.jpg",
      "SE": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-se-grade.jpg",
      "XLE": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-xle-grade.jpg",
      "Limited": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-limited-grade.jpg"
    };
    return gradeImages[grade as keyof typeof gradeImages] || gradeImages["Base"];
  };

  const getCurrentVehicleImage = () => {
    // Grade-specific images
    const gradeImages = {
      "Base": {
        "Pearl White": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/base-white.jpg",
        "Midnight Black": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/base-black.jpg"
      },
      "SE": {
        "Pearl White": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/se-white.jpg",
        "Midnight Black": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/se-black.jpg"
      },
      "XLE": {
        "Pearl White": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/xle-white.jpg",
        "Midnight Black": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/xle-black.jpg"
      },
      "Limited": {
        "Pearl White": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/limited-white.jpg",
        "Midnight Black": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/limited-black.jpg"
      }
    };

    const fallbackImages = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" }
    ];

    const gradeSpecificImage = gradeImages[config.grade as keyof typeof gradeImages]?.[config.exteriorColor as keyof typeof gradeImages.Base];
    if (gradeSpecificImage) return gradeSpecificImage;

    const fallbackImage = fallbackImages.find(c => c.name === config.exteriorColor);
    return fallbackImage?.image || fallbackImages[0].image;
  };

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (step < 7) goNext();
    },
    onSwipeRight: () => {
      if (step > 1) goBack();
    },
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full bg-background overflow-hidden flex flex-col mobile-viewport"
      ref={swipeableRef}
    >
      {/* Header */}
      <motion.header 
        variants={itemVariants}
        className={`flex items-center justify-between bg-toyota-white border-b border-gray-200 toyota-spacing-md ${containerPadding} safe-area-inset-top`}
      >
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className="toyota-spacing-sm toyota-border-radius bg-gray-100 hover:bg-gray-200 flex items-center justify-center touch-target transition-colors"
          whileTap={{ scale: 0.98 }}
        >
          {step > 1 ? (
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          ) : (
            <X className="h-5 w-5 text-gray-700" />
          )}
        </motion.button>

        <div className="text-center flex-1 mx-4">
          <h1 className={`${textSize.base} font-semibold text-foreground`}>
            Build Your {vehicle.name}
          </h1>
          <p className="text-xs text-toyota-red font-medium">
            Step {step} of 7
          </p>
        </div>

        <Button
          onClick={resetConfig}
          variant="outline"
          size="sm"
          className="p-2 h-11 w-11"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </motion.header>

      {/* Vehicle Image Section - Fixed height and proper aspect ratio */}
      <motion.section 
        variants={itemVariants}
        className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden border-b border-gray-200"
        key={config.exteriorColor + config.grade}
      >
        <motion.img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Grade Badge */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center gap-2 bg-toyota-white/95 toyota-border-radius toyota-spacing-sm shadow-sm">
            <img 
              src={getGradeImage(config.grade)}
              alt={config.grade}
              className="w-6 h-6 object-contain"
            />
            <span className="text-xs font-medium text-gray-700">{config.grade}</span>
          </div>
        </div>
        
        {/* Vehicle Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="bg-toyota-white/95 toyota-border-radius toyota-spacing-sm">
            <div className="flex items-center gap-2">
              <Car className="h-4 w-4 text-toyota-red" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{config.modelYear} {vehicle.name}</h3>
                <p className="text-xs text-toyota-red">{config.grade} • {config.engine}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Progress */}
      <motion.div variants={itemVariants} className="toyota-spacing-sm border-b border-gray-100">
        <MobileProgress currentStep={step} totalSteps={7} />
      </motion.div>

      {/* Choice Collector */}
      <motion.div variants={itemVariants} className={`${containerPadding} toyota-spacing-sm border-b border-gray-100`}>
        <ChoiceCollector config={config} step={step} />
      </motion.div>

      {/* Swipe Indicator */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-center toyota-spacing-sm border-b border-gray-100"
      >
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>← Swipe to navigate →</span>
        </div>
      </motion.div>

      {/* Step Content */}
      <motion.div variants={itemVariants} className="flex-1 overflow-hidden">
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
      </motion.div>

      {/* Summary */}
      <motion.footer 
        variants={itemVariants}
        className="bg-toyota-white border-t border-gray-200 safe-area-inset-bottom"
      >
        <MobileSummary 
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
          reserveAmount={5000}
          deviceCategory={deviceCategory}
        />
      </motion.footer>
    </motion.div>
  );
};

export default ToyotaEnhancedMobileCarBuilder;
