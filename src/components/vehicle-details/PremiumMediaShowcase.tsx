import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import {
  Play,
  Info,
  Shield,
  Zap,
  Heart,
  Wifi,
  Award,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  Car,
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   Types & tokens
────────────────────────────────────────────────────────── */
type Variant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";

interface MediaItem {
  id: string;
  category: string;
  title: string;
  summary: string;                // concise line, no bullets
  kind: "image" | "video";
  thumbnail: string;              // card thumbnail
  gallery: Array<{ url: string; title: string; description?: string }>;
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  tags?: string[];                // small chips (0–3); not bullet points
  variant: Variant;
}

const VARIANT: Record<
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

const FALLBACK = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop";
const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

/* ─────────────────────────────────────────────────────────
   DAM + video data (kept tight, no bullets)
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
      },
      {
        url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1600&auto=format&fit=crop",
        title: "Power Delivery",
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
        title: "Assistance Suite",
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
      },
      {
        url: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop",
        title: "Materials",
      },
    ],
    tags: ['12.3" Display', "Memory Seats"],
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
      {
        url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop",
        title: "Assurance",
      },
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
      {
        url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
        title: "Infotainment",
      },
    ],
    tags: ["OTA", "CarPlay/AA"],
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
      { url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop", title: "Normal" },
      { url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop", title: "Sport" },
    ],
    tags: ["Multi-Mode", "Grip"],
  },
];

/* ─────────────────────────────────────────────────────────
   MODAL — shared shell + six unique stages
────────────────────────────────────────────────────────── */

function Modal({
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
  useEffect(() => setIdx(0), [item?.id]);
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [open, onClose]);
  if (!open || !item) return null;

  const style = VARIANT[item.variant];
  const Icon = style.icon;

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      {/* dialog */}
      <div className="absolute left-1/2 top-1/2 w-[min(96vw,1120px)] -translate-x-1/2 -translate-y-1/2 bg-zinc-950 text-white rounded-2xl overflow-hidden shadow-2xl">
        {/* header */}
        <header className="h-14 px-4 lg:px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2 min-w-0">
            <Badge className={`bg-gradient-to-r ${style.accent} text-white border-0`}>
              <Icon className="h-3.5 w-3.5 mr-1" />
              {item.category}
            </Badge>
            <h3 className="font-semibold truncate">{item.title}</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-white/80" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* body */}
        <div className="grid lg:grid-cols-12">
          {/* stage (left) */}
          <div className="lg:col-span-7 p-3 lg:p-4">
            <div className="relative rounded-xl overflow-hidden bg-black min-h-[56vh]">
              {/* Unique stages */}
              {item.variant === "performance" && (
                <PerformanceStage item={item} idx={idx} setIdx={setIdx} />
              )}
              {item.variant === "safety" && (
                <SafetyStage item={item} />
              )}
              {item.variant === "interior" && (
                <InteriorStage item={item} idx={idx} setIdx={setIdx} />
              )}
              {item.variant === "quality" && (
                <QualityStage item={item} />
              )}
              {item.variant === "technology" && (
                <TechnologyStage />
              )}
              {item.variant === "handling" && (
                <HandlingStage item={item} />
              )}
            </div>
          </div>

          {/* info (right) — no bullets */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-white/10 p-4">
            <p className="text-sm text-white/90">{item.summary}</p>
            {!!item.tags?.length && (
              <div className="flex flex-wrap gap-1 pt-3">
                {item.tags.slice(0, 6).map((t, i) => (
                  <span key={i} className={cn("text-xs px-2 py-1 rounded-full font-medium", VARIANT[item.variant].bg, VARIANT[item.variant].text)}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* footer */}
        <footer className="bg-zinc-900/80 backdrop-blur border-t border-white/10 px-3 lg:px-4 py-3 flex items-center gap-2">
          <Button variant="outline" className="h-11 w-full sm:w-auto" onClick={onClose}>Close</Button>
          <Button className="h-11 w-full sm:w-auto bg-[#EB0A1E] hover:bg-[#d70a19]" onClick={() => onBookTestDrive?.()}>
            <Car className="h-4 w-4 mr-2" /> Book Test Drive
          </Button>
        </footer>
      </div>
    </div>
  );
}

/* ——— Unique stages ———————————————————————————————— */

// 1) Performance: image carousel + scrub slider (keyboard: ←/→ also works)
function PerformanceStage({ item, idx, setIdx }: { item: MediaItem; idx: number; setIdx: (i: number) => void }) {
  const slide = item.gallery[idx];
  const next = () => setIdx(Math.min(item.gallery.length - 1, idx + 1));
  const prev = () => setIdx(Math.max(0, idx - 1));

  return (
    <div className="w-full h-full grid">
      <div className="relative">
        <img
          src={slide?.url || FALLBACK}
          alt={slide?.title || item.title}
          className="block w-full h-[56vh] object-contain bg-black"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = FALLBACK)}
        />
        {item.gallery.length > 1 && (
          <>
            <Button variant="ghost" size="sm" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/10" aria-label="Previous">
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="sm" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/10" aria-label="Next">
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>
      {item.gallery.length > 1 && (
        <div className="px-2 pb-2">
          <input
            type="range"
            min={0}
            max={item.gallery.length - 1}
            value={idx}
            onChange={(e) => setIdx(Number(e.target.value))}
            className="w-full accent-red-600"
            aria-label="Scrub slides"
          />
        </div>
      )}
    </div>
  );
}

// 2) Safety: Wistia video (if present) + simple ADAS overlay toggles on the fallback image
function SafetyStage({ item }: { item: MediaItem }) {
  const [pcs, setPCS] = useState(true);
  const [lta, setLTA] = useState(true);
  const [acc, setACC] = useState(false);

  // Prefer the video if provided
  if (item.video) {
    const src =
      item.video.provider === "youtube"
        ? `https://www.youtube.com/embed/${item.video.id}?autoplay=${item.video.autoplay ? 1 : 0}&rel=0&modestbranding=1`
        : `https://fast.wistia.net/embed/iframe/${item.video.id}?autoPlay=${item.video.autoplay ? 1 : 0}`;
    return (
      <iframe
        title={item.title}
        className="block w-full h-[56vh]"
        src={src}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // Otherwise show image + overlays
  const img = item.gallery[0]?.url || FALLBACK;
  return (
    <div className="relative w-full h-[56vh]">
      <img
        src={img}
        alt={item.title}
        className="block w-full h-full object-cover"
        onError={(e) => (e.currentTarget.src = FALLBACK)}
      />
      {pcs && <div className="absolute top-[18%] left-[52%] w-16 h-16 rounded-full border-2 border-blue-400/80" />}
      {lta && <div className="absolute top-[55%] left-[20%] w-24 h-10 rounded-md border-2 border-blue-400/80" />}
      {acc && <div className="absolute top-[35%] left-[70%] w-10 h-10 rounded-full border-2 border-blue-400/80" />}

      <div className="absolute top-3 left-3 flex gap-2">
        <button onClick={() => setPCS((v) => !v)} aria-pressed={pcs} className={cn("px-3 py-1 rounded-full text-xs", pcs ? "bg-blue-600 text-white" : "bg-white/10 text-white/80")}>PCS</button>
        <button onClick={() => setLTA((v) => !v)} aria-pressed={lta} className={cn("px-3 py-1 rounded-full text-xs", lta ? "bg-blue-600 text-white" : "bg-white/10 text-white/80")}>LTA</button>
        <button onClick={() => setACC((v) => !v)} aria-pressed={acc} className={cn("px-3 py-1 rounded-full text-xs", acc ? "bg-blue-600 text-white" : "bg-white/10 text-white/80")}>ACC</button>
      </div>
    </div>
  );
}

// 3) Interior: zone chips + vertical stack
function InteriorStage({ item, idx, setIdx }: { item: MediaItem; idx: number; setIdx: (i: number) => void }) {
  const zones = item.gallery.map((g) => g.title || "Zone");
  const img = item.gallery[idx]?.url || FALLBACK;
  const up = () => setIdx(Math.min(item.gallery.length - 1, idx + 1));
  const down = () => setIdx(Math.max(0, idx - 1));

  return (
    <div className="relative w-full h-[56vh] bg-black rounded-xl overflow-hidden">
      <img
        src={img}
        alt={item.gallery[idx]?.title || item.title}
        className="block w-full h-full object-cover"
        onError={(e) => (e.currentTarget.src = FALLBACK)}
      />
      <div className="absolute top-3 left-3 flex gap-2">
        {zones.map((z, i) => (
          <button
            key={z + i}
            onClick={() => setIdx(i)}
            className={cn("px-3 py-1 rounded-full text-xs", i === idx ? "bg-amber-500 text-black" : "bg-white/10 text-white/90")}
          >
            {z}
          </button>
        ))}
      </div>
      {item.gallery.length > 1 && (
        <>
          <Button variant="ghost" size="sm" onClick={down} className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/10" aria-label="Prev">
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="sm" onClick={up} className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/10" aria-label="Next">
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}

// 4) Quality: badge bar + inline details
function QualityStage({ item }: { item: MediaItem }) {
  const [open, setOpen] = useState(0);
  const badges = [
    { label: "ISO 9001", copy: "Process quality and consistency." },
    { label: "J.D. Power", copy: "Dependability recognized over time." },
    { label: "Corrosion", copy: "10-year anti-perforation warranty." },
  ];
  return (
    <div className="w-full h-[56vh] p-3 bg-zinc-950">
      <div className="overflow-x-auto">
        <div className="flex gap-3">
          {badges.map((b, i) => (
            <button
              key={b.label}
              onClick={() => setOpen(i)}
              className={cn("px-4 py-2 rounded-full whitespace-nowrap text-sm", open === i ? "bg-white text-black" : "bg-white/10 text-white/90")}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 h-[calc(56vh-72px)]">
        <img
          src={item.gallery[0]?.url || FALLBACK}
          alt="Quality"
          className="w-full h-full object-cover rounded-lg"
          onError={(e) => (e.currentTarget.src = FALLBACK)}
        />
        <div className="rounded-lg border border-white/10 p-3 text-white/90 bg-white/5">
          <div className="font-semibold mb-1">{badges[open].label}</div>
          <p className="text-sm">{badges[open].copy}</p>
        </div>
      </div>
    </div>
  );
}

// 5) Technology: interactive chips with fill demo
function TechnologyStage() {
  const [on, setOn] = useState<{ [k: string]: boolean }>({});
  const items = [
    { key: "ota", name: "OTA Updates" },
    { key: "inf", name: "Infotainment" },
    { key: "conn", name: "Connectivity" },
    { key: "adas", name: "ADAS UI" },
  ];
  return (
    <div className="w-full h-[56vh] p-3 bg-zinc-950">
      <div className="grid grid-cols-2 gap-3 h-full">
        {items.map((it) => {
          const active = !!on[it.key];
          return (
            <button
              key={it.key}
              onClick={() => setOn((s) => ({ ...s, [it.key]: !active }))}
              className={cn(
                "relative overflow-hidden rounded-xl border border-white/10 p-4 text-left",
                active ? "bg-cyan-600 text-white" : "bg-white/5 text-white/90"
              )}
            >
              <div className="font-semibold">{it.name}</div>
              <div className="mt-3 h-2 w-full rounded bg-white/15 overflow-hidden">
                <div className={cn("h-2", active ? "w-full bg-white/90" : "w-0")} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 6) Handling: before/after compare slider
function HandlingStage({ item }: { item: MediaItem }) {
  const left = item.gallery[0] ?? { url: FALLBACK, title: "Base" };
  const right = item.gallery[1] ?? left;
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const update = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, p)));
  };

  return (
    <div ref={ref} className="relative w-full h-[56vh] rounded-xl overflow-hidden bg-black">
      <img src={left.url} alt={left.title} className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.src = FALLBACK)} />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={right.url} alt={right.title} className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.src = FALLBACK)} />
      </div>
      {/* handle */}
      <div className="absolute top-0 bottom-0" style={{ left: `calc(${pos}% - 1px)` }}>
        <div className="w-0.5 h-full bg-white/80" />
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-white/95 text-black grid place-items-center shadow select-none">
          ⇆
        </div>
      </div>
      {/* pointer */}
      <div
        className="absolute inset-0"
        onPointerDown={(e) => update(e.clientX)}
        onPointerMove={(e) => e.buttons === 1 && update(e.clientX)}
      />
      <div className="absolute bottom-3 left-3 right-3 flex justify-between text-xs text-white/90">
        <span>{left.title}</span>
        <span>{right.title}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CARD + MOSAIC (desktop) & SWIPE RAIL (mobile)
────────────────────────────────────────────────────────── */
function Card({ item, className, onOpen }: { item: MediaItem; className?: string; onOpen: (m: MediaItem) => void }) {
  const s = VARIANT[item.variant];
  const Icon = s.icon;
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
            src={item.thumbnail || FALLBACK}
            alt={item.title}
            className="block w-full h-full object-cover group-hover:scale-[1.03] duration-500"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = FALLBACK)}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          {item.kind === "video" && (
            <div className="absolute inset-0 grid place-items-center">
              <div className="w-14 h-14 bg-white/95 rounded-full grid place-items-center group-hover:scale-110 transition-transform">
                <Play className="h-6 w-6 text-gray-900 translate-x-px" />
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge className={`bg-gradient-to-r ${s.accent} text-white border-0`}>
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

          {!!item.tags?.length && (
            <div className="flex flex-wrap gap-1 mt-3">
              {item.tags.slice(0, 3).map((t, i) => (
                <span key={i} className={cn("text-xs px-2 py-1 rounded-full font-medium", s.bg, s.text)}>
                  {t}
                </span>
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

interface PremiumMediaShowcaseProps {
  vehicle: VehicleModel;
  items?: MediaItem[];
  onBookTestDrive?: () => void;
}

const PremiumMediaShowcase: React.FC<PremiumMediaShowcaseProps> = ({ vehicle, items, onBookTestDrive }) => {
  const data = items && items.length ? items : DATA;
  const [openItem, setOpenItem] = useState<MediaItem | null>(null);

  // Deterministic mosaic sizes (explicit heights so thumbnails always render)
  const MOSAIC: string[] = [
    "md:col-span-3 md:h-[420px]", // hero
    "md:col-span-3 md:h-[420px]", // big
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

        {/* mobile: swipeable rail with snap + peek */}
        <div className="-mx-4 px-4 md:hidden overflow-x-auto scroll-smooth snap-x snap-mandatory flex gap-3" role="list" aria-label="Highlights">
          {data.map((item) => (
            <div key={item.id} className="snap-center min-w-[88%]">
              <Card item={item} onOpen={setOpenItem} />
            </div>
          ))}
          <div className="min-w-[12%]" aria-hidden />
        </div>

        {/* desktop/tablet: mosaic grid (explicit heights) */}
        <div className="hidden md:grid md:grid-cols-6 gap-6" role="list" aria-label="Highlights mosaic">
          {data.map((item, i) => (
            <Card key={item.id} item={item} className={MOSAIC[i] || "md:col-span-2 md:h-[240px]"} onOpen={setOpenItem} />
          ))}
        </div>
      </div>

      {/* modal */}
      <Modal item={openItem} open={!!openItem} onClose={() => setOpenItem(null)} onBookTestDrive={onBookTestDrive} />
    </section>
  );
};

export default PremiumMediaShowcase;
