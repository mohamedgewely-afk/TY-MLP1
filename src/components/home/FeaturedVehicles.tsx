
import React, { useState } from "react";
import { motion } from "framer-motion";
import VehicleCard from "@/components/home/VehicleCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { Car, ChevronRight, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

const FeaturedVehicles: React.FC = () => {
  const [compareList, setCompareList] = useState<VehicleModel[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  // Get unique categories
  const categories = ["All", ...Array.from(new Set(vehicles.map((v) => v.category)))];
  
  // Get unique features
  const allFeatures = Array.from(
    new Set(vehicles.flatMap((vehicle) => vehicle.features))
  );
  
  // Filter vehicles based on category and features
  const filteredVehicles = vehicles.filter((vehicle) => {
    const categoryMatch = selectedCategory === "All" || vehicle.category === selectedCategory;
    const featureMatch = selectedFeatures.length === 0 || 
      selectedFeatures.every(feature => vehicle.features.includes(feature));
    return categoryMatch && featureMatch;
  });

  // Handle compare toggle
  const handleCompare = (vehicle: VehicleModel) => {
    if (compareList.some((v) => v.name === vehicle.name)) {
      setCompareList(compareList.filter((v) => v.name !== vehicle.name));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, vehicle]);
      }
    }
  };
  
  // Handle feature selection
  const toggleFeature = (feature: string) => {
    setSelectedFeatures(
      selectedFeatures.includes(feature)
        ? selectedFeatures.filter(f => f !== feature)
        : [...selectedFeatures, feature]
    );
  };

  return (
    <section className="py-16">
      <div className="toyota-container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Explore Our Vehicles
            </h2>
            <p className="text-gray-600">
              Discover the perfect Toyota for your lifestyle
            </p>
          </motion.div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Vehicles</SheetTitle>
                  <SheetDescription>
                    Select criteria to find your perfect Toyota
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <h3 className="text-sm font-medium mb-3">Features</h3>
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-2">
                      {allFeatures.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`feature-${feature}`} 
                            checked={selectedFeatures.includes(feature)}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <Label 
                            htmlFor={`feature-${feature}`}
                            className="text-sm"
                          >
                            {feature}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button className="w-full bg-toyota-red hover:bg-toyota-darkred">
                      Apply Filters
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            
            {compareList.length > 0 && (
              <Button 
                asChild 
                size="sm" 
                className="bg-toyota-red hover:bg-toyota-darkred"
              >
                <Link to="/compare">
                  Compare ({compareList.length})
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue={categories[0]} className="mb-8">
          <TabsList className="mb-6 bg-transparent border-b w-full justify-start overflow-x-auto flex-nowrap">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                onClick={() => setSelectedCategory(category)}
                className="data-[state=active]:border-b-2 data-[state=active]:border-toyota-red data-[state=active]:text-toyota-red rounded-none data-[state=active]:shadow-none hover:text-toyota-red"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredVehicles
                  .slice(0, 6)
                  .map((vehicle, index) => (
                    <motion.div
                      key={vehicle.name}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <VehicleCard
                        vehicle={vehicle}
                        onQuickView={setSelectedVehicle}
                        onCompare={handleCompare}
                        isCompared={compareList.some((v) => v.name === vehicle.name)}
                      />
                    </motion.div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-toyota-red hover:bg-toyota-darkred"
          >
            <Link to="/new-cars" className="flex items-center">
              <Car className="mr-2 h-5 w-5" />
              View All Models <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVehicles;
