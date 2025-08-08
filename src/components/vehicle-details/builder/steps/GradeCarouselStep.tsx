
import React, { useState } from "react";
import { motion } from "framer-motion";
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

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % grades.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + grades.length) % grades.length);
  };

  const swipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    threshold: 50,
    preventDefaultTouchmoveEvent: true,
    debug: false
  });

  const selectCurrentGrade = () => {
    setConfig(prev => ({ ...prev, grade: grades[currentIndex].name }));
  };

  return (
    <div className="p-4 space-y-6">
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
          Swipe left/right to explore grades
        </p>
      </motion.div>
      
      {/* Swipeable Grade Carousel */}
      <div className="relative">
        <div ref={swipeRef} className="overflow-hidden rounded-2xl">
          <motion.div
            className="flex"
            animate={{ x: -currentIndex * 100 + "%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {grades.map((grade, index) => {
              const IconComponent = grade.icon;
              const isSelected = config.grade === grade.name;
              const isCurrent = index === currentIndex;
              
              return (
                <motion.div
                  key={grade.name}
                  className="w-full flex-shrink-0 px-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2 shadow-lg ${
                      isSelected 
                        ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary shadow-primary/20' 
                        : 'bg-card/95 backdrop-blur-sm border-border hover:border-primary/30 hover:shadow-xl'
                    }`}
                    onClick={selectCurrentGrade}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute top-4 right-4 z-20"
                      >
                        <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                          <Check className="h-4 w-4" />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Grade Image */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      <img
                        src={grade.image}
                        alt={grade.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium border ${grade.badgeColor}`}>
                        {grade.badge}
                      </div>
                    </div>
                    
                    {/* Grade Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <IconComponent className="h-5 w-5 text-primary" />
                        <h3 className="text-xl font-bold text-foreground">{grade.name}</h3>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-4">{grade.description}</p>
                      
                      {/* Features */}
                      <div className="grid grid-cols-1 gap-2 mb-4">
                        {grade.features.map((feature, idx) => (
                          <span 
                            key={idx}
                            className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg border border-border/30 flex items-center gap-2"
                          >
                            <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {feature}
                          </span>
                        ))}
                      </div>
                      
                      {/* Pricing */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground mb-1">{grade.price}</div>
                        <div className="text-sm text-muted-foreground">AED {grade.monthlyEMI}/month</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background border border-border rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background border border-border rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-105"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {grades.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeCarouselStep;
