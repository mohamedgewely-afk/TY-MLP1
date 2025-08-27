
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'hero';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const EnhancedSkeleton: React.FC<EnhancedSkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  animation = 'pulse',
  width,
  height,
  lines = 1
}) => {
  const baseClasses = cn(
    'bg-muted',
    {
      'animate-pulse': animation === 'pulse',
      'bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]': animation === 'wave'
    }
  );

  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 rounded';
      case 'circular':
        return 'rounded-full aspect-square';
      case 'rectangular':
        return 'rounded-md';
      case 'card':
        return 'rounded-lg h-64';
      case 'hero':
        return 'rounded-lg h-96 w-full';
      default:
        return 'rounded-md';
    }
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              getVariantClasses(),
              index === lines - 1 && 'w-3/4' // Last line shorter
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('space-y-4 p-4', className)}>
        <div className={cn(baseClasses, 'h-48 rounded-lg')} />
        <div className="space-y-2">
          <div className={cn(baseClasses, 'h-4 rounded w-3/4')} />
          <div className={cn(baseClasses, 'h-4 rounded w-1/2')} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(baseClasses, getVariantClasses(), className)}
      style={style}
    />
  );
};

// Predefined skeleton layouts for common use cases
export const VehicleCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('rounded-lg border border-border bg-card p-4 space-y-4', className)}>
    <EnhancedSkeleton variant="rectangular" height="200px" />
    <div className="space-y-2">
      <EnhancedSkeleton variant="text" width="60%" />
      <EnhancedSkeleton variant="text" width="40%" />
      <EnhancedSkeleton variant="text" width="80%" />
    </div>
  </div>
);

export const HeroSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('relative', className)}>
    <EnhancedSkeleton variant="hero" />
    <div className="absolute inset-0 flex flex-col justify-center items-start p-8 space-y-4">
      <EnhancedSkeleton variant="text" width="60%" height="40px" />
      <EnhancedSkeleton variant="text" width="80%" lines={2} />
      <EnhancedSkeleton variant="rectangular" width="200px" height="48px" className="rounded-full" />
    </div>
  </div>
);

export const ListSkeleton: React.FC<{ items?: number; className?: string }> = ({ 
  items = 6, 
  className 
}) => (
  <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
    {Array.from({ length: items }).map((_, index) => (
      <VehicleCardSkeleton key={index} />
    ))}
  </div>
);

export default EnhancedSkeleton;
