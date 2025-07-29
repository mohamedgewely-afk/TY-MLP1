
import { useState, useEffect, useCallback } from 'react';

export type ScrollDirection = 'up' | 'down' | 'none';

interface UseScrollDirectionOptions {
  threshold?: number;
  debounce?: number;
}

export function useScrollDirection({ 
  threshold = 10, 
  debounce = 100 
}: UseScrollDirectionOptions = {}) {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('none');
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const updateScrollDirection = useCallback(() => {
    const currentScrollY = window.scrollY;
    const difference = currentScrollY - scrollY;

    if (Math.abs(difference) > threshold) {
      setScrollDirection(difference > 0 ? 'down' : 'up');
      setScrollY(currentScrollY);
    }

    setIsScrolling(true);
  }, [scrollY, threshold]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleScroll = () => {
      updateScrollDirection();
      
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsScrolling(false);
      }, debounce);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [updateScrollDirection, debounce]);

  return {
    scrollDirection,
    isScrolling,
    scrollY,
    isAtTop: scrollY <= threshold,
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up'
  };
}
