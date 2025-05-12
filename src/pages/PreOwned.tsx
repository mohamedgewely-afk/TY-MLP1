import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ToyotaLayout from "@/components/ToyotaLayout";
import { preOwnedVehicles } from "@/data/vehicles";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PreOwnedVehicle } from "@/types/vehicle";
import { Search, Filter, X, CarFront, Calendar, ArrowRight, RotateCw, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const PreOwned = () => {
  const { toast } = useToast();
  // State for filters and search
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState<number[]>([50000, 500000]);
  const [yearRange, setYearRange] = useState<number[]>([2018, new Date().getFullYear()]);
  const [mileageRange, setMileageRange] = useState<number[]>([0, 100000]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sortOption, setSortOption] = useState("newest");
  
  // Extract all possible data for filters
  const allBodyTypes = [...new Set(preOwnedVehicles.map(v => v.bodyType))];
  const allColors = [...new Set(preOwnedVehicles.map(v => v.color))];
  const allFeatures = [...new Set(preOwnedVehicles.flatMap(v => v.features || []))];
  
  // Find min/max values
  const minYear = Math.min(...preOwnedVehicles.map(v => v.year));
  const maxYear = Math.max(...preOwnedVehicles.map(v => v.year));
  const minPrice = Math.min(...preOwnedVehicles.map(v => v.price));
  const maxPrice = Math.max(...preOwnedVehicles.map(v => v.price));
  const minMileage = Math.min(...preOwnedVehicles.map(v => v.mileage));
  const maxMileage = Math.max(...preOwnedVehicles.map(v => v.mileage));
  
  // Filter vehicles based on all criteria
  const filteredVehicles = preOwnedVehicles.filter(vehicle => {
    // Text search - search in multiple fields
    const searchLower = searchText.toLowerCase();
    const matchesSearch = searchText === "" || 
      vehicle.model.toLowerCase().includes(searchLower) ||
      vehicle.make.toLowerCase().includes(searchLower) ||
      vehicle.description.toLowerCase().includes(searchLower) ||
      vehicle.color.toLowerCase().includes(searchLower) ||
      (vehicle.features && vehicle.features.some(f => f.toLowerCase().includes(searchLower)));
    
    // Range filters
    const matchesPrice = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
    const matchesYear = vehicle.year >= yearRange[0] && vehicle.year <= yearRange[1];
    const matchesMileage = vehicle.mileage >= mileageRange[0] && vehicle.mileage <= mileageRange[1];
    
    // Multiple selection filters
    const matchesBodyType = selectedBodyTypes.length === 0 || selectedBodyTypes.includes(vehicle.bodyType);
    const matchesColor = selectedColors.length === 0 || selectedColors.includes(vehicle.color);
    
    // Features filter (any selected feature must be present)
    const matchesFeatures = selectedFeatures.length === 0 || 
      selectedFeatures.every(f => vehicle.features && vehicle.features.includes(f));
    
    return matchesSearch && matchesPrice && matchesYear && matchesMileage && 
           matchesBodyType && matchesColor && matchesFeatures;
  });
  
  // Sort the filtered vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch(sortOption) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "mileage-low":
        return a.mileage - b.mileage;
      case "year-new":
        return b.year - a.year;
      case "newest": // Sort by listing date (using id as proxy)
      default:
        return b.id.localeCompare(a.id);
    }
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchText("");
    setPriceRange([minPrice, maxPrice]);
    setYearRange([minYear, maxYear]);
    setMileageRange([minMileage, maxMileage]);
    setSelectedBodyTypes([]);
    setSelectedColors([]);
    setSelectedFeatures([]);
    
    toast({
      title: "Filters Reset",
      description: "All filters have been reset to their default values.",
    });
  };

  // Toggle body type selection
  const toggleBodyType = (bodyType: string) => {
    setSelectedBodyTypes(prev => 
      prev.includes(bodyType) 
        ? prev.filter(type => type !== bodyType) 
        : [...prev, bodyType]
    );
  };

  // Toggle color selection
  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color) 
        : [...prev, color]
    );
  };

  // Toggle feature selection
  const toggleFeature = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature) 
        : [...prev, feature]
    );
  };

  // Contact dealer for a vehicle
  const contactDealer = (vehicle: PreOwnedVehicle, method: 'call' | 'email') => {
    if (method === 'call') {
      toast({
        title: "Dealer Call Requested",
        description: `A representative will call you shortly about the ${vehicle.year} ${vehicle.make} ${vehicle.model}.`,
      });
    } else {
      toast({
        title: "Enquiry Sent",
        description: `Your enquiry about the ${vehicle.year} ${vehicle.make} ${vehicle.model} has been sent. We'll respond shortly.`,
      });
    }
  };

  return (
    <ToyotaLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="toyota-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Toyota Pre-Owned Vehicles</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Find certified pre-owned Toyota vehicles that meet our rigorous quality standards, 
            backed by warranty and peace of mind.
          </p>
        </div>
      </div>
      
      {/* Search and Filters Bar */}
      <div className="sticky top-16 z-20 bg-white dark:bg-gray-900 shadow-md border-b border-gray-200 dark:border-gray-800">
        <div className="toyota-container py-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search input */}
            <div className="relative flex-grow max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search models, features, or keywords..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 w-full"
              />
              {searchText && (
                <button 
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            
            {/* Filter button */}
            <Button 
              variant={filtersOpen ? "default" : "outline"} 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={filtersOpen ? "bg-toyota-red hover:bg-toyota-darkred" : ""}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {(selectedBodyTypes.length > 0 || selectedColors.length > 0 || selectedFeatures.length > 0) && (
                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-medium text-toyota-red">
                  {selectedBodyTypes.length + selectedColors.length + selectedFeatures.length}
                </span>
              )}
            </Button>
            
            {/* Sort dropdown */}
            <div className="hidden sm:block w-40">
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="newest">Newest Listings</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="year-new">Year: Newest First</SelectItem>
                    <SelectItem value="mileage-low">Mileage: Low to High</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* View type toggle */}
            <div className="hidden sm:flex border rounded-lg overflow-hidden">
              <button 
                className={cn(
                  "px-3 py-2 flex items-center",
                  viewType === "grid" 
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" 
                    : "bg-white dark:bg-gray-900 text-gray-500"
                )}
                onClick={() => setViewType("grid")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
              </button>
              <button 
                className={cn(
                  "px-3 py-2 flex items-center",
                  viewType === "list" 
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" 
                    : "bg-white dark:bg-gray-900 text-gray-500"
                )}
                onClick={() => setViewType("list")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="toyota-container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:w-72 overflow-hidden"
              >
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      <RotateCw className="mr-1 h-4 w-4" />
                      Reset
                    </Button>
                  </div>
                  
                  {/* Price Range Filter */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        min={minPrice}
                        max={maxPrice}
                        step={5000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>AED {priceRange[0].toLocaleString()}</span>
                        <span>AED {priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Year Range Filter */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Year</h3>
                    <div className="px-2">
                      <Slider
                        min={minYear}
                        max={maxYear}
                        step={1}
                        value={yearRange}
                        onValueChange={setYearRange}
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{yearRange[0]}</span>
                        <span>{yearRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mileage Range Filter */}
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Mileage (km)</h3>
                    <div className="px-2">
                      <Slider
                        min={minMileage}
                        max={maxMileage}
                        step={1000}
                        value={mileageRange}
                        onValueChange={setMileageRange}
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>{mileageRange[0].toLocaleString()}</span>
                        <span>{mileageRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Type Filter */}
                  <div className="mb-6">
                    <Accordion type="single" collapsible defaultValue="body-type">
                      <AccordionItem value="body-type">
                        <AccordionTrigger>Body Type</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-2">
                            {allBodyTypes.map((bodyType) => (
                              <div key={bodyType} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`body-${bodyType}`} 
                                  checked={selectedBodyTypes.includes(bodyType)}
                                  onCheckedChange={() => toggleBodyType(bodyType)}
                                />
                                <Label htmlFor={`body-${bodyType}`}>{bodyType}</Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  {/* Color Filter */}
                  <div className="mb-6">
                    <Accordion type="single" collapsible defaultValue="color">
                      <AccordionItem value="color">
                        <AccordionTrigger>Color</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-2 gap-2">
                            {allColors.map((color) => (
                              <div key={color} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`color-${color}`} 
                                  checked={selectedColors.includes(color)}
                                  onCheckedChange={() => toggleColor(color)}
                                />
                                <Label htmlFor={`color-${color}`}>{color}</Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                  
                  {/* Features Filter */}
                  <div className="mb-6">
                    <Accordion type="single" collapsible>
                      <AccordionItem value="features">
                        <AccordionTrigger>Features</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 gap-2">
                            {allFeatures.slice(0, 10).map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`feature-${feature}`} 
                                  checked={selectedFeatures.includes(feature)}
                                  onCheckedChange={() => toggleFeature(feature)}
                                />
                                <Label htmlFor={`feature-${feature}`}>{feature}</Label>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  {/* Apply Filters Button on Mobile */}
                  <div className="lg:hidden">
                    <Button 
                      className="w-full bg-toyota-red hover:bg-toyota-darkred"
                      onClick={() => setFiltersOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Results Area */}
          <div className="flex-1">
            {/* Results Count and Mobile Sort */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600 dark:text-gray-400">
                {sortedVehicles.length} vehicles found
              </p>
              
              <div className="block sm:hidden w-36">
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="year-new">Newest Year</SelectItem>
                      <SelectItem value="mileage-low">Lowest Mileage</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* No Results Message */}
            {sortedVehicles.length === 0 && (
              <div className="text-center py-16">
                <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 p-4 mb-4">
                  <Search className="h-6 w-6 text-gray-500" />
                </div>
                <h2 className="text-xl font-bold mb-2">No Vehicles Found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search filters to find more results.
                </p>
                <Button onClick={resetFilters}>Clear All Filters</Button>
              </div>
            )}
            
            {/* Vehicle Grid/List View */}
            <div className={viewType === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "flex flex-col space-y-4"
            }>
              {sortedVehicles.map((vehicle) => (
                viewType === "grid" ? (
                  <motion.div 
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative">
                        {vehicle.certified && (
                          <div className="absolute top-2 right-2 bg-toyota-red text-white text-xs font-medium py-1 px-2 rounded-full">
                            Certified
                          </div>
                        )}
                        <div className="w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                          <img
                            src={vehicle.image}
                            alt={`${vehicle.make} ${vehicle.model}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                      
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex justify-between">
                          <span>{vehicle.make} {vehicle.model}</span>
                          <span className="text-toyota-red">AED {vehicle.price.toLocaleString()}</span>
                        </CardTitle>
                        <CardDescription className="flex justify-between items-center">
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-1 h-4 w-4" /> {vehicle.year}
                          </div>
                          <div className="flex items-center text-sm">
                            <CarFront className="mr-1 h-4 w-4" /> {vehicle.mileage.toLocaleString()} km
                          </div>
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="py-2 flex-grow text-sm">
                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{vehicle.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                            {vehicle.bodyType}
                          </span>
                          <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                            {vehicle.color}
                          </span>
                          {vehicle.transmission && (
                            <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                              {vehicle.transmission}
                            </span>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-2 grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => contactDealer(vehicle, 'email')}>
                          <Mail className="mr-1 h-4 w-4" /> Enquire
                        </Button>
                        <Button size="sm" className="bg-toyota-red hover:bg-toyota-darkred" asChild>
                          <a href={`/vehicle/${encodeURIComponent(vehicle.make.toLowerCase())}-${encodeURIComponent(vehicle.model.toLowerCase())}`}>
                            View Details <ArrowRight className="ml-1 h-4 w-4" />
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div
                    key={vehicle.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative sm:w-1/3">
                          {vehicle.certified && (
                            <div className="absolute top-2 right-2 bg-toyota-red text-white text-xs font-medium py-1 px-2 rounded-full">
                              Certified
                            </div>
                          )}
                          <div className="w-full aspect-[16/9] sm:h-full bg-gray-100 dark:bg-gray-800">
                            <img
                              src={vehicle.image}
                              alt={`${vehicle.make} ${vehicle.model}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:w-2/3">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
                                <CardDescription className="flex space-x-4 mt-1">
                                  <div className="flex items-center text-sm">
                                    <Calendar className="mr-1 h-4 w-4" /> {vehicle.year}
                                  </div>
                                  <div className="flex items-center text-sm">
                                    <CarFront className="mr-1 h-4 w-4" /> {vehicle.mileage.toLocaleString()} km
                                  </div>
                                </CardDescription>
                              </div>
                              <div className="text-xl font-bold text-toyota-red">
                                AED {vehicle.price.toLocaleString()}
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="py-2 flex-grow">
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 text-sm">{vehicle.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                                {vehicle.bodyType}
                              </span>
                              <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                                {vehicle.color}
                              </span>
                              {vehicle.transmission && (
                                <span className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                                  {vehicle.transmission}
                                </span>
                              )}
                              {vehicle.features && vehicle.features.slice(0, 2).map((feature, i) => (
                                <span key={i} className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs px-2 py-1 rounded">
                                  {feature}
                                </span>
                              ))}
                            </div>
                          </CardContent>
                          
                          <CardFooter className="pt-2 flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => contactDealer(vehicle, 'call')}>
                              <Phone className="mr-1 h-4 w-4" /> Call
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => contactDealer(vehicle, 'email')}>
                              <Mail className="mr-1 h-4 w-4" /> Email
                            </Button>
                            <Button size="sm" className="bg-toyota-red hover:bg-toyota-darkred" asChild>
                              <a href={`/vehicle/${encodeURIComponent(vehicle.make.toLowerCase())}-${encodeURIComponent(vehicle.model.toLowerCase())}`}>
                                View Details <ArrowRight className="ml-1 h-4 w-4" />
                              </a>
                            </Button>
                          </CardFooter>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Banner */}
      <div className="bg-toyota-red text-white py-12 my-8">
        <div className="toyota-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Not sure which vehicle is right for you?
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Speak with our pre-owned vehicle specialists who can help you find the perfect match for your needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-toyota-red">
              <Phone className="mr-2 h-5 w-5" /> Contact a Specialist
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <a href="/explore">Explore All Models</a>
            </Button>
          </div>
        </div>
      </div>
    </ToyotaLayout>
  );
};

export default PreOwned;
