
import React from "react";
import { motion } from "framer-motion";

interface ModelYearStepProps {
  config: { modelYear: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const modelYears = ["2024", "2025"];

const ModelYearStep: React.FC<ModelYearStepProps> = ({ config, setConfig }) => {
  return (
    <div className="p-6">
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Choose Model Year
      </motion.h2>
      
      <div className="space-y-4">
        {modelYears.map((year, index) => (
          <motion.div
            key={year}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`p-6 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
              config.modelYear === year 
                ? 'bg-primary/10 border-primary shadow-lg' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => setConfig(prev => ({ ...prev, modelYear: year }))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-foreground mb-2">{year}</h3>
              <p className="text-primary text-sm font-medium">
                {year === "2025" ? "Latest Technology" : "Proven Reliability"}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ModelYearStep;
