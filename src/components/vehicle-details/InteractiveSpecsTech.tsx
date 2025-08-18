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
  Star,
  Crown,
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { useToast } from "@/hooks/use-toast";
import { useSwipeable } from "@/hooks/use-swipeable";
import GradeComparisonModal from "./GradeComparisonModal";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
  onCarBuilder?: (gradeInfo?: { engine: string; grade: string }) => void;
  onBookTestDrive?: (gradeInfo?: { engine: string; grade: string }) => void;
}

const luxuryVariants = {
  enter: { opacity: 0, scale: 0.95, x: 100, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  center: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.95, x: -100, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

// Toyota.ae official red color
const TOYOTA_RED = "#CC0000";
const TOYOTA_RED_GRADIENT = "from-[#CC0000] via-[#e60000] to-[#CC0000]";

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ 
  vehicle, 
  onCarBuilder,
  onBookTestDrive 
}) => {
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
      brandColor: TOYOTA_RED,
      accentColor: "bg-[#EB0A1E]",
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
      brandColor: TOYOTA_RED,
      accentColor: "bg-[#EB0A1E]",
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

  const handleConfigureClick = () => {
    if (onCarBuilder) {
      onCarBuilder({
        engine: selectedEngine,
        grade: currentGrade.name
      });
    }
  };

  const handleTestDriveClick = () => {
    if (onBookTestDrive) {
      onBookTestDrive({
        engine: selectedEngine,
        grade: currentGrade.name
      });
    }
  };

  // Swipe functionality for mobile
  const swipeRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: nextGrade,
    onSwipeRight: prevGrade,
    threshold: 50,
    preventDefaultTouchmoveEvent: false,
  });

  return (
    <section className="py-12 lg:py-20 bg-gray-50">
      <div className="toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-16"
        >
          <Badge 
            className="mb-4 shadow-lg shadow-red-200/40 border-0"
            style={{ backgroundColor: TOYOTA_RED, color: 'white' }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Interactive Experience
          </Badge>
          <h2 className="text-[32px] lg:text-6xl font-black text-gray-900 mb-4 lg:mb-6">
            Choose Your Configuration
          </h2>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Select your preferred engine and explore grades with our premium carousel experience.
          </p>
        </motion.div>

        {/* Step 1: Engine Selection */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-2xl lg:text-3xl font-bold text-center mb-8 text-gray-900">
            Step 1: Choose Your Powertrain
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {engines.map((engine, i) => {
              const active = selectedEngine === engine.name;
              return (
                <motion.div
                  key={engine.name}
                  variants={luxuryVariants}
                  initial="enter"
                  whileInView="center"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="h-full"
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl transition-all duration-500 cursor-pointer border-2 bg-white shadow-lg hover:shadow-xl
                      ${active
                        ? "border-[#CC0000] shadow-red-100/60"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => handleEngineChange(engine.name)}
                  >
                    {active && (
                      <div 
                        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r"
                        style={{ backgroundImage: `linear-gradient(to right, ${TOYOTA_RED}, #e60000, ${TOYOTA_RED})` }}
                      />
                    )}

                    <div className="relative z-10 p-6 lg:p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-14 h-14 rounded-xl text-white grid place-items-center shadow-lg"
                            style={{ backgroundColor: TOYOTA_RED }}
                          >
                            {engine.icon}
                          </div>
                          {active && (
                            <motion.div 
                              initial={{ scale: 0 }} 
                              animate={{ scale: 1 }} 
                              transition={{ type: "spring", stiffness: 320, damping: 18 }}
                            >
                              <div 
                                className="w-8 h-8 rounded-full grid place-items-center shadow-md"
                                style={{ backgroundColor: TOYOTA_RED }}
                              >
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <h4 className="font-bold mb-2 text-xl text-gray-900">
                        {engine.name}
                      </h4>
                      <p className="mb-6 text-gray-600 leading-relaxed">
                        {engine.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl p-4 bg-gray-50 border border-gray-100">
                          <div className="font-bold text-gray-900 text-lg">{engine.power}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Power</div>
                        </div>
                        <div className="rounded-xl p-4 bg-gray-50 border border-gray-100">
                          <div className="font-bold text-gray-900 text-lg">{engine.efficiency}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider font-medium">Efficiency</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Step 2: Luxury Grade Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl lg:text-4xl font-black text-gray-900 mb-2">
                Step 2: Choose Your Grade
              </h3>
              <div 
                className="w-24 lg:w-32 h-1 rounded-full"
                style={{ backgroundColor: TOYOTA_RED }}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowComparisonModal(true)}
              className="border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white transition-all shadow-md"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Compare Grades
            </Button>
          </div>

          <div className="relative max-w-7xl mx-auto" ref={swipeRef}>
            {/* Navigation Arrows */}
            <button
              onClick={prevGrade}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-white shadow-2xl -translate-x-6 transition-all hover:scale-110"
              style={{ backgroundColor: TOYOTA_RED }}
              aria-label="Previous grade"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextGrade}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full text-white shadow-2xl translate-x-6 transition-all hover:scale-110"
              style={{ backgroundColor: TOYOTA_RED }}
              aria-label="Next grade"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Luxury Carousel Cards */}
            <div className="mx-8 sm:mx-16 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${currentGradeIndex}`}
                  variants={luxuryVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                >
                  {/* Left Side - Image */}
                  <div className="relative h-64 lg:h-96 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    <img
                      src={currentGrade.image}
                      alt={`${currentGrade.name} Grade`}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                      onLoadStart={() => handleImageLoadStart(currentGradeIndex)}
                      onLoad={() => handleImageLoad(currentGradeIndex)}
                      onError={() => handleImageLoad(currentGradeIndex)}
                    />
                    {/* Premium Badge */}
                    <div className="absolute top-6 left-6">
                      <Badge 
                        className="shadow-lg border-0 text-white font-semibold"
                        style={{ backgroundColor: TOYOTA_RED }}
                      >
                        <Crown className="h-3 w-3 mr-1" />
                        {currentGrade.highlight}
                      </Badge>
                    </div>
                  </div>

                  {/* Right Side - Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-between">
                    {/* Header */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                        <h4 className="text-3xl lg:text-4xl font-black text-gray-900">
                          {currentGrade.name}
                        </h4>
                      </div>
                      <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        {currentGrade.description}
                      </p>

                      {/* Pricing */}
                      <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="text-4xl lg:text-5xl font-black text-gray-900 mb-2">
                          AED {currentGrade.fullPrice.toLocaleString()}
                        </div>
                        <div className="text-gray-600 text-lg">
                          From AED {currentGrade.monthlyEMI}/month
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-8">
                        <h5 className="font-bold text-xl text-gray-900 mb-4">Key Features</h5>
                        <div className="grid grid-cols-1 gap-3">
                          {currentGrade.features.map((feature: string, idx: number) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 shadow-sm"
                            >
                              <div 
                                className="w-6 h-6 rounded-full grid place-items-center"
                                style={{ backgroundColor: TOYOTA_RED }}
                              >
                                <Check className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-gray-700 font-medium">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Button
                        onClick={() => {
                          setSelectedGrade(currentGrade.name);
                          selectCurrentGrade();
                        }}
                        className="font-semibold text-white transition-all shadow-lg"
                        style={{ backgroundColor: TOYOTA_RED }}
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

                      <Button
                        variant="outline"
                        className="border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white transition-all shadow-md"
                        onClick={handleTestDriveClick}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Test Drive
                      </Button>

                      <Button
                        variant="outline"
                        className="border-[#CC0000] text-[#CC0000] hover:bg-[#CC0000] hover:text-white transition-all shadow-md"
                        onClick={handleConfigureClick}
                      >
                        <Wrench className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {currentGrades.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentGradeIndex(idx)}
                  className={`rounded-full transition-all duration-400 ${
                    idx === currentGradeIndex
                      ? "w-12 h-3 shadow-lg shadow-red-200/60"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400"
                  }`}
                  style={idx === currentGradeIndex ? { backgroundColor: TOYOTA_RED } : {}}
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
        onCarBuilder={onCarBuilder}
        onBookTestDrive={onBookTestDrive}
      />
    </section>
  );
};

export default InteractiveSpecsTech;
