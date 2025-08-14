
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Heart, 
  Share2,
  Download,
  ZoomIn,
  Grid3X3,
  Maximize2,
  Camera,
  Star,
  Award,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Sparkles,
  Circle
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
  category: 'signature' | 'design' | 'craftsmanship' | 'innovation' | 'performance' | 'luxury';
  isPremium?: boolean;
  tags: string[];
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedView, setSelectedView] = useState<'holographic' | 'constellation' | 'infinite'>('holographic');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(false);

  const galleryImages: GalleryImage[] = [
    {
      url: vehicle.image,
      alt: `${vehicle.name} - Signature Elegance`,
      title: 'Signature Elegance',
      description: 'Where innovation meets timeless design',
      category: 'signature',
      isPremium: true,
      tags: ['Signature', 'Design', 'Elegance']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      alt: `${vehicle.name} - Dynamic Silhouette`,
      title: 'Dynamic Silhouette',
      description: 'Sculptured perfection in motion',
      category: 'design',
      tags: ['Aerodynamic', 'Sculptured', 'Motion']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
      alt: `${vehicle.name} - Artisan Interior`,
      title: 'Artisan Interior',
      description: 'Handcrafted luxury, digitally enhanced',
      category: 'craftsmanship',
      isPremium: true,
      tags: ['Luxury', 'Handcrafted', 'Premium']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true",
      alt: `${vehicle.name} - Future Command`,
      title: 'Future Command',
      description: 'Your digital gateway to tomorrow',
      category: 'innovation',
      tags: ['Technology', 'Digital', 'Future']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true",
      alt: `${vehicle.name} - Power Redefined`,
      title: 'Power Redefined',
      description: 'Engineering excellence in pure form',
      category: 'performance',
      tags: ['Power', 'Engineering', 'Performance']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      alt: `${vehicle.name} - Luxury Journey`,
      title: 'Luxury Journey',
      description: 'Every destination becomes extraordinary',
      category: 'luxury',
      isPremium: true,
      tags: ['Journey', 'Luxury', 'Experience']
    }
  ];

  const toggleFavorite = (index: number) => {
    setFavorites(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);
  
  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

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
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToNext, goToPrevious]);

  const renderHolographicView = () => (
    <div className="relative">
      {/* Holographic Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-primary/20 animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </div>

      {/* Floating Gallery Items */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
        {galleryImages.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50, rotateX: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              rotateX: 0,
              z: hoveredIndex === index ? 50 : 0
            }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5,
              z: 100,
              transition: { duration: 0.3 }
            }}
            className="relative group cursor-pointer perspective-1000"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => {
              setCurrentIndex(index);
              setIsFullscreen(true);
            }}
          >
            {/* Holographic Frame */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-background via-background/90 to-muted/50 backdrop-blur-xl border border-primary/20 shadow-2xl">
              {/* Scanning Line Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-2000 ease-in-out" />
              
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                />
                
                {/* Holographic Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {/* Top Controls */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    {image.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black font-bold shadow-lg">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-black/40 backdrop-blur-md border-white/30 text-white hover:bg-black/60 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(index);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(index) ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-black/40 backdrop-blur-md border-white/30 text-white hover:bg-black/60 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentIndex(index);
                          setIsFullscreen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="space-y-3">
                      <Badge variant="outline" className="text-xs text-white border-white/40 bg-black/20 backdrop-blur-sm">
                        {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                      </Badge>
                      <h3 className="text-white font-bold text-xl leading-tight tracking-wide">
                        {image.title}
                      </h3>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {image.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {image.tags.slice(0, 3).map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs text-white border-white/30 bg-white/10 backdrop-blur-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Glowing Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
            
            {/* Floating Particles */}
            {hoveredIndex === index && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: Math.random() * 300 - 150,
                      y: Math.random() * 300 - 150,
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="w-full mb-8 min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12 py-12"
        >
          {/* Futuristic Header */}
          <div className="text-center space-y-8 relative">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="grid grid-cols-20 grid-rows-10 h-full w-full">
                {Array.from({ length: 200 }).map((_, i) => (
                  <div key={i} className="border border-primary animate-pulse" style={{ animationDelay: `${i * 20}ms` }} />
                ))}
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center space-x-4 mb-6">
                <motion.div 
                  className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-32"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <Circle className="h-8 w-8 text-primary" />
                </motion.div>
                <motion.div 
                  className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-32"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              
              <motion.h2 
                className="text-4xl md:text-6xl lg:text-8xl font-light text-foreground tracking-[0.2em] mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                GALLERY
              </motion.h2>
              
              <motion.p 
                className="text-lg md:text-xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Experience the future of automotive luxury through our quantum-enhanced gallery
              </motion.p>
            </div>
          </div>

          {/* Futuristic Controls */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <div className="flex bg-muted/30 backdrop-blur-lg rounded-full p-1 border border-primary/20">
              <Button
                variant={selectedView === 'holographic' ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedView('holographic')}
                className="rounded-full px-6 py-2"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Holographic
              </Button>
              <Button
                variant={selectedView === 'constellation' ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedView('constellation')}
                className="rounded-full px-6 py-2"
              >
                <Star className="h-4 w-4 mr-2" />
                Constellation
              </Button>
              <Button
                variant={selectedView === 'infinite' ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedView('infinite')}
                className="rounded-full px-6 py-2"
              >
                <Circle className="h-4 w-4 mr-2" />
                Infinite
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoplay(!isAutoplay)}
              className="rounded-full px-6 py-2 bg-background/50 backdrop-blur-sm border-primary/20"
            >
              {isAutoplay ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isAutoplay ? 'Pause' : 'Auto Play'}
            </Button>
          </div>
          
          {/* Gallery Content */}
          <div className="px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedView}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                {renderHolographicView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      
      {/* Enhanced Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Futuristic Header */}
            <div className="flex justify-between items-center p-6 bg-gradient-to-b from-black via-black/90 to-transparent backdrop-blur-sm">
              <div className="text-white">
                <h3 className="font-light text-2xl mb-1 tracking-wide">{galleryImages[currentIndex]?.title}</h3>
                <p className="text-white/70 text-sm">{galleryImages[currentIndex]?.description}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-white/70 text-sm font-mono">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(galleryImages.length).padStart(2, '0')}
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
            
            {/* Image with Holographic Effect */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
              <div className="relative max-w-full max-h-full">
                <motion.img
                  key={galleryImages[currentIndex]?.url}
                  src={galleryImages[currentIndex]?.url}
                  alt={galleryImages[currentIndex]?.alt}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={(e) => e.stopPropagation()}
                />
                
                {/* Navigation */}
                {galleryImages.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 rounded-full"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 rounded-full"
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
            
            {/* Futuristic Footer */}
            <div className="p-6 bg-gradient-to-t from-black via-black/90 to-transparent backdrop-blur-sm">
              <div className="flex justify-center space-x-3 mb-4">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    className={`transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-12 h-2 bg-primary rounded-full'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/60 rounded-full'
                    }`}
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
