// src/components/vehicle-details/VehicleMediaShowcase.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { VehicleModel } from "@/types/vehicle";

/* =============== Brand tokens =============== */
const TOK = {
  red: "#EB0A1E",
  ring: "focus:outline-none focus:ring-2 focus:ring-red-500",
  card: "bg-white shadow-sm border border-zinc-100",
  radius: "rounded-2xl",
  muted: "text-zinc-500",
};

/* =============== Types =============== */
type DetailBlock = { overview?: string; specs?: string[]; features?: string[]; tech?: string[] };
type Slide = { url: string; title: string; description?: string; details?: DetailBlock };

/** Variant styles (used to give each modal a distinct accent) */
type Variant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";
type VariantStyle = { accent: string; stripe?: boolean };
const VARIANT: Record<Variant, VariantStyle> = {
  performance: { accent: "text-red-600", stripe: true },
  safety: { accent: "text-blue-700" },
  interior: { accent: "text-amber-700" },
  quality: { accent: "text-zinc-700" },
  technology: { accent: "text-cyan-700" },
  handling: { accent: "text-rose-700" },
};

type MediaItem = {
  id: string;
  category: string;
  title: string;
  summary: string;
  kind: "image" | "video";
  thumbnail: string;
  gallery: Slide[];
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  badges?: string[];
  variant: Variant; // <- important for unique accent
};

/* =============== Utils =============== */
const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

/** DAM-only safe <img>, shows inline placeholder if src errors */
const ImageSafe: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, className, ...rest }) => {
  const [err, setErr] = useState(!src);
  if (!src || err) {
    return (
      <div className={cx("grid place-items-center bg-zinc-100 text-[11px] text-zinc-400", className)}>
        Image unavailable
      </div>
    );
  }
  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErr(true)}
      className={cx("block", className)}
    />
  );
};

/** Wistia iframe embed (no custom element; safer in sandboxes) */
const WistiaEmbed: React.FC<{ id: string; aspect?: number; autoPlay?: boolean; muted?: boolean; className?: string }> = ({
  id,
  aspect = 16 / 9,
  autoPlay,
  muted,
  className,
}) => {
  const qs = new URLSearchParams({
    seo: "false",
    videoFoam: "true",
    autoplay: autoPlay ? "true" : "false",
    muted: muted ? "true" : "false",
    controlsVisibleOnLoad: "true",
  }).toString();
  return (
    <div className={cx("relative w-full overflow-hidden", className)} style={{ aspectRatio: `${aspect}` }}>
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://fast.wistia.net/embed/iframe/${id}?${qs}`}
        title="Wistia video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

/* =============== Demo media (all DAM) =============== */
const DEMO: MediaItem[] = [
  {
    id: "v6",
    category: "Performance",
    title: "V6 Twin-Turbo",
    summary: "400+ hp, broad torque band, efficient cruising.",
    kind: "image",
    variant: "performance",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Cooling Strategy",
        description: "Dual-path cooling keeps temps stable under load.",
        details: {
          overview: "3.5L V6 TT engineered for instant response and sustained performance.",
          specs: ["3.5L V6 TT", "400+ hp", "0–60 in 4.2s"],
          features: ["Direct injection", "VVT", "Aluminum block"],
          tech: ["Closed-loop boost", "Knock learning", "Smart thermal mgmt"],
        },
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
        title: "Turbo Detail",
        description: "Low-inertia turbines widen usable torque.",
        details: { specs: ["VGT turbines", "Low-mass impellers"], features: ["Wider band", "Low lag"], tech: ["Charge-air cooling"] },
      },
    ],
    badges: ["3.5L V6 TT", "400+ hp", "Instant response"],
  },
  {
    id: "interior",
    category: "Interior",
    title: "Driver-Focused Cabin",
    summary: "Premium materials, intuitive controls, low distraction.",
    kind: "image",
    variant: "interior",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/561ac4b4-3604-4e66-ae72-83e2969d7d65/items/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
        title: "Center Console",
        description: "Clear haptics with storage within reach.",
        details: {
          overview: "Ergonomics tuned for clarity, reach, and minimal eye-off-road time.",
          specs: ['12.3" display', "Tri-zone climate"],
          features: ["Voice control", "Wireless charging"],
          tech: ["Low-latency HMI", "OTA themes"],
        },
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
        title: "Seating",
        description: "Supportive geometry; ventilation; memory.",
        details: { specs: ["Heated/ventilated", "Multi-way adjust"], features: ["Memory", "Lumbar"] },
      },
    ],
    badges: ['12.3" display', "Comfort"],
  },
  {
    id: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "Camera+radar fusion, assistance when you need it.",
    kind: "video",
    variant: "safety",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    video: { provider: "wistia", id: "kvdhnonllm", autoplay: true },
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Sensors",
        description: "Wide FOV camera and radar coverage.",
        details: { overview: "ADAS suite: PCS, LTA, ACC, BSM.", specs: ["PCS", "LTA", "ACC", "BSM"] },
      },
    ],
    badges: ["PCS", "LTA", "ACC"],
  },
  {
    id: "handling",
    category: "Performance",
    title: "Chassis Dynamics",
    summary: "Adaptive damping and precise control.",
    kind: "image",
    variant: "handling",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Adaptive Dampers",
        description: "Millisecond-level response for composure.",
        details: { specs: ["Active dampers", "Torque vectoring"], features: ["AWD grip", "Drive modes"] },
      },
    ],
    badges: ["AWD", "Sport mode"],
  },
  {
    id: "quality",
    category: "Quality",
    title: "Build Quality",
    summary: "High-strength materials and precise assembly.",
    kind: "image",
    variant: "quality",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
        title: "Materials",
        description: "Premium substrates and coatings.",
        details: { specs: ["HS steel", "Multi-stage paint"], features: ["Laser gap checks", "Robotic assembly"] },
      },
    ],
    badges: ["Durability", "Refinement"],
  },
  {
    id: "connect",
    category: "Technology",
    title: "Connected Services",
    summary: "CarPlay/Android Auto, OTA updates.",
    kind: "image",
    variant: "technology",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
        title: "Infotainment",
        details: { specs: ["Apple CarPlay", "Android Auto", "Wi-Fi hotspot"], tech: ["Cloud services", "OTA"] },
      },
    ],
    badges: ["CarPlay", "OTA"],
  },
];

/* =============== Props =============== */
interface Props {
  vehicle: VehicleModel;
}

/* =============== Component =============== */
const VehicleMediaShowcase: React.FC<Props> = ({ vehicle }) => {
  // Exactly 6 tiles (stable order)
  const items = useMemo<MediaItem[]>(() => DEMO.slice(0, 6), [vehicle]);
  const topWistiaId = "kvdhnonllm";

  /* ---------- Modal state ---------- */
  const [open, setOpen] = useState<MediaItem | null>(null);
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);

  const hasVideo = !!open?.video;
  const slides = open?.gallery ?? [];
  const visualIsVideo = hasVideo && idx === 0;
  const slide = !visualIsVideo ? slides[hasVideo ? idx - 1 : idx] : null;

  const next = useCallback(() => {
    if (!open) return;
    const total = slides.length + (hasVideo ? 1 : 0);
    setIdx((p) => (p + 1) % Math.max(1, total));
  }, [open, slides.length, hasVideo]);

  const prev = useCallback(() => {
    if (!open) return;
    const total = slides.length + (hasVideo ? 1 : 0);
    setIdx((p) => (p - 1 + Math.max(1, total)) % Math.max(1, total));
  }, [open, slides.length, hasVideo]);

  /* Keyboard navigation */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, prev]);

  /* Swipe (mobile) */
  const tStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (tStart.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (tStart.current == null) return;
    const dx = e.changedTouches[0].clientX - tStart.current;
    if (dx > 40) prev();
    if (dx < -40) next();
    tStart.current = null;
  };

  /* CTA bridge: open main booking without touching VehicleDetails.tsx */
  const openBooking = () => {
    try {
      window.dispatchEvent(new CustomEvent("open-booking", { detail: { source: "VehicleMediaShowcase" } }));
      (document.querySelector("[data-open-booking]") as HTMLButtonElement | null)?.click();
    } catch {}
  };

  /* Mobile carousel state (indicator dots) */
  const mobWrapRef = useRef<HTMLDivElement>(null);
  const [mobIndex, setMobIndex] = useState(0);
  useEffect(() => {
    const el = mobWrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = (el.firstElementChild as HTMLElement | null)?.clientWidth || 1;
      const gap = 16;
      setMobIndex(Math.round(el.scrollLeft / (w + gap)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* Thumbnail robustness: if a DAM thumb fails, fallback to first gallery image */
  const thumbOf = (m: MediaItem) => (m.thumbnail || m.gallery[0]?.url || "");

  /* Variant style (for unique modal accents) */
  const variant: VariantStyle | undefined = open ? VARIANT[open.variant] : undefined;

  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-6">
      {/* ======= Top video (not fullscreen on desktop) ======= */}
      <div className={cx(TOK.card, TOK.radius, "p-3 md:p-4 mb-8")}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-sm font-semibold px-3 py-1 bg-zinc-100 rounded-full">Video</span>
          <h2 className="text-2xl md:text-3xl font-bold">Highlights</h2>
        </div>
        <WistiaEmbed id={topWistiaId} aspect={16 / 9} muted autoPlay className="rounded-xl overflow-hidden" />
      </div>

      {/* ======= Mobile: horizontal carousel (stable width) ======= */}
      <div className="md:hidden mb-6">
        <div
          ref={mobWrapRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 pb-2"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setOpen(m);
                setIdx(0);
                setZoom(false);
              }}
              className={cx(
                TOK.card,
                TOK.radius,
                TOK.ring,
                "snap-center basis-[85%] shrink-0 grow-0 text-left overflow-hidden"
              )}
            >
              <div className="relative">
                <ImageSafe src={thumbOf(m)} alt={m.title} className="w-full h-44 object-cover" />
                <div className="absolute top-0 left-0 h-1" style={{ width: 72, background: TOK.red, borderTopLeftRadius: 12 }} />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100">{m.category}</span>
                  {m.badges?.slice(0, 2).map((b) => (
                    <span key={b} className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-200">
                      {b}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-semibold">{m.title}</h3>
                <p className={cx("text-sm mt-1", TOK.muted)}>{m.summary}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-2">
          {items.map((_, i) => (
            <span
              key={i}
              className={cx("h-1.5 w-1.5 rounded-full", i === mobIndex ? "" : "bg-zinc-300")}
              style={{ background: i === mobIndex ? TOK.red : undefined }}
            />
          ))}
        </div>
      </div>

      {/* ======= Desktop: 3x grid ======= */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setOpen(m);
              setIdx(0);
              setZoom(false);
            }}
            className={cx(TOK.card, TOK.radius, TOK.ring, "text-left overflow-hidden hover:shadow-md transition-shadow")}
          >
            <div className="relative">
              <ImageSafe src={thumbOf(m)} alt={m.title} className="w-full h-56 md:h-64 object-cover" />
              <div className="absolute top-0 left-0 h-1" style={{ background: TOK.red, width: 82, borderTopLeftRadius: 12 }} />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100">{m.category}</span>
                {m.badges?.slice(0, 3).map((b) => (
                  <span key={b} className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-200">
                    {b}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold">{m.title}</h3>
              <p className={cx("text-sm mt-1", TOK.muted)}>{m.summary}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ======= Modal ======= */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-0 md:p-6"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={cx(
              "bg-white w-full h-[100svh] md:h-[92vh] md:max-w-[1300px] md:rounded-2xl overflow-hidden",
              "flex flex-col"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 px-3 md:px-6 py-3 border-b bg-white/95 backdrop-blur">
              <div className="relative flex items-center
