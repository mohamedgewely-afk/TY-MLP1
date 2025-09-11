// src/components/vehicle-details/VehicleMediaShowcase.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { VehicleModel } from "@/types/vehicle";

/* ---------------- Toyota accents & helpers ---------------- */
const TOK = {
  red: "#EB0A1E",
  muted: "text-zinc-500",
  card: "bg-white border border-zinc-100",
  radius: "rounded-2xl",
};
const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

/* Fallback SVG (never blank) */
const FALLBACK_SVG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#f4f4f5'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-family='system-ui' font-size='14'>Image unavailable</text></svg>`
  );

/* ---------------- Safe image (DAM-only) ---------------- */
const ImageSafe: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { fallbackSrc?: string; fit?: "contain" | "cover" }
> = ({ src, alt, className, fallbackSrc, fit = "cover", ...rest }) => {
  const [err, setErr] = useState(!src);
  const resolved = !err ? src : fallbackSrc || FALLBACK_SVG;
  return (
    <img
      {...rest}
      src={resolved}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setErr(true)}
      className={cx("block w-full h-full", fit === "cover" ? "object-cover" : "object-contain", className)}
    />
  );
};

/* ---------------- Wistia (iframe, reliable) ---------------- */
const WistiaEmbed: React.FC<{ id: string; aspect?: number; autoPlay?: boolean; muted?: boolean; className?: string }> = ({
  id,
  aspect = 16 / 9,
  autoPlay = true,
  muted = true,
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
    <div className={cx("relative w-full overflow-hidden", className)} style={{ aspectRatio: String(aspect) }}>
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

/* ---------------- Content model ---------------- */
type DetailBlock = { overview?: string; specs?: string[]; features?: string[]; tech?: string[] };
type Hotspot = { x: number; y: number; label: string; body?: string };
type Slide = { url: string; title: string; description?: string; details?: DetailBlock; hotspots?: Hotspot[] };
type Variant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";

type MediaItem = {
  id: string;
  variant: Variant;
  category: string;
  title: string;
  summary: string;
  kind: "image" | "video";
  thumbnail: string;
  gallery: Slide[];
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  badges?: string[];
};

/* ---------------- Demo data (all DAM) ---------------- */
const ITEMS: MediaItem[] = [
  {
    id: "perf",
    variant: "performance",
    category: "Performance",
    title: "V6 Twin-Turbo",
    summary: "400+ hp, broad torque band, efficient cruising.",
    kind: "image",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Cooling Strategy",
        description: "Dual-path cooling keeps temps stable under load.",
        details: {
          overview: "3.5L V6 TT optimized for instant response and sustained performance.",
          specs: ["3.5L V6 TT", "400+ hp", "0–60 in 4.2s"],
          features: ["Direct injection", "VVT", "Aluminum block"],
          tech: ["Closed-loop boost", "Knock learning", "Smart thermal mgmt"],
        },
        hotspots: [
          { x: 22, y: 35, label: "Charge cooler", body: "Low temp circuit for intake air." },
          { x: 76, y: 48, label: "VGT", body: "Variable geometry turbines minimize lag." },
        ],
      },
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
        title: "Turbo Detail",
        description: "Low-inertia turbines widen usable torque.",
        details: { specs: ["VGT turbines", "Low-mass impellers"], features: ["Wider band", "Low lag"], tech: ["Charge-air cooling"] },
      },
    ],
    badges: ["400+ hp", "Instant response"],
  },
  {
    id: "safe",
    variant: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "Camera+radar fusion, assistance when you need it.",
    kind: "video",
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
    id: "int",
    variant: "interior",
    category: "Interior",
    title: "Driver-Focused Cabin",
    summary: "Premium materials, intuitive controls, low distraction.",
    kind: "image",
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
    id: "qual",
    variant: "quality",
    category: "Quality",
    title: "Build Quality",
    summary: "High-strength materials and precise assembly.",
    kind: "image",
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
    id: "tech",
    variant: "technology",
    category: "Technology",
    title: "Connected Services",
    summary: "CarPlay/Android Auto, OTA updates.",
    kind: "image",
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
  {
    id: "hand",
    variant: "handling",
    category: "Performance",
    title: "Chassis Dynamics",
    summary: "Adaptive damping and precise control.",
    kind: "image",
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
];

/* ---------------- Props ---------------- */
interface Props {
  vehicle: VehicleModel;
}

/* ---------------- Helpers: paging (no vertical scroll) ---------------- */
const slicePage = <T,>(list: T[] | undefined, page: number, perPage: number) => {
  if (!list || list.length === 0) return [];
  const start = page * perPage;
  return list.slice(start, start + perPage);
};

const useBodyLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [locked]);
};

/* ---------------- Variant widgets (distinct looks) ---------------- */
const KpiChip: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-xl border px-3 py-2 text-center">
    <div className="text-[11px] text-zinc-500">{label}</div>
    <div className="text-sm font-semibold">{value}</div>
  </div>
);

const Checklist: React.FC<{ items: string[] }> = ({ items }) => {
  const [active, setActive] = useState<Record<string, boolean>>({});
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => {
        const on = !!active[t];
        return (
          <button
            key={t}
            onClick={() => setActive((s) => ({ ...s, [t]: !on }))}
            className={cx(
              "px-3 py-1.5 rounded-full border text-sm",
              on ? "bg-green-600 text-white border-green-600" : "hover:bg-zinc-100"
            )}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
};

const Swatches: React.FC<{ images: string[]; active?: string; onPick: (u: string) => void }> = ({ images, active, onPick }) => (
  <div className="flex gap-2 overflow-x-auto">
    {images.slice(0, 6).map((u) => (
      <button
        key={u}
        onClick={() => onPick(u)}
        className={cx("h-12 w-16 rounded-md border overflow-hidden", active === u ? "ring-2 ring-red-500" : "")}
      >
        <ImageSafe src={u} alt="swatch" className="h-full w-full object-cover" />
      </button>
    ))}
  </div>
);

const Timeline: React.FC<{ steps: string[] }> = ({ steps }) => {
  const [i, setI] = useState(0);
  return (
    <div className="flex items-center gap-3">
      {steps.map((s, idx) => (
        <React.Fragment key={s}>
          <button
            onClick={() => setI(idx)}
            className={cx(
              "text-sm font-medium px-2 py-1 rounded",
              i === idx ? "bg-zinc-900 text-white" : "hover:bg-zinc-100"
            )}
          >
            {s}
          </button>
          {idx < steps.length - 1 && <div className="h-px w-6 bg-zinc-300" />}
        </React.Fragment>
      ))}
    </div>
  );
};

const Tiles: React.FC<{ items: string[]; mode?: string; onMode?: (m: string) => void }> = ({ items }) => (
  <div className="grid grid-cols-2 gap-2">
    {items.map((t) => (
      <div key={t} className="rounded-xl border px-3 py-3 text-sm">{t}</div>
    ))}
  </div>
);

const ModePills: React.FC<{ modes: string[]; active: string; onChange: (m: string) => void }> = ({ modes, active, onChange }) => (
  <div className="flex gap-2">
    {modes.map((m) => (
      <button
        key={m}
        onClick={() => onChange(m)}
        className={cx(
          "px-3 py-1.5 rounded-full border text-sm",
          active === m ? "bg-zinc-900 text-white border-zinc-900" : "hover:bg-zinc-100"
        )}
      >
        {m}
      </button>
    ))}
  </div>
);

/* For performance modal: hotspot bubble */
const HotBubble: React.FC<{ x: number; y: number; label: string; body?: string; onClose: () => void }> = ({
  x,
  y,
  label,
  body,
  onClose,
}) => (
  <div
    className="absolute z-20 max-w-[220px] bg-white border rounded-xl shadow p-3 text-xs"
    style={{ left: `calc(${x}% + 8px)`, top: `calc(${y}% - 8px)` }}
  >
    <div className="flex items-center justify-between gap-3 mb-1">
      <strong className="text-zinc-800">{label}</strong>
      <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600">×</button>
    </div>
    <div className="text-zinc-600">{body}</div>
  </div>
);

/* Variant registry */
const VARIANT = {
  performance: {
    accent: "text-red-600",
    stripe: true,
  },
  safety: { accent: "text-blue-700" },
  interior: { accent: "text-amber-700" },
  quality: { accent: "text-zinc-700" },
  technology: { accent: "text-cyan-700" },
  handling: { accent: "text-rose-700" },
} as const;

/* ---------------- Responsive hook (no external dep) ---------------- */
const useIsMobile = () => {
  const [m, setM] = useState<boolean>(() => (typeof window !== "undefined" ? window.innerWidth < 768 : false));
  useEffect(() => {
    const onR = () => setM(window.innerWidth < 768);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return m;
};

/* ---------------- Component ---------------- */
const VehicleMediaShowcase: React.FC<{ vehicle: VehicleModel }> = ({ vehicle }) => {
  const items = useMemo(() => ITEMS.slice(0, 6), [vehicle]);
  const isMobile = useIsMobile();

  /* Modal state */
  const [open, setOpen] = useState<MediaItem | null>(null);
  const [idx, setIdx] = useState(0); // 0 = video (if exists)
  const [tab, setTab] = useState<"overview" | "specs" | "features" | "tech">("overview");
  const [page, setPage] = useState(0);
  const [mode, setMode] = useState("Normal");
  const [hot, setHot] = useState<number | null>(null);

  useBodyLock(!!open);

  const hasVideo = !!open?.video;
  const slides = open?.gallery ?? [];
  const isVideoFrame = hasVideo && idx === 0;
  const slide = !isVideoFrame ? slides[hasVideo ? idx - 1 : idx] : undefined;
  const variant = open ? VARIANT[open.variant] : null;

  const resetModal = (m: MediaItem) => {
    setOpen(m);
    setIdx(0);
    setTab("overview");
    setPage(0);
    setMode("Normal");
    setHot(null);
  };

  /* Swipe with angle guard */
  const tStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    tStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!tStart.current) return;
    const dx = e.changedTouches[0].clientX - tStart.current.x;
    const dy = e.changedTouches[0].clientY - tStart.current.y;
    const angle = Math.abs(Math.atan2(dy, dx) * (180 / Math.PI));
    if (Math.abs(dx) > 40 && (angle < 35 || angle > 145)) {
      dx > 0 ? prev() : next();
    }
    tStart.current = null;
  };

  const next = useCallback(() => {
    if (!open) return;
    const total = slides.length + (hasVideo ? 1 : 0);
    setIdx((p) => (p + 1) % Math.max(1, total));
    setPage(0);
    setHot(null);
  }, [open, slides.length, hasVideo]);

  const prev = useCallback(() => {
    if (!open) return;
    const total = slides.length + (hasVideo ? 1 : 0);
    setIdx((p) => (p - 1 + Math.max(1, total)) % Math.max(1, total));
    setPage(0);
    setHot(null);
  }, [open, slides.length, hasVideo]);

  /* Keyboard shortcuts */
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

  /* CTA bridge */
  const openBooking = () => {
    try {
      window.dispatchEvent(new CustomEvent("open-booking", { detail: { source: "VehicleMediaShowcase" } }));
      (document.querySelector("[data-open-booking]") as HTMLButtonElement | null)?.click();
    } catch {}
  };

  /* Pagination sizing (no vertical scroll) */
  const PER_PAGE = isMobile ? 5 : 6;
  const bullets = (() => {
    if (!slide) return [];
    if (tab === "specs") return slide.details?.specs || [];
    if (tab === "features") return slide.details?.features || [];
    if (tab === "tech") return slide.details?.tech || [];
    return [];
  })();
  const totalPages = Math.max(1, Math.ceil((bullets?.length || 0) / PER_PAGE));
  const pageBullets = slicePage(bullets, page, PER_PAGE);

  /* Mobile carousel index */
  const mobWrapRef = useRef<HTMLDivElement>(null);
  const [mobIndex, setMobIndex] = useState(0);
  useEffect(() => {
    const el = mobWrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = (el.firstElementChild as HTMLElement | null)?.clientWidth || 1;
      setMobIndex(Math.round(el.scrollLeft / (w + 16)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* Helpers for interior swatches -> change slide by url */
  const goToSlideByUrl = (u: string) => {
    if (!open) return;
    const index = open.gallery.findIndex((g) => g.url === u);
    if (index >= 0) setIdx((hasVideo ? 1 : 0) + index);
  };

  /* Header stripe style */
  const headerStripe = variant?.stripe ? <div className="absolute top-0 left-0 h-1 w-28" style={{ background: TOK.red }} /> : null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-6">
      {/* Top video (not fullscreen on desktop) */}
      <div className={cx(TOK.card, TOK.radius, "p-3 md:p-4 mb-8 bg-white")}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold px-3 py-1 bg-zinc-100 rounded-full">Video</span>
            <h2 className="text-2xl md:text-3xl font-bold">Highlights</h2>
          </div>
        </div>
        <WistiaEmbed id="kvdhnonllm" aspect={16 / 9} muted autoPlay className="rounded-xl overflow-hidden" />
      </div>

      {/* Mobile: 6-tile carousel — FIXED widths */}
      <div className="md:hidden mb-6">
        <div
          ref={mobWrapRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 pb-2"
          style={{ scrollSnapStop: "always" }}
        >
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => resetModal(m)}
              className={cx(
                TOK.card,
                TOK.radius,
                "shrink-0 snap-start min-w-[88vw] text-left overflow-hidden hover:shadow-md transition-shadow"
              )}
            >
              <div className="relative">
                <ImageSafe src={m.thumbnail} alt={m.title} className="w-full h-48 object-cover" />
                <div className="absolute top-0 left-0 h-1" style={{ width: 72, background: TOK.red, borderTopLeftRadius: 12 }} />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100">{m.category}</span>
                  {m.badges?.slice(0, 2).map((b) => (
                    <span key={b} className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-200">{b}</span>
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

      {/* Desktop: 6-tile grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((m) => (
          <button
            key={m.id}
            onClick={() => resetModal(m)}
            className={cx(TOK.card, TOK.radius, "text-left overflow-hidden hover:shadow-md transition-shadow")}
          >
            <div className="relative">
              <ImageSafe src={m.thumbnail} alt={m.title} className="w-full h-56 md:h-64 object-cover" />
              <div className="absolute top-0 left-0 h-1" style={{ background: TOK.red, width: 82, borderTopLeftRadius: 12 }} />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100">{m.category}</span>
                {m.badges?.slice(0, 3).map((b) => (
                  <span key={b} className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-200">{b}</span>
                ))}
              </div>
              <h3 className="text-lg font-semibold">{m.title}</h3>
              <p className={cx("text-sm mt-1", TOK.muted)}>{m.summary}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ---------------------- Modal (no vertical scroll) ---------------------- */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-0 md:p-6"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white w-full h-[100svh] md:h-[92vh] md:max-w-[1300px] md:rounded-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative h-14 md:h-16 px-3 md:px-6 border-b bg-white flex items-center justify-between">
              {headerStripe}
              <div className="min-w-0">
                <div className="text-[12px] text-zinc-500">{open.category}</div>
                <div className={cx("font-bold truncate", isMobile ? "text-base" : "text-2xl", variant?.accent)}>
                  {open.title}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm px-2 py-1 rounded-full bg-zinc-100">
                  {(slides.length + (hasVideo ? 1 : 0)) ? `${idx + 1}/${slides.length + (hasVideo ? 1 : 0)}` : "1/1"}
                </span>
                <button onClick={() => setOpen(null)} className="px-3 py-1.5 rounded-full border hover:bg-zinc-50 text-sm">Close</button>
              </div>
            </div>

            {/* Body: grid, no vertical scroll */}
            <div className="flex-1 grid md:grid-cols-2 overflow-hidden select-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
              {/* Left: Visual with overlays */}
              <div className="relative bg-black">
                {isVideoFrame ? (
                  open.video?.provider === "wistia" ? (
                    <WistiaEmbed id={open.video.id} autoPlay={open.video.autoplay} muted className="w-full h-full" aspect={16 / 9} />
                  ) : (
                    <div className="relative w-full h-full" style={{ aspectRatio: "16/9" }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${open.video?.id}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1`}
                        title="Video"
                        allow="autoplay; encrypted-media; picture-in-picture"
                      />
                    </div>
                  )
                ) : (
                  <ImageSafe
                    src={slide?.url}
                    fallbackSrc={open.thumbnail}
                    alt={slide?.title || open.title}
                    fit="contain"
                    className="bg-black"
                  />
                )}

                {/* Handling: mode pills overlay */}
                {open.variant === "handling" && (
                  <div className="absolute top-3 left-3">
                    <ModePills modes={["Eco", "Normal", "Sport"]} active={mode} onChange={setMode} />
                  </div>
                )}

                {/* Performance: hotspots */}
                {open.variant === "performance" && slide?.hotspots?.map((h, i) => (
                  <React.Fragment key={i}>
                    <button
                      className="absolute z-10 h-5 w-5 -mt-2 -ml-2 rounded-full bg-white text-[10px] font-bold"
                      style={{ left: `${h.x}%`, top: `${h.y}%` }}
                      onClick={() => setHot(i === hot ? null : i)}
                    >
                      i
                    </button>
                    {hot === i && <HotBubble x={h.x} y={h.y} label={h.label} body={h.body} onClose={() => setHot(null)} />}
                  </React.Fragment>
                ))}

                {/* Desktop thumbs */}
                <div className="hidden md:flex absolute top-3 left-3 flex-col gap-2">
                  {hasVideo && (
                    <button
                      onClick={() => setIdx(0)}
                      className={cx("h-14 w-20 overflow-hidden rounded-md border bg-white text-xs font-medium grid place-items-center", idx === 0 ? "ring-2 ring-red-500" : "")}
                    >
                      Video
                    </button>
                  )}
                  {slides.map((s, i) => {
                    const real = hasVideo ? i + 1 : i;
                    return (
                      <button
                        key={s.url + i}
                        onClick={() => { setIdx(real); setHot(null); }}
                        className={cx("h-14 w-20 overflow-hidden rounded-md border", idx === real ? "ring-2 ring-red-500" : "")}
                      >
                        <ImageSafe src={s.url} alt={s.title} className="h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>

                {/* Arrows */}
                {(slides.length + (hasVideo ? 1 : 0)) > 1 && (
                  <>
                    <button
                      aria-label="Previous"
                      onClick={prev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white text-zinc-900 rounded-full px-3 py-2 shadow"
                    >
                      ‹
                    </button>
                    <button
                      aria-label="Next"
                      onClick={next}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-zinc-900 rounded-full px-3 py-2 shadow"
                    >
                      ›
                    </button>
                  </>
                )}

                {/* Mobile thumbs */}
                <div className="md:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 flex gap-2 overflow-x-auto">
                  {hasVideo && (
                    <button onClick={() => setIdx(0)} className={cx("h-12 w-16 overflow-hidden rounded-md border bg-white text-[11px] font-medium grid place-items-center", idx === 0 ? "ring-2 ring-red-500" : "")}>
                      Video
                    </button>
                  )}
                  {slides.map((s, i) => {
                    const real = hasVideo ? i + 1 : i;
                    return (
                      <button
                        key={s.url + i}
                        onClick={() => { setIdx(real); setHot(null); }}
                        className={cx("h-12 w-16 overflow-hidden rounded-md border", idx === real ? "ring-2 ring-red-500" : "")}
                      >
                        <ImageSafe src={s.url} alt={s.title} className="h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Content (no scroll -> tabs + pagination) */}
              <div className="flex flex-col p-4 md:p-6 overflow-hidden">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {open.badges?.slice(0, 4).map((b) => (
                    <span key={b} className="text-xs px-2 py-1 rounded-full bg-zinc-100">
                      {b}
                    </span>
                  ))}
                </div>

                {/* Slide title & description */}
                <div className="mb-3">
                  <h5 className={cx("font-semibold", isMobile ? "text-lg" : "text-xl", variant?.accent)}>{(slide?.title || open.title) as string}</h5>
                  {(slide?.description || open.summary) && (
                    <p className="text-sm text-zinc-600 line-clamp-2">{slide?.description || open.summary}</p>
                  )}
                </div>

                {/* Variant-specific extras */}
                <div className="mb-3">
                  {open.variant === "performance" && (
                    <div className="grid grid-cols-3 gap-2">
                      <KpiChip label="Power" value="400+ hp" />
                      <KpiChip label="0–100" value="4.2 s" />
                      <KpiChip label="Efficiency" value="28 mpg" />
                    </div>
                  )}

                  {open.variant === "safety" && (
                    <Checklist items={slide?.details?.specs || ["Pre-Collision System", "Lane Tracing Assist", "Adaptive Cruise", "Blind Spot Monitor"]} />
                  )}

                  {open.variant === "interior" && (
                    <Swatches
                      images={(open.gallery || []).map((g) => g.url)}
                      active={slide?.url}
                      onPick={goToSlideByUrl}
                    />
                  )}

                  {open.variant === "quality" && <Timeline steps={["Materials", "Assembly", "QA"]} />}

                  {open.variant === "technology" && <Tiles items={["Connect", "OTA", "Cloud"]} />}

                  {open.variant === "handling" && <div className="text-sm text-zinc-600">Mode: <strong>{mode}</strong></div>}
                </div>

                {/* Tabs */}
                <div className="mb-3">
                  <div className="inline-flex rounded-full border p-1 bg-zinc-50">
                    {(["overview", "specs", "features", "tech"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => {
                          setTab(t);
                          setPage(0);
                        }}
                        className={cx(
                          "px-3 py-1.5 rounded-full text-sm",
                          tab === t ? "bg-white border shadow-sm" : "text-zinc-600"
                        )}
                      >
                        {t[0].toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab content and footer (no overflow) */}
                <div className="flex-1 grid content-between">
                  <div>
                    {tab === "overview" ? (
                      <div className={cx(TOK.card, TOK.radius, "p-4")}>
                        <h6 className="font-semibold mb-1">Overview</h6>
                        <p className="text-zinc-600 text-sm">
                          {slide?.details?.overview || open.summary}
                        </p>
                        {slide?.hotspots && slide.hotspots.length > 0 && (
                          <div className="mt-3 text-[12px] text-zinc-500">Tap the “i” markers on the image to learn more.</div>
                        )}
                      </div>
                    ) : (
                      <div className={cx(TOK.card, TOK.radius, "p-3")}>
                        <ul className="grid grid-cols-1 gap-2">
                          {pageBullets.length ? (
                            pageBullets.map((b, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: TOK.red }} />
                                <span className="text-zinc-700">{b}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-zinc-400">No items.</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {tab !== "overview" && Math.ceil((bullets?.length || 0) / PER_PAGE) > 1 ? (
                      <div className="inline-flex items-center gap-2 text-sm">
                        <button className="px-3 py-1 rounded-full border hover:bg-zinc-50" onClick={() => setPage((p) => Math.max(0, p - 1))}>
                          Prev
                        </button>
                        <span className="text-zinc-500">
                          Page {page + 1}/{Math.max(1, Math.ceil((bullets?.length || 0) / PER_PAGE))}
                        </span>
                        <button className="px-3 py-1 rounded-full border hover:bg-zinc-50" onClick={() => setPage((p) => Math.min(Math.max(1, Math.ceil((bullets?.length || 0) / PER_PAGE)) - 1, p + 1))}>
                          Next
                        </button>
                      </div>
                    ) : (
                      <div />
                    )}

                    <button
                      onClick={openBooking}
                      className="h-10 px-4 rounded-full text-sm font-semibold text-white"
                      style={{ background: TOK.red }}
                    >
                      Book Test Drive
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default VehicleMediaShowcase;
