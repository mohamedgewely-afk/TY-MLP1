import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { Monitor, Smartphone, Maximize2, ExternalLink, Eye, X } from "lucide-react";

interface VirtualShowroomProps {
  vehicle: VehicleModel;
}

const VirtualShowroom: React.FC<VirtualShowroomProps> = ({ vehicle }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const showroomUrl =
    "https://www.virtualshowroom.toyota.ae/configurator/land-cruiser/en";

  const containerRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Handle Esc to exit fullscreen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Keep React state in sync if user exits browser fullscreen via Esc
  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const requestTrueFullscreen = useCallback(async () => {
    const el = containerRef.current ?? document.documentElement;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      }
    } catch {
      // fail silently; CSS overlay still covers us
    }
  }, []);

  const handleToggleFullscreen = async () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    if (next) {
      await requestTrueFullscreen();
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  const handleExternalLink = () => {
    window.open(showroomUrl, "_blank", "noopener,noreferrer");
  };

  // shared features data
  const features = [
    {
      key: "360",
      icon: <Eye className="h-5 w-5" />,
      title: "360° Experience",
      description: "Complete virtual tour of interior and exterior",
    },
    {
      key: "rt",
      icon: <Monitor className="h-5 w-5" />,
      title: "Real-time Config",
      description: "Customize colors, wheels, and accessories instantly",
    },
    {
      key: "hi",
      icon: <ExternalLink className="h-5 w-5" />,
      title: "Immersive Details",
      description: "Explore every feature with high-res imagery",
    },
  ];

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,75,75,0.2),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1920px] px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Eye className="h-4 w-4 mr-2" />
            Virtual Experience
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6 leading-tight">
            Virtual{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Showroom
            </span>
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience the {vehicle.name} in our immersive virtual showroom.
            Configure colors, explore features, and get a 360° view.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Card className="overflow-hidden shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 bg-muted/50 border-b">
                <div className="flex items-center space-x-4">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Interactive Configurator</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleFullscreen}
                    aria-pressed={isFullscreen}
                    aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                    className="h-8 w-8 p-0"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleExternalLink}
                    aria-label="Open in new tab"
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div
                ref={containerRef}
                className="relative w-full h-[60vh] md:aspect-[16/9] lg:aspect-[21/9]"
              >
                <iframe
                  ref={iframeRef}
                  src={showroomUrl}
                  title={`${vehicle.name} Virtual Showroom`}
                  className="absolute inset-0 w-full h-full border-0 block"
                  allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr-spatial-tracking"
                  allowFullScreen
                  loading="lazy"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
                />
              </div>

              {/* mobile-only helper tip under iframe */}
              <div className="lg:hidden p-3 bg-muted/30 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4 flex-shrink-0" />
                  <span>Tap & drag • Pinch to zoom • Rotate device for 360°</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ---- MOBILE FEATURE CHIPS (replaces stacked tiles) ---- */}
          <div className="md:hidden mt-4 -mx-4 px-4">
            <div
              className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 no-scrollbar"
              aria-label="Virtual Showroom features"
            >
              {features.map((f, i) => (
                <motion.button
                  key={f.key}
                  whileTap={{ scale: 0.98 }}
                  className="snap-start shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-xl border bg-background/80 shadow-sm"
                  aria-label={f.title}
                  title={f.description}
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
                    {f.icon}
                  </span>
                  <span className="text-sm font-medium whitespace-nowrap">{f.title}</span>
                </motion.button>
              ))}
            </div>
            {/* Optional: tiny caption row (kept single-line to avoid height bloat) */}
            <p className="mt-2 text-xs text-muted-foreground truncate">
              360° views • Real-time configuration • High-res details
            </p>
          </div>

          {/* ---- DESKTOP/TABLET GRID (unchanged) ---- */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 mt-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* CSS fullscreen overlay for guaranteed edge-to-edge */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
            onClick={(e) => {
              if (e.currentTarget === e.target) handleToggleFullscreen();
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Virtual Showroom Fullscreen"
          >
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFullscreen}
                className="text-white/90 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <X className="h-4 w-4 mr-2" /> Exit Fullscreen
              </Button>
            </div>

            <div className="w-full h-full">
              <iframe
                src={showroomUrl}
                title={`${vehicle.name} Virtual Showroom (Fullscreen)`}
                className="absolute inset-0 w-full h-full border-0 block"
                allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr-spatial-tracking"
                allowFullScreen
                loading="eager"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VirtualShowroom;
