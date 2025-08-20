
import { useCallback, useRef, useState } from 'react';

interface TouchGestureHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onTap?: () => void;
  onDoubleTap?: () => void;
}

interface UseTouchGesturesReturn {
  touchHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
}

const SWIPE_THRESHOLD = 50;
const DOUBLE_TAP_DELAY = 300;

export const useTouchGestures = (handlers: TouchGestureHandlers): UseTouchGesturesReturn => {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const initialDistanceRef = useRef<number>(0);

  const getTouchDistance = (touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    if (e.touches.length === 2) {
      initialDistanceRef.current = getTouchDistance(e.touches[0], e.touches[1]);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && handlers.onPinch) {
      const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistanceRef.current;
      handlers.onPinch(scale);
    }
  }, [handlers]);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Check for swipe gestures
    if (deltaTime < 500 && (absX > SWIPE_THRESHOLD || absY > SWIPE_THRESHOLD)) {
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0 && handlers.onSwipeRight) {
          handlers.onSwipeRight();
        } else if (deltaX < 0 && handlers.onSwipeLeft) {
          handlers.onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && handlers.onSwipeDown) {
          handlers.onSwipeDown();
        } else if (deltaY < 0 && handlers.onSwipeUp) {
          handlers.onSwipeUp();
        }
      }
    } else if (absX < 10 && absY < 10 && deltaTime < 300) {
      // Tap gesture
      const now = Date.now();
      if (now - lastTapRef.current < DOUBLE_TAP_DELAY && handlers.onDoubleTap) {
        handlers.onDoubleTap();
        lastTapRef.current = 0;
      } else {
        lastTapRef.current = now;
        setTimeout(() => {
          if (lastTapRef.current === now && handlers.onTap) {
            handlers.onTap();
          }
        }, DOUBLE_TAP_DELAY);
      }
    }

    touchStartRef.current = null;
  }, [handlers]);

  return {
    touchHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd
    }
  };
};
