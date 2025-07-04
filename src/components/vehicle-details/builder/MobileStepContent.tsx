
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { ArrowRight, Zap } from "lucide-react";

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
  { name: "Pearl White", code: "#F8F8FF", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true" },
  { name: "Midnight Black", code: "#000000", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true" },
  { name: "Silver Metallic", code: "#C0C0C0", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true" },
  { name: "Ruby Red", code: "#DC143C", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true" },
  { name: "Ocean Blue", code: "#006994", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true" },
  { name: "Storm Gray", code: "#708090", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true" }
];
const interiorColors = [
  { name: "Black Fabric", code: "#2C2C2C" },
  { name: "Beige Leather", code: "#F5F5DC" },
  { name: "Brown Leather", code: "#8B4513" },
  { name: "Red Leather", code: "#8B0000" }
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

      case 3:
        return (
          <div className="p-6">
            <motion.h2 
              className="text-2xl font-bold text-center mb-6 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Exterior Color
            </motion.h2>
            
            <div className="grid grid-cols-3 gap-3">
              {exteriorColors.map((color, index) => (
                <motion.div
                  key={color.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 ${
                    config.exteriorColor === color.name ? 'border-primary shadow-lg' : 'border-border'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                  <div className="absolute bottom-1 left-1 right-1">
                    <div 
                      className="w-4 h-4 rounded-full border border-border mx-auto mb-1" 
                      style={{ backgroundColor: color.code }} 
                    />
                    <p className="text-foreground text-xs text-center font-medium">{color.name}</p>
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
                  className={`p-4 rounded-xl cursor-pointer flex items-center space-x-4 transition-all duration-300 border-2 ${
                    config.interiorColor === color.name 
                      ? 'bg-primary/10 border-primary shadow-lg' 
                      : 'bg-card border-border hover:border-primary/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div 
                    className="w-12 h-12 rounded-full border-2 border-border/50" 
                    style={{ backgroundColor: color.code }} 
                  />
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{color.name}</h3>
                    <p className="text-primary text-sm">Premium Interior</p>
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

      case 6:
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
      {step < 6 && (
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
