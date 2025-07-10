
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Heart, 
  Share2, 
  Calendar, 
  Fuel, 
  Zap, 
  Shield, 
  Award,
  Star,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Car,
  Settings
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EnhancedHeroSectionProps {
  vehicle: VehicleModel;
  galleryImages: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
  monthlyEMI: number;
}

const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({
  vehicle,
  galleryImages,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  monthlyEMI
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);
  
  const heroImageRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroImageRef);

  // Auto-rotate gallery images
  useEffect(() => {
    if (!isHeroInView || !isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isHeroInView, galleryImages.length, isAutoPlaying]);

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
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  const isHybrid = vehicle.name.toLowerCase().includes('hybrid');
  const isElectric = vehicle.name.toLowerCase().includes('bz4x') || vehicle.category === 'Electric';

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.1)_50%,transparent_75%)]" />
      </div>

      <div className="toyota-container relative z-10 h-full">
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'lg:grid-cols-2'} gap-8 lg:gap-12 min-h-screen items-center py-8 lg:py-16`}>
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`space-y-6 lg:space-y-8 ${isMobile ? 'text-center' : ''} relative z-20`}
          >
            {/* Badges */}
            <div className={`flex flex-wrap gap-2 ${isMobile ? 'justify-center' : ''} mb-4`}>
              {isBestSeller && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1">
                    <Award className="h-3 w-3 mr-1" />
                    Best Seller
                  </Badge>
                </motion.div>
              )}
              
              {isHybrid && (
                <motion.div
                  initial={{ scale: 0, rotate: 180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                >
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1">
                    <Zap className="h-3 w-3 mr-1" />
                    Hybrid
                  </Badge>
                </motion.div>
              )}
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1">
                  <Shield className="h-3 w-3 mr-1" />
                  5-Star Safety
                </Badge>
              </motion.div>
            </div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-black text-foreground leading-tight mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/70">
                  {vehicle.name}
                </span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Experience the perfect harmony of innovation, efficiency, and luxury. 
                {isHybrid && " Advanced hybrid technology meets premium comfort."}
                {isElectric && " Pure electric power for the future of driving."}
              </p>
            </motion.div>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
            >
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-black text-primary mb-1">
                  {isHybrid ? "25.2" : isElectric ? "450" : "22.2"} 
                  <span className="text-base font-normal text-muted-foreground ml-1">
                    {isElectric ? "km range" : "km/L"}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {isElectric ? "Electric Range" : "Fuel Efficiency"}
                </div>
              </div>
              
              <div className="text-center lg:text-left">
                <div className="text-2xl lg:text-3xl font-black text-primary mb-1">
                  {isHybrid ? "218" : isElectric ? "201" : "203"}
                  <span className="text-base font-normal text-muted-foreground ml-1">HP</span>
                </div>
                <div className="text-sm text-muted-foreground">Total Power</div>
              </div>
              
              <div className="text-center lg:text-left col-span-2 lg:col-span-1">
                <div className="text-2xl lg:text-3xl font-black text-primary mb-1">
                  AED {monthlyEMI.toLocaleString()}
                  <span className="text-base font-normal text-muted-foreground ml-1">/mo</span>
                </div>
                <div className="text-sm text-muted-foreground">Starting from</div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className={`flex flex-col sm:flex-row gap-4 ${isMobile ? 'items-center' : ''}`}
            >
              <Button 
                onClick={onBookTestDrive}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group min-h-[48px] flex-shrink-0"
              >
                <Calendar className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Book Test Drive
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
              </Button>
              
              <Button 
                onClick={onCarBuilder}
                variant="outline"
                size="lg"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-bold px-8 py-3 rounded-xl transition-all duration-300 group min-h-[48px] flex-shrink-0"
              >
                <Settings className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                Configure Your Car
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>5-Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Toyota Safety Sense</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Premium Features</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Vehicle Gallery */}
          <motion.div
            ref={heroImageRef}
            style={{ y, scale }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
              className="relative w-full h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-muted/30 to-card/30"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Loading Skeleton */}
              <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 animate-pulse" />
              
              {/* Vehicle Images */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentImageIndex}
                  src={galleryImages[currentImageIndex]}
                  alt={`${vehicle.name} - View ${currentImageIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  onLoad={(e) => {
                    const skeleton = e.currentTarget.previousElementSibling as HTMLElement;
                    if (skeleton) {
                      skeleton.style.display = 'none';
                    }
                  }}
                />
              </AnimatePresence>

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent" />

              {/* Image Controls - Bottom Left */}
              <motion.div 
                className="absolute bottom-4 left-4 flex items-center space-x-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <button
                  onClick={prevImage}
                  className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white transition-all duration-200 shadow-lg min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <ChevronLeft className="h-3 w-3 text-gray-700" />
                </button>
                
                <button
                  onClick={toggleAutoPlay}
                  className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white transition-all duration-200 shadow-lg min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  {isAutoPlaying ? (
                    <Pause className="h-3 w-3 text-gray-700" />
                  ) : (
                    <Play className="h-3 w-3 text-gray-700" />
                  )}
                </button>
                
                <button
                  onClick={nextImage}
                  className="p-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white transition-all duration-200 shadow-lg min-h-[32px] min-w-[32px] flex items-center justify-center"
                >
                  <ChevronRight className="h-3 w-3 text-gray-700" />
                </button>
              </motion.div>

              {/* Image Indicators */}
              <motion.div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white w-8 shadow-lg' 
                        : 'bg-white/50 w-2 hover:bg-white/70'
                    }`}
                  />
                ))}
              </motion.div>

              {/* Favorite & Share - Top Right */}
              <motion.div 
                className="absolute top-4 right-4 flex space-x-2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.6 }}
              >
                <button
                  onClick={onToggleFavorite}
                  className={`p-3 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-200 shadow-lg min-h-[44px] min-w-[44px] ${
                    isFavorite 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white/90 text-gray-700 hover:bg-white'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                
                <button className="p-3 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white transition-all duration-200 shadow-lg text-gray-700 min-h-[44px] min-w-[44px]">
                  <Share2 className="h-5 w-5" />
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
