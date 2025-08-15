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

const TOYOTA_RED = "#EB0A1E";
const GRADIENT_BRAND = "from-[#0A0A0A] via-[#1A0A0A] to-[#EB0A1E]";

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
      brandColor: GRADIENT_BRAND,
      accentColor: "bg-red-700",
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
      brandColor: GRADIENT_BRAND,
      accentColor: "bg-red-700",
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
    <section className="py-8 lg:py-16 bg-[#0A0A0A] relative overflow-hidden">
      {/* subtle diagonal glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1A0A0A] to-[#EB0A1E] opacity-20" />

      <div className="relative z-10 toyota-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 lg:mb-12"
        >
          <Badge className="bg-red-900/30 text-white border border-red-700 mb-3 shadow-sm">
            <Sparkles className="h-4 w-4 mr-2 text-red-400" />
            Interactive Experience
          </Badge>
          <h2 className="text-[28px] lg:text-5xl font-black text-white mb-2 lg:mb-4">
            Choose Your Configuration
          </h2>
          <p className="text-base lg:text-xl text-gray-300 max-w-3xl mx-auto">
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
          <h3 className="text-xl lg:text-2xl font-semibold text-center mb-6 text-white">
            Step 1: Choose Your Powertrain
          </h3>

          {/* Mobile: two side-by-side */}
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
                  transition={{ delay: i * 0.06 }}
                  whileHover={{ y: -2, scale: 1.005 }}
                  className="h-full"
                >
                  <div
                    className={`relative overflow-hidden rounded-xl backdrop-blur-md transition-all duration-400 cursor-pointer group
                      ${active
                        ? "bg-red-900/20 border-2 border-red-500 shadow-[0_0_15px_rgba(235,10,30,0.5)]"
                        : "bg-white/5 border border-gray-700 hover:border-red-500 hover:shadow-[0_0_12px_rgba(235,10,30,0.4)]"
                      }`}
                    onClick={() => handleEngineChange(engine.name)}
                  >
                    {active && <div className="absolute inset-x-0 top-0 h-[2px] bg-red-500" />}

                    <div className="relative z-10 p-3 sm:p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-2 sm:mb-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-red-700 text-white grid place-items-center shadow-sm`}>
                            {engine.icon}
                          </div>
                          {active && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 320, damping: 18 }}>
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500 grid place-items-center">
                                <Check className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <h4 className="font-semibold mb-0.5 sm:mb-1 text-sm sm:text-lg text-white truncate">
                        {engine.name}
                      </h4>
                      <p className="mb-0 sm:mb-4 text-xs sm:text-sm leading-relaxed text-gray-300 line-clamp-2">
                        {isMobile ? `${engine.power} • ${engine.efficiency}` : engine.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
