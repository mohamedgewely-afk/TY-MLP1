import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Info, Zap, Shield, Settings, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Media {
  imageUrl?: string;
  videoUrl?: string;
  poster?: string;
  caption?: string;
}

interface Feature {
  id: string;
  title: string;
  description?: string;
  media: Media;
  stats?: Array<{ label: string; value: string }>;
  badge?: string;
}

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface FeatureModal4Props {
  isOpen: boolean;
  onClose: () => void;
  feature?: Feature;
}

// Hotspot Explorer Modal - Interactive image exploration
const FeatureModal4: React.FC<FeatureModal4Props> = ({
  isOpen,
  onClose,
  feature
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

  // Default feature if none provided
  const defaultFeature: Feature = {
    id: 'luxury',
    title: 'Premium Comfort',
    description: 'Meticulously crafted interior with attention to every detail for the ultimate driving experience.',
    media: {
      imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true',
      caption: 'Crafted for excellence'
    },
    stats: [
      { label: 'Materials', value: 'Premium' },
      { label: 'Climate Zones', value: '4' },
      { label: 'Massage Points', value: '10' }
    ],
    badge: 'Luxury'
  };

  const currentFeature = feature || defaultFeature;

  // Interactive hotspots for the interior image
  const hotspots: Hotspot[] = [
    {
      id: 'dashboard',
      x: 60,
      y: 45,
      title: 'Digital Dashboard',
      description: '12.3-inch high-resolution display with customizable layouts and real-time vehicle information.',
      icon: Navigation,
      color: 'bg-blue-600'
    },
    {
      id: 'seats',
      x: 35,
      y: 65,
      title: 'Premium Seating',
      description: 'Hand-stitched leather seats with heating, ventilation, and 10-point massage functionality.',
      icon: Settings,
      color: 'bg-amber-600'
    },
    {
      id: 'climate',
      x: 75,
      y: 30,
      title: 'Climate Control',
      description: '4-zone automatic climate control with air purification and individual temperature settings.',
      icon: Zap,
      color: 'bg-green-600'
    },
    {
      id: 'safety',
      x: 50,
      y: 25,
      title: 'Safety Systems',
      description: 'Advanced airbag system with 10 airbags strategically positioned for maximum protection.',
      icon: Shield,
      color: 'bg-red-600'
    }
  ];

  const activeHotspotData = hotspots.find(h => h.id === activeHotspot);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-white border-none">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 h-full"
        >
          {/* Image Side */}
          <div className="lg:col-span-2 relative bg-black">
            <img
              src={currentFeature.media.imageUrl}
              alt={currentFeature.media.caption || currentFeature.title}
              className="w-full h-full object-cover"
            />

            {/* Hotspots */}
            {hotspots.map((hotspot) => {
              const Icon = hotspot.icon;
              const isActive = activeHotspot === hotspot.id;
              const isHovered = hoveredHotspot === hotspot.id;
              
              return (
                <motion.button
                  key={hotspot.id}
                  className={`
                    absolute w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-300 border-2 border-white/50
                    ${hotspot.color} text-white shadow-lg
                    ${isActive || isHovered ? 'scale-125 shadow-2xl' : 'hover:scale-110'}
                  `}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => setActiveHotspot(isActive ? null : hotspot.id)}
                  onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                  whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
                  whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
                >
                  <Icon className="h-6 w-6" />
                  
                  {/* Pulse animation */}
                  {!prefersReducedMotion && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white/30"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.7, 0, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.button>
              );
            })}

            {/* Hotspot Tooltip */}
            <AnimatePresence>
              {hoveredHotspot && !activeHotspot && (
                <motion.div
                  initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
                  className="absolute bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg pointer-events-none z-10"
                  style={{
                    left: `${hotspots.find(h => h.id === hoveredHotspot)?.x}%`,
                    top: `${(hotspots.find(h => h.id === hoveredHotspot)?.y || 0) - 15}%`,
                    transform: 'translate(-50%, -100%)'
                  }}
                >
                  <p className="text-sm font-medium text-foreground">
                    {hotspots.find(h => h.id === hoveredHotspot)?.title}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info Panel */}
          <div className="bg-white flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-foreground">{currentFeature.title}</h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {currentFeature.description}
              </p>
            </div>

            {/* Hotspot Details */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                {activeHotspotData ? (
                  <motion.div
                    key={activeHotspotData.id}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeHotspotData.color} text-white`}>
                        <activeHotspotData.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{activeHotspotData.title}</h3>
                    </div>
                    
                    <p className="text-muted-foreground leading-relaxed">
                      {activeHotspotData.description}
                    </p>
                    
                    <Button
                      variant="outline"
                      onClick={() => setActiveHotspot(null)}
                      className="w-full"
                    >
                      Close Details
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={prefersReducedMotion ? {} : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                        <Info className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">Explore Interactive Features</h3>
                      <p className="text-sm text-muted-foreground">
                        Click on the highlighted points in the image to learn more about each feature.
                      </p>
                    </div>

                    {/* Hotspot List */}
                    <div className="space-y-3">
                      {hotspots.map((hotspot, index) => {
                        const Icon = hotspot.icon;
                        return (
                          <motion.button
                            key={hotspot.id}
                            initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setActiveHotspot(hotspot.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors text-left"
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${hotspot.color} text-white`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{hotspot.title}</div>
                              <div className="text-sm text-muted-foreground">Click to explore</div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Stats */}
                    {currentFeature.stats && (
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-3">Specifications</h4>
                        <div className="grid grid-cols-1 gap-3">
                          {currentFeature.stats.map((stat, index) => (
                            <div key={index} className="flex justify-between items-center p-2 bg-muted/30 rounded">
                              <span className="text-sm text-muted-foreground">{stat.label}</span>
                              <span className="font-medium text-brand-primary">{stat.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureModal4;