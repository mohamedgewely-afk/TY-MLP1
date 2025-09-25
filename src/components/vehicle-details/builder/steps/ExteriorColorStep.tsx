
import React from "react";
import { motion } from "framer-motion";
import { useDeviceInfo } from "@/hooks/use-device-info";

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
  const { deviceCategory } = useDeviceInfo();

  const getGridLayout = () => {
    switch (deviceCategory) {
      case 'largeDesktop': return 'lg:grid-cols-4 lg:gap-6';
      case 'laptop': return 'lg:grid-cols-3 lg:gap-5';
      default: return 'lg:grid-cols-2 lg:gap-4';
    }
  };

  const getImageSize = () => {
    switch (deviceCategory) {
      case 'largeDesktop': return 'lg:w-64 lg:h-40 xl:w-72 xl:h-44';
      case 'laptop': return 'lg:w-56 lg:h-36 xl:w-60 xl:h-38';
      default: return 'lg:w-48 lg:h-32 xl:w-56 xl:h-36';
    }
  };

  const getPadding = () => {
    switch (deviceCategory) {
      case 'largeDesktop': return 'lg:p-6';
      case 'laptop': return 'lg:p-5';
      default: return 'lg:p-5';
    }
  };

  const getContainerWidth = () => {
    switch (deviceCategory) {
      case 'largeDesktop': return 'lg:max-w-6xl';
      case 'laptop': return 'lg:max-w-5xl';
      default: return 'lg:max-w-4xl';
    }
  };

  const getHeaderSize = () => {
    switch (deviceCategory) {
      case 'largeDesktop': return 'lg:text-4xl';
      case 'laptop': return 'lg:text-3xl';
      default: return 'lg:text-3xl';
    }
  };

  return (
    <div className="p-4 sm:p-6 pb-20 sm:pb-32">
      <motion.h2 
        className={`text-xl sm:text-2xl ${getHeaderSize()} font-bold text-center mb-6 sm:mb-8 text-foreground`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Choose Exterior Color
      </motion.h2>
      
      <div className={`space-y-3 sm:space-y-4 ${getGridLayout()} lg:space-y-0 ${getContainerWidth()} lg:mx-auto`}>
        {exteriorColors.map((color, index) => (
          <motion.div
            key={color.name}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            className={`p-3 sm:p-4 ${getPadding()} rounded-xl cursor-pointer transition-all duration-200 border-2 ${
              config.exteriorColor === color.name 
                ? 'bg-primary/10 border-primary shadow-lg' 
                : 'bg-card border-border hover:border-primary/50'
            } w-full sm:w-[480px] lg:w-full mx-auto`}
            onClick={() => setConfig(prev => ({ ...prev, exteriorColor: color.name }))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-5">
              <motion.img 
                src={color.image} 
                alt={color.name} 
                className={`w-20 h-12 sm:w-32 sm:h-20 ${getImageSize()} object-cover rounded-lg transition-transform duration-200`}
                whileHover={{ scale: 1.05 }}
              />
              <div className="flex-1">
                <h3 className={`text-base sm:text-lg ${deviceCategory === 'largeDesktop' ? 'lg:text-2xl' : deviceCategory === 'laptop' ? 'lg:text-xl' : 'lg:text-xl'} font-bold text-foreground`}>{color.name}</h3>
                {color.price > 0 && (
                  <p className={`text-sm sm:text-base ${deviceCategory === 'largeDesktop' ? 'lg:text-lg' : 'lg:text-lg'} text-primary font-medium`}>+AED {color.price}</p>
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
