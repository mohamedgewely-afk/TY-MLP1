
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

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
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="absolute inset-0 bg-black/40 z-10" />
          
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white p-6">
            <div className="max-w-4xl mx-auto">
              {slide.isHybrid && (
                <div className="mb-4 inline-block bg-toyota-red px-4 py-1 rounded-full text-sm font-medium animate-pulse-soft">
                  Hybrid Technology
                </div>
              )}
              
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">
                {slide.title}
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 text-shadow max-w-2xl mx-auto">
                {slide.subtitle}
              </p>
              
              <Button
                asChild
                size="lg"
                className="bg-toyota-red hover:bg-toyota-darkred text-white rounded-full shadow-lg"
              >
                <Link to={slide.ctaLink} className="flex items-center gap-2">
                  {slide.ctaText}
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center space-x-2">
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
      </div>
    </div>
  );
};

export default HeroCarousel;
