
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn, ZoomOut, RotateCcw, Play, Pause, Share2, Bookmark, Grid3X3, Eye, Info, ArrowLeft, ArrowRight } from "lucide-react";
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

// Enhanced gallery images with proper categorization
const getGalleryImages = (vehicle: VehicleModel): ImageData[] => [
  {
    url: vehicle.image,
    alt: `${vehicle.name} - Main View`,
    category: 'exterior',
    title: 'Front View',
    description: 'Bold and dynamic front design'
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
    alt: `${vehicle.name} - Rear View`,
    category: 'exterior',
    title: 'Rear Design',
    description: 'Sleek LED tail lights and aerodynamic profile'
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
    alt: `${vehicle.name} - Interior Dashboard`,
    category: 'interior',
    title: 'Premium Interior',
    description: 'Luxurious cabin with advanced technology'
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true",
    alt: `${vehicle.name} - Infotainment System`,
    category: 'interior',
    title: 'Smart Technology',
    description: 'Connected intelligence at your fingertips'
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true",
    alt: `${vehicle.name} - Hybrid Engine`,
    category: 'engine',
    title: 'Hybrid Powertrain',
    description: 'Advanced hybrid technology for efficiency'
  },
  {
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    alt: `${vehicle.name} - Lifestyle Shot`,
    category: 'lifestyle',
    title: 'Urban Adventure',
    description: 'Perfect companion for city adventures'
  }
];

const categoryColors = {
  exterior: 'from-blue-500 to-cyan-500',
  interior: 'from-purple-500 to-pink-500',
  engine: 'from-orange-500 to-red-500',
  lifestyle: 'from-green-500 to-emerald-500'
};

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  
  const galleryRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const autoplayRef = useRef<NodeJS.Timeout>();
  
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);
  
  const images = getGalleryImages(vehicle);
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory);
  
  const currentImage = filteredImages[currentIndex];
  
  // Preload images for smooth transitions
  const preloadImage = useCallback((url: string) => {
    if (preloadedImages.has(url)) return;
    
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setPreloadedImages(prev => new Set([...prev, url]));
    };
  }, [preloadedImages]);
  
  // Preload adjacent images
  useEffect(() => {
    const preloadIndices = [
      currentIndex - 1,
      currentIndex,
      currentIndex + 1
    ].filter(i => i >= 0 && i < filteredImages.length);
    
    preloadIndices.forEach(i => {
      preloadImage(filteredImages[i].url);
    });
  }, [currentIndex, filteredImages, preloadImage]);
  
  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % filteredImages.length);
    setIsZoomed(false);
    setZoomLevel(1);
  }, [filteredImages.length]);
  
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + filteredImages.length) % filteredImages.length);
    setIsZoomed(false);
    setZoomLevel(1);
  }, [filteredImages.length]);
  
  // Auto-play functionality
  useEffect(() => {
    if (isAutoplay && !isFullscreen) {
      autoplayRef.current = setInterval(goToNext, 4000);
    } else {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    }
    
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
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
          setIsZoomed(false);
          setZoomLevel(1);
          break;
        case ' ':
          e.preventDefault();
          setIsAutoplay(prev => !prev);
          break;
        case 'i':
          e.preventDefault();
          setShowInfo(prev => !prev);
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
  
  // Pan handlers for zoomed images
  const handlePan = (event: any, info: PanInfo) => {
    if (isZoomed) {
      x.set(info.offset.x);
    }
  };
  
  const handlePanEnd = (event: any, info: PanInfo) => {
    if (isZoomed) {
      x.set(0);
      return;
    }
    
    const threshold = 50;
    const velocity = info.velocity.x;
    
    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    x.set(0);
  };
  
  // Zoom functions
  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel * 1.5, 3);
    setZoomLevel(newZoom);
    setIsZoomed(newZoom > 1);
  };
  
  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel / 1.5, 1);
    setZoomLevel(newZoom);
    setIsZoomed(newZoom > 1);
  };
  
  const resetZoom = () => {
    setZoomLevel(1);
    setIsZoomed(false);
    x.set(0);
  };
  
  // Categories
  const categories = [
    { key: 'all', label: 'All Views', count: images.length },
    { key: 'exterior', label: 'Exterior', count: images.filter(img => img.category === 'exterior').length },
    { key: 'interior', label: 'Interior', count: images.filter(img => img.category === 'interior').length },
    { key: 'engine', label: 'Engine', count: images.filter(img => img.category === 'engine').length },
    { key: 'lifestyle', label: 'Lifestyle', count: images.filter(img => img.category === 'lifestyle').length }
  ].filter(cat => cat.count > 0);
  
  return (
    <>
      <div className="toyota-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
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
                className="rounded-full"
              >
                {category.label}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
          
          {/* Main Gallery */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-muted/30 to-background border-0 shadow-2xl">
            <div 
              ref={galleryRef}
              className="relative h-[400px] md:h-[600px] group cursor-pointer"
              onClick={() => setIsFullscreen(true)}
              {...swipeHandlers}
            >
              {/* Main Image */}
              <motion.div
                className="relative w-full h-full overflow-hidden"
                style={{ opacity }}
              >
                <motion.img
                  ref={imageRef}
                  key={currentImage.url}
                  src={currentImage.url}
                  alt={currentImage.alt}
                  className="w-full h-full object-cover transition-transform duration-700"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  drag={isZoomed ? "x" : false}
                  dragConstraints={{ left: -100, right: 100 }}
                  onPan={handlePan}
                  onPanEnd={handlePanEnd}
                  style={{ scale: zoomLevel }}
                />
                
                {/* Loading Overlay */}
                {!preloadedImages.has(currentImage.url) && (
                  <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10" />
              </motion.div>
              
              {/* Navigation Controls */}
              <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:bg-white/90 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  disabled={filteredImages.length <= 1}
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full bg-white/80 backdrop-blur-md border-white/20 shadow-lg hover:bg-white/90 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  disabled={filteredImages.length <= 1}
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Top Controls */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md border-white/20"
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
                  className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md border-white/20"
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
                  className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md border-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(true);
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Image Info */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-end justify-between">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        className={`bg-gradient-to-r ${categoryColors[currentImage.category]} text-white border-0`}
                      >
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
                  
                  {/* Progress Indicator */}
                  <div className="flex gap-1">
                    {filteredImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
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
            <AnimatePresence>
              {showThumbnails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-4 bg-gradient-to-r from-muted/50 to-background/50 backdrop-blur-sm"
                >
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                    {filteredImages.map((image, index) => (
                      <motion.button
                        key={`${image.url}-${index}`}
                        className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                          currentIndex === index
                            ? 'border-primary shadow-lg scale-105'
                            : 'border-transparent hover:border-primary/50'
                        }`}
                        onClick={() => setCurrentIndex(index)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-r ${categoryColors[image.category]} opacity-20`} />
                        {currentIndex === index && (
                          <motion.div
                            layoutId="thumbnail-indicator"
                            className="absolute inset-0 border-2 border-primary rounded-lg"
                          />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
      
      {/* Fullscreen Gallery */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
            onClick={() => {
              setIsFullscreen(false);
              resetZoom();
            }}
          >
            {/* Fullscreen Header */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFullscreen(false);
                    resetZoom();
                  }}
                >
                  <X className="h-6 w-6" />
                </Button>
                
                <div className="text-white">
                  <h3 className="font-bold">{currentImage.title || `${vehicle.name} Gallery`}</h3>
                  <p className="text-sm text-white/80">
                    {currentIndex + 1} of {filteredImages.length}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(!showInfo);
                  }}
                >
                  <Info className="h-5 w-5" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBookmarked(!isBookmarked);
                  }}
                >
                  <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-white' : ''}`} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Share functionality
                  }}
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Fullscreen Image */}
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
              <motion.img
                key={currentImage.url}
                src={currentImage.url}
                alt={currentImage.alt}
                className="max-h-full max-w-full object-contain cursor-grab active:cursor-grabbing"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                drag={isZoomed}
                dragConstraints={{ left: -200, right: 200, top: -200, bottom: 200 }}
                style={{ scale: zoomLevel }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (isZoomed) {
                    resetZoom();
                  } else {
                    handleZoomIn();
                  }
                }}
              />
              
              {/* Zoom Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomOut();
                  }}
                  disabled={zoomLevel <= 1}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                
                <span className="text-white text-sm min-w-[3rem] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleZoomIn();
                  }}
                  disabled={zoomLevel >= 3}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetZoom();
                  }}
                  disabled={zoomLevel === 1}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Fullscreen Navigation */}
            <div className="flex justify-between items-center p-4 bg-gradient-to-t from-black/50 to-transparent">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                disabled={filteredImages.length <= 1}
              >
                <ArrowLeft className="h-5 w-5" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAutoplay(!isAutoplay);
                  }}
                >
                  {isAutoplay ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </div>
              
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                disabled={filteredImages.length <= 1}
              >
                Next
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Image Info Overlay */}
            <AnimatePresence>
              {showInfo && currentImage.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute top-20 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 text-white"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h4 className="font-bold mb-2">{currentImage.title}</h4>
                  <p className="text-sm text-white/90">{currentImage.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VehicleGallery;
