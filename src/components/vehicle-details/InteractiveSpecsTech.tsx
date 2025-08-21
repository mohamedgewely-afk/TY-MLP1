// InteractiveSpecsTechFutura.tsx
// Premium-Luxury + A11y pass applied.
// - Mobile-first 2-up engines, compact grade cards, progressive disclosure
// - Full accessibility: roles, labels, keyboard nav, focus rings, live regions
// - Motion respects prefers-reduced-motion
// - Toyota luxury UI: glass surfaces, metallic gradients, cinematic overlays

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Star,
  Crown,
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useSwipeable } from "@/hooks/use-swipeable";
import GradeComparisonModal from "./GradeComparisonModal";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
  onCarBuilder?: (gradeInfo?: { engine: string; grade: string }) => void;
  onBookTestDrive?: (gradeInfo?: { engine: string; grade: string }) => void;
}

const TOYOTA_RED = "#CC0000";

// Lighter, motion-safe variants
const variants = (reduced: boolean) => ({
  enter: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, x: 60, transition: { duration: 0.35 } },
  center: reduced ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0, transition: { duration: 0.45 } },
  exit: reduced ? { opacity: 0 } : { opacity: 0, scale: 0.98, x: -60, transition: { duration: 0.3 } },
});

const InteractiveSpecsTechFutura: React.FC<InteractiveSpecsTechProps> = ({
  vehicle,
  onCarBuilder,
  onBookTestDrive,
}) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Locale-safe number format (UAE English fallback)
  const fmt = useMemo(() => new Intl.NumberFormat(typeof navigator !== 'undefined' ? navigator.language : 'en-AE'), []);

  // Respect user motion preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(!!mq.matches);
    apply();
    mq.addEventListener?.('change', apply);
    return () => mq.removeEventListener?.('change', apply);
  }, []);

  // Data (unchanged from your structure)
  const engines = [
    {
      name: "2.5L Hybrid",
      power: "218 HP",
      torque: "221 lb-ft",
      efficiency: "25.2 km/L",
      description: "Advanced hybrid powertrain with seamless electric assist",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
          <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor"/>
        </svg>
      ),
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
            "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/28f33a08-ebcf-4ead-bece-c6a87bdf8202/renditions/8e932ad8-f4b-4"+
            "6af-9963-31e6afe9e75d?binary=true&mformat=true",
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
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none"/>
          <path d="M6 12h12M12 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
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
    setExpandedMobile(false);
    toast({ title: "Engine Selected", description: `Switched to ${engineName}` });
  };

  const nextGrade = () => setCurrentGradeIndex((p) => (p + 1) % currentGrades.length);
  const prevGrade = () => setCurrentGradeIndex((p) => (p - 1 + currentGrades.length) % currentGrades.length);

  const handleConfigureClick = () => onCarBuilder?.({ engine: selectedEngine, grade: currentGrade.name });
  const handleTestDriveClick = () => onBookTestDrive?.({ engine: selectedEngine, grade: currentGrade.name });

  // Swipe on mobile (vertical scroll preserved)
  const swipeRef = useSwipeable<HTMLDivElement>({ onSwipeLeft: nextGrade, onSwipeRight: prevGrade, threshold: 40, preventDefaultTouchmoveEvent: false });

  return (
    <section className="py-10 lg:py-16 bg-gradient-to-b from-gray-50 to-white">
      {/* Subtle background accents */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 right-[-10%] w-[420px] h-[420px] rounded-full opacity-20 blur-3xl"
             style={{ background: `radial-gradient(closest-side, ${TOYOTA_RED}, transparent 70%)` }} />
      </div>

      <div className="toyota-container">
        {/* Header */}
        <motion.div initial={reduceMotion?{opacity:1}:{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 lg:mb-12">
          <Badge className="mb-3 border-0 text-white shadow-lg" style={{ background: `linear-gradient(90deg, ${TOYOTA_RED}, ${TOYOTA_RED})` }}>
            <Sparkles className="h-4 w-4 mr-2" /> Interactive Experience
          </Badge>
          <h2 className="text-[28px] sm:text-[32px] lg:text-6xl font-black text-gray-900 mb-2 lg:mb-4">Choose Your Configuration</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">Select your engine and explore trims in a compact, mobile-perfect layout.</p>
        </motion.div>

        {/* Live region for SR updates */}
        <div aria-live="polite" className="sr-only">
          {selectedGrade && `Selected grade ${selectedGrade}`}
        </div>

        {/* Step 1: Engine Selection — radiogroup, 2-up on mobile */}
        <motion.div initial={reduceMotion?{opacity:1}:{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 lg:mb-16">
          <h3 id="engine-step" className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-5 lg:mb-8 text-gray-900">Step 1: Choose Your Powertrain</h3>

          <div role="radiogroup" aria-labelledby="engine-step" className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 max-w-md sm:max-w-3xl md:max-w-4xl mx-auto">
            {engines.map((engine, idx) => {
              const active = selectedEngine === engine.name;
              return (
                <button
                  key={engine.name}
                  role="radio"
                  aria-checked={active}
                  aria-label={`${engine.name}. ${engine.description}`}
                  tabIndex={active ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); const n = (idx + 1) % engines.length; handleEngineChange(engines[n].name); }
                    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); const p = (idx - 1 + engines.length) % engines.length; handleEngineChange(engines[p].name); }
                  }}
                  onClick={() => handleEngineChange(engine.name)}
                  className={[
                    "relative rounded-xl p-3 sm:p-4 text-left bg-white border transition-all select-none",
                    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000] focus-visible:ring-offset-white",
                    active ? "border-[#CC0000] shadow-md" : "border-gray-200 hover:border-gray-300",
                  ].join(" ")}
                >
                  {active && <span className="absolute inset-x-0 -top-px h-0.5" style={{ background: TOYOTA_RED }} />}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg grid place-items-center text-white shadow-md"
                         style={{ background: `linear-gradient(135deg, ${TOYOTA_RED}, ${TOYOTA_RED})` }}>
                      {engine.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm sm:text-base text-gray-900 truncate">{engine.name}</div>
                      <div className="text-[11px] sm:text-xs text-gray-500 truncate">{engine.description}</div>
                    </div>
                    {active && (
                      <div className="w-6 h-6 rounded-full grid place-items-center text-white shadow" style={{ background: `linear-gradient(135deg, #EB0A1E, #CC0000)` }}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] sm:text-xs">
                    <div className="rounded-lg p-2 bg-white/60 backdrop-blur border border-gray-100">
                      <div className="font-semibold text-gray-900">{engine.power}</div>
                      <div className="text-gray-500 uppercase tracking-wide">Power</div>
                    </div>
                    <div className="rounded-lg p-2 bg-white/60 backdrop-blur border border-gray-100">
                      <div className="font-semibold text-gray-900">{engine.efficiency}</div>
                      <div className="text-gray-500 uppercase tracking-wide">Efficiency</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Step 2: Grade Carousel — accessible carousel + premium UI */}
        <motion.div initial={reduceMotion?{opacity:1}:{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 lg:mb-10">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="text-center sm:text-left">
              <h3 id="grade-step" className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-900">Step 2: Choose Your Grade</h3>
              <div className="w-20 sm:w-24 lg:w-32 h-1 rounded-full mt-2"
                   style={{ background: `linear-gradient(90deg, #EB0A1E, #CC0000, #8B0000)` }} />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowComparisonModal(true)}
              className="border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Compare
            </Button>
          </div>

          <section
            aria-label="Choose Your Grade carousel"
            role="region"
            aria-roledescription="carousel"
            aria-live="polite"
          >
            <div
              ref={swipeRef}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') { e.preventDefault(); nextGrade(); }
                if (e.key === 'ArrowLeft')  { e.preventDefault(); prevGrade(); }
              }}
              className="relative outline-none focus-visible:ring-2 focus-visible:ring-[#CC0000] rounded-xl"
            >
              {/* Desktop arrows (hidden on mobile) */}
              <button
                onClick={prevGrade}
                className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full text-white shadow-xl -translate-x-4"
                style={{ background: `linear-gradient(135deg, #EB0A1E, #CC0000)` }}
                aria-label="Previous grade"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextGrade}
                className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full text-white shadow-xl translate-x-4"
                style={{ background: `linear-gradient(135deg, #EB0A1E, #CC0000)` }}
                aria-label="Next grade"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Slides */}
              <div className="mx-1 sm:mx-8 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedEngine}-${currentGradeIndex}`}
                    variants={variants(reduceMotion)}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100 bg-white/60 backdrop-blur-xl"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${currentGradeIndex + 1} of ${currentGrades.length}`}
                  >
                    {/* Media with cinematic overlay */}
                    <div className="relative h-52 sm:h-64 lg:h-96 bg-gray-100">
                      <img
                        src={currentGrade.image}
                        alt={`${currentGrade.name} grade image`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        decoding="async"
                        fetchPriority={currentGradeIndex === 0 ? "high" : undefined}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                      {/* Premium Badge */}
                      <div className="absolute top-3 left-3">
                        <Badge className="shadow border-0 text-white font-semibold"
                               style={{ background: `linear-gradient(135deg, #F7B500, #DFA82F)` }}>
                          <Crown className="h-3 w-3 mr-1" /> {currentGrade.highlight}
                        </Badge>
                      </div>
                    </div>

                    {/* Content (glass panel) */}
                    <div className="p-4 sm:p-6 lg:p-10 bg-white/50 backdrop-blur-xl">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" aria-hidden />
                        <h4 className="text-xl sm:text-2xl lg:text-4xl font-black text-gray-900 tracking-tight">{currentGrade.name}</h4>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {currentGrade.description}
                      </p>

                      {/* Pricing */}
                      <div className="mb-4 sm:mb-8 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-gray-100 bg-gradient-to-br from-white/80 to-white/40">
                        <div className="text-2xl sm:text-4xl lg:text-5xl font-black text-gray-900" aria-label={`Price AED ${fmt.format(currentGrade.fullPrice)}`}>
                          AED {fmt.format(currentGrade.fullPrice)}
                        </div>
                        <div className="text-gray-600 text-sm sm:text-lg">
                          From AED {fmt.format(currentGrade.monthlyEMI)}/month
                        </div>
                      </div>

                      {/* Features: semantic list; 2 visible on mobile with expander */}
                      <div className="mb-4 sm:mb-8">
                        <h5 id="features-title" className="font-bold text-base sm:text-xl text-gray-900 mb-2 sm:mb-4">Key Features</h5>
                        <ul aria-labelledby="features-title" className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                          {(isMobile && !expandedMobile ? currentGrade.features.slice(0, 2) : currentGrade.features).map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/70 backdrop-blur border border-gray-100">
                              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full grid place-items-center text-white"
                                    style={{ background: `linear-gradient(135deg, #EB0A1E, #CC0000)` }}>
                                <Check className="h-3 w-3" aria-hidden />
                              </span>
                              <span className="text-gray-800 text-sm sm:text-base font-medium">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        {isMobile && currentGrade.features.length > 2 && (
                          <button
                            className="mt-2 text-xs font-semibold text-[#CC0000] focus-visible:underline focus-visible:outline-none"
                            onClick={() => setExpandedMobile((v) => !v)}
                            aria-expanded={expandedMobile}
                            aria-controls="more-features"
                          >
                            {expandedMobile ? "Hide details" : `+ ${currentGrade.features.length - 2} more`}
                          </button>
                        )}
                        {isMobile && expandedMobile && (
                          <div id="more-features" className="mt-2 grid grid-cols-1 gap-2">
                            {currentGrade.features.slice(2).map((feature, i) => (
                              <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-white/70 backdrop-blur border border-gray-100">
                                <span className="w-5 h-5 rounded-full grid place-items-center text-white" style={{ background: `linear-gradient(135deg, #EB0A1E, #CC0000)` }}>
                                  <Check className="h-3 w-3" aria-hidden />
                                </span>
                                <span className="text-gray-800 text-sm font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
                        <Button
                          onClick={() => { setSelectedGrade(currentGrade.name); toast({ title: "Grade Selected", description: `${currentGrade.name} selected` }); }}
                          className="font-semibold text-white shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000] focus-visible:ring-offset-white"
                          style={{ background: `linear-gradient(90deg, #EB0A1E, #CC0000, #8B0000)` }}
                          aria-pressed={selectedGrade === currentGrade.name}
                        >
                          {selectedGrade === currentGrade.name ? (<><Check className="h-4 w-4 mr-1.5" /> Selected</>) : ("Select")}
                        </Button>
                        <Button
                          variant="outline"
                          className="border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]"
                          onClick={handleTestDriveClick}
                        >
                          <Download className="h-4 w-4 mr-1.5" /> Drive
                        </Button>
                        <Button
                          variant="outline"
                          className="col-span-2 sm:col-span-1 border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]"
                          onClick={handleConfigureClick}
                        >
                          <Wrench className="h-4 w-4 mr-1.5" /> Configure
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-5">
                {currentGrades.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentGradeIndex(idx)}
                    className={`rounded-full transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000] ${idx === currentGradeIndex ? "w-10 h-2 shadow" : "w-2 h-2 bg-gray-300 hover:bg-gray-400"}`}
                    style={idx === currentGradeIndex ? { background: `linear-gradient(90deg, ${TOYOTA_RED}, ${TOYOTA_RED})` } : {}}
                    aria-label={`Go to grade ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </section>
        </motion.div>
      </div>

      {/* Comparison Modal (unchanged API) */}
      <GradeComparisonModal
        isOpen={showComparisonModal}
        onClose={() => setShowComparisonModal(false)}
        currentEngineData={currentEngineData}
        onGradeSelect={setSelectedGrade}
        selectedGrade={selectedGrade}
        onCarBuilder={onCarBuilder}
        onBookTestDrive={onBookTestDrive}
      />
    </section>
  );
};

export default InteractiveSpecsTechFutura;
