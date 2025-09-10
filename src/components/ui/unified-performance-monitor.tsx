import React, { useEffect, useRef } from 'react';
import { useCoreWebVitals } from '@/utils/performance-core-vitals';
import { useWebVitalsOptimized } from '@/utils/performance-web-vitals';

interface UnifiedPerformanceMonitorProps {
  enabled?: boolean;
  reportingEnabled?: boolean;
}

export const UnifiedPerformanceMonitor: React.FC<UnifiedPerformanceMonitorProps> = ({
  enabled = true,
  reportingEnabled = true
}) => {
  const reportedRef = useRef(false);
  
  // Core Web Vitals monitoring
  const { reportMetric: reportCoreMetric, getMetricsSummary } = useCoreWebVitals();
  
  // Enhanced Web Vitals with mobile optimizations
  const { reportMetric: reportWebVital } = useWebVitalsOptimized();

  useEffect(() => {
    if (!enabled || reportedRef.current) return;

    // Report initial page load
    const reportInitialMetrics = () => {
      if (reportingEnabled) {
        const summary = getMetricsSummary();
        console.log('🚗 Toyota Performance Summary:', summary);
        
        // Store for analytics
        sessionStorage.setItem('toyota-performance-summary', JSON.stringify({
          timestamp: Date.now(),
          url: window.location.pathname,
          ...summary
        }));
      }
      reportedRef.current = true;
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      setTimeout(reportInitialMetrics, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(reportInitialMetrics, 1000);
      });
    }

  }, [enabled, reportingEnabled, getMetricsSummary]);

  // This component only monitors, doesn't render anything
  return null;
};

// Hook for accessing performance data
export const usePerformanceData = () => {
  const getStoredSummary = () => {
    try {
      const stored = sessionStorage.getItem('toyota-performance-summary');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  return { getStoredSummary };
};