
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Images, Zap, Eye, Star, ArrowRight, Clock } from "lucide-react";
import { EnhancedSceneData, ExperienceType } from "@/types/gallery";
import { cn } from "@/lib/utils";

interface ModernExperienceCardProps {
  data: EnhancedSceneData;
  onExpand: (data: EnhancedSceneData) => void;
  size?: 'small' | 'medium' | 'large';
  index?: number;
}

const ExperienceTypeIcon = ({ type, className }: { type: ExperienceType; className?: string }) => {
  const icons = {
    gallery: Images,
    video: Play,
    '360tour': RotateCcw,
    comparison: Eye,
    interactive: Zap,
    'feature-focus': Star
  };
  
  const Icon = icons[type] || Images;
  return <Icon className={className} />;
};

const ModernExperienceCard: React.FC<ModernExperienceCardProps> = ({
  data,
  onExpand,
  size = 'medium',
  index = 0
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    onExpand(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.article
      className={cn(
        "group relative bg-card border border-border rounded-2xl overflow-hidden",
        "hover:border-primary/20 transition-all duration-300 cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        size === 'small' ? "h-80" : size === 'large' ? "h-[400px]" : "h-96"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      whileHover={{ 
        y: -4,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open ${data.title} experience`}
    >
      {/* Featured Badge */}
      {data.featured && (
        <motion.div 
          className="absolute top-3 left-3 z-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + index * 0.1 }}
        >
          <div className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-full flex items-center gap-1.5 shadow-lg">
            <Star className="w-3 h-3" />
            Featured
          </div>
        </motion.div>
      )}

      {/* Experience Type Badge */}
      <div className="absolute top-3 right-3 z-10">
        <div className="p-2 bg-background/90 backdrop-blur-sm border border-border rounded-full shadow-lg">
          <ExperienceTypeIcon type={data.experienceType} className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Image Container */}
      <div className="relative h-3/5 bg-muted overflow-hidden">
        {!imageError ? (
          <>
            <img
              src={data.media.primaryImage}
              alt={data.title}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
                "group-hover:scale-110"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
            
            {!imageLoaded && (
              <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <div className="text-center">
              <Images className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Image unavailable</p>
            </div>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Duration Badge */}
        {data.duration && (
          <div className="absolute bottom-3 right-3">
            <div className="px-2.5 py-1 bg-background/90 backdrop-blur-sm border border-border rounded-lg text-xs flex items-center gap-1.5 shadow-lg">
              <Clock className="w-3 h-3" />
              {data.duration}
            </div>
          </div>
        )}

        {/* Hover Play Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowRight className="w-6 h-6 text-foreground ml-1" />
          </motion.div>
        </motion.div>
      </div>

      {/* Content Area */}
      <div className="relative h-2/5 p-4 flex flex-col">
        {/* Category & Tags */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="px-2.5 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
            {data.scene}
          </span>
          {data.tags?.[0] && (
            <span className="px-2.5 py-1 text-xs bg-muted text-muted-foreground rounded-full">
              {data.tags[0]}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-h-0">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
            {data.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {data.difficulty && (
              <span className="capitalize">{data.difficulty}</span>
            )}
          </div>
          
          <motion.div
            className="flex items-center gap-1.5 text-sm font-medium text-primary"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default ModernExperienceCard;
