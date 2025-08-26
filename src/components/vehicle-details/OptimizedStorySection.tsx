import React, { useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ConditionalBleedRight, ConditionalBleedLeft, AdaptiveImage } from "@/components/ui/adaptive-layout";
import { PerformantParallax } from "@/components/ui/performant-parallax";
import AnimatedCounter from "@/components/ui/animated-counter";
import { useAdaptiveIntersection } from "@/hooks/use-adaptive-intersection";
import { useIsMobile } from "@/hooks/use-mobile";
import { createAdaptiveVariants, createAdaptiveMicroAnimations } from "@/utils/adaptive-animations";

interface OptimizedStorySectionProps {
  section: any;
  index: number;
  setActiveStorySection: (index: number) => void;
}

const OptimizedStorySection: React.FC<OptimizedStorySectionProps> = React.memo(({ 
  section, 
  index, 
  setActiveStorySection 
}) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  
  const { targetRef, isIntersecting, scrollVelocity, isSlowScroll } = useAdaptiveIntersection<HTMLDivElement>({
    threshold: isMobile ? [0.1, 0.2, 0.4] : [0.3, 0.5, 0.7],
    rootMargin: isMobile ? '-5% 0px -10% 0px' : '0px',
    triggerOnce: false
  });

  // Handle intersection with scroll velocity awareness
  const handleIntersection = useCallback(() => {
    if (isIntersecting) {
      setActiveStorySection(index);
    }
  }, [isIntersecting, index, setActiveStorySection]);

  React.useEffect(() => {
    handleIntersection();
  }, [handleIntersection]);

  // Create adaptive animations based on device capabilities
  const deviceCapabilities = useMemo(() => ({
    isMobile,
    isSlowScroll,
    prefersReducedMotion: !!prefersReducedMotion
  }), [isMobile, isSlowScroll, prefersReducedMotion]);

  const variants = useMemo(() => createAdaptiveVariants(deviceCapabilities), [deviceCapabilities]);
  const microAnimations = useMemo(() => createAdaptiveMicroAnimations(deviceCapabilities), [deviceCapabilities]);

  // Mobile-optimized stats (show only top 2 on mobile)
  const displayStats = useMemo(() => {
    return isMobile ? section.stats.slice(0, 2) : section.stats;
  }, [section.stats, isMobile]);

  const buttonTap = useMemo(() => ({ 
    scale: 0.98,
    transform: 'translate3d(0, 0, 0) scale(0.98)',
    transition: { duration: 0.15 }
  }), []);

  return (
    <motion.div
      ref={targetRef}
      id={`story-${section.id}`}
      className={`grid gap-6 lg:gap-10 items-center isolate ${
        isMobile ? 'grid-cols-1' : 'lg:grid-cols-12'
      }`}
      variants={variants.staggerContainer}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
      style={{ contain: 'layout style', transform: 'translate3d(0, 0, 0)' }}
    >
      {section.layout === 'text-left' || isMobile ? (
        <>
          {/* Text Content */}
          <motion.div
            className={`relative z-10 space-y-4 lg:space-y-6 ${
              isMobile ? 'order-2' : 'lg:col-span-5'
            }`}
            variants={variants.slideInLeft}
          >
            <div>
              <motion.div 
                className="flex items-center space-x-2 mb-2 lg:mb-3"
                variants={variants.fadeInUp}
              >
                <span className="w-6 lg:w-8 h-1 bg-primary"></span>
                <span className="text-xs lg:text-sm font-semibold text-primary uppercase tracking-wider">
                  {section.subtitle}
                </span>
              </motion.div>
              <motion.h2 
                className={`font-bold mb-3 lg:mb-4 leading-tight ${
                  isMobile 
                    ? 'text-2xl sm:text-3xl' 
                    : 'text-4xl lg:text-5xl xl:text-6xl'
                }`}
                variants={variants.fadeInUp}
              >
                {section.title}
              </motion.h2>
              <motion.p 
                className={`text-muted-foreground leading-relaxed mb-4 lg:mb-8 ${
                  isMobile ? 'text-base' : 'text-lg'
                }`}
                variants={variants.fadeInUp}
              >
                {section.description}
              </motion.p>
            </div>

            {/* Optimized Stats Grid */}
            <motion.div 
              className={`grid gap-3 lg:gap-4 mb-6 lg:mb-8 ${
                isMobile ? 'grid-cols-2' : 'grid-cols-3'
              }`}
              variants={variants.staggerContainer}
            >
              {displayStats.map((stat: any, i: number) => (
                <motion.div 
                  key={i} 
                  className="text-center"
                  variants={variants.fadeInScale}
                >
                  <div className={`font-bold text-primary mb-1 ${
                    isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'
                  }`}>
                    {typeof stat.value === 'number' ? (
                      <AnimatedCounter 
                        value={stat.value} 
                        duration={isMobile ? 1.5 : 2}
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

            <motion.div variants={variants.fadeInUp}>
              <motion.div
                whileHover={microAnimations.buttonHover}
                whileTap={buttonTap}
              >
                <Button 
                  onClick={section.cta.action}
                  size={isMobile ? "default" : "lg"}
                  className={`bg-primary hover:bg-primary/90 text-primary-foreground group transition-all duration-300 ${
                    isMobile ? 'px-6 py-3 w-full' : 'px-8 py-4'
                  }`}
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {section.cta.label}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            className={`${isMobile ? 'order-1' : 'lg:col-span-7'}`}
            variants={variants.slideInRight}
          >
            <ConditionalBleedRight
              mobileClassName="mx-4"
              desktopClassName="lg:mr-[calc(50%-50vw)]"
            >
              <motion.div 
                className={`relative z-0 overflow-hidden group ${
                  isMobile 
                    ? 'rounded-2xl shadow-lg' 
                    : 'rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none'
                }`}
                whileHover={microAnimations.luxuryHover}
              >
                {isMobile ? (
                  <AdaptiveImage
                    src={section.image}
                    alt={section.subtitle}
                    mobileHeight="h-[40vh]"
                    desktopHeight="h-[80vh] xl:h-[90vh]"
                  />
                ) : (
                  <PerformantParallax
                    src={section.image}
                    alt={section.subtitle}
                    className="w-full h-[60vw] max-h-[680px] lg:h-[80vh] xl:h-[90vh]"
                    intensity={0.2}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            </ConditionalBleedRight>
          </motion.div>
        </>
      ) : (
        <>
          {/* Desktop Right Layout - Image Left, Text Right */}
          <motion.div
            className="lg:col-span-7 order-2 lg:order-1"
            variants={variants.slideInLeft}
          >
            <ConditionalBleedLeft>
              <motion.div 
                className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group"
                whileHover={microAnimations.luxuryHover}
              >
                <PerformantParallax
                  src={section.image}
                  alt={section.subtitle}
                  className="w-full h-[60vw] max-h-[680px] lg:h-[80vh] xl:h-[90vh]"
                  intensity={0.2}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              </motion.div>
            </ConditionalBleedLeft>
          </motion.div>

          {/* Text Content - Right */}
          <motion.div
            className="lg:col-span-5 order-1 lg:order-2 relative z-10 space-y-6"
            variants={variants.slideInRight}
          >
            <div>
              <motion.div 
                className="flex items-center space-x-2 mb-3 justify-start lg:justify-end"
                variants={variants.fadeInUp}
              >
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {section.subtitle}
                </span>
                <span className="w-8 h-1 bg-primary"></span>
              </motion.div>
              <motion.h2 
                className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight lg:text-right"
                variants={variants.fadeInUp}
              >
                {section.title}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg mb-8 leading-relaxed lg:text-right"
                variants={variants.fadeInUp}
              >
                {section.description}
              </motion.p>
            </div>

            <motion.div 
              className="grid grid-cols-3 gap-4 mb-8"
              variants={variants.staggerContainer}
            >
              {section.stats.map((stat: any, i: number) => (
                <motion.div 
                  key={i} 
                  className="text-center"
                  variants={variants.fadeInScale}
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
              variants={variants.fadeInUp}
            >
              <motion.div
                whileHover={microAnimations.buttonHover}
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

OptimizedStorySection.displayName = 'OptimizedStorySection';

export default OptimizedStorySection;
