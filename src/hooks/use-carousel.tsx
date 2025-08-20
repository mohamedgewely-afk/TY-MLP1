
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseCarouselOptions {
  itemCount: number;
  itemsPerView: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  loop?: boolean;
}

interface UseCarouselReturn {
  currentIndex: number;
  isAutoPlaying: boolean;
  canGoPrev: boolean;
  canGoNext: boolean;
  goToIndex: (index: number) => void;
  goNext: () => void;
  goPrev: () => void;
  toggleAutoPlay: () => void;
  pauseAutoPlay: () => void;
  resumeAutoPlay: () => void;
}

export const useCarousel = ({
  itemCount,
  itemsPerView,
  autoPlay = false,
  autoPlayInterval = 4000,
  loop = true
}: UseCarouselOptions): UseCarouselReturn => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const intervalRef = useRef<NodeJS.Timeout>();

  const maxIndex = Math.max(0, itemCount - itemsPerView);
  const canGoPrev = loop || currentIndex > 0;
  const canGoNext = loop || currentIndex < maxIndex;

  const goToIndex = useCallback((index: number) => {
    if (loop) {
      setCurrentIndex((index + itemCount) % itemCount);
    } else {
      setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
    }
  }, [itemCount, maxIndex, loop]);

  const goNext = useCallback(() => {
    if (loop) {
      goToIndex(currentIndex + 1);
    } else if (currentIndex < maxIndex) {
      goToIndex(currentIndex + 1);
    }
  }, [currentIndex, maxIndex, loop, goToIndex]);

  const goPrev = useCallback(() => {
    if (loop) {
      goToIndex(currentIndex - 1);
    } else if (currentIndex > 0) {
      goToIndex(currentIndex - 1);
    }
  }, [currentIndex, loop, goToIndex]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false);
  }, []);

  const resumeAutoPlay = useCallback(() => {
    setIsAutoPlaying(true);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlaying || itemCount <= itemsPerView) return;

    intervalRef.current = setInterval(() => {
      goNext();
    }, autoPlayInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, itemCount, itemsPerView, autoPlayInterval, goNext]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    currentIndex,
    isAutoPlaying,
    canGoPrev,
    canGoNext,
    goToIndex,
    goNext,
    goPrev,
    toggleAutoPlay,
    pauseAutoPlay,
    resumeAutoPlay
  };
};
