
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { ChevronLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { vehicles } from '@/data/vehicles';
import ToyotaLayout from '@/components/ToyotaLayout';
import VehicleDetailsHero from '@/components/vehicle-details/VehicleDetailsHero';
import VehicleKeyFeatures from '@/components/vehicle-details/VehicleKeyFeatures';
import VehicleFeatures from '@/components/vehicle-details/VehicleFeatures';
import VehicleGallery from '@/components/vehicle-details/VehicleGallery';
import VehicleSpecs from '@/components/vehicle-details/VehicleSpecs';
import VehicleGradesShowcase from '@/components/vehicle-details/VehicleGradesShowcase';
import RelatedVehicles from '@/components/vehicle-details/RelatedVehicles';
import VehicleMediaShowcase from '@/components/vehicle-details/VehicleMediaShowcase';
import OwnerTestimonials from '@/components/vehicle-details/OwnerTestimonials';
import LifestyleGallery from '@/components/vehicle-details/LifestyleGallery';
import TechnologyShowcase from '@/components/vehicle-details/TechnologyShowcase';
import VehicleCTA from '@/components/vehicle-details/VehicleCTA';
import BookTestDrive from '@/components/vehicle-details/BookTestDrive';
import FinanceCalculator from '@/components/vehicle-details/FinanceCalculator';
import ConfigureVehicle from '@/components/vehicle-details/ConfigureVehicle';
import VehicleReviews from '@/components/vehicle-details/VehicleReviews';

const VehicleDetails = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showTestDriveForm, setShowTestDriveForm] = useState(false);
  const [showFinanceCalculator, setShowFinanceCalculator] = useState(false);
  const [showVehicleConfigurator, setShowVehicleConfigurator] = useState(false);

  // Find the vehicle based on the URL parameter
  const vehicle = vehicles.find(v => v.name.toLowerCase() === vehicleName?.toLowerCase());

  if (!vehicle) {
    return (
      <ToyotaLayout>
        <div className="toyota-container py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
          <p className="mb-6">We couldn't find the vehicle you're looking for.</p>
          <Button onClick={() => navigate('/')}>Return to Homepage</Button>
        </div>
      </ToyotaLayout>
    );
  }

  const toggleFavorite = () => {
    // Get current favorites from localStorage
    const storedFavorites = localStorage.getItem('favorites');
    let favorites: string[] = [];
    
    if (storedFavorites) {
      favorites = JSON.parse(storedFavorites);
    }

    const vehicleId = vehicle.id || vehicle.name;
    
    // Check if this vehicle is already in favorites
    const isFavorite = favorites.includes(vehicleId);
    
    if (isFavorite) {
      // Remove from favorites
      const newFavorites = favorites.filter(id => id !== vehicleId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      toast({
        title: 'Removed from Favorites',
        description: `${vehicle.name} has been removed from your favorites.`,
      });
    } else {
      // Add to favorites
      favorites.push(vehicleId);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      toast({
        title: 'Added to Favorites',
        description: `${vehicle.name} has been added to your favorites.`,
      });
    }
  };

  const handleTestDriveClick = () => {
    setShowTestDriveForm(true);
    setShowFinanceCalculator(false);
    setShowVehicleConfigurator(false);
    setActiveSection('test-drive');
  };

  const handleFinanceClick = () => {
    setShowFinanceCalculator(true);
    setShowTestDriveForm(false);
    setShowVehicleConfigurator(false);
    setActiveSection('finance');
  };

  const handleConfigureClick = () => {
    setShowVehicleConfigurator(true);
    setShowTestDriveForm(false);
    setShowFinanceCalculator(false);
    setActiveSection('configure');
  };

  return (
    <ToyotaLayout>
      <VehicleDetailsHero vehicle={vehicle} />
      
      <div className="toyota-container">
        <div className="py-6 flex items-center justify-between">
          {/* Back button */}
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to All Vehicles
          </Button>
          
          {/* Add to favorites */}
          <Button 
            variant="outline" 
            onClick={toggleFavorite} 
            className="flex items-center gap-2"
          >
            <Heart className="h-5 w-5" />
            Add to Favorites
          </Button>
        </div>
      </div>
      
      <VehicleKeyFeatures vehicle={vehicle} />
      <VehicleCTA 
        onTestDriveClick={handleTestDriveClick}
        onFinanceClick={handleFinanceClick}
        onConfigureClick={handleConfigureClick}
      />
      
      {/* Conditional rendering of action forms */}
      {showTestDriveForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <BookTestDrive vehicle={vehicle} />
        </motion.div>
      )}
      
      {showFinanceCalculator && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <FinanceCalculator vehicle={vehicle} />
        </motion.div>
      )}
      
      {showVehicleConfigurator && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <ConfigureVehicle vehicle={vehicle} />
        </motion.div>
      )}

      {/* Vehicle Sections */}
      <div className="bg-white dark:bg-gray-900">
        <div className="toyota-container py-12 space-y-16">
          {/* Features Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VehicleFeatures vehicle={vehicle} />
          </motion.section>
          
          {/* Media Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VehicleMediaShowcase vehicle={vehicle} />
          </motion.section>

          {/* Specs Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VehicleSpecs vehicle={vehicle} />
          </motion.section>
          
          {/* Grades Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VehicleGradesShowcase vehicle={vehicle} />
          </motion.section>
          
          {/* Gallery Section */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VehicleGallery vehicle={vehicle} />
          </motion.section>
          
          {/* Technology Section */}
          <TechnologyShowcase vehicle={vehicle} />
          
          {/* Lifestyle Gallery */}
          <LifestyleGallery vehicle={vehicle} />
          
          {/* Reviews Section */}
          <VehicleReviews vehicle={vehicle} />
          
          {/* Related Vehicles Section */}
          <RelatedVehicles currentVehicle={vehicle} vehicles={vehicles} />
        </div>
      </div>
    </ToyotaLayout>
  );
};

export default VehicleDetails;
