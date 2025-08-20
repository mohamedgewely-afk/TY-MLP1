
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

interface ExperienceCardProps {
  title: string;
  subtitle: string;
  image: string;
  icon: React.ReactNode;
  meta?: string[];
  cta?: { label: string; onClick: () => void };
  onClick?: () => void;
  index: number;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  subtitle,
  image,
  icon,
  meta,
  cta,
  onClick,
  index
}) => {
  return (
    <motion.div
      initial={{ opacity: 0.95, scale: 0.995 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="h-full rounded-3xl shadow-2xl ring-1 ring-border bg-card overflow-hidden cursor-pointer group transition-all duration-300"
      onClick={onClick}
      role="article"
      aria-labelledby={`card-title-${index}`}
      aria-describedby={`card-description-${index}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      {/* Image Section - Larger and more prominent */}
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        <img 
          src={image} 
          alt={`${title} feature showcase`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Floating badge */}
        <div className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm text-primary px-4 py-2 text-sm font-bold shadow-lg">
          {icon}
          <span>{title}</span>
        </div>
      </div>
      
      {/* Content Section - More spacious */}
      <div className="p-8">
        <h3 
          id={`card-title-${index}`}
          className="text-2xl lg:text-3xl font-black mb-4 group-hover:text-primary transition-colors duration-200 leading-tight"
        >
          {subtitle}
        </h3>
        
        {meta && (
          <ul className="grid grid-cols-1 gap-3 mb-6" id={`card-description-${index}`}>
            {meta.map((item, metaIndex) => (
              <li key={metaIndex} className="flex items-center gap-3 text-base text-muted-foreground">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        
        {cta && (
          <Button
            size="lg"
            className="w-full group/button text-base py-6"
            onClick={(e) => {
              e.stopPropagation();
              cta.onClick();
            }}
            aria-label={`${cta.label} for ${title}`}
          >
            {cta.label}
            <ArrowRight className="ml-2 h-5 w-5 group-hover/button:translate-x-2 transition-transform duration-200" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};
