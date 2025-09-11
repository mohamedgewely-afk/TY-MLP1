import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * ToyotaMediaStudioPro.tsx – v3
 * Radical redesign: Mosaic grid (hero + mediums + smalls), Toyota tone, mobile-first, bulletproof media.
 * • 6 cards always; uses demo items if none provided
 * • DAM images + YouTube videos (auto poster) – no broken thumbnails
 * • Distinct new look: asymmetrical mosaic, clean surfaces, red micro-accents, refined motion
 */

/********************** Brand tokens **********************/
const TOKENS = {
  red: "#EB0A1E",
  ink: "#0F0F10",
  text: "#101010",
  radius: "rounded-xl",
  border: "border border-neutral-200",
};

/********************** Types *****************************/
export type MediaType = "image" | "video";
export interface MediaItem {
  id: string;
  type: MediaType;
  url: string; // image URL or full YouTube URL
  thumbnail?: string; // optional video poster
  title: string;
  description?: string;
  category?: string;
  gallery?: { url: string; title?: string; description?: string }[];
}

export interface ToyotaMediaStudioProProps {
  title?: string;
  subtitle?: string;
  items?: MediaItem[]; // optional; demo used if omitted
  className?: string;
}

/********************** Demo items (6) *******************/
const DEMO_ITEMS: MediaItem[] = [
  {
    id: "performance",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true",
    title: "V6 Twin‑Turbo",
    description: "400+ hp, broad torque band, efficient cruising.",
    category: "Performance",
    gallery: [
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true", title: "Cooling Strategy", description: "Dual‑path cooling improves thermal stability under load." },
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true", title: "Turbo Detail", description: "Low‑inertia turbines widen usable torque." },
    ],
  },
  {
    id: "interior",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    title: "Driver‑Focused Cabin",
    description: "Premium materials, intuitive controls, low distraction.",
    category: "Interior",
  },
  {
    id: "safety",
    type: "video",
    url: "https://www.youtube.com/watch?v=NCSxxuPE6wM",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    title: "Toyota Safety Sense",
    description: "Camera+radar fusion, assistance when you need it.",
    category: "Safety",
  },
  {
    id: "quality",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    title: "Build Quality",
    description: "High-strength materials and precise assembly.",
    category: "Quality",
  },
  {
    id: "handling",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
    title: "Chassis Dynamics",
    description: "Adaptive damping and precise control.",
    category: "Performance",
  },
  {
    id: "connectivity",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    title: "Connected Services",
    description: "CarPlay/Android Auto, OTA updates, cloud sync.",
    category: "Technology",
  },
];

/********************** Utilities *************************/
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));
const isBrowser = typeof window !== "undefined";
const youTubeId = (url: string) => {
  const m = url?.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,11})/);
  return m ? m[1] : "";
};

/********************** SafeImage *************************/
interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fit?: "cover" | "contain";
  ratio?: string; // e.g. "aspect-video"
  fallbackText?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({ src, alt, className, fit = "cover", ratio, fallbackText = "Image unavailable", ...rest }) => {
  const [err, setErr] = useState(false);
  return (
    <div className={cn("relative w-full", ratio)}>
      {!err ? (
        <img
          src={src as string}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={cn("w-full h-full transition-opacity duration-300 opacity-0 data-[loaded=true]:opacity-100", fit === "cover" ? "object-cover" : "object-contain bg-black", className)}
          onLoad={(e) => (e.currentTarget.dataset.loaded = "true")}
          onError={() => setErr(true)}
          {...rest}
        />
      ) : (
        <div className="w-full h-full grid place-items-center bg-neutral-100 text-neutral-500 text-xs">{fallbackText}</div>
      )}
    </div>
  );
};

/********************** Video (deferred) ******************/
const VideoPlayer: React.FC<{ url: string; title: string; muted: boolean; playing: boolean } & React.HTMLAttributes<HTMLDivElement>> = ({ url, title, muted, playing, className }) => {
  const id = youTubeId(url);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return (
    <div className={cn("relative w-full aspect-video bg-black", className)}>
      {hydrated && (
        <iframe
          title={title}
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1${muted ? "&mute=1" : ""}${playing ? "&autoplay=1" : ""}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};

/********************** Mosaic Card **********************/
interface MosaicCardProps {
  item: MediaItem;
  size: "xl" | "md" | "sm";
  onOpen: (m: MediaItem) => void;
}

const MosaicCard: React.FC<MosaicCardProps> = ({ item, size, onOpen }) => {
  const isVideo = item.type === "video";
  const poster = isVideo ? item.thumbnail || (youTubeId(item.url) ? `https://i.ytimg.com/vi/${youTubeId(item.url)}/hqdefault.jpg` : undefined) : item.url;
  const radius = TOKENS.radius;
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className={cn("group relative", size === "xl" ? "lg:col-span-4 col-span-2" : size === "md" ? "lg:col-span-2 col-span-2" : "lg:col-span-2 col-span-2")}
    >
      <Card className={cn("overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all", TOKENS.border, radius)}>
        <button onClick={() => onOpen(item)} className="block w-full text-left focus:outline-none">
          <div className={cn("relative", size === "xl" ? "aspect-[16/9]" : size === "md" ? "aspect-[4/3]" : "aspect-[16/10]") }>
            <SafeImage src={poster as string} alt={item.title} fit="cover" className="absolute inset-0" />
            {/* Play */}
            {isVideo && (
              <div className="absolute inset-0 grid place-items-center">
                <span className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/90 border px-3 py-2 rounded-full shadow-sm">
                  <Play className="w-4 h-4" /> Watch
                </span>
              </div>
            )}
            {/* Edge accent */}
            <div className="absolute left-0 top-0 h-1.5 w-24" style={{ background: TOKENS.red }} />
          </div>
          <div className="p-4 border-t">
            {item.category && (
              <div className="mb-1">
                <span className="text-[11px] tracking-wide px-2 py-0.5 border rounded-full">{item.category}</span>
              </div>
            )}
            <h3 className="text-base md:text-lg font-bold leading-snug">{item.title}</h3>
            {item.description && <p className="text-sm text-neutral-600 line-clamp-2 mt-1">{item.description}</p>}
          </div>
        </button>
      </Card>
    </motion.article>
  );
};

/********************** Component *************************/
const ToyotaMediaStudioPro: React.FC<ToyotaMediaStudioProProps> = ({ title = "Highlights", subtitle = "Engineered clarity. Effortless choice.", items, className }) => {
  // normalize to 6 cards
  const media = useMemo(() => {
    const src = items?.length ? items : DEMO_ITEMS;
    const six = src.slice(0, 6);
    while (six.length < 6 && six.length > 0) six.push({ ...six[six.length - 1], id: six[six.length - 1].id + "_dup" });
    return six;
  }, [items]);

  const [open, setOpen] = useState<MediaItem | null>(null);
  const [index, setIndex] = useState(0); // gallery index
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);

  const onOpen = (m: MediaItem) => {
    setOpen(m);
    setIndex(0);
    setPlaying(false);
    if (isBrowser) {
      const url = new URL(window.location.href);
      url.searchParams.set("media", m.id);
      url.searchParams.set("img", "0");
      window.history.replaceState({}, "", url.toString());
    }
  };
  const onClose = useCallback(() => {
    setOpen(null);
    setPlaying(false);
    if (isBrowser) {
      const url = new URL(window.location.href);
      url.searchParams.delete("media");
      url.searchParams.delete("img");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

  // deep link on load
  useEffect(() => {
    if (!isBrowser) return;
    const url = new URL(window.location.href);
    const id = url.searchParams.get("media");
    const img = Number(url.searchParams.get("img") || 0);
    if (id) {
      const m = media.find((x) => x.id === id);
      if (m) {
        setOpen(m);
        setIndex(Number.isFinite(img) ? clamp(img, 0, (m.gallery?.length || 1) - 1) : 0);
      }
    }
  }, [media]);

  // current visual for modal
  const current = useMemo(() => {
    if (!open) return null;
    if (open.type === "video") return { url: open.thumbnail || (youTubeId(open.url) ? `https://i.ytimg.com/vi/${youTubeId(open.url)}/hqdefault.jpg` : undefined), title: open.title, description: open.description };
    if (open.gallery?.length) return open.gallery[clamp(index, 0, open.gallery.length - 1)];
    return { url: open.url, title: open.title, description: open.description };
  }, [open, index]);

  // swipe (mobile) for modal
  const startX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const handleTouchEnd = () => (startX.current = null);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!open || !startX.current || open.type === "video") return;
    const dx = e.touches[0].clientX - startX.current;
    if (Math.abs(dx) > 60) {
      if (dx < 0) setIndex((p) => (open?.gallery ? (p + 1) % open.gallery.length : p));
      else setIndex((p) => (open?.gallery ? (p - 1 + open.gallery.length) % open.gallery.length : p));
      startX.current = e.touches[0].clientX;
    }
  };

  const share = async () => {
    if (!isBrowser) return;
    const url = new URL(window.location.href);
    if (open) {
      url.searchParams.set("media", open.id);
      url.searchParams.set("img", String(index));
    }
    try { await navigator.clipboard.writeText(url.toString()); } catch {}
  };

  // Compute card sizes for mosaic
  const sizes: ("xl" | "md" | "sm")[] = ["xl", "md", "md", "sm", "sm", "sm"];

  return (
    <section className={cn("w-full", className)}>
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_0%,#ffffff,rgba(255,255,255,0)_60%)]" />

      {/* Header */}
      <div className="px-4 md:px-10 pt-10 md:pt-14 text-center">
        <Badge variant="outline" className={cn("px-3 py-1", TOKENS.radius)}>Toyota</Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3" style={{ color: TOKENS.text }}>{title}</h2>
        <p className="text-sm md:text-base text-neutral-600 mt-2 max-w-2xl mx-auto">{subtitle}</p>
      </div>

      {/* Mosaic grid (6 cards) */}
      <div className="px-4 md:px-10 py-8 grid grid-cols-2 lg:grid-cols-6 gap-5">
        {media.slice(0, 6).map((m, i) => (
          <MosaicCard key={m.id + i} item={m} size={sizes[i] ?? "sm"} onOpen={onOpen} />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 bg-black/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 md:inset-6 bg-white shadow-2xl overflow-hidden grid md:grid-cols-[1.15fr_0.85fr]"
              role="dialog" aria-modal="true"
            >
              {/* Header */}
              <div className="col-span-full flex items-center justify-between px-4 md:px-6 py-3 border-b bg-white/95">
                <div className="min-w-0">
                  <h3 className="text-lg md:text-2xl font-bold truncate">{open.title}</h3>
                  {open.category && <p className="text-neutral-600 text-sm md:text-base truncate">{open.category}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={share} aria-label="Copy deep link" className="hover:bg-neutral-100"><Share2 className="w-5 h-5" /></Button>
                  {open.type === "video" && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => setMuted((m) => !m)} aria-label="Toggle mute" className="hover:bg-neutral-100">{muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</Button>
                      <Button variant="ghost" size="icon" onClick={() => setPlaying((p) => !p)} aria-label="Toggle play" className="hover:bg-neutral-100">{playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="hover:bg-neutral-100"><X className="w-5 h-5" /></Button>
                </div>
              </div>

              {/* Visual */}
              <div className="bg-neutral-950 relative" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                {open.type === "video" ? (
                  <div className="mx-auto max-w-6xl">
                    <VideoPlayer url={open.url} title={open.title} muted={muted} playing={playing} />
                  </div>
                ) : (
                  <div className="mx-auto max-w-6xl">
                    <SafeImage src={current?.url as string} alt={current?.title || open.title} fit="contain" ratio="aspect-video" />
                  </div>
                )}

                {/* arrows (images only, desktop) */}
                {open.type === "image" && open.gallery?.length && open.gallery.length > 1 && (
                  <div className="hidden md:block">
                    <Button variant="outline" size="icon" onClick={() => setIndex((p) => (p - 1 + open.gallery!.length) % open.gallery!.length)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95"><ChevronLeft className="w-5 h-5" /></Button>
                    <Button variant="outline" size="icon" onClick={() => setIndex((p) => (p + 1) % open.gallery!.length)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95"><ChevronRight className="w-5 h-5" /></Button>
                  </div>
                )}

                {/* thumbs */}
                {open.type === "image" && open.gallery?.length && open.gallery.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t p-3">
                    <div className="flex gap-2 overflow-x-auto">
                      {open.gallery.map((g, i) => (
                        <button key={i} aria-label={`Image ${i + 1}`} onClick={() => setIndex(i)} className={cn("flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2", i === index ? "border-[" + TOKENS.red + "]" : "border-transparent hover:border-neutral-300")}>
                          <SafeImage src={g.url} alt={g.title} fit="cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="min-h-0 overflow-y-auto p-5 md:p-7">
                <h4 className="text-base md:text-xl font-semibold">{current?.title || open.title}</h4>
                {current?.description && <p className="text-sm text-neutral-600 mt-1">{current.description}</p>}

                {/* Info chips */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-3 rounded-md border bg-white">
                    <p className="text-xs text-neutral-500">Highlights</p>
                    <p className="text-sm mt-1">{open.category || "—"}</p>
                  </div>
                  <div className="p-3 rounded-md border bg-white">
                    <p className="text-xs text-neutral-500">Media</p>
                    <p className="text-sm mt-1">{open.type === "video" ? "Video" : open.gallery?.length ? `${open.gallery.length} images` : "Image"}</p>
                  </div>
                  <div className="p-3 rounded-md border bg-white">
                    <p className="text-xs text-neutral-500">Share</p>
                    <button onClick={share} className="text-sm mt-1 underline">Copy link</button>
                  </div>
                </div>

                {open.description && (
                  <div className="mt-6 border-t pt-4">
                    <p className="text-sm text-neutral-700 leading-relaxed">{open.description}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ToyotaMediaStudioPro;
