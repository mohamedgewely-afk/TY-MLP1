import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { X, Maximize2, Heart, Info, PlayCircle, ChevronRight, Zap, Eye, Grid3X3, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VehicleModel } from "@/types/vehicle";

/* ─────────────────────────────────────────
   Types
────────────────────────────────────────── */
type ChapterKey = "exterior" | "interior" | "technology" | "performance" | "lifestyle";

type Chapter = {
  key: ChapterKey;
  title: string;
  subtitle: string;
  media: Array<{ url: string; alt: string; premium?: boolean; video?: boolean }>;
  hotspots?: Array<{ x: number; y: number; label: string }>;
};

interface VehicleGalleryProps {
  vehicle: VehicleModel;
  isGR?: boolean;
  onToggleGR?: () => void;
  initialMode?: "cinematic" | "grid";
}

/* ─────────────────────────────────────────
   Theme tokens
────────────────────────────────────────── */
const GR = {
  bg: "#0B0B0C",
  edge: "#17191B",
  text: "#E6E7E9",
  muted: "#9DA2A6",
  red: "#EB0A1E",
  carbon: {
    backgroundImage: "url('/lovable-uploads/dae96293-a297-4690-a4e1-6b32d044b8d3.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#0B0B0C",
  } as React.CSSProperties,
};
const LX = {
  bgGradient: "bg-[radial-gradient(1200px_400px_at_50%_-50%,#ffffff,rgba(240,241,244,0.9))]",
  text: "text-gray-900",
  muted: "text-gray-600",
};
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#EB0A1E]";

/* ─────────────────────────────────────────
   Reduced motion
────────────────────────────────────────── */
function usePrefersReducedMotion() {
  const [reduced, set] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => set(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

/* ─────────────────────────────────────────
   Safe image extraction (NO VehicleModel.gallery required)
────────────────────────────────────────── */
type AnyVehicle = VehicleModel & Record<string, any>;

function coerceStrArray(x: unknown): string[] {
  if (!x) return [];
  if (Array.isArray(x)) {
    // strings or objects with url
    const urls = x
      .map((v) => (typeof v === "string" ? v : typeof v === "object" && v && "url" in (v as any) ? (v as any).url : null))
      .filter((u): u is string => typeof u === "string");
    return urls;
  }
  return [];
}

function pickImages(v: AnyVehicle, keys: string[]): string[] {
  for (const k of keys) {
    const val = v?.[k];
    const arr = coerceStrArray(val);
    if (arr.length) return arr;
  }
  return [];
}

/** Build chapters from whatever is available on VehicleModel */
function useChapters(vehicle: VehicleModel): Chapter[] {
  const v = vehicle as AnyVehicle;

  // single cover fallback
  const cover =
    typeof v?.image === "string" && v.image
      ? v.image
      : "https://images.unsplash.com/photo-1541443131876-b8f75a3f3e2d?q=80&w=1600&auto=format&fit=crop";

  // try multiple common keys for each chapter bucket
  const ext = [
    ...pickImages(v, ["exteriorImages", "imagesExterior", "galleryExterior", "gallery_exterior", "exterior"]),
  ];
  const intr = [
    ...pickImages(v, ["interiorImages", "imagesInterior", "galleryInterior", "gallery_interior", "interior"]),
  ];
  const tech = [
    ...pickImages(v, ["technologyImages", "imagesTechnology", "galleryTechnology", "gallery_technology", "technology"]),
  ];
  const perf = [
    ...pickImages(v, ["performanceImages", "imagesPerformance", "galleryPerformance", "gallery_performance", "performance"]),
  ];
  const life = [
    ...pickImages(v, ["lifestyleImages", "imagesLifestyle", "galleryLifestyle", "gallery_lifestyle", "lifestyle"]),
  ];

  // if none present, fall back to generic buckets populated with cover
  const ex = ext.length ? ext : [cover];
  const inr = intr.length
    ? intr
    : ["https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop"];
  const tec = tech.length
    ? tech
    : ["https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop"];
  const per = perf.length
    ? perf
    : ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop"];
  const lif = life.length
    ? life
    : ["https://images.unsplash.com/photo-1518965449314-2c4dc77b3b3a?q=80&w=1600&auto=format&fit=crop"];

  const map = (arr: string[], title: string) =>
    arr.map((url, i) => ({
      url,
      alt: `${vehicle?.name || "Toyota"} — ${title} ${i + 1}`,
      premium: i === 0,
      video: url.endsWith(".mp4"),
    }));

  return [
    {
      key: "exterior",
      title: "Exterior",
      subtitle: "Sculpted aerodynamics with iconic stance",
      media: map(ex, "Exterior"),
      hotspots: [{ x: 78, y: 62, label: "Matrix LED Headlamps" }],
    },
    {
      key: "interior",
      title: "Interior",
      subtitle: "Immersive cockpit with artisan materials",
      media: map(inr, "Interior"),
      hotspots: [{ x: 44, y: 62, label: "Heated Nappa Seats" }],
    },
    {
      key: "technology",
      title: "Technology",
      subtitle: "Intelligence meets intuition",
      media: map(tec, "Technology"),
      hotspots: [{ x: 54, y: 48, label: "12.3” HD Display" }],
    },
    {
      key: "performance",
      title: "Performance",
      subtitle: "Gazoo Racing DNA • tuned for thrill",
      media: map(per, "Performance"),
      hotspots: [{ x: 22, y: 60, label: "Adaptive Suspension" }],
    },
    {
      key: "lifestyle",
      title: "Lifestyle",
      subtitle: "Designed for every journey",
      media: map(lif, "Lifestyle"),
    },
  ];
}

/* ─────────────────────────────────────────
   Parallax frame + Grid card
────────────────────────────────────────── */
const ParallaxFrame: React.FC<{
  src: string;
  alt: string;
  caption?: string;
  isGR?: boolean;
  onOpen?: () => void;
  premium?: boolean;
  hotspots?: Chapter["hotspots"];
}> = ({ src, alt, caption, isGR, onOpen, premium, hotspots }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6vh", "6vh"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, 1]);
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={ref} className="relative w-full max-w-6xl mx-auto aspect-[16/9] rounded-3xl overflow-hidden">
      <motion.div style={!reduced ? { y, scale } : undefined} className="w-full h-full">
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />

      {hotspots?.map((h, i) => (
        <button
          key={i}
          onClick={onOpen}
          aria-label={h.label}
          className={[
            "absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded-full",
            isGR ? "bg-[#0F1113]/80 text-[#E6E7E9] border border-[#17191B]" : "bg-white/70 text-gray-800",
            focusRing,
          ].join(" ")}
          style={{ left: `${h.x}%`, top: `${h.y}%` }}
        >
          <span className="inline-flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            {h.label}
          </span>
        </button>
      ))}

      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-2">
        <div className="max-w-[70%]">
          {premium && (
            <Badge className={isGR ? "bg-[#1C1E21] border border-[#17191B] text-[#E6E7E9]" : "bg-black/70"}>Signature</Badge>
          )}
          {caption && <p className="mt-2 text-white/90 text-sm sm:text-base leading-snug">{caption}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            onClick={onOpen}
            aria-label="Open fullscreen"
            className={[
              "backdrop-blur-md text-white/95",
              isGR ? "bg-[#141618]/80 hover:bg-[#181B1E]" : "bg-black/30 hover:bg-black/40",
              focusRing,
            ].join(" ")}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            aria-label="Favorite"
            className={[
              "backdrop-blur-md text-white/95",
              isGR ? "bg-[#141618]/80 hover:bg-[#181B1E]" : "bg-black/30 hover:bg-black/40",
              focusRing,
            ].join(" ")}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const GridCard: React.FC<{
  src: string;
  alt: string;
  isGR?: boolean;
  onClick: () => void;
  premium?: boolean;
}> = ({ src, alt, onClick, isGR, premium }) => (
  <motion.button
    onClick={onClick}
    className={["relative aspect-[16/10] rounded-2xl overflow-hidden shadow-lg w-full", isGR ? "border border-[#17191B]" : "", focusRing].join(" ")}
    whileHover={{ scale: 1.02 }}
  >
    <img src={src} alt={alt} className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity" />
    <div className="absolute top-2 left-2">{premium && <Badge className={isGR ? "bg-[#1C1E21] border border-[#17191B] text-[#E6E7E9]" : "bg-black/70"}>Signature</Badge>}</div>
    <div className="absolute bottom-2 right-2">
      <div className={["inline-flex items-center gap-1 text-white/95 text-xs px-2 py-1 rounded-full", isGR ? "bg-[#121416]/80 border border-[#17191B]" : "bg-black/30"].join(" ")}>
        View <ChevronRight className="w-3 h-3" />
      </div>
    </div>
  </motion.button>
);

/* ─────────────────────────────────────────
   Main component
────────────────────────────────────────── */
const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle, isGR = false, onToggleGR, initialMode = "cinematic" }) => {
  const chapters = useChapters(vehicle);
  const [mode, setMode] = useState<"cinematic" | "grid">(initialMode);
  const [fsOpen, setFsOpen] = useState(false);
  const [fsMedia, setFsMedia] = useState<{ url: string; alt: string } | null>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const onOpenFullscreen = useCallback((m: { url: string; alt: string }) => {
    setFsMedia(m);
    setFsOpen(true);
  }, []);

  const bgWrap = isGR ? { style: GR.carbon, className: "min-h-[100svh]" } : { style: undefined, className: `min-h-[100svh] ${LX.bgGradient}` };

  const Header = (
    <div className="sticky top-0 z-20 backdrop-blur-md">
      <div className={["max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between", isGR ? "text-[#E6E7E9] border-b border-[#17191B]/80" : "text-gray-900 border-b border-gray-200/60"].join(" ")}>
        <div className="inline-flex items-center gap-1.5">
          {isGR ? (
            <>
              <Zap className="w-4 h-4 text-[#EB0A1E]" />
              <span className="tracking-wide font-semibold">GR Performance Gallery</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span className="tracking-wide font-semibold">{vehicle?.name} Experience</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setMode("cinematic")}
            className={[
              "h-8",
              mode === "cinematic" ? (isGR ? "bg-[#1A1C1F] text-[#E6E7E9] border border-[#17191B]" : "bg-gray-900 text-white") : isGR ? "bg-transparent text-[#E6E7E9] border border-[#17191B] hover:bg-[#121416]" : "bg-white text-gray-900 border",
              focusRing,
            ].join(" ")}
            aria-pressed={mode === "cinematic"}
          >
            <Eye className="w-4 h-4 mr-1" /> Cinematic
          </Button>

          <Button
            size="sm"
            onClick={() => setMode("grid")}
            className={[
              "h-8",
              mode === "grid" ? (isGR ? "bg-[#1A1C1F] text-[#E6E7E9] border border-[#17191B]" : "bg-gray-900 text-white") : isGR ? "bg-transparent text-[#E6E7E9] border border-[#17191B] hover:bg-[#121416]" : "bg-white text-gray-900 border",
              focusRing,
            ].join(" ")}
            aria-pressed={mode === "grid"}
          >
            <Grid3X3 className="w-4 h-4 mr-1" /> Grid
          </Button>

          <Button
            size="sm"
            onClick={onToggleGR}
            className={[ "h-8 px-3", isGR ? "bg-[#1A1C1F] text-[#EB0A1E] border border-[#17191B]" : "bg-white text-gray-900 border hover:bg-gray-50", focusRing].join(" ")}
            aria-pressed={isGR}
            aria-label="Toggle GR mode"
            title="Toggle GR mode"
          >
            GR
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <section className={bgWrap.className} style={bgWrap.style} aria-label={`${vehicle?.name} gallery`}>
      {Header}

      {/* Intro + chapters (cinematic) */}
      {mode === "cinematic" && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <div className={["rounded-3xl overflow-hidden relative", isGR ? "border border-[#17191B]" : "shadow-2xl"].join(" ")}>
            <div className="aspect-[21/9] w-full relative overflow-hidden">
              <motion.img
                src={(chapters[0]?.media?.[0]?.url as string) || (vehicle as AnyVehicle)?.image}
                alt={`${vehicle?.name} hero`}
                initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 1.04 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div className="max-w-[70%]">
                  <h1 className="text-white text-2xl sm:text-4xl font-black leading-tight">
                    {vehicle?.name} — {isGR ? "GR Performance" : "Signature Series"}
                  </h1>
                  <p className="text-white/85 mt-2 text-sm sm:text-base">
                    {isGR ? "Matte carbon craft. Track-bred precision. Everyday thrill." : "Impeccable design. Intelligent comfort. Effortless power."}
                  </p>
                </div>
                <Button
                  size="sm"
                  className={[isGR ? "bg-[#1A1C1F] text-[#E6E7E9] border border-[#17191B] hover:bg-[#15171A]" : "bg-white text-gray-900 hover:bg-gray-100", focusRing].join(" ")}
                >
                  <PlayCircle className="w-4 h-4 mr-1" />
                  Play film
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-16">
            {chapters.map((ch) => (
              <div key={ch.key} className="space-y-4" aria-labelledby={`chap-${ch.key}`}>
                <div className="flex items-baseline justify-between">
                  <div>
                    <h2 id={`chap-${ch.key}`} className={["font-black tracking-wide", isGR ? "text-[#E6E7E9]" : LX.text, "text-xl sm:text-2xl"].join(" ")}>
                      {ch.title}
                    </h2>
                    <p className={isGR ? "text-[#9DA2A6]" : LX.muted}>{ch.subtitle}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className={["h-8", isGR ? "border-[#17191B] text-[#E6E7E9] hover:bg-[#121416]" : "border-gray-300 text-gray-800 hover:bg-gray-50", focusRing].join(" ")}
                    onClick={() => setMode("grid")}
                  >
                    Browse all
                  </Button>
                </div>

                <div className="grid gap-8">
                  {ch.media.slice(0, 2).map((m, i) => (
                    <ParallaxFrame
                      key={m.url + i}
                      src={m.url}
                      alt={m.alt}
                      caption={i === 0 ? ch.subtitle : undefined}
                      isGR={isGR}
                      onOpen={() => onOpenFullscreen({ url: m.url, alt: m.alt })}
                      premium={m.premium}
                      hotspots={i === 0 ? ch.hotspots : undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      {mode === "grid" && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <RotateCcw className={isGR ? "text-[#9DA2A6]" : "text-gray-500"} />
              <span className={isGR ? "text-[#E6E7E9]" : "text-gray-900"}>Quick browse</span>
            </div>
            <Button size="sm" onClick={() => setMode("cinematic")} className={[ "h-8", isGR ? "bg-[#1A1C1F] text-[#E6E7E9] border border-[#17191B]" : "bg-gray-900 text-white", focusRing].join(" ")}>
              Back to cinematic
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {chapters.flatMap((ch) =>
              ch.media.map((m, i) => (
                <GridCard
                  key={`${ch.key}-${i}`}
                  src={m.url}
                  alt={m.alt}
                  premium={m.premium}
                  isGR={isGR}
                  onClick={() => {
                    setFsMedia({ url: m.url, alt: m.alt });
                    setFsOpen(true);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {fsOpen && fsMedia && (
          <motion.div
            role="dialog"
            aria-label="Fullscreen media viewer"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between p-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white">
                <Badge className="bg-white/10">Fullscreen</Badge>
                <span className="text-sm opacity-80">{vehicle?.name}</span>
              </div>
              <Button size="icon" aria-label="Close" onClick={() => setFsOpen(false)} className={`text-white bg-white/10 hover:bg-white/20 ${focusRing}`}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 flex items-center justify-center p-3">
              <motion.img
                key={fsMedia.url}
                src={fsMedia.url}
                alt={fsMedia.alt}
                className="max-w-full max-h-full object-contain rounded-lg"
                initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VehicleGallery;
