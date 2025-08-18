import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Play,
  Grid3X3,
  Eye,
  Star,
  Heart,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";

/* ─────────────────────────────────────────
   Types
─────────────────────────────────────────── */
interface VehicleGalleryProps {
  vehicle: VehicleModel;
  /** Controlled GR mode (optional). If omitted, component manages its own GR state with a header toggle. */
  isGR?: boolean;
  /** Show the small GR toggle chip in header when component is uncontrolled. Default true. */
  showGRToggle?: boolean;
}
type Category = "all" | "exterior" | "interior" | "technology" | "lifestyle";
interface GalleryImage {
  url: string;
  alt: string;
  title: string;
  description: string;
  category: Exclude<Category, "all">;
  isVideo?: boolean;
  isPremium?: boolean;
}

/* ─────────────────────────────────────────
   Tokens (regular + GR)
─────────────────────────────────────────── */
const TOKENS = {
  accent: "linear-gradient(90deg, #EB0A1E, #CC0000)",
  glass: "bg-white/80 dark:bg-neutral-900/75 backdrop-blur-md",

  // GR
  gr: {
    red: "#EB0A1E",
    surface: "#0B0B0C",
    surface2: "#101214",
    edge: "#17191B",
    text: "#E6E7E9",
    muted: "#9DA2A6",
    glass: "bg-[#0E0F11]/80 backdrop-blur-lg",
  },
};

const carbonMatte: React.CSSProperties = {
  backgroundImage: "url('/lovable-uploads/dae96293-a297-4690-a4e1-6b32d044b8d3.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundColor: TOKENS.gr.surface,
};

/* ─────────────────────────────────────────
   Controlled/Uncontrolled GR hook
─────────────────────────────────────────── */
function useGRControlled(isGRProp: boolean | undefined, showGRToggle: boolean) {
  const controlled = typeof isGRProp === "boolean";
  const [internal, setInternal] = useState<boolean>(() => {
    if (controlled) return !!isGRProp;
    try {
      const saved = localStorage.getItem("toyota.grMode");
      return saved === "1" || saved === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!controlled) {
      try {
        localStorage.setItem("toyota.grMode", internal ? "1" : "0");
      } catch {
        /* no-op */
      }
    }
  }, [internal, controlled]);

  const isGR = controlled ? !!isGRProp : internal;
  const toggle = controlled
    ? undefined
    : () => setInternal((v) => !v);

  return { isGR, canToggle: !controlled && showGRToggle, toggle };
}

/* ─────────────────────────────────────────
   Component
─────────────────────────────────────────── */
const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle, isGR: isGRProp, showGRToggle = true }) => {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const { isGR, canToggle, toggle } = useGRControlled(isGRProp, showGRToggle);

  /* Data */
  const categories: Category[] = ["all", "exterior", "interior", "technology", "lifestyle"];
  const allImages: GalleryImage[] = [
    {
      url: vehicle.image,
      alt: `${vehicle.name} – Hero`,
      title: "Exterior Design",
      description: "Distinctive stance. Sculpted aero. Pure presence.",
      category: "exterior",
      isPremium: true,
    },
    {
      url: "https://images.unsplash.com/photo-1549399734-eb4bb52aa02d?w=1600&auto=format&fit=crop",
      alt: `${vehicle.name} – Interior`,
      title: "Premium Interior",
      description: "Crafted materials with driver-centric ergonomics.",
      category: "interior",
      isPremium: true,
    },
    {
      url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop",
      alt: `${vehicle.name} – Technology`,
      title: "Advanced Technology",
      description: "Intuitive cockpit with seamless connectivity.",
      category: "technology",
      isVideo: true,
    },
    {
      url: "https://images.unsplash.com/photo-1518965449314-2c4dc77b3b3a?w=1600&auto=format&fit=crop",
      alt: `${vehicle.name} – Lifestyle`,
      title: "Built for Life",
      description: "Everyday versatility meets weekend escapes.",
      category: "lifestyle",
    },
  ];

  /* State */
  const [category, setCategory] = useState<Category>("all");
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<"cinema" | "grid">(isMobile ? "cinema" : "cinema");
  const [fullscreen, setFullscreen] = useState(false);
  const [liked, setLiked] = useState<number[]>([]);
  const [zoom, setZoom] = useState(1);

  /* Derived */
  const images = useMemo(
    () => (category === "all" ? allImages : allImages.filter((i) => i.category === category)),
    [category]
  );
  useEffect(() => setIndex(0), [category]);

  const goNext = useCallback(() => setIndex((p) => (p + 1) % images.length), [images.length]);
  const goPrev = useCallback(() => setIndex((p) => (p - 1 + images.length) % images.length), [images.length]);
  const toggleLike = (i: number) =>
    setLiked((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  const toggleZoom = () => setZoom((z) => (z === 1 ? 1.4 : 1));

  /* Swipe (mobile) */
  const swipe = useSwipeable({
    onSwipeLeft: images.length > 1 ? goNext : undefined,
    onSwipeRight: images.length > 1 ? goPrev : undefined,
    threshold: 40,
  });

  /* Keyboard (fullscreen only) */
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setFullscreen(false);
      } else if (e.key.toLowerCase() === "z") {
        e.preventDefault();
        toggleZoom();
      } else if (e.key.toLowerCase() === "l") {
        e.preventDefault();
        toggleLike(index);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [fullscreen, goNext, goPrev, index]);

  /* Parallax (desktop hover) */
  const parallaxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = parallaxRef.current;
    if (!el || reduceMotion) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--parx", `${cx * 8}deg`);
      el.style.setProperty("--pary", `${-cy * 8}deg`);
      el.style.setProperty("--parz", `${Math.hypot(cx, cy) * 4}px`);
    };
    const onLeave = () => {
      el.style.setProperty("--parx", "0deg");
      el.style.setProperty("--pary", "0deg");
      el.style.setProperty("--parz", "0px");
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduceMotion]);

  /* Progress */
  const progress = images.length ? (index + 1) / images.length : 0;
  const imageLabel = `${images[index]?.title ?? "Image"} — ${index + 1} of ${images.length}`;

  /* Theming helpers */
  const accentBg = isGR ? TOKENS.gr.red : undefined;
  const chipActiveStyle = isGR ? { backgroundColor: TOKENS.gr.red, color: TOKENS.gr.text } : { background: TOKENS.accent, color: "white" };
  const chipIdleClass = isGR
    ? "text-neutral-300 bg-transparent hover:bg-[#121416] border border-[#17191B]"
    : "text-foreground/80 bg-transparent hover:text-foreground";

  return (
    <section className="w-full" aria-label={`${vehicle.name} media gallery`}>
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 pt-8 pb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2
            className={[
              "text-2xl sm:text-3xl md:text-4xl font-black tracking-tight",
              isGR ? "text-[#E6E7E9]" : "",
            ].join(" ")}
          >
            {vehicle.name} Gallery
          </h2>
          <p className={["mt-2 text-sm sm:text-base", isGR ? "text-[#9DA2A6]" : "text-muted-foreground"].join(" ")}>
            Swipe. Scrub. Zoom. A gallery that feels like the car: responsive and quick.
          </p>
        </div>

        {canToggle && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle GR performance mode"
            className={[
              "inline-flex items-center h-8 rounded-full px-3 text-xs font-semibold",
              isGR ? "bg-[#1a1c1f] text-red-300 border border-[#17191B]" : "bg-gray-200/70 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
            ].join(" ")}
            title="GR Mode"
          >
            GR
          </button>
        )}
      </div>

      {/* Category chips */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2" role="tablist" aria-label="Gallery categories">
          {(["all", "exterior", "interior", "technology", "lifestyle"] as Category[]).map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c)}
                className={[
                  "capitalize rounded-full px-4 py-2 text-sm whitespace-nowrap transition",
                  active ? "shadow ring-1 ring-black/10" : chipIdleClass,
                ].join(" ")}
                style={active ? chipActiveStyle : undefined}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* View toggle (desktop) */}
      {!isMobile && (
        <div className="px-4 sm:px-6 lg:px-8 mt-4 flex justify-center">
          <div
            className={[
              "inline-flex items-center rounded-xl border p-1",
              isGR ? "border-[#17191B] " + TOKENS.gr.glass : TOKENS.glass + " border-border",
            ].join(" ")}
          >
            <Button
              onClick={() => setView("cinema")}
              variant={view === "cinema" ? "default" : "ghost"}
              size="sm"
              className={view === "cinema" ? (isGR ? "!bg-[#EB0A1E] hover:!bg-[#C80A19]" : "bg-[#EB0A1E] hover:bg-[#EB0A1E]/90") : ""}
              aria-pressed={view === "cinema"}
            >
              <Eye className="w-4 h-4 mr-2" />
              Cinematic
            </Button>
            <Button
              onClick={() => setView("grid")}
              variant={view === "grid" ? "default" : "ghost"}
              size="sm"
              className={view === "grid" ? (isGR ? "!bg-[#EB0A1E] hover:!bg-[#C80A19]" : "bg-[#EB0A1E] hover:bg-[#EB0A1E]/90") : ""}
              aria-pressed={view === "grid"}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="px-0 sm:px-6 lg:px-8 mt-6">
        {view === "grid" && !isMobile ? (
          /* GRID VIEW (desktop) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4">
            {images.map((img, i) => (
              <motion.button
                key={img.url + i}
                className={[
                  "group relative aspect-video rounded-2xl overflow-hidden border text-left",
                  isGR ? "border-[#17191B]" : "border-border bg-background",
                ].join(" ")}
                style={isGR ? carbonMatte : undefined}
                whileHover={{ scale: reduceMotion ? 1 : 1.02 }}
                onClick={() => {
                  setIndex(i);
                  setFullscreen(true);
                }}
                aria-label={`Open ${img.title}`}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 mix-blend-normal"
                  style={isGR ? { mixBlendMode: "screen", opacity: 0.92 } : undefined}
                />
                <div className="absolute inset-0 from-black/60 via-black/10 to-transparent bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    {img.isPremium && (
                      <Badge className={isGR ? "bg-[#EB0A1E]" : "bg-[#EB0A1E] hover:bg-[#EB0A1E]/90"}>
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {img.isVideo && (
                      <Badge variant="secondary"> 
                        <Play className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-bold">{img.title}</h4>
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition">
                  <Button
                    size="icon"
                    variant="ghost"
                    className={isGR ? "text-white bg-black/40 hover:bg-black/50" : "text-white bg-black/30 hover:bg-black/40"}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(i);
                    }}
                    aria-pressed={liked.includes(i)}
                    aria-label={liked.includes(i) ? "Unlike" : "Like"}
                  >
                    <Heart className={`w-4 h-4 ${liked.includes(i) ? "fill-[#EB0A1E] text-[#EB0A1E]" : ""}`} />
                  </Button>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          /* CINEMATIC (mobile default) */
          <div className="relative">
            {/* Progress speedline */}
            <div className={isGR ? "h-[3px] w-full bg-[#141618]" : "h-[3px] w-full bg-black/5 dark:bg-white/10"}>
              <div
                className="h-full"
                style={{
                  width: `${Math.max(0.12, progress) * 100}%`,
                  background: isGR ? TOKENS.gr.red : TOKENS.accent,
                  transition: "width 300ms cubic-bezier(.2,.8,.2,1)",
                }}
                aria-hidden
              />
            </div>

            {/* Stage */}
            <motion.div
              key={`${category}-${index}-${isGR ? "gr" : "std"}`}
              {...swipe}
              ref={parallaxRef}
              className={["relative aspect-video sm:rounded-3xl overflow-hidden select-none", isGR ? "border border-[#17191B]" : ""].join(" ")}
              style={{
                ...(isGR ? carbonMatte : {}),
                transformStyle: "preserve-3d",
                perspective: 800,
                "--parx": "0deg",
                "--pary": "0deg",
                "--parz": "0px",
              } as React.CSSProperties}
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={reduceMotion ? {} : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              role="group"
              aria-roledescription="carousel"
              aria-label="Vehicle images"
            >
              <motion.img
                src={images[index]?.url}
                alt={images[index]?.alt}
                className="w-full h-full object-cover will-change-transform"
                style={{
                  transform: `rotateY(var(--parx)) rotateX(var(--pary)) translateZ(var(--parz)) scale(${zoom})`,
                  transition: reduceMotion ? "transform 100ms linear" : "transform 300ms ease",
                  ...(isGR ? { mixBlendMode: "screen", opacity: 0.92 } : {}),
                }}
                draggable={false}
              />

              {/* Glass caption bar */}
              <div
                className={[
                  "absolute left-3 right-3 bottom-3 sm:left-4 sm:right-4 sm:bottom-4 rounded-2xl border",
                  isGR ? TOKENS.gr.glass + " border-[#17191B]" : TOKENS.glass + " border-border/60",
                ].join(" ")}
                aria-live="polite"
              >
                <div className="p-3 sm:p-4">
                  <div className="flex items-center gap-2 mb-1">
                    {images[index]?.isPremium && (
                      <Badge className="bg-[#EB0A1E]">
                        <Star className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    )}
                    {images[index]?.isVideo && (
                      <Badge variant="secondary">
                        <Play className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    )}
                    <Badge variant="outline" className={isGR ? "border-[#26282B] text-[#E6E7E9]" : ""}>
                      {images[index]?.category}
                    </Badge>
                    <span className={["ml-auto text-xs", isGR ? "text-[#9DA2A6]" : "text-muted-foreground"].join(" ")}>
                      {index + 1} / {images.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className={["text-base sm:text-lg font-bold truncate", isGR ? "text-[#E6E7E9]" : ""].join(" ")} title={images[index]?.title}>
                        {images[index]?.title}
                      </h3>
                      <p className={["text-xs sm:text-sm line-clamp-2", isGR ? "text-[#9DA2A6]" : "text-muted-foreground"].join(" ")}>
                        {images[index]?.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={isGR ? "hover:bg-[#141618]" : "hover:bg-foreground/5"}
                        onClick={() => toggleLike(index)}
                        aria-pressed={liked.includes(index)}
                        aria-label={liked.includes(index) ? "Unlike" : "Like"}
                        title="Like"
                      >
                        <Heart className={`w-5 h-5 ${liked.includes(index) ? "fill-[#EB0A1E] text-[#EB0A1E]" : isGR ? "text-[#E6E7E9]" : ""}`} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={isGR ? "hover:bg-[#141618]" : "hover:bg-foreground/5"}
                        onClick={() => setFullscreen(true)}
                        aria-label="Fullscreen"
                        title="Fullscreen"
                      >
                        <Maximize2 className={["w-5 h-5", isGR ? "text-[#E6E7E9]" : ""].join(" ")} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={isGR ? "hover:bg-[#141618]" : "hover:bg-foreground/5"}
                        onClick={toggleZoom}
                        aria-label={zoom > 1 ? "Zoom out" : "Zoom in"}
                        title={zoom > 1 ? "Zoom out" : "Zoom in"}
                      >
                        {zoom > 1 ? <ZoomOut className={["w-5 h-5", isGR ? "text-[#E6E7E9]" : ""].join(" ")} /> : <ZoomIn className={["w-5 h-5", isGR ? "text-[#E6E7E9]" : ""].join(" ")} />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Nav arrows (desktop) */}
              {!isMobile && images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={goPrev}
                    className={isGR ? "absolute left-3 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/40" : "absolute left-3 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/30"}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={goNext}
                    className={isGR ? "absolute right-3 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/40" : "absolute right-3 top-1/2 -translate-y-1/2 bg-black/20 text-white hover:bg-black/30"}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </motion.div>

            {/* Filmstrip scrubber */}
            <div className="mt-3 px-3 sm:px-0">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2" aria-label="Thumbnails">
                {images.map((img, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={img.url + i}
                      onClick={() => setIndex(i)}
                      className={[
                        "relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-lg overflow-hidden border transition-all",
                        active
                          ? "border-transparent ring-2 ring-offset-2 ring-offset-background"
                          : isGR
                          ? "border-[#17191B] hover:border-[#26282B]"
                          : "border-border hover:border-foreground/30",
                      ].join(" ")}
                      style={active ? { boxShadow: isGR ? "0 0 0 2px rgba(235,10,30,.85) inset" : "0 0 0 2px rgba(235,10,30,.8) inset" } : undefined}
                      aria-current={active ? "true" : undefined}
                      aria-label={`Go to ${img.title}`}
                    >
                      <img
                        src={img.url}
                        alt={img.alt}
                        className="w-full h-full object-cover"
                        style={isGR ? { mixBlendMode: "screen", opacity: 0.92 } : undefined}
                      />
                      {img.isPremium && (
                        <Star className="absolute top-1 right-1 w-3 h-3 text-[#EB0A1E] fill-current" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FULLSCREEN */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            style={isGR ? { ...carbonMatte } : { backgroundColor: "rgba(0,0,0,.95)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen image viewer"
            onClick={() => setFullscreen(false)}
          >
            {/* Top bar */}
            <div
              className={[
                "flex justify-between items-center p-3 sm:p-4 border-b",
                isGR ? "border-[#17191B] " + TOKENS.gr.glass : "border-white/10",
              ].join(" ")}
            >
              <div className="min-w-0">
                <h3 className={["text-base sm:text-lg font-bold truncate", isGR ? "text-[#E6E7E9]" : "text-white"].join(" ")}>
                  {images[index]?.title}
                </h3>
                <p className={[isGR ? "text-[#9DA2A6]" : "text-white/70", "text-xs sm:text-sm truncate"].join(" ")}>
                  {images[index]?.description}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={isGR ? "text-[#9DA2A6] text-xs sm:text-sm" : "text-white/70 text-xs sm:text-sm"} aria-live="polite">
                  {index + 1} / {images.length}
                </span>
                <Button
                  size="icon"
                  variant="ghost"
                  className={isGR ? "text-[#E6E7E9] hover:bg-[#141618]" : "text-white hover:bg-white/10"}
                  onClick={() => setFullscreen(false)}
                  aria-label="Close fullscreen"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Image stage */}
            <div
              className="flex-1 flex items-center justify-center p-3 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={index}
                src={images[index]?.url}
                alt={imageLabel}
                className="max-w-full max-h-full object-contain rounded-md"
                initial={reduceMotion ? false : { scale: 0.96, opacity: 0 }}
                animate={reduceMotion ? {} : { scale: 1, opacity: 1 }}
                transition={{ duration: 0.25 }}
                style={{
                  transform: `scale(${zoom})`,
                  ...(isGR ? { mixBlendMode: "screen", opacity: 0.95 } : {}),
                }}
              />
              {images.length > 1 && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={goPrev}
                    className={isGR ? "absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 bg-black/30" : "absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 bg-black/20"}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={goNext}
                    className={isGR ? "absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 bg-black/30" : "absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 bg-black/20"}
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}
            </div>

            {/* Footer controls */}
            <div
              className={[
                "p-3 sm:p-4 border-t flex items-center justify-center gap-2 sm:gap-3",
                isGR ? "border-[#17191B] " + TOKENS.gr.glass : "border-white/10",
              ].join(" ")}
            >
              <Button size="sm" variant={isGR ? "secondary" : "secondary"} onClick={() => toggleLike(index)} aria-pressed={liked.includes(index)} className={isGR ? "text-[#E6E7E9]" : ""}>
                <Heart className={`w-4 h-4 mr-2 ${liked.includes(index) ? "fill-[#EB0A1E] text-[#EB0A1E]" : ""}`} />
                {liked.includes(index) ? "Liked" : "Like"}
              </Button>
              <Button size="sm" variant="ghost" onClick={toggleZoom} className={isGR ? "text-[#E6E7E9] hover:bg-[#141618]" : ""}>
                {zoom > 1 ? (
                  <>
                    <ZoomOut className="w-4 h-4 mr-2" /> Zoom out
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-4 h-4 mr-2" /> Zoom in
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VehicleGallery;
