
import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { EnhancedSceneData } from "@/types/gallery";
import { ENHANCED_GALLERY_DATA } from "@/data/enhanced-gallery-data";
import { useIsMobile } from "@/hooks/use-mobile";
import PremiumFilterControls from "./gallery/PremiumFilterControls";
import PremiumGalleryLayout from "./gallery/PremiumGalleryLayout";
import PremiumExpandedView from "./gallery/PremiumExpandedView";

interface FilterState {
  searchTerm: string;
  categories: string[];
  layout: 'grid' | 'carousel';
  sortBy: 'featured' | 'alphabetical' | 'newest';
}

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
  onAskToyota,
}) => {
  const isMobile = useIsMobile();
  
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    categories: [],
    layout: isMobile ? 'carousel' : 'grid',
    sortBy: 'featured'
  });

  const [selectedExperience, setSelectedExperience] = useState<EnhancedSceneData | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(experiences.map(exp => exp.scene).filter(Boolean));
    return Array.from(cats).sort();
  }, [experiences]);

  // Filter and sort experiences
  const filteredExperiences = useMemo(() => {
    let filtered = [...experiences];

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(exp => filters.categories.includes(exp.scene));
    }

    // Apply search filter
    if (filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(exp =>
        exp.title.toLowerCase().includes(searchTerm) ||
        exp.description.toLowerCase().includes(searchTerm) ||
        exp.scene.toLowerCase().includes(searchTerm) ||
        (exp.tags && exp.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'featured':
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.title.localeCompare(b.title);
        });
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'newest':
        // Assuming experiences with higher indices are newer
        filtered.reverse();
        break;
    }

    return filtered;
  }, [experiences, filters]);

  const handleExperienceExpand = useCallback((experience: EnhancedSceneData) => {
    setSelectedExperience(experience);
    setIsExpanded(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setSelectedExperience(null);
  }, []);

  const handleNext = useCallback(() => {
    if (!selectedExperience) return;
    const currentIndex = filteredExperiences.findIndex(exp => exp.id === selectedExperience.id);
    const nextIndex = (currentIndex + 1) % filteredExperiences.length;
    setSelectedExperience(filteredExperiences[nextIndex]);
  }, [selectedExperience, filteredExperiences]);

  const handlePrev = useCallback(() => {
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
      aria-label="Toyota Experience Gallery"
    >
      {/* Hero Section */}
      <div className="relative">
        <div className="h-1 w-full bg-gradient-to-r from-primary via-primary/80 to-primary" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center space-y-6"
          >
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Toyota Experience
                <span className="block text-primary">Gallery</span>
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Discover the innovation, craftsmanship, and performance that define Toyota. 
                Explore our premium experiences and see what drives us forward.
              </motion.p>
            </div>
            
            {experiences?.length && (
              <motion.p 
                className="text-sm text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                aria-live="polite"
              >
                {experiences.length} {experiences.length === 1 ? 'experience' : 'experiences'} available
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Filter Controls */}
      <PremiumFilterControls
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        totalResults={filteredExperiences.length}
      />

      {/* Gallery Content */}
      <PremiumGalleryLayout
        experiences={filteredExperiences}
        layout={filters.layout}
        onExperienceExpand={handleExperienceExpand}
      />

      {/* Results Summary */}
      {filteredExperiences.length > 0 && (
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-muted-foreground" aria-live="polite">
            Showing {filteredExperiences.length} of {experiences.length} experiences
          </p>
        </motion.div>
      )}

      {/* Expanded View Modal */}
      <PremiumExpandedView
        experience={selectedExperience}
        isOpen={isExpanded}
        onClose={handleClose}
        onNext={filteredExperiences.length > 1 ? handleNext : undefined}
        onPrev={filteredExperiences.length > 1 ? handlePrev : undefined}
      />
    </section>
  );
};

export default EnhancedVehicleGallery;
