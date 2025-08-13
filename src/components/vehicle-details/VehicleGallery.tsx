
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  Play, 
  Pause, 
  Eye, 
  Grid3X3, 
  Heart, 
  Share2,
  Download,
  ZoomIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";

interface VehicleGalleryProps {
  vehicle: VehicleModel;
}

interface ImageData {
  url: string;
  alt: string;
  category: 'exterior' | 'interior' | 'engine' | 'lifestyle';
  title: string;
  description: string;
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const images: ImageData[] = [
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

  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);
  
  const currentImage = filteredImages[currentIndex];

  // Handle loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);
  
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoplay && !isFullscreen) {
      const interval = setInterval(goToNext, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoplay, isFullscreen, goToNext]);

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

  if (isLoading) {
    return (
      <div className="w-full mb-8">
        <div className="animate-pulse space-y-6">
          <div className="text-center">
            <div className="h-8 bg-muted rounded w-48 mx-auto mb-2"></div>
            <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
          </div>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-muted rounded-full w-20"></div>
            ))}
          </div>
          <div className="aspect-video bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Vehicle Gallery
            </h2>
            <p className="text-muted-foreground">
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
                className={`rounded-full transition-all ${
                  selectedCategory === category.key 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground hover:border-primary/50'
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
          <Card className="overflow-hidden shadow-lg">
            <div className="relative aspect-video bg-muted group cursor-pointer" onClick={() => setIsFullscreen(true)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentIndex}-${selectedCategory}`}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {currentImage && (
                    <>
                      <img
                        src={currentImage.url}
                        alt={currentImage.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Controls */}
              {filteredImages.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
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
                    className="rounded-full bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
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
                  className="rounded-full bg-white/90 hover:bg-white shadow-md"
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
                  className="rounded-full bg-white/90 hover:bg-white shadow-md"
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
                  className="rounded-full bg-white/90 hover:bg-white shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(true);
                  }}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Image Info */}
              {currentImage && (
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white">
                      <Badge className="mb-2 bg-primary">
                        {currentImage.category.charAt(0).toUpperCase() + currentImage.category.slice(1)}
                      </Badge>
                      <h3 className="font-semibold text-sm mb-1">{currentImage.title}</h3>
                      <p className="text-xs text-white/90">{currentImage.description}</p>
                    </div>
                    
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2">
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
              )}
            </div>
            
            {/* Thumbnail Grid */}
            <div className="p-4 bg-muted/30">
              <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                {filteredImages.map((image, index) => (
                  <button
                    key={index}
                    className={`aspect-video rounded overflow-hidden border-2 transition-all hover:scale-105 ${
                      currentIndex === index
                        ? 'border-primary shadow-md'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && currentImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-black/90 backdrop-blur-sm">
              <div className="text-white">
                <h3 className="font-bold text-lg">{currentImage.title}</h3>
                <p className="text-sm text-white/70">{currentIndex + 1} of {filteredImages.length}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download className="h-5 w-5" />
                </Button>
                
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
            <div className="flex justify-between items-center p-4 bg-black/90 backdrop-blur-sm">
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
              
              <div className="text-white text-sm font-medium">
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
