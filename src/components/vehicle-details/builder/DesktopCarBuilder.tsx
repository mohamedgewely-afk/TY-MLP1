import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, RotateCcw, CheckCircle2, Info, CircleHelp } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { addLuxuryHapticToButton, contextualHaptic } from "@/utils/haptic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ---------- Types ---------- */
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

/* ---------- Data ---------- */
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

// Interior images (per your URLs)
const INTERIORS = [
  { name: "Black Leather", img: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/4046322b-9927-490d-b88a-3c18e7b590f3/renditions/c1fbcc4b-eac8-4440-af33-866cf99a0c93?binary=true" },
  { name: "Beige Leather", img: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/09d2d87f-cf9c-45ca-babb-53d872f8858e/renditions/9fc0d676-3a74-4b78-b56d-aff36dc710c1?binary=true" },
  { name: "Gray Fabric", img: "" }, // fallback gradient in UI
];

// Accessories (names must match pricing in parent calculator)
const ACCESSORIES = [
  {
    name: "Premium Sound System",
    price: 1200,
    desc: "Upgraded speakers and amplifier tuned for the cabin. Richer lows, crisp highs.",
  },
  { name: "Sunroof", price: 800, desc: "Panoramic glass roof with tilt and slide." },
  { name: "Navigation System", price: 600, desc: "Built-in maps, voice guidance, live traffic." },
  { name: "Heated Seats", price: 400, desc: "Front-row seat heating with 3 levels." },
  { name: "Backup Camera", price: 300, desc: "Wide-angle rear camera with dynamic guidelines." },
  { name: "Alloy Wheels", price: 900, desc: "Lightweight alloys for improved style and handling." },
] as const;

// grade → available colors
const GRADE_COLOR_MAP: Record<string, string[]> = {
  Base: ["Pearl White", "Silver Metallic"],
  SE: ["Pearl White", "Midnight Black", "Silver Metallic"],
  XLE: ["Pearl White", "Midnight Black", "Silver Metallic", "Deep Blue"],
  Limited: ["Pearl White", "Midnight Black", "Silver Metallic", "Ruby Red"],
  Platinum: ["Pearl White", "Midnight Black", "Deep Blue", "Ruby Red"],
};
const allowedColorsFor = (grade: string) =>
  GRADE_COLOR_MAP[grade] ?? EXTERIOR_IMAGES.map((c) => c.name);

// static images per grade (won’t change with selected exterior)
const GRADE_IMAGES: Record<string, string> = {
  Base: EXTERIOR_IMAGES[0].image,
  SE: EXTERIOR_IMAGES[1].image,
  XLE: EXTERIOR_IMAGES[2].image,
  Limited: EXTERIOR_IMAGES[3].image,
  Platinum: EXTERIOR_IMAGES[4].image,
};

const spring = { type: "spring", stiffness: 320, damping: 32, mass: 1.05 } as const;

/* Haptic compat */
const hapticSelect = () => {
  if (typeof contextualHaptic.selectionChange === "function") contextualHaptic.selectionChange();
  else if (typeof contextualHaptic.buttonPress === "function") contextualHaptic.buttonPress();
};

/* Finance helpers */
const APR = 0.0349; // 3.49% annual
const DOWN_PCT = 0.2; // 20%
const reserveAmount = (status: StockStatus) => (status === "available" ? 2000 : 5000);
const emi = (price: number, years: number) => {
  const down = price * DOWN_PCT;
  const principal = Math.max(price - down, 0);
  const r = APR / 12;
  const n = years * 12;
  if (principal <= 0) return 0;
  const m = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(m);
};

/* Simple stock evaluator */
const computeStock = (grade: string, exterior: string, interior: string): StockStatus => {
  if (!grade || !exterior || !interior) return "pipeline"; // incomplete → treat as pipeline
  if (!allowedColorsFor(grade).includes(exterior)) return "no-stock";
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

  // Accessories info dialog
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoItem, setInfoItem] = useState<typeof ACCESSORIES[number] | null>(null);

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
    setConfig((c) => {
      const allowed = allowedColorsFor(g);
      const nextExterior = allowed.includes(c.exteriorColor) ? c.exteriorColor : allowed[0];
      return { ...c, grade: g, exteriorColor: nextExterior, stockStatus: computeStock(g, nextExterior, c.interiorColor) };
    });
  }, [setConfig]);

  const setColor = useCallback((name: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, exteriorColor: name, stockStatus: computeStock(c.grade, name, c.interiorColor) }));
  }, [setConfig]);

  const setInterior = useCallback((name: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, interiorColor: name, stockStatus: computeStock(c.grade, c.exteriorColor, name) }));
  }, [setConfig]);

  const toggleAccessory = useCallback((name: string) => {
    hapticSelect();
    setConfig((c) => {
      const exists = c.accessories.includes(name);
      const accessories = exists ? c.accessories.filter((a) => a !== name) : [...c.accessories, name];
      return { ...c, accessories };
    });
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

  const total = calculateTotalPrice();
  const monthly3 = emi(total, 3);
  const monthly5 = emi(total, 5);
  const reserve = reserveAmount(config.stockStatus);

  return (
    <motion.div className="relative h-full w-full bg-background flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Visual theater */}
      <div className={`${panel.left} h-full relative overflow-hidden bg-muted`}>
        <motion.img
          key={heroKey}
          src={colorObj.image}
          alt={`${config.exteriorColor} ${vehicle.name}`}
          className="w-full h-full object-contain"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={spring}
          decoding="async"
          loading="eager"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </div>

      {/* Right configuration panel */}
      <div className={`${panel.right} h-full min-h-0 flex flex-col border-l border-border/10 bg-gradient-to-b from-background/98 to-background`}>
        {/* Header controls */}
        <div className="flex items-center justify-between p-4 border-b border-border/10">
          <div className="flex items-center gap-2">
            <button ref={step > 1 ? backRef : closeRef} onClick={() => (step > 1 ? goBack() : onClose())} className="p-3 rounded-xl border hover:bg-muted" aria-label={step > 1 ? "Back" : "Close"} type="button">
              {step > 1 ? <ArrowLeft className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
            <button ref={resetRef} onClick={onReset} className="p-3 rounded-xl border hover:bg-muted" aria-label="Reset" type="button">
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>
          <div className="text-center">
            <h1 className="text-xl font-black tracking-tight">Build Your <span className="text-primary">{vehicle.name}</span></h1>
            <div className="text-[11px] text-muted-foreground mt-0.5"><StepDots current={step} total={totalSteps} /></div>
          </div>
          <div className="w-24" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* STEP 1: Year + Engine + Finance */}
          {step === 1 && (
            <>
              <Section title="Model Year & Powertrain" subtitle="Pick your year and engine to begin">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <div className="text-xs font-semibold mb-2">Model Year</div>
                    <div className="flex flex-wrap gap-2">
                      {YEARS.map((y) => (
                        <button key={y} onClick={() => setYear(y)} type="button" className={`rounded-full border px-3 py-1.5 text-sm ${config.modelYear === y ? "border-primary bg-primary/5" : "border-border/70 hover:border-border"}`}>{y}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-2">Engine</div>
                    <div className="flex flex-wrap gap-2">
                      {ENGINES.map((e) => (
                        <button key={e.name} onClick={() => setEngine(e.name)} type="button" className={`rounded-full border px-3 py-1.5 text-sm ${config.engine === e.name ? "border-primary bg-primary/5" : "border-border/70 hover:border-border"}`}>
                          <span className="font-medium">{e.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">{e.tag}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Finance quick view */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <FinanceCard label="Reserve" value={`AED ${reserve.toLocaleString()}`} hint={config.stockStatus === "available" ? "Pay now to secure" : "Refundable pre-order"} />
                  <FinanceCard label="EMI from" value={`AED ${Math.min(monthly3, monthly5).toLocaleString()}/mo`} hint="20% down · 3.49% APR · 5y" />
                </div>
              </Section>
            </>
          )}

          {/* STEP 2: Progressive Grade → Exterior → Interior → Accessories → Stock */}
          {step === 2 && (
            <>
              {/* Grade */}
              <Section title="Grade" subtitle="Select trim level">
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {GRADES.map((g) => (
                    <SelectableCard
                      key={g.name}
                      selected={config.grade === g.name}
                      onClick={() => setGrade(g.name)}
                      image={GRADE_IMAGES[g.name]}
                      label={g.name}
                      caption={g.badge}
                    />
                  ))}
                </div>
              </Section>

              {/* Exterior (only after grade) */}
              {config.grade ? (
                <Section title="Exterior" subtitle="Tap a color to preview">
                  <div className="flex flex-wrap gap-3">
                    {EXTERIOR_IMAGES.map((c) => {
                      const allowed = allowedColorsFor(config.grade);
                      const isAllowed = allowed.includes(c.name);
                      const isActive = config.exteriorColor === c.name;
                      return (
                        <button key={c.name} onClick={() => isAllowed && setColor(c.name)} disabled={!isAllowed} type="button"
                          className={`relative w-11 h-11 rounded-full border outline-none focus-visible:ring-2 ${isActive ? "border-primary ring-primary/30" : "border-border/60 hover:border-border"} ${!isAllowed ? "opacity-40 cursor-not-allowed" : ""}`}
                          title={!isAllowed ? `Not available for ${config.grade}` : c.name} aria-label={c.name}>
                          <span className="absolute inset-0 rounded-full" style={{ background: c.swatch }} />
                          <span className="sr-only">{c.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </Section>
              ) : (
                <Section title="Exterior" subtitle="Select a grade to view available colors">
                  <div className="text-xs text-muted-foreground">Choose a grade above.</div>
                </Section>
              )}

              {/* Interior (only after exterior) */}
              {config.grade && config.exteriorColor ? (
                <Section title="Interior" subtitle="Choose your cabin finish">
                  <div className="grid grid-cols-3 gap-3">
                    {INTERIORS.map((i) => (
                      <button key={i.name} onClick={() => setInterior(i.name)} type="button"
                        className={`rounded-2xl border p-2 text-left ${config.interiorColor === i.name ? "border-primary bg-primary/5" : "border-border/60 hover:border-border"}`}>
                        <div className="h-20 w-full rounded-xl overflow-hidden bg-muted">
                          {i.img ? (
                            <img src={i.img} alt={i.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600" />
                          )}
                        </div>
                        <div className="mt-2 text-sm font-semibold">{i.name}</div>
                      </button>
                    ))}
                  </div>
                </Section>
              ) : null}

              {/* Accessories (only after interior) */}
              {config.grade && config.exteriorColor && config.interiorColor ? (
                <Section title="Accessories" subtitle="Personalize your ride">
                  <div className="grid grid-cols-2 gap-3">
                    {ACCESSORIES.map((a) => {
                      const selected = config.accessories.includes(a.name);
                      return (
                        <div key={a.name} className={`rounded-xl border p-3 flex items-start gap-3 ${selected ? "border-primary bg-primary/5" : "border-border/60"}`}>
                          <button type="button" onClick={() => toggleAccessory(a.name)} className="shrink-0 w-5 h-5 rounded border flex items-center justify-center">
                            {selected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                          </button>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate">{a.name}</div>
                            <div className="text-xs text-muted-foreground">AED {a.price.toLocaleString()}</div>
                            <button
                              type="button"
                              onClick={() => { setInfoItem(a); setInfoOpen(true); }}
                              className="mt-1 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <CircleHelp className="w-3 h-3" /> Learn more
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              ) : null}

              {/* Stock (after interior) */}
              {config.grade && config.exteriorColor && config.interiorColor ? (
                <Section title="Stock" subtitle="Availability depends on color and interior">
                  <StockPill status={config.stockStatus} />
                </Section>
              ) : null}
            </>
          )}

          {/* STEP 3: Confirmation (only if stock ≠ no-stock) */}
          {step === 3 && (
            <Section title="Confirm your configuration" subtitle="Review and place your order">
              <div className="grid grid-cols-1 gap-3">
                <SummaryRow label="Year" value={config.modelYear} />
                <SummaryRow label="Engine" value={config.engine} />
                <SummaryRow label="Grade" value={config.grade} />
                <SummaryRow label="Exterior" value={config.exteriorColor} />
                <SummaryRow label="Interior" value={config.interiorColor} />
                <SummaryRow label="Accessories" value={(config.accessories.length ? config.accessories.join(", ") : "None")} />
                <SummaryRow label="Availability" value={<StockPill status={config.stockStatus} compact />} />
                <div className="mt-1 text-sm text-muted-foreground space-y-1">
                  <div>Total: <span className="font-semibold text-foreground">AED {total.toLocaleString()}</span></div>
                  <div>Reserve: <span className="font-semibold text-foreground">AED {reserve.toLocaleString()}</span></div>
                  <div>EMI from: <span className="font-semibold text-foreground">AED {Math.min(monthly3, monthly5).toLocaleString()}/mo</span> <span className="text-xs">(20% down, 3.49% APR)</span></div>
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-border/10 p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-black">AED {total.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                Reserve AED {reserve.toLocaleString()} · EMI from AED {Math.min(monthly3, monthly5).toLocaleString()}/mo
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={goBack} className="rounded-xl border px-4 py-3 hover:bg-muted/30 transition">Back</button>
              <button type="button" onClick={onContinue} disabled={disablePrimary} className="rounded-xl bg-primary text-primary-foreground px-5 py-3 font-semibold shadow hover:opacity-90 disabled:opacity-50 transition">
                {primaryText}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accessory info dialog */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{infoItem?.name}</DialogTitle>
            <DialogDescription>Details & specifications</DialogDescription>
          </DialogHeader>
          <div className="text-sm">{infoItem?.desc}</div>
          <div className="text-sm font-semibold mt-2">Price: AED {infoItem ? infoItem.price.toLocaleString() : 0}</div>
        </DialogContent>
      </Dialog>
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

const FinanceCard: React.FC<{ label: string; value: string; hint?: string }> = ({ label, value, hint }) => (
  <div className="rounded-2xl border border-border/60 p-3">
    <div className="text-[11px] text-muted-foreground">{label}</div>
    <div className="text-lg font-bold">{value}</div>
    {hint && <div className="text-[11px] text-muted-foreground mt-0.5">{hint}</div>}
  </div>
);

const StepDots: React.FC<{ current: number; total: number }> = ({ current, total }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className={`h-1.5 rounded-full transition-all ${i + 1 <= current ? "bg-primary w-8" : "bg-muted-foreground/30 w-3"}`} />
    ))}
  </div>
);

const SelectableCard: React.FC<{ selected?: boolean; onClick?: () => void; image: string; label: string; caption?: string }> = ({
  selected, onClick, image, label, caption,
}) => (
  <button
    onClick={onClick}
    type="button"
    className={`group relative overflow-hidden rounded-2xl border text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      selected ? "border-primary/60 bg-primary/5" : "border-border/50 hover:border-border"
    }`}
  >
    <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
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

const ColorSwatch: React.FC<{ color: string; label: string; active?: boolean; onClick?: () => void; disabled?: boolean }> = ({ color, label, active, onClick, disabled }) => (
  <button disabled={disabled} onClick={onClick} type="button" className={`relative w-11 h-11 rounded-full border transition outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? "border-primary ring-2 ring-primary/30" : "border-border/60 hover:border-border"} ${disabled ? "opacity-40 cursor-not-allowed" : ""}`} aria-label={label}>
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
