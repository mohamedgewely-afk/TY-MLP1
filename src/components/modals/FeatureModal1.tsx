import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface FeatureModal1Props {
  isOpen: boolean;
  onClose: () => void;
  feature?: Feature;
}

// Image Zoom Modal - Tesla/Porsche minimalist style
const FeatureModal1: React.FC<FeatureModal1Props> = ({
  isOpen,
  onClose,
  feature
}) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Default feature if none provided
  const defaultFeature: Feature = {
    id: 'performance',
    title: 'Unmatched Performance',
    description: 'Experience the perfect balance of power and efficiency with our advanced hybrid technology.',
    media: {
      imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true',
      caption: 'Power meets efficiency'
    },
    stats: [
      { label: 'Power', value: '409 HP' },
      { label: '0-100 km/h', value: '6.7 sec' },
      { label: 'Top Speed', value: '210 km/h' }
    ],
    badge: 'Performance'
  };

  const currentFeature = feature || defaultFeature;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset zoom and position when closing
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 4));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 1));
    if (zoom <= 1.5) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleReset = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 bg-black border-none">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          className="relative h-full"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-light text-white">{currentFeature.title}</h2>
                {currentFeature.badge && (
                  <span className="px-3 py-1 bg-brand-primary text-white text-sm rounded-full">
                    {currentFeature.badge}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomOut}
                  disabled={zoom <= 1}
                  className="text-white hover:bg-white/10"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleZoomIn}
                  disabled={zoom >= 4}
                  className="text-white hover:bg-white/10"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-white hover:bg-white/10"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Image Container */}
          <div 
            className="relative w-full h-full bg-black overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <motion.img
              ref={imageRef}
              src={currentFeature.media.imageUrl}
              alt={currentFeature.media.caption || currentFeature.title}
              className="w-full h-full object-contain select-none"
              style={{
                transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                transition: isDragging ? 'none' : 'transform 0.2s ease-out'
              }}
              drag={zoom > 1}
              dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
            />
          </div>

          {/* Info Panel */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-0 right-0 m-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-sm"
          >
            {currentFeature.description && (
              <p className="text-white/90 text-sm mb-4 leading-relaxed">
                {currentFeature.description}
              </p>
            )}
            
            {currentFeature.stats && (
              <div className="grid grid-cols-3 gap-3">
                {currentFeature.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/60 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Zoom Indicator */}
          {zoom > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
              {Math.round(zoom * 100)}%
            </div>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureModal1;