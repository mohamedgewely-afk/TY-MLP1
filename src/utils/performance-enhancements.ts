// Performance enhancement utilities for the vehicle showcase
import { useCallback, useRef, useEffect } from 'react';

// Throttle function for scroll events
export const useThrottledScroll = (callback: () => void, delay: number = 16) => {
  const throttling = useRef(false);

  return useCallback(() => {
    if (throttling.current) return;
    
    throttling.current = true;
    requestAnimationFrame(() => {
      callback();
      throttling.current = false;
    });
  }, [callback]);
};

// Image preloader with priority queue
export const useImagePreloader = () => {
  const loadedImages = useRef(new Set<string>());
  const loadingImages = useRef(new Set<string>());

  const preloadImage = useCallback((src: string, priority: 'high' | 'low' = 'low') => {
    if (loadedImages.current.has(src) || loadingImages.current.has(src)) {
      return Promise.resolve();
    }

    loadingImages.current.add(src);
    
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.referrerPolicy = 'no-referrer';
      
      img.onload = () => {
        loadedImages.current.add(src);
        loadingImages.current.delete(src);
        resolve();
      };
      
      img.onerror = () => {
        loadingImages.current.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };

      // Set loading priority
      if (priority === 'high') {
        img.loading = 'eager';
      } else {
        img.loading = 'lazy';
      }
      
      img.src = src;
    });
  }, []);

  const preloadMultiple = useCallback((urls: string[], priority: 'high' | 'low' = 'low') => {
    return Promise.allSettled(urls.map(url => preloadImage(url, priority)));
  }, [preloadImage]);

  return { preloadImage, preloadMultiple, isLoaded: (src: string) => loadedImages.current.has(src) };
};

// Virtual scrolling for large lists
export const useVirtualScrolling = (
  itemHeight: number,
  containerHeight: number,
  items: any[]
) => {
  const scrollTop = useRef(0);
  const startIndex = Math.floor(scrollTop.current / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length - 1
  );
  
  const visibleItems = items.slice(startIndex, endIndex + 1);
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    offsetY,
    updateScrollTop: (newScrollTop: number) => {
      scrollTop.current = newScrollTop;
    }
  };
};

// Memory management for large components
export const useMemoryOptimization = () => {
  const cleanup = useRef<(() => void)[]>([]);

  const addCleanup = useCallback((fn: () => void) => {
    cleanup.current.push(fn);
  }, []);

  useEffect(() => {
    return () => {
      cleanup.current.forEach(fn => fn());
      cleanup.current = [];
    };
  }, []);

  return { addCleanup };
};

// Optimized intersection observer
export const useOptimizedIntersection = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
) => {
  const observer = useRef<IntersectionObserver>();
  const elements = useRef(new Set<Element>());

  const observe = useCallback((element: Element) => {
    if (!observer.current) {
      observer.current = new IntersectionObserver(callback, {
        rootMargin: '-10% 0px -10% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
        ...options
      });
    }
    
    observer.current.observe(element);
    elements.current.add(element);
  }, [callback, options]);

  const unobserve = useCallback((element: Element) => {
    if (observer.current) {
      observer.current.unobserve(element);
      elements.current.delete(element);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { observe, unobserve };
};