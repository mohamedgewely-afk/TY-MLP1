
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Grid3X3, LayoutGrid } from "lucide-react";
import { FilterOptions, ViewPreferences, SceneCategory, ExperienceType } from "@/types/gallery";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ModernFilterBarProps {
  filters: FilterOptions;
  viewPrefs: ViewPreferences;
  onFiltersChange: (filters: FilterOptions) => void;
  onViewPrefsChange: (viewPrefs: ViewPreferences) => void;
  totalResults: number;
}

const CATEGORIES: SceneCategory[] = ["Exterior", "Urban", "Capability", "Interior", "Night", "Performance", "Safety", "Technology"];
const EXPERIENCE_TYPES: ExperienceType[] = ["gallery", "video", "360tour", "comparison", "interactive", "feature-focus"];

const ModernFilterBar: React.FC<ModernFilterBarProps> = ({
  filters,
  viewPrefs,
  onFiltersChange,
  onViewPrefsChange,
  totalResults
}) => {
  const [showFilters, setShowFilters] = useState(false);

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
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Filter Bar */}
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Left Side - Search & Filters */}
          <div className="flex items-center gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search experiences..."
                value={filters.searchTerm}
                onChange={(e) => onFiltersChange({ ...filters, searchTerm: e.target.value })}
                className="pl-10 bg-background border-border focus:border-primary"
              />
            </div>

            {/* Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "gap-2 relative",
                hasActiveFilters && "border-primary bg-primary/5 text-primary"
              )}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
              )}
            </Button>

            {/* Results Count */}
            <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
              {totalResults} result{totalResults !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Right Side - View Controls */}
          <div className="flex items-center gap-3">
            {/* Layout Toggle */}
            <div className="flex bg-muted rounded-lg p-1">
              <Button
                variant={viewPrefs.layout === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewPrefsChange({ ...viewPrefs, layout: 'grid' })}
                className="px-3 h-8"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
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
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-t border-border"
            >
              <div className="py-6 space-y-6">
                {/* Categories */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">Categories</h3>
                    {filters.categories.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFiltersChange({ ...filters, categories: [] })}
                        className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
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
                          "text-xs h-8",
                          filters.categories.includes(category) && "bg-primary text-primary-foreground"
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
                        className="text-xs text-muted-foreground hover:text-foreground h-auto p-1"
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
                          "text-xs capitalize h-8",
                          filters.experienceTypes.includes(type) && "bg-primary text-primary-foreground"
                        )}
                      >
                        {type.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Clear All */}
                {hasActiveFilters && (
                  <div className="flex justify-end pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllFilters}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernFilterBar;
