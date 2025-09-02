
import React from "react";
import { motion } from "framer-motion";
import { Search, Grid3X3, List, RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterState {
  searchTerm: string;
  categories: string[];
  layout: 'grid' | 'carousel';
  sortBy: 'featured' | 'alphabetical' | 'newest';
}

interface PremiumFilterControlsProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: string[];
  totalResults: number;
}

const PremiumFilterControls: React.FC<PremiumFilterControlsProps> = ({
  filters,
  onFiltersChange,
  categories,
  totalResults
}) => {
  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    updateFilters({ categories: newCategories });
  };

  const clearFilters = () => {
    updateFilters({
      searchTerm: '',
      categories: [],
      sortBy: 'featured'
    });
  };

  return (
    <motion.div 
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Controls Row */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              placeholder="Search experiences, features, models..."
              className="w-full pl-12 pr-4 py-3 bg-card border border-border/50 rounded-2xl text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Layout & Sort Controls */}
          <div className="flex items-center gap-3">
            {/* Layout Toggle */}
            <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-border/50">
              <Button
                variant={filters.layout === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateFilters({ layout: 'grid' })}
                className="px-3 py-2 rounded-lg"
              >
                <Grid3X3 className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Grid</span>
              </Button>
              <Button
                variant={filters.layout === 'carousel' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => updateFilters({ layout: 'carousel' })}
                className="px-3 py-2 rounded-lg"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Carousel</span>
              </Button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
              className="px-4 py-2 bg-card border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="featured">Featured First</option>
              <option value="alphabetical">A-Z</option>
              <option value="newest">Newest</option>
            </select>

            {/* Reset Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="px-3 py-2 rounded-xl border-border/50 hover:bg-muted/50"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Reset</span>
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Categories</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isActive = filters.categories.includes(category);
                return (
                  <motion.button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      "border border-border/50 hover:border-primary/50",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                        : "bg-card text-foreground hover:bg-muted/50"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {category}
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/20">
          <p className="text-sm text-muted-foreground">
            {totalResults} {totalResults === 1 ? 'experience' : 'experiences'} found
          </p>
          {filters.categories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateFilters({ categories: [] })}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear categories
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PremiumFilterControls;
