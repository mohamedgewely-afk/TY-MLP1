import { useEffect, useCallback } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

// Enhanced web vitals monitoring with mobile-specific optimizations
export const useWebVitalsOptimized = () => {
  const reportMetric = useCallback((metric: WebVitalsMetric) => {
    // Batch metrics to reduce main thread blocking
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      (window as any).scheduler.postTask(() => {
        console.log('Web Vital:', metric);
        
        // Store for analytics (batched)
        const existing = JSON.parse(sessionStorage.getItem('web-vitals') || '[]');
        existing.push({ ...metric, timestamp: Date.now() });
        
        // Keep only last 20 metrics to prevent memory bloat
        const latest = existing.slice(-20);
        sessionStorage.setItem('web-vitals', JSON.stringify(latest));
      }, { priority: 'background' });
    }
  }, []);

  useEffect(() => {
    // Monitor Long Animation Frames (mobile-specific)
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 16) { // > 60fps threshold
            reportMetric({
              name: 'long-animation-frame',
              value: entry.duration,
              rating: entry.duration < 16 ? 'good' : entry.duration < 50 ? 'needs-improvement' : 'poor',
              delta: 0
            });
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['long-animation-frame'] });
        return () => observer.disconnect();
      } catch {
        // Fallback for unsupported browsers
      }
    }

    // Monitor layout shifts specifically on mobile
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.contentRect.width > 0) {
          reportMetric({
            name: 'layout-shift',
            value: entry.contentRect.width,
            rating: 'good',
            delta: 0
          });
        }
      });
    });

    if (document.body) {
      resizeObserver.observe(document.body);
    }

    return () => resizeObserver.disconnect();
  }, [reportMetric]);

  return { reportMetric };
};

// Memory pressure detection for mobile devices
export const useMemoryPressure = () => {
  const isLowMemory = useCallback(() => {
    const memory = (performance as any).memory;
    if (memory) {
      const ratio = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
      return ratio > 0.8; // Above 80% memory usage
    }
    return false;
  }, []);

  return { isLowMemory };
};
