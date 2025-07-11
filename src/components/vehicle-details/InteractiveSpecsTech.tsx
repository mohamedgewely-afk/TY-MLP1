
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Gauge, 
  Fuel, 
  Shield, 
  Zap, 
  Car, 
  Settings, 
  Star, 
  Award,
  ChevronLeft,
  ChevronRight,
  Check
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedGrade, setSelectedGrade] = useState("XLE");
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [currentGradeIndex, setCurrentGradeIndex] = useState(2);
  const isMobile = useIsMobile();

  const grades = [
    {
      name: "Base",
      fullPrice: 89900,
      monthlyEMI: 899,
      description: "Essential features for everyday driving",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/28f33a08-ebcf-4ead-bece-c6a87bdf8202/renditions/8e932ad8-f4b4-46af-9963-31e6afe9e75d?binary=true&mformat=true",
      features: ["Manual A/C", "Fabric Seats", "Basic Audio", "Standard Safety"],
      highlight: "Great Value"
    },
    {
      name: "SE",
      fullPrice: 94900,
      monthlyEMI: 945,
      description: "Sport-enhanced driving experience",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
      features: ["Sport Seats", "Enhanced Audio", "Sport Suspension", "Alloy Wheels"],
      highlight: "Sport Package"
    },
    {
      name: "XLE",
      fullPrice: 104900,
      monthlyEMI: 1099,
      description: "Premium comfort and convenience",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
      features: ["Leather Seats", "Dual-Zone Climate", "Premium Audio", "Advanced Safety"],
      highlight: "Most Popular"
    },
    {
      name: "Limited",
      fullPrice: 119900,
      monthlyEMI: 1249,
      description: "Luxury features and premium materials",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/28f33a08-ebcf-4ead-bece-c6a87bdf8202/renditions/8e932ad8-f4b4-46af-9963-31e6afe9e75d?binary=true&mformat=true",
      features: ["Premium Leather", "Panoramic Sunroof", "JBL Audio", "Full Safety Suite"],
      highlight: "Ultimate Luxury"
    }
  ];

  const engines = [
    {
      name: "2.5L Hybrid",
      power: "218 HP",
      torque: "221 lb-ft",
      efficiency: "25.2 km/L",
      description: "Advanced hybrid powertrain with seamless electric assist"
    },
    {
      name: "3.5L V6",
      power: "301 HP", 
      torque: "267 lb-ft",
      efficiency: "18.4 km/L",
      description: "Powerful V6 engine for enhanced performance"
    }
  ];

  const specifications = [
    {
      category: "Performance",
      icon: <Gauge className="h-5 w-5" />,
      specs: [
        { label: "Horsepower", value: "218 HP" },
        { label: "Torque", value: "221 lb-ft" },
        { label: "0-100 km/h", value: "7.5 seconds" },
        { label: "Top Speed", value: "180 km/h" }
      ]
    },
    {
      category: "Efficiency",
      icon: <Fuel className="h-5 w-5" />,
      specs: [
        { label: "Fuel Economy", value: "25.2 km/L" },
        { label: "CO₂ Emissions", value: "102 g/km" },
        { label: "Fuel Tank", value: "50 L" },
        { label: "Range", value: "1,260 km" }
      ]
    },
    {
      category: "Safety",
      icon: <Shield className="h-5 w-5" />,
      specs: [
        { label: "NCAP Rating", value: "5 Stars" },
        { label: "Airbags", value: "10 Total" },
        { label: "Safety Sense", value: "3.0 System" },
        { label: "Blind Spot", value: "Monitoring" }
      ]
    },
    {
      category: "Technology",
      icon: <Zap className="h-5 w-5" />,
      specs: [
        { label: "Infotainment", value: "12.3\" Display" },
        { label: "Connectivity", value: "Wireless CarPlay" },
        { label: "Audio", value: "JBL Premium" },
        { label: "Navigation", value: "Built-in GPS" }
      ]
    }
  ];

  const currentGrade = grades[currentGradeIndex];

  const nextGrade = () => {
    const newIndex = (currentGradeIndex + 1) % grades.length;
    setCurrentGradeIndex(newIndex);
    setSelectedGrade(grades[newIndex].name);
  };

  const prevGrade = () => {
    const newIndex = (currentGradeIndex - 1 + grades.length) % grades.length;
    setCurrentGradeIndex(newIndex);
    setSelectedGrade(grades[newIndex].name);
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
            Detailed Specifications
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore every detail of your future vehicle with our interactive specification guide.
          </p>
        </motion.div>

        <Tabs defaultValue="grades" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="grades">Select Your Grade</TabsTrigger>
            <TabsTrigger value="engines">Choose Engine</TabsTrigger>
            <TabsTrigger value="specs">Full Specifications</TabsTrigger>
          </TabsList>

          {/* Grades Tab */}
          <TabsContent value="grades" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Grade Image */}
              <motion.div
                key={currentGrade.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-video rounded-xl overflow-hidden bg-muted"
              >
                <img
                  src={currentGrade.image}
                  alt={`${currentGrade.name} Grade`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <Badge className="bg-white/90 text-gray-900">
                    {currentGrade.name} Grade
                  </Badge>
                </div>
              </motion.div>

              {/* Grade Selection */}
              <div className="space-y-4">
                {/* Navigation for Mobile */}
                {isMobile && (
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevGrade}
                      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex space-x-2">
                      {grades.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentGradeIndex(index);
                            setSelectedGrade(grades[index].name);
                          }}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentGradeIndex 
                              ? 'bg-primary w-6' 
                              : 'bg-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextGrade}
                      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {/* Grade Cards */}
                {isMobile ? (
                  // Mobile: Single card with navigation
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentGrade.name}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5 h-full">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-lg font-bold">{currentGrade.name}</h3>
                            <Badge className="bg-primary/10 text-primary text-xs">
                              {currentGrade.highlight}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            {currentGrade.description}
                          </p>
                          
                          <div className="text-center mb-3 p-3 bg-primary/5 rounded-lg">
                            <div className="text-xl font-black text-primary">
                              AED {currentGrade.fullPrice.toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Starting from AED {currentGrade.monthlyEMI}/month
                            </div>
                          </div>

                          {/* Features with Accordion */}
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="features">
                              <AccordionTrigger className="text-sm font-medium">
                                Key Features
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="grid grid-cols-1 gap-1">
                                  {currentGrade.features.map((feature) => (
                                    <div key={feature} className="flex items-center space-x-2 text-xs">
                                      <Check className="h-3 w-3 text-green-500" />
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  // Desktop: Grid of all cards
                  <div className="grid grid-cols-2 gap-4">
                    {grades.map((grade, index) => (
                      <motion.div
                        key={grade.name}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -4 }}
                      >
                        <Card className={`cursor-pointer transition-all duration-300 h-full ${
                          selectedGrade === grade.name
                            ? 'border-2 border-primary bg-primary/5 shadow-lg'
                            : 'border border-border hover:border-primary/50 hover:shadow-md'
                        }`}
                        onClick={() => {
                          setSelectedGrade(grade.name);
                          setCurrentGradeIndex(index);
                        }}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-bold">{grade.name}</h3>
                              <Badge className="bg-primary/10 text-primary text-xs">
                                {grade.highlight}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-muted-foreground mb-3">
                              {grade.description}
                            </p>
                            
                            <div className="text-center mb-3 p-3 bg-primary/5 rounded-lg">
                              <div className="text-xl font-black text-primary">
                                AED {grade.fullPrice.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Starting from AED {grade.monthlyEMI}/month
                              </div>
                            </div>

                            <div className="grid grid-cols-1 gap-1">
                              {grade.features.slice(0, 3).map((feature) => (
                                <div key={feature} className="flex items-center space-x-2 text-xs">
                                  <Check className="h-3 w-3 text-green-500" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                              {grade.features.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                  +{grade.features.length - 3} more features
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Engines Tab */}
          <TabsContent value="engines" className="space-y-6">
            <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {engines.map((engine, index) => (
                <motion.div
                  key={engine.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Card className={`cursor-pointer transition-all duration-300 ${
                    selectedEngine === engine.name
                      ? 'border-2 border-primary bg-primary/5 shadow-lg'
                      : 'border border-border hover:border-primary/50 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedEngine(engine.name)}
                  >
                    <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>{engine.name}</h3>
                        <Car className="h-6 w-6 text-primary" />
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
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Specifications Tab */}
          <TabsContent value="specs" className="space-y-6">
            {isMobile ? (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {specifications.map((section, index) => (
                  <AccordionItem key={section.category} value={section.category}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                          {section.icon}
                        </div>
                        <span className="font-bold text-left">{section.category}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 gap-3 pt-2">
                        {section.specs.map((spec) => (
                          <div key={spec.label} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                            <span className="font-medium text-sm">{spec.label}</span>
                            <span className="font-bold text-primary text-sm">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {specifications.map((section, index) => (
                  <motion.div
                    key={section.category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                  >
                    <Card className="h-full border border-border hover:border-primary/50 hover:shadow-md transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {section.icon}
                          </div>
                          <h3 className="font-bold text-lg">{section.category}</h3>
                        </div>
                        
                        <div className="space-y-3">
                          {section.specs.map((spec) => (
                            <div key={spec.label} className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">{spec.label}</span>
                              <span className="font-bold text-primary text-sm">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
