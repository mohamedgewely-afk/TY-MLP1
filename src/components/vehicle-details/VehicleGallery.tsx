import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import FuturisticSceneCard from "./FuturisticSceneCard";
import FuturisticSceneModal from "./FuturisticSceneModal";
import FuturisticCategoryFilter from "./FuturisticCategoryFilter";

const TOYOTA_RED = "#EB0A1E" as const;
const TOYOTA_BG = "#0D0F10" as const;

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

export type SceneCategory = "Exterior" | "Urban" | "Capability" | "Interior" | "Night";

export interface SceneData {
  id: string;
  title: string;
  scene: SceneCategory;
  image: string;
  description: string;
  specs: Record<string, string>;
}

interface VehicleGalleryProps {
  scenes?: SceneData[];
  locale?: "en" | "ar";
  rtl?: boolean;
  onAskToyota?: (scene: SceneData) => void;
}

type LocaleStrings = {
  title: string;
  subtitle: string;
  hint: string;
  expand: string;
  collapse: string;
  ask: string;
  scenes: SceneCategory[];
  empty: string;
  skipToContent: string;
  filters: string;
  sceneList: string;
  openScene: (scene: string) => string;
  prevScene: string;
  nextScene: string;
  all: string;
  thumbnails: string;
  slideOf: (i: number, total: number, name: string) => string;
  goToSlide: (i: number) => string;
};

const STR: Record<"en" | "ar", LocaleStrings> = {
  en: {
    title: "TOYOTA LAND CRUISER",
    subtitle: "Conquer Every Land. Crafted for the impossible.",
    hint: "Swipe, drag, or use arrows · tap a scene",
    expand: "Enter Scene",
    collapse: "Close",
    ask: "Ask Toyota",
    scenes: ["Exterior", "Urban", "Capability", "Interior", "Night"] as SceneCategory[],
    empty: "No scenes in this filter.",
    skipToContent: "Skip to content",
    filters: "Lifestyle filters",
    sceneList: "Land Cruiser lifestyle scenes",
    openScene: (scene: string) => `Open ${scene} scene`,
    prevScene: "Previous scene",
    nextScene: "Next scene",
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
    scenes: ["Exterior", "Urban", "Capability", "Interior", "Night"] as SceneCategory[],
    empty: "لا توجد مشاهد لهذا الفلتر.",
    skipToContent: "تخطّي إلى المحتوى",
    filters: "فلاتر أنماط الحياة",
    sceneList: "مشاهد لاند كروزر",
    openScene: (scene: string) => `افتح مشهد ${scene}`,
    prevScene: "المشهد السابق",
    nextScene: "المشهد التالي",
    all: "الكل",
    thumbnails: "الصور المصغرة",
    slideOf: (i: number, total: number, name: string) => `الشريحة ${i} من ${total}: ${name}`,
    goToSlide: (i: number) => `اذهب إلى الشريحة ${i}`,
  },
};

const DEFAULT_SCENES: SceneData[] = [
  {
    id: "lc-exterior-hero",
    title: "Land Cruiser",
    scene: "Exterior",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true",
    description: "TNGA‑F platform. Lighter, tougher, more capable.",
    specs: {
      drivetrain: "Full‑time 4WD, locking diffs",
      horsepower: "409 hp (3.5L V6 TT)",
      torque: "650 Nm",
      suspension: "Adaptive Variable Suspension",
    },
  },
  {
    id: "lc-urban",
    title: "Land Cruiser",
    scene: "Urban",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    description: "Commanding stance with refined aerodynamics.",
    specs: {
      drivetrain: "10‑speed automatic",
      horsepower: "409 hp",
      torque: "650 Nm",
      range: "~800+ km",
    },
  },
  {
    id: "lc-capability",
    title: "Land Cruiser",
    scene: "Capability",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true",
    description: "Born for dunes. Crawl Control and Multi‑Terrain Select.",
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

export default function VehicleGallery({
  scenes = DEFAULT_SCENES,
  locale = "en",
  rtl = false,
  onAskToyota,
}: VehicleGalleryProps) {
  const T: LocaleStrings = STR[locale] ?? STR.en;
  
  const [activeIdx, setActiveIdx] = useState(0);
  const [selected, setSelected] = useState<SceneData | null>(null);
  const [filter, setFilter] = useState<SceneCategory | "All">("All");
  
  const trackRef = useRef<HTMLDivElement>(null);
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

  // Reset on filter change
  useEffect(() => {
    setActiveIdx(0);
    trackRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }, [filter]);

  // Center active card and announce
  useEffect(() => {
    centerCard(activeIdx);
    if (filtered[activeIdx] && liveSlideRef.current) {
      const name = `${filtered[activeIdx].scene}`;
      liveSlideRef.current.textContent = T.slideOf(activeIdx + 1, filtered.length, name);
    }
  }, [activeIdx, centerCard, filtered, T]);

  // Navigation handlers
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

  // Keyboard navigation
  const onRootKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (selected) return;
    const goNext = () => setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    const goPrev = () => setActiveIdx((i) => Math.max(i - 1, 0));
    
    if (e.key === "ArrowRight") { e.preventDefault(); rtl ? goPrev() : goNext(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); rtl ? goNext() : goPrev(); }
    else if (e.key === "Enter" || e.key === " ") { 
      e.preventDefault(); 
      const item = filtered[activeIdx]; 
      if (item) setSelected(item); 
    }
  }, [selected, filtered, activeIdx, rtl]);

  // Body scroll lock
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

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

      {/* Live region */}
      <div ref={liveSlideRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      {/* Futuristic background with particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {currentBG && (
          <img
            src={currentBG}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-30"
          />
        )}
        
        {/* Particle field */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, ${TOYOTA_RED}25 1px, transparent 1px), radial-gradient(circle at 80% 70%, ${TOYOTA_RED}15 1px, transparent 1px)`,
            backgroundSize: '60px 60px, 80px 80px',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/60 to-black/95" aria-hidden />
      </div>

      {/* Header */}
      <header className="relative z-10 mx-auto max-w-7xl flex flex-col items-center text-center gap-4 px-4 pt-8">
        <div className="flex items-center gap-3" style={{ color: TOYOTA_RED }}>
          <ToyotaLogo className="w-16 md:w-20 drop-shadow-[0_0_20px_currentColor]" />
          <span className="sr-only">Toyota</span>
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-white/80 bg-clip-text">
          {T.title}
        </h1>
        
        <p className="text-base md:text-lg text-white/80 max-w-2xl">
          {T.subtitle}
        </p>
        
        <p className="text-xs md:text-sm flex items-center gap-2 text-white/60">
          <Sparkles className="w-4 h-4" style={{ color: TOYOTA_RED }} aria-hidden /> 
          {T.hint}
        </p>

        {/* Futuristic category filter */}
        <FuturisticCategoryFilter
          categories={T.scenes}
          activeFilter={filter}
          onFilterChange={setFilter}
          allLabel={T.all}
          className="mt-6"
        />
      </header>

      {/* Carousel */}
      <div
        id="content"
        ref={trackRef}
        className="relative z-10 mt-8 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 scroll-smooth mx-auto w-full max-w-7xl px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label={T.sceneList}
        aria-live="off"
      >
        {filtered.length === 0 && (
          <div className="text-white/70 text-sm py-10 mx-auto">
            {T.empty}
          </div>
        )}
        
        {filtered.map((scene, idx) => (
          <FuturisticSceneCard
            key={scene.id}
            data={scene}
            active={idx === activeIdx}
            tabIndex={idx === activeIdx ? 0 : -1}
            onEnter={() => { setSelected(scene); setActiveIdx(idx); }}
            onFocus={() => setActiveIdx(idx)}
            ariaLabel={T.openScene(scene.scene)}
            expandLabel={T.expand}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {filtered.length > 1 && (
        <div className="relative z-10 flex justify-center gap-4 mt-6">
          <button
            type="button"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 transition-all hover:scale-105"
            aria-label={T.prevScene}
            onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
            style={{
              boxShadow: `0 0 20px ${TOYOTA_RED}20`,
            }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            type="button"
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 transition-all hover:scale-105"
            aria-label={T.nextScene}
            onClick={() => setActiveIdx((i) => Math.min(i + 1, filtered.length - 1))}
            style={{
              boxShadow: `0 0 20px ${TOYOTA_RED}20`,
            }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Progress indicators */}
      <div className="relative z-10 flex items-center justify-center gap-3 mt-6 px-4">
        <div className="flex items-center gap-2">
          {filtered.map((_, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                className={`h-2 rounded-full transition-all ${isActive ? 'w-8' : 'w-2'}`}
                onClick={() => setActiveIdx(i)}
                style={{ 
                  backgroundColor: isActive ? TOYOTA_RED : 'rgba(255,255,255,0.3)',
                  boxShadow: isActive ? `0 0 12px ${TOYOTA_RED}60` : 'none',
                }}
                aria-label={T.goToSlide(i + 1)}
              />
            );
          })}
        </div>
        
        <span className="text-sm text-white/60 ml-4">
          {Math.min(activeIdx + 1, filtered.length)} / {filtered.length}
        </span>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <FuturisticSceneModal
            key={selected.id}
            scene={selected}
            onClose={() => setSelected(null)}
            onNext={openNext}
            onPrev={openPrev}
            onAskToyota={onAskToyota}
            strings={{
              collapse: T.collapse,
              nextScene: T.nextScene,
              prevScene: T.prevScene,
              ask: T.ask,
            }}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
      `}</style>
    </section>
  );
}
