
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Check, Star, Shield, Zap, Car } from "lucide-react";

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
      highlight: "Great Value"
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
      highlight: "Sport Package"
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
      highlight: "Most Popular"
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
      highlight: "Ultimate Luxury"
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
      highlight: "Top of the Line"
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
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h3 className="text-xl font-bold text-foreground mb-2">Choose Your Grade</h3>
        <p className="text-sm text-muted-foreground">Swipe or use arrows to explore grades</p>
      </motion.div>

      {/* Grade Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevGrade}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all -translate-x-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button
          onClick={nextGrade}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all translate-x-2"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Grade Card */}
        <div className="mx-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentGradeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-2xl font-bold">{currentGrade.name}</h4>
                      <Badge className="bg-white/20 text-white border-white/30">
                        {currentGrade.highlight}
                      </Badge>
                    </div>
                    <p className="text-white/90 text-sm">{currentGrade.description}</p>
                    
                    {/* Pricing */}
                    <div className="mt-3 pt-3 border-t border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-2xl font-bold">
                            {currentGrade.price > 0 ? `+AED ${currentGrade.price.toLocaleString()}` : "Included"}
                          </div>
                          <div className="text-white/80 text-sm">Starting from AED {currentGrade.monthlyEMI}/month</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* USPs */}
                  <div className="p-4">
                    <h5 className="font-bold text-foreground mb-3">Key Benefits</h5>
                    <div className="grid grid-cols-1 gap-3 mb-4">
                      {currentGrade.usps.map((usp, index) => (
                        <motion.div
                          key={usp.title}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            {usp.icon}
                          </div>
                          <div className="flex-1">
                            <h6 className="font-semibold text-sm">{usp.title}</h6>
                            <p className="text-xs text-muted-foreground">{usp.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Features List */}
                    <h5 className="font-bold text-foreground mb-3">Included Features</h5>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {currentGrade.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2 text-sm">
                          <Check className="h-3 w-3 text-green-500" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Select Button */}
                    <Button
                      onClick={selectCurrentGrade}
                      className={`w-full ${
                        config.grade === currentGrade.name
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                    >
                      {config.grade === currentGrade.name ? 'Selected' : 'Select This Grade'}
                      {config.grade === currentGrade.name && <Check className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {grades.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentGradeIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentGradeIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradeCarouselStep;
