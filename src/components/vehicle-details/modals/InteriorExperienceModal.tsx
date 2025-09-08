import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Car, Smartphone, Volume2, Armchair, Sun, Wind, Lightbulb, X
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

/* -------------------------------------------------------------------------- */
/* BRAND + MEDIA                                                              */
/* -------------------------------------------------------------------------- */

const BRAND_RED = "#cb0017";

// Story images (swap via props if you want)
const INTERIOR_HERO =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/c90aebf7-5fbd-4d2f-b8d0-e2d473cc8656?binary=true&mformat=true";

const IMG_A =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
const IMG_B =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type TabKey = "overview" | "story" | "images" | "videos";

interface InteriorExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  storyImages?: { src: string; alt?: string }[];  // optional override
  gallery?: { src: string; alt?: string }[];
  videoIds?: string[]; // optional YouTube IDs for the Videos tab
}

/* -------------------------------------------------------------------------- */
/* UI HELPERS                                                                 */
/* -------------------------------------------------------------------------- */

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
            className={cn(
              "flex-1 px-3 py-1.5 rounded-lg text-sm transition border",
              selected ? "bg-black text-white border-black" : "hover:bg-black/5 border-transparent"
            )}
            aria-pressed={selected}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  </div>
);

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
              ▶ Play video
            </div>
          </button>
        )}
        {play && (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={src}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* SCROLL STORY (no controls, just scroll)                                    */
/* -------------------------------------------------------------------------- */

type Vignette = {
  key: string;
  img: string;
  title: string;
  body: string;
  icon: React.ElementType;
  stats?: { label: string; value: string }[];
};

const defaultVignettes: Vignette[] = [
  {
    key: "comfort",
    img: INTERIOR_HERO,
    title: "Comfort that fits",
    body: "Supportive seats with thoughtful ergonomics keep you fresh—short hops or long hauls.",
    icon: Armchair,
    stats: [{ label: "Adjust", value: "8-way" }, { label: "Memory", value: "Driver" }],
  },
  {
    key: "lighting",
    img: IMG_A,
    title: "Ambient made simple",
    body: "Refined cabin lighting that quietly elevates every drive—day or night.",
    icon: Lightbulb,
    stats: [{ label: "LED", value: "Full cabin" }],
  },
  {
    key: "tech",
    img: IMG_B,
    title: "Seamless everyday tech",
    body: "Wireless charging, easy device integration and quick access—no learning curve.",
    icon: Smartphone,
    stats: [{ label: "Charging", value: "Wireless" }, { label: "USB", value: "Multiple" }],
  },
  {
    key: "space",
    img: INTERIOR_HERO,
    title: "Room to breathe",
    body: "Generous cabin volume with clever storage that stays out of your way.",
    icon: Car,
    stats: [{ label: "Cabin", value: "100.4 cu ft" }, { label: "Trunk", value: "15.1 cu ft" }],
  },
];

const ScrollStory: React.FC<{ vignettes?: Vignette[] }> = ({ vignettes = defaultVignettes }) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = React.useState(0);

  // Progress bar logic
  const onScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    const p = max > 0 ? el.scrollTop / max : 0;
    setProgress(Math.min(1, Math.max(0, p)));
  };

  return (
    <div className="rounded-2xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-0 overflow-hidden">
      {/* sticky progress bar */}
      <div className="relative h-1 bg-black/5">
        <div className="absolute left-0 top-0 h-1" style={{ width: `${progress * 100}%`, background: BRAND_RED }} />
      </div>

      {/* snap scroll container */}
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="max-h-[70vh] overflow-y-auto snap-y snap-mandatory scroll-smooth"
      >
        {vignettes.map((v, i) => {
          const Icon = v.icon;
          return (
            <section key={v.key} className="relative snap-start min-h-[68vh]">
              {/* background */}
              <div className="absolute inset-0">
                <img src={v.img} alt="" className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
              </div>

              {/* foreground content */}
              <div className="relative z-10 h-full w-full p-4 sm:p-6 flex items-end">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ amount: 0.4, once: true }}
                  transition={{ duration: 0.35, delay: 0.05 }}
                  className="w-full"
                >
                  <div className="max-w-[720px] rounded-2xl bg-white/90 backdrop-blur-md shadow border p-4 sm:p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="p-2 rounded-md text-white" style={{ background: BRAND_RED }}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <h4 className="text-base sm:text-lg font-semibold">{v.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{v.body}</p>

                    {!!v.stats?.length && (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {v.stats.map((s) => (
                          <div key={s.label} className="rounded-md border bg-white p-2 text-xs">
                            <div className="text-muted-foreground">{s.label}</div>
                            <div className="font-medium">{s.value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* page marker */}
                  <div className="mt-2 text-[11px] text-white/90">
                    {i + 1} / {vignettes.length}
                  </div>
                </motion.div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* MAIN MODAL                                                                 */
/* -------------------------------------------------------------------------- */

const InteriorExperienceModal: React.FC<InteriorExperienceModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  storyImages,
  gallery,
  videoIds = [],
}) => {
  const prefersReduced = useReducedMotion();
  const enter = prefersReduced ? {} : { opacity: 0, y: 16 };
  const entered = prefersReduced ? {} : { opacity: 1, y: 0 };

  // Optional override for vignettes images
  const vignettes = defaultVignettes.map((v, i) => {
    if (storyImages?.[i]) return { ...v, img: storyImages[i].src };
    return v;
  });

  const images = gallery?.length
    ? gallery
    : [
        { src: IMG_A, alt: "Interior highlight 1" },
        { src: IMG_B, alt: "Interior highlight 2" },
        { src: INTERIOR_HERO, alt: "Interior highlight 3" },
      ];

  const tabItems = (videoIds.length
    ? ([
        { key: "overview", label: "Overview" as const },
        { key: "story",    label: "Story" as const },
        { key: "images",   label: "Images" as const },
        { key: "videos",   label: "Videos" as const },
      ])
    : ([
        { key: "overview", label: "Overview" as const },
        { key: "story",    label: "Story" as const },
        { key: "images",   label: "Images" as const },
      ])) as { key: TabKey; label: string }[];

  const [tab, setTab] = React.useState<TabKey>("story");

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        {/* Compact mobile header */}
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
            Just scroll — a clean, cinematic story with zero controls or hotspots.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* HERO w/ Tabs + tiny stats */}
            <motion.div
              initial={enter}
              animate={entered}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-4 lg:p-6 border bg-white/70 backdrop-blur ring-1 ring-black/5"
            >
              <div className="flex items-center gap-3 mb-4">
                <Car className="h-7 w-7" style={{ color: BRAND_RED }} />
                <Badge variant="secondary" className="text-xs font-semibold" style={{ background: "#fff", border: "1px solid #eee" }}>
                  Premium Comfort
                </Badge>
              </div>

              <div className="grid lg:grid-cols-3 gap-4 mb-3">
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-xl lg:text-2xl font-bold">Crafted for you</h3>
                  <p className="text-sm text-muted-foreground">
                    A smooth, scroll-first story that highlights comfort, lighting, tech, and space.
                  </p>
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
                  <Tabs
                    active={tab}
                    onChange={setTab}
                    items={tabItems}
                  />
                  <div className="text-xs text-muted-foreground">Overview · Story · Images · Videos</div>
                </div>
              </div>
            </motion.div>

            {/* STORY TAB (scroll-only) */}
            {tab === "story" && (
              <ScrollStory vignettes={vignettes} />
            )}

            {/* IMAGES TAB (simple responsive grid for reliability) */}
            {tab === "images" && (
              <div className="rounded-2xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {images.map((im) => (
                    <div key={im.src} className="relative w-full overflow-hidden rounded-lg border ring-1 ring-black/5">
                      <div className="w-full" style={{ paddingTop: "60%" }}>
                        <img src={im.src} alt={im.alt || ""} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIDEOS TAB (optional) */}
            {tab === "videos" && (videoIds?.length ?? 0) > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {videoIds!.map((id) => (
                  <YoutubeInline key={id} videoId={id} title="Interior feature video" />
                ))}
              </div>
            )}

            {/* OVERVIEW TAB */}
            {tab === "overview" && (
              <div className="rounded-2xl border bg-white/70 backdrop-blur ring-1 ring-black/5 p-4">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  Feature Catalog
                  <span className="text-xs text-muted-foreground ml-2">Quick reference</span>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Smartphone, title: "Tech Integration", features: ["Wireless Charging", "Multiple USB", "12V Outlets", "Smartphone Integration"] },
                    { icon: Lightbulb, title: "Lighting", features: ["LED Cabin Lights", "Ambient Accents", "Reading Lamps", "Illuminated Entry"] },
                    { icon: Wind, title: "Air Quality", features: ["Cabin Filter", "Fresh Air Mode", "Recirculation", "Allergen Reduction"] },
                    { icon: Armchair, title: "Comfort", features: ["Heated & Ventilated", "Power Adjust", "Memory Seat", "Supportive Foam"] },
                    { icon: Volume2, title: "Audio", features: ["JBL Tuning", "Balanced Soundstage", "Low Noise Cabin"] },
                    { icon: Sun, title: "Panoramic Roof", features: ["One-touch Open/Close", "Shade", "Quiet Sealing"] },
                  ].map((group, index) => (
                    <CollapsibleContent
                      key={group.title}
                      defaultOpen={index === 0}
                      title={
                        <div className="flex items-center gap-3">
                          <group.icon className="h-5 w-5 text-black/70" />
                          <span className="font-medium">{group.title}</span>
                        </div>
                      }
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
