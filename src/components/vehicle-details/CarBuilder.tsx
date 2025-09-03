
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MobileDialog, MobileDialogContent } from "@/components/ui/mobile-dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { VehicleModel } from "@/types/vehicle";
import { useToast } from "@/hooks/use-toast";
import { useDeviceInfo } from "@/hooks/use-device-info";
import MobileCarBuilder from "./builder/MobileCarBuilder";
import DesktopCarBuilder from "./builder/DesktopCarBuilder";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface CarBuilderProps {
  vehicle: VehicleModel;
  isOpen: boolean;
  onClose: () => void;
}

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

const CarBuilder: React.FC<CarBuilderProps> = ({ vehicle, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [config, setConfig] = useState<BuilderConfig>({
    modelYear: "2025",
    engine: "3.5L V6",
    grade: "",
    exteriorColor: "Pearl White",
    interiorColor: "",
    accessories: []
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const { isMobile, deviceCategory, isInitialized } = useDeviceInfo();

  // Optimized reset handler - prevent freezing with immediate state updates
  const handleReset = useCallback(async () => {
    if (isResetting) return; // Prevent multiple resets
    
    try {
      setIsResetting(true);
      
      // Immediate state updates to prevent UI freezing
      const defaultConfig = {
        modelYear: "2025",
        engine: "3.5L V6",
        grade: "",
        exteriorColor: "Pearl White",
        interiorColor: "",
        accessories: []
      };
      
      setConfig(defaultConfig);
      setStep(1);
      setShowConfirmation(false);
      setShowResetDialog(false);
      
      toast({
        title: "Configuration Reset",
        description: "Your vehicle configuration has been reset to default values.",
      });
    } catch (error) {
      toast({
        title: "Reset Error",
        description: "There was an issue resetting the configuration.",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  }, [toast, isResetting]);

  const calculateTotalPrice = useCallback(() => {
    let basePrice = vehicle.price;
    
    // Engine pricing
    const enginePricing = { "3.5L V6": 0, "4.0L V6": 5000, "2.5L Hybrid": 3000 };
    basePrice += enginePricing[config.engine as keyof typeof enginePricing] || 0;
    
    // Grade pricing
    const gradePricing = { "Base": 0, "SE": 2000, "XLE": 4000, "Limited": 6000, "Platinum": 10000 };
    basePrice += gradePricing[config.grade as keyof typeof gradePricing] || 0;
    
    // Exterior colors pricing
    const exteriorColors = [
      { name: "Pearl White", price: 0 },
      { name: "Midnight Black", price: 500 },
      { name: "Silver Metallic", price: 300 },
      { name: "Deep Blue", price: 400 },
      { name: "Ruby Red", price: 600 }
    ];
    
    // Interior pricing
    const interiorPricing = { "Black Leather": 0, "Beige Leather": 800, "Gray Fabric": -500 };
    
    const accessories = [
      { name: "Premium Sound System", price: 1200 },
      { name: "Sunroof", price: 800 },
      { name: "Navigation System", price: 600 },
      { name: "Heated Seats", price: 400 },
      { name: "Backup Camera", price: 300 },
      { name: "Alloy Wheels", price: 900 }
    ];
    
    const exteriorColorPrice = exteriorColors.find(c => c.name === config.exteriorColor)?.price || 0;
    const interiorColorPrice = interiorPricing[config.interiorColor as keyof typeof interiorPricing] || 0;
    const accessoriesPrice = config.accessories.reduce((total, accessory) => {
      const accessoryData = accessories.find(a => a.name === accessory);
      return total + (accessoryData?.price || 0);
    }, 0);
    
    return basePrice + exteriorColorPrice + interiorColorPrice + accessoriesPrice;
  }, [config, vehicle.price]);

  const handlePayment = useCallback(() => {
    toast({
      title: "Processing Payment...",
      description: "Please wait while we process your order.",
    });
    
    setTimeout(() => {
      setShowConfirmation(true);
      toast({
        title: "Order Confirmed!",
        description: "Your vehicle configuration has been saved and order placed.",
      });
    }, 2000);
  }, [toast]);

  const goBack = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const goNext = useCallback(() => {
    if (step < 4) setStep(step + 1);
  }, [step]);

  const updateConfig = useCallback((value: React.SetStateAction<BuilderConfig>) => {
    setConfig(value);
  }, []);

  // Show loading state until device detection completes
  if (!isInitialized) {
    const LoadingDialog = isMobile ? MobileDialog : Dialog;
    const LoadingContent = isMobile ? MobileDialogContent : DialogContent;
    
    return (
      <LoadingDialog open={isOpen} onOpenChange={onClose}>
        <LoadingContent className={isMobile ? "" : "max-w-full max-h-full h-screen w-screen p-0 border-0 bg-background overflow-hidden"}>
          <VisuallyHidden>
            <DialogTitle>Loading Car Builder</DialogTitle>
            <DialogDescription>Please wait while we initialize the car builder.</DialogDescription>
          </VisuallyHidden>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </LoadingContent>
      </LoadingDialog>
    );
  }

  return (
    <>
      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset your vehicle configuration? This will clear all your selections and return to the first step.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReset}
              disabled={isResetting}
              className="relative min-h-[44px] min-w-[44px]"
            >
              {isResetting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Resetting...
                </>
              ) : (
                'Reset'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Builder Dialog */}
      {isMobile ? (
        <MobileDialog open={isOpen} onOpenChange={onClose}>
          <MobileDialogContent>
            <VisuallyHidden>
              <DialogTitle>Build Your {vehicle.name}</DialogTitle>
              <DialogDescription>
                Customize your {vehicle.name} by selecting model year, engine, grade, colors, and accessories.
              </DialogDescription>
            </VisuallyHidden>
            
            <AnimatePresence mode="wait">
              <MobileCarBuilder
                key="mobile"
                vehicle={vehicle}
                step={step}
                config={config}
                setConfig={updateConfig}
                showConfirmation={showConfirmation}
                calculateTotalPrice={calculateTotalPrice}
                handlePayment={handlePayment}
                goBack={goBack}
                goNext={goNext}
                onClose={onClose}
                onReset={() => setShowResetDialog(true)}
                deviceCategory={deviceCategory}
              />
            </AnimatePresence>
          </MobileDialogContent>
        </MobileDialog>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent 
            className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 border-0 bg-background overflow-hidden"
            aria-describedby="car-builder-description"
          >
            <VisuallyHidden>
              <DialogTitle>Build Your {vehicle.name}</DialogTitle>
              <DialogDescription id="car-builder-description">
                Customize your {vehicle.name} by selecting model year, engine, grade, colors, and accessories.
              </DialogDescription>
            </VisuallyHidden>
            
            <AnimatePresence mode="wait">
              <DesktopCarBuilder
                key="desktop"
                vehicle={vehicle}
                step={step}
                config={config}
                setConfig={updateConfig}
                showConfirmation={showConfirmation}
                calculateTotalPrice={calculateTotalPrice}
                handlePayment={handlePayment}
                goBack={goBack}
                goNext={goNext}
                onClose={onClose}
                onReset={() => setShowResetDialog(true)}
              />
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CarBuilder;
