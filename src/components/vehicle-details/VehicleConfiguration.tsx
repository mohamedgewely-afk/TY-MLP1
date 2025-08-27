import React, { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleModel } from "@/types/vehicle";
import { 
  ChevronLeft, ChevronRight, Check, Zap, Fuel, Settings,
  ArrowUpDown, Star, Car, Wrench
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { contextualHaptic } from "@/utils/haptic";
import { enhancedVariants, springConfigs } from "@/utils/animation-configs";
import VehicleGradeComparison from "./VehicleGradeComparison";
import MobileGradeCard from "./MobileGradeCard";
import SwipeableGradeCarousel from "./SwipeableGradeCarousel";

interface VehicleConfigurationProps {
  vehicle: VehicleModel;
  onCarBuilder?: (grade?: string) => void;
  onTestDrive?: () => void;
  onGradeSelect?: (grade: string) => void;
}

const VehicleConfiguration: React.FC<VehicleConfigurationProps> = ({ 
  vehicle, 
  onCarBuilder,
  onTestDrive,
  onGradeSelect 
}) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [selectedGrade, setSelectedGrade] = useState(0);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isGradeLoading, setIsGradeLoading] = useState(false);
  const isMobile = useIsMobile();
  const { deviceCategory } = useDeviceInfo();

  const engines = [
    {
      name: "2.5L Hybrid",
      description: "Advanced hybrid powertrain with seamless electric assist",
      shortDescription: "Hybrid efficiency",
      power: "218 HP",
      efficiency: "25.2 km/L",
      icon: <Zap className="h-6 w-6" />,
      selected: selectedEngine === "2.5L Hybrid"
    },
    {
      name: "3.5L V6",
      description: "Powerful V6 engine for enhanced performance",
      shortDescription: "V6 performance", 
      power: "301 HP",
      efficiency: "18.4 km/L",
      icon: <Fuel className="h-6 w-6" />,
      selected: selectedEngine === "3.5L V6"
    }
  ];

  const grades = useMemo(() => {
    if (selectedEngine === "2.5L Hybrid") {
      return [
        {
          name: "Hybrid SE",
          description: "Sport-enhanced hybrid driving experience",
          price: 94900,
          monthlyFrom: 945,
          badge: "Balanced Choice",
          badgeColor: "bg-yellow-500",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
          features: [
            "Hybrid Drive Modes",
            "Enhanced Audio",
            "Sport Seats", 
            "18\" Alloy Wheels"
          ],
          specs: {
            engine: "2.5L Hybrid",
            power: "218 HP",
            torque: "221 Nm",
            transmission: "eCVT",
            acceleration: "8.7 seconds",
            fuelEconomy: "25.2 km/L"
          }
        },
        {
          name: "Hybrid XLE",
          description: "Premium hybrid with advanced features",
          price: 105900,
          monthlyFrom: 1059,
          badge: "Most Popular",
          badgeColor: "bg-primary",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
          features: [
            "Premium Sound System",
            "Leather-trimmed Interior",
            "Wireless Charging",
            "Panoramic Moonroof"
          ],
          specs: {
            engine: "2.5L Hybrid",
            power: "218 HP",
            torque: "221 Nm",
            transmission: "eCVT",
            acceleration: "8.7 seconds",
            fuelEconomy: "25.2 km/L"
          }
        },
        {
          name: "Hybrid Limited",
          description: "Top-tier luxury hybrid experience",
          price: 118900,
          monthlyFrom: 1189,
          badge: "Premium",
          badgeColor: "bg-gray-800",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
          features: [
            "JBL Premium Audio",
            "Ventilated Seats",
            "Head-up Display",
            "Advanced Safety Suite"
          ],
          specs: {
            engine: "2.5L Hybrid",
            power: "218 HP",
            torque: "221 Nm",
            transmission: "eCVT",
            acceleration: "8.7 seconds",
            fuelEconomy: "25.2 km/L"
          }
        }
      ];
    } else {
      return [
        {
          name: "V6 SE",
          description: "Sport-enhanced V6 performance",
          price: 99900,
          monthlyFrom: 999,
          badge: "Performance",
          badgeColor: "bg-red-500",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
          features: [
            "V6 Power",
            "Sport Suspension",
            "Performance Tires", 
            "19\" Alloy Wheels"
          ],
          specs: {
            engine: "3.5L V6",
            power: "301 HP",
            torque: "362 Nm",
            transmission: "8-Speed Auto",
            acceleration: "6.6 seconds",
            fuelEconomy: "18.4 km/L"
          }
        },
        {
          name: "V6 XLE",
          description: "Premium V6 with luxury features",
          price: 110900,
          monthlyFrom: 1109,
          badge: "Most Popular",
          badgeColor: "bg-primary",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
          features: [
            "Premium Sound System",
            "Leather-trimmed Interior",
            "Performance Brakes",
            "Panoramic Moonroof"
          ],
          specs: {
            engine: "3.5L V6",
            power: "301 HP",
            torque: "362 Nm",
            transmission: "8-Speed Auto",
            acceleration: "6.6 seconds",
            fuelEconomy: "18.4 km/L"
          }
        },
        {
          name: "V6 Limited",
          description: "Ultimate V6 luxury experience",
          price: 123900,
          monthlyFrom: 1239,
          badge: "Premium",
          badgeColor: "bg-gray-800",
          image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
          features: [
            "JBL Premium Audio",
            "Ventilated Seats",
            "Head-up Display",
            "Advanced Safety Suite"
          ],
          specs: {
            engine: "3.5L V6",
            power: "301 HP",
            torque: "362 Nm",
            transmission: "8-Speed Auto",
            acceleration: "6.6 seconds",
            fuelEconomy: "18.4 km/L"
          }
        }
      ];
    }
  }, [selectedEngine]);

  // Safe access to current grade with bounds checking
  const currentGrade = useMemo(() => {
    if (!grades || grades.length === 0) return null;
    if (selectedGrade < 0 || selectedGrade >= grades.length) return grades[0];
    return grades[selectedGrade];
  }, [grades, selectedGrade]);

  const handleEngineChange = useCallback(async (engineName: string) => {
    if (engineName === selectedEngine) return;
    
    setIsGradeLoading(true);
    setSelectedEngine(engineName);
    
    // Reset grade selection immediately to prevent out-of-bounds access
    setSelectedGrade(0);
    
    // Small delay to allow for smooth transition
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsGradeLoading(false);
    
    contextualHaptic.selectionChange();
  }, [selectedEngine]);

  const handleGradeChange = useCallback((gradeIndex: number) => {
    if (gradeIndex >= 0 && gradeIndex < grades.length) {
      setSelectedGrade(gradeIndex);
    }
  }, [grades.length]);

  const handleSelectGrade = useCallback((gradeIndex?: number) => {
    const grade = gradeIndex !== undefined ? grades[gradeIndex] : currentGrade;
    if (!grade) return;
    
    onGradeSelect?.(grade.name);
    contextualHaptic.configComplete();
    console.log("Grade selected:", grade.name);
  }, [grades, currentGrade, onGradeSelect]);

  const handleConfigureGrade = useCallback((grade?: any) => {
    const gradeToUse = grade || currentGrade;
    if (!gradeToUse) return;
    
    onCarBuilder?.(gradeToUse.name);
    contextualHaptic.buttonPress();
  }, [currentGrade, onCarBuilder]);

  const handleTestDriveGrade = useCallback((grade?: any) => {
    onTestDrive?.();
    contextualHaptic.buttonPress();
  }, [onTestDrive]);

  const handleCompareGrades = useCallback(() => {
    setIsCompareOpen(true);
    contextualHaptic.buttonPress();
  }, []);

  const handleComparisonSelect = (gradeName: string) => {
    onGradeSelect?.(gradeName);
  };

  const handleComparisonCarBuilder = (gradeName: string) => {
    onCarBuilder?.(gradeName);
  };

  const handleComparisonTestDrive = (gradeName: string) => {
    onTestDrive?.();
  };

  const renderGradesSkeleton = () => (
    <div className={isMobile ? 'px-4' : 'grid lg:grid-cols-3 gap-6 px-4 lg:px-0'}>
      {Array.from({ length: isMobile ? 1 : 3 }).map((_, index) => (
        <Card key={index} className="h-full">
          <CardContent className="p-0">
            <Skeleton className="w-full h-48 rounded-t-lg" />
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-8 w-1/2" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <section className="py-8 lg:py-16 bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="toyota-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 lg:mb-12"
            variants={enhancedVariants.fadeInUp}
          >
            <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-2 rounded-full text-sm font-medium mb-4 lg:mb-6">
              <Settings className="h-4 w-4 mr-2" />
              Interactive Experience
            </Badge>
            <h2 className="text-2xl sm:text-3xl lg:text-6xl font-black text-foreground mb-3 lg:mb-4 leading-tight">
              Choose Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
                Configuration
              </span>
            </h2>
            <p className="text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Select your engine and explore trims with enhanced mobile experience.
            </p>
          </motion.div>

          {/* Enhanced Engine Selection - Mobile Optimized */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 lg:mb-12"
            variants={enhancedVariants.fadeInUp}
          >
            <div className="flex items-center justify-between mb-6 lg:mb-8 px-4 lg:px-0">
              <h3 className="text-lg sm:text-xl lg:text-3xl font-bold">Step 1: Choose Your Powertrain</h3>
            </div>
            
            <div className={`${isMobile ? 'grid grid-cols-2 gap-2 px-4' : 'grid md:grid-cols-2 gap-6'} max-w-4xl mx-auto`}>
              {engines.map((engine) => (
                <motion.div
                  key={engine.name}
                  whileHover={{ scale: isMobile ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springConfigs.luxurious}
                  className={`relative cursor-pointer transition-all duration-200 ${
                    engine.selected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleEngineChange(engine.name)}
                >
                  <Card className={`h-full ${engine.selected ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'}`}>
                    <CardContent className={isMobile ? 'p-2' : 'px-6 py-4'}>
                      <div className="flex items-start justify-between mb-2">
                        <div className={`${isMobile ? 'w-5 h-5' : 'w-12 h-12'} rounded-full flex items-center justify-center ${
                          engine.selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          {React.cloneElement(engine.icon, { 
                            className: isMobile ? 'h-3 w-3' : 'h-6 w-6' 
                          })}
                        </div>
                        {engine.selected && (
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={springConfigs.bouncy}
                            className={`${isMobile ? 'w-3 h-3' : 'w-6 h-6'} bg-primary rounded-full flex items-center justify-center`}
                          >
                            <Check className={`${isMobile ? 'h-2 w-2' : 'h-4 w-4'} text-primary-foreground`} />
                          </motion.div>
                        )}
                      </div>
                      
                      <h4 className={`${isMobile ? 'text-xs' : 'text-lg lg:text-xl'} font-bold mb-1`}>
                        {isMobile ? engine.name.replace('L ', '') : engine.name}
                      </h4>
                      
                      {!isMobile && (
                        <p className="text-sm text-muted-foreground mb-3">{engine.description}</p>
                      )}
                      
                      {isMobile && (
                        <p className="text-xs text-muted-foreground mb-2">{engine.shortDescription}</p>
                      )}
                      
                      <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        <div>
                          <div className="font-semibold">{engine.power}</div>
                          {!isMobile && <div className="text-muted-foreground text-xs">POWER</div>}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{engine.efficiency}</div>
                          {!isMobile && <div className="text-muted-foreground text-xs">EFFICIENCY</div>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Grade Selection with Loading State */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 lg:mb-12"
            variants={enhancedVariants.fadeInUp}
          >
            <div className="flex items-center justify-between mb-6 lg:mb-8 px-4 lg:px-0">
              <h3 className="text-lg sm:text-xl lg:text-3xl font-bold">Step 2: Choose Your Grade</h3>
              <Button variant="outline" className="gap-2 min-h-[44px]" onClick={handleCompareGrades}>
                <ArrowUpDown className="h-4 w-4" />
                {isMobile ? "Compare" : "Compare Grades"}
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {isGradeLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderGradesSkeleton()}
                </motion.div>
              ) : (
                <motion.div
                  key="grades"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobile ? (
                    /* Mobile: Enhanced Swipeable Single Card */
                    <motion.div
                      variants={enhancedVariants.cinematicStagger}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="px-4"
                    >
                      <SwipeableGradeCarousel
                        grades={grades}
                        selectedGrade={selectedGrade}
                        onGradeChange={handleGradeChange}
                        onGradeSelect={() => handleSelectGrade()}
                        onTestDrive={handleTestDriveGrade}
                        onConfigure={handleConfigureGrade}
                      />
                    </motion.div>
                  ) : (
                    /* Desktop: Three Cards Side by Side with Enhanced Animations */
                    <motion.div
                      variants={enhancedVariants.cinematicStagger}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid lg:grid-cols-3 gap-6 px-4 lg:px-0"
                    >
                      {grades.map((grade, index) => (
                        <motion.div
                          key={grade.name}
                          variants={enhancedVariants.fadeInScale}
                          whileHover={{ 
                            scale: 1.03,
                            y: -8,
                            transition: springConfigs.luxurious 
                          }}
                          className={`cursor-pointer transition-all duration-200 ${
                            index === selectedGrade ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedGrade(index)}
                        >
                          <Card className={`h-full ${index === selectedGrade ? 'border-primary shadow-lg' : 'border-border hover:border-primary/50'}`}>
                            <CardContent className="p-0">
                              <div className="relative overflow-hidden">
                                <Badge className={`absolute top-4 left-4 z-10 ${grade.badgeColor} text-white px-3 py-1 text-sm font-medium`}>
                                  {grade.badge}
                                </Badge>
                                <motion.img
                                  whileHover={{ scale: 1.05 }}
                                  transition={springConfigs.cinematic}
                                  src={grade.image}
                                  alt={grade.name}
                                  className="w-full h-48 object-cover rounded-t-lg"
                                />
                              </div>

                              <div className="p-6 space-y-4">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                                    <h4 className="text-xl font-bold">{grade.name}</h4>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">{grade.description}</p>
                                  
                                  <div className="space-y-1">
                                    <div className="text-2xl font-black">AED {grade.price.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">From AED {grade.monthlyFrom}/month</div>
                                  </div>
                                </div>

                                <div>
                                  <h5 className="font-semibold mb-3 text-sm">Key Features</h5>
                                  <div className="space-y-2">
                                    {grade.features.slice(0, 3).map((feature) => (
                                      <motion.div 
                                        key={feature} 
                                        className="flex items-center gap-2"
                                        whileHover={{ x: 4 }}
                                        transition={springConfigs.snappy}
                                      >
                                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                          <Check className="h-2 w-2 text-primary-foreground" />
                                        </div>
                                        <span className="text-xs">{feature}</span>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex flex-col gap-2 pt-2">
                                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button 
                                      size="sm" 
                                      className="w-full bg-primary hover:bg-primary/90"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectGrade(index);
                                      }}
                                    >
                                      Select Grade
                                    </Button>
                                  </motion.div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="gap-1 w-full"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleTestDriveGrade(grade);
                                        }}
                                      >
                                        <Car className="h-3 w-3" />
                                        Drive
                                      </Button>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="gap-1 w-full"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleConfigureGrade(grade);
                                        }}
                                      >
                                        <Wrench className="h-3 w-3" />
                                        Build
                                      </Button>
                                    </motion.div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <VehicleGradeComparison
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        engineName={selectedEngine}
        grades={grades}
        onGradeSelect={(gradeName) => onGradeSelect?.(gradeName)}
        onCarBuilder={(gradeName) => onCarBuilder?.(gradeName)}
        onTestDrive={() => onTestDrive?.()}
      />
    </>
  );
};

export default VehicleConfiguration;
