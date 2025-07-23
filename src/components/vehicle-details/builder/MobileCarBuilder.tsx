
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { useToast } from "@/hooks/use-toast";
import { DeviceCategory } from "@/hooks/use-device-info";
import { useLanguage } from "@/contexts/LanguageContext";
import { hapticFeedback } from "@/utils/haptic";
import MobileStepContent from "./MobileStepContent";
import MobileProgress from "./MobileProgress";
import MobileSummary from "./MobileSummary";
import OrderConfirmation from "./OrderConfirmation";
import SwipeableStepWrapper from "./steps/SwipeableStepWrapper";

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
  deviceCategory: DeviceCategory;
}

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
  deviceCategory
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);

  // Enhanced gesture controls
  const handleSwipeLeft = () => {
    if (isSwipeEnabled && step < 4) {
      hapticFeedback.light();
      goNext();
    }
  };

  const handleSwipeRight = () => {
    if (isSwipeEnabled && step > 1) {
      hapticFeedback.light();
      goBack();
    }
  };

  const handleReset = () => {
    hapticFeedback.medium();
    setConfig({
      modelYear: "2025",
      engine: "3.5L V6",
      grade: "Base",
      exteriorColor: "Pearl White",
      interiorColor: "Black Leather",
      accessories: []
    });
    toast({
      title: "Configuration Reset",
      description: "All selections have been reset to default values.",
    });
  };

  // Handle exit with haptic feedback
  const handleExit = () => {
    hapticFeedback.light();
    onClose();
  };

  const getCurrentVehicleImage = () => {
    const colorImages = {
      "Pearl White": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
      "Midnight Black": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      "Silver Metallic": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      "Ruby Red": "https://images.unsplash.com/photo-1494976688153-c785a34b9f61?auto=format&fit=crop&w=800&q=80",
      "Ocean Blue": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
      "Storm Gray": "https://images.unsplash.com/photo-1570409073740-2f53eca0f9dd?auto=format&fit=crop&w=800&q=80"
    };
    return colorImages[config.exteriorColor as keyof typeof colorImages] || vehicle.image;
  };

  if (showConfirmation) {
    return (
      <OrderConfirmation 
        isOpen={showConfirmation}
        vehicle={vehicle} 
        config={config} 
        totalPrice={calculateTotalPrice()} 
        getCurrentVehicleImage={getCurrentVehicleImage}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background/98 to-muted/30 relative overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-primary/3 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
      
      {/* Enhanced Header */}
      <motion.div 
        className="sticky top-0 z-50 bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="hover:bg-muted/50 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-bold text-foreground">Build Your {vehicle.name}</h1>
              <p className="text-sm text-muted-foreground">Step {step} of 4</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="opacity-70 hover:opacity-100 transition-opacity duration-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <MobileProgress currentStep={step} totalSteps={4} />
      </motion.div>

      {/* Enhanced Content Area with Swipe Support */}
      <div className="flex-1 relative overflow-hidden">
        <SwipeableStepWrapper
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          className="h-full"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ 
                duration: 0.4, 
                type: "spring",
                stiffness: 120,
                damping: 20
              }}
              className="h-full"
              style={{
                willChange: 'transform, opacity',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
            >
              <MobileStepContent
                step={step}
                config={config}
                setConfig={setConfig}
                vehicle={vehicle}
                calculateTotalPrice={calculateTotalPrice}
                handlePayment={handlePayment}
                goNext={goNext}
                deviceCategory={deviceCategory}
              />
            </motion.div>
          </AnimatePresence>
        </SwipeableStepWrapper>
      </div>

      {/* Enhanced Summary */}
      <motion.div 
        className="sticky bottom-0 z-50 bg-gradient-to-t from-background/98 via-background/95 to-background/90 backdrop-blur-xl border-t border-border/50 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <MobileSummary
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
          reserveAmount={5000}
          deviceCategory={deviceCategory}
        />
      </motion.div>

      {/* Gesture Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 opacity-30 pointer-events-none">
        {step > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-xs text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Swipe</span>
          </motion.div>
        )}
        {step < 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center text-xs text-muted-foreground"
          >
            <span>Swipe</span>
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MobileCarBuilder;
