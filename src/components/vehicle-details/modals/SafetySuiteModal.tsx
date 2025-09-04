import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion, MotionConfig, AnimatePresence } from "framer-motion";
import {
  Shield, Eye, AlertTriangle, Car, Zap, Gauge, Users, Heart, Search as SearchIcon, Share2
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
import InteractiveDemo from "./shared/InteractiveDemo";
// Optional shadcn parts (safe to remove if you don't have them)
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

interface SafetySuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  // Optional: pass current model/grade to tailor copy & tracking
  modelName?: string;
  gradeName?: string;
}

type FeatureItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  code?: string; // e.g., "PCS", "LDA"
  name: string;
  description: string;
  details: string;
  active: boolean;
};

type SystemGroup = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  features: string[];
};

const BASE_FEATURES: FeatureItem[] = [
  {
    icon: Eye,
    code: "PCS",
    name: "Pre-Collision System",
    description: "Detects vehicles/pedestrians and can auto-brake.",
    details:
      "Camera + radar scan the road ahead; provides alerts and automatic emergency braking when potential collisions are detected.",
    active: true,
  },
  {
    icon: AlertTriangle,
    code: "LDA",
    name: "Lane Departure Alert",
    description: "Warns if you drift without signaling.",
    details:
      "Monitors lane markings and provides visual/audible alerts to help you stay centered. With steering assist when equipped.",
    active: true,
  },
  {
    icon: Car,
    code: "DRCC",
    name: "Dynamic Radar Cruise Control",
    description: "Maintains speed and following distance.",
    details:
      "Adaptive cruise adjusts speed with traffic while keeping a preset gap. Full-speed range on select grades.",
    active: false,
  },
  {
    icon: Zap,
    code: "AHB",
    name: "Automatic High Beams",
    description: "Auto toggles high/low beams with traffic.",
    details:
      "Intelligent lighting detects oncoming vehicles and taillights to optimize night visibility without dazzling others.",
    active: false,
  },
];

const EXTRA_SYSTEMS: SystemGroup[] = [
  {
    icon: Gauge,
    title: "Star Safety System",
    features: [
      "Vehicle Stability Control",
      "Traction Control",
      "Anti-lock Brakes",
      "Electronic Brake-force Distribution",
      "Brake Assist",
      "Smart Stop Technology",
    ],
  },
  {
    icon: Users,
    title: "Airbag System",
    features: [
      "Front Advanced Airbags",
      "Front Seat-Mounted Side Airbags",
      "Rear Seat-Mounted Side Airbags",
      "Front & Rear Side Curtain Airbags",
    ],
  },
  {
    icon: Heart,
    title: "Active Safety",
    features: ["Blind Spot Monitor", "Rear Cross-Traffic Alert", "Bird’s Eye View Camera", "Parking Support Brake"],
  },
];

const variants = {
  fadeUp: (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.24 } },
    exit: { opacity: 0, y: 8, transition: { duration: 0.16 } },
  }),
};

const SafetySuiteModal: React.FC<SafetySuiteModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  modelName = "Camry",
  gradeName,
}) => {
  const [query, setQuery] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);
  const [features] = useState<FeatureItem[]>(BASE_FEATURES);
  const reduceMotion = useReducedMotion();
  const firstFocusableRef = useRef<HTMLButtonElement | null>(null);

  // Analytics stubs
  const track = useCallback((event: string, payload?: Record<string, unknown>) => {
    // hook to GA4/Segment/datLayer
    // window.dataLayer?.push({ event, ...payload });
    // console.log(event, payload);
  }, []);

  useEffect(() => {
    if (isOpen) track("safety_modal_open", { modelName, gradeName });
  }, [isOpen, modelName, gradeName, track]);

  const coveragePct = useMemo(() => {
    const total = features.length;
    const active = features.filter(f => f.active).length;
    return Math.round((active / total) * 100);
  }, [features]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return features.filter((f) => {
      if (activeOnly && !f.active) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.details.toLowerCase().includes(q) ||
        (f.code?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [features, query, activeOnly]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key.toLowerCase() === "b") onBookTestDrive();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, onBookTestDrive]);

  const copyDeepLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set("safety", "true");
    await navigator.clipboard.writeText(url.toString());
    track("safety_share_copied", { url: url.toString() });
  };

  return (
    <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
      <MobileOptimizedDialog open={isOpen} onOpenChange={(open: boolean) => (!open ? onClose() : null)}>
        <MobileOptimizedDialogContent
          aria-labelledby="safety-title"
          className="sm:max-w-4xl"
        >
          <MobileOptimizedDialogHeader className="gap-2">
            <div className="flex items-center justify-between">
              <MobileOptimizedDialogTitle id="safety-title" className="text-2xl lg:text-3xl font-bold">
                Toyota Safety Sense 2.0
              </MobileOptimizedDialogTitle>
              <Button
                ref={firstFocusableRef}
                variant="ghost"
                size="icon"
                aria-label="Share safety info"
                onClick={copyDeepLink}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            <MobileOptimizedDialogDescription className="text-base">
              Advanced safety to protect your journey{gradeName ? ` — ${gradeName}` : ""}.
            </MobileOptimizedDialogDescription>

            {/* Coverage / summary row */}
            <div className="mt-2 grid gap-3 sm:grid-cols-3 items-center">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <Badge variant="secondary" className="font-semibold">Standard on All Models</Badge>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-sm text-muted-foreground">Coverage</div>
                <div className="w-40">
                  <Progress value={coveragePct} />
                </div>
                <div className="text-sm font-medium">{coveragePct}%</div>
              </div>
              <div className="flex sm:justify-end gap-2">
                <Button
                  variant={activeOnly ? "default" : "outline"}
                  onClick={() => setActiveOnly(v => !v)}
                  aria-pressed={activeOnly}
                >
                  {activeOnly ? "Showing Active Only" : "Show Active Only"}
                </Button>
              </div>
            </div>
          </MobileOptimizedDialogHeader>

          <MobileOptimizedDialogBody>
            <div className="space-y-6">
              {/* Hero */}
              <motion.div
                {...variants.fadeUp(0)}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 lg:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                  <Badge variant="secondary" className="text-sm font-semibold">
                    Confidence as Standard
                  </Badge>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-3">Peace of Mind, Every Drive</h3>
                <p className="text-muted-foreground mb-6">
                  {modelName} equips you with proactive technology that watches the road, not the driver.
                </p>
                {/* Lazy demo still renders instantly; heavy bits defer inside it */}
                <InteractiveDemo type="safety" />
              </motion.div>

              {/* Search */}
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search safety features (e.g., PCS, lane, camera)…"
                    className="pl-9"
                    aria-label="Search safety features"
                  />
                </div>
              </div>

              {/* Core features */}
              <section aria-label="Core Safety Features">
                <h3 className="text-xl font-bold mb-4">Core Safety Features</h3>

                <div role="list" className="grid gap-4 sm:grid-cols-2">
                  <AnimatePresence initial={false}>
                    {filtered.map((feature, i) => (
                      <motion.div
                        key={feature.name}
                        {...variants.fadeUp(i)}
                        role="listitem"
                        className={[
                          "p-4 rounded-xl border transition-all duration-300",
                          feature.active ? "border-primary/30 bg-primary/5 shadow-sm" : "border-muted hover:border-muted-foreground/20",
                        ].join(" ")}
                        onMouseEnter={() => track("safety_feature_hover", { name: feature.name })}
                      >
                        <div className="flex items-start gap-3">
                          <div className={["p-2 rounded-lg", feature.active ? "bg-primary text-primary-foreground" : "bg-muted"].join(" ")}>
                            <feature.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold leading-tight">{feature.name}</h4>
                              {feature.code && (
                                <TooltipProvider delayDuration={150}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="text-[11px]">{feature.code}</Badge>
                                    </TooltipTrigger>
                                    <TooltipContent side="top">
                                      {feature.name}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {feature.active && <Badge className="text-[11px]" variant="default">Active</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>

                            <CollapsibleContent
                              title="Learn more"
                              className="mt-2 border-0"
                              onOpenChange={(open: boolean) => {
                                if (open) track("safety_feature_expand", { name: feature.name });
                              }}
                            >
                              <p className="text-sm text-muted-foreground">{feature.details}</p>
                            </CollapsibleContent>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {filtered.length === 0 && (
                  <div className="text-sm text-muted-foreground mt-2">No features match your filter.</div>
                )}
              </section>

              {/* Additional systems */}
              <section aria-label="Complete Safety Package">
                <h3 className="text-xl font-bold mb-4">Complete Safety Package</h3>
                <div className="space-y-4">
                  {EXTRA_SYSTEMS.map((system, idx) => (
                    <CollapsibleContent
                      key={system.title}
                      title={
                        <div className="flex items-center gap-3">
                          <system.icon className="h-5 w-5 text-primary" />
                          <span>{system.title}</span>
                        </div>
                      }
                      defaultOpen={idx === 0}
                      onOpenChange={(open: boolean) => {
                        if (open) track("safety_system_expand", { title: system.title });
                      }}
                    >
                      <div className="grid gap-2 sm:grid-cols-2">
                        {system.features.map((f) => (
                          <div key={f} className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-primary" />
                            <span className="text-sm">{f}</span>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  ))}
                </div>
              </section>

              {/* Ratings */}
              <motion.div {...variants.fadeUp(3)} className="bg-muted/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">Safety Recognition</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">5★</div>
                    <div className="font-semibold mb-1">NHTSA Overall Rating</div>
                    <div className="text-sm text-muted-foreground">National Highway Traffic Safety Administration</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">TSP+</div>
                    <div className="font-semibold mb-1">IIHS Top Safety Pick+</div>
                    <div className="text-sm text-muted-foreground">Insurance Institute for Highway Safety</div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  *Ratings vary by market/grade. Confirm availability and exact specifications locally.
                </p>
              </motion.div>
            </div>
          </MobileOptimizedDialogBody>

          {/* Sticky conversion footer */}
          <MobileOptimizedDialogFooter className="backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
              <Button variant="outline" onClick={onClose} className="sm:w-auto">
                Close
              </Button>
              <Button
                onClick={() => {
                  track("safety_cta_click", { modelName, gradeName });
                  onBookTestDrive();
                }}
                className="sm:w-auto"
              >
                Experience Safety Features
              </Button>
            </div>
            <div className="hidden sm:block text-xs text-muted-foreground ml-3">
              We’ll guide your test drive to demo PCS, LDA, and DRCC on route.
            </div>
          </MobileOptimizedDialogFooter>
        </MobileOptimizedDialogContent>
      </MobileOptimizedDialog>
    </MotionConfig>
  );
};

export default SafetySuiteModal;
