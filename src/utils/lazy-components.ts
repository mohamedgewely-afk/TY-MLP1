
import { lazy, ComponentType } from 'react';

// Enhanced lazy loading with preloading capabilities
export const createLazyComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  preloadCondition?: () => boolean
) => {
  const LazyComponent = lazy(importFn);
  
  // Preload component when condition is met
  if (preloadCondition && preloadCondition()) {
    importFn();
  }
  
  return LazyComponent;
};

// Preload heavy components on idle
export const preloadOnIdle = (importFn: () => Promise<any>) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => importFn());
  } else {
    setTimeout(() => importFn(), 1000);
  }
};

// Network-aware preloading
export const preloadOnFastNetwork = (importFn: () => Promise<any>) => {
  const connection = (navigator as any).connection;
  if (connection && connection.effectiveType === '4g') {
    preloadOnIdle(importFn);
  }
};
