
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useIsMobile } from './use-mobile';

interface UseAdaptiveIntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  velocityThreshold?: number;
}

interface ScrollVelocity {
  speed: number;
  direction: 'up' | 'down' | 'idle';
}

export const useAdaptiveIntersection = <T extends HTMLElement = HTMLDivElement>({
  threshold = [0.1, 0.3, 0.6],
  rootMargin = '0px',
  triggerOnce = false,
  velocityThreshold = 500
}: UseAdaptiveIntersectionOptions = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [intersectionRatio, setIntersectionRatio] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [scrollVelocity, setScrollVelocity] = useState<ScrollVelocity>({ speed: 0, direction: 'idle' });
  
  const targetRef = useRef<T | null>(null);
  const isMobile = useIsMobile();
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const velocityTimeout = useRef<NodeJS.Timeout>();

  // Adaptive threshold based on device
  const adaptiveThreshold = useMemo(() => {
    if (Array.isArray(threshold)) {
      return isMobile ? [0.1, 0.2, 0.4] : threshold;
    }
    return isMobile ? Math.max(0.1, threshold * 0.5) : threshold;
  }, [threshold, isMobile]);

  // Adaptive root margin for mobile
  const adaptiveRootMargin = useMemo(() => {
    return isMobile ? '-10% 0px -20% 0px' : rootMargin;
  }, [rootMargin, isMobile]);

  // Scroll velocity tracking
  const updateScrollVelocity = useCallback(() => {
    const now = Date.now();
    const currentScrollY = window.scrollY;
    const deltaTime = now - lastScrollTime.current;
    const deltaY = currentScrollY - lastScrollY.current;
    
    if (deltaTime > 0) {
      const speed = Math.abs(deltaY) / deltaTime * 1000; // px/second
      const direction = deltaY > 0 ? 'down' : deltaY < 0 ? 'up' : 'idle';
      
      setScrollVelocity({ speed, direction });
      
      // Clear velocity after inactivity
      if (velocityTimeout.current) {
        clearTimeout(velocityTimeout.current);
      }
      velocityTimeout.current = setTimeout(() => {
        setScrollVelocity(prev => ({ ...prev, speed: 0, direction: 'idle' }));
      }, 150);
    }
    
    lastScrollY.current = currentScrollY;
    lastScrollTime.current = now;
  }, []);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    const ratio = entry.intersectionRatio;
    
    setIntersectionRatio(ratio);
    
    // Adaptive intersection logic based on scroll velocity
    const isSlowScroll = scrollVelocity.speed < velocityThreshold;
    const shouldTrigger = isSlowScroll ? ratio > 0.2 : ratio > 0.4;
    
    if (entry.isIntersecting && shouldTrigger) {
      setIsIntersecting(true);
      if (!hasTriggered) {
        setHasTriggered(true);
      }
    } else if (!triggerOnce) {
      setIsIntersecting(entry.isIntersecting && shouldTrigger);
    }
  }, [scrollVelocity.speed, velocityThreshold, hasTriggered, triggerOnce]);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: adaptiveThreshold,
      rootMargin: adaptiveRootMargin
    });

    observer.observe(target);

    // Add scroll listener for velocity tracking
    window.addEventListener('scroll', updateScrollVelocity, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateScrollVelocity);
      if (velocityTimeout.current) {
        clearTimeout(velocityTimeout.current);
      }
    };
  }, [handleIntersection, adaptiveThreshold, adaptiveRootMargin, updateScrollVelocity]);

  return { 
    targetRef, 
    isIntersecting, 
    intersectionRatio,
    hasTriggered, 
    scrollVelocity,
    isSlowScroll: scrollVelocity.speed < velocityThreshold
  };
};
