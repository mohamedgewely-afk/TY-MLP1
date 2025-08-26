
import { useState, useEffect, useRef } from 'react';

interface UseProgressiveImageProps {
  src: string;
  placeholderSrc?: string;
  srcSet?: string;
}

export const useProgressiveImage = ({ src, placeholderSrc, srcSet }: UseProgressiveImageProps) => {
  const [currentSrc, setCurrentSrc] = useState(placeholderSrc || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imageRef = useRef<HTMLImageElement>();

  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    
    // Create new image for preloading
    const img = new Image();
    imageRef.current = img;
    
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
    
    img.onerror = () => {
      setIsError(true);
    };

    // Set srcset if provided
    if (srcSet) {
      img.srcset = srcSet;
    }
    img.src = src;

    return () => {
      if (imageRef.current) {
        imageRef.current.onload = null;
        imageRef.current.onerror = null;
      }
    };
  }, [src, srcSet]);

  return { currentSrc, isLoaded, isError };
};
