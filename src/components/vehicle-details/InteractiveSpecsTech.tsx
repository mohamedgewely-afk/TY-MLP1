
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Gauge, 
  Fuel, 
  Shield, 
  Zap, 
  Car, 
  Settings, 
  Star, 
  Award,
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
        "Safety Rating": "5-Star NCAP"
      },
      highlight: "Great Value",
      pdfUrl: "/brochures/camry-base-2025.pdf"
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
        "Safety Rating": "5-Star NCAP"
      },
      highlight: "Sport Package",
      pdfUrl: "/brochures/camry-se-2025.pdf"
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
        "Safety Rating": "5-Star NCAP"
      },
      highlight: "Most Popular",
      pdfUrl: "/brochures/camry-xle-2025.pdf"
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
        "Safety Rating": "5-Star NCAP"
      },
      highlight: "Ultimate Luxury",
      pdfUrl: "/brochures/camry-limited-2025.pdf"
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
      return grades.filter(grade => grade.specs.Engine === "3.5L V6");
    }
    return grades.filter(grade => grade.specs.Engine === "2.5L Hybrid");
  };

  const availableGrades = getGradesForEngine(selectedEngine);

  const nextGrade = () => {
    setCurrentGradeIndex((prev) => (prev + 1) % availableGrades.length);
  };

  const prevGrade = () => {
    setCurrentGradeIndex((prev) => (prev - 1 + availableGrades.length) % availableGrades.length);
  };

  const handleEngineChange = (engine: string) => {
    setSelectedEngine(engine);
    setCurrentGradeIndex(0);
  };

  const handleConfigureClick = (grade: any) => {
    const event = new CustomEvent('openCarBuilder', {
      detail: {
        step: 3,
        config: {
          modelYear: "2025",
          engine: selectedEngine,
          grade: grade.name,
          exteriorColor: "",
          interiorColor: "",
          accessories: []
        }
      }
    });
    window.dispatchEvent(event);
  };

  const handleDownloadPDF = (pdfUrl: string, gradeName: string) => {
    // Create a temporary link element to trigger download
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `toyota-camry-${gradeName.toLowerCase()}-specs.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            Select your preferred engine and explore the available grades with detailed specifications.
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
          {/* Navigation Buttons - Desktop */}
          {!isMobile && availableGrades.length > 1 && (
            <>
              <button
                onClick={prevGrade}
                disabled={currentGradeIndex === 0}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border hover:shadow-2xl transition-all duration-300 -translate-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <button
                onClick={nextGrade}
                disabled={currentGradeIndex >= availableGrades.length - 1}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 rounded-full bg-white shadow-xl border hover:shadow-2xl transition-all duration-300 translate-x-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Grades Display */}
          <div className="overflow-hidden mx-8">
            {isMobile ? (
              // Mobile: Single card with navigation
              <div className="space-y-4">
                {/* Mobile Navigation */}
                {availableGrades.length > 1 && (
                  <div className="flex items-center justify-between mb-4">
                    <button
                      onClick={prevGrade}
                      disabled={currentGradeIndex === 0}
                      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div className="flex space-x-2">
                      {availableGrades.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentGradeIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentGradeIndex 
                              ? 'bg-primary w-6' 
                              : 'bg-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={nextGrade}
                      disabled={currentGradeIndex >= availableGrades.length - 1}
                      className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${selectedEngine}-${currentGradeIndex}`}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    {availableGrades[currentGradeIndex] && (
                      <GradeCard 
                        grade={availableGrades[currentGradeIndex]} 
                        onConfigure={handleConfigureClick}
                        onDownloadPDF={handleDownloadPDF}
                        isMobile={isMobile}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            ) : (
              // Desktop: Carousel
              <motion.div
                className="grid gap-6 transition-transform duration-500"
                style={{
                  gridTemplateColumns: `repeat(${availableGrades.length}, minmax(0, 1fr))`,
                  transform: `translateX(-${currentGradeIndex * (100 / availableGrades.length)}%)`
                }}
              >
                {availableGrades.map((grade, index) => (
                  <motion.div
                    key={`${grade.name}-${selectedEngine}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GradeCard 
                      grade={grade} 
                      onConfigure={handleConfigureClick}
                      onDownloadPDF={handleDownloadPDF}
                      isMobile={isMobile}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Desktop Indicators */}
          {!isMobile && availableGrades.length > 1 && (
            <div className="flex justify-center space-x-2 mt-8">
              {availableGrades.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentGradeIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentGradeIndex 
                      ? 'bg-primary w-8 shadow-lg' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
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

// Grade Card Component
const GradeCard: React.FC<{
  grade: any;
  onConfigure: (grade: any) => void;
  onDownloadPDF: (pdfUrl: string, gradeName: string) => void;
  isMobile: boolean;
}> = ({ grade, onConfigure, onDownloadPDF, isMobile }) => {
  return (
    <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 group bg-white">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={grade.image}
          alt={`${grade.name} Grade`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-white/95 text-gray-900 border-0 shadow-md">
            {grade.name} Grade
          </Badge>
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-primary text-primary-foreground border-0 shadow-md font-bold">
            {grade.highlight}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              {grade.name}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              {grade.description}
            </p>
            
            <div className="text-center mb-4 p-4 bg-primary/5 rounded-lg">
              <div className="text-2xl font-black text-primary">
                AED {grade.fullPrice.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Starting from AED {grade.monthlyEMI}/month
              </div>
            </div>
          </div>

          {/* Full Specifications */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Full Specifications</h4>
            <div className={`grid gap-2 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {Object.entries(grade.specs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center text-xs p-2 bg-muted/30 rounded">
                  <span className="font-medium text-muted-foreground">{key}</span>
                  <span className="text-primary font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={() => onConfigure(grade)}
              className="flex-1"
              size="sm"
            >
              <PencilRuler className="h-4 w-4 mr-2" />
              Configure This Grade
            </Button>
            
            <Button 
              onClick={() => onDownloadPDF(grade.pdfUrl, grade.name)}
              variant="outline"
              size="sm"
              className="px-3"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveSpecsTech;
