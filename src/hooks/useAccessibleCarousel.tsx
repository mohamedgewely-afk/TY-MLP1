
import { useState, useCallback, useRef, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface UseAccessibleCarouselOptions {
  itemCount: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
}

export const useAccessibleCarousel = ({
  itemCount,
  autoplay = false,
  autoplayDelay = 4000,
  loop = true
}: UseAccessibleCarouselOptions) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMobile = useIsMobile();

  const clearAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!autoplay || isAutoplayPaused) return;
    
    clearAutoplay();
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prev => loop ? (prev + 1) % itemCount : Math.min(prev + 1, itemCount - 1));
    }, autoplayDelay);
  }, [autoplay, autoplayDelay, itemCount, loop, isAutoplayPaused, clearAutoplay]);

  const goToSlide = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, itemCount - 1));
    setCurrentIndex(clampedIndex);
    clearAutoplay();
    if (autoplay && !isAutoplayPaused) {
      setTimeout(startAutoplay, 1000);
    }
  }, [itemCount, autoplay, isAutoplayPaused, clearAutoplay, startAutoplay]);

  const goToPrevious = useCallback(() => {
    const newIndex = loop ? (currentIndex - 1 + itemCount) % itemCount : Math.max(0, currentIndex - 1);
    goToSlide(newIndex);
  }, [currentIndex, itemCount, loop, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex = loop ? (currentIndex + 1) % itemCount : Math.min(itemCount - 1, currentIndex + 1);
    goToSlide(newIndex);
  }, [currentIndex, itemCount, loop, goToSlide]);

  const pauseAutoplay = useCallback(() => {
    setIsAutoplayPaused(true);
    clearAutoplay();
  }, [clearAutoplay]);

  const resumeAutoplay = useCallback(() => {
    setIsAutoplayPaused(false);
    if (autoplay) {
      startAutoplay();
    }
  }, [autoplay, startAutoplay]);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        goToPrevious();
        break;
      case 'ArrowRight':
        event.preventDefault();
        goToNext();
        break;
      case 'Home':
        event.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        event.preventDefault();
        goToSlide(itemCount - 1);
        break;
      case ' ':
      case 'Enter':
        event.preventDefault();
        if (isAutoplayPaused) {
          resumeAutoplay();
        } else {
          pauseAutoplay();
        }
        break;
    }
  }, [goToPrevious, goToNext, goToSlide, itemCount, isAutoplayPaused, pauseAutoplay, resumeAutoplay]);

  useEffect(() => {
    if (autoplay && !isAutoplayPaused) {
      startAutoplay();
    }
    return clearAutoplay;
  }, [autoplay, isAutoplayPaused, startAutoplay, clearAutoplay]);

  const canGoPrevious = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < itemCount - 1;

  return {
    currentIndex,
    canGoPrevious,
    canGoNext,
    goToPrevious,
    goToNext,
    goToSlide,
    pauseAutoplay,
    resumeAutoplay,
    isAutoplayPaused,
    handleKeyDown,
    isMobile
  };
};
