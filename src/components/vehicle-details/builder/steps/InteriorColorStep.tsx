
import React from "react";
import { motion } from "framer-motion";

interface InteriorColorStepProps {
  config: { interiorColor: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const interiorColors = [
  { name: "Black Leather", price: 1500 },
  { name: "Beige Leather", price: 1800 },
  { name: "Brown Leather", price: 2000 }
];

const InteriorColorStep: React.FC<InteriorColorStepProps> = ({ config, setConfig }) => {
  return (
    <div className="p-6 pb-32">
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Choose Interior Color
      </motion.h2>
      
      <div className="space-y-4">
        {interiorColors.map((color, index) => (
          <motion.div
            key={color.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
              config.interiorColor === color.name 
                ? 'bg-primary/10 border-primary shadow-lg' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-foreground">{color.name}</h3>
                <p className="text-muted-foreground text-sm">Premium interior finish</p>
              </div>
              <p className="text-primary font-bold">+AED {color.price.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InteriorColorStep;
