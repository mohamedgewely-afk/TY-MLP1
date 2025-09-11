
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Calendar, 
  Shield, 
  Award,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Settings,
  Play,
  Pause
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import YouTubeEmbed from "@/components/ui/youtube-embed";
import AnimatedCounter from "@/components/ui/animated-counter";
import { openTestDrivePopup } from "@/utils/testDriveUtils";
import { OptimizedMotionImage } from "@/components/ui/optimized-motion-image";
import { optimizedSprings } from "@/utils/animation-performance";

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
  const [showVideo, setShowVideo] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  
  // Reduced parallax intensity for better performance
  const y = useTransform(scrollYProgress, [0, 0.3], [0, prefersReducedMotion ? 0 : -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, prefersReducedMotion ? 1 : 0.7]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, prefersReducedMotion ? 1 : 1.02]);
  
  const heroImageRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroImageRef, { margin: '100px' });

  // Auto-rotate gallery images
  useEffect(() => {
    if (!isHeroInView || !isAutoPlaying || showVideo) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isHeroInView, galleryImages.length, isAutoPlaying, showVideo]);

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

  const toggleVideo = () => {
    setShowVideo(!showVideo);
    if (!showVideo) {
      setIsAutoPlaying(false);
    }
  };

  const handleTestDrive = () => {
    openTestDrivePopup(vehicle);
  };

  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  const isHybrid = vehicle.name.toLowerCase().includes('hybrid');
  const isElectric = vehicle.name.toLowerCase().includes('bz4x') || vehicle.category === 'Electric';

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Full Background Media */}
      <motion.div
        ref={heroImageRef}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Loading Skeleton */}
        <div className="hero-skeleton absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 animate-pulse" style={{ display: 'block' }} />
        
        {/* Vehicle Images or Video */}
        <AnimatePresence mode="wait">
          {showVideo ? (
            <motion.div
              key="video"
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              transition={prefersReducedMotion ? { duration: 0.1 } : optimizedSprings.smooth}
              className="absolute inset-0 w-full h-full"
            >
              <YouTubeEmbed
                videoId="xEkrrzLvya8"
                className="w-full h-full"
                autoplay={true}
                muted={true}
                controls={false}
              />
            </motion.div>
          ) : (
            <OptimizedMotionImage
              key={`hero-image-${currentImageIndex}`}
              src={galleryImages[currentImageIndex] || ''}
              alt={`${vehicle.name} - View ${currentImageIndex + 1}`}
              className="absolute inset-0 w-full h-full"
              priority={currentImageIndex === 0}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
              transition={prefersReducedMotion ? { duration: 0.1 } : optimizedSprings.fast}
              enableGPU={!prefersReducedMotion}
              onLoad={() => {
                const skeleton = document.querySelector('.hero-skeleton') as HTMLElement;
                if (skeleton) {
                  skeleton.style.display = 'none';
                }
              }}
              onError={() => {
                console.warn('Hero image failed to load:', galleryImages[currentImageIndex]);
              }}
            />
          )}
        </AnimatePresence>

        {/* Minimal Gradient - Only at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </motion.div>

      {/* Pause Button - Bottom Right Corner */}
      <motion.div 
        className="absolute bottom-4 right-4 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <button
          onClick={toggleAutoPlay}
          className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 shadow-lg"
        >
          {isAutoPlaying ? (
            <Pause className="h-4 w-4 text-white" />
          ) : (
            <Play className="h-4 w-4 text-white" />
          )}
        </button>
      </motion.div>

      {/* Compact Content Overlay - Much smaller area */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="toyota-container pb-4">
          {/* Image Indicators */}
          {!showVideo && (
            <motion.div 
              className="flex justify-center space-x-1 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-white w-4' 
                      : 'bg-white/40 w-1 hover:bg-white/60'
                  }`}
                />
              ))}
            </motion.div>
          )}

          {/* Badges */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { delay: 0.3, ...optimizedSprings.fast }}
            className="flex flex-wrap gap-1 justify-center mb-2"
          >
            {isBestSeller && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-1.5 py-0.5 text-xs">
                <Award className="h-2.5 w-2.5 mr-1" />
                Best Seller
              </Badge>
            )}
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-1.5 py-0.5 text-xs">
              <Shield className="h-2.5 w-2.5 mr-1" />
              5-Star Safety
            </Badge>
          </motion.div>

          {/* Vehicle Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-center mb-2"
          >
            <h1 className="text-xl md:text-2xl font-black text-white leading-tight">
              {vehicle.name}
            </h1>
          </motion.div>

          {/* Very Compact Price Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-black/60 backdrop-blur-md rounded-lg p-3 mb-3 border border-white/20 max-w-xs mx-auto"
          >
            {/* Main Pricing - Horizontal Layout */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-center flex-1">
                <div className="text-xs text-white/60 uppercase font-medium">Starting From</div>
                <div className="text-lg font-black text-white">
                  AED <AnimatedCounter value={vehicle.price} duration={2.5} />
                </div>
                <div className="text-xs text-white/80">*Price includes VAT</div>
              </div>
              
              <div className="w-px h-10 bg-white/20 mx-2"></div>
              
              <div className="text-center flex-1">
                <div className="text-xs text-white/60 uppercase font-medium">Monthly EMI</div>
                <div className="text-lg font-black text-white">
                  AED <AnimatedCounter value={monthlyEMI} duration={2} />
                  <span className="text-sm font-normal text-white/80">/mo</span>
                </div>
                <div className="text-xs text-white/80">*80% financing</div>
              </div>
            </div>

            {/* Performance Stats - Horizontal */}
            <div className="flex justify-between items-center pt-2 border-t border-white/20">
              <div className="text-center">
                <div className="text-base font-black text-white">
                  <AnimatedCounter 
                    value={isHybrid ? 25.2 : isElectric ? 450 : 22.2} 
                    decimals={1}
                    duration={2}
                  />
                  <span className="text-sm font-normal text-white/80 ml-1">
                    {isElectric ? "km" : "km/L"}
                  </span>
                </div>
                <div className="text-xs text-white/70">
                  {isElectric ? "Range" : "Fuel Efficiency"}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-base font-black text-white">
                  <AnimatedCounter 
                    value={isHybrid ? 218 : isElectric ? 201 : 203}
                    duration={2}
                  />
                  <span className="text-sm font-normal text-white/80 ml-1">HP</span>
                </div>
                <div className="text-xs text-white/70">Total Power</div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col gap-2"
          >
            <Button 
              onClick={handleTestDrive}
              size="sm"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group w-full"
            >
              <Calendar className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" />
              Book Test Drive
              <div className="ml-2 animate-pulse">
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Button>
            
            <Button 
              onClick={onCarBuilder}
              variant="outline"
              size="sm"
              className="border border-white/40 text-white hover:bg-white hover:text-gray-900 font-bold px-4 py-2.5 rounded-lg transition-all duration-300 group bg-white/10 backdrop-blur-sm w-full"
            >
              <Settings className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Configure Your Car
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
