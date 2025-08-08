
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Star, Zap, Shield, Crown } from "lucide-react";
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
    highlight: "Great Value"
  },
  { 
    name: "SE", 
    price: 2000, 
    features: ["Auto AC", "Power Windows", "Bluetooth", "Cruise Control"],
    icon: Star,
    description: "Enhanced comfort and convenience",
    highlight: "Most Popular",
    popular: true
  },
  { 
    name: "XLE", 
    price: 4000, 
    features: ["Dual Climate", "Heated Seats", "Premium Audio", "Keyless Entry"],
    icon: Zap,
    description: "Premium comfort and technology",
    highlight: "Best Features"
  },
  { 
    name: "Limited", 
    price: 6000, 
    features: ["Leather Seats", "Sunroof", "Navigation", "Advanced Safety"],
    icon: Crown,
    description: "Luxury features and premium materials",
    highlight: "Luxury"
  },
  { 
    name: "Platinum", 
    price: 10000, 
    features: ["Premium Leather", "Heated/Cooled Seats", "JBL Audio", "All Safety Features"],
    icon: Crown,
    description: "The ultimate in luxury and technology",
    highlight: "Ultimate"
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
    <div className="p-4 space-y-4 h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-4"
      >
        <h3 className="text-xl font-bold text-foreground mb-2">Choose Your Grade</h3>
        <p className="text-sm text-muted-foreground">Swipe to explore different trim levels</p>
        {!config.grade && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 font-medium mt-2 bg-red-50 rounded-lg p-2 border border-red-200"
          >
            ⚠️ Please select a grade to continue
          </motion.p>
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
                <div key={grade.name} className="w-full flex-shrink-0 px-3">
                  <motion.div
                    className={`relative rounded-2xl cursor-pointer transition-all duration-300 border-2 overflow-hidden ${
                      isSelected 
                        ? 'bg-primary/10 border-primary shadow-2xl ring-4 ring-primary/20 scale-[1.02]' 
                        : isCurrent
                          ? 'bg-card border-primary/50 hover:border-primary/70 hover:shadow-xl ring-2 ring-primary/10'
                          : 'bg-card border-border hover:border-primary/30 hover:shadow-lg'
                    }`}
                    onClick={() => selectGrade(grade.name, index)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="absolute top-4 right-4 z-10"
                      >
                        <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                          <Check className="h-5 w-5" />
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Popular badge */}
                    {grade.popular && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 left-4 z-10"
                      >
                        <div className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full font-bold shadow-lg">
                          {grade.highlight}
                        </div>
                      </motion.div>
                    )}

                    {/* Highlight badge for non-popular grades */}
                    {!grade.popular && (
                      <div className="absolute top-4 left-4 z-10">
                        <div className="px-3 py-1.5 bg-muted/90 text-muted-foreground text-xs rounded-full font-medium border border-border">
                          {grade.highlight}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-6 text-center">
                      {/* Grade Icon */}
                      <motion.div 
                        className="flex justify-center mb-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <div className={`p-4 rounded-full ${
                          isSelected ? 'bg-primary/20' : 'bg-muted/50'
                        }`}>
                          <IconComponent className={`h-8 w-8 ${
                            isSelected ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                        </div>
                      </motion.div>

                      {/* Grade Name and Price */}
                      <h4 className="text-2xl font-bold text-foreground mb-2">{grade.name}</h4>
                      <p className="text-lg font-semibold text-primary mb-3">
                        {grade.price > 0 ? `+AED ${grade.price.toLocaleString()}` : 'Base Price'}
                      </p>
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4">{grade.description}</p>
                      
                      {/* Key Features */}
                      <div className="space-y-2">
                        <h5 className="text-sm font-semibold text-foreground mb-2">Key Features:</h5>
                        <div className="grid grid-cols-2 gap-2">
                          {grade.features.slice(0, 4).map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: featureIndex * 0.1 }}
                              className="text-xs text-muted-foreground bg-muted/30 rounded-md px-2 py-1"
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
                          className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg"
                        >
                          <p className="text-sm font-medium text-primary">
                            👆 Tap to select this grade
                          </p>
                        </motion.div>
                      )}

                      {/* Selected confirmation */}
                      {isSelected && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <p className="text-sm font-medium text-green-700">
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
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background border border-border rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button
          onClick={nextGrade}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/90 hover:bg-background border border-border rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {grades.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGradeIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
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
