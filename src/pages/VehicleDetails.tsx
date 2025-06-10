import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ChevronLeft, Calendar, Fuel, Shield, Heart, Share2, Download, Settings, ChevronRight, Car, PencilRuler, Tag, MapPin, Play, Pause, Volume2, VolumeX, Zap, Leaf, Award, Users, Star, ArrowRight, Check, Clock, Globe, Smartphone } from "lucide-react";
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
import ConfigureVehicle from "@/components/vehicle-details/ConfigureVehicle";
import VehicleMediaShowcase from "@/components/vehicle-details/VehicleMediaShowcase";
import LifestyleGallery from "@/components/vehicle-details/LifestyleGallery";
import { usePersona } from "@/contexts/PersonaContext";
import { useIsMobile } from "@/hooks/use-mobile";

const VehicleDetails = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  // Mock gallery images for demonstration
  const galleryImages = [
    vehicle?.image || "/placeholder.svg",
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800",
    "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800",
    "https://images.unsplash.com/photo-1493238792000-8113da705763?w=800",
    "https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=800"
  ];

  // Auto-rotate gallery images
  useEffect(() => {
    if (!isHeroInView) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    
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
        {/* Hero Section with Split Layout */}
        <section className="relative min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden">
          {/* Floating particles animation */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-toyota-red/20 rounded-full"
                initial={{ 
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  opacity: 0
                }}
                animate={{ 
                  y: [null, -50],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              />
            ))}
          </div>

          <div className="toyota-container h-screen flex flex-col justify-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8"
              >
                {/* Breadcrumb */}
                <motion.div 
                  className="flex items-center space-x-2 text-sm text-gray-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link to="/" className="hover:text-toyota-red transition-colors">Home</Link>
                  <ChevronRight className="h-4 w-4" />
                  <Link to="/" className="hover:text-toyota-red transition-colors">Vehicles</Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-gray-900">{vehicle.name}</span>
                </motion.div>

                {/* Badges */}
                <motion.div 
                  className="flex flex-wrap gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Badge className="bg-toyota-red hover:bg-toyota-red text-white px-4 py-2">
                    {vehicle.category}
                  </Badge>
                  {isBestSeller && (
                    <Badge className="bg-amber-500 hover:bg-amber-500 text-white px-4 py-2">
                      <Award className="h-4 w-4 mr-1" />
                      Best Seller
                    </Badge>
                  )}
                  <Badge className="bg-green-600 hover:bg-green-600 text-white px-4 py-2">
                    <Leaf className="h-4 w-4 mr-1" />
                    Hybrid
                  </Badge>
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                    {vehicle.name}
                  </h1>
                  <p className="text-xl text-gray-600 mt-4 leading-relaxed">
                    Experience the future of sustainable driving with cutting-edge hybrid technology and innovative design.
                  </p>
                </motion.div>

                {/* Price */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-baseline space-x-4"
                >
                  <span className="text-4xl font-bold text-toyota-red">
                    AED {vehicle.price.toLocaleString()}
                  </span>
                  <span className="text-gray-500 line-through text-xl">
                    AED {Math.round(vehicle.price * 1.15).toLocaleString()}
                  </span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Save 15%
                  </Badge>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="lg" 
                      className="bg-toyota-red hover:bg-toyota-darkred text-white px-8 py-4 text-lg rounded-xl shadow-lg w-full sm:w-auto"
                      onClick={() => setIsBookingOpen(true)}
                    >
                      <Car className="h-5 w-5 mr-2" />
                      Book Test Drive
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="border-2 border-toyota-red text-toyota-red hover:bg-toyota-red hover:text-white px-8 py-4 text-lg rounded-xl w-full sm:w-auto"
                      onClick={() => setIsConfigureOpen(true)}
                    >
                      <PencilRuler className="h-5 w-5 mr-2" />
                      Configure & Price
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={toggleFavorite}
                      className={`p-4 rounded-xl border-2 ${isFavorite ? "border-toyota-red text-toyota-red bg-red-50" : "border-gray-300"}`}
                    >
                      <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Quick Stats */}
                <motion.div 
                  className="grid grid-cols-2 gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Fuel className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">25+</p>
                      <p className="text-sm text-gray-600">km/L</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">5</p>
                      <p className="text-sm text-gray-600">Star Safety</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Right Image Gallery */}
              <motion.div
                ref={heroImageRef}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative h-96 lg:h-[600px] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={galleryImages[currentImageIndex]}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.7 }}
                    />
                  </AnimatePresence>
                  
                  {/* Image indicators */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {galleryImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? "bg-white shadow-lg scale-125" 
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Floating price badge */}
                  <motion.div
                    className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    <span className="text-toyota-red font-bold">From AED {vehicle.price.toLocaleString()}</span>
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
              className="flex flex-col items-center text-gray-400"
            >
              <span className="text-sm mb-2">Discover more</span>
              <ChevronRight className="h-5 w-5 rotate-90" />
            </motion.div>
          </motion.div>
        </section>

        {/* Key Features Section */}
        <section className="py-20 bg-white">
          <div className="toyota-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Choose {vehicle.name.split(' ').pop()}?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Engineered for excellence, designed for the future
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                  <Card className="h-full p-8 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-0 space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-toyota-red/10 text-toyota-red group-hover:bg-toyota-red group-hover:text-white transition-all duration-300">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{feature.value}</h3>
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
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="toyota-container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Experience Toyota Innovation
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get behind the wheel, explore financing, or build your perfect configuration
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <CardContent className="p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="relative z-10">
                      <Car className="h-16 w-16 mb-6 opacity-90" />
                      <h3 className="text-2xl font-bold mb-4">Book Test Drive</h3>
                      <p className="text-white/90 mb-6 leading-relaxed">
                        Experience the thrill firsthand. Feel the hybrid power, comfort, and innovation that sets Toyota apart.
                      </p>
                      <div className="flex items-center text-white group-hover:translate-x-2 transition-transform duration-300">
                        <span className="font-semibold">Schedule Now</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
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
                  <CardContent className="p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="relative z-10">
                      <Tag className="h-16 w-16 mb-6 opacity-90" />
                      <h3 className="text-2xl font-bold mb-4">Smart Financing</h3>
                      <p className="text-white/90 mb-6 leading-relaxed">
                        Flexible payment options designed around your lifestyle. Get pre-approved in minutes.
                      </p>
                      <div className="flex items-center text-white group-hover:translate-x-2 transition-transform duration-300">
                        <span className="font-semibold">Calculate Now</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
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
                onClick={() => setIsConfigureOpen(true)}
              >
                <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-green-600 to-green-700">
                  <CardContent className="p-8 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300" />
                    <div className="relative z-10">
                      <Settings className="h-16 w-16 mb-6 opacity-90" />
                      <h3 className="text-2xl font-bold mb-4">Build & Price</h3>
                      <p className="text-white/90 mb-6 leading-relaxed">
                        Customize every detail. Choose colors, features, and options to create your perfect Toyota.
                      </p>
                      <div className="flex items-center text-white group-hover:translate-x-2 transition-transform duration-300">
                        <span className="font-semibold">Configure Now</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
                    <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/5 rounded-full" />
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Technology & Safety Section */}
        <section className="py-20 bg-white">
          <TechnologyShowcase vehicle={vehicle} />
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <VehicleFeatures vehicle={vehicle} />
        </section>

        {/* Gallery Section */}
        <section className="py-20 bg-white">
          <VehicleGallery vehicle={vehicle} />
        </section>

        {/* Lifestyle Gallery */}
        <LifestyleGallery vehicle={vehicle} />

        {/* Related Vehicles */}
        <section className="py-20 bg-gray-50">
          <RelatedVehicles currentVehicle={vehicle} />
        </section>

        {/* Mobile Floating Actions */}
        {isMobile && (
          <motion.div
            className="fixed bottom-20 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-t z-30 p-4"
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
                  onClick={() => setIsFinanceOpen(true)}
                  className="w-full border-2 border-toyota-red text-toyota-red hover:bg-toyota-red hover:text-white rounded-xl py-3"
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Finance
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
