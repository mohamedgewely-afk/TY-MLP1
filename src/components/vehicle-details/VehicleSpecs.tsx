
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { motion } from "framer-motion";
import {
  Fuel,
  Calendar,
  LifeBuoy,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Settings
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface VehicleSpecsProps {
  vehicle: VehicleModel;
}

interface GradeOption {
  name: string;
  price: number;
  features: string[];
  image: string;
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
  };
}

const VehicleSpecs: React.FC<VehicleSpecsProps> = ({ vehicle }) => {
  const [selectedCategory, setSelectedCategory] = useState("highlights");
  const [selectedGrade, setSelectedGrade] = useState<GradeOption | null>(null);
  const [compareGrade, setCompareGrade] = useState<GradeOption | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  // Sample grade options
  const gradeOptions: GradeOption[] = [
    {
      name: "SE",
      price: vehicle.price,
      image: "https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_01_800x447.jpg",
      features: [
        "17-inch alloy wheels",
        "Sport-tuned suspension",
        "Single-zone automatic climate control",
        "7-inch touchscreen",
        "Fabric-trimmed seats"
      ],
      specs: {
        engine: "2.5L 4-cylinder",
        power: "203 hp",
        torque: "184 lb-ft",
        transmission: "8-speed automatic",
        acceleration: "8.2 seconds (0-60)"
      }
    },
    {
      name: "XSE",
      price: vehicle.price + 3000,
      image: "https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_03_800x447.jpg",
      features: [
        "19-inch machined alloy wheels",
        "Dual exhaust with quad chrome tips",
        "Leather-trimmed seats",
        "9-inch touchscreen",
        "Dual-zone automatic climate control"
      ],
      specs: {
        engine: "2.5L 4-cylinder",
        power: "206 hp",
        torque: "186 lb-ft",
        transmission: "8-speed automatic",
        acceleration: "7.9 seconds (0-60)"
      }
    },
    {
      name: "XLE",
      price: vehicle.price + 2000,
      image: "https://global.toyota/pages/models/images/gallery/new_camry_23/design/design_02_800x447.jpg",
      features: [
        "18-inch machined alloy wheels",
        "LED headlights with integrated LED DRL",
        "Leather-trimmed seats",
        "Heated front seats",
        "7-inch Multi-Information Display"
      ],
      specs: {
        engine: "2.5L 4-cylinder",
        power: "203 hp",
        torque: "184 lb-ft",
        transmission: "8-speed automatic",
        acceleration: "8.1 seconds (0-60)"
      }
    },
    {
      name: "Hybrid SE",
      price: vehicle.price + 2500,
      image: "https://global.toyota/pages/models/images/gallery/new_camry_hybrid_23/design/design_01_800x447.jpg",
      features: [
        "18-inch black machined-finish alloy wheels",
        "Sport mesh front grille",
        "Normal, Eco, EV and Sport drive modes",
        "SofTex®-trimmed heated front seats",
        "8-inch touchscreen"
      ],
      specs: {
        engine: "2.5L 4-cylinder Hybrid",
        power: "208 hp (combined)",
        torque: "163 lb-ft",
        transmission: "ECVT",
        acceleration: "7.4 seconds (0-60)"
      }
    }
  ];

  // Select a default grade
  React.useEffect(() => {
    if (!selectedGrade && gradeOptions.length > 0) {
      setSelectedGrade(gradeOptions[0]);
    }
  }, []);

  const handleSelectGrade = (grade: GradeOption) => {
    setSelectedGrade(grade);
  };

  const handleCompareGrade = (grade: GradeOption) => {
    if (selectedGrade?.name === grade.name) return;
    
    setCompareGrade(grade);
    setShowComparison(true);
  };

  const clearComparison = () => {
    setCompareGrade(null);
    setShowComparison(false);
  };

  const handleSwapGrades = () => {
    if (compareGrade) {
      const temp = selectedGrade;
      setSelectedGrade(compareGrade);
      setCompareGrade(temp);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Settings className="mr-2 h-5 w-5 text-toyota-red" />
            Specifications & Grades
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Explore the technical specifications and available grades for the {vehicle.name}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "highlights" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("highlights")}
          >
            Highlights
          </Button>
          <Button
            variant={selectedCategory === "specs" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("specs")}
          >
            Full Specs
          </Button>
          <Button
            variant={selectedCategory === "grades" ? "default" : "outline"} 
            size="sm"
            onClick={() => setSelectedCategory("grades")}
          >
            Available Grades
          </Button>
        </div>
      </div>
      
      {selectedCategory === "highlights" && (
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="p-2 rounded-full bg-toyota-red/10 text-toyota-red mr-3">
                      <Fuel className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Engine</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Power & Torque</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engine Type</span>
                    <span className="font-medium">{selectedGrade?.specs.engine || "2.5L 4-cylinder"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Horsepower</span>
                    <span className="font-medium">{selectedGrade?.specs.power || "203 hp"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Torque</span>
                    <span className="font-medium">{selectedGrade?.specs.torque || "184 lb-ft"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="p-2 rounded-full bg-toyota-red/10 text-toyota-red mr-3">
                      <Calendar className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Performance</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Speed & Efficiency</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>0-60 mph</span>
                    <span className="font-medium">{selectedGrade?.specs.acceleration || "8.2 seconds"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fuel Economy (City)</span>
                    <span className="font-medium">28 mpg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Fuel Economy (Hwy)</span>
                    <span className="font-medium">39 mpg</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="p-2 rounded-full bg-toyota-red/10 text-toyota-red mr-3">
                      <BookOpen className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Dimensions</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Size & Capacity</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Length</span>
                    <span className="font-medium">192.1 in</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Width</span>
                    <span className="font-medium">72.4 in</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Height</span>
                    <span className="font-medium">56.9 in</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <span className="p-2 rounded-full bg-toyota-red/10 text-toyota-red mr-3">
                      <LifeBuoy className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Safety</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Protection & Assistance</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>NHTSA Overall Rating</span>
                    <span className="font-medium">5 Stars</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Airbags</span>
                    <span className="font-medium">10</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Safety Systems</span>
                    <span className="font-medium">Toyota Safety Sense 2.5+</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {selectedCategory === "specs" && (
        <div className="p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="engine">
              <AccordionTrigger>Engine Specifications</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Engine Type</span>
                      <span>{selectedGrade?.specs.engine || "2.5-liter Dynamic Force 4-Cylinder DOHC"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Horsepower</span>
                      <span>{selectedGrade?.specs.power || "203 hp @ 6,600 rpm"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Torque</span>
                      <span>{selectedGrade?.specs.torque || "184 lb.-ft. @ 5,000 rpm"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Compression Ratio</span>
                      <span>13.0:1</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Valve Train</span>
                      <span>16-Valve DOHC, VVT-iE & VVT-i</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Bore x Stroke</span>
                      <span>3.44 in. x 4.07 in.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Fuel System</span>
                      <span>D-4S Injection</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Induction System</span>
                      <span>Naturally Aspirated</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="drivetrain">
              <AccordionTrigger>Drivetrain</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transmission</span>
                      <span>{selectedGrade?.specs.transmission || "8-speed Electronically Controlled automatic"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Drive Type</span>
                      <span>Front-Wheel Drive</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Drive Modes</span>
                      <span>ECO, Normal, Sport</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Shift Paddles</span>
                      <span>Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Final Drive Ratio</span>
                      <span>2.937</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">AWD System</span>
                      <span>Available (Dynamic Torque Control)</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="body">
              <AccordionTrigger>Body & Chassis</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Construction</span>
                      <span>Unitized body with front and rear anti-vibration sub-frames</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Front Suspension</span>
                      <span>MacPherson strut</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Rear Suspension</span>
                      <span>Multi-link</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Front Stabilizer Bar</span>
                      <span>24.2 mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Rear Stabilizer Bar</span>
                      <span>25.0 mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Power Steering</span>
                      <span>Electric Power Steering (EPS)</span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}
      
      {selectedCategory === "grades" && (
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">Available Grades</h3>
          
          {/* Grade Selection Carousel */}
          <div className="mb-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {gradeOptions.map((grade) => (
                  <CarouselItem key={grade.name} className="md:basis-1/3 lg:basis-1/4">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className={`rounded-lg overflow-hidden border-2 cursor-pointer ${
                        selectedGrade?.name === grade.name ? "border-toyota-red" : "border-transparent"
                      }`}
                      onClick={() => handleSelectGrade(grade)}
                    >
                      <div className="relative h-36">
                        <img
                          src={grade.image}
                          alt={`${vehicle.name} ${grade.name}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-3">
                          <h4 className="text-white font-bold text-lg">{grade.name}</h4>
                          <p className="text-white/90 text-sm">
                            ${grade.price.toLocaleString()}
                          </p>
                        </div>
                        {selectedGrade?.name === grade.name && (
                          <div className="absolute top-2 right-2 bg-toyota-red text-white p-1 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-4 gap-2">
                <CarouselPrevious className="relative inset-auto" />
                <CarouselNext className="relative inset-auto" />
              </div>
            </Carousel>
          </div>
          
          {selectedGrade && (
            <>
              <div className={`grid ${showComparison ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-8`}>
                {/* Selected Grade Details */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{selectedGrade.name} Grade</h3>
                      <p className="text-gray-500 dark:text-gray-400">Starting at ${selectedGrade.price.toLocaleString()}</p>
                    </div>
                    
                    {!showComparison && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowComparison(true)}
                      >
                        Compare Grades
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="rounded-lg overflow-hidden mb-4">
                    <img 
                      src={selectedGrade.image} 
                      alt={`${vehicle.name} ${selectedGrade.name}`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  
                  <Tabs defaultValue="features">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="features">Key Features</TabsTrigger>
                      <TabsTrigger value="specs">Specifications</TabsTrigger>
                    </TabsList>
                    <TabsContent value="features" className="pt-4">
                      <ul className="space-y-2">
                        {selectedGrade.features.map((feature, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-start"
                          >
                            <span className="flex-shrink-0 mt-1 mr-3 p-1 bg-toyota-red/10 rounded-full text-toyota-red">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </span>
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </TabsContent>
                    <TabsContent value="specs" className="pt-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Engine</span>
                            <span className="font-medium">{selectedGrade.specs.engine}</span>
                          </div>
                          <Progress value={80} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Horsepower</span>
                            <span className="font-medium">{selectedGrade.specs.power}</span>
                          </div>
                          <Progress value={70} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Torque</span>
                            <span className="font-medium">{selectedGrade.specs.torque}</span>
                          </div>
                          <Progress value={65} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">Transmission</span>
                            <span className="font-medium">{selectedGrade.specs.transmission}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-gray-400">0-60 mph</span>
                            <span className="font-medium">{selectedGrade.specs.acceleration}</span>
                          </div>
                          <Progress value={75} className="h-1" />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Grade Comparison */}
                {showComparison && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        {compareGrade ? (
                          <>
                            <h3 className="text-xl font-bold">{compareGrade.name} Grade</h3>
                            <p className="text-gray-500 dark:text-gray-400">Starting at ${compareGrade.price.toLocaleString()}</p>
                          </>
                        ) : (
                          <h3 className="text-xl font-bold">Select a grade to compare</h3>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {compareGrade && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleSwapGrades}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17 1l4 4-4 4"></path>
                              <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                              <path d="M7 23l-4-4 4-4"></path>
                              <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                            </svg>
                            <span className="sr-only">Swap</span>
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={clearComparison}
                        >
                          <ChevronDown className="h-4 w-4" />
                          Close
                        </Button>
                      </div>
                    </div>
                    
                    {compareGrade ? (
                      <>
                        <div className="rounded-lg overflow-hidden mb-4">
                          <img 
                            src={compareGrade.image} 
                            alt={`${vehicle.name} ${compareGrade.name}`}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                        
                        <Tabs defaultValue="features">
                          <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="features">Key Features</TabsTrigger>
                            <TabsTrigger value="specs">Specifications</TabsTrigger>
                          </TabsList>
                          <TabsContent value="features" className="pt-4">
                            <ul className="space-y-2">
                              {compareGrade.features.map((feature, index) => (
                                <motion.li 
                                  key={index}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="flex items-start"
                                >
                                  <span className="flex-shrink-0 mt-1 mr-3 p-1 bg-toyota-red/10 rounded-full text-toyota-red">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                  </span>
                                  <span>{feature}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </TabsContent>
                          <TabsContent value="specs" className="pt-4">
                            <div className="space-y-3">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600 dark:text-gray-400">Engine</span>
                                  <span className="font-medium">{compareGrade.specs.engine}</span>
                                </div>
                                <Progress value={80} className="h-1" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600 dark:text-gray-400">Horsepower</span>
                                  <span className="font-medium">{compareGrade.specs.power}</span>
                                </div>
                                <Progress value={70} className="h-1" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600 dark:text-gray-400">Torque</span>
                                  <span className="font-medium">{compareGrade.specs.torque}</span>
                                </div>
                                <Progress value={65} className="h-1" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600 dark:text-gray-400">Transmission</span>
                                  <span className="font-medium">{compareGrade.specs.transmission}</span>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-gray-600 dark:text-gray-400">0-60 mph</span>
                                  <span className="font-medium">{compareGrade.specs.acceleration}</span>
                                </div>
                                <Progress value={75} className="h-1" />
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </>
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-6 h-[400px] flex flex-col items-center justify-center">
                        <p className="text-gray-500 dark:text-gray-400 mb-4 text-center">
                          Select another grade from the carousel to compare with {selectedGrade.name}.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-2 w-full max-w-md">
                          {gradeOptions
                            .filter(grade => grade.name !== selectedGrade.name)
                            .map((grade) => (
                              <Button
                                key={grade.name}
                                variant="outline"
                                onClick={() => handleCompareGrade(grade)}
                              >
                                {grade.name}
                              </Button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleSpecs;
