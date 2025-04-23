
import React, { useState } from "react";
import { VehicleModel } from "@/types/vehicle";
import { CarFront, Fuel, ArrowRight, Eye, Settings, CircleChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-12">
      <div className="p-6 border-b dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Available Grades</h2>
          <Button 
            variant={compareMode ? "default" : "outline"}
            onClick={() => setCompareMode(!compareMode)}
          >
            {compareMode ? "Exit Compare" : "Compare Grades"}
          </Button>
        </div>

        {/* Grades Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gradeSpecs.map((grade, index) => (
            <div 
              key={index}
              className={`border rounded-xl overflow-hidden transition-all duration-300 ${
                !compareMode && selectedGrade === index ? 'ring-2 ring-toyota-red' : ''
              } ${
                compareMode && selectedGrades.includes(index) ? 'ring-2 ring-toyota-red' : ''
              } hover:shadow-md`}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={grade.image} 
                  alt={`${vehicle.name} ${grade.grade}`} 
                  className="w-full h-full object-cover"
                />
                {grade.highlighted && (
                  <div className="absolute top-3 right-3 bg-toyota-red text-white text-xs font-bold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                {compareMode && (
                  <div 
                    className="absolute top-3 left-3 h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer"
                    onClick={() => toggleGradeCompare(index)}
                  >
                    {selectedGrades.includes(index) && (
                      <div className="h-3 w-3 bg-toyota-red rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold">{grade.grade}</h3>
                  <span className="text-toyota-red font-semibold">
                    ${grade.price.toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Fuel className="h-4 w-4 mr-1" />
                    {grade.performance.find(p => p.label === "Fuel Economy")?.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Settings className="h-4 w-4 mr-1" />
                    {grade.performance.find(p => p.label === "Power")?.value}
                  </p>
                  
                  {!compareMode && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between"
                        onClick={() => setSelectedGrade(index)}
                      >
                        View Details
                        <CircleChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                      
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full bg-toyota-red hover:bg-toyota-darkred"
                        onClick={() => handleConfigureGrade(index)}
                      >
                        Configure This Grade
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Details / Comparison */}
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
        <div className="p-6 overflow-x-auto">
          {selectedGrades.length > 0 ? (
            <>
              <h3 className="text-xl font-bold mb-6">Grade Comparison</h3>
              
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left pb-3 w-1/4">Feature</th>
                    {selectedGrades.map(index => (
                      <th key={index} className="text-left pb-3">
                        <div className="flex items-center justify-between">
                          <span>{gradeSpecs[index].grade}</span>
                          <span className="text-toyota-red font-medium">
                            ${gradeSpecs[index].price.toLocaleString()}
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Performance specs */}
                  {gradeSpecs[0].performance.map((spec, i) => (
                    <tr key={`perf-${i}`} className="border-b dark:border-gray-700">
                      <td className="py-3 text-gray-600 dark:text-gray-400">{spec.label}</td>
                      {selectedGrades.map(gradeIndex => (
                        <td key={gradeIndex} className="py-3 font-medium">
                          {gradeSpecs[gradeIndex].performance[i].value}
                        </td>
                      ))}
                    </tr>
                  ))}
                  
                  {/* Features comparison - we'll just do the first few */}
                  <tr className="bg-gray-50 dark:bg-gray-700/30">
                    <td colSpan={selectedGrades.length + 1} className="py-3 font-bold">
                      Key Features
                    </td>
                  </tr>
                  {[0, 1, 2, 3, 4].map(featureIndex => (
                    <tr key={`feature-${featureIndex}`} className="border-b dark:border-gray-700">
                      <td className="py-3 text-gray-600 dark:text-gray-400">
                        Feature {featureIndex + 1}
                      </td>
                      {selectedGrades.map(gradeIndex => (
                        <td key={gradeIndex} className="py-3">
                          {gradeSpecs[gradeIndex].features[featureIndex]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              
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
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                Please select at least one grade to compare
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VehicleSpecs;
