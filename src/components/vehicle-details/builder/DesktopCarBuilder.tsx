
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BuilderConfig {
  modelYear: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface DesktopCarBuilderProps {
  vehicle: VehicleModel;
  step: number;
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
  showConfirmation: boolean;
  calculateTotalPrice: () => number;
  handlePayment: () => void;
  goBack: () => void;
  goNext: () => void;
  onClose: () => void;
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
  { name: "Alloy Wheels", price: 900 },
  { name: "Roof Rack", price: 250 },
  { name: "Floor Mats", price: 150 }
];

const DesktopCarBuilder: React.FC<DesktopCarBuilderProps> = ({
  vehicle,
  step,
  config,
  setConfig,
  showConfirmation,
  calculateTotalPrice,
  handlePayment,
  goBack,
  goNext,
  onClose
}) => {
  const getCurrentVehicleImage = () => {
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  };

  const steps = [
    "Model Year",
    "Grade", 
    "Exterior",
    "Interior",
    "Accessories",
    "Review"
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modelYears.map((year, index) => (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-8 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                  config.modelYear === year 
                    ? 'bg-primary/10 border-primary shadow-2xl' 
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-xl'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-foreground mb-4">{year}</h3>
                  <p className="text-primary text-lg font-medium">
                    {year === "2025" ? "Latest Technology" : "Proven Reliability"}
                  </p>
                  <Badge className="mt-4 bg-primary/20 text-primary">
                    {year === "2025" ? "New Release" : "Bestseller"}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grades.map((grade, index) => (
              <motion.div
                key={grade}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                  config.grade === grade 
                    ? 'bg-primary/10 border-primary shadow-2xl' 
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-xl'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, grade }))}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-xl font-bold text-foreground mb-2">{grade}</h3>
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
        );

      case 3:
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {exteriorColors.map((color, index) => (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all duration-300 ${
                  config.exteriorColor === color.name ? 'border-primary shadow-2xl scale-105' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-center">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white mx-auto mb-2 shadow-lg" 
                    style={{ backgroundColor: color.code }} 
                  />
                  <p className="text-foreground text-sm font-bold">{color.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {interiorColors.map((color, index) => (
              <motion.div
                key={color.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-8 rounded-xl cursor-pointer flex items-center space-x-6 transition-all duration-300 border-2 ${
                  config.interiorColor === color.name 
                    ? 'bg-primary/10 border-primary shadow-2xl' 
                    : 'bg-card border-border hover:border-primary/50 hover:shadow-xl'
                }`}
                onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="w-16 h-16 rounded-full border-4 border-border/50 shadow-lg" 
                  style={{ backgroundColor: color.code }} 
                />
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{color.name}</h3>
                  <p className="text-primary text-lg">Premium Interior</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accessories.map((accessory, index) => {
              const isSelected = config.accessories.includes(accessory.name);
              return (
                <motion.div
                  key={accessory.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'bg-primary/10 border-primary shadow-2xl' 
                      : 'bg-card border-border hover:border-primary/50 hover:shadow-xl'
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
                    <h3 className="text-foreground font-bold text-lg">{accessory.name}</h3>
                    <p className="text-primary text-base">AED {accessory.price.toLocaleString()}</p>
                  </div>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                    >
                      <span className="text-primary-foreground text-lg">✓</span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        );

      case 6:
        return (
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 border-2 border-primary/20 shadow-2xl">
              <CardContent className="p-0">
                <div className="space-y-6 mb-8">
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <span className="text-foreground font-medium">Model Year:</span>
                    <span className="text-primary font-bold text-lg">{config.modelYear}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <span className="text-foreground font-medium">Grade:</span>
                    <span className="text-primary font-bold text-lg">{config.grade}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <span className="text-foreground font-medium">Exterior Color:</span>
                    <span className="text-primary font-bold text-lg">{config.exteriorColor}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <span className="text-foreground font-medium">Interior Color:</span>
                    <span className="text-primary font-bold text-lg">{config.interiorColor}</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <span className="text-foreground font-medium">Accessories:</span>
                    <span className="text-primary font-bold text-lg">{config.accessories.length} selected</span>
                  </div>
                </div>

                <motion.div
                  className="text-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handlePayment}
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-6 rounded-xl text-xl font-bold shadow-2xl"
                  >
                    <Zap className="mr-3 h-6 w-6" />
                    Confirm Order - AED {calculateTotalPrice().toLocaleString()}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative h-full w-full bg-background overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-card/95 backdrop-blur-xl border-b border-border">
        <motion.button
          onClick={step > 1 ? goBack : onClose}
          className="p-3 rounded-xl bg-secondary/50 backdrop-blur-xl border border-border hover:bg-secondary/70 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {step > 1 ? (
            <ArrowLeft className="h-6 w-6 text-foreground" />
          ) : (
            <X className="h-6 w-6 text-foreground" />
          )}
        </motion.button>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Build Your {vehicle.name}</h1>
          <p className="text-sm text-primary font-medium">Step {step} of 6</p>
        </div>

        <div className="w-12" />
      </div>

      {/* Progress */}
      <div className="px-6 py-4 bg-card/50 backdrop-blur-xl border-b border-border">
        <div className="flex justify-between items-center mb-4">
          {steps.map((stepName, index) => (
            <div
              key={stepName}
              className={`text-sm font-medium transition-colors duration-300 ${
                index + 1 <= step ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {stepName}
            </div>
          ))}
        </div>
        
        <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(step / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex h-full">
        {/* Left Side - Vehicle Image */}
        <motion.div 
          className="w-1/2 relative bg-gradient-to-br from-muted/30 to-background"
          layoutId="vehicle-image"
          key={config.exteriorColor + config.grade + config.modelYear}
        >
          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="w-full h-full object-cover"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          <motion.div 
            className="absolute bottom-8 left-8 text-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-2xl font-bold">{config.modelYear} {vehicle.name}</h3>
            <p className="text-primary text-lg font-medium">{config.grade} • {config.exteriorColor}</p>
            <div className="mt-4 bg-card/90 backdrop-blur-md px-4 py-2 rounded-lg border border-border">
              <p className="text-2xl font-bold text-primary">AED {calculateTotalPrice().toLocaleString()}</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Configuration */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 p-8 overflow-y-auto">
            <motion.h2 
              className="text-3xl font-bold text-center mb-8 text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {steps[step - 1]}
            </motion.h2>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {step < 6 && (
            <div className="p-6 border-t border-border bg-card/50 backdrop-blur-xl">
              <Button 
                onClick={goNext}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg"
              >
                Continue
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DesktopCarBuilder;
