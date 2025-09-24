import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Zap, Shield, Cpu } from 'lucide-react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import type { Media } from '@/data/demo-data';

interface FeatureCardProps {
  id: string;
  title: string;
  description?: string;
  media: Media;
  stats?: Array<{ label: string; value: string }>;
  badge?: string;
  onLearnMore?: (id: string) => void;
  className?: string;
  size?: 'default' | 'large';
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  id,
  title,
  description,
  media,
  stats = [],
  badge,
  onLearnMore,
  className = "",
  size = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotionSafe();

  const isLarge = size === 'large';

  const getIcon = (statLabel: string) => {
    const lower = statLabel.toLowerCase();
    if (lower.includes('power') || lower.includes('hp')) return Zap;
    if (lower.includes('safety') || lower.includes('security')) return Shield;
    if (lower.includes('tech') || lower.includes('ai') || lower.includes('display')) return Cpu;
    return Zap;
  };

  return (
    <motion.div
      className={`
        group relative overflow-hidden rounded-2xl bg-black
        ${isLarge ? 'aspect-[4/3]' : 'aspect-[3/4]'}
        ${className}
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={prefersReducedMotion ? {} : { 
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        {media.videoUrl ? (
          <video
            className="w-full h-full object-cover"
            poster={media.poster || media.imageUrl}
            muted
            loop
            playsInline
            autoPlay={isHovered}
            preload="none"
          >
            <source src={media.videoUrl} type="video/mp4" />
            <img
              src={media.imageUrl || media.poster}
              alt={media.caption || title}
              className="w-full h-full object-cover"
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </video>
        ) : (
          <img
            src={media.imageUrl}
            alt={media.caption || title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            onLoad={() => setImageLoaded(true)}
          />
        )}
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Badge */}
      {badge && (
        <div className="absolute top-4 left-4 z-20">
          <Badge 
            variant="secondary" 
            className="bg-white/10 text-white border-white/20 backdrop-blur-sm"
          >
            {badge}
          </Badge>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6">
        {/* Stats */}
        {stats.length > 0 && (
          <motion.div 
            className="mb-4 space-y-2"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {stats.slice(0, 3).map((stat, index) => {
              const Icon = getIcon(stat.label);
              return (
                <div key={index} className="flex items-center text-white/80 text-sm">
                  <Icon className="h-4 w-4 mr-2 text-red-400" />
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
            {title}
          </motion.h3>
          
          {description && (
            <motion.p 
              className={`
                text-white/80 leading-relaxed
                ${isLarge ? 'text-base lg:text-lg' : 'text-sm lg:text-base'}
              `}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
              whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {description}
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
              onClick={() => onLearnMore(id)}
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
        className="absolute inset-0 opacity-0 bg-gradient-to-r from-red-600/20 via-transparent to-red-600/20"
        animate={prefersReducedMotion ? {} : { 
          opacity: isHovered ? 1 : 0 
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-neutral-800 animate-pulse" />
      )}
    </motion.div>
  );
};

export default FeatureCard;