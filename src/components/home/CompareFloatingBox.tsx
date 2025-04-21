
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const [showOnlyDifferences, setShowOnlyDifferences] = React.useState(false);
  const isMobile = useIsMobile();

  // On mobile, don't render the floating box; all controls are in the compare screen now
  if (isMobile || compareList.length === 0) return null;

  const comparedVehicles = vehicles.filter((v) => compareList.includes(v.name));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-20 md:bottom-8 left-1/2 transform -translate-x-1/2 z-[40] bg-gray-900 rounded-xl shadow-2xl border border-gray-800 p-4 w-[94%] max-w-lg text-white"
      >
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg">
              Compare ({compareList.length})
            </h3>
            <button
              onClick={onClearAll}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {comparedVehicles.map((vehicle) => (
              <div
                key={vehicle.name}
                className="bg-gray-800 rounded-lg p-3 relative"
              >
                <button
                  onClick={() => onRemove(vehicle.name)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
                
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-full h-32 rounded-md overflow-hidden bg-gray-700">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="font-semibold mt-2">{vehicle.name}</h4>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 text-sm"
                    asChild
                  >
                    <a href={vehicle.configureUrl}>Configure</a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareFloatingBox;
