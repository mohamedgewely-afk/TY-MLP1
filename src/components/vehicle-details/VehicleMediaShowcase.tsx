// src/components/vehicle-details/VehicleMediaShowcase.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import type { VehicleModel } from "@/types/vehicle"; // Assuming VehicleModel is defined elsewhere

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

const DEMO: MediaItem[] = [
  {
    id: "v6",
    category: "Performance",
    title: "V6 Twin-Turbo",
    summary: "400+ hp, broad torque band, efficient cruising.",
    kind: "image",
    variant: "performance",
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true", title: "Cooling", details: { overview: "3.5L V6 TT engineered for instant response.", specs: ["400+ hp", "0–60 in 4.2s"] } },
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true", title: "Turbo", details: { specs: ["VGT turbines", "Low-mass impellers"], features: ["Wider band", "Low lag"] } },
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
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    gallery: [
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/561ac4b4-3604-4e66-ae72-83e2969d7d65/items/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true", title: "Center Console", details: { specs: ['12.3" display', "Tri-zone climate"], features: ["Voice control", "Wireless charging"] } },
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true", title: "Seating", details: { specs: ["Heated/ventilated", "Multi-way adjust"], features: ["Memory", "Lumbar"] } },
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
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    video: { provider: "wistia", id: "kvdhnonllm", autoplay: true },
    gallery: [
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true", title: "Sensors", details: { overview: "ADAS suite: PCS, LTA, ACC, BSM.", specs: ["PCS", "LTA", "ACC", "BSM"] } },
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
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
    gallery: [
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true", title: "Adaptive Dampers", details: { specs: ["Active dampers", "Torque vectoring"], features: ["AWD grip", "Drive modes"] } },
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
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-87e5-c9a9c22fe929?binary=true&mformat=true",
    gallery: [
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true", title: "Materials", details: { specs: ["HS steel", "Multi-stage paint"], features: ["Laser gap checks", "Robotic assembly"] } },
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
    thumbnail: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
    gallery: [
      { url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true", title: "Infotainment", details: { specs: ["Apple CarPlay", "Android Auto", "Wi-Fi hotspot"], tech: ["Cloud services", "OTA"] } },
    ],
    badges: ["CarPlay", "OTA"],
  },
];

/* ================= Variant-Specific Components (Unique UI/UX) ================= */
const SpecCard: React.FC<{ title: string; bullets?: string[]; accentClass?: string }> = ({ title, bullets, accentClass }) => (
  <div className={cx(TOK.card, "rounded-xl p-4")}>
    <h6 className={cx("mb-2 font-semibold", accentClass)}>{title}</h6>
    <ul className="space-y-2 text-sm">
      {bullets?.slice(0, 6).map((b, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: TOK.red }} />
          <span className="text-zinc-700">{b}</span>
        </li>
      )) || <p className="text-zinc-500">—</p>}
    </ul>
  </div>
);

// Performance: Interactive speed/torque visual
const PerformancePanel = () => {
  const [rpm, setRpm] = useState(0);
  const accent = VARIANT.performance.accent;

  useEffect(() => {
    const i = setInterval(() => setRpm((p) => (p < 6000 ? p + 500 : 0)), 100);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="space-y-4">
      <div className="relative h-44 grid place-items-center rounded-xl overflow-hidden bg-red-50/70">
        <div className="relative h-28 w-28 md:h-36 md:w-36 rounded-full border-4 border-red-500">
          <div className="absolute inset-0 grid place-items-center text-sm font-bold text-red-800">
            <span className="text-xs text-red-700">RPM</span> {rpm}
          </div>
          <div className="absolute inset-0 border-r-4 border-red-800 origin-center transition-transform duration-100 ease-linear"
               style={{ transform: `rotate(${rpm / 20}deg)` }} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <SpecCard title="Core Specs" bullets={["3.5L V6 TT", "400+ hp"]} accentClass={accent} />
        <SpecCard title="Performance Tech" bullets={["Direct injection", "Low-lag turbos"]} accentClass={accent} />
      </div>
    </div>
  );
};

// Safety: Clickable hotspots on a car diagram
const SafetyPanel = () => {
  const [active, setActive] = useState("PCS");
  const accent = VARIANT.safety.accent;
  const features = useMemo(() => ([
    { id: "PCS", name: "Pre-Collision", desc: "Monitors for frontal collisions, can apply brakes." },
    { id: "LTA", name: "Lane Trace Assist", desc: "Helps keep the vehicle centered in its lane." },
    { id: "BSM", name: "Blind Spot Monitor", desc: "Warns of vehicles in your blind spots." },
  ]), []);

  return (
    <div className="space-y-4">
      <div className="relative p-2 rounded-xl bg-blue-50/70 grid place-items-center">
        <ImageSafe src="https://i.imgur.com/example-car.png" alt="Car safety diagram" className="w-full h-auto" />
        <div className="absolute left-[20%] top-[40%] h-5 w-5 rounded-full border-2 border-blue-500 bg-blue-200 cursor-pointer" onClick={() => setActive("PCS")} />
        <div className="absolute left-[70%] top-[30%] h-5 w-5 rounded-full border-2 border-blue-500 bg-blue-200 cursor-pointer" onClick={() => setActive("LTA")} />
      </div>
      <h6 className={cx("text-xl font-bold", accent)}>Active Safety Feature Details</h6>
      <div className="flex flex-wrap gap-2">
        {features.map((f) => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={cx("rounded-full px-4 py-1.5 text-sm font-medium",
              f.id === active ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200")}
          >
            {f.name}
          </button>
        ))}
      </div>
      <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 text-sm">
        <p className="font-semibold text-blue-800">{features.find(f => f.id === active)?.name}</p>
        <p className="text-blue-700">{features.find(f => f.id === active)?.desc}</p>
      </div>
    </div>
  );
};

// Other Panels (Layouts are different)
const InteriorPanel = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SpecCard title="Infotainment" bullets={["12.3” touchscreen", "Wireless charging"]} accentClass={VARIANT.interior.accent} />
    <SpecCard title="Materials" bullets={["Premium leather", "Soft-touch finishes"]} accentClass={VARIANT.interior.accent} />
  </div>
);

const QualityPanel = () => (
  <div className="space-y-4">
    <h6 className={cx("text-lg font-bold", VARIANT.quality.accent)}>Toyota's Commitment to Quality</h6>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SpecCard title="Build" bullets={["High-strength steel", "Precision robotics"]} accentClass={VARIANT.quality.accent} />
      <SpecCard title="Durability" bullets={["Multi-stage paint", "Corrosion resistance"]} accentClass={VARIANT.quality.accent} />
    </div>
  </div>
);

const TechnologyPanel = () => (
  <div className="space-y-4">
    <div className="p-4 rounded-xl border border-cyan-200 bg-cyan-50 flex items-center gap-4">
      <div className="h-10 w-10 bg-cyan-600 rounded-full flex-shrink-0" />
      <div>
        <h6 className="font-semibold text-cyan-800">OTA Updates</h6>
        <p className="text-sm text-cyan-700">Seamlessly add new features and fix issues over the air.</p>
      </div>
    </div>
    <SpecCard title="Connectivity" bullets={["Apple CarPlay", "Android Auto", "Wi-Fi Hotspot"]} accentClass={VARIANT.technology.accent} />
  </div>
);

const HandlingPanel = () => (
  <div className="space-y-4">
    <h6 className={cx("text-lg font-bold", VARIANT.handling.accent)}>Masterful Driving Dynamics</h6>
    <ul className="flex flex-col gap-2 p-4 rounded-xl bg-emerald-50/70">
      {["Adaptive Variable Suspension", "Multi-Terrain Select", "Active Torque Control"].map((f) => (
        <li key={f} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-600" />
          <span className="font-medium text-emerald-800">{f}</span>
        </li>
      ))}
    </ul>
  </div>
);

function ModalPanelContent({ v }: { v: Variant }) {
  switch (v) {
    case "performance": return <PerformancePanel />;
    case "safety": return <SafetyPanel />;
    case "interior": return <InteriorPanel />;
    case "quality": return <QualityPanel />;
    case "technology": return <TechnologyPanel />;
    case "handling": return <HandlingPanel />;
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
      {/* Hero Video - Floating on top of the tiles */}
      <div className={cx(TOK.card, TOK.radius, "relative z-10 p-3 md:p-4 mb-8 -mt-8")}>
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold">Hero Video</span>
          <h2 className="text-2xl font-bold md:text-3xl">Highlights</h2>
        </div>
        <div className="md:max-h-[420px]">
          <WistiaEmbed id={topWistiaId} aspect={16 / 9} muted autoPlay className="overflow-hidden rounded-xl" />
        </div>
      </div>

      {/* Tiles Grid */}
      <div className="relative z-0">
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
                "flex flex-col",
                "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
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
                  <button className="rounded-full border px-3 py-2 hover:bg-zinc-50 md:hidden" onClick={() => setOpen(null)}>
                    Close
                  </button>
                </div>
              </div>

              {/* Body: Visual and unique Content area */}
              <div className="flex-1 overflow-y-auto grid md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
                {/* Visual */}
                <div className="relative bg-black md:rounded-l-2xl">
                  <ImageSafe src={open.gallery[0]?.url || open.thumbnail} alt={open.title} cover className="h-full w-full object-contain" />
                </div>

                {/* Unique Content Panel */}
                <div className="flex flex-col bg-white md:rounded-r-2xl min-h-0">
                  <div className="overflow-y-auto p-4 flex-1">
                    <div className={cx("mb-4 rounded-xl border border-zinc-200/60 p-4", VARIANT[open.variant].slab)}>
                      <h5 className={cx("mb-1 text-xl font-bold", VARIANT[open.variant].accent)}>
                        {open.title}
                      </h5>
                      <p className={TOK.muted}>{open.summary}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {open.badges?.map((b) => (
                        <span key={b} className={cx("rounded-full px-2 py-1 text-xs", VARIANT[open.variant].chip)}>
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="pb-4"><ModalPanelContent v={open.variant} /></div>
                  </div>
                </div>
              </div>

              {/* Fixed Bottom Bar */}
              <div className="sticky bottom-0 z-20 flex items-center justify-end border-t p-4 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <button
                  onClick={openBooking}
                  className={cx("rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90", "w-full md:w-auto")}
                  style={{ background: TOK.red }}
                >
                  Book Test Drive
                </button>
                <button 
                  className="ml-3 hidden md:inline-flex rounded-full border px-4 py-2 text-sm hover:bg-zinc-50" 
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