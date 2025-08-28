
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useOptimizedIntersection } from '@/hooks/use-optimized-intersection';
import { useNetworkAware } from '@/hooks/use-network-aware';
import { useOptimizedDeviceInfo } from '@/hooks/use-optimized-device-info';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: 'hero' | 'gallery' | 'showcase' | 'card' | 'feature';
  onLoad?: () => void;
  onError?: () => void;
}

const ASPECT_RATIOS = {
  hero: 'aspect-[16/9]',
  gallery: 'aspect-[4/3]',
  showcase: 'aspect-[3/2]',
  card: 'aspect-[16/10]',
  feature: 'aspect-[1/1]'
};

const IMAGE_DIMENSIONS = {
  hero: {
    desktop: { width: 1920, height: 1080 },
    mobile: { width: 800, height: 450 }
  },
  gallery: {
    desktop: { width: 800, height: 600 },
    mobile: { width: 600, height: 450 }
  },
  showcase: {
    desktop: { width: 1200, height: 800 },
    mobile: { width: 800, height: 533 }
  },
  card: {
    desktop: { width: 400, height: 250 },
    mobile: { width: 350, height: 219 }
  },
  feature: {
    desktop: { width: 600, height: 600 },
    mobile: { width: 400, height: 400 }
  }
};

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  aspectRatio = 'gallery',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { targetRef, isIntersecting } = useOptimizedIntersection<HTMLDivElement>();
  const { isMobile } = useOptimizedDeviceInfo();
  const { getOptimalImageQuality, isSlowConnection } = useNetworkAware();

  const shouldLoad = priority || isIntersecting;
  const quality = getOptimalImageQuality();
  const dimensions = IMAGE_DIMENSIONS[aspectRatio];
  const targetDimensions = isMobile ? dimensions.mobile : dimensions.desktop;

  // Generate responsive srcset
  const srcSet = useMemo(() => {
    if (!shouldLoad) return '';
    
    const baseUrl = src;
    const mobileSrc = `${baseUrl}?w=${dimensions.mobile.width}&h=${dimensions.mobile.height}&q=${quality === 'low' ? 60 : quality === 'medium' ? 75 : 90}&fm=webp`;
    const desktopSrc = `${baseUrl}?w=${dimensions.desktop.width}&h=${dimensions.desktop.height}&q=${quality === 'low' ? 60 : quality === 'medium' ? 75 : 90}&fm=webp`;
    const desktop2xSrc = `${baseUrl}?w=${dimensions.desktop.width * 2}&h=${dimensions.desktop.height * 2}&q=${quality === 'low' ? 60 : quality === 'medium' ? 75 : 90}&fm=webp`;
    
    return `${mobileSrc} ${dimensions.mobile.width}w, ${desktopSrc} ${dimensions.desktop.width}w, ${desktop2xSrc} ${dimensions.desktop.width * 2}w`;
  }, [src, shouldLoad, quality, dimensions]);

  const sizes = useMemo(() => {
    switch (aspectRatio) {
      case 'hero':
        return '100vw';
      case 'gallery':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      case 'showcase':
        return '(max-width: 768px) 100vw, 80vw';
      case 'card':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw';
      case 'feature':
        return '(max-width: 768px) 90vw, 40vw';
      default:
        return '100vw';
    }
  }, [aspectRatio]);

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
        className={cn(
          'bg-muted flex items-center justify-center text-muted-foreground',
          ASPECT_RATIOS[aspectRatio],
          className
        )}
        role="img"
        aria-label={`Failed to load: ${alt}`}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div 
      ref={targetRef} 
      className={cn('relative overflow-hidden', ASPECT_RATIOS[aspectRatio], className)}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/60 animate-pulse" />
      )}
      
      {/* Main image */}
      {shouldLoad && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          width={targetDimensions.width}
          height={targetDimensions.height}
        />
      )}
    </div>
  );
};
