
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Spec {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface SpecCategory {
  category: string;
  icon: React.ReactNode;
  specs: Spec[];
}

interface SpecsCarouselProps {
  performanceSpecs: SpecCategory[];
  currentPerformanceIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onIndicatorClick: (index: number) => void;
  selectedEngine: string;
  selectedGrade: string;
}

const SpecsCarousel: React.FC<SpecsCarouselProps> = ({
  performanceSpecs,
  currentPerformanceIndex,
  onNext,
  onPrev,
  onIndicatorClick,
  selectedEngine,
  selectedGrade
}) => {
  const currentSpec = performanceSpecs[currentPerformanceIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-8"
      key={`${selectedEngine}-${selectedGrade}`}
    >
      <div className="flex items-center justify-center mb-6">
        <h3 className="text-lg font-bold">Detailed Specifications</h3>
      </div>
      
      <div className="relative max-w-5xl mx-auto px-4">
        {/* Navigation Buttons */}
        <button
          onClick={onPrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all lg:-translate-x-6 min-h-[44px] min-w-[44px]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <button
          onClick={onNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-lg border hover:shadow-xl transition-all lg:translate-x-6 min-h-[44px] min-w-[44px]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Spec Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${currentPerformanceIndex}-${selectedEngine}-${selectedGrade}`}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="mx-0 lg:mx-12"
          >
            <Card className="overflow-hidden border bg-card shadow-xl">
              <CardContent className="p-4 lg:p-8">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-primary/20 rounded-lg mr-4">
                    {currentSpec.icon}
                  </div>
                  <h4 className="text-xl lg:text-3xl font-bold">{currentSpec.category}</h4>
                </div>
                
                <div className="grid grid-cols-1 gap-4 lg:gap-6">
                  {currentSpec.specs.map((spec, index) => (
                    <motion.div
                      key={spec.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.3 }}
                      className="bg-muted/50 rounded-lg p-4"
                    >
                      <div className="flex items-center mb-2">
                        {spec.icon}
                        <span className="ml-2 text-sm font-medium">{spec.label}</span>
                      </div>
                      <div className="text-base lg:text-lg font-bold">{spec.value}</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="flex justify-center space-x-3 mt-6">
          {performanceSpecs.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndicatorClick(index)}
              className={`h-3 rounded-full transition-all min-h-[44px] min-w-[44px] flex items-center justify-center ${
                index === currentPerformanceIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30 w-3'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SpecsCarousel;
