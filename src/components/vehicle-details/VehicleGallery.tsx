import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Award,
  Sparkles,
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
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // index in full galleryImages
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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

  // Filtered list (order preserved). We'll also compute a mapping back to full indices.
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

  // Keyboard navigation (fullscreen only)
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

  // ===== MOBILE CAROUSEL (md:hidden) =====
  const trackRef = useRef<HTMLDivElement | null>(null);

  const scrollToFilteredPos = (pos: number) => {
    if (!trackRef.current) return;
    const child = trackRef.current.children[pos] as HTMLElement | undefined;
    child?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    // also set the global currentIndex to the corresponding full index
    const fullIdx = filteredToFullIndex[pos] ?? 0;
    setCurrentIndex(fullIdx);
  };

  const nextMobile = () => {
    if (filteredImages.length === 0) return;
    const currentPos = Math.max(
      0,
      filteredToFullIndex.indexOf(currentIndex)
    );
    const nextPos = (currentPos + 1) % filteredImages.length;
    scrollToFilteredPos(nextPos);
  };

  const prevMobile = () => {
    if (filteredImages.length === 0) return;
    const currentPos = Math.max(
      0,
      filteredToFullIndex.indexOf(currentIndex)
    );
    const prevPos = (currentPos - 1 + filteredImages.length) % filteredImages.length;
    scrollToFilteredPos(prevPos);
  };

  // Keep currentIndex in sync while user swipes on mobile carousel
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

  return (
    <>
      <div className="w-full min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-500/5 via-transparent to-red-500/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]" />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 p-8 md:p-16"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-center space-x-4 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent w-32" />
                <div className="relative">
                  <Sparkles className="h-8 w-8 text-red-500 animate-pulse" />
                  <div className="absolute inset-0 h-8 w-8 bg-red-500/20 rounded-full blur-lg" />
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-red-500 to-transparent w-32" />
              </div>

              <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-red-200 to-white bg-clip-text text-transparent tracking-wider">
                GALLERY
              </h1>

              <div className="relative">
                <p className="text-2xl md:text-3xl text-gray-300 font-light tracking-wide">
                  {vehicle.name}
                </p>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
              </div>

              <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Experience automotive artistry through our immersive visual journey
              </p>
            </motion.div>
          </div>

 {/* Category Filter (mobile scrollable, centered on md+) */}
<div className="mb-8 md:mb-12">
  {/* Edge fades (mobile only) */}
  <div className="relative md:hidden h-0 pointer-events-none">
    <div className="absolute -top-3 left-0 h-10 w-6 bg-gradient-to-r from-black to-transparent" />
    <div className="absolute -top-3 right-0 h-10 w-6 bg-gradient-to-l from-black to-transparent" />
  </div>

  <div
    className="
      flex gap-2 flex-nowrap overflow-x-auto px-4 -mx-4
      md:mx-0 md:px-0 md:justify-center
      snap-x snap-mandatory
      [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
    "
    aria-label="Gallery categories"
  >
    {categories.map((category) => (
      <motion.button
        key={category}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSelectedCategory(category);
          const fullIdx =
            category === "all"
              ? 0
              : galleryImages.findIndex((img) => img.category === category);
          setCurrentIndex(Math.max(0, fullIdx));
          // snap mobile carousel to first of the new filter
          requestAnimationFrame(() => {
            if (typeof scrollToFilteredPos === "function") scrollToFilteredPos(0);
          });
        }}
        className={`
          shrink-0 snap-start
          px-5 py-2.5 rounded-full text-sm font-medium transition-all
          ${selectedCategory === category
            ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
            : "text-gray-300 bg-white/5 hover:text-white hover:bg-white/10"}
          md:bg-transparent md:border md:border-red-500/20 md:hover:border-red-500/40
        `}
      >
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </motion.button>
    ))}
  </div>
</div>

          {/* === MOBILE: Horizontal Carousel === */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`mobile-${selectedCategory}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="md:hidden relative"
            >
              {/* Track */}
              <div
                ref={trackRef}
                className="flex gap-4 px-4 overflow-x-auto snap-x snap-mandatory scroll-px-4
                           [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {filteredImages.map((image, pos) => {
                  const fullIdx = filteredToFullIndex[pos];
                  const isFav = favorites.includes(fullIdx);
                  return (
                    <div
                      key={`${selectedCategory}-m-${pos}`}
                      className="shrink-0 w-[88vw] snap-center"
                      onClick={() => {
                        setCurrentIndex(fullIdx);
                        setIsFullscreen(true);
                      }}
                    >
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50">
                        <div className="relative h-[62vh] min-h-[360px] overflow-hidden">
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                            {image.isPremium && (
                              <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg shadow-red-500/25">
                                <Award className="h-3 w-3 mr-1" />
                                Premium
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-black/30 backdrop-blur-sm border border-red-500/30 text-white hover:bg-red-500/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(fullIdx);
                              }}
                              aria-label="Toggle favorite"
                            >
                              <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                            </Button>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
                            <Badge variant="outline" className="border-red-500/50 text-red-400 mb-2">
                              {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                            </Badge>
                            <h3 className="text-white font-bold text-xl mb-1">{image.title}</h3>
                            <p className="text-gray-300 text-sm">{image.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile Controls */}
              {filteredImages.length > 1 && (
                <>
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-2 flex justify-between pointer-events-none">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="pointer-events-auto bg-black/50 border border-red-500/30 text-white hover:bg-red-500/20"
                      onClick={prevMobile}
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="pointer-events-auto bg-black/50 border border-red-500/30 text-white hover:bg-red-500/20"
                      onClick={nextMobile}
                      aria-label="Next"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>

                  {/* Dots */}
                  <div className="mt-4 flex justify-center gap-2">
                    {filteredImages.map((_, pos) => {
                      const fullIdx = filteredToFullIndex[pos];
                      const active = currentIndex === fullIdx;
                      return (
                        <button
                          key={pos}
                          onClick={() => scrollToFilteredPos(pos)}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            active ? "bg-red-500 w-8" : "bg-gray-600 w-2"
                          }`}
                          aria-label={`Go to slide ${pos + 1}`}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>

            {/* === DESKTOP/TABLET: Original Grid === */}
            <motion.div
              key={`grid-${selectedCategory}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredImages.map((image, indexInFiltered) => {
                const fullIdx = filteredToFullIndex[indexInFiltered];
                const isFav = favorites.includes(fullIdx);
                return (
                  <motion.div
                    key={`${selectedCategory}-${indexInFiltered}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: indexInFiltered * 0.1, duration: 0.5 }}
                    whileHover={{ y: -10 }}
                    className="group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(fullIdx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onClick={() => {
                      setCurrentIndex(fullIdx);
                      setIsFullscreen(true);
                    }}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-gray-700/50 group-hover:border-red-500/50 transition-all duration-500">
                      {/* Corners */}
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/50 group-hover:border-red-500 transition-colors duration-300" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500/50 group-hover:border-red-500 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500/50 group-hover:border-red-500 transition-colors duration-300" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500/50 group-hover:border-red-500 transition-colors duration-300" />

                      {/* Image */}
                      <div className="relative h-80 overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-500/10" />
                        </div>

                        {/* Top controls */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                          {image.isPremium && (
                            <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg shadow-red-500/25">
                              <Award className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          )}
                          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="bg-black/30 backdrop-blur-sm border border-red-500/30 text-white hover:bg-red-500/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(fullIdx);
                              }}
                              aria-label="Toggle favorite"
                            >
                              <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                            </Button>
                          </div>
                        </div>

                        {/* Content overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                            <Badge variant="outline" className="border-red-500/50 text-red-400 mb-3">
                              {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                            </Badge>
                            <h3 className="text-white font-bold text-xl mb-2 group-hover:text-red-100 transition-colors">
                              {image.title}
                            </h3>
                            <p className="text-gray-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                              {image.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                              {image.tags.slice(0, 3).map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs text-gray-400 border-gray-600">
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
            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-black via-gray-900 to-black border-b border-red-500/20">
              <div className="text-white">
                <h3 className="font-light text-3xl mb-1 bg-gradient-to-r from-white to-red-200 bg-clip-text text-transparent">
                  {galleryImages[currentIndex]?.title}
                </h3>
                <p className="text-gray-400 text-sm">{galleryImages[currentIndex]?.description}</p>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-red-400 text-sm font-mono">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-red-500/20 border border-red-500/30"
                  onClick={() => setIsFullscreen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>

            {/* Image Stage */}
            <div className="flex-1 flex items-center justify-center p-8 relative">
              <div className="relative max-w-full max-h-full">
                <motion.img
                  key={galleryImages[currentIndex]?.url}
                  src={galleryImages[currentIndex]?.url}
                  alt={galleryImages[currentIndex]?.alt}
                  className="max-w-full max-h-full object-contain"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  onClick={(e) => e.stopPropagation()}
                />

                {/* Nav */}
                {galleryImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border border-red-500/30 text-white hover:bg-red-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToPrevious();
                      }}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border border-red-500/30 text-white hover:bg-red-500/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                      }}
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Footer Dots */}
            <div className="p-6 bg-gradient-to-r from-black via-gray-900 to-black border-t border-red-500/20">
              <div className="flex justify-center space-x-3">
                {galleryImages.map((_, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.2 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentIndex ? "bg-red-500 w-8 shadow-lg shadow-red-500/50" : "bg-gray-600 w-2 hover:bg-gray-500"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
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
