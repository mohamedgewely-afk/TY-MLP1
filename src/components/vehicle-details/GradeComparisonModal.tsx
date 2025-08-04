
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
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface GradeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEngineData: any;
  onGradeSelect: (gradeName: string) => void;
  selectedGrade: string;
}

const GradeComparisonModal: React.FC<GradeComparisonModalProps> = ({
  isOpen,
  onClose,
  currentEngineData,
  onGradeSelect,
  selectedGrade
}) => {
  const [mobileGradeIndex, setMobileGradeIndex] = useState(0);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([0, 1]);
  const isMobile = useIsMobile();

  const grades = currentEngineData.grades;

  const toggleGradeSelection = (gradeIndex: number) => {
    if (selectedGrades.includes(gradeIndex)) {
      if (selectedGrades.length > 1) {
        setSelectedGrades(prev => prev.filter(i => i !== gradeIndex));
      }
    } else if (selectedGrades.length < 3) {
      setSelectedGrades(prev => [...prev, gradeIndex].sort());
    }
  };

  const comparisonSections = [
    {
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
        }
      ]
    },
    {
      title: "Engine Specifications",
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
        }
      ]
    },
    {
      title: "Performance",
      items: [
        { 
          label: "Acceleration (0-60)", 
          getValue: (grade: any) => grade.specs.acceleration,
          isHighlightable: true
        },
        { 
          label: "Fuel Economy", 
          getValue: (grade: any) => grade.specs.fuelEconomy,
          isHighlightable: true
        },
        { 
          label: "CO2 Emissions", 
          getValue: (grade: any) => grade.specs.co2Emissions,
          isHighlightable: true
        }
      ]
    }
  ];

  const renderDesktopComparison = () => (
    <div className="space-y-6">
      {/* Grade Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
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

      {/* Comparison Table */}
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
          {comparisonSections.map(section => (
            <div key={section.title} className="mb-8">
              <h3 className="text-lg font-bold mb-4 text-primary">{section.title}</h3>
              
              {section.items.map(item => (
                <div key={item.label} className="grid gap-4 py-3 border-b border-border" style={{ gridTemplateColumns: `200px repeat(${selectedGrades.length}, 1fr)` }}>
                  <div className="font-medium text-foreground">{item.label}</div>
                  {selectedGrades.map(gradeIndex => {
                    const grade = grades[gradeIndex];
                    const value = item.getValue(grade);
                    
                    return (
                      <div key={gradeIndex} className="text-sm text-muted-foreground">
                        {value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
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

  const renderMobileComparison = () => (
    <div className="space-y-4">
      {/* Grade Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileGradeIndex(prev => Math.max(0, prev - 1))}
          disabled={mobileGradeIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h3 className="font-bold">{grades[mobileGradeIndex].name}</h3>
          <p className="text-xs text-muted-foreground">
            {mobileGradeIndex + 1} of {grades.length}
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileGradeIndex(prev => Math.min(grades.length - 1, prev + 1))}
          disabled={mobileGradeIndex === grades.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Grade Details */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Grade Image */}
          <div className="h-48 overflow-hidden">
            <img
              src={grades[mobileGradeIndex].image}
              alt={grades[mobileGradeIndex].name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Grade Content */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-xl">{grades[mobileGradeIndex].name}</h4>
              <Badge variant="secondary">
                <Sparkles className="h-3 w-3 mr-1" />
                {grades[mobileGradeIndex].highlight}
              </Badge>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              {grades[mobileGradeIndex].description}
            </p>

            {/* Price */}
            <div className="mb-6">
              <div className="font-bold text-2xl">
                AED {grades[mobileGradeIndex].fullPrice.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                From AED {grades[mobileGradeIndex].monthlyEMI}/month
              </div>
            </div>

            {/* Specifications */}
            {comparisonSections.map(section => (
              <div key={section.title} className="mb-6">
                <h5 className="font-bold text-primary mb-3">{section.title}</h5>
                <div className="space-y-2">
                  {section.items.map(item => (
                    <div key={item.label} className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.getValue(grades[mobileGradeIndex])}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => onGradeSelect(grades[mobileGradeIndex].name)}
                className={`w-full ${
                  selectedGrade === grades[mobileGradeIndex].name
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {selectedGrade === grades[mobileGradeIndex].name ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Selected
                  </>
                ) : (
                  'Select This Grade'
                )}
              </Button>
              
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Wrench className="h-3 w-3 mr-1" />
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Indicators */}
      <div className="flex justify-center space-x-2">
        {grades.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setMobileGradeIndex(index)}
            className={`rounded-full transition-all duration-300 ${
              index === mobileGradeIndex 
                ? 'bg-primary w-6 h-2' 
                : 'bg-gray-300 w-2 h-2 hover:bg-primary/50'
            }`}
          />
        ))}
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
