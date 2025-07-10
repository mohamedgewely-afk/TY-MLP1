
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      price: 0,
      badge: "Standard"
    },
    {
      name: "4.0L V6",
      price: 5000,
      badge: "Performance"
    },
    {
      name: "2.5L Hybrid",
      price: 3000,
      badge: "Eco"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Model Year Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold text-foreground">Model Year</h3>
        <div className="grid grid-cols-2 gap-2">
          {modelYears.map((year) => (
            <motion.button
              key={year}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
              className={`p-3 rounded-lg border transition-all ${
                config.modelYear === year
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="text-xl font-bold">{year}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Engine Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        <h3 className="text-lg font-bold text-foreground">Engine</h3>
        <div className="space-y-2">
          {engines.map((engine) => (
            <motion.button
              key={engine.name}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
              className={`w-full transition-all ${
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
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold">{engine.name}</h4>
                      <Badge 
                        variant={engine.badge === "Eco" ? "default" : "secondary"}
                        className={engine.badge === "Eco" ? "bg-green-500 text-white text-xs" : "text-xs"}
                      >
                        {engine.badge}
                      </Badge>
                    </div>
                    {engine.price > 0 && (
                      <div className="text-sm font-bold text-primary">
                        +AED {engine.price.toLocaleString()}
                      </div>
                    )}
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
