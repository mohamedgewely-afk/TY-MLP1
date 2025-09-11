// src/components/vehicle-details/VehicleMediaShowcase.tsx
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils";

/** ————————————————————————————————————————————————
 * Types
 * ———————————————————————————————————————————————— */
type ImgDetails = { specs?: string[]; benefits?: string[]; technology?: string[] };
type ContentBlock = { id: string; title?: string; body?: string };

type GalleryImage = {
  url: string;
  title?: string;
  description?: string;
  badges?: string[];
  details?: ImgDetails;
  contentBlocks?: ContentBlock[];
};

type MediaItem = {
  id: string;
  type: "image" | "video";
  url: string;              // img or YouTube url
  thumbnail?: string;       // for video
  title: string;
  description: string;
  category: string;
  details?: ImgDetails;
  galleryImages?: GalleryImage[];
};

export interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
  onBookTestDrive?: () => void;
}

/** ————————————————————————————————————————————————
 * Helpers
 * ———————————————————————————————————————————————— */
const ensureGallery = (m: MediaItem): GalleryImage[] => {
  const g = m.galleryImages && m.galleryImages.length > 0
    ? m.galleryImages
    : [{ url: m.url, title: m.title, description: m.description }];

  // Duplicate to at least 2 items so nav always looks consistent
  if (g.length === 1) return [g[0], { ...g[0] }];
  return g;
};

const getYouTubeId = (url: string) => {
  const m = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : "";
};

function useBodyScrollLock(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

const Dot: React.FC<{ active?: boolean }> = ({ active }) => (
  <span
    className={cn(
      "inline-block h-2 w-2 rounded-full",
      active ? "bg-primary" : "bg-muted-foreground/40"
    )}
  />
);

/** Toyota-ish tiny tokens */
const TOYOTA = { red: "#EB0A1E" };

/** ————————————————————————————————————————————————
 * Component
 * ———————————————————————————————————————————————— */
const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({
  vehicle,
  onBookTestDrive,
}) => {
  const isMobile = useIsMobile();

  // You probably source these from your DAM; keeping your previous demo set.
  const items: MediaItem[] = React.useMemo(
    () => [
      {
        id: "performance",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true",
        title: "V6 Twin-Turbo",
        description: "400+ hp, broad torque band, efficient cruising.",
        category: "Performance",
        details: {
          specs: ["3.5L V6 TT", "400+ hp", "0–60 in 4.2s"],
          benefits: ["Instant response", "High efficiency"],
          technology: ["Direct injection", "VVT", "Closed-loop boost"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
            title: "Cooling Strategy",
            description: "Dual-path cooling keeps temps stable under load.",
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
            title: "Turbo Detail",
            description: "Low-inertia turbines widen usable torque.",
          },
        ],
      },
      {
        id: "interior",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
        title: "Driver-Focused Cabin",
        description: "Premium materials, intuitive controls, low distraction.",
        category: "Interior",
        details: {
          specs: ['12.3" display', "Tri-zone climate"],
          benefits: ["Comfort", "Clarity"],
          technology: ["Voice control", "Wireless charging"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/561ac4b4-3604-4e66-ae72-83e2969d7d65/items/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
            title: "Center Console",
            description: "Clear haptics with storage within reach.",
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
            title: "Seating",
            description: "Supportive geometry; ventilation; memory.",
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
          benefits: ["Avoidance", "Reduced fatigue"],
          technology: ["Sensor fusion", "AI detection"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
            title: "Sensors",
            description: "Wide FOV camera and radar coverage.",
          },
        ],
      },
    ],
    []
  );

  const [open, setOpen] = React.useState<MediaItem | null>(null);
  const [idx, setIdx] = React.useState(0);

  const isVideo = open?.type === "video";
  const gallery = open ? ensureGallery(open) : [];

  const swipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => setIdx((p) => (open ? (p + 1) % gallery.length : p)),
    onSwipeRight: () => setIdx((p) => (open ? (p - 1 + gallery.length) % gallery.length : p)),
    threshold: 32,
  });

  useBodyScrollLock(!!open);

  // share deep link (kept simple)
  const onShare = React.useCallback(async () => {
    if (!open) return;
    const url = new URL(window.location.href);
    url.searchParams.set("media", open.id);
    url.searchParams.set("img", String(idx));
    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {}
  }, [open, idx]);

  // keyboard nav in modal
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setIdx((p) => (p + 1) % gallery.length);
      if (e.key === "ArrowLeft") setIdx((p) => (p - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, gallery.length]);

  return (
    <div className="px-4 md:px-8">
      {/* Grid of 3 big cards on desktop, 1-per-row on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {items.map((m, i) => (
          <Card
            key={m.id}
            className="overflow-hidden border bg-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setOpen(m);
              setIdx(0);
            }}
          >
            <div className="relative h-64">
              <img
                src={m.url}
                alt={m.title}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 left-2">
                <Badge variant="outline">{m.category}</Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{m.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {m.description}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* ——— Modal ——— */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ y: isMobile ? 36 : 0, scale: isMobile ? 1 : 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: isMobile ? 36 : 0, scale: isMobile ? 1 : 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "bg-background shadow-2xl overflow-hidden",
                isMobile ? "fixed inset-x-0 bottom-0 h-[88svh] rounded-t-2xl" : "fixed inset-6 rounded-2xl"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 md:p-4 border-b bg-background/95">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{idx + 1} / {gallery.length}</span>
                  <h3 className="text-lg md:text-xl font-semibold truncate">{open.title}</h3>
                  <Badge variant="outline" className="hidden md:inline-flex">{open.category}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {onBookTestDrive && (
                    <Button size="sm" className="bg-[--brand-red,#EB0A1E] hover:opacity-90" onClick={onBookTestDrive}>
                      Book Test Drive
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={onShare} aria-label="Copy deep link">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(null)} aria-label="Close">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content grid */}
              <div className="grid md:grid-cols-2 h-[calc(100%-56px)] md:h-[calc(100%-64px)]">
                {/* Left: Media (locks to aspect-video, no giant black band) */}
                <div ref={swipeRef} className="relative bg-black">
                  <div className="absolute inset-0 grid">
                    <div className="place-self-center w-full md:max-h-[70vh] aspect-video">
                      {isVideo ? (
                        <VideoEmbed item={open} playingIndex={idx} />
                      ) : (
                        <img
                          src={gallery[idx]?.url}
                          alt={gallery[idx]?.title || open.title}
                          className="w-full h-full object-cover"
                          loading="eager"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // swap to any other frame; never show broken image
                            const next = gallery[(idx + 1) % gallery.length]?.url || open.url;
                            (e.currentTarget as HTMLImageElement).src = next;
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Arrows */}
                  {gallery.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 hover:bg-white"
                        onClick={() => setIdx((p) => (p - 1 + gallery.length) % gallery.length)}
                        aria-label="Previous"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 hover:bg-white"
                        onClick={() => setIdx((p) => (p + 1) % gallery.length)}
                        aria-label="Next"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Dots */}
                  {gallery.length > 1 && (
                    <div className="absolute bottom-3 w-full flex items-center justify-center gap-2">
                      {gallery.map((_, i) => (
                        <button key={i} onClick={() => setIdx(i)} aria-label={`Go to ${i + 1}`}>
                          <Dot active={i === idx} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Thumb strip (desktop) */}
                  {gallery.length > 1 && (
                    <div className="hidden md:flex absolute top-3 right-3 flex-col gap-2">
                      {gallery.map((g, i) => (
                        <button
                          key={i}
                          onClick={() => setIdx(i)}
                          className={cn(
                            "h-16 w-24 overflow-hidden rounded-md border-2",
                            i === idx ? "border-primary" : "border-white/60 hover:border-white"
                          )}
                          aria-label={`Select ${g.title || `image ${i + 1}`}`}
                        >
                          <img src={g.url} alt={g.title} className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Content rail (scrolls independently, fills space) */}
                <div className="min-h-0 overflow-y-auto p-4 md:p-6 bg-background">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {(gallery[idx]?.badges ?? []).map((b) => (
                      <Badge key={b} variant="secondary" className="text-xs">{b}</Badge>
                    ))}
                  </div>

                  <h4 className="font-semibold text-xl mb-2">
                    {gallery[idx]?.title || open.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {gallery[idx]?.description || open.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Overview card */}
                    <Card className="p-4">
                      <p className="font-semibold mb-2">Overview</p>
                      <p className="text-sm text-muted-foreground">
                        {gallery[idx]?.description || open.description}
                      </p>
                    </Card>

                    {/* Specs / Benefits */}
                    <Card className="p-4">
                      <p className="font-semibold mb-2">Specifications</p>
                      <ul className="space-y-2">
                        {(gallery[idx]?.details?.specs ?? open.details?.specs ?? []).map((s, i) => (
                          <li key={i} className="text-sm flex items-center">
                            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full" style={{ background: TOYOTA.red }} />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="p-4">
                      <p className="font-semibold mb-2">Benefits</p>
                      <ul className="space-y-2">
                        {(gallery[idx]?.details?.benefits ?? open.details?.benefits ?? []).map((b, i) => (
                          <li key={i} className="text-sm flex items-center">
                            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </Card>

                    {/* Tech */}
                    <div className="md:col-span-2">
                      <Card className="p-4">
                        <p className="font-semibold mb-2">Technology</p>
                        <ul className="space-y-2">
                          {(gallery[idx]?.details?.technology ?? open.details?.technology ?? []).map((t, i) => (
                            <li key={i} className="text-sm flex items-center">
                              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
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

/** ————————————————————————————————————————————————
 * Video
 * ———————————————————————————————————————————————— */
const VideoEmbed: React.FC<{ item: MediaItem; playingIndex: number }> = ({ item }) => {
  const vid = getYouTubeId(item.url);
  const poster = item.thumbnail || (vid ? `https://i.ytimg.com/vi/${vid}/hqdefault.jpg` : undefined);
  const [playing, setPlaying] = React.useState(false);

  return (
    <div className="relative w-full h-full">
      {!playing ? (
        <button
          className="absolute inset-0"
          onClick={() => setPlaying(true)}
          aria-label="Play video"
        >
          {poster ? (
            <img src={poster} alt={item.title} className="w-full h-full object-cover" loading="eager" />
          ) : (
            <div className="w-full h-full bg-black" />
          )}
          <div className="absolute inset-0 grid place-items-center">
            <span className="px-4 py-2 rounded-full bg-white/90 text-sm">Play</span>
          </div>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          title={item.title}
          src={`https://www.youtube-nocookie.com/embed/${vid}?rel=0&modestbranding=1&playsinline=1&autoplay=1`}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};

export default VehicleMediaShowcase;
