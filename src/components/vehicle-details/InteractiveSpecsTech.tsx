
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Zap, Shield, Gauge, Leaf, Smartphone, Wind, Battery, Lock,
  Settings, Check, Car, Fuel, Award, ChevronLeft, ChevronRight,
  Star, Trophy, Crown
} from "lucide-react";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("3.5L");
  const [selectedGrade, setSelectedGrade] = useState("Base");
  const [activeTab, setActiveTab] = useState("specs");
  const [selectedTechFeature, setSelectedTechFeature] = useState(0);

  const engines = [
    { name: "3.5L", power: "268 HP", torque: "336 Nm" },
    { name: "4.0L", power: "301 HP", torque: "365 Nm" }
  ];

  const getGradesForEngine = (engine: string) => {
    if (engine === "4.0L") {
      return ["Limited", "Platinum"];
    }
    return ["Base", "SE", "XLE", "Limited"];
  };

  const getGradeDetails = (grade: string) => {
    const gradeInfo = {
      "Base": {
        icon: <Car className="h-4 w-4" />,
        color: "from-gray-500 to-gray-600",
        features: ["Essential Safety Features", "Basic Infotainment", "Fabric Seats", "Manual Climate"],
        price: 0,
        description: "Essential features for everyday driving"
      },
      "SE": {
        icon: <Gauge className="h-4 w-4" />,
        color: "from-blue-500 to-blue-600",
        features: ["Sport Tuning", "18\" Alloy Wheels", "Sport Seats", "Dual Exhaust"],
        price: 2000,
        description: "Enhanced performance and sporty styling"
      },
      "XLE": {
        icon: <Star className="h-4 w-4" />,
        color: "from-purple-500 to-purple-600",
        features: ["Premium Interior", "Sunroof", "Heated Seats", "Wireless Charging"],
        price: 4000,
        description: "Comfort and convenience features"
      },
      "Limited": {
        icon: <Trophy className="h-4 w-4" />,
        color: "from-orange-500 to-orange-600",
        features: ["Leather Seats", "Premium Audio", "Advanced Safety", "LED Lighting"],
        price: 6000,
        description: "Luxury features and premium materials"
      },
      "Platinum": {
        icon: <Crown className="h-4 w-4" />,
        color: "from-amber-500 to-yellow-500",
        features: ["Ultra-Premium Leather", "Mark Levinson Audio", "Panoramic Roof", "Advanced Driver Assist"],
        price: 10000,
        description: "Ultimate luxury and technology"
      }
    };
    return gradeInfo[grade as keyof typeof gradeInfo] || gradeInfo.Base;
  };

  const getSpecsForConfig = () => {
    const gradeDetails = getGradeDetails(selectedGrade);
    return {
      power: selectedEngine === "4.0L" ? "301 HP" : "268 HP",
      torque: selectedEngine === "4.0L" ? "365 Nm" : "336 Nm",
      fuelEconomy: selectedGrade === "Platinum" ? "20.5 km/L" : "22.2 km/L",
      transmission: "CVT",
      drivetrain: selectedGrade === "Limited" || selectedGrade === "Platinum" ? "AWD" : "FWD",
      acceleration: selectedEngine === "4.0L" ? "6.1s" : "7.2s",
      topSpeed: selectedEngine === "4.0L" ? "210 km/h" : "195 km/h"
    };
  };

  const techFeatures = [
    {
      id: "hybrid-drive",
      title: "Hybrid Synergy Drive",
      description: "World's most advanced hybrid system",
      icon: <Zap className="h-5 w-5" />,
      color: "from-primary to-primary/80",
      features: ["Seamless transition", "Regenerative braking", "EV mode"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true"
    },
    {
      id: "safety-sense",
      title: "Toyota Safety Sense 3.0",
      description: "AI-powered collision prevention",
      icon: <Shield className="h-5 w-5" />,
      color: "from-green-500 to-emerald-400",
      features: ["Pre-Collision System", "Lane Departure Alert", "Radar Cruise Control"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true"
    },
    {
      id: "connectivity",
      title: "Connected Intelligence",
      description: "Seamless smartphone integration",
      icon: <Smartphone className="h-5 w-5" />,
      color: "from-primary to-primary/70",
      features: ["Wireless CarPlay", "Premium audio", "Voice recognition"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true"
    },
    {
      id: "climate",
      title: "Climate Harmony",
      description: "Advanced climate control",
      icon: <Wind className="h-5 w-5" />,
      color: "from-cyan-600 to-teal-600",
      features: ["Dual-zone control", "HEPA filtration", "UV sterilization"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true"
    }
  ];

  const specs = getSpecsForConfig();
  const currentTechFeature = techFeatures[selectedTechFeature];
  const gradeDetails = getGradeDetails(selectedGrade);

  const getActiveImage = () => {
    if (activeTab === "specs") {
      if (selectedEngine === "4.0L") {
        return "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
      }
      return "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";
    }
    return currentTechFeature.image;
  };

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <div className="toyota-container relative z-10">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 lg:mb-8"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-xs font-medium mb-4">
            <Settings className="h-3 w-3 mr-1" />
            Interactive Experience
          </Badge>
          <h2 className="text-2xl lg:text-4xl font-black text-foreground mb-2 leading-tight">
            Specifications &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Technology
            </span>
          </h2>
        </motion.div>

        {/* Compact Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-muted/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === "specs"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Car className="h-3 w-3 mr-1 inline" />
              Specs
            </button>
            <button
              onClick={() => setActiveTab("tech")}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === "tech"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="h-3 w-3 mr-1 inline" />
              Tech
            </button>
          </div>
        </div>

        {/* Compact Interactive Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Dynamic Image */}
          <div className="relative">
            <motion.div
              key={getActiveImage()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <img
                src={getActiveImage()}
                alt="Vehicle Feature"
                className="w-full h-48 md:h-64 lg:h-72 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
            </motion.div>

            {/* Tech Feature Navigation */}
            {activeTab === "tech" && (
              <>
                <button
                  onClick={() => setSelectedTechFeature(prev => prev > 0 ? prev - 1 : techFeatures.length - 1)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md border transition-all hover:bg-white hover:shadow-lg"
                >
                  <ChevronLeft className="h-3 w-3 text-gray-700" />
                </button>
                <button
                  onClick={() => setSelectedTechFeature(prev => prev < techFeatures.length - 1 ? prev + 1 : 0)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-white/90 shadow-md border transition-all hover:bg-white hover:shadow-lg"
                >
                  <ChevronRight className="h-3 w-3 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Right: Interactive Controls & Content */}
          <div className="space-y-4">
            <AnimatePresence mode="wait">
              {activeTab === "specs" ? (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Engine Selection - Compact */}
                  <div>
                    <h3 className="text-base font-bold mb-2">Engine</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {engines.map((engine) => (
                        <button
                          key={engine.name}
                          className={`p-2 rounded-lg text-left transition-all duration-200 border ${
                            selectedEngine === engine.name 
                              ? 'bg-primary/10 border-primary' 
                              : 'bg-card border-border hover:border-primary/50'
                          }`}
                          onClick={() => {
                            setSelectedEngine(engine.name);
                            const availableGrades = getGradesForEngine(engine.name);
                            if (!availableGrades.includes(selectedGrade)) {
                              setSelectedGrade(availableGrades[0]);
                            }
                          }}
                        >
                          <div className="font-bold text-sm">{engine.name}</div>
                          <div className="text-xs text-primary">{engine.power}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grade Selection - Enhanced with details */}
                  <div>
                    <h3 className="text-base font-bold mb-2">Grade</h3>
                    <div className="space-y-2">
                      {getGradesForEngine(selectedEngine).map((grade) => {
                        const details = getGradeDetails(grade);
                        return (
                          <button
                            key={grade}
                            className={`w-full p-3 rounded-lg text-left transition-all duration-200 border ${
                              selectedGrade === grade
                                ? "bg-primary/10 border-primary"
                                : "bg-card border-border hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedGrade(grade)}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <div className={`w-6 h-6 rounded bg-gradient-to-r ${details.color} flex items-center justify-center text-white`}>
                                  {details.icon}
                                </div>
                                <span className="font-bold text-sm">{grade}</span>
                              </div>
                              {details.price > 0 && (
                                <span className="text-xs text-primary">+AED {details.price.toLocaleString()}</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">{details.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {details.features.slice(0, 2).map((feature) => (
                                <Badge key={feature} variant="secondary" className="text-xs px-1 py-0">
                                  {feature}
                                </Badge>
                              ))}
                              {details.features.length > 2 && (
                                <Badge variant="secondary" className="text-xs px-1 py-0">
                                  +{details.features.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specs Display - Compact */}
                  <Card>
                    <CardContent className="p-3">
                      <h4 className="font-bold mb-2 text-sm">Performance Specs</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(specs).map(([key, value]) => (
                          <div key={key} className="bg-muted/50 rounded-lg p-2">
                            <div className="text-xs text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div className="font-bold text-sm">{value}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="tech"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <Card>
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentTechFeature.color} flex items-center justify-center text-white`}>
                          {currentTechFeature.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm">{currentTechFeature.title}</h3>
                          <p className="text-xs text-muted-foreground">{currentTechFeature.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        {currentTechFeature.features.map((feature, idx) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span className="text-xs">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tech Feature Quick Nav - Compact */}
                  <div className="grid grid-cols-2 gap-1.5">
                    {techFeatures.map((feature, index) => (
                      <button
                        key={feature.id}
                        onClick={() => setSelectedTechFeature(index)}
                        className={`p-2 rounded-lg border transition-all text-left ${
                          index === selectedTechFeature
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5">
                          <div className={`w-4 h-4 rounded bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}>
                            {feature.icon}
                          </div>
                          <span className="font-medium text-xs">{feature.title}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
