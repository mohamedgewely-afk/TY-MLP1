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
  Smartphone,
  Check,
} from "lucide-react";

/* ─────────────────────────────────────────
   Types & tokens
────────────────────────────────────────── */
type Variant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";

interface MediaItem {
  id: string;
  category: string;
  title: string;
  summary: string;                 // tight sentence; no bullets
  kind: "image" | "video";
  thumbnail: string;               // card thumbnail
  gallery: Array<{ url: string; title: string; description?: string }>;
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  tags?: string[];                 // small chips (0–4)
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

/* ─────────────────────────────────────────
   Data (DAM + Wistia), compact copy
────────────────────────────────────────── */
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
      { url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop", title: "Assurance" },
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
      { url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop", title: "Infotainment" },
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

/* ─────────────────────────────────────────
   Modal shell — reliable layout
   - Flex column, fixed stage height (images always visible)
   - Keyboard ESC, body scroll lock
────────────────────────────────────────── */
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
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || !item) return null;
  const t = TOKENS[item.variant];
  const Icon = t.icon;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[min(96vw,1120px)] -translate-x-1/2 -translate-y-1/2 bg-zinc-950 text-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <header className="h-14 flex items-center justify-between border-b border-white/10 px-4 lg:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <Badge className={`bg-gradient-to-r ${t.accent} text-white border-0`}>
              <Icon className="h-3.5 w-3.5 mr-1" /> {item.category}
            </Badge>
            <h3 className="font-semibold truncate">{item.title}</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-white/80" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Stage */}
            <div className="lg:w-7/12 p-3 lg:p-4">
              <div className="relative rounded-xl overflow-hidden bg-black h-[58vh] lg:h-[62vh]">
                {item.variant === "performance" && <PerformanceStage item={item} />}
                {item.variant === "safety" && <SafetyStage item={item} />}
                {item.variant === "interior" && <InteriorStage item={item} />}
                {item.variant === "quality" && <QualityStage item={item} />}
                {item.variant === "technology" && <TechnologyStage />}
                {item.variant === "handling" && <HandlingStage item={item} />}
              </div>
            </div>

            {/* Info rail (concise; no bullets) */}
            <aside className="lg:w-5/12 border-t lg:border-t-0 lg:border-l border-white/10 p-4">
              <p className="text-sm text-white/90">{item.summary}</p>
              {!!item.tags?.length && (
                <div className="flex flex-wrap gap-1 pt-3">
                  {item.tags.slice(0, 6).map((txt, i) => (
                    <span
                      key={i}
                      className={cn("text-xs px-2 py-1 rounded-full font-medium", TOKENS[item.variant].bg, TOKENS[item.variant].text)}
                    >
                      {txt}
                    </span>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10 px-3 lg:px-4 py-3 bg-zinc-900/80 backdrop-blur flex items-center gap-2">
          <Button variant="outline" className="h-11 w-full sm:w-auto" onClick={onClose}>Close</Button>
          <Button className="h-11 w-full sm:w-auto bg-[#EB0A1E] hover:bg-[#d70a19]" onClick={() => onBookTestDrive?.()}>
            <Car className="h-4 w-4 mr-2" /> Book Test Drive
          </Button>
        </footer>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Interactive stages
────────────────────────────────────────── */

/** PERFORMANCE — engine selector + payload slider + instant metrics + gallery dots */
function PerformanceStage({ item }: { item: MediaItem }) {
  const ENGINES = [
    { key: "v6", name: "V6 Twin-Turbo", hp: 409, torque: 650, base060: 6.7 },
    { key: "hyb", name: "Hybrid Max", hp: 430, torque: 790, base060: 6.2 },
  ] as const;
  const [engine, setEngine] = useState<(typeof ENGINES)[number]>(ENGINES[0]);
  const [payload, setPayload] = useState(0);
  const [idx, setIdx] = useState(0);

  const zeroTo100 = (engine.base060 * (1 + payload / 220)).toFixed(1); // light slow-down
  const passing = (3.9 * (1 + payload / 250)).toFixed(1); // 80–120 km/h estimate

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1">
        <img
          src={item.gallery[idx]?.url || FALLBACK}
          alt={item.gallery[idx]?.title || item.title}
          className="absolute inset-0 w-full h-full object-contain"
          onError={(e) => (e.currentTarget.src = FALLBACK)}
        />
        {item.gallery.length > 1 && (
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
        )}
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/10 p-3 bg-white/5">
          <div className="text-xs uppercase text-white/60 mb-2">Engine</div>
          <div className="flex gap-2">
            {ENGINES.map((e) => (
              <button
                key={e.key}
                onClick={() => setEngine(e)}
                className={cn("px-3 py-1 rounded-full text-xs", e.key === engine.key ? "bg-red-600 text-white" : "bg-white/10 text-white/90")}
              >
                {e.name}
              </button>
            ))}
          </div>
          <div className="mt-2 text-sm text-white/80">{engine.hp} hp • {engine.torque} Nm</div>
        </div>

        <div className="rounded-lg border border-white/10 p-3 bg-white/5">
          <div className="text-xs uppercase text-white/60 mb-2">Payload</div>
          <input type="range" min={0} max={100} value={payload} onChange={(e) => setPayload(Number(e.target.value))} className="w-full accent-red-600" />
          <div className="mt-2 text-sm text-white/80">{payload}% loaded</div>
        </div>

        <div className="rounded-lg border border-white/10 p-3 bg-white/5">
          <div className="text-xs uppercase text-white/60 mb-2">Quick facts</div>
          <div className="text-sm">0–100 km/h <span className="font-semibold">{zeroTo100}s</span></div>
          <div className="text-sm">80–120 km/h <span className="font-semibold">{passing}s</span></div>
        </div>
      </div>
    </div>
  );
}

/** SAFETY — Wistia (if available) or scenario + PCS/LTA/ACC overlay + follow distance */
function SafetyStage({ item }: { item: MediaItem }) {
  const [scenario, setScenario] = useState<"city" | "highway" | "night" | "rain">("city");
  const [pcs, setPCS] = useState(true), [lta, setLTA] = useState(true), [acc, setACC] = useState(true);
  const [gap, setGap] = useState(2); // following gap

  if (item.video) {
    const src =
      item.video.provider === "youtube"
        ? `https://www.youtube.com/embed/${item.video.id}?autoplay=${item.video.autoplay ? 1 : 0}&rel=0&modestbranding=1`
        : `https://fast.wistia.net/embed/iframe/${item.video.id}?autoPlay=${item.video.autoplay ? 1 : 0}`;
    return <iframe title={item.title} className="w-full h-full" src={src} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />;
  }

  const img = item.gallery[0]?.url || FALLBACK;
  const note =
    scenario === "city" ? "Low-speed support and pedestrian awareness." :
    scenario === "highway" ? "Lane centering and cruising comfort." :
    scenario === "night" ? "Camera + radar cooperation in low light." :
    "Traction-aware cruise and lane assist in rain.";

  return (
    <div className="relative w-full h-full">
      <img src={img} alt={item.title} className="absolute inset-0 w-full h-full object-cover" onError={(e) => (e.currentTarget.src = FALLBACK)} />
      {pcs && <div className="absolute top-[18%] left-[52%] w-16 h-16 rounded-full border-2 border-blue-400/80" />}
      {lta && <div className="absolute top-[55%] left-[20%] w-24 h-10 rounded-md border-2 border-blue-400/80" />}
      {acc && <div className="absolute top-[35%] left-[70%] w-10 h-10 rounded-full border-2 border-blue-400/80" />}

      <div className="absolute top-3 left-3 flex gap-2">
        {(["city","highway","night","rain"] as const).map(s => (
          <button key={s} onClick={() => setScenario(s)} className={cn("px-3 py-1 rounded-full text-xs capitalize", scenario===s?"bg-blue-600 text-white":"bg-white/10 text-white/90")}>{s}</button>
        ))}
      </div>
      <div className="absolute top-3 right-3 flex gap-2">
        <button onClick={() => setPCS(v=>!v)} className={cn("px-3 py-1 rounded-full text-xs", pcs?"bg-blue-600 text-white":"bg-white/10 text-white/80")}>PCS</button>
        <button onClick={() => setLTA(v=>!v)} className={cn("px-3 py-1 rounded-full text-xs", lta?"bg-blue-600 text-white":"bg-white/10 text-white/80")}>LTA</button>
        <button onClick={() => setACC(v=>!v)} className={cn("px-3 py-1 rounded-full text-xs", acc?"bg-blue-600 text-white":"bg-white/10 text-white/80")}>ACC</button>
      </div>

      <div className="absolute bottom-16 left-3 right-3 bg-black/45 rounded px-3 py-2 text-sm">{note}</div>
      <div className="absolute bottom-3 left-3 right-3 bg-black/45 rounded px-3 py-2">
        <div className="text-xs uppercase text-white/70">Follow distance</div>
        <input type="range" min={1} max={4} value={gap} onChange={(e)=>setGap(Number(e.target.value))} className="w-full accent-blue-600" />
        <div className="text-sm">Gap: <span className="font-semibold">{gap}</span> bars</div>
      </div>
    </div>
  );
}

/** INTERIOR — hotspots + seating & color toggles + swipe */
function InteriorStage({ item }: { item: MediaItem }) {
  const [idx, setIdx] = useState(0);
  const [seats, setSeats] = useState<"5"|"7">("7");
  const [color, setColor] = useState<"black"|"sand">("black");
  const [hot, setHot] = useState<string | null>(null);

  const img = item.gallery[idx]?.url || FALLBACK;
  const capacity = seats === "7" ? "Three rows ready; fold flat for cargo." : "Max cargo with two rows.";

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1">
        <img src={img} alt={item.gallery[idx]?.title || item.title} className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
        {/* hotspots (tap to explain) */}
        <button className="absolute top-[30%] left-[35%] w-5 h-5 rounded-full bg-white/90 text-black text-xs grid place-items-center"
          onClick={()=> setHot(hot==="screen"?null:"screen")}>i</button>
        <button className="absolute top-[62%] left-[58%] w-5 h-5 rounded-full bg-white/90 text-black text-xs grid place-items-center"
          onClick={()=> setHot(hot==="seat"?null:"seat")}>i</button>
        <button className="absolute top-[48%] left-[15%] w-5 h-5 rounded-full bg-white/90 text-black text-xs grid place-items-center"
          onClick={()=> setHot(hot==="storage"?null:"storage")}>i</button>

        {hot==="screen" && <div className="absolute top-[32%] left-[38%] text-xs bg-black/70 text-white px-2 py-1 rounded">Low-latency 12.3″ display</div>}
        {hot==="seat"   && <div className="absolute top-[64%] left-[61%] text-xs bg-black/70 text-white px-2 py-1 rounded">Memory seats with ventilation</div>}
        {hot==="storage"&& <div className="absolute top-[50%] left-[18%] text-xs bg-black/70 text-white px-2 py-1 rounded">Hidden storage for small items</div>}

        {item.gallery.length>1 && (
          <>
            <Button variant="ghost" size="sm" onClick={()=>setIdx(i=>Math.max(0,i-1))} className="absolute left-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"><ChevronLeft className="h-6 w-6"/></Button>
            <Button variant="ghost" size="sm" onClick={()=>setIdx(i=>Math.min(item.gallery.length-1,i+1))} className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"><ChevronRight className="h-6 w-6"/></Button>
          </>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="rounded-lg border border-white/10 p-3 bg-white/5">
          <div className="text-xs uppercase text-white/60 mb-2">Seating</div>
          <div className="flex gap-2">
            {(["7","5"] as const).map(s=>(
              <button key={s} onClick={()=>setSeats(s)} className={cn("px-3 py-1 rounded-full text-xs", seats===s?"bg-amber-500 text-black":"bg-white/10 text-white/90")}>{s} seats</button>
            ))}
          </div>
          <div className="mt-2 text-sm text-white/80">{capacity}</div>
        </div>

        <div className="rounded-lg border border-white/10 p-3 bg-white/5">
          <div className="text-xs uppercase text-white/60 mb-2">Upholstery</div>
          <div className="flex gap-2">
            {(["black","sand"] as const).map(c=>(
              <button key={c} onClick={()=>setColor(c)} className={cn("px-3 py-1 rounded-full text-xs capitalize", color===c?"bg-amber-500 text-black":"bg-white/10 text-white/90")}>{c}</button>
            ))}
          </div>
          <div className="mt-2 text-sm text-white/80">{color === "black" ? "Dark, clean finish." : "Warm sand tone."}</div>
        </div>

        <div className="rounded-lg border border-white/10 p-3 bg-white/5">
          <div className="text-xs uppercase text-white/60 mb-2">Quick tip</div>
          <div className="text-sm text-white/80">Tap the dots to reveal comfort details.</div>
        </div>
      </div>
    </div>
  );
}

/** QUALITY — warranty slider + ownership cost glance (km/year) */
function QualityStage({ item }: { item: MediaItem }) {
  const [year, setYear] = useState(3);
  const [km, setKm] = useState(15000);
  const coverage = year<=3 ? "Bumper-to-bumper active." : year<=5 ? "Powertrain coverage active." : "Rust-through coverage continues.";

  // toy estimate for service count (every 10k)
  const services = Math.max(1, Math.round((year*km)/10000));

  return (
    <div className="flex flex-col h-full">
      <div className="grid grid-cols-2 gap-3 flex-1">
        <img src={item.gallery[0]?.url || FALLBACK} alt="Quality" className="w-full h-full object-cover rounded-lg" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
        <div className="rounded-lg border border-white/10 p-3 bg-white/5">
          <div className="text-xs uppercase text-white/60">Warranty timeline</div>
          <input type="range" min={0} max={10} value={year} onChange={(e)=>setYear(Number(e.target.value))} className="w-full accent-gray-600 mt-2"/>
          <div className="mt-2 text-sm text-white/80">{year} year{year!==1?"s":""} of ownership</div>
          <div className="mt-1 text-sm"><span className="font-semibold">{coverage}</span></div>
          <div className="mt-4 text-xs uppercase text-white/60">Kilometres / year</div>
          <input type="range" min={5000} max={30000} step={5000} value={km} onChange={(e)=>setKm(Number(e.target.value))} className="w-full accent-gray-600 mt-2"/>
          <div className="mt-2 text-sm text-white/80">About <span className="font-semibold">{services}</span> service visit{services>1?"s":""} so far.</div>
        </div>
      </div>
    </div>
  );
}

/** TECHNOLOGY — phone compatibility + OTA cadence + pairing simulation */
function TechnologyStage() {
  const [os, setOS] = useState<"ios"|"android">("ios");
  const [paired, setPaired] = useState(false);
  const [cadence, setCadence] = useState<"monthly"|"quarterly">("quarterly");

  const compat = os==="ios" ? "CarPlay ready. Calls, messages, maps." : "Android Auto ready. Calls, messages, maps.";
  const cadenceNote = cadence==="monthly" ? "Fresh features roughly every 4 weeks." : "Feature rollouts roughly every quarter.";

  return (
    <div className="grid grid-cols-2 gap-3 h-full">
      <div className="rounded-lg border border-white/10 p-3 bg-white/5">
        <div className="text-xs uppercase text-white/60">Phone</div>
        <div className="mt-2 flex gap-2">
          <button onClick={()=>setOS("ios")} className={cn("px-3 py-1 rounded-full text-xs", os==="ios"?"bg-cyan-600 text-white":"bg-white/10 text-white/90")}>iOS</button>
          <button onClick={()=>setOS("android")} className={cn("px-3 py-1 rounded-full text-xs", os==="android"?"bg-cyan-600 text-white":"bg-white/10 text-white/90")}>Android</button>
        </div>
        <div className="mt-3 text-sm text-white/80 flex items-center gap-2"><Smartphone className="h-4 w-4"/>{compat}</div>
        <div className="mt-3">
          <Button size="sm" onClick={()=>setPaired(true)} disabled={paired}>{paired ? <><Check className="h-4 w-4 mr-1"/>Paired</> : "Pair phone"}</Button>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 p-3 bg-white/5">
        <div className="text-xs uppercase text-white/60">OTA cadence</div>
        <div className="mt-2 flex gap-2">
          <button onClick={()=>setCadence("monthly")} className={cn("px-3 py-1 rounded-full text-xs", cadence==="monthly"?"bg-cyan-600 text-white":"bg-white/10 text-white/90")}>Monthly</button>
          <button onClick={()=>setCadence("quarterly")} className={cn("px-3 py-1 rounded-full text-xs", cadence==="quarterly"?"bg-cyan-600 text-white":"bg-white/10 text-white/90")}>Quarterly</button>
        </div>
        <div className="mt-3 text-sm text-white/80">{cadenceNote}</div>
      </div>
    </div>
  );
}

/** HANDLING — compare slider + mode presets */
function HandlingStage({ item }: { item: MediaItem }) {
  const left = item.gallery[0] ?? { url: FALLBACK, title: "Normal" };
  const right = item.gallery[1] ?? left;
  const [pos, setPos] = useState(50);
  const [mode, setMode] = useState<"normal"|"sport"|"offroad">("normal");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(()=>{ setPos(mode==="sport"?70:mode==="offroad"?35:50); },[mode]);

  const update = (clientX:number) => {
    const r = ref.current?.getBoundingClientRect(); if(!r) return;
    const p = ((clientX - r.left)/r.width)*100; setPos(Math.max(0,Math.min(100,p)));
  };

  const feel = mode==="sport" ? "Quicker throttle, firmer damping, heavier steering."
    : mode==="offroad" ? "Gentle throttle, softer damping, relaxed steering."
    : "Balanced response for daily driving.";

  return (
    <div className="flex flex-col h-full">
      <div ref={ref} className="relative flex-1 rounded-xl overflow-hidden bg-black">
        <img src={left.url} alt={left.title} className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
        <div className="absolute inset-0 overflow-hidden" style={{ width:`${pos}%` }}>
          <img src={right.url} alt={right.title} className="absolute inset-0 w-full h-full object-cover" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
        </div>
        <div className="absolute top-0 bottom-0" style={{ left:`calc(${pos}% - 1px)` }}>
          <div className="w-0.5 h-full bg-white/80" />
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-white/95 text-black grid place-items-center shadow">⇆</div>
        </div>
        <div className="absolute inset-0" onPointerDown={(e)=>update(e.clientX)} onPointerMove={(e)=>e.buttons===1 && update(e.clientX)} />
      </div>
      <div className="mt-3 rounded-lg border border-white/10 p-3 bg-white/5">
        <div className="text-xs uppercase text-white/60 mb-2">Drive mode</div>
        <div className="flex gap-2">
          {(["normal","sport","offroad"] as const).map(m=>(
            <button key={m} onClick={()=>setMode(m)} className={cn("px-3 py-1 rounded-full text-xs capitalize", mode===m?"bg-emerald-600 text-white":"bg-white/10 text-white/90")}>{m}</button>
          ))}
        </div>
        <div className="mt-2 text-sm text-white/80">{feel}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Card + Mosaic (desktop) & Swipe Rail (mobile)
────────────────────────────────────────── */
function Card({ item, className, onOpen }: { item: MediaItem; className?: string; onOpen: (m: MediaItem) => void }) {
  const s = TOKENS[item.variant]; const Icon = s.icon;
  return (
    <article role="listitem" className={cn("group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-300", "focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-900", className)}>
      <button onClick={()=>onOpen(item)} className="w-full text-left focus:outline-none" aria-label={`Open ${item.title}`}>
        <div className="relative h-[220px] md:h-full overflow-hidden">
          <img src={item.thumbnail || FALLBACK} alt={item.title} className="block w-full h-full object-cover group-hover:scale-[1.03] duration-500" onError={(e)=> (e.currentTarget.src=FALLBACK)} />
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
              {item.tags.slice(0,4).map((t,i)=>(
                <span key={i} className={cn("text-xs px-2 py-1 rounded-full font-medium", s.bg, s.text)}>{t}</span>
              ))}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>{item.gallery.length} image{item.gallery.length!==1?"s":""}</span>
            <Info className="h-4 w-4"/>
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

  // Reliable mosaic (explicit heights so thumbnails always show)
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
          {data.map((it)=>(
            <div key={it.id} className="snap-center min-w-[88%]">
              <Card item={it} onOpen={setOpenItem} />
            </div>
          ))}
          <div className="min-w-[12%]" aria-hidden />
        </div>

        {/* Desktop mosaic */}
        <div className="hidden md:grid md:grid-cols-6 gap-6" role="list" aria-label="Highlights mosaic">
          {data.map((it, i)=>(
            <Card key={it.id} item={it} className={MOSAIC[i] || "md:col-span-2 md:h-[240px]"} onOpen={setOpenItem}/>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal item={openItem} open={!!openItem} onClose={()=>setOpenItem(null)} onBookTestDrive={onBookTestDrive}/>
    </section>
  );
};

export default PremiumMediaShowcase;
