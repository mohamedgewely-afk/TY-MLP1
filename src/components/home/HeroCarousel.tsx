
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
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
  persona?: string; // Added persona property for persona-specific styling
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = useIsMobile();
  
  // Handle swipe on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (isAnimating) return;
    
    if (touchStart - touchEnd > 75) {
      // Swipe left
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 1000);
    }
    
    if (touchStart - touchEnd < -75) {
      // Swipe right
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  // Auto-advance slides
  useEffect(() => {
    if (isAnimating) return;
    
    const interval = setInterval(() => {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsAnimating(false), 1000);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length, isAnimating]);

  // Navigate to next slide
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 1000);
  };

  // Navigate to previous slide
  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 1000);
  };
  
  // Get persona-specific styling
  const getPersonaStyles = (persona?: string) => {
    const baseStyles = {
      container: "",
      overlay: "absolute inset-0 bg-black/40 bg-gradient-to-b from-black/60 to-black/30 z-10",
      title: "text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-shadow-lg",
      subtitle: "text-lg sm:text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto",
      button: "bg-toyota-red hover:bg-toyota-darkred text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-105",
      hybridTag: "mb-4 inline-block bg-toyota-red px-4 py-1 rounded-full text-sm font-medium",
      initialAnimation: { opacity: 0, y: 20 },
      contentAnimation: { opacity: 1, y: 0 },
      imageAnimation: { scale: 1.1 },
      imageTransition: { duration: 6 },
    };
    
    switch (persona) {
      case "family-first":
        return {
          ...baseStyles,
          container: "family-friendly-bg",
          overlay: "absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10",
          title: "text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-shadow-lg font-serif",
          button: "bg-[#4A6DA7] hover:bg-[#3A5D97] text-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105",
          hybridTag: "mb-4 inline-block bg-[#F2C94C] px-4 py-1 rounded-full text-sm font-medium",
          initialAnimation: { opacity: 0, y: 30, scale: 0.95 },
          contentAnimation: { opacity: 1, y: 0, scale: 1 },
          imageAnimation: { scale: 1.05, filter: "brightness(0.9)" },
          imageTransition: { duration: 7 },
        };
      case "tech-enthusiast":
        return {
          ...baseStyles,
          container: "tech-pattern-bg",
          overlay: "absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70 z-10",
          title: "text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-shadow-lg font-mono tracking-tight",
          subtitle: "text-lg sm:text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto font-light",
          button: "bg-[#6B38FB] hover:bg-[#5A27EA] text-white rounded-md shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(107,56,251,0.5)]",
          hybridTag: "mb-4 inline-block bg-[#00D4FF] px-4 py-1 rounded-md text-sm font-medium",
          initialAnimation: { opacity: 0, x: -50 },
          contentAnimation: { opacity: 1, x: 0 },
          imageAnimation: { scale: 1.05, filter: "hue-rotate(15deg)" },
          imageTransition: { duration: 5 },
        };
      case "eco-warrior":
        return {
          ...baseStyles,
          container: "eco-pattern-bg",
          overlay: "absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 z-10",
          title: "text-3xl sm:text-4xl md:text-6xl font-light mb-4 text-shadow-lg",
          subtitle: "text-lg sm:text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto font-light",
          button: "bg-[#2E7D32] hover:bg-[#1d6e21] text-white rounded-full shadow-lg transform transition-all duration-300 hover:scale-105",
          hybridTag: "mb-4 inline-block bg-[#CDDC39] px-4 py-1 rounded-full text-sm font-medium",
          initialAnimation: { opacity: 0, scale: 0.9 },
          contentAnimation: { opacity: 1, scale: 1 },
          imageAnimation: { scale: 1.05, filter: "saturate(1.2) brightness(0.95)" },
          imageTransition: { duration: 8 },
        };
      case "urban-explorer":
        return {
          ...baseStyles,
          container: "urban-pattern-bg",
          overlay: "absolute inset-0 bg-black/30 z-10",
          title: "text-3xl sm:text-4xl md:text-6xl font-bold mb-4 text-shadow-lg uppercase tracking-wide",
          button: "bg-[#455A64] hover:bg-[#354a54] text-white rounded-none shadow-lg transform transition-all duration-300 hover:scale-105 border-b-2 border-[#FF5722]",
          hybridTag: "mb-4 inline-block bg-[#FF5722] px-4 py-1 rounded-none text-sm font-medium",
          initialAnimation: { opacity: 0, y: 20, x: 20 },
          contentAnimation: { opacity: 1, y: 0, x: 0 },
          imageAnimation: { scale: 1.05, filter: "contrast(1.1)" },
          imageTransition: { duration: 5.5 },
        };
      case "business-commuter":
        return {
          ...baseStyles,
          container: "business-pattern-bg",
          overlay: "absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/30 z-10",
          title: "text-3xl sm:text-4xl md:text-6xl font-light mb-4 text-shadow-lg tracking-tight",
          subtitle: "text-lg sm:text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto font-light",
          button: "bg-[#263238] hover:bg-[#1a252a] text-white rounded-none shadow-lg transform transition-all duration-300 hover:scale-105 border-b-2 border-[#90A4AE]",
          hybridTag: "mb-4 inline-block bg-[#546E7A] px-4 py-1 rounded-none text-sm font-medium",
          initialAnimation: { opacity: 0, y: 10 },
          contentAnimation: { opacity: 1, y: 0 },
          imageAnimation: { scale: 1.03, filter: "brightness(0.9)" },
          imageTransition: { duration: 7 },
        };
      case "weekend-adventurer":
        return {
          ...baseStyles,
          container: "adventure-pattern-bg",
          overlay: "absolute inset-0 bg-gradient-to-br from-black/50 to-black/30 z-10",
          title: "text-3xl sm:text-4xl md:text-6xl font-extrabold mb-4 text-shadow-lg tracking-wide",
          button: "bg-[#BF360C] hover:bg-[#a12e0a] text-white rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 font-bold",
          hybridTag: "mb-4 inline-block bg-[#FFD54F] px-4 py-1 rounded-lg text-sm font-medium text-black",
          initialAnimation: { opacity: 0, scale: 0.95, rotate: -1 },
          contentAnimation: { opacity: 1, scale: 1, rotate: 0 },
          imageAnimation: { scale: 1.07, filter: "saturate(1.1)" },
          imageTransition: { duration: 6.5 },
        };
      default:
        return baseStyles;
    }
  };

  const currentPersona = slides[currentSlide].persona;
  const styles = getPersonaStyles(currentPersona);

  return (
    <div 
      className={`relative h-[85vh] sm:h-[80vh] md:h-[70vh] overflow-hidden ${styles.container}`}
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
          <div className={styles.overlay} />
          
          <motion.img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
            initial={styles.imageAnimation}
            animate={{ scale: 1 }}
            transition={styles.imageTransition}
          />
          
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-6">
            <div className="max-w-4xl mx-auto">
              {slides[currentSlide].isHybrid && (
                <motion.div 
                  className={styles.hybridTag}
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
                className={styles.title}
                initial={styles.initialAnimation}
                animate={styles.contentAnimation}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              <motion.p 
                className={styles.subtitle}
                initial={styles.initialAnimation}
                animate={styles.contentAnimation}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {slides[currentSlide].subtitle}
              </motion.p>
              
              <motion.div
                initial={styles.initialAnimation}
                animate={styles.contentAnimation}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Button
                  asChild
                  size="lg"
                  className={styles.button}
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
            initial={styles.initialAnimation}
            animate={styles.contentAnimation}
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

          {/* Navigation arrows - hidden on mobile, visible on larger screens */}
          {!isMobile && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 z-30 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
          
          {/* Persona-specific decorative elements */}
          {currentPersona === "tech-enthusiast" && (
            <div className="absolute inset-0 z-5 opacity-20 pointer-events-none">
              <div className="grid-tech-overlay"></div>
            </div>
          )}
          
          {currentPersona === "eco-warrior" && (
            <motion.div 
              className="absolute bottom-0 left-0 right-0 z-5 h-40 opacity-20 pointer-events-none overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: "10rem" }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <div className="eco-wave-pattern"></div>
            </motion.div>
          )}
          
          {currentPersona === "family-first" && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <div className="w-[60vmax] h-[60vmax] rounded-full border-[15px] border-white/20 border-dashed"></div>
            </motion.div>
          )}
          
          {currentPersona === "weekend-adventurer" && (
            <div className="absolute inset-0 z-5 opacity-30 pointer-events-none">
              <div className="adventure-terrain-pattern"></div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroCarousel;
