import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureModal3Props {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureModal3: React.FC<FeatureModal3Props> = ({ isOpen, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleMuteToggle = () => setIsMuted(!isMuted);
  const handleFullscreen = () => setIsFullscreen(!isFullscreen);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="h-full flex items-center justify-center p-4">
          <motion.div
            initial={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={prefersReducedMotion ? {} : { scale: 0.9, opacity: 0 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`relative bg-black rounded-2xl overflow-hidden ${
              isFullscreen ? 'w-full h-full' : 'max-w-4xl w-full max-h-[90vh]'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Technology Showcase</h2>
                  <p className="text-white/70">Interactive video experience</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/10">
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Video Content */}
            <div className="relative aspect-video bg-black">
              <img
                src="https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true"
                alt="Technology Features"
                className="w-full h-full object-cover"
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-16 w-16 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 rounded-full"
                    onClick={handlePlayPause}
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
                  </Button>
                </div>
                
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
                    onClick={handleMuteToggle}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
                    onClick={handleFullscreen}
                  >
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Tech Features */}
            {!isFullscreen && (
              <div className="p-6 bg-gradient-to-t from-black to-gray-900 text-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#CC0000] mb-1">12.3"</div>
                    <div className="text-sm text-white/70">Digital Display</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#CC0000] mb-1">5G</div>
                    <div className="text-sm text-white/70">Connectivity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#CC0000] mb-1">25+</div>
                    <div className="text-sm text-white/70">AI Features</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeatureModal3;