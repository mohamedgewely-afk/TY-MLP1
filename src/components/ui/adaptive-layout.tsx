
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConditionalBleedProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

export const ConditionalBleedRight: React.FC<ConditionalBleedProps> = ({ 
  children, 
  className = "",
  mobileClassName = "",
  desktopClassName = "lg:mr-[calc(50%-50vw)]"
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${className} ${isMobile ? mobileClassName : desktopClassName}`}>
      {children}
    </div>
  );
};

export const ConditionalBleedLeft: React.FC<ConditionalBleedProps> = ({ 
  children, 
  className = "",
  mobileClassName = "",
  desktopClassName = "lg:ml-[calc(50%-50vw)]"
}) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`${className} ${isMobile ? mobileClassName : desktopClassName}`}>
      {children}
    </div>
  );
};

interface AdaptiveImageProps {
  src: string;
  alt: string;
  className?: string;
  mobileHeight?: string;
  desktopHeight?: string;
}

export const AdaptiveImage: React.FC<AdaptiveImageProps> = ({
  src,
  alt,
  className = "",
  mobileHeight = "h-[50vh]",
  desktopHeight = "h-[80vh] xl:h-[90vh]"
}) => {
  const isMobile = useIsMobile();
  
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full object-cover ${isMobile ? mobileHeight : desktopHeight} ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
};
