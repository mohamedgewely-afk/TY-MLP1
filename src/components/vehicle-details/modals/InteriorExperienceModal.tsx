import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Car, Thermometer, Volume2, Smartphone, Armchair, Sun, Wind, Coffee,
  X, Info, Play, Lightbulb, Sparkles, Wand2, Gauge, BatteryCharging
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
/*                                   THEME                                    */
/* -------------------------------------------------------------------------- */

const BRAND_RED = "#cb0017";

/* Gallery defaults (swap/override via props if you want) */
const DEFAULT_IMG_A =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
const DEFAULT_IMG_B =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";

/* Optional hotspots background (you can override via props) */
const HOTSPOT_BG =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type TabKey = "overview" | "composer" | "hotspots" | "images" | "videos";

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
/*                                   TABS                                     */
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
/*                               IMAGE GALLERY                                */
/* -------------------------------------------------------------------------- */

const ImageGallery: React.FC<{
  images: { src: string; alt?: string }[];
  caption?: string;
}> = ({ images, caption }) => {
  const [idx, setIdx] = React.useState(0);
  const prefersReduced = useReducedMotion();
  const canPrev = idx > 0;
  const canNext = idx < images.length - 1;

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" && canNext) setIdx((i) => i + 1);
    if (e.key === "ArrowLeft" && canPrev) setIdx((i) => i - 1);
  };

  return (
    <div
      className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 overflow-hidden"
      tabIndex={0}
      onKeyDown={onKey}
      aria-label="Image gallery. Use arrow keys to navigate."
    >
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

      {/* Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
        <button
          aria-label="Previous image"
          disabled={!canPrev}
          onClick={() => canPrev && setIdx((i) => i - 1)}
          className={cn(
            "h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border",
            !canPrev && "opacity-40 pointer-events-none"
          )}
        >
          ‹
        </button>
        <button
          aria-label="Next image"
          disabled={!canNext}
          onClick={() => canNext && setIdx((i) => i + 1)}
          className={cn(
            "h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border",
            !canNext && "opacity-40 pointer-events-none"
          )}
        >
          ›
        </button>
      </div>

      {/* Caption + dots */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="text-xs text-white">
          <span className="inline-block rounded-md bg-black/50 px-2 py-1 backdrop-blur-sm">
            {caption || "Swipe or use arrows"}
          </span>
        </div>
        <div className="flex gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={cn("h-2 w-2 rounded-full", i === idx ? "bg-white" : "bg-white/50")}
            />
          ))}
        </div>
      </div>

      {/* Thumbs */}
      <div className="flex gap-2 p-2 border-t bg-white/80">
        {images.map((im, i) => (
          <button
            key={im.src}
            onClick={() => setIdx(i)}
            className={cn(
              "relative h-14 w-20 rounded-md overflow-hidden ring-1 ring-black/5",
              i === idx && "outline outline-2"
            )}
            style={i === idx ? { outlineColor: BRAND_RED } : {}}
            aria-label={`Go to image ${i + 1}`}
          >
            <img src={im.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                               YOUTUBE INLINE                               */
/* -------------------------------------------------------------------------- */

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
              <Play className="h-4 w-4" />
              Play video
            </div>
          </button>
        )}
        {play && (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={src}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                   HOTSPOTS                                 */
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
          <Info className="h-3.5 w-3.5" />
          Tap a dot to learn more.
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
/*                              CABIN COMPOSER TAB                             */
/* -------------------------------------------------------------------------- */

type Zone = "pool" | "must" | "nice" | "nope";
type Category = "comfort" | "air" | "light" | "tech" | "sky" | "audio" | "clean" | "storage";

type Chip = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  cat: Category;
  zone: Zone;
};

const CHIP_LIBRARY: Omit<Chip, "zone">[] = [
  { id: "heated", label: "Heated Seats", icon: Armchair, cat: "comfort" },
  { id: "vented", label: "Ventilated Seats", icon: Wind, cat: "air" },
  { id: "ambient", label: "Ambient Lighting", icon: Lightbulb, cat: "light" },
  { id: "wireless", label: "Wireless Charging", icon: Smartphone, cat: "tech" },
  { id: "roof", label: "Panoramic Roof", icon: Sun, cat: "sky" },
  { id: "jbl", label: "JBL Premium Audio", icon: Volume2, cat: "audio" },
  { id: "airclean", label: "Allergen Filter", icon: Thermometer, cat: "clean" },
  { id: "storage", label: "Smart Storage", icon: Coffee, cat: "storage" },
  { id: "quiet", label: "Quiet Cabin", icon: Gauge, cat: "comfort" },
  { id: "smartkey", label: "Smart Key", icon: Sparkles, cat: "tech" },
  { id: "usbC", label: "USB-C Ports", icon: BatteryCharging, cat: "tech" },
];

const ZONE_LABELS: Record<Exclude<Zone, "pool">, string> = {
  must: "Must-have",
  nice: "Nice-to-have",
  nope: "Not for me",
};

const ZONE_WEIGHT: Record<Exclude<Zone, "pool">, number> = { must: 2, nice: 1, nope: 0 };

const CAT_META: Record<Category, { label: string; color: string }> = {
  comfort: { label: "Comfort", color: BRAND_RED },
  air:     { label: "Fresh Air", color: "#0EA5E9" },
  light:   { label: "Ambience", color: "#4F46E5" },
  tech:    { label: "Tech", color: "#111827" },
  sky:     { label: "Open Sky", color: "#EA580C" },
  audio:   { label: "Audio", color: "#16A34A" },
  clean:   { label: "Clean Air", color: "#10B981" },
  storage: { label: "Storage", color: "#6B7280" },
};

function personaFromScores(scores: Record<Category, number>) {
  const entries = Object.entries(scores) as [Category, number][];
  const [topCat, topScore] = entries.reduce((a, b) => (b[1] > a[1] ? b : a), ["comfort", -Infinity] as [Category, number]);
  const meta = CAT_META[topCat];

  const persona =
    topCat === "comfort" ? "Warm Voyager" :
    topCat === "tech"    ? "Connected Pro" :
    topCat === "audio"   ? "Soundstage Fan" :
    topCat === "light"   ? "Mood Aesthete" :
    topCat === "air"     ? "Breeze Seeker" :
    topCat === "sky"     ? "Skyline Lover" :
    topCat === "clean"   ? "Fresh Cabin" :
    "Practical Organizer";

  const recs =
    topCat === "comfort" ? ["Heated seats L1–L2", "Soft ambient white", "Quieter audio"] :
    topCat === "tech"    ? ["Wireless charging", "USB-C everywhere", "Smart Key"] :
    topCat === "audio"   ? ["JBL on • 35–45 volume", "Balance centered", "Low road-noise"] :
    topCat === "light"   ? ["Ambient violet/blue", "Dim cabin LEDs", "Roof 10–20%"] :
    topCat === "air"     ? ["Vent seats L1", "Fresh air mode", "Mild temp 21–22°C"] :
    topCat === "sky"     ? ["Roof 40–60%", "Ambient warm", "Shades open"] :
    topCat === "clean"   ? ["Allergen filter ON", "Recirc in traffic", "Floor mats clean"] :
    ["Extra bins", "Adjustable cupholders", "Seatback pockets"];

  return { persona, color: meta.color, topCat, topScore, recs };
}

const ChipPill: React.FC<{ chip: Chip; onTapCycle?: (id: string) => void; draggable?: boolean }> = ({ chip, onTapCycle, draggable = true }) => {
  const Icon = chip.icon;
  return (
    <motion.div
      layout
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border bg-white cursor-grab active:cursor-grabbing",
        "shadow-sm ring-1 ring-black/5 text-sm select-none"
      )}
      style={{ borderColor: CAT_META[chip.cat].color }}
      draggable={draggable}
      onDragStart={(e) => e.dataTransfer.setData("text/plain", chip.id)}
      onClick={() => onTapCycle?.(chip.id)}
      title="Drag to a bucket, or tap to cycle"
    >
      <span className="p-1 rounded-full text-white" style={{ background: CAT_META[chip.cat].color }}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      {chip.label}
    </motion.div>
  );
};

const DropZone: React.FC<{
  zone: Exclude<Zone, "pool">;
  onDropChip: (id: string, zone: Exclude<Zone, "pool">) => void;
  children: React.ReactNode;
  highlight?: boolean;
}> = ({ zone, onDropChip, children, highlight }) => {
  const onDrop = (e: React.DragEvent) => {
    const id = e.dataTransfer.getData("text/plain");
    if (id) onDropChip(id, zone);
  };
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      className={cn(
        "rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3 min-h-[120px]",
        highlight && "outline outline-2",
      )}
      style={highlight ? { outlineColor: BRAND_RED } : {}}
      aria-label={`${ZONE_LABELS[zone]} drop zone`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{ZONE_LABELS[zone]}</div>
        <div className="text-[11px] text-muted-foreground">drag or tap chips</div>
      </div>
      <motion.div layout className="flex flex-wrap gap-2">{children}</motion.div>
    </div>
  );
};

const ComposerMeters: React.FC<{ scores: Record<Category, number> }> = ({ scores }) => {
  const max = Math.max(1, ...Object.values(scores));
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {Object.entries(CAT_META).map(([k, meta]) => {
        const v = scores[k as Category] || 0;
        const pct = Math.round((v / max) * 100);
        return (
          <div key={k} className="rounded-lg border bg-white/70 p-2">
            <div className="text-[11px] mb-1">{meta.label}</div>
            <div className="h-2 w-full rounded bg-black/5 overflow-hidden">
              <div className="h-full" style={{ width: `${pct}%`, background: meta.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CabinComposer: React.FC<{
  initialChips?: Chip[];
  onChange?: (chips: Chip[]) => void;
}> = ({ initialChips, onChange }) => {
  const [chips, setChips] = React.useState<Chip[]>(
    () => (initialChips ?? CHIP_LIBRARY.map((c) => ({ ...c, zone: "pool" as Zone })))
  );

  const setZone = (id: string, zone: Exclude<Zone, "pool">) => {
    setChips((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, zone } : c));
      onChange?.(next);
      return next;
    });
  };

  const cycleTap = (id: string) => {
    setChips((prev) => {
      const next = prev.map((c) => {
        if (c.id !== id) return c;
        const order: Zone[] = ["pool", "must", "nice", "nope"];
        const idx = order.indexOf(c.zone);
        const nz = order[(idx + 1) % order.length];
        return { ...c, zone: nz };
      });
      onChange?.(next);
      return next;
    });
  };

  const moveAllTo = (zone: Exclude<Zone, "pool">) => {
    setChips((prev) => prev.map((c) => ({ ...c, zone })));
  };
  const reset = () => setChips(CHIP_LIBRARY.map((c) => ({ ...c, zone: "pool" as Zone })));

  // scores
  const scores = chips.reduce((acc, c) => {
    if (c.zone !== "pool") acc[c.cat] = (acc[c.cat] || 0) + ZONE_WEIGHT[c.zone];
    return acc;
  }, {} as Record<Category, number>);
  const { persona, color, recs } = personaFromScores(scores);

  const pool = chips.filter((c) => c.zone === "pool");
  const must = chips.filter((c) => c.zone === "must");
  const nice = chips.filter((c) => c.zone === "nice");
  const nope = chips.filter((c) => c.zone === "nope");

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      {/* Left: buckets */}
      <div className="lg:col-span-2 space-y-3">
        {/* Pool */}
        <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Drag feature chips</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={reset}>Reset</Button>
              <Button variant="outline" size="sm" onClick={() => moveAllTo("must")}>All Must</Button>
            </div>
          </div>
          <motion.div layout className="flex flex-wrap gap-2">
            <AnimatePresence>
              {pool.map((chip) => (
                <ChipPill key={chip.id} chip={chip} onTapCycle={cycleTap} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Drop Zones */}
        <div className="grid md:grid-cols-3 gap-3">
          <DropZone zone="must" onDropChip={setZone} highlight>
            {must.map((c) => <ChipPill key={c.id} chip={c} onTapCycle={cycleTap} />)}
          </DropZone>
          <DropZone zone="nice" onDropChip={setZone}>
            {nice.map((c) => <ChipPill key={c.id} chip={c} onTapCycle={cycleTap} />)}
          </DropZone>
          <DropZone zone="nope" onDropChip={setZone}>
            {nope.map((c) => <ChipPill key={c.id} chip={c} onTapCycle={cycleTap} />)}
          </DropZone>
        </div>
      </div>

      {/* Right: dynamic summary / recommendation */}
      <div className="space-y-3">
        <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-2 rounded-md text-white" style={{ background: color }}>
              <Wand2 className="h-4 w-4" />
            </span>
            <div className="font-semibold">Your interior vibe</div>
          </div>
          <div className="text-xl font-bold" style={{ color }}>{persona}</div>
          <p className="text-sm text-muted-foreground mt-1">
            Based on your priorities, here’s a cabin setup we think you’ll love.
          </p>

          <div className="mt-3">
            <ComposerMeters scores={scores} />
          </div>

          <div className="mt-3">
            <div className="text-xs text-muted-foreground mb-1">Quick recommendations</div>
            <ul className="text-sm space-y-1">
              {recs.map((r) => (
                <li key={r} className="flex gap-2 items-start">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex gap-2">
            <Button className="flex-1" style={{ background: color }}>
              Apply to a build
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => {
              const summary = `Persona: ${persona}\nMust: ${must.map(m=>m.label).join(", ") || "-"}\nNice: ${nice.map(m=>m.label).join(", ") || "-"}\nNope: ${nope.map(m=>m.label).join(", ") || "-"}`;
              navigator.clipboard?.writeText(summary);
              alert("Summary copied to clipboard");
            }}>
              Share
            </Button>
          </div>
        </div>

        <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4" style={{ color }} />
            <div className="font-semibold">Why this works</div>
          </div>
          <p className="text-sm text-muted-foreground">
            Sorting features clarifies what matters most, so we can tailor trims, packages, and demos to your vibe — making your test drive hyper-relevant.
          </p>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              MAIN MODAL COMPONENT                           */
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

  const hotspotBg = hotspotImage || { src: HOTSPOT_BG, alt: "Interior with features" };
  const hotspotItems: Hotspot[] = hotspots?.length ? hotspots : [
    { x: 48, y: 70, title: "Wireless Charging", body: "Drop your phone on the pad to charge while you drive.", icon: Smartphone },
    { x: 18, y: 62, title: "JBL Speakers", body: "Crisp highs and deep lows tuned for the cabin.", icon: Volume2 },
    { x: 82, y: 26, title: "Panoramic Roof", body: "Let in sky and light with one-touch control.", icon: Sun },
    { x: 52, y: 40, title: "Ambient Lighting", body: "Set the tone with subtle LED accents.", icon: Lightbulb },
    { x: 30, y: 78, title: "Comfort Seats", body: "Heated/ventilated seats keep you fresh.", icon: Armchair },
  ];

  const tabItems = (videoIds.length
    ? [
        { key: "overview", label: "Overview" as const },
        { key: "composer", label: "Cabin Composer" as const },
        { key: "hotspots", label: "Hotspots" as const },
        { key: "images", label: "Images" as const },
        { key: "videos", label: "Videos" as const },
      ]
    : [
        { key: "overview", label: "Overview" as const },
        { key: "composer", label: "Cabin Composer" as const },
        { key: "hotspots", label: "Hotspots" as const },
        { key: "images", label: "Images" as const },
      ]) as { key: TabKey; label: string }[];

  const [tab, setTab] = React.useState<TabKey>("composer"); // land users on the new interactive tab

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        {/* Compact mobile header */}
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
            Sort your must-haves to craft a cabin vibe — then explore hotspots, images, or videos.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* HERO: Tabs + quick stats */}
            <motion.div initial={enter} animate={entered} transition={{ duration: 0.3 }} className="rounded-2xl p-4 lg:p-6 border bg-white/70 backdrop-blur ring-1 ring-black/5">
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
                    Drag feature chips into buckets — we’ll turn that into a personalized interior vibe.
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
                  <div className="text-xs text-muted-foreground">Overview · Cabin Composer · Hotspots · Images · Videos</div>
                </div>
              </div>
            </motion.div>

            {/* COMPOSER TAB */}
            {tab === "composer" && (
              <motion.div key="composer" initial={enter} animate={entered}>
                <CabinComposer />
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
                    <span className="text-xs text-muted-foreground ml-2">Expandable sections — add more anytime</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { icon: Smartphone, title: "Tech Integration", features: ["Wireless Charging", "Multiple USB", "12V Outlets", "Smartphone Integration"] },
                      { icon: Coffee, title: "Smart Storage", features: ["Adjustable Cupholders", "Deep Console Bin", "Door Pockets", "Seatback Pockets"] },
                      { icon: Wind, title: "Air Quality", features: ["Cabin Filter", "Fresh Air Mode", "Recirculation", "Allergen Reduction"] },
                      { icon: Car, title: "Interior Lighting", features: ["LED Cabin Lights", "Ambient Accents", "Reading Lamps", "Illuminated Entry"] },
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
