
import { useState, useEffect, useRef } from 'react';

interface UseLazyImageOptions {
  threshold?: number;
  rootMargin?: string;
}

export const useLazyImage = (
  src: string, 
  { threshold = 0.1, rootMargin = '50px' }: UseLazyImageOptions = {}
) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(img);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(img);

    return () => {
      observer.unobserve(img);
    };
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isInView && src && !isLoaded) {
      const image = new Image();
      image.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };
      image.src = src;
    }
  }, [isInView, src, isLoaded]);

  return {
    imgRef,
    src: imageSrc,
    isLoaded,
    isInView,
  };
};
