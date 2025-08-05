
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  X, 
  Check, 
  Download, 
  Wrench, 
  Sparkles,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Car,
  TrendingUp,
  TrendingDown,
  Equal
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface GradeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEngineData: any;
  onGradeSelect: (gradeName: string) => void;
  selectedGrade: string;
}

// Helper function to check if there are differences between grades for a specific attribute
const hasDifferences = (getValue: (grade: any) => string, grades: any[]) => {
  const values = grades.map(getValue);
  return new Set(values).size > 1;
};

// Helper function to determine if a value is better (higher price, better performance, etc.)
const getValueComparison = (currentValue: string, allValues: string[], itemLabel: string) => {
  if (!hasDifferences(() => currentValue, allValues.map(v => ({ getValue: () => v })))) {
    return 'equal';
  }
  
  // For prices, higher is typically "worse" from consumer perspective
  if (itemLabel.toLowerCase().includes('price') || itemLabel.toLowerCase().includes('emi')) {
    const numericValues = allValues.map(v => parseFloat(v.replace(/[^\d.]/g, '')));
    const currentNumeric = parseFloat(currentValue.replace(/[^\d.]/g, ''));
    const minValue = Math.min(...numericValues);
    return currentNumeric === minValue ? 'better' : 'worse';
  }
  
  // For performance metrics (acceleration - lower is better)
  if (itemLabel.toLowerCase().includes('acceleration')) {
    const numericValues = allValues.map(v => parseFloat(v.replace(/[^\d.]/g, '')));
    const currentNumeric = parseFloat(currentValue.replace(/[^\d.]/g, ''));
    const minValue = Math.min(...numericValues);
    return currentNumeric === minValue ? 'better' : 'worse';
  }
  
  // For efficiency, higher is typically better
  if (itemLabel.toLowerCase().includes('economy') || itemLabel.toLowerCase().includes('efficiency')) {
    const numericValues = allValues.map(v => parseFloat(v.replace(/[^\d.]/g, '')));
    const currentNumeric = parseFloat(currentValue.replace(/[^\d.]/g, ''));
    const maxValue = Math.max(...numericValues);
    return currentNumeric === maxValue ? 'better' : 'worse';
  }
  
  return 'different';
};

const GradeComparisonModal: React.FC<GradeComparisonModalProps> = ({
  isOpen,
  onClose,
  currentEngineData,
  onGradeSelect,
  selectedGrade
}) => {
  const [selectedGrades, setSelectedGrades] = useState<number[]>([0, 1]);
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>(['pricing', 'engine']);
  const isMobile = useIsMobile();

  const grades = currentEngineData.grades;

  const toggleGradeSelection = (gradeIndex: number) => {
    if (selectedGrades.includes(gradeIndex)) {
      if (selectedGrades.length > 1) {
        setSelectedGrades(prev => prev.filter(i => i !== gradeIndex));
      }
    } else if (selectedGrades.length < (isMobile ? 2 : 3)) {
      setSelectedGrades(prev => [...prev, gradeIndex].sort());
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Comprehensive comparison sections with Toyota red styling
  const comparisonSections = [
    {
      id: 'pricing',
      title: "Pricing & Value",
      items: [
        { 
          label: "Base Price", 
          getValue: (grade: any) => `AED ${grade.fullPrice.toLocaleString()}`,
          isHighlightable: true
        },
        { 
          label: "Monthly EMI", 
          getValue: (grade: any) => `AED ${grade.monthlyEMI}`,
          isHighlightable: true
        },
        { 
          label: "Insurance (Annual)", 
          getValue: (grade: any) => `AED ${Math.round(grade.fullPrice * 0.035).toLocaleString()}`,
          isHighlightable: true
        },
        { 
          label: "Value Score", 
          getValue: (grade: any) => grade.name === "SE" ? "★★★★☆" : grade.name === "XLE" ? "★★★★★" : "★★★☆☆",
          isHighlightable: true
        }
      ]
    },
    {
      id: 'engine',
      title: "Engine & Performance",
      items: [
        { 
          label: "Engine", 
          getValue: (grade: any) => grade.specs.engine,
          isHighlightable: false
        },
        { 
          label: "Power", 
          getValue: (grade: any) => grade.specs.power,
          isHighlightable: false
        },
        { 
          label: "Torque", 
          getValue: (grade: any) => grade.specs.torque,
          isHighlightable: false
        },
        { 
          label: "Transmission", 
          getValue: (grade: any) => grade.specs.transmission,
          isHighlightable: false
        },
        { 
          label: "Acceleration (0-60)", 
          getValue: (grade: any) => grade.specs.acceleration,
          isHighlightable: true
        }
      ]
    },
    {
      id: 'efficiency',
      title: "Efficiency & Environment",
      items: [
        { 
          label: "Fuel Economy", 
          getValue: (grade: any) => grade.specs.fuelEconomy,
          isHighlightable: true
        },
        { 
          label: "CO2 Emissions", 
          getValue: (grade: any) => grade.specs.co2Emissions,
          isHighlightable: true
        },
        { 
          label: "Tank Capacity", 
          getValue: (grade: any) => grade.specs.tankCapacity || "50L",
          isHighlightable: false
        },
        { 
          label: "Annual Fuel Cost", 
          getValue: (grade: any) => "AED 3,200",
          isHighlightable: false
        }
      ]
    },
    {
      id: 'comfort',
      title: "Comfort & Interior",
      items: [
        { 
          label: "Seating Material", 
          getValue: (grade: any) => grade.name === "SE" ? "Sport Fabric" : 
                                   grade.name === "XLE" ? "SofTex Leatherette" : "Premium Leather",
          isHighlightable: true
        },
        { 
          label: "Climate Control", 
          getValue: (grade: any) => grade.name === "SE" ? "Manual A/C" : 
                                   grade.name === "XLE" ? "Auto A/C" : "Dual-Zone Climate",
          isHighlightable: true
        },
        { 
          label: "Infotainment", 
          getValue: (grade: any) => grade.name === "SE" ? "8-inch Display" : 
                                   grade.name === "XLE" ? "9-inch Touch" : "10-inch Premium",
          isHighlightable: true
        },
        { 
          label: "Seating Configuration", 
          getValue: (grade: any) => "5 Seats",
          isHighlightable: false
        }
      ]
    },
    {
      id: 'safety',
      title: "Safety & Security",
      items: [
        { 
          label: "Airbags", 
          getValue: (grade: any) => grade.name === "SE" ? "7 Airbags" : "10 Airbags",
          isHighlightable: true
        },
        { 
          label: "Toyota Safety Sense", 
          getValue: (grade: any) => grade.name === "SE" ? "TSS 2.0" : "TSS 2.5+",
          isHighlightable: true
        },
        { 
          label: "Parking Assist", 
          getValue: (grade: any) => grade.name === "SE" ? "Rear Camera" : 
                                   grade.name === "XLE" ? "Rear Camera + Sensors" : "360° View",
          isHighlightable: true
        },
        { 
          label: "Security System", 
          getValue: (grade: any) => "Anti-theft + Immobilizer",
          isHighlightable: false
        }
      ]
    },
    {
      id: 'technology',
      title: "Technology & Connectivity",
      items: [
        { 
          label: "Audio System", 
          getValue: (grade: any) => grade.name === "SE" ? "6 Speakers" : 
                                   grade.name === "XLE" ? "Premium 8 Speakers" : "JBL Premium 9 Speakers",
          isHighlightable: true
        },
        { 
          label: "Smartphone Integration", 
          getValue: (grade: any) => "Apple CarPlay & Android Auto",
          isHighlightable: false
        },
        { 
          label: "Wireless Charging", 
          getValue: (grade: any) => grade.name === "SE" ? "Not Available" : "Available",
          isHighlightable: true
        },
        { 
          label: "Connected Services", 
          getValue: (grade: any) => grade.name === "Limited" ? "Toyota Connect Pro" : "Toyota Connect",
          isHighlightable: true
        }
      ]
    }
  ];

  const renderMobileComparison = () => (
    <div className="space-y-4">
      {/* Grade Selection - Mobile optimized for 2 grades */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Select 2 Grades to Compare</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
            className="flex items-center gap-2"
          >
            {showOnlyDifferences ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showOnlyDifferences ? "Show All" : "Differences"}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {grades.map((grade: any, index: number) => (
            <Button
              key={grade.name}
              variant={selectedGrades.includes(index) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleGradeSelection(index)}
              className={`h-auto p-3 flex flex-col items-start transition-all duration-300 ${
                selectedGrades.includes(index) 
                  ? 'bg-red-600 hover:bg-red-700 border-red-600' 
                  : 'hover:border-red-300'
              }`}
              disabled={selectedGrades.length >= 2 && !selectedGrades.includes(index)}
            >
              <div className="flex items-center gap-2 mb-1">
                {selectedGrades.includes(index) && <Check className="h-3 w-3" />}
                <span className="font-bold text-sm">{grade.name}</span>
                {grade.highlight === "Most Popular" && (
                  <Badge className="bg-red-100 text-red-700 text-xs px-1 py-0">Popular</Badge>
                )}
              </div>
              <span className="text-xs opacity-80">AED {grade.fullPrice.toLocaleString()}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Mobile Side-by-Side Comparison */}
      <div className="space-y-4">
        {/* Grade Headers with Images */}
        <div className="grid grid-cols-2 gap-3">
          {selectedGrades.map(gradeIndex => {
            const grade = grades[gradeIndex];
            return (
              <Card key={grade.name} className="overflow-hidden border-2 border-gray-200 hover:border-gray-300 dark:border-zinc-700 transition-colors">
                <CardContent className="p-3">
                  {/* Small Grade Image with red accent */}
                  <div className="h-16 mb-2 overflow-hidden rounded-lg border-2 border-gray-200">
                    <img
                      src={grade.image}
                      alt={grade.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{grade.name}</h4>
                    <Badge variant="secondary" className={`text-xs mt-1 ${
                      grade.highlight === "Most Popular" 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {grade.highlight}
                    </Badge>
                    <div className="mt-2">
                      <div className="font-bold text-sm text-red-800">AED {grade.fullPrice.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">AED {grade.monthlyEMI}/month</div>
                    </div>
                    
                    {/* Updated Action Buttons */}
                    <div className="grid grid-cols-2 gap-1 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-gray-300 dark:border-zinc-700 hover:bg-red-50"
                        onClick={() => window.open(`/test-drive?model=${encodeURIComponent(currentEngineData.name)}&grade=${encodeURIComponent(grade.name)}`, '_blank')}
                      >
                        <Car className="h-3 w-3 mr-1" />
                        Test Drive
                      </Button>
                      
                      <Button
                        size="sm"
                        className="text-xs bg-red-600 hover:bg-red-700"
                        onClick={() => window.open(`/configure?model=${encodeURIComponent(currentEngineData.name)}&grade=${encodeURIComponent(grade.name)}`, '_blank')}
                      >
                        <Wrench className="h-3 w-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Comparison Sections */}
        {comparisonSections.map(section => {
          const isExpanded = expandedSections.includes(section.id);
          const filteredItems = showOnlyDifferences 
            ? section.items.filter(item => hasDifferences(item.getValue, selectedGrades.map(i => grades[i])))
            : section.items;

          if (showOnlyDifferences && filteredItems.length === 0) return null;

          return (
            <Card key={section.id} className="overflow-hidden border border-gray-200">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-3 flex items-center justify-between bg-muted/30 border-b hover:bg-muted/40 transition-colors"
              >
                <h3 className="font-bold text-sm text-left text-gray-900 dark:text-white">{section.title}</h3>
                <div className="flex items-center gap-2">
                  {showOnlyDifferences && filteredItems.length > 0 && (
                    <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                      {filteredItems.length} differences
                    </Badge>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-red-600" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="divide-y divide-border">
                      {filteredItems.map(item => {
                        const values = selectedGrades.map(i => item.getValue(grades[i]));
                        const hasDiff = hasDifferences(item.getValue, selectedGrades.map(i => grades[i]));
                        
                        return (
                          <div key={item.label} className="p-3">
                            <div className={`text-xs font-medium mb-2 ${hasDiff ? 'text-red-700' : 'text-muted-foreground'} flex items-center gap-1`}>
                              {item.label}
                              {hasDiff && <ArrowUpDown className="h-3 w-3 text-red-500" />}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedGrades.map((gradeIndex, idx) => {
                                const comparison = hasDiff ? getValueComparison(values[idx], values, item.label) : 'equal';
                                const ComparisonIcon = comparison === 'better' ? TrendingUp : 
                                                     comparison === 'worse' ? TrendingDown : Equal;
                                
                                return (
                                  <div 
                                    key={gradeIndex}
                                    className={`text-xs p-2 rounded-lg flex items-center gap-1 ${
                                      hasDiff 
                                        ? comparison === 'better'
                                          ? 'bg-green-50 border border-green-200 text-green-800 font-semibold'
                                          : comparison === 'worse'
                                          ? 'bg-red-50 border border-gray-300 dark:border-zinc-700 text-red-800 font-semibold'
                                          : 'bg-red-50 border border-gray-300 dark:border-zinc-700 font-semibold'
                                        : 'bg-muted/50'
                                    }`}
                                  >
                                    {hasDiff && (
                                      <ComparisonIcon className={`h-3 w-3 ${
                                        comparison === 'better' ? 'text-green-600' :
                                        comparison === 'worse' ? 'text-red-600' :
                                        'text-gray-500'
                                      }`} />
                                    )}
                                    {values[idx]}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="border-gray-300 dark:border-zinc-700 hover:bg-red-50">
          Close
        </Button>
        <Button className="bg-red-600 hover:bg-red-700">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  );

  const renderDesktopComparison = () => (
    <div className="space-y-6">
      {/* Grade Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Select Grades to Compare</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
            className="flex items-center gap-2 border-gray-300 dark:border-zinc-700 hover:bg-red-50"
          >
            {showOnlyDifferences ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showOnlyDifferences ? "Show All Specifications" : "Show Only Differences"}
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {grades.map((grade: any, index: number) => (
            <Button
              key={grade.name}
              variant={selectedGrades.includes(index) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleGradeSelection(index)}
              className={`transition-all duration-300 ${
                selectedGrades.includes(index) 
                  ? 'bg-red-600 hover:bg-red-700 border-red-600' 
                  : 'hover:border-red-300'
              }`}
            >
              {selectedGrades.includes(index) && <Check className="h-3 w-3 mr-1" />}
              {grade.name}
              {grade.highlight === "Most Popular" && (
                <Badge className="bg-red-100 text-red-700 text-xs ml-1">Popular</Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop Comparison Table */}
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header Row with Grade Images and Info */}
          <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${selectedGrades.length}, 1fr)` }}>
            <div></div>
            {selectedGrades.map(gradeIndex => {
              const grade = grades[gradeIndex];
              return (
                <Card key={grade.name} className="overflow-hidden border-2 border-gray-200 hover:border-gray-300 dark:border-zinc-700 transition-colors">
                  <CardContent className="p-0">
                    {/* Grade Image with red accent */}
                    <div className="h-32 overflow-hidden border-b-2 border-gray-200">
                      <img
                        src={grade.image}
                        alt={grade.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Grade Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{grade.name}</h4>
                        <Badge variant="secondary" className={`text-xs ${
                          grade.highlight === "Most Popular" 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {grade.highlight}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{grade.description}</p>
                      
                      {/* Price with red accent */}
                      <div className="mb-4 p-2 bg-red-50 rounded-lg border border-gray-200">
                        <div className="font-bold text-xl text-red-800">AED {grade.fullPrice.toLocaleString()}</div>
                        <div className="text-sm text-red-600">From AED {grade.monthlyEMI}/month</div>
                      </div>

                      {/* Updated Action Buttons */}
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            size="sm" 
                            className="text-xs border-gray-300 dark:border-zinc-700 hover:bg-red-50"
                            onClick={() => window.open(`/test-drive?model=${encodeURIComponent(currentEngineData.name)}&grade=${encodeURIComponent(grade.name)}`, '_blank')}
                          >
                            <Car className="h-3 w-3 mr-1" />
                            Test Drive
                          </Button>
                          <Button
                            size="sm" 
                            className="text-xs bg-red-600 hover:bg-red-700"
                            onClick={() => window.open(`/configure?model=${encodeURIComponent(currentEngineData.name)}&grade=${encodeURIComponent(grade.name)}`, '_blank')}
                          >
                            <Wrench className="h-3 w-3 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Comparison Sections */}
          {comparisonSections.map(section => {
            const filteredItems = showOnlyDifferences 
              ? section.items.filter(item => hasDifferences(item.getValue, selectedGrades.map(i => grades[i])))
              : section.items;

            if (showOnlyDifferences && filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-300 dark:border-zinc-700 pb-2">
                  {section.title}
                  {showOnlyDifferences && filteredItems.length > 0 && (
                    <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">
                      {filteredItems.length} differences
                    </Badge>
                  )}
                </h3>
                
                {filteredItems.map(item => {
                  const hasDiff = hasDifferences(item.getValue, selectedGrades.map(i => grades[i]));
                  const values = selectedGrades.map(i => item.getValue(grades[i]));
                  
                  return (
                    <div key={item.label} className="grid gap-4 py-3 border-b border-border hover:bg-muted/50/30 transition-colors" style={{ gridTemplateColumns: `200px repeat(${selectedGrades.length}, 1fr)` }}>
                      <div className={`font-medium ${hasDiff ? 'text-red-700' : 'text-foreground'} flex items-center gap-1`}>
                        {item.label}
                        {hasDiff && <ArrowUpDown className="h-3 w-3 text-red-500" />}
                      </div>
                      {selectedGrades.map((gradeIndex, idx) => {
                        const grade = grades[gradeIndex];
                        const value = item.getValue(grade);
                        const comparison = hasDiff ? getValueComparison(value, values, item.label) : 'equal';
                        const ComparisonIcon = comparison === 'better' ? TrendingUp : 
                                             comparison === 'worse' ? TrendingDown : Equal;
                        
                        return (
                          <div key={gradeIndex} className={`text-sm flex items-center gap-1 ${
                            hasDiff 
                              ? comparison === 'better'
                                ? 'font-semibold text-green-700 bg-green-50 p-2 rounded'
                                : comparison === 'worse'
                                ? 'font-semibold text-red-700 bg-muted/50 p-2 rounded'
                                : 'font-semibold text-red-700 bg-muted/50 p-2 rounded'
                              : 'text-muted-foreground'
                          }`}>
                            {hasDiff && (
                              <ComparisonIcon className={`h-3 w-3 ${
                                comparison === 'better' ? 'text-green-600' :
                                comparison === 'worse' ? 'text-red-600' :
                                'text-gray-500'
                              }`} />
                            )}
                            {value}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Download Comparison */}
      <div className="flex justify-center pt-6 border-t border-gray-300 dark:border-zinc-700">
        <Button variant="outline" size="lg" className="border-gray-300 dark:border-zinc-700 hover:bg-muted/50">
          <Download className="h-4 w-4 mr-2" />
          Download Comparison PDF
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-6xl max-h-[90vh]'} overflow-y-auto border-2 border-gray-200`}>
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-red-600" />
              <span className="text-gray-900 dark:text-white">Compare {currentEngineData.name} Grades</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2 hover:bg-red-50">
              <X className="h-4 w-4 text-red-600" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {isMobile ? renderMobileComparison() : renderDesktopComparison()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GradeComparisonModal;
