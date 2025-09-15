import React, { useEffect, useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { Play, Info, Shield, Zap, Heart, Wifi, Award, Star, X, ChevronLeft, ChevronRight, Car } from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Types & tokens
────────────────────────────────────────────────────────── */
type ModalVariant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";

interface MediaItem {
  id: string;
  category: string;
  title: string;
  summary: string;          // short text, no bullets
  kind: "image" | "video";
  thumbnail: string;
  gallery: Array<{ url: string; title: string; description?: string }>;
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  badges?: string[];        // small chips (0–3)
  variant: ModalVariant;
}

const VARIANT_STYLES: Record<
  ModalVariant,
  { accent: string; bg: string; text: string; icon: React.ComponentType<any> }
> = {
  performance: { accent: "from-red-600 to-red-700", bg: "bg-red-50/80", text: "text-red-700", icon: Zap },
  safety:      { accent: "from-blue-600 to-blue-700", bg: "bg-blue-50/80", text: "text-blue-700", icon: Shield },
  interior:    { accent: "from-amber-600 to-amber-700", bg: "bg-amber-50/80", text: "text-amber-700", icon: Heart },
  quality:     { accent: "from-gray-600 to-gray-700", bg: "bg-gray-50/80", text: "text-gray-700", icon: Award },
  technology:  { accent: "from-cyan-600 to-cyan-700", bg: "bg-cyan-50/80", text: "text-cyan-700", icon: Wifi },
  handling:    { accent: "from-emerald-600 to-emerald-700", bg: "bg-emerald-50/80", text: "text-emerald-700", icon: Star },
};

function cn(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

/* ─────────────────────────────────────────────────────────
   DAM-backed media (kept minimal; no bullets)
────────────────────────────────────────────────────────── */
const MEDIA: MediaItem[] = [
  {
    id: "performance",
    category: "Performance",
    title: "V6 Twin-Turbo Engine",
    summary: "Immediate torque with a smooth surge for overtakes and climbs.",
    kind: "image",
    variant: "performance",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Engine Architecture",
      },
      {
        url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1600&auto=format&fit=crop",
        title: "Power Delivery",
      },
    ],
    badges: ["400+ HP", "Twin-Turbo"],
  },
  {
    id: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "Pre-collision alerts, lane tracing, and adaptive cruise support.",
    kind: "video", // will show Wistia in modal
    variant: "safety",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    video: { provider: "wistia", id: "kvdhnonllm", autoplay: false },
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Assistance Suite",
      },
    ],
    badges: ["PCS", "LTA", "ACC"],
  },
  {
    id: "interior",
    category: "Interior",
    title: "Premium Cabin",
    summary: "Soft-touch materials and a responsive, driver-first layout.",
    kind: "image",
    variant: "interior",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Command Center",
      },
    ],
    badges: ['12.3" Display', "Memory Seats"],
  },
  {
    id: "quality",
    category: "Quality",
    title: "Built to Last",
    summary: "Global standards, corrosion protection, and assured dependability.",
    kind: "image",
    variant: "quality",
    thumbnail:
      "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop",
        title: "Assurance",
      },
    ],
    badges: ["ISO 9001", "Warranty"],
  },
  {
    id: "technology",
    category: "Technology",
    title: "Smart Connectivity",
    summary: "OTA updates and seamless phone integration.",
    kind: "image",
    variant: "technology",
    thumbnail:
      "https://images.unsplash.com/photo-1603481588273-0c31c4b7a52f?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
        title: "Infotainment",
      },
    ],
    badges: ["OTA", "CarPlay/AA"],
  },
  {
    id: "handling",
    category: "Handling",
    title: "Composed Dynamics",
    summary: "Selectable modes adapt response for road or desert.",
    kind: "image",
    variant: "handling",
    thumbnail:
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
        title: "Drive Modes",
      },
      {
        url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop",
        title: "Sport",
      },
    ],
    badges: ["Multi-Mode", "Grip"],
  },
];

/* ─────────────────────────────────────────────────────────
   Modal (simple, reliable)
────────────────────────────────────────────────────────── */
function MediaModal({
  item,
  open,
  onClose,
  onBookTestDrive,
}: {
  item: MediaItem | null;
  open: boolean;
  onClose: () => void;
  onBookTestDrive?: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const isVideo = item?.kind === "video" && item.video;
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!item || isVideo) return;
      if (e.key === "ArrowRight") setIdx((i) => Math.min((item.gallery?.length ?? 1) - 1, i + 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, item, isVideo]);

  if (!open || !item) return null;
  const style = VARIANT_STYLES[item.variant];
  const Icon = style.icon;
  const slide = item.gallery[idx];

  return (
    <div className="fixed inset-0 z-50" aria-modal="true" role="dialog" aria-labelledby="media-modal-title">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 bg-zinc-950 text-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="h-14 px-4 lg:px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <Badge className={`bg-gradient-to-r ${style.accent} text-white border-0`}>
              <Icon className="h-3.5 w-3.5 mr-1" />
              {item.category}
            </Badge>
            <h3 id="media-modal-title" className="font-semibold truncate">{item.title}</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-white/80" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* Body */}
        <div className="grid lg:grid-cols-12">
          {/* Stage */}
          <div className="lg:col-span-7 p-3 lg:p-4">
            <div className="relative bg-black rounded-lg overflow-hidden min-h-[52vh]">
              {isVideo ? (
                item.video?.provider === "youtube" ? (
                  <iframe
                    title={item.title}
                    className="w-full h-[52vh]"
                    src={`https://www.youtube.com/embed/${item.video.id}?autoplay=${item.video.autoplay ? 1 : 0}&rel=0&modestbranding=1`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <iframe
                    title={item.title}
                    className="w-full h-[52vh]"
                    src={`https://fast.wistia.net/embed/iframe/${item.video?.id}?autoPlay=${item.video?.autoplay ? 1 : 0}`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <>
                  <img
                    src={slide?.url}
                    alt={slide?.title || item.title}
                    className="absolute inset-0 w-full h-full object-contain"
                    loading="lazy"
                  />
                  {item.gallery.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIdx((i) => Math.max(0, i - 1))}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                        aria-label="Previous"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIdx((i) => Math.min(item.gallery.length - 1, i + 1))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                        aria-label="Next"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </Button>
                      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
                        {item.gallery.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setIdx(i)}
                            className={`w-2 h-2 rounded-full ${i === idx ? "bg-white" : "bg-white/40"}`}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Info rail (no bullets; concise text + chips) */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-white/10 p-4">
            <p className="text-sm text-white/90">{item.summary}</p>
            {!!item.badges?.length && (
              <div className="flex flex-wrap gap-1 pt-3">
                {item.badges.slice(0, 6).map((b, i) => (
                  <span
                    key={i}
                    className={cn("text-xs px-2 py-1 rounded-full font-medium", VARIANT_STYLES[item.variant].bg, VARIANT_STYLES[item.variant].text)}
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="sticky bottom-0 inset-x-0 bg-zinc-900/80 backdrop-blur border-t border-white/10 px-3 lg:px-4 py-3 flex items-center gap-2">
          <Button variant="outline" className="h-11 w-full sm:w-auto" onClick={onClose}>
            Close
          </Button>
          <Button className="h-11 w-full sm:w-auto bg-[#EB0A1E] hover:bg-[#d70a19]" onClick={() => onBookTestDrive?.()}>
            <Car className="h-4 w-4 mr-2" />
            Book Test Drive
          </Button>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Card
────────────────────────────────────────────────────────── */
function MediaCard({ item, className, onOpen }: { item: MediaItem; className?: string; onOpen: (m: MediaItem) => void }) {
  const style = VARIANT_STYLES[item.variant];
  const Icon = style.icon;

  return (
    <article
      role="listitem"
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-300",
        "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-900",
        className
      )}
    >
      <button onClick={() => onOpen(item)} className="w-full text-left focus:outline-none" aria-label={`Open ${item.title}`}>
        <div className="relative h-[220px] md:h-full overflow-hidden">
          <img
            src={item.thumbnail}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] duration-500"
            loading="lazy"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          {item.kind === "video" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/95 rounded-full grid place-items-center group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-gray-900 translate-x-[1px]" />
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`bg-gradient-to-r ${style.accent} text-white border-0`}>
              <Icon className="h-3.5 w-3.5 mr-1" />
              {item.category}
            </Badge>
          </div>
        </div>

        <div className="p-5 md:p-4">
          <h3 className="font-bold text-lg md:text-base text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
            {item.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{item.summary}</p>

          {!!item.badges?.length && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.badges.slice(0, 3).map((b, i) => (
                <span key={i} className={cn("text-xs px-2 py-1 rounded-full font-medium", style.bg, style.text)}>
                  {b}
                </span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              {item.gallery.length} image{item.gallery.length !== 1 ? "s" : ""}
            </span>
            <Info className="h-4 w-4" />
          </div>
        </div>
      </button>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────
   Mosaic + Mobile Rail (with working modal)
────────────────────────────────────────────────────────── */
interface VehicleMediaMosaicProps {
  vehicle: VehicleModel;
  items?: MediaItem[];
  onBookTestDrive?: () => void;
}

const VehicleMediaMosaic: React.FC<VehicleMediaMosaicProps> = ({ vehicle, items, onBookTestDrive }) => {
  const data = items && items.length ? items : MEDIA;
  const [openItem, setOpenItem] = useState<MediaItem | null>(null);

  // Desktop mosaic tile sizes (explicit heights to avoid 0-height thumbnails)
  const MOSAIC: string[] = [
    "md:col-span-3 md:h-[420px]", // hero
    "md:col-span-3 md:h-[420px]", // big
    "md:col-span-2 md:h-[240px]", // wide
    "md:col-span-2 md:h-[240px]", // wide
    "md:col-span-1 md:h-[240px]", // normal
    "md:col-span-1 md:h-[240px]", // normal
  ];

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Discover Every Detail</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the engineering, safety, and craftsmanship that define the {vehicle?.name ?? "vehicle"} experience.
          </p>
        </div>

        {/* Mobile: swipeable rail with snap and next-card peek */}
        <div
          className="-mx-4 px-4 md:hidden overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-3"
          role="list"
          aria-label="Feature highlights"
        >
          {data.map((item) => (
            <div key={item.id} className="snap-center min-w-[88%]">
              <MediaCard item={item} onOpen={setOpenItem} />
            </div>
          ))}
          <div className="min-w-[12%]" aria-hidden />
        </div>

        {/* Desktop/Tablet: Mosaic grid (explicit heights, reliable thumbnails) */}
        <div className="hidden md:grid md:grid-cols-6 gap-6" role="list" aria-label="Feature highlights mosaic">
          {data.map((item, idx) => (
            <MediaCard
              key={item.id}
              item={item}
              className={MOSAIC[idx] || "md:col-span-2 md:h-[240px]"}
              onOpen={setOpenItem}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <MediaModal item={openItem} open={!!openItem} onClose={() => setOpenItem(null)} onBookTestDrive={onBookTestDrive} />
    </section>
  );
};

export default VehicleMediaMosaic;
