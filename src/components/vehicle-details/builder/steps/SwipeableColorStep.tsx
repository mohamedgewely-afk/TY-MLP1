import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useSwipeable } from "@/hooks/use-swipeable";
import { hapticFeedback } from "@/utils/haptic";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface SwipeableColorStepProps {
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
}

const SwipeableColorStep: React.FC<SwipeableColorStepProps> = ({ config, setConfig }) => {
  const exteriorColors = [
    { 
      name: "Pearl White", 
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", 
      price: 0,
      description: "Classic and timeless",
      swatch: "#f8fafc"
    },
    { 
      name: "Midnight Black", 
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", 
      price: 500,
      description: "Elegant and sophisticated",
      swatch: "#1e293b"
    },
    { 
      name: "Silver Metallic", 
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", 
      price: 300,
      description: "Modern and refined",
      swatch: "#94a3b8"
    }
  ];

  const interiorColors = [
    { name: "Black Leather", price: 0, description: "Premium black leather", swatch: "#1e293b" },
    { name: "Beige Leather", price: 800, description: "Luxurious beige leather", swatch: "#f3e8d0" },
    { name: "Gray Fabric", price: -500, description: "Comfortable gray fabric", swatch: "#6b7280" }
  ];

  const [exteriorIndex, setExteriorIndex] = React.useState(() => {
    return exteriorColors.findIndex(c => c.name === config.exteriorColor) || 0;
  });

  const [interiorIndex, setInteriorIndex] = React.useState(() => {
    return interiorColors.findIndex(c => c.name === config.interiorColor) || 0;
  });

  const exteriorSwipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (exteriorIndex < exteriorColors.length - 1) {
        hapticFeedback.selection();
        const newIndex = exteriorIndex + 1;
        setExteriorIndex(newIndex);
        setConfig(prev => ({ ...prev, exteriorColor: exteriorColors[newIndex].name }));
      }
    },
    onSwipeRight: () => {
      if (exteriorIndex > 0) {
        hapticFeedback.selection();
        const newIndex = exteriorIndex - 1;
        setExteriorIndex(newIndex);
        setConfig(prev => ({ ...prev, exteriorColor: exteriorColors[newIndex].name }));
      }
    },
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  const interiorSwipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      if (interiorIndex < interiorColors.length - 1) {
        hapticFeedback.selection();
        const newIndex = interiorIndex + 1;
        setInteriorIndex(newIndex);
        setConfig(prev => ({ ...prev, interiorColor: interiorColors[newIndex].name }));
      }
    },
    onSwipeRight: () => {
      if (interiorIndex > 0) {
        hapticFeedback.selection();
        const newIndex = interiorIndex - 1;
        setInteriorIndex(newIndex);
        setConfig(prev => ({ ...prev, interiorColor: interiorColors[newIndex].name }));
      }
    },
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  const selectExteriorColor = (index: number) => {
    hapticFeedback.light();
    setExteriorIndex(index);
    setConfig(prev => ({ ...prev, exteriorColor: exteriorColors[index].name }));
  };

  const selectInteriorColor = (index: number) => {
    hapticFeedback.light();
    setInteriorIndex(index);
    setConfig(prev => ({ ...prev, interiorColor: interiorColors[index].name }));
  };

  return (
    <div className="space-y-8 toyota-spacing-md">
      {/* Exterior Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-foreground">
          Exterior Color
        </h3>
        
        <div ref={exteriorSwipeRef}>
          <motion.div
            key={exteriorIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="border-2 border-toyota-red-subtle shadow-luxury">
              <CardContent className="toyota-spacing-md">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src={exteriorColors[exteriorIndex].image} 
                      alt={exteriorColors[exteriorIndex].name} 
                      className="w-24 h-16 object-cover rounded-lg shadow-md" 
                    />
                    <div 
                      className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: exteriorColors[exteriorIndex].swatch }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-foreground">
                      {exteriorColors[exteriorIndex].name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      {exteriorColors[exteriorIndex].description}
                    </p>
                    {exteriorColors[exteriorIndex].price > 0 && (
                      <p className="text-sm font-medium text-toyota-red-subtle">
                        +AED {exteriorColors[exteriorIndex].price}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Exterior Color Indicators */}
        <div className="flex justify-center space-x-2">
          {exteriorColors.map((color, index) => (
            <motion.button
              key={index}
              onClick={() => selectExteriorColor(index)}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                index === exteriorIndex 
                  ? 'border-toyota-red-subtle scale-110 shadow-md' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.swatch }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Interior Colors */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-foreground">
          Interior Color
        </h3>
        
        <div ref={interiorSwipeRef}>
          <motion.div
            key={interiorIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Card className="border-2 border-toyota-red-subtle shadow-luxury">
              <CardContent className="toyota-spacing-md">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-lg border-2 border-white shadow-md"
                    style={{ backgroundColor: interiorColors[interiorIndex].swatch }}
                  />
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-foreground">
                      {interiorColors[interiorIndex].name}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-1">
                      {interiorColors[interiorIndex].description}
                    </p>
                    {interiorColors[interiorIndex].price !== 0 && (
                      <p className={`text-sm font-medium ${
                        interiorColors[interiorIndex].price > 0 
                          ? 'text-toyota-red-subtle' 
                          : 'text-green-600'
                      }`}>
                        {interiorColors[interiorIndex].price > 0 ? '+' : ''}AED {interiorColors[interiorIndex].price}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Interior Color Indicators */}
        <div className="flex justify-center space-x-2">
          {interiorColors.map((color, index) => (
            <motion.button
              key={index}
              onClick={() => selectInteriorColor(index)}
              className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${
                index === interiorIndex 
                  ? 'border-toyota-red-subtle scale-110 shadow-md' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{ backgroundColor: color.swatch }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>

      {/* Swipe Hint */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span>← Swipe to explore colors →</span>
        </div>
      </div>
    </div>
  );
};

export default SwipeableColorStep;