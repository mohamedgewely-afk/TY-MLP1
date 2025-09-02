✅ Got it! I’ll now rewrite the `CarBuilder` component with:

- Fully upgraded UI (based on lovable.dev design principles)
- Enhanced accessibility, animation, and layout polish
- **No changes to business logic** — all features will work identically

Here's your upgraded `CarBuilder.tsx`:

```tsx
import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  MobileDialog,
  MobileDialogContent,
} from "@/components/ui/mobile-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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

const DEFAULT_CONFIG: BuilderConfig = {
  modelYear: "2025",
  engine: "3.5L V6",
  grade: "",
  exteriorColor: "Pearl White",
  interiorColor: "",
  accessories: [],
};

const CarBuilder: React.FC<CarBuilderProps> = ({ vehicle, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<BuilderConfig>(DEFAULT_CONFIG);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const { toast } = useToast();
  const { isMobile, deviceCategory, isInitialized } = useDeviceInfo();

  const handleReset = useCallback(async () => {
    if (isResetting) return;
    try {
      setIsResetting(true);
      setConfig(DEFAULT_CONFIG);
      setStep(1);
      setShowResetDialog(false);
      setShowConfirmation(false);
      toast({
        title: "Configuration Reset",
        description: "Your vehicle configuration has been reset.",
      });
    } catch (error) {
      toast({
        title: "Reset Error",
        description: "There was an issue resetting.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  }, [isResetting, toast]);

  const calculateTotalPrice = useCallback(() => {
    let basePrice = vehicle.price;
    const enginePricing = { "3.5L V6": 0, "4.0L V6": 5000, "2.5L Hybrid": 3000 };
    const gradePricing = {
      Base: 0,
      SE: 2000,
      XLE: 4000,
      Limited: 6000,
      Platinum: 10000,
    };
    const exteriorColors = [
      { name: "Pearl White", price: 0 },
      { name: "Midnight Black", price: 500 },
      { name: "Silver Metallic", price: 300 },
      { name: "Deep Blue", price: 400 },
      { name: "Ruby Red", price: 600 },
    ];
    const interiorPricing = {
      "Black Leather": 0,
      "Beige Leather": 800,
      "Gray Fabric": -500,
    };
    const accessories = [
      { name: "Premium Sound System", price: 1200 },
      { name: "Sunroof", price: 800 },
      { name: "Navigation System", price: 600 },
      { name: "Heated Seats", price: 400 },
      { name: "Backup Camera", price: 300 },
      { name: "Alloy Wheels", price: 900 },
    ];

    const enginePrice = enginePricing[config.engine] || 0;
    const gradePrice = gradePricing[config.grade] || 0;
    const exteriorPrice =
      exteriorColors.find((c) => c.name === config.exteriorColor)?.price || 0;
    const interiorPrice = interiorPricing[config.interiorColor] || 0;
    const accessoriesPrice = config.accessories.reduce((total, name) => {
      const item = accessories.find((a) => a.name === name);
      return total + (item?.price || 0);
    }, 0);

    return basePrice + enginePrice + gradePrice + exteriorPrice + interiorPrice + accessoriesPrice;
  }, [config, vehicle.price]);

  const handlePayment = useCallback(() => {
    toast({ title: "Processing Payment", description: "One moment..." });
    setTimeout(() => {
      toast({
        title: "Order Confirmed!",
        description: "Your configuration has been saved.",
      });
      setShowConfirmation(true);
    }, 2000);
  }, [toast]);

  const goBack = useCallback(() => step > 1 && setStep(step - 1), [step]);
  const goNext = useCallback(() => step < 4 && setStep(step + 1), [step]);

  if (!isInitialized) {
    const LoaderDialog = isMobile ? MobileDialog : Dialog;
    const LoaderContent = isMobile ? MobileDialogContent : DialogContent;
    return (
      <LoaderDialog open={isOpen} onOpenChange={onClose}>
        <LoaderContent className="p-0 w-screen h-screen flex items-center justify-center">
          <VisuallyHidden>
            <DialogTitle>Loading Car Builder</DialogTitle>
            <DialogDescription>Initializing vehicle configuration...</DialogDescription>
          </VisuallyHidden>
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-b-transparent"></div>
        </LoaderContent>
      </LoaderDialog>
    );
  }

  const sharedProps = {
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
    onReset: () => setShowResetDialog(true),
  };

  return (
    <>
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset? This clears all selections.
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
                  <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mr-2" />
                  Resetting...
                </>
              ) : (
                "Reset"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {isMobile ? (
        <MobileDialog open={isOpen} onOpenChange={onClose}>
          <MobileDialogContent>
            <VisuallyHidden>
              <DialogTitle>Build Your {vehicle.name}</DialogTitle>
              <DialogDescription>
                Select model year, engine, colors, grade, and accessories.
              </DialogDescription>
            </VisuallyHidden>
            <AnimatePresence mode="wait">
              <MobileCarBuilder key="mobile" {...sharedProps} deviceCategory={deviceCategory} />
            </AnimatePresence>
          </MobileDialogContent>
        </MobileDialog>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-[95vw] h-[95vh] w-full p-0 overflow-hidden">
            <VisuallyHidden>
              <DialogTitle>Build Your {vehicle.name}</DialogTitle>
              <DialogDescription>
                Select model year, engine, colors, grade, and accessories.
              </DialogDescription>
            </VisuallyHidden>
            <AnimatePresence mode="wait">
              <DesktopCarBuilder key="desktop" {...sharedProps} />
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CarBuilder;