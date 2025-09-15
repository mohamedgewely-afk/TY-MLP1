import React from "react";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import { Play, Info, Shield, Zap, Heart, Wifi, Award, Star } from "lucide-react";

/** ─────────────────────────────────────────────────────────
 *  Types
 *  ────────────────────────────────────────────────────────*/
type ModalVariant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";

interface MediaItem {
  id: string;
  category: string;
  title: string;
  summary: string;          // keep tight; no bullets
  kind: "image" | "video";
  thumbnail: string;
  gallery: Array<{ url: string; title: string; description?: string }>;
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  badges?: string[];        // small chips (0–3); not bullet points
  variant: ModalVariant;
}

/** ─────────────────────────────────────────────────────────
 *  Variant tokens (chip color + icon)
 *  ────────────────────────────────────────────────────────*/
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

/** ─────────────────────────────────────────────────────────
 *  DAM-backed demo media (uses your existing DAM + Wistia)
 *  ────────────────────────────────────────────────────────*/
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
    ],
    badges: ["400+ HP", "Twin-Turbo", "Direct Injection"],
  },
  {
    id: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "Pre-collision alerts, lane tracing, and adaptive cruise support.",
    kind: "video", // show play overlay; video opens in modal later
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
    ],
    badges: ["Multi-Mode", "Grip"],
  },
];

/** ─────────────────────────────────────────────────────────
 *  Helpers
 *  ────────────────────────────────────────────────────────*/
function cn(...a: (string | false | null | undefined)[]) {
  return a.filter(Boolean).join(" ");
}

const MOSAIC_CLASS: string[] = [
  // Deterministic pattern for 6 cards on md+:
  // hero (3x tall), tall, normal, wide, normal, normal
  "md:col-span-3 [grid-row-end:span_26]",
  "md:col-span-2 [grid-row-end:span_26]",
  "md:col-span-1 [grid-row-end:span_12]",
  "md:col-span-2 [grid-row-end:span_12]",
  "md:col-span-1 [grid-row-end:span_12]",
  "md:col-span-1 [grid-row-end:span_12]",
];

/** ─────────────────────────────────────────────────────────
 *  Card
 *  ────────────────────────────────────────────────────────*/
function MediaCard({
  item,
  mosaicClass,
  onOpen,
}: {
  item: MediaItem;
  mosaicClass?: string;
  onOpen?: (m: MediaItem) => void;
}) {
  const style = VARIANT_STYLES[item.variant];
  const Icon = style.icon;

  return (
    <article
      role="listitem"
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-300",
        "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-900",
        mosaicClass || ""
      )}
    >
      <button
        onClick={() => onOpen?.(item)}
        className="w-full text-left focus:outline-none"
        aria-label={`Open ${item.title}`}
      >
        <div className="relative aspect-video md:aspect-auto md:h-full overflow-hidden">
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
                <span
                  key={i}
                  className={cn("text-xs px-2 py-1 rounded-full font-medium", style.bg, style.text)}
                >
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

/** ─────────────────────────────────────────────────────────
 *  Mosaic + Mobile Rail
 *  ────────────────────────────────────────────────────────*/
interface VehicleMediaMosaicProps {
  vehicle: VehicleModel;
  items?: MediaItem[];
  onOpen?: (m: MediaItem) => void; // you can wire this to your modal later
}

const VehicleMediaMosaic: React.FC<VehicleMediaMosaicProps> = ({ vehicle, items, onOpen }) => {
  const data = items && items.length ? items : MEDIA;

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

        {/* Mobile: swipeable rail with snap (shows next card peek) */}
        <div
          className="md:hidden -mx-4 px-4 overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-3"
          role="list"
          aria-label="Feature highlights"
        >
          {data.map((item) => (
            <div key={item.id} className="snap-center min-w-[88%]">
              <MediaCard item={item} onOpen={onOpen} />
            </div>
          ))}
          {/* peek spacer to allow the last card to center nicely */}
          <div className="min-w-[12%]" aria-hidden />
        </div>

        {/* Tablet/Desktop: Mosaic grid (deterministic pattern) */}
        <div
          className="hidden md:grid md:grid-cols-6 gap-6 md:[grid-auto-rows:12px]"
          role="list"
          aria-label="Feature highlights mosaic"
        >
          {data.map((item, idx) => (
            <MediaCard key={item.id} item={item} mosaicClass={MOSAIC_CLASS[idx] || "md:col-span-2 [grid-row-end:span_12]"} onOpen={onOpen} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleMediaMosaic;
