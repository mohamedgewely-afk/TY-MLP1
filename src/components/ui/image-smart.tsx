
import React, { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';
import { usePerformantIntersection } from '@/hooks/use-performant-intersection';
import { useNetworkAware } from '@/hooks/use-network-aware';

interface ImageSmartProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: 'low' | 'medium' | 'high';
  aspectRatio?: string;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
  fallback?: string;
  width?: number;
  height?: number;
}

// Generate optimized image URLs with modern formats
const generateImageSources = (src: string, quality: string, width?: number) => {
  // In production, this would integrate with your CDN's image optimization
  const baseUrl = src.includes('unsplash.com') ? src : src;
  const qualityParams = {
    low: { q: 65, w: width ? Math.min(width, 800) : 800 },
    medium: { q: 80, w: width ? Math.min(width, 1200) : 1200 },
    high: { q: 95, w: width ? Math.min(width, 1600) : 1600 }
  };
  
  const params = qualityParams[quality as keyof typeof qualityParams] || qualityParams.medium;
  
  if (src.includes('unsplash.com')) {
    const url = new URL(src);
    url.searchParams.set('q', params.q.toString());
    url.searchParams.set('w', params.w.toString());
    url.searchParams.set('fm', 'webp');
    url.searchParams.set('fit', 'crop');
    return {
      webp: url.toString(),
      avif: url.toString().replace('fm=webp', 'fm=avif'),
      fallback: url.toString().replace('fm=webp', 'fm=jpg')
    };
  }
  
  return {
    webp: src,
    avif: src,
    fallback: src
  };
};

const ImageSmart: React.FC<ImageSmartProps> = memo(({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '100vw',
  quality,
  aspectRatio,
  loading,
  onLoad,
  onError,
  fallback,
  width,
  height
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { targetRef, isIntersecting } = usePerformantIntersection({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });
  
  const { getOptimalImageQuality, isSlowConnection } = useNetworkAware();
  
  const shouldLoad = priority || isIntersecting;
  const imageQuality = quality || getOptimalImageQuality();
  const loadingStrategy = loading || (priority ? 'eager' : 'lazy');
  
  // Generate image sources with modern formats
  const imageSources = generateImageSources(src, imageQuality, width);
  
  useEffect(() => {
    if (shouldLoad && !currentSrc && !hasError) {
      // Use WebP for modern browsers, fallback to original
      const testWebP = () => {
        return new Promise<boolean>((resolve) => {
          const webP = new Image();
          webP.onload = webP.onerror = () => resolve(webP.height === 2);
          webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
      };
      
      testWebP().then((supportsWebP) => {
        if (supportsWebP) {
          setCurrentSrc(imageSources.webp);
        } else {
          setCurrentSrc(imageSources.fallback);
        }
      });
    }
  }, [shouldLoad, currentSrc, hasError, imageSources.webp, imageSources.fallback]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    if (fallback && currentSrc !== fallback) {
      setCurrentSrc(fallback);
    } else {
      setHasError(true);
      onError?.();
    }
  };

  // Error state
  if (hasError) {
    return (
      <div 
        ref={targetRef}
        className={cn(
          'bg-muted flex items-center justify-center text-muted-foreground',
          'border border-border rounded-md',
          className
        )}
        style={{ aspectRatio }}
        role="img"
        aria-label={`Failed to load: ${alt}`}
      >
        <span className="text-sm text-center px-4">Image unavailable</span>
      </div>
    );
  }

  return (
    <div 
      ref={(el) => {
        targetRef.current = el;
        containerRef.current = el;
      }}
      className={cn('relative overflow-hidden bg-muted', className)}
      style={{ aspectRatio }}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse"
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}
      
      {/* Optimized image with modern formats */}
      {currentSrc && (
        <picture>
          {!isSlowConnection && (
            <>
              <source srcSet={imageSources.avif} type="image/avif" />
              <source srcSet={imageSources.webp} type="image/webp" />
            </>
          )}
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            sizes={sizes}
            width={width}
            height={height}
            loading={loadingStrategy}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              willChange: isLoaded ? 'auto' : 'opacity',
              transform: 'translate3d(0, 0, 0)' // Force GPU layer
            }}
          />
        </picture>
      )}
    </div>
  );
});

ImageSmart.displayName = 'ImageSmart';

// Add shimmer keyframes if not already present
if (typeof document !== 'undefined' && !document.getElementById('image-shimmer-styles')) {
  const style = document.createElement('style');
  style.id = 'image-shimmer-styles';
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(style);
}

export default ImageSmart;
