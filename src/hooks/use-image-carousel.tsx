
import { useState, useEffect, useCallback } from "react";

interface UseImageCarouselProps {
  images: string[];
  autoplayDelay?: number;
}

export const useImageCarousel = ({ images, autoplayDelay = 5000 }: UseImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const previousImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  // Optimized image carousel timer - single interval with proper cleanup
  useEffect(() => {
    if (images.length <= 1) return;
    
    const intervalId = setInterval(nextImage, autoplayDelay);
    
    return () => clearInterval(intervalId);
  }, [images.length, nextImage, autoplayDelay]);

  return {
    currentImageIndex,
    nextImage,
    previousImage,
    goToImage,
    setCurrentImageIndex
  };
};
