
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { ArrowRight, Zap } from "lucide-react";

interface BuilderConfig {
  modelYear: string;
  engine: string;
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
const engines = [
  { name: "3.5L", power: "268 HP", torque: "336 Nm", price: 0 },
  { name: "4.0L", power: "301 HP", torque: "365 Nm", price: 5000 }
];
const grades = ["Base", "SE", "XLE", "Limited", "Platinum"];
const exteriorColors = [
  { 
    name: "Pearl White", 
    code: "#F8F8FF", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" 
  },
  { 
    name: "Midnight Black", 
    code: "#000000", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" 
  },
  { 
    name: "Silver Metallic", 
    code: "#C0C0C0", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" 
  }
];
const interiorColors = [
  { 
    name: "Black Leather", 
    code: "#2C2C2C",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/4046322b-9927-490d-b88a-3c18e7b590f3/renditions/c1fbcc4b-eac8-4440-af33-866cf99a0c93?binary=true&mformat=true"
  }
];
const accessories = [
  { name: "Premium Sound System", price: 1200 },
  { name: "Sunroof", price: 800 },
  { name: "Navigation System", price: 600 },
  { name: "Heated Seats", price: 400 },
  { name: "Backup Camera", price: 300 },
  { name: "Alloy Wheels", price: 900 }
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
  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-bold text-center mb-8 text-foreground"
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
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                    config.modelYear === year 
                      ? 'bg-primary/10 border-primary shadow-lg' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2">{year}</h3>
                    <p className="text-primary text-sm font-medium">
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
              className="text-2xl font-bold text-center mb-8 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Choose Your Engine
            </motion.h2>
            
            <div className="space-y-4">
              {engines.map((engine, index) => (
                <motion.div
                  key={engine.name}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                    config.engine === engine.name 
                      ? 'bg-primary/10 border-primary shadow-lg' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">{engine.name}</h3>
                      <p className="text-primary text-sm font-medium mb-1">{engine.power} • {engine.torque}</p>
                      <p className="text-muted-foreground text-xs">Premium Performance</p>
                    </div>
                    {engine.price > 0 && (
                      <div className="text-right">
                        <p className="text-primary font-bold">+AED {engine.price.toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="p-6 pb-24">
            <motion.h2 
              className="text-2xl font-bold text-center mb-8 text-foreground"
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
                  className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                    config.grade === grade 
                      ? 'bg-primary/10 border-primary shadow-lg' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, grade }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-lg font-bold text-foreground">{grade}</h3>
                  <p className="text-primary text-sm">
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

      case 4:
        return (
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-bold text-center mb-6 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Exterior Color
            </motion.h2>
            
            <div className="grid grid-cols-1 gap-4">
              {exteriorColors.map((color, index) => (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 ${
                    config.exteriorColor === color.name ? 'border-primary shadow-lg' : 'border-border'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-lg" 
                        style={{ backgroundColor: color.code }} 
                      />
                      <p className="text-white font-bold text-lg">{color.name}</p>
                    </div>
                    {config.exteriorColor === color.name && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                      >
                        <span className="text-primary-foreground text-sm">✓</span>
                      </motion.div>
                    )}
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
              className="text-2xl font-bold text-center mb-8 text-foreground"
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
                  className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 ${
                    config.interiorColor === color.name 
                      ? 'bg-primary/10 border-primary shadow-lg' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src={color.image} alt={color.name} className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-xl" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white shadow-lg" 
                        style={{ backgroundColor: color.code }} 
                      />
                      <p className="text-white font-bold text-lg">{color.name}</p>
                    </div>
                    {config.interiorColor === color.name && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                      >
                        <span className="text-primary-foreground text-sm">✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-bold text-center mb-8 text-foreground"
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
                    className={`p-4 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-300 border-2 ${
                      isSelected 
                        ? 'bg-primary/10 border-primary shadow-lg' 
                        : 'bg-card border-border hover:border-primary/50'
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
                    <div>
                      <h3 className="text-foreground font-bold">{accessory.name}</h3>
                      <p className="text-primary text-sm">AED {accessory.price}</p>
                    </div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                      >
                        <span className="text-primary-foreground text-sm">✓</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="p-6 text-center">
            <motion.h2 
              className="text-2xl font-bold mb-8 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Review & Confirm
            </motion.h2>

            <div className="space-y-3 mb-8 text-left bg-card p-4 rounded-xl border border-border">
              <div className="flex justify-between text-foreground">
                <span>Model Year:</span>
                <span className="text-primary font-medium">{config.modelYear}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Engine:</span>
                <span className="text-primary font-medium">{config.engine}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Grade:</span>
                <span className="text-primary font-medium">{config.grade}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Exterior:</span>
                <span className="text-primary font-medium">{config.exteriorColor}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Interior:</span>
                <span className="text-primary font-medium">{config.interiorColor}</span>
              </div>
              <div className="flex justify-between text-foreground">
                <span>Accessories:</span>
                <span className="text-primary font-medium">{config.accessories.length} selected</span>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button 
                onClick={handlePayment}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl text-lg font-bold border border-primary"
              >
                <Zap className="mr-2 h-5 w-5" />
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
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="min-h-full"
      >
        {renderContent()}
      </motion.div>
      
      {/* Fixed Continue Button */}
      {step < 7 && (
        <motion.div 
          className="fixed bottom-0 left-0 right-0 p-6 bg-card/95 backdrop-blur-xl border-t border-border z-50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={goNext}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg"
          >
            Continue
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default MobileStepContent;
