import React from "react";
import EnhancedVehicleGallery from "./EnhancedVehicleGallery";

// Keep the existing interface for backward compatibility
interface VehicleGalleryProps {
  scenes?: any[];
  locale?: "en" | "ar";
  rtl?: boolean;
  onAskToyota?: (scene: any) => void;
}

const VehicleGallery: React.FC<VehicleGalleryProps> = (props) => {
  console.warn("VehicleGallery is deprecated. Please use EnhancedVehicleGallery instead.");
  
  // Convert legacy props to new format if needed
  const enhancedProps = {
    ...props,
    experiences: props.scenes // Map legacy scenes to experiences
  };

  return <EnhancedVehicleGallery {...enhancedProps} />;
};

export default VehicleGallery;
