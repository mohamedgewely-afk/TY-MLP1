
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/ui/animated-counter';
import { VehicleModel } from '@/types/vehicle';

interface HeroPricingProps {
  vehicle: VehicleModel;
  monthlyEMI: number;
}

export const HeroPricing: React.FC<HeroPricingProps> = ({ vehicle, monthlyEMI }) => {
  const isHybrid = vehicle.name.toLowerCase().includes('hybrid');
  const isElectric = vehicle.name.toLowerCase().includes('bz4x') || vehicle.category === 'Electric';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="bg-black/60 backdrop-blur-md rounded-lg p-4 mb-4 border border-white/20 max-w-sm mx-auto"
      role="region"
      aria-label="Vehicle pricing information"
    >
      {/* Main Pricing - Horizontal Layout */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-center flex-1">
          <div className="text-xs text-white/60 uppercase font-medium">Starting From</div>
          <div className="text-xl font-black text-white" role="text" aria-label={`Starting price ${vehicle.price} AED`}>
            AED <AnimatedCounter value={vehicle.price} duration={2.5} />
          </div>
          <div className="text-xs text-white/80">*Price includes VAT</div>
        </div>
        
        <div className="w-px h-12 bg-white/20 mx-3" aria-hidden="true"></div>
        
        <div className="text-center flex-1">
          <div className="text-xs text-white/60 uppercase font-medium">Monthly EMI</div>
          <div className="text-xl font-black text-white" role="text" aria-label={`Monthly EMI ${monthlyEMI} AED per month`}>
            AED <AnimatedCounter value={monthlyEMI} duration={2} />
            <span className="text-sm font-normal text-white/80">/mo</span>
          </div>
          <div className="text-xs text-white/80">*80% financing</div>
        </div>
      </div>

      {/* Performance Stats - Horizontal */}
      <div className="flex justify-between items-center pt-3 border-t border-white/20">
        <div className="text-center">
          <div className="text-lg font-black text-white" role="text">
            <AnimatedCounter 
              value={isHybrid ? 25.2 : isElectric ? 450 : 22.2} 
              decimals={1}
              duration={2}
            />
            <span className="text-sm font-normal text-white/80 ml-1">
              {isElectric ? "km" : "km/L"}
            </span>
          </div>
          <div className="text-xs text-white/70">
            {isElectric ? "Range" : "Fuel Efficiency"}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-black text-white" role="text">
            <AnimatedCounter 
              value={isHybrid ? 218 : isElectric ? 201 : 203}
              duration={2}
            />
            <span className="text-sm font-normal text-white/80 ml-1">HP</span>
          </div>
          <div className="text-xs text-white/70">Total Power</div>
        </div>
      </div>
    </motion.div>
  );
};
