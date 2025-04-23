
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { CarFront, Fuel, ArrowRight, Eye, Settings, CircleChevronRight, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";

interface VehicleSpecsProps {
  vehicle: VehicleModel;
}

// Enhanced specifications with real data
const gradeSpecs = [
  {
    grade: "SE",
    price: 26320,
    image: "https://toyotaassets.scene7.com/is/image/toyota/CAM_MY23_0021_V001-1?fmt=jpg&crop=3,86,2500,1563&anchor=1252,867&wid=1250&hei=781",
    highlighted: false,
    performance: [
      { label: "Engine", value: "2.5L Dynamic Force Engine" },
      { label: "Power", value: "203 hp" },
      { label: "Torque", value: "184 lb-ft" },
      { label: "Fuel Economy", value: "28/39/32 (city/hwy/combined)" },
    ],
    features: [
      "Bi-LED combination headlights with auto on/off feature",
      "17-in. alloy wheels",
      "Dual-zone automatic climate control",
      "7-in. digital instrument cluster",
      "Android Auto™ & Apple CarPlay® compatibility",
    ]
  },
  {
    grade: "XSE",
    price: 30910,
    image: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_08_s.jpg",
    highlighted: true,
    performance: [
      { label: "Engine", value: "2.5L Dynamic Force Engine" },
      { label: "Power", value: "206 hp" },
      { label: "Torque", value: "186 lb-ft" },
      { label: "Fuel Economy", value: "25/34/29 (city/hwy/combined)" },
    ],
    features: [
      "19-in. gloss-black alloy wheels",
      "Gloss-black front grille with sport mesh insert",
      "Leather-trimmed heated front seats",
      "9-in. touchscreen with premium audio",
      "Panoramic glass roof with front power tilt/slide"
    ]
  },
  {
    grade: "Hybrid XLE",
    price: 32920,
    image: "https://global.toyota/pages/news/images/2021/07/15/1330/20210715_01_02_s.jpg",
    highlighted: false,
    performance: [
      { label: "Engine", value: "2.5L Hybrid System" },
      { label: "Power", value: "208 hp (combined)" },
      { label: "Torque", value: "163 lb-ft (engine only)" },
      { label: "Fuel Economy", value: "44/47/46 (city/hwy/combined)" },
    ],
    features: [
      "18-in. silver machine-finished alloy wheels",
      "LED headlights with fully integrated LED DRLs",
      "Qi-compatible wireless smartphone charging",
      "Heated front seats with 8-way power-adjustable driver's seat",
      "Blind Spot Monitor with Rear Cross-Traffic Alert"
    ]
  }
];

const VehicleSpecs: React.FC<VehicleSpecsProps> = ({ vehicle }) => {
  const [selectedGrade, setSelectedGrade] = useState(1); // Default to XSE (highlighted)
  const [compareMode, setCompareMode] = useState(false);
  const [selectedGrades, setSelectedGrades] = useState<number[]>([1]); // Default XSE selected
  const [showComparison, setShowComparison] = useState(false);
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  const toggleGradeCompare = (index: number) => {
    if (selectedGrades.includes(index)) {
      if (selectedGrades.length > 1) {
        setSelectedGrades(selectedGrades.filter(i => i !== index));
      }
    } else {
      if (selectedGrades.length < 3) {
        setSelectedGrades([...selectedGrades, index]);
      }
    }
  };

  // Redirect to configure with pre-selected grade
  const handleConfigureGrade = (gradeIndex: number) => {
    // In a real app, this would navigate to the configure page with the grade pre-selected
    console.log(`Configuring grade: ${gradeSpecs[gradeIndex].grade}`);
    // This would typically be a navigation action
  };

  // Helper function to check if values are different
  const hasDifferences = (values: string[]) => {
    return new Set(values).size > 1;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-12">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Available Grades</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setCompareMode(!compareMode);
                if (!compareMode) {
                  setSelectedGrades([1]); // Reset to XSE when entering compare mode
                }
              }}
            >
              {compareMode ? "Exit Compare" : "Compare Grades"}
            </Button>
            {compareMode && selectedGrades.length > 1 && (
              <Button 
                className="bg-toyota-red hover:bg-toyota-darkred"
                onClick={() => setShowComparison(true)}
              >
                View Comparison
              </Button>
            )}
          </div>
        </div>

        {/* Grades Section as Carousel (Swipeable) */}
        <Carousel
          opts={{
            align: "start",
            loop: false
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {gradeSpecs.map((grade, index) => (
              <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  <div 
                    className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                      !compareMode && selectedGrade === index ? 'ring-2 ring-toyota-red' : ''
                    } ${
                      compareMode && selectedGrades.includes(index) ? 'ring-2 ring-toyota-red' : ''
                    } hover:shadow-lg h-full`}
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={grade.image} 
                        alt={`${vehicle.name} ${grade.grade}`} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {grade.highlighted && (
                        <div className="absolute top-3 right-3 bg-toyota-red text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                          Most Popular
                        </div>
                      )}
                      {compareMode && (
                        <div 
                          className="absolute top-3 left-3 h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer bg-white"
                          onClick={() => toggleGradeCompare(index)}
                        >
                          {selectedGrades.includes(index) && (
                            <div className="h-3 w-3 bg-toyota-red rounded-full"></div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-lg font-bold">{grade.grade}</h3>
                        <span className="text-toyota-red font-semibold">
                          ${grade.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-3 text-xs mb-2">
                        {grade.performance.map((perf, i) => (
                          <div key={i} className="text-gray-500">
                            <span className="block font-medium text-gray-800 dark:text-gray-100">{perf.label}</span>
                            <span>{perf.value}</span>
                          </div>
                        ))}
                      </div>
                      <ul className="mb-2">
                        {grade.features.slice(0, 3).map((f, i) => (
                          <li key={i} className="text-gray-600 dark:text-gray-300 flex items-center text-xs">
                            <span className="inline-flex items-center w-3 h-3 mr-1 bg-toyota-red/10 rounded-full text-toyota-red">
                              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      {!compareMode && (
                        <div className="flex flex-col gap-2 mt-2">
                          <Button
                            variant="ghost"
                            className="w-full flex justify-between"
                            size="sm"
                            onClick={() => setSelectedGrade(index)}
                          >
                            View Details
                            <span className="ml-2">&rarr;</span>
                          </Button>
                          <Button
                            variant="default"
                            className="w-full bg-toyota-red hover:bg-toyota-darkred"
                            size="sm"
                            onClick={() => handleConfigureGrade(index)}
                          >
                            Configure This Grade
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8 gap-2">
            <CarouselPrevious className="relative inset-auto" />
            <CarouselNext className="relative inset-auto" />
          </div>
        </Carousel>
      </div>

      {/* Grade Details / Comparison Dialog */}
      {!compareMode ? (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">{gradeSpecs[selectedGrade].grade} Details</h3>
            <span className="text-2xl font-bold text-toyota-red">
              ${gradeSpecs[selectedGrade].price.toLocaleString()}
            </span>
          </div>
          
          <Tabs defaultValue="performance">
            <TabsList className="mb-6">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="features">Key Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance">
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {gradeSpecs[selectedGrade].performance.map((spec, i) => (
                  <div key={i} className="border-b pb-3 dark:border-gray-700">
                    <span className="block text-sm text-gray-500 dark:text-gray-400">{spec.label}</span>
                    <span className="text-lg font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="features">
              <ul className="space-y-2">
                {gradeSpecs[selectedGrade].features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <span className="inline-flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 mt-0.5 bg-toyota-red/10 rounded-full text-toyota-red">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={() => handleConfigureGrade(selectedGrade)}
              className="bg-toyota-red hover:bg-toyota-darkred"
            >
              Configure This Grade
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        showComparison ? (
          <div className="p-6">
            <div className="flex justify-between mb-6">
              <h3 className="text-xl font-bold">Grade Comparison</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer mr-2">
                    <span className="text-sm text-gray-600 mr-2">Highlight Differences</span>
                    <input 
                      type="checkbox" 
                      checked={highlightDifferences}
                      onChange={() => setHighlightDifferences(!highlightDifferences)} 
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-toyota-red"></div>
                  </label>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowComparison(false)}
                >
                  Back to Grades
                </Button>
              </div>
            </div>
            
            <ScrollArea className="h-[500px] w-full rounded-md">
              <div className="w-full min-w-max">
                <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(200px,1fr))]">
                  {/* Header */}
                  <div className="p-4 font-bold"></div>
                  {selectedGrades.map(index => (
                    <div key={index} className="p-4 border-l">
                      <div className="flex flex-col items-center">
                        <img 
                          src={gradeSpecs[index].image} 
                          alt={gradeSpecs[index].grade} 
                          className="w-32 h-20 object-cover rounded-md mb-2" 
                        />
                        <h4 className="font-bold">{gradeSpecs[index].grade}</h4>
                        <p className="text-toyota-red font-semibold">
                          ${gradeSpecs[index].price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Performance Specs Section */}
                  <div className="p-4 font-bold bg-gray-100 dark:bg-gray-800 col-span-full">
                    Performance Specifications
                  </div>
                  
                  {gradeSpecs[0].performance.map((item, i) => {
                    const values = selectedGrades.map(index => gradeSpecs[index].performance[i].value);
                    const isDifferent = hasDifferences(values);
                    
                    return (
                      <React.Fragment key={`perf-${i}`}>
                        <div className="p-4 border-t text-gray-600">
                          {item.label}
                        </div>
                        {selectedGrades.map((gradeIndex, idx) => (
                          <div 
                            key={`perf-${i}-${idx}`} 
                            className={`p-4 border-t border-l ${
                              highlightDifferences && isDifferent 
                                ? 'font-semibold bg-yellow-50 dark:bg-yellow-900/20' 
                                : ''
                            }`}
                          >
                            {gradeSpecs[gradeIndex].performance[i].value}
                          </div>
                        ))}
                      </React.Fragment>
                    );
                  })}
                  
                  {/* Features Section */}
                  <div className="p-4 font-bold bg-gray-100 dark:bg-gray-800 col-span-full">
                    Key Features
                  </div>
                  
                  {gradeSpecs[0].features.map((_, i) => {
                    const featureLabels = selectedGrades.map(index => 
                      gradeSpecs[index].features[i] || "Not available"
                    );
                    const isDifferent = hasDifferences(featureLabels);
                    
                    return (
                      <React.Fragment key={`feature-${i}`}>
                        <div className="p-4 border-t text-gray-600">
                          Feature {i + 1}
                        </div>
                        {selectedGrades.map((gradeIndex, idx) => (
                          <div 
                            key={`feature-${i}-${idx}`} 
                            className={`p-4 border-t border-l ${
                              highlightDifferences && isDifferent 
                                ? 'font-semibold bg-yellow-50 dark:bg-yellow-900/20' 
                                : ''
                            }`}
                          >
                            {gradeSpecs[gradeIndex].features[i] || "Not available"}
                          </div>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </ScrollArea>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedGrades.map(index => (
                <Button
                  key={index}
                  className="bg-toyota-red hover:bg-toyota-darkred"
                  onClick={() => handleConfigureGrade(index)}
                >
                  Configure {gradeSpecs[index].grade}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            {selectedGrades.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  Please select at least one grade to compare
                </p>
              </div>
            ) : selectedGrades.length === 1 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">
                  Please select at least one more grade to compare
                </p>
              </div>
            ) : (
              <div className="text-center py-10">
                <Button
                  className="bg-toyota-red hover:bg-toyota-darkred"
                  onClick={() => setShowComparison(true)}
                >
                  View Detailed Comparison
                </Button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};
export default VehicleSpecs;
