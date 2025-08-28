import React from "react";
import { ChevronLeft, ChevronRight, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { useSwipeable } from "@/hooks/use-swipeable";
import { openTestDrivePopup } from "@/utils/testDriveUtils";

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
      const cardWidth = window.innerWidth < 640 ? 300 : window.innerWidth < 1024 ? 340 : 400;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleTestDrive = (vehicle: VehicleModel, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openTestDrivePopup(vehicle);
  };

  // Add swipe functionality
  const swipeableRef = useSwipeable({
    onSwipeLeft: () => scroll("right"),
    onSwipeRight: () => scroll("left"),
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  return (
    <div className="toyota-container py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            You Might Also Like
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Discover more vehicles that match your preferences
          </p>
        </div>
        <div className="hidden md:flex space-x-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 border-2 hover:border-toyota-red hover:text-toyota-red transition-all duration-300"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-12 w-12 border-2 hover:border-toyota-red hover:text-toyota-red transition-all duration-300"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
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
        className="relative overflow-x-auto pb-6 hide-scrollbar scroll-smooth snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="flex space-x-6 px-1">
          {enhancedVehicles.map((vehicle) => (
            <div
              key={vehicle.name}
              className="flex-shrink-0 w-[280px] sm:w-[320px] lg:w-[380px] snap-center"
            >
              <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                {/* Image Container */}
                <div className="relative h-56 sm:h-64 lg:h-72 overflow-hidden bg-gray-50 dark:bg-gray-700">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      vehicle.category === "Hybrid" ? "bg-green-600" :
                      vehicle.category === "Electric" ? "bg-blue-600" :
                      vehicle.category === "GR Performance" ? "bg-red-600" :
                      "bg-toyota-red"
                    }`}>
                      {vehicle.category}
                    </span>
                  </div>

                  {/* Action Buttons - Desktop (on hover) */}
                  <div className="absolute inset-0 hidden md:flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <Link 
                      to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm font-medium">View</span>
                    </Link>
                    <Button
                      onClick={(e) => handleTestDrive(vehicle, e)}
                      className="bg-toyota-red hover:bg-toyota-red/90 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-medium">Test Drive</span>
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-toyota-red transition-colors duration-300">
                      {vehicle.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-toyota-red">
                        AED {vehicle.price.toLocaleString()}
                      </p>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Starting from
                      </span>
                    </div>
                  </div>

                  {/* Features Preview */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vehicle.features.slice(0, 2).map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                    {vehicle.features.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                        +{vehicle.features.length - 2} more
                      </span>
                    )}
                  </div>

                  {/* Action Buttons - Mobile (always visible) */}
                  <div className="flex md:hidden space-x-3">
                    <Link 
                      to={`/vehicle/${vehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center space-x-2 h-11 hover:border-toyota-red hover:text-toyota-red transition-all duration-300"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Button>
                    </Link>
                    <Button
                      onClick={(e) => handleTestDrive(vehicle, e)}
                      className="flex-1 bg-toyota-red hover:bg-toyota-red/90 text-white flex items-center justify-center space-x-2 h-11 transition-all duration-300"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Test Drive</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Dots */}
      <div className="flex md:hidden justify-center mt-6 space-x-2">
        {enhancedVehicles.map((_, index) => (
          <div
            key={index}
            className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedVehicles;
