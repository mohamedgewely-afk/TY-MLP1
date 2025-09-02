
import React, { useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EnhancedSceneData } from "@/types/gallery";
import { ENHANCED_GALLERY_DATA } from "@/data/enhanced-gallery-data";
import { useGalleryStore } from "@/stores/gallery-store";
import { useIsMobile } from "@/hooks/use-mobile";
import ModernFilterBar from "./gallery/ModernFilterBar";
import ModernGalleryLayout from "./gallery/ModernGalleryLayout";
import ModernExpandedOverlay from "./gallery/ModernExpandedOverlay";

interface EnhancedVehicleGalleryProps {
  experiences?: EnhancedSceneData[];
  locale?: "en" | "ar";
  rtl?: boolean;
  onAskToyota?: (scene: EnhancedSceneData) => void;
}

const EnhancedVehicleGallery: React.FC<EnhancedVehicleGalleryProps> = ({
  experiences = ENHANCED_GALLERY_DATA,
  locale = "en",
  rtl = false,
  onAskToyota
}) => {
  const isMobile = useIsMobile();
  
  const {
    selectedExperience,
    isExpanded,
    filters,
    viewPrefs,
    setSelectedExperience,
    setIsExpanded,
    setFilters,
    setViewPrefs
  } = useGalleryStore();

  // Update layout based on screen size
  useEffect(() => {
    setViewPrefs({
      ...viewPrefs,
      layout: 'grid' // Always use grid for better mobile experience
    });
  }, [isMobile]);

  // Filter and sort experiences
  const filteredExperiences = useMemo(() => {
    let filtered = [...experiences];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(exp => filters.categories.includes(exp.scene));
    }

    if (filters.experienceTypes.length > 0) {
      filtered = filtered.filter(exp => filters.experienceTypes.includes(exp.experienceType));
    }

    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(searchLower) ||
        exp.description.toLowerCase().includes(searchLower) ||
        exp.scene.toLowerCase().includes(searchLower) ||
        exp.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'newest':
        case 'popular':
        default:
          return 0;
      }
    });

    return filtered;
  }, [experiences, filters]);

  const handleExperienceExpand = useCallback((experience: EnhancedSceneData) => {
    setSelectedExperience(experience);
    setIsExpanded(true);
  }, [setSelectedExperience, setIsExpanded]);

  const handleCloseExpanded = useCallback(() => {
    setIsExpanded(false);
    setSelectedExperience(null);
  }, [setIsExpanded, setSelectedExperience]);

  const openNext = useCallback(() => {
    if (!selectedExperience) return;
    const currentIndex = filteredExperiences.findIndex(exp => exp.id === selectedExperience.id);
    const nextIndex = (currentIndex + 1) % filteredExperiences.length;
    setSelectedExperience(filteredExperiences[nextIndex]);
  }, [selectedExperience, filteredExperiences, setSelectedExperience]);

  const openPrev = useCallback(() => {
    if (!selectedExperience) return;
    const currentIndex = filteredExperiences.findIndex(exp => exp.id === selectedExperience.id);
    const prevIndex = (currentIndex - 1 + filteredExperiences.length) % filteredExperiences.length;
    setSelectedExperience(filteredExperiences[prevIndex]);
  }, [selectedExperience, filteredExperiences, setSelectedExperience]);

  return (
    <section
      className="relative w-full bg-background"
      dir={rtl ? "rtl" : "ltr"}
      lang={locale}
    >
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/10">
        <div className="absolute inset-0 bg-grid-small-black/[0.02]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div 
              className="flex justify-center mb-6"
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
              </div>
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Experience Gallery
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Discover every angle, feature, and capability through immersive experiences
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="font-medium">{experiences.length} Experiences</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span className="font-medium">Interactive Tours</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter Bar */}
      <ModernFilterBar
        filters={filters}
        viewPrefs={viewPrefs}
        onFiltersChange={setFilters}
        onViewPrefsChange={setViewPrefs}
        totalResults={filteredExperiences.length}
      />

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <ModernGalleryLayout
          experiences={filteredExperiences}
          viewPrefs={viewPrefs}
          onExperienceExpand={handleExperienceExpand}
        />

        {/* Results Summary */}
        {filteredExperiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <p className="text-muted-foreground">
              Showing {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </div>

      {/* Expanded Experience Modal */}
      <AnimatePresence mode="wait">
        {isExpanded && selectedExperience && (
          <ModernExpandedOverlay
            key={selectedExperience.id}
            experience={selectedExperience}
            onClose={handleCloseExpanded}
            onNext={openNext}
            onPrev={openPrev}
            onAskToyota={onAskToyota}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default EnhancedVehicleGallery;
