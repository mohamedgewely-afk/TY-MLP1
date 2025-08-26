
import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import ToyotaLayout from "@/components/ToyotaLayout";
import VehicleSpecs from "@/components/vehicle-details/VehicleSpecs";
import VehicleGallery from "@/components/vehicle-details/VehicleGallery";
import VehicleFeatures from "@/components/vehicle-details/VehicleFeatures";
import RelatedVehicles from "@/components/vehicle-details/RelatedVehicles";
import TechnologyShowcase from "@/components/vehicle-details/TechnologyShowcase";
import LifestyleGallery from "@/components/vehicle-details/LifestyleGallery";
import VehicleMediaShowcase from "@/components/vehicle-details/VehicleMediaShowcase";
import OffersSection from "@/components/home/OffersSection";

import { usePersona } from "@/contexts/PersonaContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { useImageCarousel } from "@/hooks/use-image-carousel";
import { useVehicleData } from "@/hooks/use-vehicle-data";

import ActionPanel from "@/components/vehicle-details/ActionPanel";
import RefinedTechExperience from "@/components/vehicle-details/RefinedTechExperience";
import EnhancedHeroSection from "@/components/vehicle-details/EnhancedHeroSection";
import InteractiveSpecsTech from "@/components/vehicle-details/InteractiveSpecsTech";
import EnhancedLifestyleGallery from "@/components/vehicle-details/EnhancedLifestyleGallery";
import PreOwnedSimilar from "@/components/vehicle-details/PreOwnedSimilar";
import VehicleFAQ from "@/components/vehicle-details/VehicleFAQ";
import VirtualShowroom from "@/components/vehicle-details/VirtualShowroom";
import StorytellingSection from "@/components/vehicle-details/StorytellingSection";
import VehicleModals from "@/components/vehicle-details/VehicleModals";

const VehicleDetails = () => {
  // Modal states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isCarBuilderOpen, setIsCarBuilderOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);

  // Hooks
  const { personaData } = usePersona();
  const isMobile = useIsMobile();
  const { vehicle, isFavorite, galleryImages, monthlyEMI, toggleFavorite, navigate } = useVehicleData();
  const { currentImageIndex, nextImage, previousImage, setCurrentImageIndex } = useImageCarousel({
    images: galleryImages
  });

  // Touch gesture handlers
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures({
    onSwipeLeft: nextImage,
    onSwipeRight: previousImage
  });

  const handleOfferClick = useCallback((offer: any) => {
    setSelectedOffer(offer);
    setIsOffersModalOpen(true);
  }, []);

  if (!vehicle) {
    return (
      <ToyotaLayout>
        <div className="toyota-container py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
            <p className="mb-6">The vehicle you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </motion.div>
        </div>
      </ToyotaLayout>
    );
  }

  return (
    <ToyotaLayout
      activeNavItem="models"
      vehicle={vehicle}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      onBookTestDrive={() => setIsBookingOpen(true)}
      onCarBuilder={() => setIsCarBuilderOpen(true)}
      onFinanceCalculator={() => setIsFinanceOpen(true)}
    >
      <div
        className={`relative overflow-hidden ${isMobile ? "pb-28" : "pb-32"}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <EnhancedHeroSection
          vehicle={vehicle}
          galleryImages={galleryImages}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookTestDrive={() => setIsBookingOpen(true)}
          onCarBuilder={() => setIsCarBuilderOpen(true)}
          monthlyEMI={monthlyEMI}
        />

        <React.Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
          <VirtualShowroom vehicle={vehicle} />
          
          <section className="py-8 lg:py-16 bg-muted/30">
            <VehicleGallery />
          </section>

          <StorytellingSection
            galleryImages={galleryImages}
            monthlyEMI={monthlyEMI}
            setIsBookingOpen={setIsBookingOpen}
            navigate={navigate}
            setIsFinanceOpen={setIsFinanceOpen}
          />

          <OffersSection onOfferClick={handleOfferClick} />
          <VehicleMediaShowcase vehicle={vehicle} />
          <RefinedTechExperience vehicle={vehicle} />
          
          <section className="py-8 lg:py-16 bg-muted/30">
            <InteractiveSpecsTech vehicle={vehicle} />
          </section>

          <section className="py-8 lg:py-16 bg-muted/30">
            <RelatedVehicles currentVehicle={vehicle} />
          </section>

          <PreOwnedSimilar currentVehicle={vehicle} />
          <VehicleFAQ vehicle={vehicle} />
        </React.Suspense>

        <ActionPanel
          vehicle={vehicle}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookTestDrive={() => setIsBookingOpen(true)}
          onCarBuilder={() => setIsCarBuilderOpen(true)}
          onFinanceCalculator={() => setIsFinanceOpen(true)}
        />
      </div>

      <VehicleModals
        vehicle={vehicle}
        isBookingOpen={isBookingOpen}
        setIsBookingOpen={setIsBookingOpen}
        isFinanceOpen={isFinanceOpen}
        setIsFinanceOpen={setIsFinanceOpen}
        isCarBuilderOpen={isCarBuilderOpen}
        setIsCarBuilderOpen={setIsCarBuilderOpen}
        isOffersModalOpen={isOffersModalOpen}
        setIsOffersModalOpen={setIsOffersModalOpen}
        selectedOffer={selectedOffer}
        setSelectedOffer={setSelectedOffer}
      />
    </ToyotaLayout>
  );
};

export default VehicleDetails;
