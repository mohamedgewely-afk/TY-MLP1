
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, Calendar, Fuel, Shield, Heart, Share2, Download, Settings, ChevronRight, Car, PencilRuler, Tag, MapPin, Play, Pause, Volume2, VolumeX, Zap, Leaf, Award, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { useIsMobile } from "@/hooks/use-mobile";

const VehicleDetails = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isConfigureOpen, setIsConfigureOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { toast } = useToast();
  const { personaData } = usePersona();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.1]);
  
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

  // Handle section scroll with Intersection Observer
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'overview', 'features', 'technology', 'gallery'];
      const scrollPosition = window.scrollY + 200;
      
      for (const section of sections) {
        const element = document.getElementById(`section-${section}`);
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section);
        }
      }
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

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(`section-${sectionId}`);
    if (section) {
      const offset = 80;
      const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: sectionPosition, behavior: 'smooth' });
    }
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

  return (
    <ToyotaLayout>
      <div className="relative overflow-hidden">
        {/* Floating Navigation */}
        <motion.div 
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 bg-white/90 backdrop-blur-lg rounded-full px-6 py-3 shadow-lg border border-gray-200/50 hidden md:block"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="flex space-x-6">
            {['hero', 'overview', 'features', 'technology', 'gallery'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === section 
                    ? 'text-toyota-red' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Hero Section */}
        <section id="section-hero" className="relative min-h-screen flex items-center justify-center overflow-hidden" ref={heroRef}>
          {/* Animated Background */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"
            style={{ y, scale }}
          />
          
          {/* Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-toyota-red/20 rounded-full"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0
                }}
                animate={{ 
                  y: [null, -100],
                  opacity: [0, 0.5, 0]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </div>

          {/* Hero Content */}
          <motion.div 
            className="relative z-20 text-center text-white px-6 max-w-6xl mx-auto"
            style={{ opacity }}
          >
            {/* Badges */}
            <motion.div 
              className="flex justify-center space-x-3 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className="bg-toyota-red hover:bg-toyota-red text-white px-4 py-2 text-sm">
                {vehicle.category}
              </Badge>
              {isBestSeller && (
                <Badge className="bg-amber-500 hover:bg-amber-500 text-white px-4 py-2 text-sm">
                  <Award className="h-4 w-4 mr-1" />
                  Best Seller
                </Badge>
              )}
              <Badge className="bg-green-600 hover:bg-green-600 text-white px-4 py-2 text-sm">
                <Leaf className="h-4 w-4 mr-1" />
                Eco-Friendly
              </Badge>
            </motion.div>

            {/* Main Title */}
            <motion.h1 
              className="text-4xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {vehicle.name}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Experience the future of sustainable driving with cutting-edge hybrid technology
            </motion.p>

            {/* Price */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <span className="text-3xl md:text-4xl font-bold text-toyota-red">
                From AED {vehicle.price.toLocaleString()}
              </span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  className="bg-toyota-red hover:bg-toyota-darkred text-white px-8 py-4 text-lg rounded-full shadow-lg"
                  onClick={() => setIsBookingOpen(true)}
                >
                  <Car className="h-6 w-6 mr-2" />
                  Book Test Drive
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg rounded-full"
                  onClick={() => setIsConfigureOpen(true)}
                >
                  <PencilRuler className="h-6 w-6 mr-2" />
                  Configure & Price
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Vehicle Image */}
          <motion.div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 1 }}
          >
            <img 
              src={vehicle.image} 
              alt={vehicle.name}
              className="w-full h-auto object-contain"
            />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <span className="text-sm mb-2">Scroll to explore</span>
              <ChevronRight className="h-6 w-6 rotate-90" />
            </motion.div>
          </motion.div>
        </section>

        {/* Quick Overview Section */}
        <section id="section-overview" className="py-20 bg-white">
          <div className="toyota-container">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose {vehicle.name}?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the perfect blend of performance, efficiency, and innovation
              </p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              {[
                { icon: <Fuel className="h-8 w-8" />, label: "Fuel Economy", value: "25+ km/L", color: "green" },
                { icon: <Zap className="h-8 w-8" />, label: "Power", value: "180+ HP", color: "blue" },
                { icon: <Shield className="h-8 w-8" />, label: "Safety Rating", value: "5 Stars", color: "red" },
                { icon: <Users className="h-8 w-8" />, label: "Seating", value: "5 People", color: "purple" }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${stat.color}-100 text-${stat.color}-600 mb-4`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Action Grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-toyota-red to-red-600 p-8 rounded-2xl text-white">
                <Car className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Test Drive</h3>
                <p className="mb-4 opacity-90">Experience the power and efficiency firsthand</p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-toyota-red hover:bg-gray-100"
                  onClick={() => setIsBookingOpen(true)}
                >
                  Book Now
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl text-white">
                <Tag className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Finance Options</h3>
                <p className="mb-4 opacity-90">Flexible payment plans to suit your budget</p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setIsFinanceOpen(true)}
                >
                  Calculate
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} className="bg-gradient-to-br from-green-600 to-green-700 p-8 rounded-2xl text-white">
                <Settings className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-bold mb-2">Customize</h3>
                <p className="mb-4 opacity-90">Build your perfect vehicle configuration</p>
                <Button 
                  variant="secondary" 
                  className="w-full bg-white text-green-600 hover:bg-gray-100"
                  onClick={() => setIsConfigureOpen(true)}
                >
                  Configure
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="section-features" className="py-20 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <VehicleFeatures vehicle={vehicle} />
          </motion.div>
        </section>

        {/* Technology Showcase */}
        <section id="section-technology" className="py-20 bg-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <TechnologyShowcase vehicle={vehicle} />
          </motion.div>
        </section>

        {/* Gallery Section */}
        <section id="section-gallery" className="py-20 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <VehicleGallery vehicle={vehicle} />
          </motion.div>
        </section>

        {/* Lifestyle Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <LifestyleGallery vehicle={vehicle} />
        </motion.div>

        {/* Related Vehicles */}
        <motion.div 
          className="py-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <RelatedVehicles currentVehicle={vehicle} />
        </motion.div>

        {/* Floating Action Buttons - Mobile */}
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
                  className="w-full bg-toyota-red hover:bg-toyota-darkred"
                >
                  <Car className="h-4 w-4 mr-2" />
                  Test Drive
                </Button>
              </motion.div>
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="outline"
                  onClick={() => setIsFinanceOpen(true)}
                  className="w-full"
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
                  className={isFavorite ? "text-toyota-red border-toyota-red" : ""}
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
