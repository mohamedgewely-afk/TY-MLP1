
import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Maximize2, X, Play, Grid3X3, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { VehicleModel } from '@/types/vehicle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSwipeable } from '@/hooks/use-swipeable';

interface VehicleGalleryProps {
  vehicle: VehicleModel;
}

interface GalleryImage {
  url: string;
  alt: string;
  title: string;
  description: string;
  category: "exterior" | "interior" | "technology" | "lifestyle";
  isVideo?: boolean;
  isPremium?: boolean;
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');
  const [favorites, setFavorites] = useState<number[]>([]);
  const isMobile = useIsMobile();

  // Gallery images data
  const galleryImages: GalleryImage[] = [
    {
      url: vehicle.image,
      alt: `${vehicle.name} - Main`,
      title: "Exterior Design",
      description: "Distinctive design meets premium craftsmanship",
      category: "exterior",
      isPremium: true
    },
    {
      url: "https://images.unsplash.com/photo-1549399734-eb4bb52aa02d?w=800&h=600&fit=crop",
      alt: `${vehicle.name} - Interior`,
      title: "Premium Interior",
      description: "Luxurious comfort with advanced technology",
      category: "interior",
      isPremium: true
    },
    {
      url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop",
      alt: `${vehicle.name} - Technology`,
      title: "Advanced Technology",
      description: "Cutting-edge features for modern driving",
      category: "technology",
      isVideo: true
    },
    {
      url: "https://images.unsplash.com/photo-1518965449314-2c4dc77b3b3a?w=800&h=600&fit=crop",
      alt: `${vehicle.name} - Lifestyle`,
      title: "Active Lifestyle",
      description: "Built for adventure and everyday excellence",
      category: "lifestyle"
    }
  ];

  const categories = ['all', 'exterior', 'interior', 'technology', 'lifestyle'];

  const filteredImages = selectedCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  const toggleFavorite = (index: number) => {
    setFavorites(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Swipe functionality
  const swipeHandlers = useSwipeable({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToNext, goToPrevious]);

  // Reset current index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {vehicle.name} Gallery
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore every detail with our premium visual experience
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`capitalize ${
                selectedCategory === category 
                  ? 'bg-[#EB0A1E] hover:bg-[#EB0A1E]/90' 
                  : 'hover:bg-[#EB0A1E]/10'
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* View Toggle (Desktop) */}
        {!isMobile && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg border p-1">
              <Button
                variant={viewMode === 'swipe' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('swipe')}
                className={viewMode === 'swipe' ? 'bg-[#EB0A1E] hover:bg-[#EB0A1E]/90' : ''}
              >
                <Eye className="w-4 h-4 mr-2" />
                Cinematic
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-[#EB0A1E] hover:bg-[#EB0A1E]/90' : ''}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>
        )}

        {/* Main Gallery */}
        {(isMobile || viewMode === 'swipe') ? (
          <div className="space-y-6">
            {/* Main Image */}
            <motion.div
              key={currentIndex}
              {...swipeHandlers}
              className="relative aspect-video bg-white rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={filteredImages[currentIndex]?.url}
                alt={filteredImages[currentIndex]?.alt}
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {filteredImages[currentIndex]?.isPremium && (
                        <Badge className="bg-[#EB0A1E] hover:bg-[#EB0A1E]/90">
                          <Star className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                      {filteredImages[currentIndex]?.isVideo && (
                        <Badge variant="secondary">
                          <Play className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-white border-white/30">
                        {filteredImages[currentIndex]?.category}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold mb-1">
                      {filteredImages[currentIndex]?.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {filteredImages[currentIndex]?.description}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleFavorite(currentIndex)}
                      className="text-white hover:bg-white/20"
                    >
                      <Heart className={`w-5 h-5 ${favorites.includes(currentIndex) ? 'fill-[#EB0A1E] text-[#EB0A1E]' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsFullscreen(true)}
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows (Desktop) */}
              {!isMobile && filteredImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/20"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 bg-black/20"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {filteredImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex 
                      ? 'border-[#EB0A1E] ring-2 ring-[#EB0A1E]/20' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                  {image.isPremium && (
                    <Star className="absolute top-1 right-1 w-3 h-3 text-[#EB0A1E] fill-current" />
                  )}
                </button>
              ))}
            </div>

            {/* Mobile Progress Dots */}
            {isMobile && (
              <div className="flex justify-center gap-2">
                {filteredImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex 
                        ? 'w-8 bg-[#EB0A1E]' 
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={index}
                className="group relative aspect-video bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsFullscreen(true);
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    {image.isPremium && (
                      <Badge className="bg-[#EB0A1E] text-xs">Premium</Badge>
                    )}
                    {image.isVideo && (
                      <Badge variant="secondary" className="text-xs">Video</Badge>
                    )}
                  </div>
                  <h4 className="font-bold text-lg">{image.title}</h4>
                  <p className="text-white/90 text-sm">{image.description}</p>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(index);
                    }}
                    className="text-white hover:bg-white/20 bg-black/20"
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(index) ? 'fill-[#EB0A1E] text-[#EB0A1E]' : ''}`} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Fullscreen Modal */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex flex-col"
              onClick={() => setIsFullscreen(false)}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <div>
                  <h3 className="text-white text-xl font-bold">
                    {filteredImages[currentIndex]?.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {filteredImages[currentIndex]?.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white text-sm">
                    {currentIndex + 1} / {filteredImages.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(false)}
                    className="text-white hover:bg-white/10"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Main Image */}
              <div className="flex-1 flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                <motion.img
                  key={currentIndex}
                  src={filteredImages[currentIndex]?.url}
                  alt={filteredImages[currentIndex]?.alt}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Navigation */}
                {filteredImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 bg-black/20"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 bg-black/20"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </div>

              {/* Footer Dots */}
              <div className="p-4 border-t border-white/10">
                <div className="flex justify-center gap-2">
                  {filteredImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(index);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex 
                          ? 'w-8 bg-[#EB0A1E]' 
                          : 'w-2 bg-white/40 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VehicleGallery;
