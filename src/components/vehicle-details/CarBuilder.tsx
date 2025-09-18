// components/CarBuilder.tsx
// Luxury wrapper: glass dialogs, refined loader, same logic; shows BuilderProgress in desktop dialog too

import React, { useCallback, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MobileDialog, MobileDialogContent } from "@/components/ui/mobile-dialog";
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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { VehicleModel } from "@/types/vehicle";
import { useToast } from "@/hooks/use-toast";
import { useDeviceInfo } from "@/hooks/use-device-info";

import BuilderProgress from "@/components/vehicle-details/BuilderProgress";
import DesktopCarBuilder, { BuilderConfig as DesktopBuilderConfig } from "./builder/DesktopCarBuilder";
import MobileCarBuilder, { MobileBuilderConfig } from "./builder/MobileCarBuilder";

/* ---------- Props ---------- */
export interface CarBuilderProps {
  vehicle: VehicleModel;
  isOpen: boolean;
  onClose: () => void;
}

/* ---------- Defaults ---------- */
const DEFAULT_CONFIG: DesktopBuilderConfig = {
  modelYear: "2025",
  engine: "",
  grade: "",
  exteriorColor: "Pearl White",
  interiorColor: "",
  accessories: [],
  stockStatus: "pipeline",
};

const CarBuilder: React.FC<CarBuilderProps> = ({ vehicle, isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<DesktopBuilderConfig>({ ...DEFAULT_CONFIG });
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();
  const { isMobile, isTablet, deviceCategory, isInitialized } = useDeviceInfo();

  const totalSteps = config.stockStatus === "no-stock" ? 2 : 3;

  useEffect(() => {
    if (totalSteps < step) setStep(totalSteps);
  }, [totalSteps, step]);

  useEffect(() => {
    if (config.stockStatus === "no-stock" && step > 2) setStep(2);
  }, [config.stockStatus, step]);

  const calculateTotalPrice = useCallback(() => {
    let base = vehicle.price;
    const enginePricing: Record<string, number> = { "3.5L V6": 0, "4.0L V6": 5000, "2.5L Hybrid": 3000 };
    const gradePricing: Record<string, number> = { Base: 0, SE: 2000, XLE: 4000, Limited: 6000, Platinum: 10000 };
    const exteriorPricing: Record<string, number> = { "Pearl White": 0, "Midnight Black": 500, "Silver Metallic": 300, "Deep Blue": 400, "Ruby Red": 600 };
    const interiorPricing: Record<string, number> = { "Black Leather": 0, "Beige Leather": 800, "Gray Fabric": -500 };
    const accessoriesPricing: Record<string, number> = {
      "Premium Sound System": 1200, Sunroof: 800, "Navigation System": 600, "Heated Seats": 400, "Backup Camera": 300, "Alloy Wheels": 900,
    };
    base += enginePricing[config.engine] ?? 0;
    base += gradePricing[config.grade] ?? 0;
    base += exteriorPricing[config.exteriorColor] ?? 0;
    base += interiorPricing[config.interiorColor] ?? 0;
    base += config.accessories.reduce((t, a) => t + (accessoriesPricing[a] ?? 0), 0);
    return base;
  }, [config, vehicle.price]);

  const handlePayment = useCallback(() => {
    const action = config.stockStatus === "no-stock" ? "interest registered" : config.stockStatus === "pipeline" ? "reservation placed" : "purchase started";
    toast({ title: "Processing…", description: "Please wait." });
    setTimeout(() => {
      setShowConfirmation(true);
      toast({ title: "Success", description: `Your ${action}.` });
    }, 800);
  }, [toast, config.stockStatus]);

  const goBack = useCallback(() => setStep((s) => Math.max(1, s - 1)), []);
  const goNext = useCallback(() => setStep((s) => Math.min(totalSteps, s + 1)), [totalSteps]);

  const handleReset = useCallback(async () => {
    if (isResetting) return;
    try {
      setIsResetting(true);
      setConfig({ ...DEFAULT_CONFIG });
      setStep(1);
      setShowConfirmation(false);
      setShowResetDialog(false);
      toast({ title: "Configuration Reset", description: "Back to defaults." });
    } finally {
      setIsResetting(false);
    }
  }, [isResetting, toast]);

  /* ---------- Loading Shell ---------- */
  if (!isInitialized) {
    const LoadingDialog = isMobile ? MobileDialog : Dialog;
    const LoadingContent = isMobile ? MobileDialogContent : DialogContent;
    return (
      <LoadingDialog open={isOpen} onOpenChange={onClose}>
        <LoadingContent className={isMobile ? "" : "max-w-full max-h-full h-screen w-screen p-0 border-0 overflow-hidden"}>
          <VisuallyHidden>
            <DialogTitle>Loading Car Builder</DialogTitle>
            <DialogDescription>Preparing your premium experience…</DialogDescription>
          </VisuallyHidden>
          <div className="h-full w-full bg-[linear-gradient(135deg,#ffffff_0%,#f5f5f5_100%)] flex items-center justify-center">
            <div className="flex flex-col items-center justify-center space-y-6 bg-white/30 backdrop-blur-2xl rounded-2xl px-10 py-12 border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-400/40 border-t-black" />
                <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 border border-black/15" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold text-neutral-900">{vehicle.name}</h3>
                <p className="text-sm text-neutral-500">Preparing your premium experience…</p>
              </div>
            </div>
          </div>
        </LoadingContent>
      </LoadingDialog>
    );
  }

  /* ---------- Builder Content ---------- */
  const content = (
    <AnimatePresence mode="wait">
      {isMobile ? (
        <MobileCarBuilder
          key="mobile"
          vehicle={vehicle}
          step={step}
          totalSteps={totalSteps}
          config={config as MobileBuilderConfig}
          setConfig={setConfig as React.Dispatch<React.SetStateAction<MobileBuilderConfig>>}
          showConfirmation={showConfirmation}
          calculateTotalPrice={calculateTotalPrice}
          handlePayment={handlePayment}
          goBack={goBack}
          goNext={goNext}
          onClose={onClose}
          onReset={() => setShowResetDialog(true)}
          deviceCategory={deviceCategory}
        />
      ) : (
        <DesktopCarBuilder
          key={isTablet ? "tablet" : "desktop"}
          variant={isTablet ? "tablet" : "desktop"}
          vehicle={vehicle}
          step={step}
          totalSteps={totalSteps}
          config={config}
          setConfig={setConfig}
          showConfirmation={showConfirmation}
          calculateTotalPrice={calculateTotalPrice}
          handlePayment={handlePayment}
          goBack={goBack}
          goNext={goNext}
          onClose={onClose}
          onReset={() => setShowResetDialog(true)}
        />
      )}
    </AnimatePresence>
  );

  return (
    <>
      {isMobile ? (
        <MobileDialog open={isOpen} onOpenChange={onClose}>
          <MobileDialogContent>
            <VisuallyHidden>
              <DialogTitle>Build Your {vehicle.name}</DialogTitle>
              <DialogDescription>
                Customize your {vehicle.name} by selecting year, engine, grade, exterior, interior, accessories and availability.
              </DialogDescription>
            </VisuallyHidden>
            {content}

            {/* Mobile Reset Dialog */}
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <AlertDialogContent className="max-w-[85vw] rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-lg text-neutral-900">Reset Configuration</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm text-neutral-600">Clear all selections and return to step one?</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                  <AlertDialogCancel disabled={isResetting} className="min-h-[48px] flex-1 border border-neutral-300 bg-white hover:bg-neutral-50">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} disabled={isResetting} className="min-h-[48px] flex-1 bg-black text-white hover:opacity-90">
                    {isResetting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                        Resetting…
                      </div>
                    ) : (
                      "Reset"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </MobileDialogContent>
        </MobileDialog>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-[98vw] max-h-[98vh] w-[98vw] h-[98vh] p-0 border-0 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#ffffff_0%,#f5f5f5_100%)]">
            <VisuallyHidden>
              <DialogTitle>Build Your {vehicle.name}</DialogTitle>
              <DialogDescription>
                Customize your {vehicle.name} by selecting year, engine, grade, exterior, interior, accessories and availability.
              </DialogDescription>
            </VisuallyHidden>

            {/* Also show the luxury progress here on desktop/tablet */}
            <div className="pt-4">
              <BuilderProgress currentStep={step} totalSteps={totalSteps} />
            </div>

            {content}
          </DialogContent>

          {/* Desktop Reset Dialog */}
          <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
            <AlertDialogContent className="max-w-md rounded-2xl bg-white/80 backdrop-blur-2xl border border-white/30 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-neutral-900">Reset Configuration</AlertDialogTitle>
                <AlertDialogDescription className="text-neutral-600">Clear all selections and return to step one?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2">
                <AlertDialogCancel disabled={isResetting} className="min-h-[44px] min-w-[44px] border border-neutral-300 bg-white hover:bg-neutral-50">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} disabled={isResetting} className="min-h-[44px] min-w-[44px] bg-black text-white hover:opacity-90">
                  {isResetting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Resetting…
                    </div>
                  ) : (
                    "Reset"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Dialog>
      )}
    </>
  );
};

export default CarBuilder;
