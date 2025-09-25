import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, RotateCw, Move3D, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface FeatureModal6Props {
  isOpen: boolean;
  onClose: () => void;
  modalType?: string;
}

const FeatureModal6: React.FC<FeatureModal6Props> = ({ isOpen, onClose, modalType = 'reserve' }) => {
  const [rotation, setRotation] = useState([0]);
  const [zoom, setZoom] = useState([1]);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();

  const getModalContent = () => {
    switch (modalType) {
      case 'reserve':
        return {
          title: 'Reserve Your Vehicle',
          description: 'Secure your vehicle with a refundable deposit',
          image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true'
        };
      case 'testdrive':
        return {
          title: 'Book Test Drive',
          description: 'Experience the vehicle firsthand',
          image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true'
        };
      case 'service':
        return {
          title: 'Service Booking',
          description: 'Schedule your vehicle maintenance',
          image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true'
        };
      case 'tradein':
        return {
          title: 'Trade-In Evaluation',
          description: 'Get an instant estimate for your current vehicle',
          image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true'
        };
      case 'share':
        return {
          title: 'Share Vehicle',
          description: 'Share this vehicle with friends and family',
          image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true'
        };
      default:
        return {
          title: '360° Vehicle Viewer',
          description: 'Explore every angle of your vehicle',
          image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true'
        };
    }
  };

  const content = getModalContent();

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
            className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">{content.title}</h2>
                <p className="text-muted-foreground">{content.description}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* 360° Viewer */}
            <div className="p-6">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <motion.img
                  src={content.image}
                  alt="360° View"
                  className="w-full h-auto cursor-move"
                  style={{
                    transform: `scale(${zoom[0]}) rotate(${rotation[0]}deg) translate(${position.x}px, ${position.y}px)`,
                    transition: prefersReducedMotion ? 'none' : 'transform 0.3s ease'
                  }}
                  drag
                  onDrag={(_, info) => {
                    setPosition({ x: info.offset.x, y: info.offset.y });
                  }}
                />
              </div>

              {/* Controls */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-16">Rotation:</span>
                  <Slider
                    value={rotation}
                    onValueChange={setRotation}
                    max={360}
                    min={0}
                    step={15}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRotation([0])}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-16">Zoom:</span>
                  <Slider
                    value={zoom}
                    onValueChange={setZoom}
                    max={3}
                    min={0.5}
                    step={0.1}
                    className="flex-1"
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom([Math.max(0.5, zoom[0] - 0.25)])}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setZoom([Math.min(3, zoom[0] + 0.25)])}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium w-16">Reset:</span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRotation([0]);
                      setZoom([1]);
                      setPosition({ x: 0, y: 0 });
                    }}
                  >
                    <Move3D className="h-4 w-4 mr-2" />
                    Reset View
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/20">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Drag to move • Use controls to adjust view
                </p>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeatureModal6;