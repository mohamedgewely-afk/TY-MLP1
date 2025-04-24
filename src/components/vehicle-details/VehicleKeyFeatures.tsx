
import React from 'react';
import { motion } from 'framer-motion';
import { Fuel, ShieldCheck, Zap } from 'lucide-react';
import { VehicleModel } from '@/types/vehicle';

interface VehicleKeyFeaturesProps {
  vehicle: VehicleModel;
}

const VehicleKeyFeatures = ({ vehicle }: VehicleKeyFeaturesProps) => {
  // Extract useful data from the vehicle object
  const mpg = vehicle.specifications?.mpg || '32';
  const horsepower = vehicle.specifications?.horsepower || '203';
  
  // These would come from vehicle data in a real implementation
  const keyFeatures = [
    {
      icon: <Fuel className="h-6 w-6" />,
      value: `${mpg}`,
      label: 'MPG Combined',
    },
    {
      icon: <Zap className="h-6 w-6" />,
      value: `${horsepower}HP`,
      label: 'Horsepower',
    },
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      value: '5-Star',
      label: 'Safety Rating',
    },
  ];

  return (
    <section className="bg-white dark:bg-gray-800 py-8 shadow-md relative z-10">
      <div className="toyota-container">
        <div className="flex flex-wrap justify-around">
          {keyFeatures.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center px-4 py-2"
            >
              <div className="mb-2 text-toyota-red">
                {feature.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {feature.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {feature.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleKeyFeatures;
