import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import {
  Play, Info, Shield, Zap, Heart, Wifi, Award, Star, X, Car
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────── */
type Variant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";

interface SceneDetails {
  overview?: string;
  hotspots?: Array<{ x: number; y: number; label: string; body: string }>;
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
  summary: string;                       // single line (no bullets)
  kind: "image" | "video";
  thumbnail: string;
  gallery: Scene[];
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  tags?: string[];                       // visual chips only
  variant: Variant;
}

const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");
const FALLBACK = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop";

/* ─────────────────────────────────────────────────────────
   Variant "skins" — each modal has a distinct look
────────────────────────────────────────────────────────── */
const SKIN: Record<
  Variant,
  { shell: string; header: string; panel: string; accent: string; icon: React.ComponentType<any> }
> = {
  performance: { shell: "bg-zinc-950 text-white", header: "bg-zinc-900/70 border-b border-white/10", panel: "bg-zinc-900/60 backdrop-blur", accent: "from-red-600 to-red-700", icon: Zap },
  safety:      { shell: "bg-[#081622] text-white", header: "bg-blue-950/70 border-b border-white/10", panel: "bg-blue-900/40 backdrop-blur", accent: "from-blue-600 to-blue-700", icon: Shield },
  interior:    { shell: "bg-[#1b1408] text-amber-50", header: "bg-amber-900/60 border-b border-amber-300/20", panel: "bg-amber-900/30 backdrop-blur", accent: "from-amber-500 to-amber-600", icon: Heart },
  quality:     { shell: "bg-stone-100 text-stone-900", header: "bg-white/80 border-b border-stone-200", panel: "bg-white/80 backdrop-blur", accent: "from-stone-700 to-stone-800", icon: Award },
  technology:  { shell: "bg-[#071a1e] text-cyan-50", header: "bg-cyan-950/70 border-b border-white/10", panel: "bg-cyan-900/30 backdrop-blur", accent: "from-cyan-600 to-cyan-700", icon: Wifi },
  handling:    { shell: "bg-[#07170f] text-emerald-50", header: "bg-emerald-950/70 border-b border-white/10", panel: "bg-emerald-900/30 backdrop-blur", accent: "from-emerald-600 to-emerald-700", icon: Star },
};

/* ─────────────────────────────────────────────────────────
   DATA — uses your DAM + Wistia assets (placeholders only
   where DAM wasn’t provided yet)
────────────────────────────────────────────────────────── */
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
        title: "Architecture",
        description: "Aluminum block and thermal management for sustained power.",
        details: {
          overview: "3.5L twin-turbo V6 tuned for instant response.",
          hotspots: [
            { x: 64, y: 32, label: "Cooling", body: "High-flow intercoolers hold intake temps on long climbs." },
            { x: 40, y: 58, label: "Injection", body: "Direct injection sharpens response and efficiency." },
            { x: 78, y: 48, label: "Boost", body: "Twin turbos deliver a smooth, progressive surge." },
          ],
        },
      },
      // If you share more DAM shots, add here; keeping one DAM frame is fine—tray hides if single.
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
    ],
    tags: ['12.3" Display', "Memory Seats", "Wireless Charging"],
  },
  // The three below didn’t come with DAM in your snippets; they’ll gracefully use FALLBACK until you share DAM IDs.
  {
    id: "quality",
    category: "Quality",
    title: "Built to Last",
    summary: "Global standards, corrosion protection, and assured dependability.",
    kind: "image",
    variant: "quality",
    thumbnail: FALLBACK,
    gallery: [{ url: FALLBACK, title: "Assurance", description: "Protected body with sealed layers for harsh climates." }],
    tags: ["ISO 9001", "Warranty"],
  },
  {
    id: "technology",
    category: "Technology",
    title: "Smart Connectivity",
    summary: "OTA updates and seamless phone integration.",
    kind: "image",
    variant: "technology",
    thumbnail: FALLBACK,
    gallery: [{ url: FALLBACK, title: "Infotainment", description: "Low-latency UI with Wireless CarPlay / Android Auto." }],
    tags: ["CarPlay/AA", "OTA", "Companion App"],
  },
  {
    id: "handling",
    category: "Handling",
    title: "Composed Dynamics",
    summary: "Selectable modes adapt response for road or desert.",
    kind: "image",
    variant: "handling",
    thumbnail: FALLBACK,
    gallery: [
      { url: FALLBACK, title: "Normal", description: "Balanced steering and damping." },
      { url: FALLBACK, title: "Sport", description: "Quicker throttle and firmer control." },
      { url: FALLBACK, title: "Off-road", description: "Gentle throttle with added compliance." },
    ],
    tags: ["Normal", "Sport", "Off-road"],
  },
];

/* ─────────────────────────────────────────────────────────
   Modal root (variant-skinned, zero dead space)
────────────────────────────────────────────────────────── */
function Modal({
  item, open, onClose, onBookTestDrive,
}: { item: MediaItem | null; open: boolean; onClose: () => void; onBookTestDrive?: () => void }) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open, onClose]);

  if (!open || !item) return null;
  const skin = SKIN[item.variant];
  const Icon = skin.icon;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={cn("absolute left-1/2 top-1/2 w-[min(96vw,1180px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl overflow-hidden shadow-2xl grid grid-rows-[auto_1fr_auto]", skin.shell)}>
        {/* header */}
        <header className={cn("h-12 px-4 lg:px-6 flex items-center justify-between", skin.header)}>
          <div className="flex items-center gap-2 min-w-0">
            <Badge className={cn("border-0 text-white bg-gradient-to-r", skin.accent)}><Icon className="h-3.5 w-3.5 mr-1"/>{item.category}</Badge>
            <h3 className="font-semibold truncate">{item.title}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" className="text-current">
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* body — fully distinct layouts per variant */}
        <div className="relative">
          {item.variant === "performance" && <PerformanceCanvas item={item} />}
          {item.variant === "safety" && <SafetyDeck item={item} />}
          {item.variant === "interior" && <InteriorStoryboard item={item} />}
          {item.variant === "quality" && <QualityBoard item={item} />}
          {item.variant === "technology" && <TechDock item={item} />}
          {item.variant === "handling" && <HandlingSurface item={item} />}
        </div>

        {/* footer */}
        <footer className={cn("px-3 lg:px-4 py-3 flex gap-2", item.variant === "quality" ? "border-t border-stone-300 bg-white" : "border-t border-white/10 bg-white/5")}>
          <Button variant={item.variant === "quality" ? "default" : "outline"} className="h-11 w-full sm:w-auto" onClick={onClose}>Close</Button>
          <Button className="h-11 w-full sm:w-auto bg-[#EB0A1E] hover:bg-[#d70a19]" onClick={() => onBookTestDrive?.()}>
            <Car className="h-4 w-4 mr-2" /> Book Test Drive
          </Button>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   6 UNIQUE MODAL LAYOUTS (content-driven)
────────────────────────────────────────────────────────── */

/* 1) Performance — Spec Canvas: full-bleed + hotspots + microcards + tray */
function PerformanceCanvas({ item }: { item: MediaItem }) {
  const [i, setI] = useState(0);
  const s = item.gallery[i];
  return (
    <div className="h-[72vh] lg:h-[70vh] relative">
      <img src={s?.url || FALLBACK} alt={s?.title || item.title} className="absolute inset-0 w-full h-full object-contain" onError={(e)=> (e.currentTarget.src=FALLBACK)} />

      {/* left rail (dense explanation) */}
      {s?.description && (
        <div className="absolute top-3 left-3 w-[min(46%,420px)] hidden md:block">
          <div className="rounded-xl p-3 border border-white/10 bg-zinc-900/60 backdrop-blur">
            <div className="text-sm font-semibold">Architecture</div>
            <div className="text-xs text-white/80 mt-1">{s.description}</div>
          </div>
        </div>
      )}

      {/* hotspots from content */}
      {s?.details?.hotspots?.map((h, idx) => (
        <Hotspot key={idx} x={h.x} y={h.y} label={h.label} body={h.body} dark />
      ))}

      {/* micro-cards */}
      <div className="absolute left-3 right-3 bottom-16 grid grid-cols-2 md:grid-cols-4 gap-2">
        {["Instant response", "Smooth surge", "Thermal control", "Direct injection"].map((t,k)=>(
          <div key={k} className="rounded-lg px-3 py-2 text-xs bg-zinc-900/70 border border-white/10 text-white/90">{t}</div>
        ))}
      </div>

      {/* gallery tray (hidden if single item) */}
      {item.gallery.length > 1 && (
        <div className="absolute left-3 right-3 bottom-3 flex gap-2 overflow-x-auto">
          {item.gallery.map((g, idx)=>(
            <button key={idx} onClick={()=>setI(idx)} className={cn("rounded-md px-3 py-1 text-xs whitespace-nowrap", i===idx?"bg-white text-black":"bg-white/20 text-white")}>{g.title}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* 2) Safety — Moments Reel: Wistia video + scenario tabs + floating note */
function SafetyDeck({ item }: { item: MediaItem }) {
  const [scenario, setScenario] = useState<"City"|"Highway"|"Night"|"Rain">("City");
  const scenarios: Array<typeof scenario> = ["City","Highway","Night","Rain"];
  const note =
    scenario === "City" ? "Low-speed alerts and pedestrian awareness." :
    scenario === "Highway" ? "Lane tracing and adaptive cruise settle long runs." :
    scenario === "Night" ? "Camera + radar cooperate in low light." :
    "Traction-aware cruise and lane assist in rain.";

  const video = item.video;
  const src = video
    ? (video.provider === "youtube"
        ? `https://www.youtube.com/embed/${video.id}?autoplay=${video.autoplay ? 1 : 0}&rel=0&modestbranding=1`
        : `https://fast.wistia.net/embed/iframe/${video.id}?autoPlay=${video.autoplay ? 1 : 0}`)
    : null;

  return (
    <div className="h-[72vh] lg:h-[70vh] relative">
      {/* scenario tabs (desktop left) */}
      <div className="absolute top-3 left-3 z-10 hidden md:flex flex-col gap-2">
        {scenarios.map(s => (
          <button key={s} onClick={()=>setScenario(s)} className={cn("px-3 py-1 rounded-full text-xs", s===scenario?"bg-blue-600 text-white":"bg-white/20 text-white")}>{s}</button>
        ))}
      </div>

      {src ? (
        <iframe title={item.title} className="absolute inset-0 w-full h-full" src={src} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
      ) : (
        <img src={item.gallery[0]?.url || FALLBACK} alt="Safety" className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
      )}

      {/* floating note */}
      <div className="absolute right-3 bottom-3 left-3 md:left-auto md:w-[360px] rounded-xl p-3 bg-blue-900/60 border border-white/10 backdrop-blur">
        <div className="text-sm font-semibold">In this scenario</div>
        <div className="text-xs mt-1 text-white/90">{note}</div>
        <div className="mt-2 flex gap-1">
          {(item.tags ?? []).slice(0,3).map((t,i)=>(<span key={i} className="text-[11px] px-2 py-1 rounded-full bg-white/20">{t}</span>))}
        </div>
      </div>
    </div>
  );
}

/* 3) Interior — Storyboard: filmstrip of zones + warm caption */
function InteriorStoryboard({ item }: { item: MediaItem }) {
  const [i, setI] = useState(0);
  const s = item.gallery[i];

  return (
    <div className="h-[72vh] lg:h-[70vh] relative">
      <img src={s?.url || FALLBACK} alt={s?.title || item.title} className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />

      <div className="absolute right-3 bottom-3 left-3 md:left-auto md:w-[360px] rounded-xl p-3 bg-amber-900/40 border border-amber-300/20 backdrop-blur">
        <div className="text-sm font-semibold">{s?.title}</div>
        {s?.description && <div className="text-xs mt-1 text-amber-50/90">{s.description}</div>}
        <div className="mt-2 flex gap-1">
          {(item.tags ?? []).slice(0,3).map((t,i)=>(<span key={i} className="text-[11px] px-2 py-1 rounded-full bg-amber-800/40">{t}</span>))}
        </div>
      </div>

      <div className="absolute left-3 right-3 top-3 flex gap-2 overflow-x-auto">
        {item.gallery.map((g, idx)=>(
          <button key={idx} onClick={()=>setI(idx)} className={cn("rounded-md px-3 py-1 text-xs whitespace-nowrap", i===idx ? "bg-amber-500 text-black" : "bg-white/20 text-white")}>{g.title}</button>
        ))}
      </div>
    </div>
  );
}

/* 4) Quality — Assurance Board: collage + proof card */
function QualityBoard({ item }: { item: MediaItem }) {
  const [active, setActive] = useState(item.tags?.[0] ?? "Warranty");
  const img = item.gallery[0]?.url || FALLBACK;
  const copy =
    active === "ISO 9001" ? "Certified processes keep quality consistent from plant to plant." :
    active === "Warranty" ? "Coverage protects key components; corrosion layers guard the body." :
    "Assured dependability across markets.";

  return (
    <div className="h-[72vh] lg:h-[70vh] p-4 grid grid-cols-3 gap-3 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><rect width=%2240%22 height=%2240%22 fill=%22%23ffffff%22/><path d=%22M0 40 L40 0 M-10 30 L30 -10%22 stroke=%22%23e7e5e4%22 stroke-width=%220.5%22/></svg>')]">
      <div className="col-span-2 rounded-xl overflow-hidden bg-white">
        <img src={img} alt="Assurance" className="w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
      </div>
      <div className="rounded-xl p-4 bg-white shadow-sm border border-stone-300 flex flex-col">
        <div className="text-sm font-semibold">Proof</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {(item.tags ?? ["Warranty"]).map(tag=>(
            <button key={tag} onClick={()=>setActive(tag)} className={cn("px-2 py-1 text-xs rounded-full border", tag===active?"bg-stone-900 text-white border-stone-900":"bg-white border-stone-300")}>{tag}</button>
          ))}
        </div>
        <div className="mt-3 text-sm">{copy}</div>
        <div className="mt-auto text-[11px] text-stone-600">Service every 10,000 km keeps reliability consistent.</div>
      </div>
      <div className="col-span-3 rounded-xl p-3 bg-white/90 border border-stone-300 text-sm">
        {item.summary}
      </div>
    </div>
  );
}

/* 5) Technology — Tech Dock: device frame + feature chips */
function TechDock({ item }: { item: MediaItem }) {
  const [feature, setFeature] = useState(item.tags?.[0] ?? "CarPlay/AA");
  const img = item.gallery[0]?.url || FALLBACK;
  const copy =
    feature.includes("CarPlay") || feature === "CarPlay/AA" ? "Seamless phone projection with calls, messages, and maps." :
    feature === "OTA" ? "Updates arrive over the air; new features without a workshop visit." :
    "Companion app checks status and sends destinations.";

  return (
    <div className="h-[72vh] lg:h-[70vh] relative">
      <div className="absolute inset-0 grid place-items-center">
        <div className="w-[300px] h-[630px] rounded-[36px] bg-black/70 border border-cyan-300/30 shadow-xl relative overflow-hidden">
          <img src={img} alt="Infotainment" className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
            <div className="text-xs text-white/90">{copy}</div>
          </div>
        </div>
      </div>

      <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2 justify-center md:justify-start">
        {(item.tags ?? ["CarPlay/AA","OTA"]).map(tag=>(
          <button key={tag} onClick={()=>setFeature(tag)} className={cn("px-3 py-1 rounded-full text-xs", tag===feature?"bg-cyan-600 text-white":"bg-white/20 text-white")}>{tag}</button>
        ))}
      </div>
    </div>
  );
}

/* 6) Handling — Mode Surface: full-bleed + segmented bottom nav */
function HandlingSurface({ item }: { item: MediaItem }) {
  const modes = item.gallery.map(g => g.title);
  const [mode, setMode] = useState(modes[0] || "Normal");
  const s = item.gallery.find(g => g.title === mode) ?? item.gallery[0];

  const note =
    mode === "Sport" ? "Quicker throttle, firmer body control." :
    mode?.toLowerCase().includes("off") ? "Gentle throttle with added compliance." :
    "Balanced response for daily driving.";

  return (
    <div className="h-[72vh] lg:h-[70vh] relative">
      <img src={s?.url || FALLBACK} alt={s?.title || "Handling"} className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
      <div className="absolute left-3 right-3 bottom-3 grid grid-cols-3 gap-2">
        {modes.slice(0,3).map(m=>(
          <button key={m} onClick={()=>setMode(m)} className={cn("rounded-md px-3 py-2 text-sm font-medium", mode===m?"bg-emerald-600 text-white":"bg-white/20 text-white")}>{m}</button>
        ))}
      </div>
      <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded bg-emerald-900/50 border border-white/10">{note}</div>
    </div>
  );
}

/* hotspot bubble */
function Hotspot({ x, y, label, body, dark }: { x: number; y: number; label: string; body: string; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(v=>!v)}
        className={cn("absolute w-5 h-5 rounded-full grid place-items-center text-[10px] font-bold shadow", dark ? "bg-white/95 text-black" : "bg-black/80 text-white")}
        style={{ left: `${x}%`, top: `${y}%` }}
        aria-label={label}
      >i</button>
      {open && (
        <div
          className={cn("absolute max-w-[220px] text-xs rounded p-2 shadow", dark ? "bg-white/95 text-gray-900" : "bg-black/85 text-white")}
          style={{ left: `calc(${x}% + 14px)`, top: `calc(${y}% - 6px)` }}
        >
          <div className="font-semibold">{label}</div>
          <div className="mt-0.5">{body}</div>
        </div>
      )}
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Cards + Layout (mobile swipe rail + desktop mosaic)
────────────────────────────────────────────────────────── */
function Card({ item, className, onOpen }: { item: MediaItem; className?: string; onOpen: (m: MediaItem) => void }) {
  const skin = SKIN[item.variant]; const Icon = skin.icon;
  return (
    <article role="listitem" className={cn("group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-300", "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-900", className)}>
      <button onClick={()=>onOpen(item)} className="w-full text-left focus:outline-none" aria-label={`Open ${item.title}`}>
        <div className="relative h-[220px] md:h-full overflow-hidden">
          <img
            src={item.thumbnail || FALLBACK}
            alt={item.title}
            className="block w-full h-full object-cover group-hover:scale-[1.03] duration-500"
            onError={(e)=> (e.currentTarget.src=FALLBACK)}
            loading="lazy"
          />
          <div className="absolute top-3 left-3">
            <Badge className={cn("bg-gradient-to-r text-white border-0", skin.accent)}>
              <Icon className="h-3.5 w-3.5 mr-1" /> {item.category}
            </Badge>
          </div>
          {item.kind==="video" && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-14 h-14 bg-white/95 rounded-full grid place-items-center group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-gray-900 translate-x-px" />
              </div>
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <div className="p-5 md:p-4">
          <h3 className="font-bold text-lg md:text-base text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors">{item.title}</h3>
          <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{item.summary}</p>
          {!!item.tags?.length && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.tags.slice(0, 4).map((t, i) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full font-medium bg-gray-50 text-gray-700 border border-gray-200">{t}</span>
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

  // explicit heights so thumbnails never collapse on desktop
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
        {/* header */}
        <div className="text-center mb-6 lg:mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Discover Every Detail</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the engineering, safety, and craftsmanship that define the {vehicle?.name ?? "vehicle"} experience.
          </p>
        </div>

        {/* mobile swipe rail */}
        <div className="-mx-4 px-4 md:hidden overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-3" role="list" aria-label="Highlights">
          {data.map((it) => (
            <div key={it.id} className="snap-center min-w-[88%]">
              <Card item={it} onOpen={setOpenItem} />
            </div>
          ))}
          <div className="min-w-[12%]" aria-hidden />
        </div>

        {/* desktop mosaic */}
        <div className="hidden md:grid md:grid-cols-6 gap-6" role="list" aria-label="Highlights mosaic">
          {data.map((it, i) => (
            <Card key={it.id} item={it} className={MOSAIC[i] || "md:col-span-2 md:h-[240px]"} onOpen={setOpenItem} />
          ))}
        </div>
      </div>

      {/* modal */}
      <Modal item={openItem} open={!!openItem} onClose={() => setOpenItem(null)} onBookTestDrive={onBookTestDrive} />
    </section>
  );
};

export default PremiumMediaShowcase;
