import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Gauge,
  Award,
  Cpu,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------
   Toyota Media Studio (no 360°) – single-file drop-in
   - Toyota-aligned look & feel
   - Mobile bottom-sheet modal, desktop split-pane
   - Safer deep-linking (?media & ?img)
   - Optimized SafeImage w/ srcSet, blur-in
   - Defer YouTube iframe; nocookie domain
   - Keyboard & a11y improvements
-------------------------------------------------------- */

/********************* Brand tokens *********************/
const TOYOTA = {
  red: "#EB0A1E",
  text: "#1A1A1A",
  subtle: "#F5F5F5",
  radius: "rounded-lg",
};

/********************* Types ****************************/
interface ImageDetailsOverride {
  specs?: string[];
  benefits?: string[];
  technology?: string[];
}

type ContentBlock = { id: string; title?: string; body?: string };

interface GalleryImage {
  url: string;
  title: string;
  description: string;
  details?: ImageDetailsOverride;
  contentBlocks?: ContentBlock[];
  badges?: string[];
}

interface MediaItem {
  id: string;
  type: "image" | "video"; // 360 removed
  url: string; // image URL OR YouTube URL
  thumbnail?: string; // for videos
  title: string;
  description: string;
  category: string;
  icon?: React.ComponentType<any>;
  details: {
    specs?: string[];
    benefits?: string[];
    technology?: string[];
  };
  isPremium?: boolean; // not visually emphasized per Toyota tone
  galleryImages?: GalleryImage[]; // for image sets
}

interface VehicleMediaStudioProps {
  vehicle: VehicleModel;
  media?: MediaItem[]; // optional external media feed; fallback to demo
  className?: string;
  title?: string;
}

/********************* Utilities ************************/
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

/********************* SafeImage (optimized) ************/

type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackText?: string;
  ratioClass?: string; // e.g., "aspect-video"
  fit?: "cover" | "contain";
  widthPx?: number;
  heightPx?: number;
};

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackText = "Image unavailable",
  ratioClass,
  fit = "cover",
  widthPx = 1600,
  heightPx = 900,
  ...rest
}) => {
  const [errored, setErrored] = useState(false);
  const srcSet = src
    ? `${src}&w=480 480w, ${src}&w=768 768w, ${src}&w=1200 1200w, ${src}&w=1600 1600w`
    : undefined;

  return (
    <div className={cn("relative w-full", ratioClass)}>
      {!errored ? (
        <img
          src={src as string}
          srcSet={srcSet}
          sizes="(max-width: 768px) 100vw, 50vw"
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          width={widthPx}
          height={heightPx}
          className={cn(
            "w-full h-full transition-opacity duration-300 opacity-0 data-[loaded=true]:opacity-100",
            fit === "cover" ? "object-cover" : "object-contain bg-black",
            className
          )}
          onLoad={(e) => (e.currentTarget.dataset.loaded = "true")}
          onError={() => setErrored(true)}
          {...rest}
        />
      ) : (
        <div className="w-full h-full grid place-items-center bg-muted text-muted-foreground text-xs">
          {fallbackText}
        </div>
      )}
    </div>
  );
};

/********************* Main component *******************/

const ToyotaMediaStudio: React.FC<VehicleMediaStudioProps> = ({
  vehicle,
  media,
  className,
  title = "Highlights",
}) => {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0); // mobile card index
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Demo fallback content (align to Toyota tone: concise, technical)
  const mediaItems: MediaItem[] = useMemo(
    () =>
      media ?? [
        {
          id: "performance",
          type: "image",
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true",
          title: "V6 Twin‑Turbo",
          description: "400+ hp, broad torque band, efficient cruising.",
          category: "Performance",
          details: {
            specs: ["3.5L V6 TT", "400+ hp", "0–60 in 4.2s", "EPA 28 mpg"],
            benefits: ["Instant response", "High efficiency", "Lower emissions"],
            technology: ["Direct injection", "VVT", "Smart boost control"],
          },
          galleryImages: [
            {
              url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
              title: "Cooling Strategy",
              description: "Dual‑path cooling improves thermal stability under load.",
              details: { technology: ["Dual circuits", "Low temp charge‑air"] },
            },
            {
              url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
              title: "Turbo Detail",
              description: "Low‑inertia turbines widen usable torque.",
              details: { specs: ["VGT", "Low mass impellers"] },
            },
          ],
        },
        {
          id: "interior",
          type: "image",
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
          title: "Driver‑Focused Cabin",
          description: "Premium materials, intuitive controls, low distraction.",
          category: "Interior",
          details: {
            specs: ['Leather seats', '12.3" display', 'Premium audio', 'Tri‑zone climate'],
            benefits: ["Comfort", "Clarity", "Personalization"],
            technology: ["Heated/ventilated seats", "Wireless charging", "Voice control"],
          },
          galleryImages: [
            {
              url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/561ac4b4-3604-4e66-ae72-83e2969d7d65/items/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
              title: "Center Console",
              description: "Ergonomic layout with clear haptics and storage.",
            },
            {
              url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
              title: "Seating",
              description: "Supportive geometry; ventilation; memory functions.",
            },
          ],
        },
        {
          id: "safety",
          type: "video",
          url: "https://www.youtube.com/watch?v=NCSxxuPE6wM",
          thumbnail:
            "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
          title: "Toyota Safety Sense",
          description: "Camera+radar fusion, assistance when you need it.",
          category: "Safety",
          details: {
            specs: ["PCS", "LTA", "ACC", "BSM"],
            benefits: ["Avoidance", "Reduced fatigue", "Confidence"],
            technology: ["Sensor fusion", "AI detection", "Predictive control"],
          },
          galleryImages: [
            {
              url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
              title: "Sensors",
              description: "Wide FOV camera and radar coverage.",
            },
          ],
        },
        {
          id: "quality",
          type: "image",
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
          title: "Build Quality",
          description: "High-strength materials and precise assembly.",
          category: "Quality",
          details: {
            specs: ["HS steel", "Multi‑stage paint", "Laser gap checks"],
            benefits: ["Durability", "Refinement", "Low maintenance"],
            technology: ["Robotic assembly", "QA audits", "Corrosion protection"],
          },
          galleryImages: [
            {
              url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
              title: "Materials",
              description: "Premium substrates and coatings.",
            },
          ],
        },
      ],
    [media]
  );

  // Early bail
  if (!mediaItems || mediaItems.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No media available.</div>;
  }

  /************* Mobile swipe for card carousel ***********/
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => setCarouselIdx((p) => Math.min(p + 1, mediaItems.length - 1)),
    onSwipeRight: () => setCarouselIdx((p) => Math.max(p - 1, 0)),
    threshold: 40,
  });

  /******************* Open/close modal *******************/
  const openMedia = (m: MediaItem) => {
    setSelected(m);
    setActiveIdx(0);
    setIsPlaying(false);
    // push params
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("media", m.id);
      url.searchParams.set("img", "0");
      window.history.replaceState({}, "", url.toString());
    }
  };

  const closeMedia = useCallback(() => {
    setSelected(null);
    setIsPlaying(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("media");
      url.searchParams.delete("img");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  useBodyScrollLock(!!selected);

  /******************* Keyboard nav ***********************/
  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMedia();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, closeMedia]);

  const next = () => {
    const len = selected?.galleryImages?.length ?? 0;
    if (!len) return;
    setActiveIdx((p) => (p + 1) % len);
  };
  const prev = () => {
    const len = selected?.galleryImages?.length ?? 0;
    if (!len) return;
    setActiveIdx((p) => (p - 1 + len) % len);
  };

  /******************* Current image **********************/
  const currImg = useMemo(() => {
    if (!selected) return { url: "", title: "", description: "" } as GalleryImage;
    const g = selected.galleryImages;
    if (g && g.length > 0) {
      const clamped = clamp(activeIdx, 0, g.length - 1);
      return g[clamped];
    }
    return { url: selected.url, title: selected.title, description: selected.description } as GalleryImage;
  }, [selected, activeIdx]);

  const mergedDetails = useMemo(() => {
    if (!selected) return undefined;
    const imgDetails = (currImg as GalleryImage).details;
    const base = selected.details || {};
    return {
      specs: imgDetails?.specs ?? base.specs,
      benefits: imgDetails?.benefits ?? base.benefits,
      technology: imgDetails?.technology ?? base.technology,
    };
  }, [selected, currImg]);

  /******************* Deep-linking on load **************/
  useEffect(() => {
    if (initialized) return;
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const mediaId = url.searchParams.get("media");
    const imgIdx = Number(url.searchParams.get("img") ?? 0);
    if (mediaId) {
      const found = mediaItems.find((m) => m.id === mediaId);
      if (found) {
        setSelected(found);
        const max = (found.galleryImages?.length ?? 1) - 1;
        setActiveIdx(Number.isFinite(imgIdx) ? clamp(imgIdx, 0, max) : 0);
      }
    }
    setInitialized(true);
  }, [initialized, mediaItems]);

  /******************* Video helpers *********************/
  const toggleMute = () => setIsMuted((m) => !m);
  const togglePlay = () => setIsPlaying((p) => !p);

  const getYouTubeId = (url: string) => {
    const m = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
    return m ? m[1] : "";
  };

  const VideoBlock: React.FC<{ item: MediaItem }> = ({ item }) => {
    const vid = getYouTubeId(item.url);
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);

    // Poster first; inject iframe on Play
    return (
      <div className="relative w-full aspect-video bg-black">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="group absolute inset-0 flex items-center justify-center"
            aria-label="Play video"
          >
            <SafeImage
              src={item.thumbnail || (vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : undefined)}
              alt={item.title}
              fit="cover"
              className="absolute inset-0 w-full h-full"
            />
            <div className="relative z-10 grid place-items-center">
              <span className="rounded-full border bg-background/90 px-4 py-3 text-sm">Play</span>
            </div>
          </button>
        ) : hydrated ? (
          <iframe
            title={item.title}
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${vid}?rel=0&modestbranding=1&playsinline=1${
              isMuted ? "&mute=1" : ""
            }${isPlaying ? "&autoplay=1" : ""}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="no-referrer"
          />
        ) : null}
      </div>
    );
  };

  /******************* Share link ***********************/
  const onShare = async () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (selected) {
      url.searchParams.set("media", selected.id);
      url.searchParams.set("img", String(activeIdx));
    }
    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {}
  };

  /******************* Render ***************************/
  return (
    <div className={cn("relative", className)}>
      {/* Header */}
      <div className="text-center py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <Badge variant="outline" className={cn("px-3 py-1", TOYOTA.radius)}>
            {vehicle.name}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight" style={{ color: TOYOTA.text }}>
            {title}
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Precisely engineered features that drive confidence and conversion.
          </p>
        </motion.div>
      </div>

      {/* Mobile carousel */}
      <div className="px-4 md:px-8 pb-6 md:hidden">
        <div ref={swipeableRef} className="relative">
          <motion.div key={carouselIdx} initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}>
            <MediaCard media={mediaItems[carouselIdx]} onClick={() => openMedia(mediaItems[carouselIdx])} isMobile />
          </motion.div>
          <div className="mt-4 flex items-center justify-center gap-8">
            <div className="flex gap-2">
              {mediaItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIdx(i)}
                  aria-label={`Go to item ${i + 1}`}
                  className={cn(
                    "h-2 w-2 rounded-full",
                    i === carouselIdx ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <div aria-hidden className="text-xs text-muted-foreground">Swipe</div>
          </div>
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block px-4 md:px-8 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <MediaCard media={m} onClick={() => openMedia(m)} isMobile={false} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70"
            onClick={closeMedia}
          >
            {/* Container: bottom sheet on mobile; centered on desktop */}
            <motion.div
              initial={{ opacity: 0, y: isMobile ? 40 : 20, scale: isMobile ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: isMobile ? 40 : 20, scale: isMobile ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "bg-background shadow-2xl overflow-hidden flex flex-col",
                isMobile
                  ? "fixed inset-x-0 bottom-0 h-[85svh] rounded-t-2xl"
                  : "fixed inset-6 rounded-2xl"
              )}
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b bg-background/95">
                <div className="min-w-0">
                  <h3 className="text-lg md:text-2xl font-bold truncate">{selected.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base truncate">{selected.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={onShare} aria-label="Copy deep link" className="hover:bg-muted">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  {selected.type === "video" && (
                    <>
                      <Button variant="ghost" size="icon" onClick={toggleMute} aria-label="Toggle mute" className="hover:bg-muted">
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={togglePlay} aria-label="Toggle play" className="hover:bg-muted">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" onClick={closeMedia} aria-label="Close" className="hover:bg-muted">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 grid md:grid-cols-2 min-h-0">
                {/* Visual pane */}
                <div className="relative bg-black min-h-[42svh] md:min-h-0">
                  {selected.type === "video" ? (
                    <VideoBlock item={selected} />
                  ) : (
                    <div className="relative w-full h-full md:aspect-auto aspect-[16/10] overflow-hidden">
                      <SafeImage src={currImg.url} alt={currImg.title} fit="contain" />
                    </div>
                  )}

                  {/* Arrows + counter (desktop only) */}
                  {selected.galleryImages && selected.galleryImages.length > 1 && (
                    <div className="hidden md:block">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prev}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={next}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  )}

                  {/* Thumbnails below image (never overlay content) */}
                  {selected.galleryImages && selected.galleryImages.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/95 border-t p-3">
                      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Image thumbnails">
                        {selected.galleryImages.map((img, idx) => (
                          <button
                            key={idx}
                            role="tab"
                            aria-selected={idx === activeIdx}
                            onClick={() => setActiveIdx(idx)}
                            aria-label={`Thumbnail ${idx + 1}`}
                            className={cn(
                              "flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/60",
                              idx === activeIdx ? "border-primary" : "border-transparent hover:border-primary/50"
                            )}
                          >
                            <SafeImage src={img.url} alt={img.title} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Text/content pane */}
                <div className="min-h-0 overflow-y-auto p-4 md:p-6">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {(currImg as GalleryImage).badges?.map((b) => (
                      <Badge key={b} variant="secondary" className="text-xs">
                        {b}
                      </Badge>
                    ))}
                  </div>
                  <h4 className="font-semibold text-lg">{currImg.title || selected.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{currImg.description || selected.description}</p>

                  {/* Details */}
                  <div className="grid md:grid-cols-3 gap-6 mt-5">
                    {mergedDetails?.specs && mergedDetails.specs.length > 0 && (
                      <div>
                        <h5 className="font-semibold flex items-center mb-2">
                          <Gauge className="h-4 w-4 mr-2" /> Specifications
                        </h5>
                        <ul className="space-y-2">
                          {mergedDetails.specs.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5" style={{ background: TOYOTA.red }} />
                              <span className="ml-2">{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {mergedDetails?.benefits && mergedDetails.benefits.length > 0 && (
                      <div>
                        <h5 className="font-semibold flex items-center mb-2">
                          <Award className="h-4 w-4 mr-2" /> Key Benefits
                        </h5>
                        <ul className="space-y-2">
                          {mergedDetails.benefits.map((b, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-foreground rounded-full mr-2" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {mergedDetails?.technology && mergedDetails.technology.length > 0 && (
                      <div>
                        <h5 className="font-semibold flex items-center mb-2">
                          <Cpu className="h-4 w-4 mr-2" /> Technology
                        </h5>
                        <ul className="space-y-2">
                          {mergedDetails.technology.map((t, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mr-2" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {(currImg as GalleryImage).contentBlocks && (currImg as GalleryImage).contentBlocks!.length > 0 && (
                    <div className="space-y-3 pt-6 border-t mt-6">
                      {(currImg as GalleryImage).contentBlocks!.map((b) => (
                        <div key={b.id} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-2" style={{ background: TOYOTA.red }} />
                          <div>
                            {b.title && <p className="font-medium">{b.title}</p>}
                            {b.body && <p className="text-sm text-muted-foreground">{b.body}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/********************* Media Card ************************/
interface MediaCardProps {
  media: MediaItem;
  onClick: () => void;
  isMobile?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick, isMobile }) => {
  const isVideo = media.type === "video";
  return (
    <motion.div whileHover={{ scale: isMobile ? 1 : 1.01, y: isMobile ? 0 : -2 }} whileTap={{ scale: 0.98 }} className="cursor-pointer" onClick={onClick}>
      <Card className={cn("overflow-hidden border bg-card hover:shadow-lg transition-shadow", TOYOTA.radius)}>
        <div className="relative h-64 md:h-72">
          <SafeImage src={media.url} alt={media.title} fit="cover" />
          {/* Bottom information panel (Toyota minimal) */}
          <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur px-4 py-3 border-t">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-[11px] tracking-wide">
                {media.category}
              </Badge>
              {isVideo && <span className="text-[11px] px-2 py-0.5 border rounded-full">Video</span>}
            </div>
            <h3 className="text-[17px] font-bold leading-tight">{media.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">{media.description}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ToyotaMediaStudio;
