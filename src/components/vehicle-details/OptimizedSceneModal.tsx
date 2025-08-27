
import React, { useEffect, useCallback, useRef } from "react";
import { X, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

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

const OptimizedSceneModal: React.FC<OptimizedSceneModalProps> = ({
  scene,
  onClose,
  onNext,
  onPrev,
  onAskToyota,
  strings,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        onPrev();
      } else if (e.key === "ArrowRight") {
        onNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Focus management
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-6xl mx-4 bg-gradient-to-br from-zinc-950/95 to-black/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-white">
                {scene.title}
              </h2>
              <p className="text-lg" style={{ color: TOYOTA_RED }}>
                {scene.scene}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {onAskToyota && (
                <button
                  type="button"
                  onClick={() => onAskToyota(scene)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  <MessageSquare className="w-4 h-4" />
                  {strings.ask}
                </button>
              )}
              
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
                aria-label={strings.collapse}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            type="button"
            onClick={onPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200"
            aria-label={strings.prevScene}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 text-white transition-all duration-200"
            aria-label={strings.nextScene}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Main image */}
          <div className="relative h-96 lg:h-[500px]">
            <img
              src={scene.image}
              alt={`${scene.title} • ${scene.scene}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Description and specs */}
          <div className="p-6">
            <p className="text-lg text-white/90 mb-6 leading-relaxed">
              {scene.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(scene.specs).map(([key, value]) => (
                <div
                  key={key}
                  className="p-4 rounded-xl bg-gradient-to-br from-zinc-900/60 to-black/60 border border-white/5"
                >
                  <div className="text-xs uppercase tracking-wider text-white/50 font-medium mb-1">
                    {key}
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedSceneModal;
