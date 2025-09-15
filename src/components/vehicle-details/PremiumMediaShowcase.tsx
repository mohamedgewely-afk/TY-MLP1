import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import {
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Star,
  Shield,
  Zap,
  Heart,
  Wifi,
  Award,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

/* =========================
   Types
========================= */
interface MediaItem {
  id: string;
  category: string; // Human label (e.g., "Performance")
  title: string;
  summary: string;
  kind: "image" | "video";
  thumbnail: string;
  gallery: Array<{
    url: string;
    title: string;
    description?: string;
    details?: {
      overview?: string;
      specs?: string[];
      features?: string[];
      tech?: string[];
    };
  }>;
  video?: {
    provider: "wistia" | "youtube";
    id: string;
    autoplay?: boolean;
  };
  badges?: string[];
  variant: "performance" | "safety" | "interior" | "quality" | "technology" | "handling";
}

/* =========================
   Style tokens per variant
========================= */
const VARIANT_STYLES: Record<
  MediaItem["variant"],
  { accent: string; bg: string; text: string; icon: React.ComponentType<any> }
> = {
  performance: {
    accent: "from-red-600 to-red-700",
    bg: "bg-red-50/80",
    text: "text-red-700",
    icon: Zap,
  },
  safety: {
    accent: "from-blue-600 to-blue-700",
    bg: "bg-blue-50/80",
    text: "text-blue-700",
    icon: Shield,
  },
  interior: {
    accent: "from-amber-600 to-amber-700",
    bg: "bg-amber-50/80",
    text: "text-amber-700",
    icon: Heart,
  },
  quality: {
    accent: "from-gray-600 to-gray-700",
    bg: "bg-gray-50/80",
    text: "text-gray-700",
    icon: Award,
  },
  technology: {
    accent: "from-cyan-600 to-cyan-700",
    bg: "bg-cyan-50/80",
    text: "text-cyan-700",
    icon: Wifi,
  },
  handling: {
    accent: "from-emerald-600 to-emerald-700",
    bg: "bg-emerald-50/80",
    text: "text-emerald-700",
    icon: Star,
  },
};

/* Nice labels for tabs (derived from variant) */
const VARIANT_LABELS: Record<MediaItem["variant"], string> = {
  performance: "Performance",
  safety: "Safety",
  interior: "Interior",
  quality: "Quality",
  technology: "Technology",
  handling: "Handling",
};

/* =========================
   Demo data
========================= */
const DEMO_MEDIA: MediaItem[] = [
  {
    id: "performance",
    category: "Performance",
    title: "V6 Twin-Turbo Engine",
    summary: "400+ horsepower, instant response, efficient cruising under all conditions.",
    kind: "image",
    variant: "performance",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Engine Architecture",
        description: "Advanced cooling system and optimized airflow design.",
        details: {
          overview:
            "3.5L V6 Twin-Turbo engineered for instant response and sustained performance across all driving conditions.",
          specs: ["3.5L V6 Twin-Turbo", "400+ hp", "0-60 mph in 4.2s", "Direct injection"],
          features: ["Variable Valve Timing", "Aluminum construction", "Advanced cooling"],
          tech: ["Closed-loop boost control", "Knock detection", "Thermal management"],
        },
      },
    ],
    badges: ["400+ HP", "Twin-Turbo", "Instant Response"],
  },
  {
    id: "safety",
    category: "Safety",
    title: "Toyota Safety Sense",
    summary: "Advanced driver assistance with camera and radar fusion technology.",
    kind: "video",
    variant: "safety",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    video: { provider: "wistia", id: "kvdhnonllm", autoplay: true },
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
        title: "Sensor Technology",
        description:
          "Wide field-of-view camera and radar coverage for comprehensive protection.",
        details: {
          overview:
            "Complete ADAS suite including Pre-Collision System, Lane Tracing Assist, and Adaptive Cruise Control.",
          specs: ["Pre-Collision System", "Lane Tracing Assist", "Adaptive Cruise Control", "Blind Spot Monitor"],
        },
      },
    ],
    badges: ["5-Star Safety", "TSS 2.0", "Advanced ADAS"],
  },
  {
    id: "interior",
    category: "Interior",
    title: "Premium Cabin Experience",
    summary: "Driver-focused ergonomics with premium materials and intuitive technology.",
    kind: "image",
    variant: "interior",
    thumbnail:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
    gallery: [
      {
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
        title: "Command Center",
        description:
          "Intuitive controls within natural reach, minimizing driver distraction.",
        details: {
          overview:
            "Ergonomically tuned for driver clarity, comfortable reach, and minimal eye-off-road time.",
          specs: ['12.3" Touchscreen Display', "Tri-zone Climate Control", "Premium Audio"],
          features: ["Voice Control", "Wireless Charging", "Memory Settings"],
          tech: ["Low-latency Interface", "Over-the-air Updates", "Smart Integration"],
        },
      },
    ],
    badges: ['12.3" Display', "Premium Materials", "Comfort Plus"],
  },
];

/* =========================
   Component
========================= */
interface PremiumMediaShowcaseProps {
  vehicle: VehicleModel;
}

const PremiumMediaShowcase: React.FC<PremiumMediaShowcaseProps> = ({ vehicle }) => {
  // Use variant-driven filtering to avoid case mismatches
  const allVariants = Array.from(new Set(DEMO_MEDIA.map((m) => m.variant)));
  const [activeCategory, setActiveCategory] = useState<MediaItem["variant"] | "all">("all");

  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { margin: "-20%" });

  const filteredMedia = DEMO_MEDIA.filter(
    (item) => activeCategory === "all" || item.variant === activeCategory
  );

  const openLightbox = (media: MediaItem, slideIndex = 0) => {
    setSelectedMedia(media);
    setCurrentSlide(slideIndex);
    setIsFullscreen(true);
    // prevent background scroll
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedMedia(null);
    setIsFullscreen(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) closeLightbox();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen]);

  const nextSlide = () => {
    if (!selectedMedia) return;
    setCurrentSlide((prev) =>
      prev === selectedMedia.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (!selectedMedia) return;
    setCurrentSlide((prev) =>
      prev === 0 ? selectedMedia.gallery.length - 1 : prev - 1
    );
  };

  /* Renderers */
  const renderLightboxContent = () => {
    if (!selectedMedia) return null;

    if (selectedMedia.kind === "video" && selectedMedia.video) {
      if (selectedMedia.video.provider === "youtube") {
        const autoplay = selectedMedia.video.autoplay ? 1 : 0;
        return (
          <iframe
            title={selectedMedia.title}
            className="w-full h-full rounded-lg"
            src={`https://www.youtube.com/embed/${selectedMedia.video.id}?autoplay=${autoplay}&rel=0&modestbranding=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        );
      }
      if (selectedMedia.video.provider === "wistia") {
        // Standard Wistia embed iframe
        // Note: Wistia usually prefers script embed; iframe works for a quick lightbox player.
        const autoplay = selectedMedia.video.autoplay ? 1 : 0;
        return (
          <iframe
            title={selectedMedia.title}
            className="w-full h-full rounded-lg"
            src={`https://fast.wistia.net/embed/iframe/${selectedMedia.video.id}?autoPlay=${autoplay}`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        );
      }
    }

    // Default to image slide
    const slide = selectedMedia.gallery[currentSlide];
    return (
      <img
        src={slide?.url}
        alt={slide?.title || selectedMedia.title}
        className="max-w-full max-h-full object-contain rounded-lg"
        loading="lazy"
      />
    );
  };

  return (
    <>
      <section
        ref={containerRef}
        id="media-showcase"
        className="py-16 bg-gradient-to-b from-white to-gray-50/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
              Discover Every Detail
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore the advanced engineering, safety innovations, and premium craftsmanship that
              define the {vehicle?.name ?? "vehicle"} experience.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                activeCategory === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              All Features
            </button>

            {allVariants.map((variant) => (
              <button
                key={variant}
                onClick={() => setActiveCategory(variant)}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  activeCategory === variant
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {VARIANT_LABELS[variant]}
              </button>
            ))}
          </motion.div>

          {/* Media Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredMedia.length === 0 && (
              <div className="col-span-full text-center text-gray-500 py-8">
                No items match this filter.
              </div>
            )}

            {filteredMedia.map((media, index) => {
              const style = VARIANT_STYLES[media.variant];
              const IconComponent = style.icon;

              return (
                <motion.div
                  key={media.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(media)}
                  role="button"
                  aria-label={`Open ${media.title}`}
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                    {/* Media Preview */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={media.thumbnail}
                        alt={media.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                      {/* Play Button for Videos */}
                      {media.kind === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="h-6 w-6 text-gray-900 ml-1" />
                          </div>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={`bg-gradient-to-r ${style.accent} text-white border-0`}>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {media.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                        {media.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{media.summary}</p>

                      {/* Features */}
                      {media.badges && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {media.badges.slice(0, 3).map((badge, i) => (
                            <span
                              key={i}
                              className={`text-xs px-2 py-1 rounded-full ${style.bg} ${style.text} font-medium`}
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          {media.gallery.length} image{media.gallery.length !== 1 ? "s" : ""}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                          aria-label="More info"
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isFullscreen && selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
          >
            <div className="relative w-full h-full max-w-6xl mx-auto p-4 flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center text-white mb-4">
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold truncate">{selectedMedia.title}</h3>
                  <p className="text-gray-300">{selectedMedia.summary}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeLightbox}
                  className="text-white hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              {/* Main Content */}
              <div
                className="flex-1 flex items-center justify-center relative"
                onClick={(e) => e.stopPropagation()}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={
                      selectedMedia.kind === "video"
                        ? `video-${selectedMedia.video?.id}`
                        : `img-${currentSlide}`
                    }
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="relative w-full h-full flex items-center justify-center"
                  >
                    {renderLightboxContent()}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                {selectedMedia.kind === "image" && selectedMedia.gallery.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                      aria-label="Previous"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10"
                      aria-label="Next"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>

              {/* Info Panel */}
              {selectedMedia.kind === "image" &&
                selectedMedia.gallery[currentSlide]?.details && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4 text-white">
                    <h4 className="font-bold mb-2">
                      {selectedMedia.gallery[currentSlide].title}
                    </h4>
                    <p className="text-sm text-gray-300 mb-3">
                      {selectedMedia.gallery[currentSlide].description}
                    </p>

                    {selectedMedia.gallery[currentSlide].details?.specs && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <h5 className="font-semibold mb-1">Specifications</h5>
                          <ul className="space-y-1">
                            {selectedMedia.gallery[currentSlide].details!.specs!.map(
                              (spec, i) => (
                                <li key={i} className="text-gray-300">
                                  • {spec}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                        {selectedMedia.gallery[currentSlide].details?.features && (
                          <div>
                            <h5 className="font-semibold mb-1">Features</h5>
                            <ul className="space-y-1">
                              {selectedMedia.gallery[currentSlide].details!.features!.map(
                                (feature, i) => (
                                  <li key={i} className="text-gray-300">
                                    • {feature}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                        {selectedMedia.gallery[currentSlide].details?.tech && (
                          <div>
                            <h5 className="font-semibold mb-1">Technology</h5>
                            <ul className="space-y-1">
                              {selectedMedia.gallery[currentSlide].details!.tech!.map(
                                (tech, i) => (
                                  <li key={i} className="text-gray-300">
                                    • {tech}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              {/* Slide Indicators */}
              {selectedMedia.kind === "image" && selectedMedia.gallery.length > 1 && (
                <div className="flex justify-center mt-4 space-x-2">
                  {selectedMedia.gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentSlide ? "bg-white" : "bg-white/40"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PremiumMediaShowcase;
