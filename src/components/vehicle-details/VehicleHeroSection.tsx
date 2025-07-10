
import React from "react";
import { motion } from "framer-motion";
import { VehicleModel } from "@/types/vehicle";
import EnhancedHeroSection from "./EnhancedHeroSection";

interface VehicleHeroSectionProps {
  vehicle: VehicleModel;
  galleryImages: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  monthlyEMI: number;
}

const VehicleHeroSection: React.FC<VehicleHeroSectionProps> = (props) => {
  return <EnhancedHeroSection {...props} />;
};

export default VehicleHeroSection;
