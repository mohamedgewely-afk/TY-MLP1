
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
  Award
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
  category: 'hero' | 'detail' | 'lifestyle' | 'studio';
  isPremium?: boolean;
  tags: string[];
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedView, setSelectedView] = useState<'masonry' | 'grid' | 'carousel'>('masonry');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const galleryImages: GalleryImage[] = [
    {
      url: vehicle.image,
      alt: `${vehicle.name} - Hero Shot`,
      title: 'Signature Profile',
      description: 'The iconic silhouette that defines luxury',
      category: 'hero',
      isPremium: true,
      tags: ['Exterior', 'Profile', 'Signature']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      alt: `${vehicle.name} - Rear Elegance`,
      title: 'Sculpted Rear Design',
      description: 'Every angle crafted to perfection',
      category: 'detail',
      tags: ['Exterior', 'LED', 'Design']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
      alt: `${vehicle.name} - Luxurious Interior`,
      title: 'Artisan Craftsmanship',
      description: 'Where luxury meets innovation',
      category: 'detail',
      isPremium: true,
      tags: ['Interior', 'Luxury', 'Craftsmanship']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true",
      alt: `${vehicle.name} - Technology Hub`,
      title: 'Digital Cockpit',
      description: 'Command center of the future',
      category: 'detail',
      tags: ['Technology', 'Display', 'Innovation']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true",
      alt: `${vehicle.name} - Power & Performance`,
      title: 'Engineering Excellence',
      description: 'Precision meets power',
      category: 'studio',
      tags: ['Engine', 'Performance', 'Engineering']
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      alt: `${vehicle.name} - Lifestyle`,
      title: 'Born for Adventure',
      description: 'Every journey becomes extraordinary',
      category: 'lifestyle',
      isPremium: true,
      tags: ['Lifestyle', 'Adventure', 'Journey']
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

  const renderMasonryView = () => (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
      {galleryImages.map((image, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="break-inside-avoid mb-4"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <Card className="overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br from-background to-muted/20">
            <div className="relative">
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                onClick={() => {
                  setCurrentIndex(index);
                  setIsFullscreen(true);
                }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  {image.isPremium && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black">
                      <Award className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
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
                      className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(index);
                        setIsFullscreen(true);
                      }}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="space-y-2">
                    <Badge variant="secondary" className="text-xs">
                      {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                    </Badge>
                    <h3 className="text-white font-bold text-lg leading-tight">
                      {image.title}
                    </h3>
                    <p className="text-white/90 text-sm line-clamp-2">
                      {image.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {image.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="outline" className="text-xs text-white border-white/30">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <>
      <div className="w-full mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Luxury Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-24"></div>
              <Star className="h-6 w-6 text-primary" />
              <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-24"></div>
            </div>
            <h2 className="text-4xl md:text-6xl font-light text-foreground tracking-wide">
              Gallery
            </h2>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              Every detail captured in stunning clarity, showcasing the artistry of the {vehicle.name}
            </p>
          </div>

          {/* View Controls */}
          <div className="flex justify-center items-center space-x-4">
            <div className="flex bg-muted/50 rounded-full p-1">
              <Button
                variant={selectedView === 'masonry' ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedView('masonry')}
                className="rounded-full px-6"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Masonry
              </Button>
              <Button
                variant={selectedView === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedView('grid')}
                className="rounded-full px-6"
              >
                <Camera className="h-4 w-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>
          
          {/* Gallery Content */}
          <div className="px-4">
            <AnimatePresence mode="wait">
              {selectedView === 'masonry' && (
                <motion.div
                  key="masonry"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderMasonryView()}
                </motion.div>
              )}
              
              {selectedView === 'grid' && (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {galleryImages.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="aspect-square group cursor-pointer"
                        onClick={() => {
                          setCurrentIndex(index);
                          setIsFullscreen(true);
                        }}
                      >
                        <Card className="h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300">
                          <div className="relative h-full">
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white font-semibold text-sm mb-1">
                                  {image.title}
                                </h3>
                                <p className="text-white/80 text-xs line-clamp-2">
                                  {image.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
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
            <div className="flex justify-between items-center p-6 bg-black/90 backdrop-blur-sm">
              <div className="text-white">
                <h3 className="font-light text-2xl mb-1">{galleryImages[currentIndex]?.title}</h3>
                <p className="text-white/70 text-sm">{galleryImages[currentIndex]?.description}</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-white/70 text-sm">
                  {currentIndex + 1} of {galleryImages.length}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
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
                  className="max-w-full max-h-full object-contain"
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70"
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
            <div className="p-6 bg-black/90 backdrop-blur-sm">
              <div className="flex justify-center space-x-2">
                {galleryImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-white w-8'
                        : 'bg-white/40 hover:bg-white/60'
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
