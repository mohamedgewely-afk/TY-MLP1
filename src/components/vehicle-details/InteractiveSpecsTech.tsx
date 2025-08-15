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

const TOYOTA_GRAD = "from-neutral-200 via-neutral-300 to-neutral-400";

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
      brandColor: TOYOTA_GRAD,
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
      brandColor: TOYOTA_GRAD,
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
    <section className="py-8 lg:py-16 bg-neutral-50">
      <div className="toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <Badge className="bg-neutral-100 text-neutral-700 border border-neutral-200 mb-3 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Interactive Experience
          </Badge>
          <h2 className="text-[28px] lg:text-5xl font-black text-neutral-900 mb-2 lg:mb-4">
            Choose Your Configuration
          </h2>
          <p className="text-base lg:text-xl text-neutral-600 max-w-3xl mx-auto">
            Select your preferred engine and explore grades with our interactive carousel.
          </p>
        </motion.div>

        {/* Step 1: Engine Selection */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xl lg:text-2xl font-semibold text-center mb-6 text-neutral-900">
            Step 1: Choose Your Powertrain
          </h3>

          {/* Mobile: two side-by-side, compact; Desktop unchanged */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-6 max-w-5xl mx-auto">
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
                  whileHover={{ y: -2, scale: 1.005 }}
                  className="h-full"
                >
                  <div
                    className={`relative overflow-hidden rounded-xl transition-all duration-400 cursor-pointer group
                      ${active
                        ? "bg-white border-2 border-[#EB0A1E] shadow-[0_6px_20px_rgba(0,0,0,0.05)]"
                        : "bg-white border border-neutral-200 hover:shadow-[0_6px_20px_rgba(0,0,0,0.05)]"
                      }`}
                    onClick={() => handleEngineChange(engine.name)}
                  >
                    {active && <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-TOYOTA_GRAD to-neutral-200" />}

                    <div className="relative z-10 p-3 sm:p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${engine.accentColor} text-white grid place-items-center shadow-sm`}>
                            {engine.icon}
                          </div>
                          {active && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 18 }}>
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-neutral-900 grid place-items-center">
                                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <h4 className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-lg text-neutral-900 truncate">
                        {engine.name}
                      </h4>
                      <p className="mb-0 sm:mb-4 text-xs sm:text-sm leading-relaxed text-neutral-600 line-clamp-2">
                        {isMobile ? `${engine.power} • ${engine.efficiency}` : engine.description}
                      </p>

                      {/* Desktop-only quick stats */}
                      <div className="hidden sm:grid grid-cols-2 gap-3 mb-1">
                        <div className="rounded-lg p-3 bg-neutral-50 border border-neutral-200">
                          <div className="font-semibold text-neutral-900">{engine.power}</div>
                          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Power</div>
                        </div>
                        <div className="rounded-lg p-3 bg-neutral-50 border border-neutral-200">
                          <div className="font-semibold text-neutral-900">{engine.efficiency}</div>
                          <div className="text-[11px] text-neutral-500 uppercase tracking-wider">Efficiency</div>
                        </div>
                      </div>

                      {active && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "100%", opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${engine.brandColor}`}
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Step 2: Grade Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="text-center sm:text-left">
              <h3 className="text-xl lg:text-3xl font-semibold text-neutral-900 mb-1">
                Step 2: Choose Your Grade
              </h3>
              <div className="w-20 lg:w-24 h-[2px] bg-neutral-200 mx-auto sm:mx-0" />
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparisonModal(true)}
                className="border-[#EB0A1E] text-neutral-800 hover:bg-neutral-100"
                style={{ minHeight: "40px" }}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Compare Grades
              </Button>
            </div>
            {/* Mobile compare button */}
            <div className="sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparisonModal(true)}
                className="border-[#EB0A1E] text-neutral-800 hover:bg-neutral-100"
                style={{ minHeight: "36px" }}
              >
                Compare
              </Button>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Navigation Arrows (smaller on mobile) */}
            <button
              onClick={prevGrade}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-4 rounded-full bg-white border border-[#EB0A1E] hover:bg-neutral-100 shadow-sm -translate-x-4 sm:-translate-x-6"
              style={{ minHeight: "36px", minWidth: "36px" }}
              aria-label="Previous grade"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-700" />
            </button>
            <button
              onClick={nextGrade}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 sm:p-4 rounded-full bg-white border border-[#EB0A1E] hover:bg-neutral-100 shadow-sm translate-x-4 sm:translate-x-6"
              style={{ minHeight: "36px", minWidth: "36px" }}
              aria-label="Next grade"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-700" />
            </button>

            {/* Grade Card */}
            <div className="mx-6 sm:mx-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${currentGradeIndex}`}
                  variants={luxuryVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                >
                  <Card className="overflow-hidden bg-white border border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,0.05)] rounded-2xl">
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="relative p-4 sm:p-8 rounded-t-2xl overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${TOYOTA_GRAD} opacity-30`} />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <h4 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-neutral-900">
                              {currentGrade.name}
                            </h4>
                            <Badge className="bg-neutral-100 text-neutral-700 border border-[#EB0A1E] font-medium">
                              {currentGrade.highlight}
                            </Badge>
                          </div>
                          <p className="text-neutral-700 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-none">
                            {currentGrade.description}
                          </p>
                          <div className="pt-4 sm:pt-6 border-t border-neutral-200">
                            <div className="flex items-end justify-between">
                              <div>
                                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 mb-1">
                                  AED {currentGrade.fullPrice.toLocaleString()}
                                </div>
                                <div className="text-neutral-600 text-sm sm:text-base">
                                  From AED {currentGrade.monthlyEMI}/month
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image Section (shorter on mobile) */}
                      <div className="relative overflow-hidden h-48 sm:h-72 lg:h-96 bg-neutral-100">
                        <img
                          src={currentGrade.image}
                          alt={`${currentGrade.name} Grade`}
                          className="w-full h-full object-contain"
                          loading="lazy"
                          onLoadStart={() => handleImageLoadStart(currentGradeIndex)}
                          onLoad={() => handleImageLoad(currentGradeIndex)}
                          onError={() => handleImageLoad(currentGradeIndex)}
                        />
                      </div>

                      {/* Content Body */}
                      <div className="p-4 sm:p-8 bg-white">
                        {/* Features */}
                        <div className="mb-6 sm:mb-8">
                          <h5 className="font-semibold text-base sm:text-lg text-neutral-900 mb-3 sm:mb-4">
                            Key Features
                          </h5>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                            {currentGrade.features.map((feature: string, idx: number) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl bg-neutral-50 border border-neutral-200"
                              >
                                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-neutral-900 grid place-items-center">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm text-neutral-700 font-medium">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
                          <Button
                            onClick={() => {
                              setSelectedGrade(currentGrade.name);
                              selectCurrentGrade();
                            }}
                            className="transition-all duration-300 font-semibold bg-neutral-900 hover:bg-neutral-800 text-white"
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

                          <Button variant="outline" className="border-[#EB0A1E] text-neutral-800 hover:bg-neutral-100" style={{ minHeight: "44px" }}>
                            <Download className="h-4 w-4 mr-2" />
                            Download Spec
                          </Button>

                          <Button variant="outline" className="border-[#EB0A1E] text-neutral-800 hover:bg-neutral-100" style={{ minHeight: "44px" }}>
                            <Wrench className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Indicators (smaller on mobile) */}
            <div className="flex justify-center gap-2 sm:gap-3 mt-6">
              {currentGrades.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentGradeIndex(idx)}
                  className={`rounded-full transition-all duration-400 ${
                    idx === currentGradeIndex ? "bg-neutral-900 w-8 sm:w-12 h-1.5 sm:h-2" : "bg-neutral-300 w-1.5 h-1.5 sm:w-2 sm:h-2 hover:bg-neutral-400"
                  }`}
                  aria-label={`Go to grade ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparison Modal */}
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
