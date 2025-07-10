
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
    { id: "3.5L V6", name: "3.5L V6", price: 0 },
    { id: "4.0L V6", name: "4.0L V6", price: 5000 },
    { id: "2.5L Hybrid", name: "2.5L Hybrid", price: 3000 }
  ];

  return (
    <div className="space-y-6">
      {/* Model Year Selection */}
      <div>
        <h3 className="text-lg font-bold mb-3">Model Year</h3>
        <div className="grid grid-cols-2 gap-3">
          {modelYears.map((year) => (
            <motion.button
              key={year}
              onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                config.modelYear === year
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 hover:border-gray-300"
              )}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{year}</span>
                {config.modelYear === year && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Engine Selection */}
      <div>
        <h3 className="text-lg font-bold mb-3">Engine</h3>
        <div className="space-y-3">
          {engines.map((engine) => (
            <motion.button
              key={engine.id}
              onClick={() => setConfig(prev => ({ ...prev, engine: engine.id }))}
              className={cn(
                "w-full p-3 rounded-lg border-2 transition-all",
                config.engine === engine.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-gray-200 hover:border-gray-300"
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="font-semibold">{engine.name}</div>
                  {engine.price > 0 && (
                    <div className="text-sm text-gray-600">+AED {engine.price.toLocaleString()}</div>
                  )}
                </div>
                {config.engine === engine.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelYearEngineStep;
