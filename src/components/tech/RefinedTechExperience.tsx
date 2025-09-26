import React, { useState, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TechFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mediaType: 'image' | 'video';
  mediaSrc: string;
  highlights: string[];
  specs?: Array<{ label: string; value: string }>;
}

interface RefinedTechExperienceProps {
  features?: TechFeature[];
  title?: string;
  subtitle?: string;
  className?: string;
}

const defaultFeatures: TechFeature[] = [
  {
    id: 'safety-suite',
    title: 'Toyota Safety Sense 3.0',
    subtitle: 'Advanced Driver Assistance',
    description: 'Our most comprehensive safety suite uses advanced cameras, radar, and lidar to help prevent accidents before they happen. Experience peace of mind with intelligent protection that never sleeps.',
    mediaType: 'image',
    mediaSrc: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true',
    highlights: ['Pre-Collision System', 'Lane Departure Alert', 'Dynamic Radar Cruise Control', 'Road Sign Assist'],
    specs: [
      { label: 'Detection Range', value: '120m' },
      { label: 'Response Time', value: '0.2s' },
      { label: 'Accuracy', value: '99.7%' }
    ]
  },
  {
    id: 'infotainment',
    title: 'Next-Gen Multimedia',
    subtitle: 'Connected Intelligence',
    description: 'The 14-inch HD touchscreen puts everything at your fingertips. Wireless connectivity, cloud-based navigation, and AI-powered voice recognition create an intuitive digital experience.',
    mediaType: 'image',
    mediaSrc: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true',
    highlights: ['14" HD Touchscreen', 'Wireless Apple CarPlay', 'Cloud Navigation', 'OTA Updates'],
    specs: [
      { label: 'Screen Size', value: '14 inches' },
      { label: 'Resolution', value: '1920x1080' },
      { label: 'Response Time', value: '<50ms' }
    ]
  },
  {
    id: 'hybrid-system',
    title: 'Hybrid Electric Power',
    subtitle: 'Efficiency Redefined',
    description: 'Our fourth-generation hybrid system combines a high-efficiency engine with advanced electric motors for exceptional fuel economy and responsive performance. Silent electric driving meets powerful acceleration.',
    mediaType: 'image',
    mediaSrc: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true',
    highlights: ['Electric Motor Drive', 'Regenerative Braking', 'EV Mode', 'Intelligent Power Management'],
    specs: [
      { label: 'System Power', value: '219 hp' },
      { label: 'Fuel Economy', value: '54 MPG' },
      { label: 'Electric Range', value: '44 miles' }
    ]
  },
  {
    id: 'interior-experience',
    title: 'Premium Interior',
    subtitle: 'Luxury Craftsmanship',
    description: 'Hand-selected materials, precision stitching, and ambient lighting create an atmosphere of refined luxury. Every surface reflects our commitment to exceptional quality and comfort.',
    mediaType: 'image',
    mediaSrc: 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true',
    highlights: ['Premium Leather', 'Heated & Ventilated Seats', '64-Color Ambient Lighting', 'Panoramic Roof'],
    specs: [
      { label: 'Seating', value: 'Semi-aniline leather' },
      { label: 'Climate Zones', value: '4-zone automatic' },
      { label: 'Sound System', value: 'JBL Premium 14-speaker' }
    ]
  }
];

const MediaPlayer: React.FC<{ 
  feature: TechFeature; 
  isActive: boolean;
  onTogglePlay?: () => void;
}> = ({ feature, isActive, onTogglePlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      onTogglePlay?.();
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-lg bg-black">
      {feature.mediaType === 'video' ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={feature.mediaSrc}
            muted={isMuted}
            loop
            playsInline
          >
            <source src={feature.mediaSrc} type="video/mp4" />
          </video>
          
          {/* Video Controls */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-16 w-16 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
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
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <img
          src={feature.mediaSrc}
          alt={feature.title}
          className="w-full h-full object-cover"
          loading={isActive ? 'eager' : 'lazy'}
        />
      )}
    </div>
  );
};

const FeatureSection: React.FC<{ 
  feature: TechFeature; 
  index: number;
  isLast: boolean;
}> = ({ feature, index, isLast }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const prefersReducedMotion = useReducedMotion();
  
  const isEven = index % 2 === 0;

  return (
    <section ref={ref} className={cn("min-h-screen relative", !isLast && "border-b border-neutral-200")}>
      <div className="container mx-auto px-4 py-20">
        <div className={cn(
          "grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-[80vh]",
          isEven ? "lg:grid-cols-[1fr,1.2fr]" : "lg:grid-cols-[1.2fr,1fr]"
        )}>
          {/* Content */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={cn("space-y-8", !isEven && "lg:order-2")}
          >
            <div className="space-y-4">
              <Badge variant="outline" className="border-brand-primary/20 text-brand-primary bg-brand-primary/5">
                {feature.subtitle}
              </Badge>
              
              <h2 className="text-4xl lg:text-6xl font-light tracking-tight text-foreground leading-tight">
                {feature.title}
              </h2>
              
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-[65ch]">
                {feature.description}
              </p>
            </div>

            {/* Highlights */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground/90">Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {feature.highlights.map((highlight, idx) => (
                  <motion.div
                    key={highlight}
                    initial={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                    className="flex items-center text-foreground/80"
                  >
                    <div className="w-1.5 h-1.5 bg-brand-primary rounded-full mr-3 flex-shrink-0" />
                    <span className="text-sm">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Specs */}
            {feature.specs && (
              <motion.div
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-medium text-foreground/90">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {feature.specs.map((spec) => (
                    <div key={spec.label} className="bg-muted/50 backdrop-blur-sm border border-border rounded-lg p-4">
                      <div className="text-2xl font-light text-foreground">{spec.value}</div>
                      <div className="text-sm text-muted-foreground">{spec.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Media */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className={cn("relative", isEven ? "lg:order-2" : "lg:order-1")}
          >
            <div className="aspect-[4/3] relative overflow-hidden rounded-2xl shadow-2xl">
              <MediaPlayer feature={feature} isActive={isInView} />
              
              {/* Floating accent */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-brand-primary/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-byd/10 rounded-full blur-xl" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subtle divider */}
      {!isLast && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="w-px h-20 bg-gradient-to-b from-neutral-300 to-transparent" />
        </div>
      )}
    </section>
  );
};

const RefinedTechExperience: React.FC<RefinedTechExperienceProps> = ({
  features = defaultFeatures,
  title = "Technology Redefined",
  subtitle = "Experience the future of automotive innovation",
  className = ""
}) => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn("bg-white text-foreground relative overflow-hidden", className)}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-byd/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <section ref={headerRef} className="relative z-10 py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 40 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <Badge variant="outline" className="border-brand-primary/20 text-brand-primary bg-brand-primary/5 mb-4">
              Innovation
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-light tracking-tight leading-tight max-w-4xl mx-auto">
              {title}
            </h1>
            
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feature Sections */}
      <div className="relative z-10">
        {features.map((feature, index) => (
          <FeatureSection
            key={feature.id}
            feature={feature}
            index={index}
            isLast={index === features.length - 1}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <section className="relative z-10 py-20 border-t border-neutral-200">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl lg:text-5xl font-light tracking-tight text-foreground">
              Experience Technology in Motion
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Schedule a test drive to experience these advanced technologies firsthand and discover how innovation enhances every journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-brand-primary hover:bg-brand-primary/90 text-white px-8">
                Schedule Test Drive
              </Button>
              <Button size="lg" variant="outline" className="border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 px-8">
                Explore Features
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RefinedTechExperience;