
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseSectionVisibilityOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useSectionVisibility = ({
  threshold = 0.2,
  rootMargin = '0px'
}: UseSectionVisibilityOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0];
    setIsVisible(entry.isIntersecting);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });

    observerRef.current.observe(section);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return { sectionRef, isVisible };
};
