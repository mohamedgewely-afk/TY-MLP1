import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ChevronLeft, Calendar, Fuel, Shield, Heart, Share2, Download, Settings, ChevronRight, Car, PencilRuler, Tag, MapPin, Play, Pause, Volume2, VolumeX, Zap, Leaf, Award, Users, Star, ArrowRight, Check, Clock, Globe, Smartphone, Sparkles, Layers, Target, Battery, Gauge, Wind, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import LifestyleGallery from "@/components/vehicle-details/LifestyleGallery";
import CarBuilder from "@/components/vehicle-details/CarBuilder";
import VehicleMediaShowcase from "@/components/vehicle-details/VehicleMediaShowcase";
import OffersSection from "@/components/home/OffersSection";
import OffersModal from "@/components/home/OffersModal";
import { usePersona } from "@/contexts/PersonaContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ActionPanel from "@/components/vehicle-details/ActionPanel";
import MobileStickyNav from "@/components/MobileStickyNav";
import RefinedTechExperience from "@/components/vehicle-details/RefinedTechExperience";
import InteractiveSpecsTech from "@/components/vehicle-details/InteractiveSpecsTech";
import EnhancedLifestyleGallery from "@/components/vehicle-details/EnhancedLifestyleGallery";
import PreOwnedSimilar from "@/components/vehicle-details/PreOwnedSimilar";
import VehicleFAQ from "@/components/vehicle-details/VehicleFAQ";
import VehicleHeroSection from "@/components/vehicle-details/VehicleHeroSection";
import WhyChooseSection from "@/components/vehicle-details/WhyChooseSection";

const VehicleDetails = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isCarBuilderOpen, setIsCarBuilderOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const { toast } = useToast();
  const { personaData } = usePersona();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);
  
  const heroImageRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroImageRef);

  useEffect(() => {
    const foundVehicle = vehicles.find(v => {
      if (v.id === vehicleName) return true;
      const slugFromName = v.name.toLowerCase().replace(/^toyota\s+/, '').replace(/\s+/g, '-');
      return slugFromName === vehicleName;
    });
    
    if (foundVehicle) {
      setVehicle(foundVehicle);
      document.title = `${foundVehicle.name} | Toyota UAE`;
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: string) => fav === foundVehicle?.name));
    
    window.scrollTo(0, 0);
  }, [vehicleName]);

  // Add event listener for car builder
  useEffect(() => {
    const handleOpenCarBuilder = (event: CustomEvent) => {
      const { step, config } = event.detail;
      setIsCarBuilderOpen(true);
    };

    window.addEventListener('openCarBuilder', handleOpenCarBuilder as EventListener);
    return () => {
      window.removeEventListener('openCarBuilder', handleOpenCarBuilder as EventListener);
    };
  }, []);

  // Gallery images
  const galleryImages = [
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/789539dd-acfe-43aa-98a0-9ce5202ad482/renditions/2c61418f-a1b7-4899-93a8-65582ee09a0d?binary=true&mformat=true"
  ];

  // Auto-rotate gallery images
  useEffect(() => {
    if (!isHeroInView) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHeroInView, galleryImages.length]);

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

  if (!vehicle) {
    return (
      <ToyotaLayout>
        <div className="toyota-container py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
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

  const calculateEMI = (price: number) => {
    const principal = price * 0.8;
    const rate = 0.035 / 12;
    const tenure = 60;
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  };

  const monthlyEMI = calculateEMI(vehicle.price);

  const handleOfferClick = (offer: any) => {
    setSelectedOffer(offer);
    setIsOffersModalOpen(true);
  };

  return (
    <ToyotaLayout>
      <div className={`relative overflow-hidden ${isMobile ? 'pb-28' : 'pb-32'}`}>
        {/* Hero Section */}
        <VehicleHeroSection
          vehicle={vehicle}
          galleryImages={galleryImages}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookTestDrive={() => setIsBookingOpen(true)}
          onCarBuilder={() => setIsCarBuilderOpen(true)}
          monthlyEMI={monthlyEMI}
        />

        {/* Interactive Specifications & Technology Suite */}
        <InteractiveSpecsTech vehicle={vehicle} />

        {/* Offers Section */}
        <OffersSection onOfferClick={handleOfferClick} />

        {/* Media Showcase Section */}
        <VehicleMediaShowcase vehicle={vehicle} />

        {/* Why Choose Section */}
        <WhyChooseSection 
          vehicleName={vehicle.name}
          galleryImages={galleryImages}
        />

        {/* Other Sections */}
        <section className="py-8 lg:py-16 bg-muted/30">
          <VehicleGallery vehicle={vehicle} />
        </section>
        
        <EnhancedLifestyleGallery vehicle={vehicle} />
        
        <section className="py-8 lg:py-16 bg-muted/30">
          <RelatedVehicles currentVehicle={vehicle} />
        </section>

        <PreOwnedSimilar currentVehicle={vehicle} />
        <VehicleFAQ vehicle={vehicle} />

        {/* Action Panel */}
        <ActionPanel
          vehicle={vehicle}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookTestDrive={() => setIsBookingOpen(true)}
          onCarBuilder={() => setIsCarBuilderOpen(true)}
          onFinanceCalculator={() => setIsFinanceOpen(true)}
        />
      </div>

      {/* Mobile Sticky Navigation */}
      {isMobile && <MobileStickyNav activeItem="vehicle" />}

      {/* Modals */}
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
    </ToyotaLayout>
  );
};

export default VehicleDetails;
