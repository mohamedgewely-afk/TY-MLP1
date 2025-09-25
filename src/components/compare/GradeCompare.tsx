import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Eye, EyeOff, Grid3X3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Grade {
  id: string;
  name: string;
  price: number;
  monthlyFrom: number;
  badge: string;
  badgeColor: string;
  image: string;
  features: string[];
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    acceleration: string;
    fuelEconomy: string;
  };
}

interface GradeCompareProps {
  isOpen: boolean;
  onClose: () => void;
  grades: Grade[];
  onTestDrive?: (gradeId: string) => void;
  onGetQuote?: (gradeId: string) => void;
}

type ViewMode = 'highlights' | 'all' | 'differences';

const GradeCompare: React.FC<GradeCompareProps> = ({
  isOpen,
  onClose,
  grades,
  onTestDrive = () => {},
  onGetQuote = () => {}
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('highlights');
  const [currentOffset, setCurrentOffset] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  
  const visibleCount = 4;
  const visibleGrades = grades.slice(currentOffset, currentOffset + visibleCount);

  const scrollToNext = () => {
    if (currentOffset + visibleCount < grades.length) {
      setCurrentOffset(prev => prev + 1);
    }
  };

  const scrollToPrev = () => {
    if (currentOffset > 0) {
      setCurrentOffset(prev => prev - 1);
    }
  };

  const comparisonSpecs = [
    {
      title: "Pricing",
      items: [
        { 
          label: "Base Price", 
          getValue: (grade: Grade) => `AED ${grade.price.toLocaleString()}`,
          highlight: true
        },
        { 
          label: "Monthly EMI", 
          getValue: (grade: Grade) => `AED ${grade.monthlyFrom}`,
          highlight: true
        }
      ]
    },
    {
      title: "Performance",
      items: [
        { 
          label: "Engine", 
          getValue: (grade: Grade) => grade.specs.engine,
          highlight: true
        },
        { 
          label: "Power", 
          getValue: (grade: Grade) => grade.specs.power,
          highlight: true
        },
        { 
          label: "Torque", 
          getValue: (grade: Grade) => grade.specs.torque
        },
        { 
          label: "Transmission", 
          getValue: (grade: Grade) => grade.specs.transmission
        },
        { 
          label: "0-100 km/h", 
          getValue: (grade: Grade) => grade.specs.acceleration,
          highlight: true
        },
        { 
          label: "Fuel Economy", 
          getValue: (grade: Grade) => grade.specs.fuelEconomy,
          highlight: true
        }
      ]
    },
    {
      title: "Key Features",
      items: [
        { 
          label: "Features", 
          getValue: (grade: Grade) => grade.features.join(", "),
          highlight: false
        }
      ]
    }
  ];

  const getFilteredSpecs = () => {
    return comparisonSpecs.map(section => ({
      ...section,
      items: section.items.filter(item => {
        if (viewMode === 'highlights') return item.highlight;
        if (viewMode === 'all') return true;
        if (viewMode === 'differences') {
          const values = visibleGrades.map(grade => item.getValue(grade));
          return new Set(values).size > 1;
        }
        return true;
      })
    })).filter(section => section.items.length > 0);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md"
    >
      <div className="h-full flex flex-col">
        {/* Top Controls */}
        <motion.div
          initial={prefersReducedMotion ? {} : { y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white hover:bg-white/10 border-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-light text-white">Grade Comparison</h1>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                  {(['highlights', 'all', 'differences'] as ViewMode[]).map(mode => (
                    <Button
                      key={mode}
                      size="sm"
                      variant={viewMode === mode ? "default" : "ghost"}
                      onClick={() => setViewMode(mode)}
                      className={`${
                        viewMode === mode 
                          ? 'bg-white text-black' 
                          : 'text-white hover:bg-white/10'
                      } capitalize text-xs`}
                    >
                      {mode === 'highlights' && <Eye className="h-3 w-3 mr-1" />}
                      {mode === 'differences' && <EyeOff className="h-3 w-3 mr-1" />}
                      {mode === 'all' && <Grid3X3 className="h-3 w-3 mr-1" />}
                      {mode}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grade Cards with Navigation */}
        <div className="relative">
          {grades.length > visibleCount && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToPrev}
                disabled={currentOffset === 0}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full h-10 w-10 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToNext}
                disabled={currentOffset + visibleCount >= grades.length}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full h-10 w-10 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4">
            <AnimatePresence mode="wait">
              {visibleGrades.map((grade, index) => (
                <motion.div
                  key={grade.id}
                  initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                  transition={prefersReducedMotion ? { duration: 0.1 } : { delay: index * 0.1 }}
                >
                  <Card className="bg-gradient-to-b from-white/5 to-white/2 border-white/10 overflow-hidden">
                    {/* Media */}
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <motion.img
                        src={grade.image}
                        alt={grade.name}
                        className="w-full h-full object-cover"
                        whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div className="absolute top-2 left-2">
                        <Badge className={`${grade.badgeColor} text-white text-xs`}>
                          {grade.badge}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Grade Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-medium text-white">{grade.name}</h3>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-lg font-light text-white">
                          AED {grade.price.toLocaleString()}
                        </div>
                        <div className="text-xs text-white/60">
                          From AED {grade.monthlyFrom}/month
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-6">
            {getFilteredSpecs().map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={prefersReducedMotion ? { duration: 0.1 } : { delay: sectionIndex * 0.1 }}
                className="space-y-3"
              >
                <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">
                  {section.title}
                </h3>
                
                <div className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <div 
                      key={item.label}
                      className="grid grid-cols-3 lg:grid-cols-5 gap-4 py-3 border-b border-white/5"
                    >
                      <div className="col-span-1 text-sm text-white/60">
                        {item.label}
                      </div>
                      
                      {visibleGrades.map((grade, gradeIndex) => (
                        <div 
                          key={grade.id}
                          className="text-sm text-white"
                        >
                          {item.getValue(grade)}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={prefersReducedMotion ? {} : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky bottom-0 bg-black/90 backdrop-blur-md border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button 
                className="flex-1 bg-white text-black hover:bg-white/90"
                onClick={() => visibleGrades.forEach(grade => onTestDrive(grade.id))}
              >
                Test Drive
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={() => visibleGrades.forEach(grade => onGetQuote(grade.id))}
              >
                Get Quote
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default GradeCompare;