
import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCarousel } from '@/hooks/use-carousel';
import { useTouchGestures } from '@/hooks/use-touch-gestures';
import { cn } from '@/lib/utils';

interface AccessibleCarouselProps {
  items: React.ReactNode[];
  itemsPerView?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  showControls?: boolean;
  showIndicators?: boolean;
  ariaLabel?: string;
  itemAriaLabel?: (index: number) => string;
}

export const AccessibleCarousel: React.FC<AccessibleCarouselProps> = ({
  items,
  itemsPerView = 1,
  autoPlay = false,
  autoPlayInterval = 4000,
  className,
  showControls = true,
  showIndicators = true,
  ariaLabel = "Image carousel",
  itemAriaLabel = (index) => `Item ${index + 1} of ${items.length}`
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    currentIndex,
    isAutoPlaying,
    canGoPrev,
    canGoNext,
    goToIndex,
    goNext,
    goPrev,
    toggleAutoPlay,
    pauseAutoPlay,
    resumeAutoPlay
  } = useCarousel({
    itemCount: items.length,
    itemsPerView,
    autoPlay,
    autoPlayInterval,
    loop: true
  });

  const { touchHandlers } = useTouchGestures({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goPrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goNext();
        break;
      case 'Home':
        e.preventDefault();
        goToIndex(0);
        break;
      case 'End':
        e.preventDefault();
        goToIndex(items.length - 1);
        break;
      case ' ':
        e.preventDefault();
        toggleAutoPlay();
        break;
    }
  };

  return (
    <div 
      className={cn("relative group", className)}
      onMouseEnter={pauseAutoPlay}
      onMouseLeave={resumeAutoPlay}
    >
      <div
        ref={containerRef}
        role="region"
        aria-label={ariaLabel}
        aria-live="polite"
        className="relative overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        {...touchHandlers}
      >
        <div className="flex transition-transform duration-300 ease-in-out">
          <AnimatePresence mode="wait">
            {items.map((item, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-full"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: index === currentIndex ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                role="group"
                aria-roledescription="slide"
                aria-label={itemAriaLabel(index)}
                aria-hidden={index !== currentIndex}
              >
                {item}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Skip to content link for screen readers */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
        >
          Skip carousel
        </a>
      </div>

      {/* Navigation Controls */}
      {showControls && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 focus:ring-2 focus:ring-primary"
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label="Previous item"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 focus:ring-2 focus:ring-primary"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label="Next item"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Auto-play control */}
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4 z-10 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 focus:ring-2 focus:ring-primary"
            onClick={toggleAutoPlay}
            aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="flex justify-center mt-4 gap-2" role="tablist" aria-label="Carousel navigation">
          {items.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2",
                index === currentIndex
                  ? "bg-primary w-8"
                  : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/50"
              )}
              onClick={() => goToIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing item {currentIndex + 1} of {items.length}
        {isAutoPlaying && ". Slideshow is playing"}
      </div>
    </div>
  );
};
