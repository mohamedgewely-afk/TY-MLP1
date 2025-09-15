import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useInView, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import {
  Play, X, ChevronLeft, ChevronRight, Info, Star, Shield, Zap, Heart, Wifi, Award,
  Sparkles, Gauge
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─────────────────────────────────────────────────────────
   TYPES & TOKENS
────────────────────────────────────────────────────────── */
type ModalVariant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";

interface MediaItem {
  id: string;
  category: string; // human label
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
      demo?: "scrub" | "chips" | "timeline" | "gyro";
      audioUrl?: string;
      svgOverlay?: string;
      particles?: boolean;
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

/* ─────────────────────────────────────────────────────────
   DEMO DATA (replace with your feed when wiring to CMS)
────────────────────────────────────────────────────────── */
const DEMO_MEDIA: MediaItem[] = [
  {
    id: "performance",
    category: "Performance",
    title: "V6 Twin-Turbo Engine",
    summary: "400+ horsepower, instant response, efficient cruising under all conditions.",
    kind: "image",
    variant: "performance",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Engine Architecture",
        description: "Advanced cooling system and optimized airflow design.",
        details: {
          overview: "3.5L V6 Twin-Turbo engineered for instant response and sustained performance across all driving conditions.",
          specs: ["3.5L V6 Twin-Turbo", "400+ hp", "0-60 mph in 4.2s", "Direct injection"],
          features: ["Variable Valve Timing", "Aluminum construction", "Advanced cooling"],
          tech: ["Closed-loop boost control", "Knock detection", "Thermal management"],
          demo: "scrub",
          audioUrl: "",
        },
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
        title: "Power Delivery",
        description: "Immediate torque with controlled surge through gears.",
      },
    ],
    badges: ["400+ HP", "Twin-Turbo", "Instant Response"],
  },
  {
    id: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "Camera and radar fusion for comprehensive protection.",
    kind: "image",
    variant: "safety",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Sensor Technology",
        description: "Wide FOV camera + radar with predictive coverage.",
        details: {
          overview: "PCS, LTA, ACC, BSM — tuned for UAE driving.",
          specs: ["PCS", "Lane Tracing Assist", "Adaptive Cruise Control", "Blind Spot Monitor"],
          demo: "chips",
          svgOverlay: "cones",
        },
      },
    ],
    badges: ["5-Star Safety", "TSS 2.0", "ADAS"],
  },
  {
    id: "interior",
    category: "Interior",
    title: "Premium Cabin Experience",
    summary: "Driver-focused ergonomics with premium materials.",
    kind: "image",
    variant: "interior",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Command Center",
        description: "Everything within reach; distraction minimized.",
        details: {
          overview: "Low-latency UI, memory seats, tri-zone climate.",
          specs: ['12.3" Display', "Tri-zone Climate", "Premium Audio"],
          features: ["Voice Control", "Wireless Charging", "Memory Settings"],
          demo: "timeline",
        },
      },
    ],
    badges: ['12.3" Display', "Premium Materials", "Comfort Plus"],
  },
  {
    id: "quality",
    category: "Quality",
    title: "Craftsmanship & Assurance",
    summary: "Proven durability with global certifications.",
    kind: "image",
    variant: "quality",
    thumbnail: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop",
        title: "ISO & JD Power",
        description: "Awards and long-term reliability metrics.",
        details: {
          overview: "Warranty & corrosion protection benchmarks.",
          specs: ["ISO 9001", "J.D. Power Awards", "10-year Rust Warranty"],
          demo: "timeline",
        },
      },
    ],
    badges: ["ISO", "J.D. Power", "Warranty"],
  },
  {
    id: "technology",
    category: "Technology",
    title: "Smart Connectivity",
    summary: "OTA updates, seamless infotainment, and app ecosystem.",
    kind: "image",
    variant: "technology",
    thumbnail: "https://images.unsplash.com/photo-1603481588273-0c31c4b7a52f?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?q=80&w=1600&auto=format&fit=crop",
        title: "Infotainment",
        description: "Fast UI with offline-capable maps.",
        details: {
          overview: "Modular updates & stable rollouts.",
          tech: ["OTA engine", "Edge caching", "Deep linking"],
          demo: "chips",
        },
      },
    ],
    badges: ["OTA", "App Link", "CarPlay/AA"],
  },
  {
    id: "handling",
    category: "Handling",
    title: "Adaptive Dynamics",
    summary: "Composure on curves with terrain-aware tuning.",
    kind: "image",
    variant: "handling",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1600&auto=format&fit=crop",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop",
        title: "S-Curve Control",
        description: "Predictable steering & stable load transfer.",
        details: {
          overview: "Selectable modes: Normal, Sport, Off-Road.",
          demo: "gyro",
          particles: true,
        },
      },
    ],
    badges: ["Multi-Mode", "Grip Control", "Chassis Balance"],
  },
];

/* ─────────────────────────────────────────────────────────
   SHARED UTILS
────────────────────────────────────────────────────────── */
const usePrefersReducedMotion = () => useReducedMotion();

/* A11y focus trap (lightweight) */
function useFocusTrap(active: boolean, containerRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!active || !containerRef.current) return;
    const el = containerRef.current;
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    el.addEventListener("keydown", onKey);
    first?.focus();
    return () => el.removeEventListener("keydown", onKey);
  }, [active, containerRef]);
}

/* ─────────────────────────────────────────────────────────
   VARIANT RENDERERS
   (Each returns the "Stage" content unique per variant)
────────────────────────────────────────────────────────── */

/** 1) Performance — Kinetic Gallery */
function PerformanceStage({
  media,
  currentSlide,
  setCurrentSlide,
}: {
  media: MediaItem;
  currentSlide: number;
  setCurrentSlide: (i: number) => void;
}) {
  const prefersReduced = usePrefersReducedMotion();
  const isDesktop = typeof window !== "undefined" ? window.innerWidth >= 1024 : false;
  const containerRef = useRef<HTMLDivElement>(null);

  // Hover scrub on desktop
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDesktop || prefersReduced) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(media.gallery.length - 1, Math.max(0, Math.floor(pct * media.gallery.length)));
    setCurrentSlide(idx);
  };

  // Inertial swipe on mobile
  const onDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const threshold = 50;
    const vx = info.velocity.x;
    const dx = info.offset.x;
    if (dx < -threshold || vx < -300) setCurrentSlide(Math.min(media.gallery.length - 1, currentSlide + 1));
    if (dx > threshold || vx > 300) setCurrentSlide(Math.max(0, currentSlide - 1));
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative bg-black rounded-lg overflow-hidden min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh]"
      onMouseMove={onMouseMove}
    >
      <motion.img
        key={currentSlide}
        src={media.gallery[currentSlide]?.url}
        alt={media.gallery[currentSlide]?.title || media.title}
        className="absolute inset-0 w-full h-full object-contain"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={onDragEnd}
        initial={{ opacity: 0.6, scale: prefersReduced ? 1 : 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      />
      {/* Slide index */}
      <div className="absolute top-3 right-3 text-white/80 text-xs tracking-widest">
        {String(currentSlide + 1).padStart(2, "0")}/{String(media.gallery.length).padStart(2, "0")}
      </div>
      {/* Subtle torque line */}
      {!prefersReduced && (
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-red-600/0 via-red-600/60 to-red-600/0"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2 }}
        />
      )}
    </motion.div>
  );
}

/** 2) Safety — Radar Split (image + radar canvas) */
function SafetyStage({ media }: { media: MediaItem }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [chips, setChips] = useState({ pcs: true, lta: false, acc: false });
  const toggle = (k: keyof typeof chips) => setChips((s) => ({ ...s, [k]: !s[k] }));

  useEffect(() => {
    if (prefersReduced) return;

    let raf = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.scale(DPR, DPR);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // grid rings
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth = 1;
      const cx = w * 0.5;
      const cy = h * 0.5;
      for (let r = 40; r < Math.min(w, h) / 1.5; r += 40) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // sweep
      const angle = (t % 360) * (Math.PI / 180);
      const len = Math.min(w, h) * 0.45;
      const x2 = cx + Math.cos(angle) * len;
      const y2 = cy + Math.sin(angle) * len;

      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, len);
      grd.addColorStop(0, "rgba(80,160,255,0.18)");
      grd.addColorStop(1, "rgba(80,160,255,0.0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, len, angle - 0.35, angle + 0.35);
      ctx.closePath();
      ctx.fill();

      // blips
      const enabled = [
        chips.pcs && { x: cx + 110, y: cy - 20 },
        chips.acc && { x: cx + 40, y: cy + 140 },
        chips.lta && { x: cx - 120, y: cy - 60 },
      ].filter(Boolean) as Array<{ x: number; y: number }>;
      enabled.forEach(({ x, y }) => {
        ctx.fillStyle = "rgba(120,200,255,0.9)";
        ctx.beginPath();
        ctx.arc(x, y, 4 + 2 * Math.sin(t / 10), 0, Math.PI * 2);
        ctx.fill();
      });

      t += 1.5;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [chips, prefersReduced]);

  return (
    <div className="grid grid-rows-[auto_240px] lg:grid-rows-1 lg:grid-cols-2 gap-3 min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh]">
      <div className="relative rounded-lg overflow-hidden bg-black">
        <img
          src={media.gallery[0]?.url}
          alt={media.gallery[0]?.title || media.title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="relative rounded-lg overflow-hidden bg-zinc-900 border border-white/10">
        <canvas ref={canvasRef} className="w-full h-full" />
        <div className="absolute top-3 left-3 flex gap-2">
          <button
            onClick={() => toggle("pcs")}
            className={`px-3 py-1 rounded-full text-xs ${chips.pcs ? "bg-blue-600 text-white" : "bg-white/10 text-white/80"}`}
          >
            PCS
          </button>
          <button
            onClick={() => toggle("lta")}
            className={`px-3 py-1 rounded-full text-xs ${chips.lta ? "bg-blue-600 text-white" : "bg-white/10 text-white/80"}`}
          >
            LTA
          </button>
          <button
            onClick={() => toggle("acc")}
            className={`px-3 py-1 rounded-full text-xs ${chips.acc ? "bg-blue-600 text-white" : "bg-white/10 text-white/80"}`}
          >
            ACC
          </button>
        </div>
      </div>
    </div>
  );
}

/** 3) Interior — Card Stack / Tilt */
function InteriorStage({ media }: { media: MediaItem }) {
  const prefersReduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const stack = media.gallery;

  // Tilt via pointer (fallback when device motion denied)
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent) => {
    if (prefersReduced) return;
    const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: px * 6, y: -py * 6 });
  };

  useEffect(() => {
    let off = () => {};
    if (!prefersReduced && typeof window !== "undefined") {
      const handler = (e: DeviceOrientationEvent) => {
        const beta = (e.beta ?? 0) / 90; // -1..1
        const gamma = (e.gamma ?? 0) / 90;
        setTilt({ x: gamma * 6, y: beta * 6 });
      };
      window.addEventListener("deviceorientation", handler);
      off = () => window.removeEventListener("deviceorientation", handler);
    }
    return off;
  }, [prefersReduced]);

  const onDragEnd = (_: any, info: { offset: { y: number }; velocity: { y: number } }) => {
    const threshold = 50;
    const dy = info.offset.y;
    const vy = info.velocity.y;
    if (dy < -threshold || vy < -300) setIndex((i) => Math.min(stack.length - 1, i + 1));
    if (dy > threshold || vy > 300) setIndex((i) => Math.max(0, i - 1));
  };

  return (
    <div
      className="relative min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh] bg-gradient-to-b from-zinc-950 to-zinc-900 rounded-xl overflow-hidden"
      onMouseMove={onMove}
    >
      <div className="absolute inset-0 perspective-[1200px]">
        {stack.map((s, i) => {
          const depth = i - index;
          return (
            <motion.div
              key={i}
              className="absolute inset-8 rounded-2xl overflow-hidden shadow-2xl"
              style={{
                transformStyle: "preserve-3d",
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              onDragEnd={onDragEnd}
              initial={{ opacity: i === index ? 0.6 : 0, scale: i === index ? 0.98 : 0.96 }}
              animate={{
                opacity: i === index ? 1 : 0.25,
                scale: i === index ? 1 : 0.96,
                rotateX: prefersReduced ? 0 : tilt.y * (i === index ? 1 : 0.5),
                rotateY: prefersReduced ? 0 : tilt.x * (i === index ? 1 : 0.5),
                zIndex: 100 - Math.abs(depth),
                y: depth * 24,
              }}
              transition={{ type: "spring", stiffness: 220, damping: 24 }}
            >
              <img src={s.url} alt={s.title} className="w-full h-full object-cover" loading="lazy" />
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

/** 4) Quality — Badge Timeline (scrollable chips + expandable sheet) */
function QualityStage({ media }: { media: MediaItem }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const badges = [
    { label: "ISO 9001", copy: "Process quality and consistency across plants." },
    { label: "J.D. Power", copy: "Long-term dependability awards." },
    { label: "Corrosion", copy: "10-year anti-perforation warranty." },
  ];
  return (
    <div className="min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh] rounded-xl bg-zinc-950 border border-white/10 p-4">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex gap-3">
          {badges.map((b, i) => (
            <button
              key={b.label}
              onClick={() => setOpenIdx(i === openIdx ? null : i)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                openIdx === i ? "bg-amber-500 text-black" : "bg-white/10 text-white/90"
              }`}
            >
              <Sparkles className="inline h-4 w-4 mr-1" />
              {b.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-4">
        {media.gallery.slice(0, 2).map((g, idx) => (
          <div key={idx} className="rounded-xl overflow-hidden bg-black/60">
            <img src={g.url} alt={g.title} className="w-full h-56 object-cover" loading="lazy" />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {openIdx != null && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-xl rounded-t-2xl bg-zinc-900 border-t border-white/10 p-4"
          >
            <div className="flex items-center justify-between text-white">
              <div className="font-semibold">{badges[openIdx].label}</div>
              <Button size="sm" variant="ghost" className="text-white/80" onClick={() => setOpenIdx(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-white/80">{badges[openIdx].copy}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 5) Technology — Chip Grid Demo (SVG line draw) */
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
              {/* micro demo: line draw */}
              <svg viewBox="0 0 120 40" className="mt-2 w-full h-14">
                <motion.path
                  d="M5 30 L30 10 L55 25 L80 12 L110 28"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: on ? 1 : 0 }}
                  transition={{ duration: 0.9 }}
                />
              </svg>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          size="sm"
          onClick={() => {
            // play all sequence
            const keys = items.map((i) => i.key);
            let i = 0;
            const tick = () => {
              setActive((s) => ({ ...s, [keys[i]]: true }));
              i++;
              if (i < keys.length) setTimeout(tick, 650);
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

/** 6) Handling — Gyro Curve (tilt or keyboard) */
function HandlingStage({ media }: { media: MediaItem }) {
  const prefersReduced = usePrefersReducedMotion();
  const [mode, setMode] = useState<"Normal" | "Sport" | "Off-Road">("Normal");
  const [tVal, setTVal] = useState(0.5); // 0..1 along path
  const [fpsOK, setFpsOK] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setTVal((v) => Math.max(0, v - 0.03));
      if (e.key === "ArrowRight") setTVal((v) => Math.min(1, v + 0.03));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;
    let last = performance.now();
    let frames = 0;
    let raf = 0;
    const loop = (now: number) => {
      frames++;
      if (now - last >= 1000) {
        setFpsOK(frames >= 45);
        frames = 0;
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [prefersReduced]);

  useEffect(() => {
    if (prefersReduced) return;
    const handler = (e: DeviceOrientationEvent) => {
      const gamma = (e.gamma ?? 0) / 45; // -1..1
      setTVal((v) => {
        const next = v + gamma * 0.01;
        return Math.min(1, Math.max(0, next));
      });
    };
    window.addEventListener("deviceorientation", handler);
    return () => window.removeEventListener("deviceorientation", handler);
  }, [prefersReduced]);

  // Simple S-curve param
  const point = useMemo(() => {
    const t = tVal;
    const x = t;
    const y = 0.5 + 0.35 * Math.sin((t - 0.5) * Math.PI * 2);
    return { x, y };
  }, [tVal]);

  const particleOn = media.gallery[0]?.details?.particles && fpsOK && !prefersReduced && mode === "Off-Road";

  return (
    <div className="relative min-h-[52vh] md:min-h-[56vh] lg:min-h-[60vh] rounded-xl bg-gradient-to-b from-zinc-950 to-zinc-900 p-4">
      <div className="flex gap-2 mb-3">
        {(["Normal", "Sport", "Off-Road"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1 rounded-full text-xs ${
              mode === m ? "bg-emerald-600 text-white" : "bg-white/10 text-white/80"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <svg viewBox="0 0 100 60" className="w-full h-60 bg-black/40 rounded-lg border border-white/10">
        {/* S-curve */}
        <path
          d="M5 30 C 25 5, 45 55, 65 30 S 95 5, 95 30"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1.5"
        />
        {/* Marker */}
        <circle
          cx={5 + point.x * 90}
          cy={30 + (point.y - 0.5) * 30}
          r="2.5"
          fill="white"
        />
        {/* Grip rings (mode) */}
        <g opacity={0.5}>
          <circle cx={5 + point.x * 90} cy={30 + (point.y - 0.5) * 30} r={mode === "Sport" ? 6 : 4} stroke="white" fill="none" />
        </g>
      </svg>

      {/* Particles */}
      {particleOn && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 bg-white/60 rounded-full"
              initial={{ opacity: 0, x: Math.random() * window.innerWidth, y: Math.random() * 50 + 200 }}
              animate={{ opacity: [0, 1, 0], y: ["0%", "-40%"] }}
              transition={{ duration: 1.2 + Math.random(), repeat: Infinity, repeatDelay: Math.random() * 1.5 }}
            />
          ))}
        </div>
      )}
      <div className="mt-3 text-xs text-white/60 flex items-center gap-2">
        <Gauge className="h-4 w-4" />
        Tilt phone or use ← → keys to steer.
        {!fpsOK && <span className="ml-2 text-amber-400">Low FPS detected — effects reduced.</span>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MODAL ROOT (common shell + variant mapping)
────────────────────────────────────────────────────────── */
function ModalRoot({
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
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(isOpen, containerRef);

  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentSlide(0);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!media) return null;

  const style = VARIANT_STYLES[media.variant];
  const Icon = style.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/70"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            ref={containerRef}
            className={`${
              isMobile
                ? "fixed inset-0 mt-auto bg-zinc-950"
                : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            } w-full max-w-6xl mx-auto rounded-none lg:rounded-2xl overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: isMobile ? 40 : 0, scale: isMobile ? 1 : 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: isMobile ? 40 : 0, scale: isMobile ? 1 : 0.96, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <header className="h-14 px-4 lg:px-6 flex items-center justify-between bg-zinc-950 border-b border-white/10 text-white">
              <div className="flex items-center gap-2 min-w-0">
                <Badge className={`bg-gradient-to-r ${style.accent} text-white border-0`}>
                  <Icon className="h-3.5 w-3.5 mr-1" />
                  {media.category}
                </Badge>
                <h3 id="modal-title" className="font-bold truncate">{media.title}</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-white/80" onClick={onClose} aria-label="Close">
                <X className="h-5 w-5" />
              </Button>
            </header>

            {/* Body: responsive layout */}
            <div className="bg-zinc-950 text-white grid lg:grid-cols-12">
              <div className="lg:col-span-7 p-3 lg:p-4">
                {/* Stage per variant */}
                {media.variant === "performance" && (
                  <PerformanceStage media={media} currentSlide={currentSlide} setCurrentSlide={setCurrentSlide} />
                )}
                {media.variant === "safety" && <SafetyStage media={media} />}
                {media.variant === "interior" && <InteriorStage media={media} />}
                {media.variant === "quality" && <QualityStage media={media} />}
                {media.variant === "technology" && <TechnologyStage />}
                {media.variant === "handling" && <HandlingStage media={media} />}
              </div>

              {/* Info rail (desktop) or expandable (mobile) */}
              <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-white/10 p-4">
                <div className="text-white/90 text-sm">{media.summary}</div>

                {/* Details (from current slide where applicable) */}
                {media.gallery[currentSlide]?.details && (
                  <div className="mt-4 grid gap-3">
                    {media.gallery[currentSlide].details?.overview && (
                      <div>
                        <div className="uppercase text-xs tracking-wider text-white/60">Overview</div>
                        <p className="text-sm mt-1 text-white/90">
                          {media.gallery[currentSlide].details?.overview}
                        </p>
                      </div>
                    )}
                    {media.gallery[currentSlide].details?.specs && (
                      <div>
                        <div className="uppercase text-xs tracking-wider text-white/60">Specifications</div>
                        <ul className="mt-1 text-sm text-white/90 list-disc list-inside space-y-0.5">
                          {media.gallery[currentSlide].details?.specs?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {media.gallery[currentSlide].details?.features && (
                      <div>
                        <div className="uppercase text-xs tracking-wider text-white/60">Features</div>
                        <ul className="mt-1 text-sm text-white/90 list-disc list-inside space-y-0.5">
                          {media.gallery[currentSlide].details?.features?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {media.gallery[currentSlide].details?.tech && (
                      <div>
                        <div className="uppercase text-xs tracking-wider text-white/60">Technology</div>
                        <ul className="mt-1 text-sm text-white/90 list-disc list-inside space-y-0.5">
                          {media.gallery[currentSlide].details?.tech?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
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
                Book Test Drive
              </Button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN SECTION (GRID + OPEN MODAL)
────────────────────────────────────────────────────────── */
interface PremiumMediaShowcaseProProps {
  vehicle: VehicleModel;
  onBookTestDrive?: () => void;
}

const PremiumMediaShowcasePro: React.FC<PremiumMediaShowcaseProProps> = ({ vehicle, onBookTestDrive }) => {
  const isMobile = useIsMobile();
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
              Explore the engineering, safety, and craftsmanship that define the {vehicle?.name ?? "vehicle"} experience.
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
                            <span key={i} className={`text-xs px-2 py-1 rounded-full ${style.bg} ${style.text} font-medium`}>
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
      <ModalRoot
        media={media}
        isOpen={open}
        onClose={() => setOpen(false)}
        onBookTestDrive={onBookTestDrive}
      />
    </>
  );
};

export default PremiumMediaShowcasePro;
