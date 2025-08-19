// TOYOTA LAND CRUISER — MODEL‑SPECIFIC, BRANDED, MOBILE‑FIRST GALLERY (FIXED)
// Fixes:
// - Focus scroll works (no page jump)
// - Natural swipe/scroll (touch-pan-x), snap works
// - Cards are clickable (expand/collapse on tap, entire media area)
// - Added categories (filter pills)
// - Softer, tasteful animations, reduced-motion safe
// - Removed any auto-jump-on-refresh behavior
// - Smaller cards on mobile
// - Clear UX/CX purpose: discover LC grades/scenes quickly, compare specs, and engage

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Volume2, VolumeX, ChevronDown, BatteryCharging, GaugeCircle, Zap, TimerReset, Navigation, Gauge, Sparkles } from "lucide-react";
import Lottie from "lottie-react";
import sparksAnimation from "../animations/sparks.json";

// THEME
const TOYOTA_RED = "#EB0A1E";
const TOYOTA_DARK = "#111315";

function ToyotaLogo({ className = "w-20 h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" className={className} aria-label="Toyota">
      <g fill="currentColor">
        <ellipse cx="50" cy="30" rx="38" ry="22" className="opacity-90" />
        <ellipse cx="50" cy="30" rx="26" ry="14" fill={TOYOTA_DARK} />
        <ellipse cx="50" cy="30" rx="10" ry="22" fill={TOYOTA_DARK} />
      </g>
    </svg>
  );
}

// TYPES
export interface CarData {
  id: string;
  name: string; // Land Cruiser
  grade: string; // GR‑SPORT / VX‑R / etc.
  category: "Exterior" | "Capability" | "Interior" | "Sport" | "Night" | "Urban";
  image: string;
  description: string;
  narration?: string;
  specs: Record<string, string>;
}

interface LandCruiserGalleryProps {
  vehicles?: CarData[];
  locale?: "en" | "ar";
  rtl?: boolean;
  onAIRequest?: (vehicle: CarData) => void;
}

const STR = {
  en: {
    title: "TOYOTA LAND CRUISER",
    subtitle: "Conquer Every Land. Crafted for the impossible.",
    hint: "Swipe or drag → Tap to expand",
    expand: "Expand Specs",
    collapse: "Collapse Specs",
    askAI: "Ask about this grade",
    ambientOn: "Ambient on",
    ambientOff: "Ambient off",
    narrationOn: "Narration on",
    narrationOff: "Narration off",
    categories: ["Exterior", "Urban", "Capability", "Interior", "Sport", "Night"],
  },
  ar: {
    title: "تويوتا لاندكروزر",
    subtitle: "قهر كل أرض. صُمم للمستحيل.",
    hint: "اسحب أو اسحب بالإصبع → اضغط للتفاصيل",
    expand: "عرض المواصفات",
    collapse: "إخفاء المواصفات",
    askAI: "اسأل عن هذه الفئة",
    ambientOn: "صوت الخلفية مُفعل",
    ambientOff: "صوت الخلفية متوقف",
    narrationOn: "السرد مُفعل",
    narrationOff: "السرد متوقف",
    categories: ["Exterior", "Urban", "Capability", "Interior", "Sport", "Night"],
  },
};

// Icon map
const specIcons: Record<string, JSX.Element> = {
  horsepower: <Zap className="w-5 h-5" />,
  torque: <GaugeCircle className="w-5 h-5" />,
  range: <Navigation className="w-5 h-5" />,
  zeroToSixty: <TimerReset className="w-5 h-5" />,
  topSpeed: <Gauge className="w-5 h-5" />,
  battery: <BatteryCharging className="w-5 h-5" />,
  fuelEconomy: <Gauge className="w-5 h-5" />,
  drivetrain: <Navigation className="w-5 h-5" />,
  suspension: <GaugeCircle className="w-5 h-5" />,
};

// DEFAULT DATA (personalized to Land Cruiser)
const DEFAULT_LC_SCENES: CarData[] = [
  {
    id: "lc-hero",
    name: "Land Cruiser",
    grade: "Hero Exterior",
    category: "Exterior",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
    description:
      "All‑new TNGA‑F platform. Lighter, tougher, more capable.",
    narration: "/audio/lc_hero_narration.mp3",
    specs: {
      drivetrain: "Full‑time 4WD, locking diffs",
      horsepower: "409 hp (3.5L V6 TT)",
      torque: "650 Nm",
      suspension: "Adaptive Variable Suspension",
      zeroToSixty: "~6.7s",
      fuelEconomy: "~10 L/100km",
    },
  },
  {
    id: "lc-city",
    name: "Land Cruiser",
    grade: "Urban Presence",
    category: "Urban",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    description:
      "Commanding stance with refined aerodynamics.",
    narration: "/audio/lc_city_narration.mp3",
    specs: {
      drivetrain: "10‑speed automatic",
      horsepower: "409 hp",
      torque: "650 Nm",
      suspension: "AVS + SDM",
      range: "~800+ km",
      fuelEconomy: "~10 L/100km",
    },
  },
  {
    id: "lc-dune",
    name: "Land Cruiser",
    grade: "Desert Capability",
    category: "Capability",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true",
    description:
      "Born for dunes. Crawl Control and Multi‑Terrain Select.",
    narration: "/audio/lc_dune_narration.mp3",
    specs: {
      drivetrain: "MTS + Crawl",
      torque: "650 Nm",
      suspension: "KDSS/SDM tuned",
      topSpeed: "210 km/h",
      range: "~800+ km",
      horsepower: "409 hp",
    },
  },
  {
    id: "lc-interior",
    name: "Land Cruiser",
    grade: "Interior Craft",
    category: "Interior",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    description:
      "Functional luxury. 12.3'' display & Terrain Monitor.",
    narration: "/audio/lc_interior_narration.mp3",
    specs: {
      drivetrain: "Under‑body camera",
      battery: "Dual‑battery ready",
      suspension: "Drive Mode Select",
      range: "Flexible 3rd row",
      horsepower: "JBL® 14‑speaker",
      torque: "USB‑C fast charge",
    },
  },
  {
    id: "lc-grsport",
    name: "Land Cruiser",
    grade: "GR‑SPORT",
    category: "Sport",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    description:
      "Motorsport attitude with GR‑tuned chassis.",
    narration: "/audio/lc_gr_narration.mp3",
    specs: {
      drivetrain: "GR‑tuned",
      suspension: "Torsen® LSD",
      horsepower: "409 hp",
      torque: "650 Nm",
      zeroToSixty: "~6.7s",
      topSpeed: "210 km/h",
    },
  },
  {
    id: "lc-night",
    name: "Land Cruiser",
    grade: "Night Tour",
    category: "Night",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/0e241336-53f3-4bd0-8c67-61baf34bfdbd/renditions/cda649a1-788a-481d-a794-15dc2d9f7d64?binary=true&mformat=true",
    description:
      "Quiet power after dark. LED signature.",
    narration: "/audio/lc_night_narration.mp3",
    specs: {
      drivetrain: "Full‑time 4WD",
      suspension: "Adaptive lighting",
      range: "~800+ km",
      horsepower: "409 hp",
      torque: "650 Nm",
      topSpeed: "210 km/h",
    },
  },
];

export default function LandCruiserGallery({
  vehicles = DEFAULT_LC_SCENES,
  locale = "en",
  rtl = false,
  onAIRequest,
}: LandCruiserGalleryProps) {
  const T = STR[locale] ?? STR.en;
  const [activeIdx, setActiveIdx] = useState(0);
  const [ambientOn, setAmbientOn] = useState(false);
  const [narrOn, setNarrOn] = useState(false);
  const [category, setCategory] = useState<string>(T.categories[0]);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const narrRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Filter by category
  const filtered = useMemo(
    () => vehicles.filter((v) => v.category === (category as any)),
    [vehicles, category]
  );

  // Avoid page jumps: do NOT call element.scrollIntoView on mount
  // Focus scroll: adjust track's scrollLeft only
  const scrollCardIntoTrackCenter = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
    el.scrollTo({ left, behavior: "smooth" });
  }, []);

  // Ambient toggle
  useEffect(() => {
    const a = ambientRef.current;
    if (!a) return;
    if (ambientOn) a.play().catch(() => {});
    else a.pause();
  }, [ambientOn]);

  // Narration per scene
  useEffect(() => {
    const n = narrRef.current;
    if (!n) return;
    n.pause();
    n.currentTime = 0;
    if (narrOn && filtered[activeIdx]?.narration) {
      n.src = filtered[activeIdx].narration!;
      n.play().catch(() => {});
    }
  }, [activeIdx, narrOn, filtered]);

  // When category changes, reset index & scroll track to start
  useEffect(() => {
    setActiveIdx(0);
    const el = trackRef.current;
    el?.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
  }, [category]);

  // BG image based on active card
  const currentBG = filtered[activeIdx]?.image;

  return (
    <section
      className="relative w-full min-h-[100dvh] text-white overflow-hidden"
      style={{ backgroundColor: TOYOTA_DARK }}
      dir={rtl ? "rtl" : "ltr"}
      aria-label={T.title}
    >
      {/* Audio */}
      <audio ref={ambientRef} loop src="/audio/toyota-ambient.mp3" className="hidden" />
      <audio ref={narrRef} className="hidden" />

      {/* Background */}
      <div
        className="absolute inset-0 -z-10 transition-[opacity,transform] duration-700"
        style={{
          backgroundImage: `url(${currentBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          transform: "scale(1.03)",
          filter: "grayscale(8%)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center gap-2 px-4 pt-8">
        <div className="flex items-center gap-3" style={{ color: TOYOTA_RED }}>
          <ToyotaLogo className="w-14 sm:w-16 md:w-20" />
          <span className="sr-only">Toyota</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight">
          {T.title}
        </h1>
        <p className="mt-1 text-sm sm:text-base md:text-lg text-white/80">{T.subtitle}</p>
        <p className="mt-1 text-[11px] sm:text-xs flex items-center gap-1" style={{ color: TOYOTA_RED }}>
          <Sparkles className="w-3.5 h-3.5" /> {T.hint}
        </p>

        {/* Controls */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => setAmbientOn((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs sm:text-sm"
            aria-pressed={ambientOn}
          >
            {ambientOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {ambientOn ? STR[locale].ambientOn : STR[locale].ambientOff}
          </button>
          <button
            onClick={() => setNarrOn((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs sm:text-sm"
            aria-pressed={narrOn}
          >
            {narrOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {narrOn ? STR[locale].narrationOn : STR[locale].narrationOff}
          </button>
        </div>

        {/* Category Pills */}
        <nav className="mt-4 flex flex-wrap items-center justify-center gap-2 px-2" aria-label="Categories">
          {STR[locale].categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm border"
              style={{
                borderColor: category === c ? TOYOTA_RED : "rgba(255,255,255,0.2)",
                background: category === c ? "rgba(235,10,30,0.12)" : "rgba(255,255,255,0.06)",
                color: category === c ? TOYOTA_RED : "#fff",
              }}
              aria-pressed={category === c}
            >
              {c}
            </button>
          ))}
        </nav>
      </header>

      {/* Track (horizontal) */}
      <div
        ref={trackRef}
        className="relative z-10 mt-5 md:mt-8 flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 scroll-smooth touch-pan-x"
        role="listbox"
        aria-label="Land Cruiser gallery"
      >
        {filtered.map((car, idx) => (
          <LCCard
            key={car.id}
            car={car}
            active={idx === activeIdx}
            onFocusMe={() => {
              setActiveIdx(idx);
              scrollCardIntoTrackCenter(idx);
            }}
            onAskAI={() => onAIRequest?.(car)}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <Thumbs
        vehicles={filtered}
        active={activeIdx}
        onPick={(i) => {
          setActiveIdx(i);
          scrollCardIntoTrackCenter(i);
        }}
        color={TOYOTA_RED}
      />

      {/* Dots */}
      <Dots
        count={filtered.length}
        active={activeIdx}
        onPick={(i) => {
          setActiveIdx(i);
          scrollCardIntoTrackCenter(i);
        }}
        color={TOYOTA_RED}
      />
    </section>
  );
}

// CARD COMPONENT
function LCCard({
  car,
  active,
  onFocusMe,
  onAskAI,
}: {
  car: CarData;
  active: boolean;
  onFocusMe: () => void;
  onAskAI: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(bodyRef, { once: true, margin: "-80px" });
  const [expanded, setExpanded] = useState(false);

  // Mobile-friendly sizes
  const cardClasses = `snap-center shrink-0 min-w-[78vw] sm:min-w-[480px] md:min-w-[600px] max-w-[820px] rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-xl overflow-hidden focus:outline-none ${
    active ? "ring-1" : "opacity-95"
  }`;

  return (
    <article
      role="option"
      aria-selected={active}
      tabIndex={0}
      className={cardClasses}
    >
      {/* FX */}
      <Lottie animationData={sparksAnimation} loop autoplay className="pointer-events-none absolute inset-0 w-full h-full opacity-10" />

      {/* media (clickable) */}
      <button
        type="button"
        onClick={() => {
          onFocusMe();
          setExpanded((v) => !v);
        }}
        className="relative w-full text-left"
        aria-expanded={expanded}
      >
        <img
          src={car.image}
          alt={`${car.name} • ${car.grade}`}
          loading="lazy"
          className="w-full h-56 sm:h-64 md:h-72 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute left-0 right-0 bottom-0 p-3 sm:p-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">{car.name}</h3>
            <p className="text-xs sm:text-sm" style={{ color: TOYOTA_RED }}>{car.grade}</p>
          </div>
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 text-xs sm:text-sm"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "-rotate-180" : ""}`} />
            {expanded ? STR.en.collapse : STR.en.expand}
          </span>
        </div>
      </button>

      {/* body */}
      <div ref={bodyRef} className="p-4 sm:p-5 md:p-6">
        <p className={`text-white/85 text-[13px] sm:text-sm md:text-base ${inView ? "opacity-100" : "opacity-0"} transition-opacity duration-600`}>{car.description}</p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45, delay: 0.08 }}
          className={`grid ${expanded ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"} gap-2.5 sm:gap-3 mt-4 sm:mt-5`}
          aria-label="Specifications"
        >
          {Object.entries(car.specs).map(([key, val], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 6 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-3 py-2"
            >
              <span style={{ color: TOYOTA_RED }}>{specIcons[key] ?? <Gauge className="w-5 h-5" />}</span>
              <div className="text-[12px] sm:text-[13px] md:text-sm leading-snug">
                <div className="uppercase tracking-wider text-white/60 text-[10px]">{key}</div>
                <div className="font-semibold text-white">{val}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2.5">
          <button
            onClick={onFocusMe}
            className="rounded-full border border-white/15 bg-white/10 hover:bg-white/20 px-4 py-2 text-xs sm:text-sm"
          >
            Focus
          </button>
          <button
            onClick={onAskAI}
            className="rounded-full border border-white/15 px-4 py-2 text-xs sm:text-sm"
            style={{ background: "rgba(235,10,30,0.12)", color: TOYOTA_RED }}
          >
            {STR.en.askAI}
          </button>
        </div>
      </div>
    </article>
  );
}

function Thumbs({ vehicles, active, onPick, color }: { vehicles: CarData[]; active: number; onPick: (i: number) => void; color: string }) {
  return (
    <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap px-3">
      {vehicles.map((v, i) => (
        <button
          key={v.id}
          className="relative w-14 h-9 sm:w-16 sm:h-10 rounded-md overflow-hidden border"
          style={{ borderColor: i === active ? color : "rgba(255,255,255,0.15)", boxShadow: i === active ? `0 0 0 3px ${color}33` : undefined }}
          onClick={() => onPick(i)}
          aria-label={`Go to ${v.grade}`}
        >
          <img src={v.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </button>
      ))}
    </div>
  );
}

function Dots({ count, active, onPick, color }: { count: number; active: number; onPick: (i: number) => void; color: string }) {
  return (
    <div className="mt-3 mb-6 flex items-center justify-center gap-2" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className="w-2.5 h-2.5 rounded-full"
          style={{ background: i === active ? color : "rgba(255,255,255,0.25)" }}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  );
}
