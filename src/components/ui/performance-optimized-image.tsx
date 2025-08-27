
import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useOptimizedIntersection } from '@/hooks/use-optimized-intersection';
import { getOptimalImageConfig, generateResponsiveImageUrl } from '@/utils/image-optimization';
import { useNetworkAware } from '@/hooks/use-network-aware';
import { useOptimizedDeviceInfo } from '@/hooks/use-optimized-device-info';
import { useMemoryPressure } from '@/utils/performance-web-vitals';

interface PerformanceOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const PerformanceOptimizedImage: React.FC<PerformanceOptimizedImageProps> = React.memo(({
  src,
  alt,
  className = '',
  priority = false,
  sizes,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { targetRef, isIntersecting } = useOptimizedIntersection<HTMLDivElement>();
  const { isMobile } = useOptimizedDeviceInfo();
  const { isSlowConnection } = useNetworkAware();
  const { isLowMemory } = useMemoryPressure();

  const imageConfig = useMemo(() => 
    getOptimalImageConfig(isMobile, isSlowConnection, isLowMemory()),
    [isMobile, isSlowConnection, isLowMemory]
  );

  const shouldLoad = priority || isIntersecting;

  const optimizedSrc = useMemo(() => {
    if (!shouldLoad) return '';
    return generateResponsiveImageUrl(src, isMobile ? 800 : 1200, imageConfig.quality);
  }, [src, shouldLoad, isMobile, imageConfig.quality]);

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
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/60 animate-pulse" />
      )}
      
      {optimizedSrc && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300 will-change-[opacity]',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          sizes={sizes || imageConfig.sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={{ 
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden'
          }}
        />
      )}
    </div>
  );
});

PerformanceOptimizedImage.displayName = 'PerformanceOptimizedImage';
