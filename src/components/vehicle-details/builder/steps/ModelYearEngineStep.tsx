
import React from "react";
import { motion } from "framer-motion";
import { Check, Calendar, Zap } from "lucide-react";

interface ModelYearEngineStepProps {
  config: { modelYear: string; engine: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

// Only 2 model years as requested
const modelYears = [
  { year: "2025", description: "Latest Model", badge: "New" },
  { year: "2024", description: "Current Year", badge: "Popular" }
];

// Only 2 engine options as requested
const engines = [
  { 
    name: "3.5L V6", 
    description: "Powerful & Efficient",
    power: "295 HP",
    efficiency: "8.1L/100km",
    badge: "Recommended"
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
  return (
    <div className="p-4 space-y-6">
      {/* Model Year Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Select Model Year</h3>
          </div>
          <p className="text-sm text-muted-foreground">Choose your preferred model year</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {modelYears.map((year, index) => {
            const isSelected = config.modelYear === year.year;
            
            return (
              <motion.div
                key={year.year}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className={`relative rounded-xl cursor-pointer transition-all duration-300 border-2 p-4 ${
                  isSelected 
                    ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, modelYear: year.year }))}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selection indicator */}
                {isSelected && (
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
                
                <div className="text-center">
                  <h4 className="text-xl font-bold text-foreground">{year.year}</h4>
                  <p className="text-sm text-muted-foreground">{year.description}</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-muted/70 text-muted-foreground text-xs rounded-md border">
                    {year.badge}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Engine Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Select Engine</h3>
          </div>
          <p className="text-sm text-muted-foreground">Choose your preferred engine type</p>
        </div>
        
        <div className="space-y-3">
          {engines.map((engine, index) => {
            const isSelected = config.engine === engine.name;
            
            return (
              <motion.div
                key={engine.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (index + 2) * 0.1, duration: 0.4 }}
                className={`relative rounded-xl cursor-pointer transition-all duration-300 border-2 p-4 ${
                  isSelected 
                    ? 'bg-primary/10 border-primary shadow-lg scale-[1.02]' 
                    : 'bg-card border-border hover:border-primary/30 hover:shadow-md'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Selection indicator */}
                {isSelected && (
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
                    <h4 className="text-lg font-bold text-foreground">{engine.name}</h4>
                    <p className="text-sm text-muted-foreground">{engine.description}</p>
                  </div>
                  <span className="px-2 py-1 bg-muted/70 text-muted-foreground text-xs rounded-md border">
                    {engine.badge}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="font-medium text-foreground">{engine.power}</span>
                      <p className="text-xs text-muted-foreground">Power</p>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">{engine.efficiency}</span>
                      <p className="text-xs text-muted-foreground">Fuel Economy</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default ModelYearEngineStep;
