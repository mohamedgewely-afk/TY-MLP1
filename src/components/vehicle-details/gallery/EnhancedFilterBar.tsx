
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Grid3X3, LayoutGrid, SlidersHorizontal, X } from "lucide-react";
import { FilterOptions, ViewPreferences, SceneCategory, ExperienceType } from "@/types/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EnhancedFilterBarProps {
  filters: FilterOptions;
  viewPrefs: ViewPreferences;
  onFiltersChange: (filters: FilterOptions) => void;
  onViewPrefsChange: (viewPrefs: ViewPreferences) => void;
  totalResults: number;
}

const CATEGORIES: SceneCategory[] = ["Exterior", "Urban", "Capability", "Interior", "Night", "Performance", "Safety", "Technology"];
const EXPERIENCE_TYPES: ExperienceType[] = ["gallery", "video", "360tour", "comparison", "interactive", "feature-focus"];
const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured First' },
  { value: 'alphabetical', label: 'A-Z' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' }
];

const EnhancedFilterBar: React.FC<EnhancedFilterBarProps> = ({
  filters,
  viewPrefs,
  onFiltersChange,
  onViewPrefsChange,
  totalResults
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const hasActiveFilters = filters.categories.length > 0 || filters.experienceTypes.length > 0 || filters.searchTerm.length > 0;

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      experienceTypes: [],
      searchTerm: '',
      sortBy: 'featured'
    });
  };

  const toggleCategory = (category: SceneCategory) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleExperienceType = (type: ExperienceType) => {
    const newTypes = filters.experienceTypes.includes(type)
      ? filters.experienceTypes.filter(t => t !== type)
      : [...filters.experienceTypes, type];
    onFiltersChange({ ...filters, experienceTypes: newTypes });
  };

  return (
    <div className="w-full">
      {/* Main Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side - Search & Filters */}
          <div className="flex items-center gap-4 flex-1">
            {/* Search */}
            <div className={cn(
              "relative flex-1 max-w-md transition-all duration-300",
              searchFocused && "scale-105"
            )}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search experiences..."
                value={filters.searchTerm}
                onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="pl-10 pr-4 py-2.5 bg-background border-border focus:border-toyota-red focus:ring-toyota-red/20"
              />
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              size="default"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "gap-2 relative",
                hasActiveFilters && "border-toyota-red bg-toyota-red/5"
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-toyota-red rounded-full" />
              )}
            </Button>

            {/* Results Count */}
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {totalResults} result{totalResults !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Right Side - View Controls */}
          <div className="flex items-center gap-2">
            {/* Layout Toggle */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewPrefs.layout === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewPrefsChange({ ...viewPrefs, layout: 'grid' })}
                className="px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewPrefs.layout === 'carousel' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewPrefsChange({ ...viewPrefs, layout: 'carousel' })}
                className="px-3"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
            </div>

            {/* Card Size */}
            <select
              value={viewPrefs.cardSize}
              onChange={(e) => onViewPrefsChange({ ...viewPrefs, cardSize: e.target.value as any })}
              className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:border-toyota-red focus:ring-toyota-red/20"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-border bg-muted/30 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="space-y-6">
                {/* Categories */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Categories</h3>
                    {filters.categories.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFiltersChange({ ...filters, categories: [] })}
                        className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <Button
                        key={category}
                        variant={filters.categories.includes(category) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleCategory(category)}
                        className={cn(
                          "text-xs",
                          filters.categories.includes(category) && "bg-toyota-red hover:bg-toyota-red/90"
                        )}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Experience Types */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Experience Types</h3>
                    {filters.experienceTypes.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFiltersChange({ ...filters, experienceTypes: [] })}
                        className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {EXPERIENCE_TYPES.map((type) => (
                      <Button
                        key={type}
                        variant={filters.experienceTypes.includes(type) ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleExperienceType(type)}
                        className={cn(
                          "text-xs capitalize",
                          filters.experienceTypes.includes(type) && "bg-toyota-red hover:bg-toyota-red/90"
                        )}
                      >
                        {type.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Sort & Clear */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground">Sort by:</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as any })}
                      className="px-3 py-1.5 bg-background border border-border rounded-lg text-sm focus:border-toyota-red focus:ring-toyota-red/20"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedFilterBar;
