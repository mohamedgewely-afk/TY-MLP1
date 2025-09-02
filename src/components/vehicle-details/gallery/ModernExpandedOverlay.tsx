
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Share2, Heart, ArrowLeft } from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { useIsMobile } from "@/hooks/use-mobile";

interface ModernExpandedOverlayProps {
  experience: EnhancedSceneData;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onAskToyota?: (scene: EnhancedSceneData) => void;
}

const ModernExpandedOverlay: React.FC<ModernExpandedOverlayProps> = ({
  experience,
  onClose,
  onNext,
  onPrev,
  onAskToyota
}) => {
  const isMobile = useIsMobile();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const images = experience.media.gallery || [experience.media.primaryImage];

  // Touch gestures for mobile
  const touchGestures = useTouchGestures({
    onSwipeLeft: onNext,
    onSwipeRight: onPrev,
    threshold: 50
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (images.length > 1 && currentImageIndex > 0) {
            setCurrentImageIndex(prev => prev - 1);
            setIsImageLoaded(false);
          } else {
            onPrev?.();
          }
          break;
        case 'ArrowRight':
          if (images.length > 1 && currentImageIndex < images.length - 1) {
            setCurrentImageIndex(prev => prev + 1);
            setIsImageLoaded(false);
          } else {
            onNext?.();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, onNext, onPrev, images.length, currentImageIndex]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setIsImageLoaded(false);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsImageLoaded(false);
  }, [images.length]);

  if (isMobile) {
    return (
      <motion.div
        className="fixed inset-0 z-50 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        {...touchGestures}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            {onPrev && (
              <Button variant="ghost" size="sm" onClick={onPrev}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            {onNext && (
              <Button variant="ghost" size="sm" onClick={onNext}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="flex flex-col h-[calc(100vh-64px)]">
          {/* Image */}
          <div className="flex-1 relative bg-muted">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Details Panel */}
          <div className="bg-card border-t border-border p-4 max-h-60 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-bold text-foreground mb-2">
                  {experience.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {experience.description}
                </p>
              </div>

              {experience.ctaButtons && (
                <div className="flex gap-2">
                  {experience.ctaButtons.map((button, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={button.primary ? "default" : "outline"}
                      className="flex-1"
                    >
                      {button.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Desktop Layout
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Desktop Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <Button
          variant="ghost"
          onClick={onClose}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
        </Button>

        <div className="flex items-center gap-2">
          {onPrev && (
            <Button variant="ghost" size="sm" onClick={onPrev}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}
          
          {onNext && (
            <Button variant="ghost" size="sm" onClick={onNext}>
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}

          <div className="w-px h-6 bg-border mx-2" />

          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="flex h-[calc(100vh-88px)]">
        {/* Image Section */}
        <div className="flex-1 flex items-center justify-center p-6">
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
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80"
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
                        index === currentImageIndex ? "bg-primary" : "bg-muted-foreground/50"
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="w-96 bg-card border-l border-border overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {experience.title}
              </h1>
              {experience.subtitle && (
                <p className="text-muted-foreground mb-4">
                  {experience.subtitle}
                </p>
              )}
              <p className="text-foreground leading-relaxed">
                {experience.description}
              </p>
            </div>

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

            {experience.ctaButtons && (
              <div className="space-y-3">
                {experience.ctaButtons.map((button, index) => (
                  <Button
                    key={index}
                    className="w-full"
                    variant={button.primary ? "default" : "outline"}
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
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ModernExpandedOverlay;
