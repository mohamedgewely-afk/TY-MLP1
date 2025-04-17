
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Heart, RotateCw, Check } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";

interface VehicleCardProps {
  vehicle: VehicleModel;
  onCompare: (vehicle: VehicleModel) => void;
  isCompared: boolean;
  onQuickView: (vehicle: VehicleModel) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onCompare,
  isCompared,
  onQuickView,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const cardVariants = {
    front: {
      rotateY: 0,
    },
    back: {
      rotateY: 180,
    },
  };

  return (
    <div className="relative h-full">
      <motion.div
        className="h-full preserve-3d cursor-pointer"
        initial="front"
        animate={isFlipped ? "back" : "front"}
        variants={cardVariants}
        transition={{ duration: 0.6, type: "spring", stiffness: 300, damping: 20 }}
        style={{ perspective: 1000 }}
      >
        {/* Front of card */}
        <Card className={`h-full backface-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 ${isFlipped ? "opacity-0" : "opacity-100"}`}>
          <div className="relative h-48 overflow-hidden rounded-t-xl">
            <img
              src={vehicle.image}
              alt={vehicle.name}
              className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
            />
            <Badge
              className="absolute top-3 left-3 bg-toyota-red text-white border-none"
              variant="default"
            >
              {vehicle.category}
            </Badge>
            <button
              onClick={handleFavoriteToggle}
              className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm
                ${isFavorite ? "text-red-500" : "text-gray-500"}`}
            >
              <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          <CardContent className="p-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 truncate">
              {vehicle.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              From AED {vehicle.price.toLocaleString()}
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {vehicle.features.slice(0, 3).map((feature, idx) => (
                <div
                  key={idx}
                  className="text-xs bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center"
                >
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleFlip}
              >
                <Info className="h-4 w-4 mr-1" /> Details
              </Button>
              <Button
                variant={isCompared ? "default" : "secondary"}
                size="sm"
                className={`flex-1 ${isCompared ? "bg-toyota-red hover:bg-toyota-darkred" : ""}`}
                onClick={() => onCompare(vehicle)}
              >
                {isCompared ? (
                  <>
                    <Check className="h-4 w-4 mr-1" /> Compared
                  </>
                ) : (
                  "Compare"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className={`h-full absolute inset-0 backface-hidden rotateY-180 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 ${isFlipped ? "opacity-100" : "opacity-0"}`}>
          <CardContent className="p-6 flex flex-col h-full">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
              {vehicle.name} - Specifications
            </h3>

            <div className="flex-1 mb-4">
              <ul className="space-y-2 text-sm">
                {vehicle.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                      <Check className="h-3 w-3" />
                    </span>
                    {feature}
                  </li>
                ))}
                <li className="flex items-start">
                  <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                    <Check className="h-3 w-3" />
                  </span>
                  Fuel Efficiency: 17.5 km/L
                </li>
                <li className="flex items-start">
                  <span className="inline-block bg-toyota-red/10 text-toyota-red rounded-full p-1 mr-2">
                    <Check className="h-3 w-3" />
                  </span>
                  Warranty: 5 years / 100,000 km
                </li>
              </ul>
            </div>

            <div className="mt-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleFlip}
              >
                <RotateCw className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1 bg-toyota-red hover:bg-toyota-darkred"
                onClick={() => onQuickView(vehicle)}
              >
                Quick View
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VehicleCard;
