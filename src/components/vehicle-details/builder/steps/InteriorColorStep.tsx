
import React from "react";
import { motion } from "framer-motion";

interface InteriorColorStepProps {
  config: { interiorColor: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const interiorColors = [
  { name: "Black Leather", price: 1500, swatch: "#1a1a1a" },
  { name: "Beige Leather", price: 1800, swatch: "#d4c5a9" },
  { name: "Brown Leather", price: 2000, swatch: "#8b4513" }
];

const InteriorColorStep: React.FC<InteriorColorStepProps> = ({ config, setConfig }) => {
  return (
    <div className="p-4 sm:p-6 pb-20 sm:pb-32">
      <motion.h2 
        className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Choose Interior Color
      </motion.h2>
      
      <div className="space-y-3 sm:space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0 lg:max-w-4xl lg:mx-auto">
        {interiorColors.map((color, index) => (
          <motion.div
            key={color.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`p-3 sm:p-4 lg:p-5 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
              config.interiorColor === color.name 
                ? 'bg-primary/10 border-primary shadow-lg' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-5">
                <div 
                  className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg border-2 border-border shadow-inner"
                  style={{ backgroundColor: color.swatch }}
                />
                <div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-foreground">{color.name}</h3>
                  <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Premium interior finish</p>
                </div>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-primary font-bold">+AED {color.price.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InteriorColorStep;
