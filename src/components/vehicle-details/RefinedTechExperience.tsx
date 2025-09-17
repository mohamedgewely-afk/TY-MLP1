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
      color: "from-primary to-primary/80",
      bgPattern: "bg-gradient-to-br from-primary/5 to-primary/10",
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
      color: "from-primary to-primary/70",
      bgPattern: "bg-gradient-to-br from-muted/20 to-muted/30",
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

  // Debug render to verify changes reflect
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("RefinedTechExperience: mounted/updated", {
      selectedEngine,
      selectedGrade,
      selectedFeature: techFeatures[selectedFeature]?.id,
    });
  }, [selectedEngine, selectedGrade, selectedFeature]);

  return (
    <section className="py-12 md:py-24 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Premium background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-muted/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--border)/0.02)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--border)/0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>
      
      <div className="toyota-container relative z-10">
        {/* Elegant header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <Badge className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground px-4 py-2 md:px-8 md:py-3 rounded-full text-sm md:text-base font-medium mb-6 md:mb-8 shadow-lg">
            <Settings className="h-4 w-4 md:h-5 md:w-5 mr-2" />
            Advanced Technology
          </Badge>
          <h2 className="text-3xl md:text-7xl font-bold text-foreground mb-4 md:mb-8 leading-tight">
            Refined{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-primary/70">
              Technology
            </span>
            <br className="hidden md:block" />
            Experience
          </h2>
          <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience intelligent systems that adapt to your preferences
          </p>
        </motion.div>

        {/* Premium selection interface */}
        <div className="md:mb-20">
          {/* Mobile elegant selection */}
          <div className="md:hidden px-4 space-y-6 mb-8">
            {/* Engines */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Select Engine</h3>
              <div className="grid grid-cols-2 gap-3">
                {engines.map((engine) => {
                  const isSelected = selectedEngine === engine.name;
                  return (
                    <motion.button
                      key={engine.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedEngine(engine.name);
                        const available = getGradesForEngine(engine.name);
                        if (!available.includes(selectedGrade)) setSelectedGrade(available[0]);
                      }}
                      className={[
                        "p-4 rounded-2xl text-left border-2 transition-all duration-300",
                        isSelected 
                          ? "bg-primary/10 border-primary shadow-lg shadow-primary/20" 
                          : "bg-card border-border hover:border-primary/30 hover:shadow-md"
                      ].join(" ")}
                    >
                      <div className="text-sm font-bold text-foreground">{engine.name}</div>
                      <div className="text-xs text-primary">{engine.power} • {engine.torque}</div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
            {/* Grades */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Select Grade</h3>
              <div className="grid grid-cols-2 gap-3">
                {getGradesForEngine(selectedEngine).map((grade) => {
                  const isSelected = selectedGrade === grade;
                  return (
                    <motion.button
                      key={grade}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedGrade(grade)}
                      className={[
                        "p-4 rounded-2xl font-semibold transition-all duration-300",
                        isSelected 
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      ].join(" ")}
                    >
                      {grade}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Desktop premium selection */}
          <Card className="hidden md:block max-w-5xl mx-auto mb-12 md:mb-20 shadow-xl border-border/50">
            <CardContent className="p-8 lg:p-12">
              <div className="grid grid-cols-2 gap-8">
                {/* Engines */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">Engine Selection</h3>
                  <div className="space-y-4">
                    {engines.map((engine) => {
                      const isSelected = selectedEngine === engine.name;
                      return (
                        <motion.button
                          key={engine.name}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedEngine(engine.name);
                            const available = getGradesForEngine(engine.name);
                            if (!available.includes(selectedGrade)) setSelectedGrade(available[0]);
                          }}
                          className={[
                            "w-full p-6 rounded-2xl text-left border-2 transition-all duration-300",
                            isSelected 
                              ? "bg-primary/10 border-primary shadow-xl shadow-primary/20" 
                              : "bg-card border-border hover:border-primary/40 hover:shadow-lg",
                          ].join(" ")}
                        >
                          <div className="text-xl font-bold text-foreground">{engine.name}</div>
                          <div className="text-base text-primary mt-1">
                            {engine.power} • {engine.torque}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                {/* Grades */}
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-foreground">Grade Selection</h3>
                  <div className="space-y-4">
                    {getGradesForEngine(selectedEngine).map((grade) => {
                      const isSelected = selectedGrade === grade;
                      return (
                        <motion.button
                          key={grade}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setSelectedGrade(grade)}
                          className={[
                            "w-full p-6 rounded-2xl font-semibold transition-all duration-300",
                            isSelected 
                              ? "bg-primary text-primary-foreground shadow-xl shadow-primary/20" 
                              : "bg-muted text-muted-foreground hover:bg-muted/80 hover:shadow-lg"
                          ].join(" ")}
                        >
                          {grade}
                        </motion.button>
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
