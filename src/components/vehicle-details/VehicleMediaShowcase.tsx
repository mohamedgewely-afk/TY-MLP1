// src/components/vehicle-details/VehicleMediaShowcase.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import type { VehicleModel } from "@/types/vehicle";

/* ================= Brand tokens & Utilities ================= */
const TOK = {
  red: "#EB0A1E",
  ring: "focus:outline-none focus:ring-2 focus:ring-red-500",
  card: "bg-white shadow-sm border border-zinc-100",
  radius: "rounded-2xl",
  muted: "text-zinc-600",
  container: "mx-auto max-w-[1400px] px-4 md:px-6",
} as const;

const cx = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(" ");

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
  useEffect(() => {
    setErr(!src);
  }, [src]);

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

/* ================= Media Visual Component (unified) ================= */
type Visual = { url: string; title: string; type: "image" | "wistia" | "youtube"; id?: string };

const MediaVisual: React.FC<{ visual: Visual; className?: string }> = ({ visual, className }) => {
  if (visual.type === "wistia" && visual.id) {
    const qs = new URLSearchParams({
      seo: "false",
      videoFoam: "true",
      autoplay: "true",
      muted: "true",
      controlsVisibleOnLoad: "true",
    }).toString();
    return (
      <div className={cx("relative h-full w-full", className)} style={{ aspectRatio: '16/9' }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://fast.wistia.net/embed/iframe/${visual.id}?${qs}`}
          title="Wistia video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  if (visual.type === "youtube" && visual.id) {
    return (
      <div className={cx("relative h-full w-full", className)} style={{ aspectRatio: '16/9' }}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${visual.id}?rel=0&modestbranding=1&playsinline=1&autoplay=1&mute=1`}
          title="YouTube video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return <ImageSafe src={visual.url} alt={visual.title} cover className={cx("h-full w-full", className)} />;
};

/* ================= Types & Mocks ================= */
type MediaItem = {
  id: "v6" | "interior" | "safety" | "handling" | "quality" | "connect";
  category: string;
  title: string;
  summary: string;
  thumbnail: string;
  gallery: { url: string; title: string; description?: string; details?: Record<string, string[]> }[];
  video?: { provider: "wistia" | "youtube"; id: string };
  badges?: string[];
};

// =========================================================================
// ==  FIX APPLIED HERE: Added unique details to handling, quality, connect ==
// =========================================================================
const DEMO: MediaItem[] = [
  {
    id: "v6",
    category: "Performance",
    title: "V6 Twin-Turbo",
    summary: "400+ hp, broad torque band, efficient cruising.",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true", title: "Cooling Strategy", details: { specs: ["3.5L V6 TT", "400+ hp", "0–60 in 4.2s"], features: ["Direct injection", "VVT"] } },
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true", title: "Turbo Detail", details: { specs: ["VGT turbines"], features: ["Low-lag design"] } },
    ],
    badges: ["3.5L V6 TT", "400+ hp"],
  },
  {
    id: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "Camera+radar fusion, assistance when you need it.",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    video: { provider: "wistia", id: "kvdhnonllm" },
    gallery: [
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true", title: "Sensors", details: { specs: ["PCS", "LTA", "ACC", "BSM"] } },
    ],
    badges: ["PCS", "LTA", "ACC"],
  },
  {
    id: "interior",
    category: "Interior",
    title: "Driver-Focused Cabin",
    summary: "Premium materials, intuitive controls, low distraction.",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    gallery: [{ url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/561ac4b4-3604-4e66-ae72-83e2969d7d65/items/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true", title: "Center Console", details: { specs: ['12.3" display'], features: ["Voice control", "Wireless charging"] } }],
    badges: ['12.3" display', "Comfort"],
  },
  {
    id: "handling",
    category: "Performance",
    title: "Chassis Dynamics",
    summary: "Adaptive damping and precise control.",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
    gallery: [{ url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true", title: "Adaptive Dampers", details: { features: ["Adaptive Variable Suspension", "Drive Mode Select (Sport S+)", "Electronically Controlled AWD"] } }],
    badges: ["AWD", "Sport mode"],
  },
  {
    id: "quality",
    category: "Quality",
    title: "Build Quality",
    summary: "High-strength materials and precise assembly.",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [{ url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true", title: "Materials", details: { features: ["Laser Screw Welding for rigidity", "High-tensile strength steel chassis", "Multi-stage paint process"] } }],
    badges: ["Durability", "Refinement"],
  },
  {
    id: "connect",
    category: "Technology",
    title: "Connected Services",
    summary: "CarPlay/Android Auto, OTA updates.",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    gallery: [{ url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true", title: "Infotainment", details: { features: ["Over-the-Air (OTA) software updates", "Integrated Navigation with real-time traffic", "Remote Connect via Smartphone App"] } }],
    badges: ["CarPlay", "OTA"],
  },
];


/* ================= Custom Modals (unique & interactive) ================= */

const PerformanceModal: React.FC<{ item: MediaItem }> = ({ item }) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 md:p-12">
      <h3 className="text-4xl font-black text-zinc-900">{item.title}</h3>
      <p className="max-w-xl text-zinc-500 mt-2">{item.summary}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-4">
          <div className={cx(TOK.card, "p-6 rounded-xl")}>
            <h4 className="text-xl font-bold mb-4" style={{ color: TOK.red }}>Performance Snapshot</h4>
            <div className="space-y-4">
              {['Acceleration', 'Response', 'Efficiency'].map((label, i) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-semibold">{label}</span>
                    <span className="text-zinc-500">{90 - (i * 10)}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                    <div className="h-2 rounded-full transition-all duration-700 ease-out" style={{ width: `${90 - (i * 10)}%`, background: TOK.red }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={cx(TOK.card, "p-6 rounded-xl")}>
            <h4 className="text-xl font-bold mb-4" style={{ color: TOK.red }}>Specifications</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {item.gallery[0]?.details?.specs?.map((spec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: TOK.red }} />
                  <span className="text-zinc-700 font-medium">{spec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className={cx(TOK.card, "p-6 rounded-xl")}>
            <h4 className="text-xl font-bold mb-4" style={{ color: TOK.red }}>Features</h4>
            <ul className="space-y-2 text-sm">
              {item.gallery[0]?.details?.features?.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: TOK.red }} />
                  <span className="text-zinc-700 font-medium">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className={cx(TOK.card, "p-6 rounded-xl")}>
            <h4 className="text-xl font-bold mb-4" style={{ color: TOK.red }}>Key Technologies</h4>
            <ul className="space-y-2 text-sm">
              {item.gallery[1]?.details?.specs?.map((tech, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: TOK.red }} />
                  <span className="text-zinc-700 font-medium">{tech}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const SafetyModal: React.FC<{ item: MediaItem }> = ({ item }) => {
  const [active, setActive] = useState('pcs');
  const features = item.gallery[0]?.details?.specs || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
      <div className="relative bg-zinc-900 flex justify-center items-center overflow-hidden p-6 md:p-12">
        <ImageSafe src="https://i.imgur.com/example-blueprint.png" alt="Safety diagram" className="h-full w-full object-contain opacity-70" />
        <div className={cx("absolute h-10 w-10 bg-red-500 rounded-full opacity-60 animate-pulse", active === 'pcs' ? 'top-[40%] left-[20%]' : active === 'lta' ? 'top-[50%] right-[30%]' : 'bottom-[25%] left-[50%]')} />
      </div>
      <div className="flex flex-col h-full bg-white p-6 md:p-12 overflow-y-auto">
        <h3 className="text-4xl font-black mb-6" style={{ color: TOK.red }}>{item.title}</h3>
        <p className="text-zinc-500 mb-8">{item.summary}</p>
        <div className="flex-1 space-y-4">
          <h4 className="font-bold text-lg">Toyota Safety Sense Features</h4>
          {features.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f.toLowerCase())}
              className={cx("p-4 w-full text-left rounded-xl border border-zinc-200 transition-colors", active === f.toLowerCase() ? "bg-zinc-900 text-white" : "hover:bg-zinc-50")}
            >
              <h4 className="font-semibold text-lg" style={{ color: active === f.toLowerCase() ? 'white' : TOK.red }}>{f}</h4>
              <p className={cx("text-sm mt-1", active === f.toLowerCase() ? "text-zinc-300" : "text-zinc-600")}>Details for {f} assist here.</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const InteriorModal: React.FC<{ item: MediaItem }> = ({ item }) => {
  const [active, setActive] = useState(0);
  const slides = item.gallery;
  return (
    <div className="relative h-full bg-black">
      <ImageSafe src={slides[active].url} alt={slides[active].title} cover className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/50 p-6 md:p-12 flex flex-col justify-end">
        <h3 className="text-4xl font-black text-white mb-2">{item.title}</h3>
        <p className="text-white/80 max-w-2xl">{item.summary}</p>
        <div className="flex-1 space-y-4 mt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {slides.map((s, i) => (
              <button key={s.url} onClick={() => setActive(i)} className={cx("rounded-xl p-4 text-left transition-all backdrop-blur-sm", i === active ? "bg-white/10 border border-white/20" : "bg-white/5 border border-transparent hover:bg-white/10")}>
                <h4 className="font-bold text-sm text-white">{s.title}</h4>
                <p className="text-xs text-white/70 mt-1">{s.description || 'Details unavailable.'}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const DefaultModal: React.FC<{ item: MediaItem }> = ({ item }) => {
  const features = item.gallery[0]?.details?.features;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
      <div className="relative bg-black flex justify-center items-center overflow-hidden">
        <ImageSafe src={item.gallery[0]?.url} alt={item.gallery[0]?.title || item.title} cover className="h-full w-full" />
      </div>
      <div className="flex flex-col h-full bg-white p-6 md:p-12 overflow-y-auto">
        <h3 className="text-4xl font-black mb-6" style={{ color: TOK.red }}>{item.title}</h3>
        <p className="text-zinc-500 mb-8">{item.summary}</p>
        <div className="flex-1 space-y-4">
          <h4 className="font-bold text-lg">Key Highlights</h4>
          <ul className="space-y-2">
            {features && features.length > 0 ? (
              features.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full flex-shrink-0" style={{ background: TOK.red }} />
                  <span className="text-zinc-700">{point}</span>
                </li>
              ))
            ) : (
              <li className="text-zinc-500">Details for this feature are not available at the moment.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

function ModalContent({ item, visual }: { item: MediaItem; visual: Visual }) {
  if (visual.type !== 'image') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 h-full">
        <div className="bg-black relative">
          <MediaVisual visual={visual} className="h-full w-full" />
        </div>
        <div className="flex flex-col h-full bg-white p-6 md:p-12 overflow-y-auto">
          <h3 className="text-4xl font-black mb-6" style={{ color: TOK.red }}>{item.title}</h3>
          <p className="text-zinc-500 mb-8">{item.summary}</p>
          <div className="flex-1 space-y-4">
            <p className="text-sm font-semibold">Video highlights: The video provides an overview of {item.title.toLowerCase()}.</p>
          </div>
        </div>
      </div>
    );
  }

  const panelMap: Record<MediaItem['id'], JSX.Element> = {
    'v6': <PerformanceModal item={item} />,
    'safety': <SafetyModal item={item} />,
    'interior': <InteriorModal item={item} />,
    'handling': <DefaultModal item={item} />,
    'quality': <DefaultModal item={item} />,
    'connect': <DefaultModal item={item} />,
  };
  return panelMap[item.id] || <DefaultModal item={item} />;
}


/* ================= Main Component ================= */
interface Props { vehicle?: VehicleModel; }

const VehicleMediaShowcase: React.FC<Props> = () => {
  const items = useMemo(() => DEMO, []);
  const [open, setOpen] = useState<{ item: MediaItem; visuals: Visual[]; index: number } | null>(null);
  const total = open?.visuals.length || 0;

  useBodyScrollLock(!!open);

  const openModal = useCallback((item: MediaItem) => {
    const visuals: Visual[] = [];
    if (item.video) {
      visuals.push({ url: '', title: item.title, type: item.video.provider, id: item.video.id });
    }
    visuals.push(...item.gallery.map(g => ({ url: g.url, title: g.title, type: 'image' as const })));
    setOpen({ item, visuals, index: 0 });
  }, []);

  const next = useCallback(() => setOpen(p => p ? { ...p, index: (p.index + 1) % total } : p), [total]);
  const prev = useCallback(() => setOpen(p => p ? { ...p, index: (p.index - 1 + total) % total } : p), [total]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setOpen(null);
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  }, [next, prev]);

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }
  }, [open, onKeyDown]);

  const openBooking = () => {
    console.log("Opening Test Drive Booking...");
  };

  const mobWrapRef = useRef<HTMLDivElement>(null);
  const [mobIndex, setMobIndex] = useState(0);
  useEffect(() => {
    const el = mobWrapRef.current;
    if (!el) return;
    const onScroll = () => {
      const w = (el.firstElementChild as HTMLElement | null)?.clientWidth || 1;
      const gap = 16;
      if (w > 0) {
        setMobIndex(Math.round(el.scrollLeft / (w + gap)));
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const thumbOf = (m: MediaItem) => m.thumbnail || m.gallery[0]?.url || "";

  return (
    <section className={TOK.container}>
      {/* Hero Video Section */}
      <div className={cx(TOK.card, TOK.radius, "relative z-20 p-3 md:p-4 mb-8")}>
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-2xl font-bold md:text-3xl">Highlights</h2>
        </div>
        <div className="rounded-xl overflow-hidden bg-black">
          <MediaVisual visual={{ url: '', title: 'Main Highlights', type: 'wistia', id: 'kvdhnonllm' }} />
        </div>
      </div>

      {/* Tiles Grid Section */}
      <div className="relative z-10">
        {/* Mobile carousel */}
        <div className="mb-6 md:hidden">
          <div
            ref={mobWrapRef}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {items.map((m) => (
              <button
                key={m.id}
                onClick={() => openModal(m)}
                className={cx(TOK.card, TOK.radius, TOK.ring, "snap-start min-w-[86%] overflow-hidden text-left")}
              >
                <div className="relative">
                  <ImageSafe src={thumbOf(m)} alt={m.title} cover className="h-44 w-full" />
                </div>
                <div className="p-4">
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{m.category}</span>
                  <h3 className="mt-1 text-base font-semibold">{m.title}</h3>
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
        <div className="hidden grid-cols-2 gap-6 md:grid lg:grid-cols-3">
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => openModal(m)}
              className={cx(TOK.card, TOK.radius, TOK.ring, "overflow-hidden text-left transition-shadow hover:shadow-md")}
            >
              <div className="relative">
                <ImageSafe src={thumbOf(m)} alt={m.title} cover className="h-56 w-full md:h-64" />
              </div>
              <div className="p-4">
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{m.category}</span>
                <h3 className="mt-1 text-lg font-semibold">{m.title}</h3>
                <p className={cx("mt-1 text-sm", TOK.muted)}>{m.summary}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal in a portal */}
      {open &&
        ReactDOM.createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-start md:items-center justify-center bg-black/70 backdrop-blur-sm p-0 md:p-6 opacity-0 animate-fade-in"
            role="dialog"
            aria-modal="true"
            onClick={() => setOpen(null)}
          >
            <div
              className={cx(
                "bg-white w-full h-[100svh] md:h-[92vh] md:max-w-[1300px] md:rounded-2xl overflow-hidden",
                "flex flex-col"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 overflow-y-auto md:overflow-hidden grid grid-cols-1 md:grid-cols-2">
                <div className="bg-black relative aspect-video md:aspect-auto">
                  <MediaVisual visual={open.visuals[open.index]} className="h-full w-full" />
                  {total > 1 && (
                    <>
                      <button
                        aria-label="Previous" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-2 text-zinc-900 shadow">‹</button>
                      <button
                        aria-label="Next" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-2 text-zinc-900 shadow">›</button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {open.visuals.map((_, i) => (
                          <span
                            key={i}
                            className={cx("h-1.5 w-1.5 rounded-full", i === open.index ? "" : "bg-white/50")}
                            style={{ background: i === open.index ? TOK.red : undefined }} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ModalContent item={open.item} visual={open.visuals[open.index]} />
                </div>
              </div>

              <div className="sticky bottom-0 z-20 flex flex-col md:flex-row items-center justify-between border-t p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <button
                  onClick={openBooking}
                  className={cx("rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90", "w-full md:w-auto mb-2 md:mb-0")}
                  style={{ background: TOK.red }}
                >
                  Book a Test Drive
                </button>
                <button
                  className="rounded-full border px-6 py-3 text-sm hover:bg-zinc-50 w-full md:w-auto md:ml-3"
                  onClick={() => setOpen(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default VehicleMediaShowcase;