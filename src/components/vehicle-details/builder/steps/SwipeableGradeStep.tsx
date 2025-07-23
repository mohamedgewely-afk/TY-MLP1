import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Shield, Zap, Car, Crown } from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";
import { hapticFeedback } from "@/utils/haptic";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface SwipeableGradeStepProps {
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
}

const SwipeableGradeStep: React.FC<SwipeableGradeStepProps> = ({ config, setConfig }) => {
  const getGradeImage = (grade: string) => {
    const gradeImages = {
      "Base": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-base-grade.jpg",
      "SE": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-se-grade.jpg",
      "XLE": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-xle-grade.jpg",
      "Limited": "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/small-limited-grade.jpg"
    };
    return gradeImages[grade as keyof typeof gradeImages] || gradeImages["Base"];
  };

  const grades = [
    {
      name: "Base",
      price: 0,
      icon: <Car className="h-5 w-5" />,
      bgColor: "bg-slate-50",
      borderColor: "border-slate-200",
      textColor: "text-slate-700",
      features: ["17-inch Alloy Wheels", "Toyota Safety Sense", "8-inch Display"],
      description: "Essential features with Toyota quality"
    },
    {
      name: "SE",
      price: 2000,
      icon: <Zap className="h-5 w-5" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
      features: ["Sport Suspension", "Paddle Shifters", "Sport Seats"],
      description: "Enhanced performance and sportiness"
    },
    {
      name: "XLE",
      price: 4000,
      icon: <Star className="h-5 w-5" />,
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      textColor: "text-emerald-700",
      features: ["Leather Seats", "Moonroof", "Premium Audio"],
      description: "Comfort and luxury features"
    },
    {
      name: "Limited",
      price: 6000,
      icon: <Crown className="h-5 w-5" />,
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-700",
      features: ["Advanced Safety", "Premium Interior", "Navigation"],
      description: "Top-tier luxury and technology"
    }
  ];

  const [currentIndex, setCurrentIndex] = React.useState(() => {
    return grades.findIndex(g => g.name === config.grade) || 0;
  });

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (currentIndex < grades.length - 1) {
        hapticFeedback.selection();
        setCurrentIndex(currentIndex + 1);
        setConfig(prev => ({ ...prev, grade: grades[currentIndex + 1].name }));
      }
    },
    onSwipeRight: () => {
      if (currentIndex > 0) {
        hapticFeedback.selection();
        setCurrentIndex(currentIndex - 1);
        setConfig(prev => ({ ...prev, grade: grades[currentIndex - 1].name }));
      }
    },
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  const selectGrade = (index: number) => {
    hapticFeedback.light();
    setCurrentIndex(index);
    setConfig(prev => ({ ...prev, grade: grades[index].name }));
  };

  return (
    <div className="space-y-6 toyota-spacing-md" ref={swipeableRef}>
      <h3 className="text-xl font-semibold text-center text-foreground">
        Select Your Grade
      </h3>
      
      {/* Main Grade Card */}
      <div className="relative">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full"
        >
          <Card className={`border-2 border-toyota-red-subtle shadow-luxury`}>
            <CardContent className="toyota-spacing-lg">
              {/* Grade Image */}
              <div className="flex justify-center mb-6">
                <img 
                  src={getGradeImage(grades[currentIndex].name)}
                  alt={grades[currentIndex].name}
                  className="w-20 h-20 object-contain"
                />
              </div>

              <div className={`${grades[currentIndex].bgColor} toyota-spacing-md toyota-border-radius mb-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="toyota-spacing-sm toyota-border-radius bg-toyota-red-subtle text-white">
                      {grades[currentIndex].icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-lg">
                        {grades[currentIndex].name}
                      </h4>
                      {grades[currentIndex].price > 0 && (
                        <p className="text-sm text-muted-foreground">
                          +AED {grades[currentIndex].price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge className={`${grades[currentIndex].bgColor} ${grades[currentIndex].textColor} ${grades[currentIndex].borderColor}`}>
                    {grades[currentIndex].name}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4 text-center">
                {grades[currentIndex].description}
              </p>

              <div className="space-y-3">
                <p className="text-xs font-medium text-foreground">Key Features:</p>
                {grades[currentIndex].features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-2 h-2 toyota-border-radius bg-toyota-red-subtle"></div>
                    <span className="text-xs text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Grade Indicators */}
      <div className="flex justify-center space-x-2">
        {grades.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => selectGrade(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-toyota-red-subtle scale-125' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span>← Swipe to explore grades →</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeableGradeStep;