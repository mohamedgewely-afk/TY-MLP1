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
  color: string;      // "from-primary to-primary/80"
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

  // Grades
  const getGradesForEngine = (engine: string) =>
    engine === "4.0L" ? ["Limited", "Platinum"] : ["Base", "SE", "XLE", "Limited"];

  // Features
  const techFeatures: TechFeature[] = [
    {
      id: "hybrid-drive",
      title: "Hybrid Synergy Drive",
      description: "World's most advanced hybrid system with instant electric response",
      icon: <Zap className="h-8 w-8" />,
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
      description: "Next-generation safety with AI-powered collision prevention",
      icon: <Shield className="h-8 w-8" />,
      color: "from-green-500 to-emerald-400",
      bgPattern: "bg-gradient-to-br from-green-50 to-emerald-50",
      features: [
        "Pre-Collision System with Pedestrian Detection",
        "Lane Departure Alert with Steering Assist",
        "Dynamic Radar Cruise Control",
        "Road Sign Assist"
      ],
      media: [
        { type: "image", url: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true" }
      ],
      gradeSpecific: {
        Base: ["Standard TSS 3.0", "Basic collision avoidance"],
        SE: ["Enhanced TSS 3.0", "Sport-calibrated safety systems"],
        XLE: ["Advanced TSS 3.0", "Premium safety features"],
        Limited: ["Luxury TSS 3.0", "360-degree safety monitoring"],
        Platinum: ["Ultimate TSS 3.0", "AI-enhanced safety prediction"]
      }
    },
    {
      id: "connected-tech",
      title: "Connected Intelligence",
      description: "Seamless smartphone integration with wireless connectivity",
      icon: <Smartphone className="h-12 w-12" />,
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
      ]
    },
    {
      id: "climate-control",
      title: "Climate Harmony",
      description: "Advanced climate control with air purification",
      icon: <Wind className="h-12 w-12" />,
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
      ]
    }
  ];

  const currentFeature = techFeatures[selectedFeature];
  const currentGradeFeatures =
    currentFeature.gradeSpecific?.[selectedGrade] || currentFeature.features;

  // --- Swipe + Guidance ---
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const SWIPE_THRESHOLD = 40;

  const handlePrev = () =>
    setSelectedFeature((prev) => (prev > 0 ? prev - 1 : techFeatures.length - 1));

  const handleNext = () =>
    setSelectedFeature((prev) => (prev < techFeatures.length - 1 ? prev + 1 : 0));

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    setTouchStartX(e.touches[0].clientX);
    // hide hint on first interaction
    if (showSwipeHint) setShowSwipeHint(false);
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (touchStartX == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) handleNext(); // swipe left
      else handlePrev();        // swipe right
    }
    setTouchStartX(null);
  };

  // Swipe hint (mobile only)
  const [showSwipeHint, setShowSwipeHint] = useState(true);

  useEffect(() => {
    // auto-hide after 4s to avoid nagging
    const t = setTimeout(() => setShowSwipeHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <div className="toyota-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Settings className="h-4 w-4 mr-2" />
            Advanced Technology Suite
          </Badge>
          <h2 className="text-4xl lg:text-6xl xl:text-7xl font-black text-foreground mb-6 lg:mb-8 leading-tight">
            Refined{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              Tech Experience
            </span>
          </h2>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Customize your technology experience by selecting your preferred engine and grade configuration
          </p>
        </motion.div>

        {/* Engine & Grade Selection */}
        <Card className="max-w-4xl mx-auto mb-12 lg:mb-16">
          <CardContent className="p-6 lg:p-8">
            {/* Engine Selection (compact, 2-up on mobile) */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Select Engine</h3>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
                {engines.map((engine) => {
                  const isSelected = selectedEngine === engine.name;
                  return (
                    <motion.button
                      key={engine.name}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedEngine(engine.name);
                        const available = getGradesForEngine(engine.name);
                        if (!available.includes(selectedGrade)) {
                          setSelectedGrade(available[0]);
                        }
                      }}
                      className={[
                        "p-3 md:p-4 rounded-xl text-left transition-all border-2",
                        isSelected
                          ? "bg-primary/10 border-primary shadow-sm"
                          : "bg-card border-border hover:border-primary/50",
                      ].join(" ")}
                      aria-pressed={isSelected}
                    >
                      <div className="text-xs md:text-lg font-bold leading-tight">
                        {engine.name}
                      </div>
                      <div className="text-[11px] md:text-sm text-primary">
                        {engine.power} • {engine.torque}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Grade Selection */}
            <div>
              <h3 className="text-xl font-bold mb-4">Select Grade</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
                {getGradesForEngine(selectedEngine).map((grade) => {
                  const isSelected = selectedGrade === grade;
                  return (
                    <motion.button
                      key={grade}
                      whileTap={{ scale: 0.97 }}
                      className={[
                        "p-3 rounded-xl font-semibold transition-all",
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-lg"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      ].join(" ")}
                      onClick={() => setSelectedGrade(grade)}
                      aria-pressed={isSelected}
                    >
                      {grade}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Features Display */}
        <div
          className="relative pb-10 md:pb-12"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="grid lg:grid-cols-2 gap-8 lg:gap-12"
            >
              {/* Feature Image + desktop arrows inside the image column ONLY */}
              <div className="relative">
                <motion.img
                  src={currentFeature.media[0]?.url}
                  alt={currentFeature.title}
                  className="w-full h-80 lg:h-96 object-cover rounded-2xl"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.color} opacity-20 rounded-2xl`} />

                {/* Desktop arrows (not on mobile), positioned inside image column so they never cover details */}
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

                {/* Mobile swipe hint (auto-hides; hidden on md+) */}
                {showSwipeHint && (
                  <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2">
                    <motion.div
                      className="flex items-center gap-2 rounded-full bg-black/40 text-white px-3 py-1.5 backdrop-blur-sm"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* animated chevrons */}
                      <motion.span
                        aria-hidden
                        className="inline-flex"
                        animate={{ x: [0, 10, 0] }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <ChevronLeft className="w-4 h-4 opacity-80" />
                        <ChevronRight className="w-4 h-4 -ml-1 opacity-80" />
                      </motion.span>
                      <span className="text-xs font-medium">Swipe</span>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Feature Details */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentFeature.color} flex items-center justify-center text-white shadow-xl`}>
                    {currentFeature.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl lg:text-3xl font-bold">{currentFeature.title}</h3>
                    <p className="text-muted-foreground">{currentFeature.description}</p>
                  </div>
                </div>

                {/* Dynamic Features based on grade */}
                <div>
                  <h4 className="font-semibold mb-3">
                    Features for {selectedGrade} Grade with {selectedEngine} Engine
                  </h4>
                  <div className="space-y-2">
                    {currentGradeFeatures.map((feature, idx) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center space-x-3"
                      >
                        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </motion.div>
                    ))}
                    {currentFeature.engineSpecific &&
                      currentFeature.engineSpecific.map((feature, idx) => (
                        <motion.div
                          key={feature}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (currentGradeFeatures.length + idx) * 0.1 }}
                          className="flex items-center space-x-3"
                        >
                          <Zap className="h-4 w-4 text-primary flex-shrink-0" />
                          <span className="text-sm font-medium">{feature}</span>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots (below, safe-area aware) */}
          <div
            className="mt-4 flex justify-center gap-2 px-4"
            style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
            aria-label="Feature navigation"
          >
            {techFeatures.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedFeature(index)}
                aria-current={index === selectedFeature}
                className={[
                  "w-2.5 h-2.5 rounded-full transition-all",
                  index === selectedFeature ? "bg-primary scale-125" : "bg-gray-400 hover:bg-gray-600",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RefinedTechExperience;
