import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Wifi, Smartphone, Navigation, Radio, ShieldCheck, Info, HelpCircle, Play, CheckCircle2 } from "lucide-react";
import {
  MobileOptimizedDialog, MobileOptimizedDialogContent, MobileOptimizedDialogHeader,
  MobileOptimizedDialogBody, MobileOptimizedDialogFooter, MobileOptimizedDialogTitle,
  MobileOptimizedDialogDescription
} from "@/components/ui/mobile-optimized-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CollapsibleContent from "@/components/ui/collapsible-content";
import InteractiveDemo from "./shared/InteractiveDemo";
import { cn } from "@/lib/utils";

type TabKey = "benefits" | "tech" | "plans" | "faqs";
type MediaTab = "demo" | "video";

interface ConnectivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  modelName?: string;
  regionLabel?: string;
  compact?: boolean; // NEW: compact copy mode
}

const YT_ID = "cCOszP-VQcc";

const chips = (list: string[]) => (
  <div className="flex flex-wrap gap-2">
    {list.map((c) => (
      <span key={c} className="px-2 py-1 text-xs rounded-full bg-muted">{c}</span>
    ))}
  </div>
);

const ConnectivityModal: React.FC<ConnectivityModalProps> = ({
  isOpen, onClose, onBookTestDrive, modelName = "Toyota Camry", regionLabel = "UAE", compact = true
}) => {
  const prefersReducedMotion = useReducedMotion();
  const enter = prefersReducedMotion ? {} : { opacity: 0, y: 16 };
  const entered = prefersReducedMotion ? {} : { opacity: 1, y: 0 };
  const [mediaTab, setMediaTab] = React.useState<MediaTab>("demo");
  const [activeTab, setActiveTab] = React.useState<TabKey>("benefits");
  const [play, setPlay] = React.useState(false);

  const ytSrc = `https://www.youtube-nocookie.com/embed/${YT_ID}?rel=0&modestbranding=1&playsinline=1${play ? "&autoplay=1" : ""}`;

  // ultra-short content
  const features = [
    { icon: Smartphone, name: "CarPlay & Android Auto", chips: ["Wireless", "Maps", "Messages"], detail: "Phone apps on the car screen. Voice control. Fast pairing." },
    { icon: Wifi, name: "Wi-Fi Hotspot", chips: ["Up to 5", "4G LTE"], detail: "Secure cabin Wi-Fi for work/streaming. Data plan required." },
    { icon: Navigation, name: "Connected Navigation", chips: ["Live traffic", "Weather"], detail: "Smarter routes, fresher POIs, dynamic rerouting." },
    { icon: Radio, name: "SiriusXM + Services", chips: ["360+ ch", "Health"], detail: "Premium audio plus vehicle status and alerts." },
  ] as const;

  const benefits = [
    "Remote start & comfy cabin",
    "Smarter routes, fewer delays",
    "Hands-free calls & texts",
    "Wi-Fi for work & play",
  ];

  const faqs = [
    { q: "Need a data plan?", a: "Only for the hotspot. Most features use your phone’s data." },
    { q: "Privacy?", a: "You control sharing in Settings. Opt out anytime." },
    { q: "Availability?", a: `Features vary by grade/year. This view reflects ${regionLabel}.` },
  ];

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-4xl">
        <MobileOptimizedDialogHeader>
          <MobileOptimizedDialogTitle className="text-2xl lg:text-3xl font-bold">
            Connected Services · {modelName}
          </MobileOptimizedDialogTitle>
          <MobileOptimizedDialogDescription className="text-base line-clamp-2">
            Stay connected. Try the demo or watch the quick video—then book a test drive.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Multimedia (demo/video) */}
            <motion.div initial={enter} animate={entered} className="rounded-2xl p-4 lg:p-6 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent ring-1 ring-blue-200/40">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs font-semibold bg-blue-100 text-blue-700">Multimedia</Badge>
                <div className="ml-auto flex gap-2">
                  {(["demo","video"] as MediaTab[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setMediaTab(t)}
                      className={cn("px-3 py-1.5 rounded-lg text-sm", mediaTab===t ? "bg-primary text-primary-foreground" : "hover:bg-muted")}
                      aria-pressed={mediaTab===t}
                    >
                      {t==="demo" ? "Interactive Demo" : "Video"}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mediaTab === "demo" ? (
                  <motion.div key="demo" initial={enter} animate={entered} exit={{opacity:0}} className="grid gap-3 lg:grid-cols-[1fr,auto]">
                    <InteractiveDemo type="connectivity" />
                    <div className="flex lg:flex-col gap-2">
                      <Button variant="secondary" className="justify-between">
                        Quick Preset
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" onClick={onBookTestDrive}>
                        Test These Features
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="video" initial={enter} animate={entered} exit={{opacity:0}}>
                    <div className="relative aspect-video overflow-hidden rounded-xl ring-1 ring-black/5 bg-black">
                      {!play && (
                        <button
                          aria-label="Play video"
                          onClick={() => setPlay(true)}
                          className="absolute inset-0 flex items-center justify-center group"
                        >
                          <div className="absolute inset-0 bg-[url('https://img.youtube.com/vi/cCOszP-VQcc/hqdefault.jpg')] bg-cover bg-center opacity-80 group-hover:opacity-95 transition" />
                          <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-sm font-medium shadow">
                            <Play className="h-4 w-4" />
                            Play video
                          </div>
                        </button>
                      )}
                      {play && (
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src={ytSrc}
                          title="Connectivity Video"
                          loading="lazy"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Benefits (super short) */}
            <div className="rounded-xl border">
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-semibold mb-3">At a glance</h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                      <span className="text-sm">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Tech (chips + collapsible for more) */}
            <div className="rounded-xl border">
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-semibold mb-3">Core features</h3>
                <div className="space-y-3">
                  {features.map((f) => (
                    <div key={f.name} className="p-3 rounded-lg border hover:border-primary/30 transition">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                          <f.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{f.name}</h4>
                          </div>
                          <div className="mt-2">{chips(f.chips as unknown as string[])}</div>
                          {/* one-line tease, clamp */}
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-1">{f.detail}</p>
                          {/* details hidden by default */}
                          <CollapsibleContent title="More" className="border-0 mt-1" defaultOpen={false}>
                            <p className="text-sm text-muted-foreground">{f.detail}</p>
                          </CollapsibleContent>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* tiny trust row */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center text-xs text-muted-foreground mt-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Privacy controls in Settings.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>Features vary by grade/year in {regionLabel}.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs (3 short items max) */}
            <div className="rounded-xl border">
              <div className="p-4 sm:p-5">
                <h3 className="text-lg font-semibold mb-3">Quick answers</h3>
                <div className="space-y-2">
                  {faqs.map((item) => (
                    <CollapsibleContent
                      key={item.q}
                      title={<div className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-blue-500" /><span>{item.q}</span></div>}
                      className="border"
                    >
                      <p className="text-sm text-muted-foreground">{item.a}</p>
                    </CollapsibleContent>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MobileOptimizedDialogBody>

        {/* Single CTA */}
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

export default ConnectivityModal;
