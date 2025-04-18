import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface PreOwnedVehicle {
  id: string;
  model: string;
  image: string;
  description: string;
  year: number;
  price: number;
  mileage: number;
  certified: boolean;
}

interface PreOwnedSectionProps {
  vehicles: PreOwnedVehicle[];
}

const PreOwnedSection: React.FC<PreOwnedSectionProps> = ({ vehicles }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const isMobile = useIsMobile();

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (autoScrollEnabled && !isInteracting) {
      intervalId = setInterval(() => {
        if (scrollContainerRef.current) {
          const { current } = scrollContainerRef;
          const isAtEnd = current.scrollLeft + current.clientWidth >= current.scrollWidth;
          
          if (isAtEnd) {
            current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scroll('right');
          }
        }
      }, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoScrollEnabled, isInteracting]);

  const handleInteractionStart = () => {
    setIsInteracting(true);
    setAutoScrollEnabled(false);
    setTimeout(() => setAutoScrollEnabled(true), 5000);
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-950">
      <div className="toyota-container">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Certified Pre-Owned
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Quality pre-owned Toyota vehicles, rigorously inspected and ready for the road.
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hidden md:flex"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full hidden md:flex"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div 
          className="overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none' }}
          ref={scrollContainerRef}
          onMouseEnter={!isMobile ? handleInteractionStart : undefined}
          onTouchStart={handleInteractionStart}
        >
          <div className="flex space-x-6">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                className="flex-shrink-0 w-[300px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.model}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {vehicle.certified && (
                      <Badge 
                        className="absolute top-3 left-3 bg-toyota-red text-white border-none"
                        variant="default"
                      >
                        Toyota Certified
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                      {vehicle.year} {vehicle.model}
                    </h3>
                    <p className="text-toyota-red font-semibold mb-3">
                      AED {vehicle.price.toLocaleString()}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {vehicle.mileage.toLocaleString()} km
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Warranty
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-toyota-red hover:bg-toyota-darkred"
                      asChild
                    >
                      <a href={`/pre-owned/details/${vehicle.id}`}>View Details</a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <Button
            variant="outline"
            size="lg"
            asChild
          >
            <a href="/pre-owned">View All Pre-Owned Vehicles</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PreOwnedSection;
