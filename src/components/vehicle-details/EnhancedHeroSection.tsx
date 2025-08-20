import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Calendar, 
  Shield, 
  Award,
  ArrowRight,
  Settings,
  Play,
  Pause
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import YouTubeEmbed from "@/components/ui/youtube-embed";
import AnimatedCounter from "@/components/ui/animated-counter";
import { openTestDrivePopup } from "@/utils/testDriveUtils";
import { AccessibleCarousel } from "@/components/ui/AccessibleCarousel";
import { cn } from "@/lib/utils";

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
  const [showVideo, setShowVideo] = useState(false);
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);
  
  const heroImageRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroImageRef);

  const handleTestDrive = () => {
    openTestDrivePopup(vehicle);
  };

  const toggleVideo = () => {
    setShowVideo(!showVideo);
  };

  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  const isHybrid = vehicle.name.toLowerCase().includes('hybrid');
  const isElectric = vehicle.name.toLowerCase().includes('bz4x') || vehicle.category === 'Electric';

  return (
    <section 
      ref={heroRef} 
      className="relative h-screen overflow-hidden"
      role="banner"
      aria-label={`${vehicle.name} hero section`}
    >
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:text-foreground focus:px-4 focus:py-2 focus:rounded focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Full Background Media */}
      <motion.div
        ref={heroImageRef}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Loading Skeleton */}
        <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 animate-pulse" />
        
        {/* Enhanced Accessible Carousel for Images or Video */}
        <AnimatePresence mode="wait">
          {showVideo ? (
            <motion.div
              key="video"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
              role="region"
              aria-label="Vehicle promotional video"
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
            <AccessibleCarousel
              autoplay={isHeroInView}
              autoplayDelay={4000}
              showControls={true}
              showIndicators={true}
              loop={true}
              className="absolute inset-0 w-full h-full"
            >
              {galleryImages.map((image, index) => (
                <div key={index} className="relative w-full h-full">
                  <img
                    src={image}
                    alt={`${vehicle.name} - View ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    onLoad={(e) => {
                      const skeleton = e.currentTarget.previousElementSibling as HTMLElement;
                      if (skeleton) {
                        skeleton.style.display = 'none';
                      }
                    }}
                  />
                </div>
              ))}
            </AccessibleCarousel>
          )}
        </AnimatePresence>

        {/* Minimal Gradient - Only at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" role="presentation" />
      </motion.div>

      {/* Video Toggle Button */}
      <motion.div 
        className="absolute top-4 right-4 z-20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Button
          onClick={toggleVideo}
          variant="outline"
          size="sm"
          className="bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white"
          aria-label={showVideo ? "Show image gallery" : "Show promotional video"}
        >
          {showVideo ? "Gallery" : "Video"}
        </Button>
      </motion.div>

      {/* Compact Content Overlay - Much smaller area */}
      <div className="absolute bottom-0 left-0 right-0 z-10" id="main-content">
        <div className="toyota-container pb-4">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-1 justify-center mb-2"
            role="group"
            aria-label="Vehicle badges"
          >
            {isBestSeller && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-1.5 py-0.5 text-xs">
                <Award className="h-2.5 w-2.5 mr-1" aria-hidden="true" />
                Best Seller
              </Badge>
            )}
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-1.5 py-0.5 text-xs">
              <Shield className="h-2.5 w-2.5 mr-1" aria-hidden="true" />
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
            role="region"
            aria-label="Vehicle pricing information"
          >
            {/* Main Pricing - Horizontal Layout */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-center flex-1">
                <div className="text-xs text-white/60 uppercase font-medium">Starting From</div>
                <div className="text-lg font-black text-white">
                  <span className="sr-only">Price: </span>
                  AED <AnimatedCounter value={vehicle.price} duration={2.5} />
                </div>
                <div className="text-xs text-white/80">*Price includes VAT</div>
              </div>
              
              <div className="w-px h-10 bg-white/20 mx-2" role="separator" />
              
              <div className="text-center flex-1">
                <div className="text-xs text-white/60 uppercase font-medium">Monthly EMI</div>
                <div className="text-lg font-black text-white">
                  <span className="sr-only">Monthly payment: </span>
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
            role="group"
            aria-label="Vehicle actions"
          >
            <Button 
              onClick={handleTestDrive}
              size="sm"
              className={cn(
                "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70",
                "text-primary-foreground font-bold px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl",
                "transition-all duration-300 group w-full",
                "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
              )}
            >
              <Calendar className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
              Book Test Drive
              <motion.div
                className="ml-2"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                aria-hidden="true"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </motion.div>
            </Button>
            
            <Button 
              onClick={onCarBuilder}
              variant="outline"
              size="sm"
              className={cn(
                "border border-white/40 text-white hover:bg-white hover:text-gray-900",
                "font-bold px-4 py-2.5 rounded-lg transition-all duration-300 group",
                "bg-white/10 backdrop-blur-sm w-full",
                "focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
              )}
            >
              <Settings className="h-3.5 w-3.5 mr-2 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
              Configure Your Car
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;
