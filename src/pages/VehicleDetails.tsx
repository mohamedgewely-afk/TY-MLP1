
import React, { useState, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
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
  const { data: vehicleData, isLoading, isError, galleryScenes } = useVehicleData(vehicleName || "");
  const isMobile = useIsMobile();
  const { language } = useLanguage();

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const galleryImages = useMemo(() => {
    return vehicleData?.images?.gallery || [];
  }, [vehicleData?.images?.gallery]);

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
          isMobile={isMobile}
        />
        <VehicleGallery 
          galleryScenes={galleryScenes}
          vehicleName={vehicleData.name}
        />
        <StorytellingSection
          galleryImages={galleryImages}
          monthlyEMI={399}
          setIsBookingOpen={setIsBookingOpen}
          setIsFinanceOpen={setIsFinanceOpen}
          onSafetyExplore={handleSafetyExplore}
          onConnectivityExplore={handleConnectivityExplore}
          onHybridTechExplore={handleHybridTechExplore}
          onInteriorExplore={handleInteriorExplore}
        />
        <VehicleGrades vehicleGrades={vehicleData.grades} />
        <CombinedSpecsAndTech vehicle={vehicleData} />
        <VehicleFeatures vehicleFeatures={vehicleData.features} />
        <RelatedVehicles relatedVehicles={vehicleData.relatedVehicles} />
        <VehicleFAQ vehicleFAQ={vehicleData.faq} />
        <OwnerTestimonials vehicleTestimonials={vehicleData.ownerTestimonials} />
        <PreOwnedSimilar preOwnedVehicles={vehicleData.similarPreOwned} />
      </motion.div>

      <VehicleModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        vehicle={vehicleData}
      />

      <ActionPanel
        vehicle={vehicleData}
        onBookingClick={() => setIsBookingOpen(true)}
        onFinanceClick={() => setIsFinanceOpen(true)}
      />
    </ToyotaLayout>
  );
};

export default VehicleDetails;
