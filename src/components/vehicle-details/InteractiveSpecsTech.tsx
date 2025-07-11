
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft,
  ChevronRight,
  Check,
  PencilRuler,
  Download
} from "lucide-react";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";

interface InteractiveSpecsTechProps {
  vehicle: VehicleModel;
}

const InteractiveSpecsTech: React.FC<InteractiveSpecsTechProps> = ({ vehicle }) => {
  const [selectedEngine, setSelectedEngine] = useState("2.5L Hybrid");
  const [currentGradeIndex, setCurrentGradeIndex] = useState(0);
  const isMobile = useIsMobile();

  const grades = [
    {
      name: "Base",
      fullPrice: 89900,
      monthlyEMI: 899,
      description: "Essential features for everyday driving",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/28f33a08-ebcf-4ead-bece-c6a87bdf8202/renditions/8e932ad8-f4b4-46af-9963-31e6afe9e75d?binary=true&mformat=true",
      specs: {
        "Engine": "2.5L Hybrid",
        "Power": "218 HP",
        "Transmission": "CVT",
        "Drivetrain": "FWD",
        "Fuel Economy": "25.2 km/L",
        "Safety Rating": "5-Star NCAP",
        "Seating": "5 Passengers",
        "Cargo Space": "456L"
      },
      highlight: "Great Value"
    },
    {
      name: "SE",
      fullPrice: 94900,
      monthlyEMI: 945,
      description: "Sport-enhanced driving experience",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
      specs: {
        "Engine": "2.5L Hybrid",
        "Power": "218 HP", 
        "Transmission": "CVT",
        "Drivetrain": "FWD",
        "Fuel Economy": "25.2 km/L",
        "Safety Rating": "5-Star NCAP",
        "Seating": "5 Passengers",
        "Cargo Space": "456L"
      },
      highlight: "Sport Package"
    },
    {
      name: "XLE",
      fullPrice: 104900,
      monthlyEMI: 1099,
      description: "Premium comfort and convenience",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/251b16c8-aa49-4695-84a8-db323bf20983/renditions/83b86a73-7570-46fe-8d12-36ea57577738?binary=true&mformat=true",
      specs: {
        "Engine": "2.5L Hybrid",
        "Power": "218 HP",
        "Transmission": "CVT", 
        "Drivetrain": "AWD",
        "Fuel Economy": "24.8 km/L",
        "Safety Rating": "5-Star NCAP",
        "Seating": "5 Passengers",
        "Cargo Space": "456L"
      },
      highlight: "Most Popular"
    },
    {
      name: "Limited",
      fullPrice: 119900,
      monthlyEMI: 1249,
      description: "Luxury features and premium materials",
      image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/e17fbeb2-7fd7-4ede-b289-a0132c22cc6d/items/28f33a08-ebcf-4ead-bece-c6a87bdf8202/renditions/8e932ad8-f4b4-46af-9963-31e6afe9e75d?binary=true&mformat=true",
      specs: {
        "Engine": "3.5L V6",
        "Power": "301 HP",
        "Transmission": "8-Speed Auto",
        "Drivetrain": "AWD", 
        "Fuel Economy": "20.5 km/L",
        "Safety Rating": "5-Star NCAP",
        "Seating": "5 Passengers",
        "Cargo Space": "456L"
      },
      highlight: "Ultimate Luxury"
    }
  ];

  const engines = [
    {
      name: "2.5L Hybrid",
      power: "218 HP",
      torque: "221 lb-ft",
      efficiency: "25.2 km/L",
      description: "Advanced hybrid powertrain with seamless electric assist"
    },
    {
      name: "3.5L V6",
      power: "301 HP", 
      torque: "267 lb-ft",
      efficiency: "18.4 km/L",
      description: "Powerful V6 engine for enhanced performance"
    }
  ];

  // Filter grades based on selected engine
  const getGradesForEngine = (engine: string) => {
    if (engine === "3.5L V6") {
      return grades.filter(grade => grade.name === "Limited");
    }
    return grades.filter(grade => grade.name !== "Limited" || grade.specs.Engine === "2.5L Hybrid");
  };

  const availableGrades = getGradesForEngine(selectedEngine);
  const currentGrade = availableGrades[Math.min(currentGradeIndex, availableGrades.length - 1)];

  const nextGrade = () => {
    setCurrentGradeIndex((prev) => (prev + 1) % availableGrades.length);
  };

  const prevGrade = () => {
    setCurrentGradeIndex((prev) => (prev - 1 + availableGrades.length) % availableGrades.length);
  };

  const handleEngineChange = (engine: string) => {
    setSelectedEngine(engine);
    const newGrades = getGradesForEngine(engine);
    setCurrentGradeIndex(0);
  };

  const handleConfigureClick = () => {
    const event = new CustomEvent('openCarBuilder', {
      detail: {
        step: 3,
        config: {
          modelYear: "2025",
          engine: selectedEngine,
          grade: currentGrade.name,
          exteriorColor: "",
          interiorColor: "",
          accessories: []
        }
      }
    });
    window.dispatchEvent(event);
  };

  const handleDownloadPDF = (gradeName: string) => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `Toyota-${vehicle.name}-${gradeName}-Specifications.pdf`;
    link.click();
  };

  return (
    <section className="py-12 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="toyota-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4">
            Interactive Experience
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-black text-foreground mb-4 lg:mb-6">
            Choose Your Perfect Grade
          </h2>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Select your engine and explore detailed specifications for each grade.
          </p>
        </motion.div>

        {/* Engine Selection Above Carousel */}
        <div className="max-w-2xl mx-auto mb-8">
          <h3 className="text-xl font-bold text-center mb-4">Choose Your Engine</h3>
          <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {engines.map((engine) => (
              <motion.button
                key={engine.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl transition-all duration-200 border-2 text-left ${
                  selectedEngine === engine.name 
                    ? 'bg-primary/10 border-primary shadow-lg' 
                    : 'bg-card border-border hover:border-primary/50'
                }`}
                onClick={() => handleEngineChange(engine.name)}
              >
                <h4 className="text-lg font-bold">{engine.name}</h4>
                <p className="text-primary text-sm">{engine.power} • {engine.torque}</p>
                <p className="text-xs text-muted-foreground mt-1">{engine.efficiency}</p>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Grades Carousel */}
        <div className="relative">
          {/* Desktop: Side Navigation */}
          {!isMobile && availableGrades.length > 1 && (
            <>
              <button
                onClick={prevGrade}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border hover:shadow-2xl transition-all duration-300 -translate-x-4"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button
                onClick={nextGrade}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border hover:shadow-2xl transition-all duration-300 translate-x-4"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Grade Cards */}
          <div className="mx-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentGrade.name}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-white to-primary/5">
                  <CardContent className="p-0">
                    {/* Grade Image */}
                    <div className="relative aspect-video bg-muted">
                      <img
                        src={currentGrade.image}
                        alt={`${currentGrade.name} Grade`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-gray-900">
                          {currentGrade.name} Grade
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-primary text-primary-foreground">
                          {currentGrade.highlight}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-2xl font-bold mb-2">{currentGrade.name}</h3>
                        <p className="text-muted-foreground">{currentGrade.description}</p>
                      </div>

                      {/* Pricing */}
                      <div className="text-center mb-6 p-4 bg-primary/5 rounded-lg">
                        <div className="text-3xl font-black text-primary">
                          AED {currentGrade.fullPrice.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Starting from AED {currentGrade.monthlyEMI}/month
                        </div>
                      </div>

                      {/* Full Specifications */}
                      <div className="mb-6">
                        <h4 className="font-bold mb-4">Complete Specifications</h4>
                        <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
                          {Object.entries(currentGrade.specs).map(([key, value]) => (
                            <div key={key} className="text-center p-3 bg-muted/50 rounded-lg">
                              <div className="text-xs text-muted-foreground mb-1">{key}</div>
                              <div className="font-bold text-sm">{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        <Button 
                          onClick={handleConfigureClick}
                          className="flex-1"
                        >
                          <PencilRuler className="h-4 w-4 mr-2" />
                          Configure This Grade
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={() => handleDownloadPDF(currentGrade.name)}
                          className="flex-1"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Navigation Dots */}
          {isMobile && availableGrades.length > 1 && (
            <div className="flex justify-center space-x-2 mt-6">
              {availableGrades.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGradeIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentGradeIndex 
                      ? 'bg-primary w-8' 
                      : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InteractiveSpecsTech;
