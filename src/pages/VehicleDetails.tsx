
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Calendar, Fuel, Shield, Heart, Share2, Download, Settings, ChevronRight, Car, PencilRuler, Tag, MapPin } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { usePersona } from "@/contexts/PersonaContext";

const VehicleDetails = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSection, setActiveSection] = useState("details");
  const { toast } = useToast();
  const { personaData } = usePersona();
  const navigate = useNavigate();
  const detailsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const foundVehicle = vehicles.find(v => {
      if (v.id === vehicleName) return true;
      return v.name.toLowerCase().replace(/\s+/g, '-') === vehicleName;
    });
    
    if (foundVehicle) {
      setVehicle(foundVehicle);
      // Update document title with vehicle name
      document.title = `${foundVehicle.name} | Toyota UAE`;
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: string) => fav === foundVehicle?.name));
    
    window.scrollTo(0, 0);
  }, [vehicleName]);

  // Handle section scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!detailsRef.current) return;
      
      const sectionsMap = {
        details: document.getElementById('vehicle-details-section'),
        features: document.getElementById('vehicle-features-section'),
        gallery: document.getElementById('vehicle-gallery-section'),
        offers: document.getElementById('vehicle-offers-section')
      };
      
      // Get current scroll position
      const scrollPosition = window.scrollY + 100; // Add offset for sticky header
      
      // Find current section
      let currentSection = 'details';
      
      Object.entries(sectionsMap).forEach(([key, section]) => {
        if (!section) return;
        
        if (section.offsetTop <= scrollPosition) {
          currentSection = key;
        }
      });
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    
    window.dispatchEvent(new Event('favorites-updated'));
  };

  // Navigate between vehicles
  const handleNavigateVehicle = (direction: 'next' | 'prev') => {
    if (!vehicle) return;
    
    const currentIndex = vehicles.findIndex(v => v.name === vehicle.name);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex === vehicles.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? vehicles.length - 1 : currentIndex - 1;
    }
    
    const newVehicle = vehicles[newIndex];
    const slug = newVehicle.id || newVehicle.name.toLowerCase().replace(/\s+/g, '-');
    
    navigate(`/vehicle/${slug}`);
  };

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = 80; // Account for sticky header
      const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: sectionPosition, behavior: 'smooth' });
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

  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  const getPersonaStyles = () => {
    if (!personaData) return {};
    
    return {
      primaryColor: personaData.colorScheme.primary,
      accentColor: personaData.colorScheme.accent,
      backgroundColor: `${personaData.colorScheme.background}10`,
      borderStyle: personaData.borderStyle,
    };
  };

  const styles = getPersonaStyles();

  return (
    <ToyotaLayout>
      <div className="bg-gray-50 dark:bg-gray-900 pb-16">
        <motion.div 
          className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="toyota-container py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center text-sm text-gray-500 hover:text-toyota-red transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to all vehicles
              </Link>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleNavigateVehicle('prev')}
                  className="hidden sm:flex"
                  style={{ color: styles.primaryColor }}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleNavigateVehicle('next')}
                  className="hidden sm:flex"
                  style={{ color: styles.primaryColor }}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Section navigation */}
          <div 
            className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            style={styles.backgroundColor ? { backgroundColor: styles.backgroundColor } : {}}
          >
            <div className="toyota-container py-2">
              <div className="flex space-x-6 overflow-x-auto hide-scrollbar">
                <button 
                  onClick={() => scrollToSection('vehicle-details-section')}
                  className={`text-sm py-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeSection === 'details' 
                      ? 'border-toyota-red font-medium text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  style={activeSection === 'details' && styles.primaryColor ? { borderColor: styles.primaryColor, color: styles.primaryColor } : {}}
                >
                  Overview
                </button>
                <button 
                  onClick={() => scrollToSection('vehicle-features-section')}
                  className={`text-sm py-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeSection === 'features' 
                      ? 'border-toyota-red font-medium text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  style={activeSection === 'features' && styles.primaryColor ? { borderColor: styles.primaryColor, color: styles.primaryColor } : {}}
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('vehicle-gallery-section')}
                  className={`text-sm py-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeSection === 'gallery' 
                      ? 'border-toyota-red font-medium text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  style={activeSection === 'gallery' && styles.primaryColor ? { borderColor: styles.primaryColor, color: styles.primaryColor } : {}}
                >
                  Gallery
                </button>
                <button 
                  onClick={() => scrollToSection('vehicle-offers-section')}
                  className={`text-sm py-2 border-b-2 whitespace-nowrap transition-colors ${
                    activeSection === 'offers' 
                      ? 'border-toyota-red font-medium text-gray-900 dark:text-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                  style={activeSection === 'offers' && styles.primaryColor ? { borderColor: styles.primaryColor, color: styles.primaryColor } : {}}
                >
                  Special Offers
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="toyota-container mb-8" id="vehicle-details-section" ref={detailsRef}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 pt-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge 
                  className={`${
                    vehicle.category === "Hybrid" ? "bg-green-600" :
                    vehicle.category === "Electric" ? "bg-blue-600" :
                    vehicle.category === "GR Performance" ? "bg-red-600" :
                    "bg-toyota-red"
                  } hover:opacity-100`}
                >
                  {vehicle.category}
                </Badge>
                
                {isBestSeller && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-800">
                    Best Seller
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">
                {vehicle.name}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                From AED {vehicle.price.toLocaleString()}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleFavorite}
                  className={isFavorite ? "text-toyota-red" : ""}
                  style={isFavorite && styles.primaryColor ? { color: styles.primaryColor } : {}}
                >
                  <Heart className="h-4 w-4 mr-1" fill={isFavorite ? "currentColor" : "none"} />
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Brochure
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <VehicleMediaShowcase vehicle={vehicle} />

        <div className="toyota-container my-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg" 
                className="bg-toyota-red hover:bg-toyota-darkred w-full"
                onClick={() => setIsBookingOpen(true)}
                style={styles.primaryColor ? { backgroundColor: styles.primaryColor, boxShadow: `0 4px 14px -4px ${styles.primaryColor}70` } : {}}
              >
                <Car className="h-5 w-5 mr-2" />
                Book a Test Drive
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsFinanceOpen(true)}
                className="w-full"
                style={styles.primaryColor ? { borderColor: styles.primaryColor, color: styles.primaryColor } : {}}
              >
                <Tag className="h-5 w-5 mr-2" />
                Calculate Finance
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                size="lg"
                onClick={() => setIsConfigureOpen(true)}
                className="bg-toyota-blue hover:bg-toyota-darkblue w-full"
                style={styles.accentColor ? { backgroundColor: styles.accentColor } : {}}
              >
                <PencilRuler className="h-5 w-5 mr-2" />
                Configure Vehicle
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="toyota-container mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <VehicleSpecs vehicle={vehicle} />
        </motion.div>

        <div className="toyota-container" id="vehicle-features-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <VehicleFeatures vehicle={vehicle} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="my-16"
          >
            <TechnologyShowcase vehicle={vehicle} />
          </motion.div>
        </div>

        <div className="toyota-container" id="vehicle-gallery-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <VehicleGallery vehicle={vehicle} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px 0px" }}
        >
          <LifestyleGallery vehicle={vehicle} />
        </motion.div>

        <motion.div 
          className="mt-16"
          id="vehicle-offers-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <RelatedVehicles currentVehicle={vehicle} />
        </motion.div>

        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800 z-20 md:hidden"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="grid grid-cols-2 gap-2 p-3">
            <Button 
              onClick={() => setIsBookingOpen(true)}
              className="bg-toyota-red hover:bg-toyota-darkred"
              style={styles.primaryColor ? { backgroundColor: styles.primaryColor } : {}}
            >
              Test Drive
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsFinanceOpen(true)}
              style={styles.primaryColor ? { borderColor: styles.primaryColor, color: styles.primaryColor } : {}}
            >
              Finance
            </Button>
          </div>
        </motion.div>
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
