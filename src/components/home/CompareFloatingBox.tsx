
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, GitCompare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Persona } from "@/types/persona";

interface CompareFloatingBoxProps {
  compareList: string[];
  vehicles: VehicleModel[];
  onRemove: (name: string) => void;
  onClearAll: () => void;
  personaData?: Persona | null;
}

const CompareFloatingBox: React.FC<CompareFloatingBoxProps> = ({
  compareList,
  vehicles,
  onRemove,
  onClearAll,
  personaData,
}) => {
  const isMobile = useIsMobile();

  // On mobile, transform the floating box into a more compact format
  if (compareList.length === 0) return null;

  // Get persona-specific styles
  const getPersonaStyles = () => {
    if (!personaData) return {};
    
    return {
      bgColor: personaData.id === "tech-enthusiast" 
        ? "rgba(107, 56, 251, 0.05)" 
        : personaData.id === "eco-warrior" 
          ? "rgba(46, 125, 50, 0.05)" 
          : "white",
      borderStyle: personaData.id === "tech-enthusiast"
        ? "border-l-4 border-purple-500"
        : personaData.id === "eco-warrior"
          ? "border-2 border-green-300"
          : personaData.id === "family-first"
            ? "border-2 border-blue-300"
            : "border border-gray-200",
      borderRadius: personaData.id === "tech-enthusiast"
        ? "rounded-md"
        : personaData.id === "eco-warrior" || personaData.id === "family-first"
          ? "rounded-xl"
          : "rounded-lg",
      accentColor: personaData.colorScheme.accent,
      primaryColor: personaData.colorScheme.primary,
    };
  };

  const styles = getPersonaStyles();

  const comparedVehicles = vehicles.filter((v) => compareList.includes(v.name));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", bounce: 0.3 }}
        className={`fixed ${isMobile ? 'bottom-20 min-h-32' : 'bottom-8'} z-[40] left-1/2 transform -translate-x-1/2 shadow-lg w-[94%] max-w-lg overflow-hidden`}
        style={{ 
          backgroundColor: styles.bgColor || "white",
          borderRadius: styles.borderRadius || "rounded-lg",
          border: styles.borderStyle || "border border-gray-200",
          boxShadow: personaData ? `0 10px 25px -5px ${personaData.colorScheme.primary}30` : undefined,
        }}
      >
        {/* Animated background patterns based on persona */}
        {personaData && personaData.id === "tech-enthusiast" && (
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="grid grid-cols-8 h-full w-full">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="border-r border-purple-500"
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                />
              ))}
            </div>
          </div>
        )}
        
        {personaData && personaData.id === "weekend-adventurer" && (
          <div className="absolute inset-0 bg-orange-500/5 bg-[url('/textures/terrain-pattern.png')] opacity-20" />
        )}

        <div className="relative p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <motion.h3
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="font-bold text-lg flex items-center gap-2"
                style={{ color: styles.primaryColor || "text-gray-800" }}
              >
                <GitCompare className="h-5 w-5" />
                <span>Compare ({compareList.length})</span>
              </motion.h3>
              <button
                onClick={onClearAll}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Clear all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} gap-3`}>
              {comparedVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 relative border border-gray-100 dark:border-gray-700"
                >
                  <button
                    onClick={() => onRemove(vehicle.name)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Remove from compare"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  
                  <div className="flex flex-col items-center text-center space-y-2">
                    <motion.div 
                      className="w-full h-32 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <h4 className="font-semibold mt-2 text-gray-700 dark:text-gray-200">{vehicle.name}</h4>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 text-sm gap-1 group"
                      style={personaData ? {
                        borderColor: `${personaData.colorScheme.primary}40`,
                        color: personaData.colorScheme.primary
                      } : {}}
                      asChild
                    >
                      <a href={vehicle.configureUrl}>
                        <span>Configure</span>
                        <ChevronRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Compare button for mobile */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  className="w-full" 
                  style={personaData ? { 
                    backgroundColor: personaData.colorScheme.accent,
                    boxShadow: `0 4px 12px -2px ${personaData.colorScheme.accent}40`
                  } : {}}
                >
                  Compare {compareList.length > 1 ? 'Vehicles' : 'With Another'}
                </Button>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Decorative bottom accent based on persona */}
        {personaData && (
          <motion.div 
            className="h-1.5 w-full" 
            style={{ backgroundColor: styles.accentColor }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareFloatingBox;
