
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { X, Maximize2, Heart, Info, PlayCircle, ChevronRight, Zap, Eye, Grid3X3, RotateCcw, SplitSquareHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { useGalleryState } from "@/hooks/use-gallery-state";
import MobileGalleryView from "./gallery/MobileGalleryView";
import DesktopGalleryView from "./gallery/DesktopGalleryView";
import EnhancedFullscreenViewer from "./gallery/EnhancedFullscreenViewer";
import type { VehicleModel } from "@/types/vehicle";

/* ─────────────────────────────────────────
   Types
────────────────────────────────────────── */
type ChapterKey = "exterior" | "interior" | "technology" | "performance" | "lifestyle";

export type Chapter = {
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
      hotspots: [{ x: 54, y: 48, label: "12.3\" HD Display" }],
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
   Main component
────────────────────────────────────────── */
const VehicleGallery: React.FC<VehicleGalleryProps> = ({ 
  vehicle, 
  isGR = false, 
  onToggleGR, 
  initialMode = "cinematic" 
}) => {
  const chapters = useChapters(vehicle);
  const { isMobile, isDesktop } = useDeviceInfo();
  const galleryHook = useGalleryState(0);
  
  const [fsMedia, setFsMedia] = useState<{ url: string; alt: string } | null>(null);
  const [fsIndex, setFsIndex] = useState(0);

  // Initialize mode based on initial prop
  useEffect(() => {
    galleryHook.setMode(initialMode);
  }, [initialMode, galleryHook.setMode]);

  const allMedia = useMemo(() => {
    return chapters.flatMap(chapter => chapter.media);
  }, [chapters]);

  const onOpenFullscreen = useCallback((media: { url: string; alt: string }, index?: number) => {
    const mediaIndex = index !== undefined ? index : allMedia.findIndex(m => m.url === media.url);
    setFsMedia(media);
    setFsIndex(mediaIndex);
    galleryHook.setFullscreen(true);
  }, [allMedia, galleryHook.setFullscreen]);

  const onCloseFullscreen = useCallback(() => {
    setFsMedia(null);
    galleryHook.setFullscreen(false);
  }, [galleryHook.setFullscreen]);

  const onNavigateFullscreen = useCallback((index: number) => {
    if (index >= 0 && index < allMedia.length) {
      setFsMedia(allMedia[index]);
      setFsIndex(index);
    }
  }, [allMedia]);

  const bgWrap = isGR 
    ? { style: GR.carbon, className: "min-h-[100svh]" } 
    : { style: undefined, className: `min-h-[100svh] ${LX.bgGradient}` };

  const Header = (
    <div className="sticky top-0 z-20 backdrop-blur-md">
      <div className={[
        "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between",
        isGR ? "text-[#E6E7E9] border-b border-[#17191B]/80" : "text-gray-900 border-b border-gray-200/60"
      ].join(" ")}>
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
            onClick={() => galleryHook.setMode("cinematic")}
            className={[
              "h-8",
              galleryHook.state.mode === "cinematic" 
                ? (isGR ? "bg-[#1A1C1F] text-[#E6E7E9] border border-[#17191B]" : "bg-gray-900 text-white") 
                : isGR ? "bg-transparent text-[#E6E7E9] border border-[#17191B] hover:bg-[#121416]" : "bg-white text-gray-900 border",
              focusRing,
            ].join(" ")}
            aria-pressed={galleryHook.state.mode === "cinematic"}
          >
            <Eye className="w-4 h-4 mr-1" /> Cinematic
          </Button>

          <Button
            size="sm"
            onClick={() => galleryHook.setMode("grid")}
            className={[
              "h-8",
              galleryHook.state.mode === "grid" 
                ? (isGR ? "bg-[#1A1C1F] text-[#E6E7E9] border border-[#17191B]" : "bg-gray-900 text-white") 
                : isGR ? "bg-transparent text-[#E6E7E9] border border-[#17191B] hover:bg-[#121416]" : "bg-white text-gray-900 border",
              focusRing,
            ].join(" ")}
            aria-pressed={galleryHook.state.mode === "grid"}
          >
            <Grid3X3 className="w-4 h-4 mr-1" /> Grid
          </Button>

          {isDesktop && (
            <Button
              size="sm"
              onClick={() => galleryHook.setMode("split")}
              className={[
                "h-8",
                galleryHook.state.mode === "split" 
                  ? (isGR ? "bg-[#1A1C1F] text-[#E6E7E9] border border-[#17191B]" : "bg-gray-900 text-white") 
                  : isGR ? "bg-transparent text-[#E6E7E9] border border-[#17191B] hover:bg-[#121416]" : "bg-white text-gray-900 border",
                focusRing,
              ].join(" ")}
              aria-pressed={galleryHook.state.mode === "split"}
            >
              <SplitSquareHorizontal className="w-4 h-4 mr-1" /> Split
            </Button>
          )}

          <Button
            size="sm"
            onClick={onToggleGR}
            className={[
              "h-8 px-3",
              isGR ? "bg-[#1A1C1F] text-[#EB0A1E] border border-[#17191B]" : "bg-white text-gray-900 border hover:bg-gray-50",
              focusRing
            ].join(" ")}
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

      {/* Render appropriate view based on device */}
      {isMobile ? (
        <MobileGalleryView
          chapters={chapters}
          state={galleryHook.state}
          isGR={isGR}
          onChapterChange={galleryHook.setChapter}
          onImageOpen={onOpenFullscreen}
          onToggleFavorite={galleryHook.toggleFavorite}
          onModeChange={galleryHook.setMode}
        />
      ) : (
        <DesktopGalleryView
          chapters={chapters}
          state={galleryHook.state}
          isGR={isGR}
          onChapterChange={galleryHook.setChapter}
          onImageOpen={onOpenFullscreen}
          onToggleFavorite={galleryHook.toggleFavorite}
          onModeChange={galleryHook.setMode}
        />
      )}

      {/* Enhanced Fullscreen Viewer */}
      <EnhancedFullscreenViewer
        isOpen={galleryHook.state.isFullscreen}
        media={fsMedia}
        allMedia={allMedia}
        currentIndex={fsIndex}
        isGR={isGR}
        favorites={galleryHook.state.favorites}
        onClose={onCloseFullscreen}
        onToggleFavorite={galleryHook.toggleFavorite}
        onNavigate={onNavigateFullscreen}
      />
    </section>
  );
};

export default VehicleGallery;
