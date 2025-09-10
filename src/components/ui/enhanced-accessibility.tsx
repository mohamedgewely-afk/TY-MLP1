import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { SkipLink } from '@/components/ui/skip-link';

// WCAG 2.1 AA compliant color contrast utilities
export const a11yColors = {
  // Minimum contrast ratios: 4.5:1 for normal text, 3:1 for large text
  highContrast: {
    text: 'text-gray-900 dark:text-gray-100',
    background: 'bg-white dark:bg-gray-900',
    border: 'border-gray-900 dark:border-gray-100'
  },
  mediumContrast: {
    text: 'text-gray-700 dark:text-gray-300',
    background: 'bg-gray-50 dark:bg-gray-800',
    border: 'border-gray-300 dark:border-gray-600'
  }
};

// Enhanced focus management
export const useFocusManagement = () => {
  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  return { trapFocus };
};

// Touch target optimization for mobile
export const TouchOptimized: React.FC<React.PropsWithChildren<{
  className?: string;
  minimumSize?: 'small' | 'medium' | 'large';
}>> = ({ 
  children, 
  className = '',
  minimumSize = 'medium'
}) => {
  const sizeClasses = {
    small: 'min-h-[44px] min-w-[44px]', // iOS minimum
    medium: 'min-h-[48px] min-w-[48px]', // Android minimum
    large: 'min-h-[56px] min-w-[56px]' // Comfortable
  };

  return (
    <div className={`${sizeClasses[minimumSize]} flex items-center justify-center ${className}`}>
      {children}
    </div>
  );
};

// Enhanced keyboard navigation
export const useKeyboardNavigation = () => {
  const handleArrowKeys = (
    e: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    setCurrentIndex: (index: number) => void
  ) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        setCurrentIndex(nextIndex);
        items[nextIndex]?.focus();
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        setCurrentIndex(prevIndex);
        items[prevIndex]?.focus();
        break;
      case 'Home':
        e.preventDefault();
        setCurrentIndex(0);
        items[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        const lastIndex = items.length - 1;
        setCurrentIndex(lastIndex);
        items[lastIndex]?.focus();
        break;
    }
  };

  return { handleArrowKeys };
};

// Screen reader announcements
export const useScreenReader = () => {
  const announceRef = useRef<HTMLDivElement>(null);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.textContent = message;
      
      // Clear after announcement to allow repeat announcements
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  const AnnouncementContainer = () => (
    <div
      ref={announceRef}
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );

  return { announce, AnnouncementContainer };
};

// Skip links for keyboard users
export const SkipLinks: React.FC = () => (
  <div className="sr-only focus-within:not-sr-only">
    <SkipLink href="#main-content">Skip to main content</SkipLink>
    <SkipLink href="#navigation">Skip to navigation</SkipLink>
    <SkipLink href="#vehicle-actions">Skip to vehicle actions</SkipLink>
  </div>
);