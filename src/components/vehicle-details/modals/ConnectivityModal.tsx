import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Smartphone, Wifi, Radio, Navigation, Phone, Music, MessageSquare, Settings,
  Info, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle, Play
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
import { cn } from "@/lib/utils";

type TabKey = "benefits" | "tech" | "plans" | "faqs";
type MediaTab = "demo" | "video";

interface ConnectivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookTestDrive: () => void;
  modelName?: string;
  regionLabel?: string;
}

const track = (event: string, payload?: Record<string, unknown>) => {
  try {
    (window as any).dataLayer?.push({ event, component: "ConnectivityModal", ...payload });
  } catch {}
};

const YOUTUBE_VIDEO_ID = "cCOszP-VQcc"; // from https://www.youtube.com/watch?v=cCOszP-VQcc

const ConnectivityModal: React.FC<ConnectivityModalProps> = ({
  isOpen,
  onClose,
  onBookTestDrive,
  modelName = "Toyota Camry",
  regionLabel = "UAE",
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = React.useState<TabKey>("benefits");
  const [mediaTab, setMediaTab] = React.useState<MediaTab>("demo");
  const [videoReady, setVideoReady] = React.useState(false);
  const [videoPlaying, setVideoPlaying] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      track("connectivity_modal_open", { modelName });
      setActiveTab("benefits");
      setMediaTab("demo");
      setVideoReady(false);
      setVideoPlaying(false);
    }
  }, [isOpen, modelName]);

  const connectivityFeatures = [
    {
      icon: Smartphone,
      name: "Apple CarPlay & Android Auto",
      headline: "Your apps on the road—maps, music, messages.",
      description:
        "Wireless CarPlay/Android Auto mirrors the apps you rely on so you can navigate, message, and stream safely.",
      details:
        "Connect fast and control via steering-wheel buttons or voice. Works even if your phone stays in your pocket.",
      compatibility: ["iPhone 5s or later", "Android 6.0+ (device-dependent)"],
      proof: "Avg. setup < 30s in showroom tests",
    },
    {
      icon: Wifi,
      name: "Wi-Fi Connect",
      headline: "4G LTE hotspot for the whole cabin.",
      description:
        "Keep passengers online for work, school, or streaming—up to five devices tethered simultaneously.",
      details:
        "Secure in-vehicle AP with automatic reconnection, captive portal support, and shareable QR.",
      compatibility: ["Up to 5 devices", "4G LTE speeds", "Carrier data plan required"],
      proof: "Measured 20–40 Mbps in-city (typical)",
    },
    {
      icon: Navigation,
      name: "Connected Navigation",
      headline: "Live traffic, smarter routes, fresher POIs.",
      description:
        "Cloud navigation adapts in real time—road closures, speed changes, and weather-aware ETA.",
      details:
        "Live incidents, dynamic rerouting, lane guidance, and over-the-air map freshness.",
      compatibility: ["Live traffic", "Weather layer", "POI updates"],
      proof: "ETA variance reduced ~12% vs. baseline",
    },
    {
      icon: Radio,
      name: "SiriusXM & Connected Services",
      headline: "Premium audio + remote vehicle awareness.",
      description:
        "Hundreds of channels plus vehicle health alerts and remote capabilities bundled.",
      details:
        "Podcasts and live radio next to car status, service reminders, and remote notifications.",
      compatibility: ["360+ channels", "Travel Link", "Vehicle health alerts"],
      proof: "Trial included; easy upgrade path",
    },
  ] as const;

  const smartSystems = [
    { icon: Phone, title: "Remote Connect", features: ["Remote Start", "Door Lock/Unlock", "Vehicle Locator", "Guest Driver Monitor"] },
    { icon: Music, title: "Audio Plus", features: ["Alexa Built-in", "Premium Audio", "Wireless Charging", "Multiple USB Ports"] },
    { icon: MessageSquare, title: "Communication", features: ["Hands-free Calling", "Voice-to-Text", "Email Notifications", "App Integrations"] },
    { icon: Settings, title: "Personalization", features: ["Driver Profiles", "Climate Presets", "Seat Memory", "Mirror Positions"] },
  ] as const;

  const plans = [
    { name: "Complimentary Trial", bullets: ["Remote Connect (12 months)", "SiriusXM (3 months)", "Connected Services (12 months)"], badge: "Included" },
    { name: "Extended Plans", bullets: ["Monthly or Annual", "Family Sharing", "Premium Upgrades"], badge: "Popular" },
  ] as const;

  const faqs = [
    { q: "Do I need a separate data plan?", a: "Wi-Fi hotspot features require an in-car data subscription via supported carriers. Most other services work over your phone’s data." },
    { q: "Is my data private?", a: "Yes. You control sharing in Settings and can disable remote features anytime. See the in-vehicle Privacy menu and our policy." },
    { q: "Will my phone work?", a: "Most modern iOS and Android devices are supported. We recommend iOS 14+/Android 10+ for the best wireless experience." },
    { q: "Is this available in my region?", a: `Services shown reflect ${regionLabel} availability. Features may vary by grade and model year.` },
  ] as const;

  const enter = prefersReducedMotion ? {} : { opacity: 0, y: 20 };
  const entered = prefersReducedMotion ? {} : { opacity: 1, y: 0 };

  const handleTab = (key: TabKey) => {
    setActiveTab(key);
    track("connectivity_tab_view", { tab: key });
  };

  const handleMediaTab = (key: MediaTab) => {
    setMediaTab(key);
    track("connectivity_media_tab", { tab: key });
  };

  // YouTube embed url (privacy enhanced)
  const ytBase = `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`;
  const ytParams = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    // Autoplay only after user gesture; keep muted default if you later enable autoplay
  }).toString();
  const ytSrc = `${ytBase}?${ytParams}`;

  return (
    <MobileOptimizedDialog open={isOpen} onOpenChange={onClose}>
      <MobileOptimizedDialogContent className="sm:max-w-4xl">
        <MobileOptimizedDialogHeader>
          <MobileOptimizedDialogTitle className="text-2xl lg:text-3xl font-bold">
            Connected Services for {modelName}
          </MobileOptimizedDialogTitle>
          <MobileOptimizedDialogDescription className="text-base">
            Stay connected and in control. Try the demo—or watch the quick video—then book a test drive.
          </MobileOptimizedDialogDescription>
        </MobileOptimizedDialogHeader>

        <MobileOptimizedDialogBody>
          <div className="space-y-6">
            {/* Multimedia Switcher (Demo / Video) */}
            <motion.div
              initial={enter}
              animate={entered}
              transition={{ duration: 0.4 }}
              className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent p-4 lg:p-6 ring-1 ring-blue-200/40"
              aria-label="Connectivity multimedia hero"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs font-semibold bg-blue-100 text-blue-700">
                  Multimedia
                </Badge>
                <div className="ml-auto flex gap-2">
                  {(["demo", "video"] as MediaTab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => handleMediaTab(t)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium transition",
                        mediaTab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
                      )}
                      aria-pressed={mediaTab === t}
                    >
                      {t === "demo" ? "Interactive Demo" : "Video"}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {mediaTab === "demo" ? (
                  <motion.div
                    key="demo"
                    initial={enter}
                    animate={entered}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="grid gap-3 lg:grid-cols-[1fr,auto]"
                  >
                    <InteractiveDemo type="connectivity" />
                    <div className="flex lg:flex-col gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          track("connectivity_quick_preset", { preset: "remote_start_climate_send_route" });
                          // Optionally call a ref method on InteractiveDemo here
                        }}
                        className="justify-between"
                      >
                        Try Preset
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { onBookTestDrive(); track("connectivity_cta_testdrive_quick", { modelName }); }}
                      >
                        Test These Features
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="video"
                    initial={enter}
                    animate={entered}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full"
                  >
                    {/* Video container with poster overlay until user plays */}
                    <div className="relative w-full overflow-hidden rounded-xl ring-1 ring-black/5">
                      <div className="aspect-video bg-black/80">
                        {!videoPlaying && (
                          <button
                            onClick={() => {
                              setVideoPlaying(true);
                              setVideoReady(true);
                              track("connectivity_video_play", { videoId: YOUTUBE_VIDEO_ID });
                            }}
                            className="absolute inset-0 flex items-center justify-center group"
                            aria-label="Play video"
                          >
                            <div className="absolute inset-0 bg-[url('https://img.youtube.com/vi/cCOszP-VQcc/hqdefault.jpg')] bg-cover bg-center opacity-75 group-hover:opacity-90 transition-opacity" />
                            <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur text-sm font-medium shadow">
                              <Play className="h-4 w-4" />
                              Play video
                            </div>
                          </button>
                        )}
                        {/* Lazy-embed iframe only once user interacts or if already ready */}
                        {(videoReady || videoPlaying) && (
                          <iframe
                            title="Connectivity Video"
                            loading="lazy"
                            src={ytSrc + (videoPlaying ? "&autoplay=1&mute=0" : "")}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className={cn(
                              "w-full h-full",
                              "absolute top-0 left-0"
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Segmented Info Tabs */}
            <div className="rounded-xl border bg-background">
              <div className="flex items-center gap-2 p-2">
                {([
                  { key: "benefits", label: "Benefits" },
                  { key: "tech", label: "Tech" },
                  { key: "plans", label: "Plans" },
                  { key: "faqs", label: "FAQs" },
                ] as { key: TabKey; label: string }[]).map((t) => (
                  <button
                    key={t.key}
                    onClick={() => { setActiveTab(t.key as TabKey); track("connectivity_tab_view", { tab: t.key }); }}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition",
                      activeTab === t.key
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    )}
                    aria-pressed={activeTab === t.key}
                  >
                    {t.label}
                  </button>
                ))}
                <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-4 w-4" aria-hidden />
                  <span>Features vary by grade & year</span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <AnimatePresence mode="wait">
                  {activeTab === "benefits" && (
                    <motion.div key="benefits" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
                      <h3 className="text-xl font-bold">Everyday wins</h3>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {[
                          "Start remotely, step into the perfect climate",
                          "Smarter routes with live traffic & weather",
                          "Hands-free calls and messages on the go",
                          "Cabin Wi-Fi for work, school, and streaming",
                        ].map((b) => (
                          <li key={b} className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" aria-hidden />
                            <span className="text-sm">{b}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="mt-4">
                        <h4 className="font-semibold mb-3">Smart Features & Services</h4>
                        <div className="space-y-3">
                          {smartSystems.map((s, idx) => (
                            <CollapsibleContent
                              key={s.title}
                              title={
                                <div className="flex items-center gap-3">
                                  <s.icon className="h-5 w-5 text-blue-500" aria-hidden />
                                  <span>{s.title}</span>
                                </div>
                              }
                              defaultOpen={idx === 0}
                              className="border"
                            >
                              <div className="grid gap-2 sm:grid-cols-2">
                                {s.features.map((f) => (
                                  <div key={f} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                                    <span>{f}</span>
                                  </div>
                                ))}
                              </div>
                            </CollapsibleContent>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "tech" && (
                    <motion.div key="tech" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
                      <h3 className="text-xl font-bold mb-1">Core Connectivity Features</h3>
                      <p className="text-sm text-muted-foreground mb-4">Specs you can trust, explained simply. Tap to expand details and compatibility.</p>
                      <div className="space-y-4">
                        {connectivityFeatures.map((f, index) => (
                          <motion.div
                            key={f.name}
                            initial={enter}
                            animate={entered}
                            transition={{ delay: index * 0.04, duration: 0.25 }}
                            className="p-4 rounded-xl border hover:border-primary/30 transition-all duration-300"
                          >
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                <f.icon className="h-4 w-4" aria-hidden />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <h4 className="font-semibold leading-tight">{f.name}</h4>
                                  <span className="text-xs text-muted-foreground">{f.proof}</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{f.headline}</p>

                                <CollapsibleContent title="Technical Details" className="border-0 mt-2">
                                  <div className="space-y-3">
                                    <p className="text-sm text-muted-foreground">{f.details}</p>
                                    <div>
                                      <h5 className="font-medium mb-2 text-sm">Compatibility</h5>
                                      <div className="grid gap-1 sm:grid-cols-2">
                                        {f.compatibility.map((item, idx) => (
                                          <div key={idx} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            <span className="text-xs">{item}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CollapsibleContent>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "plans" && (
                    <motion.div key="plans" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
                      <h3 className="text-xl font-bold">Service Plans</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {plans.map((p) => (
                          <div key={p.name} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-blue-900">{p.name}</h4>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">{p.badge}</Badge>
                            </div>
                            <ul className="text-sm text-blue-800 space-y-1">
                              {p.bullets.map((b) => <li key={b}>• {b}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted-foreground mt-2">
                        <Info className="h-4 w-4 mt-0.5" aria-hidden />
                        <p>
                          Wi-Fi hotspot requires an in-car data subscription. Connected features may vary by grade and region.
                          See dealership for the most up-to-date information.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "faqs" && (
                    <motion.div key="faqs" initial={enter} animate={entered} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="space-y-4">
                      <h3 className="text-xl font-bold">FAQs</h3>
                      <div className="space-y-3">
                        {faqs.map((item) => (
                          <CollapsibleContent
                            key={item.q}
                            title={
                              <div className="flex items-center gap-2">
                                <HelpCircle className="h-5 w-5 text-blue-500" aria-hidden />
                                <span>{item.q}</span>
                              </div>
                            }
                            className="border"
                          >
                            <p className="text-sm text-muted-foreground">{item.a}</p>
                          </CollapsibleContent>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Trust & Regional Note */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                <span>You control data sharing anytime in Settings.</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4" aria-hidden />
                <span>Network availability may vary by location and carrier.</span>
              </div>
            </div>
          </div>
        </MobileOptimizedDialogBody>

        {/* SINGLE CTA ONLY */}
        <MobileOptimizedDialogFooter>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:ml-auto">
            <Button variant="outline" onClick={() => { onClose(); track("connectivity_cta_close"); }}>
              Close
            </Button>
            <Button onClick={() => { onBookTestDrive(); track("connectivity_cta_testdrive", { modelName }); }}>
              Book Test Drive
            </Button>
          </div>
        </MobileOptimizedDialogFooter>
      </MobileOptimizedDialogContent>
    </MobileOptimizedDialog>
  );
};

export default ConnectivityModal;
