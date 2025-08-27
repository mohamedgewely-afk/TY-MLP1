
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
}

// Generate optimized CDN URLs for different formats and sizes
const generateImageSources = (src: string, width: number, height: number) => {
  const isUnsplash = src.includes('unsplash.com');
  const isDamAlfuttaim = src.includes('dam.alfuttaim.com');
  
  if (isUnsplash) {
    const baseUrl = new URL(src);
    
    // Generate different sizes for responsive loading
    const sizes = [
      { width: Math.min(width, 400), suffix: 'sm' },
      { width: Math.min(width, 768), suffix: 'md' },
      { width: Math.min(width, 1200), suffix: 'lg' },
      { width: width, suffix: 'xl' }
    ];
    
    const sources = sizes.map(size => {
      // AVIF - best compression
      const avifUrl = new URL(src);
      avifUrl.searchParams.set('fm', 'avif');
      avifUrl.searchParams.set('w', size.width.toString());
      avifUrl.searchParams.set('h', Math.round(size.width * (height / width)).toString());
      avifUrl.searchParams.set('q', '85');
      avifUrl.searchParams.set('fit', 'crop');
      
      // WebP - good compression with wide support
      const webpUrl = new URL(src);
      webpUrl.searchParams.set('fm', 'webp');
      webpUrl.searchParams.set('w', size.width.toString());
      webpUrl.searchParams.set('h', Math.round(size.width * (height / width)).toString());
      webpUrl.searchParams.set('q', '85');
      webpUrl.searchParams.set('fit', 'crop');
      
      // JPEG fallback
      const jpegUrl = new URL(src);
      jpegUrl.searchParams.set('fm', 'jpg');
      jpegUrl.searchParams.set('w', size.width.toString());
      jpegUrl.searchParams.set('h', Math.round(size.width * (height / width)).toString());
      jpegUrl.searchParams.set('q', '85');
      jpegUrl.searchParams.set('fit', 'crop');
      
      return {
        avif: avifUrl.toString(),
        webp: webpUrl.toString(),
        jpeg: jpegUrl.toString(),
        width: size.width
      };
    });
    
    return sources;
  }
  
  // For other CDNs or local images, return original
  return [{
    avif: src,
    webp: src,
    jpeg: src,
    width: width
  }];
};

const HeroImage: React.FC<HeroImageProps> = memo(({
  src,
  alt,
  className = '',
  width,
  height,
  priority = true,
  onLoad,
  onError
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

  // Generate srcSet and sizes for responsive images
  const srcSet = imageSources.map(source => 
    `${source.webp} ${source.width}w`
  ).join(', ');
  
  const sizes = [
    '(max-width: 640px) 100vw',
    '(max-width: 768px) 100vw', 
    '(max-width: 1024px) 100vw',
    '100vw'
  ].join(', ');

  return (
    <div 
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio }}
    >
      {/* Loading skeleton - only show while loading */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-shimmer"
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            backgroundSize: '200% 100%',
          }}
        />
      )}
      
      {/* Optimized picture element with modern formats */}
      <picture>
        {/* AVIF sources for modern browsers */}
        {imageSources.map((source, index) => (
          <source
            key={`avif-${index}`}
            srcSet={source.avif}
            type="image/avif"
            media={index === 0 ? '(max-width: 640px)' : 
                   index === 1 ? '(max-width: 768px)' :
                   index === 2 ? '(max-width: 1200px)' : undefined}
          />
        ))}
        
        {/* WebP sources for broader support */}
        {imageSources.map((source, index) => (
          <source
            key={`webp-${index}`}
            srcSet={source.webp}
            type="image/webp"
            media={index === 0 ? '(max-width: 640px)' : 
                   index === 1 ? '(max-width: 768px)' :
                   index === 2 ? '(max-width: 1200px)' : undefined}
          />
        ))}
        
        {/* Main image with fallback */}
        <img
          ref={imgRef}
          src={imageSources[imageSources.length - 1].jpeg}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            // Prevent layout shift with explicit aspect ratio
            aspectRatio: `${width} / ${height}`,
            // GPU acceleration
            transform: 'translate3d(0, 0, 0)',
            willChange: isLoaded ? 'auto' : 'opacity'
          }}
        />
      </picture>
    </div>
  );
});

HeroImage.displayName = 'HeroImage';

export default HeroImage;
