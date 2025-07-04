
import React from "react";
import { motion } from "framer-motion";

interface InteriorColorStepProps {
  config: { interiorColor: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const interiorColors = [
  { 
    name: "Black Leather", 
    code: "#2C2C2C",
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/21c8594c-cf2e-46c8-8246-fdd80bcf4b75/items/4046322b-9927-490d-b88a-3c18e7b590f3/renditions/c1fbcc4b-eac8-4440-af33-866cf99a0c93?binary=true&mformat=true"
  }
];

const InteriorColorStep: React.FC<InteriorColorStepProps> = ({ config, setConfig }) => {
  return (
    <div className="p-6">
      <motion.h2 
        className="text-2xl font-bold text-center mb-8 text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Interior Color
      </motion.h2>
      
      <div className="space-y-4">
        {interiorColors.map((color, index) => (
          <motion.div
            key={color.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 ${
              config.interiorColor === color.name 
                ? 'bg-primary/10 border-primary shadow-lg' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
            onClick={() => setConfig(prev => ({ ...prev, interiorColor: color.name }))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <img src={color.image} alt={color.name} className="w-full h-full object-cover rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent rounded-xl" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-6 h-6 rounded-full border-2 border-white shadow-lg" 
                  style={{ backgroundColor: color.code }} 
                />
                <p className="text-white font-bold text-lg">{color.name}</p>
              </div>
              {config.interiorColor === color.name && (
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

export default InteriorColorStep;
