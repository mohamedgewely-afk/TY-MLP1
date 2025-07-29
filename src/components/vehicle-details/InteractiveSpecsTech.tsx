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

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { shrinkAnimation, elevationAnimation, morphAnimation, cinematicSlide, hapticFeedback } = useLuxuryAnimations();

  const engines = [
    {
      name: "2.5L Hybrid",
      power: "218 HP",
      torque: "221 lb-ft", 
      efficiency: "25.2 km/L",
      description: "Advanced hybrid powertrain with seamless electric assist",
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
    hapticFeedback('light');
    setCurrentGradeIndex((prev) => (prev + 1) % currentGrades.length);
    setImageLoading(true);
  };

  const prevGrade = () => {
    hapticFeedback('light');
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
    hapticFeedback('medium');
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
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Interactive Experience
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6">
            Choose Your Configuration
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Start by selecting your preferred engine, then explore the available grades.
          </p>
        </motion.div>

        {/* Enhanced Engine Selection - Side by Side Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Step 1: Choose Your Engine</h3>
          
          {/* Enhanced BMW/Tesla/Mercedes-inspired card design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {engines.map((engine, index) => (
              <motion.div
                key={engine.name}
                initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ 
                  y: -8, 
                  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
                }}
                className="group cursor-pointer"
                onClick={() => handleEngineChange(engine.name)}
              >
                <Card 
                  className={`relative overflow-hidden transition-all duration-500 h-full ${
                    selectedEngine === engine.name
                      ? 'border-2 border-primary bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 shadow-2xl shadow-primary/20'
                      : 'border border-border hover:border-primary/30 hover:shadow-xl group-hover:shadow-primary/10'
                  }`}
                  style={elevationAnimation()}
                >
                  {/* Luxury gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 ${
                    selectedEngine === engine.name ? 'opacity-100' : 'group-hover:opacity-50'
                  } from-primary/5 via-transparent to-primary/10`} />
                  
                  <CardContent className="p-6 lg:p-8 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl transition-all duration-300 ${
                          selectedEngine === engine.name 
                            ? 'bg-primary/20 text-primary shadow-lg' 
                            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                        }`}>
                          <Car className="h-6 w-6" />
                        </div>
                        <h4 className="text-xl lg:text-2xl font-bold">{engine.name}</h4>
                      </div>
                      
                      {selectedEngine === engine.name && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className="p-2 bg-green-500 text-white rounded-full"
                        >
                          <Check className="h-5 w-5" />
                        </motion.div>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground mb-6 text-sm lg:text-base">
                      {engine.description}
                    </p>
                    
                    {/* Performance metrics with luxury styling */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="font-bold text-primary text-lg lg:text-xl mb-1">
                          {engine.power}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Power</div>
                      </div>
                      
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="font-bold text-primary text-lg lg:text-xl mb-1">
                          {engine.torque}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Torque</div>
                      </div>
                      
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="font-bold text-primary text-lg lg:text-xl mb-1">
                          {engine.efficiency}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider">Efficiency</div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    <div className={`w-full h-1 rounded-full transition-all duration-500 ${
                      selectedEngine === engine.name 
                        ? 'bg-gradient-to-r from-primary to-primary/60' 
                        : 'bg-muted group-hover:bg-primary/30'
                    }`} />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Grade Selection Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Step 2: Available Grades for {selectedEngine}
          </h3>

          {/* Enhanced Cinematic Carousel */}
          <div className="relative">
            {/* Enhanced Navigation Buttons */}
            <motion.button
              onClick={prevGrade}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-20 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl border hover:shadow-xl transition-all duration-300 ${
                isMobile ? 'p-3 -translate-x-2' : 'p-4 -translate-x-4'
              } hover:bg-primary hover:text-white`}
              style={elevationAnimation()}
              aria-label="Previous grade"
            >
              <ChevronLeft className={isMobile ? 'h-5 w-5' : 'h-6 w-6'} />
            </motion.button>
            
            <motion.button
              onClick={nextGrade}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.95 }}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-20 rounded-full bg-white/90 backdrop-blur-sm shadow-2xl border hover:shadow-xl transition-all duration-300 ${
                isMobile ? 'p-3 translate-x-2' : 'p-4 translate-x-4'
              } hover:bg-primary hover:text-white`}
              style={elevationAnimation()}
              aria-label="Next grade"
            >
              <ChevronRight className={isMobile ? 'h-5 w-5' : 'h-6 w-6'} />
            </motion.button>

            {/* Enhanced Grade Card with Advanced Swipe */}
            <div 
              ref={swipeableRef}
              className={`${isMobile ? 'mx-6' : 'mx-12'} touch-manipulation`}
              style={{ 
                touchAction: 'pan-y pinch-zoom'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${currentGradeIndex}`}
                  initial={{ opacity: 0, x: 100, rotateY: 15 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -100, rotateY: -15 }}
                  transition={{ 
                    duration: 0.6, 
                    ease: [0.77, 0, 0.175, 1] 
                  }}
                  style={{ perspective: '1000px' }}
                >
                  <Card className={`overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white via-primary/5 to-primary/10 shadow-2xl ${
                    isMobile ? 'w-full' : 'max-w-5xl mx-auto'
                  }`}>
                    <CardContent className="p-0">
                      {/* Enhanced Header with Luxury Gradient */}
                      <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-white p-4 lg:p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10" />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl lg:text-3xl'}`}>
                              {currentGrade.name}
                            </h4>
                            <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                              {currentGrade.highlight}
                            </Badge>
                          </div>
                          <p className={`text-white/90 mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}>
                            {currentGrade.description}
                          </p>
                          
                          {/* Enhanced Pricing with Animation */}
                          <motion.div 
                            className="pt-4 border-t border-white/20"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
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
                          </motion.div>
                        </div>
                      </div>

                      {/* Enhanced Content */}
                      <div className={isMobile ? 'p-4' : 'p-6 lg:p-8'}>
                        {/* Enhanced Grade Image with Loading Animation */}
                        <div className={`mb-6 rounded-lg overflow-hidden relative ${
                          isMobile ? 'w-full' : ''
                        }`}>
                          {imageLoading && (
                            <div className={`absolute inset-0 bg-gradient-to-r from-muted via-primary/10 to-muted animate-pulse flex items-center justify-center ${
                              isMobile ? 'h-80' : 'h-64 lg:h-96'
                            }`}>
                              <div className="text-muted-foreground">Loading premium experience...</div>
                            </div>
                          )}
                          <motion.img
                            src={currentGrade.image}
                            alt={`${currentGrade.name} Grade`}
                            className={`w-full object-cover object-center transition-all duration-500 ${
                              isMobile ? 'h-80' : 'h-64 lg:h-96'
                            }`}
                            loading="lazy"
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>

                        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                          <div>
                            <h5 className={`font-bold text-foreground mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>
                              Key Features
                            </h5>
                            <div className="space-y-2">
                              {currentGrade.features.map((feature) => (
                                <div key={feature} className="flex items-center space-x-3">
                                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                  <span className={isMobile ? 'text-sm' : 'text-base'}>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="specifications">
                                <AccordionTrigger className={`${isMobile ? 'text-base' : 'text-lg'} font-bold`}>
                                  <div className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5" />
                                    <span>Full Specifications</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className={`grid grid-cols-1 gap-4 pt-4 ${isMobile ? 'text-sm' : ''}`}>
                                    <div className="space-y-3">
                                      {Object.entries(currentGrade.specs).map(([key, value]) => (
                                        <div key={key} className="flex justify-between">
                                          <span className="text-muted-foreground capitalize">
                                            {key.replace(/([A-Z])/g, ' $1')}
                                          </span>
                                          <span className="font-medium">{value}</span>
                                        </div>
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
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => handleDownloadSpec(currentGrade.name)}
                              variant="outline"
                              className="w-full hover:shadow-lg transition-all duration-300"
                              size={isMobile ? "default" : "lg"}
                              style={elevationAnimation()}
                            >
                              <Download className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                              Download Spec Sheet
                            </Button>
                          </motion.div>
                          
                          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => handleConfigure(currentGrade.name)}
                              className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
                              size={isMobile ? "default" : "lg"}
                              style={elevationAnimation()}
                            >
                              <Wrench className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                              Configure This Grade
                            </Button>
                          </motion.div>
                        </div>
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
                    setCurrentGradeIndex(index);
                    setImageLoading(true);
                    hapticFeedback('light');
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentGradeIndex 
                      ? 'bg-primary w-8 h-3 shadow-lg' 
                      : 'bg-muted-foreground/30 w-3 h-3 hover:bg-muted-foreground/50'
                  } ${isMobile ? 'min-w-[44px] min-h-[44px] flex items-center justify-center' : ''}`}
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
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center space-x-2 bg-muted/50 backdrop-blur-sm rounded-full px-4 py-2">
                  <span className="text-xs text-muted-foreground">← Swipe to navigate grades →</span>
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
