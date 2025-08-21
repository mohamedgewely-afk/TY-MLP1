import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VehicleModel } from "@/types/vehicle";
import { Monitor, Smartphone, Maximize2, ExternalLink, Eye, X } from "lucide-react";

interface VirtualShowroomProps {
  vehicle: VehicleModel;
}

/**
 * Improvements:
 * 1) Larger desktop area: uses responsive min-height (up to ~85vh on lg+) and wider container.
 * 2) True fullscreen: uses the Fullscreen API on a dedicated container; also renders a fixed overlay version
 *    to guarantee edge-to-edge, with exit on Esc, backdrop click, or button.
 * 3) Accessibility: labels, aria-pressed, focus-visible styles.
 */
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
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  const requestTrueFullscreen = useCallback(async () => {
    // Prefer the wrapper; if not available, fall back to body
    const el = containerRef.current ?? document.documentElement;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (el.requestFullscreen) {
        await el.requestFullscreen();
      }
    } catch (err) {
      // Silently fail; we still render CSS fullscreen overlay below
      // console.warn("Fullscreen request failed", err);
    }
  }, []);

  const handleToggleFullscreen = async () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    // Try native fullscreen when entering
    if (next) {
      await requestTrueFullscreen();
    } else if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  const handleExternalLink = () => {
    window.open(showroomUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.3),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,75,75,0.2),transparent_50%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full px-4 md:px-6">
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
            Virtual {" "}
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

              {/*
                Larger desktop area:
                - Use responsive min-heights that scale with viewport
                - Allow the iframe to stretch fully
              */}
              <div
  ref={containerRef}
  className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh] lg:aspect-[18/9]"
>
                <iframe
                  ref={iframeRef}
                  src={showroomUrl}
                  title={`${vehicle.name} Virtual Showroom`}
                  className="absolute inset-0 w-full h-full border-0 block"
                  // IMPORTANT: enable native fullscreen from inside iframe (if supported by origin)
                  allow="fullscreen; accelerometer; gyroscope; magnetometer; vr; xr-spatial-tracking"
                  allowFullScreen
                  loading="lazy"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation-by-user-activation"
                />

                {/* Loading veil (can be toggled via messaging if needed) */}
                {/* <div className="absolute inset-0 bg-muted/90 flex items-center justify-center opacity-0 data-[loading=true]:opacity-100 transition-opacity duration-300" data-loading={false}> */}
                {/*   <div className="text-center space-y-4"> */}
                {/*     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div> */}
                {/*     <p className="text-muted-foreground">Loading Virtual Showroom...</p> */}
                {/*   </div> */}
                {/* </div> */}
              </div>

              <div className="lg:hidden p-4 bg-muted/30 border-t">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4 flex-shrink-0" />
                  <span>Tap and drag to explore • Pinch to zoom • Use device rotation for 360° view</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                icon: <Eye className="h-6 w-6" />,
                title: "360° Experience",
                description: "Complete virtual tour of interior and exterior",
              },
              {
                icon: <Monitor className="h-6 w-6" />,
                title: "Real-time Configuration",
                description: "Customize colors, wheels, and accessories instantly",
              },
              {
                icon: <ExternalLink className="h-6 w-6" />,
                title: "Immersive Details",
                description: "Explore every feature with high-resolution imagery",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
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

      {/* CSS fullscreen overlay that mirrors the iframe for guaranteed edge-to-edge */}
      {isFullscreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black"
          onClick={(e) => {
            // Only close if the backdrop itself is clicked
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
    </section>
  );
};

export default VirtualShowroom;
