import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { MotionConfig, motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VehicleModel } from "@/types/vehicle";
import { Users, Coffee, Heart, Star, Mountain, Waves, ChevronRight, Sparkles, PartyPopper } from "lucide-react";
import { useSwipeable } from "@/hooks/use-swipeable";
import { useDeviceInfo } from "@/hooks/use-device-info";

/**
 * Extraordinary Lifestyle Gallery
 * - Cinematic reveal, parallax/3D hover, animated aurora background
 * - Pill tabs with progress + deep-linking (?scenario=)
 * - Swipe interactions (mobile) with dismissable hint
 * - Image skeleton + smooth fade-in
 * - Gamified "Journey Tracker" with confetti when all scenarios viewed
 * - Accessible tabs + reduced motion support
 * - Sticky adaptive CTA
 */

// ----------------------------- Types -----------------------------
export type LifestyleScenario = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  image: string;
  gradient: string; // e.g. "from-emerald-500 via-green-500 to-teal-500"
  accentColor: string; // e.g. "bg-emerald-500"
};

interface ExtraordinaryLifestyleGalleryProps {
  vehicle: VehicleModel;
  scenarios?: LifestyleScenario[]; // optional override
  defaultIndex?: number;
  onScenarioChange?: (scenario: LifestyleScenario, index: number) => void;
  className?: string;
}

// --------------------- Default Scenarios (existing images) ---------------------
const DEFAULT_SCENARIOS: LifestyleScenario[] = [
  {
    id: "family-adventure",
    title: "Family Adventures",
    shortTitle: "Family",
    description: "Create lasting memories with spacious comfort and advanced safety",
    icon: <Users className="h-4 w-4" aria-hidden="true" />,
    features: ["7-seater capacity", "Safety Sense 3.0", "Panoramic sunroof"],
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
    gradient: "from-emerald-500 via-green-500 to-teal-500",
    accentColor: "bg-emerald-500",
  },
  {
    id: "urban-professional",
    title: "Urban Professional",
    shortTitle: "Pro",
    description: "Navigate city life with hybrid efficiency and connected technology",
    icon: <Coffee className="h-4 w-4" aria-hidden="true" />,
    features: ["Hybrid efficiency", "Wireless connectivity", "Premium interior"],
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    gradient: "from-blue-500 via-indigo-500 to-purple-500",
    accentColor: "bg-blue-500",
  },
  {
    id: "coastal-escape",
    title: "Coastal Escapes",
    shortTitle: "Coastal",
    description: "Drive to stunning coastlines with confidence and style",
    icon: <Waves className="h-4 w-4" aria-hidden="true" />,
    features: ["All-weather capability", "Premium sound", "Comfortable seating"],
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    gradient: "from-cyan-500 via-blue-400 to-teal-500",
    accentColor: "bg-cyan-500",
  },
  {
    id: "desert-exploration",
    title: "Desert Exploration",
    shortTitle: "Desert",
    description: "Discover UAE's landscapes with rugged capability",
    icon: <Mountain className="h-4 w-4" aria-hidden="true" />,
    features: ["AWD capability", "Ground clearance", "Durable build"],
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    gradient: "from-orange-500 via-red-500 to-pink-500",
    accentColor: "bg-orange-500",
  },
];

// ----------------------------- Confetti -----------------------------
function ConfettiBurst({ show, accent }: { show: boolean; accent: string }) {
  if (!show) return null;
  const particles = new Array(24).fill(0).map((_, i) => i);
  const accentText = accent.replace("bg-", "text-");
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence>
        {particles.map((i) => {
          const x = Math.random() * 100 - 50;
          const y = Math.random() * 60 + 20;
          const r = Math.random() * 360;
          const d = 0.8 + Math.random() * 0.8;
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 0, x: 0, rotate: 0 }}
              animate={{ opacity: 1, y: -y, x, rotate: r }}
              exit={{ opacity: 0 }}
              transition={{ duration: d, ease: "easeOut" }}
              className={`absolute left-1/2 top-1/2 -ml-1 -mt-1 ${accentText}`}
            >
              <PartyPopper className="h-4 w-4" />
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ----------------------------- Component -----------------------------
export default function ExtraordinaryLifestyleGallery({
  vehicle,
  scenarios = DEFAULT_SCENARIOS,
  defaultIndex = 0,
  onScenarioChange,
  className,
}: ExtraordinaryLifestyleGalleryProps) {
  const [selected, setSelected] = useState(Math.min(Math.max(defaultIndex, 0), scenarios.length - 1));
  const [imgReady, setImgReady] = useState(false);
  const [swiped, setSwiped] = useState(false);
  const [visited, setVisited] = useState<Set<string>>(new Set([scenarios[selected]?.id]));
  const [celebrate, setCelebrate] = useState(false);

  const { isMobile } = useDeviceInfo();
  const prefersReducedMotion = useReducedMotion();
  const auroraRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const panelId = useId();
  const tablistId = useId();

  const current = scenarios[selected];

  const modelToken = useMemo(() => {
    const safe = vehicle?.name || "Your Vehicle";
    const parts = safe.trim().split(/\s+/);
    return parts[parts.length - 1] || safe;
  }, [vehicle?.name]);

  // Deep-linking: read ?scenario= on mount
  useEffect(() => {
    const id = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("scenario") : null;
    if (!id) return;
    const idx = scenarios.findIndex((s) => s.id === id);
    if (idx >= 0) {
      setSelected(idx);
      setVisited(new Set([scenarios[idx].id]));
    }
  }, []);

  // Push state on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("scenario", current.id);
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [current.id]);

  // Track visited + celebrate when all seen
  useEffect(() => {
    const next = new Set(visited);
    next.add(current.id);
    setVisited(next);
    if (next.size === scenarios.length && !celebrate) {
      setCelebrate(true);
      const t = setTimeout(() => setCelebrate(false), 1500);
      return () => clearTimeout(t);
    }
  }, [current.id]);

  // Swipe (mobile)
  const goTo = useCallback(
    (index: number) => {
      const clamped = (index + scenarios.length) % scenarios.length;
      setImgReady(false);
      setSelected(clamped);
      onScenarioChange?.(scenarios[clamped], clamped);
      try {
        window.dispatchEvent(
          new CustomEvent("ux:scenario_view", { detail: { id: scenarios[clamped].id, name: scenarios[clamped].title } })
        );
      } catch {}
    },
    [onScenarioChange, scenarios]
  );

  const goNext = useCallback(() => goTo(selected + 1), [goTo, selected]);
  const goPrev = useCallback(() => goTo(selected - 1), [goTo, selected]);

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: () => {
      setSwiped(true);
      goNext();
    },
    onSwipeRight: () => {
      setSwiped(true);
      goPrev();
    },
    threshold: 30,
    preventDefaultTouchmoveEvent: false,
  });

  // Auto-scroll mobile tabs
  useEffect(() => {
    if (scrollRef.current && isMobile) {
      const el = scrollRef.current;
      const tabWidth = el.scrollWidth / scenarios.length;
      const scrollPosition = selected * tabWidth - el.clientWidth / 2 + tabWidth / 2;
      el.scrollTo({ left: Math.max(0, scrollPosition), behavior: "smooth" });
    }
  }, [selected, isMobile, scenarios.length]);

  // Keyboard nav for tabs
  const onKeyDownTabs = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const key = e.key;
      if (key === "ArrowRight") {
        e.preventDefault();
        const next = (selected + 1) % scenarios.length;
        tabRefs.current[next]?.focus();
        goTo(next);
      } else if (key === "ArrowLeft") {
        e.preventDefault();
        const prev = (selected - 1 + scenarios.length) % scenarios.length;
        tabRefs.current[prev]?.focus();
        goTo(prev);
      } else if (key === "Home") {
        e.preventDefault();
        tabRefs.current[0]?.focus();
        goTo(0);
      } else if (key === "End") {
        e.preventDefault();
        tabRefs.current[scenarios.length - 1]?.focus();
        goTo(scenarios.length - 1);
      }
    },
    [goTo, scenarios.length, selected]
  );

  // 3D hover / parallax (desktop)
  const onMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    t.style.setProperty("--rx", String(py * -6));
    t.style.setProperty("--ry", String(px * 8));
    t.style.setProperty("--tx", `${px * 10}px`);
    t.style.setProperty("--ty", `${py * 10}px`);
  };

  const springy = useMemo(() => ({ type: "spring", stiffness: 220, damping: 24, mass: 0.8 }), []);

  // ----------------------------- Render -----------------------------
  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"} transition={springy}>
      <section
        aria-label="Lifestyle gallery"
        className={
          "relative overflow-hidden bg-gradient-to-b from-background to-muted/30 " + (className ?? "")
        }
      >
        {/* Aurora background */}
        <div ref={auroraRef} aria-hidden className="pointer-events-none absolute inset-0">
          <motion.div
            className={`absolute -inset-20 blur-3xl opacity-40 bg-gradient-to-r ${current.gradient} bg-[length:200%_200%]`}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Header */}
        <div className="px-4 md:px-6 pt-8 md:pt-12 text-center relative z-10">
          <Badge className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-4 py-2 rounded-full text-xs md:text-sm font-medium">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> Lifestyle Showcase
          </Badge>
          <h2 className="mt-4 text-2xl md:text-5xl lg:text-6xl font-black text-foreground leading-tight">
            Your {" "}
            <motion.span
              key={modelToken}
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/70 to-primary bg-[length:200%_200%]"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              {modelToken}
            </motion.span>{" "}
            Lifestyle
          </h2>
          <p className="mt-3 mb-6 text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
            Discover how your {vehicle?.name ?? "vehicle"} fits every chapter of your life.
          </p>

          {/* Progress bar */}
          <div className="mx-auto max-w-3xl">
            <motion.div key={current.id + "-bar"} className="h-1.5 w-full rounded bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((Array.from(visited).length) / scenarios.length) * 100}%` }}
                transition={springy}
                className={`h-full ${current.accentColor}`}
              />
            </motion.div>
            <div className="mt-1 text-xs text-muted-foreground">{Array.from(visited).length}/{scenarios.length} explored</div>
          </div>
        </div>

        <div className="toyota-container px-4 md:px-6 pb-16 grid lg:grid-cols-3 gap-6 lg:gap-12 items-start relative z-10">
          {/* Pill Tabs */}
          <div role="tablist" aria-label="Choose your adventure" id={tablistId} onKeyDown={onKeyDownTabs} className="lg:col-span-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-foreground">Choose Your Adventure</h3>
              <span className="text-xs text-muted-foreground">{selected + 1}/{scenarios.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {scenarios.map((s, i) => {
                const isActive = i === selected;
                return (
                  <button
                    key={s.id}
                    ref={(el) => (tabRefs.current[i] = el)}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${panelId}-panel`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => goTo(i)}
                    className={
                      "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition border focus:outline-none focus-visible:ring-2 focus-visible:ring-primary " +
                      (isActive ? `bg-primary text-primary-foreground border-transparent` : "bg-card hover:bg-muted/60")
                    }
                  >
                    <span aria-hidden>{s.icon}</span>
                    <span className="font-medium">{s.shortTitle}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Panel with cinematic + 3D hover */}
          <div className="lg:col-span-2" ref={swipeableRef} aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 22, clipPath: "inset(100% 0% 0% 0%)" }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0%)" }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -22 }}
                transition={prefersReducedMotion ? { duration: 0.12 } : { duration: 0.6, ease: "easeOut" }}
              >
                <Card
                  role="tabpanel"
                  id={`${panelId}-panel`}
                  aria-labelledby={`${tablistId}-tab-${current.id}`}
                  className="overflow-hidden border-0 shadow-2xl will-change-transform [transform-style:preserve-3d]"
                  onMouseMove={onMouseMoveCard}
                  onMouseLeave={(e) => {
                    const t = e.currentTarget as HTMLDivElement;
                    t.style.removeProperty("--rx");
                    t.style.removeProperty("--ry");
                    t.style.removeProperty("--tx");
                    t.style.removeProperty("--ty");
                  }}
                  style={{
                    // @ts-expect-error css custom props
                    rotateX: "var(--rx, 0deg)",
                    // @ts-expect-error css custom props
                    rotateY: "var(--ry, 0deg)",
                  }}
                >
                  <div className="relative">
                    <div className="aspect-[16/10] md:aspect-[4/3] overflow-hidden">
                      {/* Skeleton */}
                      {!imgReady && <div className="absolute inset-0 animate-pulse bg-muted/60" />}

                      <img
                        src={current.image}
                        alt={`${current.title} lifestyle hero for ${vehicle?.name ?? "vehicle"}`}
                        className="w-full h-full object-cover will-change-transform"
                        loading="lazy"
                        decoding="async"
                        sizes="(min-width: 1024px) 66vw, 100vw"
                        onLoad={() => setImgReady(true)}
                        style={{
                          // @ts-expect-error css custom props
                          transform: "translate3d(var(--tx,0), var(--ty,0), 0)",
                        }}
                      />

                      {/* Subtle overlay to deepen contrast */}
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-20`} />
                    </div>

                    {/* Floating Featured Badge */}
                    <div className="absolute top-4 left-4 md:top-6 md:left-6">
                      <Badge className={`${current.accentColor} text-white border-0 px-3 py-1.5 shadow-md`}>
                        <Star className="h-3 w-3 mr-1.5" aria-hidden="true" /> Featured
                      </Badge>
                    </div>

                    {/* Swipe hint (mobile) */}
                    {!swiped && isMobile && (
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur px-3 py-1.5 rounded-full text-xs border shadow">
                        Swipe to explore →
                      </div>
                    )}

                    {/* Tiny dots indicator */}
                    <div className="absolute top-3 right-3">
                      <div className="flex gap-1">
                        {scenarios.map((_, i) => (
                          <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === selected ? "bg-white" : "bg-white/60"}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-5 md:p-8">
                    <div className="flex items-center gap-4 mb-5">
                      <div className={`w-12 h-12 rounded-xl ${current.accentColor} flex items-center justify-center text-white shadow-lg`} aria-hidden="true">
                        {current.icon}
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-foreground">{current.title}</h3>
                        <p className="text-sm md:text-base text-muted-foreground">{current.description}</p>
                      </div>
                    </div>

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-2">
                      {current.features.map((feature) => (
                        <motion.div
                          key={feature}
                          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 6 }}
                          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-20px" }}
                          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm bg-background/70"
                        >
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${current.accentColor}`} aria-hidden="true" />
                          <span className="font-medium">{feature}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Peek thumbnails (mobile) */}
                    <div className="mt-4 md:hidden flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      {scenarios.map((s, i) => (
                        <button
                          key={s.id}
                          onClick={() => goTo(i)}
                          className={`relative h-12 w-20 rounded-lg overflow-hidden border ${i === selected ? "ring-2 ring-primary" : ""}`}
                          aria-label={`View ${s.title}`}
                        >
                          <img src={s.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <span className="absolute bottom-1 left-1 right-1 text-[10px] text-white line-clamp-1">{s.shortTitle}</span>
                        </button>
                      ))}
                    </div>

                    {/* CTA Row */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      <button className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        Book a Test Drive
                      </button>
                      <button className="inline-flex items-center justify-center rounded-lg border px-4 py-2 hover:bg-muted/50">
                        Download Brochure
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Sticky adaptive CTA */}
        <motion.button
          aria-label="Book a test drive"
          className={`fixed bottom-6 right-6 ${current.accentColor} text-white px-5 py-3 rounded-full shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white`}
          animate={prefersReducedMotion ? undefined : { scale: [1, 1.06, 1] }}
          transition={prefersReducedMotion ? undefined : { repeat: Infinity, duration: 3 }}
        >
          Book a Test Drive
        </motion.button>

        {/* Confetti when all scenarios visited */}
        <ConfettiBurst show={celebrate} accent={current.accentColor} />
      </section>
    </MotionConfig>
  );
}
