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
  summary: string; // single sentence
  kind: "image" | "video";
  thumbnail: string;
  gallery: Scene[];
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  tags?: string[];
  variant: Variant;
}

const FALLBACK = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop";
const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

/* ─────────────────────────────────────────────────────────
   Data (DAM + Wistia where provided)
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
   Variant shells (completely different markup per variant)
────────────────────────────────────────────────────────── */

// 1) PERFORMANCE — Full-bleed, no header, floating close; spec rail + hotspots + bottom CTA stripe
function PerformanceModal({ item, onClose, onBook }: { item: MediaItem; onClose: () => void; onBook?: () => void }) {
  const [i, setI] = useState(0);
  const s = item.gallery[i];

  useLockBodyScroll();

  return (
    <div className="fixed inset-0 z-50 bg-black/85">
      <button className="absolute top-4 right-4 z-20 rounded-full bg-white/90 p-2" onClick={onClose} aria-label="Close"><X className="h-5 w-5"/></button>

      {/* stage */}
      <div className="absolute inset-0 grid md:grid-cols-[360px_1fr]">
        {/* left spec rail */}
        <aside className="hidden md:flex flex-col gap-3 p-4 text-white/90">
          <div className="rounded-xl p-3 border border-white/10 bg-zinc-900/60 backdrop-blur">
            <Badge className="bg-gradient-to-r from-red-600 to-red-700 border-0 text-white mb-2"><Zap className="h-3.5 w-3.5 mr-1"/>Performance</Badge>
            <div className="text-sm font-semibold">Architecture</div>
            <div className="text-xs opacity-90 mt-1">{s?.description || item.summary}</div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {["Instant response","Smooth surge","Thermal control","Direct injection"].map((t,k)=>(
              <div key={k} className="rounded-lg px-3 py-2 text-xs bg-zinc-900/70 border border-white/10">{t}</div>
            ))}
          </div>
          {item.gallery.length>1 && (
            <div className="mt-auto flex flex-wrap gap-2">
              {item.gallery.map((g, idx)=>(
                <button key={idx} onClick={()=>setI(idx)} className={cn("rounded-md px-3 py-1 text-xs", i===idx?"bg-white text-black":"bg-white/20 text-white")}>{g.title}</button>
              ))}
            </div>
          )}
        </aside>

        {/* media + hotspots */}
        <div className="relative">
          <img src={s?.url || FALLBACK} alt={s?.title || item.title} className="absolute inset-0 w-full h-full object-contain" onError={e=>{(e.currentTarget as HTMLImageElement).src=FALLBACK}} />
          {s?.details?.hotspots?.map((h, idx)=>(
            <Hotspot key={idx} x={h.x} y={h.y} label={h.label} body={h.body} dark />
          ))}
        </div>
      </div>

      {/* bottom CTA stripe */}
      <div className="absolute left-0 right-0 bottom-0 bg-zinc-950 border-t border-white/10 px-4 py-3 flex flex-col sm:flex-row gap-2 items-center">
        <p className="text-white/80 text-sm grow">{item.summary}</p>
        <Button variant="outline" className="h-11 w-full sm:w-auto" onClick={onClose}>Close</Button>
        <Button className="h-11 w-full sm:w-auto bg-[#EB0A1E] hover:bg-[#d70a19]" onClick={onBook}><Car className="h-4 w-4 mr-2"/>Book Test Drive</Button>
      </div>
    </div>
  );
}

// 2) SAFETY — 3-column: left scenario tabs, center video, right moment card; distinct header/footer
function SafetyModal({ item, onClose, onBook }: { item: MediaItem; onClose: () => void; onBook?: () => void }) {
  useLockBodyScroll();
  const [scenario, setScenario] = useState<"City"|"Highway"|"Night"|"Rain">("City");
  const note = scenario==="City" ? "Low-speed alerts and pedestrian awareness."
    : scenario==="Highway" ? "Lane tracing and adaptive cruise settle long runs."
    : scenario==="Night" ? "Camera + radar cooperate in low light."
    : "Traction-aware cruise and lane assist in rain.";
  const v = item.video;
  const src = v ? (v.provider==="youtube"
    ? `https://www.youtube.com/embed/${v.id}?autoplay=${v.autoplay?1:0}&rel=0&modestbranding=1`
    : `https://fast.wistia.net/embed/iframe/${v.id}?autoPlay=${v.autoplay?1:0}`) : null;

  return (
    <div className="fixed inset-0 z-50 grid grid-rows-[48px_1fr_56px] bg-[#081622] text-white">
      <header className="px-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white"><Shield className="h-3.5 w-3.5 mr-1"/>Safety</Badge>
          <span className="font-semibold">{item.title}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5"/></Button>
      </header>

      <div className="grid md:grid-cols-[160px_1fr_320px] gap-0">
        {/* left tabs */}
        <aside className="hidden md:flex flex-col gap-2 p-3 border-r border-white/10">
          {(["City","Highway","Night","Rain"] as const).map(s=>(
            <button key={s} onClick={()=>setScenario(s)} className={cn("px-3 py-2 rounded-lg text-sm text-left", s===scenario?"bg-blue-600":"bg-white/10")}>{s}</button>
          ))}
        </aside>

        {/* video */}
        <div className="relative bg-black">
          {src ? (
            <iframe title={item.title} className="absolute inset-0 w-full h-full" src={src} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/>
          ) : (
            <img src={item.gallery[0]?.url || FALLBACK} alt="Safety" className="absolute inset-0 w-full h-full object-cover" />
          )}
        </div>

        {/* right moment card */}
        <aside className="hidden md:flex flex-col p-4 border-l border-white/10 bg-blue-900/30 backdrop-blur">
          <div className="text-sm font-semibold">In this scenario</div>
          <p className="text-xs mt-1 text-white/90">{note}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {(item.tags ?? []).slice(0,3).map((t,i)=>(<span key={i} className="text-[11px] px-2 py-1 rounded-full bg-white/20">{t}</span>))}
          </div>
          <div className="mt-auto text-[11px] text-white/70">Tip: captions on by default for clarity.</div>
        </aside>
      </div>

      <footer className="px-3 py-2 border-t border-white/10 bg-white/5 flex gap-2">
        <Button variant="outline" className="h-11 w-full sm:w-auto" onClick={onClose}>Close</Button>
        <Button className="h-11 w-full sm:w-auto bg-[#EB0A1E] hover:bg-[#d70a19]" onClick={onBook}><Car className="h-4 w-4 mr-2"/>Book Test Drive</Button>
      </footer>
    </div>
  );
}

// 3) INTERIOR — Bottom-sheet on mobile / warm split on desktop; floating close
function InteriorModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  useLockBodyScroll();
  const [i, setI] = useState(0);
  const s = item.gallery[i];

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}/>
      {/* bottom sheet */}
      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:mx-auto md:w-[min(1000px,96vw)] bg-[#1b1408] text-amber-50 rounded-t-2xl md:rounded-2xl overflow-hidden">
        <button className="absolute right-3 top-3 md:right-4 md:top-4 bg-amber-900/50 rounded-full p-2" onClick={onClose}><X className="h-5 w-5"/></button>

        <div className="grid md:grid-cols-2">
          <div className="relative h-[56vh] md:h-[70vh]">
            <img src={s?.url || FALLBACK} alt={s?.title || item.title} className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute top-3 left-3 right-3 flex gap-2 overflow-x-auto">
              {item.gallery.map((g, idx)=>(
                <button key={idx} onClick={()=>setI(idx)} className={cn("px-3 py-1 rounded-full text-xs", i===idx?"bg-amber-500 text-black":"bg-white/20 text-white")}>{g.title}</button>
              ))}
            </div>
          </div>
          <div className="p-4 md:p-6">
            <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 border-0 text-black mb-2"><Heart className="h-3.5 w-3.5 mr-1"/>Interior</Badge>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="text-sm mt-2 text-amber-50/90">{s?.description || item.summary}</p>
            <div className="mt-3 flex gap-1 flex-wrap">
              {(item.tags ?? []).slice(0,3).map((t,i)=>(<span key={i} className="text-[11px] px-2 py-1 rounded-full bg-amber-800/40">{t}</span>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 4) QUALITY — Light document shell with collage + proof card, footer integrated
function QualityModal({ item, onClose, onBook }: { item: MediaItem; onClose: () => void; onBook?: () => void }) {
  useLockBodyScroll();
  const [active, setActive] = useState(item.tags?.[0] ?? "Warranty");
  const img = item.gallery[0]?.url || FALLBACK;
  const copy = active==="ISO 9001" ? "Certified processes keep quality consistent from plant to plant."
    : active==="Warranty" ? "Coverage protects key components; corrosion layers guard the body."
    : "Assured dependability across markets.";

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="max-w-5xl mx-auto h-full grid grid-rows-[56px_1fr_56px]">
        <header className="flex items-center justify-between border-b border-stone-200 px-4">
          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-stone-700 to-stone-800 border-0 text-white"><Award className="h-3.5 w-3.5 mr-1"/>Quality</Badge>
            <span className="font-semibold">{item.title}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5"/></Button>
        </header>

        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 rounded-xl overflow-hidden border border-stone-300">
            <img src={img} alt="Assurance" className="w-full h-full object-cover"/>
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
        </div>

        <footer className="px-4 py-2 border-t border-stone-200 bg-white flex gap-2">
          <Button variant="outline" className="h-11 w-full sm:w-auto" onClick={onClose}>Close</Button>
          <Button className="h-11 w-full sm:w-auto bg-[#EB0A1E] hover:bg-[#d70a19]" onClick={onBook}><Car className="h-4 w-4 mr-2"/>Book Test Drive</Button>
        </footer>
      </div>
    </div>
  );
}

// 5) TECHNOLOGY — Device dock center + right update rail; CTA in rail
function TechnologyModal({ item, onClose, onBook }: { item: MediaItem; onClose: () => void; onBook?: () => void }) {
  useLockBodyScroll();
  const [feature, setFeature] = useState(item.tags?.[0] ?? "CarPlay/AA");
  const img = item.gallery[0]?.url || FALLBACK;
  const copy =
    feature.includes("CarPlay") || feature==="CarPlay/AA" ? "Seamless phone projection with calls, messages, and maps."
    : feature==="OTA" ? "Updates arrive over the air; new features without a workshop visit."
    : "Companion app checks status and sends destinations.";

  return (
    <div className="fixed inset-0 z-50 grid md:grid-cols-[1fr_340px] bg-[#071a1e] text-cyan-50">
      {/* close */}
      <button className="absolute top-3 right-3 bg-white/10 rounded-full p-2" onClick={onClose}><X className="h-5 w-5"/></button>

      {/* device dock */}
      <div className="relative">
        <div className="absolute inset-0 grid place-items-center">
          <div className="w-[300px] h-[630px] rounded-[36px] bg-black/70 border border-cyan-300/30 shadow-xl relative overflow-hidden">
            <img src={img} alt="Infotainment" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
              <div className="text-xs">{copy}</div>
            </div>
          </div>
        </div>
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2 justify-center md:justify-center">
          {(item.tags ?? ["CarPlay/AA","OTA"]).map(tag=>(
            <button key={tag} onClick={()=>setFeature(tag)} className={cn("px-3 py-1 rounded-full text-xs", tag===feature?"bg-cyan-600 text-white":"bg-white/20 text-white")}>{tag}</button>
          ))}
        </div>
      </div>

      {/* update rail */}
      <aside className="hidden md:flex flex-col border-l border-white/10 bg-cyan-900/30 p-4 gap-3">
        <Badge className="bg-gradient-to-r from-cyan-600 to-cyan-700 border-0 text-white"><Wifi className="h-3.5 w-3.5 mr-1"/>Technology</Badge>
        <div className="text-sm font-semibold">What’s new</div>
        <div className="text-xs opacity-90">Over-the-air capability means features grow over time.</div>
        <div className="mt-auto flex gap-2">
          <Button variant="outline" className="h-11 w-full" onClick={onClose}>Close</Button>
          <Button className="h-11 w-full bg-[#EB0A1E] hover:bg-[#d70a19]" onClick={onBook}><Car className="h-4 w-4 mr-2"/>Book Test Drive</Button>
        </div>
      </aside>
    </div>
  );
}

// 6) HANDLING — Edge-to-edge hero + segmented control, compact header
function HandlingModal({ item, onClose }: { item: MediaItem; onClose: () => void }) {
  useLockBodyScroll();
  const modes = item.gallery.map(g=>g.title);
  const [mode, setMode] = useState(modes[0] || "Normal");
  const s = item.gallery.find(g=>g.title===mode) ?? item.gallery[0];
  const note = mode==="Sport" ? "Quicker throttle, firmer body control."
    : mode.toLowerCase().includes("off") ? "Gentle throttle with added compliance."
    : "Balanced response for daily driving.";

  return (
    <div className="fixed inset-0 z-50 bg-[#07170f] text-emerald-50">
      <header className="h-12 px-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 border-0 text-white"><Star className="h-3.5 w-3.5 mr-1"/>Handling</Badge>
          <span className="font-semibold">{item.title}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}><X className="h-5 w-5"/></Button>
      </header>

      <div className="relative h-[calc(100%-48px)]">
        <img src={s?.url || FALLBACK} alt={s?.title || "Handling"} className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute left-3 right-3 bottom-3 grid grid-cols-3 gap-2">
          {modes.slice(0,3).map(m=>(
            <button key={m} onClick={()=>setMode(m)} className={cn("rounded-md px-3 py-2 text-sm font-medium", mode===m?"bg-emerald-600 text-white":"bg-white/20 text-white")}>{m}</button>
          ))}
        </div>
        <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded bg-emerald-900/50 border border-white/10">{note}</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Hotspot bubble + util
────────────────────────────────────────────────────────── */
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

function useLockBodyScroll() {
  useEffect(() => { const b = document.body; const prev = b.style.overflow; b.style.overflow = "hidden"; return () => { b.style.overflow = prev; }; }, []);
}

/* ─────────────────────────────────────────────────────────
   Cards + Showcase wrapper
────────────────────────────────────────────────────────── */
function Card({ item, className, onOpen }: { item: MediaItem; className?: string; onOpen: (m: MediaItem) => void }) {
  const Icon = {
    performance: Zap, safety: Shield, interior: Heart, quality: Award, technology: Wifi, handling: Star,
  }[item.variant];

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
            <Badge className="bg-black/70 text-white border-0">
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
  const [active, setActive] = useState<MediaItem | null>(null);

  // explicit heights so thumbnails never collapse on desktop
  const MOSAIC = [
    "md:col-span-3 md:h-[420px]",
    "md:col-span-3 md:h-[420px]",
    "md:col-span-2 md:h-[240px]",
    "md:col-span-2 md:h-[240px]",
    "md:col-span-1 md:h-[240px]",
    "md:col-span-1 md:h-[240px]",
  ];

  // open the correct shell
  const openModal = (m: MediaItem) => setActive(m);
  const closeModal = () => setActive(null);

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
              <Card item={it} onOpen={openModal} />
            </div>
          ))}
          <div className="min-w-[12%]" aria-hidden />
        </div>

        {/* desktop mosaic */}
        <div className="hidden md:grid md:grid-cols-6 gap-6" role="list" aria-label="Highlights mosaic">
          {data.map((it, i) => (
            <Card key={it.id} item={it} className={MOSAIC[i] || "md:col-span-2 md:h-[240px]"} onOpen={openModal} />
          ))}
        </div>
      </div>

      {/* variant-specific modal shells */}
      {active?.variant === "performance" && <PerformanceModal item={active} onClose={closeModal} onBook={onBookTestDrive} />}
      {active?.variant === "safety" && <SafetyModal item={active} onClose={closeModal} onBook={onBookTestDrive} />}
      {active?.variant === "interior" && <InteriorModal item={active} onClose={closeModal} />}
      {active?.variant === "quality" && <QualityModal item={active} onClose={closeModal} onBook={onBookTestDrive} />}
      {active?.variant === "technology" && <TechnologyModal item={active} onClose={closeModal} onBook={onBookTestDrive} />}
      {active?.variant === "handling" && <HandlingModal item={active} onClose={closeModal} />}
    </section>
  );
};

export default PremiumMediaShowcase;
