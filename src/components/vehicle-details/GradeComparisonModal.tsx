
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
  ArrowUpDown
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

  // Comprehensive comparison sections
  const comparisonSections = [
    {
      id: 'pricing',
      title: "Pricing",
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
        }
      ]
    },
    {
      id: 'comfort',
      title: "Comfort & Convenience",
      items: [
        { 
          label: "Seating", 
          getValue: (grade: any) => grade.name === "Base" ? "Fabric Seats" : 
                                   grade.name === "SE" ? "Sport Fabric" : "Premium Leather",
          isHighlightable: true
        },
        { 
          label: "Climate Control", 
          getValue: (grade: any) => grade.name === "Base" ? "Manual A/C" : 
                                   grade.name === "SE" ? "Auto A/C" : "Dual-Zone Climate",
          isHighlightable: true
        },
        { 
          label: "Infotainment", 
          getValue: (grade: any) => grade.name === "Base" ? "7-inch Display" : 
                                   grade.name === "SE" ? "8-inch Touch" : "10-inch Premium",
          isHighlightable: true
        }
      ]
    },
    {
      id: 'safety',
      title: "Safety & Security",
      items: [
        { 
          label: "Airbags", 
          getValue: (grade: any) => grade.name === "Base" ? "6 Airbags" : "8 Airbags",
          isHighlightable: true
        },
        { 
          label: "Toyota Safety Sense", 
          getValue: (grade: any) => grade.name === "Base" ? "TSS 2.0" : "TSS 2.5+",
          isHighlightable: true
        },
        { 
          label: "Parking Assist", 
          getValue: (grade: any) => grade.name === "Base" ? "Rear Camera" : 
                                   grade.name === "SE" ? "Rear Camera + Sensors" : "360° View",
          isHighlightable: true
        }
      ]
    },
    {
      id: 'technology',
      title: "Technology",
      items: [
        { 
          label: "Audio System", 
          getValue: (grade: any) => grade.name === "Base" ? "6 Speakers" : 
                                   grade.name === "SE" ? "Premium 8 Speakers" : "JBL Premium",
          isHighlightable: true
        },
        { 
          label: "Smartphone Integration", 
          getValue: (grade: any) => "Apple CarPlay & Android Auto",
          isHighlightable: false
        },
        { 
          label: "Wireless Charging", 
          getValue: (grade: any) => grade.name === "Base" ? "Not Available" : "Available",
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
              className="h-auto p-3 flex flex-col items-start"
              disabled={selectedGrades.length >= 2 && !selectedGrades.includes(index)}
            >
              <div className="flex items-center gap-2 mb-1">
                {selectedGrades.includes(index) && <Check className="h-3 w-3" />}
                <span className="font-bold text-sm">{grade.name}</span>
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
              <Card key={grade.name} className="overflow-hidden">
                <CardContent className="p-3">
                  {/* Small Grade Image */}
                  <div className="h-16 mb-2 overflow-hidden rounded-lg">
                    <img
                      src={grade.image}
                      alt={grade.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h4 className="font-bold text-sm">{grade.name}</h4>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {grade.highlight}
                    </Badge>
                    <div className="mt-2">
                      <div className="font-bold text-sm">AED {grade.fullPrice.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">AED {grade.monthlyEMI}/month</div>
                    </div>
                    
                    <Button
                      onClick={() => onGradeSelect(grade.name)}
                      className={`w-full mt-2 text-xs ${
                        selectedGrade === grade.name
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-primary hover:bg-primary/90'
                      }`}
                      size="sm"
                    >
                      {selectedGrade === grade.name ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Selected
                        </>
                      ) : (
                        'Select'
                      )}
                    </Button>
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
            <Card key={section.id} className="overflow-hidden">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-3 flex items-center justify-between bg-muted/30 border-b hover:bg-muted/50 transition-colors"
              >
                <h3 className="font-bold text-sm text-left">{section.title}</h3>
                <div className="flex items-center gap-2">
                  {showOnlyDifferences && filteredItems.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filteredItems.length} differences
                    </Badge>
                  )}
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
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
                            <div className={`text-xs font-medium mb-2 ${hasDiff ? 'text-primary' : 'text-muted-foreground'}`}>
                              {item.label}
                              {hasDiff && <ArrowUpDown className="h-3 w-3 inline ml-1" />}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {selectedGrades.map((gradeIndex, idx) => (
                                <div 
                                  key={gradeIndex}
                                  className={`text-xs p-2 rounded-lg ${
                                    hasDiff 
                                      ? 'bg-primary/10 border border-primary/20 font-semibold' 
                                      : 'bg-muted/50'
                                  }`}
                                >
                                  {values[idx]}
                                </div>
                              ))}
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
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button>
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
          <h3 className="text-lg font-bold">Select Grades to Compare</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
            className="flex items-center gap-2"
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
              className="transition-all duration-300"
            >
              {selectedGrades.includes(index) && <Check className="h-3 w-3 mr-1" />}
              {grade.name}
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
                <Card key={grade.name} className="overflow-hidden">
                  <CardContent className="p-0">
                    {/* Small Grade Image */}
                    <div className="h-32 overflow-hidden">
                      <img
                        src={grade.image}
                        alt={grade.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Grade Info */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-lg">{grade.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {grade.highlight}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{grade.description}</p>
                      
                      {/* Price */}
                      <div className="mb-4">
                        <div className="font-bold text-xl">AED {grade.fullPrice.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">From AED {grade.monthlyEMI}/month</div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button
                          onClick={() => onGradeSelect(grade.name)}
                          className={`w-full text-xs ${
                            selectedGrade === grade.name
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-primary hover:bg-primary/90'
                          }`}
                          size="sm"
                        >
                          {selectedGrade === grade.name ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Selected
                            </>
                          ) : (
                            'Select Grade'
                          )}
                        </Button>
                        <Button variant="outline" size="sm" className="w-full text-xs">
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

          {/* Comparison Sections */}
          {comparisonSections.map(section => {
            const filteredItems = showOnlyDifferences 
              ? section.items.filter(item => hasDifferences(item.getValue, selectedGrades.map(i => grades[i])))
              : section.items;

            if (showOnlyDifferences && filteredItems.length === 0) return null;

            return (
              <div key={section.title} className="mb-8">
                <h3 className="text-lg font-bold mb-4 text-primary flex items-center gap-2">
                  {section.title}
                  {showOnlyDifferences && filteredItems.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filteredItems.length} differences
                    </Badge>
                  )}
                </h3>
                
                {filteredItems.map(item => {
                  const hasDiff = hasDifferences(item.getValue, selectedGrades.map(i => grades[i]));
                  
                  return (
                    <div key={item.label} className="grid gap-4 py-3 border-b border-border" style={{ gridTemplateColumns: `200px repeat(${selectedGrades.length}, 1fr)` }}>
                      <div className={`font-medium ${hasDiff ? 'text-primary' : 'text-foreground'} flex items-center gap-1`}>
                        {item.label}
                        {hasDiff && <ArrowUpDown className="h-3 w-3" />}
                      </div>
                      {selectedGrades.map(gradeIndex => {
                        const grade = grades[gradeIndex];
                        const value = item.getValue(grade);
                        
                        return (
                          <div key={gradeIndex} className={`text-sm ${
                            hasDiff ? 'font-semibold text-foreground' : 'text-muted-foreground'
                          }`}>
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
      <div className="flex justify-center pt-6 border-t border-border">
        <Button variant="outline" size="lg">
          <Download className="h-4 w-4 mr-2" />
          Download Comparison PDF
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-6xl max-h-[90vh]'} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Compare {currentEngineData.name} Grades</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full p-2">
              <X className="h-4 w-4" />
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
