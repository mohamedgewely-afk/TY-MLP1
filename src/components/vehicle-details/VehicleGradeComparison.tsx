
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
  Car,
  Star,
  Eye,
  EyeOff,
  ArrowUpDown
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Grade {
  name: string;
  description: string;
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

interface VehicleGradeComparisonProps {
  isOpen: boolean;
  onClose: () => void;
  engineName: string;
  grades: Grade[];
  onGradeSelect: (gradeName: string) => void;
  onCarBuilder: (gradeName: string) => void;
  onTestDrive: (gradeName: string) => void;
}

const VehicleGradeComparison: React.FC<VehicleGradeComparisonProps> = ({
  isOpen,
  onClose,
  engineName,
  grades,
  onGradeSelect,
  onCarBuilder,
  onTestDrive
}) => {
  const isMobile = useIsMobile();
  const maxGrades = isMobile ? 2 : 3;
  const [selectedGrades, setSelectedGrades] = useState<number[]>(
    grades.slice(0, maxGrades).map((_, index) => index)
  );
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);

  const toggleGradeSelection = (gradeIndex: number) => {
    if (selectedGrades.includes(gradeIndex)) {
      if (selectedGrades.length > 1) {
        setSelectedGrades(prev => prev.filter(i => i !== gradeIndex));
      }
    } else if (selectedGrades.length < maxGrades) {
      setSelectedGrades(prev => [...prev, gradeIndex].sort());
    }
  };

  const comparisonSpecs = [
    {
      title: "Pricing",
      items: [
        { 
          label: "Base Price", 
          getValue: (grade: Grade) => `AED ${grade.price.toLocaleString()}`
        },
        { 
          label: "Monthly EMI", 
          getValue: (grade: Grade) => `AED ${grade.monthlyFrom}`
        }
      ]
    },
    {
      title: "Performance",
      items: [
        { 
          label: "Engine", 
          getValue: (grade: Grade) => grade.specs.engine
        },
        { 
          label: "Power", 
          getValue: (grade: Grade) => grade.specs.power
        },
        { 
          label: "Torque", 
          getValue: (grade: Grade) => grade.specs.torque
        },
        { 
          label: "0-100 km/h", 
          getValue: (grade: Grade) => grade.specs.acceleration
        }
      ]
    },
    {
      title: "Features",
      items: [
        { 
          label: "Key Features", 
          getValue: (grade: Grade) => grade.features.join(", ")
        }
      ]
    }
  ];

  const hasDifferences = (getValue: (grade: Grade) => string, selectedGradeObjects: Grade[]) => {
    const values = selectedGradeObjects.map(getValue);
    return new Set(values).size > 1;
  };

  const selectedGradeObjects = selectedGrades.map(index => grades[index]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-6xl max-h-[90vh]'} overflow-y-auto`}>
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center justify-between">
            <span>Compare {engineName} Grades</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Grade Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Grades to Compare</h3>
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
            
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-3`}>
              {grades.map((grade, index) => (
                <Button
                  key={grade.name}
                  variant={selectedGrades.includes(index) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleGradeSelection(index)}
                  className="h-auto p-3 flex flex-col items-start"
                  disabled={selectedGrades.length >= maxGrades && !selectedGrades.includes(index)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {selectedGrades.includes(index) && <Check className="h-3 w-3" />}
                    <span className="font-semibold text-sm">{grade.name}</span>
                    {grade.badge === "Most Popular" && (
                      <Badge className="bg-orange-100 text-orange-700 text-xs px-1 py-0">
                        <Star className="h-2 w-2 mr-1" />
                        Popular
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs opacity-80">AED {grade.price.toLocaleString()}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Grade Images and Info */}
          <div className={`grid ${isMobile ? 'grid-cols-1' : `grid-cols-${selectedGrades.length}`} gap-4`}>
            {selectedGradeObjects.map((grade, idx) => (
              <Card key={grade.name} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={grade.image}
                      alt={grade.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{grade.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {grade.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{grade.description}</p>
                    <div className="mb-4">
                      <div className="font-bold text-lg">AED {grade.price.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">From AED {grade.monthlyFrom}/month</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          onGradeSelect(grade.name);
                          onClose();
                        }}
                      >
                        Select
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          onTestDrive(grade.name);
                          onClose();
                        }}
                      >
                        <Car className="h-3 w-3 mr-1" />
                        Drive
                      </Button>
                      <Button
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          onCarBuilder(grade.name);
                          onClose();
                        }}
                      >
                        <Wrench className="h-3 w-3 mr-1" />
                        Build
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="space-y-6">
            {comparisonSpecs.map(section => {
              const filteredItems = showOnlyDifferences 
                ? section.items.filter(item => hasDifferences(item.getValue, selectedGradeObjects))
                : section.items;

              if (showOnlyDifferences && filteredItems.length === 0) return null;

              return (
                <div key={section.title}>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    {section.title}
                    {showOnlyDifferences && filteredItems.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {filteredItems.length} differences
                      </Badge>
                    )}
                  </h3>
                  
                  {filteredItems.map(item => {
                    const hasDiff = hasDifferences(item.getValue, selectedGradeObjects);
                    
                    return (
                      <div key={item.label} className={`grid gap-4 py-3 border-b ${isMobile ? 'grid-cols-1' : `grid-cols-${selectedGrades.length + 1}`}`}>
                        <div className={`font-medium flex items-center gap-1 ${hasDiff ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.label}
                          {hasDiff && <ArrowUpDown className="h-3 w-3" />}
                        </div>
                        {isMobile ? (
                          <div className="space-y-2">
                            {selectedGradeObjects.map((grade, idx) => (
                              <div key={idx} className={`text-sm p-2 rounded ${hasDiff ? 'bg-muted font-medium' : ''}`}>
                                <span className="font-medium">{grade.name}:</span> {item.getValue(grade)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          selectedGradeObjects.map((grade, idx) => (
                            <div key={idx} className={`text-sm ${hasDiff ? 'font-medium bg-muted p-2 rounded' : 'text-muted-foreground'}`}>
                              {item.getValue(grade)}
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleGradeComparison;
