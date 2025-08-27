
import { useEffect, useRef, useState, useCallback } from 'react';

// Shared intersection observer for better performance
let sharedObserver: IntersectionObserver | null = null;
const observedElements = new Map<Element, Set<(isIntersecting: boolean) => void>>();

const getSharedObserver = () => {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const callbacks = observedElements.get(entry.target);
          if (callbacks) {
            callbacks.forEach(callback => callback(entry.isIntersecting));
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: [0, 0.1, 0.5, 1.0]
      }
    );
  }
  return sharedObserver;
};

export const useOptimizedIntersection = <T extends HTMLElement = HTMLDivElement>() => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<T | null>(null);
  const callbackRef = useRef<(isIntersecting: boolean) => void>();

  const updateIntersection = useCallback((intersecting: boolean) => {
    setIsIntersecting(intersecting);
  }, []);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = getSharedObserver();
    callbackRef.current = updateIntersection;

    // Add to observed elements map
    if (!observedElements.has(target)) {
      observedElements.set(target, new Set());
    }
    observedElements.get(target)?.add(callbackRef.current);

    observer.observe(target);

    return () => {
      if (target && callbackRef.current) {
        const callbacks = observedElements.get(target);
        if (callbacks) {
          callbacks.delete(callbackRef.current);
          if (callbacks.size === 0) {
            observedElements.delete(target);
            observer.unobserve(target);
          }
        }
      }
    };
  }, [updateIntersection]);

  return { targetRef, isIntersecting };
};
