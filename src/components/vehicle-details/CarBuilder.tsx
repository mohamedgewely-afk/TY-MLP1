import React, { useState, useCallback, Suspense } from "react";
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
  exteriorColor: string; // label or canonical; normalized in builders
  interiorColor: string;
  accessories: string[];
}

/** Keep defaults; we normalize downstream so labels like "Pearl White" are fine */
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
      toast({ title: "Configuration reset", description: "Back to defaults." });
    } catch {
      toast({
        title: "Reset failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  }, [isResetting, toast]);

  /** Pricing logic unchanged; we only normalize exterior color for price matching */
  const calculateTotalPrice = useCallback(() => {
    const normalize = (s = "") =>
      s.replace(/exterior|interior/gi, "").replace(/\s+/g, " ").trim().toLowerCase();

    let basePrice = vehicle.price;
    const enginePricing = { "3.5L V6": 0, "4.0L V6": 5000, "2.5L Hybrid": 3000 } as Record<string, number>;
    const gradePricing = { Base: 0, SE: 2000, XLE: 4000, Limited: 6000, Platinum: 10000 } as Record<string, number>;
    const exteriorPricing = {
      "pearl white": 0,
      "midnight black": 500,
      "silver metallic": 300,
      "deep blue": 400,
      "ruby red": 600,
    } as Record<string, number>;
    const interiorPricing = { "Black Leather": 0, "Beige Leather": 800, "Gray Fabric": -500 } as Record<string, number>;
    const accessoriesPrice = {
      "Premium Sound System": 1200,
      Sunroof: 800,
      "Navigation System": 600,
      "Heated Seats": 400,
      "Backup Camera": 300,
      "Alloy Wheels": 900,
    } as Record<string, number>;

    const enginePrice = enginePricing[config.engine] || 0;
    const gradePrice = gradePricing[config.grade] || 0;
    const exteriorPrice = exteriorPricing[normalize(config.exteriorColor)] || 0;
    const interiorPrice = interiorPricing[config.interiorColor] || 0;
    const accessoriesSum = (config.accessories || []).reduce(
      (sum, name) => sum + (accessoriesPrice[name] || 0),
      0
    );

    return basePrice + enginePrice + gradePrice + exteriorPrice + interiorPrice + accessoriesSum;
  }, [config, vehicle.price]);

  const handlePayment = useCallback(() => {
    toast({ title: "Processing payment", description: "One moment..." });
    setTimeout(() => {
      toast({ title: "Order confirmed!", description: "Your configuration has been saved." });
      setShowConfirmation(true);
    }, 1000);
  }, [toast]);

  const goBack = useCallback(() => setStep((s) => (s > 1 ? s - 1 : s)), []);
  const goNext = useCallback(() => setStep((s) => (s < 4 ? s + 1 : s)), []);

  if (!isInitialized) {
    const LoaderDialog = isMobile ? MobileDialog : Dialog;
    const LoaderContent = isMobile ? MobileDialogContent : DialogContent;
    return (
      <LoaderDialog open={isOpen} onOpenChange={onClose}>
        <LoaderContent className="p-0 w-screen h-screen flex items-center justify-center">
          <VisuallyHidden>
            <DialogTitle>Loading Car Builder</DialogTitle>
            <DialogDescription>Initializing…</DialogDescription>
          </VisuallyHidden>
          <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-b-transparent" />
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
            <AlertDialogTitle>Reset configuration</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This clears all selections.
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
                  Resetting…
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
          <MobileDialogContent className="p-0">
            <VisuallyHidden>
              <DialogTitle>Build Your {vehicle.name}</DialogTitle>
              <DialogDescription>
                Select model year, engine, colors, grade, and accessories.
              </DialogDescription>
            </VisuallyHidden>
            <Suspense fallback={<div className="p-6">Loading…</div>}>
              <MobileCarBuilder key="mobile" {...sharedProps} deviceCategory={deviceCategory} />
            </Suspense>
          </MobileDialogContent>
        </MobileDialog>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-[96vw] h-[96vh] w-full p-0 overflow-hidden">
            <VisuallyHidden>
              <DialogTitle>Build Your {vehicle.name}</DialogTitle>
              <DialogDescription>
                Select model year, engine, colors, grade, and accessories.
              </DialogDescription>
            </VisuallyHidden>
            <Suspense fallback={<div className="p-6">Loading…</div>}>
              <DesktopCarBuilder key="desktop" {...sharedProps} />
            </Suspense>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default CarBuilder;
