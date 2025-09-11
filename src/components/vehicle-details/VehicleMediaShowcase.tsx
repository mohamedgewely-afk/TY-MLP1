import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSwipeable } from "@/hooks/use-swipeable";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------
   Types
------------------------------------------------------- */
type ImgDetails = { specs?: string[]; benefits?: string[]; technology?: string[] };
type ContentBlock = { id: string; title?: string; body?: string };

type GalleryImage = {
  url: string;
  title?: string;
  description?: string;
  badges?: string[];
  details?: ImgDetails;
  contentBlocks?: ContentBlock[];
};

type MediaItem = {
  id: string;
  type: "image";
  url: string;
  title: string;
  description: string;
  category: string;
  details?: ImgDetails;
  galleryImages?: GalleryImage[];
};

export interface VehicleMediaShowcaseProps {
  vehicle: VehicleModel;
  onBookTestDrive?: () => void; // optional, keeps VehicleDetails signature working
}

/* -------------------------------------------------------
   Utilities
------------------------------------------------------- */
const FALLBACK_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'>
      <defs>
        <linearGradient id='g' x1='0' x2='1'>
          <stop stop-color='#f3f4f6' offset='0'/>
          <stop stop-color='#e5e7eb' offset='1'/>
        </linearGradient>
      </defs>
      <rect width='800' height='450' fill='url(#g)'/>
      <g fill='#9ca3af'>
        <circle cx='400' cy='225' r='42'/>
        <rect x='348' y='213' width='104' height='24' rx='12' fill='#d1d5db'/>
      </g>
    </svg>`
  );

const SafeImage: React.FC<
  React.ImgHTMLAttributes<HTMLImageElement> & { fit?: "cover" | "contain" }
> = ({ src, alt, className, fit = "cover", ...rest }) => {
  const [broken, setBroken] = React.useState(false);
  const finalSrc = !broken && src ? (src as string) : FALLBACK_DATA_URI;
  return (
    <img
      src={finalSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      className={cn("w-full h-full", fit === "cover" ? "object-cover" : "object-contain bg-black", className)}
      onError={() => setBroken(true)}
      {...rest}
    />
  );
};

function useBodyScrollLock(locked: boolean) {
  React.useEffect(() => {
    if (!locked) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}

const getYouTubePoster = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const getYouTubeId = (url: string) => (url.match(/(?:v=|\.be\/)([A-Za-z0-9_-]{6,})/) || [])[1] || "";

/* -------------------------------------------------------
   Wistia Hero (autoplays muted, cleans up safely)
------------------------------------------------------- */
const WistiaHero: React.FC<{
  mediaId?: string;
  aspect?: number; // default 16/9
}> = ({ mediaId = "kvdhnonllm", aspect = 16 / 9 }) => {
  const hostRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let mounted = true;
    const addScript = (src: string, type?: string) =>
      new Promise<void>((resolve) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        if (type) s.type = type;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
      });

    (async () => {
      await addScript("https://fast.wistia.com/player.js");
      await addScript(`https://fast.wistia.com/embed/${mediaId}.js`, "module");
      if (!mounted || !hostRef.current) return;

      // Create custom element if not present
      if (!hostRef.current.querySelector("wistia-player")) {
        const el = document.createElement("wistia-player");
        el.setAttribute("media-id", mediaId);
        el.setAttribute("seo", "false");
        el.setAttribute("aspect", String(aspect));
        hostRef.current.appendChild(el);
      }

      // Autoplay muted via _wq API
      (window as any)._wq = (window as any)._wq || [];
      (window as any)._wq.push({
        id: mediaId,
        onReady: (video: any) => {
          try {
            video.mute();
            video.play();
          } catch {}
        },
      });
    })();

    return () => {
      mounted = false;
      if (hostRef.current) hostRef.current.innerHTML = "";
    };
  }, [mediaId, aspect]);

  // nice blur poster before web component is defined
  const swatch = `https://fast.wistia.com/embed/medias/${mediaId}/swatch`;
  const style =
    `wistia-player[media-id='${mediaId}']:not(:defined){` +
    `background:center/cover no-repeat url('${swatch}');` +
    `display:block;filter:blur(4px);}`;

  return (
    <div className="mb-6">
      <style>{style}</style>
      <div className="rounded-xl overflow-hidden shadow-lg bg-black">
        <div ref={hostRef} className="aspect-video" />
      </div>
    </div>
  );
};

/* -------------------------------------------------------
   Component
------------------------------------------------------- */
const VehicleMediaShowcase: React.FC<VehicleMediaShowcaseProps> = ({ vehicle, onBookTestDrive }) => {
  const isMobile = useIsMobile();

  // Six tiles — all image type; the video is handled by WistiaHero above
  const items: MediaItem[] = React.useMemo(
    () => [
      {
        id: "performance",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/a2c5b39d-f2db-4f00-968c-e78f73a73652/renditions/4a3588b7-55f0-48f5-98dc-a219f5bfbaad?binary=true&mformat=true",
        title: "V6 Twin-Turbo",
        description: "400+ hp, broad torque band, efficient cruising.",
        category: "Performance",
        details: {
          specs: ["3.5L V6 TT", "0–60 in 4.2s", "EPA 28 mpg"],
          benefits: ["Instant response", "High efficiency"],
          technology: ["Direct injection", "VVT", "Closed-loop boost"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true",
            title: "Cooling Strategy",
            description: "Dual-path cooling keeps temps stable.",
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/0518d633-0b79-4964-97b1-daff0c8d5bf3/renditions/75f7f2ee-7e9b-4277-82ad-ca0126042c8c?binary=true&mformat=true",
            title: "Turbo Detail",
            description: "Low-inertia turbines widen usable torque.",
          },
        ],
      },
      {
        id: "interior",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/cce498b4-5dab-4a8c-9684-ca2a175103b7/renditions/8b82d3c6-0df7-4252-b3cc-7977595ace57?binary=true&mformat=true",
        title: "Driver-Focused Cabin",
        description: "Premium materials, intuitive controls, low distraction.",
        category: "Interior",
        details: {
          specs: ['12.3" display', "Tri-zone climate"],
          benefits: ["Comfort", "Clarity"],
          technology: ["Voice control", "Wireless charging"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/561ac4b4-3604-4e66-ae72-83e2969d7d65/items/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
            title: "Center Console",
            description: "Clear haptics with storage within reach.",
          },
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
            title: "Seating",
            description: "Supportive geometry; ventilation; memory.",
          },
        ],
      },
      {
        id: "quality",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/fbb87eaa-f92c-4a11-9f7d-1a20a5ad2370/items/3a72bd7f-01f6-4398-b012-29b612f5e55c/renditions/1fdf0841-ad9a-4192-880b-7a4f16bbd32a?binary=true&mformat=true",
        title: "Build Quality",
        description: "High-strength materials and precise assembly.",
        category: "Quality",
        details: {
          specs: ["HS steel", "Multi-stage paint", "Laser gap checks"],
          benefits: ["Durability", "Refinement"],
          technology: ["Robotic assembly", "QA audits"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/15e8a778-27d5-4f87-af8c-08ae7b310941/items/a911702a-c978-4d26-9fe1-a6880684f9a0/renditions/b917d329-34db-42eb-87e5-c9a9c22fe929?binary=true&mformat=true",
            title: "Materials",
            description: "Premium substrates and coatings.",
          },
        ],
      },
      {
        id: "handling",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/7fecacb6-d705-4b29-b16c-cbd108171b42/renditions/da9d8da8-34ae-4c1c-9660-76e39b4a7abe?binary=true&mformat=true",
        title: "Chassis Dynamics",
        description: "Adaptive damping and precise control.",
        category: "Performance",
        details: {
          specs: ["Adaptive suspension", "AWD", "Stability control"],
          benefits: ["Grip", "Composure"],
          technology: ["Torque vectoring", "Drive modes"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
            title: "Suspension",
            description: "Millisecond-level response for composure.",
          },
        ],
      },
      {
        id: "connected",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
        title: "Connected Services",
        description: "CarPlay/Android Auto, OTA updates.",
        category: "Technology",
        details: {
          specs: ["CarPlay", "Android Auto", "OTA"],
          benefits: ["Convenience", "Always up-to-date"],
          technology: ["Cloud services", "App connectivity"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/84fd5061-3729-44b7-998c-ef02847d7bed/renditions/806b28e7-dffa-47c1-812b-2e7595defb58?binary=true&mformat=true",
            title: "Infotainment",
            description: "Advanced HMI with voice fallback.",
          },
        ],
      },
      {
        id: "design",
        type: "image",
        url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
        title: "Exterior Design",
        description: "Confident stance with functional aero.",
        category: "Design",
        details: {
          specs: ["Aero wheel design", "LED lighting"],
          benefits: ["Efficiency", "Presence"],
          technology: ["Wind-tunnel tuned", "Cooling ducts"],
        },
        galleryImages: [
          {
            url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/4b38997a-dd4e-426b-8356-41af4f249811/items/dd2df84f-19cc-4f85-93bb-b30ad7563f38/renditions/611ebf32-7ddd-4782-98d0-a208784e624d?binary=true&mformat=true",
            title: "Wheel Design",
            description: "Brake cooling & aero efficiency.",
          },
        ],
      },
    ],
    []
  );

  const [open, setOpen] = React.useState<MediaItem | null>(null);
  const [idx, setIdx] = React.useState(0);
  const gallery = open?.galleryImages && open.galleryImages.length > 0 ? open.galleryImages : open ? [{ url: open.url, title: open.title, description: open.description }, { url: open.url, title: open.title, description: open.description }] : [];
  const isOpen = !!open;

  const swipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => setIdx((p) => (gallery.length ? (p + 1) % gallery.length : p)),
    onSwipeRight: () => setIdx((p) => (gallery.length ? (p - 1 + gallery.length) % gallery.length : p)),
    threshold: 28,
  });

  useBodyScrollLock(isOpen);

  const onShare = React.useCallback(async () => {
    if (!open) return;
    const url = new URL(window.location.href);
    url.searchParams.set("media", open.id);
    url.searchParams.set("img", String(idx));
    try {
      await navigator.clipboard.writeText(url.toString());
    } catch {}
  }, [open, idx]);

  // keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setIdx((p) => (p + 1) % gallery.length);
      if (e.key === "ArrowLeft") setIdx((p) => (p - 1 + gallery.length) % gallery.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, gallery.length]);

  return (
    <div className="px-4 md:px-8">
      {/* Wistia hero video */}
      <WistiaHero mediaId="kvdhnonllm" />

      {/* Six tiles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((m) => (
          <Card
            key={m.id}
            className="overflow-hidden border bg-card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => {
              setOpen(m);
              setIdx(0);
            }}
          >
            <div className="relative h-56 md:h-64">
              <SafeImage src={m.url} alt={m.title} />
              <div className="absolute top-2 left-2">
                <Badge variant="outline">{m.category}</Badge>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{m.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{m.description}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70"
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ y: isMobile ? 36 : 0, scale: isMobile ? 1 : 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: isMobile ? 36 : 0, scale: isMobile ? 1 : 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "bg-background shadow-2xl overflow-hidden",
                isMobile ? "fixed inset-x-0 bottom-0 h-[90svh] rounded-t-2xl" : "fixed inset-6 rounded-2xl"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-3 md:p-4 border-b bg-background/95">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{idx + 1} / {gallery.length}</span>
                  <h3 className="text-lg md:text-xl font-semibold truncate">{open?.title}</h3>
                  <Badge variant="outline" className="hidden md:inline-flex">{open?.category}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {onBookTestDrive && (
                    <Button size="sm" className="bg-[--brand-red,#EB0A1E] hover:opacity-90" onClick={onBookTestDrive}>
                      Book Test Drive
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={onShare} aria-label="Copy deep link">
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(null)} aria-label="Close">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="grid md:grid-cols-2 h-[calc(100%-56px)] md:h-[calc(100%-64px)]">
                {/* Media */}
                <div ref={swipeRef} className="relative bg-black">
                  <div className="absolute inset-0 grid">
                    <div className="place-self-center w-full md:max-h-[70vh] aspect-video">
                      <SafeImage src={gallery[idx]?.url} alt={gallery[idx]?.title || open?.title} fit="cover" />
                    </div>
                  </div>

                  {gallery.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 hover:bg-white"
                        onClick={() => setIdx((p) => (p - 1 + gallery.length) % gallery.length)}
                        aria-label="Previous"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 hover:bg-white"
                        onClick={() => setIdx((p) => (p + 1) % gallery.length)}
                        aria-label="Next"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>

                      {/* dots */}
                      <div className="absolute bottom-3 w-full flex items-center justify-center gap-2">
                        {gallery.map((_, i) => (
                          <button key={i} onClick={() => setIdx(i)} aria-label={`Go to ${i + 1}`}>
                            <span
                              className={cn(
                                "inline-block h-2 w-2 rounded-full",
                                i === idx ? "bg-primary" : "bg-white/50"
                              )}
                            />
                          </button>
                        ))}
                      </div>

                      {/* thumbs (desktop) */}
                      <div className="hidden md:flex absolute top-3 right-3 flex-col gap-2">
                        {gallery.map((g, i) => (
                          <button
                            key={i}
                            onClick={() => setIdx(i)}
                            className={cn(
                              "h-16 w-24 overflow-hidden rounded-md border-2",
                              i === idx ? "border-primary" : "border-white/60 hover:border-white"
                            )}
                            aria-label={`Thumb ${i + 1}`}
                          >
                            <SafeImage src={g.url} alt={g.title} />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Content rail */}
                <div className="min-h-0 overflow-y-auto p-4 md:p-6 bg-background">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {(gallery[idx]?.badges ?? []).map((b) => (
                      <Badge key={b} variant="secondary" className="text-xs">{b}</Badge>
                    ))}
                  </div>

                  <h4 className="font-semibold text-xl mb-2">{gallery[idx]?.title || open?.title}</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {gallery[idx]?.description || open?.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <p className="font-semibold mb-2">Overview</p>
                      <p className="text-sm text-muted-foreground">
                        {gallery[idx]?.description || open?.description}
                      </p>
                    </Card>

                    <Card className="p-4">
                      <p className="font-semibold mb-2">Specifications</p>
                      <ul className="space-y-2">
                        {(gallery[idx]?.details?.specs ?? open?.details?.specs ?? []).map((s, i) => (
                          <li key={i} className="text-sm flex items-center">
                            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-red-500" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card className="p-4">
                      <p className="font-semibold mb-2">Benefits</p>
                      <ul className="space-y-2">
                        {(gallery[idx]?.details?.benefits ?? open?.details?.benefits ?? []).map((b, i) => (
                          <li key={i} className="text-sm flex items-center">
                            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <div className="md:col-span-2">
                      <Card className="p-4">
                        <p className="font-semibold mb-2">Technology</p>
                        <ul className="space-y-2">
                          {(gallery[idx]?.details?.technology ?? open?.details?.technology ?? []).map((t, i) => (
                            <li key={i} className="text-sm flex items-center">
                              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </Card>
                    </div>
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

export default VehicleMediaShowcase;
