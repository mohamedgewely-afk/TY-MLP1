
import React, { useState, useRef, useCallback, useEffect } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import { SceneData } from "./SceneCard";

const TOYOTA_RED = "#EB0A1E";
const TOYOTA_BG = "#0D0F10";

function ToyotaLogo({ className = "w-16 h-auto" }: { className?: string }) {
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

interface GalleryContainerProps {
  scenes: SceneData[];
  children: React.ReactNode;
  activeIdx: number;
  setActiveIdx: (idx: number) => void;
  filter: string;
  setFilter: (filter: string) => void;
}

export default function GalleryContainer({
  scenes,
  children,
  activeIdx,
  setActiveIdx,
  filter,
  setFilter,
}: GalleryContainerProps) {
  const [ambientOn, setAmbientOn] = useState(false);
  const ambientRef = useRef<HTMLAudioElement>(null);
  
  const sceneCategories = ["All", "Exterior", "Urban", "Capability", "Interior", "Night"];
  const currentBG = scenes[activeIdx]?.image;

  // Ambient audio handling
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

  return (
    <section
      className="relative w-full min-h-[100dvh] text-white overflow-hidden"
      style={{ backgroundColor: TOYOTA_BG }}
      aria-label="Toyota Land Cruiser Gallery"
    >
      <audio ref={ambientRef} src="/audio/toyota-ambient.mp3" className="hidden" />

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
      <header className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center gap-3 px-4 pt-6 pb-4">
        <div className="flex items-center gap-3" style={{ color: TOYOTA_RED }}>
          <ToyotaLogo />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
          TOYOTA LAND CRUISER
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl">
          Conquer Every Land. Crafted for the impossible.
        </p>
        <p className="text-xs flex items-center gap-1.5" style={{ color: TOYOTA_RED }}>
          <Sparkles className="w-3.5 h-3.5" /> 
          Swipe or drag · tap a scene
        </p>

        {/* Ambient Control */}
        <button
          onClick={() => setAmbientOn(!ambientOn)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 text-sm transition-colors"
          aria-pressed={ambientOn}
        >
          {ambientOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          {ambientOn ? "Ambient on" : "Ambient off"}
        </button>

        {/* Desktop Filter */}
        <nav className="hidden md:flex flex-wrap items-center justify-center gap-2 mt-2">
          {sceneCategories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className="rounded-full px-4 py-2 text-sm border transition-colors"
              style={{
                borderColor: filter === category ? TOYOTA_RED : "rgba(255,255,255,0.2)",
                background: filter === category ? "rgba(235,10,30,0.12)" : "rgba(255,255,255,0.06)",
                color: filter === category ? TOYOTA_RED : "#fff",
              }}
            >
              {category}
            </button>
          ))}
        </nav>
      </header>

      {/* Gallery Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Mobile Filter - Sticky at bottom */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[min(95vw,600px)] rounded-full bg-black/50 backdrop-blur border border-white/20 px-3 py-2 flex items-center gap-2 overflow-x-auto">
        {sceneCategories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className="shrink-0 rounded-full px-3 py-1.5 text-xs border transition-colors"
            style={{
              borderColor: filter === category ? TOYOTA_RED : "rgba(255,255,255,0.2)",
              background: filter === category ? "rgba(235,10,30,0.12)" : "rgba(255,255,255,0.06)",
              color: filter === category ? TOYOTA_RED : "#fff",
            }}
          >
            {category}
          </button>
        ))}
      </nav>
    </section>
  );
}
