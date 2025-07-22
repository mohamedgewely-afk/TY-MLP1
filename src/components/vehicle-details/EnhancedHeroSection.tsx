
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

  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  const isHybrid = vehicle.name.toLowerCase().includes('hybrid');
  const isElectric = vehicle.name.toLowerCase().includes('bz4x') || vehicle.category === 'Electric';

  return (
    <section ref={heroRef} className="relative min-h-screen overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 animate-pulse" />
        
        {/* Vehicle Images or Video */}
        <AnimatePresence mode="wait">
          {showVideo ? (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
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
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
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

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

      </motion.div>

      {/* Content Overlay - All Controls and Content Moved to Bottom */}
      <div className="relative z-10 h-full">
        <div className="absolute bottom-0 left-0 right-0 pb-20 pt-8">
          <div className="toyota-container">
            {/* Media Controls - Moved to Bottom */}
            <motion.div 
              className="flex items-center justify-center space-x-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <button
                onClick={toggleVideo}
                className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white transition-all duration-200 shadow-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                {showVideo ? (
                  <img src="/placeholder.svg" alt="Image" className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 text-gray-700" />
                )}
              </button>
              
              {!showVideo && (
                <>
                  <button
                    onClick={prevImage}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white transition-all duration-200 shadow-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-700" />
                  </button>
                  
                  <button
                    onClick={toggleAutoPlay}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white transition-all duration-200 shadow-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                  >
                    {isAutoPlaying ? (
                      <Pause className="h-4 w-4 text-gray-700" />
                    ) : (
                      <Play className="h-4 w-4 text-gray-700" />
                    )}
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="p-2 rounded-full bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white transition-all duration-200 shadow-lg min-h-[36px] min-w-[36px] flex items-center justify-center"
                  >
                    <ChevronRight className="h-4 w-4 text-gray-700" />
                  </button>
                </>
              )}
            </motion.div>

            {/* Image Indicators - Moved to Bottom */}
            {!showVideo && (
              <motion.div 
                className="flex justify-center space-x-2 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
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
            )}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center space-y-3 max-w-4xl mx-auto"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-3">
                {isBestSeller && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 text-xs">
                      <Award className="h-3 w-3 mr-1" />
                      Best Seller
                    </Badge>
                  </motion.div>
                )}
                
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                >
                  <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1 text-xs">
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
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight mb-2">
                  {vehicle.name}
                </h1>
              </motion.div>

              {/* Key Stats - Better Price Listing */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 mb-4 border border-white/10"
              >
                <div className="grid grid-cols-2 gap-4">
                  {/* Price Section */}
                  <div className="text-center border-r border-white/20">
                    <div className="text-lg lg:text-xl font-black text-white mb-1">
                      AED <AnimatedCounter 
                        value={vehicle.price}
                        duration={2.5}
                      />
                    </div>
                    <div className="text-xs text-white/70">Starting Price</div>
                  </div>
                  
                  {/* Monthly EMI */}
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-black text-white mb-1">
                      AED <AnimatedCounter 
                        value={monthlyEMI}
                        duration={2}
                      />
                      <span className="text-sm font-normal text-white/80 ml-1">/mo</span>
                    </div>
                    <div className="text-xs text-white/70">Monthly EMI</div>
                  </div>
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-black text-white mb-1">
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
                      {isElectric ? "Range" : "Efficiency"}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-black text-white mb-1">
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

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 justify-center items-center"
              >
                <Button 
                  onClick={onBookTestDrive}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group min-h-[48px] w-full sm:w-auto"
                >
                  <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
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
                  size="sm"
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-gray-900 font-bold px-6 py-3 rounded-xl transition-all duration-300 group min-h-[48px] bg-white/10 backdrop-blur-sm w-full sm:w-auto"
                >
                  <Settings className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Configure Your Car
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
