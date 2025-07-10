
import React, { useState } from "react";
import { motion } from "framer-motion";
import { VehicleModel } from "@/types/vehicle";
import { 
  Zap, Gauge, Fuel, Settings, Shield, Smartphone, 
  Volume2, Thermometer, Wind, Battery, Car, 
  Star, Award, Layers,
  Monitor, Wifi, Lock, MapPin, Navigation,
  Radio, Bluetooth, Camera, MicIcon
} from "lucide-react";
import EngineSelector from "./interactive-specs/EngineSelector";
import GradeSelector from "./interactive-specs/GradeSelector";
import SpecsCarousel from "./interactive-specs/SpecsCarousel";
import ConfigSummary from "./interactive-specs/ConfigSummary";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("Hybrid 2.5L");
  const [selectedGrade, setSelectedGrade] = useState("XLE");
  const [currentPerformanceIndex, setCurrentPerformanceIndex] = useState(0);

  // Engine options
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

  // Grade options
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

  // Performance specifications
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

        {/* Engine Selection */}
        <EngineSelector
          engines={engines}
          selectedEngine={selectedEngine}
          onEngineSelect={setSelectedEngine}
        />

        {/* Grade Selection */}
        <GradeSelector
          grades={grades}
          selectedGrade={selectedGrade}
          selectedEngine={selectedEngine}
          onGradeSelect={setSelectedGrade}
        />

        {/* Performance Specs Carousel */}
        <SpecsCarousel
          performanceSpecs={performanceSpecs}
          currentPerformanceIndex={currentPerformanceIndex}
          onNext={nextPerformanceSpec}
          onPrev={prevPerformanceSpec}
          onIndicatorClick={setCurrentPerformanceIndex}
          selectedEngine={selectedEngine}
          selectedGrade={selectedGrade}
        />

        {/* Configuration Summary */}
        <ConfigSummary
          selectedEngine={selectedEngine}
          selectedGrade={selectedGrade}
        />
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
