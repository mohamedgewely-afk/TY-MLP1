import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, RotateCcw, CheckCircle2, LogOut } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory } from "@/hooks/use-device-info";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";

// Keep in sync with Desktop type
export type StockStatus = "no-stock" | "pipeline" | "available";

export interface MobileBuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
  stockStatus: StockStatus;
}

export interface MobileCarBuilderProps {
  vehicle: VehicleModel;
  step: number;             // 1: Year+Engine, 2: Grade+Colors+Stock, 3: Confirmation (only if stock ≠ no-stock)
  totalSteps: number;       // 2 or 3 (parent decides based on stock)
  config: MobileBuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<MobileBuilderConfig>>;
  showConfirmation: boolean;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goBack: () => void;
  goNext: () => void;
  onClose: () => void;
  onReset: () => void;
  deviceCategory: DeviceCategory;
}

const YEARS = ["2024", "2025", "2026"];
const ENGINES = ["3.5L V6", "4.0L V6", "2.5L Hybrid"];

const COLORS = [
  { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#f5f5f5" },
  { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#101010" },
  { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", swatch: "#c7c9cc" },
  { name: "Deep Blue", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#0c3c74" },
  { name: "Ruby Red", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#8a1111" },
];

// ---- Haptic helper (compat with your API) ----
const hapticSelect = () => {
  if (typeof contextualHaptic.selectionChange === "function") contextualHaptic.selectionChange();
  else if (typeof contextualHaptic.buttonPress === "function") contextualHaptic.buttonPress();
};

// ---- Stock evaluator (replace with API if you have one) ----
const computeStock = (grade: string, exterior: string, interior: string): StockStatus => {
  if (!grade || !exterior || !interior) return "pipeline";
  if (grade === "Platinum" && exterior === "Ruby Red" && interior === "Beige Leather") return "no-stock";
  if (exterior === "Deep Blue" || interior === "Gray Fabric") return "pipeline";
  return "available";
};

const MobileCarBuilder: React.FC<MobileCarBuilderProps> = ({
  vehicle,
  step,
  totalSteps,
  config,
  setConfig,
  calculateTotalPrice,
  handlePayment,
  goBack,
  goNext,
  onClose,
  onReset,
}) => {
  const backRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const exitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    [backRef, closeRef, exitRef].forEach((r) => r.current && addLuxuryHapticToButton(r.current, { type: "luxuryPress", onPress: true }));
    if (resetRef.current) addLuxuryHapticToButton(resetRef.current, { type: "premiumError", onPress: true });
  }, []);

  const activeImg = useMemo(() => {
    const f = COLORS.find((c) => c.name === config.exteriorColor) || COLORS[0];
    return f.image;
  }, [config.exteriorColor]);

  useEffect(() => {
    COLORS.forEach((c) => {
      const img = new Image();
      img.src = c.image;
      img.decoding = "async";
      (img as any).loading = "eager";
    });
  }, []);

  // ---- setters (keep stock synced) ----
  const setYear = useCallback((y: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, modelYear: y, stockStatus: computeStock(c.grade, c.exteriorColor, c.interiorColor) }));
  }, [setConfig]);

  const setEngine = useCallback((e: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, engine: e, stockStatus: computeStock(c.grade, c.exteriorColor, c.interiorColor) }));
  }, [setConfig]);

  const setGrade = useCallback((g: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, grade: g, stockStatus: computeStock(g, c.exteriorColor, c.interiorColor) }));
  }, [setConfig]);

  const setColor = useCallback((name: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, exteriorColor: name, stockStatus: computeStock(c.grade, name, c.interiorColor) }));
  }, [setConfig]);

  const setInterior = useCallback((i: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, interiorColor: i, stockStatus: computeStock(c.grade, c.exteriorColor, i) }));
  }, [setConfig]);

  const readyStep1 = Boolean(config.modelYear && config.engine);
  const readyStep2 = Boolean(config.grade && config.exteriorColor && config.interiorColor);

  const onContinue = () => {
    if (step === 1) {
      if (readyStep1) goNext();
      return;
    }
    if (step === 2) {
      if (!readyStep2) return;
      if (config.stockStatus === "no-stock") {
        // register interest path ends here
        handlePayment();
        return;
      }
      goNext(); // go to confirmation
      return;
    }
    if (step === 3) {
      handlePayment(); // reserve or buy
    }
  };

  const primaryText =
    step === 1
      ? "Continue"
      : step === 2
      ? config.stockStatus === "no-stock"
        ? "Register your interest"
        : "Continue"
      : config.stockStatus === "pipeline"
      ? "Reserve now"
      : "Buy now";

  const disablePrimary = (step === 1 && !readyStep1) || (step === 2 && !readyStep2);

  return (
    <motion.div
      className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/10 to-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/10 sticky top-0 z-30 bg-background/90 backdrop-blur">
        <div className="flex items-center gap-1.5">
          <button
            ref={step > 1 ? backRef : closeRef}
            onClick={() => (step > 1 ? goBack() : onClose())}
            className="rounded-xl border p-2.5"
            aria-label={step > 1 ? "Back" : "Close"}
          >
            {step > 1 ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
          <button ref={resetRef} onClick={onReset} className="rounded-xl border p-2.5" aria-label="Reset">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold leading-none">
            Build Your <span className="text-primary">{vehicle.name}</span>
          </div>
          <div className="text-[10px] text-muted-foreground mt-1">
            {step}/{totalSteps}
          </div>
        </div>
        <button ref={exitRef} onClick={onClose} className="rounded-xl border p-2.5" aria-label="Exit">
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Hero */}
      <div className="relative w-full h-40 border-b border-border/10">
        <motion.img
          key={activeImg + "-" + config.grade + "-" + config.modelYear}
          src={activeImg}
          alt={config.exteriorColor + " " + vehicle.name}
          className="absolute inset-0 w-full h-full object-contain"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          decoding="async"
          loading="eager"
        />
        <div className="absolute bottom-2 left-2 right-2 px-3 py-2 rounded-2xl backdrop-blur-xl border border-white/10 bg-background/80">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">
                {config.modelYear} {vehicle.name}
              </div>
              <div className="text-[11px] text-muted-foreground truncate">
                {(config.grade || "Select Grade") + " · " + (config.engine || "Choose Engine")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-primary leading-none">
                AED {calculateTotalPrice().toLocaleString()}
              </div>
              <div className="text-[10px] text-muted-foreground">Est. total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Step 1: Year + Engine */}
        {step === 1 && (
          <>
            <div>
              <div className="text-sm font-semibold mb-2">Model Year</div>
              <div className="flex items-center gap-2">
                {YEARS.map((y) => (
                  <button
                    key={y}
                    onClick={() => setYear(y)}
                    className={
                      "rounded-full border px-3 py-1.5 text-xs " +
                      (config.modelYear === y ? "border-primary/60 bg-primary/5" : "border-border/60")
                    }
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold mb-2">Engine</div>
              <div className="flex items-center gap-2">
                {ENGINES.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEngine(e)}
                    className={
                      "rounded-full border px-3 py-1.5 text-xs " +
                      (config.engine === e ? "border-primary/60 bg-primary/5" : "border-border/60")
                    }
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 2: Grade + Exterior + Interior + Stock */}
        {step === 2 && (
          <>
            <div>
              <div className="text-sm font-semibold mb-2">Grade</div>
              <div className="grid grid-cols-2 gap-2">
                {["Base", "SE", "XLE", "Limited", "Platinum"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={
                      "rounded-xl border px-3 py-2 text-left text-sm " +
                      (config.grade === g ? "border-primary/60 bg-primary/5" : "border-border/60")
                    }
                  >
                    <span className="font-semibold">{g}</span>
                    {config.grade === g && <CheckCircle2 className="h-4 w-4 text-primary inline ml-1" />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Exterior Colors</div>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    className={
                      "shrink-0 w-11 h-11 rounded-full border relative " +
                      (config.exteriorColor === c.name ? "border-primary ring-2 ring-primary/30" : "border-border/60")
                    }
                    aria-label={c.name}
                  >
                    <span className="absolute inset-0 rounded-full" style={{ background: c.swatch }} />
                    <span className="sr-only">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Interior</div>
              <div className="grid grid-cols-3 gap-2">
                {["Black Leather", "Beige Leather", "Gray Fabric"].map((i) => (
                  <button
                    key={i}
                    onClick={() => setInterior(i)}
                    className={
                      "rounded-xl border p-2 " +
                      (config.interiorColor === i ? "border-primary/60 bg-primary/5" : "border-border/60")
                    }
                  >
                    <div className="h-12 rounded-lg bg-gradient-to-br from-muted/20 to-muted" />
                    <div className="mt-1 text-[11px] font-medium">{i}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Stock */}
            <div>
              <div className="text-sm font-semibold mb-2">Stock</div>
              <StockBadge status={config.stockStatus} />
            </div>
          </>
        )}

        {/* Step 3: Confirmation (only when totalSteps === 3) */}
        {step === 3 && (
          <div className="space-y-2">
            {[
              ["Year", config.modelYear],
              ["Engine", config.engine],
              ["Grade", config.grade],
              ["Exterior", config.exteriorColor],
              ["Interior", config.interiorColor],
              [
                "Availability",
                config.stockStatus === "no-stock"
                  ? "No stock"
                  : config.stockStatus === "pipeline"
                  ? "Pipeline stock"
                  : "Available",
              ],
            ].map(([label, value]) => (
              <div key={label as string} className="flex items-center justify-between border rounded-xl px-3 py-2">
                <span className="text-sm text-muted-foreground">{label as string}</span>
                <span className="text-sm font-semibold">{value as string}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-border/10 px-3 py-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-black">AED {calculateTotalPrice().toLocaleString()}</div>
            <div className="text-[11px] text-muted-foreground">Taxes extra</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={goBack} className="rounded-xl border px-3 py-2 text-sm">Back</button>
            <button
              onClick={onContinue}
              disabled={disablePrimary}
              className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {primaryText}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- Small UI bits ---------- */
const StockBadge: React.FC<{ status: StockStatus }> = ({ status }) => {
  const base = "inline-block text-xs rounded-full border px-3 py-1";
  const cls =
    status === "no-stock"
      ? " border-destructive/30 text-destructive bg-destructive/10"
      : status === "pipeline"
      ? " border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/10"
      : " border-emerald-500/30 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10";
  const label = status === "no-stock" ? "No stock" : status === "pipeline" ? "Pipeline stock" : "Available";
  return <span className={base + cls}>{label}</span>;
};

export default MobileCarBuilder;
