
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Star, Shield, Zap, Car, Volume2 } from "lucide-react";

interface GradeCarouselStepProps {
  config: { grade: string };
  setConfig: React.Dispatch<React.SetStateAction<any>>;
}

const grades = [
  {
    name: "Base",
    price: 0,
    description: "Essential features for everyday driving",
    usps: [
      { icon: <Shield className="h-4 w-4" />, text: "Toyota Safety Sense 2.0" },
      { icon: <Car className="h-4 w-4" />, text: "LED Headlights" },
      { icon: <Volume2 className="h-4 w-4" />, text: "6-Speaker Audio System" }
    ],
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
  },
  {
    name: "SE",
    price: 2000,
    description: "Sport edition with enhanced performance",
    usps: [
      { icon: <Zap className="h-4 w-4" />, text: "Sport-Tuned Suspension" },
      { icon: <Car className="h-4 w-4" />, text: "18-inch Alloy Wheels" },
      { icon: <Volume2 className="h-4 w-4" />, text: "8-Speaker Premium Audio" }
    ],
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
  },
  {
    name: "XLE",
    price: 4000,
    description: "Premium comfort and convenience",
    usps: [
      { icon: <Star className="h-4 w-4" />, text: "Heated & Ventilated Seats" },
      { icon: <Shield className="h-4 w-4" />, text: "Advanced Safety Features" },
      { icon: <Zap className="h-4 w-4" />, text: "Wireless Phone Charging" }
    ],
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
  },
  {
    name: "Limited",
    price: 6000,
    description: "Luxury features and premium materials",
    usps: [
      { icon: <Star className="h-4 w-4" />, text: "Leather-Appointed Seating" },
      { icon: <Volume2 className="h-4 w-4" />, text: "JBL Premium Audio (12 speakers)" },
      { icon: <Car className="h-4 w-4" />, text: "Power Tailgate" }
    ],
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
  },
  {
    name: "Platinum",
    price: 10000,
    description: "Ultimate luxury and technology",
    usps: [
      { icon: <Star className="h-4 w-4" />, text: "Premium Leather Interior" },
      { icon: <Zap className="h-4 w-4" />, text: "Advanced Driver Assistance" },
      { icon: <Shield className="h-4 w-4" />, text: "360-Degree Camera System" }
    ],
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
  }
];

const GradeCarouselStep: React.FC<GradeCarouselStepProps> = ({ config, setConfig }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextGrade = () => {
    setCurrentIndex((prev) => (prev + 1) % grades.length);
  };

  const prevGrade = () => {
    setCurrentIndex((prev) => (prev - 1 + grades.length) % grades.length);
  };

  const selectGrade = (grade: string) => {
    setConfig(prev => ({ ...prev, grade }));
  };

  const currentGrade = grades[currentIndex];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Select Your Grade
        </h2>
        <p className="text-muted-foreground">
          Swipe or use arrows to explore grade options
        </p>
      </motion.div>

      {/* Grade Carousel */}
      <div className="relative">
        <div className="overflow-hidden rounded-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className={`overflow-hidden ${config.grade === currentGrade.name ? 'ring-2 ring-primary' : ''}`}>
                <div className="relative h-48">
                  <img 
                    src={currentGrade.image} 
                    alt={currentGrade.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold">{currentGrade.name}</h3>
                      {currentGrade.price > 0 && (
                        <Badge className="bg-primary text-primary-foreground">
                          +د.إ {currentGrade.price.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm opacity-90">{currentGrade.description}</p>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h4 className="font-bold mb-3 text-center">Key Features</h4>
                  <div className="space-y-3">
                    {currentGrade.usps.map((usp, index) => (
                      <motion.div
                        key={usp.text}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-2 rounded-lg bg-muted/30"
                      >
                        <div className="text-primary">
                          {usp.icon}
                        </div>
                        <span className="text-sm font-medium">{usp.text}</span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => selectGrade(currentGrade.name)}
                    className={`w-full mt-4 py-3 rounded-xl font-bold transition-all ${
                      config.grade === currentGrade.name
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {config.grade === currentGrade.name ? 'Selected' : 'Select This Grade'}
                  </motion.button>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={prevGrade}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg border hover:shadow-xl transition-all z-10"
        >
          <ChevronLeft className="h-5 w-5 text-gray-700" />
        </button>

        <button
          onClick={nextGrade}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/90 shadow-lg border hover:shadow-xl transition-all z-10"
        >
          <ChevronRight className="h-5 w-5 text-gray-700" />
        </button>
      </div>

      {/* Indicators */}
      <div className="flex justify-center space-x-2">
        {grades.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-primary w-6' : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default GradeCarouselStep;
