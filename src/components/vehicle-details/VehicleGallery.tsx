import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Maximize2,
  X,
  Play,
  Grid3X3,
  Eye,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";

/** ─────────────────────────────────────────────────
 *  Props & local types (unchanged)
 *  ───────────────────────────────────────────────── */
interface VehicleGalleryProps {
  vehicle: VehicleModel;
}

interface GalleryImage {
  url: string;
  alt: string;
  title: string;
  description: string;
  category: "exterior" | "interior" | "technology" | "lifestyle";
  isVideo?: boolean;
  isPremium?: boolean;
}

/** ─────────────────────────────────────────────────
 *  Component
 *  ───────────────────────────────────────────────── */
const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const isMobile = useIsMobile();

  // STATE
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"swipe" | "grid">("swipe");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null); // desktop filmstrip hover preview

  // DATA (same shape you had)
  const galleryImages: GalleryImage[] = useMemo(
    () => [
      {
        url: vehicle.image,
        alt: `${vehicle.name} - Main`,
        title: "Exterior Design",
        description: "Distinctive design meets premium craftsmanship",
        category: "exterior",
        isPremium: true,
      },
      {
        url: "https://images.unsplash.com/photo-1549399734-eb4bb52aa02d?w=1600&h=1000&fit=crop",
        alt: `${vehicle.name} - Interior`,
        title: "Premium Interior",
        description: "Luxurious comfort with advanced technology",
        category: "interior",
        isPremium: true,
      },
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&h=1000&fit=crop",
        alt: `${vehicle.name} - Technology`,
        title: "Advanced Technology",
        description: "Cutting-edge features for modern driving",
        category: "technology",
        isVideo: true,
      },
      {
        url: "https://images.unsplash.com/photo-1518965449314-2c4dc77b3b3a?w=1600&h=1000&fit=crop",
        alt: `${vehicle.name} - Lifestyle`,
        title: "Active Lifestyle",
        description: "Built for adventure and everyday excellence",
        category: "lifestyle",
      },
    ],
    [vehicle]
  );

  const categories = ["all", "exterior", "interior", "technology", "lifestyle"];

  const filteredImages = useMemo(
    () =>
      selectedCategory === "all"
        ? galleryImages
        : galleryImages.filter((img) => img.category === selectedCategory),
    [galleryImages, selectedCategory]
  );

  // BEHAVIOR
  const goToNext = useCallback(() => {
    if (!filteredImages.length) return;
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const goToPrevious = useCallback(() => {
    if (!filteredImages.length) return;
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  const toggleFavorite = (index: number) => {
    setFavorites((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  // Swipe (mobile)
  const swipeHandlers = useSwipeable({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 30, // snappier for mobile
  });

  // Keyboard in fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsFullscreen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, goToNext, goToPrevious]);

  // Reset index when category changes
  useEffect(() => setCurrentIndex(0), [selectedCategory]);

  /** ───────────────────────────────────────────────
   *  MOBILE — improved polish
   *  ─────────────────────────────────────────────── */
  const MobileView = (
    <div className="space-y-6">
      {/* HERO (swipe) */}
      <motion.div
        key={`m-${currentIndex}-${selectedCategory}`}
        {...swipeHandlers}
        className="relative aspect-video bg-white rounded-2xl overflow-hidden shadow-xl"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <img
          src={filteredImages[currentIndex]?.url}
          alt={filteredImages[currentIndex]?.alt}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Soft gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent pointer-events-none" />

        {/* Copy + actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1.5">
                {filteredImages[currentIndex]?.isPremium && (
                  <Badge className="bg-[#EB0A1E] h-5 px-2">
                    <Star className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
                {filteredImages[currentIndex]?.isVideo && (
                  <Badge variant="secondary" className="h-5 px-2">
                    <Play className="w-3 h-3 mr-1" />
                    Video
                  </Badge>
                )}
                <Badge variant="outline" className="h-5 px-2 text-white border-white/30">
                  {filteredImages[currentIndex]?.category}
                </Badge>
              </div>
              <h3 className="text-xl font-bold truncate">{filteredImages[currentIndex]?.title}</h3>
              <p className="text-white/90 text-xs line-clamp-2">{filteredImages[currentIndex]?.description}</p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleFavorite(currentIndex)}
                className="h-9 w-9 text-white hover:bg-white/15"
                aria-label="Favorite"
              >
                <Heart
                  className={`w-5 h-5 ${
                    favorites.includes(currentIndex) ? "fill-[#EB0A1E] text-[#EB0A1E]" : ""
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(true)}
                className="h-9 w-9 text-white hover:bg-white/15"
                aria-label="Fullscreen"
              >
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop arrows hidden on mobile by parent logic */}
      </motion.div>

      {/* Thumb reel — bigger tap targets */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filteredImages.map((image, index) => {
          const active = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={[
                "relative flex-shrink-0 rounded-lg overflow-hidden",
                "w-24 h-16",
                active ? "ring-2 ring-[#EB0A1E]" : "border border-gray-200",
              ].join(" ")}
              aria-pressed={active}
              aria-label={`Show ${image.title}`}
            >
              <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              {image.isPremium && (
                <Star className="absolute top-1 right-1 w-3 h-3 text-[#EB0A1E] fill-current" />
              )}
            </button>
          );
        })}
      </div>

      {/* Progress pills (cleaner than dots) */}
      <div className="flex justify-center gap-1.5">
        {filteredImages.map((_, index) => {
          const active = index === currentIndex;
          return (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={[
                "h-1.5 rounded-full transition-all",
                active ? "w-8 bg-[#EB0A1E]" : "w-3 bg-gray-300",
              ].join(" ")}
              aria-label={`Go to ${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );

  /** ───────────────────────────────────────────────
   *  DESKTOP — Pro layout (hero + vertical filmstrip)
   *  ─────────────────────────────────────────────── */
  const DesktopPro = (
    <div className="grid grid-cols-12 gap-6 items-start">
      {/* Left: Hero */}
      <div className="col-span-12 lg:col-span-9 xl:col-span-9">
        <motion.div
          key={`d-${hoverIndex ?? currentIndex}-${selectedCategory}`}
          className="relative aspect-[16/9] bg-white rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <img
            src={filteredImages[hoverIndex ?? currentIndex]?.url}
            alt={filteredImages[hoverIndex ?? currentIndex]?.alt}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
          {/* Overlay copy */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-start justify-between">
              <div className="max-w-[70%]">
                <div className="flex items-center gap-2 mb-1">
                  {filteredImages[currentIndex]?.isPremium && (
                    <Badge className="bg-[#EB0A1E]">Premium</Badge>
                  )}
                  {filteredImages[currentIndex]?.isVideo && (
                    <Badge variant="secondary">
                      <Play className="w-3 h-3 mr-1" />
                      Video
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-white border-white/30">
                    {filteredImages[currentIndex]?.category}
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold leading-tight">
                  {filteredImages[hoverIndex ?? currentIndex]?.title}
                </h3>
                <p className="text-white/90 text-sm">
                  {filteredImages[hoverIndex ?? currentIndex]?.description}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(currentIndex)}
                  className="text-white hover:bg-white/15"
                  aria-label="Favorite"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      favorites.includes(currentIndex) ? "fill-[#EB0A1E] text-[#EB0A1E]" : ""
                    }`}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(true)}
                  className="text-white hover:bg-white/15"
                  aria-label="Fullscreen"
                >
                  <Maximize2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Arrows */}
          {filteredImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setHoverIndex(null);
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/15 bg-black/20"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setHoverIndex(null);
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/15 bg-black/20"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}
        </motion.div>
      </div>

      {/* Right: Vertical filmstrip */}
      <div className="col-span-12 lg:col-span-3 xl:col-span-3">
        <div className="sticky top-24 space-y-3 max-h-[70vh] overflow-auto pr-2">
          {/* Category chips */}
          <div className="flex flex-wrap gap-2 pb-1 border-b border-gray-200/70 mb-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={[
                    "px-3 py-1.5 rounded-full text-sm capitalize",
                    active ? "bg-[#EB0A1E] text-white" : "bg-gray-100 hover:bg-gray-200",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Thumbs — hover to preview, click to set */}
          {filteredImages.map((img, idx) => {
            const active = idx === currentIndex;
            return (
              <button
                key={idx}
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
                onFocus={() => setHoverIndex(idx)}
                onBlur={() => setHoverIndex(null)}
                onClick={() => setCurrentIndex(idx)}
                className={[
                  "group relative w-full aspect-[16/10] rounded-xl overflow-hidden text-left",
                  active ? "ring-2 ring-[#EB0A1E]" : "border border-gray-200",
                ].join(" ")}
                aria-pressed={active}
                aria-label={`Show ${img.title}`}
              >
                <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="text-[11px] text-white/95 bg-black/40 rounded-full px-2 py-0.5">
                    {img.title}
                  </span>
                  {img.isPremium && (
                    <Star className="w-3.5 h-3.5 text-[#EB0A1E] fill-current drop-shadow" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  /** ───────────────────────────────────────────────
   *  GRID (desktop alt view) – unchanged logic
   *  ─────────────────────────────────────────────── */
  const DesktopGrid = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredImages.map((image, index) => (
        <motion.div
          key={index}
          className="group relative aspect-video bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => {
            setCurrentIndex(index);
            setIsFullscreen(true);
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.06 }}
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <div className="flex items-center gap-2 mb-2">
              {image.isPremium && <Badge className="bg-[#EB0A1E] text-xs">Premium</Badge>}
              {image.isVideo && <Badge variant="secondary" className="text-xs">Video</Badge>}
            </div>
            <h4 className="font-bold text-lg">{image.title}</h4>
            <p className="text-white/90 text-sm">{image.description}</p>
          </div>

          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(index);
              }}
              className="text-white hover:bg-white/20 bg-black/20"
              aria-label="Favorite"
            >
              <Heart className={`w-4 h-4 ${favorites.includes(index) ? "fill-[#EB0A1E] text-[#EB0A1E]" : ""}`} />
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );

  /** ───────────────────────────────────────────────
   *  RENDER
   *  ─────────────────────────────────────────────── */
  return (
    <div className="bg-gray-50 py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-3">
            {vehicle.name} Gallery
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Swipe on mobile. On desktop, enjoy a pro filmstrip experience.
          </p>
        </div>

        {/* Category Filter (same API, cleaner spacing) */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8">
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <Button
                key={category}
                variant={active ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`capitalize ${
                  active ? "bg-[#EB0A1E] hover:bg-[#EB0A1E]/90" : "hover:bg-[#EB0A1E]/10"
                }`}
                aria-pressed={active}
              >
                {category}
              </Button>
            );
          })}
        </div>

        {/* Desktop: view toggle */}
        {!isMobile && (
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="bg-white rounded-lg border p-1">
              <Button
                variant={viewMode === "swipe" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("swipe")}
                className={viewMode === "swipe" ? "bg-[#EB0A1E] hover:bg-[#EB0A1E]/90" : ""}
                aria-pressed={viewMode === "swipe"}
              >
                <Eye className="w-4 h-4 mr-2" />
                Filmstrip
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "bg-[#EB0A1E] hover:bg-[#EB0A1E]/90" : ""}
                aria-pressed={viewMode === "grid"}
              >
                <Grid3X3 className="w-4 h-4 mr-2" />
                Grid
              </Button>
            </div>
          </div>
        )}

        {/* Main */}
        {isMobile ? (
          MobileView
        ) : viewMode === "swipe" ? (
          DesktopPro
        ) : (
          DesktopGrid
        )}

        {/* Fullscreen */}
        <AnimatePresence>
          {isFullscreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 flex flex-col"
              onClick={() => setIsFullscreen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Fullscreen gallery view"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-white/10">
                <div>
                  <h3 className="text-white text-xl font-bold">
                    {filteredImages[currentIndex]?.title}
                  </h3>
                  <p className="text-white/70 text-sm">
                    {filteredImages[currentIndex]?.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-white text-sm">
                    {currentIndex + 1} / {filteredImages.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(false)}
                    className="text-white hover:bg-white/10"
                    aria-label="Close fullscreen"
                  >
                    <X className="w-6 h-6" />
                  </Button>
                </div>
              </div>

              {/* Main */}
              <div
                className="flex-1 flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.img
                  key={currentIndex}
                  src={filteredImages[currentIndex]?.url}
                  alt={filteredImages[currentIndex]?.alt}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  initial={{ scale: 0.98, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                />

                {/* Navigation */}
                {filteredImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 bg-black/20"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 bg-black/20"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </div>

              {/* Footer pills */}
              <div className="p-4 border-t border-white/10">
                <div className="flex justify-center gap-1.5">
                  {filteredImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(index);
                      }}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentIndex ? "w-8 bg-[#EB0A1E]" : "w-3 bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`Go to ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VehicleGallery;
