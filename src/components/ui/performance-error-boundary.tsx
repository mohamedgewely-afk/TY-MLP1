import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showHomeButton?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

export class PerformanceErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    retryCount: 0
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🚗 Toyota Performance Error:', error, errorInfo);
    
    // Enhanced error reporting
    if ('scheduler' in window && 'postTask' in (window as any).scheduler) {
      (window as any).scheduler.postTask(() => {
        const errorReport = {
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: Date.now(),
          url: window.location.pathname,
          userAgent: navigator.userAgent.slice(0, 100),
          retryCount: this.state.retryCount
        };
        
        // Store multiple error reports for pattern analysis
        const existingErrors = JSON.parse(sessionStorage.getItem('toyota-error-reports') || '[]');
        existingErrors.push(errorReport);
        
        // Keep only last 10 errors to prevent storage bloat
        const latestErrors = existingErrors.slice(-10);
        sessionStorage.setItem('toyota-error-reports', JSON.stringify(latestErrors));
      }, { priority: 'background' });
    }

    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState((prevState) => ({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  private handleHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const showAdvancedOptions = this.state.retryCount >= 2;

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-muted/30 rounded-lg border border-muted min-h-[400px]">
          <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            {showAdvancedOptions 
              ? "We're having trouble loading this section. Try refreshing the page or return to the home page."
              : "We encountered an issue loading this section. This doesn't affect the rest of your experience."
            }
          </p>
          
          <div className="flex gap-2 flex-wrap justify-center">
            <Button 
              onClick={this.handleRetry}
              variant="outline"
              className="gap-2"
              disabled={this.state.retryCount >= 3}
            >
              <RefreshCw className="h-4 w-4" />
              {this.state.retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
            </Button>
            
            {(showAdvancedOptions || this.props.showHomeButton) && (
              <Button 
                onClick={this.handleHome}
                variant="default"
                className="gap-2"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
            )}
          </div>
          
          {showAdvancedOptions && (
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Retry count: {this.state.retryCount}/3
            </p>
          )}
          
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 max-w-2xl">
              <summary className="cursor-pointer text-sm text-muted-foreground">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-xs bg-destructive/10 p-4 rounded overflow-auto max-h-40">
                {this.state.error.stack}
              </pre>
              {this.state.errorInfo && (
                <pre className="mt-2 text-xs bg-muted p-4 rounded overflow-auto max-h-40">
                  Component Stack: {this.state.errorInfo.componentStack}
                </pre>
              )}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
