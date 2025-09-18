// DesktopCarBuilder.tsx — Luxury Edition (900+ lines fully restyled)

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

/* ---------- Data ---------- */
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
    image: "https://dam.alfuttaim.com/...white",
    swatch: "#f5f5f5",
  },
  {
    name: "Midnight Black",
    image: "https://dam.alfuttaim.com/...black",
    swatch: "#101010",
  },
  {
    name: "Silver Metallic",
    image: "https://dam.alfuttaim.com/...silver",
    swatch: "#c7c9cc",
  },
  {
    name: "Deep Blue",
    image: "https://dam.alfuttaim.com/...blue",
    swatch: "#0c3c74",
  },
  {
    name: "Ruby Red",
    image: "https://dam.alfuttaim.com/...red",
    swatch: "#8a1111",
  },
] as const;
type ExteriorImage = (typeof EXTERIOR_IMAGES)[number];

const INTERIORS = [
  {
    name: "Black Leather",
    img: "https://dam.alfuttaim.com/...blackleather",
  },
  {
    name: "Beige Leather",
    img: "https://dam.alfuttaim.com/...beige",
  },
  { name: "Gray Fabric", img: "" },
] as const;
type InteriorItem = (typeof INTERIORS)[number];

const ACCESSORIES = [
  {
    name: "Premium Sound System",
    price: 1200,
    desc: "Upgraded speakers and amplifier tuned for the cabin.",
  },
  { name: "Sunroof", price: 800, desc: "Panoramic glass roof with tilt and slide." },
  {
    name: "Navigation System",
    price: 600,
    desc: "Built-in maps, voice guidance, live traffic.",
  },
  { name: "Heated Seats", price: 400, desc: "Front-row seat heating with 3 levels." },
  {
    name: "Backup Camera",
    price: 300,
    desc: "Wide-angle rear camera with dynamic guidelines.",
  },
  {
    name: "Alloy Wheels",
    price: 900,
    desc: "Lightweight alloy wheels for style and handling.",
  },
] as const;

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

/* ---------- Finance Helpers ---------- */
const APR = 0.0349;
const DOWN_PCT = 0.2;

function reserveAmount(status: StockStatus) {
  return status === "available" ? 2000 : 5000;
}

function emi(price: number, years: number) {
  const down = price * DOWN_PCT;
  const principal = Math.max(price - down, 0);
  const r = APR / 12;
  const n = years * 12;
  if (principal <= 0) return 0;
  const m =
    (principal * r * Math.pow(1 + r, n)) /
    (Math.pow(1 + r, n) - 1);
  return Math.round(m);
}

function allowedColorsFor(grade: string) {
  return GRADE_COLOR_MAP[grade] ?? EXTERIOR_IMAGES.map((c) => c.name);
}

function computeStock(
  grade: string,
  exterior: string,
  interior: string
): StockStatus {
  if (!grade || !exterior || !interior) return "pipeline";
  if (!allowedColorsFor(grade).includes(exterior)) return "no-stock";
  if (
    grade === "Platinum" &&
    exterior === "Ruby Red" &&
    interior === "Beige Leather"
  )
    return "no-stock";
  if (exterior === "Deep Blue" || interior === "Gray Fabric")
    return "pipeline";
  return "available";
}
/* ---------- SpinViewer (Manual Only: drag / wheel / keys, NO autoplay) ---------- */
const SpinViewer: React.FC<{
  frames: string[];
  fallbackStill: string;
  className?: string;
  alt?: string;
  onFirstFrameLoad?: () => void;
}> = ({ frames, fallbackStill, className, alt, onFirstFrameLoad }) => {
  const hasFrames = frames && frames.length > 0;
  const [index, setIndex] = useState(0);
  const startXRef = useRef<number | null>(null);

  const step = (delta: number) =>
    setIndex((cur) => ((cur + delta + frames.length) % frames.length));

  const onPointerDown = (e: React.PointerEvent) => {
    startXRef.current = e.clientX;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startXRef.current == null) return;
    const dx = e.clientX - startXRef.current;
    if (Math.abs(dx) >= 6) {
      step(Math.trunc(dx / 6));
      startXRef.current = e.clientX;
    }
  };
  const onPointerUp = () => {
    startXRef.current = null;
  };

  if (!hasFrames) {
    return (
      <img
        src={fallbackStill}
        alt={alt}
        className={className}
        draggable={false}
        onLoad={onFirstFrameLoad}
      />
    );
  }

  return (
    <div
      className="w-full h-full select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <img
        src={frames[index]}
        alt={alt}
        className={className}
        draggable={false}
        onLoad={onFirstFrameLoad}
      />
    </div>
  );
};

/* ---------- UI Subcomponents ---------- */
const Section: React.FC<{
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}> = ({ title, subtitle, children }) => (
  <section className="px-6 py-8 border-b border-black/10">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        {subtitle && (
          <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
        )}
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
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-full px-4 py-2 border transition ${
              active
                ? "bg-black text-white border-black"
                : "border-neutral-300 hover:border-black/40 hover:bg-black/5"
            }`}
          >
            {opt}
            {meta?.(opt) && (
              <span className="ml-2 text-xs text-neutral-400">
                {meta(opt)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

const FinanceCard: React.FC<{
  label: string;
  value: string;
  hint?: string;
}> = ({ label, value, hint }) => (
  <div className="rounded-2xl border border-black/20 p-4 bg-white/70 backdrop-blur shadow-sm">
    <div className="text-xs text-neutral-500">{label}</div>
    <div className="text-xl font-bold text-neutral-900">{value}</div>
    {hint && <div className="text-xs text-neutral-400 mt-1">{hint}</div>}
  </div>
);

const StepDots: React.FC<{ current: number; total: number }> = ({
  current,
  total,
}) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 rounded-full transition-all ${
          i + 1 <= current
            ? "bg-black w-8"
            : "bg-neutral-300 w-3"
        }`}
      />
    ))}
  </div>
);

const SelectableCard: React.FC<{
  selected?: boolean;
  onClick?: () => void;
  image: string;
  label: string;
  caption?: string;
}> = ({ selected, onClick, image, label, caption }) => (
  <button
    onClick={onClick}
    className={`group relative overflow-hidden rounded-2xl border transition text-left ${
      selected
        ? "border-black bg-black/5"
        : "border-neutral-300 hover:border-black/40"
    }`}
  >
    <div className="aspect-[16/10] bg-neutral-100">
      <motion.img
        src={image}
        alt={label}
        className="w-full h-full object-cover"
        initial={{ scale: 1.04 }}
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 180, damping: 16 }}
      />
    </div>
    <div className="p-3">
      <div className="text-sm font-semibold flex items-center gap-2">
        {label}
        {selected && <CheckCircle2 className="h-4 w-4 text-black" />}
      </div>
      {caption && <div className="text-xs text-neutral-500">{caption}</div>}
    </div>
  </button>
);

const StockPill: React.FC<{ status: StockStatus }> = ({ status }) => {
  const map = {
    "no-stock":
      "bg-red-100 text-red-700 border border-red-200",
    pipeline:
      "bg-yellow-100 text-yellow-700 border border-yellow-200",
    available:
      "bg-green-100 text-green-700 border border-green-200",
  } as const;
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {status === "no-stock"
        ? "No Stock"
        : status === "pipeline"
        ? "Pipeline"
        : "Available"}
    </span>
  );
};

const SummaryRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="flex items-center justify-between border rounded-xl px-3 py-2 bg-white/60 backdrop-blur">
    <span className="text-sm text-neutral-500">{label}</span>
    <span className="text-sm font-semibold text-neutral-900">{value}</span>
  </div>
);
/* ---------- Main Component ---------- */
const DesktopCarBuilder: React.FC<DesktopCarBuilderProps> = ({
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
  variant = "desktop",
}) => {
  const prefersReducedMotion = useReducedMotion();

  const [heroMode, setHeroMode] = useState<"exterior" | "interior">("exterior");
  const [exteriorView, setExteriorView] = useState<"photo" | "spin">("photo");
  const [imageLoadedKey, setImageLoadedKey] = useState<string>("");

  const exteriorObj = useMemo<ExteriorImage>(
    () =>
      EXTERIOR_IMAGES.find((c) => c.name === config.exteriorColor) ||
      EXTERIOR_IMAGES[0],
    [config.exteriorColor]
  );
  const interiorObj = useMemo<InteriorItem | undefined>(
    () => INTERIORS.find((i) => i.name === config.interiorColor),
    [config.interiorColor]
  );
  const heroKey = `${exteriorObj.image}-${config.grade}-${config.modelYear}-${heroMode}-${interiorObj?.img ?? "no-int"}-${exteriorView}`;

  // Spin frames per color
  const SPIN_SETS: Record<string, string[]> = {
    "Pearl White": [exteriorObj.image],
    "Midnight Black": [exteriorObj.image],
    "Silver Metallic": [exteriorObj.image],
    "Deep Blue": [exteriorObj.image],
    "Ruby Red": [exteriorObj.image],
  };
  const currentSpinFrames = useMemo(
    () => SPIN_SETS[config.exteriorColor] || [],
    [config.exteriorColor]
  );

  // Finance values
  const total = calculateTotalPrice();
  const monthly3 = useMemo(() => emi(total, 3), [total]);
  const monthly5 = useMemo(() => emi(total, 5), [total]);
  const reserve = useMemo(
    () => reserveAmount(config.stockStatus),
    [config.stockStatus]
  );

  /* ---------- Layout Panels ---------- */
  const panel =
    variant === "tablet"
      ? { left: "w-[56%]", right: "w-[44%]" }
      : { left: "w-[60%]", right: "w-[40%]" };

  return (
    <motion.div
      className="relative h-screen w-full flex"
      style={{
        background: "linear-gradient(135deg, #fdfdfd 0%, #f2f2f2 100%)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Left Hero Panel */}
      <div
        className={`${panel.left} h-full relative overflow-hidden`}
        style={{
          background: "linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%)",
          borderRight: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* Hero Toggle */}
        <div className="absolute top-6 left-6 z-20 border border-black/10 rounded-2xl bg-white/70 backdrop-blur px-3 py-1.5 flex items-center gap-2 shadow-lg">
          <Sparkles className="h-4 w-4 text-black/70" />
          {(["exterior", "interior"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setHeroMode(m)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                heroMode === m
                  ? "bg-black text-white shadow"
                  : "hover:bg-black/5"
              }`}
            >
              {m === "exterior" ? "Exterior" : "Interior"}
            </button>
          ))}
          {heroMode === "exterior" && (
            <div className="ml-3 flex items-center gap-1 pl-3 border-l border-black/10">
              {(["photo", "spin"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setExteriorView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    exteriorView === v
                      ? "bg-neutral-900 text-white"
                      : "hover:bg-black/5"
                  }`}
                >
                  {v === "photo" ? "Photo" : "360°"}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Hero Image */}
        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-white/70 to-gray-100">
          {!imageLoadedKey || imageLoadedKey !== heroKey ? (
            <div className="absolute inset-0 m-8 rounded-2xl bg-neutral-200 animate-pulse" />
          ) : null}

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
                initial={
                  prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }
                }
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
              initial={
                prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }
              }
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 250, damping: 28 }}
              onLoad={() => setImageLoadedKey(heroKey)}
            />
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className={`${panel.right} h-full flex flex-col border-l border-black/10`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-black/10 bg-white/70 backdrop-blur">
          <button
            onClick={step > 1 ? goBack : onClose}
            className="p-3 rounded-2xl border border-black/20 hover:bg-black/5 transition"
          >
            {step > 1 ? (
              <ArrowLeft className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-neutral-900">
              Build Your{" "}
              <span className="text-neutral-500">{vehicle.name}</span>
            </h1>
            <StepDots current={step} total={totalSteps} />
          </div>
          <button
            onClick={onReset}
            className="p-3 rounded-2xl border border-black/20 hover:bg-black/5 transition text-red-600"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scroll-pb-[200px]">
          {/* STEP 1 */}
          {step === 1 && (
            <Section
              title="Model Year & Powertrain"
              subtitle="Pick your year and engine to begin"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CompactSegmented
                  label="Model Year"
                  options={YEARS}
                  value={config.modelYear}
                  onChange={(y) =>
                    setConfig((c) => ({
                      ...c,
                      modelYear: y,
                      stockStatus: computeStock(
                        c.grade,
                        c.exteriorColor,
                        c.interiorColor
                      ),
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
                      stockStatus: computeStock(
                        c.grade,
                        c.exteriorColor,
                        c.interiorColor
                      ),
                    }))
                  }
                  meta={(name) =>
                    ENGINES.find((e) => e.name === name)?.tag
                  }
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <FinanceCard
                  label="Reserve"
                  value={`AED ${reserve.toLocaleString()}`}
                  hint={
                    config.stockStatus === "available"
                      ? "Pay now to secure"
                      : "Refundable pre-order"
                  }
                />
                <FinanceCard
                  label="EMI from"
                  value={`AED ${Math.min(
                    monthly3,
                    monthly5
                  ).toLocaleString()}/mo`}
                  hint="20% down · 3.49% APR · up to 5y"
                />
              </div>
            </Section>
          )}
          {/* STEP 2 */}
          {step === 2 && (
            <>
              {/* Grade Selection */}
              <Section title="Grade" subtitle="Select trim level">
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
                  {GRADES.map((g) => (
                    <SelectableCard
                      key={g.name}
                      selected={config.grade === g.name}
                      onClick={() =>
                        setConfig((c) => {
                          const allowed = allowedColorsFor(g.name);
                          const nextExterior = allowed.includes(
                            c.exteriorColor
                          )
                            ? c.exteriorColor
                            : allowed[0];
                          return {
                            ...c,
                            grade: g.name,
                            exteriorColor: nextExterior,
                            stockStatus: computeStock(
                              g.name,
                              nextExterior,
                              c.interiorColor
                            ),
                          };
                        })
                      }
                      image={GRADE_IMAGES[g.name]}
                      label={g.name}
                      caption={g.badge}
                    />
                  ))}
                </div>
              </Section>

              {/* Exterior Colors */}
              <Section
                title="Exterior"
                subtitle={
                  config.grade
                    ? "Choose a color available for your grade"
                    : "Select a grade to view colors"
                }
              >
                {!config.grade ? (
                  <div className="text-xs text-neutral-500">
                    Choose a grade above.
                  </div>
                ) : (
                  <div
                    className="flex flex-wrap gap-3"
                    role="radiogroup"
                    aria-label="Exterior color"
                  >
                    {allowedColorsFor(config.grade).map((colorName) => {
                      const colorObj = EXTERIOR_IMAGES.find(
                        (c) => c.name === colorName
                      )!;
                      const isActive =
                        config.exteriorColor === colorObj.name;
                      return (
                        <button
                          key={colorObj.name}
                          onClick={() =>
                            setConfig((c) => ({
                              ...c,
                              exteriorColor: colorObj.name,
                              stockStatus: computeStock(
                                c.grade,
                                colorObj.name,
                                c.interiorColor
                              ),
                            }))
                          }
                          className={`relative w-12 h-12 rounded-full border ${
                            isActive
                              ? "border-black ring-2 ring-black/40"
                              : "border-neutral-300 hover:border-black/40"
                          }`}
                          role="radio"
                          aria-checked={isActive}
                          title={colorObj.name}
                        >
                          <span
                            className="absolute inset-0 rounded-full"
                            style={{ background: colorObj.swatch }}
                          />
                          <span className="sr-only">{colorObj.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </Section>

              {/* Interior */}
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
                              stockStatus: computeStock(
                                c.grade,
                                c.exteriorColor,
                                i.name
                              ),
                            }))
                          }
                          className={`rounded-2xl border p-2 text-left transition ${
                            selected
                              ? "border-black bg-black/5"
                              : "border-neutral-300 hover:border-black/40"
                          }`}
                        >
                          <div className="h-24 w-full rounded-xl overflow-hidden bg-neutral-100">
                            {i.img ? (
                              <img
                                src={i.img}
                                alt={i.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full grid place-items-center text-neutral-400">
                                <ImageIcon className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-sm font-semibold truncate">
                            {i.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Section>
              )}

              {/* Stock */}
              {config.grade &&
                config.exteriorColor &&
                config.interiorColor && (
                  <Section
                    title="Stock"
                    subtitle="Availability depends on color and interior"
                  >
                    <StockPill status={config.stockStatus} />
                  </Section>
                )}

              {/* Accessories */}
              {config.grade &&
                config.exteriorColor &&
                config.interiorColor && (
                  <Section title="Accessories" subtitle="Personalize your ride">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {ACCESSORIES.map((a) => {
                        const selected = config.accessories.includes(a.name);
                        return (
                          <motion.div
                            key={a.name}
                            className={`rounded-xl border p-3 flex items-start gap-3 transition-all ${
                              selected
                                ? "border-black bg-black/5"
                                : "border-neutral-300 hover:border-black/40"
                            }`}
                            animate={{ scale: selected ? 1.02 : 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 20,
                            }}
                          >
                            <button
                              onClick={() =>
                                setConfig((c) => {
                                  const exists = c.accessories.includes(
                                    a.name
                                  );
                                  const accessories = exists
                                    ? c.accessories.filter(
                                        (x) => x !== a.name
                                      )
                                    : [...c.accessories, a.name];
                                  return { ...c, accessories };
                                })
                              }
                              className="shrink-0 w-5 h-5 rounded border flex items-center justify-center"
                              aria-pressed={selected}
                            >
                              {selected && (
                                <CheckCircle2 className="w-4 h-4 text-black" />
                              )}
                            </button>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold truncate">
                                {a.name}
                              </div>
                              <div className="text-xs text-neutral-500">
                                AED {a.price.toLocaleString()}
                              </div>
                              <button
                                type="button"
                                className="mt-1 inline-flex items-center gap-1 text-xs text-neutral-600 hover:underline"
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
            <Section
              title="Confirm your configuration"
              subtitle="Review and place your order"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border overflow-hidden bg-white/70 backdrop-blur">
                  <div className="aspect-[16/9] bg-neutral-100">
                    <img
                      src={exteriorObj.image}
                      alt={config.exteriorColor}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="px-3 py-2 text-sm font-semibold">
                    Exterior: {config.exteriorColor}
                  </div>
                </div>
                <div className="rounded-2xl border overflow-hidden bg-white/70 backdrop-blur">
                  <div className="aspect-[16/9] bg-neutral-100">
                    {interiorObj?.img ? (
                      <img
                        src={interiorObj.img}
                        alt={config.interiorColor}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-neutral-400">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>
                  <div className="px-3 py-2 text-sm font-semibold">
                    Interior: {config.interiorColor}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4">
                <SummaryRow label="Year" value={config.modelYear} />
                <SummaryRow label="Engine" value={config.engine} />
                <SummaryRow label="Grade" value={config.grade} />
                <SummaryRow
                  label="Accessories"
                  value={
                    config.accessories.length
                      ? config.accessories.join(", ")
                      : "None"
                  }
                />
                <SummaryRow
                  label="Availability"
                  value={<StockPill status={config.stockStatus} />}
                />
              </div>
            </Section>
          )}
        </div>

        {/* Footer CTA */}
        <div className="border-t border-black/10 p-6 sticky bottom-0 bg-white/80 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-bold text-neutral-900">
                AED {total.toLocaleString()}
              </div>
              <div className="text-xs text-neutral-500">
                Reserve AED {reserve.toLocaleString()} · EMI from AED{" "}
                {Math.min(monthly3, monthly5).toLocaleString()}/mo
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goBack}
                className="rounded-xl border border-black/20 px-4 py-3 hover:bg-black/5 transition"
              >
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
                {step === 1
                  ? "Continue"
                  : step === 2
                  ? config.stockStatus === "no-stock"
                    ? "Register your interest"
                    : "Continue"
                  : config.stockStatus === "pipeline"
                  ? "Reserve now"
                  : "Buy now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ---------- Export ---------- */
export default DesktopCarBuilder;
