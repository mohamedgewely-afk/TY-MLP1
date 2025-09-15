import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import {
  Play, Info, Shield, Zap, Heart, Wifi, Award, Star, X, ChevronLeft, ChevronRight, Car
} from "lucide-react";

/* =========================================================
   Types & tokens
   =======================================================*/
type Variant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";

interface SceneDetails {
  overview?: string;
  specs?: string[];     // not rendered as bullets; we compress into sentences
  features?: string[];
  tech?: string[];
  hotspots?: Array<{ x: number; y: number; label: string; body: string }>; // 0..100%
}

interface Scene {
  url: string;
  title: string;
  description?: string;
  details?: SceneDetails;
}

interface MediaItem {
  id: string;
  category: string;
  title: string;
  summary: string;              // one-liner; no bullets
  kind: "image" | "video";
  thumbnail: string;
  gallery: Scene[];
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  tags?: string[];              // used as chips/filters, not bullets
  variant: Variant;
}

const TOKENS: Record<
  Variant,
  { accent: string; bg: string; text: string; icon: React.ComponentType<any> }
> = {
  performance: { accent: "from-red-600 to-red-700", bg: "bg-red-50/80", text: "text-red-700", icon: Zap },
  safety:      { accent: "from-blue-600 to-blue-700", bg: "bg-blue-50/80", text: "text-blue-700", icon: Shield },
  interior:    { accent: "from-amber-600 to-amber-700", bg: "bg-amber-50/80", text: "text-amber-700", icon: Heart },
  quality:     { accent: "from-gray-600 to-gray-700", bg: "bg-gray-50/80", text: "text-gray-700", icon: Award },
  technology:  { accent: "from-cyan-600 to-cyan-700", bg: "bg-cyan-50/80", text: "text-cyan-700", icon: Wifi },
  handling:    { accent: "from-emerald-600 to-emerald-700", bg: "bg-emerald-50/80", text: "text-emerald-700", icon: Star },
};

const FALLBACK =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop";
const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

/* =========================================================
   Content (DAM + Wistia) — with details to drive interactions
   =======================================================*/
const DATA: MediaItem[] = [
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
        description: "Aluminum block, direct injection, and thermal management for sustained power.",
        details: {
          overview: "3.5L twin-turbo V6 tuned for instant response under load.",
          features: ["Variable Valve Timing", "Advanced cooling"],
          tech: ["Closed-loop boost control", "Knock detection"],
          hotspots: [
            { x: 64, y: 32, label: "Cooling", body: "High-flow intercoolers keep intake temps steady on long climbs." },
            { x: 40, y: 58, label: "Injection", body: "Direct injection sharpens response while improving efficiency." },
            { x: 78, y: 48, label: "Boost", body: "Twin turbos deliver a smooth, progressive surge without lag." },
          ],
        },
      },
      {
        url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1600&auto=format&fit=crop",
        title: "Power Delivery",
        description: "Linear torque curve aids confident overtakes.",
      },
    ],
    tags: ["400+ HP", "Twin-Turbo"],
  },
  {
    id: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "Pre-collision alerts, lane tracing, and adaptive cruise support.",
    kind: "video",
    variant: "safety",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    video: { provider: "wistia", id: "kvdhnonllm", autoplay: false },
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Sensors",
        description: "Camera + radar watch lanes, traffic, and pedestrians.",
      },
    ],
    tags: ["PCS", "LTA", "ACC"],
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
        description: "Controls sit naturally; glance-down time stays low.",
      },
      {
        url: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop",
        title: "Materials",
        description: "Contrast stitching and soft-touch panels.",
      },
    ],
    tags: ['12.3" Display', "Memory Seats", "Wireless Charging"],
  },
  {
    id: "quality",
    category: "Quality",
    title: "Built to Last",
    summary: "Global standards, corrosion protection, and assured dependability.",
    kind: "image",
    variant: "quality",
    thumbnail: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      { url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop", title: "Assurance", description: "Every body panel is coated and sealed against harsh climates." },
    ],
    tags: ["ISO 9001", "Warranty"],
  },
  {
    id: "technology",
    category: "Technology",
    title: "Smart Connectivity",
    summary: "OTA updates and seamless phone integration.",
    kind: "image",
    variant: "technology",
    thumbnail: "https://images.unsplash.com/photo-1603481588273-0c31c4b7a52f?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      { url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop", title: "Infotainment", description: "Low-latency UI with wireless CarPlay/Android Auto." },
    ],
    tags: ["CarPlay/AA", "OTA", "Companion App"],
  },
  {
    id: "handling",
    category: "Handling",
    title: "Composed Dynamics",
    summary: "Selectable modes adapt response for road or desert.",
    kind: "image",
    variant: "handling",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop", title: "Normal", description: "Balanced steering and damping." },
      { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop", title: "Sport", description: "Quicker throttle and firmer control." },
      { url: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c86?q=80&w=1600&auto=format&fit=crop", title: "Off-road", description: "Gentle throttle with added compliance." },
    ],
    tags: ["Normal", "Sport", "Off-road"],
  },
];

/* =========================================================
   Modal shell (mobile-first, content-first)
   =======================================================*/
function Modal({
  item, open, onClose, onBookTestDrive,
}: {
  item: MediaItem | null;
  open: boolean;
  onClose: () => void;
  onBookTestDrive?: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open, onClose]);

  if (!open || !item) return null;
  const t = TOKENS[item.variant]; const Icon = t.icon;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[min(96vw,1120px)] -translate-x-1/2 -translate-y-1/2 bg-white text-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <header className="h-14 px-4 lg:px-6 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-2 min-w-0">
            <Badge className={`bg-gradient-to-r ${t.accent} text-white border-0`}><Icon className="h-3.5 w-3.5 mr-1"/>{item.category}</Badge>
            <h3 className="font-semibold truncate">{item.title}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close"><X className="h-5 w-5"/></Button>
        </header>

        {/* Body: left = content stage, right = narrative rail */}
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-7 p-3 lg:p-4">
            <div className="relative rounded-xl overflow-hidden bg-black h-[56vh] lg:h-[62vh]">
              {item.variant === "performance" && <PerformanceStage item={item} />}
              {item.variant === "safety" && <SafetyStage item={item} />}
              {item.variant === "interior" && <InteriorStage item={item} />}
              {item.variant === "quality" && <QualityStage item={item} />}
              {item.variant === "technology" && <TechnologyStage item={item} />}
              {item.variant === "handling" && <HandlingStage item={item} />}
            </div>
          </div>

          {/* Narrative rail: short, scannable, content-led (no bullets) */}
          <aside className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-gray-200 p-4">
            <p className="text-sm text-gray-700">{item.summary}</p>
            {!!item.tags?.length && (
              <div className="flex flex-wrap gap-1 pt-3">
                {item.tags.slice(0, 6).map((txt, i) => (
                  <span key={i} className={cn("text-xs px-2 py-1 rounded-full font-medium", TOKENS[item.variant].bg, TOKENS[item.variant].text)}>{txt}</span>
                ))}
              </div>
            )}
          </aside>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 px-3 lg:px-4 py-3 bg-gray-50 flex items-center gap-2">
          <Button variant="outline" className="h-11 w-full sm:w-auto" onClick={onClose}>Close</Button>
          <Button className="h-11 w-full sm:w-auto bg-[#EB0A1E] hover:bg-[#d70a19]" onClick={() => onBookTestDrive?.()}>
            <Car className="h-4 w-4 mr-2" /> Book Test Drive
          </Button>
        </footer>
      </div>
    </div>
  );
}

/* =========================================================
   Variant stages — content-driven, unique
   =======================================================*/

/** PERFORMANCE — hot-spots from content; scene tray; compact sentences */
function PerformanceStage({ item }: { item: MediaItem }) {
  const [i, setI] = useState(0);
  const scene = item.gallery[i];
  return (
    <div className="w-full h-full relative">
      <img
        src={scene?.url || FALLBACK}
        alt={scene?.title || item.title}
        className="absolute inset-0 w-full h-full object-contain"
        onError={(e) => (e.currentTarget.src = FALLBACK)}
      />
      {/* Hotspots mapped from content (if any) */}
      {scene?.details?.hotspots?.map((h, idx) => (
        <Hotspot key={idx} x={h.x} y={h.y} label={h.label} body={h.body} />
      ))}

      {/* Scene tray from gallery titles (content-led) */}
      {item.gallery.length > 1 && (
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 overflow-x-auto">
          {item.gallery.map((g, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              className={cn(
                "rounded-md px-3 py-1 text-xs whitespace-nowrap",
                idx === i ? "bg-white text-black" : "bg-white/20 text-white"
              )}
            >
              {g.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** SAFETY — Wistia-first; scenario chips swap the single scene + copy (content-led) */
function SafetyStage({ item }: { item: MediaItem }) {
  const [scenario, setScenario] = useState<"City" | "Highway" | "Night" | "Rain">("City");
  if (item.video) {
    const src =
      item.video.provider === "youtube"
        ? `https://www.youtube.com/embed/${item.video.id}?autoplay=${item.video.autoplay ? 1 : 0}&rel=0&modestbranding=1`
        : `https://fast.wistia.net/embed/iframe/${item.video.id}?autoPlay=${item.video.autoplay ? 1 : 0}`;
    return (
      <div className="w-full h-full relative">
        <iframe title={item.title} className="absolute inset-0 w-full h-full" src={src} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        <div className="absolute top-3 left-3 flex gap-2">
          {(["City","Highway","Night","Rain"] as const).map(s => (
            <button key={s} onClick={() => setScenario(s)} className={cn("px-3 py-1 rounded-full text-xs", s===scenario ? "bg-blue-600 text-white" : "bg-white/20 text-white")}>{s}</button>
          ))}
        </div>
      </div>
    );
  }
  // fallback image with same scenario chips swapping the caption
  const img = item.gallery[0]?.url || FALLBACK;
  const note = scenario === "City" ? "Low-speed alerts and pedestrian awareness." :
               scenario === "Highway" ? "Lane tracing and adaptive cruise for long runs." :
               scenario === "Night" ? "Camera + radar work together in low light." :
               "Traction-aware cruise and lane assist in rain.";
  return (
    <div className="w-full h-full relative">
      <img src={img} alt="Safety" className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
      <div className="absolute top-3 left-3 flex gap-2">
        {(["City","Highway","Night","Rain"] as const).map(s => (
          <button key={s} onClick={() => setScenario(s)} className={cn("px-3 py-1 rounded-full text-xs", s===scenario ? "bg-blue-600 text-white" : "bg-white/20 text-white")}>{s}</button>
        ))}
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-white text-sm bg-black/45 rounded px-3 py-2">{note}</div>
    </div>
  );
}

/** INTERIOR — zone chips from gallery titles; each zone uses its image + small caption */
function InteriorStage({ item }: { item: MediaItem }) {
  const [i, setI] = useState(0);
  const s = item.gallery[i];
  return (
    <div className="w-full h-full relative">
      <img src={s?.url || FALLBACK} alt={s?.title || item.title} className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
      <div className="absolute top-3 left-3 flex gap-2">
        {item.gallery.map((g, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={cn("px-3 py-1 rounded-full text-xs", idx===i ? "bg-amber-500 text-black" : "bg-white/20 text-white")}>{g.title}</button>
        ))}
      </div>
      {s?.description && (
        <div className="absolute bottom-3 left-3 right-3 text-white text-sm bg-black/45 rounded px-3 py-2">{s.description}</div>
      )}
    </div>
  );
}

/** QUALITY — proof stamps from tags toggle assurance note over proof image */
function QualityStage({ item }: { item: MediaItem }) {
  const [active, setActive] = useState(item.tags?.[0] ?? "Warranty");
  const img = item.gallery[0]?.url || FALLBACK;
  const copy =
    active === "ISO 9001" ? "Certified processes keep quality consistent from plant to plant." :
    active === "Warranty" ? "Coverage protects key components; corrosion layers guard the body." :
    "Assured dependability across markets.";
  return (
    <div className="w-full h-full relative">
      <img src={img} alt="Quality" className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
      <div className="absolute top-3 left-3 flex gap-2">
        {(item.tags ?? ["Warranty"]).map(tag => (
          <button key={tag} onClick={() => setActive(tag)} className={cn("px-3 py-1 rounded-full text-xs", tag===active ? "bg-gray-800 text-white" : "bg-white/20 text-white")}>{tag}</button>
        ))}
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-white text-sm bg-black/45 rounded px-3 py-2">{copy}</div>
    </div>
  );
}

/** TECHNOLOGY — feature tour from tags (CarPlay/OTA/etc) swaps caption; single scene */
function TechnologyStage({ item }: { item: MediaItem }) {
  const [feature, setFeature] = useState(item.tags?.[0] ?? "CarPlay/AA");
  const img = item.gallery[0]?.url || FALLBACK;
  const copy =
    feature.includes("CarPlay") || feature === "CarPlay/AA" ? "Seamless phone projection with calls, messages, and maps." :
    feature === "OTA" ? "Updates arrive over the air, adding features without a workshop visit." :
    "Use the companion app to check status and send destinations.";
  return (
    <div className="w-full h-full relative">
      <img src={img} alt="Tech" className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
      <div className="absolute top-3 left-3 flex gap-2">
        {(item.tags ?? ["CarPlay/AA","OTA"]).map(tag => (
          <button key={tag} onClick={() => setFeature(tag)} className={cn("px-3 py-1 rounded-full text-xs", tag===feature ? "bg-cyan-600 text-white" : "bg-white/20 text-white")}>{tag}</button>
        ))}
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-white text-sm bg-black/45 rounded px-3 py-2">{copy}</div>
    </div>
  );
}

/** HANDLING — mode tabs swap content (Normal/Sport/Off-road) */
function HandlingStage({ item }: { item: MediaItem }) {
  const modes = item.gallery.map(g => g.title);
  const [mode, setMode] = useState(modes[0] || "Normal");
  const scene = item.gallery.find(g => g.title === mode) ?? item.gallery[0];

  const note =
    mode === "Sport" ? "Quicker throttle, firmer body control." :
    mode?.toLowerCase().includes("off") ? "Gentle throttle with added compliance." :
    "Balanced response for daily driving.";

  return (
    <div className="w-full h-full relative">
      <img src={scene?.url || FALLBACK} alt={scene?.title || "Handling"} className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
      <div className="absolute top-3 left-3 flex gap-2">
        {modes.map(m => (
          <button key={m} onClick={() => setMode(m)} className={cn("px-3 py-1 rounded-full text-xs", mode===m ? "bg-emerald-600 text-white" : "bg-white/20 text-white")}>{m}</button>
        ))}
      </div>
      <div className="absolute bottom-3 left-3 right-3 text-white text-sm bg-black/45 rounded px-3 py-2">{note}</div>
    </div>
  );
}

/** Simple hotspot component */
function Hotspot({ x, y, label, body }: { x: number; y: number; label: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="absolute w-5 h-5 rounded-full bg-white/95 text-[10px] font-semibold text-black grid place-items-center shadow"
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-label={label}
      >
        i
      </button>
      {open && (
        <div
          className="absolute max-w-[220px] text-xs bg-white/95 text-gray-900 rounded p-2 shadow"
          style={{ left: `calc(${x}% + 14px)`, top: `calc(${y}% - 6px)` }}
        >
          <div className="font-semibold">{label}</div>
          <div className="mt-0.5">{body}</div>
        </div>
      )}
    </>
  );
}

/* =========================================================
   Cards + Mosaic (desktop) & Swipe Rail (mobile)
   =======================================================*/
function Card({ item, className, onOpen }: { item: MediaItem; className?: string; onOpen: (m: MediaItem) => void }) {
  const s = TOKENS[item.variant]; const Icon = s.icon;
  return (
    <article
      role="listitem"
      className={cn("group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-300",
                   "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-900", className)}
    >
      <button onClick={() => onOpen(item)} className="w-full text-left focus:outline-none" aria-label={`Open ${item.title}`}>
        <div className="relative h-[220px] md:h-full overflow-hidden">
          <img
            src={item.thumbnail || FALLBACK}
            alt={item.title}
            className="block w-full h-full object-cover group-hover:scale-[1.03] duration-500"
            onError={(e)=> (e.currentTarget.src=FALLBACK)}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          {item.kind==="video" && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-14 h-14 bg-white/95 rounded-full grid place-items-center group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-gray-900 translate-x-px" />
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`bg-gradient-to-r ${s.accent} text-white border-0`}>
              <Icon className="h-3.5 w-3.5 mr-1" /> {item.category}
            </Badge>
          </div>
        </div>

        <div className="p-5 md:p-4">
          <h3 className="font-bold text-lg md:text-base text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">{item.title}</h3>
          <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{item.summary}</p>
          {!!item.tags?.length && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.tags.slice(0, 4).map((t, i) => (
                <span key={i} className={cn("text-xs px-2 py-1 rounded-full font-medium", s.bg, s.text)}>{t}</span>
              ))}
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>{item.gallery.length} image{item.gallery.length !== 1 ? "s" : ""}</span>
            <Info className="h-4 w-4" />
          </div>
        </div>
      </button>
    </article>
  );
}

interface Props {
  vehicle: VehicleModel;
  items?: MediaItem[];
  onBookTestDrive?: () => void;
}

const PremiumMediaShowcase: React.FC<Props> = ({ vehicle, items, onBookTestDrive }) => {
  const data = items?.length ? items : DATA;
  const [openItem, setOpenItem] = useState<MediaItem | null>(null);

  // Reliable mosaic (explicit heights so thumbnails always render)
  const MOSAIC = [
    "md:col-span-3 md:h-[420px]",
    "md:col-span-3 md:h-[420px]",
    "md:col-span-2 md:h-[240px]",
    "md:col-span-2 md:h-[240px]",
    "md:col-span-1 md:h-[240px]",
    "md:col-span-1 md:h-[240px]",
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

        {/* Mobile swipe rail */}
        <div className="-mx-4 px-4 md:hidden overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-3" role="list" aria-label="Highlights">
          {data.map((it) => (
            <div key={it.id} className="snap-center min-w-[88%]">
              <Card item={it} onOpen={setOpenItem} />
            </div>
          ))}
          <div className="min-w-[12%]" aria-hidden />
        </div>

        {/* Desktop mosaic */}
        <div className="hidden md:grid md:grid-cols-6 gap-6" role="list" aria-label="Highlights mosaic">
          {data.map((it, i) => (
            <Card key={it.id} item={it} className={MOSAIC[i] || "md:col-span-2 md:h-[240px]"} onOpen={setOpenItem} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal item={openItem} open={!!openItem} onClose={() => setOpenItem(null)} onBookTestDrive={onBookTestDrive} />
    </section>
  );
};

export default PremiumMediaShowcase;
