
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedSceneData, ViewPreferences } from "@/types/gallery";
import ExperienceCard from "./ExperienceCard";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface ResponsiveGalleryLayoutProps {
  experiences: EnhancedSceneData[];
  viewPrefs: ViewPreferences;
  onExperienceExpand: (experience: EnhancedSceneData) => void;
  isLoading?: boolean;
}

const ResponsiveGalleryLayout: React.FC<ResponsiveGalleryLayoutProps> = ({
  experiences,
  viewPrefs,
  onExperienceExpand,
  isLoading = false
}) => {
  const layoutConfig = useMemo(() => {
    const { layout, cardSize } = viewPrefs;
    
    if (layout === 'carousel') {
      return {
        containerClass: "flex gap-6 overflow-x-auto snap-x snap-mandatory pb-6 scrollbar-hide",
        cardClass: cn(
          "snap-start shrink-0",
          cardSize === 'small' ? "w-72" : 
          cardSize === 'large' ? "w-96" : "w-80"
        )
      };
    }

    // Grid layout
    const gridClasses = {
      small: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      medium: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      large: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
    };

    return {
      containerClass: `grid ${gridClasses[cardSize]} gap-6`,
      cardClass: ""
    };
  }, [viewPrefs]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={layoutConfig.containerClass}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className={cn(
              "bg-muted rounded-xl animate-pulse",
              layoutConfig.cardClass,
              "aspect-[4/5]"
            )}
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (experiences.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-24"
      >
        <div className="mx-auto max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
            <ImageOff className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">
            No experiences found
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Try adjusting your filters to discover more experiences, or browse all categories to see the full collection.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className={cn(layoutConfig.containerClass, "relative")}>
      <AnimatePresence mode="popLayout">
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.id}
            className={layoutConfig.cardClass}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.4,
              delay: viewPrefs.layout === 'grid' ? index * 0.1 : 0,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <ExperienceCard
              data={experience}
              onExpand={onExperienceExpand}
              size={viewPrefs.cardSize}
              isPreviewMode={viewPrefs.showPreviews}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ResponsiveGalleryLayout;
