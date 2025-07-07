
import React from "react";
import { motion } from "framer-motion";

interface AccessoriesStepProps {
  config: { accessories: string[] };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const accessories = [
  { name: "Premium Sound System", price: 1200, description: "JBL premium audio with 12 speakers" },
  { name: "Sunroof", price: 800, description: "Panoramic glass roof with electric controls" },
  { name: "Navigation System", price: 600, description: "Advanced GPS with real-time traffic" },
  { name: "Heated Seats", price: 400, description: "Front and rear seat heating" },
  { name: "Backup Camera", price: 300, description: "360-degree surround view camera" },
  { name: "Alloy Wheels", price: 900, description: "18-inch premium alloy wheels" }
];

const AccessoriesStep: React.FC<AccessoriesStepProps> = ({ config, setConfig }) => {
  const toggleAccessory = (accessoryName: string) => {
    setConfig(prev => ({
      ...prev,
      accessories: prev.accessories.includes(accessoryName)
        ? prev.accessories.filter(acc => acc !== accessoryName)
        : [...prev.accessories, accessoryName]
    }));
  };

  return (
    <div className="p-6 pb-32">
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Choose Accessories
      </motion.h2>
      
      <div className="space-y-3">
        {accessories.map((accessory, index) => (
          <motion.div
            key={accessory.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
              config.accessories.includes(accessory.name)
                ? 'bg-primary/10 border-primary shadow-lg' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => toggleAccessory(accessory.name)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{accessory.name}</h3>
                <p className="text-muted-foreground text-sm">{accessory.description}</p>
              </div>
              <div className="text-right ml-4">
                <p className="text-primary font-bold">+AED {accessory.price.toLocaleString()}</p>
                {config.accessories.includes(accessory.name) && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mt-1">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AccessoriesStep;
