
import React, { useState, useCallback } from 'react';
import { Skeleton } from './skeleton';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  webpSrc?: string;
  avifSrc?: string;
  blurDataURL?: string;
  aspectRatio?: string;
  showSkeleton?: boolean;
  onLoadComplete?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc,
  webpSrc,
  avifSrc,
  blurDataURL,
  aspectRatio,
  showSkeleton = true,
  onLoadComplete,
  onError,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoadComplete?.();
  }, [onLoadComplete]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    } else {
      onError?.();
    }
  }, [fallbackSrc, currentSrc, onError]);

  // Generate srcSet for responsive images
  const generateSrcSet = (baseSrc: string) => {
    const srcWithoutExt = baseSrc.split('.').slice(0, -1).join('.');
    const ext = baseSrc.split('.').pop();
    
    return [
      `${baseSrc} 1x`,
      `${srcWithoutExt}@2x.${ext} 2x`,
      `${srcWithoutExt}@3x.${ext} 3x`
    ].join(', ');
  };

  const imageElement = (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      srcSet={generateSrcSet(currentSrc)}
      className={cn(
        'transition-opacity duration-300',
        isLoading ? 'opacity-0' : 'opacity-100',
        className
      )}
      onLoad={handleLoad}
      onError={handleError}
      loading="lazy"
      decoding="async"
    />
  );

  const content = (
    <div 
      className={cn(
        'relative overflow-hidden',
        aspectRatio && `aspect-[${aspectRatio}]`
      )}
    >
      {/* Blur placeholder */}
      {blurDataURL && isLoading && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-md"
        />
      )}
      
      {/* Loading skeleton */}
      {showSkeleton && isLoading && !blurDataURL && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      
      {/* Main image */}
      {imageElement}
      
      {/* Error state */}
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );

  // Use picture element for format optimization if modern formats are provided
  if (webpSrc || avifSrc) {
    return (
      <picture>
        {avifSrc && <source srcSet={generateSrcSet(avifSrc)} type="image/avif" />}
        {webpSrc && <source srcSet={generateSrcSet(webpSrc)} type="image/webp" />}
        {content}
      </picture>
    );
  }

  return content;
};
