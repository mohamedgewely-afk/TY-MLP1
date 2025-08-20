
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExperienceCard } from './ExperienceCard';
import { useCarousel } from '@/hooks/use-carousel';
import { useTouchGestures } from '@/hooks/use-touch-gestures';

interface Slide {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  icon: React.ReactNode;
  meta?: string[];
  cta?: { label: string; onClick: () => void };
}

interface EnhancedExperienceRailProps {
  slides: Slide[];
  vehicleModelEnd: string;
  onQuickView: (index: number) => void;
}

export const EnhancedExperienceRail: React.FC<EnhancedExperienceRailProps> = ({
  slides,
  vehicleModelEnd,
  onQuickView
}) => {
  const railRef = useRef<HTMLDivElement>(null);
  const [itemsPerView, setItemsPerView] = useState(1);

  // Responsive items per view calculation
  useEffect(() => {
    const updateItemsPerView = () => {
      if (!railRef.current) return;
      
      const width = railRef.current.clientWidth;
      let items = 1;
      
      if (width >= 1536) items = 3; // 2xl screens - 3 large cards
      else if (width >= 1280) items = 2; // xl screens - 2 large cards
      else if (width >= 768) items = 2; // md screens - 2 medium cards
      else items = 1; // mobile - 1 card
      
      setItemsPerView(items);
    };

    const resizeObserver = new ResizeObserver(updateItemsPerView);
    if (railRef.current) {
      resizeObserver.observe(railRef.current);
    }
    
    updateItemsPerView();
    
    return () => resizeObserver.disconnect();
  }, []);

  const {
    currentIndex,
    canGoPrev,
    canGoNext,
    goNext,
    goPrev,
    goToIndex
  } = useCarousel({
    itemCount: slides.length,
    itemsPerView,
    autoPlay: false,
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
        goToIndex(slides.length - 1);
        break;
    }
  };

  const maxPages = Math.ceil(slides.length / itemsPerView);
  const currentPage = Math.floor(currentIndex / itemsPerView);

  return (
    <section 
      className="py-12 lg:py-20 bg-gradient-to-b from-background via-muted/30 to-background"
      aria-labelledby="experience-rail-heading"
    >
      <div className="toyota-container max-w-none w-full">
        {/* Header */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            Tailored to Every Model
          </div>
          <h2 id="experience-rail-heading" className="text-4xl lg:text-6xl font-black mb-4">
            Craft Your {vehicleModelEnd} Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make your {vehicleModelEnd} experience extraordinary
          </p>
        </motion.div>

        {/* Main Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Navigation Arrows */}
          <button
            aria-label="View previous experience cards"
            onClick={goPrev}
            disabled={!canGoPrev}
            className="hidden lg:flex absolute -left-16 top-1/2 -translate-y-1/2 z-20 h-16 w-16 items-center justify-center rounded-full bg-card shadow-lg ring-1 ring-border disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden="true" />
          </button>
          
          <button
            aria-label="View next experience cards"
            onClick={goNext}
            disabled={!canGoNext}
            className="hidden lg:flex absolute -right-16 top-1/2 -translate-y-1/2 z-20 h-16 w-16 items-center justify-center rounded-full bg-card shadow-lg ring-1 ring-border disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <ChevronRight className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Cards Container */}
          <div
            ref={railRef}
            role="region"
            aria-label="Vehicle experience features"
            aria-live="polite"
            className="overflow-hidden rounded-2xl focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            {...touchHandlers}
          >
            <motion.div 
              className="flex transition-transform duration-500 ease-out"
              animate={{ 
                x: `${-currentIndex * (100 / itemsPerView)}%` 
              }}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide.key}
                  className="flex-shrink-0 px-3"
                  style={{ 
                    width: `${100 / itemsPerView}%`
                  }}
                >
                  <div className="h-full">
                    <ExperienceCard
                      title={slide.title}
                      subtitle={slide.subtitle}
                      image={slide.image}
                      icon={slide.icon}
                      meta={slide.meta}
                      cta={slide.cta}
                      onClick={() => onQuickView(index)}
                      index={index}
                    />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Enhanced Pagination */}
          <div className="mt-8 flex items-center justify-center">
            <div className="flex items-center gap-2">
              {Array.from({ length: maxPages }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  aria-label={`Go to page ${pageIndex + 1}`}
                  aria-current={currentPage === pageIndex}
                  onClick={() => goToIndex(pageIndex * itemsPerView)}
                  className={`h-3 rounded-full transition-all duration-200 ${
                    currentPage === pageIndex
                      ? "bg-primary w-12"
                      : "bg-muted-foreground/30 w-3 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Navigation Info */}
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {currentPage + 1} of {maxPages} • 
              Showing {Math.min(currentIndex + itemsPerView, slides.length)} of {slides.length} experiences
            </span>
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" size="sm" onClick={goPrev} disabled={!canGoPrev}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button variant="ghost" size="sm" onClick={goNext} disabled={!canGoNext}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Showing page {currentPage + 1} of {maxPages}. 
        Cards {currentIndex + 1} to {Math.min(currentIndex + itemsPerView, slides.length)} visible.
      </div>
    </section>
  );
};
