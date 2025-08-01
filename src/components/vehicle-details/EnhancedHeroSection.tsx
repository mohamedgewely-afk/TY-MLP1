
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
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
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);
  
  const heroImageRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroImageRef);

  // Premium easing curve
  const premiumEasing = [0.25, 0.1, 0.25, 1];
  const mobileAnimationDuration = 0.3;
  const desktopAnimationDuration = 0.5;

  // Auto-rotate gallery images with enhanced timing
  useEffect(() => {
    if (!isHeroInView || !isAutoPlaying || showVideo) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 4500); // Slightly longer for premium feel
    
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

  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  const isHybrid = vehicle.name.toLowerCase().includes('hybrid');
  const isElectric = vehicle.name.toLowerCase().includes('bz4x') || vehicle.category === 'Electric';

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Enhanced Full Background Media */}
      <motion.div
        ref={heroImageRef}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Premium Loading Skeleton */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 via-muted/10 to-muted/30 animate-pulse" />
        
        {/* Vehicle Images or Video with Enhanced Transitions */}
        <AnimatePresence mode="wait">
          {showVideo ? (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ 
                duration: isMobile ? mobileAnimationDuration : desktopAnimationDuration, 
                ease: premiumEasing 
              }}
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
            <motion.img
              key={currentImageIndex}
              src={galleryImages[currentImageIndex]}
              alt={`${vehicle.name} - View ${currentImageIndex + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ 
                duration: isMobile ? mobileAnimationDuration : desktopAnimationDuration, 
                ease: premiumEasing 
              }}
              loading="lazy"
              onLoad={(e) => {
                const skeleton = e.currentTarget.previousElementSibling as HTMLElement;
                if (skeleton) {
                  skeleton.style.display = 'none';
                }
              }}
            />
          )}
        </AnimatePresence>

        {/* Premium Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      </motion.div>

      {/* Enhanced Navigation Controls - Desktop Only */}
      {!isMobile && !showVideo && (
        <>
          <motion.button
            onClick={prevImage}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full bg-black/30 border border-white/20 hover:bg-black/50 transition-all duration-300 group"
          >
            <ChevronLeft className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </motion.button>
          <motion.button
            onClick={nextImage}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-4 rounded-full bg-black/30 border border-white/20 hover:bg-black/50 transition-all duration-300 group"
          >
            <ChevronRight className="h-6 w-6 text-white group-hover:scale-110 transition-transform" />
          </motion.button>
        </>
      )}

      {/* Enhanced Pause Button */}
      <motion.div 
        className="absolute bottom-6 right-6 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6, ease: premiumEasing }}
      >
        <button
          onClick={toggleAutoPlay}
          className="p-3 rounded-full bg-black/40 border border-white/30 hover:bg-black/60 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
        >
          {isAutoPlaying ? (
            <Pause className="h-4 w-4 text-white" />
          ) : (
            <Play className="h-4 w-4 text-white" />
          )}
        </button>
      </motion.div>

      {/* Enhanced Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="toyota-container pb-6 md:pb-8">
          {/* Enhanced Image Indicators */}
          {!showVideo && (
            <motion.div 
              className="flex justify-center space-x-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: premiumEasing }}
            >
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-1.5 rounded-full transition-all duration-500 hover:scale-110 ${
                    index === currentImageIndex 
                      ? 'bg-white w-8 shadow-lg' 
                      : 'bg-white/50 w-1.5 hover:bg-white/70'
                  }`}
                />
              ))}
            </motion.div>
          )}

          {/* Enhanced Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: premiumEasing }}
            className="flex flex-wrap gap-2 justify-center mb-4"
          >
            {isBestSeller && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-3 py-1.5 text-sm font-semibold shadow-lg">
                <Award className="h-3 w-3 mr-1.5" />
                Best Seller
              </Badge>
            )}
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-3 py-1.5 text-sm font-semibold shadow-lg">
              <Shield className="h-3 w-3 mr-1.5" />
              5-Star Safety
            </Badge>
          </motion.div>

          {/* Enhanced Vehicle Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: premiumEasing }}
            className="text-center mb-4"
          >
            <h1 className={`font-black text-white leading-tight tracking-tight ${
              isMobile ? 'text-2xl' : 'text-4xl lg:text-5xl'
            }`}>
              {vehicle.name}
            </h1>
          </motion.div>

          {/* Enhanced Premium Price Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: premiumEasing }}
            className="bg-black/70 border border-white/20 rounded-2xl p-4 md:p-6 mb-6 max-w-md mx-auto shadow-2xl"
          >
            {/* Enhanced Main Pricing */}
            <div className="flex justify-between items-center mb-4">
              <div className="text-center flex-1">
                <div className="text-xs md:text-sm text-white/70 uppercase font-semibold tracking-wide mb-1">Starting From</div>
                <div className={`font-black text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                  AED <AnimatedCounter value={vehicle.price} duration={2.5} />
                </div>
                <div className="text-xs text-white/80">*Price includes VAT</div>
              </div>
              
              <div className="w-px h-12 bg-white/30 mx-3"></div>
              
              <div className="text-center flex-1">
                <div className="text-xs md:text-sm text-white/70 uppercase font-semibold tracking-wide mb-1">Monthly EMI</div>
                <div className={`font-black text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                  AED <AnimatedCounter value={monthlyEMI} duration={2} />
                  <span className="text-sm font-normal text-white/80 ml-1">/mo</span>
                </div>
                <div className="text-xs text-white/80">*80% financing</div>
              </div>
            </div>

            {/* Enhanced Performance Stats */}
            <div className="flex justify-between items-center pt-4 border-t border-white/30">
              <div className="text-center">
                <div className={`font-black text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  <AnimatedCounter 
                    value={isHybrid ? 25.2 : isElectric ? 450 : 22.2} 
                    decimals={1}
                    duration={2}
                  />
                  <span className="text-sm font-normal text-white/80 ml-1">
                    {isElectric ? "km" : "km/L"}
                  </span>
                </div>
                <div className="text-xs text-white/70 tracking-wide">
                  {isElectric ? "Range" : "Fuel Efficiency"}
                </div>
              </div>
              
              <div className="text-center">
                <div className={`font-black text-white ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  <AnimatedCounter 
                    value={isHybrid ? 218 : isElectric ? 201 : 203}
                    duration={2}
                  />
                  <span className="text-sm font-normal text-white/80 ml-1">HP</span>
                </div>
                <div className="text-xs text-white/70 tracking-wide">Total Power</div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6, ease: premiumEasing }}
            className="flex flex-col gap-3"
          >
            <Button 
              onClick={onBookTestDrive}
              size={isMobile ? "default" : "lg"}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group w-full"
            >
              <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Book Test Drive
              <motion.div
                className="ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </Button>
            
            <Button 
              onClick={onCarBuilder}
              variant="outline"
              size={isMobile ? "default" : "lg"}
              className="border-2 border-white/60 text-white hover:bg-white hover:text-gray-900 font-bold px-6 py-3 rounded-xl transition-all duration-300 group bg-black/20 w-full hover:scale-105"
            >
              <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Configure Your Car
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
