
// Advanced image optimization utilities
export interface ImageOptimizationConfig {
  quality: 'low' | 'medium' | 'high';
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  sizes: string;
  loading: 'eager' | 'lazy';
  priority: boolean;
}

export const getOptimalImageConfig = (
  isMobile: boolean,
  isSlowNetwork: boolean,
  isLowMemory: boolean
): ImageOptimizationConfig => {
  return {
    quality: isSlowNetwork || isLowMemory ? 'low' : isMobile ? 'medium' : 'high',
    format: supportsWebP() ? 'webp' : 'jpeg',
    sizes: isMobile ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 1200px) 50vw, 33vw',
    loading: 'lazy',
    priority: false
  };
};

export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

export const generateResponsiveImageUrl = (
  baseUrl: string,
  width: number,
  quality: 'low' | 'medium' | 'high' = 'medium'
): string => {
  // In a real implementation, this would generate optimized URLs
  // For now, return the original URL
  return baseUrl;
};

export const preloadCriticalImages = (imageUrls: string[]) => {
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
};
