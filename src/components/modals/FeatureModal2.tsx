import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, ChevronDown, ChevronRight, Zap, Shield, Gauge, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';

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

interface FeatureModal2Props {
  isOpen: boolean;
  onClose: () => void;
  feature?: Feature;
}

// Spec Drilldown Modal - Technical deep dive
const FeatureModal2: React.FC<FeatureModal2Props> = ({
  isOpen,
  onClose,
  feature
}) => {
  const [activeSpec, setActiveSpec] = useState(0);
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview']);
  const prefersReducedMotion = useReducedMotion();

  // Default feature if none provided
  const defaultFeature: Feature = {
    id: 'safety',
    title: 'Advanced Safety Systems',
    description: 'State-of-the-art safety systems that protect you and your passengers.',
    media: {
      imageUrl: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true',
      caption: 'Safety first'
    },
    stats: [
      { label: 'Safety Rating', value: '5 Stars' },
      { label: 'Airbags', value: '10' },
      { label: 'Safety Features', value: '25+' }
    ],
    badge: 'Safety'
  };

  const currentFeature = feature || defaultFeature;

  const detailedSpecs = [
    {
      id: 'overview',
      title: 'System Overview',
      icon: Shield,
      color: 'text-blue-600',
      content: {
        description: 'Comprehensive safety suite with advanced sensors and AI-powered decision making.',
        specifications: [
          { label: 'Detection Range', value: '150m', progress: 95 },
          { label: 'Response Time', value: '0.2s', progress: 98 },
          { label: 'Accuracy Rate', value: '99.7%', progress: 99 },
          { label: 'Operating Speed', value: '0-180 km/h', progress: 100 }
        ],
        features: [
          'Pre-Collision System with Pedestrian Detection',
          'Lane Departure Alert with Steering Assist',
          'Dynamic Radar Cruise Control',
          'Automatic High Beams',
          'Road Sign Assist'
        ]
      }
    },
    {
      id: 'sensors',
      title: 'Sensor Technology',
      icon: Cpu,
      color: 'text-purple-600',
      content: {
        description: 'Advanced camera and radar systems provide 360-degree awareness.',
        specifications: [
          { label: 'Front Camera', value: 'HD Stereo', progress: 90 },
          { label: 'Radar Units', value: '4 Sensors', progress: 85 },
          { label: 'Processing Power', value: '2.5 TOPS', progress: 95 },
          { label: 'Update Frequency', value: '60 Hz', progress: 88 }
        ],
        features: [
          'Stereo camera with wide field of view',
          'Millimeter-wave radar sensors',
          'Ultrasonic proximity sensors',
          'Real-time image processing',
          'Machine learning algorithms'
        ]
      }
    },
    {
      id: 'performance',
      title: 'Performance Metrics',
      icon: Gauge,
      color: 'text-green-600',
      content: {
        description: 'Real-world performance data from extensive testing and validation.',
        specifications: [
          { label: 'Collision Reduction', value: '85%', progress: 85 },
          { label: 'False Positives', value: '<0.1%', progress: 99 },
          { label: 'Weather Performance', value: '95%', progress: 95 },
          { label: 'Night Vision', value: '90%', progress: 90 }
        ],
        features: [
          'Proven collision avoidance',
          'Minimal false alerts',
          'All-weather operation',
          'Enhanced night detection',
          'Continuous learning'
        ]
      }
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const currentSpec = detailedSpecs[activeSpec];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] p-0 bg-white border-none">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
          transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 h-full"
        >
          {/* Image Side */}
          <div className="relative bg-neutral-50 flex items-center justify-center">
            <img
              ref={imageRef}
              src={currentFeature.media.imageUrl}
              alt={currentFeature.media.caption || currentFeature.title}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                transition: 'transform 0.2s ease-out'
              }}
            />
            
            {/* Image overlay info */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
              <p className="text-sm font-medium text-foreground">{currentFeature.media.caption}</p>
            </div>
          </div>

          {/* Content Side */}
          <div className="flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{currentFeature.title}</h2>
                {currentFeature.badge && (
                  <Badge className="mt-2 bg-brand-primary text-white">
                    {currentFeature.badge}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Spec Navigation */}
            <div className="flex border-b">
              {detailedSpecs.map((spec, index) => {
                const Icon = spec.icon;
                return (
                  <button
                    key={spec.id}
                    onClick={() => setActiveSpec(index)}
                    className={`
                      flex-1 flex items-center justify-center gap-2 p-4 transition-all
                      ${activeSpec === index 
                        ? 'bg-brand-primary text-white' 
                        : 'text-muted-foreground hover:bg-muted/50'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium hidden sm:inline">{spec.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSpec.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                  transition={{ duration: prefersReducedMotion ? 0.1 : 0.3 }}
                  className="space-y-6"
                >
                  {/* Description */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <currentSpec.icon className={`h-5 w-5 ${currentSpec.color}`} />
                      <h3 className="text-lg font-semibold">{currentSpec.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {currentSpec.content.description}
                    </p>
                  </div>

                  {/* Specifications with Progress */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Technical Specifications</h4>
                    <div className="space-y-3">
                      {currentSpec.content.specifications.map((spec, index) => (
                        <motion.div
                          key={spec.label}
                          initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{spec.label}</span>
                            <span className="text-sm text-brand-primary font-bold">{spec.value}</span>
                          </div>
                          <Progress value={spec.progress} className="h-2" />
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Key Features</h4>
                    <div className="space-y-2">
                      {currentSpec.content.features.map((feature, index) => (
                        <motion.div
                          key={feature}
                          initial={prefersReducedMotion ? {} : { opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-2 h-2 bg-brand-primary rounded-full flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Zoom: {Math.round(zoom * 100)}% • Use mouse wheel to zoom
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download Specs
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FeatureModal2;