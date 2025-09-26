import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, RotateCw, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';

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

interface FeatureModal6Props {
  isOpen: boolean;
  onClose: () => void;
  feature?: Feature;
}

// 360° Viewer Modal - Interactive 360-degree experience
const FeatureModal6: React.FC<FeatureModal6Props> = ({
  isOpen,
  onClose,
  feature
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState([2]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Default feature if none provided
  const defaultFeature: Feature = {
    id: 'capability',
    title: 'Off-Road Capability',
    description: 'Unmatched capability and reliability for those who demand the very best in off-road excellence.',
    media: {
      imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true',
      caption: 'Built for any terrain'
    },
    stats: [
      { label: 'Ground Clearance', value: '230mm' },
      { label: 'Approach Angle', value: '32°' },
      { label: 'Departure Angle', value: '24°' }
    ],
    badge: 'Capability'
  };

  const currentFeature = feature || defaultFeature;

  // Generate 360° frames (simulated with different angles of the same image)
  const frames = Array.from({ length: 36 }, (_, i) => ({
    src: currentFeature.media.imageUrl || 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f9670484-f03f-46ba-aac8-424889e779a0/renditions/ad34680c-160b-43a6-9785-541adba34a45?binary=true&mformat=true',
    angle: i * 10
  }));

  const totalFrames = frames.length;

  // Auto rotation
  React.useEffect(() => {
    if (!isAutoRotating || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % totalFrames);
    }, 100 / rotationSpeed[0]);

    return () => clearInterval(interval);
  }, [isAutoRotating, rotationSpeed, totalFrames, prefersReducedMotion]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
    setIsAutoRotating(false);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart;
    const sensitivity = 3;
    const frameChange = Math.floor(Math.abs(deltaX) / sensitivity);

    if (frameChange > 0) {
      const direction = deltaX > 0 ? 1 : -1;
      setCurrentFrame(prev => {
        const newFrame = prev + (direction * frameChange);
        return ((newFrame % totalFrames) + totalFrames) % totalFrames;
      });
      setDragStart(e.clientX);
    }
  }, [isDragging, dragStart, totalFrames]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFrameChange = (value: number[]) => {
    setCurrentFrame(Math.floor((value[0] / 100) * (totalFrames - 1)));
    setIsAutoRotating(false);
  };

  const resetView = () => {
    setCurrentFrame(0);
    setIsAutoRotating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 bg-black border-none">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          className="relative h-full bg-black"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-black/80 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-light text-white">{currentFeature.title}</h2>
                {currentFeature.badge && (
                  <Badge className="bg-brand-primary text-white">
                    {currentFeature.badge}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAutoRotating(!isAutoRotating)}
                  className={`text-white hover:bg-white/20 ${isAutoRotating ? 'bg-white/20' : ''}`}
                >
                  {isAutoRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetView}
                  className="text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* 360° Viewer */}
          <div 
            ref={containerRef}
            className="relative h-full bg-black cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.img
                key={currentFrame}
                src={frames[currentFrame].src}
                alt={`${currentFeature.title} - ${frames[currentFrame].angle}°`}
                className="max-w-full max-h-full object-contain"
                initial={prefersReducedMotion ? {} : { opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                draggable={false}
              />
            </div>

            {/* Rotation Indicator */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
              <motion.div
                className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
                animate={isAutoRotating && !prefersReducedMotion ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <RotateCw className="h-5 w-5 text-white" />
              </motion.div>
            </div>

            {/* Angle Indicator */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white text-sm font-medium">
                {frames[currentFrame].angle}°
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-white/10 p-4">
            <div className="space-y-4">
              {/* Frame Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-white/80">
                  <span>Frame Position</span>
                  <span>{currentFrame + 1} / {totalFrames}</span>
                </div>
                <Slider
                  value={[(currentFrame / (totalFrames - 1)) * 100]}
                  onValueChange={handleFrameChange}
                  max={100}
                  step={100 / (totalFrames - 1)}
                  className="w-full"
                />
              </div>

              {/* Speed Control */}
              {!prefersReducedMotion && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/80">
                    <span>Auto Rotation Speed</span>
                    <span>{rotationSpeed[0]}x</span>
                  </div>
                  <Slider
                    value={rotationSpeed}
                    onValueChange={setRotationSpeed}
                    min={0.5}
                    max={5}
                    step={0.5}
                    className="w-full"
                  />
                </div>
              )}

              {/* Instructions */}
              <div className="text-center">
                <p className="text-xs text-white/60">
                  Drag to rotate • Use slider for precise control • Click play for auto rotation
                </p>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-20 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 max-w-xs"
          >
            {currentFeature.description && (
              <p className="text-white/90 text-sm mb-4 leading-relaxed">
                {currentFeature.description}
              </p>
            )}
            
            {currentFeature.stats && (
              <div className="space-y-2">
                {currentFeature.stats.map((stat, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-xs text-white/70">{stat.label}</span>
                    <span className="text-sm font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureModal6;