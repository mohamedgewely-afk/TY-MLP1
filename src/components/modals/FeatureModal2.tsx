import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FeatureModal2Props {
  isOpen: boolean;
  onClose: () => void;
}

const FeatureModal2: React.FC<FeatureModal2Props> = ({ isOpen, onClose }) => {
  const prefersReducedMotion = useReducedMotion();

  const safetyFeatures = [
    {
      id: 'pcs',
      title: 'Pre-Collision System',
      description: 'Helps detect vehicles and pedestrians ahead and can automatically apply brakes if a collision is imminent.',
      specs: ['Detection Range: 120m', 'Response Time: 0.2s', 'Accuracy: 99.7%'],
      image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true'
    },
    {
      id: 'lda',
      title: 'Lane Departure Alert',
      description: 'Monitors lane markings and alerts you if the vehicle begins to drift out of its lane without signaling.',
      specs: ['Camera-based detection', 'Steering wheel vibration', 'Visual alerts'],
      image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/cbbefa79-6002-4f61-94e0-ee097a8dc6c6/items/a7ed1d12-7c0e-4377-84f1-bf4d0230ded6/renditions/4b8651e3-1a7c-4e08-aab5-aa103f6a5b4b?binary=true&mformat=true'
    },
    {
      id: 'drcc',
      title: 'Dynamic Radar Cruise Control',
      description: 'Maintains a preset following distance from the vehicle ahead, automatically adjusting speed as needed.',
      specs: ['Full-speed range', 'Stop & go capability', 'Radar-based'],
      image: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/9200d151-0947-45d4-b2de-99d247bee98a/renditions/d5c695c7-b387-4005-bf45-55b8786bafd7?binary=true&mformat=true'
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
            className="relative bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold">Safety Features</h2>
                <p className="text-muted-foreground">Toyota Safety Sense 2.0</p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-auto max-h-[70vh]">
              <div className="mb-6">
                <Badge className="bg-[#EB0A1E] text-white mb-4">
                  Standard on all grades
                </Badge>
                <p className="text-muted-foreground">
                  Toyota Safety Sense 2.0 is a comprehensive suite of active safety features designed to help protect you and your passengers.
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                {safetyFeatures.map((feature, index) => (
                  <AccordionItem key={feature.id} value={feature.id}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                          <img 
                            src={feature.image} 
                            alt={feature.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-20 space-y-2">
                        <h4 className="font-medium">Technical Specifications:</h4>
                        <ul className="space-y-1">
                          {feature.specs.map((spec, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-2 h-2 bg-[#EB0A1E] rounded-full mr-2" />
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/20">
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Features may vary by grade and region
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

export default FeatureModal2;