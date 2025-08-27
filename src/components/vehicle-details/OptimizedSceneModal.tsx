
import React, { useEffect, useRef, memo } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Zap, GaugeCircle, Navigation, TimerReset, Gauge, BatteryCharging } from "lucide-react";

const TOYOTA_RED = "#EB0A1E" as const;

interface OptimizedSceneModalProps {
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

const OptimizedSceneModal = memo(({
  scene,
  onClose,
  onNext,
  onPrev,
  onAskToyota,
  strings,
}: OptimizedSceneModalProps) => {
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

  // Simple touch gesture handling
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
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in-0 duration-300"
      aria-modal="true"
      role="dialog"
    >
      {/* Optimized backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-xl"
        onClick={onClose}
        style={{
          backgroundImage: `radial-gradient(circle at 30% 30%, ${TOYOTA_RED}10 0%, transparent 60%)`,
        }}
      />

      {/* Optimized modal content */}
      <div
        className="relative max-w-5xl w-full mx-4 bg-gradient-to-br from-zinc-950/95 via-zinc-900/95 to-black/95 backdrop-blur-xl rounded-3xl border border-white/20 overflow-hidden animate-in slide-in-from-bottom-4 zoom-in-95 duration-300"
        style={{
          boxShadow: `0 0 60px ${TOYOTA_RED}20, 0 25px 50px rgba(0, 0, 0, 0.4)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={onPrev}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 transition-all duration-200"
            aria-label={strings.prevScene}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 transition-all duration-200"
            aria-label={strings.collapse}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={onNext}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-white/20 transition-all duration-200"
            aria-label={strings.nextScene}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Enhanced hero image for desktop */}
        <div className="relative h-80 md:h-96 lg:h-[28rem]">
          <img
            src={scene.image}
            alt={`${scene.title} • ${scene.scene}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          
          {/* Enhanced title overlay */}
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg">
              {scene.title}
            </h2>
            <p 
              className="text-xl md:text-2xl font-medium drop-shadow-md"
              style={{ color: TOYOTA_RED }}
            >
              {scene.scene}
            </p>
          </div>
        </div>

        {/* Enhanced content */}
        <div className="p-8 md:p-10 lg:p-12">
          <p className="text-white/90 text-xl lg:text-2xl mb-8 leading-relaxed">
            {scene.description}
          </p>

          {/* Enhanced specs grid for desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {Object.entries(scene.specs).map(([key, val]) => {
              const normalized = key.toLowerCase().replace(/[^a-z]/g, "");
              return (
                <div
                  key={key}
                  className="flex items-center gap-4 p-5 rounded-xl bg-gradient-to-br from-zinc-900/80 to-black/80 border border-white/10 hover:border-white/20 transition-all duration-200 group"
                >
                  <span 
                    className="transition-all duration-200 group-hover:drop-shadow-[0_0_12px_currentColor]"
                    style={{ color: TOYOTA_RED }}
                  >
                    {specIcons[normalized] ?? <Gauge className="w-6 h-6" aria-hidden />}
                  </span>
                  <div className="text-base">
                    <div className="uppercase tracking-wider text-white/60 text-xs font-medium mb-1">
                      {key}
                    </div>
                    <div className="font-semibold text-white">
                      {val}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced CTA */}
          {onAskToyota && (
            <button
              onClick={() => onAskToyota(scene)}
              className="w-full md:w-auto px-10 py-5 rounded-xl font-semibold text-lg transition-all duration-200 border backdrop-blur-sm hover:scale-105"
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
      </div>
    </div>
  );
});

OptimizedSceneModal.displayName = "OptimizedSceneModal";

export default OptimizedSceneModal;
