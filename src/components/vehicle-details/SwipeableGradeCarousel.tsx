
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";
import { contextualHaptic } from "@/utils/haptic";
import { springConfigs, enhancedVariants } from "@/utils/animation-configs";
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
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

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

  // Swipe handlers with enhanced gesture detection
  const swipeableRef = useSwipeable({
    onSwipeLeft: nextGrade,
    onSwipeRight: prevGrade,
    threshold: 50,
    preventDefaultTouchmoveEvent: true,
    debug: false
  });

  const currentGrade = grades[selectedGrade];
  const canGoPrev = selectedGrade > 0;
  const canGoNext = selectedGrade < grades.length - 1;

  // Enhanced slide animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : -15,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: springConfigs.luxurious
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 15 : -15,
      transition: springConfigs.cinematic
    })
  };

  return (
    <div className="relative w-full">
      {/* Swipe Hint Overlay */}
      <AnimatePresence>
        {showSwipeHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-20 bg-primary/90 text-primary-foreground px-3 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm"
          >
            <Info className="h-3 w-3" />
            Swipe to explore grades
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Carousel Container */}
      <div
        ref={swipeableRef}
        className="relative overflow-hidden touch-pan-y"
        style={{ minHeight: '400px' }}
      >
        <AnimatePresence mode="wait" custom={dragDirection === 'right' ? 1 : -1}>
          <motion.div
            key={selectedGrade}
            custom={dragDirection === 'right' ? 1 : -1}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
            onAnimationStart={() => setIsAnimating(true)}
            onAnimationComplete={() => {
              setIsAnimating(false);
              setDragDirection(null);
            }}
          >
            <MobileGradeCard
              grade={currentGrade}
              isActive={true}
              onSelect={onGradeSelect}
              onTestDrive={onTestDrive}
              onConfigure={onConfigure}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Enhanced Navigation Controls */}
      <div className="flex justify-between items-center mt-6 px-4">
        {/* Previous Button */}
        <motion.div
          whileHover={{ scale: canGoPrev ? 1.1 : 1 }}
          whileTap={{ scale: canGoPrev ? 0.95 : 1 }}
        >
          <Button
            onClick={() => {
              setDragDirection('left');
              prevGrade();
            }}
            disabled={!canGoPrev}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${
              canGoPrev 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </motion.div>

        {/* Enhanced Progress Dots */}
        <div className="flex gap-3 items-center">
          {grades.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                if (idx !== selectedGrade && !isAnimating) {
                  setDragDirection(idx > selectedGrade ? 'right' : 'left');
                  onGradeChange(idx);
                  contextualHaptic.selectionChange();
                  setShowSwipeHint(false);
                }
              }}
              className={`transition-all duration-300 rounded-full ${
                idx === selectedGrade 
                  ? 'bg-primary w-10 h-4' 
                  : 'bg-muted-foreground/30 w-4 h-4 hover:bg-muted-foreground/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              disabled={isAnimating}
            />
          ))}
        </div>

        {/* Next Button */}
        <motion.div
          whileHover={{ scale: canGoNext ? 1.1 : 1 }}
          whileTap={{ scale: canGoNext ? 0.95 : 1 }}
        >
          <Button
            onClick={() => {
              setDragDirection('right');
              nextGrade();
            }}
            disabled={!canGoNext}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-200 ${
              canGoNext 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                : 'bg-muted/50 text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </motion.div>
      </div>

      {/* Grade Counter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mt-4 text-sm text-muted-foreground"
      >
        Grade {selectedGrade + 1} of {grades.length}
      </motion.div>
    </div>
  );
};

export default SwipeableGradeCarousel;
