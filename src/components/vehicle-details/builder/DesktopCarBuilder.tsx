
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";

interface BuilderConfig {
  modelYear: string;
  engine: string;
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
    const exteriorColors = [
      { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
      { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
      { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" }
    ];
    
    const colorData = exteriorColors.find(c => c.name === config.exteriorColor);
    return colorData?.image || exteriorColors[0].image;
  };

  const modelYears = ["2024", "2025"];
  const engines = [
    { name: "3.5L", power: "268 HP", torque: "336 Nm", price: 0 },
    { name: "4.0L", power: "301 HP", torque: "365 Nm", price: 5000 }
  ];
  const grades = ["Base", "SE", "XLE", "Limited", "Platinum"];
  const exteriorColors = [
    { name: "Pearl White", code: "#F8F8FF", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" },
    { name: "Midnight Black", code: "#000000", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" },
    { name: "Silver Metallic", code: "#C0C0C0", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" }
  ];
  const interiorColors = [
    { name: "Black Leather", code: "#2C2C2C", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/4046322b-9927-490d-b88a-3c18e7b590f3/renditions/c1fbcc4b-eac8-4440-af33-866cf99a0c93?binary=true&mformat=true" }
  ];
  const accessories = [
    { name: "Premium Sound System", price: 1200 },
    { name: "Sunroof", price: 800 },
    { name: "Navigation System", price: 600 },
    { name: "Heated Seats", price: 400 },
    { name: "Backup Camera", price: 300 },
    { name: "Alloy Wheels", price: 900 }
  ];

  const stepTitles = [
    "Choose Model Year",
    "Choose Your Engine", 
    "Select Grade",
    "Exterior Color",
    "Interior Color",
    "Accessories",
    "Review & Confirm"
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-2 gap-6">
            {modelYears.map((year) => (
              <motion.div
                key={year}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    config.modelYear === year 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
                >
                  <CardContent className="p-8 text-center">
                    <h3 className="text-3xl font-bold text-foreground mb-2">{year}</h3>
                    <p className="text-primary">
                      {year === "2025" ? "Latest Technology" : "Proven Reliability"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-2 gap-6">
            {engines.map((engine) => (
              <motion.div
                key={engine.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    config.engine === engine.name 
                      ? 'border-primary bg-primary/5 shadow-lg' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
                >
                  <CardContent className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-foreground">{engine.name}</h3>
                      {engine.price > 0 && (
                        <Badge className="bg-primary text-primary-foreground">
                          +AED {engine.price.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-primary font-medium mb-2">{engine.power} • {engine.torque}</p>
                    <p className="text-muted-foreground">Premium Performance Engine</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {grades.map((grade) => {
              const gradePricing = { "Base": 0, "SE": 2000, "XLE": 4000, "Limited": 6000, "Platinum": 10000 };
              const additionalPrice = gradePricing[grade as keyof typeof gradePricing] || 0;
              
              return (
                <motion.div
                  key={grade}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 border-2 ${
                      config.grade === grade 
                        ? 'border-primary bg-primary/5 shadow-lg' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setConfig(prev => ({ ...prev, grade }))}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-foreground">{grade}</h3>
                        {additionalPrice > 0 && (
                          <Badge className="bg-primary text-primary-foreground">
                            +AED {additionalPrice.toLocaleString()}
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {grade === "Base" && "Essential features for everyday driving"}
                        {grade === "SE" && "Sport styling with enhanced performance"}
                        {grade === "XLE" && "Premium comfort and convenience"}
                        {grade === "Limited" && "Luxury features and premium materials"}
                        {grade === "Platinum" && "Ultimate luxury and cutting-edge technology"}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        );

      case 4:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {exteriorColors.map((color) => (
              <motion.div
                key={color.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 border-2 overflow-hidden ${
                    config.exteriorColor === color.name 
                      ? 'border-primary shadow-lg ring-4 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
                >
                  <div className="aspect-video relative">
                    <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-lg" 
                          style={{ backgroundColor: color.code }} 
                        />
                        <span className="text-white font-bold">{color.name}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      case 5:
        return (
          <div className="max-w-2xl mx-auto">
            {interiorColors.map((color) => (
              <motion.div
                key={color.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 border-2 overflow-hidden ${
                    config.interiorColor === color.name 
                      ? 'border-primary shadow-lg ring-4 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
                >
                  <div className="aspect-video relative">
                    <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-6 h-6 rounded-full border-2 border-white shadow-lg" 
                          style={{ backgroundColor: color.code }} 
                        />
                        <span className="text-white font-bold">{color.name}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        );

      case 6:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accessories.map((accessory) => {
              const isSelected = config.accessories.includes(accessory.name);
              return (
                <motion.div
                  key={accessory.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 border-2 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 shadow-lg' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setConfig(prev => ({
                      ...prev,
                      accessories: isSelected
                        ? prev.accessories.filter(a => a !== accessory.name)
                        : [...prev.accessories, accessory.name]
                    }))}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{accessory.name}</h3>
                          <p className="text-muted-foreground text-sm">Premium feature</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-primary text-primary-foreground">
                            AED {accessory.price}
                          </Badge>
                          {isSelected && (
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-primary-foreground text-sm">✓</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        );

      case 7:
        return (
          <div className="max-w-2xl mx-auto text-center">
            <div className="space-y-6 mb-8 text-left bg-card p-6 rounded-xl border border-border">
              <div className="flex justify-between">
                <span className="text-foreground">Model Year:</span>
                <span className="text-primary font-medium">{config.modelYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Engine:</span>
                <span className="text-primary font-medium">{config.engine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Grade:</span>
                <span className="text-primary font-medium">{config.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Exterior:</span>
                <span className="text-primary font-medium">{config.exteriorColor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Interior:</span>
                <span className="text-primary font-medium">{config.interiorColor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground">Accessories:</span>
                <span className="text-primary font-medium">{config.accessories.length} selected</span>
              </div>
            </div>

            <Button 
              onClick={handlePayment}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-4 text-xl font-bold rounded-xl"
            >
              <Zap className="mr-3 h-6 w-6" />
              Confirm Order - AED {calculateTotalPrice().toLocaleString()}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Left Panel - Vehicle Preview */}
      <div className="w-1/2 relative overflow-hidden bg-gradient-to-br from-muted/50 to-background">
        <motion.div 
          className="absolute top-6 right-6 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
          >
            <X className="h-6 w-6" />
          </button>
        </motion.div>

        {/* Vehicle Image */}
        <motion.div 
          className="w-full h-full flex items-center justify-center p-8"
          key={config.exteriorColor + config.grade + config.modelYear + config.engine}
        >
          <motion.img 
            src={getCurrentVehicleImage()}
            alt="Vehicle Preview"
            className="max-w-full max-h-full object-contain"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>

        {/* Vehicle Info */}
        <motion.div 
          className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold text-white mb-2">
            {config.modelYear} {vehicle.name}
          </h3>
          <p className="text-white/80 mb-4">
            {config.grade} • {config.engine} • {config.exteriorColor} • {config.interiorColor}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-white/80">Total Price</span>
            <span className="text-2xl font-bold text-white">
              AED {calculateTotalPrice().toLocaleString()}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Configuration */}
      <div className="w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border bg-background">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-foreground">
              Build Your {vehicle.name}
            </h1>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Step {step} of 7</p>
              <div className="w-32 bg-muted rounded-full h-2 mt-1">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / 7) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
          
          <h2 className="text-xl font-semibold text-foreground">
            {stepTitles[step - 1]}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {step < 7 && (
          <div className="p-6 border-t border-border bg-background">
            <div className="flex justify-between">
              <Button
                onClick={goBack}
                disabled={step === 1}
                variant="outline"
                size="lg"
                className="px-8"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back
              </Button>
              
              <Button
                onClick={goNext}
                size="lg"
                className="px-8 bg-primary hover:bg-primary/90"
              >
                Continue
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopCarBuilder;
