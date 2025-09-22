import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Car, Zap, Shield, Sparkles } from 'lucide-react';
import { enhancedGalleryData } from '@/data/enhanced-gallery-data';

interface StoryScene {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  backgroundVideo?: string;
  cta?: {
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  stats?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  features?: string[];
}

interface AppleStyleStorytellingProps {
  monthlyEMI: number;
  setIsBookingOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  setIsFinanceOpen: (open: boolean) => void;
  onSafetyExplore: () => void;
  onConnectivityExplore: () => void;
  onHybridTechExplore: () => void;
  onInteriorExplore: () => void;
  galleryImages?: string[];
}

const AppleStyleStorytellingSection: React.FC<AppleStyleStorytellingProps> = ({
  monthlyEMI,
  setIsBookingOpen,
  navigate,
  setIsFinanceOpen,
  onSafetyExplore,
  onConnectivityExplore,
  onHybridTechExplore,
  onInteriorExplore,
  galleryImages
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [isScrollLocked, setIsScrollLocked] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  
  const scrollProgress = useMotionValue(0);
  const smoothProgress = useSpring(scrollProgress, { stiffness: 100, damping: 30 });
  
  // Story scenes using gallery data
  const storyScenes: StoryScene[] = [
    {
      id: 'hero',
      title: 'Land Cruiser',
      subtitle: 'Legendary Performance',
      description: 'Experience the ultimate combination of luxury, capability, and reliability that has defined adventure for generations.',
      backgroundImage: galleryImages?.[0] || enhancedGalleryData[0]?.media.hero || 'https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_01_800x447.jpg',
      cta: {
        label: 'Explore Features',
        action: () => setCurrentScene(1),
        variant: 'primary'
      },
      stats: [
        { value: '400', label: 'Horsepower', icon: <Zap className="h-4 w-4" /> },
        { value: '650', label: 'Nm Torque', icon: <Car className="h-4 w-4" /> },
        { value: '5★', label: 'Safety Rating', icon: <Shield className="h-4 w-4" /> }
      ]
    },
    {
      id: 'exterior',
      title: 'Bold Design',
      subtitle: 'Commanding Presence',
      description: 'Every line, every curve speaks to the Land Cruiser\'s heritage of strength and sophistication.',
      backgroundImage: galleryImages?.[1] || enhancedGalleryData[0]?.media.gallery[1]?.url || 'https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_02_800x447.jpg',
      cta: {
        label: 'View Gallery',
        action: () => navigate('/vehicle/land-cruiser/gallery'),
        variant: 'secondary'
      },
      features: [
        'LED Adaptive Headlights',
        'Chrome Accents',
        '20" Alloy Wheels',
        'Power Tailgate'
      ]
    },
    {
      id: 'interior',
      title: 'Luxury Redefined',
      subtitle: 'Premium Comfort',
      description: 'Step into a world of refined elegance where every detail is crafted for the ultimate driving experience.',
      backgroundImage: galleryImages?.[2] || enhancedGalleryData[1]?.media.hero || 'https://global.toyota/pages/models/images/gallery/new_camry_23/interior/interior_01_800x447.jpg',
      cta: {
        label: 'Explore Interior',
        action: onInteriorExplore,
        variant: 'primary'
      },
      features: [
        'Premium Leather Seating',
        '12.3" Touchscreen',
        'Panoramic Sunroof',
        'Climate Control'
      ]
    },
    {
      id: 'cta',
      title: 'Your Journey Begins',
      subtitle: `From AED ${monthlyEMI}/month`,
      description: 'Experience the Land Cruiser difference. Book your test drive today and discover what makes this SUV legendary.',
      backgroundImage: galleryImages?.[3] || enhancedGalleryData[2]?.media.hero || 'https://global.toyota/pages/models/images/gallery/new_camry_23/performance/performance_01_800x447.jpg',
      cta: {
        label: 'Book Test Drive',
        action: () => setIsBookingOpen(true),
        variant: 'primary'
      },
      stats: [
        { value: 'AED ' + monthlyEMI, label: 'Monthly Payment' },
        { value: '0%', label: 'Down Payment' },
        { value: '24/7', label: 'Service Support' }
      ]
    }
  ];

  const totalScenes = storyScenes.length;
  
  // Lock only until the last scene; then allow natural scroll
  const shouldLock = isScrollLocked && currentScene < totalScenes - 1;
  
  // Transform values for animations
  const backgroundScale = useTransform(smoothProgress, [0, 1], [1, 1.2]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [1, 0.8, 0.8, 1]);
  const titleY = useTransform(smoothProgress, [0, 1], [0, -50]);
  
  // Handle scroll with throttling
  const handleScroll = useCallback((event: WheelEvent) => {
    if (!shouldLock) return; // allow natural scroll when not locking
    event.preventDefault();
    
    const now = Date.now();
    if (now - lastScrollTime < 100) return; // Throttle to 100ms
    
    setLastScrollTime(now);
    
    const delta = event.deltaY;
    const threshold = 50;
    
    if (Math.abs(delta) > threshold) {
      if (delta > 0 && currentScene < totalScenes - 1) {
        // Scroll down
        setCurrentScene(prev => Math.min(prev + 1, totalScenes - 1));
      } else if (delta < 0 && currentScene > 0) {
        // Scroll up
        setCurrentScene(prev => Math.max(prev - 1, 0));
      }
    }
  }, [currentScene, totalScenes, lastScrollTime, shouldLock]);

  // Touch handling for mobile
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    if (isUpSwipe && currentScene < totalScenes - 1) {
      setCurrentScene(prev => prev + 1);
    }
    if (isDownSwipe && currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  }, [touchStart, touchEnd, currentScene, totalScenes]);

  // Effect to handle scroll locking and event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Lock scroll when component is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsScrollLocked(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );
    
    observer.observe(container);

    // Add event listeners only when we should lock
    if (shouldLock) {
      document.body.style.overflow = 'hidden';
      container.addEventListener('wheel', handleScroll, { passive: false });
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      observer.disconnect();
      container.removeEventListener('wheel', handleScroll as any);
      container.removeEventListener('touchstart', handleTouchStart as any);
      container.removeEventListener('touchmove', handleTouchMove as any);
      container.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, [shouldLock, handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Update scroll progress
  useEffect(() => {
    scrollProgress.set(currentScene / (totalScenes - 1));
  }, [currentScene, totalScenes, scrollProgress]);

  const currentStory = storyScenes[currentScene];

  return (
    <section
      ref={containerRef}
      className="h-screen sticky top-0 overflow-hidden bg-black"
      style={{ willChange: 'transform' }}
    >
      {/* Background Image/Video */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ scale: backgroundScale }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <img
              src={currentStory.backgroundImage}
              alt={currentStory.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex items-center justify-center"
        style={{ opacity: contentOpacity }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 max-w-4xl mx-auto"
            >
              {/* Badge for scene */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                  {currentScene + 1} of {totalScenes}
                </Badge>
              </motion.div>

              {/* Title */}
              <motion.div
                style={{ y: titleY }}
                className="space-y-2"
              >
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-5xl md:text-7xl lg:text-8xl font-thin tracking-tight"
                >
                  {currentStory.title}
                </motion.h1>
                
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-xl md:text-2xl lg:text-3xl font-light text-white/80"
                >
                  {currentStory.subtitle}
                </motion.h2>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed"
              >
                {currentStory.description}
              </motion.p>

              {/* Stats */}
              {currentStory.stats && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="grid grid-cols-3 gap-8 max-w-md mx-auto"
                >
                  {currentStory.stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="text-center"
                    >
                      {stat.icon && (
                        <div className="flex justify-center mb-2 text-white/60">
                          {stat.icon}
                        </div>
                      )}
                      <div className="text-2xl font-light">{stat.value}</div>
                      <div className="text-xs text-white/60 uppercase tracking-wide">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Features */}
              {currentStory.features && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
                >
                  {currentStory.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="text-sm text-white/80 bg-white/5 rounded-lg px-3 py-2 backdrop-blur-sm"
                    >
                      {feature}
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* CTA */}
              {currentStory.cta && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="pt-6"
                >
                  <Button
                    size="lg"
                    variant={currentStory.cta.variant === 'primary' ? 'default' : 'outline'}
                    onClick={currentStory.cta.action}
                    className={`${
                      currentStory.cta.variant === 'primary'
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'border-white/30 text-white hover:bg-white/10'
                    } px-8 py-3 text-lg font-medium backdrop-blur-sm`}
                  >
                    {currentStory.cta.label}
                    <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {storyScenes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentScene(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentScene
                  ? 'bg-white scale-125'
                  : 'bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll Hint */}
      {currentScene === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm text-center"
        >
          <div className="space-y-2">
            <div>Scroll to explore</div>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-white/40"
            >
              ↓
            </motion.div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default AppleStyleStorytellingSection;