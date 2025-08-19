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

  // NEW: UI state for redesigned section
  const [expTab, setExpTab] = useState<"highlights" | "build" | "ownership">("highlights");

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
    the const rate = 0.035 / 12; // 3.5% annual rate
    const tenure = 60; // 5 years
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  };

  const monthlyEMI = calculateEMI(vehicle.price);

  // Updated Premium Hybrid Technology section images
  const premiumFeatures = [
    { 
      icon: <Zap className="h-8 w-8" />, 
      title: "Powertrain Intelligence", 
      value: "Immediate Response", 
      description: "Optimized power delivery engineered for smooth, confident acceleration.",
      color: "from-primary to-primary/80",
      bgPattern: "bg-gradient-to-br from-primary/5 to-primary/10",
      image: galleryImages[0]
    },
    { 
      icon: <Shield className="h-8 w-8" />, 
      title: "Toyota Safety Sense", 
      value: "360° Confidence", 
      description: "Proactive driver assistance that helps protect what matters most.",
      color: "from-green-500 to-emerald-400",
      bgPattern: "bg-gradient-to-br from-green-50 to-emerald-50",
      image: galleryImages[1]
    },
    { 
      icon: <Gauge className="h-8 w-8" />, 
      title: "Dynamic Performance", 
      value: "Precision Control", 
      description: "Balanced chassis dynamics for comfort in the city and control on the highway.",
      color: "from-orange-500 to-red-400",
      bgPattern: "bg-gradient-to-br from-orange-50 to-red-50",
      image: galleryImages[2]
    },
    { 
      icon: <Leaf className="h-8 w-8" />, 
      title: "Efficiency & Care", 
      value: "Lower Emissions", 
      description: "Smart efficiency features that help you go further with a lighter footprint.",
      color: "from-emerald-500 to-green-400",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-green-50",
      image: galleryImages[3]
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

          {/* ----------------------------- */}
          {/* NEW EXPERIENCE NAVIGATOR (UX) */}
          {/* ----------------------------- */}
          <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/30 to-background relative">
            <div className="toyota-container">
              {/* Top micro-branding and persona tone */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-8 lg:mb-12"
              >
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-medium">
                  <Sparkles className="h-4 w-4" />
                  Tailored Experience
                </div>
                <h2 className="mt-4 text-3xl lg:text-5xl font-black">
                  Build Your {vehicle.name.split(' ').pop()} Experience
                </h2>
                <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
                  {personaData?.nickname
                    ? `${personaData.nickname}, pick what matters most to you—then personalize in minutes.`
                    : `Pick what matters most to you—then personalize in minutes.`}
                </p>
              </motion.div>

              {/* Tabs */}
              <div role="tablist" aria-label="Experience sections" className="flex flex-wrap items-center justify-center gap-2 mb-8">
                {[
                  { id: "highlights", label: "Highlights", icon: <Star className="h-4 w-4" /> },
                  { id: "build", label: "Build & Compare", icon: <PencilRuler className="h-4 w-4" /> },
                  { id: "ownership", label: "Ownership", icon: <Award className="h-4 w-4" /> },
                ].map(t => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={expTab === t.id}
                    onClick={() => setExpTab(t.id as any)}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm border transition ${
                      expTab === t.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border-transparent"
                    }`}
                  >
                    {t.icon}
                    <span className="font-semibold">{t.label}</span>
                  </button>
                ))}
              </div>

              {/* Panels */}
              <div className="relative">
                {/* Highlights: immersive, swipeable on mobile */}
                {expTab === "highlights" && (
                  <div className="overflow-hidden">
                    <div className="flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-4">
                      {premiumFeatures.map((f, idx) => (
                        <motion.div
                          key={f.title}
                          initial={{ opacity: 0, y: 24 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.05 }}
                          className="relative rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 bg-card"
                        >
                          {/* background image with neutral overlay */}
                          <div className="absolute inset-0">
                            <img src={f.image} alt="" className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          </div>
                          <div className="relative z-10 p-6 text-white">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/15 backdrop-blur">
                              {f.icon}
                            </div>
                            <h3 className="mt-3 text-xl font-black">{f.value}</h3>
                            <p className="text-white/80 font-semibold">{f.title}</p>
                            <p className="mt-2 text-white/80 text-sm">{f.description}</p>
                            <div className="mt-4">
                              <Button size="sm" variant="secondary" className="bg-white text-black hover:bg-white/90">
                                Explore Feature
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Build & Compare: actions wired to existing flows */}
                {expTab === "build" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="h-40 bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                          <PencilRuler className="h-10 w-10 text-primary" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold">Car Builder</h3>
                          <p className="text-muted-foreground mt-1">
                            Choose color, trim, and packages—see the price update live.
                          </p>
                          <div className="mt-4 flex gap-2">
                            <Button onClick={() => setIsCarBuilderOpen(true)}>Start Building</Button>
                            <Button variant="outline" onClick={() => navigate('/compare')}>Compare</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="h-40 bg-gradient-to-br from-emerald-200/40 to-emerald-50 flex items-center justify-center">
                          <Gauge className="h-10 w-10 text-emerald-700" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold">Finance Calculator</h3>
                          <p className="text-muted-foreground mt-1">
                            Estimate your monthly EMI instantly with flexible tenures.
                          </p>
                          <div className="mt-4">
                            <Button onClick={() => setIsFinanceOpen(true)}>Calculate EMI</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="h-40 bg-gradient-to-br from-amber-200/40 to-amber-50 flex items-center justify-center">
                          <Star className="h-10 w-10 text-amber-700" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold">Latest Offers</h3>
                          <p className="text-muted-foreground mt-1">
                            Limited-time deals curated for {vehicle.name}.
                          </p>
                          <div className="mt-4">
                            <Button onClick={() => setIsOffersModalOpen(true)}>View Offers</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Ownership: service, warranty, test drive */}
                {expTab === "ownership" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="h-40 bg-gradient-to-br from-sky-200/40 to-sky-50 flex items-center justify-center">
                          <Calendar className="h-10 w-10 text-sky-700" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold">Book a Test Drive</h3>
                          <p className="text-muted-foreground mt-1">
                            Feel the drive. We’ll arrange a time that works for you.
                          </p>
                          <div className="mt-4">
                            <Button onClick={() => setIsBookingOpen(true)}>Book Now</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="h-40 bg-gradient-to-br from-violet-200/40 to-violet-50 flex items-center justify-center">
                          <Shield className="h-10 w-10 text-violet-700" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold">Warranty & Care</h3>
                          <p className="text-muted-foreground mt-1">
                            Comprehensive coverage and tailored service plans.
                          </p>
                          <div className="mt-4">
                            <Button variant="outline" onClick={() => navigate('/service-plans')}>Explore Plans</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="h-40 bg-gradient-to-br from-rose-200/40 to-rose-50 flex items-center justify-center">
                          <Users className="h-10 w-10 text-rose-700" />
                        </div>
                        <div className="p-6">
                          <h3 className="text-lg font-bold">Trade‑in & Assistance</h3>
                          <p className="text-muted-foreground mt-1">
                            Get a fair valuation and switch to your {vehicle.name} effortlessly.
                          </p>
                          <div className="mt-4">
                            <Button variant="outline" onClick={() => navigate('/trade-in')}>Get Valuation</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          </section>
          {/* END Experience Navigator */}

          {/* Other Sections - Optimized spacing */}
          <section className="py-8 lg:py-16 bg-muted/30">
            <VehicleGallery />
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
