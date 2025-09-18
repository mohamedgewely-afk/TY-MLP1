// components/builder/DesktopCarBuilder.tsx
// Luxury Edition — monochrome, glassmorphism, cinematic hero, Photo/360 toggle (manual only)
// Includes: BuilderProgress + BuilderNavigation integration, 360 frame mapping, Accessory info dialog

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  X,
  RotateCcw,
  CheckCircle2,
  Info,
  CircleHelp,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import BuilderProgress from "@/components/vehicle-details/BuilderProgress";
import BuilderNavigation from "@/components/vehicle-details/BuilderNavigation";

import { VehicleModel } from "@/types/vehicle";

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

/* ---------- Data (DAM URLs restored) ---------- */
const YEARS: string[] = ["2024", "2025", "2026"];

const ENGINES = [
  { name: "3.5L V6", tag: "Gasoline" },
  { name: "4.0L V6", tag: "Performance" },
  { name: "2.5L Hybrid", tag: "Hybrid" },
] as const;

const GRADES = [
  { name: "Base", badge: "Everyday Essentials" },
  { name: "SE", badge: "Sport Enhanced" },
  { name: "XLE", badge: "Extra Luxury" },
  { name: "Limited", badge: "Premium" },
  { name: "Platinum", badge: "Top of the Line" },
] as const;

const EXTERIOR_IMAGES = [
  {
    name: "Pearl White",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    swatch: "#f5f5f5",
  },
  {
    name: "Midnight Black",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
    swatch: "#101010",
  },
  {
    name: "Silver Metallic",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
    swatch: "#c7c9cc",
  },
  {
    name: "Deep Blue",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    swatch: "#0c3c74",
  },
  {
    name: "Ruby Red",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
    swatch: "#8a1111",
  },
] as const;
type ExteriorImage = (typeof EXTERIOR_IMAGES)[number];

const INTERIORS = [
  {
    name: "Black Leather",
    img: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/4046322b-9927-490d-b88a-3c18e7b590f3/renditions/c1fbcc4b-eac8-4440-af33-866cf99a0c93?binary=true",
  },
  {
    name: "Beige Leather",
    img: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/09d2d87f-cf9c-45ca-babb-53d872f8858e/renditions/9fc0d676-3a74-4b78-b56d-aff36dc710c1?binary=true",
  },
  { name: "Gray Fabric", img: "" },
] as const;
type InteriorItem = (typeof INTERIORS)[number];

const ACCESSORIES = [
  { name: "Premium Sound System", price: 1200, desc: "Upgraded speakers and amplifier tuned for the cabin." },
  { name: "Sunroof", price: 800, desc: "Panoramic glass roof with tilt and slide." },
  { name: "Navigation System", price: 600, desc: "Built-in maps, voice guidance, live traffic." },
  { name: "Heated Seats", price: 400, desc: "Front-row seat heating with 3 levels." },
  { name: "Backup Camera", price: 300, desc: "Wide-angle rear camera with dynamic guidelines." },
  { name: "Alloy Wheels", price: 900, desc: "Lightweight alloy wheels for style and handling." },
] as const;

/* ---------- 360 Frames (example mapping; replace with your per-color sets if available) ---------- */
const PEARL_WHITE_FRAMES: string[] = [
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/f89996df-2223-47bc-b673-b213a50cc5e3.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/f0a94ef4-133b-408a-aae2-224e0348574e.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/3834e0d5-2f50-4f01-af58-23cbf763ae37.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/af5a96ed-370a-419c-aedf-db4ff7fc786f.720",
  "https://cdn.photo-motion.com/images/PudmJIAS-FhZOSpV/bae8922a-affa-4bf7-9f7b-440b088fa4d9/3834e0d5-2f50-4f01-af58-23cbf763ae37.720",
];
const SPIN_SETS: Record<string, string[]> = {
  "Pearl White": PEARL_WHITE_FRAMES,
  "Midnight Black": PEARL_WHITE_FRAMES,
  "Silver Metallic": PEARL_WHITE_FRAMES,
  "Deep Blue": PEARL_WHITE_FRAMES,
  "Ruby Red": PEARL_WHITE_FRAMES,
};

/* ---------- Finance & helpers ---------- */
const APR = 0.0349;
const DOWN_PCT = 0.2;
const spring = { type: "spring", stiffness: 300, damping: 26 } as const;

function reserveAmount(status: StockStatus) {
  return status === "available" ? 2000 : 5000;
}
function emi(price: number, years: number) {
  const down = price * DOWN_PCT;
  const principal = Math.max(price - down, 0);
  const r = APR / 12;
  const n = years * 12;
  if (principal <= 0) return 0;
  const m = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  return Math.round(m);
}
function allowedColorsFor(grade: string) {
  return GRADE_COLOR_MAP[grade] ?? EXTERIOR_IMAGES.map((c) => c.name);
}
function computeStock(grade: string, exterior: string, interior: string): StockStatus {
  if (!grade || !exterior || !interior) return "pipeline";
  if (!allowedColorsFor(grade).includes(exterior)) return "no-stock";
  if (grade === "Platinum" && exterior === "Ruby Red" && interior === "Beige Leather") return "no-stock";
  if (exterior === "Deep Blue" || interior === "Gray Fabric") return "pipeline";
  return "available";
}

const GRADE_COLOR_MAP: Record<string, string[]> = {
  Base: ["Pearl White", "Silver Metallic"],
  SE: ["Pearl White", "Midnight Black", "Silver Metallic"],
  XLE: ["Pearl White", "Midnight Black", "Silver Metallic", "Deep Blue"],
  Limited: ["Pearl White", "Midnight Black", "Silver Metallic", "Ruby Red"],
  Platinum: ["Pearl White", "Midnight Black", "Deep Blue", "Ruby Red"],
};
const GRADE_IMAGES: Record<string, string> = {
  Base: EXTERIOR_IMAGES[0].image,
  SE: EXTERIOR_IMAGES[1].image,
  XLE: EXTERIOR_IMAGES[2].image,
  Limited: EXTERIOR_IMAGES[3].image,
  Platinum: EXTERIOR_IMAGES[4].image,
};

/* ---------- SpinViewer (manual only) ---------- */
interface SpinViewerProps {
  frames: string[];
  fallbackStill: string;
  className?: string;
  alt?: string;
  onFirstFrameLoad?: () => void;
}
const SpinViewer: React.FC<SpinViewerProps> = ({ frames, fallbackStill, className, alt, onFirstFrameLoad }) => {
  const hasFrames = frames && frames.length > 0;
  const [index, setIndex] = useState(0);
  const startXRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstLoadedRef = useRef(false);
  const SENS = 6;

  const clampIndex = useCallback(
    (i: number) => {
      if (!hasFrames) return 0;
      const len = frames.length;
      return ((i % len) + len) % len;
    },
    [frames, hasFrames]
  );
  const step = useCallback((delta: number) => setIndex((cur) => clampIndex(cur + delta)), [clampIndex]);

  const onFirstLoad = () => {
    if (!firstLoadedRef.current) {
      firstLoadedRef.current = true;
      onFirstFrameLoad?.();
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    startXRef.current = e.clientX;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startXRef.current == null) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) >= SENS) {
      const framesDelta = Math.trunc(dx / SENS);
      step(framesDelta);
      startXRef.current = e.clientX;
    }
  };
  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    startXRef.current = null;
  };
  const onWheel = (e: React.WheelEvent) => {
    if (!hasFrames) return;
    e.preventDefault();
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    step(delta > 0 ? 1 : -1);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [step]);

  useEffect(() => setIndex(0), [frames]);

  if (!hasFrames) {
    return <img src={fallbackStill} alt={alt} className={className} draggable={false} onLoad={onFirstLoad} />;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full outline-none select-none"
      role="img"
      aria-label={alt}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onWheel={onWheel}
    >
      <img src={frames[index]} alt={alt} className={className} draggable={false} onLoad={onFirstLoad} />
    </div>
  );
};

/* ---------- UI bits ---------- */
const Section: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; dense?: boolean }> = ({
  title,
  subtitle,
  children,
  dense,
}) => (
  <section className={`px-6 ${dense ? "py-6" : "py-8"} border-b border-neutral-200 bg-white/60 backdrop-blur`}>
    <div className="flex items-start justify-between gap-3">
      <div>
        <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
        {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
      </div>
      <Info className="h-4 w-4 text-neutral-400" />
    </div>
    <div className="mt-4">{children}</div>
  </section>
);

const CompactSegmented: React.FC<{
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  meta?: (opt: string) => string | undefined;
}> = ({ label, options, value, onChange, meta }) => (
  <div>
    <div className="text-sm font-semibold mb-2 text-neutral-700">{label}</div>
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded-full border px-4 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 ${
              active ? "border-black bg-black text-white" : "border-neutral-300 hover:border-black/40"
            }`}
            aria-pressed={active}
            role="radio"
            aria-checked={active}
          >
            <span>{opt}</span>
            {meta?.(opt) && <span className="ml-2 text-xs text-neutral-500">{meta(opt)}</span>}
          </button>
        );
      })}
    </div>
  </div>
);

const FinanceCard: React.FC<{ label: string; value: string; hint?: string; large?: boolean }> = ({ label, value, hint, large }) => (
  <div className={`rounded-2xl border border-neutral-200 p-4 bg-white/60 backdrop-blur shadow-sm ${large ? "min-h-[96px]" : ""}`}>
    <div className="text-[11px] text-neutral-500">{label}</div>
    <div className="text-xl font-bold text-neutral-900">{value}</div>
    {hint && <div className="text-[11px] text-neutral-400 mt-1">{hint}</div>}
  </div>
);

const SelectableCard: React.FC<{ selected?: boolean; onClick?: () => void; image: string; label: string; caption?: string }> = ({
  selected,
  onClick,
  image,
  label,
  caption,
}) => (
  <button
    onClick={onClick}
    type="button"
    className={`group relative overflow-hidden rounded-2xl border text-left transition focus:outline-none ${
      selected ? "border-black bg-black/5" : "border-neutral-300 hover:border-black/40"
    }`}
  >
    <div className="aspect-[16/10] w-full overflow-hidden bg-neutral-100">
      <motion.img
        src={image}
        alt={label}
        className="w-full h-full object-cover"
        initial={{ scale: 1.04 }}
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
        loading="lazy"
        decoding="async"
      />
    </div>
    <div className="p-3">
      <div className="text-sm font-semibold flex items-center gap-2 text-neutral-900">
        {label}
        {selected && <CheckCircle2 className="h-4 w-4 text-black" />}
      </div>
      {caption && <div className="text-xs text-neutral-500">{caption}</div>}
    </div>
  </button>
);

const StockPill: React.FC<{ status: StockStatus; compact?: boolean }> = ({ status, compact }) => {
  const map = {
    "no-stock": { text: "No stock", cls: "bg-red-100 text-red-700 border-red-300" },
    pipeline: { text: "Pipeline stock", cls: "bg-amber-100 text-amber-700 border-amber-300" },
    available: { text: "Available", cls: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  } as const;
  const m = map[status];
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 ${compact ? "py-0.5 text-xs" : "py-1 text-sm"} ${m.cls}`}>{m.text}</span>;
};

const SummaryRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between border rounded-xl px-3 py-2 bg-white/60 backdrop-blur">
    <span className="text-sm text-neutral-500">{label}</span>
    <span className="text-sm font-semibold text-neutral-900">{value}</span>
  </div>
);

/* ---------- Component ---------- */
const DesktopCarBuilder: React.FC<DesktopCarBuilderProps> = ({
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
  variant = "desktop",
}) => {
  const prefersReducedMotion = useReducedMotion();

  const [heroMode, setHeroMode] = useState<"exterior" | "interior">("exterior");
  const [exteriorView, setExteriorView] = useState<"photo" | "spin">("photo");
  const [imageLoadedKey, setImageLoadedKey] = useState<string>("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [infoItem, setInfoItem] = useState<typeof ACCESSORIES[number] | null>(null);

  const exteriorObj = useMemo<ExteriorImage>(
    () => EXTERIOR_IMAGES.find((c) => c.name === config.exteriorColor) || EXTERIOR_IMAGES[0],
    [config.exteriorColor]
  );
  const interiorObj = useMemo<InteriorItem | undefined>(() => INTERIORS.find((i) => i.name === config.interiorColor), [config.interiorColor]);
  const heroKey = `${exteriorObj.image}-${config.grade}-${config.modelYear}-${heroMode}-${interiorObj?.img ?? "no-int"}-${exteriorView}`;

  const currentSpinFrames = useMemo(() => SPIN_SETS[config.exteriorColor] || [], [config.exteriorColor]);

  const total = calculateTotalPrice();
  const monthly3 = useMemo(() => emi(total, 3), [total]);
  const monthly5 = useMemo(() => emi(total, 5), [total]);
  const reserve = useMemo(() => reserveAmount(config.stockStatus), [config.stockStatus]);

  const panel =
    variant === "tablet" ? { left: "w-[56%]", right: "w-[44%]" } : { left: "w-[60%]", right: "w-[40%]" };

  // preload stills/spins
  useEffect(() => {
    EXTERIOR_IMAGES.forEach(({ image }) => {
      const i = new Image();
      i.src = image;
    });
    INTERIORS.filter((i) => i.img).forEach(({ img }) => {
      const im = new Image();
      if (img) im.src = img;
    });
  }, []);
  useEffect(() => {
    if (heroMode !== "exterior") return;
    currentSpinFrames.forEach((src) => {
      const im = new Image();
      im.src = src;
    });
  }, [currentSpinFrames, heroMode]);

  // ensure Photo sub-toggle when leaving exterior
  useEffect(() => {
    if (heroMode !== "exterior" && exteriorView !== "photo") setExteriorView("photo");
  }, [heroMode, exteriorView]);

  return (
    <motion.div
      className="relative h-screen w-full flex"
      style={{ background: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Left Hero Panel */}
      <div
        className={`${panel.left} h-full relative overflow-hidden`}
        style={{ background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)", borderRight: "1px solid rgba(0,0,0,0.05)" }}
      >
        {/* Mode + Photo/360 toggle */}
        <div className="absolute top-6 left-6 z-20 border border-neutral-200 rounded-2xl bg-white/70 backdrop-blur px-3 py-1.5 flex items-center gap-2 shadow-lg">
          <Sparkles className="h-4 w-4 text-black/70" />
          {(["exterior", "interior"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setHeroMode(m)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${heroMode === m ? "bg-black text-white shadow" : "hover:bg-black/5"}`}
              role="tab"
              aria-selected={heroMode === m}
            >
              {m === "exterior" ? "Exterior" : "Interior"}
            </button>
          ))}
          {heroMode === "exterior" && (
            <div className="ml-3 flex items-center gap-1 pl-3 border-l border-neutral-200">
              {(["photo", "spin"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setExteriorView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${exteriorView === v ? "bg-black text-white" : "hover:bg-black/5"}`}
                  aria-pressed={exteriorView === v}
                >
                  {v === "photo" ? "Photo" : "360°"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hero Image / Spin */}
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-white/70 to-gray-100">
          {!imageLoadedKey || imageLoadedKey !== heroKey ? <div className="absolute inset-0 m-8 rounded-2xl bg-neutral-200 animate-pulse" /> : null}

          {heroMode === "exterior" ? (
            exteriorView === "spin" ? (
              <SpinViewer
                key={`spin-${config.exteriorColor}`}
                frames={currentSpinFrames}
                fallbackStill={exteriorObj.image}
                className="w-full h-full object-contain p-8"
                alt={`${config.exteriorColor} ${vehicle.name}`}
                onFirstFrameLoad={() => setImageLoadedKey(heroKey)}
              />
            ) : (
              <motion.img
                key={`${heroKey}-photo`}
                src={exteriorObj.image}
                alt={`${config.exteriorColor} ${vehicle.name}`}
                className="w-full h-full object-contain p-8"
                initial={useReducedMotion ? false : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 250, damping: 28 }}
                onLoad={() => setImageLoadedKey(heroKey)}
              />
            )
          ) : (
            <motion.img
              key={`${heroKey}-interior`}
              src={interiorObj?.img || exteriorObj.image}
              alt={`${config.interiorColor} ${vehicle.name}`}
              className="w-full h-full object-contain p-8"
              initial={useReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 250, damping: 28 }}
              onLoad={() => setImageLoadedKey(heroKey)}
            />
          )}
        </div>
      </div>

      {/* Right Config Panel */}
      <div className={`${panel.right} h-full flex flex-col border-l border-neutral-200`}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 bg-white/70 backdrop-blur">
          <button onClick={step > 1 ? goBack : onClose} className="p-3 rounded-2xl border border-neutral-300 hover:bg-black/5 transition" aria-label={step > 1 ? "Back" : "Close"}>
            {step > 1 ? <ArrowLeft className="h-5 w-5" /> : <X className="h-5 w-5" />}
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">
              Build Your <span className="text-neutral-500">{vehicle.name}</span>
            </h1>
            {/* Luxury Progress */}
            <BuilderProgress currentStep={step} totalSteps={totalSteps} />
          </div>
          <button onClick={onReset} className="p-3 rounded-2xl border border-neutral-300 hover:bg-black/5 transition text-red-600" aria-label="Reset">
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scroll-pb-[200px]">
          {/* STEP 1 */}
          {step === 1 && (
            <Section title="Model Year & Powertrain" subtitle="Pick your year and engine to begin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CompactSegmented
                  label="Model Year"
                  options={YEARS}
                  value={config.modelYear}
                  onChange={(y) =>
                    setConfig((c) => ({
                      ...c,
                      modelYear: y,
                      stockStatus: computeStock(c.grade, c.exteriorColor, c.interiorColor),
                    }))
                  }
                />
                <CompactSegmented
                  label="Engine"
                  options={ENGINES.map((e) => e.name)}
                  value={config.engine}
                  onChange={(e) =>
                    setConfig((c) => ({
                      ...c,
                      engine: e,
                      stockStatus: computeStock(c.grade, c.exteriorColor, c.interiorColor),
                    }))
                  }
                  meta={(name) => ENGINES.find((e) => e.name === name)?.tag}
                />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <FinanceCard label="Reserve" value={`AED ${reserve.toLocaleString()}`} hint={config.stockStatus === "available" ? "Pay now to secure" : "Refundable pre-order"} large />
                <FinanceCard label="EMI from" value={`AED ${Math.min(monthly3, monthly5).toLocaleString()}/mo`} hint="20% down · 3.49% APR · up to 5y" large />
              </div>
            </Section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <Section title="Grade" subtitle="Select trim level">
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {GRADES.map((g) => (
                    <SelectableCard
                      key={g.name}
                      selected={config.grade === g.name}
                      onClick={() =>
                        setConfig((c) => {
                          const allowed = allowedColorsFor(g.name);
                          const nextExterior = allowed.includes(c.exteriorColor) ? c.exteriorColor : allowed[0];
                          return { ...c, grade: g.name, exteriorColor: nextExterior, stockStatus: computeStock(g.name, nextExterior, c.interiorColor) };
                        })
                      }
                      image={GRADE_IMAGES[g.name]}
                      label={g.name}
                      caption={g.badge}
                    />
                  ))}
                </div>
              </Section>

              <Section title="Exterior" subtitle={config.grade ? "Choose a color available for your grade" : "Select a grade to view colors"}>
                {!config.grade ? (
                  <div className="text-xs text-neutral-500">Choose a grade above.</div>
                ) : (
                  <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Exterior color">
                    {allowedColorsFor(config.grade).map((colorName) => {
                      const colorObj = EXTERIOR_IMAGES.find((c) => c.name === colorName)!;
                      const isActive = config.exteriorColor === colorObj.name;
                      return (
                        <button
                          key={colorObj.name}
                          onClick={() =>
                            setConfig((c) => ({
                              ...c,
                              exteriorColor: colorObj.name,
                              stockStatus: computeStock(c.grade, colorObj.name, c.interiorColor),
                            }))
                          }
                          className={`relative w-12 h-12 rounded-full border ${isActive ? "border-black ring-2 ring-black/40" : "border-neutral-300 hover:border-black/40"}`}
                          role="radio"
                          aria-checked={isActive}
                          title={colorObj.name}
                        >
                          <span className="absolute inset-0 rounded-full" style={{ background: colorObj.swatch }} />
                          <span className="sr-only">{colorObj.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Section>

              {config.grade && config.exteriorColor && (
                <Section title="Interior" subtitle="Choose your cabin finish">
                  <div className="grid grid-cols-3 gap-3">
                    {INTERIORS.map((i) => {
                      const selected = config.interiorColor === i.name;
                      return (
                        <button
                          key={i.name}
                          onClick={() =>
                            setConfig((c) => ({
                              ...c,
                              interiorColor: i.name,
                              stockStatus: computeStock(c.grade, c.exteriorColor, i.name),
                            }))
                          }
                          className={`rounded-2xl border p-2 text-left transition ${selected ? "border-black bg-black/5" : "border-neutral-300 hover:border-black/40"}`}
                        >
                          <div className="h-24 w-full rounded-xl overflow-hidden bg-neutral-100">
                            {i.img ? (
                              <img src={i.img} alt={i.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full grid place-items-center text-neutral-400">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-sm font-semibold truncate text-neutral-900">{i.name}</div>
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {config.grade && config.exteriorColor && config.interiorColor && (
                <Section title="Stock" subtitle="Availability depends on color and interior">
                  <StockPill status={config.stockStatus} />
                </Section>
              )}

              {config.grade && config.exteriorColor && config.interiorColor && (
                <Section title="Accessories" subtitle="Personalize your ride">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ACCESSORIES.map((a) => {
                      const selected = config.accessories.includes(a.name);
                      return (
                        <motion.div
                          key={a.name}
                          className={`rounded-xl border p-3 flex items-start gap-3 transition-all ${selected ? "border-black bg-black/5" : "border-neutral-300 hover:border-black/40"}`}
                          animate={{ scale: selected ? 1.02 : 1 }}
                          transition={spring}
                        >
                          <button
                            onClick={() =>
                              setConfig((c) => {
                                const exists = c.accessories.includes(a.name);
                                const accessories = exists ? c.accessories.filter((x) => x !== a.name) : [...c.accessories, a.name];
                                return { ...c, accessories };
                              })
                            }
                            className="shrink-0 w-5 h-5 rounded border flex items-center justify-center"
                            aria-pressed={selected}
                            aria-label={`Toggle ${a.name}`}
                          >
                            {selected && <CheckCircle2 className="w-4 h-4 text-black" />}
                          </button>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold truncate text-neutral-900">{a.name}</div>
                            <div className="text-xs text-neutral-500">AED {a.price.toLocaleString()}</div>
                            <button
                              type="button"
                              onClick={() => {
                                setInfoItem(a);
                                setInfoOpen(true);
                              }}
                              className="mt-1 inline-flex items-center gap-1 text-xs text-neutral-700 hover:underline"
                            >
                              <CircleHelp className="w-3 h-3" /> Learn more
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Section>
              )}
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <Section title="Confirm your configuration" subtitle="Review and place your order">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border overflow-hidden bg-white/70 backdrop-blur">
                  <div className="aspect-[16/9] bg-neutral-100">
                    <img src={exteriorObj.image} alt={config.exteriorColor} className="w-full h-full object-contain" />
                  </div>
                  <div className="px-3 py-2 text-sm font-semibold text-neutral-900">Exterior: {config.exteriorColor}</div>
                </div>
                <div className="rounded-2xl border overflow-hidden bg-white/70 backdrop-blur">
                  <div className="aspect-[16/9] bg-neutral-100">
                    {interiorObj?.img ? (
                      <img src={interiorObj.img} alt={config.interiorColor} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-neutral-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2 text-sm font-semibold text-neutral-900">Interior: {config.interiorColor}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4">
                <SummaryRow label="Year" value={config.modelYear} />
                <SummaryRow label="Engine" value={config.engine} />
                <SummaryRow label="Grade" value={config.grade} />
                <SummaryRow label="Accessories" value={config.accessories.length ? config.accessories.join(", ") : "None"} />
                <SummaryRow label="Availability" value={<StockPill status={config.stockStatus} />} />
              </div>
            </Section>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-neutral-200 p-6 sticky bottom-0 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-neutral-900">AED {total.toLocaleString()}</div>
              <div className="text-xs text-neutral-500">
                Reserve AED {reserve.toLocaleString()} · EMI from AED {Math.min(monthly3, monthly5).toLocaleString()}/mo
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={goBack} className="rounded-xl border border-neutral-300 px-4 py-3 hover:bg-black/5 transition">
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  if (step === 1) return goNext();
                  if (step === 2) {
                    if (config.stockStatus === "no-stock") return handlePayment();
                    return goNext();
                  }
                  if (step === 3) return handlePayment();
                }}
                className="rounded-xl bg-black text-white px-6 py-3 font-semibold shadow-lg hover:opacity-90 disabled:opacity-40 transition"
              >
                {step === 1 ? "Continue" : step === 2 ? (config.stockStatus === "no-stock" ? "Register your interest" : "Continue") : config.stockStatus === "pipeline" ? "Reserve now" : "Buy now"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cinematic step navigation arrows */}
      <BuilderNavigation currentStep={step} totalSteps={totalSteps} onPrevStep={goBack} onNextStep={goNext} />

      {/* Accessory info dialog */}
      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{infoItem?.name}</DialogTitle>
            <DialogDescription>Details &amp; specifications</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden border mb-3">
            <div className="aspect-[16/9] bg-neutral-100">
              <img src={exteriorObj.image} alt="Accessory visual" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="text-sm text-neutral-700">{infoItem?.desc}</div>
          <div className="text-sm font-semibold mt-2 text-neutral-900">Price: AED {infoItem ? infoItem.price.toLocaleString() : 0}</div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DesktopCarBuilder;
