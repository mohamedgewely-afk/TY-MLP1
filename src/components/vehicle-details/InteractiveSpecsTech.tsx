
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
  X,
  Zap,
  Gauge
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { useToast } from "@/hooks/use-toast";
import GradeComparisonModal from "./GradeComparisonModal";

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
  const currentGrade = currentGrades[currentGradeIndex];

  const handleEngineChange = (engineName: string) => {
    setSelectedEngine(engineName);
    setCurrentGradeIndex(0);
    setImageLoading({});
    
    toast({
      title: "Engine Selected",
      description: `Switched to ${engineName} - Available grades updated`,
    });
  };

  const nextGrade = () => {
    setCurrentGradeIndex((prev) => (prev + 1) % currentGrades.length);
  };

  const prevGrade = () => {
    setCurrentGradeIndex((prev) => (prev - 1 + currentGrades.length) % currentGrades.length);
  };

  const selectCurrentGrade = () => {
    setSelectedGrade(currentGrade.name);
    toast({
      title: "Grade Selected",
      description: `${currentGrade.name} has been selected`,
    });
  };

  const handleImageLoad = (gradeIndex: number) => {
    setImageLoading(prev => ({ ...prev, [gradeIndex]: false }));
  };

  const handleImageLoadStart = (gradeIndex: number) => {
    setImageLoading(prev => ({ ...prev, [gradeIndex]: true }));
  };

  const openComparisonModal = () => {
    setShowComparisonModal(true);
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

        {/* Step 2: Grade Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">
              Step 2: Choose Your Grade
            </h3>
            
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={openComparisonModal}
                className="transition-all duration-300"
                style={{ minHeight: '44px' }}
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Compare Grades
              </Button>
            </div>
          </div>

          {/* Grade Carousel */}
          <div className="relative max-w-2xl mx-auto">
            {/* Navigation Buttons */}
            <button
              onClick={prevGrade}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all -translate-x-4"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              onClick={nextGrade}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all translate-x-4"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Grade Card */}
            <div className="mx-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${currentGradeIndex}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ 
                    duration: 0.5, 
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
                    <CardContent className="p-0">
                      {/* Header */}
                      <div className={`bg-gradient-to-r ${currentEngineData.brandColor} text-white p-4 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/10" />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12" />
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xl lg:text-2xl font-bold">{currentGrade.name}</h4>
                            <Badge className="bg-white/20 text-white border-white/30 text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              {currentGrade.highlight}
                            </Badge>
                          </div>
                          <p className="text-white/90 text-sm mb-3">{currentGrade.description}</p>
                          
                          <div className="pt-3 border-t border-white/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-2xl lg:text-3xl font-bold">
                                  AED {currentGrade.fullPrice.toLocaleString()}
                                </div>
                                <div className="text-white/80 text-sm">From AED {currentGrade.monthlyEMI}/month</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Grade Image */}
                      <div className="relative overflow-hidden h-64 lg:h-80">
                        <img
                          src={currentGrade.image}
                          alt={`${currentGrade.name} Grade`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onLoadStart={() => handleImageLoadStart(currentGradeIndex)}
                          onLoad={() => handleImageLoad(currentGradeIndex)}
                          onError={() => handleImageLoad(currentGradeIndex)}
                        />
                      </div>

                      {/* Content */}
                      <div className="p-4 lg:p-6">
                        {/* Key Features */}
                        <div className="mb-6">
                          <h5 className="font-bold text-foreground mb-3">Key Features</h5>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                            {currentGrade.features.map((feature: string, idx: number) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                          <Button
                            onClick={selectCurrentGrade}
                            className={`transition-all duration-300 ${
                              selectedGrade === currentGrade.name
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : `bg-gradient-to-r ${currentEngineData.brandColor}`
                            }`}
                            style={{ minHeight: '44px' }}
                          >
                            {selectedGrade === currentGrade.name ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Selected
                              </>
                            ) : (
                              'Select Grade'
                            )}
                          </Button>
                          
                          <Button
                            variant="outline"
                            style={{ minHeight: '44px' }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Spec
                          </Button>
                          
                          <Button
                            variant="outline"
                            style={{ minHeight: '44px' }}
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
            <div className="flex justify-center space-x-2 mt-6">
              {currentGrades.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGradeIndex(index)}
                  className={`rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    index === currentGradeIndex 
                      ? 'bg-primary w-8 h-3' 
                      : 'bg-gray-300 w-3 h-3 hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Grade Comparison Modal */}
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
