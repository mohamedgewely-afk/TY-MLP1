
import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";

interface BuilderConfig {
  modelYear: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface ChoicesSummaryProps {
  config: BuilderConfig;
  totalPrice: number;
  vehicle: VehicleModel;
}

const ChoicesSummary: React.FC<ChoicesSummaryProps> = ({ 
  config, 
  totalPrice, 
  vehicle 
}) => {
  const getCurrentVehicleImage = () => {
    const colorImages = {
      "Pearl White": "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80",
      "Midnight Black": "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
      "Silver Metallic": "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
      "Ruby Red": "https://images.unsplash.com/photo-1494976688153-c785a34b9f61?auto=format&fit=crop&w=800&q=80",
      "Ocean Blue": "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
      "Storm Gray": "https://images.unsplash.com/photo-1570409073740-2f53eca0f9dd?auto=format&fit=crop&w=800&q=80"
    };
    return colorImages[config.exteriorColor as keyof typeof colorImages] || vehicle.image;
  };

  return (
    <motion.div 
      className="fixed top-4 right-4 w-80 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl z-50"
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Your Build</h3>
          <motion.div 
            className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="h-4 w-4 text-white" />
          </motion.div>
        </div>
        
        <motion.div 
          className="relative w-full h-32 rounded-2xl overflow-hidden"
          layoutId="vehicle-preview"
        >
          <img 
            src={getCurrentVehicleImage()} 
            alt="Vehicle Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-2 text-white text-sm font-semibold">
            {config.exteriorColor}
          </div>
        </motion.div>

        <div className="space-y-2 text-sm text-white/80">
          <div className="flex justify-between">
            <span>Year & Grade:</span>
            <span className="text-white font-medium">{config.modelYear} {config.grade}</span>
          </div>
          <div className="flex justify-between">
            <span>Interior:</span>
            <span className="text-white font-medium">{config.interiorColor}</span>
          </div>
          <div className="flex justify-between">
            <span>Accessories:</span>
            <span className="text-white font-medium">{config.accessories.length} selected</span>
          </div>
        </div>

        <div className="pt-2 border-t border-white/20">
          <div className="flex justify-between items-center">
            <span className="text-white/80">Total Price:</span>
            <span className="text-xl font-bold text-white">AED {totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChoicesSummary;
