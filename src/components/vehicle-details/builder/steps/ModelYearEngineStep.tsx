
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Fuel, Gauge } from "lucide-react";

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
  const modelYears = ["2024", "2025"];
  
  const engines = [
    {
      name: "3.5L V6",
      power: "301 HP",
      torque: "365 Nm",
      efficiency: "22.2 km/L",
      type: "Gasoline",
      price: 0,
      badge: "Standard"
    },
    {
      name: "4.0L V6",
      power: "381 HP", 
      torque: "430 Nm",
      efficiency: "18.5 km/L",
      type: "Gasoline",
      price: 5000,
      badge: "Performance"
    },
    {
      name: "2.5L Hybrid",
      power: "218 HP",
      torque: "202 Nm",
      efficiency: "25.2 km/L",
      type: "Hybrid",
      price: 3000,
      badge: "Eco"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Model Year Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-foreground">Choose Model Year</h3>
        <div className="grid grid-cols-2 gap-3">
          {modelYears.map((year) => (
            <motion.button
              key={year}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
              className={`p-4 rounded-xl border-2 transition-all ${
                config.modelYear === year
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-2xl font-bold">{year}</div>
              <div className="text-sm text-muted-foreground">
                {year === "2025" ? "Latest Model" : "Previous Year"}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Engine Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4"
      >
        <h3 className="text-xl font-bold text-foreground">Select Engine</h3>
        <div className="space-y-3">
          {engines.map((engine) => (
            <motion.button
              key={engine.name}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
              className={`w-full text-left transition-all ${
                config.engine === engine.name
                  ? 'ring-2 ring-primary'
                  : ''
              }`}
            >
              <Card className={`${
                config.engine === engine.name
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-lg">{engine.name}</h4>
                        <Badge 
                          variant={engine.type === "Hybrid" ? "default" : "secondary"}
                          className={engine.type === "Hybrid" ? "bg-green-500 text-white" : ""}
                        >
                          {engine.badge}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{engine.type} Engine</p>
                    </div>
                    {engine.price > 0 && (
                      <div className="text-right">
                        <div className="text-sm font-bold text-primary">
                          +AED {engine.price.toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <Gauge className="h-4 w-4 mx-auto mb-1 text-primary" />
                      <div className="text-xs font-bold">{engine.power}</div>
                      <div className="text-xs text-muted-foreground">Power</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <Zap className="h-4 w-4 mx-auto mb-1 text-primary" />
                      <div className="text-xs font-bold">{engine.torque}</div>
                      <div className="text-xs text-muted-foreground">Torque</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded-lg">
                      <Fuel className="h-4 w-4 mx-auto mb-1 text-primary" />
                      <div className="text-xs font-bold">{engine.efficiency}</div>
                      <div className="text-xs text-muted-foreground">Efficiency</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ModelYearEngineStep;
