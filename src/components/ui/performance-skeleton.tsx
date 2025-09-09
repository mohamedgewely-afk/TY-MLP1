import React from 'react';
import { cn } from '@/lib/utils';

interface PerformanceSkeletonProps {
  className?: string;
  variant?: 'default' | 'image' | 'text' | 'button' | 'card' | 'hero';
  count?: number;
  animate?: boolean;
}

const skeletonVariants = {
  default: 'h-4 bg-muted rounded',
  image: 'aspect-video bg-muted rounded-lg',
  text: 'h-4 bg-muted rounded w-3/4',
  button: 'h-10 bg-muted rounded-md w-32',
  card: 'h-48 bg-muted rounded-lg',
  hero: 'h-screen bg-muted'
};

export const PerformanceSkeleton: React.FC<PerformanceSkeletonProps> = ({
  className,
  variant = 'default',
  count = 1,
  animate = true
}) => {
  const baseClasses = cn(
    skeletonVariants[variant],
    animate && 'animate-pulse',
    'will-change-[opacity]',
    className
  );

  if (count === 1) {
    return <div className={baseClasses} />;
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={baseClasses} />
      ))}
    </div>
  );
};

// Specialized skeleton components for common patterns
export const HeroSkeleton: React.FC = () => (
  <div className="relative h-screen bg-muted animate-pulse">
    <div className="absolute bottom-0 left-0 right-0 p-8">
      <div className="space-y-4">
        <div className="h-6 bg-muted-foreground/20 rounded w-2/3" />
        <div className="h-12 bg-muted-foreground/20 rounded w-1/2" />
        <div className="flex gap-4">
          <div className="h-10 bg-muted-foreground/20 rounded w-32" />
          <div className="h-10 bg-muted-foreground/20 rounded w-32" />
        </div>
      </div>
    </div>
  </div>
);

export const CardSkeleton: React.FC = () => (
  <div className="p-6 space-y-4 animate-pulse">
    <div className="h-48 bg-muted rounded-lg" />
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
    </div>
    <div className="h-10 bg-muted rounded w-24" />
  </div>
);

export const GallerySkeleton: React.FC = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="aspect-square bg-muted rounded-lg" />
    ))}
  </div>
);