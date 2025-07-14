
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

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const isMobile = useIsMobile();

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
  };

  const prevGrade = () => {
    setCurrentGradeIndex((prev) => (prev - 1 + currentGrades.length) % currentGrades.length);
  };

  const handleEngineChange = (engineName: string) => {
    setSelectedEngine(engineName);
    setCurrentGradeIndex(0); // Reset to first grade when engine changes
  };

  const handleDownloadSpec = (gradeName: string) => {
    // Simulate PDF download
    console.log(`Downloading specification sheet for ${gradeName}`);
    // In real implementation, this would trigger actual PDF download
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

        {/* Step 1: Engine Selection - Compact Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Step 1: Choose Your Engine</h3>
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            {engines.map((engine, index) => (
              <motion.div
                key={engine.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
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
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg">{engine.name}</h4>
                      <div className="flex items-center">
                        <Car className="h-5 w-5 text-primary mr-2" />
                        {selectedEngine === engine.name && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-3">
                      {engine.description}
                    </p>
                    
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
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Grade Selection Carousel - Larger Tiles */}
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
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevGrade}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all -translate-x-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              onClick={nextGrade}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all translate-x-2"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Grade Card - Larger Size */}
            <div className="mx-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${currentGradeIndex}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 max-w-5xl mx-auto">
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-2xl lg:text-3xl">{currentGrade.name}</h4>
                          <Badge className="bg-white/20 text-white border-white/30">
                            {currentGrade.highlight}
                          </Badge>
                        </div>
                        <p className="text-white/90 text-base mb-4">{currentGrade.description}</p>
                        
                        {/* Pricing */}
                        <div className="pt-4 border-t border-white/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-3xl">
                                AED {currentGrade.fullPrice.toLocaleString()}
                              </div>
                              <div className="text-white/80">Starting from AED {currentGrade.monthlyEMI}/month</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Content - Larger Layout */}
                      <div className="p-6 lg:p-8">
                        {/* Grade Image - Larger */}
                        <div className="mb-6 rounded-lg overflow-hidden">
                          <img
                            src={currentGrade.image}
                            alt={`${currentGrade.name} Grade`}
                            className="w-full h-64 lg:h-80 object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Key Features */}
                          <div>
                            <h5 className="font-bold text-foreground mb-4 text-lg">Key Features</h5>
                            <div className="space-y-2">
                              {currentGrade.features.map((feature) => (
                                <div key={feature} className="flex items-center space-x-3">
                                  <Check className="h-4 w-4 text-green-500" />
                                  <span className="text-base">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Collapsed Specifications */}
                          <div>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="specifications">
                                <AccordionTrigger className="text-lg font-bold">
                                  <div className="flex items-center space-x-2">
                                    <Settings className="h-5 w-5" />
                                    <span>Full Specifications</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                  <div className="grid grid-cols-1 gap-4 pt-4">
                                    <div className="space-y-3">
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Engine</span>
                                        <span className="font-medium">{currentGrade.specs.engine}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Power</span>
                                        <span className="font-medium">{currentGrade.specs.power}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Torque</span>
                                        <span className="font-medium">{currentGrade.specs.torque}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Transmission</span>
                                        <span className="font-medium">{currentGrade.specs.transmission}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">0-60 mph</span>
                                        <span className="font-medium">{currentGrade.specs.acceleration}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Fuel Economy</span>
                                        <span className="font-medium">{currentGrade.specs.fuelEconomy}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">CO₂ Emissions</span>
                                        <span className="font-medium">{currentGrade.specs.co2Emissions}</span>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid md:grid-cols-2 gap-4 mt-8">
                          <Button
                            onClick={() => handleDownloadSpec(currentGrade.name)}
                            variant="outline"
                            className="w-full"
                            size="lg"
                          >
                            <Download className="mr-2 h-5 w-5" />
                            Download Spec Sheet
                          </Button>
                          
                          <Button
                            onClick={() => handleConfigure(currentGrade.name)}
                            className="w-full bg-primary hover:bg-primary/90"
                            size="lg"
                          >
                            <Wrench className="mr-2 h-5 w-5" />
                            Configure This Grade
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Indicators */}
            <div className="flex justify-center space-x-2 mt-8">
              {currentGrades.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGradeIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentGradeIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                  }`}
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
