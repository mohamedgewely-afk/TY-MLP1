
import React from "react";
import { VehicleModel } from "@/types/vehicle";
import BookTestDrive from "./BookTestDrive";
import FinanceCalculator from "./FinanceCalculator";
import CarBuilder from "./CarBuilder";
import OffersModal from "@/components/home/OffersModal";

interface VehicleModalsProps {
  vehicle: VehicleModel;
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  isFinanceOpen: boolean;
  setIsFinanceOpen: (open: boolean) => void;
  isCarBuilderOpen: boolean;
  setIsCarBuilderOpen: (open: boolean) => void;
  isOffersModalOpen: boolean;
  setIsOffersModalOpen: (open: boolean) => void;
  selectedOffer: any;
  setSelectedOffer: (offer: any) => void;
}

const VehicleModals: React.FC<VehicleModalsProps> = ({
  vehicle,
  isBookingOpen,
  setIsBookingOpen,
  isFinanceOpen,
  setIsFinanceOpen,
  isCarBuilderOpen,
  setIsCarBuilderOpen,
  isOffersModalOpen,
  setIsOffersModalOpen,
  selectedOffer,
  setSelectedOffer
}) => {
  return (
    <>
      <OffersModal
        isOpen={isOffersModalOpen}
        onClose={() => {
          setIsOffersModalOpen(false);
          setSelectedOffer(null);
        }}
        selectedOffer={selectedOffer}
      />

      <BookTestDrive
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        vehicle={vehicle}
      />

      <FinanceCalculator
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
        vehicle={vehicle}
      />

      <CarBuilder
        isOpen={isCarBuilderOpen}
        onClose={() => setIsCarBuilderOpen(false)}
        vehicle={vehicle}
      />
    </>
  );
};

export default VehicleModals;
