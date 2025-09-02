
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EnhancedSceneData, ViewPreferences } from "@/types/gallery";
import ModernExperienceCard from "./ModernExperienceCard";
import { cn } from "@/lib/utils";
import { ImageOff, Sparkles } from "lucide-react";

interface ModernGalleryLayoutProps {
  experiences: EnhancedSceneData[];
  viewPrefs: ViewPreferences;
  onExperienceExpand: (experience: EnhancedSceneData) => void;
  isLoading?: boolean;
}

const ModernGalleryLayout: React.FC<ModernGalleryLayoutProps> = ({
  experiences,
  viewPrefs,
  onExperienceExpand,
  isLoading = false
}) => {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="bg-muted rounded-2xl animate-pulse h-96"
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
        className="text-center py-20"
      >
        <div className="mx-auto max-w-md">
          <motion.div 
            className="w-20 h-20 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ImageOff className="w-10 h-10 text-muted-foreground" />
          </motion.div>
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

  // Grid layout for both desktop and mobile - responsive and clean
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="popLayout">
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.4,
              delay: index * 0.05,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            <ModernExperienceCard
              data={experience}
              onExpand={onExperienceExpand}
              size={viewPrefs.cardSize}
              index={index}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default ModernGalleryLayout;
