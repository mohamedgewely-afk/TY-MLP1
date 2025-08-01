
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Share2, Car, Settings, Play, Pause, Volume2, VolumeX, Sparkles, Calendar, Fuel, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';
import { glassStyles, premiumAnimations, createGlassVariant } from '@/utils/glassUtils';
import { typography, formatPremiumNumber } from '@/utils/typography';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const isInView = useInView(heroRef);
  
  // Premium parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Auto-rotation with enhanced timing
  useEffect(() => {
    if (!isAutoPlaying || !isInView) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % galleryImages.length);
    }, 6000); // Slower, more cinematic timing
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, isInView, galleryImages.length]);

  // Enhanced touch handlers with momentum
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 75; // Increased threshold for better UX
    const isRightSwipe = distance < -75;

    if (isLeftSwipe) {
      setCurrentImageIndex(prev => (prev + 1) % galleryImages.length);
    }
    if (isRightSwipe) {
      setCurrentImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  const priceInfo = formatPremiumNumber(vehicle.price);
  const isBestSeller = vehicle.name.includes("Camry") || vehicle.name.includes("Corolla") || vehicle.name.includes("Land Cruiser") || vehicle.name.includes("RAV4");

  return (
    <motion.section
      ref={heroRef}
      className="relative h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: premiumAnimations.duration.slow / 1000, ease: premiumAnimations.luxury }}
    >
      {/* Cinematic Background with Premium Parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ y, scale }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: imageLoaded ? 1 : 0, 
              scale: 1,
              transition: { 
                duration: premiumAnimations.duration.cinematic / 1000,
                ease: premiumAnimations.luxury
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              transition: { duration: premiumAnimations.duration.fast / 1000 }
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={galleryImages[currentImageIndex]}
              alt={`${vehicle.name} - Image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
            
            {/* Premium gradient overlays for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Luxury Glass Morphism Content Overlay */}
      <motion.div 
        className="relative z-20 h-full flex flex-col"
        style={{ opacity }}
      >
        {/* Premium Top Bar with Glass Morphism */}
        <motion.div 
          className={`${createGlassVariant('primary', 'sm')} m-4 rounded-2xl p-4`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: premiumAnimations.luxury }}
        >
          <div className="flex items-center justify-between">
            {/* Premium badges */}
            <div className="flex items-center space-x-2">
              {isBestSeller && (
                <Badge className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-3 py-1 text-xs font-bold">
                  <Award className="h-3 w-3 mr-1" />
                  Best Seller
                </Badge>
              )}
              <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 text-xs font-bold">
                <Shield className="h-3 w-3 mr-1" />
                5★ Safety
              </Badge>
            </div>

            {/* Luxury action buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={onToggleFavorite}
                className={`p-3 rounded-full ${createGlassVariant('secondary')} transition-all duration-300 ${
                  isFavorite ? 'text-red-500' : 'text-white/80 hover:text-white'
                }`}
              >
                <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 rounded-full ${createGlassVariant('secondary')} text-white/80 hover:text-white transition-all duration-300`}
              >
                <Share2 className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Premium Content Area */}
        <div className="flex-1 flex flex-col justify-center px-4 lg:px-8">
          <div className="toyota-container">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: premiumAnimations.luxury }}
              className="max-w-4xl"
            >
              {/* Luxury Vehicle Title */}
              <div className="mb-8">
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="flex items-center mb-4"
                >
                  <Sparkles className="h-6 w-6 text-yellow-400 mr-3" />
                  <span className={`${typography.accent.premium} text-yellow-400`}>
                    Premium Hybrid Technology
                  </span>
                </motion.div>
                
                <motion.h1 
                  className={`${typography.display[1]} text-white mb-4 drop-shadow-2xl`}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8, ease: premiumAnimations.luxury }}
                >
                  {vehicle.name}
                </motion.h1>
                
                <motion.p 
                  className={`${typography.body.large} text-white/90 mb-6 drop-shadow-lg max-w-2xl`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                >
                  Experience the perfect fusion of performance, efficiency, and luxury. 
                  Advanced hybrid technology meets premium design in every detail.
                </motion.p>
              </div>

              {/* Premium Pricing Display with Glass Morphism */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className={`${createGlassVariant('overlay', 'lg')} rounded-2xl p-6 mb-8 max-w-lg`}
              >
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-white/70 text-sm font-medium mb-2 uppercase tracking-wide">
                      Starting from
                    </div>
                    <div className={`${typography.heading[2]} text-white mb-1`}>
                      {priceInfo.main}
                    </div>
                    <div className="text-white/60 text-sm">
                      {priceInfo.full}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/70 text-sm font-medium mb-2 uppercase tracking-wide">
                      Monthly from
                    </div>
                    <div className={`${typography.heading[3]} text-primary mb-1`}>
                      {priceInfo.monthly}
                    </div>
                    <div className="text-white/60 text-sm">
                      60 months EMI
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Premium Action Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onBookTestDrive}
                    size="lg"
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-bold py-4 px-8 rounded-2xl shadow-2xl border-0 backdrop-blur-sm relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Car className="h-6 w-6 mr-3 relative z-10" />
                    <span className="relative z-10">Book Test Drive</span>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={onCarBuilder}
                    variant="outline"
                    size="lg"
                    className={`${createGlassVariant('primary', 'md')} border-2 border-white/30 text-white hover:text-white hover:bg-white/20 font-bold py-4 px-8 rounded-2xl backdrop-blur-xl`}
                  >
                    <Settings className="h-6 w-6 mr-3" />
                    Build & Price
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Premium Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <motion.div 
            className={`flex items-center space-x-6 ${createGlassVariant('primary', 'md')} rounded-full px-6 py-4`}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
          >
            {/* Image indicators */}
            <div className="flex space-x-2">
              {galleryImages.map((_, index) => (
                <motion.button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.8 }}
                />
              ))}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentImageIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length)}
                className="p-2 rounded-full text-white/80 hover:text-white transition-colors duration-300"
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className="p-2 rounded-full text-white/80 hover:text-white transition-colors duration-300"
              >
                {isAutoPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentImageIndex(prev => (prev + 1) % galleryImages.length)}
                className="p-2 rounded-full text-white/80 hover:text-white transition-colors duration-300"
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
};

export default EnhancedHeroSection;
