// Enhanced Core Web Vitals monitoring with specific Toyota app optimizations
import { useCallback, useEffect, useRef } from 'react';

interface CoreWebVitalsMetric {
  name: 'CLS' | 'FID' | 'LCP' | 'FCP' | 'TTFB' | 'INP';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

interface PerformanceMetrics {
  largestContentfulPaint?: number;
  firstContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;
  interactionToNextPaint?: number;
  timeToFirstByte?: number;
}

// Thresholds based on Core Web Vitals recommendations
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
  INP: { good: 200, needsImprovement: 500 }
};

const getRating = (metricName: keyof typeof THRESHOLDS, value: number): 'good' | 'needs-improvement' | 'poor' => {
  const threshold = THRESHOLDS[metricName];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
};

export const useCoreWebVitals = () => {
  const metricsRef = useRef<PerformanceMetrics>({});
  const observersRef = useRef<PerformanceObserver[]>([]);

  const reportMetric = useCallback((metric: CoreWebVitalsMetric) => {
    // Batch metrics for performance
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      (window as any).scheduler.postTask(() => {
        console.log(`🚗 Toyota Core Web Vital [${metric.name}]:`, {
          value: metric.value,
          rating: metric.rating,
          target: metric.name === 'LCP' ? '≤ 2.5s' : 
                 metric.name === 'FID' ? '≤ 100ms' :
                 metric.name === 'CLS' ? '≤ 0.1' :
                 metric.name === 'FCP' ? '≤ 1.8s' :
                 metric.name === 'TTFB' ? '≤ 800ms' :
                 metric.name === 'INP' ? '≤ 200ms' : 'optimal'
        });

        // Store for analytics
        const existingMetrics = JSON.parse(sessionStorage.getItem('toyota-web-vitals') || '[]');
        existingMetrics.push({
          ...metric,
          timestamp: Date.now(),
          url: window.location.pathname,
          userAgent: navigator.userAgent.slice(0, 100)
        });

        // Keep only last 50 metrics
        const latestMetrics = existingMetrics.slice(-50);
        sessionStorage.setItem('toyota-web-vitals', JSON.stringify(latestMetrics));
      }, { priority: 'background' });
    }
  }, []);

  useEffect(() => {
    // LCP Observer
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        
        if (lastEntry) {
          const value = lastEntry.startTime;
          metricsRef.current.largestContentfulPaint = value;
          
          reportMetric({
            name: 'LCP',
            value,
            rating: getRating('LCP', value),
            delta: 0,
            id: `lcp-${Date.now()}`,
            navigationType: (performance as any).navigation?.type || 'unknown'
          });
        }
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        observersRef.current.push(lcpObserver);
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // FCP Observer
      const fcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            const value = entry.startTime;
            metricsRef.current.firstContentfulPaint = value;
            
            reportMetric({
              name: 'FCP',
              value,
              rating: getRating('FCP', value),
              delta: 0,
              id: `fcp-${Date.now()}`,
              navigationType: (performance as any).navigation?.type || 'unknown'
            });
          }
        });
      });

      try {
        fcpObserver.observe({ entryTypes: ['paint'] });
        observersRef.current.push(fcpObserver);
      } catch (e) {
        console.warn('FCP observer not supported');
      }

      // CLS Observer
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });

        if (clsValue > 0) {
          metricsRef.current.cumulativeLayoutShift = clsValue;
          
          reportMetric({
            name: 'CLS',
            value: clsValue,
            rating: getRating('CLS', clsValue),
            delta: 0,
            id: `cls-${Date.now()}`,
            navigationType: (performance as any).navigation?.type || 'unknown'
          });
        }
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
        observersRef.current.push(clsObserver);
      } catch (e) {
        console.warn('CLS observer not supported');
      }

      // FID Observer (will be deprecated, keeping for compatibility)
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          const value = entry.processingStart - entry.startTime;
          metricsRef.current.firstInputDelay = value;
          
          reportMetric({
            name: 'FID',
            value,
            rating: getRating('FID', value),
            delta: 0,
            id: `fid-${Date.now()}`,
            navigationType: (performance as any).navigation?.type || 'unknown'
          });
        });
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
        observersRef.current.push(fidObserver);
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // TTFB from Navigation Timing
      if (performance.timing) {
        const ttfb = performance.timing.responseStart - performance.timing.requestStart;
        metricsRef.current.timeToFirstByte = ttfb;
        
        reportMetric({
          name: 'TTFB',
          value: ttfb,
          rating: getRating('TTFB', ttfb),
          delta: 0,
          id: `ttfb-${Date.now()}`,
          navigationType: (performance as any).navigation?.type || 'unknown'
        });
      }
    }

    // Cleanup function
    return () => {
      observersRef.current.forEach(observer => observer.disconnect());
      observersRef.current = [];
    };
  }, [reportMetric]);

  const getMetrics = useCallback(() => {
    return { ...metricsRef.current };
  }, []);

  const getMetricsSummary = useCallback(() => {
    const metrics = getMetrics();
    const summary = {
      performance_score: 0,
      metrics_count: 0,
      good_metrics: 0,
      needs_improvement: 0,
      poor_metrics: 0
    };

    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== undefined) {
        summary.metrics_count++;
        const metricName = key.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '') as keyof typeof THRESHOLDS;
        
        if (THRESHOLDS[metricName]) {
          const rating = getRating(metricName, value);
          if (rating === 'good') summary.good_metrics++;
          else if (rating === 'needs-improvement') summary.needs_improvement++;
          else summary.poor_metrics++;
        }
      }
    });

    summary.performance_score = summary.metrics_count > 0 
      ? Math.round((summary.good_metrics / summary.metrics_count) * 100)
      : 0;

    return summary;
  }, [getMetrics]);

  return {
    reportMetric,
    getMetrics,
    getMetricsSummary
  };
};
