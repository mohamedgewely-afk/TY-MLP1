
import React from 'react';
import { useParams } from 'react-router-dom';
import { VehicleModel } from '@/types/vehicle';
import { ToyotaLayout } from '@/components/ToyotaLayout';
import ActionPanel from '@/components/vehicle-details/ActionPanel';
import VehicleFeatures from '@/components/vehicle-details/VehicleFeatures';
import CombinedSpecsAndTech from '@/components/vehicle-details/CombinedSpecsAndTech';
import VehicleGallery from '@/components/vehicle-details/VehicleGallery';
import EnhancedLifestyleGallery from '@/components/vehicle-details/EnhancedLifestyleGallery';
import VehicleReviews from '@/components/vehicle-details/VehicleReviews';
import OwnerTestimonials from '@/components/vehicle-details/OwnerTestimonials';
import VehicleFAQ from '@/components/vehicle-details/VehicleFAQ';
import RelatedVehicles from '@/components/vehicle-details/RelatedVehicles';
import PreOwnedSimilar from '@/components/vehicle-details/PreOwnedSimilar';
import EnhancedHeroSection from '@/components/vehicle-details/EnhancedHeroSection';
import VirtualShowroom from '@/components/vehicle-details/VirtualShowroom';

const VehicleDetails: React.FC = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();

  // Mock vehicle data - replace with actual data fetching
  const vehicle: VehicleModel = {
    id: '1',
    name: 'Toyota Camry',
    image: 'https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/hero/camry-24-hero-desktop-d.jpg',
    mmeUrl: 'https://www.toyota.com/camry',
    configureUrl: 'https://www.toyota.com/camry/build',
    price: 25000,
    category: 'sedan',
    year: 2023,
    features: [
      'Toyota Safety Sense 2.5+',
      'Apple CarPlay & Android Auto Compatibility',
      'Blind Spot Monitor with Rear Cross-Traffic Alert',
    ],
    specifications: {
      engine: '2.5L 4-Cylinder',
      transmission: 'CVT',
      fuelEconomy: '28 City / 39 Hwy',
      safetyRating: '5-Star',
      warranty: '3-year/36,000-mile basic coverage',
    },
    gallery: [
      'https://example.com/camry-image1.jpg',
      'https://example.com/camry-image2.jpg',
      'https://example.com/camry-image3.jpg',
    ],
    lifestyleGallery: [
      'https://example.com/camry-lifestyle1.jpg',
      'https://example.com/camry-lifestyle2.jpg',
      'https://example.com/camry-lifestyle3.jpg',
    ],
    reviews: [
      { author: 'John Doe', content: 'Great car!', rating: 5 },
      { author: 'Jane Smith', content: 'Very reliable.', rating: 4 },
    ],
    ownerTestimonials: [
      { owner: 'Alice', comment: 'I love my Camry!' },
      { owner: 'Bob', comment: 'Best car I\'ve ever owned.' },
    ],
    faq: [
      { question: 'What is the fuel economy?', answer: '28 City / 39 Hwy' },
      { question: 'What is the seating capacity?', answer: '5' },
    ],
    relatedVehicles: [
      { id: '2', name: 'Toyota Corolla', image: '', mmeUrl: '', configureUrl: '', price: 20000, category: 'sedan' },
      { id: '3', name: 'Toyota RAV4', image: '', mmeUrl: '', configureUrl: '', price: 28000, category: 'suv' },
    ],
    preOwnedSimilar: [
      { id: '4', name: 'Used Camry', image: '', mmeUrl: '', configureUrl: '', price: 18000, category: 'sedan', year: 2020 },
      { id: '5', name: 'Used Accord', image: '', mmeUrl: '', configureUrl: '', price: 20000, category: 'sedan', year: 2021 },
    ],
  };

  const [isCarBuilderOpen, setIsCarBuilderOpen] = React.useState(false);
  const [isTestDriveOpen, setIsTestDriveOpen] = React.useState(false);
  const [isEnquireOpen, setIsEnquireOpen] = React.useState(false);

  const handleConfigureClick = () => {
    setIsCarBuilderOpen(true);
  };

  const handleTestDriveClick = () => {
    setIsTestDriveOpen(true);
  };

  const handleEnquireClick = () => {
    setIsEnquireOpen(true);
  };

  return (
    <ToyotaLayout>
      <div className="min-h-screen bg-background">
        <EnhancedHeroSection
          vehicle={vehicle}
          onConfigureClick={handleConfigureClick}
          onTestDriveClick={handleTestDriveClick}
          onEnquireClick={handleEnquireClick}
        />
        
        <div className="container mx-auto px-4 py-8 space-y-12">
          <VehicleFeatures vehicle={vehicle} />
          
          <VirtualShowroom vehicleName={vehicle.name} />
          
          <CombinedSpecsAndTech vehicle={vehicle} />
          
          <VehicleGallery vehicle={vehicle} />
          
          <EnhancedLifestyleGallery vehicle={vehicle} />
          
          <VehicleReviews vehicle={vehicle} />
          
          <OwnerTestimonials vehicle={vehicle} />
          
          <VehicleFAQ vehicle={vehicle} />
          
          <RelatedVehicles currentVehicle={vehicle} />
          
          <PreOwnedSimilar vehicle={vehicle} />
        </div>
        
        <ActionPanel
          onConfigureClick={handleConfigureClick}
          onTestDriveClick={handleTestDriveClick}
          onEnquireClick={handleEnquireClick}
        />
      </div>
    </ToyotaLayout>
  );
};

export default VehicleDetails;
