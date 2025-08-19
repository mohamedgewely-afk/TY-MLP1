import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Volume2,
  VolumeX,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  GaugeCircle,
  Zap,
  TimerReset,
  Navigation,
  Gauge,
  BatteryCharging,
  Sparkles,
} from "lucide-react";

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
  title: string; // Land Cruiser
  scene: SceneCategory; // lifestyle scene
  image: string; // hero
  description: string; // short copy
  narration?: string; // optional voiceover
  specs: Record<string, string>; // HUD specs per scene
}

interface LandCruiserLifestyleGalleryProProps {
  scenes?: SceneData[]; // default scenes below
  locale?: "en" | "ar";
  rtl?: boolean;
  onAskToyota?: (scene: SceneData) => void; // hook for chat/lead
}

const STR = {
  en: {
    title: "TOYOTA LAND CRUISER",
    subtitle: "Conquer Every Land. Crafted for the impossible.",
    hint: "Swipe or drag · tap a scene",
    expand: "Enter Scene",
    collapse: "Close",
    ask: "Ask Toyota",
    ambientOn: "Ambient on",
    ambientOff: "Ambient off",
    narrationOn: "Narration on",
    narrationOff: "Narration off",
    scenes: ["Exterior", "Urban", "Capability", "Interior", "Night"] as SceneCategory[],
    empty: "No scenes in this filter.",
    playing: "Playing",
    paused: "Paused",
  },
  ar: {
    title: "تويوتا لاندكروزر",
    subtitle: "قهر كل أرض. صُمم للمستحيل.",
    hint: "اسحب أو اسحب بالإصبع · اضغط على مشهد",
    expand: "ادخل المشهد",
    collapse: "إغلاق",
    ask: "اسأل تويوتا",
    ambientOn: "صوت الخلفية مُفعل",
    ambientOff: "صوت الخلفية متوقف",
    narrationOn: "السرد مُفعل",
    narrationOff: "السرد متوقف",
    scenes: ["Exterior", "Urban", "Capability", "Interior", "Night"] as SceneCategory[],
    empty: "لا توجد مشاهد لهذا الفلتر.",
    playing: "يعمل",
    paused: "متوقف",
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
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
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
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
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
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true",
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
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
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
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/0e241336-53f3-4bd0-8c67-61baf34bfdbd/renditions/cda649a1-788a-481d-a794-15dc2d9f7d64?binary=true&mformat=true",
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
// UTILS
// —————————————————————————————————
const sceneSpecPriority: Record<SceneCategory, string[]> = {
  Exterior: ["horsepower", "torque", "drivetrain", "fuelEconomy"],
  Urban: ["fuelEconomy", "range", "drivetrain", "suspension"],
  Capability: ["drivetrain", "torque", "suspension", "range"],
  Interior: ["seats", "safety", "battery", "drivetrain"],
  Night: ["drivetrain", "topSpeed", "range", "horsepower"],
};

function sortSpecs(scene: SceneCategory, specs: Record<string, string>): Array<[string, string]> {
  const entries = Object.entries(specs);
  const pri = sceneSpecPriority[scene] ?? [];
  return entries.sort((a, b) => (pri.indexOf(a[0]) - pri.indexOf(b[0])));
}

// format time mm:ss
const fmt = (t: number) => {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60)
    .toString()
    .padStart(1, "0");
  const s = Math.floor(t % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

// —————————————————————————————————
// MAIN COMPONENT
// —————————————————————————————————
export default function LandCruiserLifestyleGalleryPro({
  scenes = DEFAULT_SCENES,
  locale = "en",
  rtl = false,
  onAskToyota,
}: LandCruiserLifestyleGalleryProProps) {
  const T = STR[locale] ?? STR.en;
  const prefersReduced = useReducedMotion();

  const [activeIdx, setActiveIdx] = useState(0);
  const [selected, setSelected] = useState<SceneData | null>(null);
  const [filter, setFilter] = useState<SceneCategory | "All">("All");
  const [ambientOn, setAmbientOn] = useState(false);
  const [narrOn, setNarrOn] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const narrationRef = useRef<HTMLAudioElement>(null);

  // Filter scenes by lifestyle
  const filtered = useMemo(
    () => (filter === "All" ? scenes : scenes.filter((s) => s.scene === filter)),
    [scenes, filter]
  );

  // Center a specific card within the track (no page scroll)
  const centerCard = useCallback((index: number) => {
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
    if (ambientOn) {
      a.loop = true;
      a.volume = 0.35;
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [ambientOn]);

  // Reset when filter changes
  useEffect(() => {
    setActiveIdx(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [filter]);

  // Keep track centered on activeIdx when changed programmatically
  useEffect(() => {
    centerCard(activeIdx);
  }, [activeIdx, centerCard]);

  // Narration handling in overlay
  const [narrTime, setNarrTime] = useState(0);
  const [narrDur, setNarrDur] = useState(0);
  const [isNarrPlaying, setNarrPlaying] = useState(false);

  useEffect(() => {
    const n = narrationRef.current;
    if (!n) return;
    const onTime = () => setNarrTime(n.currentTime);
    const onMeta = () => setNarrDur(n.duration || 0);
    const onPlay = () => setNarrPlaying(true);
    const onPause = () => setNarrPlaying(false);
    n.addEventListener("timeupdate", onTime);
    n.addEventListener("loadedmetadata", onMeta);
    n.addEventListener("play", onPlay);
    n.addEventListener("pause", onPause);
    return () => {
      n.removeEventListener("timeupdate", onTime);
      n.removeEventListener("loadedmetadata", onMeta);
      n.removeEventListener("play", onPlay);
      n.removeEventListener("pause", onPause);
    };
  }, []);

  // When a scene is opened/changed, (re)load audio if narration is ON
  useEffect(() => {
    const n = narrationRef.current;
    if (!n) return;
    n.pause();
    n.currentTime = 0;
    if (selected?.narration && narrOn) {
      n.src = selected.narration;
      n.play().catch(() => {});
    } else {
      n.removeAttribute("src");
      setNarrTime(0);
      setNarrDur(0);
    }
  }, [selected, narrOn]);

  // Derived currentBG for subtle page backdrop
  const currentBG = filtered[activeIdx]?.image;

  // Swipe navigation thresholds for overlay
  const openNext = useCallback(() => {
    if (!selected) return;
    const idx = filtered.findIndex((s) => s.id === selected.id);
    const next = filtered[(idx + 1) % filtered.length];
    setSelected(next);
    setActiveIdx((p) => (p + 1) % filtered.length);
  }, [selected, filtered]);

  const openPrev = useCallback(() => {
    if (!selected) return;
    const idx = filtered.findIndex((s) => s.id === selected.id);
    const prev = filtered[(idx - 1 + filtered.length) % filtered.length];
    setSelected(prev);
    setActiveIdx((p) => (p - 1 + filtered.length) % filtered.length);
  }, [selected, filtered]);

  return (
    <section
      className="relative w-full min-h-[100dvh] text-white overflow-hidden"
      style={{ backgroundColor: TOYOTA_BG }}
      dir={rtl ? "rtl" : "ltr"}
      aria-label={T.title}
    >
      {/* Audio */}
      <audio ref={ambientRef} src="/audio/toyota-ambient.mp3" className="hidden" />
      <audio ref={narrationRef} className="hidden" />

      {/* Background */}
      <div
        className="absolute inset-0 -z-10 transition-opacity duration-700"
        style={{
          backgroundImage: `url(${currentBG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />

      {/* Header */}
      <header className="relative z-10 max-w-[1200px] mx-auto flex flex-col items-center text-center gap-2 px-4 pt-6">
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
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            onClick={() => setAmbientOn((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-pressed={ambientOn}
          >
            {ambientOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {ambientOn ? T.ambientOn : T.ambientOff}
          </button>
          <button
            onClick={() => setNarrOn((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-pressed={narrOn}
          >
            {narrOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {narrOn ? T.narrationOn : T.narrationOff}
          </button>
        </div>

        {/* Lifestyle Filter (sticky on mobile bottom) */}
        <nav
          className="mt-4 hidden md:flex flex-wrap items-center justify-center gap-2 px-2"
          aria-label="Lifestyle filters"
        >
          {(["All", ...T.scenes] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c as any)}
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{
                borderColor: filter === c ? TOYOTA_RED : "rgba(255,255,255,0.2)",
                background: filter === c ? "rgba(235,10,30,0.12)" : "rgba(255,255,255,0.06)",
                color: filter === c ? TOYOTA_RED : "#fff",
              }}
              aria-pressed={filter === c}
            >
              {c}
            </button>
          ))}
        </nav>
      </header>

      {/* Carousel Track */}
      <div
        ref={trackRef}
        className="relative z-10 mt-4 md:mt-8 flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scroll-smooth touch-pan-x overscroll-x-contain items-stretch justify-center mx-auto w-full max-w-[1400px] px-4"
        role="listbox"
        aria-label="Land Cruiser lifestyle scenes"
      >
        {filtered.length === 0 && (
          <div className="text-white/70 text-sm py-10">{T.empty}</div>
        )}
        {filtered.map((sc, idx) => (
          <SceneCardPro
            key={sc.id}
            data={sc}
            active={idx === activeIdx}
            onEnter={() => {
              setSelected(sc);
              setActiveIdx(idx);
            }}
            onFocus={() => setActiveIdx(idx)}
            prefersReduced={prefersReduced}
          />
        ))}
      </div>

      {/* Mobile Sticky Filter */}
      <nav
        className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-30 w-[min(96vw,680px)] rounded-full bg-white/5 backdrop-blur border border-white/10 px-2 py-2 flex items-center gap-2 overflow-x-auto"
        aria-label="Lifestyle filters"
      >
        {(["All", ...STR.en.scenes] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c as any)}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs border"
            style={{
              borderColor: filter === c ? TOYOTA_RED : "rgba(255,255,255,0.2)",
              background: filter === c ? "rgba(235,10,30,0.12)" : "rgba(255,255,255,0.06)",
              color: filter === c ? TOYOTA_RED : "#fff",
            }}
            aria-pressed={filter === c}
          >
            {c}
          </button>
        ))}
      </nav>

      {/* Overlay / Expanded Scene */}
      <AnimatePresence>
        {selected && (
          <ExpandedSceneOverlay
            key={selected.id}
            scene={selected}
            onClose={() => setSelected(null)}
            onNext={openNext}
            onPrev={openPrev}
            narrationRef={narrationRef}
            narrOn={narrOn}
            setNarrOn={setNarrOn}
            narrTime={narrTime}
            narrDur={narrDur}
            setNarrTime={(t) => {
              const n = narrationRef.current;
              if (!n) return;
              n.currentTime = t;
              setNarrTime(t);
            }}
            isNarrPlaying={isNarrPlaying}
            setIsNarrPlaying={(p) => {
              const n = narrationRef.current;
              if (!n) return;
              p ? n.play().catch(() => {}) : n.pause();
            }}
            onAskToyota={onAskToyota}
            prefersReduced={prefersReduced}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

// —————————————————————————————————
// CARD (compact)
// —————————————————————————————————
function SceneCardPro({
  data,
  active,
  onEnter,
  onFocus,
  prefersReduced,
}: {
  data: SceneData;
  active: boolean;
  onEnter: () => void;
  onFocus: () => void;
  prefersReduced: boolean;
}) {
  const cardCls = `snap-center shrink-0 min-w-[84vw] sm:min-w-[420px] md:min-w-[520px] lg:min-w-[560px] max-w-[620px]
    rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-xl overflow-hidden`;

  return (
    <motion.article
      role="option"
      aria-selected={active}
      tabIndex={0}
      className={cardCls}
      layoutId={data.id}
      onFocus={onFocus}
      initial={false}
      animate={{
        boxShadow: active
          ? `0 0 0 2px ${TOYOTA_RED}55, 0 15px 35px 0 rgba(0,0,0,0.5)`
          : "0 10px 25px rgba(0,0,0,0.35)",
        y: active && !prefersReduced ? -2 : 0,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
    >
      <button
        type="button"
        onClick={onEnter}
        className="relative w-full text-left select-none focus-visible:outline-none"
        aria-label={`Open ${data.scene} scene`}
      >
        <img
          src={data.image}
          alt={`${data.title} • ${data.scene}`}
          loading="lazy"
          className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
        <div className="absolute left-0 right-0 bottom-0 p-3 sm:p-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">{data.title}</h3>
            <p className="text-xs sm:text-sm" style={{ color: TOYOTA_RED }}>
              {data.scene}
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 text-xs sm:text-sm">
            {STR.en.expand}
          </span>
        </div>
      </button>

      <div className="p-4 sm:p-5 md:p-6">
        <p className="text-white/85 text-[13px] sm:text-sm md:text-base">{data.description}</p>
        <div
          className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-4 sm:mt-5"
          aria-label="Specifications"
        >
          {sortSpecs(data.scene, data.specs).slice(0, 4).map(([key, val], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-3 py-2"
            >
              <span style={{ color: TOYOTA_RED }}>{specIcons[key] ?? <Gauge className="w-5 h-5" />}</span>
              <div className="text-[12px] sm:text-[13px] md:text-sm leading-snug">
                <div className="uppercase tracking-wider text-white/60 text-[10px]">
                  {key}
                </div>
                <div className="font-semibold text-white">{val}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

// —————————————————————————————————
// OVERLAY (immersive)
// —————————————————————————————————
function ExpandedSceneOverlay({
  scene,
  onClose,
  onNext,
  onPrev,
  narrationRef,
  narrOn,
  setNarrOn,
  narrTime,
  narrDur,
  setNarrTime,
  isNarrPlaying,
  setIsNarrPlaying,
  onAskToyota,
  prefersReduced,
}: {
  scene: SceneData;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  narrationRef: React.RefObject<HTMLAudioElement>;
  narrOn: boolean;
  setNarrOn: (v: boolean) => void;
  narrTime: number;
  narrDur: number;
  setNarrTime: (t: number) => void;
  isNarrPlaying: boolean;
  setIsNarrPlaying: (p: boolean) => void;
  onAskToyota?: (s: SceneData) => void;
  prefersReduced: boolean;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.8)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        layoutId={scene.id}
        className="relative z-10 mx-auto h-full w-full md:w-[min(1100px,92vw)] md:rounded-[24px] md:overflow-hidden"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        {/* Hero */}
        <div className="relative h-[46vh] sm:h-[52vh] md:h-[58vh]">
          <img
            src={scene.image}
            alt={`${scene.title} • ${scene.scene}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/0" />

          {/* Top Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <button
              onClick={onPrev}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur border border-white/15"
              aria-label="Previous scene"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur border border-white/15"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <button
              onClick={onNext}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur border border-white/15"
              aria-label="Next scene"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <div className="absolute left-0 right-0 bottom-3 px-4 sm:px-6 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">{scene.title}</h3>
              <p className="text-sm sm:text-base" style={{ color: TOYOTA_RED }}>
                {scene.scene}
              </p>
            </div>
            <button
              onClick={() => onAskToyota?.(scene)}
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border border-white/15"
              style={{ background: "rgba(235,10,30,0.12)", color: TOYOTA_RED }}
            >
              {STR.en.ask}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative bg-gradient-to-b from-zinc-950 to-black">
          <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6 pt-4 pb-24">
            <p className="text-white/85 text-sm sm:text-base md:text-lg">{scene.description}</p>

            {/* Specs (priority first) */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {sortSpecs(scene.scene, scene.specs).map(([key, val], i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: prefersReduced ? 0 : i * 0.035 }}
                  className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur px-3 py-2"
                >
                  <span style={{ color: TOYOTA_RED }}>{specIcons[key] ?? <Gauge className="w-5 h-5" />}</span>
                  <div className="text-[12px] sm:text-[13px] md:text-sm leading-snug">
                    <div className="uppercase tracking-wider text-white/60 text-[10px]">{key}</div>
                    <div className="font-semibold text-white">{val}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA on mobile */}
            <div className="sm:hidden mt-4">
              <button
                onClick={() => onAskToyota?.(scene)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm border border-white/15"
                style={{ background: "rgba(235,10,30,0.12)", color: TOYOTA_RED }}
              >
                {STR.en.ask}
              </button>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="fixed md:absolute bottom-0 left-0 right-0 z-20 bg-black/70 backdrop-blur border-t border-white/10">
            <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center gap-3">
              {/* Narration controls */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setNarrOn(!narrOn)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 bg-white/10 hover:bg-white/20 text-xs sm:text-sm"
                  aria-pressed={narrOn}
                >
                  {narrOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {narrOn ? STR.en.narrationOn : STR.en.narrationOff}
                </button>
                <button
                  onClick={() => setIsNarrPlaying(!isNarrPlaying)}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20"
                  aria-label={isNarrPlaying ? STR.en.paused : STR.en.playing}
                >
                  {isNarrPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                {/* Timeline */}
                <div className="flex items-center gap-2 w-full sm:w-[360px]">
                  <span className="text-[10px] text-white/70 w-10 text-right">
                    {fmt(narrTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={narrDur || 0}
                    step={0.1}
                    value={Math.min(narrTime, narrDur || 0)}
                    onChange={(e) => setNarrTime(parseFloat(e.currentTarget.value))}
                    className="w-full accent-[${TOYOTA_RED}]"
                    aria-label="Narration position"
                  />
                  <span className="text-[10px] text-white/70 w-10">
                    {fmt(narrDur)}
                  </span>
                </div>
              </div>

              {/* Pager */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={onPrev}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20"
                  aria-label="Previous scene"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={onNext}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20"
                  aria-label="Next scene"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}