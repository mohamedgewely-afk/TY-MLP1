
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { heroSlides as defaultSlides } from "@/data/vehicles";

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
            {/* Enhanced gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content positioned at bottom */}
      <div className="relative z-10 h-full flex items-end pb-32 md:pb-24">
        <div className="toyota-container w-full">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 50, x: -30 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, y: -30, x: 30 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-4 md:space-y-6 text-white"
              >
                {/* Badge */}
                {slides[currentSlide].badge && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block"
                  >
                    <span className="bg-toyota-red/90 backdrop-blur-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold border border-white/20">
                      {slides[currentSlide].badge}
                    </span>
                  </motion.div>
                )}

                {/* Title */}
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight"
                >
                  {slides[currentSlide].title}
                </motion.h1>

                {/* Subtitle */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg md:text-2xl lg:text-3xl font-light text-white/90 leading-relaxed"
                >
                  {slides[currentSlide].subtitle}
                </motion.h2>

                {/* Description */}
                {slides[currentSlide].description && (
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-sm md:text-lg text-white/80 max-w-2xl leading-relaxed"
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                )}

                {/* CTA Button */}
                {(slides[currentSlide].cta || slides[currentSlide].ctaText) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="pt-2 md:pt-4"
                  >
                    <Button
                      size="lg"
                      onClick={() => navigate(slides[currentSlide].link || slides[currentSlide].ctaLink || "/")}
                      className="bg-white text-toyota-red hover:bg-gray-100 px-6 py-3 md:px-8 md:py-4 text-sm md:text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
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

      {/* Navigation Controls - Responsive positioning */}
      <div className="absolute bottom-8 md:bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Dots Indicator */}
          <div className="flex space-x-2 md:space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Toggle */}
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-1.5 md:p-2 rounded-full hover:bg-white/30 transition-all duration-300"
            aria-label={isAutoPlay ? "Pause slideshow" : "Play slideshow"}
          >
            {isAutoPlay ? <Pause className="h-3 w-3 md:h-4 md:w-4" /> : <Play className="h-3 w-3 md:h-4 md:w-4" />}
          </button>
        </div>
      </div>

      {/* Arrow Navigation - Responsive */}
      <button
        onClick={prevSlide}
        className="absolute left-3 md:left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm border border-white/30 text-white p-2 md:p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-3 md:right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm border border-white/30 text-white p-2 md:p-3 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
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
