
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { usePerformanceConfig, gpuOptimizedStyles, a11yUtils } from '@/utils/performance-optimization';
import { useIntersectionObserver } from '@/hooks/use-intersection-observer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: 'low' | 'medium' | 'high';
  blur?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '100vw',
  quality,
  blur = true,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const config = usePerformanceConfig();
  
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true
  });

  const shouldLoad = priority || isIntersecting;
  const imageQuality = quality || config.images.quality;
  const showBlur = blur && config.images.blur && !isLoaded;

  // Generate responsive src based on quality
  const getOptimizedSrc = (baseUrl: string, targetQuality: string) => {
    // In a real implementation, this would generate different image URLs
    // For now, we'll use the original URL
    return baseUrl;
  };

  useEffect(() => {
    if (shouldLoad && !currentSrc) {
      setCurrentSrc(getOptimizedSrc(src, imageQuality));
    }
  }, [shouldLoad, src, imageQuality, currentSrc]);

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
        ref={targetRef}
        className={cn(
          'bg-muted flex items-center justify-center text-muted-foreground',
          a11yUtils.highContrast,
          className
        )}
        role="img"
        aria-label={`Failed to load image: ${alt}`}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div 
      ref={targetRef}
      className={cn('relative overflow-hidden', className)}
      style={gpuOptimizedStyles}
    >
      {/* Blur placeholder */}
      {showBlur && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{
            backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
        />
      )}
      
      {/* Main image */}
      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            a11yUtils.respectMotion
          )}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          style={gpuOptimizedStyles}
        />
      )}
    </div>
  );
};

// Add shimmer animation to global styles
const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

// Inject styles if not already present
if (typeof document !== 'undefined' && !document.getElementById('shimmer-styles')) {
  const style = document.createElement('style');
  style.id = 'shimmer-styles';
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}
