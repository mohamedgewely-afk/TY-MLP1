import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Battery, Zap, Gauge, Leaf, Car, RotateCcw, TrendingUp, Award, X, PlugZap
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
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface HybridTechModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
}

/* -------------------------------------------------------------------------- */
/*                          Energy Flow Demo (inline)                          */
/* -------------------------------------------------------------------------- */

type FlowMode = "EV" | "Hybrid" | "Charge";

const EnergyFlowDemo: React.FC = () => {
  const [mode, setMode] = React.useState<FlowMode>("EV");
  const prefersReduced = useReducedMotion();

  const pulse = prefersReduced ? {} : { filter: ["brightness(1)", "brightness(1.25)", "brightness(1)"] };
  const arrows = prefersReduced ? {} : { opacity: [0.3, 1, 0.3] };

  return (
    <div className="rounded-xl border border-emerald-200/50 bg-emerald-50/30 backdrop-blur p-3 lg:p-4">
      {/* mode toggles */}
      <div className="flex gap-2 mb-3">
        {(["EV", "Hybrid", "Charge"] as FlowMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs border transition",
              mode === m ? "bg-emerald-600 text-white border-transparent" : "hover:bg-white/70"
            )}
            aria-pressed={mode === m}
          >
            {m}
          </button>
        ))}
      </div>

      {/* 16:9 canvas */}
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        <svg viewBox="0 0 320 180" className="absolute inset-0 w-full h-full">
          {/* background grid */}
          <defs>
            <pattern id="g" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M16 0H0V16" stroke="rgba(16, 80, 48, .08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="320" height="180" fill="url(#g)" />
          {/* Car silhouette */}
          <g transform="translate(30,60)">
            <rect x="0" y="20" width="260" height="40" rx="10" fill="rgba(16, 80, 48, .06)" />
            <circle cx="50" cy="70" r="10" fill="rgba(16, 80, 48, .18)" />
            <circle cx="210" cy="70" r="10" fill="rgba(16, 80, 48, .18)" />
          </g>

          {/* Engine block */}
          <motion.rect
            x="55" y="40" width="60" height="38" rx="6"
            className="fill-emerald-200/60"
            animate={pulse}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <text x="85" y="62" textAnchor="middle" className="fill-emerald-900 text-[10px] font-semibold">ENGINE</text>

          {/* Battery block */}
          <motion.rect
            x="205" y="40" width="60" height="38" rx="6"
            className="fill-emerald-200/60"
            animate={pulse}
            transition={{ duration: 1.5, repeat: Infinity, delay: .3 }}
          />
          <text x="235" y="62" textAnchor="middle" className="fill-emerald-900 text-[10px] font-semibold">BATTERY</text>

          {/* Motor/Trans */}
          <motion.rect
            x="130" y="95" width="60" height="38" rx="6"
            className="fill-emerald-100"
          />
          <text x="160" y="117" textAnchor="middle" className="fill-emerald-900 text-[10px] font-semibold">MOTOR</text>

          {/* Wheels */}
          <circle cx="90" cy="145" r="12" className="fill-emerald-900/10" />
          <circle cx="225" cy="145" r="12" className="fill-emerald-900/10" />

          {/* Flow arrows */}
          {/* EV: Battery -> Motor -> Wheels */}
          <AnimatePresence>
            {mode === "EV" && (
              <g>
                <motion.path
                  d="M235,78 L160,114"
                  stroke="rgba(4,120,87,0.9)" strokeWidth="3" fill="none"
                  animate={arrows} transition={{ duration: 1.6, repeat: Infinity }}
                />
                <motion.path
                  d="M160,114 L90,145"
                  stroke="rgba(4,120,87,0.9)" strokeWidth="3" fill="none"
                  animate={arrows} transition={{ duration: 1.6, repeat: Infinity, delay: .2 }}
                />
                <motion.path
                  d="M160,114 L225,145"
                  stroke="rgba(4,120,87,0.9)" strokeWidth="3" fill="none"
                  animate={arrows} transition={{ duration: 1.6, repeat: Infinity, delay: .4 }}
                />
              </g>
            )}
            {/* Hybrid: Engine + Battery -> Motor */}
            {mode === "Hybrid" && (
              <g>
                <motion.path
                  d="M85,78 L160,114"
                  stroke="rgba(6,95,70,0.9)" strokeWidth="3" fill="none"
                  animate={arrows} transition={{ duration: 1.4, repeat: Infinity }}
                />
                <motion.path
                  d="M235,78 L160,114"
                  stroke="rgba(6,95,70,0.9)" strokeWidth="3" fill="none"
                  animate={arrows} transition={{ duration: 1.4, repeat: Infinity, delay: .2 }}
                />
              </g>
            )}
            {/* Charge: Wheels/Motor -> Battery */}
            {mode === "Charge" && (
              <g>
                <motion.path
                  d="M160,114 L235,78"
                  stroke="rgba(5,150,105,0.95)" strokeWidth="3" fill="none"
                  animate={arrows} transition={{ duration: 1.4, repeat: Infinity }}
                />
              </g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-600" />
          <span>Power flow</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-300" />
          <span>Components</span>
        </div>
        <div className="flex items-center gap-2">
          <PlugZap className="h-3.5 w-3.5 text-emerald-700" />
          <span>Regen braking</span>
        </div>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                  Modal                                      */
/* -------------------------------------------------------------------------- */

const HybridTechModal: React.FC<HybridTechModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive
}) => {
  const prefersReduced = useReducedMotion();

  const hybridComponents = [
    {
      icon: Car,
      name: "2.5L 4-Cylinder Engine",
      description: "Efficient gasoline engine optimized for hybrid operation",
      details:
        "Atkinson-cycle engine designed for maximum fuel efficiency while maintaining performance. Features direct injection and variable valve timing.",
      specs: ["176 HP", "Atkinson Cycle", "Direct Injection", "VVT-i"],
    },
    {
      icon: Zap,
      name: "Electric Motor System",
      description: "Powerful electric motors for instant torque and efficiency",
      details:
        "Dual electric motor setup provides immediate power delivery and regenerative braking for enhanced efficiency.",
      specs: ["118 HP Combined", "Instant Torque", "Regen Braking", "Silent Operation"],
    },
    {
      icon: Battery,
      name: "Hybrid Battery Pack",
      description: "Advanced lithium-ion battery system",
      details:
        "Compact, lightweight lithium-ion battery pack positioned for optimal weight distribution and cabin space.",
      specs: ["Lithium-ion", "8-Year Warranty", "Minimal Maintenance", "Compact Design"],
    },
    {
      icon: RotateCcw,
      name: "Power Control Unit",
      description: "Intelligent system that manages power flow",
      details:
        "Sophisticated control that seamlessly blends gasoline and electric power for optimal efficiency and response.",
      specs: ["Seamless Switching", "Smart Management", "Real-time Optimization", "Predictive Logic"],
    },
  ];

  const drivingModes = [
    {
      icon: Leaf,
      title: "EV Mode",
      description: "Pure electric drive for short distances",
      features: ["Silent Start", "Zero Tailpipe Emissions", "Low-speed Zones", "Parking"],
    },
    {
      icon: TrendingUp,
      title: "Eco Mode",
      description: "Max efficiency with gentle throttle mapping",
      features: ["Extended Range", "Climate Optimization", "Efficiency Coaching"],
    },
    {
      icon: Gauge,
      title: "Normal Mode",
      description: "Balanced performance and efficiency",
      features: ["Everyday Driving", "Smooth Power", "Auto Switching"],
    },
    {
      icon: Zap,
      title: "Sport Mode",
      description: "Sharper response and quicker acceleration",
      features: ["More Immediate Throttle", "Dynamic Feel"],
    },
  ];

  const enter = prefersReduced ? {} : { opacity: 0, y: 16 };
  const entered = prefersReduced ? {} : { opacity: 1, y: 0 };

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      {/* Wider desktop, compact mobile header */}
      <MobileOptimizedDialogContent className="sm:max-w-6xl max-w-[1100px] w-[96vw]">
        <MobileOptimizedDialogHeader className="px-3 py-2 sm:px-6 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <MobileOptimizedDialogTitle className="text-lg font-semibold leading-tight sm:text-2xl sm:font-bold">
              Hybrid Synergy Drive®
            </MobileOptimizedDialogTitle>
            {/* Inline mobile close */}
            <Button variant="ghost" size="icon" className="sm:hidden" onClick={onClose} aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Hide description on mobile; keep on larger screens */}
          <MobileOptimizedDialogDescription className="hidden sm:block text-base mt-1">
            Advanced hybrid technology delivering exceptional fuel efficiency and performance
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={enter}
              animate={entered}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent p-4 lg:p-6 ring-1 ring-emerald-300/30"
            >
              <div className="flex items-center gap-3 mb-4">
                <Battery className="h-7 w-7 text-emerald-600" />
                <Badge variant="secondary" className="text-xs font-semibold bg-emerald-100 text-emerald-800">
                  25+ Years of Innovation
                </Badge>
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                {/* Left: headline & stats (mobile: top) */}
                <div className="lg:col-span-1 space-y-3">
                  <h3 className="text-xl lg:text-2xl font-bold">The Future of Efficiency</h3>
                  <p className="text-sm text-muted-foreground">
                    Toyota’s proven hybrid tech blends gasoline and electric power for standout economy—without compromise.
                  </p>

                  {/* Key stats */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center rounded-lg bg-white/60 backdrop-blur border p-2">
                      <div className="text-xl font-bold text-emerald-700 leading-none">52</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">City MPG</div>
                    </div>
                    <div className="text-center rounded-lg bg-white/60 backdrop-blur border p-2">
                      <div className="text-xl font-bold text-emerald-700 leading-none">208</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Total HP</div>
                    </div>
                    <div className="text-center rounded-lg bg-white/60 backdrop-blur border p-2">
                      <div className="text-sm font-bold text-emerald-700 leading-none">AT-PZEV</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Emissions</div>
                    </div>
                  </div>
                </div>

                {/* Right: Energy flow demo */}
                <div className="lg:col-span-2">
                  <EnergyFlowDemo />
                </div>
              </div>
            </motion.div>

            {/* Hybrid Components */}
            <div>
              <h3 className="text-xl font-bold mb-3">Hybrid System Components</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {hybridComponents.map((component, index) => (
                  <motion.div
                    key={component.name}
                    initial={enter}
                    animate={entered}
                    transition={{ delay: index * 0.04 }}
                    className="p-4 rounded-xl border hover:border-emerald-300/60 transition-all duration-300 bg-white/60 backdrop-blur"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md bg-emerald-600 text-white">
                        <component.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold leading-tight">{component.name}</h4>
                          <Badge className="h-5 px-2 text-[10px]" variant="secondary">Hybrid Core</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{component.description}</p>

                        {/* chips */}
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {component.specs.map((s) => (
                            <span key={s} className="px-2 py-0.5 text-[11px] rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                              {s}
                            </span>
                          ))}
                        </div>

                        {/* disclosure */}
                        <CollapsibleContent title="Technical details" className="border-0 mt-2">
                          <p className="text-sm text-muted-foreground">{component.details}</p>
                        </CollapsibleContent>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Driving Modes (carousel on mobile, grid on desktop) */}
            <div>
              <h3 className="text-xl font-bold mb-3">Intelligent Driving Modes</h3>

              {/* mobile swipe row */}
              <div className="sm:hidden -mx-3 px-3">
                <div className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                  {drivingModes.map((mode, i) => (
                    <motion.div
                      key={mode.title}
                      initial={enter}
                      animate={entered}
                      transition={{ delay: i * 0.05 }}
                      className="min-w-[78%] snap-center p-4 rounded-xl border bg-emerald-50/40"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <mode.icon className="h-5 w-5 text-emerald-700" />
                        <h4 className="font-semibold">{mode.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{mode.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {mode.features.map((f) => (
                          <span key={f} className="px-2 py-0.5 text-[11px] rounded-full bg-white border">{f}</span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* desktop grid */}
              <div className="hidden sm:grid gap-3 sm:grid-cols-2">
                {drivingModes.map((mode, i) => (
                  <motion.div
                    key={mode.title}
                    initial={enter}
                    animate={entered}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-xl border bg-emerald-50/40"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <mode.icon className="h-5 w-5 text-emerald-700" />
                      <h4 className="font-semibold">{mode.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{mode.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mode.features.map((f) => (
                        <span key={f} className="px-2 py-0.5 text-[11px] rounded-full bg-white border">{f}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Environmental Impact (tight & visual) */}
            <motion.div
              initial={enter}
              animate={entered}
              className="rounded-2xl p-5 border bg-gradient-to-r from-emerald-50 to-emerald-100/60"
            >
              <div className="flex items-center gap-3 mb-3">
                <Award className="h-5 w-5 text-emerald-700" />
                <h3 className="text-lg font-semibold text-emerald-900">Environmental Benefits</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-1.5">Reduced Emissions</h4>
                  <ul className="text-sm text-emerald-800/90 space-y-1">
                    <li>• AT-PZEV certified</li>
                    <li>• Up to 70% fewer emissions vs gas-only</li>
                    <li>• Cleaner urban air contribution</li>
                    <li>• Sustainable tech footprint</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-800 mb-1.5">Fuel Savings</h4>
                  <ul className="text-sm text-emerald-800/90 space-y-1">
                    <li>• Up to 52 MPG city</li>
                    <li>• Lower fuel spend</li>
                    <li>• Reduced CO₂ per km</li>
                    <li>• Long-term cost efficiency</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </MobileOptimizedDialogBody>

        {/* CTA — single primary for conversion clarity */}
        <MobileOptimizedDialogFooter className="px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex w-full sm:w-auto sm:ml-auto gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button onClick={onBookTestDrive}>Book Test Drive</Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default HybridTechModal;
