import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Car, Thermometer, Volume2, Smartphone, Armchair, Sun, Wind, Coffee,
  X, Info, Play, Lightbulb
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
/*                                   THEME                                    */
/* -------------------------------------------------------------------------- */

const BRAND_RED = "#cb0017";

/* Optional images: replace or pass via props if you have better interior shots */
const IMG_A =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true";
const IMG_B =
  "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true";

/* -------------------------------------------------------------------------- */
/*                                    TYPES                                   */
/* -------------------------------------------------------------------------- */

interface InteriorExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  /** Optional YouTube IDs for Videos tab (hides tab when empty) */
  videoIds?: string[];
  /** Optional override of gallery images */
  images?: { src: string; alt?: string }[];
}

/* -------------------------------------------------------------------------- */
/*                                    TABS                                    */
/* -------------------------------------------------------------------------- */

type TabKey = "overview" | "images" | "videos";

/* Simple tabs */
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

/* -------------------------------------------------------------------------- */
/*                                 GALLERY                                    */
/* -------------------------------------------------------------------------- */

const ImageGallery: React.FC<{
  images: { src: string; alt?: string }[];
  caption?: string;
}> = ({ images, caption }) => {
  const [idx, setIdx] = React.useState(0);
  const prefersReduced = useReducedMotion();
  const canPrev = idx > 0;
  const canNext = idx < images.length - 1;

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" && canNext) setIdx((i) => i + 1);
    if (e.key === "ArrowLeft" && canPrev) setIdx((i) => i - 1);
  };

  return (
    <div
      className="rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5 overflow-hidden"
      tabIndex={0}
      onKeyDown={onKey}
      aria-label="Image gallery. Use arrow keys to navigate."
    >
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={images[idx].src}
            src={images[idx].src}
            alt={images[idx].alt || ""}
            className="absolute inset-0 h-full w-full object-cover"
            initial={prefersReduced ? {} : { opacity: 0, scale: 0.98 }}
            animate={prefersReduced ? {} : { opacity: 1, scale: 1 }}
            exit={prefersReduced ? {} : { opacity: 0 }}
            transition={{ duration: 0.25 }}
            loading="lazy"
          />
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
        <button
          aria-label="Previous image"
          disabled={!canPrev}
          onClick={() => canPrev && setIdx((i) => i - 1)}
          className={cn(
            "h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border",
            !canPrev && "opacity-40 pointer-events-none"
          )}
        >
          ‹
        </button>
        <button
          aria-label="Next image"
          disabled={!canNext}
          onClick={() => canNext && setIdx((i) => i + 1)}
          className={cn(
            "h-9 w-9 rounded-full grid place-items-center bg-white/90 backdrop-blur shadow border",
            !canNext && "opacity-40 pointer-events-none"
          )}
        >
          ›
        </button>
      </div>

      {/* Caption + dots */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="text-xs text-white">
          <span className="inline-block rounded-md bg-black/50 px-2 py-1 backdrop-blur-sm">
            {caption || "Swipe to explore the cabin"}
          </span>
        </div>
        <div className="flex gap-1">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={cn("h-2 w-2 rounded-full", i === idx ? "bg-white" : "bg-white/50")}
            />
          ))}
        </div>
      </div>

      {/* Thumbs */}
      <div className="flex gap-2 p-2 border-t bg-white/80">
        {images.map((im, i) => (
          <button
            key={im.src}
            onClick={() => setIdx(i)}
            className={cn(
              "relative h-14 w-20 rounded-md overflow-hidden ring-1 ring-black/5",
              i === idx && "outline outline-2"
            )}
            style={i === idx ? { outlineColor: BRAND_RED } : {}}
            aria-label={`Go to image ${i + 1}`}
          >
            <img src={im.src} alt="" className="h-full w-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              YOUTUBE (PRIVACY)                              */
/* -------------------------------------------------------------------------- */

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
              <Play className="h-4 w-4" />
              Play video
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
/*                        INTERACTIVE CABIN CONTROLS FIGURE                    */
/*     Clean SVG strip (no background), live-updates from mock controls       */
/* -------------------------------------------------------------------------- */

const CabinControls: React.FC = () => {
  const [temp, setTemp] = React.useState(22); // °C
  const [seatHeat, setSeatHeat] = React.useState<0 | 1 | 2>(1);
  const [seatVent, setSeatVent] = React.useState<0 | 1 | 2>(0);
  const [ambient, setAmbient] = React.useState<string>(BRAND_RED);
  const [volume, setVolume] = React.useState(30);

  const seatColor = (lvl: number) => (lvl === 0 ? "rgba(0,0,0,.08)" : lvl === 1 ? "rgba(0,0,0,.18)" : "rgba(0,0,0,.28)");

  return (
    <div className="rounded-xl border bg-white/70 backdrop-blur p-3 lg:p-4 ring-1 ring-black/5">
      {/* Hint bar */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
        <Info className="h-4 w-4" />
        <span>Adjust the controls to preview the in-cabin experience.</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Controls */}
        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Thermometer className="h-4 w-4" />
              Temperature: <span className="ml-auto font-semibold">{temp}°C</span>
            </div>
            <input
              type="range"
              min={16}
              max={28}
              value={temp}
              onChange={(e) => setTemp(parseInt(e.target.value))}
              className="w-full"
              aria-label="Cabin temperature"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-sm font-medium mb-1">Seat Heat</div>
              <div className="flex gap-1">
                {[0, 1, 2].map((lvl) => (
                  <button
                    key={`heat-${lvl}`}
                    onClick={() => setSeatHeat(lvl as 0 | 1 | 2)}
                    className={cn(
                      "px-2 py-1 rounded border text-xs",
                      seatHeat === lvl ? "bg-black text-white border-black" : "hover:bg-black/5"
                    )}
                    aria-pressed={seatHeat === lvl}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Seat Ventilation</div>
              <div className="flex gap-1">
                {[0, 1, 2].map((lvl) => (
                  <button
                    key={`vent-${lvl}`}
                    onClick={() => setSeatVent(lvl as 0 | 1 | 2)}
                    className={cn(
                      "px-2 py-1 rounded border text-xs",
                      seatVent === lvl ? "bg-black text-white border-black" : "hover:bg-black/5"
                    )}
                    aria-pressed={seatVent === lvl}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-1 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Ambient Light
            </div>
            <div className="flex gap-2">
              {[BRAND_RED, "#4F46E5", "#059669", "#0EA5E9", "#F59E0B"].map((c) => (
                <button
                  key={c}
                  onClick={() => setAmbient(c)}
                  className={cn("h-6 w-6 rounded-full border", ambient === c && "ring-2")}
                  style={{ background: c, ringColor: c }}
                  aria-label={`Set ambient color ${c}`}
                  aria-pressed={ambient === c}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Volume2 className="h-4 w-4" />
              Volume: <span className="ml-auto font-semibold">{volume}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(parseInt(e.target.value))}
              className="w-full"
              aria-label="Audio volume"
            />
          </div>
        </div>

        {/* Figure (clean, no background) */}
        <div className="lg:col-span-2">
          <div className="relative w-full" style={{ paddingTop: "40%" }}>
            <svg viewBox="0 0 720 288" className="absolute inset-0 w-full h-full">
              {/* Cabin base */}
              <rect x="40" y="60" width="640" height="168" rx="18" fill="rgba(0,0,0,.04)" stroke="rgba(0,0,0,.12)" />

              {/* Seats */}
              <rect x="110" y="90" width="90" height="100" rx="12" fill={seatColor(seatHeat)} />
              <rect x="520" y="90" width="90" height="100" rx="12" fill={seatColor(seatHeat)} />

              {/* Vent overlay (blue haze when venting) */}
              {seatVent > 0 && (
                <>
                  <circle cx="155" cy="140" r={seatVent === 1 ? 18 : 26} fill="rgba(14,165,233,.15)" />
                  <circle cx="565" cy="140" r={seatVent === 1 ? 18 : 26} fill="rgba(14,165,233,.15)" />
                </>
              )}

              {/* Climate plume (stronger at higher temp deviation from 22C) */}
              {temp !== 22 && (
                <path
                  d={`M360,100 C380,80 420,80 440,100 S480,140 500,120`}
                  stroke={temp > 22 ? BRAND_RED : "#0EA5E9"}
                  strokeWidth="6"
                  fill="none"
                  opacity="0.22"
                />
              )}

              {/* Ambient light strip */}
              <rect x="40" y="220" width="640" height="6" rx="3" fill={ambient} opacity="0.9" />
              <rect x="40" y="222" width="640" height="2" fill="#000" opacity="0.08" />

              {/* Simple head unit */}
              <rect x="340" y="120" width="60" height="40" rx="6" fill="white" stroke="rgba(0,0,0,.15)" />
              <rect x="345" y="125" width="50" height="12" rx="3" fill="rgba(0,0,0,.08)" />
              {/* Volume indicator */}
              <rect x="345" y="143" width={Math.max(10, (volume / 100) * 50)} height="6" rx="3" fill="black" opacity="0.65" />
            </svg>
          </div>

          {/* Guidance */}
          <div className="mt-2 text-xs text-muted-foreground flex items-center gap-2">
            <Info className="h-3.5 w-3.5" />
            Adjust temperature, seat comfort, ambient lighting, and volume to preview changes.
          </div>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              MAIN MODAL COMPONENT                           */
/* -------------------------------------------------------------------------- */

const InteriorExperienceModal: React.FC<InteriorExperienceModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  videoIds = [],
  images,
}) => {
  const prefersReduced = useReducedMotion();
  const enter = prefersReduced ? {} : { opacity: 0, y: 16 };
  const entered = prefersReduced ? {} : { opacity: 1, y: 0 };

  const gallery = images?.length ? images : [{ src: IMG_A, alt: "Interior highlight 1" }, { src: IMG_B, alt: "Interior highlight 2" }];

  const comfortFeatures = [
    {
      icon: Armchair,
      name: "Premium Seating",
      description: "Ergonomic seats with memory & ventilation.",
      details:
        "8-way power driver seat with lumbar, heated & ventilated fronts, and soft-touch materials tuned for long-haul comfort.",
      specs: ["8-way Power", "Lumbar Support", "Heated & Ventilated", "2-Position Memory"],
    },
    {
      icon: Thermometer,
      name: "Dual-Zone Climate",
      description: "Independent temps for driver & passenger.",
      details:
        "Auto climate with cabin air sensor and high-grade filtration. Maintain comfort without constant adjustments.",
      specs: ["Auto Climate", "Air Quality Sensor", "High-Grade Filter", "Individual Controls"],
    },
    {
      icon: Volume2,
      name: "JBL Premium Audio",
      description: "Rich, balanced sound with clarity tech.",
      details:
        "9-speaker JBL system with processing to restore detail to compressed sources for a clean, dynamic stage.",
      specs: ["9 Speakers", "Clari-Fi", "Balanced Tuning", "Low-Noise Cabin"],
    },
    {
      icon: Sun,
      name: "Panoramic Roof",
      description: "Light, air, and one-touch simplicity.",
      details:
        "Wide glass area with power tilt/slide and a smooth sunshade glide for tailored light and airflow.",
      specs: ["One-Touch", "Tilt Feature", "Sliding Sunshade", "Wind Deflector"],
    },
  ];

  const convenienceFeatures = [
    { icon: Smartphone, title: "Tech Integration", features: ["Wireless Charging", "Multi USB", "12V Outlets", "Smartphone Integration"] },
    { icon: Coffee, title: "Smart Storage", features: ["Adjustable Cupholders", "Deep Console Bin", "Door Pockets", "Seatback Pockets"] },
    { icon: Wind, title: "Air Quality", features: ["Cabin Filter", "Fresh Air Mode", "Recirculation", "Allergen Reduction"] },
    { icon: Car, title: "Interior Lighting", features: ["LED Cabin Lights", "Ambient Accents", "Reading Lamps", "Illuminated Entry"] },
  ];

  const materials = [
    { name: "SofTex® Seating", description: "Soft, durable, easy-care surfaces.", benefits: ["Weather-resistant", "Easy to clean", "Soft touch", "Eco-minded"] },
    { name: "Piano Black Trim", description: "Gloss accents for a refined look.", benefits: ["Premium finish", "Scratch-resistant", "Low-maintenance", "Modern sheen"] },
    { name: "Metallic Accents", description: "Brushed details with a quality feel.", benefits: ["Modern design", "Solid tactility", "Corrosion-resistant", "Premium touchpoints"] },
  ];

  const tabItems = (videoIds.length
    ? [
        { key: "overview", label: "Overview" },
        { key: "images", label: "Images" },
        { key: "videos", label: "Videos" },
      ]
    : [
        { key: "overview", label: "Overview" },
        { key: "images", label: "Images" },
      ]) as { key: TabKey; label: string }[];

  const [tab, setTab] = React.useState<TabKey>("overview");

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
            Comfort, technology, and craftsmanship — preview the cabin your way.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Hero: Tabs + Interactive Figure */}
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

              <div className="grid lg:grid-cols-3 gap-4">
                {/* Left: compact value chips */}
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-xl lg:text-2xl font-bold">Crafted for you</h3>
                  <p className="text-sm text-muted-foreground">
                    Seats that remember you, air that feels just right, sound that fills the space—set it once and relax.
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

                {/* Right: tabs + figure/gallery */}
                <div className="lg:col-span-2 space-y-3">
                  <Tabs active={tab} onChange={setTab} items={tabItems} />

                  <AnimatePresence mode="wait">
                    {tab === "overview" && (
                      <motion.div key="overview" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <CabinControls />
                      </motion.div>
                    )}

                    {tab === "images" && (
                      <motion.div key="images" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <ImageGallery images={gallery} caption="Swipe or tap thumbnails to explore the cabin" />
                      </motion.div>
                    )}

                    {tab === "videos" && (videoIds?.length ?? 0) > 0 && (
                      <motion.div key="videos" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {videoIds!.map((id) => (
                            <YoutubeInline key={id} videoId={id} title="Interior feature video" />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Comfort & Tech */}
            <div>
              <h3 className="text-xl font-bold mb-3">Comfort & Technology Features</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ...comfortFeatures.slice(0, 2),
                  ...comfortFeatures.slice(2, 4),
                ].map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={enter}
                    animate={entered}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md text-white" style={{ background: BRAND_RED }}>
                        <feature.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold leading-tight">{feature.name}</h4>
                          <Badge className="h-5 px-2 text-[10px]" variant="secondary">Cabin Highlight</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{feature.description}</p>

                        {/* chips */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {feature.specs.map((s) => (
                            <span key={s} className="px-2 py-0.5 text-[11px] rounded-full bg-white border">{s}</span>
                          ))}
                        </div>

                        {/* disclosure */}
                        <CollapsibleContent title="Feature details" className="border-0 mt-2">
                          <p className="text-sm text-muted-foreground">{feature.details}</p>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Convenience & Storage */}
            <div>
              <h3 className="text-xl font-bold mb-3">Convenience & Storage</h3>
              <div className="space-y-3">
                {convenienceFeatures.map((system, index) => (
                  <CollapsibleContent
                    key={system.title}
                    title={
                      <div className="flex items-center gap-3">
                        <system.icon className="h-5 w-5 text-black/70" />
                        <span className="font-medium">{system.title}</span>
                      </div>
                    }
                    defaultOpen={index === 0}
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {system.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ background: BRAND_RED }} />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                ))}
              </div>
            </div>

            {/* Materials */}
            <div>
              <h3 className="text-xl font-bold mb-3">Premium Materials & Finishes</h3>
              <div className="space-y-3">
                {materials.map((m, index) => (
                  <motion.div
                    key={m.name}
                    initial={enter}
                    animate={entered}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl border bg-white/70 backdrop-blur ring-1 ring-black/5"
                  >
                    <h4 className="font-semibold mb-1">{m.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{m.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {m.benefits.map((b) => (
                        <Badge key={b} variant="secondary" className="text-xs bg-white border">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dimensions */}
            <motion.div initial={enter} animate={entered} className="rounded-2xl p-5 border bg-white/70 backdrop-blur ring-1 ring-black/5">
              <h3 className="text-xl font-bold mb-3">Interior Dimensions</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: BRAND_RED }}>100.4</div>
                  <div className="text-sm text-muted-foreground">Passenger Volume (cu ft)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: BRAND_RED }}>15.1</div>
                  <div className="text-sm text-muted-foreground">Trunk Space (cu ft)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: BRAND_RED }}>57.1</div>
                  <div className="text-sm text-muted-foreground">Shoulder Room Front (in)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: BRAND_RED }}>38.9</div>
                  <div className="text-sm text-muted-foreground">Headroom Front (in)</div>
                </div>
              </div>
            </motion.div>
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
