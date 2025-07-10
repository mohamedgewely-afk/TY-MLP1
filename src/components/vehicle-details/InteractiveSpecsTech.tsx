
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Zap, Gauge, Fuel, Settings, Shield, Smartphone, 
  Volume2, Thermometer, Wind, Battery, Car, 
  ChevronLeft, ChevronRight, Star, Award, Layers,
  Monitor, Wifi, Lock, MapPin, Navigation,
  Radio, Bluetooth, Camera, MicIcon
} from "lucide-react";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("Hybrid 2.5L");
  const [selectedGrade, setSelectedGrade] = useState("XLE");
  const [currentPerformanceIndex, setCurrentPerformanceIndex] = useState(0);

  // Engine options (prioritized first)
  const engines = [
    { 
      name: "Hybrid 2.5L", 
      power: "218 HP Combined", 
      efficiency: "25.2 km/L",
      emissions: "102g CO₂/km"
    },
    { 
      name: "Gasoline 2.5L", 
      power: "203 HP", 
      efficiency: "15.8 km/L",
      emissions: "145g CO₂/km"
    }
  ];

  // Grade options (dependent on engine selection)
  const getGradesForEngine = (engine: string) => {
    const baseGrades = [
      { name: "LE", price: "+AED 0", features: ["Basic Package", "Standard Safety"] },
      { name: "SE", price: "+AED 8,000", features: ["Sport Package", "Enhanced Audio"] },
      { name: "XLE", price: "+AED 15,000", features: ["Premium Package", "Luxury Interior"] },
      { name: "Limited", price: "+AED 25,000", features: ["Full Premium", "All Features"] }
    ];
    
    if (engine === "Hybrid 2.5L") {
      return baseGrades.map(grade => ({
        ...grade,
        features: [...grade.features, "Hybrid Technology"]
      }));
    }
    
    return baseGrades;
  };

  const grades = getGradesForEngine(selectedEngine);

  // Dynamic specifications based on engine and grade selection
  const getPerformanceSpecs = () => {
    const isHybrid = selectedEngine === "Hybrid 2.5L";
    const isPremium = selectedGrade === "Limited" || selectedGrade === "XLE";
    
    return [
      {
        category: "Performance",
        icon: <Car className="h-6 w-6" />,
        specs: [
          { label: isHybrid ? "Hybrid System" : "Engine Type", value: isHybrid ? "Toyota Hybrid Synergy Drive" : "Dynamic Force Engine", icon: <Zap className="h-4 w-4" /> },
          { label: "Total Power Output", value: isHybrid ? "218 HP Combined" : "203 HP", icon: <Gauge className="h-4 w-4" /> },
          { label: "Fuel Economy", value: isHybrid ? "25.2 km/L City" : "15.8 km/L City", icon: <Fuel className="h-4 w-4" /> },
          { label: "Acceleration", value: isHybrid ? "0-100 km/h in 8.2s" : "0-100 km/h in 9.1s", icon: <Car className="h-4 w-4" /> },
          { label: "Drive Modes", value: isHybrid ? "EV, Eco, Normal, Sport" : "Eco, Normal, Sport", icon: <Settings className="h-4 w-4" /> }
        ]
      },
      {
        category: "Safety",
        icon: <Shield className="h-6 w-6" />,
        specs: [
          { label: "Pre-Collision System", value: "Standard", icon: <Car className="h-4 w-4" /> },
          { label: "Lane Departure Alert", value: isPremium ? "With Steering Assist" : "Standard", icon: <Navigation className="h-4 w-4" /> },
          { label: "Dynamic Radar Cruise Control", value: isPremium ? "Full-Speed Range" : "Standard", icon: <Gauge className="h-4 w-4" /> },
          { label: "Automatic High Beams", value: "LED", icon: <Zap className="h-4 w-4" /> },
          { label: "Blind Spot Monitor", value: isPremium ? "With Cross-Traffic Alert" : "Optional", icon: <Shield className="h-4 w-4" /> }
        ]
      },
      {
        category: "Technology",
        icon: <Smartphone className="h-6 w-6" />,
        specs: [
          { label: "Infotainment Display", value: isPremium ? "12.3-inch Touchscreen" : "9-inch Touchscreen", icon: <Monitor className="h-4 w-4" /> },
          { label: "Wireless Connectivity", value: "Apple CarPlay & Android Auto", icon: <Wifi className="h-4 w-4" /> },
          { label: "Premium Audio", value: isPremium ? "9-Speaker JBL System" : "6-Speaker System", icon: <Volume2 className="h-4 w-4" /> },
          { label: "Navigation System", value: isPremium ? "Cloud-Based with Live Traffic" : "Basic Navigation", icon: <MapPin className="h-4 w-4" /> },
          { label: "Remote Connect", value: isPremium ? "Toyota App Integration" : "Basic Remote", icon: <Smartphone className="h-4 w-4" /> }
        ]
      },
      {
        category: "Comfort",
        icon: <Wind className="h-6 w-6" />,
        specs: [
          { label: "Climate Control", value: isPremium ? "Dual-Zone Automatic" : "Manual A/C", icon: <Thermometer className="h-4 w-4" /> },
          { label: "Heated Seats", value: isPremium ? "Front & Rear Available" : "Front Only", icon: <Car className="h-4 w-4" /> },
          { label: "Ventilated Seats", value: isPremium ? "Driver & Passenger" : "Not Available", icon: <Wind className="h-4 w-4" /> },
          { label: "Memory Settings", value: isPremium ? "Driver Seat & Mirrors" : "Not Available", icon: <Settings className="h-4 w-4" /> },
          { label: "Ambient Lighting", value: isPremium ? "64-Color Customizable" : "Basic Lighting", icon: <Zap className="h-4 w-4" /> }
        ]
      }
    ];
  };

  const performanceSpecs = getPerformanceSpecs();

  const nextPerformanceSpec = () => {
    setCurrentPerformanceIndex((prev) => (prev + 1) % performanceSpecs.length);
  };

  const prevPerformanceSpec = () => {
    setCurrentPerformanceIndex((prev) => (prev - 1 + performanceSpecs.length) % performanceSpecs.length);
  };

  const currentSpec = performanceSpecs[currentPerformanceIndex];

  return (
    <section className="py-8 lg:py-16 bg-gradient-to-br from-muted/20 to-background">
      <div className="toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <h2 className="text-2xl lg:text-4xl font-black text-foreground mb-4 leading-tight">
            Interactive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Experience
            </span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Configure your ideal vehicle and explore specifications in real-time.
          </p>
        </motion.div>

        {/* Engine Selection - SIDE BY SIDE ON MOBILE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-lg font-bold mb-6 text-center">Choose Your Engine</h3>
          <div className="grid grid-cols-2 gap-3 lg:gap-6 max-w-4xl mx-auto px-4">
            {engines.map((engine) => (
              <motion.button
                key={engine.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedEngine(engine.name)}
                className={`p-4 lg:p-6 rounded-xl border-2 transition-all text-left ${
                  selectedEngine === engine.name
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm lg:text-lg">{engine.name}</h4>
                  {engine.name.includes("Hybrid") && (
                    <Badge className="bg-green-500 text-white text-xs">ECO</Badge>
                  )}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-3 text-xs lg:text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Power</div>
                    <div className="font-semibold">{engine.power}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Efficiency</div>
                    <div className="font-semibold">{engine.efficiency}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs mb-1">Emissions</div>
                    <div className="font-semibold">{engine.emissions}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grade Selection - SECOND */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
          key={selectedEngine}
        >
          <h3 className="text-lg font-bold mb-6 text-center">Select Your Grade</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {grades.map((grade, index) => (
              <motion.button
                key={grade.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedGrade(grade.name)}
                className={`p-4 rounded-xl border-2 transition-all text-left min-h-[120px] ${
                  selectedGrade === grade.name
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-lg">{grade.name}</h4>
                  <Badge variant={selectedGrade === grade.name ? "default" : "secondary"} className="text-xs">
                    {grade.price}
                  </Badge>
                </div>
                <div className="space-y-1">
                  {grade.features.map((feature) => (
                    <div key={feature} className="text-xs text-muted-foreground">
                      • {feature}
                    </div>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Performance Specs Carousel - FULL WIDTH MOBILE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
          key={`${selectedEngine}-${selectedGrade}`}
        >
          <div className="flex items-center justify-center mb-6">
            <h3 className="text-lg font-bold">Detailed Specifications</h3>
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4">
            {/* Navigation Buttons */}
            <button
              onClick={prevPerformanceSpec}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all lg:-translate-x-6 min-h-[44px] min-w-[44px]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              onClick={nextPerformanceSpec}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all lg:translate-x-6 min-h-[44px] min-w-[44px]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Spec Card - FULL WIDTH ON MOBILE */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentPerformanceIndex}-${selectedEngine}-${selectedGrade}`}
                initial={{ opacity: 0, x: 100, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="mx-0 lg:mx-12"
              >
                <Card className="overflow-hidden border bg-card shadow-xl">
                  <CardContent className="p-4 lg:p-8">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-primary/20 rounded-lg mr-4">
                        {currentSpec.icon}
                      </div>
                      <h4 className="text-xl lg:text-3xl font-bold">{currentSpec.category}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                      {currentSpec.specs.map((spec, index) => (
                        <motion.div
                          key={spec.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.08, duration: 0.3 }}
                          className="bg-muted/50 rounded-lg p-4"
                        >
                          <div className="flex items-center mb-2">
                            {spec.icon}
                            <span className="ml-2 text-sm font-medium">{spec.label}</span>
                          </div>
                          <div className="text-base lg:text-lg font-bold">{spec.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="flex justify-center space-x-3 mt-6">
              {performanceSpecs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPerformanceIndex(index)}
                  className={`h-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                    index === currentPerformanceIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30 w-3'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Configuration Summary - CONNECT TO BUILDER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center px-4"
          key={`${selectedEngine}-${selectedGrade}-summary`}
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6 lg:p-8">
              <h3 className="text-xl font-bold mb-4">Your Configuration</h3>
              <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                <div>
                  <div className="text-muted-foreground mb-1">Engine</div>
                  <div className="font-bold text-lg">{selectedEngine}</div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Grade</div>
                  <div className="font-bold text-lg">{selectedGrade}</div>
                </div>
              </div>
              <Button 
                className="w-full py-3 min-h-[44px]"
                onClick={() => {
                  // This will be connected to open the car builder with colors step
                  const event = new CustomEvent('openCarBuilder', { 
                    detail: { step: 3, config: { engine: selectedEngine, grade: selectedGrade } } 
                  });
                  window.dispatchEvent(event);
                }}
              >
                Configure Your Vehicle
                <Settings className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
