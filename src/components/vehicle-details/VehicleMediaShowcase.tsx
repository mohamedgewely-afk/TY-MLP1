import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Gauge,
  Award,
  Cpu,
  Info,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils";

/* =========================================================
   SafeImage: keeps DAM URLs, lazy + no-referrer + fallback
========================================================= */
type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackText?: string;
  ratioClass?: string; // e.g., "aspect-video"
  fit?: "cover" | "contain";
};
const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackText = "Image unavailable",
  ratioClass,
  fit = "cover",
  ...rest
}) => {
  const [errored, setErrored] = useState(false);
  return (
    <div className={cn("relative w-full", ratioClass)}>
      {!errored ? (
        <img
          src={src as string}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={cn("w-full h-full", fit === "cover" ? "object-cover" : "object-contain bg-black", className)}
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

/* =========================================================
   Types: allow per-image content overrides (non-breaking)
========================================================= */
type DetailSet = { specs?: string[]; benefits?: string[]; technology?: string[] };

interface GalleryImage {
  url: string;
  title: string;
  description: string;
  details?: DetailSet; // optional per-image overrides
  contentBlocks?: Array<{ id: string; title?: string; body?: string }>;
  badges?: string[];
}

interface MediaItem {
  id: string;
  type: "image" | "video" | "360";
  url: string; // cover image or video URL
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  details: DetailSet; // parent defaults
  isPremium?: boolean;
  galleryImages?: GalleryImage[];
}

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

/* =========================================================
   Utility hooks (deep link + preload + content sync)
========================================================= */
function useDeepLinking(
  selectedMedia: MediaItem | null,
  modalImageIndex: number,
  setSelectedMedia: (m: MediaItem | null) => void,
  setModalImageIndex: (n: number) => void,
  mediaItems: MediaItem[]
) {
  // read on mount
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const mediaId = sp.get("media");
    const imgStr = sp.get("img");
    if (!mediaId) return;
    const found = mediaItems.find((m) => m.id === mediaId);
    if (found) {
      setSelectedMedia(found);
      const n = Math.max(0, Math.min(Number(imgStr ?? 0), (found.galleryImages?.length ?? 1) - 1));
      setModalImageIndex(isNaN(n) ? 0 : n);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // write when state changes
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (selectedMedia) {
      sp.set("media", selectedMedia.id);
      sp.set("img", String(modalImageIndex));
    } else {
      sp.delete("media");
      sp.delete("img");
    }
    const url = `${window.location.pathname}?${sp.toString()}${window.location.hash}`;
    window.history.replaceState({}, "", url);
  }, [selectedMedia, modalImageIndex]);
}

function usePreloadNeighbors(images: string[], index: number) {
  useEffect(() => {
    if (!images?.length) return;
    const next = images[(index + 1) % images.length];
    const prev = images[(index - 1 + images.length) % images.length];
    [next, prev].forEach((src) => {
      if (!src) return;
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = src;
    });
  }, [images, index]);
}

function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);
}

/* =========================================================
   Main Component
========================================================= */
const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const isMobile = useIsMobile();

  // ---------------- state
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // mobile carousel index (cards)
  const [modalImageIndex, setModalImageIndex] = useState(0); // single source of truth in modal
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // -------------- data (KEEP DAM URLs AS PROVIDED)
  // NOTE: keep your existing mediaItems here (omitted for brevity),
  // or import them. The structure supports per-image overrides.
  const mediaItems: MediaItem[] = [
    /* YOUR EXISTING items from your last version — unchanged DAM URLs */
  ] as any;

  // ---------------- derived
  const activeImages = useMemo(
    () => (selectedMedia?.galleryImages?.length ? selectedMedia.galleryImages.map((g) => g.url) : [selectedMedia?.url ?? ""]),
    [selectedMedia]
  );
  usePreloadNeighbors(activeImages, modalImageIndex);

  // ---------------- deep link
  useDeepLinking(selectedMedia, modalImageIndex, setSelectedMedia, setModalImageIndex, mediaItems);

  // ---------------- scroll lock
  useBodyScrollLock(!!selectedMedia);

  // ---------------- swipe (mobile carousel for cards)
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => setCurrentIndex((p) => Math.min(p + 1, mediaItems.length - 1)),
    onSwipeRight: () => setCurrentIndex((p) => Math.max(p - 1, 0)),
    threshold: 40,
  });

  // ---------------- modal open/close
  const openModal = (media: MediaItem) => {
    setSelectedMedia(media);
    setModalImageIndex(0);
    setIsPlaying(false);
  };
  const closeModal = useCallback(() => {
    setSelectedMedia(null);
    setIsPlaying(false);
  }, []);

  // ---------------- keyboard inside modal
  useEffect(() => {
    if (!selectedMedia) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") setModalImageIndex((p) => (selectedMedia.galleryImages?.length ? (p + 1) % selectedMedia.galleryImages.length : 0));
      if (e.key === "ArrowLeft")
        setModalImageIndex((p) => (selectedMedia.galleryImages?.length ? (p - 1 + selectedMedia.galleryImages.length) % selectedMedia.galleryImages.length : 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMedia, closeModal]);

  /* =========================================================
     BEST-IN-CLASS IMAGE ⇄ CONTENT SYNC
     - Right pane content is driven by current image (overrides
       fall back to parent details)
     - Scroll of content auto-updates image via IntersectionObserver
     - Clicking thumbnail scrolls to matching content
  ========================================================== */
  const contentPaneRef = useRef<HTMLDivElement>(null);
  const contentBlocksRef = useRef<Map<string, HTMLElement>>(new Map());
  const programmaticScrollRef = useRef(false);

  // Build content model from current image + fallback to media-level
  const currentImage = useMemo<GalleryImage | null>(() => {
    if (!selectedMedia) return null;
    const imgs = selectedMedia.galleryImages;
    if (imgs?.length) return imgs[modalImageIndex] ?? imgs[0];
    // no gallery -> synthesize from cover
    return {
      url: selectedMedia.url,
      title: selectedMedia.title,
      description: selectedMedia.description,
      details: undefined,
      contentBlocks: undefined,
    };
  }, [selectedMedia, modalImageIndex]);

  const mergedDetails: DetailSet = useMemo(() => {
    if (!selectedMedia) return {};
    return {
      specs: currentImage?.details?.specs ?? selectedMedia.details.specs,
      benefits: currentImage?.details?.benefits ?? selectedMedia.details.benefits,
      technology: currentImage?.details?.technology ?? selectedMedia.details.technology,
    };
  }, [selectedMedia, currentImage]);

  // Link: content scroll -> image index
  useEffect(() => {
    if (!selectedMedia || !contentPaneRef.current) return;
    const root = contentPaneRef.current;
    const imgs = selectedMedia.galleryImages ?? [];
    const options: IntersectionObserverInit = { root, threshold: 0.5 };
    const io = new IntersectionObserver((entries) => {
      if (programmaticScrollRef.current) return; // ignore while we are scrolling by code
      let bestId: string | null = null;
      let bestRatio = 0;
      for (const e of entries) {
        if (e.isIntersecting && e.intersectionRatio > bestRatio) {
          bestRatio = e.intersectionRatio;
          bestId = (e.target as HTMLElement).dataset["imageId"] ?? null;
        }
      }
      if (!bestId) return;
      const idx = Math.max(
        0,
        imgs.findIndex((g) => (g.contentBlocks?.[0]?.id ?? String(imgs.indexOf(g))) === bestId)
      );
      if (idx >= 0 && idx !== modalImageIndex) setModalImageIndex(idx);
    }, options);

    // observe each main block
    contentBlocksRef.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selectedMedia, modalImageIndex]);

  // Link: image change -> scroll to its first content block
  const scrollToImageBlock = useCallback(
    (index: number) => {
      if (!selectedMedia) return;
      const imgs = selectedMedia.galleryImages ?? [];
      const blockId = imgs[index]?.contentBlocks?.[0]?.id ?? String(index);
      const el = contentBlocksRef.current.get(blockId);
      if (el && contentPaneRef.current) {
        programmaticScrollRef.current = true;
        contentPaneRef.current.scrollTo({ top: el.offsetTop - 8, behavior: "smooth" });
        // small timer to re-enable observer response
        window.setTimeout(() => (programmaticScrollRef.current = false), 420);
      }
    },
    [selectedMedia]
  );

  // keep contentBlocksRef in sync
  const registerBlock = (id: string) => (node: HTMLElement | null) => {
    if (!node) {
      contentBlocksRef.current.delete(id);
    } else {
      contentBlocksRef.current.set(id, node);
    }
  };

  // Video (YouTube) embed renderer with mute/play toggles via params
  const renderVideo = (url: string) => {
    const match = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
    const vid = match ? match[1] : "";
    const params = `?rel=0&modestbranding=1&controls=1&playsinline=1${isMuted ? "&mute=1" : ""}${
      isPlaying ? "&autoplay=1" : ""
    }`;
    const src = `https://www.youtube.com/embed/${vid}${params}`;
    return (
      <div className="relative w-full aspect-video bg-black">
        <iframe
          title="video"
          className="absolute inset-0 w-full h-full"
          src={src}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  // Analytics stubs (wire to GA4 as needed)
  const track = (name: string, payload?: Record<string, any>) => {
    // window.gtag?.('event', name, payload) // enable when GA ready
  };

  // Handlers
  const nextModalImage = () => {
    if (!selectedMedia) return;
    const len = selectedMedia.galleryImages?.length ?? 1;
    if (len <= 1) return;
    const next = (modalImageIndex + 1) % len;
    setModalImageIndex(next);
    scrollToImageBlock(next);
    track("media_next", { id: selectedMedia.id, index: next });
  };
  const prevModalImage = () => {
    if (!selectedMedia) return;
    const len = selectedMedia.galleryImages?.length ?? 1;
    if (len <= 1) return;
    const prev = (modalImageIndex - 1 + len) % len;
    setModalImageIndex(prev);
    scrollToImageBlock(prev);
    track("media_prev", { id: selectedMedia.id, index: prev });
  };
  const setIndexViaThumb = (idx: number) => {
    setModalImageIndex(idx);
    scrollToImageBlock(idx);
    track("media_thumb_click", { id: selectedMedia?.id, index: idx });
  };

  const toggleMute = () => setIsMuted((m) => !m);
  const togglePlay = () => setIsPlaying((p) => !p);

  /* =========================================================
     UI
  ========================================================== */
  return (
    <div className="relative bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="text-center py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Badge variant="outline" className="px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Explore Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {vehicle.name} Highlights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the advanced technologies and premium features that make every drive exceptional
          </p>
        </motion.div>
      </div>

      {/* Mobile carousel */}
      <div className="px-4 md:px-8 pb-8 md:hidden">
        <div ref={swipeableRef} className="relative">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="w-full">
            <MediaCard media={mediaItems[currentIndex]} onClick={() => openModal(mediaItems[currentIndex])} isMobile />
          </motion.div>
          <div className="flex justify-center mt-6 space-x-2">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to item ${index + 1}`}
                className={cn("w-3 h-3 rounded-full transition-all", index === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30")}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block px-4 md:px-8 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((media, index) => (
            <motion.div key={media.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <MediaCard media={media} onClick={() => openModal(media)} isMobile={false} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 m-0 md:inset-6 md:rounded-2xl bg-background shadow-2xl overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
            >
              {/* Sticky header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="min-w-0">
                  <h3 className="text-lg md:text-2xl font-bold truncate">{selectedMedia.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base truncate">{selectedMedia.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMedia.type === "video" && (
                    <>
                      <Button variant="ghost" size="icon" onClick={toggleMute} className="hover:bg-muted" aria-label="Toggle Mute">
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={togglePlay} className="hover:bg-muted" aria-label="Toggle Play">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" onClick={closeModal} className="hover:bg-muted" aria-label="Close">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content layout: single column on mobile, split on md+ */}
              <div className="flex-1 grid grid-rows-[auto,1fr] md:grid-rows-1 md:grid-cols-2 min-h-0">
                {/* Visual (always on top for mobile) */}
                <div className="relative bg-black">
                  {selectedMedia.type === "video" ? (
                    renderVideo(selectedMedia.url)
                  ) : (
                    <SafeImage
                      src={(selectedMedia.galleryImages?.length ? selectedMedia.galleryImages[modalImageIndex]?.url : selectedMedia.url) ?? ""}
                      alt={(selectedMedia.galleryImages?.length ? selectedMedia.galleryImages[modalImageIndex]?.title : selectedMedia.title) ?? ""}
                      ratioClass="md:aspect-auto aspect-[16/10]"
                      fit="contain"
                    />
                  )}

                  {/* Arrows & counter (if multi-image) */}
                  {selectedMedia.galleryImages && selectedMedia.galleryImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevModalImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextModalImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                        {modalImageIndex + 1} / {selectedMedia.galleryImages.length}
                      </div>
                    </>
                  )}

                  {/* Thumbnails */}
                  {selectedMedia.galleryImages && selectedMedia.galleryImages.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur p-3">
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {selectedMedia.galleryImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setIndexViaThumb(idx)}
                            className={cn(
                              "flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all",
                              idx === modalImageIndex ? "border-primary" : "border-transparent hover:border-primary/50"
                            )}
                            aria-label={`Thumbnail ${idx + 1}`}
                            aria-selected={idx === modalImageIndex}
                          >
                            <SafeImage src={img.url} alt={img.title} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Text pane (independent scroll) */}
                <div ref={contentPaneRef} className="min-h-0 overflow-y-auto p-4 md:p-6">
                  {/* Image-level header (keeps image ↔ content aligned) */}
                  <div className="mb-4" data-image-id={(currentImage?.contentBlocks?.[0]?.id ?? String(modalImageIndex))}>
                    <h4 className="font-semibold mb-1">{currentImage?.title}</h4>
                    <p className="text-sm text-muted-foreground">{currentImage?.description}</p>
                  </div>

                  {/* Details merged (image overrides -> media defaults) */}
                  <div className="grid gap-6">
                    {mergedDetails.specs && mergedDetails.specs.length > 0 && (
                      <div ref={registerBlock(currentImage?.contentBlocks?.[0]?.id ?? String(modalImageIndex))} data-image-id={currentImage?.contentBlocks?.[0]?.id ?? String(modalImageIndex)}>
                        <h4 className="font-semibold flex items-center mb-2">
                          <Gauge className="h-4 w-4 mr-2" />
                          Specifications
                        </h4>
                        <ul className="space-y-2">
                          {mergedDetails.specs.map((spec, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {mergedDetails.benefits && mergedDetails.benefits.length > 0 && (
                      <div ref={registerBlock(`benefits-${modalImageIndex}`)} data-image-id={`benefits-${modalImageIndex}`}>
                        <h4 className="font-semibold flex items-center mb-2">
                          <Award className="h-4 w-4 mr-2" />
                          Key Benefits
                        </h4>
                        <ul className="space-y-2">
                          {mergedDetails.benefits.map((b, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {mergedDetails.technology && mergedDetails.technology.length > 0 && (
                      <div ref={registerBlock(`tech-${modalImageIndex}`)} data-image-id={`tech-${modalImageIndex}`}>
                        <h4 className="font-semibold flex items-center mb-2">
                          <Cpu className="h-4 w-4 mr-2" />
                          Technology
                        </h4>
                        <ul className="space-y-2">
                          {mergedDetails.technology.map((t, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Optional per-image content blocks */}
                    {currentImage?.contentBlocks?.map((blk) => (
                      <div key={blk.id} ref={registerBlock(blk.id)} data-image-id={blk.id} className="space-y-1">
                        {blk.title && <h4 className="font-semibold">{blk.title}</h4>}
                        {blk.body && <p className="text-sm text-muted-foreground">{blk.body}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Why choose (static persuasive section) */}
                  <div className="space-y-3 pt-6 border-t mt-6">
                    <h4 className="text-base md:text-lg font-semibold">Why Choose This Feature?</h4>
                    {[
                      ["Enhanced Performance", "Optimized for maximum efficiency and power delivery"],
                      ["Advanced Technology", "Latest innovations for superior driving experience"],
                      ["Premium Quality", "Built with the finest materials and craftsmanship"],
                    ].map(([title, copy]) => (
                      <div className="flex items-start gap-3" key={title}>
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        <div>
                          <p className="font-medium">{title}</p>
                          <p className="text-sm text-muted-foreground">{copy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* =========================================================
   Media Card
========================================================= */
interface MediaCardProps {
  media: MediaItem;
  onClick: () => void;
  isMobile: boolean;
}
const MediaCard: React.FC<MediaCardProps> = ({ media, onClick, isMobile }) => {
  const Icon = media.icon;
  const isVideo = media.type === "video";
  const is360 = media.type === "360";

  return (
    <motion.div whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -4 }} whileTap={{ scale: 0.98 }} className="cursor-pointer" onClick={onClick}>
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <SafeImage src={media.url} alt={media.title} className="transition-transform duration-500 hover:scale-105" fit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute top-3 right-3 flex gap-2">
              {isVideo && (
                <Badge className="bg-red-500/90 text-white">
                  <Play className="h-3 w-3 mr-1" />
                  Video
                </Badge>
              )}
              {is360 && (
                <Badge className="bg-purple-500/90 text-white">
                  <Eye className="h-3 w-3 mr-1" />
                  360°
                </Badge>
              )}
              {media.isPremium && <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">Premium</Badge>}
            </div>

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge variant="secondary" className="mb-2 text-xs">
                {media.category}
              </Badge>
              <h3 className="text-white font-bold text-lg md:text-xl mb-1">{media.title}</h3>
              <p className="text-white/80 text-sm line-clamp-2">{media.description}</p>
            </div>

            <div className="absolute inset-0 bg-primary/15 opacity-0 hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Info className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VehicleMediaShowcase;
