

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Gauge, 
  Fuel, 
  Shield, 
  Zap, 
  Car, 
  Settings, 
  ChevronLeft,
  ChevronRight,
  Check,
  Download,
  Wrench,
  Sparkles
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useSwipeable } from "@/hooks/use-swipeable";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

// Luxury animation variants
const luxuryVariants = {
  enter: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.1, 0.25, 1.0] // BMW-inspired timing
    }
  },
  center: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    y: -20,
    transition: { 
      duration: 0.4, 
      ease: [0.77, 0, 0.175, 1] // Tesla-inspired exit
    }
  }
};

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const engines = [
  {
    name: "2.5L Hybrid",
    power: "218 HP",
    torque: "221 lb-ft", 
    efficiency: "25.2 km/L",
    description: "Advanced hybrid powertrain with seamless electric assist",
    brandColor: "from-neutral-900 via-neutral-800 to-neutral-700", // Matte black gradient
    accentColor: "bg-neutral-900", // Solid matte black
    icon: <Zap className="h-5 w-5" />,
    grades: [
        {
          name: "Hybrid SE",
          fullPrice: 94900,
          monthlyEMI: 945,
          description: "Sport-enhanced hybrid driving experience",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
          features: ["Hybrid Drive Modes", "Sport Seats", "Enhanced Audio", "18\" Alloy Wheels"],
          highlight: "Eco Sport",
          specs: {
            engine: "2.5L 4-cylinder Hybrid",
            power: "218 HP (combined)",
            torque: "221 lb-ft",
            transmission: "ECVT",
            acceleration: "7.4 seconds (0-60)",
            fuelEconomy: "25.2 km/L",
            co2Emissions: "102 g/km"
          }
        },
        {
          name: "Hybrid XLE",
          fullPrice: 107900,
          monthlyEMI: 1129,
          description: "Premium hybrid comfort and convenience",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/28f33a08-ebcf-4ead-bece-c6a87bdf8202/renditions/8e932ad8-f4b4-46af-9963-31e6afe9e75d?binary=true&mformat=true",
          features: ["Leather Seats", "Dual-Zone Climate", "Premium Audio", "Advanced Safety"],
          highlight: "Most Popular",
          specs: {
            engine: "2.5L 4-cylinder Hybrid",
            power: "218 HP (combined)",
            torque: "221 lb-ft",
            transmission: "ECVT",
            acceleration: "7.4 seconds (0-60)",
            fuelEconomy: "25.2 km/L",
            co2Emissions: "102 g/km"
          }
        },
        {
          name: "Hybrid Limited",
          fullPrice: 122900,
          monthlyEMI: 1279,
          description: "Luxury hybrid with premium materials",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
          features: ["Premium Leather", "Panoramic Sunroof", "JBL Audio", "Full Safety Suite"],
          highlight: "Ultimate Luxury",
          specs: {
            engine: "2.5L 4-cylinder Hybrid",
            power: "218 HP (combined)",
            torque: "221 lb-ft",
            transmission: "ECVT",
            acceleration: "7.4 seconds (0-60)",
            fuelEconomy: "25.2 km/L",
            co2Emissions: "102 g/km"
          }
        }
      ]
    },
    {
      name: "3.5L V6",
      power: "301 HP",
      torque: "267 lb-ft",
      efficiency: "18.4 km/L",
      description: "Powerful V6 engine for enhanced performance",
      brandColor: "from-red-600 via-red-500 to-orange-500", // Tesla-inspired
      accentColor: "bg-red-500",
      icon: <Gauge className="h-5 w-5" />,
      grades: [
        {
          name: "V6 SE",
          fullPrice: 98900,
          monthlyEMI: 989,
          description: "Sport-enhanced V6 driving experience",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
          features: ["Sport Seats", "Enhanced Audio", "Sport Suspension", "19\" Alloy Wheels"],
          highlight: "Sport Package",
          specs: {
            engine: "3.5L V6",
            power: "301 HP",
            torque: "267 lb-ft",
            transmission: "8-speed automatic",
            acceleration: "5.8 seconds (0-60)",
            fuelEconomy: "18.4 km/L",
            co2Emissions: "142 g/km"
          }
        },
        {
          name: "V6 XLE",
          fullPrice: 111900,
          monthlyEMI: 1169,
          description: "Premium V6 comfort and convenience",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/28f33a08-ebcf-4ead-bece-c6a87bdf8202/renditions/8e932ad8-f4b4-46af-9963-31e6afe9e75d?binary=true&mformat=true",
          features: ["Leather Seats", "Dual-Zone Climate", "Premium Audio", "Advanced Safety"],
          highlight: "Performance Luxury",
          specs: {
            engine: "3.5L V6",
            power: "301 HP",
            torque: "267 lb-ft",
            transmission: "8-speed automatic",
            acceleration: "5.8 seconds (0-60)",
            fuelEconomy: "18.4 km/L",
            co2Emissions: "142 g/km"
          }
        },
        {
          name: "V6 Limited",
          fullPrice: 126900,
          monthlyEMI: 1319,
          description: "Ultimate V6 luxury experience",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
          features: ["Premium Leather", "Panoramic Sunroof", "JBL Audio", "Full Safety Suite"],
          highlight: "Top Performance",
          specs: {
            engine: "3.5L V6",
            power: "301 HP",
            torque: "267 lb-ft",
            transmission: "8-speed automatic",
            acceleration: "5.8 seconds (0-60)",
            fuelEconomy: "18.4 km/L",
            co2Emissions: "142 g/km"
          }
        }
      ]
    }
  ];

  const currentEngineData = engines.find(e => e.name === selectedEngine) || engines[0];
  const currentGrades = currentEngineData.grades;
  const currentGrade = currentGrades[currentGradeIndex];

  const nextGrade = () => {
    setCurrentGradeIndex((prev) => (prev + 1) % currentGrades.length);
    setImageLoading(true);
  };

  const prevGrade = () => {
    setCurrentGradeIndex((prev) => (prev - 1 + currentGrades.length) % currentGrades.length);
    setImageLoading(true);
  };

  const swipeableRef = useSwipeable<HTMLDivElement>({
    onSwipeLeft: nextGrade,
    onSwipeRight: prevGrade,
    threshold: 50,
    debug: false
  });

  const handleEngineChange = (engineName: string) => {
    setSelectedEngine(engineName);
    setCurrentGradeIndex(0);
    setImageLoading(true);
    
    toast({
      title: "Engine Selected",
      description: `Switched to ${engineName} - Available grades updated`,
    });
  };

  const handleDownloadSpec = (gradeName: string) => {
    toast({
      title: "Preparing Download",
      description: "Your specification sheet is being prepared...",
    });
    
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${gradeName} specification sheet downloaded successfully.`,
      });
    }, 2000);
  };

  const handleConfigure = (gradeName: string) => {
    // Dispatch custom event to open car builder with pre-filled config
    const event = new CustomEvent('openCarBuilder', {
      detail: {
        step: 2, // Start at grade selection since engine is already chosen
        config: {
          modelYear: '2024',
          engine: selectedEngine,
          grade: gradeName,
          exteriorColor: '',
          interiorColor: '',
          accessories: []
        }
      }
    });
    window.dispatchEvent(event);
  };

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground border-0 mb-4 shadow-lg">
            <Sparkles className="h-4 w-4 mr-2" />
            Luxury Interactive Experience
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6">
            Choose Your Configuration
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Start by selecting your preferred engine, then explore the available grades.
          </p>
        </motion.div>

        {/* Step 1: BMW/Tesla/Mercedes-Inspired Engine Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Step 1: Choose Your Powertrain</h3>
          
          {/* Side-by-side layout for all screens */}
          <div className="grid grid-cols-2 gap-3 max-w-4xl mx-auto">
            {engines.map((engine, index) => (
              <motion.div
                key={engine.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1.0] }}
                whileHover={{ 
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }
                }}
                whileTap={{ scale: 0.98 }}
                className="h-full"
                style={{ minHeight: '44px' }} // Minimum touch target
              >
                <Card 
                  className={`cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] h-full relative overflow-hidden ${
                    selectedEngine === engine.name
                      ? 'border-2 border-primary shadow-xl ring-4 ring-primary/20'
                      : 'border border-border hover:border-primary/50 hover:shadow-lg'
                  }`}
                  onClick={() => handleEngineChange(engine.name)}
                  style={{ minHeight: '44px' }} // Ensure minimum touch target
                >
                  {/* Luxury gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${engine.brandColor} opacity-0 transition-opacity duration-500 ${
                    selectedEngine === engine.name ? 'opacity-10' : ''
                  }`} />
                  
                  <CardContent className={`relative z-10 ${isMobile ? 'p-4' : 'p-6'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-8 h-8 rounded-lg ${engine.accentColor} flex items-center justify-center text-white shadow-md`}>
                          {engine.icon}
                        </div>
                        {selectedEngine === engine.name && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ 
                              type: "spring", 
                              stiffness: 500, 
                              damping: 30 
                            }}
                          >
                            <Check className="h-5 w-5 text-primary" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    <h4 className={`font-bold mb-1 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                      {engine.name}
                    </h4>
                    
                    <p className={`text-muted-foreground mb-3 ${isMobile ? 'text-xs' : 'text-sm'} leading-tight`}>
                      {isMobile ? `${engine.power} • ${engine.efficiency}` : engine.description}
                    </p>
                    
                    {!isMobile && (
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="font-bold text-primary text-base">
                            {engine.power}
                          </div>
                          <div className="text-xs text-muted-foreground">Power</div>
                        </div>
                        
                        <div className="bg-muted/50 rounded-lg p-2">
                          <div className="font-bold text-primary text-base">
                            {engine.efficiency}
                          </div>
                          <div className="text-xs text-muted-foreground">Efficiency</div>
                        </div>
                      </div>
                    )}

                    {/* Mercedes-inspired selection indicator */}
                    {selectedEngine === engine.name && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${engine.brandColor}`}
                      />
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Enhanced Cinematic Grade Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Step 2: Available Grades for {selectedEngine}
          </h3>

          {/* Cinematic Grade Carousel */}
          <div className="relative">
            {/* Enhanced Navigation Buttons */}
            <motion.button
              onClick={prevGrade}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-20 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border-2 border-primary/20 hover:shadow-2xl transition-all duration-300 ${
                isMobile ? 'p-2 -translate-x-1' : 'p-3 -translate-x-3'
              }`}
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Previous grade"
            >
              <ChevronLeft className={`text-primary ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            </motion.button>
            
            <motion.button
              onClick={nextGrade}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-20 rounded-full bg-white/95 backdrop-blur-sm shadow-xl border-2 border-primary/20 hover:shadow-2xl transition-all duration-300 ${
                isMobile ? 'p-2 translate-x-1' : 'p-3 translate-x-3'
              }`}
              style={{ minWidth: '44px', minHeight: '44px' }}
              aria-label="Next grade"
            >
              <ChevronRight className={`text-primary ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
            </motion.button>

            {/* Enhanced Grade Card with Advanced Swipe */}
            <div 
              ref={swipeableRef}
              className={`${isMobile ? 'mx-6 touch-manipulation' : 'mx-12'}`}
              style={{ touchAction: 'pan-y pinch-zoom' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${currentGradeIndex}`}
                  variants={luxuryVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                >
                  <Card className="overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-white to-muted/10 backdrop-blur-sm max-w-5xl mx-auto">
                    <CardContent className="p-0max-h-[calc(100vh-10rem)] overflow-y-auto"> 
                      {/* Luxury Header with Premium Gradient */}
                      <div className={`bg-gradient-to-r ${currentEngineData.brandColor} text-white relative overflow-hidden ${isMobile ? 'p-4' : 'p-6 lg:p-8'}`}>
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5" />
                        <div className="absolute top-0 left-0 w-full h-full opacity-20" 
                             style={{
                               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M30 0L30 60M0 30L60 30M15 15L45 45M15 45L45 15'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                             }} />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>
                              {currentGrade.name}
                            </h4>
                            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {currentGrade.highlight}
                            </Badge>
                          </div>
                          <p className={`text-white/90 mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {currentGrade.description}
                          </p>
                          
                          {/* Premium Pricing Display */}
                          <div className="pt-4 border-t border-white/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                                  AED {currentGrade.fullPrice.toLocaleString()}
                                </div>
                                <div className={`text-white/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
                                  Starting from AED {currentGrade.monthlyEMI}/month
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Content */}
                      <div className={isMobile ? 'p-4' : 'p-6 lg:p-8'}>
                        {/* Professional Loading State */}
                        <div className={`mb-6 rounded-xl overflow-hidden relative ${
                          isMobile ? 'w-full' : ''
                        }`}>
                          <AnimatePresence>
                            {imageLoading && (
                              <motion.div 
                                initial={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className={`absolute inset-0 bg-gradient-to-r ${currentEngineData.brandColor} opacity-10 animate-pulse flex items-center justify-center ${
                                  isMobile ? 'h-80' : 'h-64 lg:h-96'
                                }`}
                              >
                                <div className="text-center">
                                  <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-2"
                                  />
                                  <div className="text-muted-foreground font-medium">Loading premium experience...</div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                             src={currentGrade.image}
  alt={`${currentGrade.name} Grade`}
  className={`mx-auto max-w-full transition-opacity duration-500 ${
    isMobile ? 'h-auto max-h-80' : 'h-auto max-h-[30rem] lg:max-h-[36rem]'
  } ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
  style={{ objectFit: "contain", objectPosition: "center" }}
  loading="lazy"
  onLoad={() => setImageLoading(false)}
  onError={() => setImageLoading(false)}
  initial={{ scale: 1.05 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }}
                          />
                        </div>

                        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                          {/* Enhanced Key Features */}
                          <div>
                            <h5 className={`font-bold text-foreground mb-4 flex items-center ${isMobile ? 'text-base' : 'text-lg'}`}>
                              <div className={`w-2 h-2 rounded-full ${currentEngineData.accentColor} mr-2`} />
                              Key Features
                            </h5>
                            <div className="space-y-3">
                              {currentGrade.features.map((feature, idx) => (
                                <motion.div 
                                  key={feature} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.1 * idx, ease: [0.25, 0.1, 0.25, 1.0] }}
                                  className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/20 transition-all duration-300"
                                >
                                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>{feature}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Enhanced Specifications */}
                          <div>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="specifications" className="border-0">
                                <AccordionTrigger className={`${isMobile ? 'text-base' : 'text-lg'} font-bold hover:no-underline`}>
                                  <div className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5" />
                                    <span>Full Specifications</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className={`grid grid-cols-1 gap-4 pt-4 ${isMobile ? 'text-sm' : ''}`}>
                                    <div className="space-y-4">
                                      {Object.entries(currentGrade.specs).map(([key, value], idx) => (
                                        <motion.div 
                                          key={key} 
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ delay: 0.1 * idx }}
                                          className="flex justify-between items-center p-3 rounded-lg bg-gradient-to-r from-muted/20 to-transparent"
                                        >
                                          <span className="text-muted-foreground capitalize font-medium">
                                            {key.replace(/([A-Z])/g, ' $1')}
                                          </span>
                                          <span className="font-bold text-foreground">{value}</span>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className={`grid gap-4 mt-8 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                          <Button
                            onClick={() => handleDownloadSpec(currentGrade.name)}
                            variant="outline"
                            className="w-full border-2 hover:shadow-lg transition-all duration-300"
                            size={isMobile ? "default" : "lg"}
                            style={{ minHeight: '44px' }}
                          >
                            <Download className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                            Download Spec Sheet
                          </Button>
                          
                          <Button
                            onClick={() => handleConfigure(currentGrade.name)}
                            className={`w-full bg-gradient-to-r ${currentEngineData.brandColor} hover:shadow-xl transition-all duration-300 border-0`}
                            size={isMobile ? "default" : "lg"}
                            style={{ minHeight: '44px' }}
                          >
                            <Wrench className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                            Configure This Grade
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Enhanced Indicators */}
            <div className="flex justify-center space-x-3 mt-8">
              {currentGrades.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentGradeIndex(index);
                    setImageLoading(true);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentGradeIndex 
                      ? `bg-gradient-to-r ${currentEngineData.brandColor} w-8 h-3 shadow-lg` 
                      : 'bg-muted-foreground/30 w-3 h-3 hover:bg-muted-foreground/50'
                  }`}
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label={`Go to grade ${index + 1}`}
                >
                  {isMobile && (
                    <div className={`rounded-full ${
                      index === currentGradeIndex 
                        ? `bg-gradient-to-r ${currentEngineData.brandColor} w-6 h-2` 
                        : 'bg-muted-foreground/30 w-2 h-2'
                    } mx-auto`} />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Enhanced Mobile Swipe Indicator */}
            {isMobile && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="flex justify-center mt-6"
              >
                <div className={`flex items-center space-x-2 bg-gradient-to-r ${currentEngineData.brandColor} bg-opacity-10 backdrop-blur-sm rounded-full px-4 py-2 border border-primary/20`}>
                  <motion.div
                    animate={{ x: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-2 h-2 bg-primary rounded-full"
                  />
                  <span className="text-xs text-muted-foreground font-medium">Swipe to explore grades</span>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
