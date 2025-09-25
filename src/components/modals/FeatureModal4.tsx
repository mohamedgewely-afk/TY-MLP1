import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, MapPin, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  title: string;
  description: string;
}

interface FeatureModal4Props {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureModal4: React.FC<FeatureModal4Props> = ({ isOpen, onClose }) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const hotspots: Hotspot[] = [
    {
      id: 'seats',
      x: 30,
      y: 60,
      title: 'Premium Leather Seats',
      description: 'Hand-selected leather with precision stitching and ergonomic design for maximum comfort.'
    },
    {
      id: 'dashboard',
      x: 60,
      y: 40,
      title: 'Digital Dashboard',
      description: 'Customizable 12.3" digital instrument cluster with multiple display modes.'
    },
    {
      id: 'ambient',
      x: 80,
      y: 70,
      title: 'Ambient Lighting',
      description: '64-color ambient lighting system that adapts to driving conditions and personal preferences.'
    },
    {
      id: 'audio',
      x: 50,
      y: 80,
      title: 'Premium Audio',
      description: 'JBL premium sound system with 14 speakers and spatial audio technology.'
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="h-full flex items-center justify-center p-4">
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Interior Explorer</h2>
                <p className="text-muted-foreground">Click hotspots to explore features</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Interactive Image */}
            <div className="relative">
              <img
                src="https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true"
                alt="Interior Features"
                className="w-full h-auto"
              />
              
              {/* Hotspots */}
              {hotspots.map((hotspot) => (
                <motion.button
                  key={hotspot.id}
                  className="absolute w-8 h-8 bg-[#EB0A1E] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, transform: 'translate(-50%, -50%)' }}
                  onClick={() => setActiveHotspot(activeHotspot === hotspot.id ? null : hotspot.id)}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                >
                  <MapPin className="h-4 w-4" />
                </motion.button>
              ))}

              {/* Hotspot Details */}
              <AnimatePresence>
                {activeHotspot && (
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                    transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.2 }}
                    className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-xl"
                  >
                    {(() => {
                      const hotspot = hotspots.find(h => h.id === activeHotspot);
                      if (!hotspot) return null;
                      
                      return (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{hotspot.title}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveHotspot(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">{hotspot.description}</p>
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeatureModal4;