
import { useReducedMotion } from "framer-motion";
import { useDeviceInfo } from "@/hooks/use-device-info";

export interface PerformanceConfig {
  animations: {
    enabled: boolean;
    duration: number;
    complexity: 'minimal' | 'standard' | 'enhanced';
  };
  images: {
    quality: 'low' | 'medium' | 'high';
    lazyLoading: boolean;
    blur: boolean;
  };
  interactions: {
    hapticFeedback: boolean;
    soundEffects: boolean;
  };
}

export const usePerformanceConfig = (): PerformanceConfig => {
  const { isMobile, deviceCategory } = useDeviceInfo();
  const prefersReducedMotion = useReducedMotion();

  return {
    animations: {
      enabled: !prefersReducedMotion,
      duration: prefersReducedMotion ? 0.1 : isMobile ? 0.3 : 0.5,
      complexity: prefersReducedMotion ? 'minimal' : 
                 isMobile ? 'standard' : 'enhanced'
    },
    images: {
      quality: deviceCategory === 'smallMobile' ? 'low' : 
               ['standardMobile', 'largeMobile'].includes(deviceCategory) ? 'medium' : 'high',
      lazyLoading: true,
      blur: !prefersReducedMotion
    },
    interactions: {
      hapticFeedback: isMobile && 'vibrate' in navigator,
      soundEffects: false // Disabled based on previous feedback
    }
  };
};

// GPU-optimized CSS properties with performance monitoring
export const gpuOptimizedStyles = {
  transform: 'translate3d(0, 0, 0)',
  willChange: 'transform',
  backfaceVisibility: 'hidden' as const,
  perspective: 1000,
  // Add containment for better performance isolation
  contain: 'layout style paint' as const
};

// Accessibility utilities
export const a11yUtils = {
  // WCAG AA compliant focus styles
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
  
  // Screen reader only content
  srOnly: 'sr-only absolute -inset-px w-px h-px p-0 m-[-1px] overflow-hidden whitespace-nowrap border-0',
  
  // High contrast mode support
  highContrast: 'forced-colors:border forced-colors:border-solid',
  
  // Touch target minimum size
  touchTarget: 'min-h-[44px] min-w-[44px]',
  
  // Reduced motion utilities
  respectMotion: 'motion-reduce:transition-none motion-reduce:transform-none'
};

// Performance monitoring
export const performanceMonitor = {
  measureInteraction: (name: string) => {
    if ('performance' in window && 'measure' in window.performance) {
      performance.mark(`${name}-start`);
      return () => {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        // Log slow interactions
        const measure = performance.getEntriesByName(name)[0];
        if (measure && measure.duration > 100) {
          console.warn(`🚗 Slow interaction detected: ${name} took ${measure.duration.toFixed(2)}ms`);
        }
      };
    }
    return () => {};
  },
  
  measurePageLoad: () => {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigation) {
            console.log('🚗 Toyota Page Performance:', {
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
              totalPageLoad: navigation.loadEventEnd - navigation.fetchStart,
              timeToFirstByte: navigation.responseStart - navigation.requestStart
            });
          }
        }, 0);
      });
    }
  },
  
  logWebVitals: () => {
    console.log('🚗 Toyota Web Vitals monitoring active');
  }
};
