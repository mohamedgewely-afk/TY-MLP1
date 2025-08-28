import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  skeletonClassName?: string;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  cover?: boolean;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  eager?: boolean;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = "",
  skeletonClassName = "",
  sizes,
  quality = 75,
  fill = false,
  cover = false,
  objectFit = "cover",
  eager = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const imageStyle = useMemo(() => {
    const baseStyles: React.CSSProperties = {
      opacity: isLoading ? 0 : 1,
      transition: "opacity 300ms ease-in-out",
      objectFit: objectFit,
    };

    if (fill || cover) {
      baseStyles.position = "absolute";
      baseStyles.top = 0;
      baseStyles.left = 0;
      baseStyles.width = "100%";
      baseStyles.height = "100%";
    }

    return baseStyles;
  }, [isLoading, fill, cover, objectFit]);

  const containerStyle = useMemo(() => {
    if (fill) {
      return {
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      };
    }
    return {};
  }, [fill]);

  return (
    <div className={className} style={containerStyle}>
      {isLoading && (
        <Skeleton
          className={`absolute inset-0 ${skeletonClassName}`}
          style={{ borderRadius: 'inherit' }}
        />
      )}
      <motion.img
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        style={imageStyle}
        className="will-change-transform"
        sizes={sizes}
        quality={quality}
        onLoad={handleImageLoad}
        loading={eager ? "eager" : "lazy"}
      />
    </div>
  );
};

export default ResponsiveImage;
