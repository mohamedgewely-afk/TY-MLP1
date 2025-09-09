import React, { useState, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useOptimizedIntersection } from '@/hooks/use-optimized-intersection';
import { getOptimalImageConfig } from '@/utils/image-optimization';
import { useNetworkAware } from '@/hooks/use-network-aware';
import { useOptimizedDeviceInfo } from '@/hooks/use-optimized-device-info';
import { optimizedSprings } from '@/utils/animation-performance';

interface OptimizedMotionImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  // Motion props
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  // Performance props
  enableGPU?: boolean;
  reduceMotionFallback?: any;
}

export const OptimizedMotionImage: React.FC<OptimizedMotionImageProps> = React.memo(({
  src,
  alt,
  className = '',
  priority = false,
  sizes,
  onLoad,
  onError,
  initial = { opacity: 0, scale: 1.05 },
  animate = { opacity: 1, scale: 1 },
  exit = { opacity: 0, scale: 0.95 },
  transition,
  enableGPU = true,
  reduceMotionFallback = { opacity: 1, scale: 1 }
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { targetRef, isIntersecting } = useOptimizedIntersection<HTMLDivElement>();
  const { isMobile } = useOptimizedDeviceInfo();
  const { isSlowConnection } = useNetworkAware();
  const prefersReducedMotion = useReducedMotion();

  const imageConfig = useMemo(() => 
    getOptimalImageConfig(isMobile, isSlowConnection, false),
    [isMobile, isSlowConnection]
  );

  const shouldLoad = priority || isIntersecting;

  // Optimize transition based on motion preferences and device capabilities
  const optimizedTransition = useMemo(() => {
    if (prefersReducedMotion) {
      return { duration: 0.1 };
    }
    
    if (transition) {
      return transition;
    }
    
    return isSlowConnection || isMobile 
      ? optimizedSprings.fast
      : optimizedSprings.smooth;
  }, [prefersReducedMotion, transition, isSlowConnection, isMobile]);

  // Motion variants with performance optimization
  const motionVariants = useMemo(() => ({
    initial: prefersReducedMotion ? reduceMotionFallback : {
      ...initial,
      ...(enableGPU && { willChange: 'opacity, transform' })
    },
    animate: prefersReducedMotion ? reduceMotionFallback : {
      ...animate,
      willChange: 'auto'
    },
    exit: prefersReducedMotion ? reduceMotionFallback : {
      ...exit,
      ...(enableGPU && { willChange: 'opacity, transform' })
    }
  }), [prefersReducedMotion, initial, animate, exit, enableGPU, reduceMotionFallback]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  if (hasError) {
    return (
      <div 
        ref={targetRef}
        className={cn('bg-muted flex items-center justify-center text-muted-foreground', className)}
        role="img"
        aria-label={`Failed to load: ${alt}`}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div ref={targetRef} className={cn('relative overflow-hidden', className)}>
      {/* Optimized blur placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/40 animate-pulse" />
      )}
      
      {shouldLoad && (
        <motion.img
          src={src}
          alt={alt}
          className={cn(
            'w-full h-full object-cover',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          sizes={sizes || imageConfig.sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          initial={motionVariants.initial}
          animate={motionVariants.animate}
          exit={motionVariants.exit}
          transition={optimizedTransition}
          style={{ 
            ...(enableGPU && {
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden'
            })
          }}
        />
      )}
    </div>
  );
});

OptimizedMotionImage.displayName = 'OptimizedMotionImage';