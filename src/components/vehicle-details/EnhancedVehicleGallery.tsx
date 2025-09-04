// src/components/vehicle-details/EnhancedVehicleGallery.tsx
import React from "react";

interface EnhancedVehicleGalleryProps {
  vehicle?: {
    name: string;
    type: string;
  };
  className?: string;
}

const EnhancedVehicleGallery: React.FC<EnhancedVehicleGalleryProps> = () => {
  return null; // hide the section entirely
};

export default EnhancedVehicleGallery;
