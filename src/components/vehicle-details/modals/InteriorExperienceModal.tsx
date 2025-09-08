import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Car, Thermometer, Volume2, Smartphone, Armchair, Sun, Wind, Coffee,
  X, Info, Play, Lightbulb
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

/* ----------------------------------------------------------------------------
  THEME / DEFAULTS
---------------------------------------------------------------------------- */

const BRAND_RED = "#cb0017";
const EXPERIENCE_BG_DEFAULT =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true";

const DEFAULT_IMG_A =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
const DEFAULT_IMG_B =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";

/* ----------------------------------------------------------------------------
  TYPES
---------------------------------------------------------------------------- */

type Level = 0 | 1 | 2;
type TabKey = "overview" | "experience" | "hotspots" | "images" | "videos";

type P = { x: number; y: number }; // 0..1
type R = { x: number; y: number; w: number; h: number }; // 0..1

type OverlayConfig = {
  seatLeft: R;
  seatRight: R;
  ventLeft: { c: P; r: number };   // r as portion of min(containerW,containerH)
  ventRight: { c: P; r: number };
  ambient: R;
  sunroof: R;
  headUnit: R;
  volumeBar: R; // inside headUnit
  plume: { p0: P; c1: P; c2: P; p1: P };
};

interface InteriorExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  videoIds?: string[];
  images?: { src: string; alt?: string }[];
  hotspotImage?: { src: string; alt?: string };
  hotspots?: {
    x: number; y: number; title: string; body: string; icon?: React.ComponentType<{ className?: string }>;
  }[];
  experienceBg?: string;
}

/* ----------------------------------------------------------------------------
  UTILS
---------------------------------------------------------------------------- */

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const storageKeyFor = (bg: string) => `interior-calib:${bg}`;

function toPxRect(r: R, w: number, h: number) {
  return { x: r.x * w, y: r.y * h, w: r.w * w, h: r.h * h };
}
function toPxPoint(p: P, w: number, h: number) {
  return { x: p.x * w, y: p.y * h };
}

/* ----------------------------------------------------------------------------
  DEFAULT OVERLAY (good starting guess — refine via Calibrate)
---------------------------------------------------------------------------- */

const DEFAULT_CONFIG: OverlayConfig = {
  seatLeft:  { x: 0.24, y: 0.48, w: 0.18, h: 0.28 },
  seatRight: { x: 0.63, y: 0.48, w: 0.18, h: 0.28 },
  ventLeft:  { c: { x: 0.48, y: 0.44 }, r: 0.045 },
  ventRight: { c: { x: 0.53, y: 0.44 }, r: 0.045 },
  ambient:   { x: 0.12, y: 0.82, w: 0.76, h: 0.015 },
  sunroof:   { x: 0.28, y: 0.08, w: 0.44, h: 0.02 },
  headUnit:  { x: 0.47, y: 0.51, w: 0.06, h: 0.06 },
  volumeBar: { x: 0.48, y: 0.555, w: 0.05, h: 0.008 },
  plume: {
    p0: { x: 0.49, y: 0.40 },
    c1: { x: 0.51, y: 0.36 },
    c2: { x: 0.56, y: 0.36 },
    p1: { x: 0.58, y: 0.41 },
  },
};

/* ----------------------------------------------------------------------------
  STATE (cabin) + PRESETS
---------------------------------------------------------------------------- */

const useCabinState = () => {
  const [temp, setTemp] = React.useState(22);
  const [seatHeat, setSeatHeat] = React.useState<Level>(1);
  const [seatVent, setSeatVent] = React.useState<Level>(0);
  const [ambient, setAmbient] = React.useState<string>(BRAND_RED);
  const [volume, setVolume] = React.useState(30);
  const [sunroofPct, setSunroofPct] = React.useState(10);
  const [recirc, setRecirc] = React.useState(false);

  const applyPreset = (preset: "commute" | "family" | "night") => {
    if (preset === "commute") {
      setTemp(21); setSeatHeat(0); setSeatVent(1); setAmbient("#0EA5E9"); setVolume(28); setSunroofPct(0); setRecirc(true);
    } else if (preset === "family") {
      setTemp(22); setSeatHeat(1); setSeatVent(1); setAmbient(BRAND_RED); setVolume(35); setSunroofPct(35); setRecirc(false);
    } else {
      setTemp(20); setSeatHeat(0); setSeatVent(0); setAmbient("#4F46E5"); setVolume(18); setSunroofPct(0); setRecirc(true);
    }
  };

  return { temp, setTemp, seatHeat, setSeatHeat, seatVent, setSeatVent, ambient, setAmbient, volume, setVolume, sunroofPct, setSunroofPct, recirc, setRecirc, applyPreset };
};

/* ----------------------------------------------------------------------------
  SIMPLE TABS
---------------------------------------------------------------------------- */

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
            className={cn("flex-1 px-3 py-1.5 rounded-lg text-sm transition border",
              selected ? "bg-black text-white border-black" : "hover:bg-black/5 border-transparent")}
            aria-pressed={selected}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  </div>
);

/* ----------------------------------------------------------------------------
  GALLERY + YOUTUBE
---------------------------------------------------------------------------- */

const ImageGallery: React.FC<{ images: { src: string; alt?: string }[]; caption?: string; }> = ({ images, caption }) => {
  const [idx, setIdx] = React.useState(0);
  const prefers = useReducedMotion();
  const canPrev = idx > 0, canNext = idx < images.length - 1;

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 overflow-hidden" tabIndex={0}
      aria-label="Image gallery. Use arrow keys to navigate.">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <AnimatePresence mode="wait">
          <motion.img key={images[idx].src} src={images[idx].src} alt={images[idx].alt || ""}
            className="absolute inset-0 h-full w-full object-cover"
            initial={prefers ? {} : { opacity: 0, scale: 0.98 }}
            animate={prefers ? {} : { opacity: 1, scale: 1 }}
            exit={prefers ? {} : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            loading="lazy" />
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
            style={i === idx ? { outlineColor: BRAND_RED } : {}} aria-label={`Go to image ${i + 1}`}>
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

/* ----------------------------------------------------------------------------
  HOTSPOTS (unchanged)
---------------------------------------------------------------------------- */

const HotspotsStage: React.FC<{
  image: { src: string; alt?: string };
  hotspots: { x: number; y: number; title: string; body: string; icon?: React.ComponentType<{ className?: string }> }[];
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
              <button onClick={() => setActive(active === i ? null : i)}
                className="h-5 w-5 rounded-full border bg-white/90 backdrop-blur shadow grid place-items-center"
                style={{ borderColor: BRAND_RED }} aria-label={h.title}>
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

/* ----------------------------------------------------------------------------
  EXPERIENCE PREVIEW W/ CALIBRATION
---------------------------------------------------------------------------- */

const HandlePoint: React.FC<{
  x: number; y: number;
  onDrag: (nx: number, ny: number) => void;
  label?: string;
}> = ({ x, y, onDrag, label }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    const el = ref.current?.parentElement as HTMLElement;
    if (!el) return;
    const bounds = el.getBoundingClientRect();
    const move = (ee: PointerEvent) => {
      const nx = clamp01((ee.clientX - bounds.left) / bounds.width);
      const ny = clamp01((ee.clientY - bounds.top) / bounds.height);
      onDrag(nx, ny);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  return (
    <div ref={ref} className="absolute"
      style={{ left: `${x * 100}%`, top: `${y * 100}%`, transform: "translate(-50%, -50%)" }}>
      <div onPointerDown={onPointerDown}
        className="h-4 w-4 rounded-full border bg-white shadow cursor-pointer"
        title={label || "Drag handle"} />
    </div>
  );
};

const HandleRect: React.FC<{
  r: R; onChange: (r: R) => void;
  stroke?: string; label?: string;
  calibrate?: boolean;
}> = ({ r, onChange, stroke = BRAND_RED, label, calibrate }) => {
  const moveCorner = (which: "tl" | "tr" | "bl" | "br") => (nx: number, ny: number) => {
    const tl = { x: r.x, y: r.y };
    const br = { x: r.x + r.w, y: r.y + r.h };
    if (which === "tl") { tl.x = nx; tl.y = ny; }
    if (which === "tr") { br.x = nx; tl.y = ny; }
    if (which === "bl") { tl.x = nx; br.y = ny; }
    if (which === "br") { br.x = nx; br.y = ny; }
    const nx0 = Math.min(tl.x, br.x), ny0 = Math.min(tl.y, br.y);
    const nx1 = Math.max(tl.x, br.x), ny1 = Math.max(tl.y, br.y);
    onChange({ x: clamp01(nx0), y: clamp01(ny0), w: clamp01(nx1 - nx0), h: clamp01(ny1 - ny0) });
  };
  return (
    <>
      {/* stroke box */}
      <div className="absolute border rounded pointer-events-none"
        style={{
          left: `${r.x * 100}%`, top: `${r.y * 100}%`,
          width: `${r.w * 100}%`, height: `${r.h * 100}%`,
          borderColor: stroke, opacity: calibrate ? 0.9 : 0.0
        }} />
      {calibrate && (
        <>
          <HandlePoint x={r.x} y={r.y} onDrag={moveCorner("tl")} label={`${label} TL`} />
          <HandlePoint x={r.x + r.w} y={r.y} onDrag={moveCorner("tr")} label={`${label} TR`} />
          <HandlePoint x={r.x} y={r.y + r.h} onDrag={moveCorner("bl")} label={`${label} BL`} />
          <HandlePoint x={r.x + r.w} y={r.y + r.h} onDrag={moveCorner("br")} label={`${label} BR`} />
        </>
      )}
    </>
  );
};

const ExperiencePhotoPreview: React.FC<{
  bgSrc: string;
  cabin: ReturnType<typeof useCabinState>;
}> = ({ bgSrc, cabin }) => {
  const prefers = useReducedMotion();
  const [calibrate, setCalibrate] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const [cfg, setCfg] = React.useState<OverlayConfig>(() => {
    try {
      const fromLS = localStorage.getItem(storageKeyFor(bgSrc));
      return fromLS ? JSON.parse(fromLS) : DEFAULT_CONFIG;
    } catch { return DEFAULT_CONFIG; }
  });

  React.useEffect(() => {
    localStorage.setItem(storageKeyFor(bgSrc), JSON.stringify(cfg));
  }, [bgSrc, cfg]);

  const mult = highContrast ? 1 : 0.6;
  const heatAlpha = (0.10 + 0.12 * cabin.seatHeat) * mult;
  const ventAlpha = (cabin.seatVent === 0 ? 0 : cabin.seatVent === 1 ? 0.20 : 0.30) * mult;
  const plumeAlpha = (Math.min(Math.abs(cabin.temp - 22), 6) / 6) * 0.25 * mult;

  // radius handle for vent
  const VentRadiusHandle: React.FC<{ c: P; r: number; onChange: (c: P, r: number) => void; label: string; }> = ({ c, r, onChange, label }) => {
    const onCenter = (nx: number, ny: number) => onChange({ x: nx, y: ny }, r);
    const onEdge = (nx: number, ny: number) => {
      // compute radius as distance from center in min-dim units
      const dx = nx - c.x, dy = ny - c.y;
      const newR = clamp01(Math.sqrt(dx * dx + dy * dy));
      onChange(c, newR);
    };
    return (
      <>
        <HandlePoint x={c.x} y={c.y} onDrag={onCenter} label={`${label} center`} />
        <HandlePoint x={c.x + r} y={c.y} onDrag={onEdge} label={`${label} radius`} />
      </>
    );
  };

  // plume path as Bezier
  const pathD = `M ${cfg.plume.p0.x * 100} ${cfg.plume.p0.y * 100} 
                 C ${cfg.plume.c1.x * 100} ${cfg.plume.c1.y * 100},
                   ${cfg.plume.c2.x * 100} ${cfg.plume.c2.y * 100},
                   ${cfg.plume.p1.x * 100} ${cfg.plume.p1.y * 100}`;

  const copyCfg = async () => {
    const text = JSON.stringify(cfg, null, 2);
    try { await navigator.clipboard.writeText(text); } catch {}
    alert("Overlay config copied to clipboard.");
  };
  const resetCfg = () => setCfg(DEFAULT_CONFIG);

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3.5 w-3.5" />
          Live preview on real interior photo
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setHighContrast(!highContrast)} className="text-xs underline">
            {highContrast ? "Normal overlays" : "High contrast overlays"}
          </button>
          <button onClick={() => setCalibrate(!calibrate)} className="text-xs underline">
            {calibrate ? "Exit Calibrate" : "Calibrate"}
          </button>
          {calibrate && (
            <>
              <button onClick={copyCfg} className="text-xs underline">Copy JSON</button>
              <button onClick={resetCfg} className="text-xs underline">Reset</button>
            </>
          )}
        </div>
      </div>

      <div className="relative w-full overflow-hidden rounded-lg shadow-sm" style={{ paddingTop: "56.25%" }}>
        {/* Background */}
        <img src={bgSrc} alt="Vehicle interior" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />

        {/* Overlay container (100% size) */}
        <div className="absolute inset-0">

          {/* Heat (seats) */}
          <div className="absolute inset-0 pointer-events-none" style={{ mixBlendMode: "multiply" }}>
            <div className="absolute" style={{
              left: `${cfg.seatLeft.x * 100}%`, top: `${cfg.seatLeft.y * 100}%`,
              width: `${cfg.seatLeft.w * 100}%`, height: `${cfg.seatLeft.h * 100}%`,
              background: BRAND_RED, opacity: heatAlpha, borderRadius: 12
            }} />
            <div className="absolute" style={{
              left: `${cfg.seatRight.x * 100}%`, top: `${cfg.seatRight.y * 100}%`,
              width: `${cfg.seatRight.w * 100}%`, height: `${cfg.seatRight.h * 100}%`,
              background: BRAND_RED, opacity: heatAlpha, borderRadius: 12
            }} />
          </div>

          {/* Vent haze */}
          {cabin.seatVent > 0 && (
            <>
              <div className="absolute rounded-full pointer-events-none"
                style={{
                  left: `calc(${cfg.ventLeft.c.x * 100}% - ${cfg.ventLeft.r * 100}%)`,
                  top:  `calc(${cfg.ventLeft.c.y * 100}% - ${cfg.ventLeft.r * 100}%)`,
                  width: `${cfg.ventLeft.r * 200}%`, height: `${cfg.ventLeft.r * 200}%`,
                  background: "#0EA5E9", opacity: ventAlpha, filter: "blur(8px)"
                }} />
              <div className="absolute rounded-full pointer-events-none"
                style={{
                  left: `calc(${cfg.ventRight.c.x * 100}% - ${cfg.ventRight.r * 100}%)`,
                  top:  `calc(${cfg.ventRight.c.y * 100}% - ${cfg.ventRight.r * 100}%)`,
                  width: `${cfg.ventRight.r * 200}%`, height: `${cfg.ventRight.r * 200}%`,
                  background: "#0EA5E9", opacity: ventAlpha, filter: "blur(8px)"
                }} />
            </>
          )}

          {/* Plume (animated) */}
          {cabin.temp !== 22 && (
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none">
              <motion.path
                d={pathD}
                stroke={cabin.temp > 22 ? BRAND_RED : "#0EA5E9"}
                strokeWidth={1.2}
                fill="none"
                initial={{ opacity: 0.15 }}
                animate={{ opacity: [0.15, plumeAlpha, 0.15] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{ filter: "blur(0.5px)" }}
              />
            </svg>
          )}

          {/* Ambient strip */}
          <div className="absolute pointer-events-none"
            style={{
              left: `${cfg.ambient.x * 100}%`, top: `${cfg.ambient.y * 100}%`,
              width: `${cfg.ambient.w * 100}%`, height: `${cfg.ambient.h * 100}%`,
              background: cabin.ambient, opacity: 0.85 * mult, filter: "blur(2px)", borderRadius: 4
            }} />

          {/* Sunroof opening indicator (use width proportional to sunroofPct) */}
          <div className="absolute pointer-events-none"
            style={{
              left: `${cfg.sunroof.x * 100}%`,
              top: `${cfg.sunroof.y * 100}%`,
              width: `${(cfg.sunroof.w * (cabin.sunroofPct / 100)) * 100}%`,
              height: `${cfg.sunroof.h * 100}%`,
              background: "#000", opacity: 0.20 * mult, borderRadius: 6
            }} />

          {/* Head unit + volume */}
          <div className="absolute" style={{
            left: `${cfg.headUnit.x * 100}%`, top: `${cfg.headUnit.y * 100}%`,
            width: `${cfg.headUnit.w * 100}%`, height: `${cfg.headUnit.h * 100}%`,
            background: "rgba(255,255,255,.85)", borderRadius: 6, border: "1px solid rgba(0,0,0,.15)"
          }} />
          <div className="absolute" style={{
            left: `${cfg.volumeBar.x * 100}%`, top: `${cfg.volumeBar.y * 100}%`,
            width: `${Math.max(0.1, (cabin.volume / 100) * cfg.volumeBar.w) * 100}%`,
            height: `${cfg.volumeBar.h * 100}%`,
            background: "rgba(0,0,0,.65)", borderRadius: 3
          }} />

          {/* Calibration handles */}
          {calibrate && (
            <>
              <HandleRect r={cfg.seatLeft}  onChange={(r) => setCfg({ ...cfg, seatLeft: r })}  label="Seat L" calibrate stroke={BRAND_RED} />
              <HandleRect r={cfg.seatRight} onChange={(r) => setCfg({ ...cfg, seatRight: r })} label="Seat R" calibrate stroke={BRAND_RED} />
              <HandleRect r={cfg.ambient}   onChange={(r) => setCfg({ ...cfg, ambient: r })}   label="Ambient" calibrate stroke={cabin.ambient} />
              <HandleRect r={cfg.sunroof}   onChange={(r) => setCfg({ ...cfg, sunroof: r })}   label="Sunroof" calibrate stroke="#000" />
              <HandleRect r={cfg.headUnit}  onChange={(r) => setCfg({ ...cfg, headUnit: r })}  label="HeadUnit" calibrate stroke="#333" />
              <HandleRect r={cfg.volumeBar} onChange={(r) => setCfg({ ...cfg, volumeBar: r })} label="Volume" calibrate stroke="#333" />

              <VentRadiusHandle
                c={cfg.ventLeft.c} r={cfg.ventLeft.r}
                onChange={(c, r) => setCfg({ ...cfg, ventLeft: { c, r } })}
                label="Vent L" />
              <VentRadiusHandle
                c={cfg.ventRight.c} r={cfg.ventRight.r}
                onChange={(c, r) => setCfg({ ...cfg, ventRight: { c, r } })}
                label="Vent R" />

              {/* Plume points */}
              <HandlePoint x={cfg.plume.p0.x} y={cfg.plume.p0.y}
                onDrag={(x, y) => setCfg({ ...cfg, plume: { ...cfg.plume, p0: { x, y } } })}
                label="Plume p0" />
              <HandlePoint x={cfg.plume.c1.x} y={cfg.plume.c1.y}
                onDrag={(x, y) => setCfg({ ...cfg, plume: { ...cfg.plume, c1: { x, y } } })}
                label="Plume c1" />
              <HandlePoint x={cfg.plume.c2.x} y={cfg.plume.c2.y}
                onDrag={(x, y) => setCfg({ ...cfg, plume: { ...cfg.plume, c2: { x, y } } })}
                label="Plume c2" />
              <HandlePoint x={cfg.plume.p1.x} y={cfg.plume.p1.y}
                onDrag={(x, y) => setCfg({ ...cfg, plume: { ...cfg.plume, p1: { x, y } } })}
                label="Plume p1" />
            </>
          )}
        </div>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        {calibrate
          ? "Drag the handles to align overlays with the photo. Changes are saved automatically (localStorage)."
          : "Adjust controls to see heat/vent overlays, climate plume (red=warm, blue=cool), ambient glow, sunroof opening, and volume."}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------------------------
  SPOTLIGHT MODULE CARDS (short)
---------------------------------------------------------------------------- */

const CardShell: React.FC<{ title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; }> =
({ title, icon: Icon, children }) => (
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

const SeatingModule: React.FC<{ seatHeat: Level; seatVent: Level; setSeatHeat: (v: Level)=>void; setSeatVent: (v: Level)=>void; }> =
({ seatHeat, seatVent, setSeatHeat, setSeatVent }) => (
  <CardShell title="Seating" icon={Armchair}>
    <div className="grid grid-cols-2 gap-3">
      <div>
        <div className="text-sm mb-1 font-medium">Heat</div>
        <div className="flex gap-1">{[0,1,2].map((lvl)=>(
          <button key={`heat-${lvl}`} onClick={()=>setSeatHeat(lvl as Level)}
            className={cn("px-2 py-1 rounded border text-xs", seatHeat===lvl ? "bg-black text-white border-black":"hover:bg-black/5")}>
            {lvl}
          </button>))}</div>
      </div>
      <div>
        <div className="text-sm mb-1 font-medium">Vent</div>
        <div className="flex gap-1">{[0,1,2].map((lvl)=>(
          <button key={`vent-${lvl}`} onClick={()=>setSeatVent(lvl as Level)}
            className={cn("px-2 py-1 rounded border text-xs", seatVent===lvl ? "bg-black text-white border-black":"hover:bg-black/5")}>
            {lvl}
          </button>))}</div>
      </div>
    </div>
    <p className="text-xs text-muted-foreground mt-2">Tune heat/vent per seat.</p>
  </CardShell>
);

const ClimateModule: React.FC<{ temp: number; setTemp: (v:number)=>void; recirc: boolean; setRecirc: (v:boolean)=>void; }> =
({ temp, setTemp, recirc, setRecirc }) => (
  <CardShell title="Climate" icon={Thermometer}>
    <div className="flex items-center gap-2 text-sm font-medium">
      Temperature <span className="ml-auto font-semibold">{temp}°C</span>
    </div>
    <input type="range" min={16} max={28} value={temp} onChange={(e)=>setTemp(parseInt(e.target.value))} className="w-full mt-2" />
    <div className="mt-2 flex items-center justify-between">
      <div className="text-xs text-muted-foreground">Dual-zone ready</div>
      <button onClick={()=>setRecirc(!recirc)} className={cn("px-2 py-1 rounded border text-xs", recirc?"bg-black text-white border-black":"hover:bg-black/5")}>
        {recirc ? "Recirc On" : "Fresh Air"}
      </button>
    </div>
  </CardShell>
);

const LightingModule: React.FC<{ ambient: string; setAmbient: (c:string)=>void; }> =
({ ambient, setAmbient }) => (
  <CardShell title="Ambient Lighting" icon={Lightbulb}>
    <div className="flex gap-2">
      {[BRAND_RED, "#4F46E5", "#059669", "#0EA5E9", "#F59E0B"].map((c)=>(
        <button key={c} onClick={()=>setAmbient(c)}
          className={cn("h-6 w-6 rounded-full border", ambient===c && "ring-2")}
          style={{ background: c }} aria-label={`Ambient ${c}`} />
      ))}
    </div>
    <p className="text-xs text-muted-foreground mt-2">Pick a mood color.</p>
  </CardShell>
);

const AudioModule: React.FC<{ volume: number; setVolume: (v:number)=>void; }> =
({ volume, setVolume }) => (
  <CardShell title="JBL Audio" icon={Volume2}>
    <div className="flex items-center gap-2 text-sm font-medium">
      Volume <span className="ml-auto font-semibold">{volume}</span>
    </div>
    <input type="range" min={0} max={100} value={volume} onChange={(e)=>setVolume(parseInt(e.target.value))} className="w-full mt-2" />
    <p className="text-xs text-muted-foreground mt-2">Concert-like clarity.</p>
  </CardShell>
);

const SunroofModule: React.FC<{ sunroofPct: number; setSunroofPct: (v:number)=>void; }> =
({ sunroofPct, setSunroofPct }) => (
  <CardShell title="Panoramic Roof" icon={Sun}>
    <div className="flex items-center gap-2 text-sm font-medium">
      Open <span className="ml-auto font-semibold">{sunroofPct}%</span>
    </div>
    <input type="range" min={0} max={100} value={sunroofPct} onChange={(e)=>setSunroofPct(parseInt(e.target.value))} className="w-full mt-2" />
  </CardShell>
);

const AirQualityModule: React.FC<{ recirc: boolean; setRecirc: (v:boolean)=>void; }> =
({ recirc, setRecirc }) => (
  <CardShell title="Air Quality" icon={Wind}>
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium">{recirc ? "Recirculation" : "Fresh Air"}</div>
      <button onClick={()=>setRecirc(!recirc)} className={cn("px-2 py-1 rounded border text-xs", recirc?"bg-black text-white border-black":"hover:bg-black/5")}>
        Toggle
      </button>
    </div>
  </CardShell>
);

/* ----------------------------------------------------------------------------
  MAIN MODAL
---------------------------------------------------------------------------- */

const InteriorExperienceModal: React.FC<InteriorExperienceModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  videoIds = [],
  images,
  hotspotImage,
  hotspots,
  experienceBg,
}) => {
  const prefers = useReducedMotion();
  const enter = prefers ? {} : { opacity: 0, y: 16 };
  const entered = prefers ? {} : { opacity: 1, y: 0 };

  const cabin = useCabinState();

  const gallery = images?.length ? images : [
    { src: DEFAULT_IMG_A, alt: "Interior highlight 1" },
    { src: DEFAULT_IMG_B, alt: "Interior highlight 2" },
  ];

  const hotspotBg = hotspotImage || { src: DEFAULT_IMG_B, alt: "Interior with features" };
  const hotspotItems = hotspots?.length ? hotspots : [
    { x: 48, y: 70, title: "Wireless Charging", body: "Drop your phone on the pad to charge.", icon: Smartphone },
    { x: 18, y: 62, title: "JBL Speakers", body: "Crisp highs and deep lows.", icon: Volume2 },
    { x: 82, y: 26, title: "Panoramic Roof", body: "One-touch to open.", icon: Sun },
    { x: 52, y: 40, title: "Ambient Lighting", body: "Subtle LED accents.", icon: Lightbulb },
    { x: 30, y: 78, title: "Comfort Seats", body: "Heated & vented.", icon: Armchair },
  ];

  const tabItems = (videoIds.length
    ? ([
        { key: "overview", label: "Overview" as const },
        { key: "experience", label: "Experience" as const },
        { key: "hotspots", label: "Hotspots" as const },
        { key: "images", label: "Images" as const },
        { key: "videos", label: "Videos" as const },
      ])
    : ([
        { key: "overview", label: "Overview" as const },
        { key: "experience", label: "Experience" as const },
        { key: "hotspots", label: "Hotspots" as const },
        { key: "images", label: "Images" as const },
      ])) as { key: TabKey; label: string }[];

  const [tab, setTab] = React.useState<TabKey>("experience");

  const convenienceGroups = [
    { icon: Smartphone, title: "Tech Integration", features: ["Wireless Charging", "Multiple USB", "12V Outlets", "Smartphone Integration"] },
    { icon: Coffee, title: "Smart Storage", features: ["Adjustable Cupholders", "Deep Console Bin", "Door Pockets", "Seatback Pockets"] },
    { icon: Wind, title: "Air Quality", features: ["Cabin Filter", "Fresh Air Mode", "Recirculation", "Allergen Reduction"] },
    { icon: Car, title: "Interior Lighting", features: ["LED Cabin Lights", "Ambient Accents", "Reading Lamps", "Illuminated Entry"] },
  ];

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
            Tune controls, calibrate overlays, and explore hotspots/images/videos.
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
                  <p className="text-sm text-muted-foreground">Set the cabin and see it update on the real photo.</p>
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
                  <div className="text-xs text-muted-foreground">Overview · Experience · Hotspots · Images · Videos</div>
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
                    <span className="text-xs text-muted-foreground ml-2">Apply multiple settings at once</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={()=>cabin.applyPreset("commute")}>Morning Commute</Button>
                    <Button variant="outline" size="sm" onClick={()=>cabin.applyPreset("family")}>Family Trip</Button>
                    <Button variant="outline" size="sm" onClick={()=>cabin.applyPreset("night")}>Night Mode</Button>
                  </div>
                </div>

                {/* Spotlight modules */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <SeatingModule seatHeat={cabin.seatHeat} seatVent={cabin.seatVent} setSeatHeat={cabin.setSeatHeat} setSeatVent={cabin.setSeatVent} />
                  <ClimateModule temp={cabin.temp} setTemp={cabin.setTemp} recirc={cabin.recirc} setRecirc={cabin.setRecirc} />
                  <LightingModule ambient={cabin.ambient} setAmbient={cabin.setAmbient} />
                  <AudioModule volume={cabin.volume} setVolume={cabin.setVolume} />
                  <SunroofModule sunroofPct={cabin.sunroofPct} setSunroofPct={cabin.setSunroofPct} />
                  <AirQualityModule recirc={cabin.recirc} setRecirc={cabin.setRecirc} />
                </div>

                {/* Photo overlay preview with calibration */}
                <ExperiencePhotoPreview bgSrc={experienceBg || EXPERIENCE_BG_DEFAULT} cabin={cabin} />
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
                      { icon: Coffee, title: "Smart Storage", features: ["Adjustable Cupholders", "Deep Console Bin", "Door Pockets", "Seatback Pockets"] },
                      { icon: Wind, title: "Air Quality", features: ["Cabin Filter", "Fresh Air Mode", "Recirculation", "Allergen Reduction"] },
                      { icon: Car, title: "Interior Lighting", features: ["LED Cabin Lights", "Ambient Accents", "Reading Lamps", "Illuminated Entry"] },
                    ].map((group, index) => (
                      <CollapsibleContent
                        key={group.title}
                        defaultOpen={index === 0}
                        title={<div className="flex items-center gap-3"><group.icon className="h-5 w-5 text-black/70" /><span className="font-medium">{group.title}</span></div>}
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
