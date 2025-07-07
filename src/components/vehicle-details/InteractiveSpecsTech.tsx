
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Zap, Shield, Gauge, Leaf, Smartphone, Wind, Battery, Lock,
  Settings, Check, Car, Fuel, Award, ChevronLeft, ChevronRight
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

  const getSpecsForConfig = () => {
    return {
      power: selectedEngine === "4.0L" ? "301 HP" : "268 HP",
      torque: selectedEngine === "4.0L" ? "365 Nm" : "336 Nm",
      fuelEconomy: selectedGrade === "Platinum" ? "20.5 km/L" : "22.2 km/L",
      transmission: "CVT",
      drivetrain: selectedGrade === "Limited" || selectedGrade === "Platinum" ? "AWD" : "FWD"
    };
  };

  const techFeatures = [
    {
      id: "hybrid-drive",
      title: "Hybrid Synergy Drive",
      description: "World's most advanced hybrid system with instant electric response",
      icon: <Zap className="h-6 w-6" />,
      color: "from-primary to-primary/80",
      features: ["Seamless electric-gasoline transition", "Regenerative braking system", "EV mode for silent operation"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true"
    },
    {
      id: "safety-sense",
      title: "Toyota Safety Sense 3.0",
      description: "Next-generation safety with AI-powered collision prevention",
      icon: <Shield className="h-6 w-6" />,
      color: "from-green-500 to-emerald-400",
      features: ["Pre-Collision System", "Lane Departure Alert", "Dynamic Radar Cruise Control"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true"
    },
    {
      id: "connectivity",
      title: "Connected Intelligence",
      description: "Seamless smartphone integration with wireless connectivity",
      icon: <Smartphone className="h-6 w-6" />,
      color: "from-primary to-primary/70",
      features: ["Wireless Apple CarPlay", "Premium JBL sound", "Voice recognition"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true"
    },
    {
      id: "climate",
      title: "Climate Harmony",
      description: "Advanced climate control with air purification",
      icon: <Wind className="h-6 w-6" />,
      color: "from-cyan-600 to-teal-600",
      features: ["Dual-zone climate control", "HEPA air filtration", "UV sterilization"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true"
    }
  ];

  const specs = getSpecsForConfig();
  const currentTechFeature = techFeatures[selectedTechFeature];

  const getActiveImage = () => {
    if (activeTab === "specs") {
      // Return spec-related image based on engine/grade
      if (selectedEngine === "4.0L") {
        return "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
      }
      return "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";
    }
    return currentTechFeature.image;
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <div className="toyota-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Settings className="h-4 w-4 mr-2" />
            Interactive Experience
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 leading-tight">
            Specifications &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Technology Suite
            </span>
          </h2>
        </motion.div>

        {/* Tab Navigation - Mobile Optimized */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-muted/50 p-2 rounded-2xl">
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "specs"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Car className="h-4 w-4 mr-2 inline" />
              Specifications
            </button>
            <button
              onClick={() => setActiveTab("tech")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === "tech"
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Smartphone className="h-4 w-4 mr-2 inline" />
              Technology
            </button>
          </div>
        </div>

        {/* Interactive Content */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Dynamic Image */}
          <div className="relative">
            <motion.div
              key={getActiveImage()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <img
                src={getActiveImage()}
                alt="Vehicle Feature"
                className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
            </motion.div>

            {/* Tech Feature Navigation - Only show in tech tab */}
            {activeTab === "tech" && (
              <>
                <button
                  onClick={() => setSelectedTechFeature(prev => prev > 0 ? prev - 1 : techFeatures.length - 1)}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md border transition-all hover:bg-white hover:shadow-lg"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-700" />
                </button>
                <button
                  onClick={() => setSelectedTechFeature(prev => prev < techFeatures.length - 1 ? prev + 1 : 0)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-md border transition-all hover:bg-white hover:shadow-lg"
                >
                  <ChevronRight className="h-4 w-4 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Right: Interactive Controls & Content */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {activeTab === "specs" ? (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Engine Selection */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">Engine Options</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {engines.map((engine) => (
                        <motion.button
                          key={engine.name}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-3 rounded-xl text-left transition-all duration-200 border-2 ${
                            selectedEngine === engine.name 
                              ? 'bg-primary/10 border-primary shadow-lg' 
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
                          <div className="font-bold">{engine.name}</div>
                          <div className="text-sm text-primary">{engine.power}</div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Grade Selection */}
                  <div>
                    <h3 className="text-lg font-bold mb-3">Grade Selection</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {getGradesForEngine(selectedEngine).map((grade) => (
                        <motion.button
                          key={grade}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`p-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                            selectedGrade === grade
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-muted text-muted-foreground hover:bg-muted/80"
                          }`}
                          onClick={() => setSelectedGrade(grade)}
                        >
                          {grade}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Specs Display */}
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-bold mb-3">Performance Specs</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(specs).map(([key, value]) => (
                          <div key={key} className="bg-muted/50 rounded-lg p-3">
                            <div className="text-xs text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </div>
                            <div className="font-bold">{value}</div>
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
                  className="space-y-6"
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTechFeature.color} flex items-center justify-center text-white`}>
                          {currentTechFeature.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold">{currentTechFeature.title}</h3>
                          <p className="text-sm text-muted-foreground">{currentTechFeature.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {currentTechFeature.features.map((feature, idx) => (
                          <div key={feature} className="flex items-center space-x-3">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tech Feature Quick Nav */}
                  <div className="grid grid-cols-2 gap-2">
                    {techFeatures.map((feature, index) => (
                      <button
                        key={feature.id}
                        onClick={() => setSelectedTechFeature(index)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          index === selectedTechFeature
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-6 h-6 rounded bg-gradient-to-br ${feature.color} flex items-center justify-center text-white text-xs`}>
                            {feature.icon}
                          </div>
                          <span className="font-medium text-sm">{feature.title}</span>
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
