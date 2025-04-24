
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Heart, Share2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';

interface VehicleDetailsHeroProps {
  vehicle: VehicleModel;
  isFavorite: boolean;
  toggleFavorite: () => void;
}

const VehicleDetailsHero = ({ vehicle, isFavorite, toggleFavorite }: VehicleDetailsHeroProps) => {
  return (
    <section className="relative bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0 opacity-50">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="toyota-container relative z-10 py-6">
        <Link to="/" className="inline-flex items-center text-sm text-white/80 hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to all vehicles
        </Link>

        <div className="pt-16 pb-20 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            {vehicle.category === 'Hybrid' && (
              <Badge className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                Hybrid Technology
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter">
              {vehicle.name}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
              {vehicle.tagline || `Experience the exceptional blend of style, performance, and innovation.`}
            </p>

            <p className="mt-4 text-2xl font-bold">
              Starting at <span className="text-white">AED {vehicle.price.toLocaleString()}</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex gap-3 flex-wrap justify-center mt-6"
          >
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white hover:text-black transition-all"
              onClick={toggleFavorite}
            >
              <Heart className="h-4 w-4 mr-2" fill={isFavorite ? "currentColor" : "none"} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white hover:text-black transition-all"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white hover:text-black transition-all"
            >
              <Download className="h-4 w-4 mr-2" />
              Brochure
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VehicleDetailsHero;
