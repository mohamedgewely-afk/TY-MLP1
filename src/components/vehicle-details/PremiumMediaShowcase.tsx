import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Shield,
  Zap,
  Heart,
  Wifi,
  Award,
  Star,
  Car,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─────────────────────────────────────────
   Types & tokens
────────────────────────────────────────── */
type ModalVariant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";

interface MediaItem {
  id: string;
  category: string;
  title: string;
  summary: string;
  kind: "image" | "video";
  thumbnail: string;
  gallery: Array<{
    url: string;
    title: string;
    description?: string;
    details?: {
      overview?: string;
      specs?: string[];
      features?: string[];
      tech?: string[];
    };
  }>;
  video?: {
    provider: "wistia" | "youtube";
    id: string;
    autoplay?: boolean;
  };
  badges?: string[];
  variant: ModalVariant;
}

const VARIANT_STYLES: Record<
  ModalVariant,
  { accent: string; bg: string; text: string; icon: React.ComponentType<any> }
> = {
  performance: { accent: "from-red-600 to-red-700", bg: "bg-red-50/80", text: "text-red-700", icon: Zap },
  safety: { accent: "from-blue-600 to-blue-700", bg: "bg-blue-50/80", text: "text-blue-700", icon: Shield },
  interior: { accent: "from-amber-600 to-amber-700", bg: "bg-amber-50/80", text: "text-amber-700", icon: Heart },
  quality: { accent: "from-gray-600 to-gray-700", bg: "bg-gray-50/80", text: "text-gray-700", icon: Award },
  technology: { accent: "from-cyan-600 to-cyan-700", bg: "bg-cyan-50/80", text: "text-cyan-700", icon: Wifi },
  handling: { accent: "from-emerald-600 to-emerald-700", bg: "bg-emerald-50/80", text: "text-emerald-700", icon: Star },
};

const VARIANT_LABELS: Record<ModalVariant, string> = {
  performance: "Performance",
  safety: "Safety",
  interior: "Interior",
  quality: "Quality",
  technology: "Technology",
  handling: "Handling",
};

/* ─────────────────────────────────────────
   Demo data (swap with CMS/DAM feed)
────────────────────────────────────────── */
const DEMO_MEDIA: MediaItem[] = [
  {
    id: "performance",
    category: "Performance",
    title: "V6 Twin-Turbo Engine",
    summary: "Immediate torque, smooth surge; tuned for confident highway merges and climbs.",
    kind: "image",
    variant: "performance",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Architecture",
        description: "Optimized airflow and cooling for sustained output.",
        details: {
          overview: "3.5L V6 Twin-Turbo engineered for desert heat and long hauls.",
          specs: ["3.5L V6", "Twin-Turbo", "400+ hp", "Direct injection"],
          features: ["VVT-i", "Aluminum block", "Advanced cooling"],
        },
      },
      {
        url: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1600&auto=format&fit=crop",
        title: "Power Delivery",
        description: "Controlled surge through the rev range.",
      },
    ],
    badges: ["400+ HP", "Twin-Turbo", "Instant Response"],
  },
  {
    id: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "Camera + radar suite to support safer journeys.",
    kind: "image",
    variant: "safety",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Assistance Suite",
        description: "Designed for real-world UAE driving.",
        details: {
          overview: "PCS, LTA, ACC, BSM help reduce fatigue and risk.",
          specs: ["PCS", "Lane Tracing Assist", "Adaptive Cruise", "Blind Spot Monitor"],
        },
      },
    ],
    badges: ["TSS 2.0", "5-Star Safety", "ADAS"],
  },
  {
    id: "interior",
    category: "Interior",
    title: "Premium Cabin",
    summary: "Soft-touch materials, ergonomic controls, and low-latency infotainment.",
    kind: "image",
    variant: "interior",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Command Center",
        description: "Clear layout reduces distraction.",
        details: {
          overview: "Visibility, reach, and responsiveness for daily comfort.",
          specs: ['12.3" Display', "Tri-zone Climate", "Premium Audio"],
          features: ["Voice Control", "Wireless Charging", "Memory Seats"],
        },
      },
      {
        url: "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop",
        title: "Materials",
        description: "Premium textures and stitching.",
      },
    ],
    badges: ['12.3" Display', "Premium Materials", "Comfort Plus"],
  },
  {
    id: "quality",
    category: "Quality",
    title: "Built to Last",
    summary: "Global standards, corrosion protection, and long-term dependability.",
    kind: "image",
    variant: "quality",
    thumbnail: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop",
        title: "Assurance",
        description: "Confidence backed by certification and warranty.",
        details: { overview: "Verified by independent bodies.", specs: ["ISO 9001", "J.D. Power", "10-year Rust Warranty"] },
      },
    ],
    badges: ["ISO", "J.D. Power", "Warranty"],
  },
  {
    id: "technology",
    category: "Technology",
    title: "Smart Connectivity",
    summary: "OTA updates and seamless phone integration keep features fresh.",
    kind: "image",
    variant: "technology",
    thumbnail: "https://images.unsplash.com/photo-1603481588273-0c31c4b7a52f?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
        title: "Infotainment",
        description: "Offline-capable maps with quick search.",
        details: { overview: "Quiet background rollouts.", tech: ["OTA engine", "CarPlay/Android Auto", "Deep links"] },
      },
    ],
    badges: ["OTA", "App Link", "CarPlay/AA"],
  },
  {
    id: "handling",
    category: "Handling",
    title: "Composed Dynamics",
    summary: "Selectable modes adapt damping and response for road or desert.",
    kind: "image",
    variant: "handling",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
        title: "Normal",
        description: "Balanced ride for daily use.",
      },
      {
        url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1600&auto=format&fit=crop",
        title: "Sport",
        description: "Sharper response and grip.",
      },
    ],
    badges: ["Multi-Mode", "Grip Control", "Chassis Balance"],
  },
];

/* ─────────────────────────────────────────
   Unique stage components
────────────────────────────────────────── */

/** 1) Performance — scrub bar + inertial carousel */
function PerformanceStage({
  media,
  index,
  setIndex,
}: {
  media: MediaItem;
  index: number;
  setIndex: (i: number) => void;
}) {
  const onDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { x } = info.offset;
    const { x: vx } = info.velocity;
    if (x < -50 || vx < -300) setIndex(Math.min(media.gallery.length - 1, index + 1));
    if (x > 50 || vx > 300) setIndex(Math.max(0, index - 1));
  };
  const pct = media.gallery.length > 1 ? (index / (media.gallery.length - 1)) * 100 : 0;

  return (
    <div className="relative bg-black rounded-lg overflow-hidden min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh]">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={media.gallery[index]?.url}
          alt={media.gallery[index]?.title || media.title}
          className="absolute inset-0 w-full h-full object-contain"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={onDragEnd}
          initial={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
        />
      </AnimatePresence>

      {media.gallery.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-1.5 bg-red-600 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex justify-center gap-2">
            {media.gallery.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** 2) Safety — feature toggles overlaying highlights on image */
function SafetyStage({ media }: { media: MediaItem }) {
  const [toggles, setToggles] = useState({ pcs: true, lta: true, acc: false });
  const toggle = (k: keyof typeof toggles) => setToggles((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="relative rounded-lg overflow-hidden bg-black min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh]">
      <img
        src={media.gallery[0]?.url}
        alt={media.gallery[0]?.title || media.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      {/* simple highlights */}
      {toggles.pcs && <div className="absolute top-[18%] left-[52%] w-16 h-16 rounded-full border-2 border-blue-400/80" />}
      {toggles.lta && <div className="absolute top-[55%] left-[20%] w-24 h-10 rounded-md border-2 border-blue-400/80" />}
      {toggles.acc && <div className="absolute top-[35%] left-[70%] w-10 h-10 rounded-full border-2 border-blue-400/80" />}

      <div className="absolute top-3 left-3 flex gap-2">
        <button
          onClick={() => toggle("pcs")}
          className={`px-3 py-1 rounded-full text-xs ${toggles.pcs ? "bg-blue-600 text-white" : "bg-white/10 text-white/80"}`}
        >
          PCS
        </button>
        <button
          onClick={() => toggle("lta")}
          className={`px-3 py-1 rounded-full text-xs ${toggles.lta ? "bg-blue-600 text-white" : "bg-white/10 text-white/80"}`}
        >
          LTA
        </button>
        <button
          onClick={() => toggle("acc")}
          className={`px-3 py-1 rounded-full text-xs ${toggles.acc ? "bg-blue-600 text-white" : "bg-white/10 text-white/80"}`}
        >
          ACC
        </button>
      </div>
    </div>
  );
}

/** 3) Interior — vertical card stack */
function InteriorStage({ media, index, setIndex }: { media: MediaItem; index: number; setIndex: (i: number) => void }) {
  const stack = media.gallery;
  const onDragEnd = (_: any, info: { offset: { y: number }; velocity: { y: number } }) => {
    const { y } = info.offset;
    const { y: vy } = info.velocity;
    if (y < -50 || vy < -300) setIndex(Math.min(stack.length - 1, index + 1));
    if (y > 50 || vy > 300) setIndex(Math.max(0, index - 1));
  };

  return (
    <div className="relative min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh] bg-zinc-950 rounded-xl overflow-hidden">
      <div className="absolute inset-0">
        {stack.map((s, i) => {
          const depth = i - index;
          return (
            <motion.div
              key={i}
              className="absolute inset-6 rounded-2xl overflow-hidden shadow-xl bg-black"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={onDragEnd}
              initial={{ opacity: i === index ? 0.6 : 0, scale: i === index ? 0.98 : 0.96 }}
              animate={{
                opacity: i === index ? 1 : 0.25,
                scale: i === index ? 1 : 0.96,
                y: depth * 20,
                zIndex: 100 - Math.abs(depth),
              }}
              transition={{ duration: 0.25 }}
            >
              <img src={s.url} alt={s.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
                <div className="text-sm opacity-90">{s.title}</div>
                <div className="text-xs opacity-75">{s.description}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
        {stack.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
            aria-label={`Go to card ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/** 4) Quality — badge timeline + inline details */
function QualityStage({ media }: { media: MediaItem }) {
  const badges = [
    { label: "ISO 9001", copy: "Process quality and consistency." },
    { label: "J.D. Power", copy: "Long-term dependability awards." },
    { label: "Corrosion", copy: "10-year anti-perforation warranty." },
  ];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh] rounded-xl bg-zinc-950 border border-white/10 p-4">
      <div className="overflow-x-auto">
        <div className="flex gap-3">
          {badges.map((b, i) => (
            <button
              key={b.label}
              onClick={() => setOpen(i === open ? null : i)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                open === i ? "bg-amber-500 text-black" : "bg-white/10 text-white/90"
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        {media.gallery.slice(0, 2).map((g, idx) => (
          <div key={idx} className="rounded-xl overflow-hidden bg-black/60">
            <img src={g.url} alt={g.title} className="w-full h-56 object-cover" loading="lazy" />
          </div>
        ))}

        {open != null && (
          <div className="rounded-lg border border-white/10 p-3 text-white/90 bg-white/5">
            <div className="font-semibold mb-1">{badges[open].label}</div>
            <p className="text-sm">{badges[open].copy}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** 5) Technology — chip grid with progress demos */
function TechnologyStage() {
  const [active, setActive] = useState<{ [k: string]: boolean }>({});
  const items = [
    { key: "ota", name: "OTA Updates" },
    { key: "inf", name: "Infotainment" },
    { key: "conn", name: "Connectivity" },
    { key: "adas", name: "ADAS UI" },
  ];
  return (
    <div className="min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh] rounded-xl bg-zinc-950 p-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((it) => {
          const on = !!active[it.key];
          return (
            <button
              key={it.key}
              onClick={() => setActive((s) => ({ ...s, [it.key]: !on }))}
              className={`group relative overflow-hidden rounded-xl border border-white/10 p-4 text-left ${
                on ? "bg-cyan-600 text-white" : "bg-white/5 text-white/90"
              }`}
            >
              <div className="font-semibold">{it.name}</div>
              <div className="mt-3 h-2 w-full rounded bg-white/15 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: on ? "100%" : "0%" }}
                  transition={{ duration: 0.8 }}
                  className="h-2 bg-white/80"
                />
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            const keys = items.map((i) => i.key);
            let i = 0;
            const tick = () => {
              setActive((s) => ({ ...s, [keys[i]]: true }));
              i++;
              if (i < keys.length) setTimeout(tick, 550);
            };
            tick();
          }}
        >
          Play All
        </Button>
        <Button size="sm" variant="outline" onClick={() => setActive({})}>
          Reset
        </Button>
      </div>
    </div>
  );
}

/** 6) Handling — before/after compare slider */
function HandlingStage({ media }: { media: MediaItem }) {
  const left = media.gallery[0];
  const right = media.gallery[1] ?? media.gallery[0];
  const [pos, setPos] = useState(50); // percentage
  const trackRef = useRef<HTMLDivElement>(null);

  const onPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, x)));
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-black min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh]">
      <div ref={trackRef}
           className="absolute inset-0 touch-pan-y"
           onPointerDown={(e) => onPointer(e.clientX)}
           onPointerMove={(e) => e.pressure && onPointer(e.clientX)}
      >
        {/* left (base) */}
        <img src={left.url} alt={left.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        {/* right (revealed) */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={right.url} alt={right.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
        </div>
        {/* handle */}
        <div
          className="absolute top-0 bottom-0"
          style={{ left: `calc(${pos}% - 1px)` }}
        >
          <div className="w-0.5 h-full bg-white/80" />
          <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 rounded-full bg-white/90 text-black grid place-items-center shadow">
            ⇆
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex justify-between text-xs text-white/80">
        <span>{left.title}</span>
        <span>{right.title}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Modal shell (common) + variant mapping
────────────────────────────────────────── */
function Modal({
  media,
  isOpen,
  onClose,
  onBookTestDrive,
}: {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive?: () => void;
}) {
  const isMobile = useIsMobile();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!media) return;
      if (media.variant !== "interior" && media.variant !== "handling") {
        if (e.key === "ArrowRight") setIndex((i) => Math.min(media.gallery.length - 1, i + 1));
        if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, media]);

  if (!media) return null;
  const style = VARIANT_STYLES[media.variant];
  const Icon = style.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-modal-title"
            onClick={(e) => e.stopPropagation()}
            className={`${
              isMobile
                ? "fixed inset-0 bg-zinc-950"
                : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl"
            } w-full max-w-6xl mx-auto overflow-hidden`}
            initial={{ y: isMobile ? 40 : 0, scale: isMobile ? 1 : 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: isMobile ? 40 : 0, scale: isMobile ? 1 : 0.98, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <header className="h-14 px-4 lg:px-6 flex items-center justify-between bg-zinc-950 border-b border-white/10 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <Badge className={`bg-gradient-to-r ${style.accent} text-white border-0`}>
                  <Icon className="h-3.5 w-3.5 mr-1" />
                  {media.category}
                </Badge>
                <h3 id="media-modal-title" className="font-semibold truncate">
                  {media.title}
                </h3>
              </div>
              <Button variant="ghost" size="sm" className="text-white/80" onClick={onClose} aria-label="Close">
                <X className="h-5 w-5" />
              </Button>
            </header>

            {/* Body: responsive grid */}
            <div className="bg-zinc-950 text-white grid lg:grid-cols-12">
              {/* Stage */}
              <div className="lg:col-span-7 p-3 lg:p-4">
                {media.variant === "performance" && (
                  <PerformanceStage media={media} index={index} setIndex={setIndex} />
                )}
                {media.variant === "safety" && <SafetyStage media={media} />}
                {media.variant === "interior" && (
                  <InteriorStage media={media} index={index} setIndex={setIndex} />
                )}
                {media.variant === "quality" && <QualityStage media={media} />}
                {media.variant === "technology" && <TechnologyStage />}
                {media.variant === "handling" && <HandlingStage media={media} />}
              </div>

              {/* Info rail */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-white/10 p-4">
                <p className="text-sm text-white/90">{media.summary}</p>

                {/* Slide-aware details when available */}
                {media.gallery[index]?.details && (
                  <div className="mt-4 grid gap-3">
                    {media.gallery[index].details?.overview && (
                      <div>
                        <div className="uppercase text-xs tracking-wider text-white/60">Overview</div>
                        <p className="text-sm mt-1 text-white/90">
                          {media.gallery[index].details?.overview}
                        </p>
                      </div>
                    )}
                    {media.gallery[index].details?.specs && (
                      <div>
                        <div className="uppercase text-xs tracking-wider text-white/60">Specifications</div>
                        <ul className="mt-1 text-sm text-white/90 list-disc list-inside space-y-0.5">
                          {media.gallery[index].details!.specs!.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {media.gallery[index].details?.features && (
                      <div>
                        <div className="uppercase text-xs tracking-wider text-white/60">Features</div>
                        <ul className="mt-1 text-sm text-white/90 list-disc list-inside space-y-0.5">
                          {media.gallery[index].details!.features!.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {media.gallery[index].details?.tech && (
                      <div>
                        <div className="uppercase text-xs tracking-wider text-white/60">Technology</div>
                        <ul className="mt-1 text-sm text-white/90 list-disc list-inside space-y-0.5">
                          {media.gallery[index].details!.tech!.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Badges */}
                {media.badges && media.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-3">
                    {media.badges.slice(0, 6).map((b, i) => (
                      <span
                        key={i}
                        className={`text-xs px-2 py-1 rounded-full ${VARIANT_STYLES[media.variant].bg} ${VARIANT_STYLES[media.variant].text} font-medium`}
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
              <Button
                className="h-11 w-full sm:w-auto bg-[#EB0A1E] hover:bg-[#d70a19]"
                onClick={() => onBookTestDrive?.()}
              >
                <Car className="h-4 w-4 mr-2" />
                Book Test Drive
              </Button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   Grid section + filter
────────────────────────────────────────── */
interface PremiumMediaShowcaseProps {
  vehicle: VehicleModel;
  onBookTestDrive?: () => void;
}

const PremiumMediaShowcase: React.FC<PremiumMediaShowcaseProps> = ({ vehicle, onBookTestDrive }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-20%" });

  const variants = Array.from(new Set(DEMO_MEDIA.map((m) => m.variant))) as ModalVariant[];
  const [activeCategory, setActiveCategory] = useState<ModalVariant | "all">("all");
  const filtered = DEMO_MEDIA.filter((m) => activeCategory === "all" || m.variant === activeCategory);

  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaItem | null>(null);
  const openModal = (m: MediaItem) => {
    setMedia(m);
    setOpen(true);
  };

  return (
    <>
      <section ref={containerRef} id="media-showcase" className="py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 lg:mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">Discover Every Detail</h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              See the engineering, safety, and craftsmanship that define the {vehicle?.name ?? "vehicle"} experience.
            </p>
          </motion.div>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="flex flex-wrap justify-center gap-2 mb-6"
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All Features
            </button>
            {variants.map((v) => (
              <button
                key={v}
                onClick={() => setActiveCategory(v)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeCategory === v
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {VARIANT_LABELS[v]}
              </button>
            ))}
          </motion.div>

          {/* Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {filtered.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">No items match this filter.</div>
            )}

            {filtered.map((m, index) => {
              const style = VARIANT_STYLES[m.variant];
              const Icon = style.icon;
              return (
                <motion.article
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.06 * index }}
                  className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-300"
                >
                  <button
                    onClick={() => openModal(m)}
                    className="text-left w-full focus:outline-none"
                    aria-label={`Open ${m.title}`}
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={m.thumbnail}
                        alt={m.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
                      {m.kind === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-6 w-6 text-gray-900 ml-1" />
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge className={`bg-gradient-to-r ${style.accent} text-white border-0`}>
                          <Icon className="h-3.5 w-3.5 mr-1" />
                          {m.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg md:text-xl text-gray-900 group-hover:text-red-600 transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mt-1.5">{m.summary}</p>

                      {m.badges && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {m.badges.slice(0, 3).map((b, i) => (
                            <span
                              key={i}
                              className={`text-xs px-2 py-1 rounded-full ${style.bg} ${style.text} font-medium`}
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <span>
                          {m.gallery.length} image{m.gallery.length !== 1 ? "s" : ""}
                        </span>
                        <Info className="h-4 w-4" />
                      </div>
                    </div>
                  </button>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <Modal media={media} isOpen={open} onClose={() => setOpen(false)} onBookTestDrive={onBookTestDrive} />
    </>
  );
};

export default PremiumMediaShowcase;
