import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Play, Pause } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  isHybrid?: boolean;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressBar, setProgressBar] = useState(0);
  const isMobile = useIsMobile();
  // Fix: Change the type from number to NodeJS.Timeout
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Handle swipe on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      nextSlide();
    }
    
    if (touchStart - touchEnd < -75) {
      // Swipe right
      prevSlide();
    }
  };

  // Reset progress bar when slide changes or when paused/resumed
  useEffect(() => {
    setProgressBar(0);
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    
    if (!isPaused) {
      const interval = setInterval(() => {
        setProgressBar((prev) => {
          if (prev >= 100) {
            nextSlide();
            return 0;
          }
          return prev + 0.4; // 100% over 6 seconds (approximately)
        });
      }, 25);
      progressInterval.current = interval;
    }
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [currentSlide, isPaused]);

  // Navigate to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div 
      className="relative h-[85vh] sm:h-[80vh] md:h-[70vh] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-black/40 bg-gradient-to-b from-black/60 to-black/30 z-10" />
          
          <motion.img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6 }}
          />
          
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-6">
            <div className="max-w-4xl mx-auto">
              {slides[currentSlide].isHybrid && (
                <motion.div 
                  className="mb-4 inline-block bg-toyota-red px-4 py-1 rounded-full text-sm font-medium"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ 
                    opacity: [0, 1, 1],
                    y: [-20, 0, 0],
                    scale: [0.95, 1.05, 1]
                  }}
                  transition={{ duration: 0.6, times: [0, 0.5, 1] }}
                >
                  <span className="animate-pulse-soft inline-flex items-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-white mr-2 animate-ping opacity-75 inline-block"></span>
                    Hybrid Technology
                  </span>
                </motion.div>
              )}
              
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-toyota-red hover:bg-toyota-darkred text-white rounded-full shadow-lg transform transition-all"
                >
                  <Link to={slides[currentSlide].ctaLink} className="flex items-center gap-2 px-6 py-6 text-base sm:text-lg">
                    {slides[currentSlide].ctaText}
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Interactive elements based on media queries */}
          <motion.div 
            className="absolute bottom-28 left-0 right-0 z-30 flex justify-center space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? "bg-white w-8"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </motion.div>

          {/* Progress bar */}
          <div className="absolute bottom-20 left-0 right-0 z-30 flex justify-center">
            <div className="w-[200px] h-1 bg-white/30 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-toyota-red"
                style={{ width: `${progressBar}%` }}
              />
            </div>
          </div>

          {/* Control buttons */}
          <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-3">
            <button
              onClick={togglePause}
              className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
              aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <Play className="h-4 w-4 fill-white" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Navigation arrows - hidden on mobile, visible on larger screens */}
          {!isMobile && (
            <>
              <motion.button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
                aria-label="Previous slide"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>
              <motion.button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
                aria-label="Next slide"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </>
          )}

          {/* Slide counter */}
          <div className="absolute top-4 right-4 z-30 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
            {currentSlide + 1} / {slides.length}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroCarousel;
