
import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Engine {
  name: string;
  power: string;
  efficiency: string;
  emissions: string;
}

interface EngineSelectorProps {
  engines: Engine[];
  selectedEngine: string;
  onEngineSelect: (engine: string) => void;
}

const EngineSelector: React.FC<EngineSelectorProps> = ({
  engines,
  selectedEngine,
  onEngineSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8"
    >
      <h3 className="text-lg font-bold mb-6 text-center">Choose Your Engine</h3>
      <div className="grid grid-cols-2 gap-3 lg:gap-6 max-w-4xl mx-auto px-4">
        {engines.map((engine) => (
          <motion.button
            key={engine.name}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onEngineSelect(engine.name)}
            className={`p-3 lg:p-6 rounded-xl border-2 transition-all text-left ${
              selectedEngine === engine.name
                ? 'border-primary bg-primary/5 shadow-lg'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-sm lg:text-lg">{engine.name}</h4>
              {engine.name.includes("Hybrid") && (
                <Badge className="bg-green-500 text-white text-xs">ECO</Badge>
              )}
            </div>
            <div className="text-xs font-semibold">{engine.power}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default EngineSelector;
