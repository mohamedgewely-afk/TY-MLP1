
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ChevronLeft, Calendar, Fuel, Shield, Heart, Share2, Download, Settings, ChevronRight, Car, PencilRuler, Tag, MapPin, Play, Pause, Volume2, VolumeX, Zap, Leaf, Award, Users, Star, ArrowRight, Check, Clock, Globe, Smartphone, Sparkles, Layers, Target } from "lucide-react";
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
import OffersSection from "@/components/home/OffersSection";
import { usePersona } from "@/contexts/PersonaContext";
import { useIsMobile } from "@/hooks/use-mobile";

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
      return v.name.toLowerCase().replace(/\s+/g, '-') === vehicleName;
    });
    
    if (foundVehicle) {
      setVehicle(foundVehicle);
      document.title = `${foundVehicle.name} | Toyota UAE`;
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: string) => fav === foundVehicle?.name));
    
    window.scrollTo(0, 0);
  }, [vehicleName]);

  // Futuristic gallery images
  const galleryImages = [
    vehicle?.image || "/placeholder.svg",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800",
    "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?w=800",
    "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=800"
  ];

  // Auto-rotate gallery images
  useEffect(() => {
    if (!isHeroInView) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isHeroInView, galleryImages.length]);

  // Touch handlers for swipe functionality
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

  const keyFeatures = [
    { icon: <Fuel className="h-6 w-6" />, title: "Hybrid Efficiency", value: "25+ km/L", description: "Best-in-class fuel economy" },
    { icon: <Zap className="h-6 w-6" />, title: "Electric Power", value: "180+ HP", description: "Instant torque delivery" },
    { icon: <Shield className="h-6 w-6" />, title: "Safety Rating", value: "5 Stars", description: "TSS 2.0 included" },
    { icon: <Leaf className="h-6 w-6" />, title: "Eco-Friendly", value: "Low CO2", description: "Reduced emissions" }
  ];

  return (
    <ToyotaLayout>
      <div className="relative overflow-hidden">
        {/* Futuristic Hero Section */}
        <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-12 md:grid-cols-20 grid-rows-12 md:grid-rows-20 h-full w-full">
                {Array.from({ length: isMobile ? 144 : 400 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="border-blue-400 border-r border-b border-opacity-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.3, 0] }}
                    transition={{
                      duration: 3,
                      delay: Math.random() * 2,
                      repeat: Infinity
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Floating particles */}
            {[...Array(isMobile ? 15 : 30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  opacity: 0
                }}
                animate={{ 
                  y: [null, -100],
                  opacity: [0, 1, 0],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5
                }}
              />
            ))}
            
            {/* Scanning lines */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-10"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <div className="toyota-container min-h-screen flex flex-col justify-center relative z-10 py-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6 lg:space-y-8 text-white order-2 lg:order-1"
              >
                {/* Breadcrumb */}
                <motion.div 
                  className="flex items-center space-x-2 text-sm text-blue-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link to="/" className="hover:text-blue-100 transition-colors">Home</Link>
                  <ChevronRight className="h-4 w-4" />
                  <Link to="/" className="hover:text-blue-100 transition-colors">Vehicles</Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-white">{vehicle.name}</span>
                </motion.div>

                {/* Futuristic badges */}
                <motion.div 
                  className="flex flex-wrap gap-2 lg:gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 lg:px-4 lg:py-2 border border-blue-400 text-xs lg:text-sm">
                    <Sparkles className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    {vehicle.category}
                  </Badge>
                  {isBestSeller && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-3 py-1 lg:px-4 lg:py-2 border border-yellow-400 text-xs lg:text-sm">
                      <Award className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                      Best Seller
                    </Badge>
                  )}
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 lg:px-4 lg:py-2 border border-green-400 text-xs lg:text-sm">
                    <Leaf className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
                    Hybrid Tech
                  </Badge>
                </motion.div>

                {/* Title with futuristic styling */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className="text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200 leading-tight">
                    {vehicle.name}
                  </h1>
                  <p className="text-base lg:text-xl text-blue-100 mt-3 lg:mt-4 leading-relaxed">
                    Experience the future of sustainable driving with cutting-edge hybrid technology and revolutionary design.
                  </p>
                </motion.div>

                {/* Price with holographic effect */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-col sm:flex-row sm:items-baseline space-y-2 sm:space-y-0 sm:space-x-4"
                >
                  <span className="text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">
                    AED {vehicle.price.toLocaleString()}
                  </span>
                  <span className="text-blue-300 line-through text-lg lg:text-xl">
                    AED {Math.round(vehicle.price * 1.15).toLocaleString()}
                  </span>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-400 text-white border border-green-400 text-xs lg:text-sm">
                    Save 15%
                  </Badge>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-3 lg:gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 sm:flex-none">
                    <Button 
                      size={isMobile ? "default" : "lg"}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg rounded-xl shadow-lg border border-blue-500 w-full sm:w-auto"
                      onClick={() => setIsBookingOpen(true)}
                    >
                      <Car className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                      Book Test Drive
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1 sm:flex-none">
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "lg"}
                      className="border-2 border-blue-400 text-blue-300 hover:bg-blue-600 hover:text-white px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg rounded-xl w-full sm:w-auto bg-transparent"
                      onClick={() => setIsCarBuilderOpen(true)}
                    >
                      <Settings className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
                      Configure & Price
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "default" : "lg"}
                      onClick={toggleFavorite}
                      className={`p-3 lg:p-4 rounded-xl border-2 bg-transparent ${isFavorite ? "border-blue-400 text-blue-400 bg-blue-900/20" : "border-blue-400 text-blue-300"}`}
                    >
                      <Heart className="h-4 w-4 lg:h-5 lg:w-5" fill={isFavorite ? "currentColor" : "none"} />
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Right Futuristic Image Gallery */}
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
                <div className="relative h-64 md:h-80 lg:h-96 xl:h-[600px] rounded-2xl lg:rounded-3xl overflow-hidden border border-blue-400 shadow-2xl shadow-blue-500/20">
                  {/* Holographic border effect */}
                  <div className="absolute inset-0 rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-400 via-transparent to-blue-400 p-[2px]">
                    <div className="h-full w-full rounded-2xl lg:rounded-3xl bg-black" />
                  </div>
                  
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={galleryImages[currentImageIndex]}
                      alt={vehicle.name}
                      className="w-full h-full object-cover rounded-2xl lg:rounded-3xl"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.7 }}
                    />
                  </AnimatePresence>
                  
                  {/* Scanning overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-blue-400/20 via-transparent to-blue-400/20"
                    initial={{ y: "-100%" }}
                    animate={{ y: "100%" }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-4 lg:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {galleryImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-all border ${
                          index === currentImageIndex 
                            ? "bg-blue-400 border-blue-300 shadow-lg scale-125" 
                            : "bg-transparent border-blue-400 hover:bg-blue-400/50"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Floating price badge with glow */}
                  <motion.div
                    className="absolute top-4 lg:top-6 right-4 lg:right-6 bg-black/80 backdrop-blur-sm px-3 py-1 lg:px-4 lg:py-2 rounded-full border border-blue-400 shadow-lg shadow-blue-400/20"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <span className="text-blue-300 font-bold text-sm lg:text-base">From AED {vehicle.price.toLocaleString()}</span>
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
            transition={{ delay: 1.5 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center text-blue-300"
            >
              <span className="text-sm mb-2">Discover Future</span>
              <ChevronRight className="h-5 w-5 rotate-90" />
            </motion.div>
          </motion.div>
        </section>

        {/* Key Features Section */}
        <section className="py-12 lg:py-20 bg-white">
          <div className="toyota-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 lg:mb-16"
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                Why Choose {vehicle.name.split(' ').pop()}?
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Engineered for excellence, designed for the future
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="h-full p-6 lg:p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-0 space-y-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-toyota-red/10 text-toyota-red group-hover:bg-toyota-red group-hover:text-white transition-all duration-300">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">{feature.value}</h3>
                        <p className="font-semibold text-gray-900 mb-1">{feature.title}</p>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Experience Section */}
        <section className="py-12 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="toyota-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12 lg:mb-16 px-4"
            >
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 lg:mb-6">
                Experience Toyota Innovation
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
                Get behind the wheel, explore financing, or build your perfect configuration
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Test Drive Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => setIsBookingOpen(true)}
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-toyota-red to-red-600">
                  <CardContent className="p-6 lg:p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="relative z-10">
                      <Car className="h-12 w-12 lg:h-16 lg:w-16 mb-4 lg:mb-6 opacity-90" />
                      <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">Book Test Drive</h3>
                      <p className="text-white/90 mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base">
                        Experience the thrill firsthand. Feel the hybrid power, comfort, and innovation that sets Toyota apart.
                      </p>
                      <div className="flex items-center text-white group-hover:translate-x-2 transition-transform duration-300">
                        <span className="font-semibold">Schedule Now</span>
                        <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-full" />
                    <div className="absolute -top-4 -left-4 w-12 h-12 lg:w-16 lg:h-16 bg-white/5 rounded-full" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Finance Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => setIsFinanceOpen(true)}
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-blue-600 to-blue-700">
                  <CardContent className="p-6 lg:p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="relative z-10">
                      <Tag className="h-12 w-12 lg:h-16 lg:w-16 mb-4 lg:mb-6 opacity-90" />
                      <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">Smart Financing</h3>
                      <p className="text-white/90 mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base">
                        Flexible payment options designed around your lifestyle. Get pre-approved in minutes.
                      </p>
                      <div className="flex items-center text-white group-hover:translate-x-2 transition-transform duration-300">
                        <span className="font-semibold">Calculate Now</span>
                        <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-full" />
                    <div className="absolute -top-4 -left-4 w-12 h-12 lg:w-16 lg:h-16 bg-white/5 rounded-full" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Configure Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
                onClick={() => setIsCarBuilderOpen(true)}
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-green-600 to-green-700">
                  <CardContent className="p-6 lg:p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="relative z-10">
                      <Settings className="h-12 w-12 lg:h-16 lg:w-16 mb-4 lg:mb-6 opacity-90" />
                      <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">Build & Price</h3>
                      <p className="text-white/90 mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base">
                        Customize every detail. Choose colors, features, and options to create your perfect Toyota.
                      </p>
                      <div className="flex items-center text-white group-hover:translate-x-2 transition-transform duration-300">
                        <span className="font-semibold">Configure Now</span>
                        <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 lg:w-24 lg:h-24 bg-white/10 rounded-full" />
                    <div className="absolute -top-4 -left-4 w-12 h-12 lg:w-16 lg:h-16 bg-white/5 rounded-full" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Offers Section */}
        <OffersSection />

        {/* Technology & Safety Section */}
        <section className="py-12 lg:py-20 bg-white">
          <TechnologyShowcase vehicle={vehicle} />
        </section>

        {/* Features Section */}
        <section className="py-12 lg:py-20 bg-gray-50">
          <VehicleFeatures vehicle={vehicle} />
        </section>

        {/* Gallery Section */}
        <section className="py-12 lg:py-20 bg-white">
          <VehicleGallery vehicle={vehicle} />
        </section>

        {/* Lifestyle Gallery */}
        <LifestyleGallery vehicle={vehicle} />

        {/* Related Vehicles */}
        <section className="py-12 lg:py-20 bg-gray-50">
          <RelatedVehicles currentVehicle={vehicle} />
        </section>

        {/* Mobile Floating Actions */}
        {isMobile && (
          <motion.div
            className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-t z-50 p-4 pb-safe"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <div className="flex gap-3">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full bg-toyota-red hover:bg-toyota-darkred text-white rounded-xl py-3"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Test Drive
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline"
                  onClick={() => setIsCarBuilderOpen(true)}
                  className="w-full border-2 border-toyota-red text-toyota-red hover:bg-toyota-red hover:text-white rounded-xl py-3"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Build
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={toggleFavorite}
                  className={`p-3 rounded-xl border-2 ${isFavorite ? "text-toyota-red border-toyota-red bg-red-50" : "border-gray-300"}`}
                >
                  <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

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
