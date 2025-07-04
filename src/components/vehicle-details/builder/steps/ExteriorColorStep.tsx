
import React from "react";
import { motion } from "framer-motion";

interface ExteriorColorStepProps {
  config: { exteriorColor: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const exteriorColors = [
  { 
    name: "Pearl White", 
    code: "#F8F8FF", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true" 
  },
  { 
    name: "Midnight Black", 
    code: "#000000", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true" 
  },
  { 
    name: "Silver Metallic", 
    code: "#C0C0C0", 
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true" 
  }
];

const ExteriorColorStep: React.FC<ExteriorColorStepProps> = ({ config, setConfig }) => {
  return (
    <div className="p-6">
      <motion.h2 
        className="text-2xl font-bold text-center mb-6 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Exterior Color
      </motion.h2>
      
      <div className="grid grid-cols-1 gap-4">
        {exteriorColors.map((color, index) => (
          <motion.div
            key={color.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 ${
              config.exteriorColor === color.name ? 'border-primary shadow-lg' : 'border-border'
            }`}
            onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src={color.image} alt={color.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-lg" 
                  style={{ backgroundColor: color.code }} 
                />
                <p className="text-white font-bold text-lg">{color.name}</p>
              </div>
              {config.exteriorColor === color.name && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"
                >
                  <span className="text-primary-foreground text-sm">✓</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ExteriorColorStep;
