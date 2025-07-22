
import { useRef, useEffect } from 'react';

interface SwipeableOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
  debug?: boolean;
}

export const useSwipeable = <T extends HTMLElement = HTMLDivElement>(options: SwipeableOptions) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 30, // Reduced from 50 for better sensitivity
    preventDefaultTouchmoveEvent = false,
    debug = false
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const elementRef = useRef<T>(null);
  const swipeInProgressRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (debug) console.log('🔄 Touch start:', e.touches[0]);
      
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
      swipeInProgressRef.current = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault();
      }

      const currentTouch = e.touches[0];
      const deltaX = currentTouch.clientX - touchStartRef.current.x;
      const deltaY = currentTouch.clientY - touchStartRef.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (debug) {
        console.log('🔄 Touch move:', { deltaX, deltaY, absDeltaX, absDeltaY });
      }

      // Determine swipe direction early and prevent scrolling if needed
      if (absDeltaX > absDeltaY && absDeltaX > threshold / 2) {
        // Horizontal swipe detected, prevent vertical scrolling
        e.preventDefault();
        swipeInProgressRef.current = true;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now()
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);
      const timeDiff = touchEnd.time - touchStartRef.current.time;

      if (debug) {
        console.log('🔄 Touch end:', { 
          deltaX, 
          deltaY, 
          absDeltaX, 
          absDeltaY, 
          timeDiff,
          threshold,
          swipeInProgress: swipeInProgressRef.current
        });
      }

      // Ignore very quick taps (less than 100ms) and very slow gestures (more than 1000ms)
      if (timeDiff < 100 || timeDiff > 1000) {
        if (debug) console.log('❌ Swipe ignored due to timing');
        touchStartRef.current = null;
        swipeInProgressRef.current = false;
        return;
      }

      // Determine if it's a horizontal or vertical swipe
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (absDeltaX > threshold) {
          if (deltaX > 0) {
            if (debug) console.log('➡️ Swipe right detected');
            onSwipeRight?.();
          } else {
            if (debug) console.log('⬅️ Swipe left detected');
            onSwipeLeft?.();
          }
        } else if (debug) {
          console.log('❌ Horizontal swipe below threshold');
        }
      } else {
        // Vertical swipe
        if (absDeltaY > threshold) {
          if (deltaY > 0) {
            if (debug) console.log('⬇️ Swipe down detected');
            onSwipeDown?.();
          } else {
            if (debug) console.log('⬆️ Swipe up detected');
            onSwipeUp?.();
          }
        } else if (debug) {
          console.log('❌ Vertical swipe below threshold');
        }
      }

      touchStartRef.current = null;
      swipeInProgressRef.current = false;
    };

    // Use passive: false for touchmove to allow preventDefault
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventDefaultTouchmoveEvent, debug]);

  return elementRef;
};
