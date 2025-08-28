
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid, List, SlidersHorizontal, X } from "lucide-react";
import { SceneCategory, ExperienceType, FilterOptions, ViewPreferences } from "@/types/gallery";
import { CATEGORY_DESCRIPTIONS, EXPERIENCE_TYPE_LABELS } from "@/data/enhanced-gallery-data";
import { cn } from "@/lib/utils";

const TOYOTA_RED = "#EB0A1E";

interface EnhancedFilterBarProps {
  filters: FilterOptions;
  viewPrefs: ViewPreferences;
  onFiltersChange: (filters: FilterOptions) => void;
  onViewPrefsChange: (prefs: ViewPreferences) => void;
  totalResults: number;
  isSticky?: boolean;
}

const EnhancedFilterBar: React.FC<EnhancedFilterBarProps> = ({
  filters,
  viewPrefs,
  onFiltersChange,
  onViewPrefsChange,
  totalResults,
  isSticky = false
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const categories: (SceneCategory | 'All')[] = [
    'All', 'Exterior', 'Urban', 'Capability', 'Interior', 'Night', 'Performance', 'Safety', 'Technology'
  ];

  const experienceTypes: ExperienceType[] = ['gallery', 'video', '360tour', 'comparison', 'interactive', 'feature-focus'];

  const sortOptions = [
    { value: 'featured', label: 'Featured First' },
    { value: 'newest', label: 'Newest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const toggleCategory = (category: SceneCategory | 'All') => {
    if (category === 'All') {
      onFiltersChange({ ...filters, categories: [] });
    } else {
      const newCategories = filters.categories.includes(category)
        ? filters.categories.filter(c => c !== category)
        : [...filters.categories, category];
      onFiltersChange({ ...filters, categories: newCategories });
    }
  };

  const toggleExperienceType = (type: ExperienceType) => {
    const newTypes = filters.experienceTypes.includes(type)
      ? filters.experienceTypes.filter(t => t !== type)
      : [...filters.experienceTypes, type];
    onFiltersChange({ ...filters, experienceTypes: newTypes });
  };

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      experienceTypes: [],
      searchTerm: '',
      sortBy: 'featured'
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
                         filters.experienceTypes.length > 0 || 
                         filters.searchTerm.length > 0;

  return (
    <div className={cn(
      "bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800",
      isSticky && "sticky top-0 z-30"
    )}>
      <div className="toyota-container py-4">
        {/* Desktop Filter Bar */}
        <div className="hidden lg:block space-y-4">
          {/* Top Row - Search and View Options */}
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search experiences..."
                value={filters.searchTerm}
                onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={cn(
                  "w-full pl-10 pr-4 py-2 rounded-lg border transition-all",
                  searchFocused 
                    ? "border-red-500 ring-2 ring-red-500/20" 
                    : "border-gray-300 dark:border-gray-700",
                  "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                )}
              />
            </div>

            {/* View Options */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 border border-gray-300 dark:border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => onViewPrefsChange({ ...viewPrefs, layout: 'grid' })}
                  className={cn(
                    "p-2 rounded transition-colors",
                    viewPrefs.layout === 'grid' 
                      ? "bg-red-500 text-white" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                  aria-label="Grid view"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewPrefsChange({ ...viewPrefs, layout: 'carousel' })}
                  className={cn(
                    "p-2 rounded transition-colors",
                    viewPrefs.layout === 'carousel' 
                      ? "bg-red-500 text-white" 
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                  aria-label="Carousel view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Sort */}
              <select
                value={filters.sortBy}
                onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as any })}
                className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = category === 'All' 
                ? filters.categories.length === 0 
                : filters.categories.includes(category as SceneCategory);
              
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category as SceneCategory)}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-all",
                    isActive
                      ? "text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  )}
                  style={isActive ? { backgroundColor: TOYOTA_RED } : {}}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* Experience Type Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 py-2 pr-2">Experience Types:</span>
            {experienceTypes.map((type) => {
              const isActive = filters.experienceTypes.includes(type);
              return (
                <button
                  key={type}
                  onClick={() => toggleExperienceType(type)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs border transition-all",
                    isActive
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                      : "border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600"
                  )}
                >
                  {EXPERIENCE_TYPE_LABELS[type]}
                </button>
              );
            })}
          </div>

          {/* Results and Clear */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {totalResults} experience{totalResults !== 1 ? 's' : ''} found
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Mobile Filter Bar */}
        <div className="lg:hidden">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={filters.searchTerm}
                onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium"
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {filters.categories.length + filters.experienceTypes.length}
                </span>
              )}
            </button>
          </div>

          {/* Results */}
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {totalResults} result{totalResults !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Mobile Filters Modal */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 lg:hidden"
            >
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/50"
                onClick={() => setShowMobileFilters(false)}
              />

              {/* Modal */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Categories</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const isActive = category === 'All' 
                        ? filters.categories.length === 0 
                        : filters.categories.includes(category as SceneCategory);
                      
                      return (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category as SceneCategory)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium transition-all",
                            isActive
                              ? "text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          )}
                          style={isActive ? { backgroundColor: TOYOTA_RED } : {}}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Types */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Experience Types</h4>
                  <div className="space-y-2">
                    {experienceTypes.map((type) => {
                      const isActive = filters.experienceTypes.includes(type);
                      return (
                        <button
                          key={type}
                          onClick={() => toggleExperienceType(type)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-left",
                            isActive
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-300 dark:border-gray-700"
                          )}
                        >
                          <span>{EXPERIENCE_TYPE_LABELS[type]}</span>
                          {isActive && (
                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={clearFilters}
                    className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="flex-1 py-3 px-4 rounded-lg text-white"
                    style={{ backgroundColor: TOYOTA_RED }}
                  >
                    Apply Filters
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EnhancedFilterBar;
