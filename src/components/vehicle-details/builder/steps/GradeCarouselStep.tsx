
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const grades = [
    {
      id: "Base",
      name: "Base",
      price: 0,
      features: ["LED Headlights", "Digital Display", "Safety Sense"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true"
    },
    {
      id: "SE",
      name: "SE",
      price: 2000,
      features: ["Sport Seats", "17\" Alloys", "Premium Audio", "Sunroof"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true&mformat=true"
    },
    {
      id: "XLE",
      name: "XLE",
      price: 4000,
      features: ["Leather Seats", "Navigation", "Wireless Charging", "Heated Seats"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true&mformat=true"
    },
    {
      id: "Limited",
      name: "Limited",
      price: 6000,
      features: ["Premium Leather", "JBL Sound", "Panoramic Roof", "Advanced Safety"],
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true"
    }
  ];

  const nextGrade = () => {
    setCurrentIndex((prev) => (prev + 1) % grades.length);
  };

  const prevGrade = () => {
    setCurrentIndex((prev) => (prev - 1 + grades.length) % grades.length);
  };

  const selectGrade = (gradeId: string) => {
    setConfig(prev => ({ ...prev, grade: gradeId }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">Choose Your Grade</h3>
      
      {/* Grade Carousel */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={prevGrade}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex space-x-2">
            {grades.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === currentIndex ? "bg-primary" : "bg-gray-300"
                )}
              />
            ))}
          </div>
          
          <button
            onClick={nextGrade}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-xl border border-border p-4"
          >
            <div className="aspect-video mb-4 rounded-lg overflow-hidden">
              <img
                src={grades[currentIndex].image}
                alt={grades[currentIndex].name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold">{grades[currentIndex].name}</h4>
                {grades[currentIndex].price > 0 && (
                  <span className="text-primary font-semibold">
                    +AED {grades[currentIndex].price.toLocaleString()}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {grades[currentIndex].features.map((feature, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm">
                    <Star className="h-3 w-3 text-primary fill-current" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <motion.button
                onClick={() => selectGrade(grades[currentIndex].id)}
                className={cn(
                  "w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2",
                  config.grade === grades[currentIndex].id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {config.grade === grades[currentIndex].id ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Selected</span>
                  </>
                ) : (
                  <span>Select {grades[currentIndex].name}</span>
                )}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GradeCarouselStep;
