import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { X, Zap, Eye, Grid3X3, PlayCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { VehicleModel } from "@/types/vehicle";

/* ─────────────────────────────────────────
   Tokens
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
const LX_BG = "bg-[radial-gradient(1200px_400px_at_50%_-50%,#ffffff,rgba(240,241,244,0.92))]";
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#EB0A1E]";

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
   Safe image extraction (no vehicle.gallery required)
────────────────────────────────────────── */
type AnyVehicle = VehicleModel & Record<string, any>;
function asUrlList(x: unknown): string[] {
  if (!x) return [];
  if (Array.isArray(x)) {
    return x
      .map((v) => (typeof v === "string" ? v : typeof v === "object" && v && "url" in (v as any) ? (v as any).url : null))
      .filter((u): u is string => typeof u === "string");
  }
  return [];
}
function pickImages(v: AnyVehicle, keys: string[]): string[] {
  for (const k of keys) {
    const urls = asUrlList(v?.[k]);
    if (urls.length) return urls;
  }
  return [];
}

type ChapterKey = "exterior" | "interior" | "technology" | "performance" | "lifestyle";
type Chapter = {
  key: ChapterKey;
  title: string;
  subtitle: string;
  media: Array<{ url: string; alt: string; signature?: boolean }>;
};

function useChapters(vehicle: VehicleModel): Chapter[] {
  const v = vehicle as AnyVehicle;
  const cover =
    typeof v?.image === "string" && v.image
      ? v.image
      : "https://images.unsplash.com/photo-1541443131876-b8f75a3f3e2d?q=80&w=1600&auto=format&fit=crop";

  const exterior =
    pickImages(v, ["exteriorImages", "imagesExterior", "galleryExterior", "exterior"]).length
      ? pickImages(v, ["exteriorImages", "imagesExterior", "galleryExterior", "exterior"])
      : [cover, "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600&auto=format&fit=crop"];

  const interior =
    pickImages(v, ["interiorImages", "imagesInterior", "galleryInterior", "interior"]).length
      ? pickImages(v, ["interiorImages", "imagesInterior", "galleryInterior", "interior"])
      : ["https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1600&auto=format&fit=crop"];

  const technology =
    pickImages(v, ["technologyImages", "imagesTechnology", "galleryTechnology", "technology"]).length
      ? pickImages(v, ["technologyImages", "imagesTechnology", "galleryTechnology", "technology"])
      : ["https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600&auto=format&fit=crop"];

  const performance =
    pickImages(v, ["performanceImages", "imagesPerformance", "galleryPerformance", "performance"]).length
      ? pickImages(v, ["performanceImages", "imagesPerformance", "galleryPerformance", "performance"])
      : ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop"];

  const lifestyle =
    pickImages(v, ["lifestyleImages", "imagesLifestyle", "galleryLifestyle", "lifestyle"]).length
      ? pickImages(v, ["lifestyleImages", "imagesLifestyle", "galleryLifestyle", "lifestyle"])
      : ["https://images.unsplash.com/photo-1518965449314-2c4dc77b3b3a?q=80&w=1600&auto=format&fit=crop"];

  const map = (arr: string[], label: string) =>
    arr.map((url, i) => ({ url, alt: `${vehicle?.name || "Toyota"} — ${label} ${i + 1}`, signature: i === 0 }));

  return [
    { key: "exterior", title: "Exterior", subtitle: "Sculpted aerodynamics, iconic stance.", media: map(exterior, "Exterior") },
    { key: "interior", title: "Interior", subtitle: "Cockpit intuition, artisan materials.", media: map(interior, "Interior") },
    { key: "technology", title: "Technology", subtitle: "Intelligence that feels invisible.", media: map(technology, "Technology") },
    { key: "performance", title: "Performance", subtitle: "GR DNA — tuned for thrill.", media: map(performance, "Performance") },
    { key: "lifestyle", title: "Lifestyle", subtitle: "Ready for every journey.", media: map(lifestyle, "Lifestyle") },
  ];
}

/* ─────────────────────────────────────────
   Desktop: Scroll story (sticky media, narrative steps)
────────────────────────────────────────── */
const DesktopStory: React.FC<{
  chapters: Chapter[];
  isGR: boolean;
  vehicleName?: string;
  onOpen: (m: { url: string; alt: string }) => void;
}> = ({ chapters, isGR, vehicleName, onOpen }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const railY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const reduced = usePrefersReducedMotion();

  return (
    <div ref={containerRef} className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-12 gap-6">
      {/* Progress rail */}
      <div className="hidden lg:block absolute left-2 top-24 bottom-10 w-1 bg-black/5 rounded-full overflow-hidden">
        <motion.div
          className="w-full bg-gradient-to-b from-[#EB0A1E] to-[#7a0b13]"
          style={reduced ? undefined : { height: railY }}
        />
      </div>

      {/* Sticky media (left) */}
      <div className="col-span-12 lg:col-span-7 xl:col-span-8">
        <div className="lg:sticky lg:top-16">
          <StoryMediaStack chapters={chapters} isGR={isGR} onOpen={onOpen} />
        </div>
      </div>

      {/* Narrative (right) */}
      <div className="col-span-12 lg:col-span-5 xl:col-span-4 space-y-16">
        <header className="space-y-1 lg:mt-2">
          <div className="inline-flex items-center gap-2">
            {isGR ? <Zap className="w-4 h-4 text-[#EB0A1E]" /> : <Eye className="w-4 h-4 text-gray-800" />}
            <span className={isGR ? "text-[#E6E7E9] font-semibold" : "text-gray-900 font-semibold"}>
              {vehicleName} {isGR ? "GR Performance" : "Experience"}
            </span>
          </div>
          <p className={isGR ? "text-[#9DA2A6]" : "text-gray-600"}>
            Scroll to discover — no clutter, just story.
          </p>
        </header>

        {chapters.map((ch, idx) => (
          <section key={ch.key} className="space-y-3" aria-labelledby={`desk-${ch.key}`}>
            <h2 id={`desk-${ch.key}`} className={isGR ? "text-[#E6E7E9] text-xl font-black" : "text-gray-900 text-xl font-black"}>
              {ch.title}
            </h2>
            <p className={isGR ? "text-[#9DA2A6]" : "text-gray-600"}>{ch.subtitle}</p>

            <div className="grid grid-cols-2 gap-3">
              {ch.media.slice(0, 2).map((m, i) => (
                <motion.button
                  key={m.url + i}
                  onClick={() => onOpen({ url: m.url, alt: m.alt })}
                  className={[
                    "relative aspect-[16/10] rounded-xl overflow-hidden text-left",
                    isGR ? "border border-[#17191B]" : "shadow-md",
                    focusRing,
                  ].join(" ")}
                  whileHover={{ scale: 1.01 }}
                >
                  <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
                  {m.signature && (
                    <Badge className={isGR ? "absolute top-2 left-2 bg-[#1C1E21] border border-[#17191B] text-[#E6E7E9]" : "absolute top-2 left-2 bg-black/70"}>
                      Signature
                    </Badge>
                  )}
                  <div className="absolute bottom-2 right-2 text-white/95 text-xs px-2 py-1 rounded-full bg-black/30">
                    View <ChevronRight className="inline w-3 h-3 ml-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </section>
        ))}

        <footer className="pt-6 pb-2">
          <p className={isGR ? "text-[#9DA2A6] text-sm" : "text-gray-500 text-sm"}>
            End of story — explore specifications or book a test drive.
          </p>
        </footer>
      </div>
    </div>
  );
};

/** left sticky media that morphs as you scroll */
const StoryMediaStack: React.FC<{
  chapters: Chapter[];
  isGR: boolean;
  onOpen: (m: { url: string; alt: string }) => void;
}> = ({ chapters, isGR, onOpen }) => {
  const groupRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: groupRef, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-0.6, 0.6]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.02, 1]);
  const reduced = usePrefersReducedMotion();

  // choose the first image of each chapter for the big storytelling rail
  const heroMedia = useMemo(
    () => chapters.map((c) => c.media[0]).filter(Boolean),
    [chapters]
  );

  return (
    <div ref={groupRef} className="space-y-6">
      {heroMedia.map((m, i) => (
        <motion.div
          key={m.url + i}
          className={[
            "relative aspect-[16/9] rounded-2xl overflow-hidden",
            isGR ? "border border-[#17191B]" : "shadow-2xl",
          ].join(" ")}
          style={reduced ? undefined : { rotate, scale }}
        >
          <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <Button
              size="sm"
              onClick={() => onOpen({ url: m.url, alt: m.alt })}
              className={[
                "backdrop-blur-md",
                isGR ? "bg-[#141618]/80 text-[#E6E7E9] border border-[#17191B] hover:bg-[#181B1E]" : "bg-white text-gray-900 hover:bg-gray-100",
                focusRing,
              ].join(" ")}
            >
              <PlayCircle className="w-4 h-4 mr-1" />
              Open viewer
            </Button>
            {m.signature && (
              <Badge className={isGR ? "bg-[#1C1E21] border border-[#17191B] text-[#E6E7E9]" : "bg-black/70"}>Signature</Badge>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────────
   Mobile: cinematic swipe + thumb reel
────────────────────────────────────────── */
const MobileCinematic: React.FC<{
  chapters: Chapter[];
  isGR: boolean;
  onOpen: (m: { url: string; alt: string }) => void;
}> = ({ chapters, isGR, onOpen }) => {
  const [chapterIndex, setChapterIndex] = useState(0);
  const [mediaIndex, setMediaIndex] = useState(0);
  const current = chapters[chapterIndex];
  const reduced = usePrefersReducedMotion();

  useEffect(() => setMediaIndex(0), [chapterIndex]);

  return (
    <div className="px-4 sm:px-6">
      {/* Chapter chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pt-3 pb-2">
        {chapters.map((ch, i) => (
          <button
            key={ch.key}
            onClick={() => setChapterIndex(i)}
            className={[
              "px-3 py-1.5 rounded-full text-sm whitespace-nowrap",
              isGR
                ? i === chapterIndex
                  ? "bg-[#1A1C1F] text-[#E6E7E9] border border-[#17191B]"
                  : "bg-[#0F1113] text-[#9DA2A6] border border-[#17191B]"
                : i === chapterIndex
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-800",
              focusRing,
            ].join(" ")}
            aria-pressed={i === chapterIndex}
          >
            {ch.title}
          </button>
        ))}
      </div>

      {/* Active media */}
      <motion.div
        key={`${chapterIndex}-${mediaIndex}`}
        className={["relative aspect-video rounded-2xl overflow-hidden mt-3", isGR ? "border border-[#17191B]" : "shadow-xl"].join(" ")}
        initial={reduced ? { opacity: 1 } : { opacity: 0.8, scale: 0.98 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
      >
        <img
          src={current.media[mediaIndex]?.url}
          alt={current.media[mediaIndex]?.alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-xs opacity-90">{current.subtitle}</p>
          <div className="mt-2 flex items-center justify-between">
            <Badge className={isGR ? "bg-[#1C1E21] border border-[#17191B] text-[#E6E7E9]" : "bg-black/70"}>
              {current.title}
            </Badge>
            <Button
              size="sm"
              onClick={() => onOpen({ url: current.media[mediaIndex].url, alt: current.media[mediaIndex].alt })}
              className={[
                "h-8 px-3",
                isGR ? "bg-[#141618]/80 text-[#E6E7E9] border border-[#17191B]" : "bg-white text-gray-900",
                focusRing,
              ].join(" ")}
            >
              View
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Thumb reel */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-3">
        {current.media.map((m, i) => (
          <button
            key={m.url + i}
            onClick={() => setMediaIndex(i)}
            className={[
              "relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0",
              i === mediaIndex
                ? isGR
                  ? "ring-2 ring-[#EB0A1E]"
                  : "ring-2 ring-gray-900"
                : isGR
                ? "border border-[#17191B]"
                : "border border-gray-200",
              focusRing,
            ].join(" ")}
            aria-pressed={i === mediaIndex}
          >
            <img src={m.url} alt={m.alt} className="w-full h-full object-cover" />
            {m.signature && (
              <Badge className={isGR ? "absolute top-1 left-1 bg-[#1C1E21] border border-[#17191B] text-[#E6E7E9]" : "absolute top-1 left-1 bg-black/70"}>
                Sig.
              </Badge>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   Fullscreen viewer
────────────────────────────────────────── */
const FullscreenViewer: React.FC<{
  media: { url: string; alt: string } | null;
  open: boolean;
  onClose: () => void;
}> = ({ media, open, onClose }) => {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && media && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen media viewer"
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-white">
              <Badge className="bg-white/10">Fullscreen</Badge>
              <span className="text-sm opacity-80">{media.alt}</span>
            </div>
            <Button size="icon" aria-label="Close" onClick={onClose} className={`text-white bg-white/10 hover:bg-white/20 ${focusRing}`}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 flex items-center justify-center p-3">
            <motion.img
              key={media.url}
              src={media.url}
              alt={media.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
              animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────────────────
   Main component
────────────────────────────────────────── */
interface VehicleGalleryProps {
  vehicle: VehicleModel;
  isGR?: boolean;        // pass from parent (your global GR toggle)
  onToggleGR?: () => void;
}

const VehicleGallery: React.FC<VehicleGalleryProps> = ({ vehicle, isGR = false, onToggleGR }) => {
  const reduced = usePrefersReducedMotion();
  const chapters = useChapters(vehicle);
  const [fsOpen, setFsOpen] = useState(false);
  const [fsMedia, setFsMedia] = useState<{ url: string; alt: string } | null>(null);

  const onOpen = useCallback((m: { url: string; alt: string }) => {
    setFsMedia(m);
    setFsOpen(true);
  }, []);

  const bgProps = isGR
    ? { style: GR.carbon, className: "min-h-[100svh]" }
    : { style: undefined, className: `min-h-[100svh] ${LX_BG}` };

  return (
    <section className={bgProps.className} style={bgProps.style} aria-label={`${vehicle?.name} gallery`}>
      {/* Header / Switches */}
      <div className="sticky top-0 z-30 backdrop-blur-md">
        <div className={["max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between",
          isGR ? "text-[#E6E7E9] border-b border-[#17191B]/80" : "text-gray-900 border-b border-gray-200/60"].join(" ")}>
          <div className="inline-flex items-center gap-2">
            {isGR ? <Zap className="w-4 h-4 text-[#EB0A1E]" /> : <Eye className="w-4 h-4" />}
            <span className="tracking-wide font-semibold">{vehicle?.name} {isGR ? "GR" : "Gallery"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={onToggleGR}
              className={["h-8 px-3", isGR ? "bg-[#1A1C1F] text-[#EB0A1E] border border-[#17191B]" : "bg-white text-gray-900 border hover:bg-gray-50", focusRing].join(" ")}
              aria-pressed={isGR}
              aria-label="Toggle GR mode"
            >
              GR
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop story / Mobile cinematic */}
      <div className="hidden md:block">
        <DesktopStory chapters={chapters} isGR={isGR} vehicleName={vehicle?.name} onOpen={onOpen} />
      </div>
      <div className="md:hidden py-4">
        <MobileCinematic chapters={chapters} isGR={isGR} onOpen={onOpen} />
      </div>

      {/* Fullscreen */}
      <FullscreenViewer media={fsMedia} open={fsOpen} onClose={() => setFsOpen(false)} />
    </section>
  );
};

export default VehicleGallery;
