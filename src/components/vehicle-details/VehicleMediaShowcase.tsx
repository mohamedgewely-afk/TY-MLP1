// src/components/vehicle-details/VehicleMediaShowcase.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import type { VehicleModel } from "@/types/vehicle";

/* ===== Brand tokens ===== */
const TOK = {
  red: "#EB0A1E",
  txtMuted: "text-zinc-500",
  ring: "focus:outline-none focus:ring-2 focus:ring-red-500",
  card: "bg-white shadow-sm border border-zinc-100",
  radius: "rounded-2xl",
};

/* ===== Types ===== */
type DetailBlock = {
  overview?: string;
  specs?: string[];
  features?: string[];
  tech?: string[];
};

type Slide = {
  url: string;
  title: string;
  description?: string;
  details?: DetailBlock;
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
};

const cx = (...arr: (string | false | null | undefined)[]) => arr.filter(Boolean).join(" ");
const FALLBACK =
  "https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1200&auto=format&fit=crop";

const ImageSafe: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  const [err, setErr] = useState(false);
  return (
    <img
      {...props}
      loading="lazy"
      onError={() => setErr(true)}
      src={err ? FALLBACK : (props.src as string)}
      alt={props.alt || "image"}
    />
  );
};

/* Robust Wistia embed (no custom elements) */
const WistiaEmbed: React.FC<{
  mediaId: string;
  aspect?: number;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
}> = ({ mediaId, aspect = 16 / 9, autoPlay, muted, className }) => {
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
        src={`https://fast.wistia.net/embed/iframe/${mediaId}?${qs}`}
        title="Wistia video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

/* ===== Demo content (safe defaults) ===== */
const DEMO: MediaItem[] = [
  {
    id: "v6",
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
        details: {
          specs: ["VGT turbines", "Low-mass impellers"],
          features: ["Wider torque band", "Low lag"],
          tech: ["VGT mapping", "Charge-air cooling"],
        },
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
        details: {
          specs: ["Heated/ventilated", "Multi-way adjust"],
          features: ["Memory", "Lumbar"],
          tech: ["Seat profile recall", "HVAC sync"],
        },
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
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    video: { provider: "wistia", id: "kvdhnonllm", autoplay: true },
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Sensors",
        description: "Wide FOV camera and radar coverage.",
        details: {
          overview: "ADAS suite: PCS, LTA, ACC, BSM.",
          specs: ["PCS", "LTA", "ACC", "BSM"],
          features: ["Collision mitigation", "Fatigue reduction"],
          tech: ["Sensor fusion", "AI classification"],
        },
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
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Adaptive Dampers",
        description: "Millisecond-level response for composure.",
        details: {
          specs: ["Active dampers", "Torque vectoring"],
          features: ["AWD grip", "Drive modes"],
          tech: ["Real-time mapping", "ESC integration"],
        },
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
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
        title: "Materials",
        description: "Premium substrates and coatings.",
        details: {
          specs: ["HS steel", "Multi-stage paint"],
          features: ["Laser gap checks", "Robotic assembly"],
          tech: ["Inline QA audits", "Corrosion protection"],
        },
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
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
        title: "Infotainment",
        details: {
          specs: ["Apple CarPlay", "Android Auto", "Wi-Fi hotspot"],
          features: ["Wireless updates", "App sync"],
          tech: ["Cloud services", "OTA"],
        },
      },
    ],
    badges: ["CarPlay", "OTA"],
  },
];

/* ===== Props kept as-is so VehicleDetails.tsx stays untouched ===== */
interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const topWistiaId = "kvdhnonllm"; // replace from vehicle if available

  const items: MediaItem[] = useMemo(() => {
    // If your vehicle has a media field, map it here; demo fallback below.
    return DEMO.slice(0, 6);
  }, [vehicle]);

  /* -------- Modal state -------- */
  const [open, setOpen] = useState<MediaItem | null>(null);
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);

  // Support video as first “slide” if present
  const hasVideo = !!open?.video;
  const slides = open?.gallery ?? [];
  const visualIsVideo = hasVideo && idx === 0;
  const slide = visualIsVideo ? null : slides[hasVideo ? idx - 1 : idx];

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

  // keyboard nav
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

  // swipe
  const tStart = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => (tStart.current = e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (tStart.current == null) return;
    const dx = e.changedTouches[0].clientX - tStart.current;
    if (dx > 40) prev();
    if (dx < -40) next();
    tStart.current = null;
  };

  // CTA bridge without changing VehicleDetails.tsx
  const openBooking = () => {
    try {
      window.dispatchEvent(new CustomEvent("open-booking", { detail: { source: "VehicleMediaShowcase" } }));
      (document.querySelector("[data-open-booking]") as HTMLButtonElement | null)?.click();
    } catch {}
  };

  /* -------- Mobile carousel for tiles -------- */
  const mobWrapRef = useRef<HTMLDivElement>(null);
  const [mobIndex, setMobIndex] = useState(0);
  useEffect(() => {
    const el = mobWrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const childW = el.firstElementChild?.clientWidth || 1;
      const i = Math.round(el.scrollLeft / (childW + 16)); // 16 = gap
      setMobIndex(Math.max(0, Math.min(items.length - 1, i)));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [items.length]);

  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-6">
      {/* Top Wistia (not fullscreen on desktop) */}
      <div className={cx(TOK.card, TOK.radius, "p-3 md:p-4 mb-8")}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold px-3 py-1 bg-zinc-100 rounded-full">Video</span>
            <h2 className="text-2xl md:text-3xl font-bold">Highlights</h2>
          </div>
        </div>
        <WistiaEmbed mediaId={topWistiaId} aspect={16 / 9} muted autoPlay className="rounded-xl overflow-hidden" />
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden mb-6">
        <div
          ref={mobWrapRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] no-scrollbar -mx-4 px-4 pb-2"
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
                "snap-center flex-none w-[85%] text-left overflow-hidden hover:shadow-md transition-shadow"
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
                    <span key={b} className="text-[11px] px-2 py-0.5 rounded-full border border-zinc-200">
                      {b}
                    </span>
                  ))}
                </div>
                <h3 className="text-base font-semibold">{m.title}</h3>
                <p className={cx("text-sm mt-1", TOK.txtMuted)}>{m.summary}</p>
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

      {/* Desktop grid */}
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
            aria-label={`${m.title} details`}
          >
            <div className="relative">
              <ImageSafe src={m.thumbnail} alt={m.title} className="w-full h-56 md:h-64 object-cover" />
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
              <p className={cx("text-sm mt-1", TOK.txtMuted)}>{m.summary}</p>
            </div>
          </button>
        ))}
      </div>

      {/* ====== Modal (enhanced) ====== */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-6"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={cx(TOK.radius, "bg-white w-full max-w-[1300px] max-h-[92vh] overflow-hidden grid grid-rows-[auto,1fr]")}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 md:px-6 py-3 border-b bg-white/95">
              <div className="min-w-0">
                <h4 className="text-base md:text-2xl font-bold truncate">{open.title}</h4>
                <p className="text-xs md:text-sm text-zinc-500">{open.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm px-2 py-1 rounded-full bg-zinc-100">
                  {slides.length + (hasVideo ? 1 : 0) ? `${idx + 1}/${slides.length + (hasVideo ? 1 : 0)}` : "1/1"}
                </span>
                <button
                  onClick={openBooking}
                  className="hidden sm:inline-flex px-4 py-2 rounded-full font-medium text-white"
                  style={{ background: TOK.red }}
                >
                  Book Test Drive
                </button>
                <button onClick={() => setOpen(null)} className="px-3 py-2 rounded-full border hover:bg-zinc-50">
                  Close
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="grid md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] overflow-y-auto">
              {/* Visual with side thumbnails */}
              <div className="relative bg-black md:rounded-l-2xl select-none" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
                <div className={cx("w-full", zoom ? "h-[70vh]" : "h-[52vh] md:h-[calc(92vh-160px)]")}>
                  {visualIsVideo ? (
                    open.video?.provider === "wistia" ? (
                      <WistiaEmbed mediaId={open.video.id} autoPlay={open.video.autoplay} muted className="w-full h-full" aspect={16 / 9} />
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
                      src={slide?.url || open.thumbnail}
                      alt={slide?.title || open.title}
                      className={cx("w-full h-full", zoom ? "object-cover" : "object-contain", "bg-black")}
                    />
                  )}
                </div>

                {/* Zoom toggle */}
                <button
                  onClick={() => setZoom((z) => !z)}
                  className="absolute right-2 top-2 text-[12px] px-3 py-1 rounded-full bg-white/90 border"
                >
                  {zoom ? "Fit" : "Zoom"}
                </button>

                {/* Thumbnails rail (desktop) */}
                <div className="hidden md:flex absolute top-3 left-3 flex-col gap-2">
                  {hasVideo && (
                    <button
                      onClick={() => setIdx(0)}
                      className={cx(
                        "h-14 w-20 overflow-hidden rounded-md border",
                        idx === 0 ? "ring-2 ring-red-500" : "opacity-80 hover:opacity-100"
                      )}
                    >
                      <ImageSafe
                        src={`https://fast.wistia.com/embed/medias/${open.video!.id}/swatch`}
                        alt="Video"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )}
                  {slides.map((s, i) => {
                    const real = hasVideo ? i + 1 : i;
                    return (
                      <button
                        key={s.url + i}
                        onClick={() => setIdx(real)}
                        className={cx(
                          "h-14 w-20 overflow-hidden rounded-md border",
                          idx === real ? "ring-2 ring-red-500" : "opacity-80 hover:opacity-100"
                        )}
                      >
                        <ImageSafe src={s.url} alt={s.title} className="h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>

                {/* Arrows + dots */}
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
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                      {Array.from({ length: slides.length + (hasVideo ? 1 : 0) }).map((_, i) => (
                        <span
                          key={i}
                          className={cx("h-1.5 w-1.5 rounded-full", i === idx ? "" : "bg-white/50")}
                          style={{ background: i === idx ? TOK.red : undefined }}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Mobile thumbs row */}
                <div className="md:hidden absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 flex gap-2 overflow-x-auto">
                  {hasVideo && (
                    <button
                      onClick={() => setIdx(0)}
                      className={cx("h-12 w-16 overflow-hidden rounded-md border", idx === 0 ? "ring-2 ring-red-500" : "")}
                    >
                      <ImageSafe
                        src={`https://fast.wistia.com/embed/medias/${open.video!.id}/swatch`}
                        alt="Video"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )}
                  {slides.map((s, i) => {
                    const real = hasVideo ? i + 1 : i;
                    return (
                      <button
                        key={s.url + i}
                        onClick={() => setIdx(real)}
                        className={cx("h-12 w-16 overflow-hidden rounded-md border", idx === real ? "ring-2 ring-red-500" : "")}
                      >
                        <ImageSafe src={s.url} alt={s.title} className="h-full w-full object-cover" />
                      </button>
                    );
                  })}
                </div>

                {/* Mobile sticky CTA */}
                <div className="md:hidden absolute inset-x-0 bottom-0 translate-y-[calc(100%+8px)] p-3">
                  <button
                    onClick={openBooking}
                    className="w-full text-center py-3 font-semibold rounded-full text-white"
                    style={{ background: TOK.red }}
                  >
                    Book Test Drive
                  </button>
                </div>
              </div>

              {/* Content pane (rich, dense) */}
              <div className="p-4 md:p-6 overflow-y-auto">
                {/* Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {open.badges?.slice(0, 4).map((b) => (
                    <span key={b} className="text-xs px-2 py-1 rounded-full bg-zinc-100">
                      {b}
                    </span>
                  ))}
                </div>

                <h5 className="text-xl font-semibold">{(slide?.title || open.title) as string}</h5>
                {(slide?.description || open.summary) && <p className="mt-1 text-zinc-600">{slide?.description || open.summary}</p>}

                {/* Overview */}
                {(slide?.details?.overview || open.summary) && (
                  <div className={cx(TOK.card, TOK.radius, "p-4 mt-4")}>
                    <h6 className="font-semibold mb-1">Overview</h6>
                    <p className="text-zinc-600">{slide?.details?.overview || open.summary}</p>
                  </div>
                )}

                {/* Spec/Feature/Tech cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <SpecCard title="Specifications" bullets={slide?.details?.specs} />
                  <SpecCard title="Features" bullets={slide?.details?.features} />
                  <SpecCard title="Technology" bullets={slide?.details?.tech} />
                </div>

                {/* Sticky footer controls (desktop) */}
                {(slides.length + (hasVideo ? 1 : 0)) > 1 && (
                  <div className="hidden md:flex items-center justify-between mt-6">
                    <div className="flex gap-3">
                      <button onClick={prev} className="px-4 py-2 rounded-full border hover:bg-zinc-50">
                        Previous
                      </button>
                      <button
                        onClick={next}
                        className="px-4 py-2 rounded-full text-white"
                        style={{ background: TOK.red }}
                      >
                        Next
                      </button>
                    </div>
                    <button
                      onClick={openBooking}
                      className="px-5 py-2.5 rounded-full font-semibold text-white"
                      style={{ background: TOK.red }}
                    >
                      Book Test Drive
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/* Mini spec card */
const SpecCard: React.FC<{ title: string; bullets?: string[] }> = ({ title, bullets }) => {
  if (!bullets?.length) {
    return (
      <div className={cx(TOK.card, TOK.radius, "p-4 opacity-60")}>
        <h6 className="font-semibold mb-1">{title}</h6>
        <p className="text-zinc-500">—</p>
      </div>
    );
  }
  return (
    <div className={cx(TOK.card, TOK.radius, "p-4")}>
      <h6 className="font-semibold mb-2">{title}</h6>
      <ul className="space-y-2">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm">
            <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: TOK.red }} />
            <span className="text-zinc-700">{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VehicleMediaShowcase;
