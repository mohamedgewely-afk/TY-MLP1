
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Palette, Sofa, Package, Plus, Minus, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";

interface ColorsAccessoriesStepProps {
  config: { exteriorColor: string; interiorColor: string; accessories: string[] };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const exteriorColors = [
  { name: "Pearl White", color: "#F8F9FA", price: 0, popular: true, image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
  { name: "Midnight Black", color: "#1A1B23", price: 500, popular: true, image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
  { name: "Silver Metallic", color: "#8B9DC3", price: 300, popular: false, image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" },
  { name: "Deep Blue", color: "#1E3A8A", price: 400, popular: false, image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
  { name: "Ruby Red", color: "#DC2626", price: 600, popular: false, image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" }
];

const interiorColors = [
  { name: "Black Leather", color: "#1F2937", price: 0, material: "Premium Leather", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", description: "Luxurious black leather seats" },
  { name: "Beige Leather", color: "#F3E8D0", price: 800, material: "Premium Leather", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", description: "Elegant beige leather interior" },
  { name: "Gray Fabric", color: "#6B7280", price: -500, material: "Sport Fabric", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", description: "Sporty gray fabric upholstery" }
];

const accessories = [
  { name: "Premium Sound System", price: 1200, category: "Entertainment", description: "High-quality audio system" },
  { name: "Sunroof", price: 800, category: "Comfort", description: "Panoramic sunroof" },
  { name: "Navigation System", price: 600, category: "Technology", description: "Advanced GPS navigation" },
  { name: "Heated Seats", price: 400, category: "Comfort", description: "Front seat heating" },
  { name: "Backup Camera", price: 300, category: "Safety", description: "Rear view camera" },
  { name: "Alloy Wheels", price: 900, category: "Style", description: "18-inch alloy wheels" }
];

const ColorsAccessoriesStep: React.FC<ColorsAccessoriesStepProps> = ({ config, setConfig }) => {
  const [colorCarouselIndex, setColorCarouselIndex] = useState(0);
  const [accessoryCarouselIndex, setAccessoryCarouselIndex] = useState(0);

  // Exterior Colors Carousel
  const exteriorCarouselRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => nextExteriorColor(),
    onSwipeRight: () => prevExteriorColor(),
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  const nextExteriorColor = () => {
    const newIndex = (colorCarouselIndex + 1) % exteriorColors.length;
    setColorCarouselIndex(newIndex);
    setConfig(prev => ({ ...prev, exteriorColor: exteriorColors[newIndex].name }));
  };

  const prevExteriorColor = () => {
    const newIndex = colorCarouselIndex === 0 ? exteriorColors.length - 1 : colorCarouselIndex - 1;
    setColorCarouselIndex(newIndex);
    setConfig(prev => ({ ...prev, exteriorColor: exteriorColors[newIndex].name }));
  };

  // Accessories Carousel
  const accessoryCarouselRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => nextAccessory(),
    onSwipeRight: () => prevAccessory(),
    threshold: 50,
    preventDefaultTouchmoveEvent: false
  });

  const nextAccessory = () => {
    setAccessoryCarouselIndex((prev) => (prev + 1) % accessories.length);
  };

  const prevAccessory = () => {
    setAccessoryCarouselIndex((prev) => prev === 0 ? accessories.length - 1 : prev - 1);
  };

  const toggleAccessory = (accessoryName: string) => {
    setConfig(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryName)
        ? prev.accessories.filter(acc => acc !== accessoryName)
        : [...prev.accessories, accessoryName]
    }));
  };

  const currentExteriorColor = exteriorColors[colorCarouselIndex];
  const currentAccessory = accessories[accessoryCarouselIndex];

  return (
    <div className="p-4 space-y-6 h-full overflow-y-auto">
      {/* Exterior Colors Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Palette className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Exterior Color</h3>
          </div>
          <p className="text-sm text-muted-foreground">Swipe to explore colors</p>
        </div>
        
        <div className="relative" ref={exteriorCarouselRef}>
          {/* Navigation Arrows */}
          <button
            onClick={prevExteriorColor}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-background transition-all duration-200 shadow-lg"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          
          <button
            onClick={nextExteriorColor}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-background transition-all duration-200 shadow-lg"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>

          {/* Color Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={colorCarouselIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-primary/10 border-2 border-primary rounded-xl p-4 mx-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-lg border-2 border-border/50 shadow-inner relative overflow-hidden">
                  <img
                    src={currentExteriorColor.image}
                    alt={currentExteriorColor.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-1">{currentExteriorColor.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {currentExteriorColor.price > 0 ? `+AED ${currentExteriorColor.price}` : 'Included'}
                </p>
                {currentExteriorColor.popular && (
                  <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                    Popular
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots for exterior colors */}
          <div className="flex justify-center mt-4 space-x-2">
            {exteriorColors.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setColorCarouselIndex(index);
                  setConfig(prev => ({ ...prev, exteriorColor: exteriorColors[index].name }));
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === colorCarouselIndex
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Interior Colors Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sofa className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Interior Color</h3>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {interiorColors.map((color, index) => {
            const isSelected = config.interiorColor === color.name;
            
            return (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 5) * 0.1, duration: 0.4 }}
                className={`relative rounded-xl cursor-pointer transition-all duration-300 border-2 p-3 ${
                  isSelected 
                    ? 'bg-primary/10 border-primary shadow-lg' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg border-2 border-border/50 flex-shrink-0"
                    style={{ backgroundColor: color.color }}
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground">{color.name}</h4>
                    <p className="text-xs text-muted-foreground">{color.material}</p>
                    <p className="text-xs text-foreground font-medium">
                      {color.price > 0 ? `+AED ${color.price}` : color.price < 0 ? `AED ${color.price}` : 'Included'}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Accessories Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Package className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Accessories</h3>
          </div>
          <p className="text-sm text-muted-foreground">Swipe to explore accessories</p>
        </div>
        
        <div className="relative" ref={accessoryCarouselRef}>
          {/* Navigation Arrows */}
          <button
            onClick={prevAccessory}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-background transition-all duration-200 shadow-lg"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
          
          <button
            onClick={nextAccessory}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 hover:bg-background transition-all duration-200 shadow-lg"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>

          {/* Accessory Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={accessoryCarouselIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={`rounded-xl cursor-pointer transition-all duration-300 border-2 p-4 mx-8 ${
                config.accessories.includes(currentAccessory.name)
                  ? 'bg-primary/10 border-primary shadow-lg' 
                  : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
              }`}
              onClick={() => toggleAccessory(currentAccessory.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-base font-semibold text-foreground">{currentAccessory.name}</h4>
                    <span className="px-2 py-1 bg-muted/70 text-muted-foreground text-xs rounded-md">
                      {currentAccessory.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{currentAccessory.description}</p>
                  <p className="text-sm font-medium text-foreground">+AED {currentAccessory.price}</p>
                </div>
                
                <motion.div
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                    config.accessories.includes(currentAccessory.name)
                      ? 'bg-primary border-primary text-primary-foreground' 
                      : 'border-border bg-background hover:border-primary/50'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {config.accessories.includes(currentAccessory.name) ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots for accessories */}
          <div className="flex justify-center mt-4 space-x-2">
            {accessories.map((_, index) => (
              <button
                key={index}
                onClick={() => setAccessoryCarouselIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === accessoryCarouselIndex
                    ? 'bg-primary scale-125'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Selected Accessories Summary */}
      {config.accessories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-muted/30 rounded-xl p-3 border border-border/50"
        >
          <h4 className="text-sm font-semibold text-foreground mb-2">Selected Accessories:</h4>
          <div className="flex flex-wrap gap-2">
            {config.accessories.map((accessory) => (
              <span key={accessory} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-md">
                {accessory}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ColorsAccessoriesStep;
