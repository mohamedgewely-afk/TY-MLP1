
import React, { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";
import { contextualHaptic } from "@/utils/haptic";
import MobileGradeCard from "./MobileGradeCard";

interface Grade {
  name: string;
  description: string;
  price: number;
  monthlyFrom: number;
  badge: string;
  badgeColor: string;
  image: string;
  features: string[];
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
    fuelEconomy: string;
  };
}

interface SwipeableGradeCarouselProps {
  grades: Grade[];
  selectedGrade: number;
  onGradeChange: (index: number) => void;
  onGradeSelect: () => void;
  onTestDrive: () => void;
  onConfigure: () => void;
}

const SwipeableGradeCarousel: React.FC<SwipeableGradeCarouselProps> = ({
  grades,
  selectedGrade,
  onGradeChange,
  onGradeSelect,
  onTestDrive,
  onConfigure
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  // Hide swipe hint after first interaction or 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const nextGrade = useCallback(() => {
    if (isAnimating || selectedGrade >= grades.length - 1) return;
    
    setIsAnimating(true);
    contextualHaptic.swipeNavigation();
    onGradeChange((selectedGrade + 1) % grades.length);
    setShowSwipeHint(false);
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [selectedGrade, grades.length, onGradeChange, isAnimating]);

  const prevGrade = useCallback(() => {
    if (isAnimating || selectedGrade <= 0) return;
    
    setIsAnimating(true);
    contextualHaptic.swipeNavigation();
    onGradeChange((selectedGrade - 1 + grades.length) % grades.length);
    setShowSwipeHint(false);
    
    setTimeout(() => setIsAnimating(false), 300);
  }, [selectedGrade, grades.length, onGradeChange, isAnimating]);

  const swipeableRef = useSwipeable({
    onSwipeLeft: prevGrade,
    onSwipeRight: nextGrade,
    threshold: 50,
    preventDefaultTouchmoveEvent: true,
    debug: false
  });

  const currentGrade = grades[selectedGrade];
  const canGoPrev = selectedGrade > 0;
  const canGoNext = selectedGrade < grades.length - 1;

  return (
    <div className="relative w-full">
      {/* Swipe Hint Overlay */}
      {showSwipeHint && (
        <div className="absolute top-4 right-4 z-20 bg-primary/90 text-primary-foreground px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm transition-all duration-300">
          <Info className="h-3 w-3" />
          Swipe to explore grades
        </div>
      )}

      {/* Main Carousel Container */}
      <div
        ref={swipeableRef}
        className="relative overflow-hidden touch-pan-y"
        style={{ minHeight: '320px' }}
      >
        <div className="w-full transition-transform duration-300 ease-out">
          <MobileGradeCard
            grade={currentGrade}
            isActive={true}
            onSelect={onGradeSelect}
            onTestDrive={onTestDrive}
            onConfigure={onConfigure}
          />
        </div>
      </div>

      {/* Enhanced Navigation Controls */}
      <div className="flex justify-between items-center mt-6 px-4">
        {/* Previous Button */}
        <div className="transition-transform duration-200 hover:scale-110">
          <Button
            onClick={prevGrade}
            disabled={!canGoPrev}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${
              canGoPrev 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>

        {/* Enhanced Progress Dots */}
        <div className="flex gap-3 items-center">
          {grades.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx !== selectedGrade && !isAnimating) {
                  onGradeChange(idx);
                  contextualHaptic.selectionChange();
                  setShowSwipeHint(false);
                }
              }}
              className={`transition-all duration-300 rounded-full hover:scale-120 ${
                idx === selectedGrade 
                  ? 'bg-primary w-10 h-4' 
                  : 'bg-muted-foreground/30 w-4 h-4 hover:bg-muted-foreground/50'
              }`}
              disabled={isAnimating}
            />
          ))}
        </div>

        {/* Next Button */}
        <div className="transition-transform duration-200 hover:scale-110">
          <Button
            onClick={nextGrade}
            disabled={!canGoNext}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${
              canGoNext 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Grade Counter */}
      <div className="text-center mt-4 text-sm text-muted-foreground transition-opacity duration-200">
        Grade {selectedGrade + 1} of {grades.length}
      </div>
    </div>
  );
};

export default SwipeableGradeCarousel;
