import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, RotateCcw, CheckCircle2, Info } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";

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

export interface DesktopCarBuilderProps {
  vehicle: VehicleModel;
  step: number;                // 1 or 2 or 3 (3 only if stock ≠ no-stock)
  totalSteps: number;          // 2 when no-stock, 3 otherwise (parent passes)
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

/* Data */
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
const EXTERIOR_IMAGES: { name: string; image: string; swatch: string }[] = [
  { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#f5f5f5" },
  { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#101010" },
  { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", swatch: "#c7c9cc" },
  { name: "Deep Blue", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#0c3c74" },
  { name: "Ruby Red", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#8a1111" },
];
const INTERIORS = [
  { name: "Black Leather", sample: "linear-gradient(135deg,#121212,#1e1e1e)" },
  { name: "Beige Leather", sample: "linear-gradient(135deg,#e7dcc7,#d5c5a8)" },
  { name: "Gray Fabric", sample: "linear-gradient(135deg,#9aa0a6,#7e848a)" },
];

const spring = { type: "spring", stiffness: 320, damping: 32, mass: 1.05 } as const;

/* Haptic compat */
const hapticSelect = () => {
  if (typeof contextualHaptic.selectionChange === "function") contextualHaptic.selectionChange();
  else if (typeof contextualHaptic.buttonPress === "function") contextualHaptic.buttonPress();
};

/* Simple stock evaluator (replace with API if you have one) */
const computeStock = (grade: string, exterior: string, interior: string): StockStatus => {
  if (!grade || !exterior || !interior) return "pipeline"; // incomplete → treat as pipeline
  if (grade === "Platinum" && exterior === "Ruby Red" && interior === "Beige Leather") return "no-stock";
  if (exterior === "Deep Blue" || interior === "Gray Fabric") return "pipeline";
  return "available";
};

const DesktopCarBuilder: React.FC<DesktopCarBuilderProps> = ({
  vehicle, step, totalSteps, config, setConfig,
  showConfirmation, calculateTotalPrice, handlePayment,
  goBack, goNext, onClose, onReset, variant = "desktop",
}) => {
  const backRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    [backRef, closeRef].forEach((r) => r.current && addLuxuryHapticToButton(r.current, { type: "luxuryPress", onPress: true, onHover: true }));
    if (resetRef.current) addLuxuryHapticToButton(resetRef.current, { type: "premiumError", onPress: true, onHover: true });
  }, []);

  const colorObj = useMemo(
    () => EXTERIOR_IMAGES.find((c) => c.name === config.exteriorColor) || EXTERIOR_IMAGES[0],
    [config.exteriorColor]
  );
  const heroKey = `${colorObj.image}-${config.grade}-${config.modelYear}`;

  // preload
  useEffect(() => {
    EXTERIOR_IMAGES.forEach(({ image }) => { const i = new Image(); i.src = image; i.decoding = "async"; (i as any).loading = "eager"; });
  }, []);

  /* setters keep stock in sync */
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

  const setInterior = useCallback((name: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, interiorColor: name, stockStatus: computeStock(c.grade, c.exteriorColor, name) }));
  }, [setConfig]);

  /* CTA logic */
  const readyStep1 = Boolean(config.modelYear && config.engine);
  const readyStep2 = Boolean(config.grade && config.exteriorColor && config.interiorColor);

  const onContinue = () => {
    if (step === 1) return readyStep1 && goNext();
    if (step === 2) {
      if (!readyStep2) return;
      if (config.stockStatus === "no-stock") return handlePayment(); // register interest
      return goNext(); // go to confirmation
    }
    if (step === 3) return handlePayment(); // reserve/buy
  };

  const primaryText =
    step === 1 ? "Continue" :
    step === 2 ? (config.stockStatus === "no-stock" ? "Register your interest" : "Continue") :
    config.stockStatus === "pipeline" ? "Reserve now" : "Buy now";

  const disablePrimary =
    (step === 1 && !readyStep1) || (step === 2 && !readyStep2);

  const panel = variant === "tablet" ? { left: "w-[58%]", right: "w-[42%]" } : { left: "w-[62%]", right: "w-[38%]" };

  return (
    <motion.div className="relative h-full w-full bg-gradient-to-br from-background via-muted/3 to-background overflow-hidden flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Visual theater */}
      <div className={`${panel.left} h-full relative overflow-hidden`}>
        <motion.img
          key={heroKey}
          src={colorObj.image}
          alt={`${config.exteriorColor} ${vehicle.name}`}
          className="w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          decoding="async"
          loading="eager"
        />

        {/* Info card */}
        <div className="absolute bottom-8 left-8 right-8 z-20">
          <div className="max-w-2xl rounded-3xl border border-white/10 backdrop-blur-xl p-8 shadow-2xl" style={{ background: "linear-gradient(135deg, hsl(var(--background)/0.94) 0%, hsl(var(--background)/0.86) 100%)" }}>
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <h2 className="text-4xl font-black tracking-tight truncate">{config.modelYear} {vehicle.name}</h2>
                <p className="mt-2 text-muted-foreground font-medium truncate">
                  {(config.grade || "Select Grade")} · {(config.engine || "Choose Engine")} · {config.exteriorColor} Exterior
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-primary leading-none">AED {calculateTotalPrice().toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Estimated total</div>
              </div>
            </div>
          </div>
        </div>

        {/* Header controls */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between p-8 backdrop-blur-xl border-b border-border/10" style={{ background: "linear-gradient(180deg,hsl(var(--background)/0.98),hsl(var(--background)/0.86))" }}>
          <div className="flex items-center gap-3">
            <button ref={step > 1 ? backRef : closeRef} onClick={() => (step > 1 ? goBack() : onClose())} className="p-4 rounded-2xl bg-background/90 border border-border/30 hover:border-primary/50 transition shadow-lg" aria-label={step > 1 ? "Back" : "Close"}>
              {step > 1 ? <ArrowLeft className="h-6 w-6" /> : <X className="h-6 w-6" />}
            </button>
            <button ref={resetRef} onClick={onReset} className="p-4 rounded-2xl bg-background/90 border border-border/30 hover:border-destructive/50 transition shadow-lg" aria-label="Reset">
              <RotateCcw className="h-6 w-6" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight">Build Your <span className="text-primary">{vehicle.name}</span></h1>
            <p className="text-xs text-muted-foreground mt-1">Crafted with Toyota precision.</p>
          </div>
          <div className="w-32" />
        </div>
      </div>

      {/* Right configuration panel */}
      <div className={`${panel.right} h-full flex flex-col border-l border-border/10 bg-gradient-to-b from-background/98 to-background`}>
        <div className="p-6 border-b border-border/10">
          <StepDots current={step} total={totalSteps} />
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* STEP 1: Year + Engine */}
          {step === 1 && (
            <>
              <Section title="Model Year" subtitle="Choose your preferred year">
                <div className="grid grid-cols-3 gap-3">
                  {YEARS.map((y) => (
                    <button key={y} onClick={() => setYear(y)} className={`rounded-2xl border px-4 py-3 font-semibold ${config.modelYear === y ? "border-primary/60 bg-primary/5" : "border-border/50 hover:border-border"}`}>{y}</button>
                  ))}
                </div>
              </Section>

              <Section title="Powertrain" subtitle="Efficient, capable, or both">
                <div className="grid grid-cols-3 gap-3">
                  {ENGINES.map((e) => (
                    <button key={e.name} onClick={() => setEngine(e.name)} className={`rounded-2xl border px-4 py-3 text-left ${config.engine === e.name ? "border-primary/60 bg-primary/5" : "border-border/50 hover:border-border"}`}>
                      <div className="text-sm font-semibold">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.tag}</div>
                    </button>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* STEP 2: Grade + Colors + Stock */}
          {step === 2 && (
            <>
              <Section title="Grade" subtitle="Select trim level">
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {GRADES.map((g) => (
                    <SelectableCard key={g.name} selected={config.grade === g.name} onClick={() => setGrade(g.name)} image={colorObj.image} label={g.name} caption={g.badge} />
                  ))}
                </div>
              </Section>

              <Section title="Exterior" subtitle="Tap a color to preview instantly">
                <div className="flex flex-wrap gap-3">
                  {EXTERIOR_IMAGES.map((c) => (
                    <ColorSwatch key={c.name} color={c.swatch} label={c.name} active={config.exteriorColor === c.name} onClick={() => setColor(c.name)} />
                  ))}
                </div>
              </Section>

              <Section title="Interior" subtitle="Choose your cabin finish">
                <div className="grid grid-cols-3 gap-3">
                  {INTERIORS.map((i) => (
                    <button key={i.name} onClick={() => setInterior(i.name)} className={`rounded-2xl border p-3 ${config.interiorColor === i.name ? "border-primary/60 bg-primary/5" : "border-border/50 hover:border-border"}`}>
                      <div className="h-16 w-full rounded-xl" style={{ background: i.sample }} />
                      <div className="mt-2 text-sm font-semibold">{i.name}</div>
                    </button>
                  ))}
                </div>
              </Section>

              <Section title="Stock" subtitle="Availability depends on color and interior">
                <StockPill status={config.stockStatus} />
              </Section>
            </>
          )}

          {/* STEP 3: Confirmation (only if stock ≠ no-stock) */}
          {step === 3 && (
            <Section title="Confirm your configuration" subtitle="Review and place your order">
              <div className="grid grid-cols-1 gap-4">
                <SummaryRow label="Year" value={config.modelYear} />
                <SummaryRow label="Engine" value={config.engine} />
                <SummaryRow label="Grade" value={config.grade} />
                <SummaryRow label="Exterior" value={config.exteriorColor} />
                <SummaryRow label="Interior" value={config.interiorColor} />
                <SummaryRow label="Availability" value={<StockPill status={config.stockStatus} compact />} />
                <div className="mt-2 text-sm text-muted-foreground">Total: <span className="font-semibold text-foreground">AED {calculateTotalPrice().toLocaleString()}</span></div>
              </div>
            </Section>
          )}
        </div>

        <div className="border-t border-border/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-black">AED {calculateTotalPrice().toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Estimated total · Taxes extra</div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={goBack} className="rounded-xl border px-4 py-3 hover:bg-muted/30 transition">Back</button>
              <button onClick={onContinue} disabled={disablePrimary} className="rounded-xl bg-primary text-primary-foreground px-5 py-3 font-semibold shadow hover:opacity-90 disabled:opacity-50 transition">
                {primaryText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* UI bits */
const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
  <section className="px-6 py-5 border-b border-border/10">
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-bold leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <Info className="h-4 w-4 text-muted-foreground/70" />
    </div>
    <div className="mt-4">{children}</div>
  </section>
);

const StepDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`h-2 rounded-full transition-all ${i + 1 <= current ? "bg-primary w-8" : "bg-muted-foreground/30 w-3"}`} />
    ))}
  </div>
);

const SelectableCard: React.FC<{ selected?: boolean; onClick?: () => void; image: string; label: string; caption?: string }> = ({
  selected, onClick, image, label, caption,
}) => (
  <button
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      selected ? "border-primary/60 bg-primary/5" : "border-border/50 hover:border-border"
    }`}
  >
    <div className="aspect-[16/10] w-full overflow-hidden">
      <motion.img src={image} alt={label} className="w-full h-full object-cover" initial={{ scale: 1.04 }} whileHover={{ scale: 1.08 }} transition={{ type: "spring", stiffness: 180, damping: 16 }} loading="lazy" decoding="async" />
    </div>
    <div className="p-3">
      <div className="text-sm font-semibold leading-tight flex items-center gap-2">
        {label}
        {selected && <CheckCircle2 className="h-4 w-4 text-primary" />}
      </div>
      {caption && <div className="text-xs text-muted-foreground">{caption}</div>}
    </div>
  </button>
);

const ColorSwatch: React.FC<{ color: string; label: string; active?: boolean; onClick?: () => void }> = ({ color, label, active, onClick }) => (
  <button onClick={onClick} className={`relative w-11 h-11 rounded-full border transition outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? "border-primary ring-2 ring-primary/30" : "border-border/60 hover:border-border"}`} aria-label={label}>
    <span className="absolute inset-0 rounded-full" style={{ background: color }} />
    <span className="sr-only">{label}</span>
  </button>
);

const StockPill: React.FC<{ status: StockStatus; compact?: boolean }> = ({ status, compact }) => {
  const map = {
    "no-stock": { text: "No stock", cls: "bg-destructive/10 text-destructive border-destructive/30" },
    "pipeline": { text: "Pipeline stock", cls: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30" },
    "available": { text: "Available", cls: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30" },
  } as const;
  const m = map[status];
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 ${compact ? "py-0.5 text-xs" : "py-1 text-sm"} ${m.cls}`}>{m.text}</span>;
};

const SummaryRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between border rounded-xl px-3 py-2">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className="text-sm font-semibold">{value}</span>
  </div>
);

export default DesktopCarBuilder;
