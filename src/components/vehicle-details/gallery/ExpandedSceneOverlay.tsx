
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Share2, Heart, Download } from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils";

const TOYOTA_RED = "#EB0A1E";

interface ExpandedSceneOverlayProps {
  experience: EnhancedSceneData;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onAskToyota?: (scene: EnhancedSceneData) => void;
  prefersReduced?: boolean;
  rtl?: boolean;
  locale?: string;
}

const ExpandedSceneOverlay: React.FC<ExpandedSceneOverlayProps> = ({
  experience,
  onClose,
  onNext,
  onPrev,
  onAskToyota,
  prefersReduced = false,
  rtl = false,
  locale = "en"
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (!rtl) onPrev?.();
          else onNext?.();
          break;
        case 'ArrowRight':
          if (!rtl) onNext?.();
          else onPrev?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev, rtl]);

  // Swipe gestures
  const swipeRef = useSwipeable({
    onSwipeLeft: () => !rtl ? onNext?.() : onPrev?.(),
    onSwipeRight: () => !rtl ? onPrev?.() : onNext?.(),
    onSwipeDown: onClose,
    threshold: 50
  });

  const images = experience.media.gallery || [experience.media.primaryImage];

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsImageLoaded(false);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsImageLoaded(false);
  }, [images.length]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-60 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Navigation Buttons */}
        {onPrev && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-60 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {onNext && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-60 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Main Content */}
        <motion.div
          ref={swipeRef}
          className="w-full h-full max-w-7xl mx-auto p-4 flex flex-col lg:flex-row gap-6 overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="relative flex-1 bg-gray-900 rounded-2xl overflow-hidden">
              <img
                src={images[currentImageIndex]}
                alt={`${experience.title} - Image ${currentImageIndex + 1}`}
                className={cn(
                  "w-full h-full object-contain transition-opacity duration-300",
                  isImageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setIsImageLoaded(true)}
              />
              
              {!isImageLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}

              {/* Image Navigation */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {setCurrentImageIndex(index); setIsImageLoaded(false);}}
                        className={cn(
                          "w-2 h-2 rounded-full transition-colors",
                          index === currentImageIndex ? "bg-white" : "bg-white/50"
                        )}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content Section - Scrollable */}
          <div className="w-full lg:w-96 flex flex-col min-h-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 flex-1 overflow-y-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: TOYOTA_RED }}
                  >
                    <span className="text-lg font-bold">LC</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {experience.title}
                    </h1>
                    {experience.subtitle && (
                      <p className="text-gray-600 dark:text-gray-400">
                        {experience.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {experience.tags && experience.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {experience.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {experience.description}
                </p>
              </div>

              {/* Specs */}
              {experience.specs && Object.keys(experience.specs).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Specifications
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(experience.specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">{key}</span>
                        <span className="text-gray-900 dark:text-white font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {experience.ctaButtons?.map((button, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-full py-3 px-4 rounded-lg font-medium transition-colors",
                      button.primary
                        ? "text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                    )}
                    style={button.primary ? { backgroundColor: TOYOTA_RED } : {}}
                  >
                    {button.label}
                  </button>
                ))}

                {onAskToyota && (
                  <button
                    onClick={() => onAskToyota(experience)}
                    className="w-full py-3 px-4 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Ask Toyota Expert
                  </button>
                )}
              </div>

              {/* Additional Actions */}
              <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExpandedSceneOverlay;
