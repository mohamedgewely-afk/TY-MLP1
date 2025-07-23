
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, RotateCcw } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useDeviceInfo } from "@/hooks/use-device-info";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import ChoiceCollector from "./ChoiceCollector";
import CollapsibleSpecs from "./CollapsibleSpecs";
import BuilderNavigation from "./BuilderNavigation";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
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
  onReset
}) => {
  const { deviceCategory } = useDeviceInfo();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);

  // Desktop-specific haptic feedback
  useEffect(() => {
    if (backButtonRef.current) {
      addLuxuryHapticToButton(backButtonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: true
      });
    }
    if (closeButtonRef.current) {
      addLuxuryHapticToButton(closeButtonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: true
      });
    }
    if (resetButtonRef.current) {
      addLuxuryHapticToButton(resetButtonRef.current, {
        type: 'premiumError',
        onPress: true,
        onHover: true
      });
    }
  }, []);
  
  const getCurrentVehicleImage = () => {
    const exteriorColors = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
      { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  };

  const showSpecs = step > 3 && (config.modelYear && config.grade);
  const reserveAmount = 5000;

  const handleBackClick = () => {
    contextualHaptic.stepProgress();
    if (step > 1) {
      goBack();
    } else {
      onClose();
    }
  };

  const handleResetClick = () => {
    contextualHaptic.resetAction();
    onReset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="relative h-full w-full bg-background overflow-hidden flex"
    >
      {/* Enhanced Left Side - Interactive Car Image */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="w-1/2 h-full relative bg-gradient-to-br from-muted/20 to-card/20 overflow-hidden"
      >
        {/* Premium Header with back/close and reset buttons */}
        <motion.div 
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 bg-background/80 backdrop-blur-sm border-b border-border/20"
        >
          <div className="flex items-center gap-4">
            <motion.button
              ref={step > 1 ? backButtonRef : closeButtonRef}
              onClick={handleBackClick}
              className="p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-border/30 hover:bg-secondary/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {step > 1 ? (
                <ArrowLeft className="h-6 w-6 text-foreground" />
              ) : (
                <X className="h-6 w-6 text-foreground" />
              )}
            </motion.button>
            
            <motion.button
              ref={resetButtonRef}
              onClick={handleResetClick}
              className="p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-border/30 hover:bg-secondary/20 transition-all duration-300 cursor-pointer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw className="h-6 w-6 text-foreground" />
            </motion.button>
          </div>

          <motion.div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">
              Build Your {vehicle.name}
            </h1>
            <p className="text-sm text-primary font-medium">
              Step {step} of 4
            </p>
          </motion.div>

          <div className="w-32" />
        </motion.div>

        {/* Enhanced Car Image with minimal effects */}
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-full h-full overflow-hidden"
          key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        >
          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="w-full h-full object-contain"
            initial={{ scale: 1.02, opacity: 0, filter: "blur(2px)" }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              filter: "blur(0px)"
            }}
            transition={{ 
              duration: 0.4, 
              delay: 0.4
            }}
            whileHover={{
              scale: 1.01,
              transition: { duration: 0.3 }
            }}
          />
          
          {/* Add Navigation Buttons */}
          <BuilderNavigation
            currentStep={step}
            totalSteps={4}
            onPrevStep={goBack}
            onNextStep={goNext}
          />
          
          {/* Minimal gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/10" />
          
          {/* Enhanced Vehicle Info Overlay */}
          <motion.div 
            className="absolute bottom-8 left-8 right-8 text-foreground"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <motion.div 
              className="bg-background/90 backdrop-blur-sm rounded-2xl p-8 border border-border/30 max-w-md shadow-lg"
              whileHover={{ 
                scale: 1.02,
                y: -4
              }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-2">
                {config.modelYear} {vehicle.name}
              </h3>
              <p className="text-primary text-lg font-medium">{config.grade} • {config.engine}</p>
              <p className="text-muted-foreground text-base">{config.exteriorColor} Exterior</p>
              <div className="mt-4 text-3xl font-black text-primary">
                AED {calculateTotalPrice().toLocaleString()}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Right Side - Configuration Panel */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="w-1/2 h-full flex flex-col bg-background/95 backdrop-blur-sm border-l border-border/30"
      >
        {/* Enhanced Progress */}
        <motion.div 
          className="px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.25 }}
        >
          <MobileProgress currentStep={step} totalSteps={4} />
        </motion.div>

        {/* Enhanced Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Choice Collector & Specs */}
          <motion.div 
            className="px-6 py-4 bg-background/80 backdrop-blur-sm border-b border-border/20"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.25 }}
          >
            <ChoiceCollector config={config} step={step} />
            {showSpecs && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.25 }}
              >
                <CollapsibleSpecs config={config} />
              </motion.div>
            )}
          </motion.div>

          {/* Enhanced Step Content */}
          <motion.div 
            className="flex-1 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
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

          {/* Enhanced Summary - show payment button only on step 4 */}
          <motion.div 
            className="bg-background/95 backdrop-blur-sm border-t border-border/30"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <MobileSummary 
              config={config}
              totalPrice={calculateTotalPrice()}
              step={step}
              reserveAmount={reserveAmount}
              deviceCategory={deviceCategory}
              showPaymentButton={step === 4}
            />
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DesktopCarBuilder;
