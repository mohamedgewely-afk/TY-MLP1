
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

const isDAMUrl = (url: string): boolean => {
  return url.includes('dam.alfuttaim.com') || url.includes('alfuttaim.com/dx/api/dam');
};

const isExternalImageService = (url: string): boolean => {
  return url.includes('unsplash.com') || 
         url.includes('pexels.com') || 
         url.includes('pixabay.com') ||
         url.includes('cloudinary.com') ||
         isDAMUrl(url);
};

const getOptimizedImageUrl = (src: string, isMobile: boolean, quality: string): string => {
  // For DAM URLs and other external image services, use original URL to avoid breaking
  if (isExternalImageService(src)) {
    return src;
  }
  
  // For local or compatible URLs, could add optimization parameters here
  // But for safety, return original URL
  return src;
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

  // Always use original URL for DAM and external services
  const optimizedSrc = useMemo(() => {
    if (!shouldLoad) return '';
    return getOptimizedImageUrl(src, isMobile, quality);
  }, [src, shouldLoad, isMobile, quality]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    console.warn('Image failed to load:', src);
    setHasError(true);
    onError?.();
  }, [onError, src]);

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
          src={optimizedSrc}
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
