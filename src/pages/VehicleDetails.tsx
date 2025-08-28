
import React, { useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ToyotaLayout from "@/components/ToyotaLayout";
import EnhancedHeroSection from "@/components/vehicle-details/EnhancedHeroSection";
import VehicleGallery from "@/components/vehicle-details/VehicleGallery";
import StorytellingSection from "@/components/vehicle-details/StorytellingSection";
import VehicleGrades from "@/components/vehicle-details/VehicleGrades";
import CombinedSpecsAndTech from "@/components/vehicle-details/CombinedSpecsAndTech";
import VehicleFeatures from "@/components/vehicle-details/VehicleFeatures";
import RelatedVehicles from "@/components/vehicle-details/RelatedVehicles";
import VehicleFAQ from "@/components/vehicle-details/VehicleFAQ";
import OwnerTestimonials from "@/components/vehicle-details/OwnerTestimonials";
import PreOwnedSimilar from "@/components/vehicle-details/PreOwnedSimilar";
import VehicleModals from "@/components/vehicle-details/VehicleModals";
import ActionPanel from "@/components/vehicle-details/ActionPanel";
import { useVehicleData } from "@/hooks/use-vehicle-data";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { performantSpringConfigs } from "@/utils/performance-animations";

const VehicleDetails: React.FC = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const { data: vehicleData, isLoading, isError, galleryScenes, isFavorite, toggleFavorite, galleryImages } = useVehicleData(vehicleName || "");
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleSafetyExplore = useCallback(() => {
    setActiveModal('safety');
  }, []);

  const handleConnectivityExplore = useCallback(() => {
    setActiveModal('connectivity');
  }, []);

  const handleHybridTechExplore = useCallback(() => {
    setActiveModal('hybridTech');
  }, []);

  const handleInteriorExplore = useCallback(() => {
    setActiveModal('interior');
  }, []);

  if (isLoading) {
    return <div>Loading vehicle details...</div>;
  }

  if (isError || !vehicleData) {
    return <div>Error loading vehicle details.</div>;
  }

  return (
    <ToyotaLayout vehicle={vehicleData}>
      <motion.div
        key={vehicleName}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={performantSpringConfigs.smooth}
      >
        <EnhancedHeroSection
          vehicle={vehicleData}
          monthlyEMI={399}
          galleryImages={galleryImages}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookTestDrive={() => setIsBookingOpen(true)}
          onCarBuilder={() => {}}
        />
        <VehicleGallery 
          images={galleryImages}
          vehicleName={vehicleData.name}
        />
        <StorytellingSection
          galleryImages={galleryImages}
          monthlyEMI={399}
          setIsBookingOpen={setIsBookingOpen}
          setIsFinanceOpen={setIsFinanceOpen}
          navigate={navigate}
          onSafetyExplore={handleSafetyExplore}
          onConnectivityExplore={handleConnectivityExplore}
          onHybridTechExplore={handleHybridTechExplore}
          onInteriorExplore={handleInteriorExplore}
        />
        <VehicleGrades vehicle={vehicleData} />
        <CombinedSpecsAndTech vehicle={vehicleData} />
        <VehicleFeatures vehicle={vehicleData} />
        <RelatedVehicles currentVehicle={vehicleData} />
        <VehicleFAQ vehicle={vehicleData} />
        <OwnerTestimonials vehicle={vehicleData} />
        <PreOwnedSimilar currentVehicle={vehicleData} />
      </motion.div>

      <VehicleModals
        vehicle={vehicleData}
        isBookingOpen={isBookingOpen}
        setIsBookingOpen={setIsBookingOpen}
        isFinanceOpen={isFinanceOpen}
        setIsFinanceOpen={setIsFinanceOpen}
        isCarBuilderOpen={false}
        setIsCarBuilderOpen={() => {}}
        isOffersModalOpen={false}
        setIsOffersModalOpen={() => {}}
        selectedOffer={null}
        setSelectedOffer={() => {}}
        isSafetyModalOpen={activeModal === 'safety'}
        setIsSafetyModalOpen={(open) => setActiveModal(open ? 'safety' : null)}
        isConnectivityModalOpen={activeModal === 'connectivity'}
        setIsConnectivityModalOpen={(open) => setActiveModal(open ? 'connectivity' : null)}
        isHybridTechModalOpen={activeModal === 'hybridTech'}
        setIsHybridTechModalOpen={(open) => setActiveModal(open ? 'hybridTech' : null)}
        isInteriorModalOpen={activeModal === 'interior'}
        setIsInteriorModalOpen={(open) => setActiveModal(open ? 'interior' : null)}
      />

      <ActionPanel
        vehicle={vehicleData}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onBookTestDrive={() => setIsBookingOpen(true)}
        onCarBuilder={() => {}}
        onFinanceCalculator={() => setIsFinanceOpen(true)}
      />
    </ToyotaLayout>
  );
};

export default VehicleDetails;
