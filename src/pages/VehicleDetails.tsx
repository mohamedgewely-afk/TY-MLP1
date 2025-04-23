import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ChevronLeft, Calendar, Fuel, Shield, Heart, Share2, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import ToyotaLayout from "@/components/ToyotaLayout";
import VehicleSpecs from "@/components/vehicle-details/VehicleSpecs";
import VehicleGallery from "@/components/vehicle-details/VehicleGallery";
import VehicleFeatures from "@/components/vehicle-details/VehicleFeatures";
import BookTestDrive from "@/components/vehicle-details/BookTestDrive";
import FinanceCalculator from "@/components/vehicle-details/FinanceCalculator";
import RelatedVehicles from "@/components/vehicle-details/RelatedVehicles";
import TechnologyShowcase from "@/components/vehicle-details/TechnologyShowcase";
import ConfigureVehicle from "@/components/vehicle-details/ConfigureVehicle";
import VehicleMediaShowcase from "@/components/vehicle-details/VehicleMediaShowcase";
import LifestyleGallery from "@/components/vehicle-details/LifestyleGallery";

const VehicleDetails = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const foundVehicle = vehicles.find(v => 
      v.name.toLowerCase().replace(/\s+/g, '-') === vehicleName
    );
    
    if (foundVehicle) {
      setVehicle(foundVehicle);
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: string) => fav === foundVehicle?.name));
    
    window.scrollTo(0, 0);
  }, [vehicleName]);

  const toggleFavorite = () => {
    if (!vehicle) return;
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: string) => fav !== vehicle.name);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({
        title: "Removed from favorites",
        description: `${vehicle.name} has been removed from your favorites.`,
      });
    } else {
      favorites.push(vehicle.name);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast({
        title: "Added to favorites",
        description: `${vehicle.name} has been added to your favorites.`,
      });
    }
  };

  if (!vehicle) {
    return (
      <ToyotaLayout>
        <div className="toyota-container py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
          <p className="mb-6">The vehicle you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </ToyotaLayout>
    );
  }

  return (
    <ToyotaLayout>
      <div className="bg-gray-50 dark:bg-gray-900 pb-16">
        <div className="toyota-container py-4">
          <Link to="/" className="flex items-center text-sm text-gray-500 hover:text-toyota-red transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to all vehicles
          </Link>
        </div>

        <div className="toyota-container mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                {vehicle.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                {vehicle.category} - From AED {vehicle.price.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleFavorite}
                className={isFavorite ? "text-toyota-red" : ""}
              >
                <Heart className="h-4 w-4 mr-1" fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Brochure
              </Button>
            </div>
          </div>
        </div>

        <VehicleMediaShowcase vehicle={vehicle} />

        <div className="toyota-container my-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              size="lg" 
              className="bg-toyota-red hover:bg-toyota-darkred"
              onClick={() => setIsBookingOpen(true)}
            >
              Book a Test Drive
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => setIsFinanceOpen(true)}
            >
              Calculate Finance
            </Button>
            <Button 
              size="lg"
              onClick={() => setIsConfigureOpen(true)}
              className="bg-toyota-blue hover:bg-toyota-darkblue"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Vehicle
            </Button>
          </div>
        </div>

        <div className="toyota-container mb-8">
          <VehicleSpecs vehicle={vehicle} />
        </div>

        <div className="toyota-container">
          <Tabs defaultValue="features">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="technology">Technology</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="features">
              <VehicleFeatures vehicle={vehicle} />
            </TabsContent>

            <TabsContent value="technology">
              <TechnologyShowcase vehicle={vehicle} />
            </TabsContent>

            <TabsContent value="gallery">
              <VehicleGallery vehicle={vehicle} />
            </TabsContent>
          </Tabs>
        </div>

        <LifestyleGallery vehicle={vehicle} />

        <RelatedVehicles currentVehicle={vehicle} />
      </div>

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

      <Dialog open={isConfigureOpen} onOpenChange={setIsConfigureOpen}>
        <DialogContent className="max-w-4xl p-0">
          <ConfigureVehicle 
            vehicle={vehicle}
            onClose={() => setIsConfigureOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </ToyotaLayout>
  );
};

export default VehicleDetails;
