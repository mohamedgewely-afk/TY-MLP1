import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeatureModal1Props {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureModal1: React.FC<FeatureModal1Props> = ({ isOpen, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => prev + 90);

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
            className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Performance Details</h2>
                <p className="text-muted-foreground">Interactive image zoom</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleZoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleRotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="relative overflow-hidden rounded-lg bg-black">
                <motion.img
                  src="https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true"
                  alt="Performance Details"
                  className="w-full h-auto cursor-move"
                  style={{
                    transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                    transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease'
                  }}
                  drag
                  dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                />
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Engine Power</h3>
                  <p className="text-2xl font-bold text-[#EB0A1E]">268 HP</p>
                  <p className="text-sm text-muted-foreground">Maximum output</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Torque</h3>
                  <p className="text-2xl font-bold text-[#EB0A1E]">336 Nm</p>
                  <p className="text-sm text-muted-foreground">Peak torque</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Acceleration</h3>
                  <p className="text-2xl font-bold text-[#EB0A1E]">6.8s</p>
                  <p className="text-sm text-muted-foreground">0-100 km/h</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/20">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Zoom: {Math.round(zoomLevel * 100)}% • Rotation: {rotation}°
                </div>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeatureModal1;