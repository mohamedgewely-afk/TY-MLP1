
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Play, RotateCcw, Eye, Zap, Star } from "lucide-react";
import { EnhancedSceneData, ExperienceType } from "@/types/gallery";
import { cn } from "@/lib/utils";

const TOYOTA_RED = "#EB0A1E";

interface ExpandedSceneOverlayProps {
  experience: EnhancedSceneData;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onAskToyota?: (experience: EnhancedSceneData) => void;
  prefersReduced: boolean;
  rtl: boolean;
  locale: string;
}

const ExperienceTypeRenderer: React.FC<{ 
  experience: EnhancedSceneData; 
  onAction?: (action: string) => void;
}> = ({ experience, onAction }) => {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  switch (experience.experienceType) {
    case 'video':
      return (
        <div className="relative">
          <img
            src={experience.media.primaryImage}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full"
              onClick={() => onAction?.('play')}
            >
              <Play className="w-8 h-8 text-white ml-1" />
            </motion.button>
          </div>
          {experience.duration && (
            <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm">
              {experience.duration}
            </div>
          )}
        </div>
      );

    case '360tour':
      return (
        <div className="relative">
          <img
            src={experience.media.primaryImage}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full"
              onClick={() => onAction?.('start360')}
            >
              <RotateCcw className="w-8 h-8 text-white" />
            </motion.button>
          </div>
          <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded text-sm font-medium">
            360° Interactive Tour
          </div>
        </div>
      );

    case 'interactive':
      return (
        <div className="relative">
          <img
            src={experience.media.primaryImage}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
          {experience.interactionData?.hotspots?.map((hotspot, index) => (
            <motion.button
              key={index}
              className="absolute w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg"
              style={{
                left: `${hotspot.x * 100}%`,
                top: `${hotspot.y * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              whileHover={{ scale: 1.2 }}
              onHoverStart={() => setActiveHotspot(index)}
              onHoverEnd={() => setActiveHotspot(null)}
            >
              <div className="w-3 h-3 bg-white rounded-full" />
            </motion.button>
          ))}
          
          {/* Hotspot tooltip */}
          <AnimatePresence>
            {activeHotspot !== null && experience.interactionData?.hotspots && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 pointer-events-none z-10"
                style={{
                  left: `${experience.interactionData.hotspots[activeHotspot].x * 100}%`,
                  top: `${experience.interactionData.hotspots[activeHotspot].y * 100 - 10}%`,
                  transform: 'translate(-50%, -100%)'
                }}
              >
                <h4 className="font-semibold text-sm">{experience.interactionData.hotspots[activeHotspot].title}</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {experience.interactionData.hotspots[activeHotspot].description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );

    case 'comparison':
      return (
        <div className="relative h-full">
          {experience.interactionData?.comparison && (
            <div className="grid grid-cols-1 md:grid-cols-2 h-full">
              <div className="relative">
                <img
                  src={experience.interactionData.comparison.beforeImage}
                  alt={experience.interactionData.comparison.beforeLabel}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-2 rounded">
                  {experience.interactionData.comparison.beforeLabel}
                </div>
              </div>
              <div className="relative">
                <img
                  src={experience.interactionData.comparison.afterImage}
                  alt={experience.interactionData.comparison.afterLabel}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded">
                  {experience.interactionData.comparison.afterLabel}
                </div>
              </div>
            </div>
          )}
        </div>
      );

    case 'gallery':
    case 'feature-focus':
    default:
      return (
        <img
          src={experience.media.primaryImage}
          alt={experience.title}
          className="w-full h-full object-cover"
        />
      );
  }
};

const ExpandedSceneOverlay: React.FC<ExpandedSceneOverlayProps> = ({
  experience,
  onClose,
  onNext,
  onPrev,
  onAskToyota,
  prefersReduced,
  rtl,
  locale
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const headingId = `experience-title-${experience.id}`;

  // Focus management and keyboard handling
  useEffect(() => {
    const root = overlayRef.current;
    if (!root) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    root.querySelector<HTMLButtonElement>("[data-close]")?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "ArrowRight") { rtl ? onPrev() : onNext(); return; }
      if (e.key === "ArrowLeft") { rtl ? onNext() : onPrev(); return; }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previouslyFocused?.focus();
    };
  }, [onClose, onNext, onPrev, rtl]);

  const handleAction = (action: string) => {
    console.log(`Experience action: ${action}`, experience);
    // Handle different actions based on experience type
  };

  return (
    <motion.div
      ref={overlayRef}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-modal="true" 
      role="dialog" 
      aria-labelledby={headingId}
    >
      {/* Panel */}
      <motion.div
        className="relative mx-auto h-full w-full md:w-[min(1400px,95vw)] md:h-[min(900px,90vh)] md:mt-[5vh] md:rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xl"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onPrev}
              className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
              aria-label="Previous experience"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="text-center">
              <h2 id={headingId} className="text-white font-semibold text-lg">
                {experience.title}
              </h2>
              {experience.subtitle && (
                <p className="text-white/80 text-sm mt-1">{experience.subtitle}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onNext}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                aria-label="Next experience"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                data-close
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors"
                aria-label="Close experience"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="h-full flex flex-col md:flex-row">
          {/* Media Section */}
          <div className="flex-1 relative bg-gray-100 dark:bg-gray-800">
            <ExperienceTypeRenderer 
              experience={experience} 
              onAction={handleAction}
            />
          </div>

          {/* Info Panel */}
          <div className="md:w-96 bg-white dark:bg-gray-900 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Category and Type */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium">
                  {experience.scene}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {experience.experienceType.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </div>

              {/* Description */}
              <div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {experience.description}
                </p>
              </div>

              {/* Specs */}
              {experience.specs && Object.keys(experience.specs).length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Specifications</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(experience.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{key}</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              {experience.ctaButtons && experience.ctaButtons.length > 0 && (
                <div className="space-y-3">
                  {experience.ctaButtons.map((button, index) => (
                    <button
                      key={index}
                      onClick={() => handleAction(button.action)}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors",
                        button.primary
                          ? "text-white"
                          : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      )}
                      style={button.primary ? { backgroundColor: TOYOTA_RED } : {}}
                    >
                      {button.icon && (
                        <div className="w-4 h-4">
                          {/* Icon would be rendered here based on button.icon */}
                        </div>
                      )}
                      {button.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Ask Toyota */}
              {onAskToyota && (
                <button
                  onClick={() => onAskToyota(experience)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Zap className="w-4 h-4" />
                  Ask Toyota
                </button>
              )}

              {/* Tags */}
              {experience.tags && experience.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExpandedSceneOverlay;
