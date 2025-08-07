
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Zap, Shield, Crown, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";

interface GradeCarouselStepProps {
  config: { grade: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const grades = [
  { 
    name: "Base", 
    description: "Essential features for everyday driving",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    price: "From AED 89,000",
    monthlyEMI: "1,850",
    features: ["Manual A/C", "6 Speakers", "Basic Interior"],
    icon: Shield,
    badge: "Value",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
  },
  { 
    name: "SE", 
    description: "Sport edition with enhanced performance",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
    price: "From AED 95,000",
    monthlyEMI: "1,980",
    features: ["Sport Seats", "8-inch Display", "Rear Camera"],
    icon: Zap,
    badge: "Sport",
    badgeColor: "bg-red-50 text-red-700 border-red-200"
  },
  { 
    name: "XLE", 
    description: "Premium comfort and convenience",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
    price: "From AED 110,000",
    monthlyEMI: "2,290",
    features: ["Leather Trim", "Premium Audio", "Auto Climate"],
    icon: Star,
    badge: "Most Popular",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200"
  },
  { 
    name: "Limited", 
    description: "Luxury features and premium materials",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    price: "From AED 125,000",
    monthlyEMI: "2,600",
    features: ["Premium Leather", "9-inch Touch", "Heated Seats"],
    icon: Crown,
    badge: "Luxury",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
  }
];

const GradeCarouselStep: React.FC<GradeCarouselStepProps> = ({ config, setConfig }) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const selectedIndex = grades.findIndex(grade => grade.name === config.grade);
    return selectedIndex >= 0 ? selectedIndex : 0;
  });

  const carouselRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => nextSlide(),
    onSwipeRight: () => prevSlide(),
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  const nextSlide = () => {
    const newIndex = (currentIndex + 1) % grades.length;
    setCurrentIndex(newIndex);
    setConfig(prev => ({ ...prev, grade: grades[newIndex].name }));
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? grades.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setConfig(prev => ({ ...prev, grade: grades[newIndex].name }));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setConfig(prev => ({ ...prev, grade: grades[index].name }));
  };

  const currentGrade = grades[currentIndex];
  const IconComponent = currentGrade.icon;

  return (
    <div className="p-4 space-y-4 h-full flex flex-col">
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-xl font-bold text-foreground mb-2">
          Select Your Grade
        </h2>
        <p className="text-muted-foreground text-sm">
          Swipe left or right to explore grades
        </p>
      </motion.div>

      {/* Carousel Container */}
      <div className="flex-1 relative" ref={carouselRef}>
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-background transition-all duration-200 shadow-lg"
          aria-label="Previous grade"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-background transition-all duration-200 shadow-lg"
          aria-label="Next grade"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>

        {/* Grade Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary shadow-primary/20 rounded-2xl p-6 mx-8 relative overflow-hidden"
          >
            {/* Selection indicator */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                <Check className="h-4 w-4" />
              </div>
            </div>
            
            {/* Grade Image */}
            <div className="text-center mb-4">
              <div className="w-20 h-20 mx-auto rounded-xl overflow-hidden border-2 border-primary/20 bg-muted/50 mb-4">
                <img
                  src={currentGrade.image}
                  alt={currentGrade.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Grade Content */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <IconComponent className="h-5 w-5 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">{currentGrade.name}</h3>
              </div>
              
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border mb-4 ${currentGrade.badgeColor}`}>
                {currentGrade.badge}
              </div>
              
              <p className="text-muted-foreground text-base mb-6">{currentGrade.description}</p>
              
              {/* Features */}
              <div className="grid grid-cols-1 gap-2 mb-6">
                {currentGrade.features.map((feature, idx) => (
                  <span 
                    key={idx}
                    className="text-sm text-muted-foreground bg-background/70 px-3 py-2 rounded-lg border border-border/30"
                  >
                    • {feature}
                  </span>
                ))}
              </div>
              
              {/* Pricing */}
              <div className="bg-background/50 rounded-xl p-4 border border-border/30">
                <div className="text-xl font-bold text-foreground mb-1">{currentGrade.price}</div>
                <div className="text-sm text-muted-foreground">AED {currentGrade.monthlyEMI}/month</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {grades.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to grade ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeCarouselStep;
