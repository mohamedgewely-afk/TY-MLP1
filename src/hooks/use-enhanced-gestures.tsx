
import { useRef, useEffect, useCallback, useState } from 'react';
import { contextualHaptic } from '@/utils/haptic';

interface EnhancedGesturesOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinchZoom?: (scale: number) => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  threshold?: number;
  hapticFeedback?: boolean;
}

export const useEnhancedGestures = ({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onPinchZoom,
  onDoubleTap,
  onLongPress,
  threshold = 50,
  hapticFeedback = true
}: EnhancedGesturesOptions) => {
  const elementRef = useRef<HTMLElement | null>(null);
  const [touchState, setTouchState] = useState({
    startX: 0,
    startY: 0,
    startTime: 0,
    lastTapTime: 0,
    initialDistance: 0,
    scale: 1
  });

  const calculateDistance = useCallback((touch1: Touch, touch2: Touch) => {
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    const currentTime = Date.now();
    
    setTouchState(prev => ({
      ...prev,
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: currentTime
    }));

    // Handle pinch start
    if (e.touches.length === 2) {
      const distance = calculateDistance(e.touches[0], e.touches[1]);
      setTouchState(prev => ({
        ...prev,
        initialDistance: distance
      }));
    }

    // Handle long press
    if (onLongPress) {
      setTimeout(() => {
        if (Date.now() - currentTime >= 500) {
          if (hapticFeedback) contextualHaptic.selectionChange();
          onLongPress();
        }
      }, 500);
    }
  }, [calculateDistance, onLongPress, hapticFeedback]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Handle pinch zoom
    if (e.touches.length === 2 && onPinchZoom) {
      const currentDistance = calculateDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / touchState.initialDistance;
      
      if (Math.abs(scale - touchState.scale) > 0.1) {
        setTouchState(prev => ({ ...prev, scale }));
        onPinchZoom(scale);
      }
    }
  }, [calculateDistance, onPinchZoom, touchState.initialDistance, touchState.scale]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    const touch = e.changedTouches[0];
    const currentTime = Date.now();
    const deltaX = touch.clientX - touchState.startX;
    const deltaY = touch.clientY - touchState.startY;
    const deltaTime = currentTime - touchState.startTime;

    // Handle double tap
    if (deltaTime < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
      if (currentTime - touchState.lastTapTime < 300 && onDoubleTap) {
        if (hapticFeedback) contextualHaptic.buttonPress();
        onDoubleTap();
        return;
      }
      setTouchState(prev => ({ ...prev, lastTapTime: currentTime }));
      return;
    }

    // Handle swipe gestures
    if (deltaTime < 500 && (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold)) {
      if (hapticFeedback) contextualHaptic.swipeNavigation();
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > threshold && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < -threshold && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > threshold && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < -threshold && onSwipeUp) {
          onSwipeUp();
        }
      }
    }
  }, [touchState, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap, hapticFeedback]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
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
