// TOYOTA LAND CRUISER — MODEL‑SPECIFIC, BRANDed, MOBILE‑FIRST GALLERY
// Premium CX/UX: Toyota theme, scroll‑snap carousel, magnetic tilt,
// HUD specs with expand, narration opt‑in, dynamic BG, thumbnails+dots,
// RTL/i18n ready, AI hook. Uses your provided DAM images.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, useInView } from "framer-motion";
import { Volume2, VolumeX, ChevronDown, BatteryCharging, GaugeCircle, Zap, TimerReset, Navigation, Gauge, Sparkles } from "lucide-react";
import Lottie from "lottie-react";
import sparksAnimation from "../animations/sparks.json";

// ————————————————————————————————————————————————
// THEME (Toyota)
// ————————————————————————————————————————————————
const TOYOTA_RED = "#EB0A1E";
const TOYOTA_DARK = "#111315";

// Simple Toyota emblem (monochrome SVG)
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

// ————————————————————————————————————————————————
// TYPES
// ————————————————————————————————————————————————
export interface CarData {
  id: string;
  name: string; // Toyota Land Cruiser
  grade: string; // e.g., GR‑SPORT / VX‑R etc.
  image: string; // hero image per scene
  description: string;
  narration?: string; // optional voiceover
  specs: Record<string, string>; // HUD specs
}

interface LandCruiserGalleryProps {
  vehicles?: CarData[]; // defaults to LC scenes below
  locale?: "en" | "ar";
  rtl?: boolean;
  onAIRequest?: (vehicle: CarData) => void;
}

const STR = {
  en: {
    title: "TOYOTA LAND CRUISER",
    subtitle: "Conquer Every Land. Crafted for the impossible.",
    hint: "Swipe / scroll → Tap card to expand",
    expand: "Expand Specs",
    collapse: "Collapse Specs",
    askAI: "Ask about this grade",
    ambientOn: "Ambient on",
    ambientOff: "Ambient off",
    narrationOn: "Narration on",
    narrationOff: "Narration off",
  },
  ar: {
    title: "تويوتا لاندكروزر",
    subtitle: "قهر كل أرض. صُمم للمستحيل.",
    hint: "اسحب/مرر → اضغط للتفاصيل",
    expand: "عرض المواصفات",
    collapse: "إخفاء المواصفات",
    askAI: "اسأل عن هذه الفئة",
    ambientOn: "صوت الخلفية مُفعل",
    ambientOff: "صوت الخلفية متوقف",
    narrationOn: "السرد مُفعل",
    narrationOff: "السرد متوقف",
  },
};

// Icons for common specs
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

// ————————————————————————————————————————————————
// MODEL‑SPECIFIC DATA (Toyota Land Cruiser scenes)
// Using your DAM URLs for visuals.
// ————————————————————————————————————————————————
const DEFAULT_LC_SCENES: CarData[] = [
  {
    id: "lc-hero",
    name: "Land Cruiser",
    grade: "Hero Exterior",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
    description:
      "An icon evolved. All‑new TNGA‑F platform, lighter yet tougher. Confidence engineered into every panel.",
    narration: "/audio/lc_hero_narration.mp3",
    specs: {
      drivetrain: "Full‑time 4WD, locking diffs",
      horsepower: "409 hp (3.5L V6 Twin‑Turbo)",
      torque: "650 Nm",
      suspension: "Adaptive Variable Suspension",
      zeroToSixty: "~6.7s",
      fuelEconomy: "~10.0 L/100km",
    },
  },
  {
    id: "lc-city",
    name: "Land Cruiser",
    grade: "Urban Presence",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    description:
      "Commanding stance with refined aerodynamics. Quiet cabin. Effortless city confidence.",
    narration: "/audio/lc_city_narration.mp3",
    specs: {
      drivetrain: "10‑speed automatic",
      horsepower: "409 hp",
      torque: "650 Nm",
      suspension: "AVS + Stabilizer Disconnect (SDM)",
      range: "~800+ km",
      fuelEconomy: "~10.0 L/100km",
    },
  },
  {
    id: "lc-dune",
    name: "Land Cruiser",
    grade: "Desert Capability",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true",
    description:
      "Born for dunes. Crawl Control, Multi‑Terrain Select, and legendary cooling performance.",
    narration: "/audio/lc_dune_narration.mp3",
    specs: {
      drivetrain: "Multi‑Terrain Select + Crawl",
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
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    description:
      "Functional luxury. Intuitive switchgear, ventilated seats, & 12.3'' display with off‑road view.",
    narration: "/audio/lc_interior_narration.mp3",
    specs: {
      drivetrain: "Terrain Monitor (under‑body)",
      battery: "Dual‑battery readiness",
      suspension: "Drive Mode Select",
      range: "Third‑row flexibility",
      horsepower: "JBL® 14‑speaker audio",
      torque: "USB‑C fast charging",
    },
  },
  {
    id: "lc-grsport",
    name: "Land Cruiser",
    grade: "GR‑SPORT",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    description:
      "Motorsport attitude. Black exterior pack, tuned damping, and distinctive GR details.",
    narration: "/audio/lc_gr_narration.mp3",
    specs: {
      drivetrain: "GR‑tuned chassis",
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
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/0e241336-53f3-4bd0-8c67-61baf34bfdbd/renditions/cda649a1-788a-481d-a794-15dc2d9f7d64?binary=true&mformat=true",
    description:
      "Quiet power after dark. LED signature + reinforced visibility systems.",
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

// ————————————————————————————————————————————————
// MAIN COMPONENT (Toyota‑branded)
// ————————————————————————————————————————————————
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
  const ambientRef = useRef<HTMLAudioElement>(null);
  const narrRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Ambient control
  useEffect(() => {
    const a = ambientRef.current;
    if (!a) return;
    if (ambientOn) a.play().catch(() => {});
    else a.pause();
  }, [ambientOn]);

  // Per‑scene narration
  useEffect(() => {
    const n = narrRef.current;
    if (!n) return;
    n.pause();
    n.currentTime = 0;
    if (narrOn && vehicles[activeIdx]?.narration) {
      n.src = vehicles[activeIdx].narration!;
      n.play().catch(() => {});
    }
  }, [activeIdx, narrOn, vehicles]);

  // Scroll → update active index
  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, offsetWidth } = el;
    const gap = 16; // tighter gap on mobile
    const first = el.firstElementChild as HTMLElement | null;
    const childW = first ? first.offsetWidth + gap : offsetWidth;
    const idx = Math.round(scrollLeft / childW);
    if (idx !== activeIdx && idx >= 0 && idx < vehicles.length) setActiveIdx(idx);
  }, [activeIdx, vehicles.length]);

  // Scroll to selected when dots/thumbs pressed
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[activeIdx] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIdx]);

  const currentBG = vehicles[activeIdx]?.image;

  return (
    <section
      className={`relative w-full min-h-[100dvh] bg-[${TOYOTA_DARK}] text-white py-6 md:py-10 px-3 sm:px-4 md:px-10 overflow-hidden ${rtl ? "rtl" : ""}`}
      dir={rtl ? "rtl" : "ltr"}
      aria-label={T.title}
    >
      {/* Audio elements */}
      <audio ref={ambientRef} loop src="/audio/toyota-ambient.mp3" className="hidden" />
      <audio ref={narrRef} className="hidden" />

      {/* BG */}
      <div
        className="absolute inset-0 -z-10 transition-[opacity,transform] duration-700"
        style={{
          backgroundImage: `url(${currentBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          transform: "scale(1.03)",
          filter: "grayscale(10%)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto flex flex-col items-center text-center gap-2">
        <div className="flex items-center gap-3 text-[color:var(--toyota-red)]" style={{ color: TOYOTA_RED }}>
          <ToyotaLogo className="w-16 md:w-20" />
          <span className="sr-only">Toyota</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight" style={{ letterSpacing: "0.015em" }}>
          {T.title}
        </h1>
        <p className="mt-1 text-sm sm:text-base md:text-lg text-white/80">{T.subtitle}</p>
        <p className="mt-1 text-[11px] sm:text-xs text-[color:var(--toyota-red)] flex items-center gap-1" style={{ color: TOYOTA_RED }}>
          <Sparkles className="w-3.5 h-3.5" /> {T.hint}
        </p>
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
      </header>

      {/* Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="relative z-10 mt-6 md:mt-10 flex gap-4 sm:gap-6 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-5 scroll-smooth"
        role="listbox"
        aria-label="Land Cruiser gallery"
      >
        {vehicles.map((car, idx) => (
          <LCCard
            key={car.id}
            car={car}
            active={idx === activeIdx}
            onFocusMe={() => setActiveIdx(idx)}
            onAskAI={() => onAIRequest?.(car)}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <Thumbs vehicles={vehicles} active={activeIdx} onPick={setActiveIdx} />

      {/* Dots */}
      <Dots count={vehicles.length} active={activeIdx} onPick={setActiveIdx} />
    </section>
  );
}

// ————————————————————————————————————————————————
// SUB‑COMPONENTS (Card / Thumbs / Dots)
// ————————————————————————————————————————————————
function LCCard({ car, active, onFocusMe, onAskAI }: { car: CarData; active: boolean; onFocusMe: () => void; onAskAI: () => void }) {
  // magnetic tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [10, -10]);
  const rotateY = useTransform(x, [-80, 80], [-10, 10]);

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(bodyRef, { once: true, margin: "-80px" });
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      role="option"
      aria-selected={active}
      tabIndex={0}
      onFocus={onFocusMe}
      onMouseMove={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY }}
      className={`snap-center shrink-0 min-w-[86vw] sm:min-w-[520px] md:min-w-[620px] max-w-[820px] rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[${TOYOTA_RED}]/60 ${
        active ? `ring-1 ring-[${TOYOTA_RED}]/40` : "opacity-95"
      }`}
    >
      {/* subtle FX */}
      <Lottie animationData={sparksAnimation} loop autoplay className="pointer-events-none absolute inset-0 w-full h-full opacity-10" />

      {/* media */}
      <div className="relative">
        <img src={car.image} alt={`${car.name} • ${car.grade}`} loading="lazy" className="w-full h-[46dvh] sm:h-[360px] md:h-[380px] object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute left-0 right-0 bottom-0 p-4 sm:p-5 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">{car.name}</h3>
            <p className="text-[color:var(--toyota-red)] text-xs sm:text-sm" style={{ color: TOYOTA_RED }}>{car.grade}</p>
          </div>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs sm:text-sm"
            aria-expanded={expanded}
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "-rotate-180" : ""}`} />
            {expanded ? STR.en.collapse : STR.en.expand}
          </button>
        </div>
      </div>

      {/* body */}
      <div ref={bodyRef} className="p-4 sm:p-5 md:p-6">
        <p className={`text-white/85 text-[13px] sm:text-sm md:text-base ${inView ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}>{car.description}</p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.08 }}
          className={`grid ${expanded ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"} gap-2.5 sm:gap-3 mt-4 sm:mt-5`}
          aria-label="Specifications"
        >
          {Object.entries(car.specs).map(([key, val], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-3 py-2"
            >
              <span className="text-[color:var(--toyota-red)]" style={{ color: TOYOTA_RED }}>
                {specIcons[key] ?? <Gauge className="w-5 h-5" />}
              </span>
              <div className="text-[12px] sm:text-[13px] md:text-sm leading-snug">
                <div className="uppercase tracking-wider text-white/60 text-[10px]">{key}</div>
                <div className="font-semibold text-white">{val}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2.5">
          <button onClick={onFocusMe} className="rounded-full border border-white/15 bg-white/10 hover:bg-white/20 px-4 py-2 text-xs sm:text-sm">Focus</button>
          <button onClick={onAskAI} className="rounded-full border border-white/15 bg-[color:var(--toyota-red)]/10 hover:bg-[color:var(--toyota-red)]/20 px-4 py-2 text-xs sm:text-sm" style={{ color: TOYOTA_RED }}>
            {STR.en.askAI}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function Thumbs({ vehicles, active, onPick }: { vehicles: CarData[]; active: number; onPick: (i: number) => void }) {
  return (
    <div className="mt-5 sm:mt-6 flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap">
      {vehicles.map((v, i) => (
        <button
          key={v.id}
          className={`relative w-14 h-9 sm:w-16 sm:h-10 rounded-md overflow-hidden border ${i === active ? "border-[" + TOYOTA_RED + "] ring-2 ring-[" + TOYOTA_RED + "]/40" : "border-white/10"}`}
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

function Dots({ count, active, onPick }: { count: number; active: number; onPick: (i: number) => void }) {
  return (
    <div className="mt-4 sm:mt-5 mb-2 flex items-center justify-center gap-2" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i === active ? "bg-[" + TOYOTA_RED + "]" : "bg-white/25"}`}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  );
}
