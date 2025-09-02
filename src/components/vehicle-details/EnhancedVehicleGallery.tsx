
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { EnhancedSceneData, FilterOptions, ViewPreferences, SceneCategory, ExperienceType } from "@/types/gallery";
import { ENHANCED_GALLERY_DATA, CATEGORY_DESCRIPTIONS } from "@/data/enhanced-gallery-data";
import { useIsMobile } from "@/hooks/use-mobile";
import EnhancedFilterBar from "./gallery/EnhancedFilterBar";
import ResponsiveGalleryLayout from "./gallery/ResponsiveGalleryLayout";
import ExpandedSceneOverlay from "./gallery/ExpandedSceneOverlay";
import { cn } from "@/lib/utils";

const TOYOTA_RED = "#EB0A1E";

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
  const prefersReduced = useReducedMotion();
  
  // State management
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    experienceTypes: [],
    searchTerm: '',
    sortBy: 'featured'
  });

  // Default to carousel layout for better desktop experience
  const [viewPrefs, setViewPrefs] = useState<ViewPreferences>({
    layout: 'carousel', // Default to carousel
    cardSize: 'medium', // Better default size
    showPreviews: false
  });

  const [selectedExperience, setSelectedExperience] = useState<EnhancedSceneData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Update card size based on screen size
  useEffect(() => {
    setViewPrefs(prev => ({
      ...prev,
      cardSize: isMobile ? 'medium' : 'medium'
    }));
  }, [isMobile]);

  // Filter and sort experiences
  const filteredExperiences = useMemo(() => {
    let filtered = [...experiences];

    // Apply category filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(exp => filters.categories.includes(exp.scene));
    }

    // Apply experience type filters
    if (filters.experienceTypes.length > 0) {
      filtered = filtered.filter(exp => filters.experienceTypes.includes(exp.experienceType));
    }

    // Apply search filter
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(searchLower) ||
        exp.description.toLowerCase().includes(searchLower) ||
        exp.scene.toLowerCase().includes(searchLower) ||
        exp.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
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

  // Navigation handlers for expanded view
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

  // Handlers
  const handleExperienceExpand = useCallback((experience: EnhancedSceneData) => {
    setSelectedExperience(experience);
  }, []);

  const handleCloseExpanded = useCallback(() => {
    setSelectedExperience(null);
  }, []);

  return (
    <section
      className="relative w-full min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
      dir={rtl ? "rtl" : "ltr"}
      lang={locale}
      aria-label="Toyota Land Cruiser Experience Gallery"
    >
      {/* Header */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${TOYOTA_RED} 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="toyota-container relative py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${TOYOTA_RED}15` }}>
                <Sparkles className="w-6 h-6" style={{ color: TOYOTA_RED }} />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Land Cruiser Experiences
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
              Discover the Land Cruiser through immersive experiences that showcase its legendary capability, 
              refined luxury, and innovative technology.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TOYOTA_RED }} />
                <span>{experiences.length} Experiences</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TOYOTA_RED }} />
                <span>8 Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: TOYOTA_RED }} />
                <span>6 Experience Types</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter Bar */}
      <EnhancedFilterBar
        filters={filters}
        viewPrefs={viewPrefs}
        onFiltersChange={setFilters}
        onViewPrefsChange={setViewPrefs}
        totalResults={filteredExperiences.length}
        isSticky={true}
      />

      {/* Gallery Content */}
      <div className="toyota-container py-8 lg:py-12">
        <motion.div
          layout
          className={cn(
            "transition-all duration-300",
            viewPrefs.layout === 'carousel' && "overflow-hidden"
          )}
        >
          <ResponsiveGalleryLayout
            experiences={filteredExperiences}
            viewPrefs={viewPrefs}
            onExperienceExpand={handleExperienceExpand}
            isLoading={isLoading}
          />
        </motion.div>

        {/* Load More (for future pagination) */}
        {filteredExperiences.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Showing all {filteredExperiences.length} experience{filteredExperiences.length !== 1 ? 's' : ''}
            </p>
          </motion.div>
        )}
      </div>

      {/* Expanded Experience Overlay */}
      {selectedExperience && (
        <ExpandedSceneOverlay
          key={selectedExperience.id}
          experience={selectedExperience}
          onClose={handleCloseExpanded}
          onNext={openNext}
          onPrev={openPrev}
          onAskToyota={onAskToyota}
          prefersReduced={prefersReduced}
          rtl={rtl}
          locale={locale}
        />
      )}
    </section>
  );
};

export default EnhancedVehicleGallery;
