
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAccessibleCarousel } from '@/hooks/useAccessibleCarousel';
import { useTouchGestures } from '@/hooks/useTouchGestures';

interface AccessibleCarouselProps {
  children: React.ReactNode[];
  className?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  showControls?: boolean;
  showIndicators?: boolean;
  loop?: boolean;
  onSlideChange?: (index: number) => void;
}

export const AccessibleCarousel: React.FC<AccessibleCarouselProps> = ({
  children,
  className,
  autoplay = false,
  autoplayDelay = 4000,
  showControls = true,
  showIndicators = true,
  loop = true,
  onSlideChange
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const {
    currentIndex,
    canGoPrevious,
    canGoNext,
    goToPrevious,
    goToNext,
    goToSlide,
    pauseAutoplay,
    resumeAutoplay,
    isAutoplayPaused,
    handleKeyDown,
    isMobile
  } = useAccessibleCarousel({
    itemCount: children.length,
    autoplay,
    autoplayDelay,
    loop
  });

  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  } = useTouchGestures({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50,
    velocity: 0.3
  });

  useEffect(() => {
    onSlideChange?.(currentIndex);
  }, [currentIndex, onSlideChange]);

  // Focus management
  useEffect(() => {
    if (carouselRef.current) {
      const activeSlide = carouselRef.current.querySelector(`[data-slide-index="${currentIndex}"]`) as HTMLElement;
      if (activeSlide) {
        activeSlide.focus();
      }
    }
  }, [currentIndex]);

  return (
    <div
      ref={carouselRef}
      className={cn('relative focus:outline-none', className)}
      role="region"
      aria-label="Image carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Skip to controls link */}
      <a
        href="#carousel-controls"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-background focus:text-foreground focus:px-2 focus:py-1 focus:rounded"
      >
        Skip to carousel controls
      </a>

      {/* Main carousel content */}
      <div className="relative overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          aria-live="polite"
          aria-atomic="true"
        >
          {children.map((child, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0"
              data-slide-index={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${children.length}`}
              tabIndex={index === currentIndex ? 0 : -1}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      {showControls && (
        <div id="carousel-controls" className="absolute inset-0 flex items-center justify-between pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            disabled={!canGoPrevious}
            className={cn(
              "pointer-events-auto absolute left-2 z-10 bg-background/80 backdrop-blur-sm",
              "focus:ring-2 focus:ring-primary focus:ring-offset-2",
              !isMobile && "hover:bg-background/90"
            )}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            disabled={!canGoNext}
            className={cn(
              "pointer-events-auto absolute right-2 z-10 bg-background/80 backdrop-blur-sm",
              "focus:ring-2 focus:ring-primary focus:ring-offset-2",
              !isMobile && "hover:bg-background/90"
            )}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {autoplay && (
            <Button
              variant="outline"
              size="icon"
              onClick={isAutoplayPaused ? resumeAutoplay : pauseAutoplay}
              className={cn(
                "pointer-events-auto absolute bottom-2 right-2 z-10 bg-background/80 backdrop-blur-sm",
                "focus:ring-2 focus:ring-primary focus:ring-offset-2",
                !isMobile && "hover:bg-background/90"
              )}
              aria-label={isAutoplayPaused ? "Resume slideshow" : "Pause slideshow"}
            >
              {isAutoplayPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
          )}
        </div>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {children.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none",
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-primary/40 hover:bg-primary/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={index === currentIndex}
            />
          ))}
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {children.length}
        {autoplay && (isAutoplayPaused ? '. Slideshow paused.' : '. Slideshow playing.')}
      </div>
    </div>
  );
};
