// src/components/vehicle-details/VehicleMediaShowcase.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import type { VehicleModel } from "@/types/vehicle";

/* ================= Brand tokens ================= */
const TOK = {
  red: "#EB0A1E",
  ring: "focus:outline-none focus:ring-2 focus:ring-red-500",
  card: "bg-white shadow-sm border border-zinc-100",
  radius: "rounded-2xl",
  muted: "text-zinc-600",
  container: "mx-auto max-w-[1400px] px-4 md:px-6",
} as const;

const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");

/* ================= Utilities ================= */
function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

const ImageSafe: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { cover?: boolean }
> = ({ src, alt, className, cover, ...rest }) => {
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
      className={cx(cover ? "object-cover" : "object-contain", "block", className)}
    />
  );
};

const WistiaEmbed: React.FC<{
  id: string;
  aspect?: number;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
}> = ({ id, aspect = 16 / 9, autoPlay, muted, className }) => {
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
        className="absolute inset-0 h-full w-full"
        src={`https://fast.wistia.net/embed/iframe/${id}?${qs}`}
        title="Wistia video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

/* ================= Types ================= */
type DetailBlock = { overview?: string; specs?: string[]; features?: string[]; tech?: string[] };
type Slide = { url: string; title: string; description?: string; details?: DetailBlock };

type Variant = "performance" | "safety" | "interior" | "quality" | "technology" | "handling";
type VariantStyle = { accent: string; slab: string; chip: string };

type MediaItem = {
  id: "v6" | "interior" | "safety" | "handling" | "quality" | "connect";
  category: string;
  title: string;
  summary: string;
  kind: "image" | "video";
  thumbnail: string;
  gallery: Slide[];
  video?: { provider: "wistia" | "youtube"; id: string; autoplay?: boolean };
  badges?: string[];
  variant: Variant;
};

const VARIANT: Record<Variant, VariantStyle> = {
  performance: { accent: "text-red-600", slab: "bg-red-50/70", chip: "bg-red-100" },
  safety: { accent: "text-blue-700", slab: "bg-blue-50/70", chip: "bg-blue-100" },
  interior: { accent: "text-amber-700", slab: "bg-amber-50/70", chip: "bg-amber-100" },
  quality: { accent: "text-zinc-700", slab: "bg-zinc-50/70", chip: "bg-zinc-100" },
  technology: { accent: "text-cyan-700", slab: "bg-cyan-50/70", chip: "bg-cyan-100" },
  handling: { accent: "text-emerald-700", slab: "bg-emerald-50/70", chip: "bg-emerald-100" },
};

/* ================= Demo media (DAM only) ================= */
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

/* ================= Props ================= */
interface Props {
  vehicle: VehicleModel; // kept for compatibility
}

/* ================= Variant content ================= */
const SpecCard: React.FC<{ title: string; bullets?: string[]; accentClass?: string }> = ({
  title,
  bullets,
  accentClass,
}) => {
  if (!bullets || bullets.length === 0) {
    return (
      <div className={cx(TOK.card, "rounded-xl p-4 opacity-60")}>
        <h6 className="mb-1 font-semibold">{title}</h6>
        <p className="text-zinc-500">—</p>
      </div>
    );
  }
  return (
    <div className={cx(TOK.card, "rounded-xl p-4")}>
      <h6 className={cx("mb-2 font-semibold", accentClass)}>{title}</h6>
      <ul className="space-y-2 text-sm">
        {bullets.slice(0, 6).map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: TOK.red }} />
            <span className="text-zinc-700">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

function VariantPanel(v: Variant, slide: Slide | null, item: MediaItem) {
  const accent = VARIANT[v].accent;
  switch (v) {
    case "performance":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SpecCard title="Specifications" bullets={slide?.details?.specs} accentClass={accent} />
          <SpecCard title="Features" bullets={slide?.details?.features} accentClass={accent} />
          <SpecCard title="Technology" bullets={slide?.details?.tech} accentClass={accent} />
        </div>
      );
    case "safety":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={cx(TOK.card, "rounded-xl p-4")}>
            <h6 className={cx("mb-2 font-semibold", accent)}>Overview</h6>
            <p className={TOK.muted}>{slide?.details?.overview || item.summary}</p>
          </div>
          <SpecCard title="ADAS Suite" bullets={slide?.details?.specs} accentClass={accent} />
        </div>
      );
    case "interior":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SpecCard title="Comfort" bullets={slide?.details?.features} accentClass={accent} />
          <SpecCard title="Tech" bullets={slide?.details?.tech} accentClass={accent} />
        </div>
      );
    case "quality":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SpecCard title="Materials" bullets={slide?.details?.specs} accentClass={accent} />
          <SpecCard title="Process" bullets={slide?.details?.features} accentClass={accent} />
        </div>
      );
    case "technology":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SpecCard title="Connectivity" bullets={slide?.details?.specs} accentClass={accent} />
          <SpecCard title="Cloud" bullets={slide?.details?.tech} accentClass={accent} />
        </div>
      );
    case "handling":
      return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <SpecCard title="Dynamics" bullets={slide?.details?.features} accentClass={accent} />
          <SpecCard title="Hardware" bullets={slide?.details?.specs} accentClass={accent} />
          <SpecCard title="Modes" bullets={slide?.details?.tech} accentClass={accent} />
        </div>
      );
  }
}

/* ================= Component ================= */
const VehicleMediaShowcase: React.FC<Props> = () => {
  const items = useMemo(() => DEMO.slice(0, 6), []);
  const topWistiaId = "kvdhnonllm";

  /* Modal state */
  const [open, setOpen] = useState<MediaItem | null>(null);
  const [idx, setIdx] = useState(0);
  useBodyScrollLock(!!open);

  const hasVideo = !!open?.video;
  const slides = open?.gallery ?? [];
  const visualIsVideo = hasVideo && idx === 0;
  const currSlide: Slide | null = !visualIsVideo ? slides[hasVideo ? idx - 1 : idx] : null;
  const total = (slides.length || 0) + (hasVideo ? 1 : 0) || 1;

  const next = useCallback(() => {
    if (!open) return;
    setIdx((p) => (p + 1) % total);
  }, [open, total]);
  const prev = useCallback(() => {
    if (!open) return;
    setIdx((p) => (p - 1 + total) % total);
  }, [open, total]);

  /* keyboard nav */
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

  /* touch swipe */
  const tStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (tStart.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (tStart.current == null) return;
    const dx = e.changedTouches[0].clientX - tStart.current;
    if (dx > 40) prev();
    if (dx < -40) next();
    tStart.current = null;
  };

  const openBooking = () => {
    try {
      window.dispatchEvent(new CustomEvent("open-booking", { detail: { source: "VehicleMediaShowcase" } }));
      (document.querySelector("[data-open-booking]") as HTMLButtonElement | null)?.click();
    } catch {}
  };

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

  const thumbOf = (m: MediaItem) => m.thumbnail || m.gallery[0]?.url || "";

  /* ================= Render ================= */
  return (
    <section className={TOK.container}>
      {/* Video card — isolated z-layer to prevent tile overlap */}
      <div className={cx(TOK.card, TOK.radius, "relative isolate z-10 p-3 md:p-4 mb-12")}>
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold">Video</span>
          <h2 className="text-2xl font-bold md:text-3xl">Highlights</h2>
        </div>
        <div className="md:max-h-[420px]">
          <WistiaEmbed id={topWistiaId} aspect={16 / 9} muted autoPlay className="overflow-hidden rounded-xl" />
        </div>
      </div>

      {/* Mobile: snap carousel */}
      <div className="mb-6 md:hidden">
        <div
          ref={mobWrapRef}
          className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setOpen(m);
                setIdx(0);
              }}
              className={cx(TOK.card, TOK.radius, TOK.ring, "snap-start min-w-[86%] overflow-hidden text-left")}
            >
              <div className="relative">
                <ImageSafe src={thumbOf(m)} alt={m.title} cover className="h-44 w-full" />
                <div className="absolute left-0 top-0 h-1 rounded-tl-[16px]" style={{ background: TOK.red, width: 72 }} />
              </div>
              <div className="p-4">
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{m.category}</span>
                  {m.badges?.slice(0, 2).map((b) => (
                    <span key={b} className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px]">
                      {b}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-semibold">{m.title}</h3>
                <p className={cx("mt-1 text-sm", TOK.muted)}>{m.summary}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-2 flex justify-center gap-2">
          {items.map((_, i) => (
            <span
              key={i}
              className={cx("h-1.5 w-1.5 rounded-full", i === mobIndex ? "" : "bg-zinc-300")}
              style={{ background: i === mobIndex ? TOK.red : undefined }}
            />
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="z-0 hidden grid-cols-2 gap-6 md:grid lg:grid-cols-3">
        {items.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setOpen(m);
              setIdx(0);
            }}
            className={cx(TOK.card, TOK.radius, TOK.ring, "overflow-hidden text-left transition-shadow hover:shadow-md")}
          >
            <div className="relative">
              <ImageSafe src={thumbOf(m)} alt={m.title} cover className="h-56 w-full md:h-64" />
              <div className="absolute left-0 top-0 h-1 rounded-tl-[16px]" style={{ background: TOK.red, width: 82 }} />
            </div>
            <div className="p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{m.category}</span>
                {m.badges?.slice(0, 3).map((b) => (
                  <span key={b} className="rounded-full border border-zinc-200 px-2 py-0.5 text-[11px]">
                    {b}
                  </span>
                ))}
              </div>
              <h3 className="text-lg font-semibold">{m.title}</h3>
              <p className={cx("mt-1 text-sm", TOK.muted)}>{m.summary}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal in a portal to avoid clipping by ancestors */}
      {open &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-start md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(null)}
          >
            <div
              className={cx(
                "bg-white w-full h-[100svh] md:h-[92vh] md:max-w-[1300px] md:rounded-2xl overflow-hidden",
                "flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 z-10 border-b bg-white/95 px-3 py-3 backdrop-blur md:px-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-base font-bold md:text-2xl">{open.title}</h4>
                    <p className="text-xs text-zinc-500 md:text-sm">{open.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs md:text-sm">
                      {(() => {
                        const total = (open.gallery.length || 0) + (open.video ? 1 : 0) || 1;
                        return `${idx + 1}/${total}`;
                      })()}
                    </span>
                    <button
                      onClick={openBooking}
                      className="hidden md:inline-flex rounded-full px-3 py-2 text-xs font-semibold text-white"
                      style={{ background: TOK.red }}
                    >
                      Book Test Drive
                    </button>
                    <button className="rounded-full border px-3 py-2 hover:bg-zinc-50" onClick={() => setOpen(null)}>
                      Close
                    </button>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="grid h-[calc(100svh-57px)] md:h-[calc(92vh-57px)] grid-rows-[minmax(0,56svh)_minmax(0,1fr)] md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] md:grid-rows-1">
                {/* Visual */}
                <div
                  className="relative select-none bg-black md:rounded-l-2xl"
                  onTouchStart={(e) => (tStart.current = e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (tStart.current == null) return;
                    const dx = e.changedTouches[0].clientX - tStart.current;
                    if (dx > 40) prev();
                    if (dx < -40) next();
                    tStart.current = null;
                  }}
                >
                  {hasVideo && idx === 0 ? (
                    open.video?.provider === "wistia" ? (
                      <WistiaEmbed id={open.video.id} autoPlay={open.video.autoplay} muted className="h-full w-full" />
                    ) : (
                      <div className="relative h-full w-full" style={{ aspectRatio: "16/9" }}>
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={`https://www.youtube.com/embed/${open.video?.id}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1`}
                          title="Video"
                          allow="autoplay; encrypted-media; picture-in-picture"
                        />
                      </div>
                    )
                  ) : (
                    <ImageSafe
                      src={(currSlide?.url || open.thumbnail) as string}
                      alt={(currSlide?.title || open.title) as string}
                      cover
                      className="h-full w-full"
                    />
                  )}

                  {/* Thumbs (desktop) */}
                  <div className="absolute left-3 top-3 hidden flex-col gap-2 md:flex">
                    {hasVideo && (
                      <button
                        onClick={() => setIdx(0)}
                        className={cx(
                          "h-14 w-20 overflow-hidden rounded-md border bg-white text-xs font-medium",
                          idx === 0 && "ring-2 ring-red-500"
                        )}
                      >
                        Video
                      </button>
                    )}
                    {slides.map((s, i) => {
                      const real = hasVideo ? i + 1 : i;
                      return (
                        <button
                          key={s.url + i}
                          onClick={() => setIdx(real)}
                          className={cx("h-14 w-20 overflow-hidden rounded-md border", idx === real && "ring-2 ring-red-500")}
                        >
                          <ImageSafe src={s.url} alt={s.title} cover className="h-full w-full" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Arrows & dots */}
                  {total > 1 && (
                    <>
                      <button
                        aria-label="Previous"
                        onClick={prev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-2 text-zinc-900 shadow"
                      >
                        ‹
                      </button>
                      <button
                        aria-label="Next"
                        onClick={next}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-2 text-zinc-900 shadow"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {Array.from({ length: total }).map((_, i) => (
                          <span
                            key={i}
                            className={cx("h-1.5 w-1.5 rounded-full", i === idx ? "" : "bg-white/50")}
                            style={{ background: i === idx ? TOK.red : undefined }}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {/* Mobile thumbs */}
                  <div className="absolute inset-x-0 bottom-0 flex gap-2 overflow-x-auto bg-gradient-to-t from-black/50 to-transparent px-3 py-2 md:hidden">
                    {hasVideo && (
                      <button
                        onClick={() => setIdx(0)}
                        className={cx(
                          "h-12 w-16 overflow-hidden rounded-md border bg-white text-[11px] font-medium",
                          idx === 0 && "ring-2 ring-red-500"
                        )}
                      >
                        Video
                      </button>
                    )}
                    {slides.map((s, i) => {
                      const real = hasVideo ? i + 1 : i;
                      return (
                        <button
                          key={s.url + i}
                          onClick={() => setIdx(real)}
                          className={cx("h-12 w-16 overflow-hidden rounded-md border", idx === real && "ring-2 ring-red-500")}
                        >
                          <ImageSafe src={s.url} alt={s.title} cover className="h-full w-full" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content — variant specific; compact, no page scroll */}
                <div className="flex min-h-0 flex-col bg-white md:rounded-r-2xl">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 p-4">
                    {open.badges?.slice(0, 5).map((b) => (
                      <span key={b} className={cx("rounded-full px-2 py-1 text-xs", VARIANT[open.variant].chip)}>
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Title slab */}
                  <div className={cx("mx-4 mb-4 rounded-xl border border-zinc-200/60 p-4", VARIANT[open.variant].slab)}>
                    <h5 className={cx("mb-1 text-lg font-semibold", VARIANT[open.variant].accent)}>
                      {currSlide?.title || open.title}
                    </h5>
                    <p className={TOK.muted}>{currSlide?.description || open.summary}</p>
                  </div>

                  {/* Variant panel */}
                  <div className="px-4 pb-4">{VariantPanel(open.variant, currSlide, open)}</div>

                  {/* Desktop-only nav (single location; no double CTA) */}
                  {total > 1 && (
                    <div className="hidden items-center justify-between border-t p-4 md:flex">
                      <div className="flex gap-3">
                        <button onClick={prev} className="rounded-full border px-4 py-2 hover:bg-zinc-50">
                          Previous
                        </button>
                        <button
                          onClick={next}
                          className="rounded-full px-4 py-2 text-white"
                          style={{ background: TOK.red }}
                        >
                          Next
                        </button>
                      </div>
                      <div />{/* intentionally empty to avoid a second CTA */}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default VehicleMediaShowcase;
