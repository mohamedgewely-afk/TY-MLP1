
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Eye, ArrowRight, Clock, Star } from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { cn } from "@/lib/utils";

interface PremiumExperienceCardProps {
  data: EnhancedSceneData;
  onExpand: (data: EnhancedSceneData) => void;
  index?: number;
  layout?: 'grid' | 'carousel';
}

const PremiumExperienceCard: React.FC<PremiumExperienceCardProps> = ({
  data,
  onExpand,
  index = 0,
  layout = 'grid'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    onExpand(data);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "group relative bg-card border border-border/50 rounded-3xl overflow-hidden cursor-pointer",
        "hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10",
        "transform-gpu will-change-transform",
        layout === 'carousel' ? "min-w-[320px] w-[320px]" : "w-full",
        "h-[420px]"
      )}
      onClick={handleClick}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Featured Badge */}
      {data.featured && (
        <motion.div 
          className="absolute top-4 left-4 z-20"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-xs font-semibold rounded-full shadow-lg">
            <Star className="w-3 h-3 fill-current" />
            Featured
          </div>
        </motion.div>
      )}

      {/* Experience Type Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="w-10 h-10 bg-background/90 backdrop-blur-sm border border-border/50 rounded-full flex items-center justify-center shadow-lg">
          {data.experienceType === 'video' && <Play className="w-4 h-4 text-primary" />}
          {data.experienceType === '360tour' && <Eye className="w-4 h-4 text-primary" />}
          {data.experienceType === 'gallery' && <ArrowRight className="w-4 h-4 text-primary" />}
        </div>
      </div>

      {/* Image Container */}
      <div className="relative h-64 bg-gradient-to-br from-muted via-muted/50 to-muted overflow-hidden">
        {!imageError ? (
          <img
            src={data.media.primaryImage}
            alt={data.title}
            className={cn(
              "w-full h-full object-cover transition-all duration-700",
              imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110",
              "group-hover:scale-105"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted-foreground/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <ArrowRight className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm text-muted-foreground">Preview unavailable</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Duration Badge */}
        {data.duration && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-lg">
            <Clock className="w-3 h-3" />
            {data.duration}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-6 h-40 flex flex-col">
        {/* Category & Tags */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
            {data.scene}
          </span>
          {data.tags?.[0] && (
            <span className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-full">
              {data.tags[0]}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="flex-1 min-h-0">
          <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {data.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            {data.difficulty && (
              <span className="capitalize font-medium">{data.difficulty}</span>
            )}
          </div>
          
          <motion.div
            className="flex items-center gap-2 text-sm font-semibold text-primary"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <span>Explore</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </motion.div>
  );
};

export default PremiumExperienceCard;
