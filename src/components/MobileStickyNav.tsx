
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Search, Car, Menu, Heart, ChevronLeft, ChevronRight, Battery, ShoppingBag, Truck, Settings, Star, Phone } from "lucide-react";
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

interface MobileStickyNavProps {
  activeItem?: string;
  onMenuToggle?: () => void;
}

// Categories for vehicle filtering
const vehicleCategories = [
  { id: "all", name: "All", icon: <Car className="h-6 w-6" /> },
  { id: "sedan", name: "Sedan", icon: <Car className="h-6 w-6" /> },
  { id: "suv", name: "SUV", icon: <Truck className="h-6 w-6" /> },
  { id: "hybrid", name: "Hybrid", icon: <Battery className="h-6 w-6" /> },
  { id: "performance", name: "GR Performance", icon: <Star className="h-6 w-6" /> },
  { id: "commercial", name: "Commercial", icon: <ShoppingBag className="h-6 w-6" /> },
];

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({ 
  activeItem = "home", 
  onMenuToggle 
}) => {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Quick action cards data - Updated with more context-aware actions
  const quickActionCards = [
    {
      id: "test-drive",
      title: "Book Test Drive",
      icon: <Car className="h-8 w-8" />,
      color: "bg-toyota-red text-white",
      link: "/test-drive"
    },
    {
      id: "offers",
      title: "Latest Offers",
      icon: <ShoppingBag className="h-8 w-8" />,
      color: "bg-blue-500 text-white",
      link: "/offers"
    },
    {
      id: "configure",
      title: "Build & Price",
      icon: <Settings className="h-8 w-8" />,
      color: "bg-green-500 text-white",
      link: "/configure"
    },
    {
      id: "service",
      title: "Service Booking",
      icon: <Phone className="h-8 w-8" />,
      color: "bg-amber-500 text-white",
      link: "/service"
    },
  ];

  // Filter vehicles based on selected category
  const filteredVehicles = vehicles.filter(vehicle => 
    selectedCategory === "all" || vehicle.category.toLowerCase() === selectedCategory
  ).slice(0, 8); // Limit to 8 vehicles for performance
  
  // Handle sections for expanded nav
  const handleSectionToggle = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
      setExpanded(true);
    }
  };

  // Close expanded section when clicking a category
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  if (!isMobile) return null;

  const handleToggleExpanded = () => {
    if (!expanded) {
      setExpanded(true);
      setActiveSection("quick-actions");
    } else if (!activeSection) {
      setExpanded(false);
    } else {
      setActiveSection(null);
    }
  };

  return (
    <>
      {/* Main Sticky Nav */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50 pt-2 pb-6 md:hidden"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Expandable Card Area */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Quick Actions Section */}
              {activeSection === "quick-actions" && (
                <div className="px-4 pb-4">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Actions</h3>
                  <Carousel
                    opts={{ align: "start" }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {quickActionCards.map((card) => (
                        <CarouselItem key={card.id} className="basis-1/2 md:basis-1/3 pl-4">
                          <Link to={card.link}>
                            <Card className={cn("h-24", card.color)}>
                              <CardContent className="flex items-center justify-center h-full p-4">
                                <div className="text-center">
                                  <div className="flex justify-center mb-2">
                                    {card.icon}
                                  </div>
                                  <h3 className="font-medium">{card.title}</h3>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              )}

              {/* Models Section - Shows when "Models" is clicked */}
              {activeSection === "models" && (
                <div className="px-4 pb-4">
                  {/* Categories Filter */}
                  <div className="mb-4">
                    <Carousel
                      opts={{ align: "start" }}
                      className="w-full"
                    >
                      <CarouselContent>
                        {vehicleCategories.map((category) => (
                          <CarouselItem key={category.id} className="basis-auto pl-4 first:pl-4">
                            <button
                              onClick={() => handleCategoryClick(category.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-2 rounded-lg transition-colors",
                                selectedCategory === category.id 
                                  ? "bg-toyota-red text-white" 
                                  : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                              )}
                            >
                              <span className="mb-1">{category.icon}</span>
                              <span className="text-xs whitespace-nowrap">{category.name}</span>
                            </button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  {/* Vehicle Cards */}
                  <Carousel
                    opts={{ align: "start" }}
                    className="w-full"
                  >
                    <CarouselContent>
                      {filteredVehicles.map((vehicle) => (
                        <CarouselItem key={vehicle.id} className="basis-2/3 pl-4">
                          <Link to={`/vehicle/${encodeURIComponent(vehicle.name.toLowerCase())}`}>
                            <Card className="overflow-hidden">
                              <div className="aspect-[16/9] w-full bg-gray-100 dark:bg-gray-800">
                                {vehicle.image && (
                                  <img 
                                    src={vehicle.image} 
                                    alt={vehicle.name} 
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              <CardContent className="p-3">
                                <h3 className="font-medium text-sm">{vehicle.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  From AED {vehicle.price.toLocaleString()}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                    {vehicle.category}
                                  </span>
                                  <button className="text-toyota-red text-xs font-medium">View</button>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  <div className="mt-3 flex justify-center">
                    <Link 
                      to={`/new-cars${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
                      className="text-sm text-toyota-red font-medium flex items-center"
                    >
                      View All {selectedCategory !== 'all' ? vehicleCategories.find(c => c.id === selectedCategory)?.name : ''} Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <div className="flex justify-center mb-2">
          <button
            onClick={handleToggleExpanded}
            className="rounded-full bg-gray-200 dark:bg-gray-800 p-1 flex items-center justify-center"
          >
            {expanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-500">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-gray-500">
                <path d="m18 15-6-6-6 6"/>
              </svg>
            )}
          </button>
        </div>

        {/* Main Navigation */}
        <div className="grid grid-cols-5 gap-1">
          <NavItem 
            icon={<Home className="h-6 w-6" />}
            label="Home"
            to="/"
            isActive={activeItem === "home"}
          />
          <NavItem 
            icon={<Search className="h-6 w-6" />}
            label="Search"
            to="/search"
            isActive={activeItem === "search"}
          />
          <NavItem 
            icon={<Car className="h-6 w-6" />}
            label="Models"
            to="#"
            onClick={() => handleSectionToggle("models")}
            isActive={activeItem === "models" || activeSection === "models"}
          />
          <NavItem 
            icon={<Heart className="h-6 w-6" />}
            label="Favorites"
            to="/favorites"
            isActive={activeItem === "favorites"}
          />
          <NavItem 
            icon={<Menu className="h-6 w-6" />}
            label="Menu"
            to="#"
            onClick={onMenuToggle}
            isActive={activeItem === "menu"}
          />
        </div>

        {/* Safe area for iOS devices */}
        <div className="h-6 bg-white dark:bg-gray-900 pb-safe-area-inset-bottom" />
      </motion.div>
    </>
  );
};

// NavItem Component - Keep this the same
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive = false, onClick }) => {
  const content = (
    <>
      <div className="flex flex-col items-center justify-center">
        <div className={cn(
          "p-1 transition-colors",
          isActive ? "text-toyota-red" : "text-gray-500 dark:text-gray-400"
        )}>
          {icon}
        </div>
        <span className={cn(
          "text-xs text-center transition-colors",
          isActive ? "text-toyota-red font-medium" : "text-gray-500 dark:text-gray-400"
        )}>
          {label}
        </span>
      </div>
      {isActive && (
        <motion.div
          layoutId="indicator"
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-toyota-red rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className="relative flex items-center justify-center px-1"
      >
        {content}
      </button>
    );
  }

  return (
    <Link 
      to={to} 
      className="relative flex items-center justify-center px-1"
    >
      {content}
    </Link>
  );
};

export default MobileStickyNav;
