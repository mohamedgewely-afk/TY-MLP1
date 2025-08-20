
import { useState, useCallback, useRef } from 'react';

interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface UseTouchGesturesOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  threshold?: number;
  velocity?: number;
}

export const useTouchGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinch,
  threshold = 50,
  velocity = 0.3
}: UseTouchGesturesOptions) => {
  const [touchStart, setTouchStart] = useState<TouchPoint | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchPoint | null>(null);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const isSwipingRef = useRef(false);

  const getTouchDistance = (touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    });
    
    if (e.touches.length === 2 && onPinch) {
      const distance = getTouchDistance(e.touches[0], e.touches[1]);
      setInitialDistance(distance);
    }
    
    isSwipingRef.current = false;
  }, [onPinch]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;

    const touch = e.touches[0];
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    });

    if (e.touches.length === 2 && onPinch && initialDistance) {
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistance;
      onPinch(scale);
    }

    // Prevent default scrolling during swipe
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
      isSwipingRef.current = true;
    }
  }, [touchStart, onPinch, initialDistance]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    const deltaTime = touchEnd.timestamp - touchStart.timestamp;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const calculatedVelocity = distance / deltaTime;

    if (distance < threshold || calculatedVelocity < velocity) return;

    const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

    if (isHorizontal) {
      if (deltaX > 0 && onSwipeLeft) {
        onSwipeLeft();
      } else if (deltaX < 0 && onSwipeRight) {
        onSwipeRight();
      }
    } else {
      if (deltaY > 0 && onSwipeUp) {
        onSwipeUp();
      } else if (deltaY < 0 && onSwipeDown) {
        onSwipeDown();
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
    setInitialDistance(null);
    isSwipingRef.current = false;
  }, [touchStart, touchEnd, threshold, velocity, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isSwipingRef
  };
};
