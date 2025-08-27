
import React, { useEffect, useRef } from "react";
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
  const { containerPadding, buttonSize, cardSpacing, textSize, mobilePadding, touchTarget } = useResponsiveSize();
  const backButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (backButtonRef.current) {
      addLuxuryHapticToButton(backButtonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: false
      });
    }
    if (closeButtonRef.current) {
      addLuxuryHapticToButton(closeButtonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: false
      });
    }
    if (resetButtonRef.current) {
      addLuxuryHapticToButton(resetButtonRef.current, {
        type: 'premiumError',
        onPress: true,
        onHover: false
      });
    }
    if (exitButtonRef.current) {
      addLuxuryHapticToButton(exitButtonRef.current, {
        type: 'luxuryPress',
        onPress: true,
        onHover: false
      });
    }
  }, []);

  const getCurrentVehicleImage = React.useCallback(() => {
    const exteriorColors = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
      { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" },
      { name: "Deep Blue", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Ruby Red", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  }, [config.exteriorColor]);

  const getImageHeight = React.useCallback(() => {
    switch (deviceCategory) {
      case 'smallMobile': return 'h-28';
      case 'standardMobile': return 'h-32';
      case 'largeMobile': return 'h-36';
      case 'extraLargeMobile': return 'h-40';
      case 'tablet': return 'h-44';
      default: return 'h-32';
    }
  }, [deviceCategory]);

  const getTouchButtonClass = React.useCallback(() => {
    const baseClass = `${touchTarget} rounded-lg bg-background/90 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-background/95 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md`;
    const sizeClass = deviceCategory === 'smallMobile' ? 'p-2' : 'p-2.5';
    return `${baseClass} ${sizeClass}`;
  }, [deviceCategory, touchTarget]);

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (step === 1 && step < 4) {
        contextualHaptic.swipeNavigation();
        goNext();
      }
    },
    onSwipeRight: () => {
      if (step === 1 && step > 1) {
        contextualHaptic.swipeNavigation();
        goBack();
      } else if (step === 1) {
        onClose();
      }
    },
    threshold: 80,
    preventDefaultTouchmoveEvent: false
  });

  const handleBackClick = React.useCallback(() => {
    contextualHaptic.stepProgress();
    if (step > 1) {
      goBack();
    } else {
      onClose();
    }
  }, [step, goBack, onClose]);

  const handleResetClick = React.useCallback(() => {
    contextualHaptic.resetAction();
    if (onReset) {
      onReset();
    }
  }, [onReset]);

  const handleExitClick = React.useCallback(() => {
    contextualHaptic.exitAction();
    onClose();
  }, [onClose]);

  return (
    <div
      className="relative w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/5 overflow-y-auto flex flex-col opacity-0 animate-fade-in"
      ref={swipeableRef}
    >
      {/* Header - Compact */}
      <div className="relative z-30 flex items-center justify-between bg-background/95 backdrop-blur-xl border-b border-border/20 flex-shrink-0 px-2 py-1 transform -translate-y-2 animate-fade-in">
        <div className="flex items-center gap-1.5">
          <button
            ref={step > 1 ? backButtonRef : closeButtonRef}
            onClick={handleBackClick}
            className={`${getTouchButtonClass()} hover:scale-102`}
          >
            {step > 1 ? (
              <ArrowLeft className="h-4 w-4 text-foreground" />
            ) : (
              <X className="h-4 w-4 text-foreground" />
            )}
          </button>

          <button
            ref={resetButtonRef}
            onClick={handleResetClick}
            className={`${getTouchButtonClass()} hover:scale-102`}
          >
            <RotateCcw className="h-4 w-4 text-foreground" />
          </button>
        </div>

        <div className="text-center flex-1 mx-2">
          <h1 className="text-[10px] font-semibold text-foreground truncate leading-none">
            Build Your <span className="text-primary">{vehicle.name}</span>
          </h1>
          <p className="text-[8px] text-muted-foreground font-medium leading-none">
            Step {step} of 4
          </p>
        </div>

        <button
          ref={exitButtonRef}
          onClick={handleExitClick}
          className={`${getTouchButtonClass()} hover:scale-102`}
        >
          <LogOut className="h-4 w-4 text-foreground" />
        </button>
      </div>

      {/* Vehicle Image - Fixed and Properly Visible */}
      <div 
        className={`relative w-full ${getImageHeight()} overflow-hidden border-b border-border/10 flex-shrink-0 bg-muted/20 opacity-0 animate-fade-in`}
        style={{ animationDelay: '0.2s' }}
        key={config.exteriorColor + config.grade}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent z-10" />
        
        <img 
          src={getCurrentVehicleImage()}
          alt="Vehicle Preview"
          className="w-full h-full object-contain object-center scale-95 transition-all duration-500"
          loading="lazy"
        />
        
        {/* Compact Vehicle Info Overlay */}
        <div className="absolute bottom-2 left-2 right-2 z-20 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="p-1.5">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-[9px] font-semibold text-foreground truncate mb-0.5 leading-tight">
                  {config.modelYear} {vehicle.name}
                </h3>
                <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                  <span className="text-[8px] font-medium">{config.grade || 'Select Grade'}</span>
                  {config.grade && (
                    <>
                      <div className="w-0.5 h-0.5 bg-muted-foreground/60 rounded-full"></div>
                      <span className="text-[8px]">{config.engine}</span>
                    </>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  {config.exteriorColor} Exterior
                </p>
              </div>
              <div className="text-right ml-2">
                <div className="text-sm font-bold text-primary mb-0.5">
                  AED {calculateTotalPrice().toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">
                  From AED 2,850/mo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex-shrink-0 bg-background/95 border-b border-border/10 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <MobileProgress currentStep={step} totalSteps={4} />
      </div>

      {/* Choice Collector - Compact */}
      <div className="px-2 py-1 flex-shrink-0 bg-background/95 border-b border-border/10 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <ChoiceCollector config={config} step={step} />
      </div>

      {/* Step Content - Fixed scrolling */}
      <div className="flex-1 overflow-hidden bg-background/95 px-2 py-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
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
      </div>

      {/* Summary - Always Visible */}
      <div className="flex-shrink-0 relative z-30 bg-background/98 border-t border-border/20 backdrop-blur-xl px-2 py-1 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <MobileSummary 
          config={config}
          totalPrice={calculateTotalPrice()}
          step={step}
          reserveAmount={2000}
          deviceCategory={deviceCategory}
          showPaymentButton={step !== 4}
        />
      </div>
    </div>
  );
};

export default MobileCarBuilder;
