import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Shield, Eye, AlertTriangle, Car, Zap, Gauge, Users, Heart, ChevronRight, CheckCircle2, Play, X
} from "lucide-react";
import {
  MobileOptimizedDialog,
  MobileOptimizedDialogContent,
  MobileOptimizedDialogHeader,
  MobileOptimizedDialogBody,
  MobileOptimizedDialogFooter,
  MobileOptimizedDialogTitle,
  MobileOptimizedDialogDescription,
} from "@/components/ui/mobile-optimized-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CollapsibleContent from "@/components/ui/collapsible-content";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                 Types & UX                                  */
/* -------------------------------------------------------------------------- */

type ScenarioKey = "preCollision" | "laneDrift" | "cruise" | "night";

interface SafetySuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  modelName?: string;     // e.g., "Camry Hybrid"
  regionLabel?: string;   // e.g., "UAE"
}

/* -------------------------------------------------------------------------- */
/*                          Scenario Selector (Pills)                          */
/* -------------------------------------------------------------------------- */

const ScenarioPills: React.FC<{
  active: ScenarioKey;
  setActive: (k: ScenarioKey) => void;
}> = ({ active, setActive }) => {
  const items: { key: ScenarioKey; label: string; icon: React.ElementType }[] = [
    { key: "preCollision", label: "Pre-Collision", icon: Eye },
    { key: "laneDrift", label: "Lane Assist", icon: AlertTriangle },
    { key: "cruise", label: "Adaptive Cruise", icon: Car },
    { key: "night", label: "Auto High Beam", icon: Zap },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setActive(key)}
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition",
            active === key ? "bg-primary text-primary-foreground border-transparent" : "hover:bg-muted border"
          )}
          aria-pressed={active === key}
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              Media Components                               */
/* -------------------------------------------------------------------------- */

/** Video with privacy-enhanced YouTube + poster overlay; loads only after click */
const YoutubeInline: React.FC<{ videoId: string; title: string }> = ({ videoId, title }) => {
  const [play, setPlay] = React.useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1${play ? "&autoplay=1" : ""}`;
  const poster = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  return (
    <div className="relative w-full overflow-hidden rounded-lg ring-1 ring-black/5 bg-black">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {!play && (
          <button
            onClick={() => setPlay(true)}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center group"
          >
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80 group-hover:opacity-95 transition"
              style={{ backgroundImage: `url('${poster}')` }}
            />
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

/** Before/After scrub demo (no external assets required) */
const LaneDriftScrub: React.FC = () => {
  const [pos, setPos] = React.useState(60); // 0..100
  return (
    <div className="relative w-full overflow-hidden rounded-lg ring-1 ring-black/5 bg-neutral-900">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {/* BEFORE (no assist) */}
        <div className="absolute inset-0">
          <GridRoad drift />
          <DriftingCar />
          <LabelBadge text="Before · No Assist" className="left-3 top-3" />
        </div>
        {/* AFTER (lane assist) */}
        <div className="absolute inset-0 pointer-events-none" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <GridRoad drift={false} assisted />
          <CenteredCar />
          <LabelBadge text="After · Lane Assist" className="right-3 top-3" />
        </div>

        {/* Scrubber */}
        <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
          <div className="h-full w-0.5 bg-white/70" />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] text-black shadow">
            Drag
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60%] cursor-ew-resize [accent-color:hsl(var(--primary))]"
          aria-label="Slide to compare before and after"
        />
      </div>
    </div>
  );
};

/* Visual primitives for the scrub demo */
const GridRoad: React.FC<{ drift?: boolean; assisted?: boolean }> = ({ drift, assisted }) => (
  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 160 90" preserveAspectRatio="none">
    <defs>
      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="160" height="90" fill="#0a0a0a" />
    <rect width="160" height="90" fill="url(#grid)" />
    <path d="M0,60 L160,60" stroke="#2f2f2f" strokeWidth="20" />
    <path d="M10,60 L150,60" stroke="#ffffff" strokeDasharray="4 4" strokeWidth="1.2" />
    {drift && <circle cx="110" cy="48" r="10" fill="rgba(255,200,0,0.12)" />}
    {assisted && <path d="M40,52 Q80,60 120,58" stroke="rgba(0,200,255,0.5)" strokeWidth="3" fill="none" />}
  </svg>
);

const DriftingCar: React.FC = () => (
  <div className="absolute left-[48%] top-[46%] -translate-x-1/2 -rotate-8">
    <div className="h-8 w-14 rounded bg-red-500 shadow-lg" />
  </div>
);

const CenteredCar: React.FC = () => (
  <div className="absolute left-[50%] top-[58%] -translate-x-1/2">
    <div className="h-8 w-14 rounded bg-emerald-500 shadow-lg" />
  </div>
);

const LabelBadge: React.FC<{ text: string; className?: string }> = ({ text, className }) => (
  <div className={cn("absolute rounded-full bg-white/90 text-[10px] text-black px-2 py-0.5 shadow", className)}>
    {text}
  </div>
);

/* Simple placeholder cards for the non-video scenarios (keep hero interactive) */
const CardShell: React.FC<{ title: string; subtitle: string; accent?: "blue" | "amber" | "emerald" }> = ({ title, subtitle, accent = "blue" }) => {
  const accentMap: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-500/0 ring-blue-300/30",
    amber: "from-amber-500/20 to-amber-500/0 ring-amber-300/30",
    emerald: "from-emerald-500/20 to-emerald-500/0 ring-emerald-300/30",
  };
  return (
    <div className={cn("relative rounded-lg p-4 lg:p-6 bg-gradient-to-b ring-1", accentMap[accent])}>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-2 flex items-center gap-2">
        <span className="text-lg font-semibold">{title}</span>
        <ChevronRight className="h-4 w-4" />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-14 rounded bg-background/60 border" />
        ))}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                           Main Safety Suite Modal                           */
/* -------------------------------------------------------------------------- */

const YT_PRECOLLISION = "oL6mrPWtZJ4"; // from https://www.youtube.com/watch?v=oL6mrPWtZJ4

const SafetySuiteModal: React.FC<SafetySuiteModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  modelName = "Toyota Camry",
  regionLabel = "UAE",
}) => {
  const prefersReduced = useReducedMotion();
  const [scenario, setScenario] = React.useState<ScenarioKey>("laneDrift");

  const enter = prefersReduced ? {} : { opacity: 0, y: 16 };
  const entered = prefersReduced ? {} : { opacity: 1, y: 0 };

  const safetyFeatures = [
    {
      icon: Eye,
      name: "Pre-Collision System",
      chips: ["Pedestrian", "Auto Brake", "Radar"],
      details:
        "Camera + radar help detect vehicles/pedestrians and can automatically apply brakes if a collision is likely.",
      active: scenario === "preCollision",
    },
    {
      icon: AlertTriangle,
      name: "Lane Departure Alert",
      chips: ["Steering Assist", "Road Edge"],
      details:
        "Monitors lane markers and can provide steering assist to help keep you centered.",
      active: scenario === "laneDrift",
    },
    {
      icon: Car,
      name: "Dynamic Radar Cruise",
      chips: ["Stop & Go", "Distance Set"],
      details:
        "Automatically adjusts speed to maintain a preset following distance.",
      active: scenario === "cruise",
    },
    {
      icon: Zap,
      name: "Automatic High Beams",
      chips: ["Auto Dip", "Camera"],
      details:
        "Optimizes visibility by toggling high/low beams when traffic is detected.",
      active: scenario === "night",
    },
  ] as const;

  const additionalSafety = [
    {
      icon: Gauge,
      title: "Star Safety System",
      features: ["VSC", "TRAC", "ABS", "EBD", "BA", "SST"],
    },
    {
      icon: Users,
      title: "Airbag System",
      features: ["Front Airbags", "Front Side", "Rear Side", "Curtains"],
    },
    {
      icon: Heart,
      title: "Active Safety",
      features: ["Blind Spot Monitor", "Rear Cross-Traffic Alert", "Bird’s Eye View", "Parking Support Brake"],
    },
  ] as const;

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      {/* Wider for proper media */}
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        <MobileOptimizedDialogHeader>
          <MobileOptimizedDialogTitle className="text-2xl lg:text-3xl font-bold">
            Toyota Safety Sense 2.0 · {modelName}
          </MobileOptimizedDialogTitle>
          <MobileOptimizedDialogDescription className="text-base line-clamp-2">
            Real scenarios you can feel—then book a test drive.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Hero: Scenario pills + reaction timeline + media */}
            <motion.div
              initial={enter}
              animate={entered}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-4 lg:p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent ring-1 ring-primary/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-7 w-7 text-primary" />
                <Badge variant="secondary" className="text-xs font-semibold">
                  Standard on most grades
                </Badge>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Left: scenario controls + timeline */}
                <div className="lg:w-72 space-y-3">
                  <ScenarioPills active={scenario} setActive={setScenario} />
                  <div className="rounded-lg border p-3">
                    <h4 className="text-sm font-semibold mb-2">Reaction Timeline</h4>
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { t: "0.0s", label: "Detect" },
                        { t: "0.3s", label: "Alert" },
                        { t: "0.5s", label: "Assist" },
                        { t: "0.6s", label: "Stabilize" },
                      ].map((s, i) => (
                        <motion.div
                          key={s.t}
                          initial={{ opacity: 0.4, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="rounded-md border p-2"
                        >
                          <div className="font-semibold">{s.t}</div>
                          <div className="text-muted-foreground">{s.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: interactive media area */}
                <div className="flex-1 min-w-0">
                  <AnimatePresence mode="wait">
                    {scenario === "preCollision" && (
                      <motion.div key="pre" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <YoutubeInline videoId={YT_PRECOLLISION} title="Pre-Collision System" />
                      </motion.div>
                    )}
                    {scenario === "laneDrift" && (
                      <motion.div key="lane" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <LaneDriftScrub />
                      </motion.div>
                    )}
                    {scenario === "cruise" && (
                      <motion.div key="cruise" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <div className="relative w-full overflow-hidden rounded-lg ring-1 ring-black/5">
                          <CardShell title="Adaptive Following" subtitle="Speed & distance" accent="emerald" />
                        </div>
                      </motion.div>
                    )}
                    {scenario === "night" && (
                      <motion.div key="night" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                        <div className="relative w-full overflow-hidden rounded-lg ring-1 ring-black/5">
                          <CardShell title="Smart Visibility" subtitle="Auto high/low beam" accent="blue" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

            {/* Core safety features — compact + progressive */}
            <div>
              <h3 className="text-xl font-bold mb-3">Core Safety Features</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {safetyFeatures.map((f, idx) => (
                  <motion.div
                    key={f.name}
                    initial={enter}
                    animate={entered}
                    transition={{ delay: idx * 0.03 }}
                    className={cn(
                      "p-4 rounded-xl border transition-all hover:border-muted-foreground/20",
                      f.active && "border-primary/30 bg-primary/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("p-2 rounded-md", f.active ? "bg-primary text-primary-foreground" : "bg-muted")}>
                        <f.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold leading-tight">{f.name}</h4>
                          {f.active && <Badge className="h-5 px-2 text-[10px]">Selected</Badge>}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {f.chips.map((c) => (
                            <span key={c} className="px-2 py-0.5 text-[11px] rounded-full bg-muted">{c}</span>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{f.details}</p>
                        <CollapsibleContent title="Learn more" className="border-0 mt-1">
                          <p className="text-sm text-muted-foreground">{f.details}</p>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Complete package — compact */}
            <div>
              <h3 className="text-xl font-bold mb-3">Complete Safety Package</h3>
              <div className="space-y-3">
                {[
                  { icon: Gauge, title: "Star Safety System", features: ["VSC", "TRAC", "ABS", "EBD", "BA", "SST"] },
                  { icon: Users, title: "Airbag System", features: ["Front Airbags", "Front Side", "Rear Side", "Curtains"] },
                  { icon: Heart, title: "Active Safety", features: ["Blind Spot Monitor", "Rear Cross-Traffic Alert", "Bird’s Eye View", "Parking Support Brake"] },
                ].map((system, index) => (
                  <CollapsibleContent
                    key={system.title}
                    title={
                      <div className="flex items-center gap-3">
                        <system.icon className="h-5 w-5 text-primary" />
                        <span>{system.title}</span>
                      </div>
                    }
                    defaultOpen={index === 0}
                    className="border"
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {system.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center text-xs text-muted-foreground mt-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Feature availability varies by grade/model year and region ({regionLabel}).</span>
                </div>
              </div>
            </div>
          </div>
        </MobileOptimizedDialogBody>

        {/* Single CTA only */}
        <MobileOptimizedDialogFooter>
          <div className="flex w-full sm:w-auto sm:ml-auto gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onBookTestDrive}>Book Test Drive</Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default SafetySuiteModal;
