// src/components/vehicle-details/RefinedTechExperience.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleModel } from "@/types/vehicle";
import {
  Zap, Shield, Smartphone, Wind,
  Settings, Check, ChevronLeft, ChevronRight
} from "lucide-react";

interface RefinedTechExperienceProps {
  vehicle: VehicleModel;
}

interface TechFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;      // gradient like "from-primary to-primary/80"
  bgPattern: string;  // "bg-gradient-to-br from-primary/5 to-primary/10"
  features: string[];
  media: { type: string; url: string; thumbnail?: string }[];
  engineSpecific?: string[];
  gradeSpecific?: { [key: string]: string[] };
}

const RefinedTechExperience: React.FC<RefinedTechExperienceProps> = ({ vehicle }) => {
  // State
  const [selectedEngine, setSelectedEngine] = useState<"3.5L" | "4.0L">("3.5L");
  const [selectedGrade, setSelectedGrade] = useState<string>("Base");
  const [selectedFeature, setSelectedFeature] = useState<number>(0);

  // Engines
  const engines = [
    { name: "3.5L", power: "268 HP", torque: "336 Nm" },
    { name: "4.0L", power: "301 HP", torque: "365 Nm" }
  ] as const;

  const getGradesForEngine = (engine: string) =>
    engine === "4.0L" ? ["Limited", "Platinum"] : ["Base", "SE", "XLE", "Limited"];

  // Features
  const techFeatures: TechFeature[] = [
    {
      id: "hybrid-drive",
      title: "Hybrid Synergy Drive",
      description: "Advanced hybrid with instant electric response",
      icon: <Zap className="h-7 w-7 md:h-8 md:w-8" />,
      color: "from-primary to-primary/80",
      bgPattern: "bg-gradient-to-br from-primary/5 to-primary/10",
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
      icon: <Shield className="h-7 w-7 md:h-8 md:w-8" />,
      color: "from-green-500 to-emerald-400",
      bgPattern: "bg-gradient-to-br from-green-50 to-emerald-50",
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
      icon: <Smartphone className="h-9 w-9 md:h-12 md:w-12" />,
      color: "from-primary to-primary/70",
      bgPattern: "bg-gradient-to-br from-primary/5 to-primary/10",
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
      icon: <Wind className="h-9 w-9 md:h-12 md:w-12" />,
      color: "from-cyan-600 to-teal-600",
      bgPattern: "bg-gradient-to-br from-cyan-50 to-teal-50",
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

  // Mobile "show more" for features
  const [showAllMobile, setShowAllMobile] = useState(false);
  const featuresMobile = showAllMobile ? fullList : fullList.slice(0, 2);

  // Swipe + hint
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const SWIPE_THRESHOLD = 40;

  const handlePrev = () =>
    setSelectedFeature((prev) => (prev > 0 ? prev - 1 : techFeatures.length - 1));
  const handleNext = () =>
    setSelectedFeature((prev) => (prev < techFeatures.length - 1 ? prev + 1 : 0));

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    setTouchStartX(e.touches[0].clientX);
    if (showSwipeHint) setShowSwipeHint(false);
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) handleNext();
      else handlePrev();
    }
    setTouchStartX(null);
  };

  useEffect(() => {
    const t = setTimeout(() => setShowSwipeHint(false), 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="py-8 md:py-16 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <div className="toyota-container relative z-10">
        {/* Header (compact on mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-12"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 md:px-6 md:py-3 rounded-full text-[11px] md:text-sm font-medium mb-3 md:mb-6">
            <Settings className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5" />
            Advanced Technology Suite
          </Badge>
          <h2 className="text-2xl md:text-6xl font-black text-foreground mb-2 md:mb-6 leading-tight">
            Refined{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Tech Experience
            </span>
          </h2>
          <p className="text-sm md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-3 md:px-0">
            Customize your tech by selecting engine & grade
          </p>
        </motion.div>

        {/* Engine & Grade Selection (no Card on mobile for tightness) */}
        <div className="md:mb-16">
          {/* Mobile compact */}
          <div className="md:hidden px-3 space-y-5 mb-6">
            {/* Engines */}
            <div>
              <h3 className="text-base font-bold mb-2">Select Engine</h3>
              <div className="grid grid-cols-2 gap-2">
                {engines.map((engine) => {
                  const isSelected = selectedEngine === engine.name;
                  return (
                    <button
                      key={engine.name}
                      onClick={() => {
                        setSelectedEngine(engine.name);
                        const available = getGradesForEngine(engine.name);
                        if (!available.includes(selectedGrade)) setSelectedGrade(available[0]);
                      }}
                      className={[
                        "p-3 rounded-lg text-left border",
                        isSelected ? "bg-primary/10 border-primary" : "bg-card border-border"
                      ].join(" ")}
                    >
                      <div className="text-xs font-bold leading-tight">{engine.name}</div>
                      <div className="text-[11px] text-primary">{engine.power} • {engine.torque}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Grades */}
            <div>
              <h3 className="text-base font-bold mb-2">Select Grade</h3>
              <div className="grid grid-cols-2 gap-2">
                {getGradesForEngine(selectedEngine).map((grade) => {
                  const isSelected = selectedGrade === grade;
                  return (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={[
                        "p-3 rounded-lg font-semibold",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      ].join(" ")}
                    >
                      {grade}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop/Tablet premium Card */}
          <Card className="hidden md:block max-w-4xl mx-auto mb-8 md:mb-16">
            <CardContent className="p-6 lg:p-8">
              <div className="grid grid-cols-2 gap-4">
                {/* Engines */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Select Engine</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {engines.map((engine) => {
                      const isSelected = selectedEngine === engine.name;
                      return (
                        <button
                          key={engine.name}
                          onClick={() => {
                            setSelectedEngine(engine.name);
                            const available = getGradesForEngine(engine.name);
                            if (!available.includes(selectedGrade)) setSelectedGrade(available[0]);
                          }}
                          className={[
                            "p-4 rounded-xl text-left border-2 transition",
                            isSelected ? "bg-primary/10 border-primary shadow-sm" : "bg-card border-border hover:border-primary/50",
                          ].join(" ")}
                        >
                          <div className="text-lg font-bold">{engine.name}</div>
                          <div className="text-sm text-primary">
                            {engine.power} • {engine.torque}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Grades */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Select Grade</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {getGradesForEngine(selectedEngine).map((grade) => {
                      const isSelected = selectedGrade === grade;
                      return (
                        <button
                          key={grade}
                          onClick={() => setSelectedGrade(grade)}
                          className={[
                            "p-4 rounded-xl font-semibold transition",
                            isSelected ? "bg-primary text-primary-foreground shadow-lg" : "bg-muted text-muted-foreground hover:bg-muted/80"
                          ].join(" ")}
                        >
                          {grade}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tech Features Display */}
        <div
          className="relative pb-8 md:pb-12"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -36 }}
              transition={{ duration: 0.45 }}
              className="grid md:grid-cols-2 gap-5 md:gap-12 px-3 md:px-0"
            >
              {/* Image + desktop arrows inside image column */}
              <div className="relative">
                <motion.img
                  src={currentFeature.media[0]?.url}
                  alt={currentFeature.title}
                  className="w-full h-56 md:h-96 object-cover rounded-2xl"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.color} opacity-20 rounded-2xl`} />

                {/* Desktop arrows (no overlay on text column) */}
                <button
                  onClick={handlePrev}
                  className="hidden md:flex items-center justify-center absolute left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 shadow-lg border border-gray-200 hover:bg-white"
                  aria-label="Previous feature"
                >
                  <ChevronLeft className="h-6 w-6 text-gray-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="hidden md:flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-white/90 shadow-lg border border-gray-200 hover:bg-white"
                  aria-label="Next feature"
                >
                  <ChevronRight className="h-6 w-6 text-gray-700" />
                </button>

                {/* Mobile swipe hint (auto-hides) */}
                {showSwipeHint && (
                  <div className="md:hidden absolute bottom-2 left-1/2 -translate-x-1/2">
                    <motion.div
                      className="flex items-center gap-2 rounded-full bg-black/40 text-white px-2.5 py-1 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <motion.span
                        aria-hidden
                        className="inline-flex"
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ChevronLeft className="w-4 h-4 opacity-80" />
                        <ChevronRight className="w-4 h-4 -ml-1 opacity-80" />
                      </motion.span>
                      <span className="text-[11px] font-medium">Swipe</span>
                    </motion.div>
                  </div>
                )}

                {/* Dots — inside image, bottom-center (never covers text) */}
                <div
                  className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 rounded-full bg-white/80 shadow-sm backdrop-blur-sm"
                  style={{ paddingBottom: "max(2px, env(safe-area-inset-bottom))" }}
                  aria-label="Feature navigation"
                >
                  {techFeatures.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedFeature(index)}
                      aria-current={index === selectedFeature}
                      className={[
                        "w-2 h-2 rounded-full transition-transform",
                        index === selectedFeature ? "bg-primary scale-110" : "bg-gray-400 hover:bg-gray-600",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </div>

              {/* Details (compact on mobile) */}
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${currentFeature.color} flex items-center justify-center text-white shadow-xl`}>
                    {currentFeature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-3xl font-bold">{currentFeature.title}</h3>
                    <p className="text-xs md:text-base text-muted-foreground">{currentFeature.description}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm md:text-base font-semibold mb-2 md:mb-3">
                    For {selectedGrade} • {selectedEngine}
                  </h4>
                  <div className="space-y-1.5 md:space-y-2">
                    {featuresMobile.map((feature, idx) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs md:text-sm">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Expand on mobile only */}
                  {fullList.length > 2 && (
                    <div className="mt-2 md:hidden">
                      <button
                        onClick={() => setShowAllMobile((s) => !s)}
                        className="text-[11px] font-medium text-primary underline underline-offset-2"
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
