
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSwipeable } from '@/hooks/use-swipeable';
import { hapticFeedback } from '@/utils/haptic';

interface SwipeableStepWrapperProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  className?: string;
}

const SwipeableStepWrapper: React.FC<SwipeableStepWrapperProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  className = ""
}) => {
  const swipeRef = useSwipeable({
    onSwipeLeft: () => {
      hapticFeedback.light();
      onSwipeLeft?.();
    },
    onSwipeRight: () => {
      hapticFeedback.light();
      onSwipeRight?.();
    },
    threshold: 50,
    preventDefaultTouchmoveEvent: false,
    debug: false
  });

  return (
    <motion.div
      ref={swipeRef}
      className={`touch-pan-y select-none ${className}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ 
        duration: 0.4, 
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      style={{
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)'
      }}
    >
      {children}
    </motion.div>
  );
};

export default SwipeableStepWrapper;
