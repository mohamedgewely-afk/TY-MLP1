
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Calendar, Fuel, Shield, Heart, Share2, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import ToyotaLayout from "@/components/ToyotaLayout";
import VehicleMediaShowcase from "@/components/vehicle-details/VehicleMediaShowcase";
import BookTestDrive from "@/components/vehicle-details/BookTestDrive";
import FinanceCalculator from "@/components/vehicle-details/FinanceCalculator";
import RelatedVehicles from "@/components/vehicle-details/RelatedVehicles";
import TechnologyShowcase from "@/components/vehicle-details/TechnologyShowcase";
import ConfigureVehicle from "@/components/vehicle-details/ConfigureVehicle";
import LifestyleGallery from "@/components/vehicle-details/LifestyleGallery";
import VehicleDetailsHero from "@/components/vehicle-details/VehicleDetailsHero";
import VehicleKeyFeatures from "@/components/vehicle-details/VehicleKeyFeatures";
import VehicleSpecs from "@/components/vehicle-details/VehicleSpecs";
import VehicleFeatures from "@/components/vehicle-details/VehicleFeatures";
import VehicleGallery from "@/components/vehicle-details/VehicleGallery";
import VehicleCTA from "@/components/vehicle-details/VehicleCTA";
import VehicleGradesShowcase from "@/components/vehicle-details/VehicleGradesShowcase";

const VehicleDetails = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Smooth scroll to top of tabs content
    document.getElementById("tabs-content")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
      {/* Vehicle Details Hero Section */}
      <VehicleDetailsHero 
        vehicle={vehicle} 
        isFavorite={isFavorite}
        toggleFavorite={toggleFavorite}
      />

      {/* Key Features Section */}
      <VehicleKeyFeatures vehicle={vehicle} />

      {/* Call-to-Action Quick Links */}
      <VehicleCTA 
        onTestDriveClick={() => setIsBookingOpen(true)}
        onFinanceClick={() => setIsFinanceOpen(true)}
        onConfigureClick={() => setIsConfigureOpen(true)}
      />

      {/* Main Content Tabs */}
      <section className="bg-gray-50 dark:bg-gray-900 py-10">
        <div className="toyota-container">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="sticky top-16 z-30 bg-white dark:bg-gray-800 py-3 px-4 rounded-lg shadow-sm mb-8">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="grades">Grades & Prices</TabsTrigger>
                <TabsTrigger value="specs">Specifications</TabsTrigger>
                <TabsTrigger value="technology">Technology</TabsTrigger>
                <TabsTrigger value="gallery">Gallery</TabsTrigger>
              </TabsList>
            </div>

            <div id="tabs-content" className="scroll-mt-32">
              <AnimatePresence mode="wait">
                <TabsContent value="overview" forceMount={activeTab === "overview"}>
                  {activeTab === "overview" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-16"
                    >
                      <VehicleFeatures vehicle={vehicle} />
                      <LifestyleGallery vehicle={vehicle} />
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="grades" forceMount={activeTab === "grades"}>
                  {activeTab === "grades" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VehicleGradesShowcase vehicle={vehicle} />
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="specs" forceMount={activeTab === "specs"}>
                  {activeTab === "specs" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VehicleSpecs vehicle={vehicle} />
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="technology" forceMount={activeTab === "technology"}>
                  {activeTab === "technology" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TechnologyShowcase vehicle={vehicle} />
                    </motion.div>
                  )}
                </TabsContent>

                <TabsContent value="gallery" forceMount={activeTab === "gallery"}>
                  {activeTab === "gallery" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <VehicleGallery vehicle={vehicle} />
                    </motion.div>
                  )}
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Floating Finance Calculator Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsFinanceOpen(true)}
          className="bg-toyota-blue hover:bg-toyota-darkblue rounded-full shadow-lg px-6 flex items-center gap-2 h-14"
          size="lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 17a5 5 0 0 1 10 0c0 .6-.4 1.2-.9 1.6L8 21v1" />
            <path d="M8 12V8l-4 4 4 4" />
            <path d="M14 13h8" />
            <path d="M18 9h4" />
            <path d="M22 5h-4" />
          </svg>
          Calculate Finance
        </Button>
      </div>

      {/* Related Vehicles */}
      <RelatedVehicles currentVehicle={vehicle} />

      {/* Modals */}
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
