
import React, { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BleedRight, BleedLeft, ParallaxImg } from "@/components/ui/layout-utilities";
import { createStorySections } from "@/data/story-sections";
import NavigationDots from "./NavigationDots";
import AnimatedCounter from "@/components/ui/animated-counter";
import EnhancedLoading from "@/components/ui/enhanced-loading";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useCleanup } from "@/hooks/use-cleanup";
import { enhancedVariants, springConfigs } from "@/utils/animation-configs";

interface StorytellingProps {
  galleryImages: string[];
  monthlyEMI: number;
  setIsBookingOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  setIsFinanceOpen: (open: boolean) => void;
}

const StorySection: React.FC<{
  section: any;
  index: number;
  setActiveStorySection: (index: number) => void;
}> = ({ section, index, setActiveStorySection }) => {
  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0.6,
    onIntersect: () => setActiveStorySection(index)
  });

  return (
    <motion.div
      ref={targetRef}
      id={`story-${section.id}`}
      className="grid lg:grid-cols-12 gap-10 items-center isolate"
      variants={enhancedVariants.staggerContainer}
      initial="hidden"
      animate={isIntersecting ? "visible" : "hidden"}
    >
      {section.layout === 'text-left' ? (
        <>
          {/* Text Content - Left */}
          <motion.div
            className="lg:col-span-5 relative z-10 space-y-6"
            variants={enhancedVariants.slideInLeft}
          >
            <div>
              <motion.div 
                className="flex items-center space-x-2 mb-3"
                variants={enhancedVariants.fadeInUp}
              >
                <span className="w-8 h-1 bg-primary"></span>
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {section.subtitle}
                </span>
              </motion.div>
              <motion.h2 
                className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight"
                variants={enhancedVariants.fadeInUp}
              >
                {section.title}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg mb-8 leading-relaxed"
                variants={enhancedVariants.fadeInUp}
              >
                {section.description}
              </motion.p>
            </div>

            {/* Animated Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 mb-8"
              variants={enhancedVariants.staggerContainer}
            >
              {section.stats.map((stat: any, i: number) => (
                <motion.div 
                  key={i} 
                  className="text-center"
                  variants={enhancedVariants.fadeInScale}
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

            <motion.div variants={enhancedVariants.fadeInUp}>
              <Button 
                onClick={section.cta.action}
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 group"
                whileHover="buttonHover"
                whileTap="buttonPress"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  {section.cta.label}
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image - Right */}
          <motion.div
            className="lg:col-span-7"
            variants={enhancedVariants.slideInRight}
          >
            <BleedRight>
              <motion.div 
                className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group"
                whileHover="cardHover"
              >
                <ParallaxImg
                  src={section.image}
                  alt={section.subtitle}
                  className="w-full h-[52vw] max-h-[560px] lg:h-[72vh] xl:h-[78vh] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </BleedRight>
          </motion.div>
        </>
      ) : (
        <>
          {/* Image - Left */}
          <motion.div
            className="lg:col-span-7 order-2 lg:order-1"
            variants={enhancedVariants.slideInLeft}
          >
            <BleedLeft>
              <motion.div 
                className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group"
                whileHover="cardHover"
              >
                <ParallaxImg
                  src={section.image}
                  alt={section.subtitle}
                  className="w-full h-[52vw] max-h-[560px] lg:h-[72vh] xl:h-[78vh] transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </BleedLeft>
          </motion.div>

          {/* Text Content - Right */}
          <motion.div
            className="lg:col-span-5 order-1 lg:order-2 relative z-10 space-y-6"
            variants={enhancedVariants.slideInRight}
          >
            <div>
              <motion.div 
                className="flex items-center space-x-2 mb-3 justify-start lg:justify-end"
                variants={enhancedVariants.fadeInUp}
              >
                <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                  {section.subtitle}
                </span>
                <span className="w-8 h-1 bg-primary"></span>
              </motion.div>
              <motion.h2 
                className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight lg:text-right"
                variants={enhancedVariants.fadeInUp}
              >
                {section.title}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground text-lg mb-8 leading-relaxed lg:text-right"
                variants={enhancedVariants.fadeInUp}
              >
                {section.description}
              </motion.p>
            </div>

            {/* Animated Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-4 mb-8"
              variants={enhancedVariants.staggerContainer}
            >
              {section.stats.map((stat: any, i: number) => (
                <motion.div 
                  key={i} 
                  className="text-center"
                  variants={enhancedVariants.fadeInScale}
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
              variants={enhancedVariants.fadeInUp}
            >
              <Button 
                onClick={section.cta.action}
                size="lg"
                variant={section.id === 'safety' || section.id === 'connected' ? 'outline' : 'default'}
                className={section.id === 'safety' || section.id === 'connected' 
                  ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 group" 
                  : "bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 group"
                }
                whileHover="buttonHover"
                whileTap="buttonPress"
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  {section.cta.label}
                </span>
              </Button>
            </motion.div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

const StorytellingSection: React.FC<StorytellingProps> = ({
  galleryImages,
  monthlyEMI,
  setIsBookingOpen,
  navigate,
  setIsFinanceOpen
}) => {
  const [activeStorySection, setActiveStorySection] = useState(0);
  const { addCleanup } = useCleanup();

  const storySection = createStorySections(
    galleryImages,
    monthlyEMI,
    setIsBookingOpen,
    navigate,
    setIsFinanceOpen
  );

  return (
    <section className="relative py-16 lg:py-28 bg-muted/30">
      <NavigationDots
        sections={storySection}
        activeSection={activeStorySection}
        onSectionClick={setActiveStorySection}
      />

      <div className="toyota-container max-w-[1600px] xl:max-w-[1800px] space-y-32 lg:space-y-40">
        <Suspense fallback={<EnhancedLoading variant="skeleton" />}>
          {storySection.map((section, index) => (
            <StorySection
              key={section.id}
              section={section}
              index={index}
              setActiveStorySection={setActiveStorySection}
            />
          ))}
        </Suspense>
      </div>
    </section>
  );
};

export default StorytellingSection;
