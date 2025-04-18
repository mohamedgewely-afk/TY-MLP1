
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { VehicleModel } from "@/types/vehicle";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ComparisonTableProps {
  vehicles: VehicleModel[];
  onRemove: (name: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({
  vehicles,
  onRemove,
}) => {
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const isMobile = useIsMobile();

  const featureCategories = [
    {
      name: "General",
      features: [
        { name: "Price", getValue: (v: VehicleModel) => `AED ${v.price.toLocaleString()}` },
        { name: "Category", getValue: (v: VehicleModel) => v.category },
      ],
    },
    {
      name: "Performance",
      features: [
        { name: "Engine", getValue: (v: VehicleModel) => v.specifications?.engine || v.features[0] || "N/A" },
        { name: "Efficiency", getValue: (v: VehicleModel) => v.specifications?.fuelEconomy || "17.5 km/L" },
        { name: "Drivetrain", getValue: () => "FWD" },
      ],
    },
    {
      name: "Features",
      features: [
        { name: "Infotainment", getValue: (v: VehicleModel) => v.features[1] || "N/A" },
        { name: "Safety", getValue: (v: VehicleModel) => v.specifications?.safetyRating || v.features[2] || "N/A" },
        { name: "Warranty", getValue: (v: VehicleModel) => v.specifications?.warranty || "5 years / 100,000 km" },
      ],
    },
  ];

  const hasDifferences = (feature: { name: string; getValue: (v: VehicleModel) => string }) => {
    const values = vehicles.map(v => feature.getValue(v));
    return new Set(values).size > 1;
  };

  const shouldShowRow = (feature: { name: string; getValue: (v: VehicleModel) => string }) => {
    if (!showOnlyDifferences) return true;
    return hasDifferences(feature);
  };

  // Render the mobile version of the comparison table with a carousel
  if (isMobile) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden relative z-[1]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-[2]">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Compare Vehicles</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
            Compare specifications and features to find the perfect Toyota for you.
          </p>
          
          <div className="flex items-center">
            <Switch
              id="showDifferences"
              checked={showOnlyDifferences}
              onCheckedChange={setShowOnlyDifferences}
            />
            <Label htmlFor="showDifferences" className="ml-2 text-sm">
              Show only differences
            </Label>
          </div>
        </div>
        
        <Carousel className="w-full px-4 py-2">
          <CarouselContent>
            {vehicles.map((vehicle, index) => (
              <CarouselItem key={vehicle.name} className="basis-full md:basis-1/2 lg:basis-1/3">
                <div className="p-4 mb-4 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <button
                      onClick={() => onRemove(vehicle.name)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-md overflow-hidden">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                          {vehicle.name}
                        </h3>
                        <p className="text-toyota-red font-semibold">
                          AED {vehicle.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {featureCategories.map((category) => (
                    <div key={`${vehicle.name}-${category.name}`} className="mb-4">
                      <h4 className="font-semibold bg-gray-100 dark:bg-gray-800 p-2 text-gray-700 dark:text-gray-200">
                        {category.name}
                      </h4>
                      
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {category.features.map((feature) => 
                          shouldShowRow(feature) ? (
                            <div 
                              key={`${vehicle.name}-${feature.name}`} 
                              className="flex justify-between py-2 px-2"
                            >
                              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {feature.name}
                              </span>
                              <span 
                                className={`text-sm ${
                                  hasDifferences(feature) && 
                                  vehicles.filter(v => feature.getValue(v) === feature.getValue(vehicle)).length === 1
                                    ? "text-toyota-red font-medium" 
                                    : "text-gray-600 dark:text-gray-400"
                                }`}
                              >
                                {feature.getValue(vehicle)}
                              </span>
                            </div>
                          ) : null
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4">
                    <Button
                      asChild
                      className="w-full bg-toyota-red hover:bg-toyota-darkred"
                    >
                      <a href={vehicle.mmeUrl} target="_blank" rel="noopener noreferrer">
                        Schedule Test Drive
                      </a>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full mt-2"
                    >
                      <a href={vehicle.configureUrl} target="_blank" rel="noopener noreferrer">
                        Configure <ArrowRight className="h-4 w-4 ml-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-2 py-2">
            <CarouselPrevious className="static translate-y-0 transform-none" />
            <CarouselNext className="static translate-y-0 transform-none" />
          </div>
        </Carousel>
      </div>
    );
  }

  // Desktop version remains largely the same with some improvements
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden relative z-[1]">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-[2]">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Compare Vehicles</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Compare specifications and features to find the perfect Toyota for you.
        </p>
        
        <div className="flex items-center">
          <Switch
            id="showDifferences"
            checked={showOnlyDifferences}
            onCheckedChange={setShowOnlyDifferences}
          />
          <Label htmlFor="showDifferences" className="ml-2">
            Show only differences
          </Label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 sticky top-[8.5rem] z-[2]">
              <th className="p-4 text-left font-medium text-gray-600 dark:text-gray-300 min-w-[200px]">
                Feature
              </th>
              {vehicles.map((vehicle, index) => (
                <th key={vehicle.name} className="p-4 min-w-[250px]">
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
                  >
                    <button
                      onClick={() => onRemove(vehicle.name)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    
                    <div className="aspect-video mb-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                      {vehicle.name}
                    </h3>
                    
                    <p className="text-toyota-red font-semibold">
                      AED {vehicle.price.toLocaleString()}
                    </p>
                  </motion.div>
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="relative z-[1]">
            {featureCategories.map((category) => (
              <React.Fragment key={category.name}>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <td
                    colSpan={vehicles.length + 1}
                    className="p-2 font-semibold text-gray-700 dark:text-gray-200"
                  >
                    {category.name}
                  </td>
                </tr>
                
                {category.features.map((feature) => 
                  shouldShowRow(feature) ? (
                    <tr
                      key={feature.name}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="p-4 text-sm text-gray-700 dark:text-gray-300 font-medium">
                        {feature.name}
                      </td>
                      
                      {vehicles.map((vehicle) => {
                        const value = feature.getValue(vehicle);
                        const isHighlighted = hasDifferences(feature) && 
                          vehicles.filter(v => feature.getValue(v) === value).length === 1;
                        
                        return (
                          <td
                            key={`${vehicle.name}-${feature.name}`}
                            className={`p-4 text-sm ${
                              isHighlighted 
                                ? "text-toyota-red font-medium bg-toyota-red/5" 
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ) : null
                )}
              </React.Fragment>
            ))}
            
            <tr className="border-t border-gray-200 dark:border-gray-700">
              <td className="p-4 font-medium text-gray-700 dark:text-gray-300">
                Actions
              </td>
              
              {vehicles.map((vehicle) => (
                <td key={`${vehicle.name}-actions`} className="p-4">
                  <Button
                    asChild
                    className="w-full bg-toyota-red hover:bg-toyota-darkred"
                  >
                    <a href={vehicle.mmeUrl} target="_blank" rel="noopener noreferrer">
                      Schedule Test Drive
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-2"
                  >
                    <a href={vehicle.configureUrl} target="_blank" rel="noopener noreferrer">
                      Configure <ArrowRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
