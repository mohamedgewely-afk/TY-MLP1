import { useEffect, useCallback } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

export const usePerformanceMonitor = () => {
  const reportMetric = useCallback((metric: WebVitalsMetric) => {
    // In production, this would send to analytics
    console.log('Performance Metric:', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      timestamp: Date.now()
    });

    // Store in localStorage for debugging
    if (typeof localStorage !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
      existing.push({
        ...metric,
        timestamp: Date.now(),
        url: window.location.pathname
      });
      
      // Keep only last 50 metrics
      const latest = existing.slice(-50);
      localStorage.setItem('performance-metrics', JSON.stringify(latest));
    }
  }, []);

  const measurePageLoad = useCallback(() => {
    if ('performance' in window && 'navigation' in window.performance) {
      const navigation = window.performance.navigation;
      const timing = window.performance.timing;
      
      const metrics = {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        request: timing.responseStart - timing.requestStart,
        response: timing.responseEnd - timing.responseStart,
        dom: timing.domContentLoadedEventEnd - timing.navigationStart,
        load: timing.loadEventEnd - timing.navigationStart
      };

      Object.entries(metrics).forEach(([name, value]) => {
        if (value > 0) {
          reportMetric({
            name: `page-${name}`,
            value,
            rating: value < 1000 ? 'good' : value < 2500 ? 'needs-improvement' : 'poor',
            delta: 0
          });
        }
      });
    }
  }, [reportMetric]);

  const measureInteraction = useCallback((name: string) => {
    const startTime = performance.now();
    
    return (additionalData?: Record<string, any>) => {
      const duration = performance.now() - startTime;
      
      reportMetric({
        name: `interaction-${name}`,
        value: duration,
        rating: duration < 100 ? 'good' : duration < 300 ? 'needs-improvement' : 'poor',
        delta: 0
      });

      if (additionalData) {
        console.log(`Interaction ${name} data:`, additionalData);
      }
    };
  }, [reportMetric]);

  useEffect(() => {
    // Measure page load performance
    if (document.readyState === 'complete') {
      measurePageLoad();
    } else {
      window.addEventListener('load', measurePageLoad);
      return () => window.removeEventListener('load', measurePageLoad);
    }

    // Monitor long tasks
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            reportMetric({
              name: 'long-task',
              value: entry.duration,
              rating: entry.duration < 50 ? 'good' : entry.duration < 100 ? 'needs-improvement' : 'poor',
              delta: 0
            });
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['longtask'] });
        return () => observer.disconnect();
      } catch (error) {
        console.warn('Performance Observer not supported for longtask');
      }
    }
  }, [measurePageLoad, reportMetric]);

  return {
    reportMetric,
    measureInteraction,
    measurePageLoad
  };
};

// Utility to get performance summary
export const getPerformanceSummary = () => {
  if (typeof localStorage === 'undefined') return null;
  
  const metrics = JSON.parse(localStorage.getItem('performance-metrics') || '[]');
  const summary = metrics.reduce((acc: any, metric: any) => {
    if (!acc[metric.name]) {
      acc[metric.name] = { values: [], ratings: { good: 0, 'needs-improvement': 0, poor: 0 } };
    }
    acc[metric.name].values.push(metric.value);
    acc[metric.name].ratings[metric.rating]++;
    return acc;
  }, {});

  // Calculate averages
  Object.keys(summary).forEach(key => {
    const values = summary[key].values;
    summary[key].average = values.reduce((a: number, b: number) => a + b, 0) / values.length;
    summary[key].min = Math.min(...values);
    summary[key].max = Math.max(...values);
  });

  return summary;
};
