import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Search, Car, Menu, ShoppingBag, ChevronLeft, ChevronRight, Battery, Truck, Settings, Star, Phone, X, Share2, MapPin, Tag, Calculator, TrendingUp, Sliders, Zap, FileText, DollarSign, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { vehicles } from "@/data/vehicles";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MobileStickyNavProps {
  activeItem?: string;
  onMenuToggle?: () => void;
}

const vehicleCategories = [
  { id: "all", name: "All", icon: <Car className="h-5 w-5" /> },
  { id: "sedan", name: "Sedan", icon: <Car className="h-5 w-5" /> },
  { id: "suv", name: "SUV", icon: <Truck className="h-5 w-5" /> },
  { id: "hybrid", name: "Hybrid", icon: <Battery className="h-5 w-5" /> },
  { id: "performance", name: "GR Performance", icon: <Star className="h-5 w-5" /> },
  { id: "commercial", name: "Commercial", icon: <ShoppingBag className="h-5 w-5" /> },
];

const searchSuggestions = [
  { term: "Camry Hybrid", category: "Sedan", icon: <Car className="h-5 w-5" /> },
  { term: "RAV4", category: "SUV", icon: <Truck className="h-5 w-5" /> },
  { term: "Corolla", category: "Sedan", icon: <Car className="h-5 w-5" /> },
  { term: "Highlander", category: "SUV", icon: <Truck className="h-5 w-5" /> },
  { term: "Prius", category: "Hybrid", icon: <Battery className="h-5 w-5" /> },
  { term: "GR Supra", category: "Performance", icon: <Star className="h-5 w-5" /> },
];

const quickMenuItems = [
  { title: "Book Service", icon: <Settings className="h-6 w-6" />, color: "bg-blue-500", link: "/service" },
  { title: "Find Dealer", icon: <MapPin className="h-6 w-6" />, color: "bg-green-500", link: "/dealers" },
  { title: "Offers & Deals", icon: <Tag className="h-6 w-6" />, color: "bg-orange-500", link: "/offers" },
  { title: "Finance Calculator", icon: <Calculator className="h-6 w-6" />, color: "bg-purple-500", link: "/finance" },
  { title: "Trade-In Value", icon: <TrendingUp className="h-6 w-6" />, color: "bg-cyan-500", link: "/trade-in" },
  { title: "Contact Us", icon: <Phone className="h-6 w-6" />, color: "bg-red-500", link: "/contact" },
];

// Pre-owned vehicles data
const preOwnedVehicles = [
  {
    name: "2022 Toyota Camry LE",
    price: 89000,
    mileage: "25,000 km",
    year: 2022,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    category: "sedan"
  },
  {
    name: "2021 Toyota RAV4 XLE",
    price: 95000,
    mileage: "35,000 km",
    year: 2021,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    category: "suv"
  },
  {
    name: "2023 Toyota Prius Hybrid",
    price: 78000,
    mileage: "15,000 km",
    year: 2023,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    category: "hybrid"
  },
  {
    name: "2020 Toyota Corolla SE",
    price: 65000,
    mileage: "45,000 km",
    year: 2020,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    category: "sedan"
  },
  {
    name: "2022 Toyota Highlander Limited",
    price: 145000,
    mileage: "20,000 km",
    year: 2022,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    category: "suv"
  },
  {
    name: "2021 Toyota GR Supra 3.0",
    price: 185000,
    mileage: "12,000 km",
    year: 2021,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
    category: "performance"
  }
];

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({ 
  activeItem = "home", 
  onMenuToggle 
}) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([50000, 200000]);
  const [isPlusMenuOpen, setIsPlusMenuOpen] = useState(false);
  
  const lightningQuickActions = [
    {
      id: "test-drive",
      title: "Test Drive",
      icon: <Car className="h-6 w-6" />,
      color: "bg-gradient-to-br from-toyota-red to-red-600 text-white",
      link: "/test-drive",
      description: "Book your test drive"
    },
    {
      id: "configure",
      title: "Configure",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
      link: "/configure",
      description: "Build your Toyota"
    },
    {
      id: "finance",
      title: "Finance",
      icon: <DollarSign className="h-6 w-6" />,
      color: "bg-gradient-to-br from-green-500 to-green-600 text-white",
      link: "/finance",
      description: "Financing options"
    },
    {
      id: "brochure",
      title: "Brochure",
      icon: <FileText className="h-6 w-6" />,
      color: "bg-gradient-to-br from-purple-500 to-purple-600 text-white",
      link: "/brochure",
      description: "Download brochure"
    },
    {
      id: "share",
      title: "Share",
      icon: <Share2 className="h-6 w-6" />,
      color: "bg-gradient-to-br from-amber-500 to-amber-600 text-white",
      link: "#",
      description: "Share this vehicle"
    },
  ];

  const quickActionCards = [
    {
      id: "test-drive",
      title: "Book Test Drive",
      icon: <Car className="h-7 w-7" />,
      color: "bg-gradient-to-br from-toyota-red to-red-600 text-white",
      link: "/test-drive",
      description: "Experience Toyota firsthand"
    },
    {
      id: "offers",
      title: "Latest Offers",
      icon: <ShoppingBag className="h-7 w-7" />,
      color: "bg-gradient-to-br from-blue-500 to-blue-600 text-white",
      link: "/offers",
      description: "Exclusive deals available"
    },
    {
      id: "configure",
      title: "Build & Price",
      icon: <Settings className="h-7 w-7" />,
      color: "bg-gradient-to-br from-green-500 to-green-600 text-white",
      link: "/configure",
      description: "Customize your Toyota"
    },
    {
      id: "service",
      title: "Service Booking",
      icon: <Phone className="h-7 w-7" />,
      color: "bg-gradient-to-br from-amber-500 to-amber-600 text-white",
      link: "/service",
      description: "Professional maintenance"
    },
  ];

  const filteredVehicles = vehicles.filter(vehicle => 
    selectedCategory === "all" || vehicle.category.toLowerCase() === selectedCategory
  ).slice(0, 12);

  const searchResults = vehicles.filter(vehicle =>
    vehicle.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8);

  const filteredPreOwnedVehicles = preOwnedVehicles.filter(vehicle => {
    const categoryMatch = selectedCategory === "all" || vehicle.category === selectedCategory;
    const priceMatch = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });
  
  const handleSectionToggle = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
      setIsMenuOpen(false);
    } else {
      setActiveSection(section);
      setIsMenuOpen(true);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setActiveSection(null);
    } else {
      setIsMenuOpen(true);
      setActiveSection("menu");
    }
  };

  const togglePlusMenu = () => {
    setIsPlusMenuOpen(!isPlusMenuOpen);
  };
  
  if (!isMobile) return null;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {(isMenuOpen || isPlusMenuOpen) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => {
              setIsMenuOpen(false);
              setIsPlusMenuOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Enhanced Sliding Menu from Bottom */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-20 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl z-50 max-h-[75vh] overflow-hidden border-t-4 border-toyota-red"
          >
            {/* Enhanced Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
              <div>
                <h3 className="font-bold text-xl text-gray-900 dark:text-white">Toyota Connect</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Your gateway to Toyota</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full h-10 w-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[calc(75vh-100px)] scrollbar-hide">
              {/* Lightning Actions Section - Shows lightningQuickActions */}
              {activeSection === "lightning-actions" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Actions</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {lightningQuickActions.map((action) => (
                      <Link key={action.id} to={action.link} onClick={() => setIsMenuOpen(false)}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Card className={cn("h-32 overflow-hidden", action.color)}>
                            <CardContent className="flex flex-col justify-between h-full p-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h3 className="font-semibold text-base">{action.title}</h3>
                                  <p className="text-xs opacity-90">{action.description}</p>
                                </div>
                                <div className="opacity-80">
                                  {action.icon}
                                </div>
                              </div>
                              <div className="flex justify-end">
                                <ChevronRight className="h-4 w-4 opacity-70" />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Enhanced Models Section */}
              {activeSection === "models" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Browse Models</h4>
                  
                  {/* Category selector with swipe */}
                  <div className="mb-6">
                    <Carousel opts={{ align: "start" }} className="w-full">
                      <CarouselContent>
                        {vehicleCategories.map((category) => (
                          <CarouselItem key={category.id} className="basis-auto pl-3">
                            <motion.button
                              onClick={() => handleCategoryClick(category.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl transition-all min-w-[80px]",
                                selectedCategory === category.id 
                                  ? "bg-toyota-red text-white shadow-lg scale-105" 
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                              )}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="mb-2">{category.icon}</span>
                              <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                            </motion.button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  {/* Vehicle carousel */}
                  <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent>
                      {filteredVehicles.map((vehicle) => (
                        <CarouselItem key={vehicle.name} className="basis-2/3 pl-4">
                          <Link 
                            to={`/vehicle/${encodeURIComponent(vehicle.name.toLowerCase().replace(/\s+/g, '-'))}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
                                  {vehicle.image && (
                                    <img 
                                      src={vehicle.image} 
                                      alt={vehicle.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-gray-100">{vehicle.name}</h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    From AED {vehicle.price.toLocaleString()}
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs bg-toyota-red/10 text-toyota-red px-2 py-1 rounded-full font-medium">
                                      {vehicle.category}
                                    </span>
                                    <span className="text-toyota-red text-sm font-semibold flex items-center">
                                      View <ChevronRight className="h-3 w-3 ml-1" />
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  <div className="mt-6 text-center">
                    <Link 
                      to={`/new-cars${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
                      className="text-toyota-red font-semibold flex items-center justify-center hover:text-red-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View All {selectedCategory !== 'all' ? vehicleCategories.find(c => c.id === selectedCategory)?.name : ''} Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Enhanced Search Section */}
              {activeSection === "search" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Find Your Toyota</h4>
                  
                  {/* Search input */}
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search models, features..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-toyota-red focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                  </div>

                  {searchQuery ? (
                    /* Search results */
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Search Results</h5>
                      <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                          {searchResults.map((vehicle) => (
                            <CarouselItem key={vehicle.name} className="basis-2/3 pl-4">
                              <Link 
                                to={`/vehicle/${encodeURIComponent(vehicle.name.toLowerCase().replace(/\s+/g, '-'))}`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <Card className="h-24 overflow-hidden hover:shadow-lg transition-shadow">
                                  <CardContent className="flex items-center h-full p-4">
                                    <div className="w-16 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg mr-3 flex-shrink-0">
                                      {vehicle.image && (
                                        <img 
                                          src={vehicle.image} 
                                          alt={vehicle.name} 
                                          className="w-full h-full object-cover rounded-lg"
                                        />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{vehicle.name}</h3>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">AED {vehicle.price.toLocaleString()}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                  </CardContent>
                                </Card>
                              </Link>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  ) : (
                    /* Search suggestions */
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400">Popular Searches</h5>
                      <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                          {searchSuggestions.map((suggestion) => (
                            <CarouselItem key={suggestion.term} className="basis-auto pl-3">
                              <button
                                onClick={() => setSearchQuery(suggestion.term)}
                                className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
                              >
                                {suggestion.icon}
                                <span className="text-sm">{suggestion.term}</span>
                              </button>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Enhanced Pre-Owned Section */}
              {activeSection === "pre-owned" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Pre-Owned Vehicles</h4>
                  
                  {/* Category selector with swipe */}
                  <div className="mb-6">
                    <Carousel opts={{ align: "start" }} className="w-full">
                      <CarouselContent>
                        {vehicleCategories.map((category) => (
                          <CarouselItem key={category.id} className="basis-auto pl-3">
                            <motion.button
                              onClick={() => handleCategoryClick(category.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl transition-all min-w-[80px]",
                                selectedCategory === category.id 
                                  ? "bg-toyota-red text-white shadow-lg scale-105" 
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                              )}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span className="mb-2">{category.icon}</span>
                              <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                            </motion.button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  {/* Price Range Slider */}
                  <div className="mb-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Price Range</h5>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        AED {priceRange[0].toLocaleString()} - AED {priceRange[1].toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sliders className="h-5 w-5 text-toyota-red" />
                      <input
                        type="range"
                        min="30000"
                        max="300000"
                        step="10000"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1]), priceRange[1]])}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="30000"
                        max="300000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0])])}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Pre-owned vehicle carousel */}
                  <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent>
                      {filteredPreOwnedVehicles.map((vehicle) => (
                        <CarouselItem key={vehicle.name} className="basis-2/3 pl-4">
                          <Link 
                            to={`/pre-owned/${encodeURIComponent(vehicle.name.toLowerCase().replace(/\s+/g, '-'))}`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative">
                                  <img 
                                    src={vehicle.image} 
                                    alt={vehicle.name} 
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 right-2">
                                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                                      {vehicle.year}
                                    </span>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-base mb-1 text-gray-900 dark:text-gray-100">{vehicle.name}</h3>
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-bold text-toyota-red">
                                      AED {vehicle.price.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {vehicle.mileage}
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs bg-toyota-red/10 text-toyota-red px-2 py-1 rounded-full font-medium">
                                      Certified Pre-Owned
                                    </span>
                                    <span className="text-toyota-red text-sm font-semibold flex items-center">
                                      View <ChevronRight className="h-3 w-3 ml-1" />
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  <div className="mt-6 text-center">
                    <Link 
                      to={`/pre-owned${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
                      className="text-toyota-red font-semibold flex items-center justify-center hover:text-red-700 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View All Pre-Owned {selectedCategory !== 'all' ? vehicleCategories.find(c => c.id === selectedCategory)?.name : ''} Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Menu Section - Shows quickActionCards + quickMenuItems */}
              {activeSection === "menu" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Toyota Services</h4>
                  
                  {/* Quick Action Cards */}
                  <Carousel opts={{ align: "start" }} className="w-full mb-6">
                    <CarouselContent>
                      {quickActionCards.map((card) => (
                        <CarouselItem key={card.id} className="basis-2/3 pl-4">
                          <Link to={card.link} onClick={() => setIsMenuOpen(false)}>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                              <Card className={cn("h-32 overflow-hidden", card.color)}>
                                <CardContent className="flex flex-col justify-between h-full p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                      <h3 className="font-semibold text-base">{card.title}</h3>
                                      <p className="text-xs opacity-90">{card.description}</p>
                                    </div>
                                    <div className="opacity-80">
                                      {card.icon}
                                    </div>
                                  </div>
                                  <div className="flex justify-end">
                                    <ChevronRight className="h-4 w-4 opacity-70" />
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  
                  {/* Additional Menu Items */}
                  <div className="grid grid-cols-2 gap-4">
                    {quickMenuItems.map((item) => (
                      <Link key={item.title} to={item.link} onClick={() => setIsMenuOpen(false)}>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Card className="h-24 overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col justify-center items-center h-full p-3 text-center">
                              <div className={cn("p-2 rounded-lg mb-2", item.color)}>
                                {item.icon}
                              </div>
                              <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{item.title}</h3>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Main Sticky Nav */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-2xl z-30 pt-2 pb-6 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
      >
        <div className="grid grid-cols-6 gap-1 px-1">
          <NavItem 
            icon={<Home className="h-5 w-5" />}
            label="Home"
            to="/"
            isActive={activeItem === "home"}
          />
          <NavItem 
            icon={<Search className="h-5 w-5" />}
            label="Search"
            to="#"
            onClick={() => handleSectionToggle("search")}
            isActive={activeItem === "search" || activeSection === "search"}
          />
          
          {/* Lightning Quick Actions */}
          <motion.button
            onClick={() => handleSectionToggle("lightning-actions")}
            className="flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="relative h-11 w-11 bg-gradient-to-r from-toyota-red to-red-600 rounded-full flex items-center justify-center shadow-lg overflow-hidden mb-1"
              animate={{
                boxShadow: [
                  "0 4px 15px rgba(235, 64, 52, 0.3)",
                  "0 6px 20px rgba(235, 64, 52, 0.5)",
                  "0 4px 15px rgba(235, 64, 52, 0.3)"
                ]
              }}
              transition={{
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
            >
              {/* Shine animation overlay */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: [-100, 100],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <Zap className="h-5 w-5 text-white relative z-10" />
            </motion.div>
            <span className={cn(
              "text-xs font-medium transition-colors truncate w-full text-center",
              activeSection === "lightning-actions" ? "text-toyota-red" : "text-gray-600 dark:text-gray-400"
            )}>
              Quick
            </span>
          </motion.button>

          <NavItem 
            icon={<Car className="h-5 w-5" />}
            label="Models"
            to="#"
            onClick={() => handleSectionToggle("models")}
            isActive={activeItem === "models" || activeSection === "models"}
          />
          <NavItem 
            icon={<ShoppingBag className="h-5 w-5" />}
            label="Pre-Owned"
            to="#"
            onClick={() => handleSectionToggle("pre-owned")}
            isActive={activeItem === "pre-owned" || activeSection === "pre-owned"}
          />
          <NavItem 
            icon={<Menu className="h-5 w-5" />}
            label="Menu"
            to="#"
            onClick={toggleMenu}
            isActive={activeSection === "menu"}
          />
        </div>
      </motion.div>

      {/* Separate Plus Icon Floating Action Button */}
      <motion.button
        onClick={togglePlusMenu}
        className="fixed bottom-32 right-6 z-50 w-14 h-14 bg-gradient-to-r from-toyota-red to-red-600 rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          rotate: isPlusMenuOpen ? 45 : 0
        }}
        transition={{ duration: 0.2 }}
      >
        <Plus className="h-6 w-6 text-white" />
      </motion.button>

      {/* Plus Menu Content */}
      <AnimatePresence>
        {isPlusMenuOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="fixed bottom-48 right-6 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border p-4 min-w-[280px]"
          >
            <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Actions</h4>
            
            <div className="space-y-3">
              {quickActionCards.map((action) => (
                <Link 
                  key={action.id} 
                  to={action.link} 
                  onClick={() => setIsPlusMenuOpen(false)}
                  className="block"
                >
                  <motion.div 
                    className={cn("flex items-center space-x-3 p-3 rounded-lg", action.color)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="opacity-90">
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-semibold text-sm">{action.title}</h5>
                      <p className="text-xs opacity-80">{action.description}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 opacity-70" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: () => void;
  badge?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive = false, onClick, badge }) => {
  const content = (
    <>
      <div className="flex flex-col items-center justify-center relative">
        <motion.div 
          className={cn(
            "p-2 rounded-xl transition-all relative",
            isActive 
              ? "text-toyota-red bg-red-50 dark:bg-red-950 scale-110" 
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          )}
          whileHover={{ scale: isActive ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {icon}
          {badge && (
            <motion.div
              className="absolute -top-1 -right-1 bg-toyota-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              {badge > 9 ? '9+' : badge}
            </motion.div>
          )}
        </motion.div>
        <span className={cn(
          "text-xs text-center transition-all font-medium mt-1",
          isActive 
            ? "text-toyota-red" 
            : "text-gray-500 dark:text-gray-400"
        )}>
          {label}
        </span>
      </div>
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-toyota-red rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className="relative flex items-center justify-center px-1 py-2"
      >
        {content}
      </button>
    );
  }

  return (
    <Link 
      to={to} 
      className="relative flex items-center justify-center px-1 py-2"
    >
      {content}
    </Link>
  );
};

export default MobileStickyNav;
