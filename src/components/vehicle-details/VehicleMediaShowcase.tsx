import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Zap,
  Gauge,
  Shield,
  Cpu,
  Car,
  Navigation,
  Award,
  Sparkles,
  Info,
  Eye,
  Wrench,
  Share2,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils";

/* =========================================================
   SafeImage: DAM-friendly with lazy + fallback, no-referrer
========================================================= */
type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackText?: string;
  ratioClass?: string; // e.g. "aspect-video"
  fit?: "cover" | "contain";
};
const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackText = "Image unavailable",
  ratioClass,
  fit = "cover",
  ...rest
}) => {
  const [errored, setErrored] = useState(false);
  return (
    <div className={cn("relative w-full", ratioClass)}>
      {!errored ? (
        <img
          src={src as string}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={cn("w-full h-full", fit === "cover" ? "object-cover" : "object-contain bg-black", className)}
          onError={() => setErrored(true)}
          {...rest}
        />
      ) : (
        <div className="w-full h-full grid place-items-center bg-muted text-muted-foreground text-xs">
          {fallbackText}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   Types (backwards compatible with your data)
========================================================= */
interface ImageDetailsOverride {
  specs?: string[];
  benefits?: string[];
  technology?: string[];
}
type ContentBlock = { id: string; title?: string; body?: string };

interface GalleryImage {
  url: string;
  title: string;
  description: string;
  details?: ImageDetailsOverride;
  contentBlocks?: ContentBlock[];
  badges?: string[];
}

interface MediaItem {
  id: string;
  type: "image" | "video" | "360";
  url: string;
  thumbnail?: string;
  title: string;
  description: string;
  category: string;
  icon: React.ComponentType<any>;
  details: {
    specs?: string[];
    benefits?: string[];
    technology?: string[];
  };
  isPremium?: boolean;
  galleryImages?: GalleryImage[];
}

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

/* =========================================================
   Small utilities
========================================================= */
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

function usePreloadNeighbors(list: string[], index: number) {
  useEffect(() => {
    if (!list?.length) return;
    const next = list[(index + 1) % list.length];
    const prev = list[(index - 1 + list.length) % list.length];
    [next, prev].forEach((src) => {
      if (!src) return;
      const img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = src;
    });
  }, [list, index]);
}

/** Deep linking: push state on change; read state on load (with clamping) */
function useDeepLinking(
  selectedMedia: MediaItem | null,
  imageIndex: number,
  setSelectedMedia: (m: MediaItem | null) => void,
  setImageIndex: (i: number) => void,
  mediaItems: MediaItem[],
  isInitialized: boolean,
  setIsInitialized: (initialized: boolean) => void
) {
  // push state on change - only after initialization to prevent auto popup
  useEffect(() => {
    if (!selectedMedia || !isInitialized) return;
    const url = new URL(window.location.href);
    url.searchParams.set("media", selectedMedia.id);
    url.searchParams.set("img", String(imageIndex));
    window.history.replaceState({}, "", url.toString());
  }, [selectedMedia, imageIndex, isInitialized]);

  // read state on load - only if there's a media parameter to avoid auto popup
  useEffect(() => {
    if (mediaItems.length === 0) return;

    const url = new URL(window.location.href);
    const mediaId = url.searchParams.get("media");
    const imgIdx = url.searchParams.get("img");

    // Only open modal if explicitly requested via URL parameters AND user navigated here with intent
    if (mediaId && document.referrer && document.referrer.includes("media=")) {
      const found = mediaItems.find((m) => m.id === mediaId);
      if (found) {
        const rawIdx = Number(imgIdx);
        const maxIdx = (found.galleryImages?.length ?? 1) - 1;
        const safeIdx = Number.isFinite(rawIdx) && rawIdx >= 0 ? Math.min(rawIdx, Math.max(0, maxIdx)) : 0;
        setSelectedMedia(found);
        setImageIndex(safeIdx);
      }
    }

    // Mark as initialized after initial load
    setTimeout(() => {
      setIsInitialized(true);
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaItems, setIsInitialized]);
}

/* =========================================================
   Main component
========================================================= */
const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const isMobile = useIsMobile();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // mobile card index
  const [activeIndex, setActiveIndex] = useState(0); // <-- single source of truth for modal
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Performance optimization - memoize media items
  const mediaItems: MediaItem[] = useMemo(
    () => [
      {
        id: "performance",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true",
        title: "V6 Twin-Turbo Engine",
        description: "Experience unmatched power and efficiency with our advanced twin-turbo technology",
        category: "Performance",
        icon: Zap,
        details: {
          specs: ["3.5L V6 Twin-Turbo", "400+ HP", "0-60 in 4.2s", "EPA 28 MPG"],
          benefits: ["Superior acceleration", "Fuel efficiency", "Reduced emissions"],
          technology: ["Direct injection", "Variable valve timing", "Turbo lag elimination"],
        },
        isPremium: true,
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
            title: "Engine Bay Overview",
            description: "Complete view of the V6 twin-turbo engine with advanced cooling systems and precision engineering",
            contentBlocks: [
              { id: "perf-0-a", title: "Cooling Strategy", body: "Dual-path cooling improves thermal stability under load." },
              { id: "perf-0-b", title: "Packaging", body: "Low-mounted turbos reduce CoG and improve throttle response." },
            ],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
            title: "Turbocharger Detail",
            description: "Advanced twin-turbo technology featuring variable geometry turbines for optimal power delivery",
            details: { technology: ["VGT turbines", "Low-inertia impellers"] },
            contentBlocks: [{ id: "perf-1-a", title: "VGT Benefits", body: "Wider torque band with minimal lag in city and highway." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0bcbeaea-ebe3-4d5a-b2f1-ee6cc38df9e2/renditions/56630e9b-b76a-4023-9af6-040187f89ad8?binary=true&mformat=true",
            title: "Performance Specs",
            description: "Technical specifications showcasing industry-leading performance metrics and efficiency ratings",
            details: { specs: ["400+ HP", "0–60 in 4.2s"] },
            contentBlocks: [{ id: "perf-2-a", title: "Numbers that Matter", body: "Top-tier acceleration with efficient cruising economy." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
            title: "Engine Control Unit",
            description: "State-of-the-art ECU managing engine parameters for optimal performance and fuel economy",
            details: { technology: ["Knock learning", "Adaptive spark", "Closed-loop boost"] },
            contentBlocks: [{ id: "perf-3-a", title: "Smart ECU", body: "Continuously adapts for environment and fuel quality." }],
          },
        ],
      },
      {
        id: "interior",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
        title: "Luxury Interior",
        description: "Premium materials and cutting-edge technology create an unparalleled driving experience",
        category: "Interior",
        icon: Car,
        details: {
          specs: ['Leather-appointed seats', '12.3" display', "Premium audio", "Climate zones"],
          benefits: ["Ultimate comfort", "Intuitive controls", "Personalized experience"],
          technology: ["Heated/ventilated seats", "Wireless charging", "Voice recognition"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true",
            title: "Dashboard Overview",
            description: "Premium dashboard featuring digital instrument cluster and intuitive control layout",
            contentBlocks: [{ id: "int-0-a", title: "Driver Focused", body: "Controls angled toward the driver for ergonomics." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/84e8c1f6-161b-4fad-a1b2-aa9f00446b1d/renditions/c46fa084-5605-492e-8834-fae4693096f4?binary=true&mformat=true",
            title: "Leather Seats",
            description: "Hand-crafted leather seating with premium stitching and ergonomic support design",
            contentBlocks: [{ id: "int-1-a", title: "Seating", body: "Ventilated with memory & multi-way adjust." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
            title: "Center Console",
            description: "Ergonomic center console with premium materials and convenient storage solutions",
            contentBlocks: [{ id: "int-2-a", title: "Usability", body: "Wireless charge pad and hidden storage." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/724e565c-9702-4e50-a1e5-b18351a75a82/renditions/37e39a52-c8d8-4d23-89c9-041b369d9429?binary=true&mformat=true",
            title: "Rear Seating",
            description: "Spacious rear passenger compartment with individual climate controls and premium amenities",
            contentBlocks: [{ id: "int-3-a", title: "Rear Comfort", body: "Dedicated vents and USB-C ports." }],
          },
        ],
      },
      {
        id: "safety",
        type: "video",
        url: "https://www.youtube.com/watch?v=NCSxxuPE6wM",
        thumbnail:
          "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
        title: "Toyota Safety Sense",
        description: "Advanced safety systems that protect what matters most",
        category: "Safety",
        icon: Shield,
        details: {
          specs: ["Pre-collision system", "Lane assist", "Adaptive cruise", "Blind spot monitor"],
          benefits: ["Accident prevention", "Stress reduction", "Confident driving"],
          technology: ["Radar sensors", "Camera systems", "AI processing"],
        },
        isPremium: true,
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
            title: "Safety Overview",
            description: "Comprehensive safety suite featuring advanced driver assistance systems and protective technologies",
            contentBlocks: [{ id: "safe-0-a", title: "ADAS Suite", body: "Camera + radar fusion for robust detection." }],
          },
        ],
      },
      {
        id: "handling",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
        title: "Dynamic Handling",
        description: "Precision engineering delivers exceptional road feel and control",
        category: "Performance",
        icon: Navigation,
        details: {
          specs: ["Adaptive suspension", "All-wheel drive", "Sport mode", "Electronic stability"],
          benefits: ["Superior grip", "Smooth ride", "Confident cornering"],
          technology: ["Active dampers", "Torque vectoring", "Drive mode selection"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
            title: "Suspension System",
            description: "Advanced adaptive suspension technology providing optimal balance between comfort and performance",
            contentBlocks: [{ id: "hand-0-a", title: "Adaptive Dampers", body: "Millisecond-level response for composure." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
            title: "Wheel Design",
            description: "Performance-oriented wheel design with advanced brake cooling and aerodynamic efficiency",
            contentBlocks: [{ id: "hand-1-a", title: "Cooling Vanes", body: "Ducted flow reduces fade on track days." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
            title: "Drive Modes",
            description: "Multiple drive modes allowing customization of vehicle dynamics for any driving situation",
            contentBlocks: [{ id: "hand-2-a", title: "Tunable Feel", body: "Calm in Eco, sharp in Sport." }],
          },
        ],
      },
      {
        id: "tech",
        type: "360",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
        title: "Connected Technology",
        description: "Stay connected with intelligent features that enhance every journey",
        category: "Technology",
        icon: Cpu,
        details: {
          specs: ["Apple CarPlay", "Android Auto", "WiFi hotspot", "OTA updates"],
          benefits: ["Seamless integration", "Always updated", "Enhanced convenience"],
          technology: ["5G connectivity", "Cloud services", "AI assistant"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
            title: "Infotainment System",
            description: "Advanced infotainment with seamless smartphone integration",
            contentBlocks: [{ id: "tech-0-a", title: "HMI", body: "Low-latency touch with voice fallback." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
            title: "Digital Cockpit",
            description: "Real-time vehicle info with customizable layouts",
            contentBlocks: [{ id: "tech-1-a", title: "Clusters", body: "Themes per drive mode + widgets." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
            title: "Connected Services",
            description: "Cloud-based services providing remote vehicle monitoring, maintenance alerts, and OTA updates",
            contentBlocks: [{ id: "tech-2-a", title: "Cloud", body: "Remote lock, diagnostics & route sync." }],
          },
        ],
      },
      {
        id: "build-quality",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
        title: "Premium Build Quality",
        description: "Exceptional craftsmanship and attention to detail in every component",
        category: "Quality",
        icon: Wrench,
        details: {
          specs: ["High-strength steel", "Premium paint finish", "Precision assembly", "Quality control"],
          benefits: ["Long-lasting durability", "Refined appearance", "Reduced maintenance"],
          technology: ["Advanced materials", "Robotic assembly", "Quality testing"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/50d87eac-d48e-42f3-81b6-dcaa8a7e052a/renditions/15967074-ba68-442a-b403-d7a62a10171f?binary=true&mformat=true",
            title: "Manufacturing Excellence",
            description: "State-of-the-art manufacturing processes ensuring consistent quality and precision in every vehicle",
            contentBlocks: [{ id: "qual-0-a", title: "Automation", body: "Robotic precision with human QA." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
            title: "Material Quality",
            description: "Premium materials for durability, sustainability, and a luxurious feel",
            contentBlocks: [{ id: "qual-1-a", title: "Materials", body: "Corrosion-resistant coatings & sealants." }],
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/a876132d-c35d-4d35-99c7-651e180dd8a1/renditions/98c1ac8c-a8bc-4f7c-8862-31fb9f7bff30?binary=true&mformat=true",
            title: "Finish Details",
            description: "Meticulous paint quality, panel gaps, and surface textures",
            contentBlocks: [{ id: "qual-2-a", title: "Finish", body: "Multi-stage paint with laser gap checks." }],
          },
        ],
      },
    ],
    []
  );

  // Early bail
  if (!mediaItems || mediaItems.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No media available.</div>;
  }

  // Mobile swipe for card carousel
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => setCurrentIndex((p) => Math.min(p + 1, mediaItems.length - 1)),
    onSwipeRight: () => setCurrentIndex((p) => Math.max(p - 1, 0)),
    threshold: 40,
  });

  // Open/close modal
  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
    setActiveIndex(0);
    setIsPlaying(media.type === "video");
  };
  const closeModal = useCallback(() => {
    setSelectedMedia(null);
    setIsPlaying(false);
  }, []);

  // Scroll lock when open
  useBodyScrollLock(!!selectedMedia);

  // Keyboard navigation (changes activeIndex only)
  useEffect(() => {
    if (!selectedMedia) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMedia, closeModal, activeIndex]);

  // Prev/Next for modal
  const next = () => {
    const len = selectedMedia?.galleryImages?.length ?? 0;
    if (!len) return;
    setActiveIndex((p) => (p + 1) % len);
  };
  const prev = () => {
    const len = selectedMedia?.galleryImages?.length ?? 0;
    if (!len) return;
    setActiveIndex((p) => (p - 1 + len) % len);
  };

  // Current asset + content (comes only from activeIndex; no scroll linkage)
  const currImg = useMemo(() => {
    if (!selectedMedia) return { url: "", title: "", description: "" };
    const g = selectedMedia.galleryImages;
    if (g && g.length > 0) {
      const clamped = Math.min(Math.max(0, activeIndex), g.length - 1);
      return g[clamped];
    }
    // fallback to top-level media when no gallery provided
    return { url: selectedMedia.url, title: selectedMedia.title, description: selectedMedia.description };
  }, [selectedMedia, activeIndex]);

  // Merge details: image overrides -> media-level fallback
  const mergedDetails = useMemo(() => {
    if (!selectedMedia) return undefined;
    const imgDetails = (currImg as GalleryImage).details;
    const base = selectedMedia.details || {};
    return {
      specs: imgDetails?.specs ?? base.specs,
      benefits: imgDetails?.benefits ?? base.benefits,
      technology: imgDetails?.technology ?? base.technology,
    };
  }, [selectedMedia, currImg]);

  // Preload neighbors for smooth image swaps
  usePreloadNeighbors((selectedMedia?.galleryImages || []).map((g) => g.url), activeIndex);

  // Deep linking: reflect activeIndex in URL and read on mount
  useDeepLinking(selectedMedia, activeIndex, setSelectedMedia, setActiveIndex, mediaItems, isInitialized, setIsInitialized);

  // Video controls (YouTube embed)
  const toggleMute = () => setIsMuted((m) => !m);
  const togglePlay = () => setIsPlaying((p) => !p);
  const renderVideo = (url: string) => {
    const m = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
    const vid = m ? m[1] : "";
    const params = `?rel=0&modestbranding=1&controls=1&playsinline=1${isMuted ? "&mute=1" : ""}${isPlaying ? "&autoplay=1" : ""}`;
    return (
      <div className="relative w-full aspect-video bg-black">
        <iframe
          title="video"
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${vid}${params}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  // Share deep link
  const onShare = async () => {
    const url = new URL(window.location.href);
    if (selectedMedia) {
      url.searchParams.set("media", selectedMedia.id);
      url.searchParams.set("img", String(activeIndex));
    }
    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {}
  };

  return (
    <div className="relative bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <div className="text-center py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Badge variant="outline" className="px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Explore Features
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {vehicle.name} Highlights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the advanced technologies and premium features that make every drive exceptional
          </p>
        </motion.div>
      </div>

      {/* Mobile carousel */}
      <div className="px-4 md:px-8 pb-8 md:hidden">
        <div ref={swipeableRef} className="relative">
          <motion.div key={currentIndex} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="w-full">
            <MediaCard media={mediaItems[currentIndex]} onClick={() => handleMediaClick(mediaItems[currentIndex])} isMobile />
          </motion.div>
          <div className="flex justify-center mt-6 space-x-2">
            {mediaItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to item ${i + 1}`}
                className={cn("w-3 h-3 rounded-full transition-all", i === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30")}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:block px-4 md:px-8 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <MediaCard media={m} onClick={() => handleMediaClick(m)} isMobile={false} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 m-0 md:inset-6 md:rounded-2xl bg-background shadow-2xl overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
            >
              {/* Header (non-sticky) */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b bg-background/95">
                <div className="min-w-0">
                  <h3 className="text-lg md:text-2xl font-bold truncate">{selectedMedia.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base truncate">{selectedMedia.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={onShare} aria-label="Copy deep link" className="hover:bg-muted">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  {selectedMedia.type !== "video" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsZoomed((z) => !z)}
                      aria-label={isZoomed ? "Exit zoom" : "Zoom image"}
                      className="hover:bg-muted"
                    >
                      {isZoomed ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                    </Button>
                  )}
                  {selectedMedia.type === "video" && (
                    <>
                      <Button variant="ghost" size="icon" onClick={toggleMute} aria-label="Toggle mute" className="hover:bg-muted">
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={togglePlay} aria-label="Toggle play" className="hover:bg-muted">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" onClick={closeModal} aria-label="Close" className="hover:bg-muted">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content: mobile = stacked, md+ = two panes */}
              <div className="flex-1 grid md:grid-cols-2 min-h-0">
                {/* Visual pane */}
                <div className={cn("relative bg-black min-h-[42svh] md:min-h-0", isZoomed && "cursor-zoom-out")}>
                  {/* Main visual */}
                  {selectedMedia.type === "video" ? (
                    renderVideo(selectedMedia.url)
                  ) : (
                    <div
                      className={cn("relative w-full h-full", "md:aspect-auto aspect-[16/10]", isZoomed ? "overflow-auto" : "overflow-hidden")}
                      onDoubleClick={() => setIsZoomed((z) => !z)}
                    >
                      <SafeImage
                        src={currImg.url}
                        alt={currImg.title}
                        fit={isZoomed ? "cover" : "contain"}
                        className={cn("transition-transform duration-300", isZoomed ? "scale-105" : "")}
                      />
                    </div>
                  )}

                  {/* Arrows + counter */}
                  {selectedMedia.galleryImages && selectedMedia.galleryImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                      <div aria-live="polite" className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                        {selectedMedia.galleryImages ? activeIndex + 1 : 1} / {selectedMedia.galleryImages?.length ?? 1}
                      </div>
                    </>
                  )}

                  {/* Thumbs */}
                  {selectedMedia.galleryImages && selectedMedia.galleryImages.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur p-3">
                      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Image thumbnails">
                        {selectedMedia.galleryImages.map((img, idx) => (
                          <button
                            key={idx}
                            role="tab"
                            aria-selected={idx === activeIndex}
                            onClick={() => setActiveIndex(idx)} // <-- only this changes content
                            aria-label={`Thumbnail ${idx + 1}`}
                            className={cn(
                              "flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/60",
                              idx === activeIndex ? "border-primary" : "border-transparent hover:border-primary/50"
                            )}
                          >
                            <SafeImage src={img.url} alt={img.title} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Text/content pane (bound to activeIndex only) */}
                <div className="min-h-0 overflow-y-auto p-4 md:p-6">
                  {/* Per-image heading + badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {(currImg as GalleryImage).badges?.map((b) => (
                      <Badge key={b} variant="secondary" className="text-xs">
                        {b}
                      </Badge>
                    ))}
                  </div>
                  <h4 className="font-semibold text-lg">{currImg.title || selectedMedia.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{currImg.description || selectedMedia.description}</p>

                  {/* Details (image overrides -> fallback to media-level) */}
                  <div className="grid md:grid-cols-3 gap-6 mt-5">
                    {mergedDetails?.specs && mergedDetails.specs.length > 0 && (
                      <div>
                        <h5 className="font-semibold flex items-center mb-2">
                          <Gauge className="h-4 w-4 mr-2" />
                          Specifications
                        </h5>
                        <ul className="space-y-2">
                          {mergedDetails.specs.map((s, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {mergedDetails?.benefits && mergedDetails.benefits.length > 0 && (
                      <div>
                        <h5 className="font-semibold flex items-center mb-2">
                          <Award className="h-4 w-4 mr-2" />
                          Key Benefits
                        </h5>
                        <ul className="space-y-2">
                          {mergedDetails.benefits.map((b, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {mergedDetails?.technology && mergedDetails.technology.length > 0 && (
                      <div>
                        <h5 className="font-semibold flex items-center mb-2">
                          <Cpu className="h-4 w-4 mr-2" />
                          Technology
                        </h5>
                        <ul className="space-y-2">
                          {mergedDetails.technology.map((t, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Content blocks */}
                  {(currImg as GalleryImage).contentBlocks && (currImg as GalleryImage).contentBlocks!.length > 0 && (
                    <div className="space-y-3 pt-6 border-t mt-6">
                      {(currImg as GalleryImage).contentBlocks!.map((b) => (
                        <div key={b.id} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <div>
                            {b.title && <p className="font-medium">{b.title}</p>}
                            {b.body && <p className="text-sm text-muted-foreground">{b.body}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* =========================================================
   Media Card (runtime-safe)
========================================================= */
interface MediaCardProps {
  media?: MediaItem | null;
  onClick: () => void;
  isMobile: boolean;
}
const MediaCard: React.FC<MediaCardProps> = ({ media, onClick, isMobile }) => {
  if (!media) return null;
  const Icon = (media.icon ?? Info) as React.ComponentType<any>;
  const isVideo = media.type === "video";
  const is360 = media.type === "360";

  return (
    <motion.div whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -4 }} whileTap={{ scale: 0.98 }} className="cursor-pointer" onClick={onClick}>
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          <div className="relative h-64 md:h-80 overflow-hidden">
            <SafeImage src={media.url} alt={media.title} className="transition-transform duration-500 hover:scale-105" fit="cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute top-3 right-3 flex gap-2">
              {isVideo && (
                <Badge className="bg-red-500/90 text-white">
                  <Play className="h-3 w-3 mr-1" />
                  Video
                </Badge>
              )}
              {is360 && (
                <Badge className="bg-purple-500/90 text-white">
                  <Eye className="h-3 w-3 mr-1" />
                  360°
                </Badge>
              )}
              {media.isPremium && <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">Premium</Badge>}
            </div>

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge variant="secondary" className="mb-2 text-xs">
                {media.category}
              </Badge>
              <h3 className="text-white font-bold text-lg md:text-xl mb-1">{media.title}</h3>
              <p className="text-white/80 text-sm line-clamp-2">{media.description}</p>
            </div>

            <div className="absolute inset-0 bg-primary/15 opacity-0 hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                <Info className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default VehicleMediaShowcase;
