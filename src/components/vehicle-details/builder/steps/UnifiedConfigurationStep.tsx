import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calendar, Zap, Star, Palette, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeableEnhanced } from "@/hooks/use-swipeable-enhanced";
import SwipeIndicators from "../SwipeIndicators";
import { contextualHaptic } from "@/utils/haptic";

interface UnifiedConfigurationStepProps {
  config: { 
    modelYear: string; 
    engine: string; 
    grade: string;
    exteriorColor: string; 
    interiorColor: string; 
    accessories: string[] 
  };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

// Define proper types for each data structure
interface ModelYear {
  year: string;
  description: string;
  badge: string;
}

interface Engine {
  name: string;
  description: string;
  power: string;
  efficiency: string;
  badge: string;
}

interface Grade {
  name: string;
  description: string;
  image: string;
  price: string;
  monthlyEMI: string;
  features: string[];
  badge: string;
  badgeColor: string;
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
}

interface Accessory {
  name: string;
  price: number;
  description: string;
}

// Data arrays with proper typing
const modelYears: ModelYear[] = [
  { year: "2025", description: "Latest Model", badge: "New" },
  { year: "2024", description: "Current Year", badge: "Popular" },
  { year: "2023", description: "Previous Year", badge: "Value" }
];

const engines: Engine[] = [
  { 
    name: "3.5L V6", 
    description: "Powerful & Efficient",
    power: "295 HP",
    efficiency: "8.1L/100km",
    badge: "Recommended"
  },
  { 
    name: "4.0L V6", 
    description: "Maximum Performance",
    power: "375 HP", 
    efficiency: "9.2L/100km",
    badge: "Performance"
  },
  { 
    name: "2.5L Hybrid", 
    description: "Eco-Friendly",
    power: "218 HP",
    efficiency: "4.5L/100km",
    badge: "Eco"
  }
];

const grades: Grade[] = [
  { 
    name: "Base", 
    description: "Essential features for everyday driving",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    price: "From AED 89,000",
    monthlyEMI: "1,850",
    features: ["Manual A/C", "6 Speakers", "Basic Interior"],
    badge: "Value",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200"
  },
  { 
    name: "SE", 
    description: "Sport edition with enhanced performance",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true",
    price: "From AED 95,000",
    monthlyEMI: "1,980",
    features: ["Sport Seats", "8-inch Display", "Rear Camera"],
    badge: "Sport",
    badgeColor: "bg-red-50 text-red-700 border-red-200"
  },
  { 
    name: "XLE", 
    description: "Premium comfort and convenience",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true",
    price: "From AED 110,000",
    monthlyEMI: "2,290",
    features: ["Leather Trim", "Premium Audio", "Auto Climate"],
    badge: "Most Popular",
    badgeColor: "bg-orange-50 text-orange-700 border-orange-200"
  },
  { 
    name: "Limited", 
    description: "Luxury features and premium materials",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    price: "From AED 125,000",
    monthlyEMI: "2,600",
    features: ["Premium Leather", "9-inch Touch", "Heated Seats"],
    badge: "Luxury",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200"
  }
];

const exteriorColors: ExteriorColor[] = [
  { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", price: 0 },
  { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", price: 500 },
  { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", price: 300 },
  { name: "Deep Blue", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", price: 400 },
  { name: "Ruby Red", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", price: 600 }
];

const interiorColors: InteriorColor[] = [
  { name: "Black Leather", price: 0, description: "Premium black leather interior" },
  { name: "Beige Leather", price: 800, description: "Luxurious beige leather interior" },
  { name: "Gray Fabric", price: -500, description: "Comfortable gray fabric interior" }
];

const accessories: Accessory[] = [
  { name: "Premium Sound System", price: 1200, description: "JBL premium audio with 12 speakers" },
  { name: "Sunroof", price: 800, description: "Panoramic glass roof with electric controls" },
  { name: "Navigation System", price: 600, description: "Advanced GPS with real-time traffic" },
  { name: "Heated Seats", price: 400, description: "Front and rear seat heating" },
  { name: "Backup Camera", price: 300, description: "360-degree surround view camera" },
  { name: "Alloy Wheels", price: 900, description: "18-inch premium alloy wheels" }
];

const UnifiedConfigurationStep: React.FC<UnifiedConfigurationStepProps> = ({ config, setConfig }) => {
  // Section management: 0=years, 1=engines, 2=grades, 3=exterior, 4=interior, 5=accessories
  const [activeSection, setActiveSection] = useState(0);
  const [yearIndex, setYearIndex] = useState(0);
  const [engineIndex, setEngineIndex] = useState(0);
  const [gradeIndex, setGradeIndex] = useState(0);
  const [exteriorIndex, setExteriorIndex] = useState(0);
  const [interiorIndex, setInteriorIndex] = useState(0);
  const [accessoryIndex, setAccessoryIndex] = useState(0);

  const handleHorizontalSwipe = (direction: 'left' | 'right') => {
    contextualHaptic.selectionChange();
    
    if (direction === 'left') {
      // Navigate forward through sections or items within sections
      switch (activeSection) {
        case 0: // Model Years
          if (yearIndex < modelYears.length - 1) {
            setYearIndex(yearIndex + 1);
          } else {
            setActiveSection(1);
            setEngineIndex(0);
          }
          break;
        case 1: // Engines
          if (engineIndex < engines.length - 1) {
            setEngineIndex(engineIndex + 1);
          } else {
            setActiveSection(2);
            setGradeIndex(0);
          }
          break;
        case 2: // Grades
          if (gradeIndex < grades.length - 1) {
            setGradeIndex(gradeIndex + 1);
          } else {
            setActiveSection(3);
            setExteriorIndex(0);
          }
          break;
        case 3: // Exterior Colors
          if (exteriorIndex < exteriorColors.length - 1) {
            setExteriorIndex(exteriorIndex + 1);
          } else {
            setActiveSection(4);
            setInteriorIndex(0);
          }
          break;
        case 4: // Interior Colors
          if (interiorIndex < interiorColors.length - 1) {
            setInteriorIndex(interiorIndex + 1);
          } else {
            setActiveSection(5);
            setAccessoryIndex(0);
          }
          break;
        case 5: // Accessories
          if (accessoryIndex < accessories.length - 1) {
            setAccessoryIndex(accessoryIndex + 1);
          }
          break;
      }
    } else {
      // Navigate backward through sections or items within sections
      switch (activeSection) {
        case 0: // Model Years
          if (yearIndex > 0) {
            setYearIndex(yearIndex - 1);
          }
          break;
        case 1: // Engines
          if (engineIndex > 0) {
            setEngineIndex(engineIndex - 1);
          } else {
            setActiveSection(0);
            setYearIndex(modelYears.length - 1);
          }
          break;
        case 2: // Grades
          if (gradeIndex > 0) {
            setGradeIndex(gradeIndex - 1);
          } else {
            setActiveSection(1);
            setEngineIndex(engines.length - 1);
          }
          break;
        case 3: // Exterior Colors
          if (exteriorIndex > 0) {
            setExteriorIndex(exteriorIndex - 1);
          } else {
            setActiveSection(2);
            setGradeIndex(grades.length - 1);
          }
          break;
        case 4: // Interior Colors
          if (interiorIndex > 0) {
            setInteriorIndex(interiorIndex - 1);
          } else {
            setActiveSection(3);
            setExteriorIndex(exteriorColors.length - 1);
          }
          break;
        case 5: // Accessories
          if (accessoryIndex > 0) {
            setAccessoryIndex(accessoryIndex - 1);
          } else {
            setActiveSection(4);
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
    swipeContext: 'UnifiedConfigurationStep',
    debug: false,
    threshold: 40
  });

  const getCurrentItem = (): ModelYear | Engine | Grade | ExteriorColor | InteriorColor | Accessory | null => {
    switch (activeSection) {
      case 0: return modelYears[yearIndex];
      case 1: return engines[engineIndex];
      case 2: return grades[gradeIndex];
      case 3: return exteriorColors[exteriorIndex];
      case 4: return interiorColors[interiorIndex];
      case 5: return accessories[accessoryIndex];
      default: return null;
    }
  };

  const handleSelection = () => {
    contextualHaptic.selectionChange();
    const currentItem = getCurrentItem();
    if (!currentItem) return;
    
    switch (activeSection) {
      case 0:
        setConfig(prev => ({ ...prev, modelYear: (currentItem as ModelYear).year }));
        break;
      case 1:
        setConfig(prev => ({ ...prev, engine: (currentItem as Engine).name }));
        break;
      case 2:
        setConfig(prev => ({ ...prev, grade: (currentItem as Grade).name }));
        break;
      case 3:
        setConfig(prev => ({ ...prev, exteriorColor: (currentItem as ExteriorColor).name }));
        break;
      case 4:
        setConfig(prev => ({ ...prev, interiorColor: (currentItem as InteriorColor).name }));
        break;
      case 5:
        const accessory = currentItem as Accessory;
        const isSelected = config.accessories.includes(accessory.name);
        setConfig(prev => ({
          ...prev,
          accessories: isSelected
            ? prev.accessories.filter(acc => acc !== accessory.name)
            : [...prev.accessories, accessory.name]
        }));
        break;
    }
  };

  const getSectionInfo = () => {
    const sections = [
      { title: "Model Year", icon: <Calendar className="h-5 w-5 text-primary" />, description: "Choose your preferred model year" },
      { title: "Engine Type", icon: <Zap className="h-5 w-5 text-primary" />, description: "Select your engine preference" },
      { title: "Grade Level", icon: <Star className="h-5 w-5 text-primary" />, description: "Pick your feature level" },
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
      case 0: return config.modelYear === (currentItem as ModelYear).year;
      case 1: return config.engine === (currentItem as Engine).name;
      case 2: return config.grade === (currentItem as Grade).name;
      case 3: return config.exteriorColor === (currentItem as ExteriorColor).name;
      case 4: return config.interiorColor === (currentItem as InteriorColor).name;
      case 5: return config.accessories.includes((currentItem as Accessory).name);
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
          <span>Swipe left/right to configure your vehicle</span>
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
              key={`${activeSection}-${(currentItem as any).name || (currentItem as ModelYear).year}`}
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

                {/* Content based on section */}
                {activeSection === 0 && (
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-2xl font-bold text-foreground">{(currentItem as ModelYear).year}</h4>
                        <p className="text-sm text-muted-foreground">{(currentItem as ModelYear).description}</p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-muted/70 text-muted-foreground text-xs rounded-full border">
                          {(currentItem as ModelYear).badge}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 1 && (
                  <div className="text-center">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xl font-bold text-foreground">{(currentItem as Engine).name}</h4>
                        <p className="text-sm text-muted-foreground">{(currentItem as Engine).description}</p>
                      </div>
                      <span className="px-3 py-1 bg-muted/70 text-muted-foreground text-xs rounded-full border">
                        {(currentItem as Engine).badge}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="font-medium text-foreground">{(currentItem as Engine).power}</span>
                          <p className="text-xs text-muted-foreground">Power</p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{(currentItem as Engine).efficiency}</span>
                          <p className="text-xs text-muted-foreground">Fuel Economy</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 2 && (
                  <div className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="w-24 h-16 rounded-xl overflow-hidden border-2 border-border/50 bg-muted/50 shadow-md">
                        <img
                          src={(currentItem as Grade).image}
                          alt={(currentItem as Grade).name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <h3 className="text-2xl font-bold text-foreground">{(currentItem as Grade).name}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border ${(currentItem as Grade).badgeColor}`}>
                        {(currentItem as Grade).badge}
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{(currentItem as Grade).description}</p>
                    <div className="text-center">
                      <div className="text-xl font-bold text-foreground">{(currentItem as Grade).price}</div>
                      <div className="text-sm text-muted-foreground">AED {(currentItem as Grade).monthlyEMI}/month</div>
                    </div>
                  </div>
                )}

                {activeSection === 3 && (
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

                {activeSection === 4 && (
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">{(currentItem as InteriorColor).name}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{(currentItem as InteriorColor).description}</p>
                    {(currentItem as InteriorColor).price !== 0 && (
                      <p className={`font-bold ${(currentItem as InteriorColor).price > 0 ? 'text-primary' : 'text-green-600'}`}>
                        {(currentItem as InteriorColor).price > 0 ? '+' : ''}AED {(currentItem as InteriorColor).price.toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {activeSection === 5 && (
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
          total={6}
          current={activeSection}
          direction="horizontal"
          className="mr-4"
        />
        <SwipeIndicators
          total={
            activeSection === 0 ? modelYears.length :
            activeSection === 1 ? engines.length :
            activeSection === 2 ? grades.length :
            activeSection === 3 ? exteriorColors.length :
            activeSection === 4 ? interiorColors.length :
            accessories.length
          }
          current={
            activeSection === 0 ? yearIndex :
            activeSection === 1 ? engineIndex :
            activeSection === 2 ? gradeIndex :
            activeSection === 3 ? exteriorIndex :
            activeSection === 4 ? interiorIndex :
            accessoryIndex
          }
          direction="horizontal"
        />
      </div>
    </div>
  );
};

export default UnifiedConfigurationStep;
