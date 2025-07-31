
import { useState, useEffect } from 'react';

interface ScrollState {
  scrollY: number;
  scrollDirection: 'up' | 'down' | null;
  isScrolling: boolean;
}

export const useScrollDirection = (threshold: number = 10) => {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollY: 0,
    scrollDirection: null,
    isScrolling: false,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';

      if (Math.abs(scrollY - lastScrollY) > threshold) {
        setScrollState(prev => ({
          ...prev,
          scrollY,
          scrollDirection: direction,
          isScrolling: true,
        }));
      }

      // Clear existing timeout and set new one
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrollState(prev => ({
          ...prev,
          isScrolling: false,
        }));
      }, 150);

      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    // Set initial scroll position
    setScrollState(prev => ({
      ...prev,
      scrollY: window.scrollY,
    }));

    window.addEventListener('scroll', updateScrollDirection);

    return () => {
      window.removeEventListener('scroll', updateScrollDirection);
      clearTimeout(scrollTimeout);
    };
  }, [threshold]);

  return scrollState;
};
