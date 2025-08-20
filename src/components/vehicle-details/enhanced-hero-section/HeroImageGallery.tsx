
import React from 'react';
import { AccessibleCarousel } from '@/components/ui/accessible-carousel';

interface HeroImageGalleryProps {
  images: string[];
  vehicleName: string;
  showVideo?: boolean;
  onToggleVideo?: () => void;
}

export const HeroImageGallery: React.FC<HeroImageGalleryProps> = ({
  images,
  vehicleName,
  showVideo = false,
  onToggleVideo
}) => {
  const galleryItems = images.map((image, index) => (
    <div key={index} className="relative w-full h-screen">
      <img
        src={image}
        alt={`${vehicleName} - View ${index + 1}`}
        className="w-full h-full object-cover"
        loading={index === 0 ? "eager" : "lazy"}
        decoding={index === 0 ? "sync" : "async"}
      />
      {/* Loading skeleton */}
      <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 animate-pulse -z-10" />
    </div>
  ));

  return (
    <div className="absolute inset-0 w-full h-full">
      <AccessibleCarousel
        items={galleryItems}
        autoPlay={!showVideo}
        autoPlayInterval={4000}
        ariaLabel={`${vehicleName} image gallery`}
        itemAriaLabel={(index) => `${vehicleName} exterior view ${index + 1} of ${images.length}`}
        showControls={true}
        showIndicators={false}
        className="h-full"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};
