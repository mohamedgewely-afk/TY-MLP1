
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Calendar, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeableEnhanced } from "@/hooks/use-swipeable-enhanced";
import SwipeIndicators from "../SwipeIndicators";
import { contextualHaptic } from "@/utils/haptic";

interface ModelYearEngineStepProps {
  config: { modelYear: string; engine: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const modelYears = [
  { year: "2025", description: "Latest Model", badge: "New" },
  { year: "2024", description: "Current Year", badge: "Popular" },
  { year: "2023", description: "Previous Year", badge: "Value" }
];

const engines = [
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

const ModelYearEngineStep: React.FC<ModelYearEngineStepProps> = ({ config, setConfig }) => {
  const [activeSection, setActiveSection] = useState(0); // 0: model years, 1: engines
  const [yearIndex, setYearIndex] = useState(0);
  const [engineIndex, setEngineIndex] = useState(0);

  const handleHorizontalSwipe = (direction: 'left' | 'right') => {
    contextualHaptic.selectionChange();
    
    if (activeSection === 0) {
      // Model year navigation
      if (direction === 'left' && yearIndex < modelYears.length - 1) {
        setYearIndex(yearIndex + 1);
      } else if (direction === 'right' && yearIndex > 0) {
        setYearIndex(yearIndex - 1);
      } else if (direction === 'left' && yearIndex === modelYears.length - 1) {
        // Move to engines section
        setActiveSection(1);
        setEngineIndex(0);
      }
    } else {
      // Engine navigation
      if (direction === 'left' && engineIndex < engines.length - 1) {
        setEngineIndex(engineIndex + 1);
      } else if (direction === 'right' && engineIndex > 0) {
        setEngineIndex(engineIndex - 1);
      } else if (direction === 'right' && engineIndex === 0) {
        // Move back to model years
        setActiveSection(0);
        setYearIndex(modelYears.length - 1);
      }
    }
  };

  const swipeableRef = useSwipeableEnhanced({
    onSwipeLeft: () => handleHorizontalSwipe('left'),
    onSwipeRight: () => handleHorizontalSwipe('right'),
    enableHorizontalSwipe: true,
    enableVerticalSwipe: false,
    swipeContext: 'ModelYearEngineStep',
    debug: false,
    threshold: 40
  });

  const currentYear = modelYears[yearIndex];
  const currentEngine = engines[engineIndex];

  const handleYearSelect = (year: string) => {
    contextualHaptic.selectionChange();
    setConfig(prev => ({ ...prev, modelYear: year }));
  };

  const handleEngineSelect = (engine: string) => {
    contextualHaptic.selectionChange();
    setConfig(prev => ({ ...prev, engine: engine }));
  };

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
          <span>Swipe left/right to navigate</span>
          <ChevronRight className="h-3 w-3" />
        </div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeSection === 0 ? (
            <motion.div
              key="model-year"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Select Model Year</h3>
                </div>
                <p className="text-sm text-muted-foreground">Choose your preferred model year</p>
              </div>
              
              <motion.div
                className={`rounded-xl cursor-pointer transition-all duration-300 border-2 p-6 ${
                  config.modelYear === currentYear.year
                    ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                }`}
                onClick={() => handleYearSelect(currentYear.year)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                {config.modelYear === currentYear.year && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3"
                  >
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  </motion.div>
                )}
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-foreground">{currentYear.year}</h4>
                    <p className="text-sm text-muted-foreground">{currentYear.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-muted/70 text-muted-foreground text-xs rounded-full border">
                      {currentYear.badge}
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="engine"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-sm"
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Select Engine</h3>
                </div>
                <p className="text-sm text-muted-foreground">Choose your preferred engine type</p>
              </div>
              
              <motion.div
                className={`rounded-xl cursor-pointer transition-all duration-300 border-2 p-6 ${
                  config.engine === currentEngine.name
                    ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                }`}
                onClick={() => handleEngineSelect(currentEngine.name)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                layout
              >
                {config.engine === currentEngine.name && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3"
                  >
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  </motion.div>
                )}
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xl font-bold text-foreground">{currentEngine.name}</h4>
                    <p className="text-sm text-muted-foreground">{currentEngine.description}</p>
                  </div>
                  <span className="px-3 py-1 bg-muted/70 text-muted-foreground text-xs rounded-full border">
                    {currentEngine.badge}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="font-medium text-foreground">{currentEngine.power}</span>
                      <p className="text-xs text-muted-foreground">Power</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{currentEngine.efficiency}</span>
                      <p className="text-xs text-muted-foreground">Fuel Economy</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress indicators */}
      <div className="flex justify-center items-center gap-4 py-4">
        <SwipeIndicators
          total={2}
          current={activeSection}
          direction="horizontal"
          className="mr-4"
        />
        <SwipeIndicators
          total={activeSection === 0 ? modelYears.length : engines.length}
          current={activeSection === 0 ? yearIndex : engineIndex}
          direction="horizontal"
        />
      </div>
    </div>
  );
};

export default ModelYearEngineStep;
