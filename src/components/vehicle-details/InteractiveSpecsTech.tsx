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

const luxuryVariants = {
  enter: { opacity: 0, scale: 0.98, y: 16, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  center: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
  exit:  { opacity: 0, scale: 1.02, y: -16, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

// Subtle neon cyan gradient used for borders/shimmers (keeps strong futurism without heavy color fill)
const NEON = "from-cyan-300/80 via-teal-200/70 to-cyan-300/80";
const GLASS = "bg-white/50 backdrop-blur-xl";
const EDGE = "border border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.06)]";

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const isMobile = useIsMobile();
  const { deviceCategory } = useDeviceInfo();
  const { toast } = useToast();

  const engines = [
    {
      name: "2.5L Hybrid",
      power: "218 HP",
      torque: "221 lb-ft",
      efficiency: "25.2 km/L",
      description: "Advanced hybrid powertrain with seamless electric assist",
      brandColor: NEON,
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
          highlight: "Balanced Choice",
          specs: {},
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
          specs: {},
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
          specs: {},
        },
      ],
    },
    {
      name: "3.5L V6",
      power: "301 HP",
      torque: "267 lb-ft",
      efficiency: "18.4 km/L",
      description: "Powerful V6 engine for enhanced performance",
      brandColor: NEON,
      accentColor: "bg-neutral-900",
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
          highlight: "Performance Pack",
          specs: {},
        },
        {
          name: "V6 XLE",
          fullPrice: 111900,
          monthlyEMI: 1169,
          description: "Premium V6 comfort and convenience",
          image:
            "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/28f33a08-ebcf-4ead-bece-c6a87bdf8202/renditions/8e932ad8-f4b4-46af-9963-31e6afe9e75d?binary=true&mformat=true",
          features: ["Leather Seats", "Dual-Zone Climate", "Premium Audio", "Advanced Safety"],
          highlight: "Refined Comfort",
          specs: {},
        },
        {
          name: "V6 Limited",
          fullPrice: 126900,
          monthlyEMI: 1319,
          description: "Ultimate V6 luxury experience",
          image:
            "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
          features: ["Premium Leather", "Panoramic Sunroof", "JBL Audio", "Full Safety Suite"],
          highlight: "Top Spec",
          specs: {},
        },
      ],
    },
  ];

  const currentEngineData = engines.find((e) => e.name === selectedEngine) || engines[0];
  const currentGrades = currentEngineData.grades;
  const currentGrade = currentGrades[currentGradeIndex];

  // === Handlers (unchanged UX/CX) ===
  const handleEngineChange = (engineName: string) => {
    setSelectedEngine(engineName);
    setCurrentGradeIndex(0);
    setImageLoading({});
    toast({ title: "Engine Selected", description: `Switched to ${engineName} — Available grades updated` });
  };
  const nextGrade = () => setCurrentGradeIndex((p) => (p + 1) % currentGrades.length);
  const prevGrade = () => setCurrentGradeIndex((p) => (p - 1 + currentGrades.length) % currentGrades.length);
  const selectCurrentGrade = () => {
    setSelectedGrade(currentGrade.name);
    toast({ title: "Grade Selected", description: `${currentGrade.name} has been selected` });
  };
  const handleImageLoad = (idx: number) => setImageLoading((prev) => ({ ...prev, [idx]: false }));
  const handleImageLoadStart = (idx: number) => setImageLoading((prev) => ({ ...prev, [idx]: true }));

  return (
    <section className="py-10 lg:py-16 relative overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(56,189,248,0.10),transparent),radial-gradient(1000px_500px_at_80%_110%,rgba(20,184,166,0.10),transparent)]">
      {/* Futuristic grid + particles */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)]; [background-size:36px_36px]" />
        <motion.div
          className="absolute -top-10 -left-10 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, 20, 0], opacity: [0.5, 0.35, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, -15, 0], opacity: [0.5, 0.35, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="toyota-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-12"
        >
          <Badge className="GLASS border border-white/40 shadow-sm bg-white/60 text-neutral-700 mb-3">
            <Sparkles className="h-4 w-4 mr-2 text-cyan-600" />
            Holographic Selector
          </Badge>
          <h2 className="text-[28px] lg:text-5xl font-black text-neutral-900 tracking-tight">
            Choose Your Configuration
          </h2>
          <p className="text-neutral-600 text-base lg:text-lg mt-2">
            Same flow. New feel — a virtual showroom interface.
          </p>
        </motion.div>

        {/* Step 1: Engine Selection (glass tiles with neon edges) */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-xl lg:text-2xl font-semibold text-center mb-6 text-neutral-900">
            Step 1: Choose Your Powertrain
          </h3>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 max-w-5xl mx-auto">
            {engines.map((engine, i) => {
              const active = selectedEngine === engine.name;
              return (
                <motion.div
                  key={engine.name}
                  variants={luxuryVariants}
                  initial="enter"
                  whileInView="center"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -2 }}
                >
                  <div
                    onClick={() => handleEngineChange(engine.name)}
                    className={`relative cursor-pointer rounded-2xl overflow-hidden ${GLASS} ${EDGE}
                      transition-all duration-500 group
                      ${active ? "ring-2 ring-cyan-300/60" : "hover:border-white/60"}
                    `}
                  >
                    {/* Neon edge sweep */}
                    <div className="pointer-events-none absolute inset-0">
                      <motion.div
                        className="absolute -inset-x-20 -top-1/2 h-40 rotate-12 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-60"
                        animate={{ x: [-60, 60] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>

                    {/* Top ridge glow when active */}
                    {active && <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${engine.brandColor}`} />}

                    <div className="relative z-10 p-3 sm:p-5">
                      <div className="flex items-start justify-between mb-2 sm:mb-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl ${engine.accentColor} text-white grid place-items-center`}>
                            {engine.icon}
                          </div>
                          {active && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 18 }}>
                              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-neutral-900 grid place-items-center ring-2 ring-cyan-300/60">
                                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <h4 className="font-semibold text-neutral-900 text-sm sm:text-lg truncate">{engine.name}</h4>
                      <p className="text-neutral-700 text-xs sm:text-sm leading-relaxed line-clamp-2 mt-0.5">
                        {isMobile ? `${engine.power} • ${engine.efficiency}` : engine.description}
                      </p>

                      {/* Desktop quick stats */}
                      <div className="hidden sm:grid grid-cols-2 gap-3 mt-3">
                        <div className="rounded-lg p-3 bg-white/60 border border-white/50">
                          <div className="font-semibold text-neutral-900">{engine.power}</div>
                          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Power</div>
                        </div>
                        <div className="rounded-lg p-3 bg-white/60 border border-white/50">
                          <div className="font-semibold text-neutral-900">{engine.efficiency}</div>
                          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Efficiency</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Step 2: Grade Carousel (holographic HUD card) */}
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center sm:text-left">
              <h3 className="text-xl lg:text-3xl font-semibold text-neutral-900 mb-1">Step 2: Choose Your Grade</h3>
              <div className="w-20 lg:w-24 h-[2px] bg-gradient-to-r from-neutral-200 via-teal-200/60 to-neutral-200 mx-auto sm:mx-0" />
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparisonModal(true)}
                className="border-white/50 bg-white/70 hover:bg-white text-neutral-800"
                style={{ minHeight: "40px" }}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Compare Grades
              </Button>
            </div>
            <div className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparisonModal(true)}
                className="border-white/50 bg-white/70 hover:bg-white text-neutral-800"
                style={{ minHeight: "36px" }}
              >
                Compare
              </Button>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Arrows */}
            <button
              onClick={prevGrade}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-4 rounded-full bg-white/80 border border-white/60 hover:bg-white shadow-sm -translate-x-4 sm:-translate-x-6"
              style={{ minHeight: "36px", minWidth: "36px" }}
              aria-label="Previous grade"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-700" />
            </button>
            <button
              onClick={nextGrade}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-4 rounded-full bg-white/80 border border-white/60 hover:bg-white shadow-sm translate-x-4 sm:translate-x-6"
              style={{ minHeight: "36px", minWidth: "36px" }}
              aria-label="Next grade"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-700" />
            </button>

            {/* Card */}
            <div className="mx-6 sm:mx-12">
              <AnimatePresence mode="wait">
                <motion.div key={`${selectedEngine}-${currentGradeIndex}`} variants={luxuryVariants} initial="enter" animate="center" exit="exit">
                  <Card className="overflow-hidden bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)] rounded-2xl relative">
                    <CardContent className="p-0">
                      {/* HUD header with animated grid */}
                      <div className="relative p-4 sm:p-8 rounded-t-2xl">
                        {/* Soft neon wash */}
                        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${NEON} opacity-20`} />
                        {/* Grid */}
                        <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(0,0,0,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.4)_1px,transparent_1px)]; [background-size:22px_22px]" />
                        {/* Light sweep */}
                        <motion.div
                          className="pointer-events-none absolute -inset-x-1/2 -top-10 h-16 rotate-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                          animate={{ x: ["-25%", "25%"] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        />

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h4 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900">
                              {currentGrade.name}
                            </h4>
                            <Badge className="bg-white/80 text-neutral-800 border border-white shadow-sm">
                              {currentGrade.highlight}
                            </Badge>
                          </div>
                          <p className="text-neutral-700 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {currentGrade.description}
                          </p>
                          <div className="pt-4 sm:pt-6 border-t border-white/70">
                            <div className="flex items-end justify-between">
                              <div>
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 mb-1">
                                  AED {currentGrade.fullPrice.toLocaleString()}
                                </div>
                                <div className="text-neutral-600 text-sm sm:text-base">From AED {currentGrade.monthlyEMI}/month</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image (shorter on mobile) */}
                      <div className="relative overflow-hidden h-48 sm:h-72 lg:h-96 bg-white">
                        <img
                          src={currentGrade.image}
                          alt={`${currentGrade.name} Grade`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onLoadStart={() => handleImageLoadStart(currentGradeIndex)}
                          onLoad={() => handleImageLoad(currentGradeIndex)}
                          onError={() => handleImageLoad(currentGradeIndex)}
                        />
                        {/* Holo shine */}
                        <motion.div
                          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 rotate-12 opacity-20"
                          style={{ background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 40%, rgba(255,255,255,0) 100%)" }}
                          animate={{ x: ["-150%", "130%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>

                      {/* Features & Actions */}
                      <div className="p-4 sm:p-8 bg-white/80">
                        <div className="mb-6 sm:mb-8">
                          <h5 className="font-semibold text-base sm:text-lg text-neutral-900 mb-3 sm:mb-4">
                            Key Features
                          </h5>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                            {currentGrade.features.map((feature: string, idx: number) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white border border-white/70"
                              >
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-900 grid place-items-center ring-2 ring-cyan-200/60">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm text-neutral-700 font-medium">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                          <Button
                            onClick={() => {
                              setSelectedGrade(currentGrade.name);
                              selectCurrentGrade();
                            }}
                            className="transition-all duration-300 font-semibold bg-neutral-900 hover:bg-neutral-800 text-white ring-2 ring-cyan-200/50"
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
                          <Button variant="outline" className="border-neutral-300 text-neutral-800 hover:bg-neutral-100" style={{ minHeight: "44px" }}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Spec
                          </Button>
                          <Button variant="outline" className="border-neutral-300 text-neutral-800 hover:bg-neutral-100" style={{ minHeight: "44px" }}>
                            <Wrench className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>

                    {/* Holographic frame corners */}
                    <div className="pointer-events-none absolute inset-0">
                      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-300/60 rounded-tl-md" />
                      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-300/60 rounded-tr-md" />
                      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-300/60 rounded-bl-md" />
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-300/60 rounded-br-md" />
                    </div>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-6">
              {currentGrades.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentGradeIndex(idx)}
                  className={`rounded-full transition-all duration-400 ${
                    idx === currentGradeIndex
                      ? "bg-neutral-900 w-8 sm:w-12 h-1.5 sm:h-2"
                      : "bg-neutral-300 w-1.5 h-1.5 sm:w-2 sm:h-2 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to grade ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal (unchanged) */}
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
