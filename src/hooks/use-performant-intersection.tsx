
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

interface UsePerformantIntersectionOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

// Shared intersection observer instance for better performance
let sharedObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, (entry: IntersectionObserverEntry) => void>();

const createSharedObserver = (options: IntersectionObserverInit) => {
  if (sharedObserver) {
    sharedObserver.disconnect();
  }
  
  sharedObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const callback = observedElements.get(entry.target);
      callback?.(entry);
    });
  }, options);
  
  return sharedObserver;
};

export const usePerformantIntersection = <T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true
}: UsePerformantIntersectionOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef<T | null>(null);

  const observerOptions = useMemo(() => ({
    threshold,
    rootMargin
  }), [threshold, rootMargin]);

  const handleIntersection = useCallback((entry: IntersectionObserverEntry) => {
    const isNowIntersecting = entry.isIntersecting;
    
    if (isNowIntersecting && !hasTriggered) {
      setIsIntersecting(true);
      setHasTriggered(true);
    } else if (!triggerOnce) {
      setIsIntersecting(isNowIntersecting);
    }
  }, [hasTriggered, triggerOnce]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    // Use or create shared observer
    const observer = sharedObserver || createSharedObserver(observerOptions);
    
    // Register callback
    observedElements.set(target, handleIntersection);
    observer.observe(target);

    return () => {
      observedElements.delete(target);
      observer.unobserve(target);
      
      // Clean up shared observer if no more elements
      if (observedElements.size === 0 && sharedObserver) {
        sharedObserver.disconnect();
        sharedObserver = null;
      }
    };
  }, [handleIntersection, observerOptions]);

  return { targetRef, isIntersecting, hasTriggered };
};
