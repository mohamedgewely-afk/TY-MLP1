
import { useRef, useEffect, useCallback } from 'react';
import { contextualHaptic } from '@/utils/haptic';

interface GestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  hapticFeedback?: boolean;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useEnhancedGestures = (handlers: GestureHandlers) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<TouchPoint | null>(null);
  const lastTap = useRef<number>(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const initialDistance = useRef<number>(0);

  const getDistance = useCallback((touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const now = Date.now();
    
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now
    };

    // Handle multi-touch for pinch gestures
    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches[0], e.touches[1]);
    }

    // Long press detection
    if (handlers.onLongPress) {
      longPressTimer.current = setTimeout(() => {
        if (handlers.hapticFeedback) {
          contextualHaptic.stepProgress();
        }
        handlers.onLongPress?.();
      }, 500);
    }

    // Double tap detection
    if (handlers.onDoubleTap && now - lastTap.current < 300) {
      if (handlers.hapticFeedback) {
        contextualHaptic.selectionChange();
      }
      handlers.onDoubleTap();
      lastTap.current = 0;
    } else {
      lastTap.current = now;
    }
  }, [handlers, getDistance]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    // Handle pinch gestures
    if (e.touches.length === 2 && handlers.onPinch) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistance.current;
      handlers.onPinch(scale);
    }
  }, [handlers, getDistance]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (!touchStart.current || e.touches.length > 0) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = touch.clientY - touchStart.current.y;
    const deltaTime = Date.now() - touchStart.current.time;

    // Minimum swipe distance and maximum time
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;

    if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          if (handlers.hapticFeedback) {
            contextualHaptic.swipeNavigation();
          }
          handlers.onSwipeRight?.();
        } else {
          if (handlers.hapticFeedback) {
            contextualHaptic.swipeNavigation();
          }
          handlers.onSwipeLeft?.();
        }
      }
    } else if (Math.abs(deltaY) > minSwipeDistance && deltaTime < maxSwipeTime) {
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        // Vertical swipe
        if (deltaY > 0) {
          if (handlers.hapticFeedback) {
            contextualHaptic.swipeNavigation();
          }
          handlers.onSwipeDown?.();
        } else {
          if (handlers.hapticFeedback) {
            contextualHaptic.swipeNavigation();
          }
          handlers.onSwipeUp?.();
        }
      }
    }

    touchStart.current = null;
  }, [handlers]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return elementRef;
};
