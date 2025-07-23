
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { hapticFeedback } from "@/utils/haptic";
import BuilderProgress from "./BuilderProgress";
import StepContent from "./StepContent";
import ChoicesSummary from "./ChoicesSummary";
import OrderConfirmation from "./OrderConfirmation";

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
  onClose
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();

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

  const handleExit = () => {
    hapticFeedback.light();
    onClose();
  };

  if (showConfirmation) {
    return (
      <OrderConfirmation 
        vehicle={vehicle} 
        config={config} 
        totalPrice={calculateTotalPrice()} 
        onClose={onClose}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background/98 to-muted/20 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-primary/3 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
      
      {/* Enhanced Header */}
      <motion.div 
        className="sticky top-0 z-50 bg-gradient-to-r from-background/95 via-background/98 to-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExit}
              className="hover:bg-muted/50 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Build Your {vehicle.name}</h1>
              <p className="text-sm text-muted-foreground">Customize every detail to your preference</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="opacity-70 hover:opacity-100 transition-opacity duration-200"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="opacity-70 hover:opacity-100 transition-opacity duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        
        <div className="px-6 pb-4">
          <BuilderProgress currentStep={step} totalSteps={4} />
        </div>
      </motion.div>

      {/* Enhanced Main Content */}
      <div className="flex-1 flex relative">
        {/* Left Panel - Step Content */}
        <motion.div 
          className="flex-1 p-6 overflow-y-auto relative"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.4,
                  type: "spring",
                  stiffness: 120,
                  damping: 20
                }}
                style={{
                  willChange: 'transform, opacity',
                  backfaceVisibility: 'hidden',
                  transform: 'translateZ(0)'
                }}
              >
                <StepContent
                  step={step}
                  config={config}
                  setConfig={setConfig}
                  vehicle={vehicle}
                  calculateTotalPrice={calculateTotalPrice}
                  handlePayment={handlePayment}
                  goBack={goBack}
                  goNext={goNext}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Panel - Enhanced Summary */}
        <motion.div 
          className="w-96 bg-gradient-to-b from-card/50 via-card/70 to-card/50 backdrop-blur-xl border-l border-border/50 shadow-xl"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="sticky top-0 p-6 h-full overflow-y-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl" />
              <ChoicesSummary
                vehicle={vehicle}
                config={config}
                totalPrice={calculateTotalPrice()}
                currentStep={step}
                onStepClick={(stepNumber) => {
                  // Allow jumping to completed steps
                  if (stepNumber < step) {
                    // Implementation for step jumping would go here
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DesktopCarBuilder;
