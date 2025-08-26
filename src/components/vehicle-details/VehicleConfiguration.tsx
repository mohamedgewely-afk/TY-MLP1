
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { 
  ChevronLeft, ChevronRight, Check, Zap, Fuel, Settings,
  ArrowUpDown, Star, Download, Car, Wrench
} from "lucide-react";

interface VehicleConfigurationProps {
  vehicle: VehicleModel;
  onCarBuilder?: (grade?: string) => void;
  onTestDrive?: () => void;
}

const VehicleConfiguration: React.FC<VehicleConfigurationProps> = ({ 
  vehicle, 
  onCarBuilder,
  onTestDrive 
}) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [selectedGrade, setSelectedGrade] = useState(0);

  const engines = [
    {
      name: "2.5L Hybrid",
      description: "Advanced hybrid powertrain with seamless electric assist",
      power: "218 HP",
      efficiency: "25.2 km/L",
      icon: <Zap className="h-6 w-6" />,
      selected: selectedEngine === "2.5L Hybrid"
    },
    {
      name: "3.5L V6",
      description: "Powerful V6 engine for enhanced performance",
      power: "301 HP",
      efficiency: "18.4 km/L",
      icon: <Fuel className="h-6 w-6" />,
      selected: selectedEngine === "3.5L V6"
    }
  ];

  const grades = [
    {
      name: "Hybrid SE",
      description: "Sport-enhanced hybrid driving experience",
      price: 94900,
      monthlyFrom: 945,
      badge: "Balanced Choice",
      badgeColor: "bg-yellow-500",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
      features: [
        "Hybrid Drive Modes",
        "Enhanced Audio",
        "Sport Seats", 
        "18\" Alloy Wheels"
      ]
    },
    {
      name: "Hybrid XLE",
      description: "Premium hybrid with advanced features",
      price: 105900,
      monthlyFrom: 1059,
      badge: "Most Popular",
      badgeColor: "bg-primary",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      features: [
        "Premium Sound System",
        "Leather-trimmed Interior",
        "Wireless Charging",
        "Panoramic Moonroof"
      ]
    },
    {
      name: "Hybrid Limited",
      description: "Top-tier luxury hybrid experience",
      price: 118900,
      monthlyFrom: 1189,
      badge: "Premium",
      badgeColor: "bg-gray-800",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
      features: [
        "JBL Premium Audio",
        "Ventilated Seats",
        "Head-up Display",
        "Advanced Safety Suite"
      ]
    }
  ];

  const nextGrade = () => {
    setSelectedGrade((prev) => (prev + 1) % grades.length);
  };

  const prevGrade = () => {
    setSelectedGrade((prev) => (prev - 1 + grades.length) % grades.length);
  };

  const currentGrade = grades[selectedGrade];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Settings className="h-4 w-4 mr-2" />
            Interactive Experience
          </Badge>
          <h2 className="text-4xl lg:text-6xl font-black text-foreground mb-4 leading-tight">
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Configuration
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select your engine and explore trims in a compact, mobile-perfect layout.
          </p>
        </motion.div>

        {/* Step 1: Engine Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold">Step 1: Choose Your Powertrain</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {engines.map((engine) => (
              <motion.div
                key={engine.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative cursor-pointer transition-all duration-200 ${
                  engine.selected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedEngine(engine.name)}
              >
                <Card className={`h-full ${engine.selected ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        engine.selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {engine.icon}
                      </div>
                      {engine.selected && (
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    
                    <h4 className="text-xl font-bold mb-2">{engine.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{engine.description}</p>
                    
                    <div className="flex justify-between text-sm">
                      <div>
                        <div className="font-semibold">{engine.power}</div>
                        <div className="text-muted-foreground">POWER</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{engine.efficiency}</div>
                        <div className="text-muted-foreground">EFFICIENCY</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Grade Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold">Step 2: Choose Your Grade</h3>
            <Button variant="outline" className="gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Compare
            </Button>
          </div>

          {/* Grade Carousel */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedGrade}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="grid lg:grid-cols-2 gap-8 lg:gap-12"
              >
                {/* Image */}
                <div className="relative">
                  <Badge className={`absolute top-4 left-4 z-10 ${currentGrade.badgeColor} text-white px-3 py-1 text-sm font-medium`}>
                    {currentGrade.badge}
                  </Badge>
                  <img
                    src={currentGrade.image}
                    alt={currentGrade.name}
                    className="w-full h-80 lg:h-96 object-cover rounded-2xl"
                  />
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <h4 className="text-2xl lg:text-3xl font-bold">{currentGrade.name}</h4>
                    </div>
                    <p className="text-muted-foreground mb-4">{currentGrade.description}</p>
                    
                    <div className="space-y-1">
                      <div className="text-3xl font-black">AED {currentGrade.price.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">From AED {currentGrade.monthlyFrom}/month</div>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div>
                    <h5 className="font-semibold mb-3">Key Features</h5>
                    <div className="grid grid-cols-2 gap-3">
                      {currentGrade.features.map((feature, idx) => (
                        <div key={feature} className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="h-3 w-3 text-primary-foreground" />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button 
                      size="lg" 
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => {/* Handle select */}}
                    >
                      Select
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex-1 gap-2"
                      onClick={onTestDrive}
                    >
                      <Download className="h-4 w-4" />
                      Drive
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="flex-1 gap-2"
                      onClick={() => onCarBuilder?.(currentGrade.name)}
                    >
                      <Wrench className="h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevGrade}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors z-10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={nextGrade}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors z-10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {grades.map((_, idx) => (
              <motion.button
                key={idx}
                onClick={() => setSelectedGrade(idx)}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === selectedGrade ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VehicleConfiguration;
