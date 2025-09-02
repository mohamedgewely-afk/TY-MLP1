
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Grid3X3, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { EnhancedSceneData, FilterOptions, ViewPreferences } from "@/types/gallery";
import { ENHANCED_GALLERY_DATA } from "@/data/enhanced-gallery-data";
import { useIsMobile } from "@/hooks/use-mobile";
import EnhancedFilterBar from "./gallery/EnhancedFilterBar";
import ResponsiveGalleryLayout from "./gallery/ResponsiveGalleryLayout";
import ExpandedSceneOverlay from "./gallery/ExpandedSceneOverlay";
import { cn } from "@/lib/utils";

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
  
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    experienceTypes: [],
    searchTerm: '',
    sortBy: 'featured'
  });

  const [viewPrefs, setViewPrefs] = useState<ViewPreferences>({
    layout: isMobile ? 'grid' : 'carousel',
    cardSize: 'medium',
    showPreviews: true
  });

  const [selectedExperience, setSelectedExperience] = useState<EnhancedSceneData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update layout based on screen size
  useEffect(() => {
    setViewPrefs(prev => ({
      ...prev,
      layout: isMobile ? 'grid' : prev.layout
    }));
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
  }, []);

  const handleCloseExpanded = useCallback(() => {
    setSelectedExperience(null);
  }, []);

  const openNext = useCallback(() => {
    if (!selectedExperience) return;
    const currentIndex = filteredExperiences.findIndex(exp => exp.id === selectedExperience.id);
    const nextIndex = (currentIndex + 1) % filteredExperiences.length;
    setSelectedExperience(filteredExperiences[nextIndex]);
  }, [selectedExperience, filteredExperiences]);

  const openPrev = useCallback(() => {
    if (!selectedExperience) return;
    const currentIndex = filteredExperiences.findIndex(exp => exp.id === selectedExperience.id);
    const prevIndex = (currentIndex - 1 + filteredExperiences.length) % filteredExperiences.length;
    setSelectedExperience(filteredExperiences[prevIndex]);
  }, [selectedExperience, filteredExperiences]);

  return (
    <section
      className="relative w-full bg-background"
      dir={rtl ? "rtl" : "ltr"}
      lang={locale}
    >
      {/* Modern Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-grid-small-black/[0.02] bg-[length:20px_20px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-toyota-red/10 rounded-full blur-xl" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-toyota-red to-toyota-red/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Experience Gallery
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
              Discover every angle, feature, and capability through immersive experiences
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-toyota-red rounded-full" />
                <span className="font-medium">{experiences.length} Experiences</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-toyota-red rounded-full" />
                <span className="font-medium">Multiple Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-toyota-red rounded-full" />
                <span className="font-medium">Interactive Tours</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Filter Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <EnhancedFilterBar
          filters={filters}
          viewPrefs={viewPrefs}
          onFiltersChange={setFilters}
          onViewPrefsChange={setViewPrefs}
          totalResults={filteredExperiences.length}
        />
      </div>

      {/* Gallery Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ResponsiveGalleryLayout
          experiences={filteredExperiences}
          viewPrefs={viewPrefs}
          onExperienceExpand={handleExperienceExpand}
          isLoading={isLoading}
        />

        {/* Results Summary */}
        {filteredExperiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-16"
          >
            <p className="text-muted-foreground">
              Showing {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </div>

      {/* Expanded Experience Modal */}
      <AnimatePresence mode="wait">
        {selectedExperience && (
          <ExpandedSceneOverlay
            key={selectedExperience.id}
            experience={selectedExperience}
            onClose={handleCloseExpanded}
            onNext={openNext}
            onPrev={openPrev}
            onAskToyota={onAskToyota}
            rtl={rtl}
            locale={locale}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default EnhancedVehicleGallery;
