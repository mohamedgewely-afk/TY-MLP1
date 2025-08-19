// TOYOTA LAND CRUISER — LIFESTYLE SCENES GALLERY (EXTERIOR | URBAN | CAPABILITY | INTERIOR | NIGHT)
// Production TSX. Toyota branded. Mobile-first. Centered desktop. Swipe + snap. No auto-scroll on load.
// Scenes are lifestyle-based (not grades). Specs tailored per scene. Narration toggle optional.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Volume2, VolumeX, ChevronDown, BatteryCharging, GaugeCircle, Zap, TimerReset, Navigation, Gauge, Sparkles } from "lucide-react";
import Lottie from "lottie-react";
import sparksAnimation from "../animations/sparks.json";

// —————————————————————————————————
// THEME (Toyota)
// —————————————————————————————————
const TOYOTA_RED = "#EB0A1E";
const TOYOTA_BG = "#0D0F10";

function ToyotaLogo({ className = "w-20 h-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 60" className={className} aria-label="Toyota">
      <g fill="currentColor">
        <ellipse cx="50" cy="30" rx="38" ry="22" className="opacity-90" />
        <ellipse cx="50" cy="30" rx="26" ry="14" fill={TOYOTA_BG} />
        <ellipse cx="50" cy="30" rx="10" ry="22" fill={TOYOTA_BG} />
      </g>
    </svg>
  );
}

// —————————————————————————————————
// TYPES
// —————————————————————————————————
export type SceneCategory = "Exterior" | "Urban" | "Capability" | "Interior" | "Night";
export interface SceneData {
  id: string;
  title: string;        // Land Cruiser
  scene: SceneCategory; // lifestyle scene
  image: string;        // hero
  description: string;  // short copy
  narration?: string;   // optional voiceover
  specs: Record<string, string>; // HUD specs per scene
}

interface LandCruiserLifestyleGalleryProps {
  scenes?: SceneData[]; // default scenes below
  locale?: "en" | "ar";
  rtl?: boolean;
  onAskToyota?: (scene: SceneData) => void; // hook for chat/lead
}

const STR = {
  en: {
    title: "TOYOTA LAND CRUISER",
    subtitle: "Conquer Every Land. Crafted for the impossible.",
    hint: "Swipe or drag · tap card to expand",
    expand: "Expand Specs",
    collapse: "Collapse Specs",
    ask: "Ask Toyota",
    ambientOn: "Ambient on",
    ambientOff: "Ambient off",
    narrationOn: "Narration on",
    narrationOff: "Narration off",
    scenes: ["Exterior", "Urban", "Capability", "Interior", "Night"] as SceneCategory[],
    empty: "No scenes in this filter.",
  },
  ar: {
    title: "تويوتا لاندكروزر",
    subtitle: "قهر كل أرض. صُمم للمستحيل.",
    hint: "اسحب أو اسحب بالإصبع · اضغط للتفاصيل",
    expand: "عرض المواصفات",
    collapse: "إخفاء المواصفات",
    ask: "اسأل تويوتا",
    ambientOn: "صوت الخلفية مُفعل",
    ambientOff: "صوت الخلفية متوقف",
    narrationOn: "السرد مُفعل",
    narrationOff: "السرد متوقف",
    scenes: ["Exterior", "Urban", "Capability", "Interior", "Night"] as SceneCategory[],
    empty: "لا توجد مشاهد لهذا الفلتر.",
  },
};

// Icon map for common specs
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
  seats: <Gauge className="w-5 h-5" />,
  safety: <GaugeCircle className="w-5 h-5" />,
};

// —————————————————————————————————
// DEFAULT LIFESTYLE SCENES (uses your DAM images)
// —————————————————————————————————
const DEFAULT_SCENES: SceneData[] = [
  {
    id: "lc-exterior-hero",
    title: "Land Cruiser",
    scene: "Exterior",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
    description: "TNGA‑F platform. Lighter, tougher, more capable.",
    narration: "/audio/lc_exterior.mp3",
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
    id: "lc-urban",
    title: "Land Cruiser",
    scene: "Urban",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    description: "Commanding stance with refined aerodynamics.",
    narration: "/audio/lc_urban.mp3",
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
    id: "lc-capability",
    title: "Land Cruiser",
    scene: "Capability",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true",
    description: "Born for dunes. Crawl Control and Multi‑Terrain Select.",
    narration: "/audio/lc_capability.mp3",
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
    title: "Land Cruiser",
    scene: "Interior",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    description: "Functional luxury. 12.3'' display & Terrain Monitor.",
    narration: "/audio/lc_interior.mp3",
    specs: {
      seats: "Ventilated leather, flexible 3rd row",
      drivetrain: "Under‑body camera",
      battery: "Dual‑battery ready",
      suspension: "Drive Mode Select",
      safety: "Toyota Safety Sense",
      fuelEconomy: "USB‑C fast charge",
    },
  },
  {
    id: "lc-night",
    title: "Land Cruiser",
    scene: "Night",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/0e241336-53f3-4bd0-8c67-61baf34bfdbd/renditions/cda649a1-788a-481d-a794-15dc2d9f7d64?binary=true&mformat=true",
    description: "Quiet power after dark. LED signature.",
    narration: "/audio/lc_night.mp3",
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

// —————————————————————————————————
// MAIN COMPONENT
// —————————————————————————————————
export default function LandCruiserLifestyleGallery({
  scenes = DEFAULT_SCENES,
  locale = "en",
  rtl = false,
  onAskToyota,
}: LandCruiserLifestyleGalleryProps) {
  const T = STR[locale] ?? STR.en;
  const [activeIdx, setActiveIdx] = useState(0);
  const [ambientOn, setAmbientOn] = useState(false);
  const [narrOn, setNarrOn] = useState(false);
  const [filter, setFilter] = useState<SceneCategory | "All">("All");
  const ambientRef = useRef<HTMLAudioElement>(null);
  const narrRef = useRef<HTMLAudioElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Filter scenes by lifestyle
  const filtered = useMemo(() => (filter === "All" ? scenes : scenes.filter((s) => s.scene === filter)), [scenes, filter]);

  // Center a specific card within the track (no page scroll)
  const centerCard = useCallback((index: number) => {
    const el = trackRef.current; if (!el) return;
    const child = el.children[index] as HTMLElement | undefined; if (!child) return;
    const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
    el.scrollTo({ left, behavior: "smooth" });
  }, []);

  // Ambient toggle
  useEffect(() => {
    const a = ambientRef.current; if (!a) return; ambientOn ? a.play().catch(() => {}) : a.pause();
  }, [ambientOn]);

  // Narration per active scene
  useEffect(() => {
    const n = narrRef.current; if (!n) return; n.pause(); n.currentTime = 0;
    if (narrOn && filtered[activeIdx]?.narration) { n.src = filtered[activeIdx].narration!; n.play().catch(() => {}); }
  }, [activeIdx, narrOn, filtered]);

  // Reset when filter changes
  useEffect(() => { setActiveIdx(0); trackRef.current?.scrollTo({ left: 0 }); }, [filter]);

  const currentBG = filtered[activeIdx]?.image;

  return (
    <section className="relative w-full min-h-[100dvh] text-white overflow-hidden" style={{ backgroundColor: TOYOTA_BG }} dir={rtl ? "rtl" : "ltr"} aria-label={T.title}>
      {/* Audio */}
      <audio ref={ambientRef} loop src="/audio/toyota-ambient.mp3" className="hidden" />
      <audio ref={narrRef} className="hidden" />

      {/* Background */}
      <div className="absolute inset-0 -z-10 transition-opacity duration-700" style={{ backgroundImage: `url(${currentBG})`, backgroundSize: "cover", backgroundPosition: "center", opacity: 0.1 }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />

      {/* Header */}
      <header className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center text-center gap-2 px-4 pt-8">
        <div className="flex items-center gap-3" style={{ color: TOYOTA_RED }}>
          <ToyotaLogo className="w-14 sm:w-16 md:w-20" />
          <span className="sr-only">Toyota</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight">{T.title}</h1>
        <p className="mt-1 text-sm sm:text-base md:text-lg text-white/80">{T.subtitle}</p>
        <p className="mt-1 text-[11px] sm:text-xs flex items-center gap-1" style={{ color: TOYOTA_RED }}>
          <Sparkles className="w-3.5 h-3.5" /> {T.hint}
        </p>

        {/* Controls */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button onClick={() => setAmbientOn((v) => !v)} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs sm:text-sm" aria-pressed={ambientOn}>
            {ambientOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {ambientOn ? T.ambientOn : T.ambientOff}
          </button>
          <button onClick={() => setNarrOn((v) => !v)} className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs sm:text-sm" aria-pressed={narrOn}>
            {narrOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {narrOn ? T.narrationOn : T.narrationOff}
          </button>
        </div>

        {/* Lifestyle Filter */}
        <nav className="mt-4 flex flex-wrap items-center justify-center gap-2 px-2" aria-label="Lifestyle filters">
          {(["All", ...T.scenes] as const).map((c) => (
            <button key={c} onClick={() => setFilter(c as any)} className="rounded-full px-3 py-1.5 text-xs sm:text-sm border" style={{ borderColor: filter === c ? TOYOTA_RED : "rgba(255,255,255,0.2)", background: filter === c ? "rgba(235,10,30,0.12)" : "rgba(255,255,255,0.06)", color: filter === c ? TOYOTA_RED : "#fff" }} aria-pressed={filter === c}>
              {c}
            </button>
          ))}
        </nav>
      </header>

      {/* Carousel Track */}
      <div
        ref={trackRef}
        className="relative z-10 mt-5 md:mt-8 flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scroll-smooth touch-pan-x overscroll-x-contain items-stretch justify-center mx-auto w-full max-w-[1400px] px-4"
        role="listbox"
        aria-label="Land Cruiser lifestyle scenes"
      >
        {filtered.length === 0 && <div className="text-white/70 text-sm py-10">{T.empty}</div>}
        {filtered.map((sc, idx) => (
          <SceneCard key={sc.id} data={sc} active={idx === activeIdx} onFocus={() => { setActiveIdx(idx); centerCard(idx); }} onAsk={() => onAskToyota?.(sc)} />
        ))}
      </div>

      {/* Thumbs */}
      <Thumbs items={filtered} active={activeIdx} onPick={(i) => { setActiveIdx(i); centerCard(i); }} color={TOYOTA_RED} />
      {/* Dots */}
      <Dots count={filtered.length} active={activeIdx} onPick={(i) => { setActiveIdx(i); centerCard(i); }} color={TOYOTA_RED} />
    </section>
  );
}

// —————————————————————————————————
// CARD
// —————————————————————————————————
function SceneCard({ data, active, onFocus, onAsk }: { data: SceneData; active: boolean; onFocus: () => void; onAsk: () => void }) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(bodyRef, { once: true, margin: "-80px" });
  const [expanded, setExpanded] = useState(false);

  const cardCls = `snap-center shrink-0 min-w-[84vw] sm:min-w-[420px] md:min-w-[520px] lg:min-w-[560px] max-w-[620px]
    rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-xl overflow-hidden
    focus:outline-none ${active ? "ring-1 ring-[" + TOYOTA_RED + "]/40" : "opacity-95"}`;

  return (
    <article role="option" aria-selected={active} tabIndex={0} className={cardCls}>
      <Lottie animationData={sparksAnimation} loop autoplay className="pointer-events-none absolute inset-0 w-full h-full opacity-10" />

      {/* Tap area */}
      <button type="button" onClick={() => { onFocus(); setExpanded((v) => !v); }} className="relative w-full text-left" aria-expanded={expanded}>
        <img src={data.image} alt={`${data.title} • ${data.scene}`} loading="lazy" className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute left-0 right-0 bottom-0 p-3 sm:p-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">{data.title}</h3>
            <p className="text-xs sm:text-sm" style={{ color: TOYOTA_RED }}>{data.scene}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 text-xs sm:text-sm">
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "-rotate-180" : ""}`} />
            {expanded ? STR.en.collapse : STR.en.expand}
          </span>
        </div>
      </button>

      <div ref={bodyRef} className="p-4 sm:p-5 md:p-6">
        <p className={`text-white/85 text-[13px] sm:text-sm md:text-base ${inView ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>{data.description}</p>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.4, delay: 0.06 }} className={`grid ${expanded ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2"} gap-2.5 sm:gap-3 mt-4 sm:mt-5`} aria-label="Specifications">
          {Object.entries(data.specs).map(([key, val], i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 6 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.3, delay: i * 0.04 }} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-3 py-2">
              <span style={{ color: TOYOTA_RED }}>{specIcons[key] ?? <Gauge className="w-5 h-5" />}</span>
              <div className="text-[12px] sm:text-[13px] md:text-sm leading-snug">
                <div className="uppercase tracking-wider text-white/60 text-[10px]">{key}</div>
                <div className="font-semibold text-white">{val}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-4 sm:mt-5 flex flex-wrap items-center gap-2.5">
          <button onClick={onFocus} className="rounded-full border border-white/15 bg-white/10 hover:bg-white/20 px-4 py-2 text-xs sm:text-sm">Focus</button>
          <button onClick={onAsk} className="rounded-full border border-white/15 px-4 py-2 text-xs sm:text-sm" style={{ background: "rgba(235,10,30,0.12)", color: TOYOTA_RED }}>{STR.en.ask}</button>
        </div>
      </div>
    </article>
  );
}

// —————————————————————————————————
// THUMBS & DOTS
// —————————————————————————————————
function Thumbs({ items, active, onPick, color }: { items: SceneData[]; active: number; onPick: (i: number) => void; color: string }) {
  return (
    <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap px-4">
      {items.map((v, i) => (
        <button key={v.id} className="relative w-14 h-9 sm:w-16 sm:h-10 rounded-md overflow-hidden border" style={{ borderColor: i === active ? color : "rgba(255,255,255,0.15)", boxShadow: i === active ? `0 0 0 3px ${color}33` : undefined }} onClick={() => onPick(i)} aria-label={`Go to ${v.scene}`}>
          <img src={v.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/30" />
        </button>
      ))}
    </div>
  );
}

function Dots({ count, active, onPick, color }: { count: number; active: number; onPick: (i: number) => void; color: string }) {
  return (
    <div className="mt-3 mb-8 flex items-center justify-center gap-2" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <button key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: i === active ? color : "rgba(255,255,255,0.25)" }} onClick={() => onPick(i)} />
      ))}
    </div>
  );
}
