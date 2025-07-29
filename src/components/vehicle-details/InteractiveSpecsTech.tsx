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

        {/* Fixed Mobile Engine Selection - Force Side by Side */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Step 1: Choose Your Engine</h3>
          
          {/* Fixed Grid - Always 2 columns on mobile and larger screens */}
          <div className="grid grid-cols-2 gap-3 md:gap-6 max-w-6xl mx-auto">
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
                  
                  <CardContent className={`${isMobile ? 'p-3' : 'p-6 lg:p-8'} relative z-10`}>
                    <div className={`flex items-center justify-between mb-4 ${isMobile ? 'mb-3' : ''}`}>
                      <div className={`flex items-center space-x-2 ${isMobile ? 'space-x-1' : ''}`}>
                        <div className={`p-2 md:p-3 rounded-xl transition-all duration-300 ${
                          selectedEngine === engine.name 
                            ? 'bg-primary/20 text-primary shadow-lg' 
                            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
                        }`}>
                          <Car className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'}`} />
                        </div>
                        <h4 className={`font-bold ${isMobile ? 'text-sm' : 'text-xl lg:text-2xl'}`}>
                          {engine.name}
                        </h4>
                      </div>
                      
                      {selectedEngine === engine.name && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          className={`p-1.5 md:p-2 bg-green-500 text-white rounded-full`}
                        >
                          <Check className={`${isMobile ? 'h-3 w-3' : 'h-5 w-5'}`} />
                        </motion.div>
                      )}
                    </div>
                    
                    <p className={`text-muted-foreground mb-4 ${isMobile ? 'text-xs mb-3' : 'text-sm lg:text-base mb-6'}`}>
                      {engine.description}
                    </p>
                    
                    {/* Compact Performance metrics for mobile */}
                    <div className={`grid grid-cols-1 gap-2 mb-4 ${isMobile ? 'gap-1 mb-3' : 'grid-cols-3 gap-4 mb-6'}`}>
                      <div className={`text-center p-2 md:p-4 bg-muted/30 rounded-lg ${isMobile ? 'flex justify-between items-center' : ''}`}>
                        <div className={`font-bold text-primary ${isMobile ? 'text-sm' : 'text-lg lg:text-xl mb-1'}`}>
                          {engine.power}
                        </div>
                        <div className={`text-xs text-muted-foreground uppercase tracking-wider ${isMobile ? '' : 'mb-1'}`}>
                          Power
                        </div>
                      </div>
                      
                      <div className={`text-center p-2 md:p-4 bg-muted/30 rounded-lg ${isMobile ? 'flex justify-between items-center' : ''}`}>
                        <div className={`font-bold text-primary ${isMobile ? 'text-sm' : 'text-lg lg:text-xl mb-1'}`}>
                          {engine.torque}
                        </div>
                        <div className={`text-xs text-muted-foreground uppercase tracking-wider ${isMobile ? '' : 'mb-1'}`}>
                          Torque
                        </div>
                      </div>
                      
                      <div className={`text-center p-2 md:p-4 bg-muted/30 rounded-lg ${isMobile ? 'flex justify-between items-center' : ''}`}>
                        <div className={`font-bold text-primary ${isMobile ? 'text-sm' : 'text-lg lg:text-xl mb-1'}`}>
                          {engine.efficiency}
                        </div>
                        <div className={`text-xs text-muted-foreground uppercase tracking-wider ${isMobile ? '' : 'mb-1'}`}>
                          Efficiency
                        </div>
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

        {/* Super Premium Grade Selection Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">
            Step 2: Available Grades for {selectedEngine}
          </h3>

          {/* Ultra Premium Cinematic Carousel */}
          <div className="relative">
            {/* Premium Navigation Buttons */}
            <motion.button
              onClick={prevGrade}
              whileHover={{ scale: 1.15, x: -4 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-30 rounded-full bg-gradient-to-br from-white via-white to-gray-50 backdrop-blur-xl shadow-2xl border-2 border-white/20 hover:shadow-3xl hover:border-primary/20 transition-all duration-500 ${
                isMobile ? 'p-3 -translate-x-2' : 'p-5 -translate-x-6'
              } hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:text-white group`}
              style={{
                ...elevationAnimation(),
                filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
              }}
            >
              <ChevronLeft className={`${isMobile ? 'h-5 w-5' : 'h-7 w-7'} transition-transform duration-300 group-hover:-translate-x-0.5`} />
            </motion.button>
            
            <motion.button
              onClick={nextGrade}
              whileHover={{ scale: 1.15, x: 4 }}
              whileTap={{ scale: 0.9 }}
              className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-30 rounded-full bg-gradient-to-br from-white via-white to-gray-50 backdrop-blur-xl shadow-2xl border-2 border-white/20 hover:shadow-3xl hover:border-primary/20 transition-all duration-500 ${
                isMobile ? 'p-3 translate-x-2' : 'p-5 translate-x-6'
              } hover:bg-gradient-to-br hover:from-primary hover:to-primary/80 hover:text-white group`}
              style={{
                ...elevationAnimation(),
                filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
              }}
            >
              <ChevronRight className={`${isMobile ? 'h-5 w-5' : 'h-7 w-7'} transition-transform duration-300 group-hover:translate-x-0.5`} />
            </motion.button>

            {/* Ultra Premium Grade Card */}
            <div 
              ref={swipeableRef}
              className={`${isMobile ? 'mx-6' : 'mx-16'} touch-manipulation`}
              style={{ touchAction: 'pan-y pinch-zoom' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedEngine}-${currentGradeIndex}`}
                  initial={{ opacity: 0, x: 100, rotateY: 15, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, rotateY: -15, scale: 0.95 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.77, 0, 0.175, 1] 
                  }}
                  style={{ perspective: '1200px' }}
                >
                  <Card className={`overflow-hidden border-0 bg-gradient-to-br from-white via-gray-50/50 to-white shadow-2xl backdrop-blur-sm ring-1 ring-black/5 ${
                    isMobile ? 'w-full' : 'max-w-6xl mx-auto'
                  }`}
                  style={{
                    boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  }}>
                    <CardContent className="p-0 relative overflow-hidden">
                      {/* Ultra Premium Header with Cinematic Gradient */}
                      <div className={`relative overflow-hidden ${isMobile ? 'p-4' : 'p-8'}`}
                        style={{
                          background: `linear-gradient(135deg, 
                            hsl(var(--primary)) 0%, 
                            hsl(var(--primary) / 0.95) 25%,
                            hsl(var(--primary) / 0.9) 50%,
                            hsl(var(--primary) / 0.85) 75%,
                            hsl(var(--primary) / 0.8) 100%)`
                        }}
                      >
                        {/* Premium Animated Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5" />
                          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-white/10 to-transparent rounded-full transform translate-x-32 -translate-y-32" />
                          <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-radial from-white/5 to-transparent rounded-full transform -translate-x-24 translate-y-24" />
                        </div>
                        
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <motion.h4 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className={`font-black text-white ${isMobile ? 'text-2xl' : 'text-4xl lg:text-5xl'}`}
                              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                            >
                              {currentGrade.name}
                            </motion.h4>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <Badge className="bg-white/25 backdrop-blur-sm text-white border-white/30 font-bold px-4 py-2 text-sm shadow-lg">
                                {currentGrade.highlight}
                              </Badge>
                            </motion.div>
                          </div>
                          
                          <motion.p 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className={`text-white/95 mb-6 font-medium ${isMobile ? 'text-sm' : 'text-lg'}`}
                          >
                            {currentGrade.description}
                          </motion.p>
                          
                          {/* Ultra Premium Pricing Section */}
                          <motion.div 
                            className="pt-6 border-t border-white/20"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={`font-black text-white mb-2 ${isMobile ? 'text-3xl' : 'text-5xl'}`}
                                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                  AED {currentGrade.fullPrice.toLocaleString()}
                                </div>
                                <div className={`text-white/85 font-medium ${isMobile ? 'text-sm' : 'text-lg'}`}>
                                  Starting from AED {currentGrade.monthlyEMI}/month
                                </div>
                              </div>
                              <motion.div 
                                className="text-right"
                                whileHover={{ scale: 1.05 }}
                              >
                                <div className={`text-white/70 ${isMobile ? 'text-xs' : 'text-sm'} mb-1`}>
                                  Monthly EMI
                                </div>
                                <div className={`font-bold text-white ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                                  {currentGrade.monthlyEMI}
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        </div>
                      </div>

                      {/* Premium Content */}
                      <div className={isMobile ? 'p-4' : 'p-8'}>
                        {/* Premium Grade Image */}
                        <div className={`mb-8 rounded-2xl overflow-hidden relative ${isMobile ? 'mb-6' : ''}`}
                          style={{
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                          }}>
                          {imageLoading && (
                            <div className={`absolute inset-0 bg-gradient-to-r from-muted via-primary/5 to-muted flex items-center justify-center ${
                              isMobile ? 'h-64' : 'h-80 lg:h-96'
                            }`}>
                              <motion.div 
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-muted-foreground font-medium"
                              >
                                Loading premium experience...
                              </motion.div>
                            </div>
                          )}
                          <motion.img
                            src={currentGrade.image}
                            alt={`${currentGrade.name} Grade`}
                            className={`w-full object-cover object-center transition-all duration-700 ${
                              isMobile ? 'h-64' : 'h-80 lg:h-96'
                            }`}
                            loading="lazy"
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>

                        {/* Enhanced Content Grid */}
                        <div className={`grid gap-8 ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-2'}`}>
                          <div>
                            <h5 className={`font-bold text-foreground mb-6 flex items-center gap-3 ${isMobile ? 'text-lg mb-4' : 'text-xl'}`}>
                              <div className="p-2 bg-primary/10 rounded-lg">
                                <Check className="h-5 w-5 text-primary" />
                              </div>
                              Key Features
                            </h5>
                            <div className="space-y-4">
                              {currentGrade.features.map((feature, idx) => (
                                <motion.div 
                                  key={feature} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                  className="flex items-center space-x-4 p-3 rounded-xl bg-gradient-to-r from-muted/30 to-transparent border border-muted/50 hover:border-primary/20 transition-all duration-300"
                                >
                                  <div className="p-1.5 bg-green-500/10 rounded-full">
                                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                  </div>
                                  <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{feature}</span>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="specifications" className="border-none">
                                <AccordionTrigger className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold hover:no-underline p-4 bg-gradient-to-r from-muted/20 to-transparent rounded-xl mb-2`}>
                                  <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                      <Settings className="h-5 w-5 text-primary" />
                                    </div>
                                    <span>Full Specifications</span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-0">
                                  <div className={`grid grid-cols-1 gap-4 pt-4 ${isMobile ? 'text-sm' : ''}`}>
                                    <div className="space-y-4">
                                      {Object.entries(currentGrade.specs).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors duration-200">
                                          <span className="text-muted-foreground font-medium capitalize">
                                            {key.replace(/([A-Z])/g, ' $1')}
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
                        </div>

                        {/* Premium Action Buttons */}
                        <div className={`grid gap-4 mt-10 ${isMobile ? 'grid-cols-1 mt-8' : 'md:grid-cols-2'}`}>
                          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => handleDownloadSpec(currentGrade.name)}
                              variant="outline"
                              className={`w-full hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50 hover:bg-primary/5 font-semibold ${
                                isMobile ? 'h-12 text-sm' : 'h-14 text-base lg:text-lg'
                              }`}
                              style={elevationAnimation()}
                            >
                              <Download className={`mr-3 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
                              Download Spec Sheet
                            </Button>
                          </motion.div>
                          
                          <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                            <Button
                              onClick={() => handleConfigure(currentGrade.name)}
                              className={`w-full bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/90 hover:via-primary/95 hover:to-primary shadow-xl hover:shadow-2xl transition-all duration-300 font-bold ${
                                isMobile ? 'h-12 text-sm' : 'h-14 text-base lg:text-lg'
                              }`}
                              style={{
                                ...elevationAnimation(),
                                boxShadow: '0 10px 25px -5px rgba(var(--primary) / 0.3), 0 4px 6px -2px rgba(var(--primary) / 0.1)'
                              }}
                            >
                              <Wrench className={`mr-3 ${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
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

            {/* Premium Indicators */}
            <div className="flex justify-center space-x-3 mt-10">
              {currentGrades.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setCurrentGradeIndex(index);
                    setImageLoading(true);
                    hapticFeedback('light');
                  }}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`rounded-full transition-all duration-500 shadow-lg ${
                    index === currentGradeIndex 
                      ? 'bg-gradient-to-r from-primary to-primary/80 w-10 h-4 shadow-primary/30' 
                      : 'bg-muted-foreground/20 w-4 h-4 hover:bg-muted-foreground/40 hover:shadow-md'
                  } ${isMobile ? 'min-w-[48px] min-h-[48px] flex items-center justify-center' : ''}`}
                >
                  {isMobile && (
                    <div className={`rounded-full transition-all duration-300 ${
                      index === currentGradeIndex 
                        ? 'bg-gradient-to-r from-primary to-primary/80 w-8 h-3' 
                        : 'bg-muted-foreground/30 w-3 h-3'
                    }`} />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Enhanced Mobile Swipe Indicator */}
            {isMobile && (
              <motion.div 
                className="flex justify-center mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <div className="flex items-center space-x-2 bg-muted/50 backdrop-blur-sm rounded-full px-6 py-3 border border-muted/20">
                  <motion.div
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ←
                  </motion.div>
                  <span className="text-xs text-muted-foreground font-medium">Swipe to navigate grades</span>
                  <motion.div
                    animate={{ x: [2, -2, 2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    →
                  </motion.div>
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
