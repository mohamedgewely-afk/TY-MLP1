
import React from "react";
import { motion } from "framer-motion";

interface AccessoriesStepProps {
  config: { accessories: string[] };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const accessories = [
  { name: "Premium Sound System", price: 1200 },
  { name: "Sunroof", price: 800 },
  { name: "Navigation System", price: 600 },
  { name: "Heated Seats", price: 400 },
  { name: "Backup Camera", price: 300 },
  { name: "Alloy Wheels", price: 900 }
];

const AccessoriesStep: React.FC<AccessoriesStepProps> = ({ config, setConfig }) => {
  return (
    <div className="p-6">
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Accessories
      </motion.h2>
      
      <div className="space-y-3">
        {accessories.map((accessory, index) => {
          const isSelected = config.accessories.includes(accessory.name);
          return (
            <motion.div
              key={accessory.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className={`p-4 rounded-xl cursor-pointer flex items-center justify-between transition-all duration-200 border-2 ${
                isSelected 
                  ? 'bg-primary/10 border-primary shadow-lg' 
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              onClick={() => setConfig(prev => ({
                ...prev,
                accessories: isSelected
                  ? prev.accessories.filter(a => a !== accessory.name)
                  : [...prev.accessories, accessory.name]
              }))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div>
                <h3 className="text-foreground font-bold">{accessory.name}</h3>
                <p className="text-primary text-sm">AED {accessory.price}</p>
              </div>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                >
                  <span className="text-primary-foreground text-sm">✓</span>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AccessoriesStep;
