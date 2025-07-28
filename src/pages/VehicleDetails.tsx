import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ChevronLeft, Calendar, Fuel, Shield, Heart, Share2, Download, Settings, ChevronRight, Car, PencilRuler, Tag, MapPin, Play, Pause, Volume2, VolumeX, Zap, Leaf, Award, Users, Star, ArrowRight, Check, Clock, Globe, Smartphone, Sparkles, Layers, Target, Battery, Gauge, Wind, Lock 
       } from "lucide-react";
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
import EnhancedHeroSection from "@/components/vehicle-details/EnhancedHeroSection";
import InteractiveSpecsTech from "@/components/vehicle-details/InteractiveSpecsTech";
import EnhancedLifestyleGallery from "@/components/vehicle-details/EnhancedLifestyleGallery";
import PreOwnedSimilar from "@/components/vehicle-details/PreOwnedSimilar";
import VehicleFAQ from "@/components/vehicle-details/VehicleFAQ";
import VirtualShowroom from "@/components/vehicle-details/VirtualShowroom";

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
      // Set the config if provided
      if (config) {
        // You would set the config here
      }
    };

    window.addEventListener('openCarBuilder', handleOpenCarBuilder as EventListener);
    return () => {
      window.removeEventListener('openCarBuilder', handleOpenCarBuilder as EventListener);
    };
  }, []);

  // Updated Toyota Camry Hybrid official images - spread throughout
  const galleryImages = [
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/789539dd-acfe-43aa-98a0-9ce5202ad482/renditions/2c61418f-a1b7-4899-93a8-65582ee09a0d?binary=true&mformat=true"
  ];

  // Auto-rotate gallery images with smoother transitions
  useEffect(() => {
    if (!isHeroInView) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHeroInView, galleryImages.length]);

  // Enhanced touch handlers for swipe functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }
    if (isRightSwipe) {
      setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    }
  };

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

  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  // Calculate monthly EMI (simplified calculation)
  const calculateEMI = (price: number) => {
    const principal = price * 0.8; // 80% financing
    const rate = 0.035 / 12; // 3.5% annual rate
    const tenure = 60; // 5 years
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  };

  const monthlyEMI = calculateEMI(vehicle.price);

  // Updated Premium Hybrid Technology section images
  const premiumFeatures = [
    { 
      icon: <Zap className="h-8 w-8" />, 
      title: "Hybrid Synergy Drive", 
      value: "25.2 km/L", 
      description: "World's most advanced hybrid system with instant electric response",
      color: "from-primary to-primary/80",
      bgPattern: "bg-gradient-to-br from-primary/5 to-primary/10",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true"
    },
    { 
      icon: <Shield className="h-8 w-8" />, 
      title: "Toyota Safety Sense 3.0", 
      value: "5-Star NCAP", 
      description: "Next-generation safety with AI-powered collision prevention",
      color: "from-green-500 to-emerald-400",
      bgPattern: "bg-gradient-to-br from-green-50 to-emerald-50",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/cbbefa79-6002-4f61-94e0-ee097a8dc6c6/items/a7ed1d12-7c0e-4377-84f1-bf4d0230ded6/renditions/4b8651e3-1a7c-4e08-aab5-aa103f6a5b4b?binary=true&mformat=true"
    },
    { 
      icon: <Gauge className="h-8 w-8" />, 
      title: "Dynamic Performance", 
      value: "218 HP Total", 
      description: "Seamlessly blended electric and gasoline power delivery",
      color: "from-orange-500 to-red-400",
      bgPattern: "bg-gradient-to-br from-orange-50 to-red-50",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true"
    },
    { 
      icon: <Leaf className="h-8 w-8" />, 
      title: "Zero Emission Ready", 
      value: "102g CO₂/km", 
      description: "Ultra-low emissions with pure electric driving capability",
      color: "from-emerald-500 to-green-400",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-green-50",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/983d786c-8ab7-4438-81ca-8b94844f99cf/renditions/cdb22d08-d63b-4ea8-b7e1-025e74f96f67?binary=true&mformat=true"
    }
  ];

  const innovationFeatures = [
    {
      icon: <Smartphone className="h-12 w-12" />,
      title: "Connected Intelligence",
      description: "Seamless smartphone integration with wireless Apple CarPlay & Android Auto",
      features: ["Wireless connectivity", "Voice commands", "Remote vehicle start"],
      color: "from-primary to-primary/70",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true"
    },
    {
      icon: <Wind className="h-12 w-12" />,
      title: "Climate Harmony",
      description: "Dual-zone automatic climate control with air purification system",
      features: ["HEPA filtration", "UV sterilization", "Eco-mode optimization"],
      color: "from-cyan-600 to-teal-600",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true"
    },
    {
      icon: <Battery className="h-12 w-12" />,
      title: "Energy Intelligence",
      description: "Regenerative braking system that converts motion into electrical energy",
      features: ["Brake energy recovery", "Smart charging", "Power output capability"],
      color: "from-green-600 to-emerald-600",
      image: galleryImages[6]
    },
    {
      icon: <Lock className="h-12 w-12" />,
      title: "Security Command",
      description: "Advanced security system with remote monitoring and smart access",
      features: ["Biometric access", "Remote monitoring", "Anti-theft protection"],
      color: "from-red-600 to-pink-600",
      image: galleryImages[0]
    }
  ];

  const handleOfferClick = (offer: any) => {
    setSelectedOffer(offer);
    setIsOffersModalOpen(true);
  };

  return (
    <ToyotaLayout
      activeNavItem="models"
      vehicle={vehicle}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      onBookTestDrive={() => setIsBookingOpen(true)}
      onCarBuilder={() => setIsCarBuilderOpen(true)}
      onFinanceCalculator={() => setIsFinanceOpen(true)}
    >
      <div className={`relative overflow-hidden ${isMobile ? 'pb-28' : 'pb-32'}`}>
        {/* Enhanced Hero Section with Swipe Controls */}
        <EnhancedHeroSection
          vehicle={vehicle}
          galleryImages={galleryImages}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookTestDrive={() => setIsBookingOpen(true)}
          onCarBuilder={() => setIsCarBuilderOpen(true)}
          monthlyEMI={monthlyEMI}
        />

        {/* Lazy loaded sections */}
        <React.Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
          {/* Virtual Showroom Section - NEW */}
          <VirtualShowroom vehicle={vehicle} />

          {/* Interactive Specifications & Technology Suite */}
          <InteractiveSpecsTech vehicle={vehicle} />

          {/* Offers Section - WITH CLICK HANDLER */}
          <OffersSection onOfferClick={handleOfferClick} />

          {/* Media Showcase Section */}
          <VehicleMediaShowcase vehicle={vehicle} />

          {/* Why Choose Section - WITH SWIPE SUPPORT */}
          <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
            <div className="toyota-container relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12 lg:mb-16"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Premium Hybrid Technology
                </motion.div>
                <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6 leading-tight">
                  Why Choose{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                    {vehicle.name.split(' ').pop()}?
                  </span>
                </h2>
                <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Experience the pinnacle of automotive innovation where luxury meets sustainability.
                </p>
              </motion.div>

              {/* Features Grid - More compact for mobile with swipe support */}
              <div className={`${isMobile ? 'overflow-x-auto scrollbar-hide' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'}`}>
                <div className={`${isMobile ? 'flex space-x-4 pb-4' : 'contents'}`} style={{ width: isMobile ? `${premiumFeatures.length * 260}px` : 'auto' }}>
                  {premiumFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ 
                        y: -8, 
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                      className={`group cursor-pointer ${isMobile ? 'w-60 flex-shrink-0' : ''}`}
                    >
                      <Card className={`h-full p-6 lg:p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${feature.bgPattern} relative overflow-hidden`}>
                        <div className="absolute inset-0 opacity-5">
                          <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" loading="lazy" />
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                        
                        <CardContent className="p-0 space-y-4 relative z-10">
                          <motion.div 
                            className={`inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg group-hover:scale-105 transition-transform duration-200`}
                          >
                            {feature.icon}
                          </motion.div>
                          <div className="space-y-3">
                            <motion.h3 
                              className="text-2xl lg:text-3xl font-black text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 transition-all duration-200"
                            >
                              {feature.value}
                            </motion.h3>
                            <h4 className="text-lg lg:text-xl font-bold text-foreground mb-2">{feature.title}</h4>
                            <p className="text-muted-foreground leading-relaxed text-sm lg:text-base">{feature.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Other Sections - Optimized spacing */}
          <section className="py-8 lg:py-16 bg-muted/30">
            <VehicleGallery vehicle={vehicle} />
          </section>
          
          {/* Enhanced Lifestyle Gallery - WITH SWIPE */}
          <EnhancedLifestyleGallery vehicle={vehicle} />
          
          <section className="py-8 lg:py-16 bg-muted/30">
            <RelatedVehicles currentVehicle={vehicle} />
          </section>

          {/* Pre-Owned Similar Models Carousel */}
          <PreOwnedSimilar currentVehicle={vehicle} />

          {/* FAQ Section */}
          <VehicleFAQ vehicle={vehicle} />
        </React.Suspense>

        {/* Action Panel - Desktop Only */}
        <ActionPanel
          vehicle={vehicle}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookTestDrive={() => setIsBookingOpen(true)}
          onCarBuilder={() => setIsCarBuilderOpen(true)}
          onFinanceCalculator={() => setIsFinanceOpen(true)}
        />
      </div>

      {/* UPDATED OFFERS MODAL - WITH SELECTED OFFER */}
      <OffersModal 
        isOpen={isOffersModalOpen} 
        onClose={() => {
          setIsOffersModalOpen(false);
          setSelectedOffer(null);
        }}
        selectedOffer={selectedOffer}
      />

      {/* Existing Modals */}
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
