import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Car, Smartphone, Volume2, Armchair, Sun, Wind, Lightbulb, X, Play, Pause
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

/** Real interior photo (applies to all scenes, can be overridden per scene) */
const INTERIOR_BG =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true";

/** Gallery defaults (swap via props if needed) */
const DEFAULT_IMG_A =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
const DEFAULT_IMG_B =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type TabKey = "overview" | "cineloop" | "images" | "videos";

interface InteriorExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  videoIds?: string[];
  images?: { src: string; alt?: string }[];
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
/* CINELOOP (auto-play scenes, no tapping required)                            */
/* -------------------------------------------------------------------------- */

type Scene = {
  key: string;
  title: string;
  caption: string;
  ambient: string;     // ambient bar color
  audioLevel: number;  // 0..100
  climate: "cool" | "warm" | "neutral";
  roofPct: number;     // 0..100 (indicator only)
  leftSeatHeat: 0 | 1 | 2;
  rightSeatHeat: 0 | 1 | 2;
  uiAccent?: string;
  bg?: string;         // optional override image
  micro?: { icon: React.ReactNode; label: string; value: string }[];
};

const scenes: Scene[] = [
  {
    key: "commute",
    title: "Morning Commute",
    caption: "Quiet, focused start. Cool air, subtle light, balanced audio.",
    ambient: "#0EA5E9",
    audioLevel: 28,
    climate: "cool",
    roofPct: 0,
    leftSeatHeat: 0,
    rightSeatHeat: 0,
    uiAccent: "#0EA5E9",
    micro: [
      { icon: <Wind className="h-3.5 w-3.5" />, label: "Air", value: "Fresh" },
      { icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Ambient", value: "Cool" },
      { icon: <Volume2 className="h-3.5 w-3.5" />, label: "Audio", value: "28%" },
    ],
  },
  {
    key: "family",
    title: "Family Trip",
    caption: "Comfort for everyone. Gentle climate, roof ajar, playlists on.",
    ambient: BRAND_RED,
    audioLevel: 38,
    climate: "neutral",
    roofPct: 35,
    leftSeatHeat: 1,
    rightSeatHeat: 1,
    uiAccent: BRAND_RED,
    micro: [
      { icon: <Armchair className="h-3.5 w-3.5" />, label: "Seats", value: "Warm L1" },
      { icon: <Sun className="h-3.5 w-3.5" />, label: "Roof", value: "35%" },
      { icon: <Smartphone className="h-3.5 w-3.5" />, label: "Charging", value: "Wireless" },
    ],
  },
  {
    key: "night",
    title: "Night Drive",
    caption: "Calm cabin. Warm LEDs, low fan, richer soundstage.",
    ambient: "#4F46E5",
    audioLevel: 22,
    climate: "warm",
    roofPct: 0,
    leftSeatHeat: 0,
    rightSeatHeat: 0,
    uiAccent: "#4F46E5",
    micro: [
      { icon: <Lightbulb className="h-3.5 w-3.5" />, label: "Ambient", value: "Indigo" },
      { icon: <Volume2 className="h-3.5 w-3.5" />, label: "Audio", value: "22%" },
      { icon: <Car className="h-3.5 w-3.5" />, label: "Mode", value: "Comfort" },
    ],
  },
];

/* Non-positional overlays: no guessing exact seat/vent locations */
const AmbientBar: React.FC<{ color: string }> = ({ color }) => (
  <div className="absolute left-6 right-6 bottom-6 h-2 rounded-full" style={{ background: color, opacity: 0.9, filter: "blur(1px)" }} />
);

const RoofIndicator: React.FC<{ pct: number }> = ({ pct }) => (
  <div className="absolute left-1/2 -translate-x-1/2 top-3 w-[60%] max-w-[420px] rounded-full bg-black/30 backdrop-blur text-white px-3 py-1.5 text-xs">
    Panoramic roof: <span className="font-medium">{pct}%</span>
    <div className="mt-1 h-1 w-full rounded bg-white/20 overflow-hidden">
      <div className="h-full bg-white" style={{ width: `${pct}%` }} />
    </div>
  </div>
);

const AudioMeter: React.FC<{ level: number }> = ({ level }) => (
  <div className="absolute right-3 bottom-3 rounded-md border bg-white/90 shadow px-2 py-1">
    <div className="text-[10px] text-muted-foreground">JBL</div>
    <div className="mt-1 h-1 w-24 rounded bg-black/10 overflow-hidden">
      <div className="h-full" style={{ width: `${level}%`, background: "#111827" }} />
    </div>
  </div>
);

const SeatBadges: React.FC<{ left: 0|1|2; right: 0|1|2; accent: string }> = ({ left, right, accent }) => (
  <div className="absolute left-3 bottom-3 flex gap-2">
    {([left, right] as const).map((lvl, i) => (
      <div key={i} className="rounded-md border bg-white/90 shadow px-2 py-1 text-xs flex items-center gap-1.5">
        <Armchair className="h-3.5 w-3.5" style={{ color: accent }} />
        <span>Seat {i === 0 ? "L" : "R"}</span>
        <span className="ml-1 font-medium">{lvl === 0 ? "Off" : `Warm L${lvl}`}</span>
      </div>
    ))}
  </div>
);

const ClimateWash: React.FC<{ type: Scene["climate"] }> = ({ type }) => {
  // A soft, animated wash at mid-height: blue (cool) / red (warm) / subtle gray (neutral)
  const color = type === "cool" ? "rgba(14,165,233,.25)" : type === "warm" ? "rgba(203,0,23,.20)" : "rgba(0,0,0,.10)";
  return (
    <motion.div
      className="absolute left-0 right-0 top-1/3 h-1/3"
      style={{ background: `linear-gradient(to bottom, transparent, ${color}, transparent)` }}
      initial={{ opacity: 0.0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    />
  );
};

const MicroStats: React.FC<{ items?: Scene["micro"]; accent?: string }> = ({ items, accent = BRAND_RED }) => {
  if (!items?.length) return null;
  return (
    <div className="absolute left-3 top-3 rounded-md border bg-white/90 shadow px-2 py-1.5">
      <div className="grid grid-cols-3 gap-2">
        {items.map((m) => (
          <div key={m.label} className="flex items-center gap-1">
            <span className="text-white p-1 rounded" style={{ background: accent }}>{m.icon}</span>
            <span className="text-[10px] text-muted-foreground">{m.label}</span>
            <span className="text-[11px] font-medium">{m.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SceneCard: React.FC<{ scene: Scene }> = ({ scene }) => {
  const img = scene.bg || INTERIOR_BG;
  return (
    <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-black/5 border bg-black/5" style={{ paddingTop: "56.25%" }}>
      <img src={img} alt="Interior" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      <ClimateWash type={scene.climate} />
      <AmbientBar color={scene.ambient} />
      <RoofIndicator pct={scene.roofPct} />
      <AudioMeter level={scene.audioLevel} />
      <SeatBadges left={scene.leftSeatHeat} right={scene.rightSeatHeat} accent={scene.uiAccent || BRAND_RED} />
      <MicroStats items={scene.micro} accent={scene.uiAccent || BRAND_RED} />
    </div>
  );
};

const ProgressDots: React.FC<{ total: number; index: number; accent?: string }> = ({ total, index, accent = BRAND_RED }) => (
  <div className="flex items-center justify-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <div key={i} className="h-1.5 w-6 rounded-full" style={{ background: i === index ? accent : "rgba(0,0,0,.12)" }} />
    ))}
  </div>
);

const CineLoop: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);

  // Auto-advance every 4.5s (reduced motion = paused by default)
  React.useEffect(() => {
    if (prefersReduced || !playing) return;
    const t = setInterval(() => setI((v) => (v + 1) % scenes.length), 4500);
    return () => clearInterval(t);
  }, [playing, prefersReduced]);

  const scene = scenes[i];

  // swipe to switch (mobile)
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => (startX = e.touches[0].clientX);
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) setI((v) => (dx < 0 ? (v + 1) % scenes.length : (v - 1 + scenes.length) % scenes.length));
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className="rounded-2xl p-3 border bg-white/70 backdrop-blur ring-1 ring-black/5">
      {/* Title + play/pause */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-sm font-semibold" style={{ color: scene.uiAccent || BRAND_RED }}>{scene.title}</div>
          <div className="text-xs text-muted-foreground">{scene.caption}</div>
        </div>
        <button
          className="rounded-full border bg-white/90 shadow px-2.5 py-1.5 text-sm inline-flex items-center gap-1"
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? "Pause" : "Play"}
        </button>
      </div>

      {/* Scene */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.key}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          <SceneCard scene={scene} />
        </motion.div>
      </AnimatePresence>

      {/* Dots */}
      <div className="mt-3">
        <ProgressDots total={scenes.length} index={i} accent={scene.uiAccent || BRAND_RED} />
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
}) => {
  const prefersReduced = useReducedMotion();
  const enter = prefersReduced ? {} : { opacity: 0, y: 16 };
  const entered = prefersReduced ? {} : { opacity: 1, y: 0 };

  const gallery = images?.length ? images : [
    { src: DEFAULT_IMG_A, alt: "Interior highlight 1" },
    { src: DEFAULT_IMG_B, alt: "Interior highlight 2" },
  ];

  const tabItems = (videoIds.length
    ? ([
        { key: "overview",  label: "Overview" as const },
        { key: "cineloop",  label: "CineLoop" as const },
        { key: "images",    label: "Images" as const },
        { key: "videos",    label: "Videos" as const },
      ])
    : ([
        { key: "overview",  label: "Overview" as const },
        { key: "cineloop",  label: "CineLoop" as const },
        { key: "images",    label: "Images" as const },
      ])) as { key: TabKey; label: string }[];

  const [tab, setTab] = React.useState<TabKey>("cineloop");

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        {/* Compact header (mobile-friendly) */}
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
            Lean back—your interior comes alive automatically. Swipe to switch scenes anytime.
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
                    A smooth, hands-free showcase of real-world cabin moments.
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
                  <div className="text-xs text-muted-foreground">Overview · CineLoop · Images · Videos</div>
                </div>
              </div>
            </motion.div>

            {/* CINELOOP TAB */}
            {tab === "cineloop" && (
              <motion.div key="cineloop" initial={enter} animate={entered}>
                <CineLoop />
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
