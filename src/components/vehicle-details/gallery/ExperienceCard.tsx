
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Images, Zap, Eye, Clock, Star, ArrowRight } from "lucide-react";
import { EnhancedSceneData, ExperienceType } from "@/types/gallery";
import { cn } from "@/lib/utils";

interface ExperienceCardProps {
  data: EnhancedSceneData;
  onExpand: (data: EnhancedSceneData) => void;
  isPreviewMode?: boolean;
  size?: 'small' | 'medium' | 'large';
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

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  data,
  onExpand,
  isPreviewMode = false,
  size = 'medium'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: "h-80",
    medium: "h-96",
    large: "h-[448px]"
  };

  return (
    <motion.article
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden shadow-sm border border-border",
        "hover:shadow-xl hover:border-toyota-red/20 transition-all duration-500 cursor-pointer",
        sizeClasses[size]
      )}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onExpand(data)}
      role="button"
      tabIndex={0}
      aria-label={`Open ${data.title} experience`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onExpand(data);
        }
      }}
    >
      {/* Featured Badge */}
      {data.featured && (
        <div className="absolute top-4 left-4 z-20">
          <div className="px-3 py-1.5 bg-toyota-red text-white text-sm font-medium rounded-full flex items-center gap-2 shadow-lg">
            <Star className="w-4 h-4" />
            Featured
          </div>
        </div>
      )}

      {/* Experience Type Badge */}
      <div className="absolute top-4 right-4 z-20">
        <div className="p-2.5 bg-background/90 backdrop-blur-sm border border-border rounded-full text-foreground shadow-lg">
          <ExperienceTypeIcon type={data.experienceType} className="w-5 h-5" />
        </div>
      </div>

      {/* Image Container */}
      <div className="relative h-3/5 overflow-hidden bg-muted">
        <img
          src={data.media.primaryImage}
          alt={data.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
            "group-hover:scale-110"
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Duration Badge */}
        {data.duration && (
          <div className="absolute bottom-4 right-4">
            <div className="px-3 py-1.5 bg-background/90 backdrop-blur-sm border border-border rounded-full text-foreground text-sm flex items-center gap-2 shadow-lg">
              <Clock className="w-4 h-4" />
              {data.duration}
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <motion.div
          className="absolute inset-0 bg-toyota-red/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content Area */}
      <div className="relative h-2/5 p-6 flex flex-col">
        {/* Category Tags */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
            {data.scene}
          </span>
          {data.tags && data.tags.length > 0 && (
            <span className="px-2.5 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
              {data.tags[0]}
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="mb-3 flex-1">
          <h3 className="text-xl font-bold text-foreground line-clamp-2 mb-1 leading-tight">
            {data.title}
          </h3>
          {data.subtitle && (
            <p className="text-base text-muted-foreground line-clamp-1 mb-2">
              {data.subtitle}
            </p>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Action Button */}
        <motion.div
          className="flex items-center justify-between"
          animate={{
            y: isHovered ? -2 : 0
          }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {data.difficulty && (
              <span className="capitalize">{data.difficulty}</span>
            )}
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-toyota-red text-white rounded-full text-sm font-medium shadow-lg">
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
};

export default ExperienceCard;
