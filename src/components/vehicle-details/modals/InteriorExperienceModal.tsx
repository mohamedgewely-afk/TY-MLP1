import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Car, Smartphone, Volume2, Armchair, Sun, Wind, Lightbulb, X, Info, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MobileOptimizedDialog,
  MobileOptimizedDialogContent,
  MobileOptimizedDialogHeader,
  MobileOptimizedDialogBody,
  MobileOptimizedDialogFooter,
  MobileOptimizedDialogTitle,
  MobileOptimizedDialogDescription,
} from "@/components/ui/mobile-optimized-dialog";
import CollapsibleContent from "@/components/ui/collapsible-content";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* THEME + MEDIA                                                              */
/* -------------------------------------------------------------------------- */

const BRAND_RED = "#cb0017";

/** Real interior photo for the tour spotlight */
const TOUR_BG =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true";

/** Gallery defaults (swap via props if needed) */
const DEFAULT_IMG_A =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
const DEFAULT_IMG_B =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type TabKey = "overview" | "tour" | "hotspots" | "images" | "videos";

type Hotspot = {
  x: number; y: number; // percent
  title: string; body: string;
  icon?: React.ComponentType<{ className?: string }>;
};

interface InteriorExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  videoIds?: string[];
  images?: { src: string; alt?: string }[];
  hotspotImage?: { src: string; alt?: string };
  hotspots?: Hotspot[];
}

/* -------------------------------------------------------------------------- */
/* TABS                                                                       */
/* -------------------------------------------------------------------------- */

const Tabs: React.FC<{
  active: TabKey;
  onChange: (k: TabKey) => void;
  items: { key: TabKey; label: string }[];
}> = ({ active, onChange, items }) => (
  <div className="relative">
    <div className="flex gap-1 p-1 rounded-xl border bg-white/70 backdrop-blur">
      {items.map((it) => {
        const selected = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={cn(
              "flex-1 px-3 py-1.5 rounded-lg text-sm transition border",
              selected ? "bg-black text-white border-black" : "hover:bg-black/5 border-transparent"
            )}
            aria-pressed={selected}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  </div>
);

/* -------------------------------------------------------------------------- */
/* GALLERY + YOUTUBE                                                          */
/* -------------------------------------------------------------------------- */

const ImageGallery: React.FC<{
  images: { src: string; alt?: string }[];
  caption?: string;
}> = ({ images, caption }) => {
  const [idx, setIdx] = React.useState(0);
  const prefersReduced = useReducedMotion();
  const canPrev = idx > 0;
  const canNext = idx < images.length - 1;

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 overflow-hidden" tabIndex={0}
      aria-label="Image gallery. Use arrow keys to navigate."
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" && canNext) setIdx((i) => i + 1);
        if (e.key === "ArrowLeft" && canPrev) setIdx((i) => i - 1);
      }}>
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={images[idx].src}
            src={images[idx].src}
            alt={images[idx].alt || ""}
            className="absolute inset-0 h-full w-full object-cover"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.98 }}
            animate={prefersReduced ? {} : { opacity: 1, scale: 1 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            loading="lazy"
          />
        </AnimatePresence>
      </div>

      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
        <button aria-label="Previous image" disabled={!canPrev} onClick={() => canPrev && setIdx(idx - 1)}
          className={cn("h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border",
            !canPrev && "opacity-40 pointer-events-none")}>‹</button>
        <button aria-label="Next image" disabled={!canNext} onClick={() => canNext && setIdx(idx + 1)}
          className={cn("h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border",
            !canNext && "opacity-40 pointer-events-none")}>›</button>
      </div>

      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="text-xs text-white">
          <span className="inline-block rounded-md bg-black/50 px-2 py-1 backdrop-blur-sm">
            {caption || "Swipe or use arrows"}
          </span>
        </div>
        <div className="flex gap-1">
          {images.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Go to slide ${i + 1}`}
              className={cn("h-2 w-2 rounded-full", i === idx ? "bg-white" : "bg-white/50")} />
          ))}
        </div>
      </div>

      <div className="flex gap-2 p-2 border-t bg-white/80">
        {images.map((im, i) => (
          <button key={im.src} onClick={() => setIdx(i)}
            className={cn("relative h-14 w-20 rounded-md overflow-hidden ring-1 ring-black/5", i === idx && "outline outline-2")}
            style={i === idx ? { outlineColor: BRAND_RED } : {}}
            aria-label={`Go to image ${i + 1}`}>
            <img src={im.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};

const YoutubeInline: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => {
  const [play, setPlay] = React.useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1${play ? "&autoplay=1" : ""}`;
  const poster = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-black ring-1 ring-black/5">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {!play && (
          <button onClick={() => setPlay(true)} aria-label="Play video" className="absolute inset-0 flex items-center justify-center group">
            <div className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-95 transition" style={{ backgroundImage: `url('${poster}')` }} />
            <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-sm font-medium shadow">
              <Play className="h-4 w-4" /> Play video
            </div>
          </button>
        )}
        {play && (
          <iframe className="absolute inset-0 w-full h-full" src={src} title={title} loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* HOTSPOTS                                                                   */
/* -------------------------------------------------------------------------- */

const HotspotsStage: React.FC<{
  image: { src: string; alt?: string };
  hotspots: Hotspot[];
}> = ({ image, hotspots }) => {
  const [active, setActive] = React.useState<number | null>(null);
  const [show, setShow] = React.useState(true);

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" /> Tap a dot to learn more.
        </div>
        <button onClick={() => setShow(!show)} className="text-xs underline">{show ? "Hide hotspots" : "Show hotspots"}</button>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: "56.25%" }}>
        <img src={image.src} alt={image.alt || ""} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        {show && hotspots?.map((h, i) => {
          const Icon = h.icon || Info;
          return (
            <div key={`${h.title}-${i}`} style={{ left: `${h.x}%`, top: `${h.y}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={() => setActive(active === i ? null : i)}
                className="h-5 w-5 rounded-full border bg-white/90 backdrop-blur shadow grid place-items-center"
                style={{ borderColor: BRAND_RED }}
                aria-label={h.title}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: BRAND_RED }} />
              </button>

              {active === i && (
                <div className="mt-2 w-56 rounded-lg border bg-white shadow ring-1 ring-black/5 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="h-4 w-4" style={{ color: BRAND_RED }} />
                    <div className="font-medium text-sm">{h.title}</div>
                  </div>
                  <p className="text-xs text-muted-foreground">{h.body}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* GUIDED TOUR (spotlight over photo)                                         */
/* -------------------------------------------------------------------------- */

type TourStep = {
  key: string;
  title: string;
  body: string;
  x: number; // 0..100 (percent of width)
  y: number; // 0..100 (percent of height)
  rx: number; // radiusX in %
  ry?: number; // radiusY in %, defaults to rx
  icon?: React.ComponentType<{ className?: string }>;
  metric?: { label: string; value: string }[];
};

const TOUR_STEPS: TourStep[] = [
  {
    key: "seats",
    title: "Premium Seating",
    body: "Ergonomic seats with heating & ventilation keep you fresh on every drive.",
    x: 30, y: 62, rx: 18, ry: 14,
    icon: Armchair,
    metric: [{ label: "Adjust", value: "8-way" }, { label: "Memory", value: "Driver" }],
  },
  {
    key: "ambient",
    title: "Ambient Lighting",
    body: "Subtle LED accents set the tone—elegant by day, calming at night.",
    x: 52, y: 44, rx: 28, ry: 10,
    icon: Lightbulb,
    metric: [{ label: "Palette", value: "Warm / Cool" }],
  },
  {
    key: "airflow",
    title: "Clean, Quiet Airflow",
    body: "Smart climate routes air gently through the cabin for quiet comfort.",
    x: 50, y: 40, rx: 18, ry: 12,
    icon: Wind,
    metric: [{ label: "Dual-Zone", value: "Yes" }],
  },
  {
    key: "infotainment",
    title: "Intuitive Infotainment",
    body: "Seamless smartphone integration, wireless charging and voice control.",
    x: 47, y: 52, rx: 10,
    icon: Smartphone,
    metric: [{ label: "Charging", value: "Wireless" }],
  },
  {
    key: "audio",
    title: "JBL Premium Audio",
    body: "Concert-grade clarity tuned specifically for the Camry cabin.",
    x: 18, y: 58, rx: 12,
    icon: Volume2,
    metric: [{ label: "Speakers", value: "9" }],
  },
  {
    key: "roof",
    title: "Panoramic Roof",
    body: "Let in sky and light with one-touch open/close.",
    x: 82, y: 18, rx: 16, ry: 8,
    icon: Sun,
    metric: [{ label: "Open", value: "One-touch" }],
  },
];

const SpotlightMask: React.FC<{ x: number; y: number; rx: number; ry?: number; }> = ({ x, y, rx, ry }) => {
  // We use CSS masks to cut a hole through a dark overlay.
  // Position/size are in percent, responsive by design.
  const rY = ry ?? rx;
  const mask = `radial-gradient(${rx}% ${rY}% at ${x}% ${y}%, transparent 0%, transparent 60%, rgba(0,0,0,0.6) 61%)`;
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ WebkitMaskImage: mask, maskImage: mask, background: "rgba(0,0,0,0.64)" }} />
  );
};

const GuidedTour: React.FC<{ steps?: TourStep[]; bg?: string; }> = ({ steps = TOUR_STEPS, bg = TOUR_BG }) => {
  const [i, setI] = React.useState(0);
  const s = steps[i];
  const canPrev = i > 0;
  const canNext = i < steps.length - 1;

  const Icon = s.icon || Info;

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3">
      {/* Stage */}
      <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: "56.25%" }}>
        <img src={bg} alt="Interior" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        {/* Spotlight overlay */}
        <SpotlightMask x={s.x} y={s.y} rx={s.rx} ry={s.ry} />
        {/* Pulse dot at focus center */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2"
             style={{ left: `${s.x}%`, top: `${s.y}%` }}>
          <div className="h-4 w-4 rounded-full bg-white shadow ring-2 ring-white/80" />
          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: BRAND_RED, opacity: 0.35 }} />
        </div>
      </div>

      {/* Caption */}
      <div className="mt-3 rounded-lg border bg-white/90 p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-2 rounded-md text-white" style={{ background: BRAND_RED }}>
            <Icon className="h-4 w-4" />
          </span>
          <div className="font-semibold">{s.title}</div>
        </div>
        <p className="text-sm text-muted-foreground">{s.body}</p>
        {!!s.metric?.length && (
          <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {s.metric.map((m) => (
              <div key={m.label} className="rounded-md border bg-white p-2 text-xs">
                <div className="text-muted-foreground">{m.label}</div>
                <div className="font-medium">{m.value}</div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={!canPrev} onClick={() => setI((v) => Math.max(0, v - 1))}>Prev</Button>
          <Button size="sm" onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))} style={{ background: BRAND_RED }}>
            Next
          </Button>
          <div className="ml-auto text-xs text-muted-foreground">{i + 1} / {steps.length}</div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN MODAL                                                                 */
/* -------------------------------------------------------------------------- */

const InteriorExperienceModal: React.FC<InteriorExperienceModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  videoIds = [],
  images,
  hotspotImage,
  hotspots,
}) => {
  const prefersReduced = useReducedMotion();
  const enter = prefersReduced ? {} : { opacity: 0, y: 16 };
  const entered = prefersReduced ? {} : { opacity: 1, y: 0 };

  const gallery = images?.length ? images : [
    { src: DEFAULT_IMG_A, alt: "Interior highlight 1" },
    { src: DEFAULT_IMG_B, alt: "Interior highlight 2" },
  ];

  const hotspotBg = hotspotImage || { src: DEFAULT_IMG_B, alt: "Interior with features" };
  const hotspotItems: Hotspot[] = hotspots?.length ? hotspots : [
    { x: 48, y: 70, title: "Wireless Charging", body: "Drop your phone on the pad to charge while you drive.", icon: Smartphone },
    { x: 18, y: 62, title: "JBL Speakers", body: "Crisp highs and deep lows tuned for the cabin.", icon: Volume2 },
    { x: 82, y: 26, title: "Panoramic Roof", body: "Let in sky and light with one-touch control.", icon: Sun },
    { x: 52, y: 40, title: "Ambient Lighting", body: "Set the tone with subtle LED accents.", icon: Lightbulb },
    { x: 30, y: 78, title: "Comfort Seats", body: "Heated/ventilated seats keep you fresh.", icon: Armchair },
  ];

  const tabItems = (videoIds.length
    ? ([
        { key: "overview", label: "Overview" as const },
        { key: "tour",     label: "Guided Tour" as const },
        { key: "hotspots", label: "Hotspots" as const },
        { key: "images",   label: "Images" as const },
        { key: "videos",   label: "Videos" as const },
      ])
    : ([
        { key: "overview", label: "Overview" as const },
        { key: "tour",     label: "Guided Tour" as const },
        { key: "hotspots", label: "Hotspots" as const },
        { key: "images",   label: "Images" as const },
      ])) as { key: TabKey; label: string }[];

  const [tab, setTab] = React.useState<TabKey>("tour");

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        {/* Compact header */}
        <MobileOptimizedDialogHeader className="px-3 py-2 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <MobileOptimizedDialogTitle className="text-lg font-semibold leading-tight sm:text-2xl sm:font-bold">
              Interior Experience
            </MobileOptimizedDialogTitle>
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <MobileOptimizedDialogDescription className="hidden sm:block text-base mt-1">
            Step through a clean, focused tour — then explore hotspots, images, or videos.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* HERO */}
            <motion.div initial={enter} animate={entered} transition={{ duration: 0.3 }}
              className="rounded-2xl p-4 lg:p-6 border bg-white/70 backdrop-blur ring-1 ring-black/5">
              <div className="flex items-center gap-3 mb-4">
                <Car className="h-7 w-7" style={{ color: BRAND_RED }} />
                <Badge variant="secondary" className="text-xs font-semibold" style={{ background: "#fff", border: "1px solid #eee" }}>
                  Premium Comfort
                </Badge>
              </div>

              <div className="grid lg:grid-cols-3 gap-4 mb-3">
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-xl lg:text-2xl font-bold">Crafted for you</h3>
                  <p className="text-sm text-muted-foreground">
                    A focused, story-like walkthrough that highlights what matters — fast and clear.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center rounded-lg bg-white border p-2">
                      <div className="text-xl font-bold" style={{ color: BRAND_RED }}>100.4</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">cu ft Cabin</div>
                    </div>
                    <div className="text-center rounded-lg bg-white border p-2">
                      <div className="text-xl font-bold" style={{ color: BRAND_RED }}>42.1</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Front Legroom</div>
                    </div>
                    <div className="text-center rounded-lg bg-white border p-2">
                      <div className="text-xl font-bold" style={{ color: BRAND_RED }}>38.0</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Rear Legroom</div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-3">
                  <Tabs active={tab} onChange={setTab} items={tabItems} />
                  <div className="text-xs text-muted-foreground">Overview · Guided Tour · Hotspots · Images · Videos</div>
                </div>
              </div>
            </motion.div>

            {/* TOUR TAB */}
            {tab === "tour" && (
              <motion.div key="tour" initial={enter} animate={entered}>
                <GuidedTour />
              </motion.div>
            )}

            {/* HOTSPOTS TAB */}
            {tab === "hotspots" && (
              <motion.div key="hotspots" initial={enter} animate={entered}>
                <HotspotsStage image={hotspotBg} hotspots={hotspotItems} />
              </motion.div>
            )}

            {/* IMAGES TAB */}
            {tab === "images" && (
              <motion.div key="images" initial={enter} animate={entered}>
                <ImageGallery images={gallery} caption="Swipe or tap thumbnails to explore the cabin" />
              </motion.div>
            )}

            {/* VIDEOS TAB */}
            {tab === "videos" && (videoIds?.length ?? 0) > 0 && (
              <motion.div key="videos" initial={enter} animate={entered}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {videoIds!.map((id) => (
                    <YoutubeInline key={id} videoId={id} title="Interior feature video" />
                  ))}
                </div>
              </motion.div>
            )}

            {/* OVERVIEW TAB */}
            {tab === "overview" && (
              <motion.div key="overview" initial={enter} animate={entered} className="space-y-4">
                <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    Feature Catalog
                    <span className="text-xs text-muted-foreground ml-2">Expandable sections</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: Smartphone, title: "Tech Integration", features: ["Wireless Charging", "Multiple USB", "12V Outlets", "Smartphone Integration"] },
                      { icon: Lightbulb, title: "Lighting", features: ["LED Cabin Lights", "Ambient Accents", "Reading Lamps", "Illuminated Entry"] },
                      { icon: Wind, title: "Air Quality", features: ["Cabin Filter", "Fresh Air Mode", "Recirculation", "Allergen Reduction"] },
                      { icon: Armchair, title: "Comfort", features: ["Heated & Ventilated", "Power Adjust", "Memory Seat", "Supportive Foam"] },
                    ].map((group, index) => (
                      <CollapsibleContent
                        key={group.title}
                        defaultOpen={index === 0}
                        title={
                          <div className="flex items-center gap-3">
                            <group.icon className="h-5 w-5 text-black/70" />
                            <span className="font-medium">{group.title}</span>
                          </div>
                        }
                      >
                        <div className="grid gap-2 sm:grid-cols-2">
                          {group.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: BRAND_RED }} />
                              <span className="text-sm">{f}</span>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </MobileOptimizedDialogBody>

        {/* CTA */}
        <MobileOptimizedDialogFooter className="px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex w-full sm:w-auto sm:ml-auto gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onBookTestDrive} style={{ background: BRAND_RED }}>
              Book Test Drive
            </Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default InteriorExperienceModal;
