// ULTIMATE VEHICLE GALLERY — 100x UPGRADE (All-in-One TSX)
// CX/UX: Scroll-snap carousel, magnetic tilt, HUD specs, narration per model,
// reusable props, CMS-ready, i18n/RTL, keyboard + swipe, AI overlay stub,
// dynamic backgrounds, reduced-motion safe, thumbnails + dots, accessible.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useInView,
} from "framer-motion";
import {
  Volume2,
  VolumeX,
  ChevronDown,
  BatteryCharging,
  GaugeCircle,
  Zap,
  TimerReset,
  Navigation,
  Gauge,
  Sparkles,
  X,
} from "lucide-react";
import Lottie from "lottie-react";
import sparksAnimation from "../animations/sparks.json";

// ---------- Types ----------
export interface CarData {
  id: string;
  name: string;
  subtitle: string;
  image: string; // hero image URL
  description: string;
  audio?: string; // ambient per-car audio (optional)
  video?: string; // reserved for future use (not autoplayed)
  narration?: string; // narration audio URL (optional)
  story?: string[]; // short lines (optional)
  specs: Record<string, string>; // at least 6 specs recommended
}

interface VehicleGalleryProps {
  vehicles?: CarData[]; // If not provided, we'll use defaults below
  locale?: "en" | "ar";
  rtl?: boolean;
  onAIRequest?: (vehicle: CarData) => void; // Hook into your AI assistant
}

// ---------- i18n ----------
const STR = {
  en: {
    title: "The Soul of Machines",
    subtitle: "Explore the lineup. Feel the story.",
    hint: "Swipe / scroll → Tap a card",
    expand: "Expand Specs",
    collapse: "Collapse Specs",
    askAI: "Ask the AI about this model",
    prev: "Previous",
    next: "Next",
    narrationOn: "Narration on",
    narrationOff: "Narration off",
  },
  ar: {
    title: "روح الآلات",
    subtitle: "اكتشف التشكيلة. عِش الحكاية.",
    hint: "اسحب/مرر → اضغط على البطاقة",
    expand: "عرض المواصفات",
    collapse: "إخفاء المواصفات",
    askAI: "اسأل الذكاء الاصطناعي عن هذا الطراز",
    prev: "السابق",
    next: "التالي",
    narrationOn: "سرد مفعّل",
    narrationOff: "سرد متوقف",
  },
};

// ---------- Icon map for common spec keys ----------
const specIcons: Record<string, JSX.Element> = {
  horsepower: <Zap className="w-5 h-5" />,
  torque: <GaugeCircle className="w-5 h-5" />,
  range: <Navigation className="w-5 h-5" />,
  zeroToSixty: <TimerReset className="w-5 h-5" />,
  topSpeed: <Gauge className="w-5 h-5" />,
  battery: <BatteryCharging className="w-5 h-5" />,
};

// ---------- Default vehicles (uses your provided DAM images) ----------
const DEFAULT_VEHICLES: CarData[] = [
  {
    id: "1",
    name: "Celestis X",
    subtitle: "The Silent Thunder",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
    description:
      "Whispers through wind with a roar that only the soul hears.",
    narration: "/audio/celestis_narration.mp3",
    audio: "/audio/celestis_ambient.mp3",
    specs: {
      horsepower: "620 hp",
      torque: "800 Nm",
      range: "520 km",
      zeroToSixty: "2.9s",
      topSpeed: "300 km/h",
      battery: "100 kWh",
    },
  },
  {
    id: "2",
    name: "Nova Pulse",
    subtitle: "The Light Runner",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    description: "Each movement is a streak across the cosmos.",
    narration: "/audio/novapulse_narration.mp3",
    audio: "/audio/novapulse_ambient.mp3",
    specs: {
      horsepower: "540 hp",
      torque: "710 Nm",
      range: "470 km",
      zeroToSixty: "3.2s",
      topSpeed: "290 km/h",
      battery: "95 kWh",
    },
  },
  {
    id: "3",
    name: "Spectra GT",
    subtitle: "The Velocity Whisperer",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true",
    description: "Disappears before your eyes — only silence remains.",
    narration: "/audio/spectra_narration.mp3",
    audio: "/audio/spectra_ambient.mp3",
    specs: {
      horsepower: "580 hp",
      torque: "750 Nm",
      range: "490 km",
      zeroToSixty: "3.1s",
      topSpeed: "295 km/h",
      battery: "98 kWh",
    },
  },
  {
    id: "4",
    name: "Zenith Eon",
    subtitle: "The Night Voyager",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    description: "Glides through time with aurora-born elegance.",
    narration: "/audio/zenith_narration.mp3",
    audio: "/audio/zenith_ambient.mp3",
    specs: {
      horsepower: "600 hp",
      torque: "770 Nm",
      range: "510 km",
      zeroToSixty: "3.0s",
      topSpeed: "305 km/h",
      battery: "100 kWh",
    },
  },
  {
    id: "5",
    name: "Lucid Storm",
    subtitle: "The Dream Machine",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    description: "It hums lullabies in lightning tongues.",
    narration: "/audio/lucid_narration.mp3",
    audio: "/audio/lucid_ambient.mp3",
    specs: {
      horsepower: "630 hp",
      torque: "820 Nm",
      range: "540 km",
      zeroToSixty: "2.8s",
      topSpeed: "315 km/h",
      battery: "104 kWh",
    },
  },
  {
    id: "6",
    name: "Aetherion",
    subtitle: "The Phantom Surge",
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/0e241336-53f3-4bd0-8c67-61baf34bfdbd/renditions/cda649a1-788a-481d-a794-15dc2d9f7d64?binary=true&mformat=true",
    description: "Leaves echoes in the air long after it's gone.",
    narration: "/audio/aetherion_narration.mp3",
    audio: "/audio/aetherion_ambient.mp3",
    specs: {
      horsepower: "700 hp",
      torque: "900 Nm",
      range: "560 km",
      zeroToSixty: "2.7s",
      topSpeed: "320 km/h",
      battery: "110 kWh",
    },
  },
];

// ---------- Helper hooks ----------
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

// ---------- Main Component ----------
export default function VehicleGallery({
  vehicles = DEFAULT_VEHICLES,
  locale = "en",
  rtl = false,
  onAIRequest,
}: VehicleGalleryProps) {
  const T = STR[locale] ?? STR.en;
  const [activeIdx, setActiveIdx] = useState(0);
  const [globalAudioOn, setGlobalAudioOn] = useState(false);
  const [narrationOn, setNarrationOn] = useState(false);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const narrationRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  // Play/pause ambient theme
  useEffect(() => {
    const a = ambientRef.current;
    if (!a) return;
    if (globalAudioOn) a.play().catch(() => {});
    else a.pause();
  }, [globalAudioOn]);

  // Play per-vehicle narration if enabled and URL exists
  useEffect(() => {
    const n = narrationRef.current;
    if (!n) return;
    n.pause();
    n.currentTime = 0;
    if (narrationOn && vehicles[activeIdx]?.narration) {
      n.src = vehicles[activeIdx].narration!;
      n.play().catch(() => {});
    }
  }, [activeIdx, narrationOn, vehicles]);

  // Snap-to-active logic on scroll
  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, offsetWidth } = el;
    const childWidth = el.firstElementChild ? (el.firstElementChild as HTMLElement).offsetWidth + 40 : offsetWidth; // 40 ~= gap
    const idx = Math.round(scrollLeft / childWidth);
    if (idx !== activeIdx && idx >= 0 && idx < vehicles.length) setActiveIdx(idx);
  }, [activeIdx, vehicles.length]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActiveIdx((i) => Math.min(i + 1, vehicles.length - 1));
      if (e.key === "ArrowLeft") setActiveIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [vehicles.length]);

  // Scroll to active when it changes (by dots/thumb/keys)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[activeIdx] as HTMLElement | undefined;
    if (child) child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIdx]);

  const currentBG = vehicles[activeIdx]?.image;

  return (
    <section
      className={`relative w-full bg-black text-white py-10 md:py-16 px-4 md:px-12 overflow-hidden ${rtl ? "rtl" : ""}`}
      dir={rtl ? "rtl" : "ltr"}
      aria-label={T.title}
    >
      {/* Ambient + narration audio elements */}
      <audio ref={ambientRef} loop src="/audio/global-theme.mp3" className="hidden" />
      <audio ref={narrationRef} className="hidden" />

      {/* Dynamic background */}
      <div
        className="absolute inset-0 -z-10 transition-[opacity,transform] duration-700"
        style={{
          backgroundImage: `url(${currentBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08,
          transform: "scale(1.02)",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />

      {/* Header / Controls */}
      <header className="relative z-10 max-w-6xl mx-auto text-center">
        <h1 className="text-3xl md:text-6xl font-bold tracking-tight">{T.title}</h1>
        <p className="mt-3 text-base md:text-lg text-white/70">{T.subtitle}</p>
        <p className="mt-2 text-xs md:text-sm text-indigo-300 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> {T.hint}
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setGlobalAudioOn((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-sm"
            aria-pressed={globalAudioOn}
            aria-label="Ambient sound toggle"
          >
            {globalAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {globalAudioOn ? "Ambient on" : "Ambient off"}
          </button>
          <button
            onClick={() => setNarrationOn((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-sm"
            aria-pressed={narrationOn}
            aria-label="Narration toggle"
          >
            {narrationOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {narrationOn ? T.narrationOn : T.narrationOff}
          </button>
        </div>
      </header>

      {/* Carousel Track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="relative z-10 mt-10 md:mt-14 flex gap-10 overflow-x-auto snap-x snap-mandatory pb-8 scroll-smooth"
        role="listbox"
        aria-label="Vehicle gallery"
      >
        {vehicles.map((car, idx) => (
          <VehicleCard
            key={car.id}
            car={car}
            active={idx === activeIdx}
            reduced={reduced}
            onFocusMe={() => setActiveIdx(idx)}
            onAskAI={() => onAIRequest?.(car)}
          />
        ))}
      </div>

      {/* Thumbnails */}
      <ThumbnailRail
        vehicles={vehicles}
        activeIdx={activeIdx}
        onPick={(i) => setActiveIdx(i)}
      />

      {/* Dots */}
      <Dots
        count={vehicles.length}
        active={activeIdx}
        onPick={(i) => setActiveIdx(i)}
      />
    </section>
  );
}

// ---------- Subcomponents ----------
function VehicleCard({
  car,
  active,
  reduced,
  onFocusMe,
  onAskAI,
}: {
  car: CarData;
  active: boolean;
  reduced: boolean;
  onFocusMe: () => void;
  onAskAI: () => void;
}) {
  // Magnetic tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-80, 80], [12, -12]);
  const rotateY = useTransform(x, [-80, 80], [-12, 12]);

  // In-view reveal
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
        if (reduced) return;
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={reduced ? undefined : { rotateX, rotateY }}
      className={`snap-center shrink-0 min-w-[85vw] md:min-w-[620px] max-w-[820px] rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-indigo-400/60 ${
        active ? "ring-1 ring-indigo-400/40" : "opacity-90"
      }`}
    >
      {/* Sparks overlay */}
      <Lottie
        animationData={sparksAnimation}
        loop
        autoplay
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        aria-hidden
      />

      {/* Image */}
      <div className="relative">
        <img
          src={car.image}
          alt={car.name}
          loading="lazy"
          className="w-full h-[52vh] md:h-[380px] object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-transparent" />
        <div className="absolute left-0 right-0 bottom-0 p-6 flex items-end justify-between">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">{car.name}</h3>
            <p className="text-indigo-300 text-xs md:text-sm">{car.subtitle}</p>
          </div>
          <button
            onClick={() => setExpanded((s) => !s)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs md:text-sm"
            aria-expanded={expanded}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform ${expanded ? "-rotate-180" : ""}`}
            />
            {expanded ? STR.en.collapse : STR.en.expand}
          </button>
        </div>
      </div>

      {/* Body / HUD */}
      <div ref={bodyRef} className="p-6 md:p-7">
        <p
          className={`text-white/80 text-sm md:text-base ${inView ? "opacity-100" : "opacity-0"} transition-opacity duration-700`}
        >
          {car.description}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`grid ${expanded ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"} gap-3 mt-5`}
          aria-label="Specifications"
        >
          {Object.entries(car.specs).map(([key, val], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-3 py-2"
            >
              <span className="text-indigo-300/90">
                {specIcons[key] ?? <Zap className="w-5 h-5" />}
              </span>
              <div className="text-xs md:text-sm">
                <div className="uppercase tracking-wider text-indigo-300 text-[10px]">
                  {key}
                </div>
                <div className="font-semibold text-white">{val}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            onClick={onFocusMe}
            className="rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-400/30 px-4 py-2 text-sm"
          >
            Focus
          </button>
          <button
            onClick={onAskAI}
            className="rounded-full bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 text-sm"
          >
            {STR.en.askAI}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function ThumbnailRail({
  vehicles,
  activeIdx,
  onPick,
}: {
  vehicles: CarData[];
  activeIdx: number;
  onPick: (i: number) => void;
}) {
  return (
    <div className="mt-6 md:mt-8 flex items-center justify-center gap-3 flex-wrap">
      {vehicles.map((v, i) => (
        <button
          key={v.id}
          className={`relative w-16 h-10 rounded-md overflow-hidden border ${
            i === activeIdx ? "border-indigo-400 ring-2 ring-indigo-400/40" : "border-white/10"
          }`}
          onClick={() => onPick(i)}
          aria-label={`Go to ${v.name}`}
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
    <div className="mt-5 flex items-center justify-center gap-2" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          className={`w-2.5 h-2.5 rounded-full ${i === active ? "bg-indigo-400" : "bg-white/20"}`}
          onClick={() => onPick(i)}
        />
      ))}
    </div>
  );
}
