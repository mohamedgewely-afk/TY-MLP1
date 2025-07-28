
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

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

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

        {/* Step 1: Engine Selection - Compact Mobile Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Step 1: Choose Your Engine</h3>
          
          {/* Compact 2-column layout for mobile */}
          <div className={`grid gap-3 max-w-4xl mx-auto ${isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {engines.map((engine, index) => (
              <motion.div
                key={engine.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="flex-1"
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 h-full ${
                    selectedEngine === engine.name
                      ? 'border-2 border-primary bg-primary/5 shadow-lg ring-2 ring-primary/20'
                      : 'border border-border hover:border-primary/50 hover:shadow-md'
                  }`}
                  onClick={() => handleEngineChange(engine.name)}
                >
                  <CardContent className={`${isMobile ? 'p-3' : 'p-4'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>{engine.name}</h4>
                      <div className="flex items-center">
                        <Car className={`text-primary mr-1 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                        {selectedEngine === engine.name && (
                          <Check className={`text-primary ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-muted-foreground mb-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {isMobile ? `${engine.power} • ${engine.efficiency}` : engine.description}
                    </p>
                    
                    {!isMobile && (
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div>
                          <div className="font-bold text-primary text-base">
                            {engine.power}
                          </div>
                          <div className="text-xs text-muted-foreground">Power</div>
                        </div>
                        
                        <div>
                          <div className="font-bold text-primary text-base">
                            {engine.efficiency}
                          </div>
                          <div className="text-xs text-muted-foreground">Efficiency</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Grade Selection Carousel - Enhanced with Better Mobile UI */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Step 2: Available Grades for {selectedEngine}
          </h3>

          {/* Grade Carousel - Enhanced for Mobile */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevGrade}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-white shadow-xl border-2 border-primary/20 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 ${
                isMobile ? 'p-2 -translate-x-1' : 'p-3 -translate-x-2'
              }`}
              aria-label="Previous grade"
            >
              <ChevronLeft className={`text-primary ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
            </button>
            
            <button
              onClick={nextGrade}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-white shadow-xl border-2 border-primary/20 hover:shadow-2xl hover:border-primary/40 transition-all duration-300 ${
                isMobile ? 'p-2 translate-x-1' : 'p-3 translate-x-2'
              }`}
              aria-label="Next grade"
            >
              <ChevronRight className={`text-primary ${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`} />
            </button>

            {/* Grade Card - Enhanced Mobile UI */}
            <div 
              ref={swipeableRef}
              className={`${isMobile ? 'mx-4 touch-manipulation' : 'mx-8'}`}
              style={{ 
                touchAction: 'pan-y pinch-zoom'
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${currentGradeIndex}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 shadow-lg ${
                    isMobile ? 'w-full' : 'max-w-5xl mx-auto'
                  }`}>
                    <CardContent className="p-0">
                      {/* Enhanced Header */}
                      <div className="bg-gradient-to-r from-primary via-primary/95 to-primary/80 text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="0.1"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
                        
                        <div className="relative z-10 p-4 lg:p-6">
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
                          
                          {/* Enhanced Pricing */}
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
                        {/* Enhanced Grade Image - Better aspect ratio and fitting */}
                        <div className={`mb-6 rounded-xl overflow-hidden relative bg-gradient-to-br from-muted/30 to-muted/10 ${
                          isMobile ? 'w-full aspect-[4/3]' : 'aspect-[16/9]'
                        }`}>
                          {imageLoading && (
                            <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/30 animate-pulse flex items-center justify-center">
                              <div className="flex flex-col items-center space-y-2">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                <div className="text-muted-foreground text-sm">Loading image...</div>
                              </div>
                            </div>
                          )}
                          <img
                            src={currentGrade.image}
                            alt={`${currentGrade.name} Grade`}
                            className="w-full h-full object-cover object-center transition-all duration-300"
                            loading="lazy"
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)}
                          />
                          
                          {/* Enhanced Image Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                        </div>

                        <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                          {/* Enhanced Key Features */}
                          <div className="space-y-4">
                            <h5 className={`font-bold text-foreground ${isMobile ? 'text-base' : 'text-lg'}`}>
                              Key Features
                            </h5>
                            <div className="space-y-3">
                              {currentGrade.features.map((feature, index) => (
                                <motion.div 
                                  key={feature}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20"
                                >
                                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                                  <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{feature}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Enhanced Specifications */}
                          <div className="space-y-4">
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="specifications" className="border-primary/20">
                                <AccordionTrigger className={`${isMobile ? 'text-base' : 'text-lg'} font-bold hover:text-primary transition-colors`}>
                                  <div className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5 text-primary" />
                                    <span>Full Specifications</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className={`grid grid-cols-1 gap-4 pt-4 ${isMobile ? 'text-sm' : ''}`}>
                                    <div className="space-y-3">
                                      {Object.entries(currentGrade.specs).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center p-2 rounded-lg bg-muted/30">
                                          <span className="text-muted-foreground capitalize font-medium">
                                            {key.replace(/([A-Z])/g, ' $1')}
                                          </span>
                                          <span className="font-bold text-primary">{value}</span>
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
                          <Button
                            onClick={() => handleDownloadSpec(currentGrade.name)}
                            variant="outline"
                            className={`w-full border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 ${
                              isMobile ? 'h-12' : 'h-14'
                            }`}
                          >
                            <Download className={`mr-2 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                            Download Spec Sheet
                          </Button>
                          
                          <Button
                            onClick={() => handleConfigure(currentGrade.name)}
                            className={`w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 ${
                              isMobile ? 'h-12' : 'h-14'
                            }`}
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
                <button
                  key={index}
                  onClick={() => {
                    setCurrentGradeIndex(index);
                    setImageLoading(true);
                  }}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentGradeIndex 
                      ? 'bg-primary w-8 h-3 shadow-lg' 
                      : 'bg-muted-foreground/30 w-3 h-3 hover:bg-primary/50'
                  } ${isMobile ? 'min-w-[44px] min-h-[44px] flex items-center justify-center' : ''}`}
                  aria-label={`Go to grade ${index + 1}`}
                >
                  {isMobile && (
                    <div className={`rounded-full transition-all duration-300 ${
                      index === currentGradeIndex 
                        ? 'bg-primary w-6 h-2 shadow-md' 
                        : 'bg-muted-foreground/30 w-2 h-2'
                    }`} />
                  )}
                </button>
              ))}
            </div>

            {/* Enhanced Mobile Swipe Indicator */}
            {isMobile && (
              <div className="flex justify-center mt-4">
                <div className="flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 border border-primary/20">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-xs text-primary font-medium">Swipe to explore grades</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
