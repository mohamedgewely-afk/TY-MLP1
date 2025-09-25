
import React from "react";
import { motion } from "framer-motion";

interface EngineStepProps {
  config: { engine: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const engines = [
  { name: "3.5L", power: "268 HP", torque: "336 Nm", price: 0 },
  { name: "4.0L", power: "301 HP", torque: "365 Nm", price: 5000 }
];

const EngineStep: React.FC<EngineStepProps> = ({ config, setConfig }) => {
  return (
    <div className="p-6">
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Choose Your Engine
      </motion.h2>
      
      <div className="space-y-4">
        {engines.map((engine, index) => (
          <motion.div
            key={engine.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`p-6 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
              config.engine === engine.name 
                ? 'bg-primary/10 border-primary shadow-lg' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => setConfig(prev => ({ ...prev, engine: engine.name }))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{engine.name}</h3>
                <p className="text-primary text-sm font-medium mb-1">{engine.power} • {engine.torque}</p>
                <p className="text-muted-foreground text-xs">Premium Performance</p>
              </div>
              {engine.price > 0 && (
                <div className="text-right">
                  <p className="text-primary font-bold">+AED {engine.price.toLocaleString()}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EngineStep;
