
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";

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

  return (
    <div className="toyota-container py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          You Might Also Like
        </h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div 
        className="relative overflow-x-auto pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none' }}
        ref={scrollContainerRef}
      >
        <div className="flex space-x-6">
          {relatedVehicles.map((vehicle) => (
            <Link 
              key={vehicle.name} 
              to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex-shrink-0 w-[300px] card-zoom-effect"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md">
                <div className="h-48 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    {vehicle.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {vehicle.category}
                  </p>
                  <p className="font-semibold text-toyota-red">
                    From AED {vehicle.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RelatedVehicles;
