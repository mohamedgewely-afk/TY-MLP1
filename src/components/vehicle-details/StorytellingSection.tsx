import React, { useMemo, useState, useId } from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
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

// Motion variants kept simple and gated by prefers-reduced-motion
const fadeIn: Variants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } };
const riseIn: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const StorytellingSection: React.FC<StorytellingProps> = ({
  galleryImages,
  monthlyEMI,
  setIsBookingOpen,
  navigate,
  setIsFinanceOpen,
}) => {
  const [activeStorySection, setActiveStorySection] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  // ✅ prevent re-compute on each render
  const storySection = useMemo(
    () =>
      createStorySections(
        galleryImages,
        monthlyEMI,
        setIsBookingOpen,
        navigate,
        setIsFinanceOpen
      ),
    [galleryImages, monthlyEMI, setIsBookingOpen, navigate, setIsFinanceOpen]
  );

  return (
    <section className="relative py-16 lg:py-28 bg-muted/30" aria-label="Product story">
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
            className="grid lg:grid-cols-12 gap-10 items-center isolate scroll-mt-28"
            role="region"
            aria-labelledby={`heading-${section.id}`}
            initial={prefersReducedMotion ? false : "hidden"}
            whileInView={prefersReducedMotion ? undefined : "show"}
            variants={fadeIn}
            viewport={{ once: true, margin: "-100px" }}
            onViewportEnter={() => setActiveStorySection(index)}
          >
            {section.layout === "text-left" ? (
              <>
                {/* Text Content - Left */}
                <motion.div
                  className="lg:col-span-5 relative z-10 space-y-6"
                  variants={riseIn}
                >
                  <div>
                    <motion.div
                      className="flex items-center space-x-2 mb-3"
                      variants={riseIn}
                    >
                      <span className="w-8 h-1 bg-primary" aria-hidden></span>
                      <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                        {section.subtitle}
                      </span>
                    </motion.div>
                    <h2
                      id={`heading-${section.id}`}
                      className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight"
                    >
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                      {section.description}
                    </p>
                  </div>

                  {/* Animated Stats */}
                  {section.stats?.length ? (
                    <motion.div className="grid grid-cols-3 gap-4 mb-8" variants={riseIn}>
                      {section.stats.map((stat, i) => {
                        const isNumber = typeof stat.value === "number";
                        const decimals = isNumber && (stat.value as number) % 1 !== 0 ? 1 : 0;
                        return (
                          <div key={i} className="text-center">
                            <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                              <span aria-hidden>
                                {isNumber ? (
                                  <AnimatedCounter value={stat.value as number} duration={2} decimals={decimals} />
                                ) : (
                                  stat.value
                                )}
                              </span>
                              <span className="sr-only">
                                {isNumber ? (stat.value as number).toFixed(decimals) : String(stat.value)}
                                {stat.unit ? ` ${stat.unit}` : ""}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">{stat.unit}</div>
                            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                          </div>
                        );
                      })}
                    </motion.div>
                  ) : null}

                  <motion.div variants={riseIn}>
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
                <motion.div className="lg:col-span-7" variants={fadeIn}>
                  <BleedRight>
                    <div className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group">
                      <ParallaxImg
                        src={section.image}
                        alt={section.alt ?? `${section.title} — ${section.subtitle}`}
                        className="w-full h-[52vw] max-h-[560px] lg:h-[72vh] xl:h-[78vh] transition-transform duration-700 group-hover:scale-105"
                        disabled={prefersReducedMotion}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </BleedRight>
                </motion.div>
              </>
            ) : (
              <>
                {/* Image - Left */}
                <motion.div className="lg:col-span-7 order-2 lg:order-1" variants={fadeIn}>
                  <BleedLeft>
                    <div className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group">
                      <ParallaxImg
                        src={section.image}
                        alt={section.alt ?? `${section.title} — ${section.subtitle}`}
                        className="w-full h-[52vw] max-h-[560px] lg:h-[72vh] xl:h-[78vh] transition-transform duration-700 group-hover:scale-105"
                        disabled={prefersReducedMotion}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </BleedLeft>
                </motion.div>

                {/* Text Content - Right */}
                <motion.div
                  className="lg:col-span-5 order-1 lg:order-2 relative z-10 space-y-6"
                  variants={riseIn}
                >
                  <div>
                    <motion.div
                      className="flex items-center space-x-2 mb-3 justify-start lg:justify-end"
                      variants={riseIn}
                    >
                      <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                        {section.subtitle}
                      </span>
                      <span className="w-8 h-1 bg-primary" aria-hidden></span>
                    </motion.div>
                    <h2
                      id={`heading-${section.id}`}
                      className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight lg:text-right"
                    >
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground text-lg mb-8 leading-relaxed lg:text-right">
                      {section.description}
                    </p>
                  </div>

                  {/* Animated Stats */}
                  {section.stats?.length ? (
                    <motion.div className="grid grid-cols-3 gap-4 mb-8" variants={riseIn}>
                      {section.stats.map((stat, i) => {
                        const isNumber = typeof stat.value === "number";
                        const decimals = isNumber && (stat.value as number) % 1 !== 0 ? 1 : 0;
                        return (
                          <div key={i} className="text-center">
                            <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                              <span aria-hidden>
                                {isNumber ? (
                                  <AnimatedCounter value={stat.value as number} duration={2} decimals={decimals} />
                                ) : (
                                  stat.value
                                )}
                              </span>
                              <span className="sr-only">
                                {isNumber ? (stat.value as number).toFixed(decimals) : String(stat.value)}
                                {stat.unit ? ` ${stat.unit}` : ""}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground font-medium">{stat.unit}</div>
                            <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                          </div>
                        );
                      })}
                    </motion.div>
                  ) : null}

                  <motion.div className="flex lg:justify-end" variants={riseIn}>
                    <Button
                      onClick={section.cta.action}
                      size="lg"
                      variant={section.id === "safety" || section.id === "connected" ? "outline" : "default"}
                      className={
                        section.id === "safety" || section.id === "connected"
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
