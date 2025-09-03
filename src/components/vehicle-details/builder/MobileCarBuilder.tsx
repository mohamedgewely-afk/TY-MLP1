import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, X, RotateCcw, LogOut, CheckCircle2, CircleHelp, Image as ImageIcon } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { DeviceCategory } from "@/hooks/use-device-info";
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
  step: number;
  totalSteps: number;
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

/* ---------- Data ---------- */
const YEARS = ["2024", "2025", "2026"];
const ENGINES = ["3.5L V6", "4.0L V6", "2.5L Hybrid"];

const COLORS = [
  { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#f5f5f5" },
  { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#101010" },
  { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", swatch: "#c7c9cc" },
  { name: "Deep Blue", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", swatch: "#0c3c74" },
  { name: "Ruby Red", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", swatch: "#8a1111" },
];

const GRADES = ["Base", "SE", "XLE", "Limited", "Platinum"];
const INTERIORS = [
  { name: "Black Leather", img: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/4046322b-9927-490d-b88a-3c18e7b590f3/renditions/c1fbcc4b-eac8-4440-af33-866cf99a0c93?binary=true" },
  { name: "Beige Leather", img: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/09d2d87f-cf9c-45ca-babb-53d872f8858e/renditions/9fc0d676-3a74-4b78-b56d-aff36dc710c1?binary=true" },
  { name: "Gray Fabric", img: "" },
];

const ACCESSORIES = [
  { name: "Premium Sound System", price: 1200, desc: "Upgraded speakers and amplifier tuned for the cabin." },
  { name: "Sunroof", price: 800, desc: "Panoramic glass roof with tilt and slide." },
  { name: "Navigation System", price: 600, desc: "Built-in maps, voice guidance, live traffic." },
  { name: "Heated Seats", price: 400, desc: "Front-row seat heating with 3 levels." },
  { name: "Backup Camera", price: 300, desc: "Wide-angle rear camera with dynamic guidelines." },
  { name: "Alloy Wheels", price: 900, desc: "Lightweight alloy wheels." },
] as const;

/* ---------- Grade-specific color availability ---------- */
const GRADE_COLOR_MAP: Record<string, string[]> = {
  Base: ["Pearl White", "Silver Metallic"],
  SE: ["Pearl White", "Midnight Black", "Silver Metallic"],
  XLE: ["Pearl White", "Midnight Black", "Silver Metallic", "Deep Blue"],
  Limited: ["Pearl White", "Midnight Black", "Silver Metallic", "Ruby Red"],
  Platinum: ["Pearl White", "Midnight Black", "Deep Blue", "Ruby Red"],
};
const allowedColorsFor = (grade: string) => GRADE_COLOR_MAP[grade] ?? COLORS.map((c) => c.name);

/* ---------- Grade images (static) ---------- */
const GRADE_IMAGES: Record<string, string> = {
  Base: COLORS[0].image,
  SE: COLORS[1].image,
  XLE: COLORS[2].image,
  Limited: COLORS[3].image,
  Platinum: COLORS[4].image,
};

/* ---------- Haptics ---------- */
const hapticSelect = () => {
  if (typeof contextualHaptic.selectionChange === "function") contextualHaptic.selectionChange();
  else if (typeof contextualHaptic.buttonPress === "function") contextualHaptic.buttonPress();
};

/* ---------- Finance ---------- */
const APR = 0.0349;
const DOWN_PCT = 0.2;
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

/* ---------- Stock evaluator ---------- */
const computeStock = (grade: string, exterior: string, interior: string): StockStatus => {
  if (!grade || !exterior || !interior) return "pipeline";
  if (!allowedColorsFor(grade).includes(exterior)) return "no-stock";
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

  const [infoOpen, setInfoOpen] = useState(false);
  const [infoItem, setInfoItem] = useState<(typeof ACCESSORIES)[number] | null>(null);
  const [heroMode, setHeroMode] = useState<"exterior" | "interior">("exterior");

  useEffect(() => {
    [backRef, closeRef, exitRef].forEach((r) => r.current && addLuxuryHapticToButton(r.current, { type: "luxuryPress", onPress: true }));
    if (resetRef.current) addLuxuryHapticToButton(resetRef.current, { type: "premiumError", onPress: true });
  }, []);

  const exteriorObj = useMemo(() => {
    const f = COLORS.find((c) => c.name === config.exteriorColor) || COLORS[0];
    return f;
  }, [config.exteriorColor]);

  const interiorObj = useMemo(() => INTERIORS.find((i) => i.name === config.interiorColor), [config.interiorColor]);

  useEffect(() => {
    COLORS.forEach((c) => { const img = new Image(); img.src = c.image; });
    INTERIORS.filter(i => i.img).forEach(({ img }) => { const im = new Image(); im.src = img!; });
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

  const setInterior = useCallback((i: string) => {
    hapticSelect();
    setConfig((c) => ({ ...c, interiorColor: i, stockStatus: computeStock(c.grade, c.exteriorColor, i) }));
    setHeroMode("interior");
  }, [setConfig]);

  const toggleAccessory = useCallback((name: string) => {
    hapticSelect();
    setConfig((c) => {
      const exists = c.accessories.includes(name);
      const accessories = exists ? c.accessories.filter((a) => a !== name) : [...c.accessories, name];
      return { ...c, accessories };
    });
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
        handlePayment();
        return;
      }
      goNext();
      return;
    }
    if (step === 3) {
      handlePayment();
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

  const total = calculateTotalPrice();
  const monthly3 = emi(total, 3);
  const monthly5 = emi(total, 5);
  const reserve = reserveAmount(config.stockStatus);

  /* Allowed colors list (hide non-allowed) */
  const visibleExteriorColors = useMemo(() => {
    if (!config.grade) return [];
    const allowed = allowedColorsFor(config.grade);
    return COLORS.filter((c) => allowed.includes(c.name));
  }, [config.grade]);

  return (
    <motion.div
      className="relative w-full min-h-screen flex flex-col bg-gradient-to-b from-background via-muted/10 to-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/10 sticky top-0 z-30 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="flex items-center gap-1.5">
          <button ref={step > 1 ? backRef : closeRef} onClick={() => (step > 1 ? goBack() : onClose())} className="rounded-xl border p-2.5" aria-label={step > 1 ? "Back" : "Close"} type="button">
            {step > 1 ? <ArrowLeft className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </button>
          <button ref={resetRef} onClick={onReset} className="rounded-xl border p-2.5" aria-label="Reset" type="button">
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold leading-none">Build Your <span className="text-primary">{vehicle.name}</span></div>
          <div className="text-[10px] text-muted-foreground mt-1">{step}/{totalSteps}</div>
        </div>
        <button ref={exitRef} onClick={onClose} className="rounded-xl border p-2.5" aria-label="Exit" type="button">
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      {/* Mode toggle */}
      <div className="px-3 pt-2">
        <div className="inline-flex border rounded-full bg-background/90 backdrop-blur p-1">
          {(["exterior","interior"] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setHeroMode(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${heroMode===m ? "bg-primary text-primary-foreground border-primary" : "border-transparent"}`}
            >
              {m === "exterior" ? "Exterior" : "Interior"}
            </button>
          ))}
        </div>
      </div>

      {/* Hero (dynamic by mode; height responsive so footer is always visible) */}
      <div className="relative w-full h-60 md:h-72 border-b border-border/10 bg-background">
        <motion.img
          key={`${heroMode}-${exteriorObj.image}-${interiorObj?.img ?? "no-int"}`}
          src={heroMode === "exterior" ? exteriorObj.image : (interiorObj?.img || exteriorObj.image)}
          alt={`${heroMode === "exterior" ? config.exteriorColor : config.interiorColor} ${vehicle.name}`}
          className="absolute inset-0 w-full h-full object-contain"
          initial={{ opacity: 0, scale: 1.0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
          decoding="async"
          loading="eager"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = "hidden"; }}
        />
      </div>

      {/* Summary under hero */}
      <div className="px-3 pt-2">
        <div className="px-3 py-2 rounded-2xl border border-border/10 bg-background/90">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-bold truncate">{config.modelYear} {vehicle.name}</div>
              <div className="text-[11px] text-muted-foreground truncate">
                {(config.grade || "Select Grade") + " · " + (config.engine || "Choose Engine")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-black text-primary leading-none">AED {total.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">Est. total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {/* Step 1: Year + Engine + Finance */}
        {step === 1 && (
          <>
            <div>
              <div className="text-sm font-semibold mb-2">Model Year</div>
              <div className="flex items-center gap-2">
                {YEARS.map((y) => (
                  <button key={y} onClick={() => setYear(y)} className={"rounded-full border px-3 py-1.5 text-xs " + (config.modelYear === y ? "border-primary/60 bg-primary/5" : "border-border/60")} type="button">
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold mb-2">Engine</div>
              <div className="flex items-center gap-2">
                {ENGINES.map((e) => (
                  <button key={e} onClick={() => setEngine(e)} className={"rounded-full border px-3 py-1.5 text-xs " + (config.engine === e ? "border-primary/60 bg-primary/5" : "border-border/60")} type="button">
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Finance */}
            <div className="grid grid-cols-2 gap-2">
              <FinancePill label="Reserve" value={`AED ${reserve.toLocaleString()}`} hint={config.stockStatus === "available" ? "Secure today" : "Refundable"} />
              <FinancePill label="EMI from" value={`AED ${Math.min(monthly3, monthly5).toLocaleString()}/mo`} hint="20% down · 3.49% APR" />
            </div>
          </>
        )}

        {/* Step 2: Progressive Grade → Exterior (filtered) → Interior → Accessories → Stock */}
        {step === 2 && (
          <>
            {/* Grade (static images) */}
            <div>
              <div className="text-sm font-semibold mb-2">Grade</div>
              <div className="grid grid-cols-2 gap-2">
                {GRADES.map((g) => {
                  const active = config.grade === g;
                  return (
                    <button key={g} onClick={() => setGrade(g)} type="button" className={"rounded-xl border text-left " + (active ? "border-primary/60 bg-primary/5" : "border-border/60")}>
                      <div className="aspect-[16/10] w-full rounded-t-xl overflow-hidden bg-muted">
                        <img src={GRADE_IMAGES[g]} alt={g} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                      <div className="px-3 py-2">
                        <span className="text-sm font-semibold">{g}</span>
                        {active && <CheckCircle2 className="h-4 w-4 text-primary inline ml-1" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Exterior (only allowed colors shown) */}
            <div>
              <div className="text-sm font-semibold mb-2">Exterior Colors</div>
              {!config.grade ? (
                <div className="text-xs text-muted-foreground">Select a grade to view colors.</div>
              ) : (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {visibleExteriorColors.map((c) => {
                    const isActive = config.exteriorColor === c.name;
                    return (
                      <button
                        key={c.name}
                        onClick={() => setColor(c.name)}
                        className={"shrink-0 w-11 h-11 rounded-full border relative " + (isActive ? "border-primary ring-2 ring-primary/30" : "border-border/60")}
                        aria-label={c.name}
                        title={c.name}
                        type="button"
                      >
                        <span className="absolute inset-0 rounded-full" style={{ background: c.swatch }} />
                        <span className="sr-only">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Interior */}
            {config.grade && config.exteriorColor ? (
              <div>
                <div className="text-sm font-semibold mb-2">Interior</div>
                <div className="grid grid-cols-3 gap-2">
                  {INTERIORS.map((i) => (
                    <button key={i.name} onClick={() => setInterior(i.name)} className={"rounded-xl border p-2 " + (config.interiorColor === i.name ? "border-primary/60 bg-primary/5" : "border-border/60")} type="button">
                      <div className="h-16 rounded-lg overflow-hidden bg-muted">
                        {i.img ? <img src={i.img} alt={i.name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full grid place-items-center text-muted-foreground"><ImageIcon className="w-5 h-5" /></div>}
                      </div>
                      <div className="mt-1 text-[11px] font-medium">{i.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Accessories */}
            {config.grade && config.exteriorColor && config.interiorColor ? (
              <div>
                <div className="text-sm font-semibold mb-2">Accessories</div>
                <div className="grid grid-cols-2 gap-2">
                  {ACCESSORIES.map((a) => {
                    const selected = config.accessories.includes(a.name);
                    return (
                      <div key={a.name} className={"rounded-xl border p-2 flex items-start gap-2 " + (selected ? "border-primary bg-primary/5" : "border-border/60")}>
                        <button type="button" onClick={() => toggleAccessory(a.name)} className="shrink-0 w-5 h-5 rounded border flex items-center justify-center">
                          {selected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                        </button>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold truncate">{a.name}</div>
                          <div className="text-[11px] text-muted-foreground">AED {a.price.toLocaleString()}</div>
                          <button type="button" onClick={() => { setInfoItem(a); setInfoOpen(true); }} className="mt-1 inline-flex items-center gap-1 text-[11px] text-primary">
                            <CircleHelp className="w-3 h-3" /> Learn more
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Stock */}
            {config.grade && config.exteriorColor && config.interiorColor ? (
              <div>
                <div className="text-sm font-semibold mb-2">Stock</div>
                <StockBadge status={config.stockStatus} />
              </div>
            ) : null}
          </>
        )}

        {/* Step 3: Confirmation with images */}
        {step === 3 && (
          <div className="space-y-3">
            {/* Previews */}
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl border overflow-hidden">
                <div className="aspect-[16/9] bg-muted">
                  <img src={exteriorObj.image} alt={config.exteriorColor} className="w-full h-full object-contain" />
                </div>
                <div className="px-3 py-2 text-sm font-semibold">Exterior: {config.exteriorColor}</div>
              </div>
              <div className="rounded-2xl border overflow-hidden">
                <div className="aspect-[16/9] bg-muted">
                  {interiorObj?.img ? (
                    <img src={interiorObj.img} alt={config.interiorColor} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-muted-foreground"><ImageIcon className="w-6 h-6" /></div>
                  )}
                </div>
                <div className="px-3 py-2 text-sm font-semibold">Interior: {config.interiorColor}</div>
              </div>
            </div>

            {[
              ["Year", config.modelYear],
              ["Engine", config.engine],
              ["Grade", config.grade],
              ["Accessories", config.accessories.length ? config.accessories.join(", ") : "None"],
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

            <div className="text-[12px] text-muted-foreground pt-1">
              Reserve AED {reserve.toLocaleString()} · EMI from AED {Math.min(monthly3, monthly5).toLocaleString()}/mo (20% down, 3.49% APR)
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-border/10 px-3 py-3 pb-[max(env(safe-area-inset-bottom),0px)] sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-base font-black">AED {total.toLocaleString()}</div>
            <div className="text-[11px] text-muted-foreground">Reserve AED {reserve.toLocaleString()} · EMI from AED {Math.min(monthly3, monthly5).toLocaleString()}/mo</div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={goBack} className="rounded-xl border px-3 py-2 text-sm">Back</button>
            <button type="button" onClick={onContinue} disabled={disablePrimary} className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-50">
              {primaryText}
            </button>
          </div>
        </div>
      </div>

      {/* Accessory info dialog (uses current exterior as hero image) */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{infoItem?.name}</DialogTitle>
            <DialogDescription>Details & specifications</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden border mb-3">
            <div className="aspect-[16/9] bg-muted">
              <img src={exteriorObj.image} alt="Accessory visual" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-sm">{infoItem?.desc}</div>
          <div className="text-sm font-semibold mt-2">Price: AED {infoItem ? infoItem.price.toLocaleString() : 0}</div>
        </DialogContent>
      </Dialog>
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
  return <span className={base + " " + cls}>{label}</span>;
};

const FinancePill: React.FC<{ label: string; value: string; hint?: string }> = ({ label, value, hint }) => (
  <div className="rounded-xl border px-3 py-2">
    <div className="text-[11px] text-muted-foreground">{label}</div>
    <div className="text-sm font-bold">{value}</div>
    {hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}
  </div>
);

export default MobileCarBuilder;
