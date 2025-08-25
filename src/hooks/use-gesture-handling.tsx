
import { useRef, useCallback } from 'react';
import { contextualHaptic } from '@/utils/haptic';

interface SwipeCallbacks {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface UseGestureHandlingOptions extends SwipeCallbacks {
  threshold?: number;
  enableHaptic?: boolean;
  preventScroll?: boolean;
}

export const useGestureHandling = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  enableHaptic = true,
  preventScroll = false
}: UseGestureHandlingOptions = {}) => {
  const startPos = useRef<{ x: number; y: number; time: number } | null>(null);
  const swipeInProgress = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;

    startPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    swipeInProgress.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!startPos.current) return;

    const touch = e.touches[0];
    if (!touch) return;

    const deltaX = Math.abs(touch.clientX - startPos.current.x);
    const deltaY = Math.abs(touch.clientY - startPos.current.y);

    // Determine if this is a horizontal swipe
    if (deltaX > threshold && deltaX > deltaY * 1.5) {
      swipeInProgress.current = true;
      if (preventScroll) {
        e.preventDefault();
      }
    }
  }, [threshold, preventScroll]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!startPos.current) return;

    const touch = e.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - startPos.current.x;
    const deltaY = touch.clientY - startPos.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);
    const timeDiff = Date.now() - startPos.current.time;

    // Ignore very quick taps or very slow gestures
    if (timeDiff < 100 || timeDiff > 1000) {
      startPos.current = null;
      swipeInProgress.current = false;
      return;
    }

    // Determine swipe direction and trigger callbacks
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      // Horizontal swipe
      if (enableHaptic) {
        contextualHaptic.swipeNavigation();
      }
      
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      // Vertical swipe
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    startPos.current = null;
    swipeInProgress.current = false;
  }, [threshold, enableHaptic, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    },
    swipeInProgress: swipeInProgress.current
  };
};
