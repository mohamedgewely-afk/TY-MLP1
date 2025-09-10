import { useEffect, useRef } from 'react';

interface PerformanceBudget {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  bundleSize: number; // JavaScript bundle size in KB
  imageCount: number; // Maximum number of images per page
}

const DEFAULT_BUDGET: PerformanceBudget = {
  lcp: 2500, // 2.5s
  fid: 100, // 100ms
  cls: 0.1, // 0.1
  fcp: 1800, // 1.8s
  ttfb: 600, // 600ms
  bundleSize: 500, // 500KB
  imageCount: 20
};

interface BudgetViolation {
  metric: keyof PerformanceBudget;
  actual: number;
  budget: number;
  severity: 'warning' | 'error';
}

export const usePerformanceBudget = (customBudget?: Partial<PerformanceBudget>) => {
  const budget = { ...DEFAULT_BUDGET, ...customBudget };
  const violationsRef = useRef<BudgetViolation[]>([]);

  const checkBudget = (metric: keyof PerformanceBudget, value: number) => {
    const budgetValue = budget[metric];
    if (value > budgetValue) {
      const severity = value > budgetValue * 1.5 ? 'error' : 'warning';
      const violation: BudgetViolation = {
        metric,
        actual: value,
        budget: budgetValue,
        severity
      };

      violationsRef.current.push(violation);
      
      console.warn(`🚗 Toyota Performance Budget Violation:`, {
        metric,
        actual: value,
        budget: budgetValue,
        percentage: Math.round((value / budgetValue) * 100),
        severity
      });

      // Store violations for reporting
      const existingViolations = JSON.parse(
        sessionStorage.getItem('toyota-budget-violations') || '[]'
      );
      
      existingViolations.push({
        ...violation,
        timestamp: Date.now(),
        url: window.location.pathname
      });

      sessionStorage.setItem('toyota-budget-violations', JSON.stringify(
        existingViolations.slice(-50) // Keep last 50 violations
      ));
    }
  };

  const getBudgetStatus = () => {
    const violations = violationsRef.current;
    const errors = violations.filter(v => v.severity === 'error').length;
    const warnings = violations.filter(v => v.severity === 'warning').length;

    return {
      status: errors > 0 ? 'error' : warnings > 0 ? 'warning' : 'good',
      violations: violations.length,
      errors,
      warnings
    };
  };

  const resetViolations = () => {
    violationsRef.current = [];
  };

  // Auto-monitor Core Web Vitals against budget
  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            checkBudget('lcp', entry.startTime);
            break;
          case 'first-input':
            checkBudget('fid', (entry as any).processingStart - entry.startTime);
            break;
          case 'layout-shift':
            if (!(entry as any).hadRecentInput) {
              checkBudget('cls', (entry as any).value);
            }
            break;
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              checkBudget('fcp', entry.startTime);
            }
            break;
          case 'navigation':
            checkBudget('ttfb', (entry as any).responseStart);
            break;
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift', 'paint', 'navigation'] });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }

    return () => observer.disconnect();
  }, []);

  return {
    budget,
    checkBudget,
    getBudgetStatus,
    resetViolations,
    violations: violationsRef.current
  };
};

// Component for displaying budget status in development
export const PerformanceBudgetDisplay = () => {
  const { getBudgetStatus, violations } = usePerformanceBudget();
  const status = getBudgetStatus();

  if (process.env.NODE_ENV !== 'development' || status.violations === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 bg-background border rounded-lg p-3 shadow-lg max-w-xs">
      <h4 className={`font-semibold text-sm ${
        status.status === 'error' ? 'text-red-600' : 
        status.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
      }`}>
        Performance Budget
      </h4>
      <div className="text-xs mt-1 space-y-1">
        {status.errors > 0 && (
          <div className="text-red-600">⚠️ {status.errors} errors</div>
        )}
        {status.warnings > 0 && (
          <div className="text-yellow-600">⚠️ {status.warnings} warnings</div>
        )}
        <div className="text-muted-foreground">
          {violations.length} violations total
        </div>
      </div>
    </div>
  );
};