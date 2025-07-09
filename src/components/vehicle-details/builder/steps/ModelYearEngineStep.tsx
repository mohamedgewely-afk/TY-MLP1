
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Zap, Gauge } from "lucide-react";

interface ModelYearEngineStepProps {
  config: { modelYear: string; engine: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const modelYears = ["2024", "2025"];
const engines = [
  { name: "3.5L", power: "268 HP", torque: "336 Nm", price: 0, type: "Gasoline" },
  { name: "4.0L", power: "301 HP", torque: "365 Nm", price: 5000, type: "Gasoline" },
  { name: "Hybrid 2.5L", power: "218 HP Combined", torque: "280 Nm", price: 8000, type: "Hybrid" }
];

const ModelYearEngineStep: React.FC<ModelYearEngineStepProps> = ({ config, setConfig }) => {
  return (
    <div className="space-y-8">
      {/* Model Year Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
          Choose Model Year
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {modelYears.map((year, index) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                config.modelYear === year 
                  ? 'bg-primary/10 border-primary shadow-lg' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">{year}</h3>
                <p className="text-primary text-sm font-medium">
                  {year === "2025" ? "Latest Technology" : "Proven Reliability"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Engine Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
          Select Your Engine
        </h2>
        
        <div className="space-y-4">
          {engines.map((engine, index) => (
            <motion.div
              key={engine.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                config.engine === engine.name 
                  ? 'bg-primary/10 border-primary shadow-lg' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-foreground">{engine.name}</h3>
                    {engine.type === "Hybrid" && (
                      <Badge className="bg-green-500 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        ECO
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <Gauge className="h-4 w-4 text-primary mr-1" />
                      <span className="text-primary font-medium">{engine.power}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Torque: </span>
                      <span className="font-medium">{engine.torque}</span>
                    </div>
                  </div>
                </div>
                {engine.price > 0 && (
                  <div className="text-right ml-4">
                    <p className="text-primary font-bold">+د.إ {engine.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Additional</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ModelYearEngineStep;
