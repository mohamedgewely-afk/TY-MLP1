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

/* ================= Types & Mocks ================= */
type MediaItem = {
  id: "v6" | "interior" | "safety" | "handling" | "quality" | "connect";
  category: string;
  title: string;
  summary: string;
  kind: "image" | "video";
  thumbnail: string;
  gallery: { url: string; title: string; details?: Record<string, string[]> }[];
  video?: { provider: "wistia"; id: string; autoplay?: boolean };
};

const DEMO: MediaItem[] = [
  {
    id: "v6",
    category: "Performance",
    title: "V6 Twin-Turbo",
    summary: "Dynamic power and torque on demand.",
    kind: "image",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [{ url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true", title: "Engine" }],
  },
  {
    id: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "A suite of active safety systems.",
    kind: "video",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    video: { provider: "wistia", id: "kvdhnonllm", autoplay: true },
    gallery: [{ url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true", title: "PCS" }],
  },
  {
    id: "interior",
    category: "Interior",
    title: "Driver-Focused Cabin",
    summary: "Comfort and intuitive technology.",
    kind: "image",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    gallery: [{ url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/561ac4b4-3604-4e66-ae72-83e2969d7d65/items/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true", title: "Console" }],
  },
  {
    id: "handling",
    category: "Performance",
    title: "Chassis Dynamics",
    summary: "Responsive handling and ride comfort.",
    kind: "image",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
    gallery: [{ url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true", title: "Dampers" }],
  },
  {
    id: "quality",
    category: "Quality",
    title: "Build Quality",
    summary: "High-strength materials and precise assembly.",
    kind: "image",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-87e5-c9a9c22fe929?binary=true&mformat=true",
    gallery: [{ url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true", title: "Materials" }],
  },
  {
    id: "connect",
    category: "Technology",
    title: "Connected Services",
    summary: "Stay connected with your vehicle.",
    kind: "image",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    gallery: [{ url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true", title: "Infotainment" }],
  },
];

/* ================= Custom Modals (Unique & Interactive) ================= */

// Performance Modal: Dynamic, multi-panel design
const PerformanceModal = () => {
  const [active, setActive] = useState('hp');
  const metrics = useMemo(() => ([
    { id: 'hp', title: 'Horsepower', value: '400', unit: 'hp' },
    { id: 'torque', title: 'Torque', value: '350', unit: 'lb-ft' },
  ]), []);

  const activeMetric = metrics.find(m => m.id === active)!;
  const barHeight = { hp: 'h-[75%]', torque: 'h-[65%]' };
  const graphText = "This chart visualizes the engine's power output.";

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8">
        <h3 className="text-4xl font-black">Power & Efficiency</h3>
        <p className="max-w-2xl text-zinc-500">The V6 Twin-Turbo is engineered for both exhilarating performance and practical efficiency, with a broad torque curve for instant acceleration.</p>

        <div className="flex gap-4">
          {metrics.map(m => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={cx("flex-1 p-4 text-left rounded-xl border transition-colors", active === m.id ? "bg-black text-white" : "bg-white border-zinc-200 hover:bg-zinc-50")}
            >
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black" style={{ color: active === m.id ? 'white' : TOK.red }}>{m.value}</span>
                <span className="text-lg font-semibold">{m.unit}</span>
              </div>
              <p className="mt-1 text-sm font-semibold">{m.title}</p>
            </button>
          ))}
        </div>

        <div className="p-6 rounded-xl border border-zinc-200">
          <h4 className="text-lg font-bold mb-4">Performance Visualization</h4>
          <div className="relative flex items-end h-40 bg-zinc-50 rounded-lg p-2 gap-2">
            <div className="flex-1 flex flex-col justify-end items-center">
              <div className={cx("w-full bg-red-500 rounded-t-sm transition-[height] duration-500 ease-out", active === 'hp' ? 'h-[75%]' : 'h-[65%]')} />
              <span className="text-xs mt-1 font-medium">Actual</span>
            </div>
            <div className="flex-1 flex flex-col justify-end items-center">
              <div className="w-full h-[60%] bg-zinc-300 rounded-t-sm" />
              <span className="text-xs mt-1 font-medium">Competitor</span>
            </div>
            <p className="absolute bottom-2 left-2 text-xs text-zinc-400">{graphText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Safety Modal: Interactive diagram with list
const SafetyModal = () => {
  const [activeFeature, setActiveFeature] = useState('pcs');
  const features = useMemo(() => ([
    { id: 'pcs', name: 'Pre-Collision System', desc: 'Warns of frontal collisions and applies brakes.' },
    { id: 'lta', name: 'Lane Tracing Assist', desc: 'Helps keep the vehicle centered in its lane.' },
    { id: 'bsm', name: 'Blind Spot Monitor', desc: 'Alerts you to vehicles in your blind spots.' },
  ]), []);
  const diagramUrl = "https://i.imgur.com/example-car.png";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
      <div className="relative bg-black flex justify-center items-center overflow-hidden">
        <ImageSafe src={diagramUrl} alt="Safety diagram" className="h-full w-full object-contain" />
        <div className={cx("absolute h-10 w-10 bg-red-500 rounded-full opacity-60 animate-pulse", activeFeature === 'pcs' ? 'top-1/2 left-1/4' : activeFeature === 'lta' ? 'top-1/4 right-1/4' : 'bottom-1/4 right-1/4')} />
      </div>
      <div className="flex flex-col h-full bg-white p-6 md:p-12 overflow-y-auto">
        <h3 className="text-4xl font-black mb-6">Toyota Safety Sense</h3>
        <p className="text-zinc-500 mb-8">Our suite of safety features is designed to give you peace of mind on the road.</p>
        <div className="flex-1 space-y-4">
          {features.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFeature(f.id)}
              className={cx("p-4 w-full text-left rounded-xl border border-zinc-200 transition-colors", activeFeature === f.id ? "bg-black text-white" : "hover:bg-zinc-50")}
            >
              <h4 className="font-semibold" style={{ color: activeFeature === f.id ? 'white' : TOK.red }}>{f.name}</h4>
              <p className={cx("text-sm mt-1", activeFeature === f.id ? "text-zinc-300" : "text-zinc-600")}>{f.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Interior Modal: Immersive full-screen overlay
const InteriorModal = () => (
  <div className="relative h-full bg-black">
    <ImageSafe
      src="https://dam.alfuttaim.com/dx/api/dam/v1/collections/561ac4b4-3604-4e66-ae72-83e2969d7d65/items/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true"
      alt="Interior"
      cover
      className="h-full w-full object-cover"
    />
    <div className="absolute inset-0 bg-black/50 p-6 md:p-12 flex flex-col justify-end">
      <h3 className="text-4xl font-black text-white mb-2">Driver-Focused Cabin</h3>
      <p className="text-white/80 max-w-2xl">A spacious and intuitive cabin designed to put you in complete control. Every surface is crafted with a focus on quality and comfort.</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {[
          { title: "Premium Leather", desc: "Crafted for a luxurious feel and durability." },
          { title: "Intuitive HMI", desc: "Controls are where you need them, without distraction." },
          { title: "Digital Cockpit", desc: "A customizable display for key information." },
          { title: "Ambient Lighting", desc: "Set the mood with adjustable lighting." },
        ].map((f, i) => (
          <div key={i} className="p-4 rounded-xl border border-white/30 backdrop-blur-sm bg-white/10 text-white">
            <h4 className="font-bold text-sm" style={{ color: TOK.red }}>{f.title}</h4>
            <p className="text-xs text-white/80 mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Tech Modal: Expandable Cards
const TechnologyModal = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const techFeatures = useMemo(() => ([
    { id: 'carplay', title: 'Apple CarPlay', desc: 'Seamlessly integrate your iPhone for navigation, music, and more.' },
    { id: 'ota', title: 'OTA Updates', desc: 'Receive software updates wirelessly, keeping your car current.' },
    { id: 'connect', title: 'Connected Services', desc: 'Access remote start, vehicle health reports, and more from your phone.' },
  ]), []);

  return (
    <div className="flex flex-col h-full bg-white p-6 md:p-12 overflow-y-auto">
      <h3 className="text-4xl font-black mb-6">Innovative Technology</h3>
      <p className="text-zinc-500 mb-8">Stay connected and in control with a suite of smart technology features.</p>
      <div className="flex-1 space-y-4">
        {techFeatures.map(f => (
          <div key={f.id} className="p-4 rounded-xl border border-zinc-200">
            <button onClick={() => setExpanded(expanded === f.id ? null : f.id)} className="flex justify-between items-center w-full text-left">
              <h4 className="font-semibold text-lg" style={{ color: TOK.red }}>{f.title}</h4>
              <span className="text-2xl">{expanded === f.id ? '−' : '+'}</span>
            </button>
            {expanded === f.id && (
              <p className="text-sm text-zinc-600 mt-2 animate-fade-in-down">{f.desc}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Default Modals for the remaining tiles
const DefaultModal = ({ title, summary, imageUrl }: { title: string; summary: string; imageUrl: string; }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 h-full">
    <div className="relative bg-black flex justify-center items-center overflow-hidden">
      <ImageSafe src={imageUrl} alt={title} className="h-full w-full object-contain" />
    </div>
    <div className="flex flex-col h-full bg-white p-6 md:p-12 overflow-y-auto">
      <h3 className="text-4xl font-black mb-6" style={{ color: TOK.red }}>{title}</h3>
      <p className="text-zinc-500 mb-8">{summary}</p>
      <div className="flex-1 space-y-4">
        <h4 className="font-bold text-lg">Key Highlights</h4>
        <ul className="space-y-2">
          {["Built with high-strength materials.", "Ensures a confident and composed ride.", "Undergoes rigorous testing."].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full flex-shrink-0" style={{ background: TOK.red }} />
              <span className="text-zinc-700">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

function ModalPanelContent({ item }: { item: MediaItem }) {
  switch (item.id) {
    case "v6": return <PerformanceModal />;
    case "safety": return <SafetyModal />;
    case "interior": return <InteriorModal />;
    case "connect": return <TechnologyModal />;
    case "handling": return <DefaultModal title={item.title} summary={item.summary} imageUrl={item.gallery[0].url} />;
    case "quality": return <DefaultModal title={item.title} summary={item.summary} imageUrl={item.gallery[0].url} />;
    default: return null;
  }
}

/* ================= Main Component ================= */
interface Props { vehicle: VehicleModel; }

const VehicleMediaShowcase: React.FC<Props> = () => {
  const items = useMemo(() => DEMO, []);
  const topWistiaId = "kvdhnonllm";
  const [open, setOpen] = useState<MediaItem | null>(null);

  useBodyScrollLock(!!open);

  const openBooking = () => {
    console.log("Opening Test Drive Booking...");
    try {
      window.dispatchEvent(new CustomEvent("open-booking", { detail: { source: "VehicleMediaShowcase" } }));
      (document.querySelector("[data-open-booking]") as HTMLButtonElement | null)?.click();
    } catch { }
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

  return (
    <section className={TOK.container}>
      {/* Hero Video Section */}
      <div className={cx(TOK.card, TOK.radius, "relative z-20 p-3 md:p-4 mb-8")}>
        <div className="mb-3 flex items-center gap-3">
          <h2 className="text-2xl font-bold md:text-3xl">Highlights</h2>
        </div>
        <div className="md:max-h-[420px]">
          <WistiaEmbed id={topWistiaId} aspect={16 / 9} muted autoPlay className="overflow-hidden rounded-xl" />
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
                onClick={() => setOpen(m)}
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
              onClick={() => setOpen(m)}
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
              {/* Main Modal Content */}
              <div className="flex-1 overflow-y-auto">
                <ModalPanelContent item={open} />
              </div>

              {/* Fixed Bottom Bar */}
              <div className="sticky bottom-0 z-20 flex items-center justify-between border-t p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <button
                  onClick={openBooking}
                  className={cx("rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors hover:opacity-90", "w-full md:w-auto")}
                  style={{ background: TOK.red }}
                >
                  Book a Test Drive
                </button>
                <button 
                  className="ml-3 hidden md:inline-flex rounded-full border px-6 py-3 text-sm hover:bg-zinc-50" 
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