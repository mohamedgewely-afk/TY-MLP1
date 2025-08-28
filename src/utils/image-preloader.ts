
export interface ImagePreloadOptions {
  priority?: boolean;
  crossOrigin?: 'anonymous' | 'use-credentials';
  fetchPriority?: 'high' | 'low' | 'auto';
}

export const preloadImage = (
  src: string, 
  options: ImagePreloadOptions = {}
): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = reject;
    
    if (options.crossOrigin) {
      img.crossOrigin = options.crossOrigin;
    }
    
    if (options.fetchPriority && 'fetchPriority' in img) {
      (img as any).fetchPriority = options.fetchPriority;
    }
    
    img.src = src;
  });
};

export const preloadImages = async (
  urls: string[],
  options: ImagePreloadOptions = {}
): Promise<HTMLImageElement[]> => {
  const promises = urls.map(url => preloadImage(url, options));
  return Promise.all(promises);
};

export const createImagePreloadLink = (
  src: string,
  options: ImagePreloadOptions = {}
): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  if (options.crossOrigin) {
    link.crossOrigin = options.crossOrigin;
  }
  
  if (options.fetchPriority) {
    link.setAttribute('fetchpriority', options.fetchPriority);
  }
  
  document.head.appendChild(link);
};

export const preloadCriticalVehicleImages = (vehicleImages: string[]): void => {
  // Preload the first 3 images with high priority
  vehicleImages.slice(0, 3).forEach((src, index) => {
    createImagePreloadLink(src, {
      fetchPriority: index === 0 ? 'high' : 'auto',
      crossOrigin: 'anonymous'
    });
  });
};
