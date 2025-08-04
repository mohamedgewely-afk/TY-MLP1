
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
  Sparkles,
  ArrowUpDown,
  X,
  Plus,
  Minus
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDeviceInfo } from "@/hooks/use-device-info";
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
      ease: [0.25, 0.1, 0.25, 1.0]
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
      ease: [0.77, 0, 0.175, 1]
    }
  }
};

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [selectedGrades, setSelectedGrades] = useState<number[]>([0]);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const isMobile = useIsMobile();
  const { deviceCategory } = useDeviceInfo();
  const { toast } = useToast();

  // Determine max grades based on device
  const maxGrades = ['smallMobile', 'standardMobile', 'largeMobile', 'extraLargeMobile'].includes(deviceCategory) ? 2 : 3;

  const engines = [
    {
      name: "2.5L Hybrid",
      power: "218 HP",
      torque: "221 lb-ft", 
      efficiency: "25.2 km/L",
      description: "Advanced hybrid powertrain with seamless electric assist",
      brandColor: "from-neutral-900 via-neutral-800 to-neutral-700",
      accentColor: "bg-neutral-900",
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
      brandColor: "from-red-600 via-red-500 to-orange-500",
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

  const handleEngineChange = (engineName: string) => {
    setSelectedEngine(engineName);
    setSelectedGrades([0]);
    setComparisonMode(false);
    setImageLoading({});
    
    toast({
      title: "Engine Selected",
      description: `Switched to ${engineName} - Available grades updated`,
    });
  };

  const handleGradeToggle = (gradeIndex: number) => {
    if (selectedGrades.includes(gradeIndex)) {
      setSelectedGrades(prev => prev.filter(i => i !== gradeIndex));
    } else if (selectedGrades.length < maxGrades) {
      setSelectedGrades(prev => [...prev, gradeIndex]);
    } else {
      toast({
        title: "Maximum Reached",
        description: `You can compare up to ${maxGrades} grades at once.`,
      });
    }
  };

  const handleComparisonModeToggle = () => {
    if (selectedGrades.length < 2) {
      toast({
        title: "Select More Grades",
        description: "Please select at least 2 grades to compare.",
      });
      return;
    }
    setComparisonMode(!comparisonMode);
  };

  const handleImageLoad = (gradeIndex: number) => {
    setImageLoading(prev => ({ ...prev, [gradeIndex]: false }));
  };

  const handleImageLoadStart = (gradeIndex: number) => {
    setImageLoading(prev => ({ ...prev, [gradeIndex]: true }));
  };

  const clearComparison = () => {
    setSelectedGrades([0]);
    setComparisonMode(false);
  };

  const renderGradeCard = (grade: any, gradeIndex: number, isSelected: boolean) => {
    const isLoading = imageLoading[gradeIndex];
    
    return (
      <motion.div
        key={`${selectedEngine}-${gradeIndex}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: gradeIndex * 0.1 }}
        className={`relative ${isMobile ? 'min-w-0' : ''}`}
      >
        <Card className={`overflow-hidden transition-all duration-300 h-full ${
          isSelected 
            ? 'ring-2 ring-primary shadow-xl border-primary/50' 
            : 'border-border hover:border-primary/30 hover:shadow-lg'
        }`}>
          {/* Selection Toggle */}
          <div className="absolute top-3 right-3 z-20">
            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              className={`rounded-full p-2 transition-all duration-300 ${
                isSelected 
                  ? 'bg-primary text-primary-foreground shadow-lg' 
                  : 'bg-white/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground'
              }`}
              onClick={() => handleGradeToggle(gradeIndex)}
              style={{ minWidth: '44px', minHeight: '44px' }}
            >
              {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>

          {/* Grade Header */}
          <div className={`bg-gradient-to-r ${currentEngineData.brandColor} text-white relative overflow-hidden ${isMobile ? 'p-4' : 'p-6'}`}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'}`}>
                  {grade.name}
                </h4>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {grade.highlight}
                </Badge>
              </div>
              <p className={`text-white/90 mb-4 ${isMobile ? 'text-sm' : 'text-base'}`}>
                {grade.description}
              </p>
              
              <div className="pt-3 border-t border-white/20">
                <div className={`font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                  AED {grade.fullPrice.toLocaleString()}
                </div>
                <div className={`text-white/80 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  From AED {grade.monthlyEMI}/month
                </div>
              </div>
            </div>
          </div>

          <CardContent className="p-0">
            {/* Grade Image */}
            <div className={`relative overflow-hidden ${isMobile ? 'h-48' : 'h-64'}`}>
              <AnimatePresence>
                {isLoading && (
                  <motion.div 
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gradient-to-r from-muted via-muted/50 to-muted animate-pulse flex items-center justify-center"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full mx-auto mb-2"
                      />
                      <div className="text-muted-foreground font-medium">Loading...</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <img
                src={grade.image}
                alt={`${grade.name} Grade`}
                className={`w-full h-full object-cover transition-opacity duration-500 cursor-pointer ${
                  isLoading ? 'opacity-0' : 'opacity-100'
                }`}
                loading="lazy"
                onLoadStart={() => handleImageLoadStart(gradeIndex)}
                onLoad={() => handleImageLoad(gradeIndex)}
                onError={() => handleImageLoad(gradeIndex)}
              />
            </div>

            {/* Grade Content */}
            <div className={isMobile ? 'p-4' : 'p-6'}>
              {/* Key Features */}
              <div className="mb-6">
                <h5 className={`font-bold text-foreground mb-3 ${isMobile ? 'text-sm' : 'text-base'}`}>
                  Key Features
                </h5>
                <div className="space-y-2">
                  {grade.features.slice(0, 3).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  size={isMobile ? "sm" : "default"}
                  style={{ minHeight: '44px' }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Spec
                </Button>
                <Button
                  className={`w-full bg-gradient-to-r ${currentEngineData.brandColor}`}
                  size={isMobile ? "sm" : "default"}
                  style={{ minHeight: '44px' }}
                >
                  <Wrench className="h-4 w-4 mr-2" />
                  Configure Grade
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
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
            Select your preferred engine and compare grades side-by-side.
          </p>
        </motion.div>

        {/* Step 1: Engine Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Step 1: Choose Your Powertrain</h3>
          
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
                style={{ minHeight: '44px' }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] h-full relative overflow-hidden ${
                    selectedEngine === engine.name
                      ? 'border-2 border-primary shadow-xl ring-4 ring-primary/20'
                      : 'border border-border hover:border-primary/50 hover:shadow-lg'
                  }`}
                  onClick={() => handleEngineChange(engine.name)}
                  style={{ minHeight: '44px' }}
                >
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

        {/* Step 2: Grade Selection & Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">
              Step 2: Select & Compare Grades
            </h3>
            
            {/* Comparison Controls */}
            <div className="flex items-center space-x-4">
              {selectedGrades.length > 0 && (
                <Badge variant="secondary" className="px-3 py-1">
                  {selectedGrades.length} selected
                </Badge>
              )}
              
              {selectedGrades.length > 1 && (
                <Button
                  variant={comparisonMode ? "default" : "outline"}
                  size="sm"
                  onClick={handleComparisonModeToggle}
                  className="transition-all duration-300"
                  style={{ minHeight: '44px' }}
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  {comparisonMode ? 'Exit Compare' : 'Compare'}
                </Button>
              )}
              
              {selectedGrades.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearComparison}
                  style={{ minHeight: '44px' }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Grade Display */}
          <div className={`grid gap-6 ${
            comparisonMode && selectedGrades.length > 1
              ? (isMobile ? 'grid-cols-1' : `grid-cols-${Math.min(selectedGrades.length, maxGrades)}`)
              : (isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3')
          }`}>
            {comparisonMode && selectedGrades.length > 1
              ? selectedGrades.map(gradeIndex => 
                  renderGradeCard(currentGrades[gradeIndex], gradeIndex, true)
                )
              : currentGrades.map((grade, gradeIndex) => 
                  renderGradeCard(grade, gradeIndex, selectedGrades.includes(gradeIndex))
                )
            }
          </div>

          {/* Mobile Swipe Indicator */}
          {isMobile && !comparisonMode && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex justify-center mt-6"
            >
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur text-muted-foreground">
                <motion.div
                  animate={{ x: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-primary"
                />
                <span className="text-xs font-medium">Tap + to select grades for comparison</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
