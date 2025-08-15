
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
import GradeComparisonModal from "./GradeComparisonModal";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const luxuryVariants = {
  enter: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    y: -20,
    transition: { duration: 0.4, ease: [0.77, 0, 0.175, 1] },
  },
};

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
      brandColor: "from-blue-600 via-blue-500 to-blue-400",
      accentColor: "bg-blue-600",
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
      brandColor: "from-gray-600 via-gray-500 to-gray-400",
      accentColor: "bg-gray-600",
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
    <section className="py-12 lg:py-20 bg-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-gray-900/20 via-transparent to-transparent" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -80, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 1.2, 0],
              }}
              transition={{
                duration: 6 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 6,
              }}
            />
          ))}
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="toyota-container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent w-24" />
            <div className="relative">
              <Crown className="h-8 w-8 text-blue-500 animate-pulse" />
              <div className="absolute inset-0 h-8 w-8 bg-blue-500/20 rounded-full blur-xl animate-pulse" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent w-24" />
          </div>

          <Badge className="bg-gradient-to-r from-blue-500/20 via-blue-400/30 to-blue-400/20 text-blue-200 border border-blue-400/30 mb-6 shadow-2xl shadow-blue-500/10 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 mr-2" />
            Interactive Experience
          </Badge>
          <h2 className="text-3xl lg:text-6xl font-black tracking-tight mb-4 lg:mb-6 bg-gradient-to-r from-white via-blue-200 to-gray-200 bg-clip-text text-transparent drop-shadow-2xl">
            Choose Your Configuration
          </h2>
          <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
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
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
              Step 1: Choose Your Powertrain
            </h3>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto">
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
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="h-full"
                >
                  <div
                    className={`
                      relative overflow-hidden rounded-3xl transition-all duration-700 cursor-pointer group
                      ${active 
                        ? 'bg-gradient-to-br from-gray-600/90 to-gray-700/90 border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20' 
                        : 'bg-gradient-to-br from-gray-700/60 to-gray-800/80 border border-gray-600/30 hover:border-blue-500/30 shadow-xl'
                      }
                      backdrop-blur-2xl
                    `}
                    onClick={() => handleEngineChange(engine.name)}
                  >
                    {/* Corner accents */}
                    <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 transition-colors duration-500 ${active ? 'border-blue-400' : 'border-blue-500/30 group-hover:border-blue-400/60'}`} />
                    <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 transition-colors duration-500 ${active ? 'border-blue-400' : 'border-blue-500/30 group-hover:border-blue-400/60'}`} />
                    <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 transition-colors duration-500 ${active ? 'border-blue-400' : 'border-blue-500/30 group-hover:border-blue-400/60'}`} />
                    <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 transition-colors duration-500 ${active ? 'border-blue-400' : 'border-blue-500/30 group-hover:border-blue-400/60'}`} />

                    {/* Glow effect for active state */}
                    {active && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-blue-500/10 to-blue-500/5 animate-pulse" />
                    )}

                    <div className="relative z-10 p-6 sm:p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-2xl ${engine.accentColor} text-white grid place-items-center shadow-2xl shadow-black/50 group-hover:scale-110 transition-transform duration-500`}>
                            {engine.icon}
                          </div>
                          {active && (
                            <motion.div 
                              initial={{ scale: 0, rotate: -180 }} 
                              animate={{ scale: 1, rotate: 0 }} 
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 grid place-items-center shadow-lg shadow-blue-500/30">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            </motion.div>
                          )}
                        </div>
                        {active && (
                          <Star className="h-6 w-6 text-blue-400 animate-pulse" />
                        )}
                      </div>

                      <h4 className={`font-bold mb-2 text-lg lg:text-xl ${active ? 'text-white' : 'text-gray-200 group-hover:text-white'} transition-colors duration-500`}>
                        {engine.name}
                      </h4>
                      <p className={`mb-6 text-sm lg:text-base leading-relaxed ${active ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'} transition-colors duration-500`}>
                        {isMobile ? `${engine.power} • ${engine.efficiency}` : engine.description}
                      </p>

                      {!isMobile && (
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="rounded-2xl p-4 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl group-hover:from-white/10 group-hover:to-white/15 transition-all duration-500">
                            <div className="font-bold text-lg text-white drop-shadow-lg">{engine.power}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Power</div>
                          </div>
                          <div className="rounded-2xl p-4 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 backdrop-blur-xl group-hover:from-white/10 group-hover:to-white/15 transition-all duration-500">
                            <div className="font-bold text-lg text-white drop-shadow-lg">{engine.efficiency}</div>
                            <div className="text-xs text-gray-400 uppercase tracking-wider">Efficiency</div>
                          </div>
                        </div>
                      )}

                      {active && (
                        <motion.div
                          initial={{ width: 0, opacity: 0 }}
                          animate={{ width: "100%", opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${engine.brandColor} shadow-lg`}
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
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }} 
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="text-center sm:text-left">
              <h3 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                Step 2: Choose Your Grade
              </h3>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto sm:mx-0" />
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparisonModal(true)}
                className="bg-gray-700/60 border-gray-600/40 text-gray-300 hover:bg-gray-600/80 hover:text-white hover:border-blue-500/40 backdrop-blur-xl transition-all duration-500"
                style={{ minHeight: "44px" }}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Compare Grades
              </Button>
            </div>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Navigation Arrows */}
            <button
              onClick={prevGrade}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-gray-700/80 backdrop-blur-2xl border border-gray-600/50 hover:border-blue-500/50 hover:bg-gray-600/90 shadow-2xl transition-all duration-500 -translate-x-6"
              style={{ minHeight: "56px", minWidth: "56px" }}
            >
              <ChevronLeft className="h-6 w-6 text-gray-300 hover:text-white transition-colors" />
            </button>
            <button
              onClick={nextGrade}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-gray-700/80 backdrop-blur-2xl border border-gray-600/50 hover:border-blue-500/50 hover:bg-gray-600/90 shadow-2xl transition-all duration-500 translate-x-6"
              style={{ minHeight: "56px", minWidth: "56px" }}
            >
              <ChevronRight className="h-6 w-6 text-gray-300 hover:text-white transition-colors" />
            </button>

            {/* Grade Card */}
            <div className="mx-12">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${selectedEngine}-${currentGradeIndex}`} 
                  variants={luxuryVariants} 
                  initial="enter" 
                  animate="center" 
                  exit="exit"
                >
                  <Card className="overflow-hidden bg-gradient-to-br from-gray-600/80 to-gray-700/90 border-2 border-gray-600/30 shadow-2xl backdrop-blur-2xl">
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="relative p-6 sm:p-8 text-white rounded-t-3xl overflow-hidden">
                        <div className={`absolute inset-0 bg-gradient-to-br ${currentEngineData.brandColor} opacity-90`} />
                        
                        {/* Pattern overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0,rgba(255,255,255,0.1)_2px,transparent_2px,transparent_8px)] opacity-30" />
                        
                        {/* Floating light effects */}
                        <div className="absolute inset-0">
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-32 h-32 bg-white/10 rounded-full blur-3xl"
                              style={{
                                left: `${20 + i * 30}%`,
                                top: `${10 + i * 20}%`,
                              }}
                              animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 4 + i,
                                repeat: Infinity,
                                delay: i * 0.5,
                              }}
                            />
                          ))}
                        </div>

                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-2xl lg:text-3xl font-bold tracking-wide drop-shadow-2xl">
                              {currentGrade.name}
                            </h4>
                            <Badge className="bg-gradient-to-r from-blue-500/90 to-blue-400/90 text-white font-bold border-blue-300/50 shadow-2xl shadow-blue-500/20 backdrop-blur-xl">
                              <Crown className="h-4 w-4 mr-1" />
                              {currentGrade.highlight}
                            </Badge>
                          </div>
                          <p className="text-white/90 text-base mb-6 leading-relaxed drop-shadow-lg">
                            {currentGrade.description}
                          </p>
                          <div className="pt-6 border-t border-white/20">
                            <div className="flex items-end justify-between">
                              <div>
                                <div className="text-3xl lg:text-4xl font-black drop-shadow-2xl mb-1">
                                  AED {currentGrade.fullPrice.toLocaleString()}
                                </div>
                                <div className="text-white/80 text-base">
                                  From AED {currentGrade.monthlyEMI}/month
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Image Section */}
                      <div className="relative overflow-hidden h-72 lg:h-96 bg-gradient-to-br from-gray-700 to-gray-800">
                        <img
                          src={currentGrade.image}
                          alt={`${currentGrade.name} Grade`}
                          className="w-full h-full object-contain sm:object-cover filter drop-shadow-2xl"
                          loading="lazy"
                          onLoadStart={() => handleImageLoadStart(currentGradeIndex)}
                          onLoad={() => handleImageLoad(currentGradeIndex)}
                          onError={() => handleImageLoad(currentGradeIndex)}
                        />
                        
                        {/* Glass reflection effect */}
                        <div className="pointer-events-none absolute inset-0">
                          <div 
                            className="absolute inset-0 opacity-30"
                            style={{
                              background: "linear-gradient(120deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.0) 60%)",
                              transform: "skewX(-15deg)",
                            }}
                          />
                        </div>
                        
                        {/* Shine effect */}
                        <motion.div
                          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 rotate-12 opacity-20"
                          style={{
                            background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 45%, rgba(255,255,255,0) 100%)",
                          }}
                          animate={{ x: ["-150%", "130%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                      </div>

                      {/* Content Body */}
                      <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-700/60 to-gray-800/80">
                        {/* Features Section */}
                        <div className="mb-8">
                          <h5 className="font-bold text-lg text-white mb-4 flex items-center">
                            <Sparkles className="h-5 w-5 mr-2 text-blue-400" />
                            Key Features
                          </h5>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                            {currentGrade.features.map((feature: string, idx: number) => (
                              <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10 backdrop-blur-xl"
                              >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 grid place-items-center shadow-lg shadow-blue-500/30">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                                <span className="text-sm text-gray-300 font-medium">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <Button
                            onClick={() => {
                              setSelectedGrade(currentGrade.name);
                              selectCurrentGrade();
                            }}
                            className={`transition-all duration-500 text-white font-semibold shadow-2xl ${
                              selectedGrade === currentGrade.name
                                ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-blue-500/30"
                                : `bg-gradient-to-r ${currentEngineData.brandColor} hover:scale-105 shadow-blue-500/20`
                            }`}
                            style={{ minHeight: "48px" }}
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
                            className="bg-gray-700/60 border-gray-600/40 text-gray-300 hover:bg-gray-600/80 hover:text-white hover:border-blue-500/40 backdrop-blur-xl transition-all duration-500"
                            style={{ minHeight: "48px" }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Spec
                          </Button>

                          <Button 
                            variant="outline"
                            className="bg-gray-700/60 border-gray-600/40 text-gray-300 hover:bg-gray-600/80 hover:text-white hover:border-blue-500/40 backdrop-blur-xl transition-all duration-500"
                            style={{ minHeight: "48px" }}
                          >
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

            {/* Indicators */}
            <div className="flex justify-center gap-3 mt-8">
              {currentGrades.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentGradeIndex(idx)}
                  className={`rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    idx === currentGradeIndex
                      ? "bg-gradient-to-r from-blue-500 to-blue-400 w-12 h-3 shadow-lg shadow-blue-500/50"
                      : "bg-gray-600/50 w-3 h-3 hover:bg-gray-500/70 hover:scale-125"
                  }`}
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
