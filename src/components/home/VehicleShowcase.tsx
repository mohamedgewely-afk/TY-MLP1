
import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VehicleCard from "./VehicleCard";
import { VehicleModel } from "@/types/vehicle";

interface VehicleShowcaseProps {
  title: string;
  vehicles: VehicleModel[];
  compareList: string[];
  onCompare: (vehicle: VehicleModel) => void;
  onQuickView: (vehicle: VehicleModel) => void;
}

const VehicleShowcase: React.FC<VehicleShowcaseProps> = ({
  title,
  vehicles,
  compareList,
  onCompare,
  onQuickView,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="toyota-container">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
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
          className="relative overflow-x-auto pb-4"
          style={{ scrollbarWidth: 'none' }}
          ref={scrollContainerRef}
        >
          <div className="flex space-x-6">
            {vehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.name}
                className="flex-shrink-0 w-[300px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <VehicleCard
                  vehicle={vehicle}
                  onCompare={onCompare}
                  isCompared={compareList.includes(vehicle.name)}
                  onQuickView={onQuickView}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleShowcase;
