import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Palette, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeableEnhanced } from "@/hooks/use-swipeable-enhanced";
import SwipeIndicators from "../SwipeIndicators";
import { contextualHaptic } from "@/utils/haptic";

interface ColorsAccessoriesStepProps {
  config: { 
    exteriorColor: string; 
    interiorColor: string; 
    accessories: string[] 
  };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

interface ExteriorColor {
  name: string;
  image: string;
  price: number;
}

interface InteriorColor {
  name: string;
  price: number;
  description: string;
  image: string;
}

interface Accessory {
  name: string;
  price: number;
  description: string;
}

const exteriorColors: ExteriorColor[] = [
  { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", price: 0 },
  { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", price: 500 },
  { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", price: 300 },
  { name: "Deep Blue", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", price: 400 },
  { name: "Ruby Red", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", price: 600 }
];

const interiorColors: InteriorColor[] = [
  { name: "Black Leather", price: 0, description: "Premium black leather interior", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
  { name: "Beige Leather", price: 800, description: "Luxurious beige leather interior", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
  { name: "Gray Fabric", price: -500, description: "Comfortable gray fabric interior", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" }
];

const accessories: Accessory[] = [
  { name: "Premium Sound System", price: 1200, description: "JBL premium audio with 12 speakers" },
  { name: "Sunroof", price: 800, description: "Panoramic glass roof with electric controls" },
  { name: "Navigation System", price: 600, description: "Advanced GPS with real-time traffic" },
  { name: "Heated Seats", price: 400, description: "Front and rear seat heating" },
  { name: "Backup Camera", price: 300, description: "360-degree surround view camera" },
  { name: "Alloy Wheels", price: 900, description: "18-inch premium alloy wheels" }
];

const ColorsAccessoriesStep: React.FC<ColorsAccessoriesStepProps> = ({ config, setConfig }) => {
  // Section management: 0=exterior, 1=interior, 2=accessories
  const [activeSection, setActiveSection] = useState(0);
  const [exteriorIndex, setExteriorIndex] = useState(0);
  const [interiorIndex, setInteriorIndex] = useState(0);
  const [accessoryIndex, setAccessoryIndex] = useState(0);

  const handleHorizontalSwipe = (direction: 'left' | 'right') => {
    contextualHaptic.selectionChange();
    
    if (direction === 'left') {
      // Navigate forward through sections or items within sections
      switch (activeSection) {
        case 0: // Exterior Colors
          if (exteriorIndex < exteriorColors.length - 1) {
            setExteriorIndex(exteriorIndex + 1);
          } else {
            setActiveSection(1);
            setInteriorIndex(0);
          }
          break;
        case 1: // Interior Colors
          if (interiorIndex < interiorColors.length - 1) {
            setInteriorIndex(interiorIndex + 1);
          } else {
            setActiveSection(2);
            setAccessoryIndex(0);
          }
          break;
        case 2: // Accessories
          if (accessoryIndex < accessories.length - 1) {
            setAccessoryIndex(accessoryIndex + 1);
          }
          break;
      }
    } else {
      // Navigate backward through sections or items within sections
      switch (activeSection) {
        case 0: // Exterior Colors
          if (exteriorIndex > 0) {
            setExteriorIndex(exteriorIndex - 1);
          }
          break;
        case 1: // Interior Colors
          if (interiorIndex > 0) {
            setInteriorIndex(interiorIndex - 1);
          } else {
            setActiveSection(0);
            setExteriorIndex(exteriorColors.length - 1);
          }
          break;
        case 2: // Accessories
          if (accessoryIndex > 0) {
            setAccessoryIndex(accessoryIndex - 1);
          } else {
            setActiveSection(1);
            setInteriorIndex(interiorColors.length - 1);
          }
          break;
      }
    }
  };

  const swipeableRef = useSwipeableEnhanced({
    onSwipeLeft: () => handleHorizontalSwipe('left'),
    onSwipeRight: () => handleHorizontalSwipe('right'),
    enableHorizontalSwipe: true,
    enableVerticalSwipe: false,
    swipeContext: 'ColorsAccessoriesStep',
    debug: false,
    threshold: 40
  });

  const getCurrentItem = (): ExteriorColor | InteriorColor | Accessory | null => {
    switch (activeSection) {
      case 0: return exteriorColors[exteriorIndex];
      case 1: return interiorColors[interiorIndex];
      case 2: return accessories[accessoryIndex];
      default: return null;
    }
  };

  const handleSelection = () => {
    contextualHaptic.selectionChange();
    const currentItem = getCurrentItem();
    if (!currentItem) return;
    
    switch (activeSection) {
      case 0:
        setConfig(prev => ({ ...prev, exteriorColor: currentItem.name }));
        break;
      case 1:
        setConfig(prev => ({ ...prev, interiorColor: currentItem.name }));
        break;
      case 2:
        const isSelected = config.accessories.includes(currentItem.name);
        setConfig(prev => ({
          ...prev,
          accessories: isSelected
            ? prev.accessories.filter(acc => acc !== currentItem.name)
            : [...prev.accessories, currentItem.name]
        }));
        break;
    }
  };

  const getSectionInfo = () => {
    const sections = [
      { title: "Exterior Color", icon: <Palette className="h-5 w-5 text-primary" />, description: "Select exterior finish" },
      { title: "Interior Color", icon: <Palette className="h-5 w-5 text-primary" />, description: "Choose interior finish" },
      { title: "Accessories", icon: <Package className="h-5 w-5 text-primary" />, description: "Add premium features" }
    ];
    return sections[activeSection];
  };

  const isSelected = () => {
    const currentItem = getCurrentItem();
    if (!currentItem) return false;

    switch (activeSection) {
      case 0: return config.exteriorColor === currentItem.name;
      case 1: return config.interiorColor === currentItem.name;
      case 2: return config.accessories.includes(currentItem.name);
      default: return false;
    }
  };

  const sectionInfo = getSectionInfo();
  const currentItem = getCurrentItem();

  return (
    <div ref={swipeableRef} className="h-full flex flex-col relative">
      {/* Swipe hint */}
      <motion.div 
        className="text-center py-2 bg-muted/20 rounded-lg mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ChevronLeft className="h-3 w-3" />
          <span>Swipe left/right to select colors & accessories</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </motion.div>

      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          {sectionInfo.icon}
          <h2 className="text-xl font-bold text-foreground">
            {sectionInfo.title}
          </h2>
        </div>
        <p className="text-muted-foreground text-sm">
          {sectionInfo.description}
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <AnimatePresence mode="wait">
          {currentItem && (
            <motion.div
              key={`${activeSection}-${currentItem.name}`}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 120 }}
              className="w-full max-w-md"
            >
              <div
                className={`relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 border-2 shadow-lg p-6 ${
                  isSelected()
                    ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                }`}
                onClick={handleSelection}
              >
                {/* Selection indicator */}
                {isSelected() && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 z-20"
                  >
                    <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                      <Check className="h-4 w-4" />
                    </div>
                  </motion.div>
                )}

                {/* Exterior Color Content */}
                {activeSection === 0 && (
                  <div className="text-center">
                    <div className="mb-4">
                      <img 
                        src={(currentItem as ExteriorColor).image} 
                        alt={(currentItem as ExteriorColor).name} 
                        className="w-32 h-20 object-cover rounded-lg mx-auto border-2 border-border/50" 
                      />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{(currentItem as ExteriorColor).name}</h3>
                    {(currentItem as ExteriorColor).price > 0 && (
                      <p className="text-primary font-medium">+AED {(currentItem as ExteriorColor).price}</p>
                    )}
                  </div>
                )}

                {/* Interior Color Content */}
                {activeSection === 1 && (
                  <div className="text-center">
                    <div className="mb-4">
                      <img 
                        src={(currentItem as InteriorColor).image} 
                        alt={(currentItem as InteriorColor).name} 
                        className="w-32 h-20 object-cover rounded-lg mx-auto border-2 border-border/50" 
                      />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{(currentItem as InteriorColor).name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{(currentItem as InteriorColor).description}</p>
                    {(currentItem as InteriorColor).price !== 0 && (
                      <p className={`font-bold ${(currentItem as InteriorColor).price > 0 ? 'text-primary' : 'text-green-600'}`}>
                        {(currentItem as InteriorColor).price > 0 ? '+' : ''}AED {(currentItem as InteriorColor).price.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {/* Accessories Content */}
                {activeSection === 2 && (
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{(currentItem as Accessory).name}</h3>
                        <p className="text-muted-foreground text-sm">{(currentItem as Accessory).description}</p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-primary font-bold">+AED {(currentItem as Accessory).price.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center items-center gap-4 py-4">
        <SwipeIndicators
          total={3}
          current={activeSection}
          direction="horizontal"
          className="mr-4"
        />
        <SwipeIndicators
          total={
            activeSection === 0 ? exteriorColors.length :
            activeSection === 1 ? interiorColors.length :
            accessories.length
          }
          current={
            activeSection === 0 ? exteriorIndex :
            activeSection === 1 ? interiorIndex :
            accessoryIndex
          }
          direction="horizontal"
        />
      </div>
    </div>
  );
};

export default ColorsAccessoriesStep;
