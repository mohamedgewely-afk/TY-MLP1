// src/components/vehicle-details/RefinedTechExperience.tsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { VehicleModel } from "@/types/vehicle";
import {
  Zap, Shield, Smartphone, Wind,
  Settings, Check, ChevronLeft, ChevronRight, X, Search
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   TECH ZEN TOKENS
────────────────────────────────────────────────────────── */
const ZEN = {
  radius: "rounded-[20px]",
  hairline: "border border-black/10",
  focus: "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EB0A1E] focus-visible:ring-offset-2",
  mediaShadow: "shadow-[0_16px_40px_rgba(0,0,0,0.08)]",
  red: "#EB0A1E",
};

interface RefinedTechExperienceProps {
  vehicle: VehicleModel;
}
interface TechFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;      // kept for backwards-compat; not used as gradients in Zen
  bgPattern: string;  // kept for compat
  features: string[];
  media: { type: "image" | "video"; url: string; thumbnail?: string }[];
  engineSpecific?: string[];
  gradeSpecific?: { [key: string]: string[] };
}

const RefinedTechExperience: React.FC<RefinedTechExperienceProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState<"3.5L" | "4.0L">("3.5L");
  const [selectedGrade, setSelectedGrade] = useState<string>("Base");
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  // Engines
  const engines = [
    { name: "3.5L", power: "268 HP", torque: "336 Nm" },
    { name: "4.0L", power: "301 HP", torque: "365 Nm" }
  ] as const;

  const getGradesForEngine = (engine: string) =>
    engine === "4.0L" ? ["Limited", "Platinum", "TRD", "GR-S", "Signature", "Elite", "Black", "Ultimate"] // example long list
                      : ["Base", "SE", "XLE", "Limited", "Sport", "Premium", "Executive"];

  const allGrades = useMemo(() => getGradesForEngine(selectedEngine), [selectedEngine]);

  // Feature content (kept from your data structure; visuals are Zen)
  const techFeatures: TechFeature[] = [
    {
      id: "hybrid-drive",
      title: "Hybrid Synergy Drive",
      description: "Advanced hybrid with instant electric response",
      icon: <Zap className="h-6 w-6" />,
      color: "from-primary to-primary/80",
      bgPattern: "",
      features: [
        "Seamless electric-gasoline transition",
        "Regenerative braking system",
        "EV mode for silent operation",
        "Hybrid battery monitoring"
      ],
      media: [
        { type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true" }
      ],
      engineSpecific:
        selectedEngine === "4.0L"
          ? ["Enhanced power delivery", "Sport-tuned hybrid system"]
          : ["Optimized efficiency", "Eco-focused hybrid tuning"],
      gradeSpecific: {
        Base: ["Standard hybrid system", "Basic regenerative braking"],
        SE: ["Sport-tuned hybrid", "Enhanced regenerative braking"],
        XLE: ["Premium hybrid system", "Advanced energy management"],
        Limited: ["Luxury hybrid experience", "Intelligent power distribution"],
        Platinum: ["Ultimate hybrid performance", "AI-powered energy optimization"]
      }
    },
    {
      id: "safety-sense",
      title: "Toyota Safety Sense 3.0",
      description: "AI-powered collision prevention",
      icon: <Shield className="h-6 w-6" />,
      color: "",
      bgPattern: "",
      features: [
        "Pre-Collision with Pedestrian Detection",
        "Lane Departure Alert with Steering Assist",
        "Dynamic Radar Cruise Control",
        "Road Sign Assist"
      ],
      media: [
        { type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true" }
      ],
    },
    {
      id: "connected-tech",
      title: "Connected Intelligence",
      description: "Wireless CarPlay/Android Auto + voice",
      icon: <Smartphone className="h-6 w-6" />,
      color: "",
      bgPattern: "",
      features: [
        "Wireless Apple CarPlay & Android Auto",
        "Premium JBL sound system",
        "Voice recognition",
        "Remote vehicle start"
      ],
      media: [
        { type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true" }
      ],
    },
    {
      id: "climate-control",
      title: "Climate Harmony",
      description: "Air purification & eco-optimized cooling",
      icon: <Wind className="h-6 w-6" />,
      color: "",
      bgPattern: "",
      features: [
        "Dual-zone automatic climate control",
        "HEPA air filtration",
        "UV sterilization",
        "Eco-mode optimization"
      ],
      media: [
        { type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true" }
      ],
    }
  ];

  const currentFeature = techFeatures[selectedFeature];
  const fullList = currentFeature.gradeSpecific?.[selectedGrade] || currentFeature.features;

  // Mobile list collapse
  const [showAllMobile, setShowAllMobile] = useState(false);
  const featuresMobile = showAllMobile ? fullList : fullList.slice(0, 2);

  // Carousel swipe
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const SWIPE_THRESHOLD = 40;
  const handlePrev = useCallback(() => {
    setSelectedFeature((p) => (p > 0 ? p - 1 : techFeatures.length - 1));
  }, []);
  const handleNext = useCallback(() => {
    setSelectedFeature((p) => (p < techFeatures.length - 1 ? p + 1 : 0));
  }, []);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => setTouchStartX(e.touches[0].clientX);
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) dx < 0 ? handleNext() : handlePrev();
    setTouchStartX(null);
  };

  /* ─────────────────────────────────────────────────────────
     GRADE OVERFLOW UX (Mobile sheet + Desktop popover)
  ────────────────────────────────────────────────────────── */
  const [gradeQuery, setGradeQuery] = useState("");
  const [showGradeSheet, setShowGradeSheet] = useState(false);   // mobile bottom sheet
  const [showGradePopover, setShowGradePopover] = useState(false); // desktop popover
  const SHEET_VISIBLE_MOBILE = 4; // show first 4 chips on mobile, rest in sheet
  const GRID_VISIBLE_DESKTOP = 6; // show first 6 chips on desktop, rest in popover

  const filteredGrades = useMemo(() => {
    const q = gradeQuery.trim().toLowerCase();
    return q ? allGrades.filter(g => g.toLowerCase().includes(q)) : allGrades;
  }, [allGrades, gradeQuery]);

  const handleSelectGrade = (g: string) => {
    setSelectedGrade(g);
    setShowGradeSheet(false);
    setShowGradePopover(false);
  };

  /* ─────────────────────────────────────────────────────────
     MEDIA
  ────────────────────────────────────────────────────────── */
  const Media = ({ m, alt }: { m: TechFeature["media"][number]; alt: string }) => {
    if (!m) return <div className="w-full h-full bg-black/5" />;
    if (m.type === "video") {
      return (
        <video
          className={`w-full h-full object-cover ${ZEN.radius}`}
          src={m.url}
          poster={m.thumbnail}
          playsInline
          muted
          autoPlay
          loop
        />
      );
    }
    return (
      <img
        className={`w-full h-full object-cover ${ZEN.radius}`}
        src={m.url}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
    );
  };

  return (
    <section className="py-12 md:py-24 bg-white relative overflow-hidden">
      <div className="toyota-container relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <Badge className="px-4 py-1.5 md:px-5 md:py-2 rounded-full text-xs md:text-sm bg-black text-white">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Technology
          </Badge>
          <h2 className="mt-5 text-[28px] md:text-[48px] font-semibold tracking-[-0.02em] text-[#0B0C0E]">
            Refined Technology <span className="align-super text-[#EB0A1E]">•</span>
          </h2>
          <p className="mt-3 text-[14px] md:text-[18px] leading-relaxed text-black/60 max-w-2xl mx-auto">
            Intelligent systems that adapt to your preferences—beautifully integrated.
          </p>
        </div>

        {/* Mobile selectors: horizontal chips + overflow sheet */}
        <div className="md:hidden space-y-6 px-3 mb-8">
          {/* Engine chips */}
          <div>
            <div className="text-[12px] font-semibold mb-2 text-black/80">Engine</div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 py-1">
              {engines.map((e) => {
                const is = selectedEngine === e.name;
                return (
                  <button
                    key={e.name}
                    onClick={() => {
                      setSelectedEngine(e.name);
                      if (!getGradesForEngine(e.name).includes(selectedGrade)) {
                        setSelectedGrade(getGradesForEngine(e.name)[0]);
                      }
                    }}
                    className={[
                      "shrink-0 px-4 py-2 text-[13px] rounded-full transition",
                      ZEN.focus,
                      is
                        ? "bg-[#0B0C0E] text-white"
                        : "bg-white " + ZEN.hairline + " hover:border-black/20"
                    ].join(" ")}
                    aria-current={is}
                  >
                    {e.name} • <span className="opacity-80">{e.power}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grade chips w/ overflow */}
          <div>
            <div className="text-[12px] font-semibold mb-2 text-black/80">Grade</div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 px-3 py-1">
              {allGrades.slice(0, SHEET_VISIBLE_MOBILE).map((g) => {
                const is = selectedGrade === g;
                return (
                  <button
                    key={g}
                    onClick={() => handleSelectGrade(g)}
                    className={[
                      "shrink-0 px-4 py-2 text-[13px] rounded-full transition",
                      ZEN.focus,
                      is
                        ? "bg-[#0B0C0E] text-white"
                        : "bg-white " + ZEN.hairline + " hover:border-black/20"
                    ].join(" ")}
                    aria-current={is}
                  >
                    {g}
                  </button>
                );
              })}
              {allGrades.length > SHEET_VISIBLE_MOBILE && (
                <button
                  onClick={() => setShowGradeSheet(true)}
                  className={[
                    "shrink-0 px-4 py-2 text-[13px] rounded-full transition",
                    ZEN.focus,
                    "bg-white " + ZEN.hairline + " hover:border-black/20"
                  ].join(" ")}
                  aria-haspopup="dialog"
                >
                  +{allGrades.length - SHEET_VISIBLE_MOBILE} more
                </button>
              )}
            </div>

            {/* Bottom sheet (mobile) */}
            <AnimatePresence>
              {showGradeSheet && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-black/40"
                  onClick={() => setShowGradeSheet(false)}
                >
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "tween", duration: 0.22 }}
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 pt-3"
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Select Grade</div>
                      <button className={ZEN.focus} onClick={() => setShowGradeSheet(false)}>
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <div className={"relative mb-3 " + ZEN.hairline + " " + ZEN.radius}>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                      <input
                        type="text"
                        placeholder="Search grade"
                        value={gradeQuery}
                        onChange={(e) => setGradeQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-transparent outline-none"
                      />
                    </div>
                    <div className="max-h-[50vh] overflow-y-auto grid grid-cols-2 gap-2">
                      {filteredGrades.map((g) => {
                        const is = selectedGrade === g;
                        return (
                          <button
                            key={g}
                            onClick={() => handleSelectGrade(g)}
                            className={[
                              "px-3 py-2 text-[13px] rounded-full text-left",
                              ZEN.hairline,
                              ZEN.focus,
                              is ? "bg-[#0B0C0E] text-white border-transparent" : "bg-white"
                            ].join(" ")}
                            aria-current={is}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Desktop selectors: segmented + popover overflow */}
        <Card className={`hidden md:block mx-auto mb-12 md:mb-16 max-w-5xl bg-white ${ZEN.hairline} ${ZEN.radius}`}>
          <CardContent className="p-8 lg:p-10">
            <div className="grid grid-cols-2 gap-8">
              {/* Engine segmented */}
              <div>
                <h3 className="text-[15px] font-semibold mb-3 text-black/80">Engine</h3>
                <div className={"inline-flex " + ZEN.hairline + " " + ZEN.radius + " overflow-hidden"}>
                  {engines.map((e, i) => {
                    const is = selectedEngine === e.name;
                    return (
                      <button
                        key={e.name}
                        onClick={() => {
                          setSelectedEngine(e.name);
                          if (!getGradesForEngine(e.name).includes(selectedGrade)) {
                            setSelectedGrade(getGradesForEngine(e.name)[0]);
                          }
                        }}
                        className={[
                          "px-5 py-2.5 text-sm font-medium transition",
                          ZEN.focus,
                          is ? "bg-[#0B0C0E] text-white" : "bg-white hover:bg-black/[.04]"
                        ].join(" ")}
                        aria-current={is}
                      >
                        {e.name} <span className="opacity-60">• {e.power}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grades wrap + popover */}
              <div className="relative">
                <h3 className="text-[15px] font-semibold mb-3 text-black/80">Grade</h3>
                <div className="flex flex-wrap gap-2">
                  {allGrades.slice(0, GRID_VISIBLE_DESKTOP).map((g) => {
                    const is = selectedGrade === g;
                    return (
                      <button
                        key={g}
                        onClick={() => handleSelectGrade(g)}
                        className={[
                          "px-4 py-2 text-[13px] rounded-full transition",
                          ZEN.focus,
                          is ? "bg-[#0B0C0E] text-white"
                             : "bg-white " + ZEN.hairline + " hover:border-black/20"
                        ].join(" ")}
                        aria-current={is}
                      >
                        {g}
                      </button>
                    );
                  })}
                  {allGrades.length > GRID_VISIBLE_DESKTOP && (
                    <button
                      onClick={() => setShowGradePopover((s) => !s)}
                      className={[
                        "px-4 py-2 text-[13px] rounded-full transition",
                        ZEN.focus,
                        "bg-white " + ZEN.hairline + " hover:border-black/20"
                      ].join(" ")}
                      aria-haspopup="menu"
                      aria-expanded={showGradePopover}
                    >
                      +{allGrades.length - GRID_VISIBLE_DESKTOP} more
                    </button>
                  )}
                </div>

                {/* Popover */}
                <AnimatePresence>
                  {showGradePopover && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className={"absolute z-50 mt-2 right-0 w-[420px] bg-white p-3 " + ZEN.radius + " " + ZEN.hairline + " shadow-[0_12px_40px_rgba(0,0,0,0.12)]"}
                      role="menu"
                    >
                      <div className={"relative mb-2 " + ZEN.hairline + " " + ZEN.radius}>
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                        <input
                          type="text"
                          placeholder="Search grade"
                          value={gradeQuery}
                          onChange={(e) => setGradeQuery(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 text-sm bg-transparent outline-none"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-[320px] overflow-y-auto grid grid-cols-3 gap-2">
                        {filteredGrades.map((g) => {
                          const is = selectedGrade === g;
                          return (
                            <button
                              key={g}
                              onClick={() => handleSelectGrade(g)}
                              className={[
                                "px-3 py-2 text-[13px] rounded-full text-left",
                                ZEN.hairline,
                                ZEN.focus,
                                is ? "bg-[#0B0C0E] text-white border-transparent" : "bg-white"
                              ].join(" ")}
                              role="menuitem"
                              aria-current={is}
                            >
                              {g}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature area */}
        <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedFeature}-${selectedEngine}-${selectedGrade}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="grid md:grid-cols-2 gap-6 md:gap-10 px-3 md:px-0"
              aria-live="polite"
            >
              {/* Media (no gradients, just clarity) */}
              <div className={`relative ${ZEN.radius} ${ZEN.mediaShadow}`}>
                <div className={"aspect-[16/9] w-full overflow-hidden bg-black/5 " + ZEN.hairline + " " + ZEN.radius}>
                  <Media m={currentFeature.media[0]} alt={currentFeature.title} />
                </div>

                {/* Arrows (quiet) */}
                <button
                  onClick={handlePrev}
                  className={`hidden md:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/95 ${ZEN.hairline} hover:bg-white transition ${ZEN.focus}`}
                  aria-label="Previous feature"
                >
                  <ChevronLeft className="h-6 w-6 text-black/70" />
                </button>
                <button
                  onClick={handleNext}
                  className={`hidden md:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/95 ${ZEN.hairline} hover:bg-white transition ${ZEN.focus}`}
                  aria-label="Next feature"
                >
                  <ChevronRight className="h-6 w-6 text-black/70" />
                </button>

                {/* Step bar (replaces dots) */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[65%] md:w-[60%]">
                  <div className="grid grid-cols-12 gap-[3px]">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const pct = (selectedFeature / Math.max(techFeatures.length - 1, 1)) * 11;
                      const active = i <= Math.round(pct);
                      return (
                        <div
                          key={i}
                          className={["h-1.5 rounded-full transition-all", active ? "bg-black" : "bg-black/20"].join(" ")}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${ZEN.radius} flex items-center justify-center bg-black/5 ${ZEN.hairline}`}>
                    {/* Icons toned down */}
                    <span className="text-black/70">{currentFeature.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-[18px] md:text-[28px] font-semibold tracking-[-0.01em]">{currentFeature.title}</h3>
                    <p className="text-[12px] md:text-[15px] text-black/60">{currentFeature.description}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[12px] md:text-[13px] font-semibold mb-2 text-black/70">
                    For {selectedGrade} • {selectedEngine}
                  </h4>
                  <ul className="space-y-1.5 md:space-y-2">
                    {(showAllMobile ? fullList : fullList.slice(0, 2)).map((f, i) => (
                      <motion.li
                        key={f}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="text-[12.5px] md:text-[14px] text-black/80">{f}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* Expand (mobile only) */}
                  {fullList.length > 2 && (
                    <div className="mt-2 md:hidden">
                      <button
                        onClick={() => setShowAllMobile((s) => !s)}
                        className={`text-[11px] font-medium underline underline-offset-2 ${ZEN.focus} text-[#EB0A1E]`}
                      >
                        {showAllMobile ? "Show less" : `Show ${fullList.length - 2} more`}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default RefinedTechExperience;
