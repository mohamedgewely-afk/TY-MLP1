
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { useSwipeable } from "@/hooks/use-swipeable";
import { motion } from "framer-motion";

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
    
    return {
      ...vehicle,
      image: carImages[index % carImages.length]
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

  // Premium easing curve
  const premiumEasing = [0.25, 0.1, 0.25, 1];

  return (
    <div className="toyota-container py-16">
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: premiumEasing }}
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-2">
            You Might Also Like
          </h2>
          <p className="text-lg text-muted-foreground">
            Discover similar vehicles that match your preferences
          </p>
        </div>
        <div className="hidden md:flex space-x-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 border-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 border-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
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
          {enhancedVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1, 
                ease: premiumEasing 
              }}
              className="flex-shrink-0 w-[280px] md:w-[320px]"
            >
              <Link 
                to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="block group"
              >
                <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group border border-border/50 hover:border-primary/20">
                  <div className="h-56 md:h-64 overflow-hidden relative">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Premium Price Badge */}
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      AED {(vehicle.price / 1000).toFixed(0)}K
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                      {vehicle.name}
                    </h3>
                    <p className="text-muted-foreground mb-4 capitalize font-medium">
                      {vehicle.category}
                    </p>
                    
                    {/* Enhanced Pricing Display */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Starting from</span>
                        <span className="text-2xl font-black text-primary">
                          AED {vehicle.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Monthly EMI</span>
                        <span className="font-semibold text-foreground">
                          AED {Math.round(vehicle.price * 0.8 * 0.035 / 12 * Math.pow(1 + 0.035/12, 60) / (Math.pow(1 + 0.035/12, 60) - 1)).toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedVehicles;
