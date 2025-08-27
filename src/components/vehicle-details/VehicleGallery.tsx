import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Volume2, VolumeX, X, Play, Pause, ChevronLeft, ChevronRight,
  GaugeCircle, Zap, TimerReset, Navigation, Gauge, BatteryCharging, Sparkles,
} from "lucide-react";

// —————————————————————————————————
// THEME
// —————————————————————————————————
const TOYOTA_RED = "#EB0A1E" as const;
const TOYOTA_BG  = "#0D0F10" as const;

function ToyotaLogo({
  className = "w-20 h-auto",
  decorative = true,
}: { className?: string; decorative?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 60"
      className={className}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": "Toyota" })}
      focusable="false"
    >
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
  title: string;
  scene: SceneCategory;
  image: string;
  description: string;
  narration?: string;
  specs: Record<string, string>;
}

interface LandCruiserLifestyleGalleryProProps {
  scenes?: SceneData[];
  locale?: "en" | "ar";
  rtl?: boolean;
  onAskToyota?: (scene: SceneData) => void;
}
// ---- i18n types ----
type LocaleStrings = {
  title: string;
  subtitle: string;
  hint: string;
  expand: string;
  collapse: string;
  ask: string;
  ambientOn: string;
  ambientOff: string;
  narrationOn: string;
  narrationOff: string;
  scenes: SceneCategory[]; // keep your SceneCategory type
  empty: string;
  playing: string;
  paused: string;
  skipToContent: string;
  filters: string;
  sceneList: string;
  openScene: (scene: string) => string;
  prevScene: string;
  nextScene: string;
  narrationPosition: string;
  all: string;
  thumbnails: string;
  slideOf: (i: number, total: number, name: string) => string;
  goToSlide: (i: number) => string;
};
// —————————————————————————————————
// STRINGS
// —————————————————————————————————
const STR: Record<"en" | "ar", LocaleStrings> = {
  en: {
    title: "TOYOTA LAND CRUISER",
    subtitle: "Conquer Every Land. Crafted for the impossible.",
    hint: "Swipe, drag, or use arrows · tap a scene",
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
    skipToContent: "Skip to content",
    filters: "Lifestyle filters",
    sceneList: "Land Cruiser lifestyle scenes",
    openScene: (scene: string) => `Open ${scene} scene`,
    prevScene: "Previous scene",
    nextScene: "Next scene",
    narrationPosition: "Narration position",
    all: "All",
    thumbnails: "Thumbnails",
    slideOf: (i: number, total: number, name: string) => `Slide ${i} of ${total}: ${name}`,
    goToSlide: (i: number) => `Go to slide ${i}`,
  },
  ar: {
    title: "تويوتا لاندكروزر",
    subtitle: "قهر كل أرض. صُمم للمستحيل.",
    hint: "اسحب أو استخدم الأسهم · اضغط على مشهد",
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
    skipToContent: "تخطّي إلى المحتوى",
    filters: "فلاتر أنماط الحياة",
    sceneList: "مشاهد لاند كروزر",
    openScene: (scene: string) => `افتح مشهد ${scene}`,
    prevScene: "المشهد السابق",
    nextScene: "المشهد التالي",
    narrationPosition: "موضع السرد",
    all: "الكل",
    thumbnails: "الصور المصغرة",
    slideOf: (i: number, total: number, name: string) => `الشريحة ${i} من ${total}: ${name}`,
    goToSlide: (i: number) => `اذهب إلى الشريحة ${i}`,
  },
};
// —————————————————————————————————
// ICONS (normalize keys → lowercase)
// —————————————————————————————————
const specIcons: Record<string, JSX.Element> = {
  horsepower: <Zap className="w-5 h-5" aria-hidden />,
  torque: <GaugeCircle className="w-5 h-5" aria-hidden />,
  range: <Navigation className="w-5 h-5" aria-hidden />,
  zerotosixty: <TimerReset className="w-5 h-5" aria-hidden />,
  topspeed: <Gauge className="w-5 h-5" aria-hidden />,
  battery: <BatteryCharging className="w-5 h-5" aria-hidden />,
  fueleconomy: <Gauge className="w-5 h-5" aria-hidden />,
  drivetrain: <Navigation className="w-5 h-5" aria-hidden />,
  suspension: <GaugeCircle className="w-5 h-5" aria-hidden />,
  seats: <Gauge className="w-5 h-5" aria-hidden />,
  safety: <GaugeCircle className="w-5 h-5" aria-hidden />,
};

// —————————————————————————————————
// DEFAULT SCENES (unchanged content)
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
  Urban: ["fueleconomy", "range", "drivetrain", "suspension"],
  Capability: ["drivetrain", "torque", "suspension", "range"],
  Interior: ["seats", "safety", "battery", "drivetrain"],
  Night: ["drivetrain", "topSpeed", "range", "horsepower"],
};

function sortSpecs(scene: SceneCategory, specs: Record<string, string>): Array<[string, string]> {
  const entries = Object.entries(specs);
  const pri = sceneSpecPriority[scene] ?? [];
  return entries.sort((a, b) => {
    const ai = pri.indexOf(a[0]);
    const bi = pri.indexOf(b[0]);
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

const fmt = (t: number) => {
  if (!isFinite(t)) return "0:00";
  const m = Math.floor(t / 60).toString();
  const s = Math.floor(t % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// Lock body scroll while overlay is open (SSR-safe)
function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction as string | undefined;
    if (locked) {
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = prevOverflow || "";
      document.body.style.touchAction = prevTouchAction || "";
    }
    return () => {
      document.body.style.overflow = prevOverflow || "";
      document.body.style.touchAction = prevTouchAction || "";
    };
  }, [locked]);
}
export default function LandCruiserLifestyleGalleryPro({
  scenes = DEFAULT_SCENES,
  locale = "en",
  rtl = false,
  onAskToyota,
}: LandCruiserLifestyleGalleryProProps) {
  const T: LocaleStrings = STR[locale] ?? STR.en;
  const prefersReduced = useReducedMotion();

  const [activeIdx, setActiveIdx] = useState(0);
  const [selected, setSelected] = useState<SceneData | null>(null);
  const [filter, setFilter] = useState<SceneCategory | "All">("All");
  const [ambientOn, setAmbientOn] = useState(false);
  const [narrOn, setNarrOn] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLAudioElement>(null);
  const narrationRef = useRef<HTMLAudioElement>(null);
  const liveAudioRef = useRef<HTMLDivElement>(null);
  const liveSlideRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => (filter === "All" ? scenes : scenes.filter((s) => s.scene === filter)),
    [scenes, filter]
  );

  const centerCard = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
    el.scrollTo({ left, behavior: "smooth" });
  }, []);

  // roving focus for keyboard navigation
  const justChangedByArrow = useRef(false);
  useEffect(() => {
    if (!trackRef.current) return;
    const btn = trackRef.current.children[activeIdx]?.querySelector<HTMLButtonElement>("[data-card-trigger]");
    if (btn && justChangedByArrow.current) {
      btn.focus({ preventScroll: true });
      justChangedByArrow.current = false;
    }
  }, [activeIdx]);

  // Ambient audio
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

  // Duck ambient when narration plays
  const [isNarrPlaying, setNarrPlaying] = useState(false);
  useEffect(() => {
    const a = ambientRef.current;
    if (!a) return;
    a.volume = isNarrPlaying ? 0.12 : 0.35;
  }, [isNarrPlaying]);

  // Reset on filter
  useEffect(() => {
    setActiveIdx(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [filter]);

  // Center & announce
  useEffect(() => {
    centerCard(activeIdx);
    if (filtered[activeIdx] && liveSlideRef.current) {
      const name = `${filtered[activeIdx].scene}`;
      liveSlideRef.current.textContent = T.slideOf(activeIdx + 1, filtered.length, name);
    }
  }, [activeIdx, centerCard, filtered, T]);

  // Narration state
  const [narrTime, setNarrTime] = useState(0);
  const [narrDur, setNarrDur] = useState(0);

  useEffect(() => {
    const n = narrationRef.current;
    if (!n) return;
    const onTime = () => setNarrTime(n.currentTime || 0);
    const onMeta = () => setNarrDur(isFinite(n.duration) ? n.duration : 0);
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

  useEffect(() => {
    const n = narrationRef.current;
    if (!n) return;
    n.pause();
    n.currentTime = 0;
    if (selected?.narration && narrOn) {
      n.src = selected.narration;
      n.play().catch(() => {});
      if (liveAudioRef.current) liveAudioRef.current.textContent = T.playing;
    } else {
      n.removeAttribute("src");
      setNarrTime(0);
      setNarrDur(0);
      if (liveAudioRef.current) liveAudioRef.current.textContent = T.paused;
    }
  }, [selected, narrOn, T]);

  // Next/Prev inside overlay
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

  // Root keyboard (overlay handles its own keys)
  const onRootKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (selected) return;
    const goNext = () => { justChangedByArrow.current = true; setActiveIdx((i) => Math.min(i + 1, filtered.length - 1)); };
    const goPrev = () => { justChangedByArrow.current = true; setActiveIdx((i) => Math.max(i - 1, 0)); };
    if (e.key === "ArrowRight") { e.preventDefault(); rtl ? goPrev() : goNext(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); rtl ? goNext() : goPrev(); }
    else if (e.key === "Home") { e.preventDefault(); justChangedByArrow.current = true; setActiveIdx(0); }
    else if (e.key === "End") { e.preventDefault(); justChangedByArrow.current = true; setActiveIdx(filtered.length - 1); }
    else if (e.key === "PageDown") { e.preventDefault(); rtl ? goPrev() : goNext(); }
    else if (e.key === "PageUp") { e.preventDefault(); rtl ? goNext() : goPrev(); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); const item = filtered[activeIdx]; if (item) setSelected(item); }
  }, [selected, filtered, activeIdx, rtl]);

  useBodyScrollLock(!!selected);

  // —— MOBILE GESTURE LOCK (prevent page scroll while swiping horizontally)
  const start = useRef<{x: number; y: number} | null>(null);
  const onTouchStartTrack = (e: React.TouchEvent) => {
    const t = e.touches[0];
    start.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchMoveTrack = (e: React.TouchEvent) => {
    if (!start.current) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - start.current.x);
    const dy = Math.abs(t.clientY - start.current.y);
    // If clearly horizontal gesture, prevent vertical page scroll.
    if (dx > dy * 1.2) e.preventDefault();
  };
  const onTouchEndTrack = () => { start.current = null; };

  const hintId = "lc-hint";
  const currentBG = filtered[activeIdx]?.image;

  return (
    <section
      className="relative w-full min-h-[100svh] text-white overflow-x-clip"
      style={{ backgroundColor: TOYOTA_BG }}
      dir={rtl ? "rtl" : "ltr"}
      lang={locale}
      aria-label={T.title}
      onKeyDown={onRootKeyDown}
    >
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-black focus:text-white focus:px-3 focus:py-2 focus:rounded-md">
        {T.skipToContent}
      </a>

      {/* Live regions */}
      <div ref={liveAudioRef} className="sr-only" aria-live="polite" aria-atomic="true" />
      <div ref={liveSlideRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      {/* Audio */}
      <audio ref={ambientRef} src="/audio/toyota-ambient.mp3" className="hidden" />
      <audio ref={narrationRef} className="hidden" />

      {/* Brand-immersive blurred background from active slide */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {currentBG && (
          <img
            src={currentBG}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-black/90 md:from-black/80 md:via-black/40 md:to-black/80" aria-hidden />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto max-w-[min(98vw,2000px)] flex flex-col items-center text-center gap-2 px-4 pt-6">
        <div className="flex items-center gap-3" style={{ color: TOYOTA_RED }}>
          <ToyotaLogo className="w-14 sm:w-16 md:w-20" />
          <span className="sr-only">Toyota</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold tracking-tight">{T.title}</h1>
        <p className="mt-1 text-sm sm:text-base md:text-lg text-white/80">{T.subtitle}</p>
        <p id={hintId} className="mt-1 text-[11px] sm:text-xs flex items-center gap-1" style={{ color: TOYOTA_RED }}>
          <Sparkles className="w-3.5 h-3.5" aria-hidden /> {T.hint}
        </p>

        {/* Controls */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setAmbientOn((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 min-h-[40px] bg-white/10 hover:bg-white/20 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-pressed={ambientOn}
            title={ambientOn ? T.ambientOn : T.ambientOff}
          >
            {ambientOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {ambientOn ? T.ambientOn : T.ambientOff}
          </button>
          <button
            type="button"
            onClick={() => setNarrOn((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2 min-h-[40px] bg-white/10 hover:bg-white/20 text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-pressed={narrOn}
            title={narrOn ? T.narrationOn : T.narrationOff}
          >
            {narrOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {narrOn ? T.narrationOn : T.narrationOff}
          </button>
        </div>

        {/* Filters (desktop) */}
        <nav className="mt-4 hidden md:flex flex-wrap items-center justify-center gap-2 px-2" aria-label={T.filters}>
          {["All", ...T.scenes].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c as any)}
              className="rounded-full px-3 py-2 min-h-[40px] text-xs sm:text-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              style={{
                borderColor: filter === (c as any) ? TOYOTA_RED : "rgba(255,255,255,0.2)",
                background: filter === (c as any) ? "rgba(235,10,30,0.12)" : "rgba(255,255,255,0.06)",
                color: filter === (c as any) ? TOYOTA_RED : "#fff",
              }}
              aria-pressed={filter === (c as any)}
            >
              {c === "All" ? T.all : c}
            </button>
          ))}
        </nav>

        {/* Filters (mobile) */}
        <nav className="mt-3 md:hidden w-full overflow-x-auto px-4" aria-label={T.filters}>
          <div className="flex gap-2 w-max">
            {["All", ...T.scenes].map((c) => (
              <button
                key={`m-${c}`}
                type="button"
                onClick={() => setFilter(c as any)}
                className="rounded-full px-3 py-2 min-h-[36px] text-xs border"
                style={{
                  borderColor: filter === (c as any) ? TOYOTA_RED : "rgba(255,255,255,0.2)",
                  background: filter === (c as any) ? "rgba(235,10,30,0.12)" : "rgba(255,255,255,0.06)",
                  color: filter === (c as any) ? TOYOTA_RED : "#fff",
                }}
                aria-pressed={filter === (c as any)}
              >
                {c === "All" ? T.all : c}
              </button>
            ))}
          </div>
        </nav>
      </header>

      {/* Carousel Track */}
      <div
        id="content"
        ref={trackRef}
        className="
          relative z-10 mt-4 md:mt-8 flex gap-2 sm:gap-2.5 md:gap-4
          overflow-x-auto snap-x snap-mandatory pb-6 scroll-smooth items-stretch justify-start
          mx-auto w-full max-w-[min(98vw,2000px)]
          pl-[max(env(safe-area-inset-left),12px)] pr-[max(env(safe-area-inset-right),12px)]
          [touch-action:pan-x_pinch-zoom]
          [overscroll-behavior-x:contain] [overscroll-behavior-y:none]
          md:[scrollbar-width:none] md:[-ms-overflow-style:none] md:[&::-webkit-scrollbar]:hidden
        "
        role="region"
        aria-roledescription="carousel"
        aria-label={T.sceneList}
        aria-describedby={hintId}
        aria-live="off"
        onTouchStart={onTouchStartTrack}
        onTouchMove={onTouchMoveTrack}
        onTouchEnd={onTouchEndTrack}
      >
        {filtered.length === 0 && <div className="text-white/70 text-sm py-10">{T.empty}</div>}
        {filtered.map((sc, idx) => (
          <SceneCardPro
            key={sc.id}
            data={sc}
            active={idx === activeIdx}
            tabIndex={idx === activeIdx ? 0 : -1}
            onEnter={() => { setSelected(sc); setActiveIdx(idx); }}
            onFocus={() => setActiveIdx(idx)}
            prefersReduced={prefersReduced}
            ariaLabel={T.openScene(sc.scene)}
            expandLabel={T.expand}
          />
        ))}
      </div>

      {/* Desktop arrows outside overlay */}
      {filtered.length > 0 && (
        <div className="relative hidden md:block z-10">
          <div className="pointer-events-none absolute top-1/2 left-0 right-0 mx-auto max-w-[min(98vw,2000px)] px-2 md:px-6 -translate-y-1/2">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="pointer-events-auto inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur border border-white/15"
                aria-label={T.prevScene}
                onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                type="button"
                className="pointer-events-auto inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur border border-white/15"
                aria-label={T.nextScene}
                onClick={() => setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation indicators — progress bar hidden on desktop */}
      <div className="relative z-10 mx-auto max-w-[min(98vw,2000px)] px-4 md:px-6">
        {/* MOBILE progress bar */}
        <div className="mt-1.5 h-1 w-full bg-white/10 rounded md:hidden" aria-hidden="true">
          <div
            className="h-1 rounded"
            style={{ width: `${filtered.length ? ((activeIdx + 1) / filtered.length) * 100 : 0}%`, backgroundColor: TOYOTA_RED }}
          />
        </div>

        <div className="mt-2 flex items-center justify-center gap-1.5" role="tablist" aria-label={T.thumbnails}>
          {filtered.map((s, i) => {
            const selectedDot = i === activeIdx;
            return (
              <button
                key={`dot-${s.id}`}
                type="button"
                role="tab"
                aria-selected={selectedDot}
                aria-label={`${T.goToSlide(i + 1)} — ${s.scene}`}
                className={`h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${selectedDot ? "w-6" : "w-2.5"}`}
                onClick={() => setActiveIdx(i)}
                style={{ background: selectedDot ? TOYOTA_RED : "rgba(255,255,255,0.35)" }}
              />
            );
          })}
        </div>
        <div className="hidden md:flex items-center justify-center gap-3 mt-2">
          <span className="text-xs text-white/70" aria-live="polite">
            {Math.min(activeIdx + 1, filtered.length)} / {filtered.length}
          </span>
        </div>
      </div>

      {/* Overlay */}
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
            setNarrTime={(t) => { const n = narrationRef.current; if (!n) return; n.currentTime = t; setNarrTime(t); }}
            isNarrPlaying={isNarrPlaying}
            setIsNarrPlaying={(p) => { const n = narrationRef.current; if (!n) return; p ? n.play().catch(() => {}) : n.pause(); }}
            onAskToyota={onAskToyota}
            prefersReduced={prefersReduced}
            localeStrings={T}
            rtl={rtl}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
function SceneCardPro({
  data,
  active,
  onEnter,
  onFocus,
  prefersReduced,
  tabIndex,
  ariaLabel,
  expandLabel,
}: {
  data: SceneData;
  active: boolean;
  onEnter: () => void;
  onFocus: () => void;
  prefersReduced: boolean;
  tabIndex: number;
  ariaLabel: string;
  expandLabel: string;
}) {
  // Bigger desktop widths + subtle elevation for active card
  const cardCls = `snap-center shrink-0
  min-w-[300px] max-w-[300px]
  sm:min-w-[340px] sm:max-w-[340px]
  md:min-w-[880px] md:max-w-[880px]
  lg:min-w-[1040px] lg:max-w-[1040px]
  xl:min-w-[1200px] xl:max-w-[1200px]
  2xl:min-w-[1320px] 2xl:max-w-[1320px]
  rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black shadow-xl overflow-hidden`;

  const imgDeemph = active ? "" : "opacity-90 saturate-[.85]";
  const imgHeights = "h-44 sm:h-56 md:h-96 lg:h-[28rem] xl:h-[32rem] 2xl:h-[36rem]";

  return (
    <motion.article
      className={cardCls}
      layoutId={data.id}
      initial={false}
      animate={{
        boxShadow: active
          ? `0 0 0 2px ${TOYOTA_RED}66, 0 20px 45px rgba(0,0,0,0.55)`
          : "0 10px 25px rgba(0,0,0,0.35)",
        y: active && !prefersReduced ? -4 : 0,
        scale: active ? 1.0 : 0.98,
      }}
      transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 350, damping: 26 }}
    >
      <button
        type="button"
        onClick={onEnter}
        onFocus={onFocus}
        data-card-trigger
        className="relative w-full text-left select-none focus-visible:outline-none"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        tabIndex={tabIndex}
      >
        <img
          src={data.image}
          alt={`${data.title} • ${data.scene}`}
          loading="lazy"
          decoding="async"
          sizes="(max-width: 640px) 260px, (max-width: 768px) 300px, (max-width: 1024px) 880px, (max-width: 1280px) 1040px, (max-width: 1536px) 1200px, 1320px"
          className={`w-full ${imgHeights} object-cover object-center transition-all duration-300 ${imgDeemph}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" aria-hidden />
        <div className="absolute left-0 right-0 bottom-0 p-3 sm:p-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">{data.title}</h3>
            <p className="text-xs sm:text-sm" style={{ color: TOYOTA_RED }}>{data.scene}</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 bg-white/10 text-xs sm:text-sm">
            {expandLabel}
          </span>
        </div>
      </button>

      {/* Premium “badge” specs */}
      <div className="p-4 sm:p-5 md:p-6">
        <p className="text-white/85 text-[13px] sm:text-sm md:text-base">{data.description}</p>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-4 sm:mt-5" aria-label="Specifications">
          {sortSpecs(data.scene, data.specs).slice(0, 4).map(([key, val], i) => {
            const normalized = key.toLowerCase().replace(/[^a-z]/g, "");
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.3, delay: prefersReduced ? 0 : i * 0.04 }}
                className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-gradient-to-br from-zinc-900/60 to-black/60 backdrop-blur px-3 py-2 hover:shadow-[0_0_0_1px_rgba(235,10,30,0.35),0_0_24px_rgba(235,10,30,0.25)] transition-shadow"
              >
                <span style={{ color: TOYOTA_RED }}>
                  {specIcons[normalized] ?? <Gauge className="w-5 h-5" aria-hidden />}
                </span>
                <div className="text-[12px] sm:text-[13px] md:text-sm leading-snug">
                  <div className="uppercase tracking-wider text-white/60 text-[10px]">{key}</div>
                  <div className="font-semibold text-white">{val}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.article>
  );
}
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
  localeStrings,
  rtl,
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
  localeStrings: LocaleStrings;
  rtl: boolean;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const T = localeStrings;
  const headingId = `scene-title-${scene.id}`;

  // Focus trap & keys
  useEffect(() => {
    const root = overlayRef.current;
    if (!root) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    root.querySelector<HTMLButtonElement>("[data-close]")?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "ArrowRight") { rtl ? onPrev() : onNext(); return; }
      if (e.key === "ArrowLeft") { rtl ? onNext() : onPrev(); return; }
      if (e.key === " ") {
        const target = e.target as HTMLElement;
        if (target?.getAttribute("role") !== "slider" && (target as any)?.tagName !== "INPUT") {
          e.preventDefault(); setIsNarrPlaying(!isNarrPlaying);
        }
      }
      if (e.key === "Tab") {
        const focusables = root.querySelectorAll<HTMLElement>(
          'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'
        );
        const list = Array.from(focusables).filter((el) => !el.hasAttribute("disabled"));
        if (!list.length) return;
        const first = list[0], last = list[list.length - 1];
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); previouslyFocused?.focus(); };
  }, [onClose, onNext, onPrev, setIsNarrPlaying, isNarrPlaying, rtl]);

  // Touch swipe on hero
  const startX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0]?.clientX ?? null; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? startX.current) - startX.current;
    const threshold = 40;
    if (Math.abs(dx) > threshold) { rtl ? (dx > 0 ? onNext() : onPrev()) : (dx > 0 ? onPrev() : onNext()); }
    startX.current = null;
  };

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      aria-modal="true" role="dialog" aria-labelledby={headingId}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: "rgba(0,0,0,0.8)" }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        aria-hidden
      />

      {/* Panel */}
      <motion.div
        layoutId={scene.id}
        className="relative z-10 mx-auto h-full w-full md:w-[min(1400px,92vw)] md:rounded-[24px] md:overflow-hidden"
        style={{ boxShadow: "0 25px 60px rgba(0,0,0,0.6)" }}
        transition={prefersReduced ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 28 }}
      >
        {/* Hero */}
        <div className="relative h-[50vh] sm:h-[56vh] md:h-[62vh]" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <img
            src={scene.image}
            alt={`${scene.title} • ${scene.scene}`}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager" decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/0" aria-hidden />

          {/* Top Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pt-[env(safe-area-inset-top)]">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur border border-white/15"
              aria-label={T.prevScene}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={onClose}
              data-close
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur border border-white/15"
              aria-label={T.collapse}
            >
              <X className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur border border-white/15"
              aria-label={T.nextScene}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Title */}
          <div className="absolute left-0 right-0 bottom-3 px-4 sm:px-6 flex items-end justify-between gap-3">
            <div>
              <h3 id={headingId} className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {scene.title}
              </h3>
              <p className="text-sm sm:text-base" style={{ color: TOYOTA_RED }}>{scene.scene}</p>
            </div>
            <button
              type="button"
              onClick={() => onAskToyota?.(scene)}
              className="hidden sm:inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border border-white/15"
              style={{ background: "rgba(235,10,30,0.12)", color: TOYOTA_RED }}
            >
              {T.ask}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative bg-gradient-to-b from-zinc-950 to-black">
          <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-6 pt-4 pb-24">
            <p className="text-white/85 text-sm sm:text-base md:text-lg">{scene.description}</p>

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {Object.entries(scene.specs).map(([key, val], i) => {
                const normalized = key.toLowerCase().replace(/[^a-z]/g, "");
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: prefersReduced ? 0 : i * 0.035 }}
                    className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-gradient-to-br from-zinc-900/60 to-black/60 backdrop-blur px-3 py-2"
                  >
                    <span style={{ color: TOYOTA_RED }}>
                      {specIcons[normalized] ?? <Gauge className="w-5 h-5" aria-hidden />}
                    </span>
                    <div className="text-[12px] sm:text-[13px] md:text-sm leading-snug">
                      <div className="uppercase tracking-wider text-white/60 text-[10px]">{key}</div>
                      <div className="font-semibold text-white">{val}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="sm:hidden mt-4">
              <button
                type="button"
                onClick={() => onAskToyota?.(scene)}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm border border-white/15"
                style={{ background: "rgba(235,10,30,0.12)", color: TOYOTA_RED }}
              >
                {T.ask}
              </button>
            </div>
          </div>

          {/* Bottom controls */}
          <div className="fixed md:absolute bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur border-t border-white/10">
            <div className="mx-auto max-w-[1320px] px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center gap-3 pb-[max(env(safe-area-inset-bottom),12px)]">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setNarrOn(!narrOn)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 min-h-[44px] bg-white/10 hover:bg-white/20 text-xs sm:text-sm"
                  aria-pressed={narrOn}
                  title={narrOn ? T.narrationOn : T.narrationOff}
                >
                  {narrOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />} {narrOn ? T.narrationOn : T.narrationOff}
                </button>
                <button
                  type="button"
                  onClick={() => setIsNarrPlaying(!isNarrPlaying)}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20"
                  aria-label={isNarrPlaying ? T.paused : T.playing}
                  aria-pressed={isNarrPlaying}
                >
                  {isNarrPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <div className="flex items-center gap-2 w-full sm:w-[420px]">
                  <label htmlFor="narrationRange" className="sr-only">{T.narrationPosition}</label>
                  <span className="text-[10px] text-white/70 w-10 text-right" aria-hidden>{fmt(narrTime)}</span>
                  <input
                    id="narrationRange"
                    type="range"
                    min={0} max={narrDur || 0} step={0.1}
                    value={Math.min(narrTime, narrDur || 0)}
                    onChange={(e) => setNarrTime(parseFloat(e.currentTarget.value))}
                    className="w-full"
                    style={{ accentColor: TOYOTA_RED }}
                    aria-valuemin={0}
                    aria-valuemax={Math.floor(narrDur || 0)}
                    aria-valuenow={Math.floor(Math.min(narrTime, narrDur || 0))}
                    aria-valuetext={`${fmt(narrTime)} of ${fmt(narrDur)}`}
                  />
                  <span className="text-[10px] text-white/70 w-10" aria-hidden>{fmt(narrDur)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <button
                  type="button"
                  onClick={onPrev}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20"
                  aria-label={T.prevScene}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 hover:bg-white/20"
                  aria-label={T.nextScene}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
