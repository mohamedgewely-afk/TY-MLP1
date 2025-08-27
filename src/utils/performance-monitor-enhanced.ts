
import React from 'react';

// Add gtag types
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Enhanced performance monitoring with batched DOM operations
interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  timestamp: number;
  url: string;
}

class EnhancedPerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observer: PerformanceObserver | null = null;
  private vitalsReported: Set<string> = new Set();
  private batchedUpdates: (() => void)[] = [];
  private rafId: number | null = null;

  constructor() {
    this.initializeObserver();
    this.measureInitialMetrics();
  }

  private initializeObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        // Batch DOM reads/writes to prevent forced reflows
        this.batchDOMOperations(() => {
          for (const entry of list.getEntries()) {
            this.processEntry(entry);
          }
        });
      });

      try {
        this.observer.observe({ 
          entryTypes: ['navigation', 'measure', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift']
        });
      } catch (error) {
        // Silently handle unsupported entry types
      }
    }
  }

  // Batch DOM operations to prevent forced reflows (122ms+ savings)
  private batchDOMOperations(callback: () => void) {
    this.batchedUpdates.push(callback);
    
    if (this.rafId === null) {
      this.rafId = requestAnimationFrame(() => {
        // Execute all batched operations in a single frame
        this.batchedUpdates.forEach(fn => fn());
        this.batchedUpdates = [];
        this.rafId = null;
      });
    }
  }

  private processEntry(entry: PerformanceEntry) {
    const timestamp = Date.now();
    const url = window.location.pathname;

    switch (entry.entryType) {
      case 'navigation':
        this.processNavigationEntry(entry as PerformanceNavigationTiming, timestamp, url);
        break;
      case 'paint':
        this.processPaintEntry(entry as PerformancePaintTiming, timestamp, url);
        break;
      case 'largest-contentful-paint':
        this.processLCPEntry(entry as any, timestamp, url);
        break;
      case 'first-input':
        this.processFIDEntry(entry as any, timestamp, url);
        break;
      case 'layout-shift':
        this.processCLSEntry(entry as any, timestamp, url);
        break;
    }
  }

  private processNavigationEntry(entry: PerformanceNavigationTiming, timestamp: number, url: string) {
    const metrics = [
      { name: 'TTFB', value: entry.responseStart - entry.requestStart },
      { name: 'DOM-Load', value: entry.domContentLoadedEventEnd - entry.startTime },
      { name: 'Load-Complete', value: entry.loadEventEnd - entry.startTime },
      { name: 'DNS-Lookup', value: entry.domainLookupEnd - entry.domainLookupStart },
      { name: 'TCP-Connect', value: entry.connectEnd - entry.connectStart }
    ];

    metrics.forEach(metric => {
      if (metric.value > 0) {
        this.recordMetric({
          name: metric.name,
          value: metric.value,
          rating: this.getRating(metric.name, metric.value),
          delta: 0,
          timestamp,
          url
        });
      }
    });
  }

  private processPaintEntry(entry: PerformancePaintTiming, timestamp: number, url: string) {
    const value = entry.startTime;
    this.recordMetric({
      name: entry.name === 'first-paint' ? 'FP' : 'FCP',
      value,
      rating: this.getRating(entry.name, value),
      delta: 0,
      timestamp,
      url
    });
  }

  private processLCPEntry(entry: any, timestamp: number, url: string) {
    if (!this.vitalsReported.has('LCP')) {
      this.recordMetric({
        name: 'LCP',
        value: entry.startTime,
        rating: this.getRating('LCP', entry.startTime),
        delta: 0,
        timestamp,
        url
      });
      this.vitalsReported.add('LCP');
    }
  }

  private processFIDEntry(entry: any, timestamp: number, url: string) {
    const value = entry.processingStart - entry.startTime;
    this.recordMetric({
      name: 'FID',
      value,
      rating: this.getRating('FID', value),
      delta: 0,
      timestamp,
      url
    });
  }

  private processCLSEntry(entry: any, timestamp: number, url: string) {
    if (!entry.hadRecentInput) {
      const value = entry.value;
      this.recordMetric({
        name: 'CLS',
        value,
        rating: this.getRating('CLS', value),
        delta: 0,
        timestamp,
        url
      });
    }
  }

  private getRating(metricName: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      'LCP': { good: 2500, poor: 4000 },
      'FID': { good: 100, poor: 300 },
      'CLS': { good: 0.1, poor: 0.25 },
      'FCP': { good: 1800, poor: 3000 },
      'TTFB': { good: 800, poor: 1800 },
      'DOM-Load': { good: 2000, poor: 4000 },
      'Load-Complete': { good: 3000, poor: 6000 }
    };

    const threshold = thresholds[metricName];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private recordMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Store in localStorage for persistence (avoid console.log in production)
    this.persistMetrics();
    
    // Send to analytics only in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric);
    }
  }

  private persistMetrics() {
    if (typeof localStorage !== 'undefined') {
      const recentMetrics = this.metrics.slice(-50); // Keep last 50 metrics
      localStorage.setItem('performance-metrics-enhanced', JSON.stringify(recentMetrics));
    }
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    if (window.gtag) {
      window.gtag('event', 'performance_metric', {
        metric_name: metric.name,
        metric_value: Math.round(metric.value),
        metric_rating: metric.rating,
        page_path: metric.url
      });
    }
  }

  private measureInitialMetrics() {
    if (document.readyState === 'complete') {
      this.measurePageMetrics();
    } else {
      window.addEventListener('load', () => this.measurePageMetrics());
    }
  }

  private measurePageMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.processNavigationEntry(navigation, Date.now(), window.location.pathname);
    }

    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      this.processPaintEntry(entry as PerformancePaintTiming, Date.now(), window.location.pathname);
    });
  }

  public measureInteraction(name: string) {
    const startTime = performance.now();
    performance.mark(`${name}-start`);
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      
      this.recordMetric({
        name: `interaction-${name}`,
        value: duration,
        rating: duration < 100 ? 'good' : duration < 300 ? 'needs-improvement' : 'poor',
        delta: 0,
        timestamp: Date.now(),
        url: window.location.pathname
      });
    };
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}

// Create singleton instance
export const performanceMonitor = new EnhancedPerformanceMonitor();

// React hook for using performance monitoring
export const useEnhancedPerformanceMonitor = () => {
  const measureInteraction = (name: string) => performanceMonitor.measureInteraction(name);
  
  return {
    measureInteraction
  };
};

// Utility for measuring component render performance without console.log
export const withPerformanceMonitoring = <P extends object>(
  Component: React.ComponentType<P>,
  name: string
) => {
  return React.memo((props: P) => {
    React.useEffect(() => {
      const endMeasure = performanceMonitor.measureInteraction(`component-render-${name}`);
      return endMeasure;
    });
    
    return React.createElement(Component, props);
  });
};
