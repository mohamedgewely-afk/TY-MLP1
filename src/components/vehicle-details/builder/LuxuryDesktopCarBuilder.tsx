import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, X, RotateCcw, CheckCircle2, Info, CircleHelp, Image as ImageIcon, Sparkles, Crown } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Types
export type StockStatus = "no-stock" | "pipeline" | "available";

export interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
  stockStatus: StockStatus;
}

export interface LuxuryDesktopCarBuilderProps {
  vehicle: VehicleModel;
  step: number;
  totalSteps: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  showConfirmation: boolean;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goBack: () => void;
  goNext: () => void;
  onClose: () => void;
  onReset: () => void;
  variant?: "desktop" | "tablet";
}

// Data
const YEARS = ["2024", "2025", "2026"];
const ENGINES = [
  { name: "3.5L V6", tag: "Gasoline" },
  { name: "4.0L V6", tag: "Performance" },
  { name: "2.5L Hybrid", tag: "Hybrid" },
];
const GRADES = [
  { name: "Base", badge: "Everyday Essentials" },
  { name: "SE", badge: "Sport Enhanced" },
  { name: "XLE", badge: "Extra Luxury" },
  { name: "Limited", badge: "Premium" },
  { name: "Platinum", badge: "Top of the Line" },
];

const LuxuryDesktopCarBuilder: React.FC<LuxuryDesktopCarBuilderProps> = ({
  vehicle,
  step,
  totalSteps,
  config,
  setConfig,
  showConfirmation,
  calculateTotalPrice,
  handlePayment,
  goBack,
  goNext,
  onClose,
  onReset,
  variant = "desktop"
}) => {
  const [heroMode, setHeroMode] = useState<"exterior" | "interior">("exterior");
  const shouldReduceMotion = useReducedMotion();

  // Haptic feedback helpers
  const hapticSelect = () => contextualHaptic.selectionChange();

  const readyStep1 = Boolean(config.modelYear && config.engine);
  const readyStep2 = Boolean(config.grade && config.exteriorColor && config.interiorColor);

  const onContinue = () => {
    if (step === 1) return readyStep1 && goNext();
    if (step === 2) {
      if (!readyStep2) return;
      if (config.stockStatus === "no-stock") return handlePayment();
      return goNext();
    }
    if (step === 3) return handlePayment();
  };

  const primaryText = step === 1
    ? "Continue"
    : step === 2
      ? (config.stockStatus === "no-stock" ? "Register your interest" : "Continue")
      : (config.stockStatus === "pipeline" ? "Reserve now" : "Buy now");

  const disablePrimary = (step === 1 && !readyStep1) || (step === 2 && !readyStep2);

  const panel = variant === "tablet"
    ? (step === 1 ? { left: "w-[52%]", right: "w-[48%]" } : { left: "w-[56%]", right: "w-[44%]" })
    : (step === 1 ? { left: "w-[52%]", right: "w-[48%]" } : { left: "w-[58%]", right: "w-[42%]" });

  const total = calculateTotalPrice();

  return (
    <motion.div 
      className="relative h-screen w-full flex"
      style={{
        background: "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.3) 100%)"
      }}
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
    >
      {/* Premium Visual Theater */}
      <div className={`${panel.left} h-full relative overflow-hidden`}
           style={{
             background: "linear-gradient(135deg, hsl(var(--muted)/0.8) 0%, hsl(var(--muted)/0.6) 100%)",
             borderRight: "1px solid hsl(var(--border)/0.3)"
           }}>
        
        {/* Premium Mode Toggle */}
        <div className="absolute top-6 left-6 z-20 border border-border/20 rounded-2xl bg-background/95 backdrop-blur-xl px-2 py-1.5 flex items-center gap-1 shadow-lg">
          <Crown className="h-4 w-4 text-primary mr-2" />
          {(["exterior", "interior"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setHeroMode(m)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${heroMode === m ? "bg-primary text-primary-foreground shadow-sm border border-primary/20" : "border border-transparent hover:bg-muted/50"}`}
              role="tab"
              aria-selected={heroMode === m}
            >
              {m === "exterior" ? "Exterior" : "Interior"}
            </button>
          ))}
        </div>

        {/* Vehicle Hero Image */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <motion.div
            key={`${config.grade}-${heroMode}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full h-full max-w-2xl max-h-96"
          >
            <img
              src={vehicle.image}
              alt={`${vehicle.name} ${heroMode}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Premium Configuration Panel */}
      <div className={`${panel.right} h-full flex flex-col`}
           style={{
             background: "linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--muted)/0.1) 100%)"
           }}>
        
        {/* Elegant Header */}
        <div className="p-6 border-b border-border/30 bg-background/95 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={step > 1 ? goBack : onClose}
                className="rounded-full h-10 w-10 flex items-center justify-center border border-border/40 hover:bg-muted/50 transition-all duration-300"
                aria-label={step > 1 ? "Go back" : "Close"}
              >
                {step > 1 ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </button>
              <button
                onClick={onReset}
                className="rounded-full h-10 w-10 flex items-center justify-center border border-border/40 hover:bg-muted/50 text-destructive transition-all duration-300"
                aria-label="Reset configuration"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Premium Builder</span>
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Configure Your {vehicle.name}
            </h1>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i + 1 === step ? "bg-primary scale-125" : i + 1 < step ? "bg-primary/60" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Content */}
        <div className="flex-1 overflow-auto p-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Model Year Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Choose Model Year
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {YEARS.map((year) => (
                    <button
                      key={year}
                      onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
                      className={`p-4 rounded-xl text-center transition-all duration-300 ${
                        config.modelYear === year
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted/50 hover:bg-muted border border-border/30"
                      }`}
                    >
                      <div className="font-semibold">{year}</div>
                      <div className="text-xs opacity-80">
                        {year === "2025" ? "Latest" : year === "2024" ? "Current" : "Future"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Engine Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Select Powertrain
                </h3>
                <div className="space-y-3">
                  {ENGINES.map((engine) => (
                    <button
                      key={engine.name}
                      onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                        config.engine === engine.name
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted/50 hover:bg-muted border border-border/30"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="font-semibold">{engine.name}</div>
                        <div className="text-xs px-2 py-1 rounded-full bg-background/20">
                          {engine.tag}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Grade Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-primary" />
                  Choose Grade
                </h3>
                <div className="space-y-3">
                  {GRADES.map((grade) => (
                    <button
                      key={grade.name}
                      onClick={() => setConfig(prev => ({ ...prev, grade: grade.name }))}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                        config.grade === grade.name
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted/50 hover:bg-muted border border-border/30"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">{grade.name}</div>
                          <div className="text-xs opacity-80">{grade.badge}</div>
                        </div>
                        <CheckCircle2 className={`h-5 w-5 ${config.grade === grade.name ? "opacity-100" : "opacity-0"}`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Premium Footer */}
        <div className="p-6 border-t border-border/30 bg-background/95 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Total Price</div>
              <div className="text-2xl font-bold text-foreground">
                AED {total.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Monthly from</div>
              <div className="text-lg font-semibold text-primary">
                AED {Math.round(total / 60).toLocaleString()}
              </div>
            </div>
          </div>
          
          <button
            onClick={onContinue}
            disabled={disablePrimary}
            className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
              disablePrimary
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {primaryText}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LuxuryDesktopCarBuilder;