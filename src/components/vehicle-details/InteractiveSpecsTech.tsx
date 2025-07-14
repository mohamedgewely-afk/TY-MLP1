
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
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
  Loader2
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [downloadingGrade, setDownloadingGrade] = useState<string | null>(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});
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

  const nextGrade = useCallback(() => {
    setCurrentGradeIndex((prev) => (prev + 1) % currentGrades.length);
  }, [currentGrades.length]);

  const prevGrade = useCallback(() => {
    setCurrentGradeIndex((prev) => (prev - 1 + currentGrades.length) % currentGrades.length);
  }, [currentGrades.length]);

  const handleEngineChange = useCallback((engineName: string) => {
    setSelectedEngine(engineName);
    setCurrentGradeIndex(0);
    
    // Show visual feedback for grade change
    toast({
      title: "Engine Changed",
      description: `Now showing ${engines.find(e => e.name === engineName)?.grades.length} available grades for ${engineName}`,
      duration: 2000,
    });
  }, [toast, engines]);

  const handleDownloadSpec = useCallback(async (gradeName: string) => {
    setDownloadingGrade(gradeName);
    
    try {
      // Simulate PDF download with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Download Started",
        description: `${gradeName} specification sheet is being downloaded`,
        duration: 3000,
      });
      
      // In real implementation, this would trigger actual PDF download
      const link = document.createElement('a');
      link.href = '#'; // Would be actual PDF URL
      link.download = `${gradeName}-specifications.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setDownloadingGrade(null);
    }
  }, [toast]);

  const handleConfigure = useCallback((gradeName: string) => {
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
    
    toast({
      title: "Car Builder Opened",
      description: `Configure your ${gradeName} with selected options`,
      duration: 3000,
    });
  }, [selectedEngine, toast]);

  const handleImageLoad = useCallback((gradeName: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [gradeName]: false
    }));
  }, []);

  const handleImageLoadStart = useCallback((gradeName: string) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [gradeName]: true
    }));
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevGrade();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextGrade();
    }
  }, [prevGrade, nextGrade]);

  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentGradeIndex < currentGrades.length - 1) {
      nextGrade();
    }
    if (isRightSwipe && currentGradeIndex > 0) {
      prevGrade();
    }
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

        {/* Step 1: Engine Selection - Enhanced Visual Feedback */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Step 1: Choose Your Engine</h3>
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} max-w-4xl mx-auto`}>
            {engines.map((engine, index) => (
              <motion.div
                key={engine.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                    selectedEngine === engine.name
                      ? 'border-2 border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg ring-4 ring-primary/20 transform scale-105'
                      : 'border border-border hover:border-primary/50 hover:shadow-md hover:bg-muted/30'
                  }`}
                  onClick={() => handleEngineChange(engine.name)}
                >
                  <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>{engine.name}</h4>
                      <div className="flex items-center">
                        <Car className="h-6 w-6 text-primary mr-2" />
                        {selectedEngine === engine.name && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="bg-primary text-primary-foreground rounded-full p-1"
                          >
                            <Check className="h-4 w-4" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                    
                    <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {engine.description}
                    </p>
                    
                    <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
                      <div className="text-center">
                        <div className={`font-bold text-primary ${isMobile ? 'text-lg' : 'text-xl'}`}>
                          {engine.power}
                        </div>
                        <div className="text-xs text-muted-foreground">Power</div>
                      </div>
                      
                      <div className="text-center">
                        <div className={`font-bold text-primary ${isMobile ? 'text-lg' : 'text-xl'}`}>
                          {engine.torque}
                        </div>
                        <div className="text-xs text-muted-foreground">Torque</div>
                      </div>
                      
                      <div className={`text-center ${isMobile ? 'col-span-2' : 'col-span-1'}`}>
                        <div className={`font-bold text-primary ${isMobile ? 'text-lg' : 'text-xl'}`}>
                          {engine.efficiency}
                        </div>
                        <div className="text-xs text-muted-foreground">Efficiency</div>
                      </div>
                    </div>

                    {selectedEngine === engine.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20"
                      >
                        <p className="text-sm text-primary font-medium">
                          ✓ {engine.grades.length} grades available for this engine
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Grade Selection Carousel - Enhanced Navigation & Touch Support */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Step 2: Available Grades for {selectedEngine}
          </h3>

          {/* Grade Carousel */}
          <div 
            className="relative"
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="region"
            aria-label="Grade carousel"
          >
            {/* Enhanced Navigation Buttons */}
            <button
              onClick={prevGrade}
              disabled={currentGradeIndex === 0}
              className={`absolute left-2 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full bg-white shadow-xl border-2 transition-all duration-200 ${
                currentGradeIndex === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-2xl hover:scale-110 hover:bg-primary hover:text-white'
              }`}
              aria-label="Previous grade"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            
            <button
              onClick={nextGrade}
              disabled={currentGradeIndex === currentGrades.length - 1}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 z-10 p-4 rounded-full bg-white shadow-xl border-2 transition-all duration-200 ${
                currentGradeIndex === currentGrades.length - 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-2xl hover:scale-110 hover:bg-primary hover:text-white'
              }`}
              aria-label="Next grade"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Grade Card with Touch Support */}
            <div 
              className="mx-8"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${currentGradeIndex}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 max-w-4xl mx-auto">
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>{currentGrade.name}</h4>
                          <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1">
                            {currentGrade.highlight}
                          </Badge>
                        </div>
                        <p className="text-white/90 text-sm mb-4">{currentGrade.description}</p>
                        
                        {/* Pricing */}
                        <div className="pt-4 border-t border-white/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                                AED {currentGrade.fullPrice.toLocaleString()}
                              </div>
                              <div className="text-white/80 text-sm">Starting from AED {currentGrade.monthlyEMI}/month</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Grade Image with Loading State */}
                        <div className="mb-6 rounded-lg overflow-hidden relative">
                          {imageLoadingStates[currentGrade.name] && (
                            <div className="absolute inset-0 bg-muted/50 flex items-center justify-center z-10">
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                          )}
                          <div className="h-64 bg-muted/20">
                            <img
                              src={currentGrade.image}
                              alt={`${currentGrade.name} Grade`}
                              className="w-full h-full object-cover transition-opacity duration-300"
                              loading="lazy"
                              onLoadStart={() => handleImageLoadStart(currentGrade.name)}
                              onLoad={() => handleImageLoad(currentGrade.name)}
                              style={{ 
                                opacity: imageLoadingStates[currentGrade.name] ? 0 : 1 
                              }}
                            />
                          </div>
                        </div>

                        {/* Key Features */}
                        <div className="mb-6">
                          <h5 className="font-bold text-foreground mb-4 text-lg flex items-center">
                            <Zap className="h-5 w-5 mr-2 text-primary" />
                            Key Features
                          </h5>
                          <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {currentGrade.features.map((feature, idx) => (
                              <motion.div 
                                key={feature} 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30"
                              >
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm font-medium">{feature}</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Collapsed Specifications */}
                        <div className="mb-6">
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="specifications" className="border-primary/20">
                              <AccordionTrigger className="text-lg font-bold hover:text-primary">
                                <div className="flex items-center space-x-3">
                                  <Settings className="h-5 w-5 text-primary" />
                                  <span>Full Specifications</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-4">
                                <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                                  <div className="space-y-4">
                                    <h6 className="font-semibold text-primary mb-3">Engine & Performance</h6>
                                    {Object.entries(currentGrade.specs).slice(0, 4).map(([key, value]) => (
                                      <div key={key} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <span className="text-muted-foreground capitalize font-medium">
                                          {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className="font-bold text-foreground">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-4">
                                    <h6 className="font-semibold text-primary mb-3">Efficiency & Emissions</h6>
                                    {Object.entries(currentGrade.specs).slice(4).map(([key, value]) => (
                                      <div key={key} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                                        <span className="text-muted-foreground capitalize font-medium">
                                          {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                        <span className="font-bold text-foreground">{value}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                          <Button
                            onClick={() => handleDownloadSpec(currentGrade.name)}
                            disabled={downloadingGrade === currentGrade.name}
                            variant="outline"
                            className="w-full h-12 text-base font-semibold border-2 hover:bg-primary hover:text-white transition-colors"
                            size="lg"
                          >
                            {downloadingGrade === currentGrade.name ? (
                              <>
                                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <Download className="mr-3 h-5 w-5" />
                                Download Spec Sheet
                              </>
                            )}
                          </Button>
                          
                          <Button
                            onClick={() => handleConfigure(currentGrade.name)}
                            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
                            size="lg"
                          >
                            <Wrench className="mr-3 h-5 w-5" />
                            Configure This Grade
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Enhanced Indicators with Better Touch Targets */}
            <div className="flex justify-center space-x-3 mt-8">
              {currentGrades.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGradeIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentGradeIndex 
                      ? 'bg-primary w-8 h-4' 
                      : 'bg-muted-foreground/30 w-4 h-4 hover:bg-muted-foreground/50'
                  }`}
                  style={{ minWidth: '44px', minHeight: '44px', padding: '20px 12px' }}
                  aria-label={`Go to grade ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
