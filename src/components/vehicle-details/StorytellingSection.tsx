import React, { useState, Suspense, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BleedRight, BleedLeft } from "@/components/ui/layout-utilities";
import { PerformantParallax } from "@/components/ui/performant-parallax";
import { createStorySections } from "@/data/story-sections";
import NavigationDots from "./NavigationDots";
import AnimatedCounter from "@/components/ui/animated-counter";
import EnhancedLoading from "@/components/ui/enhanced-loading";
import { usePerformantIntersection } from "@/hooks/use-performant-intersection";
import { useSectionVisibility } from "@/hooks/use-section-visibility";
import { useCleanup } from "@/hooks/use-cleanup";
import { 
  performantVariants, 
  performantSpringConfigs, 
  performantMicroAnimations,
  performanceUtils
} from "@/utils/performance-animations";

interface StorytellingProps {
  galleryImages: string[];
  monthlyEMI: number;
  setIsBookingOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  setIsFinanceOpen: (open: boolean) => void;
  onSafetyExplore: () => void;
  onConnectivityExplore: () => void;
  onHybridTechExplore: () => void;
  onInteriorExplore: () => void;
}

const StorySection: React.FC<{
  section: any;
  index: number;
  setActiveStorySection: (index: number) => void;
}> = React.memo(({ section, index, setActiveStorySection }) => {
  const { targetRef, isIntersecting } = usePerformantIntersection<HTMLDivElement>({
    threshold: 0.6,
    triggerOnce: false
  });

  // Memoized callback to prevent unnecessary re-renders
  const handleIntersection = useCallback(() => {
    if (isIntersecting) {
      setActiveStorySection(index);
    }
  }, [isIntersecting, index, setActiveStorySection]);

  React.useEffect(() => {
    handleIntersection();
  }, [handleIntersection]);

  // Memoized variants for performance
  const containerVariants = useMemo(() => performantVariants.staggerContainer, []);
  const leftSlideVariants = useMemo(() => performantVariants.slideInLeft, []);
  const rightSlideVariants = useMemo(() => performantVariants.slideInRight, []);
  const fadeUpVariants = useMemo(() => performantVariants.fadeInUp, []);
  const scaleVariants = useMemo(() => performantVariants.fadeInScale, []);

  // Memoized hover animations
  const luxuryHover = useMemo(() => performantMicroAnimations.luxuryHover, []);
  const buttonHover = useMemo(() => ({
    y: -3, 
    scale: 1.02,
    transform: 'translate3d(0, -3px, 0) scale(1.02)',
    transition: performantSpringConfigs.luxurious 
  }), []);

  const buttonTap = useMemo(() => ({ 
    scale: 0.98,
    transform: 'translate3d(0, 0, 0) scale(0.98)',
    transition: { duration: 0.15 }
  }), []);

  return (
    <motion.div
      ref={targetRef}
      id={`story-${section.id}`}
      className="grid lg:grid-cols-12 gap-10 items-center isolate"
      variants={containerVariants}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
      style={performanceUtils.forceGPULayer}
    >
      {section.layout === 'text-left' ? (
        <>
          {/* Text Content - Left */}
          <motion.div
            className="lg:col-span-5 relative z-10 space-y-6"
            variants={leftSlideVariants}
          >
            <div>
              <motion.div 
                className="flex items-center space-x-2 mb-3"
                variants={fadeUpVariants}
              >
                <span className="w-8 h-1 bg-primary"></span>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {section.subtitle}
                </span>
              </motion.div>
              <motion.h2 
                className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight"
                variants={fadeUpVariants}
              >
                {section.title}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg mb-8 leading-relaxed"
                variants={fadeUpVariants}
              >
                {section.description}
              </motion.p>
            </div>

            {/* Animated Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 mb-8"
              variants={containerVariants}
            >
              {section.stats.map((stat: any, i: number) => (
                <motion.div 
                  key={i} 
                  className="text-center"
                  variants={scaleVariants}
                >
                  <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                    {typeof stat.value === 'number' ? (
                      <AnimatedCounter 
                        value={stat.value} 
                        duration={2}
                        decimals={stat.value % 1 !== 0 ? 1 : 0}
                      />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {stat.unit}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUpVariants}>
              <motion.div
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <Button 
                  onClick={section.cta.action}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 group transition-all duration-300"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {section.cta.label}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image - Right */}
          <motion.div
            className="lg:col-span-7"
            variants={rightSlideVariants}
          >
            <BleedRight>
              <motion.div 
                className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group"
                whileHover={luxuryHover}
              >
                <PerformantParallax
                  src={section.image}
                  alt={section.subtitle}
                  className="w-full h-[60vw] max-h-[680px] lg:h-[80vh] xl:h-[90vh]"
                  intensity={0.3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            </BleedRight>
          </motion.div>
        </>
      ) : (
        <>
          {/* Image - Left */}
          <motion.div
            className="lg:col-span-7 order-2 lg:order-1"
            variants={leftSlideVariants}
          >
            <BleedLeft>
              <motion.div 
                className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group"
                whileHover={luxuryHover}
              >
                <PerformantParallax
                  src={section.image}
                  alt={section.subtitle}
                  className="w-full h-[60vw] max-h-[680px] lg:h-[80vh] xl:h-[90vh]"
                  intensity={0.3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            </BleedLeft>
          </motion.div>

          {/* Text Content - Right */}
          <motion.div
            className="lg:col-span-5 order-1 lg:order-2 relative z-10 space-y-6"
            variants={rightSlideVariants}
          >
            <div>
              <motion.div 
                className="flex items-center space-x-2 mb-3 justify-start lg:justify-end"
                variants={fadeUpVariants}
              >
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {section.subtitle}
                </span>
                <span className="w-8 h-1 bg-primary"></span>
              </motion.div>
              <motion.h2 
                className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight lg:text-right"
                variants={fadeUpVariants}
              >
                {section.title}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg mb-8 leading-relaxed lg:text-right"
                variants={fadeUpVariants}
              >
                {section.description}
              </motion.p>
            </div>

            {/* Animated Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 mb-8"
              variants={containerVariants}
            >
              {section.stats.map((stat: any, i: number) => (
                <motion.div 
                  key={i} 
                  className="text-center"
                  variants={scaleVariants}
                >
                  <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                    {typeof stat.value === 'number' ? (
                      <AnimatedCounter 
                        value={stat.value} 
                        duration={2}
                        decimals={stat.value % 1 !== 0 ? 1 : 0}
                      />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {stat.unit}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex lg:justify-end"
              variants={fadeUpVariants}
            >
              <motion.div
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                <Button 
                  onClick={section.cta.action}
                  size="lg"
                  variant={section.id === 'safety' || section.id === 'connected' ? 'outline' : 'default'}
                  className={section.id === 'safety' || section.id === 'connected' 
                    ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 group transition-all duration-300" 
                    : "bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 group transition-all duration-300"
                  }
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {section.cta.label}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
});

StorySection.displayName = 'StorySection';

const StorytellingSection: React.FC<StorytellingProps> = ({
  galleryImages,
  monthlyEMI,
  setIsBookingOpen,
  navigate,
  setIsFinanceOpen,
  onSafetyExplore,
  onConnectivityExplore,
  onHybridTechExplore,
  onInteriorExplore
}) => {
  const [activeStorySection, setActiveStorySection] = useState(0);
  const { addCleanup } = useCleanup();
  const { sectionRef, isVisible } = useSectionVisibility({
    threshold: 0.2,
    rootMargin: '-10% 0px -10% 0px'
  });

  // Memoize story sections to prevent recreation
  const storySection = useMemo(() => createStorySections(
    galleryImages,
    monthlyEMI,
    setIsBookingOpen,
    navigate,
    setIsFinanceOpen,
    onSafetyExplore,
    onConnectivityExplore,
    onHybridTechExplore,
    onInteriorExplore
  ), [galleryImages, monthlyEMI, setIsBookingOpen, navigate, setIsFinanceOpen, onSafetyExplore, onConnectivityExplore, onHybridTechExplore, onInteriorExplore]);

  // Memoized callback for better performance
  const handleSectionClick = useCallback((index: number) => {
    setActiveStorySection(index);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-16 lg:py-28 bg-muted/30"
      style={{ contain: 'layout style' }}
    >
      <NavigationDots
        sections={storySection}
        activeSection={activeStorySection}
        onSectionClick={handleSectionClick}
        isVisible={isVisible}
      />

      <div className="toyota-container max-w-[1600px] xl:max-w-[1800px] space-y-32 lg:space-y-40">
        <Suspense fallback={<EnhancedLoading variant="skeleton" />}>
          {storySection.map((section, index) => (
            <StorySection
              key={section.id}
              section={section}
              index={index}
              setActiveStorySection={handleSectionClick}
            />
          ))}
        </Suspense>
      </div>
    </section>
  );
};

export default StorytellingSection;
