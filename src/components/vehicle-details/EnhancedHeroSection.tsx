
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
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
  Pause,
  Maximize,
  ZoomIn,
  Info,
  Battery,
  Wifi
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import ProgressiveImage from "@/components/ui/progressive-image";
import AnimatedCounter from "@/components/ui/animated-counter";
import { openTestDrivePopup } from "@/utils/testDriveUtils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useGestureControls } from "@/hooks/use-gesture-controls";
import { useDeviceCapabilities } from "@/hooks/use-device-capabilities";
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInteractivePoints, setShowInteractivePoints] = useState(false);
  
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const { elementRef: heroImageRef, isInView } = useIntersectionObserver({ 
    threshold: 0.3,
    triggerOnce: false 
  });
  
  const { containerRef, gestureState, resetGesture } = useGestureControls();
  const deviceCapabilities = useDeviceCapabilities();
  
  // Physics-based animations with spring
  const springConfig = { stiffness: 100, damping: 30, mass: 1 };
  const y = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, -100]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [1, 0]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.3], [1, 1.05]), springConfig);

  // Adaptive behavior based on device capabilities
  const shouldReduceAnimations = deviceCapabilities.prefersReducedMotion || 
                                 deviceCapabilities.isLowPowerMode || 
                                 deviceCapabilities.isSlowConnection;

  // Haptic feedback function
  const triggerHaptic = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (deviceCapabilities.supportsHaptics && !deviceCapabilities.isLowPowerMode) {
      const intensity = { light: 50, medium: 100, heavy: 200 }[type];
      navigator.vibrate?.(intensity);
    }
  }, [deviceCapabilities]);

  // Smart preloading for adjacent images
  useEffect(() => {
    const preloadImages = () => {
      const nextIndex = (currentImageIndex + 1) % galleryImages.length;
      const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
      
      [nextIndex, prevIndex].forEach(index => {
        const img = new Image();
        img.src = galleryImages[index];
      });
    };

    if (!deviceCapabilities.isSlowConnection) {
      preloadImages();
    }
  }, [currentImageIndex, galleryImages, deviceCapabilities.isSlowConnection]);

  // Optimized auto-rotation with performance considerations
  useEffect(() => {
    if (!isInView || !isAutoPlaying || showVideo || gestureState.isZoomed) return;
    
    const interval = shouldReduceAnimations ? 6000 : 4000;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, interval);
    
    return () => clearInterval(timer);
  }, [isInView, galleryImages.length, isAutoPlaying, showVideo, gestureState.isZoomed, shouldReduceAnimations]);

  // Enhanced touch handlers with requestAnimationFrame optimization
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      requestAnimationFrame(() => {
        // Store touch start position for gesture recognition
      });
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    triggerHaptic('light');
  }, [triggerHaptic]);

  const nextImage = useCallback(() => {
    triggerHaptic('medium');
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length, triggerHaptic]);

  const prevImage = useCallback(() => {
    triggerHaptic('medium');
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length, triggerHaptic]);

  const toggleAutoPlay = useCallback(() => {
    triggerHaptic('light');
    setIsAutoPlaying(!isAutoPlaying);
  }, [isAutoPlaying, triggerHaptic]);

  const toggleFullscreen = useCallback(async () => {
    triggerHaptic('heavy');
    
    if (!document.fullscreenElement) {
      await heroRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, [triggerHaptic]);

  const handleTestDrive = useCallback(() => {
    triggerHaptic('medium');
    openTestDrivePopup(vehicle);
  }, [vehicle, triggerHaptic]);

  // Dynamic content based on vehicle type and user persona
  const isBestSeller = 
    vehicle.name === "Toyota Camry" || 
    vehicle.name === "Toyota Corolla Hybrid" || 
    vehicle.name === "Toyota Land Cruiser" || 
    vehicle.name === "Toyota RAV4 Hybrid";

  const isHybrid = vehicle.name.toLowerCase().includes('hybrid');
  const isElectric = vehicle.name.toLowerCase().includes('bz4x') || vehicle.category === 'Electric';

  // Interactive hotspots for vehicle features
  const interactivePoints = [
    { x: 25, y: 35, label: "LED Headlights", description: "Advanced LED technology with auto-leveling" },
    { x: 75, y: 45, label: "Safety Sense 2.0", description: "Pre-collision system with pedestrian detection" },
    { x: 50, y: 60, label: "Hybrid Powertrain", description: "Efficient hybrid system for optimal fuel economy" },
    { x: 85, y: 75, label: "Smart Entry", description: "Keyless entry with push-button start" }
  ];

  // Generate responsive srcSet for images
  const generateSrcSet = useCallback((imageSrc: string) => {
    const baseUrl = imageSrc.split('?')[0];
    return `
      ${baseUrl}?w=480&q=75 480w,
      ${baseUrl}?w=768&q=80 768w,
      ${baseUrl}?w=1024&q=85 1024w,
      ${baseUrl}?w=1920&q=90 1920w
    `.trim();
  }, []);

  return (
    <section ref={heroRef} className={cn(
      "relative h-screen overflow-hidden",
      isFullscreen && "z-50"
    )}>
      {/* Adaptive Quality Indicator */}
      {deviceCapabilities.isSlowConnection && (
        <div className="absolute top-4 left-4 z-30 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <Wifi className="h-4 w-4 text-orange-400" />
          <span className="text-xs text-white">Optimized for slow connection</span>
        </div>
      )}

      {/* Battery Status (when low) */}
      {deviceCapabilities.isLowPowerMode && (
        <div className="absolute top-4 right-20 z-30 flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <Battery className="h-4 w-4 text-red-400" />
          <span className="text-xs text-white">Power saving mode</span>
        </div>
      )}

      {/* Enhanced Background Media with Gesture Support */}
      <motion.div
        ref={containerRef}
        style={{ y: shouldReduceAnimations ? 0 : y, scale: shouldReduceAnimations ? 1 : scale }}
        className="absolute inset-0 w-full h-full"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Progressive Loading with Blur Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30" />
        
        {/* Vehicle Images with Enhanced Loading */}
        <AnimatePresence mode="wait">
          {!showVideo && (
            <motion.div
              key={currentImageIndex}
              className="relative w-full h-full"
              style={{
                transform: `scale(${gestureState.scale}) translate(${gestureState.translateX}px, ${gestureState.translateY}px)`,
                transformOrigin: 'center center'
              }}
              initial={shouldReduceAnimations ? { opacity: 1 } : { opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceAnimations ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: shouldReduceAnimations ? 0.3 : 0.8, ease: "easeInOut" }}
            >
              <ProgressiveImage
                src={galleryImages[currentImageIndex]}
                alt={`${vehicle.name} - View ${currentImageIndex + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                placeholderSrc={`${galleryImages[currentImageIndex]}?w=50&q=20&blur=10`}
                srcSet={generateSrcSet(galleryImages[currentImageIndex])}
                sizes="100vw"
                priority={currentImageIndex === 0}
              />
              
              {/* Interactive Hotspots */}
              {showInteractivePoints && !isMobile && (
                <div className="absolute inset-0">
                  {interactivePoints.map((point, index) => (
                    <motion.div
                      key={index}
                      className="absolute group cursor-pointer"
                      style={{ left: `${point.x}%`, top: `${point.y}%` }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      whileHover={{ scale: 1.1 }}
                      onClick={() => triggerHaptic('light')}
                    >
                      <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse">
                        <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm text-white p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        <div className="font-semibold text-sm">{point.label}</div>
                        <div className="text-xs text-gray-300 mt-1">{point.description}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced gradient with better performance */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
      </motion.div>

      {/* Enhanced Control Panel */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col space-y-2">
        {/* Fullscreen Toggle */}
        <motion.button
          onClick={toggleFullscreen}
          className="p-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all duration-200 shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Maximize className="h-4 w-4 text-white" />
        </motion.button>

        {/* Interactive Points Toggle */}
        {!isMobile && (
          <motion.button
            onClick={() => setShowInteractivePoints(!showInteractivePoints)}
            className={cn(
              "p-3 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-200 shadow-lg",
              showInteractivePoints ? "bg-primary/80 text-white" : "bg-white/20 text-white hover:bg-white/30"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Info className="h-4 w-4" />
          </motion.button>
        )}

        {/* Auto-play Toggle with Enhanced Feedback */}
        <motion.button
          onClick={toggleAutoPlay}
          className={cn(
            "p-3 rounded-full backdrop-blur-sm border border-white/30 transition-all duration-200 shadow-lg",
            isAutoPlaying ? "bg-white/20 text-white" : "bg-primary/80 text-white"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isAutoPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </motion.button>
      </div>

      {/* Enhanced Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="toyota-container pb-4">
          {/* Image Indicators with Enhanced UX */}
          {!showVideo && (
            <motion.div 
              className="flex justify-center space-x-1 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              {galleryImages.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    triggerHaptic('light');
                    setCurrentImageIndex(index);
                  }}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300 min-w-[44px] min-h-[44px] flex items-center justify-center",
                    index === currentImageIndex 
                      ? 'w-4' 
                      : 'w-1 hover:w-2'
                  )}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    index === currentImageIndex 
                      ? 'bg-white w-4' 
                      : 'bg-white/40 w-1 hover:bg-white/60'
                  )} />
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Enhanced Badges with Micro-interactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-wrap gap-1 justify-center mb-2"
          >
            {isBestSeller && (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-1.5 py-0.5 text-xs">
                  <Award className="h-2.5 w-2.5 mr-1" />
                  Best Seller
                </Badge>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-1.5 py-0.5 text-xs">
                <Shield className="h-2.5 w-2.5 mr-1" />
                5-Star Safety
              </Badge>
            </motion.div>
          </motion.div>

          {/* Enhanced Vehicle Title */}
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

          {/* Enhanced Price Box with Progressive Disclosure */}
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

          {/* Enhanced Action Buttons with Better Accessibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col gap-2"
          >
            <Button 
              onClick={handleTestDrive}
              size="sm"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-bold px-4 py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group w-full min-h-[44px]"
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
              className="border border-white/40 text-white hover:bg-white hover:text-gray-900 font-bold px-4 py-2.5 rounded-lg transition-all duration-300 group bg-white/10 backdrop-blur-sm w-full min-h-[44px]"
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
