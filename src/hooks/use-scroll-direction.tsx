
import { useRef, useEffect, useState } from 'react';

export type ScrollDirection = 'up' | 'down';

export interface ScrollDirectionReturn {
  scrollDirection: ScrollDirection;
  isScrolling: boolean;
  scrollY: number;
  isAtTop: boolean;
  isScrollingDown: boolean;
  isScrollingUp: boolean;
}

export const useScrollDirection = (): ScrollDirectionReturn => {
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>('up');
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction: ScrollDirection = currentScrollY > lastScrollY.current ? 'down' : 'up';
      
      setScrollDirection(direction);
      setScrollY(currentScrollY);
      setIsScrolling(true);
      setIsAtTop(currentScrollY < 10);
      
      lastScrollY.current = currentScrollY;
      
      // Clear scrolling state after a delay
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  return {
    scrollDirection,
    isScrolling,
    scrollY,
    isAtTop,
    isScrollingDown: scrollDirection === 'down',
    isScrollingUp: scrollDirection === 'up'
  };
};
