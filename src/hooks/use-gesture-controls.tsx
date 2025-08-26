
import { useState, useEffect, useCallback, useRef } from 'react';

interface GestureState {
  isZoomed: boolean;
  scale: number;
  translateX: number;
  translateY: number;
}

export const useGestureControls = () => {
  const [gestureState, setGestureState] = useState<GestureState>({
    isZoomed: false,
    scale: 1,
    translateX: 0,
    translateY: 0
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const resetGesture = useCallback(() => {
    setGestureState({
      isZoomed: false,
      scale: 1,
      translateX: 0,
      translateY: 0
    });
  }, []);

  const updateGesture = useCallback((updates: Partial<GestureState>) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    
    rafRef.current = requestAnimationFrame(() => {
      setGestureState(prev => ({ ...prev, ...updates }));
    });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let initialDistance = 0;
    let initialScale = 1;
    let lastTap = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        initialDistance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        initialScale = gestureState.scale;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        
        const newScale = Math.max(1, Math.min(3, initialScale * (distance / initialDistance)));
        updateGesture({ 
          scale: newScale, 
          isZoomed: newScale > 1 
        });
      }
    };

    const handleDoubleClick = (e: MouseEvent) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 500 && tapLength > 0) {
        if (gestureState.isZoomed) {
          resetGesture();
        } else {
          updateGesture({ 
            scale: 2, 
            isZoomed: true,
            translateX: 0,
            translateY: 0
          });
        }
      }
      lastTap = currentTime;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('click', handleDoubleClick);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('click', handleDoubleClick);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [gestureState.scale, gestureState.isZoomed, updateGesture, resetGesture]);

  return {
    containerRef,
    gestureState,
    resetGesture,
    updateGesture
  };
};
