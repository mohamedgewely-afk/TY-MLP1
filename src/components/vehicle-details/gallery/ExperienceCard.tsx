
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, RotateCcw, Images, Zap, Eye, Clock, Star } from "lucide-react";
import { EnhancedSceneData, ExperienceType } from "@/types/gallery";
import { cn } from "@/lib/utils";

const TOYOTA_RED = "#EB0A1E";
const TOYOTA_BG = "#0D0F10";

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
    small: "h-64",
    medium: "h-80 sm:h-96",
    large: "h-96 sm:h-[28rem]"
  };

  const cardClasses = cn(
    "group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl",
    "transition-all duration-500 cursor-pointer border border-gray-200 dark:border-gray-800",
    "hover:-translate-y-1 hover:scale-[1.02]",
    sizeClasses[size]
  );

  return (
    <motion.article
      className={cardClasses}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -4 }}
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
        <div className="absolute top-3 left-3 z-20">
          <div 
            className="px-2 py-1 rounded-full text-xs font-medium text-white backdrop-blur-sm"
            style={{ backgroundColor: `${TOYOTA_RED}E6` }}
          >
            <Star className="w-3 h-3 inline mr-1" />
            Featured
          </div>
        </div>
      )}

      {/* Experience Type Badge */}
      <div className="absolute top-3 right-3 z-20">
        <div className="bg-black/60 backdrop-blur-sm rounded-full p-2 text-white">
          <ExperienceTypeIcon type={data.experienceType} className="w-4 h-4" />
        </div>
      </div>

      {/* Main Image */}
      <div className="relative h-2/3 overflow-hidden">
        <img
          src={data.media.primaryImage}
          alt={data.title}
          className={cn(
            "w-full h-full object-cover transition-all duration-700",
            imageLoaded ? "opacity-100" : "opacity-0",
            "group-hover:scale-110"
          )}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Duration badge for video content */}
        {data.duration && (
          <div className="absolute bottom-3 right-3">
            <div className="bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {data.duration}
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Content Area */}
      <div className="relative h-1/3 p-4 flex flex-col justify-between">
        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {data.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title and Subtitle */}
        <div className="mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
            {data.title}
          </h3>
          {data.subtitle && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
          {data.description}
        </p>

        {/* Bottom section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="capitalize">{data.scene}</span>
            {data.difficulty && (
              <>
                <span>•</span>
                <span className="capitalize">{data.difficulty}</span>
              </>
            )}
          </div>

          <motion.div
            className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
            style={{ 
              backgroundColor: isHovered ? TOYOTA_RED : 'rgba(255,255,255,0.1)',
              color: isHovered ? 'white' : TOYOTA_RED 
            }}
            animate={{
              backgroundColor: isHovered ? TOYOTA_RED : 'rgba(235,10,30,0.1)',
              color: isHovered ? 'white' : TOYOTA_RED
            }}
          >
            <ExperienceTypeIcon type={data.experienceType} className="w-3 h-3" />
            <span>Explore</span>
          </motion.div>
        </div>
      </div>
    </motion.article>
  );
};

export default ExperienceCard;
