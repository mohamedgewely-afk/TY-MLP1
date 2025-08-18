
import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Award,
  Play,
  ZoomIn,
  Grid3X3,
  Camera,
  Film,
  Share2,
  Download,
  Eye,
  Maximize2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";

interface VehicleGalleryProps {
  vehicle: VehicleModel;
}

interface GalleryImage {
  url: string;
  alt: string;
  title: string;
  description: string;
  category: "hero" | "detail" | "lifestyle" | "studio";
  isPremium?: boolean;
  tags: string[];
  isVideo?: boolean;
}

const TOYOTA_RED = "#CC0000";

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');
  const isMobile = useIsMobile();

  const galleryImages: GalleryImage[] = [
    {
      url: vehicle.image,
      alt: `${vehicle.name} - Hero`,
      title: "Signature Design",
      description: "The iconic silhouette that defines excellence",
      category: "hero",
      isPremium: true,
      tags: ["Exterior", "Hero", "Signature"],
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      alt: `${vehicle.name} - Detail`,
      title: "Crafted Excellence",
      description: "Every detail designed with precision",
      category: "detail",
      tags: ["Exterior", "Design", "Detail"],
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
      alt: `${vehicle.name} - Interior`,
      title: "Luxury Interior",
      description: "Where comfort meets innovation",
      category: "detail",
      isPremium: true,
      tags: ["Interior", "Luxury", "Comfort"],
      isVideo: true,
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true",
      alt: `${vehicle.name} - Technology`,
      title: "Advanced Technology",
      description: "Innovation at your fingertips",
      category: "studio",
      tags: ["Technology", "Digital", "Innovation"],
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true",
      alt: `${vehicle.name} - Performance`,
      title: "Pure Performance",
      description: "Power meets efficiency",
      category: "studio",
      isPremium: true,
      tags: ["Engine", "Performance", "Power"],
      isVideo: true,
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      alt: `${vehicle.name} - Lifestyle`,
      title: "Adventure Awaits",
      description: "Built for every journey",
      category: "lifestyle",
      tags: ["Lifestyle", "Adventure", "Journey"],
    },
  ];

  const categories = ["all", "hero", "detail", "studio", "lifestyle"];
  const filteredImages = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory);

  const toggleFavorite = (index: number) => {
    setFavorites((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  // Swipe functionality
  const swipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 50,
    preventDefaultTouchmoveEvent: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
        case "Escape":
          e.preventDefault();
          setIsFullscreen(false);
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, goToNext, goToPrevious]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 lg:mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="h-1 w-16 bg-gradient-to-r from-transparent to-red-600 mr-6"></div>
              <h1 className="text-3xl lg:text-5xl font-black text-gray-900 tracking-tight">
                VISUAL GALLERY
              </h1>
              <div className="h-1 w-16 bg-gradient-to-l from-transparent to-red-600 ml-6"></div>
            </div>
            <p className="text-xl text-gray-600 font-light mb-8">{vehicle.name}</p>
            
            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentIndex(0);
                  }}
                  className={`px-6 lg:px-8 py-3 lg:py-4 rounded-full font-semibold transition-all duration-300 text-sm lg:text-base shadow-lg ${
                    selectedCategory === category
                      ? "text-white shadow-xl transform scale-105"
                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:shadow-lg"
                  }`}
                  style={selectedCategory === category ? { backgroundColor: TOYOTA_RED } : {}}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
              
              {!isMobile && (
                <Button
                  variant="outline"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'swipe' : 'grid')}
                  className="border-gray-200 text-gray-700 hover:bg-gray-100 rounded-full px-6 py-3 shadow-lg"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  {viewMode === 'grid' ? 'Swipe' : 'Grid'}
                </Button>
              )}
            </div>
          </motion.div>

          {/* Mobile Swipe Cards / Desktop Grid */}
          {(isMobile || viewMode === 'swipe') ? (
            <div className="max-w-7xl mx-auto">
              {/* Main Image Card */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative mb-8"
                ref={swipeRef}
              >
                <div className="relative h-[65vh] lg:h-[75vh] min-h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={filteredImages[currentIndex]?.url}
                    alt={filteredImages[currentIndex]?.alt}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  
                  {/* Premium glass overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                  
                  {/* Floating info card */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            {filteredImages[currentIndex]?.isPremium && (
                              <Badge 
                                className="text-white border-0 text-xs px-3 py-1 font-semibold"
                                style={{ backgroundColor: TOYOTA_RED }}
                              >
                                <Award className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                            {filteredImages[currentIndex]?.isVideo && (
                              <Badge className="bg-blue-600 text-white border-0 text-xs px-3 py-1 font-semibold">
                                <Film className="h-3 w-3 mr-1" />
                                Video
                              </Badge>
                            )}
                            <Badge variant="outline" className="border-white/40 text-white text-xs px-3 py-1 bg-white/10 backdrop-blur-sm">
                              {filteredImages[currentIndex]?.category}
                            </Badge>
                          </div>
                          <h3 className="text-2xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                            {filteredImages[currentIndex]?.title}
                          </h3>
                          <p className="text-gray-200 text-sm lg:text-lg max-w-2xl leading-relaxed">
                            {filteredImages[currentIndex]?.description}
                          </p>
                        </div>
                        
                        <div className="flex gap-3 ml-6">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 h-12 w-12 rounded-full border border-white/20"
                            onClick={() => toggleFavorite(currentIndex)}
                          >
                            <Heart className={`h-5 w-5 ${favorites.includes(currentIndex) ? "fill-red-500 text-red-500" : ""}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 h-12 w-12 rounded-full border border-white/20"
                            onClick={() => setIsFullscreen(true)}
                          >
                            <Maximize2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation arrows for desktop */}
                  {!isMobile && filteredImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white hover:bg-black/80 h-14 w-14 rounded-full border border-white/20"
                        onClick={goToPrevious}
                      >
                        <ChevronLeft className="h-7 w-7" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white hover:bg-black/80 h-14 w-14 rounded-full border border-white/20"
                        onClick={goToNext}
                      >
                        <ChevronRight className="h-7 w-7" />
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Enhanced Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-6 px-2 scrollbar-hide">
                {filteredImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.1, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentIndex(index)}
                    className={`group shrink-0 w-20 h-16 lg:w-28 lg:h-20 rounded-xl overflow-hidden border-3 transition-all duration-500 shadow-lg ${
                      index === currentIndex
                        ? "shadow-xl ring-4 ring-white/50"
                        : "border-white/50 hover:border-white/80 hover:shadow-xl"
                    }`}
                    style={index === currentIndex ? { borderColor: TOYOTA_RED } : {}}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {image.isPremium && (
                        <div className="absolute top-1 right-1">
                          <Award className="h-3 w-3 text-yellow-400" />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Elegant progress indicators for mobile */}
              {isMobile && (
                <div className="flex justify-center gap-3 mt-8">
                  {filteredImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        idx === currentIndex 
                          ? "w-12 shadow-lg ring-2 ring-white/30"
                          : "w-2 bg-gray-300 hover:bg-gray-400 hover:w-6"
                      }`}
                      style={idx === currentIndex ? { backgroundColor: TOYOTA_RED } : {}}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Desktop Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsFullscreen(true);
                  }}
                >
                  <div className="relative h-80 rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-gray-200/50">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="flex items-center gap-2 mb-3">
                        {image.isPremium && (
                          <Badge 
                            className="text-white text-xs border-0 px-3 py-1 font-semibold"
                            style={{ backgroundColor: TOYOTA_RED }}
                          >
                            Premium
                          </Badge>
                        )}
                        {image.isVideo && (
                          <Badge className="bg-blue-600 text-white text-xs border-0 px-3 py-1 font-semibold">Video</Badge>
                        )}
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">{image.title}</h4>
                      <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 leading-relaxed">
                        {image.description}
                      </p>
                    </div>

                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/60 backdrop-blur-xl text-white hover:bg-black/80 h-10 w-10 rounded-full border border-white/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(index);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(index) ? "fill-red-500 text-red-500" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
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
            {/* Premium Header */}
            <div className="flex justify-between items-center p-6 lg:p-8 bg-black/95 backdrop-blur-md border-b border-gray-800/50">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800 lg:hidden rounded-full"
                  onClick={() => setIsFullscreen(false)}
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    {filteredImages[currentIndex]?.title}
                  </h3>
                  <p className="text-gray-400 text-base lg:text-lg">{filteredImages[currentIndex]?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-2xl font-mono font-bold" style={{ color: TOYOTA_RED }}>
                    {String(currentIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="text-gray-500 text-sm">
                    of {String(filteredImages.length).padStart(2, "0")}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800 hidden lg:flex rounded-full h-12 w-12"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Image Container */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
              <motion.img
                key={currentIndex}
                src={filteredImages[currentIndex]?.url}
                alt={filteredImages[currentIndex]?.alt}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />

              {/* Navigation */}
              {filteredImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-8 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white hover:bg-black/80 h-16 w-16 rounded-full border border-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-8 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white hover:bg-black/80 h-16 w-16 rounded-full border border-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>

            {/* Premium Footer */}
            <div className="p-6 lg:p-8 bg-black/95 backdrop-blur-md border-t border-gray-800/50">
              <div className="flex justify-center gap-3">
                {filteredImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 lg:h-3 rounded-full transition-all duration-500 ${
                      idx === currentIndex 
                        ? "w-12 lg:w-16 shadow-lg"
                        : "w-2 lg:w-3 bg-gray-600 hover:bg-gray-500 hover:w-6 lg:hover:w-8"
                    }`}
                    style={idx === currentIndex ? { backgroundColor: TOYOTA_RED } : {}}
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
