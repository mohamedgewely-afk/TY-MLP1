
import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Award,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Share2,
  ZoomIn,
  Grid3X3,
  Eye,
  Camera,
  Film,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";

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

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('carousel');

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />
          
          {/* Floating orbs */}
          <div className="absolute inset-0">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{
                  duration: 6 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 6,
                }}
              />
            ))}
          </div>
          
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        <div className="relative z-10 p-4 lg:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <Camera className="h-8 w-8 text-blue-400 mr-4" />
              <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                VISUAL GALLERY
              </h1>
              <Camera className="h-8 w-8 text-blue-400 ml-4" />
            </div>
            <p className="text-xl text-gray-300 mb-8">{vehicle.name}</p>
            
            {/* Controls */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentIndex(0);
                  }}
                  className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 border border-gray-600/50"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'carousel' : 'grid')}
                className="bg-gray-800/60 border-gray-600/50 text-gray-300 hover:bg-gray-700/70"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                {viewMode === 'grid' ? 'Carousel' : 'Grid'}
              </Button>
            </div>
          </motion.div>

          {/* Main Gallery */}
          {viewMode === 'carousel' ? (
            <div className="max-w-6xl mx-auto">
              {/* Main Image */}
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-8"
              >
                <div className="relative h-[70vh] min-h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 shadow-2xl">
                  <img
                    src={filteredImages[currentIndex]?.url}
                    alt={filteredImages[currentIndex]?.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', filteredImages[currentIndex]?.url);
                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTEyIDE3SDE2TTE2IDlIOEw4IDE3SDE2WiIgc3Ryb2tlPSIjOUM5Qzk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                    }}
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  
                  {/* Image info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          {filteredImages[currentIndex]?.isPremium && (
                            <Badge className="bg-gradient-to-r from-amber-600 to-amber-500 text-white">
                              <Award className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          {filteredImages[currentIndex]?.isVideo && (
                            <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white">
                              <Film className="h-3 w-3 mr-1" />
                              Video
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-blue-500/50 text-blue-300">
                            {filteredImages[currentIndex]?.category}
                          </Badge>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {filteredImages[currentIndex]?.title}
                        </h3>
                        <p className="text-gray-300 text-lg max-w-2xl">
                          {filteredImages[currentIndex]?.description}
                        </p>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-black/40 backdrop-blur-xl text-white hover:bg-blue-600/30"
                          onClick={() => toggleFavorite(currentIndex)}
                        >
                          <Heart className={`h-5 w-5 ${favorites.includes(currentIndex) ? "fill-red-500 text-red-500" : ""}`} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-black/40 backdrop-blur-xl text-white hover:bg-blue-600/30"
                          onClick={() => setIsFullscreen(true)}
                        >
                          <ZoomIn className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Navigation arrows */}
                  {filteredImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white hover:bg-blue-600/30"
                        onClick={goToPrevious}
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white hover:bg-blue-600/30"
                        onClick={goToNext}
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-4">
                {filteredImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setCurrentIndex(index)}
                    className={`shrink-0 w-24 h-16 lg:w-32 lg:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      index === currentIndex
                        ? "border-blue-500 shadow-lg shadow-blue-500/30"
                        : "border-gray-600/50 hover:border-gray-500/70"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTEyIDE3SDE2TTE2IDlIOEw4IDE3SDE2WiIgc3Ryb2tlPSIjOUM5Qzk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                      }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsFullscreen(true);
                  }}
                >
                  <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 shadow-xl group-hover:shadow-2xl group-hover:border-blue-500/50 transition-all duration-300">
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTEyIDE3SDE2TTE2IDlIOEw4IDE3SDE2WiIgc3Ryb2tlPSIjOUM5Qzk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        {image.isPremium && (
                          <Badge className="bg-amber-600 text-white text-xs">Premium</Badge>
                        )}
                        {image.isVideo && (
                          <Badge className="bg-red-600 text-white text-xs">Video</Badge>
                        )}
                      </div>
                      <h4 className="text-white font-semibold">{image.title}</h4>
                      <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                        {image.description}
                      </p>
                    </div>

                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-black/60 backdrop-blur-xl text-white hover:bg-blue-600/30 h-8 w-8"
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
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-black to-gray-900 border-b border-gray-800">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {filteredImages[currentIndex]?.title}
                </h3>
                <p className="text-gray-400">{filteredImages[currentIndex]?.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-blue-400 font-mono">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(filteredImages.length).padStart(2, "0")}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-gray-800"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
              <motion.img
                key={currentIndex}
                src={filteredImages[currentIndex]?.url}
                alt={filteredImages[currentIndex]?.alt}
                className="max-w-full max-h-full object-contain rounded-lg"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMiA5VjEzTTEyIDE3SDE2TTE2IDlIOEw4IDE3SDE2WiIgc3Ryb2tlPSIjOUM5Qzk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K';
                }}
              />

              {/* Navigation */}
              {filteredImages.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white hover:bg-blue-600/30"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl text-white hover:bg-blue-600/30"
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

            {/* Footer */}
            <div className="p-6 bg-gradient-to-r from-black to-gray-900 border-t border-gray-800">
              <div className="flex justify-center gap-2">
                {filteredImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex 
                        ? "bg-blue-500 w-8" 
                        : "bg-gray-600 w-2 hover:bg-gray-500"
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
