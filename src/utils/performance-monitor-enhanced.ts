
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor';

// Enhanced performance monitoring with Core Web Vitals
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

  constructor() {
    this.initializeObserver();
    this.measureInitialMetrics();
  }

  private initializeObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.processEntry(entry);
        }
      });

      // Observe all performance entry types
      try {
        this.observer.observe({ 
          entryTypes: ['navigation', 'measure', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift']
        });
      } catch (error) {
        console.warn('Some performance entry types not supported:', error);
      }
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
      { name: 'DOM-Load', value: entry.domContentLoadedEventEnd - entry.navigationStart },
      { name: 'Load-Complete', value: entry.loadEventEnd - entry.navigationStart },
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
    
    // Store in localStorage for persistence
    this.persistMetrics();
    
    // Send to analytics (in production)
    this.sendToAnalytics(metric);
    
    console.log('Performance Metric:', metric);
  }

  private persistMetrics() {
    if (typeof localStorage !== 'undefined') {
      const recentMetrics = this.metrics.slice(-100); // Keep last 100 metrics
      localStorage.setItem('performance-metrics-enhanced', JSON.stringify(recentMetrics));
    }
  }

  private sendToAnalytics(metric: PerformanceMetric) {
    // In production, send to your analytics service
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
    // Measure initial page load metrics
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

    // Measure paint metrics
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      this.processPaintEntry(entry as PerformancePaintTiming, Date.now(), window.location.pathname);
    });
  }

  public getMetricsSummary() {
    const summary: Record<string, any> = {};
    
    this.metrics.forEach(metric => {
      if (!summary[metric.name]) {
        summary[metric.name] = {
          values: [],
          ratings: { good: 0, 'needs-improvement': 0, poor: 0 },
          count: 0
        };
      }
      
      summary[metric.name].values.push(metric.value);
      summary[metric.name].ratings[metric.rating]++;
      summary[metric.name].count++;
    });
    
    // Calculate statistics
    Object.keys(summary).forEach(key => {
      const values = summary[key].values;
      summary[key].average = values.reduce((a: number, b: number) => a + b, 0) / values.length;
      summary[key].min = Math.min(...values);
      summary[key].max = Math.max(...values);
      summary[key].p75 = this.percentile(values, 0.75);
      summary[key].p95 = this.percentile(values, 0.95);
    });
    
    return summary;
  }

  private percentile(values: number[], percentile: number): number {
    const sorted = values.slice().sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * percentile) - 1;
    return sorted[index] || 0;
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
  }
}

// Create singleton instance
export const performanceMonitor = new EnhancedPerformanceMonitor();

// React hook for using performance monitoring
export const useEnhancedPerformanceMonitor = () => {
  const measureInteraction = (name: string) => performanceMonitor.measureInteraction(name);
  const getMetricsSummary = () => performanceMonitor.getMetricsSummary();
  
  return {
    measureInteraction,
    getMetricsSummary
  };
};

// Utility for measuring component render performance
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
