// ToyotaGalleryFutura.tsx
// Luxury Futurist, Toyota-branded gallery redesign (mobile-first, accessible, fancy AF)
// — Keep all images exactly as provided by the caller.
// — Uses Framer Motion, Tailwind, shadcn/ui Button+Badge, lucide-react icons.
// — Drop-in replacement for your existing VehicleGallery component.
//
// Tailwind tokens (add to your tailwind.config, example):
// theme: {
//   extend: {
//     colors: {
//       brand: {
//         primary: "#EB0A1E", // Toyota Red (official)
//         on: "#0A0A0A",
//         carbon: "#0B0B0C",
//         steel: "#1A1B1E",
//         mist: "#C6C7CB",
//       },
//     },
//     boxShadow: {
//       glow: "0 0 0 1px rgba(235,10,30,.55), 0 0 48px -8px rgba(235,10,30,.45)",
//       innerGlow: "inset 0 0 40px rgba(235,10,30,.25)",
//     },
//     borderRadius: {
//       xl2: "1.25rem",
//     },
//     backdropBlur: {
//       xx: '18px'
//     }
//   }
// }
// Also ensure: darkMode: ["class"], and your app wraps with <html className="dark"> for the dark look.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Award,
  Film,
  Maximize2,
  Grid3X3,
  ArrowLeft,
  Star,
  Sparkles,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";

interface VehicleGalleryProps { vehicle: VehicleModel }

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

const TOYOTA_RED = "#EB0A1E"; // upgraded official Toyota red

// ————————————————————————————
// Small brand components
// ————————————————————————————
const ToyotaMark: React.FC<{ className?: string }> = ({ className }) => (
  <div className={"inline-flex items-center gap-2 " + (className ?? "")}
       aria-label="Toyota brand">
    {/* Stylized ellipse emblem */}
    <span className="relative inline-grid place-items-center w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/0 border border-white/20 shadow-glow">
      <span className="absolute inset-0 rounded-full pointer-events-none" style={{boxShadow: "inset 0 0 24px rgba(235,10,30,.6)"}}/>
      <svg viewBox="0 0 64 64" className="w-5 h-5" aria-hidden>
        <ellipse cx="32" cy="32" rx="20" ry="14" fill="none" stroke={TOYOTA_RED} strokeWidth={3} />
        <ellipse cx="32" cy="32" rx="10" ry="14" fill="none" stroke={TOYOTA_RED} strokeWidth={3} />
        <ellipse cx="32" cy="32" rx="20" ry="6" fill="none" stroke={TOYOTA_RED} strokeWidth={3} />
      </svg>
    </span>
    <span className="font-black tracking-[0.18em] text-white text-xs sm:text-sm">TOYOTA</span>
  </div>
);

const HoloChip: React.FC<{
  active?: boolean;
  label: string;
  onClick?: () => void;
}> = ({ active, label, onClick }) => (
  <button
    onClick={onClick}
    className={[
      "relative group inline-flex items-center rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition-all select-none",
      active
        ? "text-white"
        : "text-gray-300 hover:text-white",
    ].join(" ")}
    aria-pressed={!!active}
  >
    <span
      className={[
        "absolute inset-0 rounded-full border",
        active ? "border-white/40" : "border-white/15",
        "bg-gradient-to-b from-white/10 to-white/5",
        active ? "shadow-glow" : "hover:shadow-innerGlow",
      ].join(" ")}
    />
    <span className="relative z-10 flex items-center gap-2">
      {active && <Sparkles className="w-3.5 h-3.5" aria-hidden />}
      {label}
    </span>
    {active && (
      <motion.span
        layoutId="active-underline"
        className="absolute -bottom-1 left-4 right-4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${TOYOTA_RED}, transparent)` }}
      />
    )}
  </button>
);

const IconGhost: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}> = ({ icon, label, onClick, className }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    aria-label={label}
    className={"h-11 w-11 rounded-full bg-white/10 hover:bg-white/15 text-white border border-white/20 backdrop-blur-xx " + (className ?? "")}
  >
    {icon}
  </Button>
);

// Tilt effect for immersive card (pointer+device tilt)
function useParallaxTilt() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const handle = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1200px) rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`;
    };
    const reset = () => { if (el) el.style.transform = "" };
    el.addEventListener("pointermove", handle);
    el.addEventListener("pointerleave", reset);
    return () => { el.removeEventListener("pointermove", handle); el.removeEventListener("pointerleave", reset) };
  }, []);
  return ref;
}

const categories = ["all", "hero", "detail", "studio", "lifestyle"] as const;

type ViewMode = 'cinematic' | 'grid';

const ToyotaGalleryFutura: React.FC<VehicleGalleryProps> = ({ vehicle }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>("all");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('cinematic');
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

  const filteredImages = useMemo(() => (
    selectedCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory)
  ), [selectedCategory, vehicle?.image]);

  const toggleFavorite = (index: number) => {
    setFavorites((prev) => prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]);
    // micro haptic on mobile (best-effort)
    if (window?.navigator?.vibrate) window.navigator.vibrate(8);
  };

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  // Swipe
  const swipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrevious,
    threshold: 40,
    preventDefaultTouchmoveEvent: false,
  });

  // Key nav in fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      switch (e.key) {
        case "ArrowLeft": e.preventDefault(); goToPrevious(); break;
        case "ArrowRight": e.preventDefault(); goToNext(); break;
        case "Escape": e.preventDefault(); setIsFullscreen(false); break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, goToNext, goToPrevious]);

  // Reset index if filter changes
  useEffect(() => { setCurrentIndex(0) }, [selectedCategory]);

  const tiltRef = useParallaxTilt();

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(235,10,30,.25),transparent_60%),radial-gradient(1200px_600px_at_120%_20%,rgba(255,255,255,.05),transparent_60%),linear-gradient(180deg,#0B0B0C,#0B0B0C)] text-white overflow-hidden">
      {/* Futurist Grid Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 opacity-30 mix-blend-screen">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24px,rgba(255,255,255,.06)_25px),linear-gradient(90deg,transparent_24px,rgba(255,255,255,.06)_25px)] bg-[length:25px_25px]" />
      </div>

      <div className="relative px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
          className="max-w-7xl mx-auto flex flex-col gap-5 sm:gap-6 items-center text-center"
        >
          <ToyotaMark />
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <p className="uppercase tracking-[0.35em] text-[10px] text-white/60">Visual Atelier</p>
            <span className="h-px w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            {vehicle.name}
            <span className="block text-lg sm:text-xl font-medium text-white/60 mt-2">Luxury · Future · Precision</span>
          </h1>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {categories.map((c) => (
              <HoloChip key={c} label={c.charAt(0).toUpperCase() + c.slice(1)} active={selectedCategory===c} onClick={() => setSelectedCategory(c)} />
            ))}
            {!isMobile && (
              <HoloChip
                label={viewMode === 'grid' ? 'Cinematic' : 'Grid'}
                active={false}
                onClick={() => setViewMode(viewMode === 'grid' ? 'cinematic' : 'grid')}
              />
            )}
          </div>
        </motion.header>

        {/* Main */}
        {(isMobile || viewMode === 'cinematic') ? (
          <section className="max-w-7xl mx-auto mt-6 sm:mt-10">
            {/* Primary Cinematic Card */}
            <motion.div
              key={currentIndex}
              ref={swipeRef}
              initial={{ opacity: 0, scale: .98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: .45, ease: "easeOut" }}
              className="relative"
            >
              <div
                ref={tiltRef}
                className="relative h-[64vh] sm:h-[70vh] min-h-[460px] rounded-[22px] overflow-hidden border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,.06)_inset] bg-gradient-to-br from-black/50 to-black/20"
              >
                {/* Image */}
                <motion.img
                  key={filteredImages[currentIndex]?.url}
                  src={filteredImages[currentIndex]?.url}
                  alt={filteredImages[currentIndex]?.alt}
                  className="absolute inset-0 w-full h-full object-cover will-change-transform"
                  initial={{ scale: 1.06, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: .7, ease: [0.16, 1, 0.3, 1] }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg' }}
                />

                {/* Gradient Vignette + glow frame */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/60" />
                <div className="absolute inset-0 ring-1 ring-white/10 rounded-[22px] pointer-events-none" />
                <div className="absolute -inset-1 rounded-[26px] opacity-30 blur-3xl"
                     style={{background: `radial-gradient(800px 200px at 50% 110%, ${TOYOTA_RED}, transparent)`}}/>

                {/* Info Panel */}
                <div className="absolute left-4 right-4 sm:left-6 sm:right-6 bottom-4 sm:bottom-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        {filteredImages[currentIndex]?.isPremium && (
                          <Badge className="bg-white/10 border border-white/20 text-white text-[11px] font-semibold">
                            <Award className="w-3.5 h-3.5 mr-1" /> Premium
                          </Badge>
                        )}
                        {filteredImages[currentIndex]?.isVideo && (
                          <Badge className="bg-blue-600/80 border-0 text-white text-[11px] font-semibold">
                            <Film className="w-3.5 h-3.5 mr-1" /> Video
                          </Badge>
                        )}
                        <Badge variant="outline" className="border-white/30 text-white/90 text-[11px] bg-white/5">
                          {filteredImages[currentIndex]?.category}
                        </Badge>
                      </div>
                      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                        {filteredImages[currentIndex]?.title}
                      </h3>
                      <p className="text-white/70 text-sm sm:text-base max-w-2xl mt-1">
                        {filteredImages[currentIndex]?.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-2 sm:gap-3">
                      <IconGhost
                        icon={<Heart className={"w-5 h-5 " + (favorites.includes(currentIndex)?"fill-red-500 text-red-500":"")} />}
                        label="Favorite"
                        onClick={() => toggleFavorite(currentIndex)}
                      />
                      <IconGhost
                        icon={<Maximize2 className="w-5 h-5" />}
                        label="Fullscreen"
                        onClick={() => setIsFullscreen(true)}
                      />
                    </div>
                  </div>
                </div>

                {/* Cinematic Nav (desktop) */}
                {!isMobile && filteredImages.length > 1 && (
                  <>
                    <IconGhost
                      label="Previous"
                      className="absolute left-5 top-1/2 -translate-y-1/2 h-12 w-12"
                      icon={<ChevronLeft className="w-6 h-6" />}
                      onClick={goToPrevious}
                    />
                    <IconGhost
                      label="Next"
                      className="absolute right-5 top-1/2 -translate-y-1/2 h-12 w-12"
                      icon={<ChevronRight className="w-6 h-6" />}
                      onClick={goToNext}
                    />
                  </>
                )}

                {/* Video affordance */}
                {filteredImages[currentIndex]?.isVideo && (
                  <div className="absolute left-4 top-4 sm:left-auto sm:right-4 sm:top-4">
                    <div className="inline-flex items-center gap-2 rounded-full bg-black/50 border border-white/20 backdrop-blur-xx px-3 py-1.5">
                      <PlayCircle className="w-4 h-4 text-white" />
                      <span className="text-xs text-white/90">Tap to play</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="mt-5 sm:mt-7 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {filteredImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to ${img.title}`}
                  className={[
                    "group shrink-0 w-24 h-16 sm:w-32 sm:h-20 rounded-xl overflow-hidden border",
                    idx===currentIndex ? "border-white/70 shadow-glow" : "border-white/15 hover:border-white/35",
                  ].join(" ")}
                >
                  <div className="relative w-full h-full">
                    <img src={img.url} alt={img.alt}
                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                         onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/placeholder.svg'}}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                    {img.isPremium && <Star className="absolute top-1 right-1 w-4 h-4 text-yellow-400" aria-hidden />}
                  </div>
                </button>
              ))}
            </div>

            {/* Mobile progress dots */}
            {isMobile && (
              <div className="mt-4 flex justify-center gap-2">
                {filteredImages.map((_, i) => (
                  <button key={i} onClick={() => setCurrentIndex(i)} aria-label={`Slide ${i+1}`}
                          className={"h-1.5 rounded-full transition-all " + (i===currentIndex?"w-10" : "w-2 bg-white/40 hover:w-6")}
                          style={i===currentIndex ? { backgroundColor: TOYOTA_RED } : {}}/>
                ))}
              </div>
            )}
          </section>
        ) : (
          // Grid view (desktop delight)
          <section className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((img, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, type: 'spring', stiffness: 100, damping: 18 }}
                className="group relative cursor-pointer rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20"
                onClick={() => { setCurrentIndex(index); setIsFullscreen(true) }}
              >
                <img src={img.url} alt={img.alt} className="h-72 w-full object-cover group-hover:scale-[1.06] transition-transform duration-700" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/placeholder.svg'}} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center gap-2 mb-2">
                    {img.isPremium && <Badge className="bg-white/10 border border-white/20 text-[11px]">Premium</Badge>}
                    {img.isVideo && <Badge className="bg-blue-600/80 border-0 text-[11px]">Video</Badge>}
                  </div>
                  <h4 className="text-white font-bold text-lg">{img.title}</h4>
                  <p className="text-white/70 text-sm line-clamp-2">{img.description}</p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <IconGhost
                    icon={<Heart className={"w-4 h-4 "+(favorites.includes(index)?"fill-red-500 text-red-500":"")} />}
                    label="Favorite"
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(index) }}
                  />
                </div>
              </motion.article>
            ))}
          </section>
        )}
      </div>

      {/* Fullscreen Immersion */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xx flex flex-col"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" aria-label="Close" className="lg:hidden text-white hover:bg-white/10 rounded-full" onClick={() => setIsFullscreen(false)}>
                  <ArrowLeft className="w-6 h-6" />
                </Button>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold">{filteredImages[currentIndex]?.title}</h3>
                  <p className="text-white/70 text-sm sm:text-base">{filteredImages[currentIndex]?.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div className="text-center">
                  <span className="text-xl sm:text-2xl font-mono font-bold" style={{ color: TOYOTA_RED }}>{String(currentIndex + 1).padStart(2, '0')}</span>
                  <div className="text-white/50 text-xs">of {String(filteredImages.length).padStart(2, '0')}</div>
                </div>
                <Button variant="ghost" size="icon" aria-label="Close" className="hidden lg:flex text-white hover:bg-white/10 rounded-full h-11 w-11" onClick={() => setIsFullscreen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Media */}
            <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={currentIndex}
                src={filteredImages[currentIndex]?.url}
                alt={filteredImages[currentIndex]?.alt}
                className="max-w-full max-h-full object-contain rounded-xl shadow-glow"
                initial={{ scale: 0.97, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: .35 }}
                onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/placeholder.svg'}}
              />

              {filteredImages.length > 1 && (
                <>
                  <IconGhost
                    label="Previous"
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12"
                    icon={<ChevronLeft className="w-6 h-6" />}
                    onClick={goToPrevious}
                  />
                  <IconGhost
                    label="Next"
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12"
                    icon={<ChevronRight className="w-6 h-6" />}
                    onClick={goToNext}
                  />
                </>
              )}
            </div>

            {/* Footer dots */}
            <div className="px-4 sm:px-6 lg:px-10 py-4 border-t border-white/10">
              <div className="flex justify-center gap-2 sm:gap-3">
                {filteredImages.map((_, idx) => (
                  <button key={idx} onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx) }} aria-label={`Go to slide ${idx+1}`}
                          className={"h-2 rounded-full transition-all "+(idx===currentIndex?"w-10 sm:w-14" : "w-2 bg-white/40 hover:w-6")}
                          style={idx===currentIndex ? { backgroundColor: TOYOTA_RED } : {}}/>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToyotaGalleryFutura;
