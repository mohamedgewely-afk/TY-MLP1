
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
  const [selectedGrade, setSelectedGrade] = useState("XLE");
  const [selectedEngine, setSelectedEngine] = useState("Hybrid 2.5L");
  const [activeTab, setActiveTab] = useState("performance");
  const [currentPerformanceIndex, setCurrentPerformanceIndex] = useState(0);

  const grades = [
    { name: "LE", price: "+AED 0", features: ["Basic Package", "Standard Safety"] },
    { name: "SE", price: "+AED 8,000", features: ["Sport Package", "Enhanced Audio"] },
    { name: "XLE", price: "+AED 15,000", features: ["Premium Package", "Luxury Interior"] },
    { name: "Limited", price: "+AED 25,000", features: ["Full Premium", "All Features"] }
  ];

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

  const performanceSpecs = [
    {
      category: "Safety",
      icon: <Shield className="h-6 w-6" />,
      color: "from-green-500 to-emerald-500",
      specs: [
        { label: "Pre-Collision System", value: "Standard", icon: <Car className="h-4 w-4" /> },
        { label: "Lane Departure Alert", value: "With Steering Assist", icon: <Navigation className="h-4 w-4" /> },
        { label: "Dynamic Radar Cruise Control", value: "Full-Speed Range", icon: <Gauge className="h-4 w-4" /> },
        { label: "Automatic High Beams", value: "LED", icon: <Zap className="h-4 w-4" /> },
        { label: "Blind Spot Monitor", value: "With Cross-Traffic Alert", icon: <Shield className="h-4 w-4" /> }
      ]
    },
    {
      category: "Technology",
      icon: <Smartphone className="h-6 w-6" />,
      color: "from-blue-500 to-cyan-500",
      specs: [
        { label: "Infotainment Display", value: "12.3-inch Touchscreen", icon: <Monitor className="h-4 w-4" /> },
        { label: "Wireless Connectivity", value: "Apple CarPlay & Android Auto", icon: <Wifi className="h-4 w-4" /> },
        { label: "Premium Audio", value: "9-Speaker JBL System", icon: <Volume2 className="h-4 w-4" /> },
        { label: "Navigation System", value: "Cloud-Based with Live Traffic", icon: <MapPin className="h-4 w-4" /> },
        { label: "Remote Connect", value: "Toyota App Integration", icon: <Smartphone className="h-4 w-4" /> }
      ]
    },
    {
      category: "Multimedia",
      icon: <Volume2 className="h-6 w-6" />,
      color: "from-purple-500 to-pink-500",
      specs: [
        { label: "Audio System", value: "Premium JBL with Subwoofer", icon: <Volume2 className="h-4 w-4" /> },
        { label: "Bluetooth", value: "Multi-device Connection", icon: <Bluetooth className="h-4 w-4" /> },
        { label: "USB Ports", value: "Multiple Charging Points", icon: <Battery className="h-4 w-4" /> },
        { label: "Wireless Charging", value: "Qi-Compatible Pad", icon: <Zap className="h-4 w-4" /> },
        { label: "Voice Control", value: "Natural Language Processing", icon: <MicIcon className="h-4 w-4" /> }
      ]
    },
    {
      category: "Performance",
      icon: <Engine className="h-6 w-6" />,
      color: "from-orange-500 to-red-500",
      specs: [
        { label: "Hybrid System", value: "Toyota Hybrid Synergy Drive", icon: <Zap className="h-4 w-4" /> },
        { label: "Total Power Output", value: "218 HP Combined", icon: <Gauge className="h-4 w-4" /> },
        { label: "Fuel Economy", value: "25.2 km/L City", icon: <Fuel className="h-4 w-4" /> },
        { label: "Acceleration", value: "0-100 km/h in 8.2s", icon: <Engine className="h-4 w-4" /> },
        { label: "Drive Modes", value: "EV, Eco, Normal, Sport", icon: <Settings className="h-4 w-4" /> }
      ]
    },
    {
      category: "Comfort",
      icon: <Wind className="h-6 w-6" />,
      color: "from-teal-500 to-green-500",
      specs: [
        { label: "Climate Control", value: "Dual-Zone Automatic", icon: <Thermometer className="h-4 w-4" /> },
        { label: "Heated Seats", value: "Front & Rear Available", icon: <Car className="h-4 w-4" /> },
        { label: "Ventilated Seats", value: "Driver & Passenger", icon: <Wind className="h-4 w-4" /> },
        { label: "Memory Settings", value: "Driver Seat & Mirrors", icon: <Settings className="h-4 w-4" /> },
        { label: "Ambient Lighting", value: "64-Color Customizable", icon: <Zap className="h-4 w-4" /> }
      ]
    },
    {
      category: "Security",
      icon: <Lock className="h-6 w-6" />,
      color: "from-red-500 to-pink-500",
      specs: [
        { label: "Smart Key System", value: "Push Button Start", icon: <Lock className="h-4 w-4" /> },
        { label: "Remote Start", value: "Smartphone App Control", icon: <Smartphone className="h-4 w-4" /> },
        { label: "Security System", value: "Anti-theft with Immobilizer", icon: <Shield className="h-4 w-4" /> },
        { label: "Backup Camera", value: "Multi-angle View", icon: <Camera className="h-4 w-4" /> },
        { label: "Parking Sensors", value: "Front & Rear", icon: <Car className="h-4 w-4" /> }
      ]
    }
  ];

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
          className="text-center mb-6 lg:mb-8"
        >
          <h2 className="text-2xl lg:text-4xl font-black text-foreground mb-3 leading-tight">
            Interactive{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Experience
            </span>
          </h2>
          <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore specifications and technology features tailored to your preferences.
          </p>
        </motion.div>

        {/* Grade Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h3 className="text-lg font-bold mb-3 text-center">Choose Your Grade</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {grades.map((grade) => (
              <motion.button
                key={grade.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedGrade(grade.name)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  selectedGrade === grade.name
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
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

        {/* Engine Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h3 className="text-lg font-bold mb-3 text-center">Select Engine</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {engines.map((engine) => (
              <motion.button
                key={engine.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedEngine(engine.name)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedEngine === engine.name
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-lg">{engine.name}</h4>
                  {engine.name.includes("Hybrid") && (
                    <Badge className="bg-green-500 text-white">ECO</Badge>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Power</div>
                    <div className="font-semibold">{engine.power}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Efficiency</div>
                    <div className="font-semibold">{engine.efficiency}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Emissions</div>
                    <div className="font-semibold">{engine.emissions}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Performance Specs Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="flex items-center justify-center mb-4">
            <h3 className="text-lg font-bold">Detailed Specifications</h3>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            {/* Navigation Buttons */}
            <button
              onClick={prevPerformanceSpec}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all lg:-translate-x-4"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              onClick={nextPerformanceSpec}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all lg:translate-x-4"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Spec Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPerformanceIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="mx-8"
              >
                <Card className={`overflow-hidden border-0 shadow-lg bg-gradient-to-br ${currentSpec.color} text-white`}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-white/20 rounded-lg mr-3">
                        {currentSpec.icon}
                      </div>
                      <h4 className="text-2xl font-bold">{currentSpec.category}</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentSpec.specs.map((spec, index) => (
                        <motion.div
                          key={spec.label}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/10 backdrop-blur-sm rounded-lg p-3"
                        >
                          <div className="flex items-center mb-2">
                            {spec.icon}
                            <span className="ml-2 text-sm font-medium">{spec.label}</span>
                          </div>
                          <div className="text-lg font-bold">{spec.value}</div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {performanceSpecs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPerformanceIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPerformanceIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-3">Your Configuration</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Grade</div>
                  <div className="font-bold text-lg">{selectedGrade}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Engine</div>
                  <div className="font-bold text-lg">{selectedEngine}</div>
                </div>
              </div>
              <Button className="mt-4">
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
