
import React from "react";
import { ChevronLeft, ChevronRight, Star, Award, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { useSwipeable } from "@/hooks/use-swipeable";
import { motion } from "framer-motion";
import { glassStyles, premiumAnimations, createGlassVariant } from '@/utils/glassUtils';
import { typography, formatPremiumNumber } from '@/utils/typography';

interface RelatedVehiclesProps {
  currentVehicle: VehicleModel;
}

const RelatedVehicles: React.FC<RelatedVehiclesProps> = ({ currentVehicle }) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Get vehicles in the same category or similar price range
  const relatedVehicles = vehicles.filter(vehicle => 
    vehicle.name !== currentVehicle.name && (
      vehicle.category === currentVehicle.category ||
      Math.abs(vehicle.price - currentVehicle.price) < 30000
    )
  ).slice(0, 6);
  
  // Enhanced car images for related vehicles
  const enhancedVehicles = relatedVehicles.map((vehicle, index) => {
    const carImages = [
      "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/gallery/camry-24-gallery-desktop-a.jpg",
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=800&q=80"
    ];
    
    const isBestSeller = vehicle.name.includes("Camry") || vehicle.name.includes("Corolla") || vehicle.name.includes("RAV4");
    const isHybrid = vehicle.name.toLowerCase().includes("hybrid");
    const hasSafety = true; // Assume all have safety features
    
    return {
      ...vehicle,
      image: carImages[index % carImages.length],
      badges: {
        bestSeller: isBestSeller,
        hybrid: isHybrid,
        safety: hasSafety
      }
    };
  });
  
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Add swipe functionality
  const swipeableRef = useSwipeable({
    onSwipeLeft: () => scroll("right"),
    onSwipeRight: () => scroll("left"),
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  return (
    <section className="py-16 bg-gradient-to-br from-muted/20 via-background to-muted/30 relative overflow-hidden">
      {/* Premium background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
      
      <div className="toyota-container relative z-10">
        <motion.div 
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: premiumAnimations.luxury }}
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`inline-flex items-center ${createGlassVariant('secondary', 'sm')} text-primary px-4 py-2 rounded-full text-sm font-semibold`}
            >
              <Star className="h-4 w-4 mr-2" />
              You Might Also Like
            </motion.div>
            
            <h2 className={`${typography.heading[1]} text-foreground`}>
              Similar Vehicles
            </h2>
            <p className={`${typography.body.base} text-muted-foreground max-w-2xl`}>
              Discover other exceptional Toyota vehicles that match your preferences and lifestyle needs.
            </p>
          </div>
          
          {/* Premium navigation controls */}
          <div className="hidden md:flex space-x-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className={`${createGlassVariant('primary', 'md')} rounded-full h-12 w-12 border border-border/30 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300`}
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="icon"
                className={`${createGlassVariant('primary', 'md')} rounded-full h-12 w-12 border border-border/30 hover:border-primary/50 text-foreground hover:text-primary transition-all duration-300`}
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
        
        <div 
          ref={(el) => {
            scrollContainerRef.current = el;
            if (swipeableRef.current !== el) {
              swipeableRef.current = el;
            }
          }}
          className="relative overflow-x-auto pb-6 scrollbar-hide"
          style={{ scrollbarWidth: 'none' }}
        >
          <div className="flex space-x-6 md:space-x-8">
            {enhancedVehicles.map((vehicle, index) => {
              const priceInfo = formatPremiumNumber(vehicle.price);
              
              return (
                <motion.div
                  key={vehicle.name}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * premiumAnimations.stagger.items, 
                    ease: premiumAnimations.luxury 
                  }}
                  className="flex-shrink-0 w-[300px] md:w-[340px]"
                >
                  <Link 
                    to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block group"
                  >
                    <motion.div 
                      className={`${createGlassVariant('primary', 'lg')} rounded-3xl overflow-hidden transition-all duration-500 group border border-border/30 hover:border-primary/30 relative`}
                      whileHover={{ 
                        y: -12,
                        scale: 1.02,
                        transition: { type: "spring", stiffness: 400, damping: 25 }
                      }}
                    >
                      {/* Premium image container */}
                      <div className="h-64 md:h-72 overflow-hidden relative">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Premium gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Premium badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {vehicle.badges.bestSeller && (
                            <Badge className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                              <Award className="h-3 w-3 mr-1" />
                              Best Seller
                            </Badge>
                          )}
                          {vehicle.badges.hybrid && (
                            <Badge className="bg-gradient-to-r from-green-600 to-green-500 text-white px-2 py-1 text-xs font-bold rounded-full">
                              <Zap className="h-3 w-3 mr-1" />
                              Hybrid
                            </Badge>
                          )}
                        </div>
                        
                        {/* Premium price badge */}
                        <div className={`absolute top-4 right-4 ${createGlassVariant('overlay')} text-white px-3 py-2 rounded-full text-sm font-bold`}>
                          {priceInfo.main}
                        </div>
                      </div>
                      
                      {/* Premium content */}
                      <div className="p-6 space-y-4">
                        <div className="space-y-2">
                          <h3 className={`${typography.heading[3]} text-foreground group-hover:${typography.interactive.luxury} transition-all duration-300`}>
                            {vehicle.name}
                          </h3>
                          <p className="text-muted-foreground capitalize font-medium text-sm">
                            {vehicle.category}
                          </p>
                        </div>
                        
                        {/* Enhanced pricing display */}
                        <div className={`${createGlassVariant('subtle', 'sm')} rounded-xl p-4 space-y-3`}>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground font-medium">Starting from</span>
                            <span className={`${typography.heading[4]} ${typography.accent.gradient}`}>
                              {priceInfo.full}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Monthly EMI</span>
                            <span className="font-semibold text-foreground">
                              {priceInfo.monthly}
                            </span>
                          </div>
                        </div>

                        {/* Premium features */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            {vehicle.badges.safety && (
                              <div className="flex items-center text-green-600 text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                5★ Safety
                              </div>
                            )}
                          </div>
                          <div className="flex items-center text-muted-foreground text-xs">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            4.8/5 Rating
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedVehicles;
