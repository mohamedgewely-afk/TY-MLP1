import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedSceneData } from '@/types/gallery';
import { enhancedGalleryData } from '@/data/enhanced-gallery-data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Grid, List, Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedVehicleGalleryProps {
  vehicle?: {
    name: string;
    type: string;
  };
  className?: string;
}

const EnhancedVehicleGallery: React.FC<EnhancedVehicleGalleryProps> = ({ 
  vehicle,
  className 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [expandedItem, setExpandedItem] = useState<EnhancedSceneData | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const categories = useMemo(() => {
    const cats = enhancedGalleryData.map(item => item.category).filter(Boolean);
    return ['all', ...Array.from(new Set(cats))];
  }, []);

  const filteredData = useMemo(() => {
    if (selectedCategory === 'all') return enhancedGalleryData;
    return enhancedGalleryData.filter(item => item.category === selectedCategory);
  }, [selectedCategory]);

  const handleItemClick = (item: EnhancedSceneData) => {
    setExpandedItem(item);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (expandedItem?.media.gallery) {
      setCurrentImageIndex(prev => 
        (prev + 1) % expandedItem.media.gallery.length
      );
    }
  };

  const handlePrevImage = () => {
    if (expandedItem?.media.gallery) {
      setCurrentImageIndex(prev => 
        (prev - 1 + expandedItem.media.gallery.length) % expandedItem.media.gallery.length
      );
    }
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
            Experience Gallery
          </h2>
          <p className="text-muted-foreground mt-1">
            Explore every detail of the {vehicle?.name || 'vehicle'}
          </p>
        </div>
        
        {/* View Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-9"
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'carousel' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('carousel')}
            className="h-9"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Gallery Content */}
      <motion.div
        layout
        className={cn(
          "grid gap-4",
          viewMode === 'grid' 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        )}
      >
        <AnimatePresence mode="popLayout">
          {filteredData.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              <div className="relative overflow-hidden rounded-lg bg-card border hover:shadow-lg transition-all duration-300">
                <div className="aspect-video relative">
                  <img
                    src={item.media.hero || item.media.gallery[0]?.url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play Icon for Videos */}
                  {item.media.gallery.some(g => g.type === 'video') && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Play className="h-6 w-6 text-white fill-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {item.tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    {item.media.gallery.length} item{item.media.gallery.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Expanded View Modal */}
      <AnimatePresence>
        {expandedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setExpandedItem(null);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h3 className="text-lg font-semibold">{expandedItem.title}</h3>
                  {expandedItem.description && (
                    <p className="text-sm text-muted-foreground">
                      {expandedItem.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setExpandedItem(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Modal Content */}
              <div className="relative">
                {expandedItem.media.gallery[currentImageIndex] && (
                  <div className="aspect-video relative">
                    <img
                      src={expandedItem.media.gallery[currentImageIndex].url}
                      alt={expandedItem.media.gallery[currentImageIndex].title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Navigation */}
                    {expandedItem.media.gallery.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {expandedItem.media.gallery.length}
                    </div>
                  </div>
                )}
                
                {/* Thumbnail Navigation */}
                {expandedItem.media.gallery.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2 overflow-x-auto">
                      {expandedItem.media.gallery.map((item, index) => (
                        <button
                          key={item.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors",
                            index === currentImageIndex
                              ? "border-primary"
                              : "border-transparent hover:border-muted-foreground"
                          )}
                        >
                          <img
                            src={item.thumbnail || item.url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedVehicleGallery;