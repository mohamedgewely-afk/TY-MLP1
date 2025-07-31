
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Star, Shield, Zap, Car, ChevronDown, ChevronUp } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BuilderConfig {
  modelYear: string;
  engine: string;
  grade: string;
  exteriorColor: string;
  interiorColor: string;
  accessories: string[];
}

interface GradeCarouselStepProps {
  config: BuilderConfig;
  setConfig: React.Dispatch<React.SetStateAction<BuilderConfig>>;
}

const GradeCarouselStep: React.FC<GradeCarouselStepProps> = ({ config, setConfig }) => {
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const [isKeyBenefitsOpen, setIsKeyBenefitsOpen] = useState(false);
  const isMobile = useIsMobile();

  const grades = [
    {
      name: "Base",
      price: 0,
      monthlyEMI: 899,
      description: "Essential features for everyday driving",
      usps: [
        { icon: <Car className="h-4 w-4" />, title: "Essential Safety", desc: "Standard safety features" },
        { icon: <Shield className="h-4 w-4" />, title: "Warranty", desc: "3-year comprehensive warranty" },
        { icon: <Star className="h-4 w-4" />, title: "Quality", desc: "Toyota reliability standard" }
      ],
      features: ["Manual A/C", "Fabric Seats", "Basic Audio", "Standard Safety"],
      highlight: "Great Value",
      toyotaColor: "from-slate-600 to-slate-700" // Toyota conservative gray
    },
    {
      name: "SE",
      price: 2000,
      monthlyEMI: 945,
      description: "Sport-enhanced driving experience",
      usps: [
        { icon: <Zap className="h-4 w-4" />, title: "Sport Tuning", desc: "Enhanced suspension setup" },
        { icon: <Car className="h-4 w-4" />, title: "Sport Styling", desc: "Unique exterior elements" },
        { icon: <Star className="h-4 w-4" />, title: "Premium Audio", desc: "6-speaker sound system" }
      ],
      features: ["Sport Seats", "Enhanced Audio", "Sport Suspension", "Alloy Wheels"],
      highlight: "Sport Package",
      toyotaColor: "from-gray-700 to-gray-800" // Toyota dark metallic
    },
    {
      name: "XLE",
      price: 4000,
      monthlyEMI: 1099,
      description: "Premium comfort and convenience",
      usps: [
        { icon: <Star className="h-4 w-4" />, title: "Premium Interior", desc: "Leather-appointed seats" },
        { icon: <Zap className="h-4 w-4" />, title: "Smart Features", desc: "Advanced connectivity" },
        { icon: <Shield className="h-4 w-4" />, title: "Enhanced Safety", desc: "Additional safety tech" }
      ],
      features: ["Leather Seats", "Dual-Zone Climate", "Premium Audio", "Advanced Safety"],
      highlight: "Most Popular",
      toyotaColor: "from-red-600 to-red-700" // Toyota signature red
    },
    {
      name: "Limited",
      price: 6000,
      monthlyEMI: 1249,
      description: "Luxury features and premium materials",
      usps: [
        { icon: <Star className="h-4 w-4" />, title: "Luxury Interior", desc: "Premium leather & wood trim" },
        { icon: <Zap className="h-4 w-4" />, title: "Tech Suite", desc: "Full technology package" },
        { icon: <Shield className="h-4 w-4" />, title: "Complete Safety", desc: "All available safety features" }
      ],
      features: ["Premium Leather", "Panoramic Sunroof", "JBL Audio", "Full Safety Suite"],
      highlight: "Ultimate Luxury",
      toyotaColor: "from-gray-800 to-gray-900" // Toyota luxury black
    },
    {
      name: "Platinum",
      price: 10000,
      monthlyEMI: 1449,
      description: "The ultimate Toyota experience",
      usps: [
        { icon: <Star className="h-4 w-4" />, title: "Platinum Exclusive", desc: "Unique luxury appointments" },
        { icon: <Zap className="h-4 w-4" />, title: "Advanced Tech", desc: "Latest technology features" },
        { icon: <Shield className="h-4 w-4" />, title: "Premium Care", desc: "Extended warranty & service" }
      ],
      features: ["Platinum Interior", "Advanced Driver Assist", "Premium JBL Audio", "Exclusive Styling"],
      highlight: "Top of the Line",
      toyotaColor: "from-zinc-700 to-zinc-800" // Toyota platinum metallic
    }
  ];

  const currentGrade = grades[currentGradeIndex];

  const nextGrade = () => {
    setCurrentGradeIndex((prev) => (prev + 1) % grades.length);
  };

  const prevGrade = () => {
    setCurrentGradeIndex((prev) => (prev - 1 + grades.length) % grades.length);
  };

  const selectCurrentGrade = () => {
    setConfig(prev => ({ ...prev, grade: currentGrade.name }));
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-lg font-bold text-foreground mb-2">Choose Your Grade</h3>
        <p className="text-sm text-muted-foreground">
          {isMobile ? "Swipe or use arrows to explore grades" : "Swipe or use arrows to explore grades"}
        </p>
      </motion.div>

      {/* Grade Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevGrade}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all -translate-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <button
          onClick={nextGrade}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all translate-x-2"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Grade Card */}
        <div className="mx-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGradeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ 
                duration: 0.5, 
                ease: [0.16, 1, 0.3, 1] // Cinematic timing curve
              }}
            >
              <Card className="overflow-hidden border-2 border-red-200 bg-gradient-to-br from-white to-red-50">
                <CardContent className="p-0">
                  {/* Header with Toyota colors */}
                  <div className={`bg-gradient-to-r ${currentGrade.toyotaColor} text-white p-3 relative overflow-hidden`}>
                    {/* Toyota-inspired subtle pattern overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/10" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>{currentGrade.name}</h4>
                        <Badge className="bg-white/20 text-white border-white/30 text-xs">
                          {currentGrade.highlight}
                        </Badge>
                      </div>
                      <p className="text-white/90 text-xs">{currentGrade.description}</p>
                      
                      {/* Pricing */}
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                              {currentGrade.price > 0 ? `+AED ${currentGrade.price.toLocaleString()}` : "Included"}
                            </div>
                            <div className="text-white/80 text-xs">Starting from AED {currentGrade.monthlyEMI}/month</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3">
                    {/* Key Benefits - Collapsible on Mobile */}
                    {isMobile ? (
                      <div className="mb-3">
                        <button
                          onClick={() => setIsKeyBenefitsOpen(!isKeyBenefitsOpen)}
                          className="flex items-center justify-between w-full p-2 bg-red-50 rounded-lg border border-red-100"
                        >
                          <h5 className="font-bold text-foreground text-sm">Key Benefits</h5>
                          {isKeyBenefitsOpen ? (
                            <ChevronUp className="h-4 w-4 text-red-600" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-red-600" />
                          )}
                        </button>
                        
                        <AnimatePresence>
                          {isKeyBenefitsOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ 
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                              className="overflow-hidden"
                            >
                              <div className="grid grid-cols-1 gap-2 mt-2">
                                {currentGrade.usps.map((usp, index) => (
                                  <div
                                    key={usp.title}
                                    className="flex items-start space-x-2 p-2 bg-white rounded-lg border border-red-100"
                                  >
                                    <div className="p-1 bg-red-100 rounded-lg text-red-600">
                                      {usp.icon}
                                    </div>
                                    <div className="flex-1">
                                      <h6 className="font-semibold text-xs">{usp.title}</h6>
                                      <p className="text-xs text-muted-foreground">{usp.desc}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <h5 className="font-bold text-foreground mb-3">Key Benefits</h5>
                        <div className="grid grid-cols-1 gap-3">
                          {currentGrade.usps.map((usp, index) => (
                            <motion.div
                              key={usp.title}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ 
                                delay: index * 0.1,
                                duration: 0.4,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                              className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border border-red-100"
                            >
                              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                                {usp.icon}
                              </div>
                              <div className="flex-1">
                                <h6 className="font-semibold text-sm">{usp.title}</h6>
                                <p className="text-xs text-muted-foreground">{usp.desc}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features List */}
                    <h5 className="font-bold text-foreground mb-2 text-sm">Included Features</h5>
                    <div className={`grid gap-1 mb-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {currentGrade.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2 text-xs">
                          <Check className="h-3 w-3 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Select Button with Toyota styling */}
                    <Button
                      onClick={selectCurrentGrade}
                      className={`w-full text-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        config.grade === currentGrade.name
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                      size="sm"
                    >
                      {config.grade === currentGrade.name ? 'Selected' : 'Select This Grade'}
                      {config.grade === currentGrade.name && <Check className="ml-2 h-3 w-3" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Enhanced Indicators with Toyota styling */}
        <div className="flex justify-center space-x-1 mt-3">
          {grades.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGradeIndex(index)}
              className={`rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                index === currentGradeIndex 
                  ? 'bg-red-600 w-6 h-2' 
                  : 'bg-gray-300 w-2 h-2 hover:bg-red-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeCarouselStep;
