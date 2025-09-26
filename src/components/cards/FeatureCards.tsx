import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Zap, Shield, Cpu, Gauge } from 'lucide-react';

interface Media {
  imageUrl?: string;
  videoUrl?: string;
  poster?: string;
  caption?: string;
}

interface Highlight {
  id: string;
  title: string;
  description?: string;
  media: Media;
  stats?: Array<{ label: string; value: string }>;
  badge?: string;
}

interface FeatureCardsProps {
  highlights: Highlight[];
  onLearnMore?: (id: string) => void;
  className?: string;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({
  highlights = [],
  onLearnMore,
  className = ""
}) => {
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = useReducedMotion();

  const getIcon = (statLabel: string) => {
    const lower = statLabel.toLowerCase();
    if (lower.includes('power') || lower.includes('hp')) return Zap;
    if (lower.includes('safety') || lower.includes('security')) return Shield;
    if (lower.includes('tech') || lower.includes('ai') || lower.includes('display')) return Cpu;
    if (lower.includes('speed') || lower.includes('acceleration')) return Gauge;
    return Zap;
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : 40,
      scale: prefersReducedMotion ? 1 : 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: prefersReducedMotion ? 0.1 : 0.6
      }
    }
  };

  return (
    <section className={`py-16 lg:py-24 bg-neutral-50 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl lg:text-6xl font-light text-foreground tracking-tight mb-6"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Engineered for
            <br />
            <span className="text-brand-primary">Excellence</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Every detail meticulously crafted to deliver an unparalleled driving experience
            that combines cutting-edge technology with timeless design principles.
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {highlights.map((highlight, index) => {
            const isLarge = index === 0;
            const Icon = highlight.stats?.[0] ? getIcon(highlight.stats[0].label) : Zap;
            
            return (
              <motion.div
                key={highlight.id}
                variants={cardVariants}
                className={`
                  group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl
                  transition-all duration-500 cursor-pointer
                  ${isLarge ? 'md:col-span-2 lg:col-span-2 lg:row-span-1' : ''}
                `}
                whileHover={prefersReducedMotion ? {} : { 
                  y: -8,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                }}
                onClick={() => onLearnMore?.(highlight.id)}
              >
                {/* Background Image */}
                <div className="relative overflow-hidden">
                  <div className={`
                    relative overflow-hidden
                    ${isLarge ? 'aspect-[2/1]' : 'aspect-[4/3]'}
                  `}>
                    {highlight.media.videoUrl ? (
                      <video
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        poster={highlight.media.poster || highlight.media.imageUrl}
                        muted
                        loop
                        playsInline
                        autoPlay={false}
                        preload="none"
                      >
                        <source src={highlight.media.videoUrl} type="video/mp4" />
                        <img
                          src={highlight.media.imageUrl || highlight.media.poster}
                          alt={highlight.media.caption || highlight.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onLoad={() => setImageLoaded(prev => ({ ...prev, [highlight.id]: true }))}
                        />
                      </video>
                    ) : (
                      <img
                        src={highlight.media.imageUrl || 'https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/f6516ca6-e2fd-4869-bfff-20532eda7b71/renditions/63c413af-8759-4581-a01b-905989f7d391?binary=true&mformat=true'}
                        alt={highlight.media.caption || highlight.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
                        onLoad={() => setImageLoaded(prev => ({ ...prev, [highlight.id]: true }))}
                      />
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

                  {/* Badge */}
                  {highlight.badge && (
                    <div className="absolute top-4 left-4 z-20">
                      <Badge 
                        variant="secondary" 
                        className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                      >
                        {highlight.badge}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                  {/* Stats */}
                  {highlight.stats && highlight.stats.length > 0 && (
                    <motion.div 
                      className="mb-4 space-y-2"
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                    >
                      {highlight.stats.slice(0, 3).map((stat, statIndex) => {
                        const StatIcon = getIcon(stat.label);
                        return (
                          <div key={statIndex} className="flex items-center text-white/80 text-sm">
                            <StatIcon className="h-4 w-4 mr-2 text-accent-byd" />
                            <span className="font-medium">{stat.value}</span>
                            <span className="ml-2 text-white/60">{stat.label}</span>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* Text content */}
                  <div className="space-y-3">
                    <motion.h3 
                      className={`
                        text-white font-bold tracking-tight leading-tight
                        ${isLarge ? 'text-3xl lg:text-4xl' : 'text-xl lg:text-2xl'}
                      `}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                    >
                      {highlight.title}
                    </motion.h3>
                    
                    {highlight.description && (
                      <motion.p 
                        className={`
                          text-white/80 leading-relaxed
                          ${isLarge ? 'text-base lg:text-lg' : 'text-sm lg:text-base'}
                        `}
                        initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                        whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        {highlight.description}
                      </motion.p>
                    )}
                  </div>

                  {/* CTA Button */}
                  {onLearnMore && (
                    <motion.div 
                      className="mt-4 pt-4"
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-white hover:bg-white/10 p-0 h-auto font-medium group/btn"
                      >
                        <span>Learn More</span>
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </Button>
                    </motion.div>
                  )}
                </div>

                {/* Loading skeleton */}
                {!imageLoaded[highlight.id] && (
                  <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Performance Stats Bar */}
        <motion.div
          className="mt-16 pt-12 border-t border-neutral-200"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "409", unit: "HP", label: "Max Power" },
              { value: "6.7", unit: "sec", label: "0-100 km/h" },
              { value: "10.0", unit: "L/100km", label: "Fuel Economy" },
              { value: "5", unit: "★", label: "Safety Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                transition={prefersReducedMotion ? {} : {
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                viewport={{ once: true }}
              >
                <div className="text-3xl lg:text-4xl font-light text-foreground mb-1">
                  <span className="text-brand-primary font-bold">{stat.value}</span>
                  <span className="text-muted-foreground text-lg ml-1">{stat.unit}</span>
                </div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCards;