import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Zap, Shield, Cpu } from 'lucide-react';

interface Feature {
  id: string;
  title: string;
  description?: string;
  media: {
    imageUrl?: string;
    videoUrl?: string;
    poster?: string;
    caption?: string;
  };
  stats?: Array<{ label: string; value: string }>;
  badge?: string;
}

interface FeatureCardsProps {
  features: Feature[];
  onLearnMore?: (id: string) => void;
  className?: string;
}

const FeatureCards: React.FC<FeatureCardsProps> = ({
  features,
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
    return Zap;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.2,
        delayChildren: prefersReducedMotion ? 0 : 0.3
      }
    }
  };

  const cardVariants = {
    hidden: prefersReducedMotion ? {} : { 
      opacity: 0, 
      y: 60,
      scale: 0.95 
    },
    visible: prefersReducedMotion ? { opacity: 1 } : { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <section className={`py-16 lg:py-24 bg-neutral-900 ${className}`}>
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl lg:text-6xl font-light text-white tracking-tight mb-6"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Engineered for
            <br />
            <span className="text-[#EB0A1E]">Excellence</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Every detail meticulously crafted to deliver an unparalleled driving experience
            that combines cutting-edge technology with timeless design principles.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              variants={cardVariants}
              className={`
                group relative overflow-hidden rounded-2xl bg-black
                ${index === 0 ? 'md:col-span-2 lg:col-span-2 aspect-[4/3]' : 'aspect-[3/4]'}
              `}
              whileHover={prefersReducedMotion ? {} : { 
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
              }}
            >
              {/* Background Image/Video */}
              <div className="absolute inset-0 z-0">
                {feature.media.videoUrl ? (
                  <video
                    className="w-full h-full object-cover"
                    poster={feature.media.poster || feature.media.imageUrl}
                    muted
                    loop
                    playsInline
                    autoPlay={false}
                    preload="none"
                  >
                    <source src={feature.media.videoUrl} type="video/mp4" />
                    <img
                      src={feature.media.imageUrl || feature.media.poster}
                      alt={feature.media.caption || feature.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onLoad={() => setImageLoaded(prev => ({ ...prev, [feature.id]: true }))}
                    />
                  </video>
                ) : (
                  <img
                    src={feature.media.imageUrl}
                    alt={feature.media.caption || feature.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    sizes={index === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
                    onLoad={() => setImageLoaded(prev => ({ ...prev, [feature.id]: true }))}
                  />
                )}
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
              </div>

              {/* Badge */}
              {feature.badge && (
                <div className="absolute top-4 left-4 z-20">
                  <Badge 
                    variant="secondary" 
                    className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
                  >
                    {feature.badge}
                  </Badge>
                </div>
              )}

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                {/* Stats */}
                {feature.stats && feature.stats.length > 0 && (
                  <motion.div 
                    className="mb-4 space-y-2"
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0.1 } : { delay: 0.2, duration: 0.4 }}
                  >
                    {feature.stats.slice(0, 3).map((stat, index) => {
                      const Icon = getIcon(stat.label);
                      return (
                        <div key={index} className="flex items-center text-white/80 text-sm">
                          <Icon className="h-4 w-4 mr-2 text-[#CC0000]" />
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
                      ${index === 0 ? 'text-3xl lg:text-4xl' : 'text-xl lg:text-2xl'}
                    `}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0.1 } : { delay: 0.1, duration: 0.5 }}
                  >
                    {feature.title}
                  </motion.h3>
                  
                  {feature.description && (
                    <motion.p 
                      className={`
                        text-white/80 leading-relaxed
                        ${index === 0 ? 'text-base lg:text-lg' : 'text-sm lg:text-base'}
                      `}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                      whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                      transition={prefersReducedMotion ? { duration: 0.1 } : { delay: 0.2, duration: 0.5 }}
                    >
                      {feature.description}
                    </motion.p>
                  )}
                </div>

                {/* CTA Button */}
                {onLearnMore && (
                  <motion.div 
                    className="mt-4 pt-4"
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                    transition={prefersReducedMotion ? { duration: 0.1 } : { delay: 0.3, duration: 0.5 }}
                  >
                    <Button
                      onClick={() => onLearnMore(feature.id)}
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

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 opacity-0 bg-gradient-to-r from-[#EB0A1E]/20 via-transparent to-[#EB0A1E]/20"
                animate={prefersReducedMotion ? {} : { 
                  opacity: 0
                }}
                whileHover={prefersReducedMotion ? {} : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              {/* Loading skeleton */}
              {!imageLoaded[feature.id] && (
                <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Performance Stats Bar */}
        <motion.div
          className="mt-16 pt-12 border-t border-white/10"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "268", unit: "HP", label: "Max Power" },
              { value: "6.8", unit: "sec", label: "0-100 km/h" },
              { value: "4.5", unit: "L/100km", label: "Fuel Economy" },
              { value: "5", unit: "★", label: "Safety Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.8 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, scale: 1 }}
                transition={prefersReducedMotion ? { duration: 0.1 } : {
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                viewport={{ once: true }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  <span className="text-[#EB0A1E]">{stat.value}</span>
                  <span className="text-white/60 text-lg ml-1">{stat.unit}</span>
                </div>
                <div className="text-sm text-white/60 uppercase tracking-wider">
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