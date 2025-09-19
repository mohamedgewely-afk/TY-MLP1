
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  Zap, Shield, Gauge, Leaf, Smartphone, Wind, Battery, Lock,
  Settings, ChevronLeft, ChevronRight, Check, Car, Fuel, Award
} from "lucide-react";

interface CombinedSpecsAndTechProps {
  vehicle: VehicleModel;
}

const CombinedSpecsAndTech: React.FC<CombinedSpecsAndTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("3.5L");
  const [selectedGrade, setSelectedGrade] = useState("Base");
  const [selectedFeature, setSelectedFeature] = useState(0);

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

  const techFeatures = [
    {
      id: "hybrid-drive",
      title: "Hybrid Synergy Drive",
      description: "World's most advanced hybrid system with instant electric response",
      icon: <Zap className="h-8 w-8" />,
      color: "from-primary to-primary/80",
      features: ["Seamless electric-gasoline transition", "Regenerative braking system", "EV mode for silent operation"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true"
    },
    {
      id: "safety-sense",
      title: "Toyota Safety Sense 3.0",
      description: "Next-generation safety with AI-powered collision prevention",
      icon: <Shield className="h-8 w-8" />,
      color: "from-green-500 to-emerald-400",
      features: ["Pre-Collision System", "Lane Departure Alert", "Dynamic Radar Cruise Control"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true"
    },
    {
      id: "connectivity",
      title: "Connected Intelligence",
      description: "Seamless smartphone integration with wireless connectivity",
      icon: <Smartphone className="h-8 w-8" />,
      color: "from-primary to-primary/70",
      features: ["Wireless Apple CarPlay", "Premium JBL sound", "Voice recognition"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true"
    }
  ];

  const getSpecsForConfig = () => {
    return {
      power: selectedEngine === "4.0L" ? "301 HP" : "268 HP",
      torque: selectedEngine === "4.0L" ? "365 Nm" : "336 Nm",
      fuelEconomy: selectedGrade === "Platinum" ? "20.5 km/L" : "22.2 km/L",
      transmission: "CVT",
      drivetrain: selectedGrade === "Limited" || selectedGrade === "Platinum" ? "AWD" : "FWD"
    };
  };

  const currentFeature = techFeatures[selectedFeature];
  const specs = getSpecsForConfig();

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <div className="toyota-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Settings className="h-4 w-4 mr-2" />
            Specifications & Technology Suite
          </Badge>
          <h2 className="text-4xl lg:text-6xl xl:text-7xl font-black text-foreground mb-6 lg:mb-8 leading-tight">
            Complete{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Vehicle Experience
            </span>
          </h2>
        </motion.div>

        {/* Engine & Grade Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6 lg:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Engine Selection */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Select Engine</h3>
                  <div className="space-y-3">
                    {engines.map((engine) => (
                      <motion.div
                        key={engine.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
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
                        <h4 className="text-lg font-bold">{engine.name}</h4>
                        <p className="text-primary text-sm">{engine.power} • {engine.torque}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Grade Selection */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Select Grade</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {getGradesForEngine(selectedEngine).map((grade) => (
                      <motion.button
                        key={grade}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-3 rounded-xl font-semibold transition-all duration-200 ${
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
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Combined Display */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 relative">
          {/* Left: Specifications */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Car className="h-6 w-6 mr-3 text-primary" />
                  Performance Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(specs).map(([key, value]) => (
                    <div key={key} className="bg-muted/50 rounded-lg p-4">
                      <div className="text-muted-foreground capitalize text-sm">{key.replace(/([A-Z])/g, ' $1')}</div>
                      <div className="font-bold text-lg">{value}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Technology Feature */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedFeature}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
              >
                <motion.img
                  src={currentFeature.image}
                  alt={currentFeature.title}
                  className="w-full h-80 lg:h-96 object-cover rounded-2xl mb-6"
                />
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentFeature.color} flex items-center justify-center text-white`}>
                        {currentFeature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{currentFeature.title}</h3>
                        <p className="text-muted-foreground text-sm">{currentFeature.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {currentFeature.features.map((feature, idx) => (
                        <div key={feature} className="flex items-center space-x-3">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Small Navigation Arrows */}
            <button
              onClick={() => setSelectedFeature(prev => prev > 0 ? prev - 1 : techFeatures.length - 1)}
              className="absolute left-2 top-40 p-2 rounded-full bg-white/90 shadow-md border transition-all hover:bg-white hover:shadow-lg hover:scale-110"
            >
              <ChevronLeft className="h-4 w-4 text-gray-700" />
            </button>

            <button
              onClick={() => setSelectedFeature(prev => prev < techFeatures.length - 1 ? prev + 1 : 0)}
              className="absolute right-2 top-40 p-2 rounded-full bg-white/90 shadow-md border transition-all hover:bg-white hover:shadow-lg hover:scale-110"
            >
              <ChevronRight className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CombinedSpecsAndTech;
