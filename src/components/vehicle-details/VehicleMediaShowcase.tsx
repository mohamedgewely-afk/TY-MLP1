import React, { useState, useEffect, useRef, useCallback } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils";

/* -----------------------------
   SafeImage: reliable DAM renders
------------------------------ */
type SafeImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackText?: string;
  ratioClass?: string; // e.g., "aspect-video"
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
          className={cn(
            "w-full h-full",
            fit === "cover" ? "object-cover" : "object-contain bg-black",
            className
          )}
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

/* -----------------------------
   Types
------------------------------ */
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
  galleryImages?: {
    url: string;
    title: string;
    description: string;
  }[];
}

interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
}

/* -----------------------------
   Main Component
------------------------------ */
const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle }) => {
  const isMobile = useIsMobile();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  // Keep your original mediaItems (DAM URLs preserved)
  const mediaItems: MediaItem[] = [
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
          description:
            "Complete view of the V6 twin-turbo engine with advanced cooling systems and precision engineering",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
          title: "Turbocharger Detail",
          description:
            "Advanced twin-turbo technology featuring variable geometry turbines for optimal power delivery",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0bcbeaea-ebe3-4d5a-b2f1-ee6cc38df9e2/renditions/56630e9b-b76a-4023-9af6-040187f89ad8?binary=true&mformat=true",
          title: "Performance Specs",
          description:
            "Technical specifications showcasing industry-leading performance metrics and efficiency ratings",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
          title: "Engine Control Unit",
          description:
            "State-of-the-art ECU managing engine parameters for optimal performance and fuel economy",
        },
      ],
    },
    {
      id: "interior",
      type: "image",
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
      title: "Luxury Interior",
      description:
        "Premium materials and cutting-edge technology create an unparalleled driving experience",
      category: "Interior",
      icon: Car,
      details: {
        specs: ['Leather-appointed seats', '12.3" display', "Premium audio", "Climate zones"],
        benefits: ["Ultimate comfort", "Intuitive controls", "Personalized experience"],
        technology: ["Heated/ventilated seats", "Wireless charging", "Voice recognition"],
      },
      galleryImages: [
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
          title: "Dashboard Overview",
          description:
            "Premium dashboard featuring digital instrument cluster and intuitive control layout",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/84e8c1f6-161b-4fad-a1b2-aa9f00446b1d/renditions/c46fa084-5605-492e-8834-fae4693096f4?binary=true&mformat=true",
          title: "Leather Seats",
          description: "Hand-crafted leather seating with premium stitching and ergonomic support design",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
          title: "Center Console",
          description:
            "Ergonomic center console with premium materials and convenient storage solutions",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/724e565c-9702-4e50-a1e5-b18351a75a82/renditions/37e39a52-c8d8-4d23-89c9-041b369d9429?binary=true&mformat=true",
          title: "Rear Seating",
          description:
            "Spacious rear passenger compartment with individual climate controls and premium amenities",
        },
      ],
    },
    {
      id: "safety",
      type: "video",
      url: "https://www.youtube.com/watch?v=xEKrrzLvya8",
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
          description:
            "Comprehensive safety suite featuring advanced driver assistance systems and protective technologies",
        },
      ],
    },
    {
      id: "handling",
      type: "image",
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/789539dd-acfe-43aa-98a0-9ce5202ad482/renditions/2c61418f-a1b7-4899-93a8-65582ee09a0d?binary=true&mformat=true",
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
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/b597478a-f34f-439d-a904-61fc6d458a66/renditions/a44596eb-4eff-4aba-bb21-ef59b730358f?binary=true&mformat=true",
          title: "Suspension System",
          description:
            "Advanced adaptive suspension technology providing optimal balance between comfort and performance",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/4d591b47-2866-457a-816a-a808ca9a364e/renditions/d8f9f2ed-a09d-4ecf-9586-02af429a86c2?binary=true&mformat=true",
          title: "Wheel Design",
          description:
            "Performance-oriented wheel design with advanced brake cooling and aerodynamic efficiency",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
          title: "Drive Modes",
          description:
            "Multiple drive modes allowing customization of vehicle dynamics for any driving situation",
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
          description:
            "Advanced infotainment system with intuitive interface and seamless smartphone integration",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
          title: "Digital Cockpit",
          description:
            "Fully digital instrument cluster providing real-time vehicle information and customizable displays",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
          title: "Connected Services",
          description:
            "Cloud-based services providing remote vehicle monitoring, maintenance alerts, and over-the-air updates",
        },
      ],
    },
    {
      id: "build-quality",
      type: "image",
      url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0bcbeaea-ebe3-4d5a-b2f1-ee6cc38df9e2/renditions/56630e9b-b76a-4023-9af6-040187f89ad8?binary=true&mformat=true",
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
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0bcbeaea-ebe3-4d5a-b2f1-ee6cc38df9e2/renditions/56630e9b-b76a-4023-9af6-040187f89ad8?binary=true&mformat=true",
          title: "Manufacturing Excellence",
          description:
            "State-of-the-art manufacturing processes ensuring consistent quality and precision in every vehicle",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0bcbeaea-ebe3-4d5a-b2f1-ee6cc38df9e2/renditions/56630e9b-b76a-4023-9af6-040187f89ad8?binary=true&mformat=true",
          title: "Material Quality",
          description:
            "Premium materials selected for durability, sustainability, and luxurious feel throughout the vehicle",
        },
        {
          url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0bcbeaea-ebe3-4d5a-b2f1-ee6cc38df9e2/renditions/56630e9b-b76a-4023-9af6-040187f89ad8?binary=true&mformat=true",
          title: "Finish Details",
          description:
            "Meticulous attention to finish details including paint quality, panel gaps, and surface textures",
        },
      ],
    },
  ];

  /* -----------------------------
     Swipe (mobile carousel)
  ------------------------------ */
  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => setCurrentIndex((p) => Math.min(p + 1, mediaItems.length - 1)),
    onSwipeRight: () => setCurrentIndex((p) => Math.max(p - 1, 0)),
    threshold: 40,
  });

  /* -----------------------------
     Modal helpers
  ------------------------------ */
  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media);
    setModalImageIndex(0);
  };

  const closeModal = useCallback(() => {
    setSelectedMedia(null);
    setIsPlaying(false);
  }, []);

  const nextModalImage = () => {
    if (selectedMedia?.galleryImages?.length) {
      setModalImageIndex((p) => (p + 1) % selectedMedia.galleryImages!.length);
    }
  };
  const prevModalImage = () => {
    if (selectedMedia?.galleryImages?.length) {
      setModalImageIndex((p) => (p - 1 + selectedMedia.galleryImages!.length) % selectedMedia.galleryImages!.length);
    }
  };

  const getCurrentImageData = () => {
    if (selectedMedia?.galleryImages && selectedMedia.galleryImages[modalImageIndex]) {
      return selectedMedia.galleryImages[modalImageIndex];
    }
    return {
      url: selectedMedia?.url || "",
      title: selectedMedia?.title || "",
      description: selectedMedia?.description || "",
    };
  };

  /* -----------------------------
     Body scroll lock when modal open
  ------------------------------ */
  useEffect(() => {
    if (selectedMedia) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [selectedMedia]);

  /* -----------------------------
     Keyboard nav inside modal
  ------------------------------ */
  useEffect(() => {
    if (!selectedMedia) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextModalImage();
      if (e.key === "ArrowLeft") prevModalImage();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMedia, closeModal]);

  /* -----------------------------
     Video controls (YouTube iframe)
  ------------------------------ */
  const toggleMute = () => setIsMuted((m) => !m);
  const togglePlay = () => setIsPlaying((p) => !p);

  const renderVideo = (url: string) => {
    // Convert standard YouTube URL to embed
    const match = url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/);
    const vid = match ? match[1] : "";
    const params = `?rel=0&modestbranding=1&controls=1&playsinline=1${isMuted ? "&mute=1" : ""}${
      isPlaying ? "&autoplay=1" : ""
    }`;
    const src = `https://www.youtube.com/embed/${vid}${params}`;
    return (
      <div className="relative w-full aspect-video bg-black">
        <iframe
          title="video"
          className="absolute inset-0 w-full h-full"
          src={src}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  return (
    <div className="relative bg-gradient-to-b from-background to-muted/30">
      {/* Hero Header */}
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

      {/* Mobile Carousel */}
      <div className="px-4 md:px-8 pb-8 md:hidden">
        <div ref={swipeableRef} className="relative">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="w-full"
          >
            <MediaCard
              media={mediaItems[currentIndex]}
              onClick={() => handleMediaClick(mediaItems[currentIndex])}
              isMobile
            />
          </motion.div>

          {/* Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to item ${index + 1}`}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index === currentIndex ? "bg-primary scale-125" : "bg-muted-foreground/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:block px-4 md:px-8 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((media, index) => (
            <motion.div key={media.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <MediaCard media={media} onClick={() => handleMediaClick(media)} isMobile={false} />
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
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 m-0 md:inset-6 md:rounded-2xl bg-background shadow-2xl overflow-hidden flex flex-col"
              role="dialog"
              aria-modal="true"
            >
              {/* Sticky header (prevents clipping on small screens) */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
                <div className="min-w-0">
                  <h3 className="text-lg md:text-2xl font-bold truncate">{selectedMedia.title}</h3>
                  <p className="text-muted-foreground text-sm md:text-base truncate">{selectedMedia.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedMedia.type === "video" && (
                    <>
                      <Button variant="ghost" size="icon" onClick={toggleMute} className="hover:bg-muted" aria-label="Toggle Mute">
                        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={togglePlay} className="hover:bg-muted" aria-label="Toggle Play">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" onClick={closeModal} className="hover:bg-muted" aria-label="Close">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content area */}
              <div className="flex-1 grid md:grid-cols-2 min-h-0">
                {/* Visual pane */}
                <div className="relative min-h-[40vh] md:min-h-0 bg-black">
                  {/* Main visual: keep entire asset visible */}
                  {selectedMedia.type === "video" ? (
                    renderVideo(selectedMedia.url)
                  ) : (
                    <SafeImage
                      src={getCurrentImageData().url}
                      alt={getCurrentImageData().title}
                      ratioClass="md:aspect-auto aspect-[16/10]"
                      fit="contain"
                    />
                  )}

                  {/* Gallery nav (only if multiple images) */}
                  {selectedMedia.galleryImages && selectedMedia.galleryImages.length > 1 && (
                    <>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={prevModalImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={nextModalImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>

                      {/* Counter */}
                      <div className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs">
                        {modalImageIndex + 1} / {selectedMedia.galleryImages.length}
                      </div>
                    </>
                  )}

                  {/* Thumbnails */}
                  {selectedMedia.galleryImages && selectedMedia.galleryImages.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur p-3">
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {selectedMedia.galleryImages.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setModalImageIndex(idx)}
                            className={cn(
                              "flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all",
                              idx === modalImageIndex ? "border-primary" : "border-transparent hover:border-primary/50"
                            )}
                            aria-label={`Thumbnail ${idx + 1}`}
                          >
                            <SafeImage src={img.url} alt={img.title} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Text/content pane (scrolls independently) */}
                <div className="min-h-0 overflow-y-auto p-4 md:p-6">
                  {/* Dynamic image info for images & 360 */}
                  {selectedMedia.type !== "video" && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-1">{getCurrentImageData().title}</h4>
                      <p className="text-sm text-muted-foreground">{getCurrentImageData().description}</p>
                    </div>
                  )}

                  {/* Main description */}
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">
                    {selectedMedia.description}
                  </p>

                  {/* Details */}
                  <div className="grid gap-6">
                    {selectedMedia.details.specs && selectedMedia.details.specs.length > 0 && (
                      <div>
                        <h4 className="font-semibold flex items-center mb-2">
                          <Gauge className="h-4 w-4 mr-2" />
                          Specifications
                        </h4>
                        <ul className="space-y-2">
                          {selectedMedia.details.specs.map((spec, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                              {spec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedMedia.details.benefits && selectedMedia.details.benefits.length > 0 && (
                      <div>
                        <h4 className="font-semibold flex items-center mb-2">
                          <Award className="h-4 w-4 mr-2" />
                          Key Benefits
                        </h4>
                        <ul className="space-y-2">
                          {selectedMedia.details.benefits.map((b, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedMedia.details.technology && selectedMedia.details.technology.length > 0 && (
                      <div>
                        <h4 className="font-semibold flex items-center mb-2">
                          <Cpu className="h-4 w-4 mr-2" />
                          Technology
                        </h4>
                        <ul className="space-y-2">
                          {selectedMedia.details.technology.map((t, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Why choose */}
                  <div className="space-y-3 pt-6 border-t mt-6">
                    <h4 className="text-base md:text-lg font-semibold">Why Choose This Feature?</h4>
                    {[
                      ["Enhanced Performance", "Optimized for maximum efficiency and power delivery"],
                      ["Advanced Technology", "Latest innovations for superior driving experience"],
                      ["Premium Quality", "Built with the finest materials and craftsmanship"],
                    ].map(([title, copy]) => (
                      <div className="flex items-start gap-3" key={title}>
                        <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                        <div>
                          <p className="font-medium">{title}</p>
                          <p className="text-sm text-muted-foreground">{copy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* -----------------------------
   Media Card
------------------------------ */
interface MediaCardProps {
  media: MediaItem;
  onClick: () => void;
  isMobile: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, onClick, isMobile }) => {
  const Icon = media.icon;
  const isVideo = media.type === "video";
  const is360 = media.type === "360";

  return (
    <motion.div
      whileHover={{ scale: isMobile ? 1 : 1.02, y: isMobile ? 0 : -4 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-background to-muted/20 hover:shadow-2xl transition-all duration-300">
        <div className="relative">
          {/* Preview (taller for visual punch) */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <SafeImage
              src={media.url}
              alt={media.title}
              className="transition-transform duration-500 hover:scale-105"
              fit="cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Type badge */}
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
              {media.isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs">Premium</Badge>
              )}
            </div>

            {/* Icon + title */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-full">
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>

            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <Badge variant="secondary" className="mb-2 text-xs">
                {media.category}
              </Badge>
              <h3 className="text-white font-bold text-lg md:text-xl mb-1">{media.title}</h3>
              <p className="text-white/80 text-sm line-clamp-2">{media.description}</p>
            </div>

            {/* Hover affordance (desktop only) */}
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
