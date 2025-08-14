import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Download,
  Wrench,
  Sparkles,
  ArrowUpDown,
  Zap,
  Gauge,
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { useToast } from "@/hooks/use-toast";
import GradeComparisonModal from "./GradeComparisonModal";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

/** ---------- Luxury helpers (pure Tailwind, no global css) ---------- */
const ShineSweep = ({ active = true }: { active?: boolean }) => (
  <motion.div
    initial={false}
    animate={active ? { x: ["-150%", "130%"] } : { x: "-150%" }}
    transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
    className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 rotate-12 opacity-25"
    style={{
      background:
        "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.45) 45%, rgba(255,255,255,0) 100%)",
    }}
  />
);

const Aurora = ({ strong = false }: { strong?: boolean }) => (
  <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
    <div
      className={`absolute -top-16 -left-12 h-44 w-72 rounded-full blur-2xl ${
        strong
          ? "bg-gradient-to-br from-rose-400/35 via-fuchsia-400/30 to-indigo-400/25"
          : "bg-gradient-to-br from-rose-400/20 via-fuchsia-400/15 to-indigo-400/10"
      }`}
    />
    <div
      className={`absolute -bottom-20 -right-10 h-56 w-80 rounded-full blur-3xl ${
        strong
          ? "bg-gradient-to-br from-emerald-400/30 via-cyan-400/25 to-blue-400/25"
          : "bg-gradient-to-br from-emerald-400/15 via-cyan-400/15 to-blue-400/15"
      }`}
    />
  </div>
);

/** Metallic gradient frame with glass interior */
const GradientFrame: React.FC<{
  active?: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ active, children, className }) => (
  <div
    className={`relative rounded-2xl p-[1.6px] ${
      active
        ? "bg-[conic-gradient(at_30%_20%,rgba(255,255,255,.7),rgba(247,223,162,.9),rgba(255,255,255,.6),rgba(148,163,184,.7),rgba(255,255,255,.7))]"
        : "bg-[linear-gradient(135deg,rgba(255,255,255,.45),rgba(255,255,255,.1)_35%,rgba(148,163,184,.3)_75%,rgba(255,255,255,.2))]"
    } shadow-[0_16px_48px_-18px_rgba(0,0,0,0.55)] ${className ?? ""}`}
  >
    <div className="rounded-[15px] bg-[rgba(9,10,14,0.55)] ring-1 ring-white/10 supports-[backdrop-filter]:backdrop-blur-xl overflow-hidden">
      {children}
    </div>
  </div>
);

/** ---------- Animations ---------- */
const luxuryVariants = {
  enter: {
    opacity: 0,
    scale: 0.98,
    y: 16,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -14,
    transition: { duration: 0.35, ease: [0.77, 0, 0.175, 1] },
  },
};

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const isMobile = useIsMobile();
  const { deviceCategory } = useDeviceInfo(); // not used visually, but keeping your API
  const { toast } = useToast();

  /** ---------- Data (unchanged) ---------- */
  const engines = [
    {
      name: "2.5L Hybrid",
      power: "218 HP",
      torque: "221 lb-ft",
      efficiency: "25.2 km/L",
      description: "Advanced hybrid powertrain with seamless electric assist",
      brandColor: "from-neutral-900 via-neutral-800 to-neutral-700",
      accentColor: "bg-neutral-900",
      icon: <Zap className="h-5 w-5" />,
      grades: [
        {
          name: "Hybrid SE",
          fullPrice: 94900,
          monthlyEMI: 945,
          description: "Sport-enhanced hybrid driving experience",
          image:
            "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
          features: ["Hybrid Drive Modes", "Sport Seats", "Enhanced Audio", '18" Alloy Wheels'],
          highlight: "Eco Sport",
          specs: {
            engine: "2.5L 4-cylinder Hybrid",
            power: "218 HP (combined)",
            torque: "221 lb-ft",
            transmission: "ECVT",
            acceleration: "7.4 seconds (0-60)",
            fuelEconomy: "25.2 km/L",
            co2Emissions: "102 g/km",
          },
        },
        {
          name: "Hybrid XLE",
          fullPrice: 107900,
          monthlyEMI: 1129,
          description: "Premium hybrid comfort and convenience",
          image:
            "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/28f33a08-ebcf-4ead-bece-c6a87bdf8202/renditions/8e932ad8-f4b4-46af-9963-31e6afe9e75d?binary=true&mformat=true",
          features: ["Leather Seats", "Dual-Zone Climate", "Premium Audio", "Advanced Safety"],
          highlight: "Most Popular",
          specs: {
            engine: "2.5L 4-cylinder Hybrid",
            power: "218 HP (combined)",
            torque: "221 lb-ft",
            transmission: "ECVT",
            acceleration: "7.4 seconds (0-60)",
            fuelEconomy: "25.2 km/L",
            co2Emissions: "102 g/km",
          },
        },
        {
          name: "Hybrid Limited",
          fullPrice: 122900,
          monthlyEMI: 1279,
          description: "Luxury hybrid with premium materials",
          image:
            "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
          features: ["Premium Leather", "Panoramic Sunroof", "JBL Audio", "Full Safety Suite"],
          highlight: "Ultimate Luxury",
          specs: {
            engine: "2.5L 4-cylinder Hybrid",
            power: "218 HP (combined)",
            torque: "221 lb-ft",
            transmission: "ECVT",
            acceleration: "7.4 seconds (0-60)",
            fuelEconomy: "25.2 km/L",
            co2Emissions: "102 g/km",
          },
        },
      ],
    },
    {
      name: "3.5L V6",
      power: "301 HP",
      torque: "267 lb-ft",
      efficiency: "18.4 km/L",
      description: "Powerful V6 engine for enhanced performance",
      brandColor: "from-red-600 via-red-500 to-orange-500",
      accentColor: "bg-red-500",
      icon: <Gauge className="h-5 w-5" />,
      grades: [
        {
          name: "V6 SE",
          fullPrice: 98900,
          monthlyEMI: 989,
          description: "Sport-enhanced V6 driving experience",
          image:
            "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
          features: ["Sport Seats", "Enhanced Audio", "Sport Suspension", '19" Alloy Wheels'],
          highlight: "Sport Package",
          specs: {
            engine: "3.5L V6",
            power: "301 HP",
            torque: "267 lb-ft",
            transmission: "8-speed automatic",
            acceleration: "5.8 seconds (0-60)",
            fuelEconomy: "18.4 km/L",
            co2Emissions: "142 g/km",
          },
        },
        {
          name: "V6 XLE",
          fullPrice: 111900,
          monthlyEMI: 1169,
          description: "Premium V6 comfort and convenience",
          image:
            "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/28f33a08-ebcf-4ead-bece-c6a87bdf8202/renditions/8e932ad8-f4b4-46af-9963-31e6afe9e75d?binary=true&mformat=true",
          features: ["Leather Seats", "Dual-Zone Climate", "Premium Audio", "Advanced Safety"],
          highlight: "Performance Luxury",
          specs: {
            engine: "3.5L V6",
            power: "301 HP",
            torque: "267 lb-ft",
            transmission: "8-speed automatic",
            acceleration: "5.8 seconds (0-60)",
            fuelEconomy: "18.4 km/L",
            co2Emissions: "142 g/km",
          },
        },
        {
          name: "V6 Limited",
          fullPrice: 126900,
          monthlyEMI: 1319,
          description: "Ultimate V6 luxury experience",
          image:
            "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
          features: ["Premium Leather", "Panoramic Sunroof", "JBL Audio", "Full Safety Suite"],
          highlight: "Top Performance",
          specs: {
            engine: "3.5L V6",
            power: "301 HP",
            torque: "267 lb-ft",
            transmission: "8-speed automatic",
            acceleration: "5.8 seconds (0-60)",
            fuelEconomy: "18.4 km/L",
            co2Emissions: "142 g/km",
          },
        },
      ],
    },
  ];

  const currentEngineData = engines.find((e) => e.name === selectedEngine) || engines[0];
  const currentGrades = currentEngineData.grades;
  const currentGrade = currentGrades[currentGradeIndex];

  /** ---------- Handlers ---------- */
  const handleEngineChange = (engineName: string) => {
    setSelectedEngine(engineName);
    setCurrentGradeIndex(0);
    setImageLoading({});
    toast({
      title: "Engine Selected",
      description: `Switched to ${engineName} — Available grades updated`,
    });
  };

  const nextGrade = () => setCurrentGradeIndex((p) => (p + 1) % currentGrades.length);
  const prevGrade = () => setCurrentGradeIndex((p) => (p - 1 + currentGrades.length) % currentGrades.length);

  const selectCurrentGrade = () => {
    setSelectedGrade(currentGrade.name);
    toast({
      title: "Grade Selected",
      description: `${currentGrade.name} has been selected`,
    });
  };

  const handleImageLoad = (idx: number) => setImageLoading((prev) => ({ ...prev, [idx]: false }));
  const handleImageLoadStart = (idx: number) => setImageLoading((prev) => ({ ...prev, [idx]: true }));

  return (
    <section className="py-12 lg:py-20 bg-[radial-gradient(1100px_500px_at_15%_-10%,rgba(239,68,68,.06),transparent_60%),radial-gradient(1100px_500px_at_85%_110%,rgba(239,68,68,.05),transparent_60%)]">
      <div className="toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-300 text-black border-0 mb-4 shadow-lg">
            <Sparkles className="h-4 w-4 mr-2" />
            Luxury Interactive Experience
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight mb-4 lg:mb-6">
            Choose Your Configuration
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Select your preferred engine and explore grades with our interactive carousel.
          </p>
        </motion.div>

        {/* Step 1: Engine Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Step 1: Choose Your Powertrain</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {engines.map((engine, i) => {
              const active = selectedEngine === engine.name;
              return (
                <motion.div
                  key={engine.name}
                  variants={luxuryVariants}
                  initial="enter"
                  whileInView="center"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="h-full"
                >
                  <GradientFrame active={active}>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleEngineChange(engine.name)}
                      className="relative overflow-hidden rounded-[15px]"
                    >
                      <Aurora strong={active} />
                      {/* fine grain texture */}
                      <div
                        className="absolute inset-0 opacity-[.05] pointer-events-none"
                        style={{
                          background:
                            "repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 6px)",
                        }}
                      />
                      <div className="relative z-10 p-5 sm:p-6">
                        {/* top row */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-9 h-9 rounded-lg ${engine.accentColor} text-white grid place-items-center shadow-lg shadow-black/30`}>
                              {engine.icon}
                            </div>
                            {active && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 30 }}>
                                <Check className="h-5 w-5 text-emerald-400" />
                              </motion.div>
                            )}
                          </div>
                          {active && <ShineSweep />}
                        </div>

                        <h4 className={`font-semibold mb-1 ${isMobile ? "text-base" : "text-lg"}`}>{engine.name}</h4>
                        <p className={`text-muted-foreground mb-4 ${isMobile ? "text-xs" : "text-sm"} leading-tight`}>
                          {isMobile ? `${engine.power} • ${engine.efficiency}` : engine.description}
                        </p>

                        {!isMobile && (
                          <div className="grid grid-cols-2 gap-2 text-center">
                            <div className="rounded-lg p-2 bg-white/5 ring-1 ring-white/10">
                              <div className="font-bold text-base text-white drop-shadow">{engine.power}</div>
                              <div className="text-xs text-white/70">Power</div>
                            </div>
                            <div className="rounded-lg p-2 bg-white/5 ring-1 ring-white/10">
                              <div className="font-bold text-base text-white drop-shadow">{engine.efficiency}</div>
                              <div className="text-xs text-white/70">Efficiency</div>
                            </div>
                          </div>
                        )}

                        {active && (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.6 }}
                            className={`absolute bottom-0 left-0 h-[3px] bg-gradient-to-r ${engine.brandColor}`}
                          />
                        )}
                      </div>
                    </div>
                  </GradientFrame>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Step 2: Grade Carousel */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Step 2: Choose Your Grade</h3>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparisonModal(true)}
                className="transition-all duration-300"
                style={{ minHeight: "44px" }}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Compare Grades
              </Button>
            </div>
          </div>

          <div className="relative max-w-3xl mx-auto">
            {/* arrows */}
            <button
              onClick={prevGrade}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/95 backdrop-blur border hover:shadow-xl transition-all -translate-x-4"
              style={{ minHeight: "44px", minWidth: "44px" }}
              aria-label="Previous grade"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextGrade}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/95 backdrop-blur border hover:shadow-xl transition-all translate-x-4"
              style={{ minHeight: "44px", minWidth: "44px" }}
              aria-label="Next grade"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* grade card */}
            <div className="mx-8">
              <AnimatePresence mode="wait">
                <motion.div key={`${selectedEngine}-${currentGradeIndex}`} variants={luxuryVariants} initial="enter" animate="center" exit="exit">
                  <GradientFrame active>
                    <Card className="overflow-hidden bg-transparent border-0 shadow-none">
                      <CardContent className="p-0">
                        {/* header */}
                        <div className="relative p-5 sm:p-6 text-white rounded-t-[15px] overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-r ${currentEngineData.brandColor} opacity-95`} />
                          {/* guilloché */}
                          <div
                            className="absolute inset-0 opacity-25"
                            style={{
                              background:
                                "repeating-linear-gradient(135deg, rgba(255,255,255,0.09) 0, rgba(255,255,255,0.09) 2px, transparent 2px, transparent 6px)",
                            }}
                          />
                          <Aurora strong />
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xl lg:text-2xl font-semibold tracking-wide drop-shadow">{currentGrade.name}</h4>
                              <Badge className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black font-semibold border-yellow-200 shadow">
                                <Sparkles className="h-3 w-3 mr-1" />
                                {currentGrade.highlight}
                              </Badge>
                            </div>
                            <p className="text-white/90 text-sm mb-3">{currentGrade.description}</p>
                            <div className="pt-3 border-t border-white/20">
                              <div className="flex items-end justify-between">
                                <div>
                                  <div className="text-2xl lg:text-3xl font-bold drop-shadow-sm">
                                    AED {currentGrade.fullPrice.toLocaleString()}
                                  </div>
                                  <div className="text-white/80 text-sm">From AED {currentGrade.monthlyEMI}/month</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* image */}
                        <div className="relative overflow-hidden h-64 lg:h-80">
                          <img
                            src={currentGrade.image}
                            alt={`${currentGrade.name} Grade`}
                            className="w-full h-full object-contain sm:object-cover"
                            loading="lazy"
                            onLoadStart={() => handleImageLoadStart(currentGradeIndex)}
                            onLoad={() => handleImageLoad(currentGradeIndex)}
                            onError={() => handleImageLoad(currentGradeIndex)}
                          />
                          {/* glass reflection */}
                          <div className="pointer-events-none absolute inset-0">
                            <div className="absolute inset-0"
                              style={{
                                background:
                                  "linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 40%, rgba(255,255,255,0.0) 60%)",
                                transform: "skewX(-10deg)",
                              }}
                            />
                          </div>
                          <ShineSweep />
                        </div>

                        {/* body */}
                        <div className="p-5 sm:p-6">
                          {/* features */}
                          <div className="mb-6">
                            <h5 className="font-semibold mb-3">Key Features</h5>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                              {currentGrade.features.map((feature: string, idx: number) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <Check className="h-4 w-4 text-emerald-500/90" />
                                  <span className="text-sm text-muted-foreground">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* actions */}
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                            <Button
                              onClick={() => {
                                setSelectedGrade(currentGrade.name);
                                selectCurrentGrade();
                              }}
                              className={`transition-all duration-300 ${
                                selectedGrade === currentGrade.name
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  : `bg-gradient-to-r ${currentEngineData.brandColor}`
                              }`}
                              style={{ minHeight: "44px" }}
                            >
                              {selectedGrade === currentGrade.name ? (
                                <>
                                  <Check className="h-4 w-4 mr-2" />
                                  Selected
                                </>
                              ) : (
                                "Select Grade"
                              )}
                            </Button>

                            <Button variant="outline" style={{ minHeight: "44px" }}>
                              <Download className="h-4 w-4 mr-2" />
                              Download Spec
                            </Button>

                            <Button variant="outline" style={{ minHeight: "44px" }}>
                              <Wrench className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </GradientFrame>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {currentGrades.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentGradeIndex(idx)}
                  className={`rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    idx === currentGradeIndex
                      ? "bg-red-500 w-8 h-2.5 shadow-[0_0_0_3px_rgba(239,68,68,.2)]"
                      : "bg-gray-400/50 w-2.5 h-2.5 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to grade ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* comparison modal */}
      <GradeComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        currentEngineData={currentEngineData}
        onGradeSelect={setSelectedGrade}
        selectedGrade={selectedGrade}
      />
    </section>
  );
};

export default InteractiveSpecsTech;
