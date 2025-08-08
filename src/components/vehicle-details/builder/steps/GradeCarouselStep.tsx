
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Star, Zap, Shield, Crown, AlertTriangle } from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";

interface GradeCarouselStepProps {
  config: { grade: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const grades = [
  { 
    name: "Base", 
    price: 0, 
    features: ["Manual AC", "Fabric Seats", "Basic Audio", "Manual Windows"],
    icon: Shield,
    description: "Essential features for everyday driving",
    highlight: "Great Value",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true"
  },
  { 
    name: "SE", 
    price: 2000, 
    features: ["Auto AC", "Power Windows", "Bluetooth", "Cruise Control"],
    icon: Star,
    description: "Enhanced comfort and convenience",
    highlight: "Most Popular",
    popular: true,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true"
  },
  { 
    name: "XLE", 
    price: 4000, 
    features: ["Dual Climate", "Heated Seats", "Premium Audio", "Keyless Entry"],
    icon: Zap,
    description: "Premium comfort and technology",
    highlight: "Best Features",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true"
  },
  { 
    name: "Limited", 
    price: 6000, 
    features: ["Leather Seats", "Sunroof", "Navigation", "Advanced Safety"],
    icon: Crown,
    description: "Luxury features and premium materials",
    highlight: "Luxury",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true"
  },
  { 
    name: "Platinum", 
    price: 10000, 
    features: ["Premium Leather", "Heated/Cooled Seats", "JBL Audio", "All Safety Features"],
    icon: Crown,
    description: "The ultimate in luxury and technology",
    highlight: "Ultimate",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true"
  }
];

const GradeCarouselStep: React.FC<GradeCarouselStepProps> = ({ config, setConfig }) => {
  const [currentGradeIndex, setCurrentGradeIndex] = useState(() => {
    const selectedIndex = grades.findIndex(grade => grade.name === config.grade);
    return selectedIndex >= 0 ? selectedIndex : 0;
  });

  const nextGrade = () => {
    const newIndex = (currentGradeIndex + 1) % grades.length;
    setCurrentGradeIndex(newIndex);
  };

  const prevGrade = () => {
    const newIndex = (currentGradeIndex - 1 + grades.length) % grades.length;
    setCurrentGradeIndex(newIndex);
  };

  const selectGrade = (gradeName: string, index: number) => {
    setConfig(prev => ({ ...prev, grade: gradeName }));
    setCurrentGradeIndex(index);
  };

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: nextGrade,
    onSwipeRight: prevGrade,
    threshold: 50,
    preventDefaultTouchmoveEvent: true
  });

  return (
    <div className="p-2 pt-1 space-y-2 h-full">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-3"
      >
        <h3 className="text-sm font-semibold text-foreground mb-0.5">Choose Your Grade</h3>
<p className="text-[10px] text-muted-foreground leading-tight">Swipe to explore trim levels</p>
        {!config.grade && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-1 mt-1 text-[10px] text-red-500 font-medium bg-red-50 rounded-md p-1.5 border border-red-200"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Please select a grade to continue</span>
          </motion.div>
        )}
      </motion.div>

      <div className="relative">
        <div ref={swipeableRef} className="overflow-hidden rounded-2xl">
          <motion.div
            className="flex"
            animate={{ x: -currentGradeIndex * 100 + "%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {grades.map((grade, index) => {
              const isSelected = config.grade === grade.name;
              const isCurrent = index === currentGradeIndex;
              const IconComponent = grade.icon;
              
              return (
                <div key={grade.name} className="flex-shrink-0 px-2 w-full sm:w-[320px] md:w-[400px] lg:w-[480px]">
                  <motion.div
                    className={`relative rounded-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden ${
                      isSelected 
                        ? 'bg-primary/10 border-primary shadow-2xl ring-4 ring-primary/20 scale-[1.02]' 
                        : isCurrent
                          ? 'bg-card border-primary/50 hover:border-primary/70 hover:shadow-xl ring-2 ring-primary/10'
                          : 'bg-card border-border hover:border-primary/30 hover:shadow-lg'
                    }`}
                    onClick={() => selectGrade(grade.name, index)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute top-3 right-3 z-10"
                      >
                        <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                          <Check className="h-4 w-4" />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Popular badge */}
                    {grade.popular && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-3 left-3 z-10"
                      >
                        <div className="px-2 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full font-bold shadow-lg">
                          {grade.highlight}
                        </div>
                      </motion.div>
                    )}

                    {/* Highlight badge for non-popular grades */}
                    {!grade.popular && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className="px-2 py-1 bg-muted/90 text-muted-foreground text-xs rounded-full font-medium border border-border">
                          {grade.highlight}
                        </div>
                      </div>
                    )}
                    
                    {/* Grade Image */}
                    <div className="relative h-32 md:h-40 lg:h-52 overflow-hidden rounded-t-2xl">
                      <img
                        src={grade.image}
                        alt={grade.name}
                        className="w-full h-full object-cover object-center"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="p-2 text-center">
                      {/* Grade Icon */}
                      <motion.div 
                        className="flex justify-center mb-3"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <div className={`p-2 rounded-full ${
                          isSelected ? 'bg-primary/20' : 'bg-muted/50'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            isSelected ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                      </motion.div>

                      {/* Grade Name and Price */}
                      <h4 className="text-base font-semibold text-foreground mb-1">
  {grade.name}
</h4>
<p className="text-sm font-medium text-primary mb-1">
  {grade.price > 0 ? `+AED ${grade.price.toLocaleString()}` : 'Base Price'}
</p>
                      
                      {/* Description */}
                      <p className="text-xs text-muted-foreground mb-3">{grade.description}</p>
                      
                      {/* Key Features */}
                      <div className="space-y-1">
                        <h5 className="text-xs font-semibold text-foreground mb-2">Key Features:</h5>
                        <div className="grid grid-cols-2 gap-1">
                          {grade.features.slice(0, 4).map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: featureIndex * 0.1 }}
                              className="text-[10px] text-muted-foreground bg-muted/30 rounded px-1.5 py-0.5"
                            >
                              {feature}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Selection Call-to-Action */}
                      {isCurrent && !isSelected && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 p-1.5 text-[10px] bg-primary/5 border border-primary/20 rounded-lg"
                        >
                          <p className="text-xs font-medium text-primary">
                            👆 Tap to select this grade
                          </p>
                        </motion.div>
                      )}

                      {/* Selected confirmation */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-2 p-1.5 text-[10px] bg-green-50 border border-green-200 rounded-lg"
                        >
                          <p className="text-xs font-medium text-green-700">
                            ✅ Selected - Ready to continue
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevGrade}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background border border-border rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <button
          onClick={nextGrade}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background border border-border rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {grades.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGradeIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentGradeIndex ? 'bg-primary scale-125 shadow-lg' : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeCarouselStep;
