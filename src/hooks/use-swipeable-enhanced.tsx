
import { useRef, useEffect, useCallback } from 'react';

interface SwipeableEnhancedOptions {
  // Main navigation (horizontal)
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  // Sub-content navigation (vertical)
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  // Configuration
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
  debug?: boolean;
  // Context-aware settings
  enableVerticalSwipe?: boolean;
  enableHorizontalSwipe?: boolean;
  swipeContext?: string; // For debugging and context-specific behavior
}

export const useSwipeableEnhanced = <T extends HTMLElement = HTMLDivElement>(options: SwipeableEnhancedOptions) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 30,
    preventDefaultTouchmoveEvent = false,
    debug = false,
    enableVerticalSwipe = true,
    enableHorizontalSwipe = true,
    swipeContext = 'default'
  } = options;

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const elementRef = useRef<T>(null);
  const swipeInProgressRef = useRef(false);
  const swipeDirectionRef = useRef<'horizontal' | 'vertical' | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (debug) console.log(`🔄 [${swipeContext}] Touch start:`, e.touches[0]);
    
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
    swipeInProgressRef.current = false;
    swipeDirectionRef.current = null;
  }, [debug, swipeContext]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const currentTouch = e.touches[0];
    const deltaX = currentTouch.clientX - touchStartRef.current.x;
    const deltaY = currentTouch.clientY - touchStartRef.current.y;
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    if (debug) {
      console.log(`🔄 [${swipeContext}] Touch move:`, { deltaX, deltaY, absDeltaX, absDeltaY });
    }

    // Determine swipe direction once threshold is exceeded
    if (!swipeInProgressRef.current && (absDeltaX > threshold || absDeltaY > threshold)) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe detected
        if (enableHorizontalSwipe) {
          swipeDirectionRef.current = 'horizontal';
          swipeInProgressRef.current = true;
          if (debug) console.log(`➡️ [${swipeContext}] Horizontal swipe detected`);
        }
      } else {
        // Vertical swipe detected
        if (enableVerticalSwipe) {
          swipeDirectionRef.current = 'vertical';
          swipeInProgressRef.current = true;
          if (debug) console.log(`⬆️ [${swipeContext}] Vertical swipe detected`);
        }
      }
    }

    // Prevent default based on swipe direction and settings
    if (swipeInProgressRef.current) {
      if (swipeDirectionRef.current === 'horizontal' || preventDefaultTouchmoveEvent) {
        e.preventDefault();
      }
    }
  }, [threshold, enableHorizontalSwipe, enableVerticalSwipe, preventDefaultTouchmoveEvent, debug, swipeContext]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
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
      console.log(`🔄 [${swipeContext}] Touch end:`, { 
        deltaX, deltaY, absDeltaX, absDeltaY, timeDiff,
        direction: swipeDirectionRef.current,
        swipeInProgress: swipeInProgressRef.current
      });
    }

    // Ignore very quick taps and very slow gestures
    if (timeDiff < 100 || timeDiff > 1000) {
      if (debug) console.log(`❌ [${swipeContext}] Swipe ignored due to timing`);
      touchStartRef.current = null;
      swipeInProgressRef.current = false;
      swipeDirectionRef.current = null;
      return;
    }

    // Process swipe based on detected direction
    if (swipeInProgressRef.current && swipeDirectionRef.current) {
      if (swipeDirectionRef.current === 'horizontal' && enableHorizontalSwipe) {
        if (absDeltaX > threshold) {
          if (deltaX > 0) {
            if (debug) console.log(`➡️ [${swipeContext}] Swipe right executed`);
            onSwipeRight?.();
          } else {
            if (debug) console.log(`⬅️ [${swipeContext}] Swipe left executed`);
            onSwipeLeft?.();
          }
        }
      } else if (swipeDirectionRef.current === 'vertical' && enableVerticalSwipe) {
        if (absDeltaY > threshold) {
          if (deltaY > 0) {
            if (debug) console.log(`⬇️ [${swipeContext}] Swipe down executed`);
            onSwipeDown?.();
          } else {
            if (debug) console.log(`⬆️ [${swipeContext}] Swipe up executed`);
            onSwipeUp?.();
          }
        }
      }
    }

    touchStartRef.current = null;
    swipeInProgressRef.current = false;
    swipeDirectionRef.current = null;
  }, [threshold, enableHorizontalSwipe, enableVerticalSwipe, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, debug, swipeContext]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return elementRef;
};
