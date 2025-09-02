
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Share2, Heart, Download, ArrowLeft } from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { useSwipeable } from "@/hooks/use-swipeable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExpandedSceneOverlayProps {
  experience: EnhancedSceneData;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onAskToyota?: (scene: EnhancedSceneData) => void;
  rtl?: boolean;
  locale?: string;
}

const ExpandedSceneOverlay: React.FC<ExpandedSceneOverlayProps> = ({
  experience,
  onClose,
  onNext,
  onPrev,
  onAskToyota,
  rtl = false,
  locale = "en"
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const images = experience.media.gallery || [experience.media.primaryImage];

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
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev, rtl]);

  // Swipe gestures
  const swipeRef = useSwipeable({
    onSwipeLeft: () => !rtl ? onNext?.() : onPrev?.(),
    onSwipeRight: () => !rtl ? onPrev?.() : onNext?.(),
    onSwipeDown: onClose,
    threshold: 50
  });

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsImageLoaded(false);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsImageLoaded(false);
  }, [images.length]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-60 bg-gradient-to-b from-background/90 to-transparent">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="gap-2 text-foreground hover:bg-muted"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Button>

          <div className="flex items-center gap-2">
            {/* Navigation */}
            {onPrev && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onPrev}
                className="text-foreground hover:bg-muted"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            
            {onNext && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNext}
                className="text-foreground hover:bg-muted"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}

            <div className="w-px h-6 bg-border mx-2" />

            {/* Actions */}
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground hover:bg-muted">
              <Download className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-border mx-2" />

            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-foreground hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        ref={swipeRef}
        className="flex h-full pt-16 pb-4"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image Section */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="relative w-full h-full max-w-4xl bg-muted rounded-2xl overflow-hidden">
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
              <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
              </div>
            )}

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
                
                {/* Image Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {setCurrentImageIndex(index); setIsImageLoaded(false);}}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        index === currentImageIndex ? "bg-toyota-red" : "bg-muted-foreground/50"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Content Panel */}
        <div className="w-96 bg-card border-l border-border overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-toyota-red rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {experience.scene.charAt(0)}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-foreground leading-tight">
                    {experience.title}
                  </h1>
                  {experience.subtitle && (
                    <p className="text-muted-foreground">
                      {experience.subtitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              {experience.tags && experience.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {experience.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-muted text-muted-foreground rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-foreground leading-relaxed">
                {experience.description}
              </p>
            </div>

            {/* Specifications */}
            {experience.specs && Object.keys(experience.specs).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Specifications
                </h3>
                <div className="space-y-3">
                  {Object.entries(experience.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground font-medium">{key}</span>
                      <span className="text-foreground font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {experience.ctaButtons?.map((button, index) => (
                <Button
                  key={index}
                  className={cn(
                    "w-full justify-center",
                    button.primary 
                      ? "bg-toyota-red hover:bg-toyota-red/90 text-white" 
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  {button.label}
                </Button>
              ))}

              {onAskToyota && (
                <Button
                  onClick={() => onAskToyota(experience)}
                  variant="outline"
                  className="w-full"
                >
                  Ask Toyota Expert
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExpandedSceneOverlay;
