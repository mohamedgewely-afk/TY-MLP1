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
import { usePersona } from "@/contexts/PersonaContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ActionPanel from "@/components/vehicle-details/ActionPanel";
import MobileStickyNav from "@/components/MobileStickyNav";

const VehicleDetails = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isCarBuilderOpen, setIsCarBuilderOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
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

  // Real Toyota Camry Hybrid images
  const galleryImages = [
    "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/hero/camry-24-hero-desktop-d.jpg",
    "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/gallery/camry-24-gallery-desktop-a.jpg",
    "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/gallery/camry-24-gallery-desktop-b.jpg",
    "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/gallery/camry-24-gallery-desktop-c.jpg",
    "https://di-uploads-pod34.dealerinspire.com/toyotaofnorthcharlotte/uploads/2023/11/2024-toyota-camry-hybrid-xse-platinum-white-pearl-front-three-quarter-view.jpg",
    "https://toyota-cms-media.s3.amazonaws.com/wp-content/uploads/2023/03/2023_Toyota_Camry_XSE_SupersonicRed_001-1500x1000.jpg"
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

  const premiumFeatures = [
    { 
      icon: <Zap className="h-8 w-8" />, 
      title: "Hybrid Synergy Drive", 
      value: "25.2 km/L", 
      description: "World's most advanced hybrid system with instant electric response",
      color: "from-primary to-primary/80",
      bgPattern: "bg-gradient-to-br from-primary/5 to-primary/10",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80"
    },
    { 
      icon: <Shield className="h-8 w-8" />, 
      title: "Toyota Safety Sense 3.0", 
      value: "5-Star NCAP", 
      description: "Next-generation safety with AI-powered collision prevention",
      color: "from-green-500 to-emerald-400",
      bgPattern: "bg-gradient-to-br from-green-50 to-emerald-50",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=600&q=80"
    },
    { 
      icon: <Gauge className="h-8 w-8" />, 
      title: "Dynamic Performance", 
      value: "218 HP Total", 
      description: "Seamlessly blended electric and gasoline power delivery",
      color: "from-orange-500 to-red-400",
      bgPattern: "bg-gradient-to-br from-orange-50 to-red-50",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=600&q=80"
    },
    { 
      icon: <Leaf className="h-8 w-8" />, 
      title: "Zero Emission Ready", 
      value: "102g CO₂/km", 
      description: "Ultra-low emissions with pure electric driving capability",
      color: "from-emerald-500 to-green-400",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-green-50",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80"
    }
  ];

  const innovationFeatures = [
    {
      icon: <Smartphone className="h-12 w-12" />,
      title: "Connected Intelligence",
      description: "Seamless smartphone integration with wireless Apple CarPlay & Android Auto",
      features: ["Wireless connectivity", "Voice commands", "Remote vehicle start"],
      color: "from-primary to-primary/70",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: <Wind className="h-12 w-12" />,
      title: "Climate Harmony",
      description: "Dual-zone automatic climate control with air purification system",
      features: ["HEPA filtration", "UV sterilization", "Eco-mode optimization"],
      color: "from-cyan-600 to-teal-600",
      image: "https://images.unsplash.com/photo-1506744038136-80022131f5a1?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: <Battery className="h-12 w-12" />,
      title: "Energy Intelligence",
      description: "Regenerative braking system that converts motion into electrical energy",
      features: ["Brake energy recovery", "Smart charging", "Power output capability"],
      color: "from-green-600 to-emerald-600",
      image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80"
    },
    {
      icon: <Lock className="h-12 w-12" />,
      title: "Security Command",
      description: "Advanced security system with remote monitoring and smart access",
      features: ["Biometric access", "Remote monitoring", "Anti-theft protection"],
      color: "from-red-600 to-pink-600",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <ToyotaLayout>
      <div className={`relative overflow-hidden ${isMobile ? 'pb-28' : 'pb-32'}`}>
        {/* Enhanced Hero Section with better mobile optimization */}
        <section className="relative min-h-screen bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 animate-pulse" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-l from-transparent via-primary/10 to-transparent"
                animate={{ 
                  background: [
                    "linear-gradient(90deg, transparent, rgba(var(--primary), 0.1), transparent)",
                    "linear-gradient(270deg, transparent, rgba(var(--primary), 0.15), transparent)",
                    "linear-gradient(90deg, transparent, rgba(var(--primary), 0.1), transparent)"
                  ]
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />
            </div>
            
            {/* Floating particles */}
            {[...Array(isMobile ? 15 : 30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary-foreground/30 rounded-full shadow-lg"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  opacity: 0,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{ 
                  y: [null, -200],
                  opacity: [0,1, 1, 0],
                  scale: [null, 1.5, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          <div className="toyota-container min-h-screen flex flex-col justify-center relative z-10 py-16 md:py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 lg:space-y-10 text-primary-foreground order-2 lg:order-1"
              >
                {/* Breadcrumb */}
                <motion.div 
                  className="flex items-center space-x-2 text-sm text-primary-foreground/70"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link to="/" className="hover:text-primary-foreground transition-colors flex items-center">
                    <span className="w-2 h-2 bg-primary-foreground rounded-full mr-2" />
                    Home
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <Link to="/" className="hover:text-primary-foreground transition-colors">Vehicles</Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-primary-foreground font-medium">{vehicle.name}</span>
                </motion.div>

                {/* Badges */}
                <motion.div 
                  className="flex flex-wrap gap-3 lg:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 lg:px-6 lg:py-3 border border-primary-foreground/20 text-sm lg:text-base shadow-lg">
                    <Sparkles className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    {vehicle.category}
                  </Badge>
                  {isBestSeller && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white px-4 py-2 lg:px-6 lg:py-3 border border-amber-400 text-sm lg:text-base shadow-lg">
                      <Award className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                      Best Seller
                    </Badge>
                  )}
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 py-2 lg:px-6 lg:py-3 border border-emerald-400 text-sm lg:text-base shadow-lg">
                    <Leaf className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                    Hybrid Power
                  </Badge>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4 lg:space-y-6"
                >
                  <h1 className="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-foreground via-primary-foreground/90 to-primary-foreground/80 leading-tight tracking-tight">
                    {vehicle.name}
                  </h1>
                  <motion.p 
                    className="text-lg lg:text-2xl text-primary-foreground/80 leading-relaxed max-w-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Redefining the future of sustainable luxury with revolutionary hybrid technology, 
                    intelligent design, and uncompromising performance.
                  </motion.p>
                </motion.div>

                {/* Pricing */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row sm:items-baseline space-y-3 sm:space-y-0 sm:space-x-6"
                >
                  <motion.span 
                    className="text-3xl lg:text-5xl xl:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-foreground/90 via-primary-foreground to-primary-foreground/90"
                  >
                    AED {vehicle.price.toLocaleString()}
                  </motion.span>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <span className="text-primary-foreground/60 line-through text-xl lg:text-2xl">
                      AED {Math.round(vehicle.price * 1.15).toLocaleString()}
                    </span>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-400 text-white border border-green-400 px-3 py-1 text-sm lg:text-base shadow-lg">
                      Save 15%
                    </Badge>
                  </div>
                </motion.div>

                {/* Desktop Action Buttons */}
                {!isMobile && (
                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 lg:gap-6 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      className="flex-1 sm:flex-none"
                    >
                      <Button 
                        size="lg"
                        className="bg-gradient-to-r from-primary-foreground to-primary-foreground/90 hover:from-primary-foreground/90 hover:to-primary-foreground/80 text-primary px-8 lg:px-12 py-4 lg:py-6 text-lg lg:text-xl rounded-2xl shadow-2xl w-full sm:w-auto"
                        onClick={() => setIsBookingOpen(true)}
                      >
                        <Car className="h-5 w-5 lg:h-6 lg:w-6 mr-3" />
                        Book Test Drive
                      </Button>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }} 
                      className="flex-1 sm:flex-none"
                    >
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 lg:px-12 py-4 lg:py-6 text-lg lg:text-xl rounded-2xl w-full sm:w-auto bg-primary/20 backdrop-blur-sm shadow-lg"
                        onClick={() => setIsCarBuilderOpen(true)}
                      >
                        <Settings className="h-5 w-5 lg:h-6 lg:w-6 mr-3" />
                        Build & Price
                      </Button>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={toggleFavorite}
                        className={`p-4 lg:p-6 rounded-2xl border-2 bg-primary/20 backdrop-blur-sm shadow-lg ${isFavorite ? "border-primary-foreground text-primary-foreground bg-primary-foreground/10" : "border-primary-foreground/30 text-primary-foreground"}`}
                      >
                        <Heart className="h-5 w-5 lg:h-6 lg:w-6" fill={isFavorite ? "currentColor" : "none"} />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>

              {/* Image Gallery */}
              <motion.div
                ref={heroImageRef}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative order-1 lg:order-2"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="relative h-80 md:h-96 lg:h-[500px] xl:h-[700px] rounded-3xl lg:rounded-[2rem] overflow-hidden border-2 border-primary-foreground/20 shadow-2xl backdrop-blur-sm">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={galleryImages[currentImageIndex]}
                      alt={vehicle.name}
                      className="w-full h-full object-cover rounded-3xl lg:rounded-[2rem] scale-110"
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1.1 }}
                      exit={{ opacity: 0, scale: 1 }}
                      transition={{ duration: 1, ease: "easeInOut" }}
                    />
                  </AnimatePresence>
                  
                  {/* Image indicators - No bars, just clean dots */}
                  <div className="absolute bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {galleryImages.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 border-2 ${
                          index === currentImageIndex 
                            ? "bg-primary-foreground border-primary-foreground shadow-lg scale-125" 
                            : "bg-transparent border-primary-foreground/50 hover:bg-primary-foreground/30 hover:border-primary-foreground"
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>

                  {/* Price badge */}
                  <motion.div
                    className="absolute top-6 lg:top-8 right-6 lg:right-8 bg-background/80 backdrop-blur-md px-4 py-2 lg:px-6 lg:py-3 rounded-2xl border border-border shadow-2xl"
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-primary font-bold text-sm lg:text-lg">
                      From AED {vehicle.price.toLocaleString()}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center text-primary-foreground/70 cursor-pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <span className="text-sm mb-3 font-medium">Discover Innovation</span>
              <div className="w-8 h-12 border-2 border-primary-foreground/50 rounded-full flex justify-center">
                <motion.div
                  className="w-1 h-3 bg-primary-foreground rounded-full mt-2"
                  animate={{ y: [0, 16, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Media Showcase Section */}
        <VehicleMediaShowcase vehicle={vehicle} />

        {/* Why Choose Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
          <div className="toyota-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 lg:mb-20"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Premium Hybrid Technology
              </motion.div>
              <h2 className="text-4xl lg:text-6xl xl:text-7xl font-black text-foreground mb-6 lg:mb-8 leading-tight">
                Why Choose{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                  {vehicle.name.split(' ').pop()}?
                </span>
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Experience the pinnacle of automotive innovation where luxury meets sustainability, 
                performance meets efficiency, and technology meets intuition.
              </p>
            </motion.div>

            {/* Features Grid */}
            <div className={`${isMobile ? 'overflow-x-auto scrollbar-hide' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10'}`}>
              <div className={`${isMobile ? 'flex space-x-6 pb-4' : 'contents'}`} style={{ width: isMobile ? `${premiumFeatures.length * 280}px` : 'auto' }}>
                {premiumFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    whileHover={{ 
                      y: -12, 
                      scale: 1.02,
                      transition: { duration: 0.3 }
                    }}
                    className={`group cursor-pointer ${isMobile ? 'w-64 flex-shrink-0' : ''}`}
                  >
                    <Card className={`h-full p-8 lg:p-10 text-center border-0 shadow-xl hover:shadow-2xl transition-all duration-500 ${feature.bgPattern} relative overflow-hidden`}>
                      <div className="absolute inset-0 opacity-10">
                        <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                      </div>
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                      
                      <CardContent className="p-0 space-y-6 relative z-10">
                        <motion.div 
                          className={`inline-flex items-center justify-center w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-gradient-to-br ${feature.color} text-white shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                          whileHover={{ rotate: 5 }}
                        >
                          {feature.icon}
                        </motion.div>
                        <div className="space-y-4">
                          <motion.h3 
                            className="text-3xl lg:text-4xl font-black text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 transition-all duration-300"
                          >
                            {feature.value}
                          </motion.h3>
                          <h4 className="text-xl lg:text-2xl font-bold text-foreground mb-3">{feature.title}</h4>
                          <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">{feature.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Innovation Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-br from-muted via-muted/50 to-background relative overflow-hidden">
          <div className="toyota-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16 lg:mb-20"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-flex items-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6"
              >
                <Target className="h-4 w-4 mr-2" />
                Next-Generation Features
              </motion.div>
              <h2 className="text-4xl lg:text-6xl xl:text-7xl font-black text-foreground mb-6 lg:mb-8 leading-tight">
                Experience{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                  Toyota Innovation
                </span>
              </h2>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Step into tomorrow with intelligent systems that anticipate your needs, 
                enhance your journey, and redefine what's possible in automotive excellence.
              </p>
            </motion.div>

            {/* Innovation Features */}
            <div className={`${isMobile ? 'overflow-x-auto scrollbar-hide mb-16' : 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16'}`}>
              <div className={`${isMobile ? 'flex space-x-6 pb-4' : 'contents'}`} style={{ width: isMobile ? `${innovationFeatures.length * 350}px` : 'auto' }}>
                {innovationFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    className={`group ${isMobile ? 'w-80 flex-shrink-0' : ''}`}
                  >
                    <Card className="h-full p-8 lg:p-10 border-0 shadow-2xl bg-card backdrop-blur-lg border border-border hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute inset-0 opacity-5">
                        <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                      </div>
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                      
                      <CardContent className="p-0 space-y-6 relative z-10">
                        <div className="flex items-start space-x-6">
                          <motion.div 
                            className={`flex-shrink-0 w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform duration-300`}
                            whileHover={{ rotate: 10 }}
                          >
                            {feature.icon}
                          </motion.div>
                          
                          <div className="flex-1 space-y-4">
                            <h3 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-primary/70 transition-all duration-300">
                              {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                              {feature.description}
                            </p>
                            
                            <div className="space-y-2">
                              {feature.features.map((item, i) => (
                                <motion.div
                                  key={i}
                                  className="flex items-center space-x-3"
                                  initial={{ opacity: 0, x: 20 }}
                                  whileInView={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.5 + i * 0.1 }}
                                >
                                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                                  <span className="text-muted-foreground text-sm lg:text-base">{item}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 backdrop-blur-lg rounded-3xl p-8 lg:p-12 border border-primary/20 max-w-4xl mx-auto">
                <h3 className="text-2xl lg:text-4xl font-bold text-foreground mb-4">
                  Ready to Experience the Future?
                </h3>
                <p className="text-muted-foreground text-lg lg:text-xl mb-8 leading-relaxed">
                  Book your test drive today and discover why the {vehicle.name} represents 
                  the next evolution in automotive excellence.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground px-8 py-4 text-lg rounded-xl shadow-lg"
                      onClick={() => setIsBookingOpen(true)}
                    >
                      <Car className="h-5 w-5 mr-3" />
                      Book Test Drive
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline"
                      size="lg"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg rounded-xl bg-transparent"
                      onClick={() => setIsCarBuilderOpen(true)}
                    >
                      <Settings className="h-5 w-5 mr-3" />
                      Configure Now
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Other Sections */}
        <OffersSection />
        <section className="py-12 lg:py-20 bg-background">
          <TechnologyShowcase vehicle={vehicle} />
        </section>
        <section className="py-12 lg:py-20 bg-muted/30">
          <VehicleFeatures vehicle={vehicle} />
        </section>
        <section className="py-12 lg:py-20 bg-background">
          <VehicleGallery vehicle={vehicle} />
        </section>
        <LifestyleGallery vehicle={vehicle} />
        <section className="py-12 lg:py-20 bg-muted/30">
          <RelatedVehicles currentVehicle={vehicle} />
        </section>

        {/* Action Panel with proper spacing for mobile sticky nav */}
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
