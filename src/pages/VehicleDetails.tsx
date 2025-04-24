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
    const storedFavorites = localStorage.getItem('favorites');
    let favorites: string[] = [];
    
    if (storedFavorites) {
      favorites = JSON.parse(storedFavorites);
    }

    const vehicleId = vehicle.id || vehicle.name;
    
    const isFavorite = favorites.includes(vehicleId);
    
    if (isFavorite) {
      const newFavorites = favorites.filter(id => id !== vehicleId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      toast({
        title: 'Removed from Favorites',
        description: `${vehicle.name} has been removed from your favorites.`,
      });
    } else {
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

  const handleCloseTestDrive = () => {
    setShowTestDriveForm(false);
  };

  const handleCloseFinance = () => {
    setShowFinanceCalculator(false);
  };

  const handleCloseConfigurator = () => {
    setShowVehicleConfigurator(false);
  };

  return (
    <ToyotaLayout>
      <VehicleDetailsHero vehicle={vehicle} />
      
      <div className="toyota-container">
        <div className="py-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to All Vehicles
          </Button>
          
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
      
      {showTestDriveForm && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <BookTestDrive 
            vehicle={vehicle} 
            isOpen={showTestDriveForm} 
            onClose={handleCloseTestDrive} 
          />
        </motion.div>
      )}
      
      {showFinanceCalculator && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <FinanceCalculator 
            vehicle={vehicle} 
            isOpen={showFinanceCalculator} 
            onClose={handleCloseFinance} 
          />
        </motion.div>
      )}
      
      {showVehicleConfigurator && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <ConfigureVehicle 
            vehicle={vehicle} 
            onClose={handleCloseConfigurator} 
          />
        </motion.div>
      )}

      <div className="bg-white dark:bg-gray-900">
        <div className="toyota-container py-12 space-y-16">
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VehicleFeatures vehicle={vehicle} />
          </motion.section>
          
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VehicleMediaShowcase vehicle={vehicle} />
          </motion.section>

          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VehicleSpecs vehicle={vehicle} />
          </motion.section>
          
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VehicleGradesShowcase vehicle={vehicle} />
          </motion.section>
          
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <VehicleGallery vehicle={vehicle} />
          </motion.section>
          
          <TechnologyShowcase vehicle={vehicle} />
          
          <LifestyleGallery vehicle={vehicle} />
          
          <VehicleReviews vehicle={vehicle} />
          
          <RelatedVehicles currentVehicle={vehicle} vehicles={vehicles} />
        </div>
      </div>
    </ToyotaLayout>
  );
};

export default VehicleDetails;
