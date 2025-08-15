
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
  const [showGrid, setShowGrid] = useState(false);

  const galleryImages: GalleryImage[] = [
    {
      url: vehicle.image,
      alt: `${vehicle.name} - Signature Profile`,
      title: "Signature Profile",
      description: "The iconic silhouette that defines automotive excellence",
      category: "hero",
      isPremium: true,
      tags: ["Exterior", "Profile", "Signature"],
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      alt: `${vehicle.name} - Rear Elegance`,
      title: "Sculpted Excellence",
      description: "Every curve crafted with precision and purpose",
      category: "detail",
      tags: ["Exterior", "Design", "Craftsmanship"],
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
      alt: `${vehicle.name} - Luxurious Interior`,
      title: "Artisan Sanctuary",
      description: "Where luxury meets innovation in perfect harmony",
      category: "detail",
      isPremium: true,
      tags: ["Interior", "Luxury", "Innovation"],
      isVideo: true,
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true",
      alt: `${vehicle.name} - Technology Hub`,
      title: "Digital Command Center",
      description: "The future of automotive intelligence at your fingertips",
      category: "studio",
      tags: ["Technology", "Digital", "Future"],
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true",
      alt: `${vehicle.name} - Power & Performance`,
      title: "Engineering Marvel",
      description: "Pure power meets sustainable innovation",
      category: "studio",
      isPremium: true,
      tags: ["Engine", "Performance", "Innovation"],
      isVideo: true,
    },
    {
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      alt: `${vehicle.name} - Lifestyle Adventure`,
      title: "Born for Discovery",
      description: "Where every journey becomes an extraordinary adventure",
      category: "lifestyle",
      tags: ["Lifestyle", "Adventure", "Freedom"],
    },
  ];

  const categories = ["all", "hero", "detail", "studio", "lifestyle"];

  const filteredImages = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter((img) => img.category === selectedCategory);

  const filteredToFullIndex = filteredImages.map((img) =>
    galleryImages.indexOf(img)
  );

  const toggleFavorite = (fullIndex: number) => {
    setFavorites((prev) =>
      prev.includes(fullIndex)
        ? prev.filter((i) => i !== fullIndex)
        : [...prev, fullIndex]
    );
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollToFilteredPos = (pos: number) => {
    if (!trackRef.current) return;
    const child = trackRef.current.children[pos] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    const fullIdx = filteredToFullIndex[pos] ?? 0;
    setCurrentIndex(fullIdx);
  };

  const nextMobile = () => {
    if (filteredImages.length === 0) return;
    const currentPos = Math.max(0, filteredToFullIndex.indexOf(currentIndex));
    const nextPos = (currentPos + 1) % filteredImages.length;
    scrollToFilteredPos(nextPos);
  };

  const prevMobile = () => {
    if (filteredImages.length === 0) return;
    const currentPos = Math.max(0, filteredToFullIndex.indexOf(currentIndex));
    const prevPos = (currentPos - 1 + filteredImages.length) % filteredImages.length;
    scrollToFilteredPos(prevPos);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const rectTrack = el.getBoundingClientRect();
      const centerX = rectTrack.left + rectTrack.width / 2;

      let nearest = 0;
      let minDist = Infinity;
      Array.from(el.children).forEach((child, i) => {
        const r = (child as HTMLElement).getBoundingClientRect();
        const childCenter = r.left + r.width / 2;
        const d = Math.abs(childCenter - centerX);
        if (d < minDist) {
          minDist = d;
          nearest = i;
        }
      });

      const fullIdx = filteredToFullIndex[nearest] ?? 0;
      setCurrentIndex(fullIdx);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [filteredToFullIndex]);

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
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-950 relative overflow-hidden">
        {/* Luxury Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
          
          {/* Floating particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-red-500/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                }}
              />
            ))}
          </div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="relative z-10 p-4 md:p-8"
        >
          {/* Luxury Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center space-x-6 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent w-24" />
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-red-500 animate-pulse" />
                  <div className="absolute inset-0 h-8 w-8 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent w-24" />
              </div>

              <h1 className="text-4xl md:text-7xl font-black bg-gradient-to-r from-white via-red-200 to-amber-200 bg-clip-text text-transparent tracking-wider drop-shadow-2xl">
                ULTIMATE GALLERY
              </h1>

              <div className="relative">
                <p className="text-xl md:text-3xl text-gray-300 font-light tracking-wide">
                  {vehicle.name}
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              </div>

              <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Experience automotive artistry through immersive visual storytelling
              </p>
            </motion.div>
          </div>

          {/* Luxury Category Filter */}
          <div className="mb-8 md:mb-12">
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {categories.map((category, index) => (
                <motion.button
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(category);
                    const fullIdx = category === "all" ? 0 : galleryImages.findIndex((img) => img.category === category);
                    setCurrentIndex(Math.max(0, fullIdx));
                  }}
                  className={`
                    relative px-6 py-3 rounded-2xl text-sm font-medium transition-all duration-500
                    ${selectedCategory === category
                      ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-2xl shadow-red-500/30"
                      : "text-gray-300 bg-gray-900/50 border border-gray-700/50 hover:text-white hover:bg-gray-800/70 hover:border-red-500/30"}
                    backdrop-blur-xl
                  `}
                >
                  {selectedCategory === category && (
                    <motion.div
                      layoutId="categoryGlow"
                      className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-600/20 to-red-500/20 blur-xl"
                      initial={false}
                    />
                  )}
                  <span className="relative z-10">
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Gallery Controls */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGrid(!showGrid)}
                className="bg-gray-900/50 border-gray-700/50 text-gray-300 hover:bg-gray-800/70 hover:text-white backdrop-blur-xl"
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                {showGrid ? "Timeline" : "Grid"}
              </Button>
            </div>
          </div>

          {/* Mobile Carousel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-${selectedCategory}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="lg:hidden relative mb-8"
            >
              <div
                ref={trackRef}
                className="flex gap-4 px-4 overflow-x-auto snap-x snap-mandatory scroll-px-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {filteredImages.map((image, pos) => {
                  const fullIdx = filteredToFullIndex[pos];
                  const isFav = favorites.includes(fullIdx);
                  return (
                    <motion.div
                      key={`${selectedCategory}-m-${pos}`}
                      className="shrink-0 w-[85vw] snap-center"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => {
                        setCurrentIndex(fullIdx);
                        setIsFullscreen(true);
                      }}
                    >
                      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-2xl border border-gray-700/30 shadow-2xl">
                        <div className="relative h-[50vh] min-h-[300px] overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Luxury overlay gradients */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                          <div className="absolute inset-0 bg-gradient-to-r from-red-900/10 via-transparent to-amber-900/10" />

                          {/* Top controls */}
                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            <div className="flex gap-2">
                              {image.isPremium && (
                                <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white border-0 shadow-lg backdrop-blur-xl">
                                  <Award className="h-3 w-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                              {image.isVideo && (
                                <Badge className="bg-gradient-to-r from-amber-600 to-amber-500 text-white border-0 shadow-lg backdrop-blur-xl">
                                  <Play className="h-3 w-3 mr-1" />
                                  Video
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-black/40 backdrop-blur-xl border border-gray-600/30 text-white hover:bg-red-600/20 hover:border-red-500/50"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(fullIdx);
                              }}
                            >
                              <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                            </Button>
                          </div>

                          {/* Content overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-6">
                            <Badge variant="outline" className="border-red-500/50 text-red-400 mb-3 backdrop-blur-xl">
                              {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                            </Badge>
                            <h3 className="text-white font-bold text-xl mb-2 drop-shadow-lg">{image.title}</h3>
                            <p className="text-gray-300 text-sm leading-relaxed">{image.description}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Mobile navigation */}
              {filteredImages.length > 1 && (
                <>
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-2 flex justify-between pointer-events-none">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-gray-600/30 text-white hover:bg-red-600/20"
                      onClick={prevMobile}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-gray-600/30 text-white hover:bg-red-600/20"
                      onClick={nextMobile}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="mt-6 flex justify-center gap-2">
                    {filteredImages.map((_, pos) => {
                      const fullIdx = filteredToFullIndex[pos];
                      const active = currentIndex === fullIdx;
                      return (
                        <button
                          key={pos}
                          onClick={() => scrollToFilteredPos(pos)}
                          className={`h-2 rounded-full transition-all duration-500 ${
                            active ? "bg-gradient-to-r from-red-500 to-red-400 w-8 shadow-lg shadow-red-500/50" : "bg-gray-600 w-2"
                          }`}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>

            {/* Desktop Grid/Timeline */}
            <motion.div
              key={`grid-${selectedCategory}-${showGrid}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className={`hidden lg:${showGrid ? 'grid grid-cols-3 gap-8' : 'flex flex-col space-y-12'}`}
            >
              {filteredImages.map((image, indexInFiltered) => {
                const fullIdx = filteredToFullIndex[indexInFiltered];
                const isFav = favorites.includes(fullIdx);
                return (
                  <motion.div
                    key={`${selectedCategory}-${indexInFiltered}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: indexInFiltered * 0.1, duration: 0.6 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(fullIdx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      setCurrentIndex(fullIdx);
                      setIsFullscreen(true);
                    }}
                  >
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/60 to-black/80 backdrop-blur-2xl border border-gray-700/30 group-hover:border-red-500/50 transition-all duration-700 shadow-2xl group-hover:shadow-red-500/20">
                      {/* Luxury corner accents */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-red-500/50 group-hover:border-red-400 transition-colors duration-500" />
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red-500/50 group-hover:border-red-400 transition-colors duration-500" />
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-red-500/50 group-hover:border-red-400 transition-colors duration-500" />
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-red-500/50 group-hover:border-red-400 transition-colors duration-500" />

                      <div className="relative h-96 overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />

                        {/* Luxury overlay effects */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-all duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-amber-900/20 opacity-0 group-hover:opacity-100 transition-all duration-700" />

                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-all duration-700" />

                        {/* Top controls */}
                        <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                          <div className="flex gap-2">
                            {image.isPremium && (
                              <Badge className="bg-gradient-to-r from-red-600/90 to-red-500/90 text-white border-0 shadow-xl backdrop-blur-xl">
                                <Award className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                            {image.isVideo && (
                              <Badge className="bg-gradient-to-r from-amber-600/90 to-amber-500/90 text-white border-0 shadow-xl backdrop-blur-xl">
                                <Play className="h-3 w-3 mr-1" />
                                Video
                              </Badge>
                            )}
                          </div>
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-black/40 backdrop-blur-xl border border-gray-600/30 text-white hover:bg-red-600/30 hover:border-red-500/50"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(fullIdx);
                              }}
                            >
                              <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-black/40 backdrop-blur-xl border border-gray-600/30 text-white hover:bg-red-600/30 hover:border-red-500/50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-black/40 backdrop-blur-xl border border-gray-600/30 text-white hover:bg-red-600/30 hover:border-red-500/50"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                            <Badge variant="outline" className="border-red-500/50 text-red-400 mb-4 backdrop-blur-xl">
                              {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                            </Badge>
                            <h3 className="text-white font-bold text-2xl mb-3 group-hover:text-red-100 transition-colors drop-shadow-lg">
                              {image.title}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-700 delay-100">
                              {image.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                              {image.tags.slice(0, 3).map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs text-gray-400 border-gray-600/50 backdrop-blur-xl">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Luxury Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Luxury Header */}
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-black via-gray-900 to-black border-b border-red-500/20 backdrop-blur-xl">
              <div className="text-white">
                <h3 className="font-light text-2xl md:text-4xl mb-2 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                  {galleryImages[currentIndex]?.title}
                </h3>
                <p className="text-gray-400 text-sm md:text-base">{galleryImages[currentIndex]?.description}</p>
              </div>

              <div className="flex items-center space-x-6">
                {galleryImages[currentIndex]?.isVideo && (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-red-500/20 border border-red-500/30 backdrop-blur-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying(!isPlaying);
                      }}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-red-500/20 border border-red-500/30 backdrop-blur-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  </div>
                )}
                <div className="text-red-400 text-sm font-mono bg-red-900/20 px-3 py-1 rounded-full backdrop-blur-xl">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-red-500/20 border border-red-500/30 backdrop-blur-xl"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Image/Video Stage */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
              <div className="relative max-w-full max-h-full">
                <motion.img
                  key={galleryImages[currentIndex]?.url}
                  src={galleryImages[currentIndex]?.url}
                  alt={galleryImages[currentIndex]?.alt}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Navigation */}
                {galleryImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl border border-red-500/30 text-white hover:bg-red-500/20"
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
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-xl border border-red-500/30 text-white hover:bg-red-500/20"
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

            {/* Luxury Footer */}
            <div className="p-6 bg-gradient-to-r from-black via-gray-900 to-black border-t border-red-500/20 backdrop-blur-xl">
              <div className="flex justify-center space-x-3">
                {galleryImages.map((_, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.3 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      idx === currentIndex 
                        ? "bg-gradient-to-r from-red-500 to-red-400 w-12 shadow-lg shadow-red-500/50" 
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
