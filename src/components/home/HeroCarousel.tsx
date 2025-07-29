import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image: string;
  cta?: string;
  ctaText?: string;
  link?: string;
  ctaLink?: string;
  badge?: string;
  isHybrid?: boolean;
}

interface HeroCarouselProps {
  slides?: HeroSlide[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ slides: propSlides }) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const isMobile = useIsMobile();

  // Default slides with consistent properties
  const defaultSlides: HeroSlide[] = [
    {
      id: "1",
      title: "New Camry Hybrid",
      subtitle: "The Future of Driving",
      description: "Experience the perfect blend of performance, efficiency, and luxury with our latest hybrid technology.",
      image: "https://images.unsplash.com/photo-1494976688531-c21fd785c8d0?auto=format&fit=crop&w=1920&q=80",
      cta: "Explore Camry",
      ctaText: "Explore Camry",
      link: "/vehicle/camry-hybrid",
      ctaLink: "/vehicle/camry-hybrid",
      badge: "New 2024"
    },
    {
      id: "2",
      title: "RAV4 Adventure",
      subtitle: "Built for Every Journey",
      description: "Conquer any terrain with confidence. The RAV4 combines rugged capability with refined comfort.",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/f5b0eec7-2576-4e8a-9aa7-2589d2c985ef/items/500204ce-384d-4ae5-8585-3111b7d7dd16/renditions/51797f22-123a-413b-8817-57b1f0ce0788?binary=true&mformat=true",
      cta: "Discover RAV4",
      ctaText: "Discover RAV4",
      link: "/vehicle/rav4-hybrid",
      ctaLink: "/vehicle/rav4-hybrid",
      badge: "Best Seller"
    },
    {
      id: "3",
      title: "Prius Prime",
      subtitle: "Electrify Your Drive",
      description: "Revolutionary plug-in hybrid technology that redefines what's possible in eco-friendly transportation.",
      image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1920&q=80",
      cta: "Go Electric",
      ctaText: "Go Electric",
      link: "/vehicle/prius-prime",
      ctaLink: "/vehicle/prius-prime",
      badge: "Eco Choice"
    },
    {
      id: "4",
      title: "Land Cruiser",
      subtitle: "Legendary Performance",
      description: "Unmatched capability and reliability for those who demand the very best in off-road excellence.",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1920&q=80",
      cta: "Experience Legend",
      ctaText: "Experience Legend",
      link: "/vehicle/land-cruiser",
      ctaLink: "/vehicle/land-cruiser",
      badge: "Icon"
    }
  ];

  const slides = propSlides || defaultSlides;

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Background Images */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center center' }}
            />
            {/* Enhanced gradient overlay - lighter for mobile to show more of the image */}
            <div className={`absolute inset-0 ${
              isMobile 
                ? 'bg-gradient-to-r from-black/80 via-black/40 to-transparent' // Side gradient for mobile
                : 'bg-gradient-to-t from-black/80 via-black/30 to-black/40'
            }`} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Mobile-First Content Layout */}
      <div className={`relative z-10 h-full flex items-end ${
        isMobile ? 'pb-24' : 'pb-32 md:pb-24'
      }`}>
        <div className="toyota-container w-full">
          <div className={`${
            isMobile 
              ? 'max-w-xs' // Much smaller width for mobile
              : 'max-w-4xl'
          }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50, x: isMobile ? -20 : -30 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -30, x: isMobile ? 20 : 30 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`space-y-3 md:space-y-6 text-white ${
                  isMobile ? 'space-y-2' : ''
                }`}
              >
                {/* Badge */}
                {slides[currentSlide].badge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block"
                  >
                    <span className={`bg-toyota-red/90 backdrop-blur-sm text-white rounded-full font-semibold border border-white/20 ${
                      isMobile 
                        ? 'px-2.5 py-1 text-xs' // Much smaller badge
                        : 'px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm'
                    }`}>
                      {slides[currentSlide].badge}
                    </span>
                  </motion.div>
                )}

                {/* Title - Significantly smaller on mobile */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`font-black leading-tight ${
                    isMobile 
                      ? 'text-2xl' // Much smaller title 
                      : 'text-3xl md:text-5xl lg:text-6xl xl:text-7xl'
                  }`}
                >
                  {slides[currentSlide].title}
                </motion.h1>

                {/* Subtitle - Smaller on mobile */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`font-light text-white/90 leading-relaxed ${
                    isMobile 
                      ? 'text-sm' // Much smaller subtitle
                      : 'text-lg md:text-2xl lg:text-3xl'
                  }`}
                >
                  {slides[currentSlide].subtitle}
                </motion.h2>

                {/* Description - Compact on mobile */}
                {slides[currentSlide].description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className={`text-white/80 leading-relaxed ${
                      isMobile 
                        ? 'text-xs max-w-xs' // Very small and constrained
                        : 'text-sm md:text-lg max-w-2xl'
                    }`}
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                )}

                {/* CTA Button - Compact on mobile */}
                {(slides[currentSlide].cta || slides[currentSlide].ctaText) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className={isMobile ? 'pt-2' : 'pt-2 md:pt-4'}
                  >
                    <Button
                      size={isMobile ? "sm" : "lg"}
                      onClick={() => navigate(slides[currentSlide].link || slides[currentSlide].ctaLink || "/")}
                      className={`bg-white text-toyota-red hover:bg-gray-100 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 ${
                        isMobile 
                          ? 'px-4 py-2 text-xs font-semibold' // Much smaller button
                          : 'px-6 py-3 md:px-8 md:py-4 text-sm md:text-lg font-semibold'
                      }`}
                    >
                      {slides[currentSlide].cta || slides[currentSlide].ctaText}
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation Controls - Enhanced mobile positioning */}
      <div className={`absolute z-20 ${
        isMobile 
          ? 'bottom-20 left-1/2 transform -translate-x-1/2' // Higher up on mobile to avoid sticky nav
          : 'bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2'
      }`}>
        <div className={`flex items-center ${isMobile ? 'space-x-3' : 'space-x-4 md:space-x-6'}`}>
          {/* Dots Indicator */}
          <div className={`flex ${isMobile ? 'space-x-1.5' : 'space-x-2 md:space-x-3'}`}>
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/40 hover:bg-white/60"
                } ${
                  isMobile ? 'w-1.5 h-1.5' : 'w-2 h-2 md:w-3 md:h-3'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full hover:bg-white/30 transition-all duration-300 ${
              isMobile ? 'p-1' : 'p-1.5 md:p-2'
            }`}
            aria-label={isAutoPlay ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlay ? (
              <Pause className={isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3 md:h-4 md:w-4'} />
            ) : (
              <Play className={isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3 md:h-4 md:w-4'} />
            )}
          </button>
        </div>
      </div>

      {/* Arrow Navigation - Smaller on mobile */}
      <button
        onClick={prevSlide}
        className={`absolute top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 ${
          isMobile ? 'left-2 p-1.5' : 'left-3 md:left-6 p-2 md:p-3'
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className={isMobile ? 'h-3 w-3' : 'h-4 w-4 md:h-6 md:w-6'} />
      </button>

      <button
        onClick={nextSlide}
        className={`absolute top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 ${
          isMobile ? 'right-2 p-1.5' : 'right-3 md:right-6 p-2 md:p-3'
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className={isMobile ? 'h-3 w-3' : 'h-4 w-4 md:h-6 md:w-6'} />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div
          className="h-full bg-toyota-red"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear", repeat: Infinity }}
          key={currentSlide}
        />
      </div>
    </section>
  );
};

export default HeroCarousel;
