// Advanced responsive image handling with Toyota-specific optimizations
export interface ResponsiveImageConfig {
  sizes: string;
  srcSet: string;
  src: string;
  quality: 'low' | 'medium' | 'high';
  format: 'webp' | 'avif' | 'jpeg';
  loading: 'eager' | 'lazy';
  fetchPriority: 'high' | 'low' | 'auto';
}

// Breakpoints for Toyota responsive images
const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1440,
  xl: 1920
};

export const generateResponsiveImageConfig = (
  baseUrl: string,
  options: {
    isCritical?: boolean;
    isHero?: boolean;
    containerWidth?: 'full' | 'half' | 'third' | 'quarter';
    deviceType?: 'mobile' | 'tablet' | 'desktop';
    quality?: 'low' | 'medium' | 'high';
  } = {}
): ResponsiveImageConfig => {
  const {
    isCritical = false,
    isHero = false,
    containerWidth = 'full',
    deviceType = 'desktop',
    quality = 'medium'
  } = options;

  // Calculate optimal sizes based on container width
  const getSizesString = () => {
    switch (containerWidth) {
      case 'half':
        return `(max-width: ${BREAKPOINTS.mobile}px) 100vw, (max-width: ${BREAKPOINTS.tablet}px) 100vw, 50vw`;
      case 'third':
        return `(max-width: ${BREAKPOINTS.mobile}px) 100vw, (max-width: ${BREAKPOINTS.tablet}px) 50vw, 33vw`;
      case 'quarter':
        return `(max-width: ${BREAKPOINTS.mobile}px) 100vw, (max-width: ${BREAKPOINTS.tablet}px) 50vw, 25vw`;
      case 'full':
      default:
        return isHero 
          ? `100vw`
          : `(max-width: ${BREAKPOINTS.mobile}px) 100vw, (max-width: ${BREAKPOINTS.tablet}px) 100vw, 100vw`;
    }
  };

  // Generate srcSet based on device capabilities
  const generateSrcSet = () => {
    const widths = isHero 
      ? [480, 768, 1024, 1440, 1920]
      : deviceType === 'mobile'
      ? [320, 480, 768]
      : [480, 768, 1024, 1440];

    return widths
      .map(width => `${generateOptimizedUrl(baseUrl, width, quality)} ${width}w`)
      .join(', ');
  };

  return {
    sizes: getSizesString(),
    srcSet: generateSrcSet(),
    src: generateOptimizedUrl(baseUrl, deviceType === 'mobile' ? 768 : 1024, quality),
    quality,
    format: supportsModernFormats() ? 'webp' : 'jpeg',
    loading: isCritical ? 'eager' : 'lazy',
    fetchPriority: isCritical ? 'high' : 'auto'
  };
};

const generateOptimizedUrl = (baseUrl: string, width: number, quality: 'low' | 'medium' | 'high'): string => {
  // In a real implementation, this would generate URLs for your image optimization service
  // For now, we'll return the original URL with query parameters
  const qualityMap = { low: 50, medium: 75, high: 90 };
  return `${baseUrl}?w=${width}&q=${qualityMap[quality]}&fm=webp`;
};

const supportsModernFormats = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for WebP support
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Preload critical images with modern format support
export const preloadCriticalImages = (images: { src: string; isCritical: boolean }[]) => {
  images
    .filter(img => img.isCritical)
    .forEach(({ src }) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      
      // Add type hint for modern formats
      if (supportsModernFormats()) {
        link.type = 'image/webp';
      }
      
      document.head.appendChild(link);
    });
};

// Lazy load non-critical images with intersection observer
export const createIntersectionImageLoader = () => {
  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          const srcSet = img.dataset.srcset;
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          
          if (srcSet) {
            img.srcset = srcSet;
            img.removeAttribute('data-srcset');
          }
          
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01
    }
  );

  return imageObserver;
};