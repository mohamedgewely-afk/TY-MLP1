
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, Play, Pause, Eye, Grid3X3, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { useSwipeable } from "@/hooks/use-swipeable";
import { Card } from "@/components/ui/card";

interface VehicleGalleryProps {
  vehicle: VehicleModel;
}

interface ImageData {
  url: string;
  alt: string;
  category: 'exterior' | 'interior' | 'engine' | 'lifestyle';
  title?: string;
  description?: string;
}

const getGalleryImages = (vehicle: VehicleModel): ImageData[] => [
  {
    url: vehicle.image,
    alt: `${vehicle.name} - Main View`,
    category: 'exterior',
    title: 'Exterior Design',
    description: 'Bold and dynamic styling'
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
    alt: `${vehicle.name} - Rear View`,
    category: 'exterior',
    title: 'Rear Design',
    description: 'Sophisticated LED lighting'
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
    alt: `${vehicle.name} - Interior`,
    category: 'interior',
    title: 'Premium Interior',
    description: 'Luxurious cabin experience'
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true",
    alt: `${vehicle.name} - Technology`,
    category: 'interior',
    title: 'Advanced Technology',
    description: 'Connected intelligence'
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true",
    alt: `${vehicle.name} - Engine`,
    category: 'engine',
    title: 'Efficient Performance',
    description: 'Advanced powertrain technology'
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    alt: `${vehicle.name} - Lifestyle`,
    category: 'lifestyle',
    title: 'Adventure Ready',
    description: 'Perfect for every journey'
  }
];

const categoryColors = {
  exterior: 'bg-blue-500',
  interior: 'bg-purple-500',
  engine: 'bg-orange-500',
  lifestyle: 'bg-green-500'
};

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  
  const images = getGalleryImages(vehicle);
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);
  
  const currentImage = filteredImages[currentIndex];
  
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);
  
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);
  
  // Auto-play functionality
  useEffect(() => {
    if (isAutoplay) {
      const interval = setInterval(goToNext, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoplay, goToNext]);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'Escape':
          e.preventDefault();
          setIsFullscreen(false);
          break;
        case ' ':
          e.preventDefault();
          setIsAutoplay(prev => !prev);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToNext, goToPrevious]);
  
  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50
  });
  
  const categories = [
    { key: 'all', label: 'All Views', count: images.length },
    { key: 'exterior', label: 'Exterior', count: images.filter(img => img.category === 'exterior').length },
    { key: 'interior', label: 'Interior', count: images.filter(img => img.category === 'interior').length },
    { key: 'engine', label: 'Engine', count: images.filter(img => img.category === 'engine').length },
    { key: 'lifestyle', label: 'Lifestyle', count: images.filter(img => img.category === 'lifestyle').length }
  ].filter(cat => cat.count > 0);

  const toggleFavorite = (index: number) => {
    setFavorites(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };
  
  return (
    <>
      <div className="toyota-container mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Vehicle Gallery
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover every detail of the {vehicle.name}
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedCategory(category.key);
                  setCurrentIndex(0);
                }}
                className={`rounded-full ${
                  selectedCategory === category.key 
                    ? 'bg-toyota-red text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
          
          {/* Main Gallery */}
          <Card className="overflow-hidden shadow-xl">
            <div 
              {...swipeHandlers}
              className="relative aspect-video md:aspect-[16/10] bg-gray-100 dark:bg-gray-800 group cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentIndex}-${selectedCategory}`}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={currentImage.url}
                    alt={currentImage.alt}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Controls */}
              {filteredImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/80 backdrop-blur-sm shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoplay(!isAutoplay);
                  }}
                >
                  {isAutoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowThumbnails(!showThumbnails);
                  }}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(currentIndex);
                  }}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(currentIndex) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/80 backdrop-blur-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(true);
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Image Info */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${categoryColors[currentImage.category]} text-white border-0`}>
                        {currentImage.category.charAt(0).toUpperCase() + currentImage.category.slice(1)}
                      </Badge>
                      <span className="text-sm text-white/80">
                        {currentIndex + 1} of {filteredImages.length}
                      </span>
                    </div>
                    {currentImage.title && (
                      <h3 className="text-lg font-bold mb-1">{currentImage.title}</h3>
                    )}
                    {currentImage.description && (
                      <p className="text-sm text-white/90">{currentImage.description}</p>
                    )}
                  </div>
                  
                  {/* Progress Dots */}
                  <div className="flex gap-1">
                    {filteredImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? 'bg-white w-6'
                            : 'bg-white/50 hover:bg-white/80'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(index);
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Thumbnail Strip */}
            {showThumbnails && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {filteredImages.map((image, index) => (
                    <button
                      key={index}
                      className={`flex-shrink-0 w-16 h-10 rounded overflow-hidden border-2 transition-all ${
                        currentIndex === index
                          ? 'border-toyota-red scale-105'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
      
      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="text-white">
                <h3 className="font-bold text-lg">{currentImage.title}</h3>
                <p className="text-sm text-gray-300">{currentIndex + 1} of {filteredImages.length}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-4">
              <motion.img
                key={currentImage.url}
                src={currentImage.url}
                alt={currentImage.alt}
                className="max-w-full max-h-full object-contain"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            {/* Footer Navigation */}
            <div className="flex justify-between items-center p-4 bg-black/80 backdrop-blur-sm">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                disabled={filteredImages.length <= 1}
              >
                <ChevronLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>
              
              <div className="text-white">
                {currentIndex + 1} / {filteredImages.length}
              </div>
              
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                disabled={filteredImages.length <= 1}
              >
                Next
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VehicleGallery;
