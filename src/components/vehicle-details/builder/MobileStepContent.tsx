
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { ArrowRight, Play } from "lucide-react";

interface BuilderConfig {
  modelYear: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface MobileStepContentProps {
  step: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  vehicle: VehicleModel;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goNext: () => void;
}

const modelYears = ["2024", "2025"];
const grades = ["Base", "SE", "XLE", "Limited", "Platinum"];
const exteriorColors = [
  { name: "Pearl White", code: "#F8F8FF", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=800&q=80" },
  { name: "Midnight Black", code: "#000000", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80" },
  { name: "Silver Metallic", code: "#C0C0C0", image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80" },
  { name: "Ruby Red", code: "#DC143C", image: "https://images.unsplash.com/photo-1494976688153-c785a34b9f61?auto=format&fit=crop&w=800&q=80" },
  { name: "Ocean Blue", code: "#006994", image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80" },
  { name: "Storm Gray", code: "#708090", image: "https://images.unsplash.com/photo-1570409073740-2f53eca0f9dd?auto=format&fit=crop&w=800&q=80" }
];
const interiorColors = [
  { name: "Black Fabric", code: "#2C2C2C" },
  { name: "Beige Leather", code: "#F5F5DC" },
  { name: "Brown Leather", code: "#8B4513" },
  { name: "Red Leather", code: "#8B0000" }
];
const accessories = [
  { name: "Premium Sound System", price: 1200, icon: "🎵" },
  { name: "Sunroof", price: 800, icon: "☀️" },
  { name: "Navigation System", price: 600, icon: "🧭" },
  { name: "Heated Seats", price: 400, icon: "🔥" },
  { name: "Backup Camera", price: 300, icon: "📹" },
  { name: "Alloy Wheels", price: 900, icon: "⚙️" }
];

const MobileStepContent: React.FC<MobileStepContentProps> = ({
  step,
  config,
  setConfig,
  vehicle,
  calculateTotalPrice,
  handlePayment,
  goNext
}) => {
  const getCurrentVehicleImage = () => {
    const exteriorColorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return exteriorColorData?.image || exteriorColors[0].image;
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Choose Model Year
            </motion.h2>
            
            <div className="space-y-4">
              {modelYears.map((year, index) => (
                <motion.div
                  key={year}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    config.modelYear === year 
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-400' 
                      : 'bg-white/5 border border-white/20'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">{year}</h3>
                    <p className="text-cyan-400 text-sm">
                      {year === "2025" ? "Latest Technology" : "Proven Reliability"}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Select Grade
            </motion.h2>
            
            <div className="space-y-3">
              {grades.map((grade, index) => (
                <motion.div
                  key={grade}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                    config.grade === grade 
                      ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-400' 
                      : 'bg-white/5 border border-white/20'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, grade }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-lg font-bold text-white">{grade}</h3>
                  <p className="text-purple-400 text-sm">
                    {grade === "Base" && "Essential features"}
                    {grade === "SE" && "Sport edition"}
                    {grade === "XLE" && "Premium comfort"}
                    {grade === "Limited" && "Luxury features"}
                    {grade === "Platinum" && "Ultimate luxury"}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Exterior Color
            </motion.h2>
            
            <motion.div 
              className="relative w-full h-48 rounded-2xl overflow-hidden mb-6"
              layoutId="vehicle-preview"
              key={config.exteriorColor}
            >
              <motion.img 
                src={getCurrentVehicleImage()}
                alt="Vehicle Preview"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">{config.exteriorColor}</h3>
                <p className="text-white/80 text-sm">Premium Finish</p>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-3 gap-3">
              {exteriorColors.map((color, index) => (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer ${
                    config.exteriorColor === color.name ? 'ring-2 ring-cyan-400' : ''
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-1 left-1 right-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-white mx-auto mb-1" 
                      style={{ backgroundColor: color.code }} 
                    />
                    <p className="text-white text-xs text-center font-medium">{color.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Interior Color
            </motion.h2>
            
            <div className="space-y-4">
              {interiorColors.map((color, index) => (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-xl cursor-pointer flex items-center space-x-4 transition-all duration-300 ${
                    config.interiorColor === color.name 
                      ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-400' 
                      : 'bg-white/5 border border-white/20'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-white/50" 
                    style={{ backgroundColor: color.code }} 
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{color.name}</h3>
                    <p className="text-orange-400 text-sm">Premium Interior</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Accessories
            </motion.h2>
            
            <div className="space-y-3">
              {accessories.map((accessory, index) => {
                const isSelected = config.accessories.includes(accessory.name);
                return (
                  <motion.div
                    key={accessory.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-300 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-2 border-indigo-400' 
                        : 'bg-white/5 border border-white/20'
                    }`}
                    onClick={() => setConfig(prev => ({
                      ...prev,
                      accessories: isSelected
                        ? prev.accessories.filter(a => a !== accessory.name)
                        : [...prev.accessories, accessory.name]
                    }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{accessory.icon}</span>
                      <div>
                        <h3 className="text-white font-bold">{accessory.name}</h3>
                        <p className="text-indigo-400 text-sm">AED {accessory.price}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-white text-sm">✓</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="p-6 text-center">
            <motion.h2 
              className="text-2xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Review & Confirm
            </motion.h2>
            
            <motion.div 
              className="relative w-full h-48 rounded-2xl overflow-hidden mb-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img 
                src={getCurrentVehicleImage()}
                alt="Final Configuration"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-xl font-bold">{vehicle.name}</h3>
                <p className="text-white/80">{config.modelYear} {config.grade}</p>
              </div>
            </motion.div>

            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-white">
                <span>Exterior:</span>
                <span className="text-cyan-400">{config.exteriorColor}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Interior:</span>
                <span className="text-cyan-400">{config.interiorColor}</span>
              </div>
              <div className="flex justify-between text-white">
                <span>Accessories:</span>
                <span className="text-cyan-400">{config.accessories.length} selected</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-4 rounded-xl text-lg font-bold"
              >
                <Play className="mr-2 h-5 w-5" />
                Confirm Order - AED {calculateTotalPrice().toLocaleString()}
              </Button>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="h-full overflow-y-auto"
    >
      {renderContent()}
      
      {step < 6 && (
        <motion.div 
          className="p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={goNext}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 rounded-xl font-bold"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MobileStepContent;
