import React from 'react';
import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ 
  href, 
  children, 
  className 
}) => {
  return (
    <a
      href={href}
      className={cn(
        // Base styles
        "absolute top-4 left-4 z-50 px-4 py-2 rounded-md",
        "bg-primary text-primary-foreground font-medium",
        "transform -translate-y-20 opacity-0",
        "transition-all duration-200 ease-in-out",
        // Focus styles
        "focus:translate-y-0 focus:opacity-100",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
        // Hover styles
        "hover:bg-primary/90",
        className
      )}
      tabIndex={0}
    >
      {children}
    </a>
  );
};