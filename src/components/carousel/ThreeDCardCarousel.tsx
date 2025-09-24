import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface CarouselItem {
  id: string;
  title: string;
  ctaLabel?: string;
  media: {
    imageUrl?: string;
    videoUrl?: string;
    poster?: string;
    caption?: string;
  };
  bullets?: string[];
}

interface ThreeDCardCarouselProps {
  items: CarouselItem[];
  onItemAction?: (id: string) => void;
  className?: string;
}

const ThreeDCardCarousel: React.FC<ThreeDCardCarouselProps> = ({
  items,
  onItemAction,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const prefersReducedMotion = useReducedMotionSafe();

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  // Auto-play (optional)
  useEffect(() => {
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, [goToNext]);

  const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent) => {
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    setDragStartX(clientX);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    const deltaX = info.offset.x;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
  };

  const getCardTransform = (index: number) => {
    const diff = index - currentIndex;
    const absIndex = Math.abs(diff);
    
    if (prefersReducedMotion) {
      return {
        opacity: index === currentIndex ? 1 : 0.3,
        scale: index === currentIndex ? 1 : 0.8,
        x: diff * 300,
        z: 0,
        rotateY: 0
      };
    }

    // 3D perspective calculations
    const baseX = diff * 300;
    const baseScale = index === currentIndex ? 1 : Math.max(0.7, 1 - absIndex * 0.15);
    const opacity = index === currentIndex ? 1 : Math.max(0.3, 1 - absIndex * 0.3);
    const rotateY = diff * -15;
    const z = index === currentIndex ? 0 : -absIndex * 100;

    return {
      x: baseX,
      scale: baseScale,
      opacity,
      rotateY,
      z,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    };
  };

  return (
    <section className={`py-16 lg:py-24 bg-black overflow-hidden ${className}`}>
      <div className="toyota-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-6xl font-light text-white tracking-tight mb-6">
            Experience Every
            <br />
            <span className="text-red-500">Detail</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Immerse yourself in the luxury and innovation that defines our vehicles
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative h-[600px] flex items-center justify-center perspective-1000">
          {/* Cards */}
          <div className="relative w-full max-w-7xl mx-auto">
            <AnimatePresence mode="sync">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="absolute left-1/2 top-1/2 w-80 lg:w-96 h-96 lg:h-[480px] cursor-grab active:cursor-grabbing"
                  style={{
                    originX: 0.5,
                    originY: 0.5,
                    transformStyle: 'preserve-3d'
                  }}
                  {...getCardTransform(index)}
                  exit={{ opacity: 0, scale: 0.8 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  dragElastic={0.2}
                >
                  {/* Card Content */}
                  <div className="w-full h-full bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                    {/* Image */}
                    <div className="relative h-2/3 overflow-hidden">
                      <img
                        src={item.media.imageUrl}
                        alt={item.media.caption || item.title}
                        className="w-full h-full object-cover"
                        loading={index <= 2 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6 h-1/3 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-3 leading-tight">
                          {item.title}
                        </h3>
                        
                        {item.bullets && (
                          <ul className="space-y-1 text-sm text-white/70 mb-4">
                            {item.bullets.slice(0, 2).map((bullet, i) => (
                              <li key={i} className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 flex-shrink-0" />
                                {bullet}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {onItemAction && (
                        <Button
                          onClick={() => onItemAction(item.id)}
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-white hover:bg-white/10 p-0 h-auto font-medium group w-fit"
                        >
                          <span>{item.ctaLabel || 'Learn More'}</span>
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Navigation Arrows */}
          <Button
            onClick={goToPrevious}
            variant="outline"
            size="sm"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 border-white/20 text-white hover:bg-white/10 backdrop-blur-md"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            onClick={goToNext}
            variant="outline"
            size="sm"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 border-white/20 text-white hover:bg-white/10 backdrop-blur-md"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50
                ${index === currentIndex 
                  ? 'bg-red-500 scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
                }
              `}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="flex justify-center mt-6">
          <div className="text-white/60 text-sm font-medium">
            {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ThreeDCardCarousel;