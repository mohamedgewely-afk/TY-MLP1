import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useKeyboardNavigation, TouchOptimized } from './enhanced-accessibility';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface EnhancedNavigationProps {
  items: NavigationItem[];
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'mobile' | 'sticky';
  className?: string;
  onItemSelect?: (item: NavigationItem) => void;
}

export const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({
  items,
  orientation = 'horizontal',
  variant = 'default',
  className,
  onItemSelect
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { handleArrowKeys } = useKeyboardNavigation();

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const navItems = Array.from(e.currentTarget.querySelectorAll('[role="menuitem"]')) as HTMLElement[];
    handleArrowKeys(e.nativeEvent, navItems, currentIndex, setCurrentIndex);
  }, [currentIndex, handleArrowKeys]);

  const handleItemClick = useCallback((item: NavigationItem, index: number) => {
    setCurrentIndex(index);
    onItemSelect?.(item);
    item.onClick?.();
  }, [onItemSelect]);

  const getVariantClasses = () => {
    switch (variant) {
      case 'mobile':
        return 'flex-col space-y-2 p-4';
      case 'sticky':
        return 'fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 z-50';
      default:
        return orientation === 'horizontal' ? 'flex-row space-x-2' : 'flex-col space-y-2';
    }
  };

  return (
    <nav
      role="menubar"
      aria-orientation={orientation}
      className={cn('flex', getVariantClasses(), className)}
      onKeyDown={handleKeyDown}
    >
      {items.map((item, index) => (
        <TouchOptimized key={item.id} minimumSize="medium">
          {item.href ? (
            <a
              href={item.href}
              role="menuitem"
              tabIndex={index === currentIndex ? 0 : -1}
              className={cn(
                'flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'hover:bg-muted active:bg-muted/80',
                item.disabled && 'opacity-50 pointer-events-none',
                variant === 'mobile' && 'w-full text-left'
              )}
              aria-disabled={item.disabled}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  handleItemClick(item, index);
                }
              }}
            >
              {item.icon}
              <span className={variant === 'mobile' ? '' : 'sr-only sm:not-sr-only'}>
                {item.label}
              </span>
            </a>
          ) : (
            <Button
              variant="ghost"
              role="menuitem"
              tabIndex={index === currentIndex ? 0 : -1}
              className={cn(
                'flex items-center justify-center gap-2',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                variant === 'mobile' && 'w-full justify-start'
              )}
              disabled={item.disabled}
              onClick={() => handleItemClick(item, index)}
            >
              {item.icon}
              <span className={variant === 'mobile' ? '' : 'sr-only sm:not-sr-only'}>
                {item.label}
              </span>
            </Button>
          )}
        </TouchOptimized>
      ))}
    </nav>
  );
};

// Simplified mobile bottom navigation
export const MobileBottomNav: React.FC<{
  items: NavigationItem[];
  activeItem?: string;
  onItemSelect?: (item: NavigationItem) => void;
}> = ({ items, activeItem, onItemSelect }) => {
  return (
    <EnhancedNavigation
      items={items.map(item => ({
        ...item,
        onClick: () => onItemSelect?.(item)
      }))}
      variant="sticky"
      orientation="horizontal"
      className="grid grid-cols-4 gap-1 max-w-screen-sm mx-auto"
    />
  );
};