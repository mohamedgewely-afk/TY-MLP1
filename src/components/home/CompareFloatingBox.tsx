
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";

interface CompareFloatingBoxProps {
  compareList: string[];
  vehicles: VehicleModel[];
  onRemove: (name: string) => void;
  onClearAll: () => void;
}

const CompareFloatingBox: React.FC<CompareFloatingBoxProps> = ({
  compareList,
  vehicles,
  onRemove,
  onClearAll,
}) => {
  if (compareList.length === 0) return null;

  const comparedVehicles = vehicles.filter((v) => compareList.includes(v.name));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-40 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 p-4 w-[90%] max-w-lg"
      >
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-900 dark:text-white">Compare Vehicles ({compareList.length})</h3>
          <button
            onClick={onClearAll}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-36 overflow-y-auto mb-3">
          {comparedVehicles.map((vehicle) => (
            <div
              key={vehicle.name}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[200px]">
                  {vehicle.name}
                </span>
              </div>
              <button
                onClick={() => onRemove(vehicle.name)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {compareList.length >= 2 && (
          <Button 
            variant="default" 
            className="w-full bg-toyota-red hover:bg-toyota-darkred" 
            asChild
          >
            <a href="#compare-section">Compare Now</a>
          </Button>
        )}
        
        {compareList.length === 1 && (
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Select at least one more vehicle to compare
          </p>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareFloatingBox;
