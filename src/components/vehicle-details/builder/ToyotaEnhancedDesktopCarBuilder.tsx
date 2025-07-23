
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, RotateCcw, Car } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { Button } from "@/components/ui/button";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import CollapsibleSpecs from "./CollapsibleSpecs";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface ToyotaEnhancedDesktopCarBuilderProps {
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
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, staggerChildren: 0.1 }
  },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.2 } }
};

const leftPanelVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

const rightPanelVariants = {
  hidden: { x: 50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4 } }
};

const ToyotaEnhancedDesktopCarBuilder: React.FC<ToyotaEnhancedDesktopCarBuilderProps> = ({
  vehicle,
  step,
  config,
  setConfig,
  calculateTotalPrice,
  handlePayment,
  goBack,
  goNext,
  onClose
}) => {
  const { deviceCategory } = useDeviceInfo();
  
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
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
      { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" }
    ];

    const gradeSpecificImage = gradeImages[config.grade as keyof typeof gradeImages]?.[config.exteriorColor as keyof typeof gradeImages.Base];
    if (gradeSpecificImage) return gradeSpecificImage;

    const fallbackImage = fallbackImages.find(c => c.name === config.exteriorColor);
    return fallbackImage?.image || fallbackImages[0].image;
  };

  const showSpecs = step > 3 && (config.modelYear && config.grade);
  const reserveAmount = 5000;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative h-full w-full overflow-hidden flex bg-gray-50"
    >
      {/* Left Side - Car Image */}
      <motion.div 
        variants={leftPanelVariants}
        className="w-1/2 h-full relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200"
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 bg-toyota-white/95 border-b border-gray-200">
          <motion.button
            onClick={step > 1 ? goBack : onClose}
            className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {step > 1 ? (
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            ) : (
              <X className="h-6 w-6 text-gray-700" />
            )}
          </motion.button>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Build Your {vehicle.name}
            </h1>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-sm text-toyota-red font-medium">
                Step {step} of 7
              </span>
            </div>
          </div>

          <Button
            onClick={resetConfig}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Car Image */}
        <motion.div 
          className="absolute inset-0 pt-20 overflow-hidden"
          key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        >
          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
          />
          
          {/* Grade Badge */}
          <div className="absolute top-6 right-6">
            <div className="flex items-center gap-3 bg-toyota-white/95 toyota-border-radius-lg p-4 shadow-lg">
              <img 
                src={getGradeImage(config.grade)}
                alt={config.grade}
                className="w-8 h-8 object-contain"
              />
              <span className="text-sm font-medium text-gray-700">{config.grade}</span>
            </div>
          </div>
          
          {/* Vehicle Info */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="bg-toyota-white/95 toyota-border-radius-lg p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <Car className="h-6 w-6 text-toyota-red" />
                <h3 className="text-xl font-bold text-gray-900">
                  {config.modelYear} {vehicle.name}
                </h3>
              </div>
              <p className="text-toyota-red text-lg font-medium mb-2">
                {config.grade} • {config.engine}
              </p>
              <p className="text-gray-600 mb-4">
                {config.exteriorColor} Exterior
              </p>
              <div className="text-3xl font-bold text-toyota-red">
                AED {calculateTotalPrice().toLocaleString()}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Right Side - Configuration */}
      <motion.div 
        variants={rightPanelVariants}
        className="w-1/2 h-full flex flex-col bg-toyota-white"
      >
        {/* Progress */}
        <div className="px-6 py-4 border-b border-gray-200">
          <MobileProgress currentStep={step} totalSteps={7} />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Choice Collector & Specs */}
          <div className="px-6 py-4 border-b border-gray-200">
            <ChoiceCollector config={config} step={step} />
            {showSpecs && (
              <CollapsibleSpecs config={config} />
            )}
          </div>

          {/* Step Content */}
          <div className="flex-1 overflow-hidden">
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

          {/* Summary */}
          <div className="border-t border-gray-200">
            <MobileSummary 
              config={config}
              totalPrice={calculateTotalPrice()}
              step={step}
              reserveAmount={reserveAmount}
              deviceCategory={deviceCategory}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ToyotaEnhancedDesktopCarBuilder;
