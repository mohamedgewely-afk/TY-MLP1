
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Zap, GaugeCircle, Navigation, TimerReset, Gauge, BatteryCharging } from "lucide-react";

const TOYOTA_RED = "#EB0A1E" as const;

interface FuturisticSceneModalProps {
  scene: {
    id: string;
    title: string;
    scene: string;
    image: string;
    description: string;
    specs: Record<string, string>;
  };
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onAskToyota?: (scene: any) => void;
  strings: {
    collapse: string;
    nextScene: string;
    prevScene: string;
    ask: string;
  };
}

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

export default function FuturisticSceneModal({
  scene,
  onClose,
  onNext,
  onPrev,
  onAskToyota,
  strings,
}: FuturisticSceneModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onNext, onPrev]);

  // Touch gesture handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const threshold = 50;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        onPrev();
      } else {
        onNext();
      }
    }
    
    touchStartRef.current = null;
  };

  return (
    <motion.div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop with particle effect */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, ${TOYOTA_RED}15 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${TOYOTA_RED}10 0%, transparent 50%)`,
        }}
      />

      {/* Modal content */}
      <motion.div
        className="relative max-w-4xl w-full mx-4 bg-gradient-to-br from-zinc-950/95 via-zinc-900/95 to-black/95 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{
          boxShadow: `0 0 60px ${TOYOTA_RED}30, 0 25px 50px rgba(0, 0, 0, 0.5)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={onPrev}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 transition-all"
            aria-label={strings.prevScene}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 transition-all"
            aria-label={strings.collapse}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={onNext}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 transition-all"
            aria-label={strings.nextScene}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Hero image */}
        <div className="relative h-80 md:h-96">
          <img
            src={scene.image}
            alt={`${scene.title} • ${scene.scene}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Title overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {scene.title}
            </h2>
            <p 
              className="text-lg font-medium drop-shadow-md"
              style={{ color: TOYOTA_RED }}
            >
              {scene.scene}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <p className="text-white/90 text-lg mb-6 leading-relaxed">
            {scene.description}
          </p>

          {/* Specs grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(scene.specs).map(([key, val], i) => {
              const normalized = key.toLowerCase().replace(/[^a-z]/g, "");
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-zinc-900/80 to-black/80 border border-white/10 hover:border-white/20 transition-all group"
                >
                  <span 
                    className="transition-all group-hover:drop-shadow-[0_0_12px_currentColor]"
                    style={{ color: TOYOTA_RED }}
                  >
                    {specIcons[normalized] ?? <Gauge className="w-5 h-5" aria-hidden />}
                  </span>
                  <div className="text-sm">
                    <div className="uppercase tracking-wider text-white/60 text-xs font-medium mb-1">
                      {key}
                    </div>
                    <div className="font-semibold text-white">
                      {val}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          {onAskToyota && (
            <button
              onClick={() => onAskToyota(scene)}
              className="w-full md:w-auto px-8 py-4 rounded-xl font-semibold transition-all border backdrop-blur-sm"
              style={{
                backgroundColor: `${TOYOTA_RED}20`,
                borderColor: `${TOYOTA_RED}60`,
                color: TOYOTA_RED,
                boxShadow: `0 0 30px ${TOYOTA_RED}25`,
              }}
            >
              {strings.ask}
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
