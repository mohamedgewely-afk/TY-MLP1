// src/components/vehicle-details/VehicleMediaShowcase.tsx
import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import type { VehicleModel } from "@/types/vehicle";

/** === Brand tokens (Toyota-esque) === */
const TOK = {
  red: "#EB0A1E",
  text: "text-zinc-900",
  muted: "text-zinc-500",
  card: "bg-white shadow-sm border border-zinc-100",
  radius: "rounded-2xl",
  ring: "focus:outline-none focus:ring-2 focus:ring-red-500",
};

/** === Types for internal model === */
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

/** === Utilities === */
const cx = (...x: (string | false | null | undefined)[]) => x.filter(Boolean).join(" ");
const FALLBACK =
  "https://images.unsplash.com/photo-1549924231-f129b911e442?q=80&w=1200&auto=format&fit=crop";

const ImageSafe: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (p) => {
  const [bad, setBad] = useState(false);
  return (
    <img
      {...p}
      loading="lazy"
      onError={() => setBad(true)}
      src={bad ? FALLBACK : (p.src as string)}
      alt={p.alt || "image"}
    />
  );
};

/** Robust Wistia iframe embed (no extra libs/custom elements) */
const WistiaEmbed: React.FC<{
  mediaId: string;
  aspect?: number;
  autoPlay?: boolean;
  muted?: boolean;
  className?: string;
}> = ({ mediaId, aspect = 16 / 9, autoPlay, muted, className }) => {
  const params = new URLSearchParams({
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
        src={`https://fast.wistia.net/embed/iframe/${mediaId}?${params}`}
        title="Wistia video"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

/** === Demo data (safe defaults). Replace with your DAM mapping if desired === */
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

/** === Props: keep exactly what VehicleDetails passes === */
interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  /** Top video – prefer vehicle-provided if you have it */
  const topWistiaId = "kvdhnonllm"; // replace from vehicle when available

  /** Map your vehicle to items if you have a media structure, else demo */
  const items: MediaItem[] = useMemo(() => {
    // TODO: map from vehicle if shape known; safe fallback:
    return DEMO.slice(0, 6);
  }, [vehicle]);

  const [open, setOpen] = useState<MediaItem | null>(null);
  const [idx, setIdx] = useState(0);

  const slides = open?.gallery || [];
  const curr = slides[idx];

  const next = useCallback(() => {
    if (!slides.length) return;
    setIdx((p) => (p + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (!slides.length) return;
    setIdx((p) => (p - 1 + slides.length) % slides.length);
  }, [slides.length]);

  /** Keyboard nav inside modal */
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

  /** Swipe on visual pane (mobile) */
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 40) prev();
    if (dx < -40) next();
    touchStartX.current = null;
  };

  /** CTA without changing VehicleDetails.tsx */
  const openBooking = () => {
    try {
      window.dispatchEvent(new CustomEvent("open-booking", { detail: { source: "VehicleMediaShowcase" } }));
      const btn = document.querySelector("[data-open-booking]") as HTMLButtonElement | null;
      btn?.click();
    } catch {
      /* silent noop */
    }
  };

  return (
    <section className="mx-auto max-w-[1400px] px-4 md:px-6">
      {/* Top: Wistia (not full screen on desktop) */}
      <div className={cx(TOK.card, TOK.radius, "p-3 md:p-4 mb-8")}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold px-3 py-1 bg-zinc-100 rounded-full">Video</span>
            <h2 className="text-2xl md:text-3xl font-bold">Highlights</h2>
          </div>
        </div>
        <WistiaEmbed mediaId={topWistiaId} aspect={16 / 9} muted autoPlay className="rounded-xl overflow-hidden" />
      </div>

      {/* Six tiles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              setOpen(m);
              setIdx(0);
            }}
            className={cx(TOK.card, TOK.radius, "text-left overflow-hidden hover:shadow-md transition-shadow", TOK.ring)}
            aria-label={`${m.title} details`}
          >
            <div className="relative">
              <ImageSafe src={m.thumbnail} alt={m.title} className="w-full h-56 md:h-64 object-cover" />
              <div className="absolute top-0 left-0 h-1" style={{ background: TOK.red, width: 82, borderTopLeftRadius: 12 }} />
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
              <h3 className="text-lg font-semibold">{m.title}</h3>
              <p className={cx("text-sm mt-1", TOK.muted)}>{m.summary}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Journey Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-6"
          onClick={() => setOpen(null)}
          aria-modal="true"
          role="dialog"
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
                  {slides.length ? `${idx + 1}/${slides.length}` : "1/1"}
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

            {/* Body: two panes desktop, stacked mobile */}
            <div className="grid md:grid-cols-2 gap-0 md:gap-6 overflow-y-auto">
              {/* Visual pane */}
              <div
                className="relative bg-black md:rounded-l-2xl"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="w-full h-[52vh] md:h-full">
                  {open.video && idx === 0 ? (
                    open.video.provider === "wistia" ? (
                      <WistiaEmbed mediaId={open.video.id} autoPlay={open.video.autoplay} muted className="w-full h-full" aspect={16 / 9} />
                    ) : (
                      <div className="relative w-full h-full" style={{ aspectRatio: "16/9" }}>
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${open.video.id}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1`}
                          title="Video"
                          allow="autoplay; encrypted-media; picture-in-picture"
                        />
                      </div>
                    )
                  ) : (
                    <ImageSafe
                      src={curr?.url || open.thumbnail}
                      alt={curr?.title || open.title}
                      className="w-full h-full object-contain bg-black"
                    />
                  )}
                </div>

                {/* Pager & Arrows */}
                {slides.length > 1 && (
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
                      {slides.map((_, i) => (
                        <span
                          key={i}
                          className={cx("h-2 w-2 rounded-full", i === idx ? "" : "bg-white/50")}
                          style={{ background: i === idx ? TOK.red : undefined }}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Mobile CTA */}
                <div className="md:hidden absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 via-black/10 to-transparent">
                  <button
                    onClick={openBooking}
                    className="w-full text-center py-3 font-semibold rounded-full text-white"
                    style={{ background: TOK.red }}
                  >
                    Book Test Drive
                  </button>
                </div>
              </div>

              {/* Content pane */}
              <div className="p-4 md:p-6 overflow-y-auto">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {open.badges?.map((b) => (
                    <span key={b} className="text-xs px-2 py-1 rounded-full bg-zinc-100">
                      {b}
                    </span>
                  ))}
                </div>

                <h5 className="text-lg md:text-xl font-semibold">{curr?.title || open.title}</h5>
                {curr?.description && <p className="mt-1 text-zinc-500">{curr.description}</p>}

                {/* Overview */}
                {(curr?.details?.overview || open.summary) && (
                  <div className={cx(TOK.card, TOK.radius, "p-4 mt-4")}>
                    <h6 className="font-semibold mb-1">Overview</h6>
                    <p className="text-zinc-600">{curr?.details?.overview || open.summary}</p>
                  </div>
                )}

                {/* Specs / Features / Tech */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <SpecCard title="Specifications" bullets={curr?.details?.specs} />
                  <SpecCard title="Features" bullets={curr?.details?.features} />
                  <SpecCard title="Technology" bullets={curr?.details?.tech} />
                </div>

                {/* Desktop pager */}
                {slides.length > 1 && (
                  <div className="hidden md:flex gap-3 mt-6">
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

/** Small spec card */
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
