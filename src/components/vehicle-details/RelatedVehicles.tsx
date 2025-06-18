
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
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
  
  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // High-quality Toyota vehicle images
  const toyotaImages = [
    "https://www.toyota.com/content/dam/toyota/vehicles/2024/camry/images/desktop/hero/camry-24-hero-desktop-d.jpg",
    "https://www.toyota.com/content/dam/toyota/vehicles/2024/corolla/images/desktop/hero/corolla-24-hero-desktop-a.jpg",
    "https://www.toyota.com/content/dam/toyota/vehicles/2024/rav4/images/desktop/hero/rav4-24-hero-desktop-a.jpg",
    "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="toyota-container py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            You Might Also Like
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover other exceptional Toyota vehicles
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-primary hover:text-primary-foreground"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full hover:bg-primary hover:text-primary-foreground"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
      
      <div 
        className="relative overflow-x-auto pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none' }}
        ref={scrollContainerRef}
      >
        <div className="flex space-x-6">
          {relatedVehicles.map((vehicle, index) => (
            <motion.div
              key={vehicle.name}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Link 
                to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="flex-shrink-0 w-[320px] group block"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={toyotaImages[index % toyotaImages.length]}
                      alt={vehicle.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                      AED {vehicle.price.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {vehicle.category}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                      {vehicle.name}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      Experience the perfect blend of performance, efficiency, and luxury in this exceptional Toyota vehicle.
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Starting from
                      </p>
                      <span className="text-lg font-bold text-primary">
                        AED {vehicle.price.toLocaleString()}
                      </span>
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
