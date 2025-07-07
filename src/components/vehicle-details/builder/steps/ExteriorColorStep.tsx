
import React from "react";
import { motion } from "framer-motion";

interface ExteriorColorStepProps {
  config: { exteriorColor: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const exteriorColors = [
  { name: "Pearl White", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true", price: 0 },
  { name: "Midnight Black", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true", price: 500 },
  { name: "Silver Metallic", image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true", price: 300 }
];

const ExteriorColorStep: React.FC<ExteriorColorStepProps> = ({ config, setConfig }) => {
  return (
    <div className="p-6 pb-32">
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Choose Exterior Color
      </motion.h2>
      
      <div className="space-y-4">
        {exteriorColors.map((color, index) => (
          <motion.div
            key={color.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
              config.exteriorColor === color.name 
                ? 'bg-primary/10 border-primary shadow-lg' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-4">
              <img src={color.image} alt={color.name} className="w-20 h-12 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground">{color.name}</h3>
                {color.price > 0 && (
                  <p className="text-primary font-medium">+AED {color.price}</p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExteriorColorStep;
