import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import FeatureCard from './FeatureCard';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface Highlight {
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

interface VehicleHighlightsProps {
  highlights: Highlight[];
  onLearnMore?: (id: string) => void;
  className?: string;
}

const VehicleHighlights: React.FC<VehicleHighlightsProps> = ({
  highlights,
  onLearnMore,
  className = ""
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotionSafe();

  return (
    <section className={`py-16 lg:py-24 bg-neutral-900 ${className}`}>
      <div className="toyota-container">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl lg:text-6xl font-light text-white tracking-tight mb-6"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Engineered for
            <br />
            <span className="text-red-500">Excellence</span>
          </motion.h2>
          
          <motion.p 
            className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Every detail meticulously crafted to deliver an unparalleled driving experience
            that combines cutting-edge technology with timeless design principles.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.id}
              initial={prefersReducedMotion ? {} : { 
                opacity: 0, 
                y: 30,
                scale: 0.95 
              }}
              whileInView={prefersReducedMotion ? {} : { 
                opacity: 1, 
                y: 0,
                scale: 1 
              }}
              transition={prefersReducedMotion ? {} : {
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
              viewport={{ once: true, amount: 0.2 }}
              className={`
                ${index === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
                ${index === 0 ? 'lg:row-span-1' : ''}
              `}
            >
              <FeatureCard
                id={highlight.id}
                title={highlight.title}
                description={highlight.description}
                media={highlight.media}
                stats={highlight.stats}
                badge={highlight.badge}
                onLearnMore={onLearnMore}
                size={index === 0 ? 'large' : 'default'}
                className="h-full"
              />
            </motion.div>
          ))}
        </div>

        {/* Performance Stats Bar */}
        <motion.div
          className="mt-16 pt-12 border-t border-white/10"
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
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
                transition={prefersReducedMotion ? {} : {
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                viewport={{ once: true }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-white mb-1">
                  <span className="text-red-500">{stat.value}</span>
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

export default VehicleHighlights;