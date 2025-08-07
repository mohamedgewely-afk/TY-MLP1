
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Star, Zap, Shield, Crown, ChevronUp, ChevronDown } from "lucide-react";
import { useSwipeableEnhanced } from "@/hooks/use-swipeable-enhanced";
import SwipeIndicators from "../SwipeIndicators";
import { contextualHaptic } from "@/utils/haptic";

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleVerticalSwipe = (direction: 'up' | 'down') => {
    contextualHaptic.selectionChange();
    
    if (direction === 'up' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'down' && currentIndex < grades.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const swipeableRef = useSwipeableEnhanced({
    onSwipeUp: () => handleVerticalSwipe('up'),
    onSwipeDown: () => handleVerticalSwipe('down'),
    enableHorizontalSwipe: false,
    enableVerticalSwipe: true,
    swipeContext: 'GradeCarouselStep',
    debug: false,
    threshold: 40
  });

  const currentGrade = grades[currentIndex];
  const IconComponent = currentGrade.icon;
  const isSelected = config.grade === currentGrade.name;

  const handleGradeSelect = (gradeName: string) => {
    contextualHaptic.selectionChange();
    setConfig(prev => ({ ...prev, grade: gradeName }));
  };

  return (
    <div ref={swipeableRef} className="h-full flex flex-col relative">
      {/* Swipe hint */}
      <motion.div 
        className="text-center py-2 bg-muted/20 rounded-lg mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ChevronUp className="h-3 w-3" />
          <span>Swipe up/down to browse grades</span>
          <ChevronDown className="h-3 w-3" />
        </div>
      </motion.div>

      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-2">
          Select Your Grade
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose the perfect combination of features and luxury
        </p>
      </div>
      
      <div className="flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
            className="w-full max-w-md"
          >
            <div
              className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2 shadow-lg ${
                isSelected 
                  ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary shadow-primary/20 scale-[1.02]' 
                  : 'bg-card/95 backdrop-blur-sm border-border hover:border-primary/30 hover:shadow-xl hover:scale-[1.01]'
              }`}
              onClick={() => handleGradeSelect(currentGrade.name)}
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
              
              <div className="relative z-10 p-6">
                {/* Grade Image */}
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-16 rounded-xl overflow-hidden border-2 border-border/50 bg-muted/50 shadow-md">
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
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground">{currentGrade.name}</h3>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${currentGrade.badgeColor}`}>
                      {currentGrade.badge}
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4">{currentGrade.description}</p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {currentGrade.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="inline-block text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/30 mr-2 mb-1"
                      >
                        • {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* Pricing */}
                  <div className="text-center">
                    <div className="text-xl font-bold text-foreground">{currentGrade.price}</div>
                    <div className="text-sm text-muted-foreground">AED {currentGrade.monthlyEMI}/month</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center py-4">
        <SwipeIndicators
          total={grades.length}
          current={currentIndex}
          direction="vertical"
        />
      </div>
    </div>
  );
};

export default GradeCarouselStep;
