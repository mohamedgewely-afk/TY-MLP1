
import React from 'react';
import { cn } from '@/lib/utils';
import { useProgressiveImage } from '@/hooks/use-progressive-image';
import { motion } from 'framer-motion';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderSrc?: string;
  srcSet?: string;
  sizes?: string;
  onLoad?: () => void;
  priority?: boolean;
}

const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
  src,
  alt,
  className,
  placeholderSrc,
  srcSet,
  sizes,
  onLoad,
  priority = false
}) => {
  const { currentSrc, isLoaded, isError } = useProgressiveImage({ 
    src, 
    placeholderSrc,
    srcSet 
  });

  React.useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  if (isError) {
    return (
      <div className={cn("bg-muted flex items-center justify-center", className)}>
        <span className="text-muted-foreground text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Blur placeholder */}
      {placeholderSrc && !isLoaded && (
        <motion.img
          src={placeholderSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
      
      {/* Main image */}
      <motion.img
        src={currentSrc}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        className="w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
      />
      
      {/* Loading shimmer */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      )}
    </div>
  );
};

export default ProgressiveImage;
