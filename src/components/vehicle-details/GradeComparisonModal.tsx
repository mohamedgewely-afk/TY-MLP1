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

const hasDifferences = (getValue: (grade: any) => string, grades: any[]) => {
  const values = grades.map(getValue);
  return new Set(values).size > 1;
};

const getValueComparison = (currentValue: string, allValues: string[], itemLabel: string) => {
  if (!hasDifferences(() => currentValue, allValues.map(v => ({ getValue: () => v })))) {
    return 'equal';
  }

  if (itemLabel.toLowerCase().includes('price') || itemLabel.toLowerCase().includes('emi')) {
    const numericValues = allValues.map(v => parseFloat(v.replace(/[^\d.]/g, '')));
    const currentNumeric = parseFloat(currentValue.replace(/[^\d.]/g, ''));
    const minValue = Math.min(...numericValues);
    return currentNumeric === minValue ? 'better' : 'worse';
  }

  if (itemLabel.toLowerCase().includes('acceleration')) {
    const numericValues = allValues.map(v => parseFloat(v.replace(/[^\d.]/g, '')));
    const currentNumeric = parseFloat(currentValue.replace(/[^\d.]/g, ''));
    const minValue = Math.min(...numericValues);
    return currentNumeric === minValue ? 'better' : 'worse';
  }

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
    // ... other sections unchanged for now
  ];

  const renderMobileComparison = () => (
    <div className="space-y-4">
      {/* Grade Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Select 2 Grades to Compare</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOnlyDifferences(!showOnlyDifferences)}
            className="flex items-center gap-2 border-neutral-300 hover:border-[#9E1B32]"
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
                  ? 'bg-[#9E1B32] hover:bg-[#7A1226] border-[#9E1B32] text-white'
                  : 'hover:border-[#E3C4C9]'
              }`}
              disabled={selectedGrades.length >= 2 && !selectedGrades.includes(index)}
            >
              <div className="flex items-center gap-2 mb-1">
                {selectedGrades.includes(index) && <Check className="h-3 w-3" />}
                <span className="font-bold text-sm">{grade.name}</span>
                {grade.highlight === "Most Popular" && (
                  <Badge className="bg-[#FBEAEA] text-[#9E1B32] text-xs px-1 py-0">Popular</Badge>
                )}
              </div>
              <span className="text-xs opacity-80">AED {grade.fullPrice.toLocaleString()}</span>
            </Button>
          ))}
        </div>
      </div>
      {/* Mobile Side-by-Side Comparison */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {selectedGrades.map(gradeIndex => {
            const grade = grades[gradeIndex];
            return (
              <Card
                key={grade.name}
                className="overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-colors rounded-xl shadow-sm"
              >
                <CardContent className="p-3">
                  {/* Grade Image */}
                  <div className="h-16 mb-2 overflow-hidden rounded-lg border border-neutral-200">
                    <img
                      src={grade.image}
                      alt={grade.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Grade Info */}
                  <div className="text-center">
                    <h4 className="font-semibold text-sm text-neutral-900 dark:text-white">{grade.name}</h4>
                    <Badge
                      variant="secondary"
                      className={`text-xs mt-1 ${
                        grade.highlight === "Most Popular"
                          ? "bg-[#FBEAEA] text-[#9E1B32]"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {grade.highlight}
                    </Badge>
                    <div className="mt-2">
                      <div className="font-semibold text-sm text-[#9E1B32]">
                        AED {grade.fullPrice.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        AED {grade.monthlyEMI}/month
                      </div>
                    </div>

                    {/* Responsive Buttons (fixed layout) */}
                    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-gray-300 dark:border-zinc-700 hover:border-[#9E1B32] hover:text-[#9E1B32]"
                        onClick={() =>
                          window.open(
                            `/test-drive?model=${encodeURIComponent(
                              currentEngineData.name
                            )}&grade=${encodeURIComponent(grade.name)}`,
                            "_blank"
                          )
                        }
                      >
                        <Car className="h-3 w-3 mr-1" />
                        Test Drive
                      </Button>

                      <Button
                        size="sm"
                        className="text-xs bg-[#9E1B32] hover:bg-[#7A1226] text-white"
                        onClick={() =>
                          window.open(
                            `/configure?model=${encodeURIComponent(
                              currentEngineData.name
                            )}&grade=${encodeURIComponent(grade.name)}`,
                            "_blank"
                          )
                        }
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
<div className="overflow-x-auto">
  <div className="min-w-full">
    {/* Grade Header Cards */}
    <div
      className="grid gap-4 mb-6"
      style={{ gridTemplateColumns: `200px repeat(${selectedGrades.length}, 1fr)` }}
    >
      <div></div>
      {selectedGrades.map((gradeIndex) => {
        const grade = grades[gradeIndex];
        return (
          <Card
            key={grade.name}
            className="border border-neutral-200 rounded-xl shadow-sm"
          >
            <CardContent className="p-0">
              <div className="h-32 overflow-hidden border-b border-neutral-200">
                <img
                  src={grade.image}
                  alt={grade.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
                    {grade.name}
                  </h4>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      grade.highlight === "Most Popular"
                        ? "bg-[#FBEAEA] text-[#9E1B32]"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {grade.highlight}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {grade.description}
                </p>

                {/* Pricing Block */}
                <div className="mb-4 p-2 bg-[#FBEAEA] rounded-lg border border-[#FBEAEA]">
                  <div className="font-bold text-lg text-[#9E1B32]">
                    AED {grade.fullPrice.toLocaleString()}
                  </div>
                  <div className="text-sm text-[#9E1B32]">
                    From AED {grade.monthlyEMI}/month
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs border-gray-300 dark:border-zinc-700 hover:text-[#9E1B32] hover:border-[#9E1B32]"
                    onClick={() =>
                      window.open(
                        `/test-drive?model=${encodeURIComponent(
                          currentEngineData.name
                        )}&grade=${encodeURIComponent(grade.name)}`,
                        "_blank"
                      )
                    }
                  >
                    <Car className="h-3 w-3 mr-1" />
                    Test Drive
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs bg-[#9E1B32] hover:bg-[#7A1226] text-white"
                    onClick={() =>
                      window.open(
                        `/configure?model=${encodeURIComponent(
                          currentEngineData.name
                        )}&grade=${encodeURIComponent(grade.name)}`,
                        "_blank"
                      )
                    }
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

    {/* Comparison Sections Render - use same updated styling as mobile in same way */}
    {/* You can keep your existing logic for sections here, but make sure to tone down red background to #FBEAEA and use text-[#9E1B32] */}
  </div>
</div>
<DialogContent
  className={`${isMobile ? 'max-w-[95vw] max-h-[90vh]' : 'max-w-6xl max-h-[90vh]'} overflow-y-auto border border-gray-200 rounded-xl shadow-lg`}
>
  <DialogHeader className="border-b border-gray-200 pb-4">
    <DialogTitle className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-[#9E1B32]" />
        <span className="text-gray-900 dark:text-white text-base font-semibold">
          Compare {currentEngineData.name} Grades
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="rounded-full p-1 hover:bg-[#FBEAEA]"
      >
        <X className="h-4 w-4 text-[#9E1B32]" />
      </Button>
    </DialogTitle>
  </DialogHeader>

  <div className="mt-6">
    {isMobile ? renderMobileComparison() : renderDesktopComparison()}
  </div>
</DialogContent>
<div className={`${isMobile ? 'grid grid-cols-2 gap-3 pt-4' : 'flex justify-center pt-6 border-t border-gray-300 dark:border-zinc-700'}`}>
  <Button
    variant="outline"
    onClick={onClose}
    className="border-gray-300 dark:border-zinc-700 hover:bg-[#FBEAEA] hover:text-[#9E1B32]"
  >
    Close
  </Button>

  <Button
    className="bg-[#9E1B32] hover:bg-[#7A1226] text-white"
    onClick={() => {
      // Add logic if needed
    }}
  >
    <Download className="h-4 w-4 mr-2" />
    Download PDF
  </Button>
</div>
