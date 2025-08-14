import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Share2,
  Play,
  Pause,
  Eye,
  Sparkles,
  Star,
  Circle,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
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
  category: "signature" | "design" | "craftsmanship" | "innovation" | "performance" | "luxury";
  isPremium?: boolean;
  tags: string[];
}

const BRAND_RED = "from-red-600 to-red-700"; // Toyota primary feel

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const prefersReducedMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedView, setSelectedView] = useState<"holographic" | "constellation" | "infinite">("holographic");
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem("toyota.gallery.favs");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const autoplayRef = useRef<number | null>(null);

  const galleryImages: GalleryImage[] = useMemo(
    () => [
      {
        url: vehicle.image,
        alt: `${vehicle.name} - Signature Elegance`,
        title: "Signature Elegance",
        description: "Where innovation meets timeless design",
        category: "signature",
        isPremium: true,
        tags: ["Signature", "Design", "Elegance"],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
        alt: `${vehicle.name} - Dynamic Silhouette`,
        title: "Dynamic Silhouette",
        description: "Sculptured perfection in motion",
        category: "design",
        tags: ["Aerodynamic", "Sculptured", "Motion"],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
        alt: `${vehicle.name} - Artisan Interior`,
        title: "Artisan Interior",
        description: "Handcrafted luxury, digitally enhanced",
        category: "craftsmanship",
        isPremium: true,
        tags: ["Luxury", "Handcrafted", "Premium"],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true",
        alt: `${vehicle.name} - Future Command`,
        title: "Future Command",
        description: "Your digital gateway to tomorrow",
        category: "innovation",
        tags: ["Technology", "Digital", "Future"],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/27becc9e-3b15-436e-a603-df509955cba9/renditions/e6cec4c7-f5aa-4560-b91f-49ed9ab26956?binary=true&mformat=true",
        alt: `${vehicle.name} - Power Redefined`,
        title: "Power Redefined",
        description: "Engineering excellence in pure form",
        category: "performance",
        tags: ["Power", "Engineering", "Performance"],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
        alt: `${vehicle.name} - Luxury Journey`,
        title: "Luxury Journey",
        description: "Every destination becomes extraordinary",
        category: "luxury",
        isPremium: true,
        tags: ["Journey", "Luxury", "Experience"],
      },
    ],
    [vehicle.image, vehicle.name]
  );

  // Persist favorites
  useEffect(() => {
    try {
      localStorage.setItem("toyota.gallery.favs", JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Autoplay using rAF-friendly timeout loop (more accurate than setInterval)
  useEffect(() => {
    if (!isAutoplay) return;
    let id: number;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      if (elapsed >= 4000) {
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
        start = ts;
      }
      id = requestAnimationFrame(step);
    };
    id = requestAnimationFrame(step);
    autoplayRef.current = id;
    return () => {
      if (autoplayRef.current) cancelAnimationFrame(autoplayRef.current);
    };
  }, [isAutoplay, galleryImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  }, [galleryImages.length]);
  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  // Keyboard navigation only in fullscreen for safety
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") return void (e.preventDefault(), goToPrevious());
      if (e.key === "ArrowRight") return void (e.preventDefault(), goToNext());
      if (e.key === "+" || e.key === "=") return void (e.preventDefault(), setZoom((z) => Math.min(3, z + 0.25)));
      if (e.key === "-" || e.key === "_") return void (e.preventDefault(), setZoom((z) => Math.max(1, z - 0.25)));
      if (e.key === "Escape") return void (e.preventDefault(), setIsFullscreen(false));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isFullscreen, goToNext, goToPrevious]);

  const toggleFavorite = (index: number) =>
    setFavorites((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));

  // --- Views ---
  const HolographicView = () => (
    <div className="relative">
      {/* Ambient radial glows */}
      <div className="pointer-events-none absolute inset-0 [background:radial-gradient(50rem_40rem_at_80%_-10%,rgba(239,68,68,.10),transparent_60%),radial-gradient(30rem_24rem_at_10%_110%,rgba(239,68,68,.08),transparent_60%)]" />

      {/* Grid shimmer (lightweight) */}
      <div className="absolute inset-0 opacity-10 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <div key={i} className="border border-primary/20" />
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        {galleryImages.map((image, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: index * 0.04 }}
            whileHover={prefersReducedMotion ? {} : { y: -6 }}
            className="relative group cursor-pointer rounded-2xl overflow-hidden bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-red-200/50 shadow-[0_10px_30px_-15px_rgba(239,68,68,0.35)]"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => {
              setCurrentIndex(index);
              setIsFullscreen(true);
              setZoom(1);
            }}
          >
            {/* Shine sweep */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute -inset-x-24 -top-1/2 h-full rotate-12 bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </div>

            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src={image.url}
                alt={image.alt}
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                  <div className="flex gap-2">
                    <Badge className={`bg-gradient-to-r ${BRAND_RED} text-white shadow`}>{image.category}</Badge>
                    {image.isPremium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 text-black shadow">Premium</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Toggle favorite"
                      className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(index);
                      }}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(index) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Open fullscreen"
                      className="bg-black/40 border-white/20 text-white hover:bg-black/60 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(index);
                        setIsFullscreen(true);
                        setZoom(1);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                  <h3 className="text-white font-bold text-lg leading-tight tracking-wide">{image.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{image.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {image.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs text-white border-white/30 bg-white/10 backdrop-blur-sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );

  const ConstellationView = () => (
    <div className="relative">
      {/* Starfield */}
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_30%,rgba(239,68,68,.12),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(239,68,68,.08),transparent_40%)]">
        <svg className="absolute inset-0 w-full h-full" aria-hidden>
          {Array.from({ length: 90 }).map((_, i) => (
            <circle key={i} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} r={Math.random() * 1.2 + 0.3} fill="currentColor" className="text-red-300/50" />
          ))}
        </svg>
      </div>

      <div className="relative z-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        {galleryImages.map((image, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsFullscreen(true);
              setZoom(1);
            }}
            whileHover={prefersReducedMotion ? {} : { scale: 1.02 }}
            className="text-left rounded-2xl overflow-hidden border border-red-200/50 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow hover:shadow-red-200/50"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img src={image.url} alt={image.alt} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-white bg-gradient-to-r ${BRAND_RED}`}>
                  <Star className="h-3.5 w-3.5" />
                </span>
                <h4 className="font-semibold">{image.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{image.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const InfiniteView = () => (
    <div className="relative">
      <div className="relative z-10 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-4 sm:gap-6 px-4 sm:px-6 snap-x snap-mandatory">
          {galleryImages.map((image, index) => (
            <motion.div key={index} className="snap-center shrink-0 w-[85vw] sm:w-[60vw] lg:w-[40vw] rounded-3xl overflow-hidden border border-red-200/50 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow" whileHover={prefersReducedMotion ? {} : { y: -4 }}>
              <button className="w-full text-left" onClick={() => { setCurrentIndex(index); setIsFullscreen(true); setZoom(1); }}>
                <div className="aspect-[16/9] overflow-hidden">
                  <img src={image.url} alt={image.alt} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <h4 className="font-semibold">{image.title}</h4>
                  <p className="text-sm text-muted-foreground">{image.description}</p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  // --- Render ---
  return (
    <>
      <div className="w-full mb-8 min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 relative overflow-hidden">
        {/* Subtle top glow */}
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-64 bg-gradient-to-b from-red-500/10 to-transparent blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-10 py-10"
        >
          {/* Header */}
          <div className="text-center space-y-6 relative">
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-5">
                <motion.div className="h-px bg-gradient-to-r from-transparent via-red-600 to-transparent w-24" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }} />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                  <Circle className="h-7 w-7 text-red-600" />
                </motion.div>
                <motion.div className="h-px bg-gradient-to-r from-transparent via-red-600 to-transparent w-24" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8 }} />
              </div>

              <motion.h2 className="text-4xl md:text-6xl font-black tracking-tight" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                Toyota {vehicle.name} <span className={`text-transparent bg-clip-text bg-gradient-to-r ${BRAND_RED}`}>Gallery</span>
              </motion.h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mt-2">
                Experience the craftsmanship, innovation, and performance through a curated visual journey.
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <div className="flex bg-muted/40 backdrop-blur rounded-full p-1 border border-red-200/40">
              <Button variant={selectedView === "holographic" ? "default" : "ghost"} size="sm" onClick={() => setSelectedView("holographic")} className="rounded-full px-5">
                <Sparkles className="h-4 w-4 mr-2" /> Holographic
              </Button>
              <Button variant={selectedView === "constellation" ? "default" : "ghost"} size="sm" onClick={() => setSelectedView("constellation")} className="rounded-full px-5">
                <Star className="h-4 w-4 mr-2" /> Constellation
              </Button>
              <Button variant={selectedView === "infinite" ? "default" : "ghost"} size="sm" onClick={() => setSelectedView("infinite")} className="rounded-full px-5">
                <Circle className="h-4 w-4 mr-2" /> Infinite
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsAutoplay((v) => !v)} className="rounded-full px-5 border-red-200/40">
                {isAutoplay ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />} {isAutoplay ? "Pause" : "Auto Play"}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="px-2 sm:px-4">
            <AnimatePresence mode="wait">
              <motion.div key={selectedView} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.35 }}>
                {selectedView === "holographic" && <HolographicView />}
                {selectedView === "constellation" && <ConstellationView />}
                {selectedView === "infinite" && <InfiniteView />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col bg-black/95" role="dialog" aria-modal>
            {/* Header */}
            <div className="flex justify-between items-center p-3 sm:p-4 bg-gradient-to-b from-black via-black/80 to-transparent">
              <div className="text-white">
                <h3 className="font-semibold text-lg sm:text-xl mb-0.5 tracking-wide">
                  {galleryImages[currentIndex]?.title}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm line-clamp-1">
                  {galleryImages[currentIndex]?.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-white/70 text-xs sm:text-sm font-mono">
                  {String(currentIndex + 1).padStart(2, "0")} / {String(galleryImages.length).padStart(2, "0")}
                </div>
                <Button variant="ghost" size="icon" aria-label="Close" className="text-white hover:bg-white/15 rounded-full" onClick={() => setIsFullscreen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Image stage */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 relative">
              <div className="relative max-w-[95vw] max-h-[80vh]">
                <motion.img
                  key={galleryImages[currentIndex]?.url}
                  src={galleryImages[currentIndex]?.url}
                  alt={galleryImages[currentIndex]?.alt}
                  className="max-w-full max-h-full object-contain rounded-lg select-none"
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.25 }}
                  style={{ transform: `scale(${zoom})` }}
                  draggable={false}
                />

                {/* Nav */}
                {galleryImages.length > 1 && (
                  <>
                    <Button variant="outline" size="icon" aria-label="Previous image" className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 rounded-full" onClick={goToPrevious}>
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" aria-label="Next image" className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 text-white hover:bg-black/70 rounded-full" onClick={goToNext}>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
              </div>

              {/* Quick actions */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full" onClick={() => setZoom((z) => Math.max(1, z - 0.25))}>
                  <ZoomOut className="h-4 w-4 mr-2" /> Zoom-
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full" onClick={() => setZoom((z) => Math.min(3, z + 0.25))}>
                  <ZoomIn className="h-4 w-4 mr-2" /> Zoom+
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full" onClick={() => setZoom(1)}>
                  <Minimize2 className="h-4 w-4 mr-2" /> Reset
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full" onClick={() => toggleFavorite(currentIndex)}>
                  <Heart className={`h-4 w-4 mr-2 ${favorites.includes(currentIndex) ? "fill-red-500 text-red-500" : ""}`} />
                  Favorite
                </Button>
                <Button variant="outline" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full" onClick={() => navigator.share?.({ title: vehicle.name, url: galleryImages[currentIndex]?.url })}>
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
              </div>
            </div>

            {/* Dots */}
            <div className="p-3 sm:p-4">
              <div className="flex justify-center gap-2">
                {galleryImages.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentIndex(idx)} aria-label={`Go to image ${idx + 1}`} className={`transition-all duration-300 ${idx === currentIndex ? "w-10 h-2 bg-red-600 rounded-full" : "w-2 h-2 bg-white/40 hover:bg-white/70 rounded-full"}`} />
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