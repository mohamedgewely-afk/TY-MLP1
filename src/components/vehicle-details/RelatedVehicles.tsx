
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { useSwipeable } from "@/hooks/use-swipeable";

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
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/a5bffab2-6c0d-4698-bfe7-b4ab7114ec03/items/718fe2b9-69dc-49cb-ab72-7a714fe09c7c/renditions/4afae9e9-eae7-4c29-b479-3e81915738fa?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b617024c-790e-4264-99ad-b567a5abd42f/items/050d2454-b898-4f27-996b-da16f414dc8e/renditions/b7523349-2c02-4fd7-b04b-d016375ef61c?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/1a74e5e6-9eda-4f96-8fdc-b058fcabcf91/items/beab9d5e-f876-416c-87d4-bff470a14bb6/renditions/24c3483d-c6f5-4232-b6a9-428586545c9e?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b376e31a-ea8e-4cfc-a37c-76facfe281fb/items/d62b7086-fa7a-4867-bf76-3243fc018d7b/renditions/10f89ffa-4588-4cf3-b421-379905d8d95c?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/9c85f040-9909-4849-a7ae-ec4ad5e58fc9/items/c3299bde-9daf-4e4c-b414-b6fd46451f1a/renditions/5625cce1-79a1-4c27-9782-1c159c91669c?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/aa687942-b6eb-4c47-b8c8-307ef0fbea09/items/362c4e6c-953c-4532-8b1b-e31dd9948f60/renditions/716f5b2f-42f4-4419-baa8-9e8207d332fd?binary=true&mformat=true"
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
        ref={(el) => {
          scrollContainerRef.current = el;
          if (swipeableRef.current !== el) {
            swipeableRef.current = el;
          }
        }}
        className="relative overflow-x-auto pb-4 hide-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex space-x-6">
          {enhancedVehicles.map((vehicle) => (
            <Link 
              key={vehicle.name} 
              to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="flex-shrink-0 w-[300px] card-zoom-effect"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
