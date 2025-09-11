import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { VehicleModel } from "@/types/vehicle";

/**
 * ToyotaMediaStudioPro.tsx – v4 (de-dupe + diversify)
 * - Canonicalize URLs, remove duplicates (items & galleries)
 * - Auto-caption gallery frames
 * - Choose best hero (video>rich image), diversify categories across grid
 * - Stronger a11y & keyboard control, robust share
 */

const TOKENS = {
  red: "#EB0A1E",
  ink: "#0F0F10",
  text: "#101010",
  radius: "rounded-xl",
  border: "border border-neutral-200",
};

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
  items?: MediaItem[];
  className?: string;
  vehicle?: VehicleModel;
}

/********************** Demo items (unchanged) *******************/
const DEMO_ITEMS: MediaItem[] = [
  {
    id: "performance",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true",
    title: "V6 Twin-Turbo",
    description: "400+ hp, broad torque band, efficient cruising.",
    category: "Performance",
    gallery: [
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true", title: "Cooling Strategy", description: "Dual-path cooling improves thermal stability under load." },
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true", title: "Turbo Detail", description: "Low-inertia turbines widen usable torque." },
    ],
  },
  {
    id: "interior",
    type: "image",
    url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    title: "Driver-Focused Cabin",
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

// Canonicalize DAM/YouTube URLs for reliable de-duplication
const canonicalUrl = (raw?: string) => {
  if (!raw) return "";
  try {
    const u = new URL(raw);
    // For DAM: drop query, trim after /renditions/<id>
    if (u.hostname.includes("dam.alfuttaim.com")) {
      const ix = u.pathname.indexOf("/renditions/");
      const base = ix >= 0 ? u.origin + u.pathname.slice(0, ix) : u.origin + u.pathname;
      return base.toLowerCase();
    }
    // For YouTube: resolve to id only
    if (u.hostname.includes("youtube") || u.hostname.includes("youtu.be")) {
      const id = youTubeId(raw);
      return id ? `yt:${id}` : raw.toLowerCase();
    }
    return (u.origin + u.pathname).toLowerCase();
  } catch {
    return raw.toLowerCase();
  }
};

type ScoredItem = MediaItem & { __score: number };

// Prefer: video, then images with gallery/description/category richness
const scoreItem = (m: MediaItem) =>
  (m.type === "video" ? 1000 : 0) +
  (m.gallery?.length || 0) * 8 +
  (m.description ? 3 : 0) +
  (m.category ? 2 : 0) +
  Math.min((m.title || "").length, 40) / 20;

// Ensure each gallery frame has unique, meaningful caption
const normalizeGallery = (m: MediaItem): MediaItem => {
  if (!m.gallery?.length) return m;
  const seen = new Set<string>();
  const normGallery = m.gallery
    .filter((g) => {
      const key = canonicalUrl(g.url);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((g, i) => ({
      url: g.url,
      title: g.title || `${m.title} — Detail ${i + 1}`,
      description: g.description || m.description || m.category || "",
    }));
  return { ...m, gallery: normGallery };
};

// Remove item-level duplicates by canonical URL (image, thumbnail, or YT id)
const dedupeItems = (items: MediaItem[]) => {
  const seen = new Set<string>();
  const out: MediaItem[] = [];
  for (const it of items) {
    const primary = canonicalUrl(it.type === "video" ? (it.thumbnail || it.url) : it.url);
    if (!primary || seen.has(primary)) continue;
    seen.add(primary);
    out.push(normalizeGallery(it));
  }
  return out;
};

// Choose up to 6 items maximizing category diversity, with the best hero first
const selectSixDiversified = (items: MediaItem[]) => {
  const scored: ScoredItem[] = items.map((m) => ({ ...m, __score: scoreItem(m) }));
  // pick hero
  scored.sort((a, b) => b.__score - a.__score);
  const hero = scored[0];
  const rest = scored.slice(1);

  // Greedy category diversification
  const chosen: MediaItem[] = hero ? [hero] : [];
  const seenCats = new Set<string>(hero?.category ? [hero.category] : []);
  for (const s of rest) {
    if (chosen.length >= 6) break;
    const cat = s.category || "";
    if (!cat || !seenCats.has(cat)) {
      chosen.push(s);
      if (cat) seenCats.add(cat);
    }
  }
  // If still short, fill with remaining highest-score
  if (chosen.length < 6) {
    for (const s of rest) {
      if (chosen.length >= 6) break;
      if (!chosen.find((c) => c.id === s.id)) chosen.push(s);
    }
  }
  return chosen.slice(0, 6);
};

// Guarantee 6 without cloning identical visuals (last resort: light variants)
const ensureSix = (items: MediaItem[]) => {
  const arr = [...items];
  let i = 0;
  while (arr.length < 6 && items[i]) {
    const base = items[i];
    arr.push({
      ...base,
      id: `${base.id}-${arr.length}`,
      title: base.title.endsWith(" II") ? `${base.title} • ${arr.length}` : `${base.title} II`,
      description: base.description || base.category || "",
    });
    i = (i + 1) % items.length;
  }
  return arr.slice(0, 6);
};

/********************** SafeImage *************************/
interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fit?: "cover" | "contain";
  ratio?: string; // e.g. "aspect-video"
  sizesAttr?: string;
  srcSetAttr?: string;
  fallbackText?: string;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fit = "cover",
  ratio,
  sizesAttr,
  srcSetAttr,
  fallbackText = "Image unavailable",
  ...rest
}) => {
  const [err, setErr] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("relative w-full", ratio)}>
      {!err ? (
        <img
          src={src as string}
          srcSet={srcSetAttr}
          sizes={sizesAttr}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn(
            "w-full h-full transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
            fit === "cover" ? "object-cover" : "object-contain bg-black",
            className
          )}
          onLoad={() => setLoaded(true)}
          onError={() => setErr(true)}
          {...rest}
        />
      ) : (
        <div className="w-full h-full grid place-items-center bg-neutral-100 text-neutral-500 text-xs">
          {fallbackText}
        </div>
      )}
    </div>
  );
};

/********************** Video (deferred) ******************/
const VideoPlayer: React.FC<{
  url: string;
  title: string;
  muted: boolean;
  playing: boolean;
} & React.HTMLAttributes<HTMLDivElement>> = ({ url, title, muted, playing, className }) => {
  const id = youTubeId(url);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return (
    <div className={cn("relative w-full aspect-video bg-black", className)}>
      {hydrated && id && (
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

const MosaicCard: React.FC<MosaicCardProps> = React.memo(({ item, size, onOpen }) => {
  const isVideo = item.type === "video";
  const poster =
    isVideo
      ? item.thumbnail || (youTubeId(item.url) ? `https://i.ytimg.com/vi/${youTubeId(item.url)}/hqdefault.jpg` : undefined)
      : item.url;
  const radius = TOKENS.radius;

  return (
    <motion.article whileHover={{ y: -2 }} className={cn("group relative", size === "xl" ? "lg:col-span-4 col-span-2" : "lg:col-span-2 col-span-2")}>
      <Card className={cn("overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all", TOKENS.border, radius)}>
        <button onClick={() => onOpen(item)} className="block w-full text-left focus:outline-none" aria-label={`Open ${item.title}`}>
          <div
            className={cn("relative w-full", size === "xl" ? "min-h-[220px] md:min-h-[360px]" : "min-h-[180px] md:min-h-[260px]")}
            style={{ aspectRatio: size === "xl" ? "16/9" : size === "md" ? "4/3" : "16/10" }}
          >
            {poster && <SafeImage src={poster} alt={item.title} fit="cover" className="absolute inset-0" />}
            {isVideo && (
              <div className="absolute inset-0 grid place-items-center">
                <span className="inline-flex items-center gap-2 text-xs md:text-sm bg-white/90 border px-3 py-2 rounded-full shadow-sm">
                  <Play className="w-4 h-4" /> Watch
                </span>
              </div>
            )}
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
});
MosaicCard.displayName = "MosaicCard";

/********************** Component *************************/
const ToyotaMediaStudioPro: React.FC<ToyotaMediaStudioProProps> = ({
  title = "Highlights",
  subtitle = "Engineered clarity. Effortless choice.",
  items,
  className,
  vehicle,
}) => {
  // Normalize → de-dupe → diversify → ensure 6
  const media = useMemo(() => {
    const src = items?.length ? items : DEMO_ITEMS;
    const deduped = dedupeItems(src);
    const diversified = selectSixDiversified(deduped);
    return ensureSix(diversified);
  }, [items]);

  // Sizes: hero first then balanced
  const sizes: ("xl" | "md" | "sm")[] = ["xl", "md", "md", "sm", "sm", "sm"];

  // Modal state
  const [open, setOpen] = useState<MediaItem | null>(null);
  const [index, setIndex] = useState(0);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const onOpen = useCallback((m: MediaItem) => {
    setOpen(m);
    setIndex(0);
    setPlaying(false);
    if (isBrowser) {
      const url = new URL(window.location.href);
      url.searchParams.set("media", m.id);
      url.searchParams.set("img", "0");
      window.history.replaceState({}, "", url.toString());
    }
  }, []);

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

  // Focus trap + keyboard controls
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    modalRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (open.type === "image" && open.gallery?.length) {
        if (e.key === "ArrowRight") setIndex((p) => (p + 1) % open.gallery!.length);
        if (e.key === "ArrowLeft") setIndex((p) => (p - 1 + open.gallery!.length) % open.gallery!.length);
      }
      if (open.type === "video" && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  // Current visual
  const current = useMemo(() => {
    if (!open) return null;
    if (open.type === "video")
      return {
        url: open.thumbnail || (youTubeId(open.url) ? `https://i.ytimg.com/vi/${youTubeId(open.url)}/hqdefault.jpg` : undefined),
        title: open.title,
        description: open.description,
      };
    if (open.gallery?.length) return open.gallery[clamp(index, 0, open.gallery.length - 1)];
    return { url: open.url, title: open.title, description: open.description };
  }, [open, index]);

  // Touch swipe (images)
  const startX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => (startX.current = e.touches[0].clientX);
  const handleTouchEnd = () => (startX.current = null);
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!open || !startX.current || open.type === "video" || !open.gallery?.length) return;
    const dx = e.touches[0].clientX - startX.current;
    if (Math.abs(dx) > 60) {
      setIndex((p) => (dx < 0 ? (p + 1) % open.gallery!.length : (p - 1 + open.gallery!.length) % open.gallery!.length));
      startX.current = e.touches[0].clientX;
    }
  };

  // Share deep link (Web Share API → clipboard fallback)
  const share = async () => {
    if (!isBrowser) return;
    const url = new URL(window.location.href);
    if (open) {
      url.searchParams.set("media", open.id);
      url.searchParams.set("img", String(index));
    }
    const shareUrl = url.toString();
    try {
      if ("share" in navigator) {
        await (navigator as any).share({
          title: open?.title || document.title,
          text: open?.description || undefined,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(shareUrl);
      } catch {}
    }
  };

  return (
    <section className={cn("relative w-full", className)}>
      {/* Backdrop */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_0%,#ffffff,rgba(255,255,255,0)_60%)]" />

      {/* Header */}
      <div className="px-4 md:px-10 pt-10 md:pt-14 text-center">
        <Badge variant="outline" className={cn("px-3 py-1", TOKENS.radius)}>{vehicle?.name ?? "Toyota"}</Badge>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3" style={{ color: TOKENS.text }}>{title}</h2>
        <p className="text-sm md:text-base text-neutral-600 mt-2 max-w-2xl mx-auto">{subtitle}</p>
      </div>

      {/* Mosaic grid (6 cards) */}
      <div className="px-4 md:px-10 py-8 grid grid-cols-2 lg:grid-cols-6 gap-5">
        {media.slice(0, 6).map((m, i) => (
          <MosaicCard key={`${m.id}-${i}`} item={m} size={sizes[i] ?? "sm"} onOpen={onOpen} />
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              ref={modalRef}
              tabIndex={-1}
              aria-labelledby="media-modal-title"
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 md:inset-6 bg-white shadow-2xl overflow-hidden grid md:grid-cols-[1.15fr_0.85fr]"
            >
              {/* Header */}
              <div className="col-span-full flex items-center justify-between px-4 md:px-6 py-3 border-b bg-white/95">
                <div className="min-w-0">
                  <h3 id="media-modal-title" className="text-lg md:text-2xl font-bold truncate">{open.title}</h3>
                  {open.category && <p className="text-neutral-600 text-sm md:text-base truncate">{open.category}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={share} aria-label="Share or copy deep link" className="hover:bg-neutral-100">
                    <Share2 className="w-5 h-5" />
                  </Button>
                  {open.type === "video" && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => setMuted((m) => !m)} aria-label={muted ? "Unmute" : "Mute"} className="hover:bg-neutral-100">
                        {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setPlaying((p) => !p)} aria-label={playing ? "Pause" : "Play"} className="hover:bg-neutral-100">
                        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close" className="hover:bg-neutral-100">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Visual */}
              <div
                className="bg-neutral-950 relative"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
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
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIndex((p) => (p - 1 + open.gallery!.length) % open.gallery!.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIndex((p) => (p + 1) % open.gallery!.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                )}

                {/* thumbs */}
                {open.type === "image" && open.gallery?.length && open.gallery.length > 1 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 border-t p-3">
                    <div className="flex gap-2 overflow-x-auto">
                      {open.gallery.map((g, i) => (
                        <button
                          key={i}
                          aria-label={`Image ${i + 1}`}
                          onClick={() => setIndex(i)}
                          className={cn("flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 hover:ring-1 hover:ring-neutral-300")}
                          style={{ borderColor: i === index ? TOKENS.red : "transparent" }}
                        >
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
                    <button onClick={share} className="text-sm mt-1 underline">Copy / Share link</button>
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
