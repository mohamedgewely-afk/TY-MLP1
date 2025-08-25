
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  skip?: boolean;
}

export const useIntersectionObserver = <T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = false,
  skip = false
}: UseIntersectionObserverOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<T>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observe = useCallback(() => {
    if (skip || !elementRef.current) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        setIsIntersecting(isVisible);
        
        if (isVisible && !hasIntersected) {
          setHasIntersected(true);
          
          if (triggerOnce) {
            observerRef.current?.disconnect();
          }
        }
      },
      { threshold, rootMargin }
    );

    observerRef.current.observe(elementRef.current);
  }, [threshold, rootMargin, triggerOnce, skip, hasIntersected]);

  useEffect(() => {
    observe();
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [observe]);

  const reset = useCallback(() => {
    setIsIntersecting(false);
    setHasIntersected(false);
    observe();
  }, [observe]);

  return {
    elementRef,
    isIntersecting,
    hasIntersected,
    reset
  };
};
