
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Sparkles,
  Layers,
  Focus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";

interface VehicleGalleryProps {
  vehicle: VehicleModel;
}

interface GalleryImage {
  url: string;
  alt: string;
  title: string;
  description: string;
  category: 'signature' | 'detail' | 'craftsmanship' | 'innovation' | 'experience' | 'legacy';
  isPremium?: boolean;
  tags: string[];
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'immersive'>('gallery');

  const galleryImages: GalleryImage[] = [
    {
      url: vehicle.image,
      alt: `${vehicle.name} - Signature Presence`,
      title: 'Signature Presence',
      description: 'Where heritage meets tomorrow',
      category: 'signature',
      isPremium: true,
      tags: ['Heritage', 'Design', 'Excellence']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      alt: `${vehicle.name} - Sculptural Excellence`,
      title: 'Sculptural Excellence',
      description: 'Every curve tells a story',
      category: 'craftsmanship',
      tags: ['Craftsmanship', 'Detail', 'Luxury']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
      alt: `${vehicle.name} - Artisan Interior`,
      title: 'Artisan Interior',
      description: 'Crafted for the extraordinary',
      category: 'craftsmanship',
      isPremium: true,
      tags: ['Interior', 'Premium', 'Artisan']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true",
      alt: `${vehicle.name} - Future Command`,
      title: 'Future Command',
      description: 'Intelligence at your fingertips',
      category: 'innovation',
      tags: ['Technology', 'Future', 'Intelligence']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true",
      alt: `${vehicle.name} - Pure Performance`,
      title: 'Pure Performance',
      description: 'Engineering poetry in motion',
      category: 'innovation',
      tags: ['Performance', 'Engineering', 'Power']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      alt: `${vehicle.name} - Infinite Journey`,
      title: 'Infinite Journey',
      description: 'Redefining what's possible',
      category: 'experience',
      isPremium: true,
      tags: ['Experience', 'Journey', 'Freedom']
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoplay || isFullscreen) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % galleryImages.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isAutoplay, isFullscreen, galleryImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);
  
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

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
          setIsAutoplay(!isAutoplay);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToNext, goToPrevious, isAutoplay]);

  const categoryColors = {
    signature: 'from-red-600 to-red-800',
    detail: 'from-blue-600 to-blue-800',
    craftsmanship: 'from-amber-600 to-amber-800',
    innovation: 'from-purple-600 to-purple-800',
    experience: 'from-green-600 to-green-800',
    legacy: 'from-gray-600 to-gray-800'
  };

  return (
    <>
      <div className="w-full mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Futuristic Header */}
          <div className="text-center space-y-6 relative">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            
            <div className="relative z-10">
              <motion.div 
                className="flex items-center justify-center space-x-4 mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-32"></div>
                <motion.div
                  animate={{ 
                    rotate: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <Sparkles className="h-8 w-8 text-primary" />
                </motion.div>
                <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-32"></div>
              </motion.div>
              
              <motion.h2 
                className="text-5xl md:text-7xl font-extralight text-foreground tracking-[0.2em] mb-4"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                GALLERY
              </motion.h2>
              
              <motion.div
                className="text-xl md:text-2xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Experience the future of automotive artistry
                </span>
                <br />
                Every detail captured in stunning clarity
              </motion.div>
            </div>
          </div>

          {/* Futuristic Controls */}
          <motion.div 
            className="flex justify-center items-center space-x-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex bg-black/10 backdrop-blur-md rounded-full p-1 border border-primary/20">
              <Button
                variant={viewMode === 'gallery' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('gallery')}
                className="rounded-full px-6 bg-gradient-to-r from-primary to-primary/80"
              >
                <Layers className="h-4 w-4 mr-2" />
                Gallery
              </Button>
              <Button
                variant={viewMode === 'immersive' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('immersive')}
                className="rounded-full px-6"
              >
                <Eye className="h-4 w-4 mr-2" />
                Immersive
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="rounded-full px-4 border-primary/30 hover:border-primary/50"
            >
              {isAutoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </motion.div>
          
          {/* Gallery Content */}
          <div className="px-4">
            <AnimatePresence mode="wait">
              {viewMode === 'gallery' && (
                <motion.div
                  key="gallery"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {galleryImages.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group cursor-pointer"
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <Card className="overflow-hidden border-0 bg-gradient-to-br from-background to-muted/20 shadow-2xl hover:shadow-3xl transition-all duration-700 group-hover:scale-[1.02]">
                        <div className="relative aspect-[4/3]">
                          <motion.img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                            onClick={() => {
                              setCurrentIndex(index);
                              setIsFullscreen(true);
                            }}
                            whileHover={{ filter: "brightness(1.1)" }}
                          />
                          
                          {/* Holographic Overlay */}
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-700"
                            initial={false}
                            animate={{
                              background: hoveredIndex === index 
                                ? [
                                    "linear-gradient(45deg, rgba(220,38,127,0.2) 0%, transparent 50%, rgba(220,38,127,0.1) 100%)",
                                    "linear-gradient(90deg, rgba(220,38,127,0.1) 0%, transparent 50%, rgba(220,38,127,0.2) 100%)",
                                    "linear-gradient(135deg, rgba(220,38,127,0.2) 0%, transparent 50%, rgba(220,38,127,0.1) 100%)"
                                  ]
                                : "linear-gradient(45deg, transparent 0%, transparent 50%, transparent 100%)"
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          
                          {/* Category Badge */}
                          <div className="absolute top-4 left-4">
                            <Badge 
                              className={`bg-gradient-to-r ${categoryColors[image.category]} text-white border-0 shadow-lg backdrop-blur-sm`}
                            >
                              {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                            </Badge>
                          </div>
                          
                          {/* Premium Badge */}
                          {image.isPremium && (
                            <motion.div 
                              className="absolute top-4 right-4"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black border-0 shadow-lg">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            </motion.div>
                          )}
                          
                          {/* Action Button */}
                          <motion.div 
                            className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(index);
                                setIsFullscreen(true);
                              }}
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </motion.div>
                          
                          {/* Info Overlay */}
                          <motion.div 
                            className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
                            initial={{ y: 20 }}
                            whileHover={{ y: 0 }}
                          >
                            <h3 className="text-white font-bold text-xl mb-2">
                              {image.title}
                            </h3>
                            <p className="text-white/90 text-sm mb-3 line-clamp-2">
                              {image.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {image.tags.slice(0, 3).map((tag, tagIndex) => (
                                <Badge 
                                  key={tagIndex} 
                                  variant="outline" 
                                  className="text-xs text-white/80 border-white/30 bg-white/10 backdrop-blur-sm"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
              
              {viewMode === 'immersive' && (
                <motion.div
                  key="immersive"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="relative"
                >
                  <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-gradient-to-br from-black to-gray-900 shadow-2xl">
                    <motion.img
                      key={galleryImages[currentIndex]?.url}
                      src={galleryImages[currentIndex]?.url}
                      alt={galleryImages[currentIndex]?.alt}
                      className="w-full h-full object-cover"
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8 }}
                      onClick={() => setIsFullscreen(true)}
                    />
                    
                    {/* Navigation */}
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/30 border-white/20 text-white hover:bg-black/50 rounded-full backdrop-blur-md"
                      onClick={goToPrevious}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/30 border-white/20 text-white hover:bg-black/50 rounded-full backdrop-blur-md"
                      onClick={goToNext}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                    
                    {/* Info Panel */}
                    <motion.div 
                      className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                      initial={{ y: 100 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex justify-between items-end">
                        <div>
                          <Badge className={`bg-gradient-to-r ${categoryColors[galleryImages[currentIndex]?.category]} text-white mb-3`}>
                            {galleryImages[currentIndex]?.category.charAt(0).toUpperCase() + galleryImages[currentIndex]?.category.slice(1)}
                          </Badge>
                          <h3 className="text-white font-bold text-3xl mb-2">
                            {galleryImages[currentIndex]?.title}
                          </h3>
                          <p className="text-white/80 text-lg max-w-2xl">
                            {galleryImages[currentIndex]?.description}
                          </p>
                        </div>
                        
                        <Button
                          variant="outline"
                          className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-md"
                          onClick={() => setIsFullscreen(true)}
                        >
                          <Focus className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Thumbnail Navigation */}
                  <div className="flex justify-center space-x-2 mt-6">
                    {galleryImages.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'bg-primary w-8 shadow-lg'
                            : 'bg-muted-foreground/40 hover:bg-muted-foreground/60'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
            <div className="flex justify-between items-center p-8 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-md">
              <div className="text-white">
                <Badge className={`bg-gradient-to-r ${categoryColors[galleryImages[currentIndex]?.category]} text-white mb-2`}>
                  {galleryImages[currentIndex]?.category.charAt(0).toUpperCase() + galleryImages[currentIndex]?.category.slice(1)}
                </Badge>
                <h3 className="font-light text-3xl mb-2">{galleryImages[currentIndex]?.title}</h3>
                <p className="text-white/80 text-lg">{galleryImages[currentIndex]?.description}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-white/70">
                  {currentIndex + 1} of {galleryImages.length}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-full"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
            
            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="relative max-w-full max-h-full">
                <motion.img
                  key={galleryImages[currentIndex]?.url}
                  src={galleryImages[currentIndex]?.url}
                  alt={galleryImages[currentIndex]?.alt}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                {/* Navigation */}
                {galleryImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 rounded-full backdrop-blur-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevious();
                      }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 rounded-full backdrop-blur-md"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-8 bg-gradient-to-t from-black/90 to-transparent backdrop-blur-md">
              <div className="flex justify-center space-x-3">
                {galleryImages.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-white w-10 shadow-lg'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                    whileHover={{ scale: 1.3 }}
                    whileTap={{ scale: 0.8 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VehicleGallery;
