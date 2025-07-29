
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
  Wrench
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useSwipeable } from "@/hooks/use-swipeable";
import { useLuxuryAnimations } from "@/hooks/use-luxury-animations";
import { contextualHaptic } from "@/utils/haptic";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { elevationAnimation, morphAnimation } = useLuxuryAnimations();

  const engines = [
    {
      name: "2.5L Hybrid",
      power: "218 HP",
      torque: "221 lb-ft",
      efficiency: "25.2 km/L",
      description: "Advanced hybrid powertrain with seamless electric assist",
      gradientColor: "from-emerald-500 to-green-600",
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
      gradientColor: "from-red-500 to-rose-600",
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
    contextualHaptic.swipeNavigation();
    setCurrentGradeIndex((prev) => (prev + 1) % currentGrades.length);
    setImageLoading(true);
  };

  const prevGrade = () => {
    contextualHaptic.swipeNavigation();
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
    contextualHaptic.selectionChange();
    setSelectedEngine(engineName);
    setCurrentGradeIndex(0);
    setImageLoading(true);
    
    toast({
      title: "Engine Selected",
      description: `Switched to ${engineName} - Available grades updated`,
    });
  };

  const handleDownloadSpec = (gradeName: string) => {
    contextualHaptic.buttonPress();
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
    contextualHaptic.configComplete();
    const event = new CustomEvent('openCarBuilder', {
      detail: {
        step: 2,
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
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="toyota-container">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge 
            className="mb-4 px-4 py-2 text-sm font-medium"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.8) 100%)',
              color: 'hsl(var(--primary-foreground))',
              boxShadow: '0 4px 14px rgba(235, 10, 30, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
              border: '1px solid hsl(var(--primary)/0.3)'
            }}
          >
            Interactive Experience
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6">
            Choose Your Configuration
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Start by selecting your preferred engine, then explore the available grades.
          </p>
        </motion.div>

        {/* Step 1: Enhanced Engine Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Step 1: Choose Your Engine</h3>
          
          <div className={`grid gap-4 max-w-4xl mx-auto ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {engines.map((engine, index) => (
              <motion.div
                key={engine.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={!isMobile ? { 
                  y: -4,
                  transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1.0] }
                } : {}}
                className="flex-1"
              >
                <Card 
                  className={`cursor-pointer h-full border-2 transition-all duration-300 ${
                    selectedEngine === engine.name
                      ? 'border-primary shadow-xl ring-4 ring-primary/10'
                      : 'border-border/50 hover:border-primary/50 hover:shadow-lg'
                  }`}
                  style={{
                    background: selectedEngine === engine.name 
                      ? `linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--primary)/0.03) 100%)`
                      : 'hsl(var(--card))',
                    boxShadow: selectedEngine === engine.name
                      ? '0 8px 32px rgba(235, 10, 30, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                      : '0 4px 12px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.05)',
                    ...morphAnimation()
                  }}
                  onClick={() => handleEngineChange(engine.name)}
                >
                  <CardContent className={`${isMobile ? 'p-4' : 'p-6'} relative overflow-hidden`}>
                    {/* Background gradient accent */}
                    <div 
                      className={`absolute top-0 right-0 w-20 h-20 opacity-5 bg-gradient-to-br ${engine.gradientColor} rounded-full blur-xl`}
                    />
                    
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <h4 className={`font-black ${isMobile ? 'text-lg' : 'text-xl'} text-foreground`}>
                        {engine.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${engine.gradientColor} shadow-md`}>
                          <Car className={`text-white ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                        </div>
                        {selectedEngine === engine.name && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
                            className="p-1 rounded-full bg-primary/10"
                          >
                            <Check className={`text-primary ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {engine.description}
                    </p>
                    
                    <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className={`font-bold text-primary ${isMobile ? 'text-lg' : 'text-xl'}`}>
                          {engine.power}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">Power</div>
                      </div>
                      
                      <div className="text-center p-3 rounded-lg bg-muted/30">
                        <div className={`font-bold text-primary ${isMobile ? 'text-lg' : 'text-xl'}`}>
                          {engine.torque}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">Torque</div>
                      </div>
                      
                      {!isMobile && (
                        <div className="text-center p-3 rounded-lg bg-muted/30">
                          <div className="font-bold text-primary text-xl">
                            {engine.efficiency}
                          </div>
                          <div className="text-xs text-muted-foreground font-medium">Efficiency</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Enhanced Grade Selection Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Step 2: Available Grades for {selectedEngine}
          </h3>

          <div className="relative">
            {/* Enhanced Navigation Buttons */}
            <motion.button
              onClick={prevGrade}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-white shadow-xl border border-border/20 hover:shadow-2xl transition-all ${
                isMobile ? 'p-3 -translate-x-2' : 'p-4 -translate-x-4'
              }`}
              style={{
                ...elevationAnimation(),
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous grade"
            >
              <ChevronLeft className={isMobile ? 'h-5 w-5' : 'h-6 w-6'} />
            </motion.button>
            
            <motion.button
              onClick={nextGrade}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-white shadow-xl border border-border/20 hover:shadow-2xl transition-all ${
                isMobile ? 'p-3 translate-x-2' : 'p-4 translate-x-4'
              }`}
              style={{
                ...elevationAnimation(),
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.08)'
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next grade"
            >
              <ChevronRight className={isMobile ? 'h-5 w-5' : 'h-6 w-6'} />
            </motion.button>

            {/* Enhanced Grade Card */}
            <div 
              ref={swipeableRef}
              className={`${isMobile ? 'mx-6 touch-manipulation' : 'mx-12'}`}
              style={{ 
                touchAction: 'pan-y pinch-zoom'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${currentGradeIndex}`}
                  initial={{ opacity: 0, x: 100, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.95 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.25, 0.1, 0.25, 1.0]
                  }}
                >
                  <Card className={`overflow-hidden border-2 border-primary/30 ${
                    isMobile ? 'w-full' : 'max-w-5xl mx-auto'
                  }`}
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)/0.2) 100%)',
                    boxShadow: '0 16px 64px rgba(0, 0, 0, 0.1), 0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                  }}>
                    <CardContent className="p-0">
                      {/* Enhanced Header */}
                      <div 
                        className="text-white p-4 lg:p-6 relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.9) 50%, hsl(var(--primary)/0.8) 100%)`,
                          boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                        }}
                      >
                        {/* Background pattern */}
                        <div className="absolute inset-0 opacity-5">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl transform translate-x-16 -translate-y-16" />
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl transform -translate-x-12 translate-y-12" />
                        </div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <motion.h4 
                              className={`font-black ${isMobile ? 'text-2xl' : 'text-3xl lg:text-4xl'}`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              {currentGrade.name}
                            </motion.h4>
                            <motion.div
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3, type: "spring" }}
                            >
                              <Badge 
                                className="px-3 py-1 text-sm font-bold"
                                style={{
                                  background: 'rgba(255, 255, 255, 0.15)',
                                  color: 'white',
                                  border: '1px solid rgba(255, 255, 255, 0.2)',
                                  boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                {currentGrade.highlight}
                              </Badge>
                            </motion.div>
                          </div>
                          
                          <motion.p 
                            className={`text-white/90 mb-6 ${isMobile ? 'text-base' : 'text-lg'}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                          >
                            {currentGrade.description}
                          </motion.p>
                          
                          {/* Enhanced Pricing */}
                          <motion.div 
                            className="pt-4 border-t border-white/20"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={`font-black ${isMobile ? 'text-3xl' : 'text-4xl'} mb-1`}>
                                  AED {currentGrade.fullPrice.toLocaleString()}
                                </div>
                                <div className={`text-white/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
                                  Starting from AED {currentGrade.monthlyEMI}/month
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Enhanced Content */}
                      <div className={isMobile ? 'p-4' : 'p-6 lg:p-8'}>
                        {/* Enhanced Grade Image */}
                        <motion.div 
                          className={`mb-6 rounded-xl overflow-hidden relative ${
                            isMobile ? 'w-full' : ''
                          }`}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4, duration: 0.5 }}
                          style={{
                            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15), 0 6px 24px rgba(0, 0, 0, 0.1)'
                          }}
                        >
                          {imageLoading && (
                            <div className={`absolute inset-0 bg-muted animate-pulse flex items-center justify-center ${
                              isMobile ? 'h-80' : 'h-64 lg:h-96'
                            }`}>
                              <motion.div 
                                className="text-muted-foreground"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                Loading...
                              </motion.div>
                            </div>
                          )}
                          <img
                            src={currentGrade.image}
                            alt={`${currentGrade.name} Grade`}
                            className={`w-full object-cover object-center ${
                              isMobile ? 'h-80' : 'h-64 lg:h-96'
                            }`}
                            loading="lazy"
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)}
                          />
                        </motion.div>

                        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                          {/* Enhanced Key Features */}
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <h5 className={`font-black text-foreground mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
                              Key Features
                            </h5>
                            <div className="space-y-3">
                              {currentGrade.features.map((feature, index) => (
                                <motion.div 
                                  key={feature} 
                                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.6 + index * 0.1 }}
                                >
                                  <div className="p-1 rounded-full bg-green-500/10">
                                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  </div>
                                  <span className={isMobile ? 'text-sm' : 'text-base'}>{feature}</span>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>

                          {/* Enhanced Specifications */}
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="specifications">
                                <AccordionTrigger className={`${isMobile ? 'text-lg' : 'text-xl'} font-black hover:no-underline`}>
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 rounded-lg bg-primary/10">
                                      <Settings className="h-5 w-5 text-primary" />
                                    </div>
                                    <span>Full Specifications</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className={`grid grid-cols-1 gap-4 pt-4 ${isMobile ? 'text-sm' : ''}`}>
                                    <div className="space-y-4">
                                      {Object.entries(currentGrade.specs).map(([key, value]) => (
                                        <div key={key} className="flex justify-between p-3 rounded-lg bg-muted/30">
                                          <span className="text-muted-foreground capitalize font-medium">
                                            {key.replace(/([A-Z])/g, ' $1')}
                                          </span>
                                          <span className="font-bold">{value}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </motion.div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <motion.div 
                          className={`grid gap-4 mt-8 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Button
                            onClick={() => handleDownloadSpec(currentGrade.name)}
                            variant="outline"
                            className="w-full border-2 font-bold"
                            size={isMobile ? "lg" : "lg"}
                            style={{
                              ...elevationAnimation(),
                              borderColor: 'hsl(var(--border))',
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                            }}
                          >
                            <Download className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                            Download Spec Sheet
                          </Button>
                          
                          <Button
                            onClick={() => handleConfigure(currentGrade.name)}
                            className="w-full font-bold"
                            size={isMobile ? "lg" : "lg"}
                            style={{
                              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)/0.9) 100%)',
                              boxShadow: '0 8px 32px rgba(235, 10, 30, 0.3), 0 4px 16px rgba(0, 0, 0, 0.1)',
                              ...elevationAnimation()
                            }}
                          >
                            <Wrench className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                            Configure This Grade
                          </Button>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Enhanced Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {currentGrades.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    contextualHaptic.selectionChange();
                    setCurrentGradeIndex(index);
                    setImageLoading(true);
                  }}
                  className={`rounded-full transition-all ${
                    index === currentGradeIndex 
                      ? 'bg-primary w-8 h-3' 
                      : 'bg-muted-foreground/30 w-3 h-3 hover:bg-muted-foreground/50'
                  } ${isMobile ? 'min-w-[44px] min-h-[44px] flex items-center justify-center' : ''}`}
                  style={{
                    boxShadow: index === currentGradeIndex 
                      ? '0 2px 8px rgba(235, 10, 30, 0.3)'
                      : 'none'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Go to grade ${index + 1}`}
                >
                  {isMobile && (
                    <div className={`rounded-full ${
                      index === currentGradeIndex 
                        ? 'bg-primary w-6 h-2' 
                        : 'bg-muted-foreground/30 w-2 h-2'
                    }`} />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Enhanced Mobile Swipe Indicator */}
            {isMobile && (
              <motion.div 
                className="flex justify-center mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center space-x-2 bg-muted/50 rounded-full px-4 py-2 backdrop-blur-sm">
                  <motion.div
                    animate={{ x: [-4, 4, -4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1 h-1 bg-muted-foreground rounded-full"
                  />
                  <span className="text-xs text-muted-foreground font-medium">
                    Swipe horizontally to navigate grades
                  </span>
                  <motion.div
                    animate={{ x: [4, -4, 4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1 h-1 bg-muted-foreground rounded-full"
                  />
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
