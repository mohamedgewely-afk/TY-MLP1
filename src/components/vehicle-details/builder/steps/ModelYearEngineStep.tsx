
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Zap, Fuel, Gauge } from "lucide-react";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface ModelYearEngineStepProps {
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
}

const ModelYearEngineStep: React.FC<ModelYearEngineStepProps> = ({ config, setConfig }) => {
  const modelYears = [
    { year: "2024", available: true, badge: "Current" },
    { year: "2025", available: true, badge: "Latest" },
    { year: "2026", available: false, badge: "Coming Soon" }
  ];

  const engines = [
    {
      name: "3.5L V6",
      price: 0,
      power: "301 HP",
      torque: "267 lb-ft",
      fuelEconomy: "22/28 MPG",
      icon: <Zap className="h-5 w-5" />,
      description: "Powerful and efficient",
      badge: "Standard"
    },
    {
      name: "4.0L V6",
      price: 5000,
      power: "270 HP",
      torque: "278 lb-ft",
      fuelEconomy: "17/20 MPG",
      icon: <Gauge className="h-5 w-5" />,
      description: "Maximum capability",
      badge: "Premium"
    },
    {
      name: "2.5L Hybrid",
      price: 3000,
      power: "243 HP",
      torque: "163 lb-ft",
      fuelEconomy: "36/35 MPG",
      icon: <Fuel className="h-5 w-5" />,
      description: "Eco-friendly choice",
      badge: "Hybrid"
    }
  ];

  return (
    <div className="space-y-8 toyota-spacing-md">
      {/* Model Year Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center text-foreground">
          Select Model Year
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modelYears.map((year, index) => (
            <motion.button
              key={year.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
              onClick={() => year.available && setConfig(prev => ({ ...prev, modelYear: year.year }))}
              disabled={!year.available}
              className={`w-full text-left ${!year.available ? 'opacity-50 cursor-not-allowed' : ''}`}
              whileHover={year.available ? { y: -2 } : {}}
              whileTap={year.available ? { scale: 0.98 } : {}}
            >
              <Card 
                className={`h-full transition-all duration-200 border-2 ${
                  config.modelYear === year.year
                    ? 'border-toyota-red toyota-shadow-md'
                    : 'border-gray-200 hover:border-toyota-red/30'
                }`}
              >
                <CardContent className="toyota-spacing-md text-center">
                  <Calendar className="h-8 w-8 text-toyota-red mx-auto mb-3" />
                  <h4 className="text-2xl font-bold text-foreground mb-2">{year.year}</h4>
                  <Badge 
                    className={`${
                      year.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {year.badge}
                  </Badge>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Engine Selection */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center text-foreground">
          Choose Your Engine
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {engines.map((engine, index) => (
            <motion.button
              key={engine.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.2 }}
              onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
              className="w-full text-left"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`h-full transition-all duration-200 border-2 ${
                  config.engine === engine.name
                    ? 'border-toyota-red toyota-shadow-md'
                    : 'border-gray-200 hover:border-toyota-red/30'
                }`}
              >
                <CardContent className="toyota-spacing-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`toyota-spacing-sm toyota-border-radius ${
                        config.engine === engine.name ? 'bg-toyota-red text-white' : 'bg-gray-100'
                      }`}>
                        {engine.icon}
                      </div>
                      <div>
                        <h4 className={`font-bold ${config.engine === engine.name ? 'text-toyota-red' : 'text-foreground'}`}>
                          {engine.name}
                        </h4>
                        {engine.price > 0 && (
                          <p className="text-sm text-muted-foreground">
                            +AED {engine.price.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700">
                      {engine.badge}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">
                    {engine.description}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Power:</span>
                      <span className="font-medium">{engine.power}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Torque:</span>
                      <span className="font-medium">{engine.torque}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Fuel Economy:</span>
                      <span className="font-medium">{engine.fuelEconomy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelYearEngineStep;
