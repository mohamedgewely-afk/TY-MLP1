import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion } from "framer-motion";
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
import { openTestDrivePopup } from "@/utils/testDriveUtils";
import { OptimizedMotionImage } from "@/components/ui/optimized-motion-image";
import { optimizedSprings } from "@/utils/animation-performance";

interface MinimalHeroSectionProps {
  vehicle: VehicleModel;
  galleryImages: string[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onBookTestDrive: () => void;
  onCarBuilder: () => void;
}

const MinimalHeroSection: React.FC<MinimalHeroSectionProps> = ({
  vehicle,
  galleryImages,
  onBookTestDrive,
  onCarBuilder,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  
  // Subtle parallax for premium feel
  const y = useTransform(scrollYProgress, [0, 0.3], [0, prefersReducedMotion ? 0 : -30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, prefersReducedMotion ? 1 : 0.8]);
  
  const heroImageRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroImageRef, { margin: '100px' });

  // Auto-rotate gallery images
  useEffect(() => {
    if (!isHeroInView || !isAutoPlaying || showVideo) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000); // Slower transition for luxury feel
    
    return () => clearInterval(interval);
  }, [isHeroInView, galleryImages.length, isAutoPlaying, showVideo]);

  const handleTestDrive = () => {
    openTestDrivePopup(vehicle);
  };

  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  return (
    <section ref={heroRef} className="relative h-screen overflow-hidden">
      {/* Clean Background Media */}
      <motion.div
        ref={heroImageRef}
        style={{ y }}
        className="absolute inset-0 w-full h-full"
      >
        {/* Vehicle Images */}
        <AnimatePresence mode="wait">
          <OptimizedMotionImage
            key={`hero-image-${currentImageIndex}`}
            src={galleryImages[currentImageIndex] || ''}
            alt={`${vehicle.name} - View ${currentImageIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            priority={currentImageIndex === 0}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : optimizedSprings.fast}
            enableGPU={!prefersReducedMotion}
          />
        </AnimatePresence>

        {/* Minimal Gradient - Only where needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      </motion.div>

      {/* Pause Button - Subtle placement */}
      <motion.div 
        className="absolute top-6 right-6 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
        >
          {isAutoPlaying ? (
            <Pause className="h-3 w-3 text-white" />
          ) : (
            <Play className="h-3 w-3 text-white" />
          )}
        </button>
      </motion.div>

      {/* Minimal Content - Bottom left */}
      <div className="absolute bottom-0 left-0 z-10 p-6 max-w-lg">
        {/* Essential Badges Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex gap-2 mb-4"
        >
          {isBestSeller && (
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 text-xs border-0">
              <Award className="h-3 w-3 mr-1" />
              Best Seller
            </Badge>
          )}
          <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-2 py-1 text-xs border-0">
            <Shield className="h-3 w-3 mr-1" />
            5-Star Safety
          </Badge>
        </motion.div>

        {/* Vehicle Title - Clean typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-6"
        >
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
            {vehicle.name}
          </h1>
          <p className="text-white/80 text-base font-medium">
            Starting from AED {vehicle.price.toLocaleString()}
          </p>
        </motion.div>

        {/* Single Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button 
            onClick={handleTestDrive}
            size="lg"
            className="bg-[hsl(var(--toyota-red))] hover:bg-[hsl(var(--toyota-red))]/90 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 group border-0"
          >
            <Calendar className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Experience This Vehicle
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button 
            onClick={onCarBuilder}
            variant="outline"
            size="lg"
            className="border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm"
          >
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </motion.div>
      </div>

      {/* Minimal Image Indicators */}
      <motion.div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex space-x-2">
          {galleryImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white w-6' 
                  : 'bg-white/40 w-1 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default MinimalHeroSection;