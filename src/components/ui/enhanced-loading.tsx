import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  className, 
  children 
}) => {
  return (
    <div className={cn("animate-pulse", className)}>
      {children || (
        <div className="bg-muted rounded-md h-4 w-full" />
      )}
    </div>
  );
};

interface PageLoadingProps {
  message?: string;
  showProgress?: boolean;
}

export const PageLoading: React.FC<PageLoadingProps> = ({ 
  message = "Loading...",
  showProgress = false 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="h-8 w-64 bg-gradient-to-r from-muted via-muted/50 to-muted rounded animate-pulse mx-auto" />
          <div className="h-4 w-48 bg-muted/60 rounded animate-pulse mx-auto" />
        </motion.div>
        
        {showProgress && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-1 bg-primary rounded-full w-64 mx-auto origin-left"
          />
        )}
        
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

interface HeroLoadingProps {
  className?: string;
}

export const HeroLoading: React.FC<HeroLoadingProps> = ({ className }) => {
  return (
    <div className={cn("h-screen bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 animate-pulse relative", className)}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-8 w-64 bg-muted rounded mx-auto animate-pulse" />
          <div className="h-4 w-48 bg-muted/60 rounded mx-auto animate-pulse" />
        </div>
      </div>
    </div>
  );
};

interface ComponentLoadingProps {
  height?: string | number;
  className?: string;
  lines?: number;
}

export const ComponentLoading: React.FC<ComponentLoadingProps> = ({ 
  height = "200px",
  className,
  lines = 3
}) => {
  return (
    <div 
      className={cn("bg-muted/30 rounded-lg border border-muted animate-pulse p-4", className)}
      style={{ height }}
    >
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className="h-4 bg-muted rounded"
            style={{ width: `${100 - (i * 10)}%` }}
          />
        ))}
      </div>
    </div>
  );
};