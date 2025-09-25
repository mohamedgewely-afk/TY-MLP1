
import React, { forwardRef } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { a11yUtils, performanceMonitor } from '@/utils/performance-optimization';

interface AccessibleButtonProps extends ButtonProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  hapticFeedback?: boolean;
  trackInteraction?: string;
  loadingText?: string;
  successText?: string;
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ 
    className, 
    children, 
    onClick,
    disabled,
    hapticFeedback = false,
    trackInteraction,
    loadingText,
    successText,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedby,
    ...props 
  }, ref) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const [feedback, setFeedback] = React.useState<'idle' | 'loading' | 'success'>('idle');

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      // Haptic feedback
      if (hapticFeedback && 'vibrate' in navigator) {
        navigator.vibrate(10);
      }

      // Performance tracking
      const endMeasure = trackInteraction 
        ? performanceMonitor.measureInteraction(trackInteraction)
        : null;

      setIsPressed(true);
      
      try {
        if (onClick) {
          setFeedback('loading');
          await onClick(event);
          setFeedback('success');
          setTimeout(() => setFeedback('idle'), 1000);
        }
      } catch (error) {
        setFeedback('idle');
        console.error('Button interaction error:', error);
      } finally {
        endMeasure?.();
        setTimeout(() => setIsPressed(false), 150);
      }
    };

    const getButtonText = () => {
      if (feedback === 'loading' && loadingText) return loadingText;
      if (feedback === 'success' && successText) return successText;
      return children;
    };

    const getAriaLabel = () => {
      if (feedback === 'loading') return `${ariaLabel || children} - Loading`;
      if (feedback === 'success') return `${ariaLabel || children} - Success`;
      return ariaLabel;
    };

    return (
      <Button
        ref={ref}
        className={cn(
          a11yUtils.focusRing,
          a11yUtils.touchTarget,
          a11yUtils.highContrast,
          a11yUtils.respectMotion,
          'relative overflow-hidden',
          'transform transition-transform duration-150',
          isPressed && !disabled && 'scale-95',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
        onClick={handleClick}
        disabled={disabled || feedback === 'loading'}
        aria-label={getAriaLabel()}
        aria-describedby={ariaDescribedby}
        aria-pressed={isPressed}
        {...props}
      >
        <span className={cn(
          'transition-opacity duration-200',
          feedback === 'loading' && 'opacity-70'
        )}>
          {getButtonText()}
        </span>
        
        {/* Loading indicator */}
        {feedback === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </Button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
