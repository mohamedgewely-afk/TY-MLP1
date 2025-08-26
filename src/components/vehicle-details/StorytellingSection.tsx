
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BleedRight, BleedLeft, ParallaxImg } from "@/components/ui/layout-utilities";
import { createStorySections, StorySection } from "@/data/story-sections";
import NavigationDots from "./NavigationDots";
import AnimatedCounter from "@/components/ui/animated-counter";

interface StorytellingProps {
  galleryImages: string[];
  monthlyEMI: number;
  setIsBookingOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  setIsFinanceOpen: (open: boolean) => void;
}

const StorytellingSection: React.FC<StorytellingProps> = ({
  galleryImages,
  monthlyEMI,
  setIsBookingOpen,
  navigate,
  setIsFinanceOpen
}) => {
  const [activeStorySection, setActiveStorySection] = useState(0);

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
        {storySection.map((section, index) => (
          <motion.div
            key={section.id}
            id={`story-${section.id}`}
            className="grid lg:grid-cols-12 gap-10 items-center isolate"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            onViewportEnter={() => setActiveStorySection(index)}
          >
            {section.layout === 'text-left' ? (
              <>
                {/* Text Content - Left */}
                <motion.div
                  className="lg:col-span-5 relative z-10 space-y-6"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div>
                    <motion.div 
                      className="flex items-center space-x-2 mb-3"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="w-8 h-1 bg-primary"></span>
                      <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                        {section.subtitle}
                      </span>
                    </motion.div>
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                      {section.description}
                    </p>
                  </div>

                  {/* Animated Stats */}
                  <motion.div 
                    className="grid grid-cols-3 gap-4 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {section.stats.map((stat, i) => (
                      <div key={i} className="text-center">
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
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button 
                      onClick={section.cta.action}
                      size="lg"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4"
                    >
                      {section.cta.label}
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Image - Right */}
                <motion.div
                  className="lg:col-span-7"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <BleedRight>
                    <div className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group">
                      <ParallaxImg
                        src={section.image}
                        alt={section.subtitle}
                        className="w-full h-[52vw] max-h-[560px] lg:h-[72vh] xl:h-[78vh] transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </BleedRight>
                </motion.div>
              </>
            ) : (
              <>
                {/* Image - Left */}
                <motion.div
                  className="lg:col-span-7 order-2 lg:order-1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <BleedLeft>
                    <div className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group">
                      <ParallaxImg
                        src={section.image}
                        alt={section.subtitle}
                        className="w-full h-[52vw] max-h-[560px] lg:h-[72vh] xl:h-[78vh] transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </BleedLeft>
                </motion.div>

                {/* Text Content - Right */}
                <motion.div
                  className="lg:col-span-5 order-1 lg:order-2 relative z-10 space-y-6"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div>
                    <motion.div 
                      className="flex items-center space-x-2 mb-3 justify-start lg:justify-end"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                        {section.subtitle}
                      </span>
                      <span className="w-8 h-1 bg-primary"></span>
                    </motion.div>
                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight lg:text-right">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed lg:text-right">
                      {section.description}
                    </p>
                  </div>

                  {/* Animated Stats */}
                  <motion.div 
                    className="grid grid-cols-3 gap-4 mb-8"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    {section.stats.map((stat, i) => (
                      <div key={i} className="text-center">
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
                      </div>
                    ))}
                  </motion.div>

                  <motion.div
                    className="flex lg:justify-end"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button 
                      onClick={section.cta.action}
                      size="lg"
                      variant={section.id === 'safety' || section.id === 'connected' ? 'outline' : 'default'}
                      className={section.id === 'safety' || section.id === 'connected' 
                        ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4" 
                        : "bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4"
                      }
                    >
                      {section.cta.label}
                    </Button>
                  </motion.div>
                </motion.div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StorytellingSection;
