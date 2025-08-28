
import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedSceneData, ViewPreferences } from "@/types/gallery";
import ExperienceCard from "./ExperienceCard";
import { cn } from "@/lib/utils";

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
  // Memoize layout calculations
  const layoutConfig = useMemo(() => {
    const { layout, cardSize } = viewPrefs;
    
    if (layout === 'carousel') {
      return {
        containerClass: "flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide",
        cardClass: "snap-center shrink-0 w-80 sm:w-96",
        showScrollbar: false
      };
    }

    // Grid layout
    const gridClasses = {
      small: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
      medium: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
      large: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    };

    return {
      containerClass: `grid ${gridClasses[cardSize]} gap-6`,
      cardClass: "",
      showScrollbar: true
    };
  }, [viewPrefs]);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className={layoutConfig.containerClass}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className={cn("bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse", layoutConfig.cardClass)}
            style={{ height: viewPrefs.cardSize === 'small' ? '256px' : viewPrefs.cardSize === 'large' ? '448px' : '384px' }}
          />
        ))}
      </div>
    );
  }

  // Empty state
  if (experiences.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No experiences found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters to discover more Land Cruiser experiences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        layoutConfig.containerClass,
        viewPrefs.layout === 'carousel' && "px-4 sm:px-6 lg:px-8"
      )}
    >
      <AnimatePresence mode="popLayout">
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.id}
            className={layoutConfig.cardClass}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.3,
              delay: viewPrefs.layout === 'grid' ? index * 0.05 : 0
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
