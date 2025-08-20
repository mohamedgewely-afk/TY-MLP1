
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { Award, Shield } from "lucide-react";
import AnimatedCounter from "@/components/ui/animated-counter";
import { HeroImageGallery } from "./HeroImageGallery";
import { HeroPricing } from "./HeroPricing";
import { HeroActions } from "./HeroActions";

interface EnhancedHeroSectionRefactoredProps {
  vehicle: VehicleModel;
  galleryImages: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  monthlyEMI: number;
}

export const EnhancedHeroSectionRefactored: React.FC<EnhancedHeroSectionRefactoredProps> = ({
  vehicle,
  galleryImages,
  onBookTestDrive,
  onCarBuilder,
  monthlyEMI
}) => {
  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  return (
    <section 
      className="relative h-screen overflow-hidden"
      role="banner"
      aria-label={`${vehicle.name} hero section`}
    >
      {/* Full Background Media */}
      <HeroImageGallery 
        images={galleryImages} 
        vehicleName={vehicle.name}
      />

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="toyota-container pb-4">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-2 justify-center mb-3"
            role="group"
            aria-label="Vehicle certifications and awards"
          >
            {isBestSeller && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-sm">
                <Award className="h-3 w-3 mr-1" aria-hidden="true" />
                Best Seller
              </Badge>
            )}
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 text-sm">
              <Shield className="h-3 w-3 mr-1" aria-hidden="true" />
              5-Star Safety
            </Badge>
          </motion.div>

          {/* Vehicle Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-4"
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white leading-tight">
              {vehicle.name}
            </h1>
          </motion.div>

          {/* Pricing Information */}
          <HeroPricing vehicle={vehicle} monthlyEMI={monthlyEMI} />

          {/* Action Buttons */}
          <HeroActions 
            onBookTestDrive={onBookTestDrive}
            onCarBuilder={onCarBuilder}
          />
        </div>
      </div>

      {/* Accessibility improvements */}
      <div className="sr-only">
        <h2>Vehicle Overview</h2>
        <p>
          The {vehicle.name} is available starting from {vehicle.price.toLocaleString()} AED 
          with monthly EMI options from {monthlyEMI.toLocaleString()} AED per month.
        </p>
      </div>
    </section>
  );
};
