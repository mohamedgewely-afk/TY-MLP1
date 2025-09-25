
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Palette, Sofa, Package, Plus, Minus, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ColorsAccessoriesStepProps {
  config: { exteriorColor: string; interiorColor: string; accessories: string[] };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const exteriorColors = [
  { 
    name: "Pearl White", 
    color: "#F8F9FA", 
    price: 0, 
    popular: true, 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true"
  },
  { 
    name: "Midnight Black", 
    color: "#1A1B23", 
    price: 500, 
    popular: true, 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true"
  },
  { 
    name: "Silver Metallic", 
    color: "#8B9DC3", 
    price: 300, 
    popular: false, 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true"
  },
  { 
    name: "Deep Blue", 
    color: "#1E3A8A", 
    price: 400, 
    popular: false, 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true"
  },
  { 
    name: "Ruby Red", 
    color: "#DC2626", 
    price: 600, 
    popular: false, 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true"
  }
];

const interiorColors = [
  { 
    name: "Black Leather", 
    color: "#1F2937", 
    price: 0, 
    material: "Premium Leather", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true"
  },
  { 
    name: "Beige Leather", 
    color: "#F3E8D0", 
    price: 800, 
    material: "Premium Leather", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true"
  },
  { 
    name: "Gray Fabric", 
    color: "#6B7280", 
    price: -500, 
    material: "Sport Fabric", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true"
  }
];

const accessories = [
  { name: "Premium Sound System", price: 1200, category: "Entertainment", description: "9-speaker premium audio system" },
  { name: "Sunroof", price: 800, category: "Comfort", description: "Panoramic glass sunroof" },
  { name: "Navigation System", price: 600, category: "Technology", description: "GPS navigation with real-time traffic" },
  { name: "Heated Seats", price: 400, category: "Comfort", description: "Front seat heating system" },
  { name: "Backup Camera", price: 300, category: "Safety", description: "Rear-view camera with guidelines" },
  { name: "Alloy Wheels", price: 900, category: "Style", description: "18-inch premium alloy wheels" }
];

const ColorsAccessoriesStep: React.FC<ColorsAccessoriesStepProps> = ({ config, setConfig }) => {
  const [exteriorColorIndex, setExteriorColorIndex] = useState(() => {
    const selectedIndex = exteriorColors.findIndex(color => color.name === config.exteriorColor);
    return selectedIndex >= 0 ? selectedIndex : 0;
  });
  
  const [accessoryIndex, setAccessoryIndex] = useState(0);

  const toggleAccessory = (accessoryName: string) => {
    setConfig(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryName)
        ? prev.accessories.filter(acc => acc !== accessoryName)
        : [...prev.accessories, accessoryName]
    }));
  };

  const nextExteriorColor = () => {
    const newIndex = (exteriorColorIndex + 1) % exteriorColors.length;
    setExteriorColorIndex(newIndex);
    setConfig(prev => ({ ...prev, exteriorColor: exteriorColors[newIndex].name }));
  };

  const prevExteriorColor = () => {
    const newIndex = (exteriorColorIndex - 1 + exteriorColors.length) % exteriorColors.length;
    setExteriorColorIndex(newIndex);
    setConfig(prev => ({ ...prev, exteriorColor: exteriorColors[newIndex].name }));
  };

  const nextAccessory = () => {
    setAccessoryIndex((prev) => (prev + 1) % accessories.length);
  };

  const prevAccessory = () => {
    setAccessoryIndex((prev) => (prev - 1 + accessories.length) % accessories.length);
  };

  const exteriorSwipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: nextExteriorColor,
    onSwipeRight: prevExteriorColor,
    threshold: 50,
    preventDefaultTouchmoveEvent: true
  });

  const accessorySwipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: nextAccessory,
    onSwipeRight: prevAccessory,
    threshold: 50,
    preventDefaultTouchmoveEvent: true
  });

  return (
    <div className="p-3 space-y-3 h-full overflow-y-auto">
      {/* Exterior Colors Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Palette className="h-4 w-4 text-primary" />
            <h3 className="text-base font-bold text-foreground">Exterior Color</h3>
          </div>
          <p className="text-xs text-muted-foreground">Swipe to explore colors</p>
        </div>
        
        <div className="relative">
          <div ref={exteriorSwipeRef} className="overflow-hidden rounded-xl">
            <motion.div
              className="flex"
              animate={{ x: -exteriorColorIndex * 100 + "%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {exteriorColors.map((color, index) => {
                const isSelected = config.exteriorColor === color.name;
                const isCurrent = index === exteriorColorIndex;
                
                return (
                  <div key={color.name} className="w-full flex-shrink-0 px-1">
                    <div
                      className={`relative rounded-xl cursor-pointer transition-all duration-300 border-2 overflow-hidden ${
                        isSelected 
                          ? 'bg-primary/10 border-primary shadow-lg ring-2 ring-primary/20' 
                          : isCurrent
                            ? 'bg-card border-primary/50 hover:border-primary/70 hover:shadow-md ring-1 ring-primary/10'
                            : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                      }`}
                      onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                    >
                      {/* Car Image */}
                      <div className="relative h-28 overflow-hidden">
                        <img
                          src={color.image}
                          alt={color.name}
                          className="w-full h-full object-cover object-center scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        
                        {/* Color swatch */}
                        <div className="absolute top-2 left-2">
                          <div 
                            className="w-5 h-5 rounded-full border-2 border-white shadow-lg"
                            style={{ backgroundColor: color.color }}
                          />
                        </div>
                        
                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2"
                          >
                            <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                              <Check className="h-3 w-3" />
                            </div>
                          </motion.div>
                        )}
                        
                        {color.popular && (
                          <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary/90 text-primary-foreground text-xs rounded-full">
                            Popular
                          </div>
                        )}
                      </div>
                      
                      <div className="p-2 text-center">
                        <h4 className="text-sm font-semibold text-foreground mb-0.5 truncate">{color.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {color.price > 0 ? `+AED ${color.price}` : 'Included'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevExteriorColor}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background border border-border rounded-full p-1.5 shadow-lg transition-all duration-200"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          
          <button
            onClick={nextExteriorColor}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background border border-border rounded-full p-1.5 shadow-lg transition-all duration-200"
          >
            <ChevronRight className="h-3 w-3" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1 mt-2">
            {exteriorColors.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setExteriorColorIndex(index);
                  setConfig(prev => ({ ...prev, exteriorColor: exteriorColors[index].name }));
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  index === exteriorColorIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Interior Colors and Accessories Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex-1"
      >
        <Tabs defaultValue="interior" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-2">
            <TabsTrigger value="interior" className="flex items-center gap-2 text-xs">
              <Sofa className="h-3 w-3" />
              Interior
            </TabsTrigger>
            <TabsTrigger value="accessories" className="flex items-center gap-2 text-xs">
              <Package className="h-3 w-3" />
              Accessories
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="interior" className="mt-0 flex-1">
            <div className="text-center mb-2">
              <h3 className="text-base font-bold text-foreground mb-1">Interior Color</h3>
              <p className="text-xs text-muted-foreground">Choose your interior materials</p>
              {!config.interiorColor && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2 mt-2 text-xs text-red-500 font-medium bg-red-50 rounded-lg p-2 border border-red-200"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Please select an interior color</span>
                </motion.div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {interiorColors.map((color, index) => {
                const isSelected = config.interiorColor === color.name;
                
                return (
                  <motion.div
                    key={color.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className={`relative rounded-lg cursor-pointer transition-all duration-300 border-2 p-3 ${
                      isSelected 
                        ? 'bg-primary/10 border-primary shadow-lg scale-[1.02] ring-2 ring-primary/20' 
                        : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2"
                      >
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg border-2 border-border/50 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: color.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground truncate">{color.name}</h4>
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
          </TabsContent>
          
          <TabsContent value="accessories" className="mt-0 flex-1">
            <div className="text-center mb-2">
              <h3 className="text-base font-bold text-foreground mb-1">Accessories</h3>
              <p className="text-xs text-muted-foreground">Swipe to explore optional features</p>
            </div>
            
            <div className="relative">
              <div ref={accessorySwipeRef} className="overflow-hidden rounded-xl">
                <motion.div
                  className="flex"
                  animate={{ x: -accessoryIndex * 100 + "%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {accessories.map((accessory, index) => {
                    const isSelected = config.accessories.includes(accessory.name);
                    
                    return (
                      <div key={accessory.name} className="w-full flex-shrink-0 px-1">
                        <div
                          className={`relative rounded-xl cursor-pointer transition-all duration-300 border-2 p-3 ${
                            isSelected 
                              ? 'bg-primary/10 border-primary shadow-lg' 
                              : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                          }`}
                          onClick={() => toggleAccessory(accessory.name)}
                        >
                          <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                              <h4 className="text-base font-semibold text-foreground">{accessory.name}</h4>
                              <span className="px-2 py-0.5 bg-muted/70 text-muted-foreground text-xs rounded-md">
                                {accessory.category}
                              </span>
                            </div>
                            
                            <p className="text-xs text-muted-foreground mb-2">{accessory.description}</p>
                            <p className="text-sm font-bold text-foreground mb-3">+AED {accessory.price}</p>
                            
                            <motion.div
                              className={`w-8 h-8 mx-auto rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                                isSelected 
                                  ? 'bg-primary border-primary text-primary-foreground' 
                                  : 'border-border bg-background hover:border-primary/50'
                              }`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {isSelected ? (
                                <Minus className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevAccessory}
                className="absolute left-1 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background border border-border rounded-full p-1.5 shadow-lg transition-all duration-200"
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              
              <button
                onClick={nextAccessory}
                className="absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background border border-border rounded-full p-1.5 shadow-lg transition-all duration-200"
              >
                <ChevronRight className="h-3 w-3" />
              </button>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-1 mt-2">
                {accessories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setAccessoryIndex(index)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      index === accessoryIndex ? 'bg-primary scale-125' : 'bg-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ColorsAccessoriesStep;
