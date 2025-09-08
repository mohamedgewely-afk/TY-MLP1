import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Car, Thermometer, Volume2, Smartphone, Armchair, Sun, Wind, Coffee,
  X, Info, Play, Lightbulb, Droplets, Fan, Maximize2
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

/* Defaults if none are passed in */
const DEFAULT_IMG_A =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
const DEFAULT_IMG_B =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

interface InteriorExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  videoIds?: string[]; // optional
  images?: { src: string; alt?: string }[]; // optional (gallery)
  hotspotImage?: { src: string; alt?: string }; // optional (hotspots tab background)
  hotspots?: {
    x: number; // 0..100 (percent)
    y: number; // 0..100 (percent)
    title: string;
    body: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

type TabKey = "overview" | "experience" | "hotspots" | "images" | "videos";

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
/*                         STATE SHARED ACROSS MODULES                         */
/* -------------------------------------------------------------------------- */

type Level = 0 | 1 | 2;

const useCabinState = () => {
  const [temp, setTemp] = React.useState(22); // °C
  const [seatHeat, setSeatHeat] = React.useState<Level>(1);
  const [seatVent, setSeatVent] = React.useState<Level>(0);
  const [ambient, setAmbient] = React.useState<string>(BRAND_RED);
  const [volume, setVolume] = React.useState(30);
  const [sunroof, setSunroof] = React.useState(10); // 0..100 open %
  const [recirc, setRecirc] = React.useState(false);

  /* Presets update multiple values at once */
  const applyPreset = (preset: "commute" | "family" | "night") => {
    if (preset === "commute") {
      setTemp(21); setSeatHeat(0); setSeatVent(1); setAmbient("#0EA5E9"); setVolume(28); setSunroof(0); setRecirc(true);
    } else if (preset === "family") {
      setTemp(22); setSeatHeat(1); setSeatVent(1); setAmbient(BRAND_RED); setVolume(35); setSunroof(35); setRecirc(false);
    } else {
      setTemp(20); setSeatHeat(0); setSeatVent(0); setAmbient("#4F46E5"); setVolume(18); setSunroof(0); setRecirc(true);
    }
  };

  return {
    temp, setTemp,
    seatHeat, setSeatHeat,
    seatVent, setSeatVent,
    ambient, setAmbient,
    volume, setVolume,
    sunroof, setSunroof,
    recirc, setRecirc,
    applyPreset,
  };
};

/* -------------------------------------------------------------------------- */
/*                             SPOTLIGHT MODULES                               */
/* -------------------------------------------------------------------------- */

const CardShell: React.FC<{ title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; }> = ({ title, icon: Icon, children }) => (
  <div className="p-4 rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5">
    <div className="flex items-center gap-2 mb-3">
      <span className="p-2 rounded-md text-white" style={{ background: BRAND_RED }}>
        <Icon className="h-4 w-4" />
      </span>
      <h4 className="font-semibold">{title}</h4>
    </div>
    {children}
  </div>
);

const SeatingModule: React.FC<{ seatHeat: Level; seatVent: Level; setSeatHeat: (v: Level)=>void; setSeatVent: (v: Level)=>void; }> = ({ seatHeat, seatVent, setSeatHeat, setSeatVent }) => (
  <CardShell title="Seating" icon={Armchair}>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="text-sm mb-1 font-medium">Heat</div>
        <div className="flex gap-1">
          {[0,1,2].map((lvl) => (
            <button key={`heat-${lvl}`} onClick={() => setSeatHeat(lvl as Level)}
              className={cn("px-2 py-1 rounded border text-xs", seatHeat===lvl ? "bg-black text-white border-black":"hover:bg-black/5")}>
              {lvl}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="text-sm mb-1 font-medium">Vent</div>
        <div className="flex gap-1">
          {[0,1,2].map((lvl) => (
            <button key={`vent-${lvl}`} onClick={() => setSeatVent(lvl as Level)}
              className={cn("px-2 py-1 rounded border text-xs", seatVent===lvl ? "bg-black text-white border-black":"hover:bg-black/5")}>
              {lvl}
            </button>
          ))}
        </div>
      </div>
    </div>
    <p className="text-xs text-muted-foreground mt-2">Personalize comfort for both front seats.</p>
  </CardShell>
);

const ClimateModule: React.FC<{ temp: number; setTemp: (v:number)=>void; recirc: boolean; setRecirc: (v:boolean)=>void; }> = ({ temp, setTemp, recirc, setRecirc }) => (
  <CardShell title="Climate" icon={Thermometer}>
    <div className="flex items-center gap-2 text-sm font-medium">
      Temperature: <span className="ml-auto font-semibold">{temp}°C</span>
    </div>
    <input type="range" min={16} max={28} value={temp} onChange={(e)=>setTemp(parseInt(e.target.value))} className="w-full mt-2" aria-label="Cabin temperature" />
    <div className="mt-2 flex items-center justify-between">
      <div className="text-xs text-muted-foreground">Dual-zone ready</div>
      <button onClick={()=>setRecirc(!recirc)} className={cn("px-2 py-1 rounded border text-xs", recirc?"bg-black text-white border-black":"hover:bg-black/5")}>
        {recirc ? "Recirculation On" : "Fresh Air"}
      </button>
    </div>
  </CardShell>
);

const LightingModule: React.FC<{ ambient: string; setAmbient: (c:string)=>void; }> = ({ ambient, setAmbient }) => (
  <CardShell title="Ambient Lighting" icon={Lightbulb}>
    <div className="flex gap-2">
      {[BRAND_RED, "#4F46E5", "#059669", "#0EA5E9", "#F59E0B"].map((c) => (
        <button key={c} onClick={()=>setAmbient(c)} className={cn("h-6 w-6 rounded-full border", ambient===c && "ring-2")} style={{ background: c }} aria-label={`Set ambient ${c}`} />
      ))}
    </div>
    <p className="text-xs text-muted-foreground mt-2">Choose a mood that fits the drive.</p>
  </CardShell>
);

const AudioModule: React.FC<{ volume: number; setVolume: (v:number)=>void; }> = ({ volume, setVolume }) => (
  <CardShell title="JBL Audio" icon={Volume2}>
    <div className="flex items-center gap-2 text-sm font-medium">
      Volume <span className="ml-auto font-semibold">{volume}</span>
    </div>
    <input type="range" min={0} max={100} value={volume} onChange={(e)=>setVolume(parseInt(e.target.value))} className="w-full mt-2" aria-label="Audio volume" />
    <p className="text-xs text-muted-foreground mt-2">Concert-quality sound with clarity tech.</p>
  </CardShell>
);

const SunroofModule: React.FC<{ sunroof: number; setSunroof: (v:number)=>void; }> = ({ sunroof, setSunroof }) => (
  <CardShell title="Panoramic Roof" icon={Sun}>
    <div className="flex items-center gap-2 text-sm font-medium">
      Open <span className="ml-auto font-semibold">{sunroof}%</span>
    </div>
    <input type="range" min={0} max={100} value={sunroof} onChange={(e)=>setSunroof(parseInt(e.target.value))} className="w-full mt-2" aria-label="Sunroof open percentage" />
    <p className="text-xs text-muted-foreground mt-2">Let in light or keep it cool—your call.</p>
  </CardShell>
);

const AirQualityModule: React.FC<{ recirc: boolean; setRecirc: (v:boolean)=>void; }> = ({ recirc, setRecirc }) => (
  <CardShell title="Air Quality" icon={Wind}>
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">{recirc ? "Recirculation" : "Fresh Air"}</div>
      <button onClick={()=>setRecirc(!recirc)} className={cn("px-2 py-1 rounded border text-xs", recirc?"bg-black text-white border-black":"hover:bg-black/5")}>
        Toggle
      </button>
    </div>
    <p className="text-xs text-muted-foreground mt-2">High-grade filtration helps reduce allergens.</p>
  </CardShell>
);

/* -------------------------------------------------------------------------- */
/*                                 HOTSPOTS                                   */
/* -------------------------------------------------------------------------- */

const HotspotsStage: React.FC<{
  image: { src: string; alt?: string };
  hotspots: Required<InteriorExperienceModalProps>["hotspots"];
}> = ({ image, hotspots }) => {
  const [active, setActive] = React.useState<number | null>(null);
  const [show, setShow] = React.useState(true);

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          Tap a dot to learn more.{" "}
        </div>
        <button onClick={()=>setShow(!show)} className="text-xs underline">{show ? "Hide hotspots" : "Show hotspots"}</button>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingTop: "56.25%" }}>
        <img src={image.src} alt={image.alt || ""} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        {show && hotspots?.map((h, i) => {
          const Icon = h.icon || Info;
          return (
            <div key={`${h.title}-${i}`} style={{ left: `${h.x}%`, top: `${h.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={()=>setActive(active===i?null:i)}
                className="h-5 w-5 rounded-full border bg-white/90 backdrop-blur shadow grid place-items-center"
                style={{ borderColor: BRAND_RED }}
                aria-label={h.title}
              >
                <span className="h-2 w-2 rounded-full" style={{ background: BRAND_RED }} />
              </button>

              {/* Popover */}
              {active===i && (
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

  /* Shared state across all spotlight modules */
  const cabin = useCabinState();

  /* Defaults */
  const gallery = images?.length ? images : [
    { src: DEFAULT_IMG_A, alt: "Interior highlight 1" },
    { src: DEFAULT_IMG_B, alt: "Interior highlight 2" },
  ];

  const hotspotBg = hotspotImage || { src: DEFAULT_IMG_B, alt: "Interior with features" };
  const hotspotItems = hotspots?.length ? hotspots : [
    { x: 48, y: 70, title: "Wireless Charging", body: "Drop your phone on the pad to charge while you drive.", icon: Smartphone },
    { x: 18, y: 62, title: "JBL Speakers", body: "Crisp highs and deep lows tuned for the cabin.", icon: Volume2 },
    { x: 82, y: 26, title: "Panoramic Roof", body: "Let in sky and light with one-touch control.", icon: Sun },
    { x: 52, y: 40, title: "Ambient Lighting", body: "Set the tone with subtle LED accents.", icon: Lightbulb },
    { x: 30, y: 78, title: "Comfort Seats", body: "Heated/ventilated seats help keep you fresh.", icon: Armchair },
  ];

  const tabItems = (videoIds.length
    ? [
        { key: "overview", label: "Overview" as const },
        { key: "experience", label: "Experience" as const },
        { key: "hotspots", label: "Hotspots" as const },
        { key: "images", label: "Images" as const },
        { key: "videos", label: "Videos" as const },
      ]
    : [
        { key: "overview", label: "Overview" as const },
        { key: "experience", label: "Experience" as const },
        { key: "hotspots", label: "Hotspots" as const },
        { key: "images", label: "Images" as const },
      ]);

  const [tab, setTab] = React.useState<TabKey>("overview");

  /* Data for the “catalog” section (scales with more feature groups) */
  const convenienceGroups = [
    { icon: Smartphone, title: "Tech Integration", features: ["Wireless Charging", "Multiple USB", "12V Outlets", "Smartphone Integration"] },
    { icon: Coffee, title: "Smart Storage", features: ["Adjustable Cupholders", "Deep Console Bin", "Large Door Pockets", "Seatback Pockets"] },
    { icon: Wind, title: "Air Quality", features: ["Cabin Filter", "Fresh Air Mode", "Recirculation", "Allergen Reduction"] },
    { icon: Car, title: "Interior Lighting", features: ["LED Cabin Lights", "Ambient Accents", "Reading Lamps", "Illuminated Entry"] },
  ];

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        {/* Compact header on mobile */}
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
            Explore more: try presets, tap hotspots, and jump into images or videos.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* HERO: Tabs + quick value chips */}
            <motion.div
              initial={enter}
              animate={entered}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-4 lg:p-6 border bg-white/70 backdrop-blur ring-1 ring-black/5"
            >
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
                    Seats that remember you. Air that feels just right. Sound that fills the space. Make it yours.
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
                  <Tabs active={tab} onChange={setTab} items={tabItems as any} />
                  <div className="text-xs text-muted-foreground">Pick a tab to explore different ways to experience the cabin.</div>
                </div>
              </div>
            </motion.div>

            {/* EXPERIENCE TAB */}
            {tab === "experience" && (
              <motion.div key="experience" initial={enter} animate={entered} className="space-y-4">
                {/* Presets */}
                <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3">
                  <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                    Quick Presets
                    <span className="text-xs text-muted-foreground ml-2">Apply multiple comfort settings at once</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={()=>cabin.applyPreset("commute")}>Morning Commute</Button>
                    <Button variant="outline" size="sm" onClick={()=>cabin.applyPreset("family")}>Family Trip</Button>
                    <Button variant="outline" size="sm" onClick={()=>cabin.applyPreset("night")}>Night Mode</Button>
                  </div>
                </div>

                {/* Spotlight grid — add/remove modules freely */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <SeatingModule seatHeat={cabin.seatHeat} seatVent={cabin.seatVent} setSeatHeat={cabin.setSeatHeat} setSeatVent={cabin.setSeatVent} />
                  <ClimateModule temp={cabin.temp} setTemp={cabin.setTemp} recirc={cabin.recirc} setRecirc={cabin.setRecirc} />
                  <LightingModule ambient={cabin.ambient} setAmbient={cabin.setAmbient} />
                  <AudioModule volume={cabin.volume} setVolume={cabin.setVolume} />
                  <SunroofModule sunroof={cabin.sunroof} setSunroof={cabin.setSunroof} />
                  <AirQualityModule recirc={cabin.recirc} setRecirc={cabin.setRecirc} />
                </div>

                {/* Live preview strip (clean SVG, no background) */}
                <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Info className="h-3.5 w-3.5" />
                    Live preview of your selections
                  </div>
                  <div className="relative w-full" style={{ paddingTop: "40%" }}>
                    <svg viewBox="0 0 720 288" className="absolute inset-0 w-full h-full">
                      {/* Base cabin */}
                      <rect x="40" y="60" width="640" height="168" rx="18" fill="rgba(0,0,0,.04)" stroke="rgba(0,0,0,.12)" />
                      {/* Seats respond to heat level */}
                      <rect x="110" y="90" width="90" height="100" rx="12" fill={`rgba(0,0,0,${0.08 + 0.1*cabin.seatHeat})`} />
                      <rect x="520" y="90" width="90" height="100" rx="12" fill={`rgba(0,0,0,${0.08 + 0.1*cabin.seatHeat})`} />
                      {/* Vent haze */}
                      {cabin.seatVent>0 && <>
                        <circle cx="155" cy="140" r={cabin.seatVent===1?18:26} fill="rgba(14,165,233,.15)" />
                        <circle cx="565" cy="140" r={cabin.seatVent===1?18:26} fill="rgba(14,165,233,.15)" />
                      </>}
                      {/* Climate plume */}
                      {cabin.temp!==22 && (
                        <path d="M360,100 C380,80 420,80 440,100 S480,140 500,120"
                          stroke={cabin.temp>22?BRAND_RED:"#0EA5E9"} strokeWidth="6" fill="none" opacity="0.22" />
                      )}
                      {/* Ambient strip */}
                      <rect x="40" y="220" width="640" height="6" rx="3" fill={cabin.ambient} opacity="0.9" />
                      {/* Sunroof opening indicator */}
                      <rect x="220" y="68" width={(cabin.sunroof/100)*280} height="8" rx="4" fill="#000" opacity="0.15" />
                      {/* Head unit + volume */}
                      <rect x="340" y="120" width="60" height="40" rx="6" fill="white" stroke="rgba(0,0,0,.15)" />
                      <rect x="345" y="125" width="50" height="12" rx="3" fill="rgba(0,0,0,.08)" />
                      <rect x="345" y="143" width={Math.max(10, (cabin.volume/100)*50)} height="6" rx="3" fill="black" opacity="0.65" />
                    </svg>
                  </div>
                </div>
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

            {/* OVERVIEW TAB (topical catalog that scales with more groups) */}
            {tab === "overview" && (
              <motion.div key="overview" initial={enter} animate={entered} className="space-y-4">
                <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    Feature Catalog
                    <span className="text-xs text-muted-foreground ml-2">Expandable sections — add more anytime</span>
                  </div>
                  <div className="space-y-3">
                    {convenienceGroups.map((group, index) => (
                      <CollapsibleContent
                        key={group.title}
                        defaultOpen={index===0}
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
