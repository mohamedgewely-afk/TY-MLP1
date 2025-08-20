
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
      className="snap-start shrink-0 rounded-2xl shadow-xl ring-1 ring-border bg-card overflow-hidden cursor-pointer group hover:shadow-2xl transition-shadow duration-300"
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
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={`${title} feature showcase`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4 md:p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold w-max mb-3">
          {icon}
          <span id={`card-title-${index}`}>{title}</span>
        </div>
        
        <h3 className="text-base md:text-lg font-extrabold mb-3 group-hover:text-primary transition-colors duration-200">
          {subtitle}
        </h3>
        
        {meta && (
          <ul className="grid grid-cols-1 gap-2 mb-4" id={`card-description-${index}`}>
            {meta.map((item, metaIndex) => (
              <li key={metaIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-primary flex-shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
        
        {cta && (
          <Button
            className="mt-4 w-full md:w-auto group/button"
            onClick={(e) => {
              e.stopPropagation();
              cta.onClick();
            }}
            aria-label={`${cta.label} for ${title}`}
          >
            {cta.label}
            <ArrowRight className="ml-2 h-4 w-4 group-hover/button:translate-x-1 transition-transform duration-200" />
          </Button>
        )}
      </div>
    </motion.div>
  );
};
