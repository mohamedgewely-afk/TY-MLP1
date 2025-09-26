import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Share2, 
  Download, 
  X, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Car,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

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

interface SpecRow {
  key: string;
  label: string;
  values: Record<string, string | number | boolean | null>;
}

interface GradeCompareProps {
  grades: Grade[];
  specs: SpecRow[];
  compareList: string[];
  onCompareToggle: (gradeId: string) => void;
  onOpenComparison?: () => void;
  onClose?: () => void;
  isModal?: boolean;
  className?: string;
}

type ViewMode = 'highlights' | 'all' | 'differences';

const GradeCompare: React.FC<GradeCompareProps> = ({
  grades = [],
  specs = [],
  compareList = [],
  onCompareToggle,
  onOpenComparison,
  onClose,
  isModal = false,
  className = ""
}) => {
  const [selectedGrades, setSelectedGrades] = useState<string[]>(compareList);
  const [viewMode, setViewMode] = useState<ViewMode>('highlights');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentOffset, setCurrentOffset] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  
  const maxSelection = 4;
  const visibleCount = 3;
  
  const filteredGrades = useMemo(() => {
    return grades.filter(grade => 
      grade.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [grades, searchQuery]);
  
  const selectedGradeObjects = useMemo(() => {
    return selectedGrades
      .map(id => filteredGrades.find(g => g.id === id))
      .filter(Boolean) as Grade[];
  }, [selectedGrades, filteredGrades]);
  
  const visibleGrades = useMemo(() => {
    return selectedGradeObjects.slice(currentOffset, currentOffset + visibleCount);
  }, [selectedGradeObjects, currentOffset, visibleCount]);
  
  const handleGradeToggle = (gradeId: string) => {
    setSelectedGrades(prev => {
      if (prev.includes(gradeId)) {
        return prev.filter(id => id !== gradeId);
      } else if (prev.length < maxSelection) {
        return [...prev, gradeId];
      }
      return prev;
    });
    onCompareToggle(gradeId);
  };
  
  const scrollToNext = () => {
    if (currentOffset + visibleCount < selectedGradeObjects.length) {
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

  // Non-modal version (section on page)
  if (!isModal) {
    return (
      <section className={`py-16 lg:py-24 bg-background ${className}`}>
        <div className="container mx-auto px-4">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-6xl font-light tracking-tight mb-6">
              Compare
              <span className="text-brand-primary"> Grades</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find the perfect configuration for your needs
            </p>
          </motion.div>

          {/* Grade Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {grades.slice(0, 4).map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className={cn(
                    'cursor-pointer transition-all border-2 overflow-hidden',
                    compareList.includes(grade.id) ? 'border-brand-primary bg-brand-primary/5' : 'border-border hover:border-brand-primary/50'
                  )}
                  onClick={() => onCompareToggle(grade.id)}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={grade.image}
                      alt={grade.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{grade.name}</h3>
                      {compareList.includes(grade.id) && (
                        <div className="w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">AED {grade.price.toLocaleString()}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Compare CTA */}
          {compareList.length >= 2 && (
            <div className="text-center">
              <Button
                onClick={onOpenComparison}
                size="lg"
                className="bg-brand-primary hover:bg-brand-primary/90"
              >
                Compare {compareList.length} Grades
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Modal version
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-md z-[9999] overflow-hidden"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
                  <Input
                    placeholder="Search grades..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/60 w-64"
                  />
                </div>
                
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mt-4">
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
                    {mode}
                  </Button>
                ))}
              </div>
              
              <div className="text-sm text-white/60">
                {selectedGrades.length} of {maxSelection} selected
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grade Selection */}
        <motion.div
          initial={prefersReducedMotion ? {} : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-white/10 bg-black/40"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              <span className="text-sm text-white/60 whitespace-nowrap">Grades:</span>
              <div className="flex gap-2">
                {filteredGrades.map(grade => (
                  <Button
                    key={grade.id}
                    size="sm"
                    variant={selectedGrades.includes(grade.id) ? "default" : "outline"}
                    onClick={() => handleGradeToggle(grade.id)}
                    disabled={!selectedGrades.includes(grade.id) && selectedGrades.length >= maxSelection}
                    className={`${
                      selectedGrades.includes(grade.id)
                        ? 'bg-white text-black hover:bg-white/90'
                        : 'border-white/20 text-white hover:bg-white/10'
                    } whitespace-nowrap relative`}
                  >
                    {selectedGrades.includes(grade.id) && (
                      <X className="h-3 w-3 mr-1" />
                    )}
                    {!selectedGrades.includes(grade.id) && (
                      <Plus className="h-3 w-3 mr-1" />
                    )}
                    {grade.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Comparison Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {/* Grade Cards */}
            <div className="relative">
              {selectedGradeObjects.length > visibleCount && (
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
                    disabled={currentOffset + visibleCount >= selectedGradeObjects.length}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/60 text-white hover:bg-black/80 rounded-full h-10 w-10 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                <AnimatePresence mode="wait">
                  {visibleGrades.map((grade, index) => (
                    <motion.div
                      key={grade.id}
                      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={prefersReducedMotion ? {} : { opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-gradient-to-b from-white/5 to-white/2 border-white/10 overflow-hidden">
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
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-4 space-y-6">
                {getFilteredSpecs().map((section, sectionIndex) => (
                  <motion.div
                    key={section.title}
                    initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.1 }}
                    className="space-y-3"
                  >
                    <h3 className="text-sm font-medium text-white/80 uppercase tracking-wide">
                      {section.title}
                    </h3>
                    
                    <div className="space-y-2">
                      {section.items.map((item) => (
                        <div 
                          key={item.label}
                          className="grid grid-cols-4 gap-4 py-3 border-b border-white/5"
                        >
                          <div className="col-span-1 text-sm text-white/60">
                            {item.label}
                          </div>
                          
                          {visibleGrades.map((grade) => (
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
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={prefersReducedMotion ? {} : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky bottom-0 bg-black/90 backdrop-blur-md border-t border-white/10"
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button 
                className="flex-1 bg-white text-black hover:bg-white/90"
                onClick={() => console.log('Test drive all grades')}
              >
                <Car className="h-4 w-4 mr-2" />
                Test Drive
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1 border-white/20 text-white hover:bg-white/10"
                onClick={() => console.log('Get quotes')}
              >
                <Calculator className="h-4 w-4 mr-2" />
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