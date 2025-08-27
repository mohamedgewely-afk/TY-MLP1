
import React, { useState, useRef, memo } from 'react';
import { cn } from '@/lib/utils';

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  sizes?: string;
}

// Generate optimized CDN URLs for AVIF/WebP with proper quality settings
const generateImageSources = (src: string, width: number, height: number) => {
  const isUnsplash = src.includes('unsplash.com');
  
  if (isUnsplash) {
    const baseUrl = new URL(src);
    
    // AVIF - 50% smaller than WebP
    const avifUrl = new URL(src);
    avifUrl.searchParams.set('fm', 'avif');
    avifUrl.searchParams.set('w', width.toString());
    avifUrl.searchParams.set('h', height.toString());
    avifUrl.searchParams.set('q', '85');
    avifUrl.searchParams.set('fit', 'crop');
    avifUrl.searchParams.set('auto', 'format');
    
    // WebP - 30% smaller than JPEG
    const webpUrl = new URL(src);
    webpUrl.searchParams.set('fm', 'webp');
    webpUrl.searchParams.set('w', width.toString());
    webpUrl.searchParams.set('h', height.toString());
    webpUrl.searchParams.set('q', '85');
    webpUrl.searchParams.set('fit', 'crop');
    webpUrl.searchParams.set('auto', 'format');
    
    // JPEG fallback
    const jpegUrl = new URL(src);
    jpegUrl.searchParams.set('fm', 'jpg');
    jpegUrl.searchParams.set('w', width.toString());
    jpegUrl.searchParams.set('h', height.toString());
    jpegUrl.searchParams.set('q', '85');
    jpegUrl.searchParams.set('fit', 'crop');
    jpegUrl.searchParams.set('auto', 'format');
    
    return {
      avif: avifUrl.toString(),
      webp: webpUrl.toString(),
      jpeg: jpegUrl.toString()
    };
  }
  
  return {
    avif: src,
    webp: src,
    jpeg: src
  };
};

const HeroImage: React.FC<HeroImageProps> = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  priority = true,
  onLoad,
  onError,
  sizes = '100vw'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const imageSources = generateImageSources(src, width, height);
  const aspectRatio = height / width;

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
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
      className={cn('relative overflow-hidden hero-container', className)}
      style={{ aspectRatio }}
    >
      {/* Loading skeleton - only show while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 hero-skeleton" />
      )}
      
      {/* Optimized picture element with modern formats for LCP */}
      <picture>
        {/* AVIF for 50% better compression */}
        <source
          srcSet={imageSources.avif}
          type="image/avif"
        />
        
        {/* WebP for broad support and 30% better compression */}
        <source
          srcSet={imageSources.webp}
          type="image/webp"
        />
        
        {/* Main hero image with all LCP optimizations */}
        <img
          ref={imgRef}
          src={imageSources.jpeg}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'hero-image gpu-accelerated',
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            // Explicit aspect ratio prevents CLS
            aspectRatio: `${width} / ${height}`,
            // GPU acceleration for smooth animations
            transform: 'translate3d(0, 0, 0)',
            willChange: isLoaded ? 'auto' : 'opacity',
            backfaceVisibility: 'hidden'
          }}
        />
      </picture>
    </div>
  );
});

HeroImage.displayName = 'HeroImage';

export default HeroImage;
