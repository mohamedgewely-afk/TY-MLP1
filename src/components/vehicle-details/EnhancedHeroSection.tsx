
import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Calendar, 
  Shield, 
  Award,
  ArrowRight,
  Settings
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { OptimizedCarousel } from "@/components/ui/optimized-carousel";
import YouTubeEmbed from "@/components/ui/youtube-embed";
import AnimatedCounter from "@/components/ui/animated-counter";
import { openTestDrivePopup } from "@/utils/testDriveUtils";

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
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Full Background Media */}
      <motion.div
        ref={heroImageRef}
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Vehicle Images or Video */}
        {showVideo ? (
          <motion.div
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
          <OptimizedCarousel
            images={galleryImages}
            aspectRatio="hero"
            autoPlay={isHeroInView}
            interval={4000}
            className="w-full h-full"
            showControls={!isMobile}
            showIndicators={true}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </motion.div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="toyota-container pb-4">
          {/* Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
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

          {/* Compact Price Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-black/60 backdrop-blur-md rounded-lg p-3 mb-3 border border-white/20 max-w-xs mx-auto"
          >
            {/* Main Pricing */}
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

            {/* Performance Stats */}
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

          {/* Action Buttons */}
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
