
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';

interface VehicleDetailsHeroProps {
  vehicle: VehicleModel;
}

const VehicleDetailsHero = ({ vehicle }: VehicleDetailsHeroProps) => {
  // Extract the tagline or use a default if not available
  const tagline = vehicle.tagline || vehicle.category || '';

  return (
    <div className="relative h-[70vh] overflow-hidden">
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0"
      >
        {/* Hero background image */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img
          src={vehicle.heroImage || vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Content */}
      <div className="toyota-container relative z-20 h-full flex flex-col justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
        >
          {vehicle.isNew && (
            <Badge className="bg-toyota-red hover:bg-toyota-darkred mb-3">New Model</Badge>
          )}
          
          {vehicle.isHybrid && (
            <Badge className="bg-green-600 hover:bg-green-700 mb-3 ml-2">Hybrid</Badge>
          )}
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-shadow-lg">
            {vehicle.name}
          </h1>
          
          <p className="text-xl md:text-2xl mb-2 font-light">
            {tagline}
          </p>
          
          <p className="text-3xl font-bold mb-8">
            Starting at AED {vehicle.price.toLocaleString()}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleDetailsHero;
