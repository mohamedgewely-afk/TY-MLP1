import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionLockOptions {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

/**
 * Hook to safely manage scroll locking based on intersection observer
 * Only locks scroll when element is sufficiently visible (≥50% by default)
 */
export function useIntersectionLock({
  threshold = 0.5,
  rootMargin = '0px',
  enabled = true
}: UseIntersectionLockOptions = {}) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const originalOverflow = useRef<string>('');

  const lockScroll = useCallback(() => {
    if (typeof window === 'undefined' || isLocked) return;
    
    originalOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setIsLocked(true);
  }, [isLocked]);

  const unlockScroll = useCallback(() => {
    if (typeof window === 'undefined' || !isLocked) return;
    
    document.body.style.overflow = originalOverflow.current;
    setIsLocked(false);
  }, [isLocked]);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          lockScroll();
        } else {
          unlockScroll();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      unlockScroll(); // Always unlock on cleanup
    };
  }, [enabled, threshold, rootMargin, lockScroll, unlockScroll]);

  // Emergency cleanup on unmount
  useEffect(() => {
    return () => {
      unlockScroll();
    };
  }, [unlockScroll]);

  return {
    ref: elementRef,
    isIntersecting,
    isLocked,
    lockScroll,
    unlockScroll
  };
}