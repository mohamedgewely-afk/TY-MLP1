import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface Media {
  imageUrl?: string;
  videoUrl?: string;
  poster?: string;
  caption?: string;
}

interface CarouselItem {
  id: string;
  title: string;
  ctaLabel?: string;
  media: Media;
  bullets?: string[];
}

interface ThreeDCardCarouselProps {
  items: CarouselItem[];
  onItemAction?: (id: string) => void;
  className?: string;
}

const ThreeDCardCarousel: React.FC<ThreeDCardCarouselProps> = ({
  items = [],
  onItemAction,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const prefersReducedMotion = useReducedMotion();

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

  // Auto-play
  useEffect(() => {
    const interval = setInterval(goToNext, 8000);
    return () => clearInterval(interval);
  }, [goToNext]);

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
    const baseX = diff * 320;
    const baseScale = index === currentIndex ? 1 : Math.max(0.75, 1 - absIndex * 0.15);
    const opacity = index === currentIndex ? 1 : Math.max(0.4, 1 - absIndex * 0.3);
    const rotateY = diff * -12;
    const z = index === currentIndex ? 0 : -absIndex * 80;

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

  if (!items.length) {
    return null;
  }

  return (
    <section className={`py-16 lg:py-24 bg-carbon-matte overflow-hidden ${className}`}>
      <div className="container mx-auto px-4">
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
            <span className="text-accent-byd">Detail</span>
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
                  onDragEnd={handleDragEnd}
                  dragElastic={0.2}
                >
                  {/* Card Content */}
                  <div className="w-full h-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-200">
                    {/* Image */}
                    <div className="relative h-2/3 overflow-hidden">
                      <img
                        src={item.media.imageUrl || 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true'}
                        alt={item.media.caption || item.title}
                        className="w-full h-full object-cover"
                        loading={index <= 2 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* Content */}
                    <div className="p-6 h-1/3 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-3 leading-tight">
                          {item.title}
                        </h3>
                        
                        {item.bullets && (
                          <ul className="space-y-1 text-sm text-muted-foreground mb-4">
                            {item.bullets.slice(0, 2).map((bullet, i) => (
                              <li key={i} className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-brand-primary rounded-full mr-2 flex-shrink-0" />
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
                          className="text-brand-primary hover:text-brand-primary hover:bg-brand-primary/10 p-0 h-auto font-medium group w-fit"
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
                  ? 'bg-accent-byd scale-125' 
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