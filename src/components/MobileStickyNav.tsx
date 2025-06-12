
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, Search, Car, Menu, Heart, ChevronLeft, ChevronRight, Battery, ShoppingBag, Truck, Settings, Star, Phone, X, Share2, MapPin, Tag, Calculator, TrendingUp } from "lucide-react";
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

const favoriteActions = [
  { title: "View Favorites", icon: <Heart className="h-6 w-6" />, color: "bg-red-500" },
  { title: "Compare Models", icon: <Settings className="h-6 w-6" />, color: "bg-blue-500" },
  { title: "Share List", icon: <Share2 className="h-6 w-6" />, color: "bg-green-500" },
  { title: "Save Search", icon: <Star className="h-6 w-6" />, color: "bg-purple-500" },
];

const quickMenuItems = [
  { title: "Book Service", icon: <Settings className="h-6 w-6" />, color: "bg-blue-500", link: "/service" },
  { title: "Find Dealer", icon: <MapPin className="h-6 w-6" />, color: "bg-green-500", link: "/dealers" },
  { title: "Offers & Deals", icon: <Tag className="h-6 w-6" />, color: "bg-orange-500", link: "/offers" },
  { title: "Finance Calculator", icon: <Calculator className="h-6 w-6" />, color: "bg-purple-500", link: "/finance" },
  { title: "Trade-In Value", icon: <TrendingUp className="h-6 w-6" />, color: "bg-cyan-500", link: "/trade-in" },
  { title: "Contact Us", icon: <Phone className="h-6 w-6" />, color: "bg-red-500", link: "/contact" },
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
  const [favorites, setFavorites] = useState<string[]>([]);
  
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites);
    
    const handleFavoritesUpdate = () => {
      const updatedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavorites(updatedFavorites);
    };
    
    window.addEventListener('favorites-updated', handleFavoritesUpdate);
    return () => window.removeEventListener('favorites-updated', handleFavoritesUpdate);
  }, []);
  
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

  const favoriteVehicles = vehicles.filter(vehicle => 
    favorites.includes(vehicle.name)
  );
  
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
      setActiveSection("quick-actions");
    }
  };
  
  if (!isMobile) return null;

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsMenuOpen(false)}
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
              {/* Quick Actions Section */}
              {activeSection === "quick-actions" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Quick Actions</h4>
                  
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
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      variant="outline" 
                      className="h-12 text-left justify-start"
                      onClick={() => setActiveSection("models")}
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Browse Models
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-12 text-left justify-start"
                      onClick={() => setActiveSection("search")}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Find Vehicle
                    </Button>
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

              {/* Enhanced Favorites Section */}
              {activeSection === "favorites" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Your Favorites</h4>
                  
                  {favoriteVehicles.length > 0 ? (
                    <>
                      {/* Favorite actions */}
                      <Carousel opts={{ align: "start" }} className="w-full mb-6">
                        <CarouselContent>
                          {favoriteActions.map((action) => (
                            <CarouselItem key={action.title} className="basis-auto pl-3">
                              <button className={cn(
                                "flex items-center space-x-2 px-4 py-2 rounded-xl text-white text-sm font-medium whitespace-nowrap",
                                action.color
                              )}>
                                {action.icon}
                                <span>{action.title}</span>
                              </button>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>

                      {/* Favorite vehicles */}
                      <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                          {favoriteVehicles.map((vehicle) => (
                            <CarouselItem key={vehicle.name} className="basis-2/3 pl-4">
                              <Link 
                                to={`/vehicle/${encodeURIComponent(vehicle.name.toLowerCase().replace(/\s+/g, '-'))}`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
                                  <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 relative">
                                    {vehicle.image && (
                                      <img 
                                        src={vehicle.image} 
                                        alt={vehicle.name} 
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                    <div className="absolute top-2 right-2">
                                      <Heart className="h-5 w-5 text-red-500 fill-current" />
                                    </div>
                                  </div>
                                  <CardContent className="p-4">
                                    <h3 className="font-semibold text-base mb-1">{vehicle.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                      From AED {vehicle.price.toLocaleString()}
                                    </p>
                                  </CardContent>
                                </Card>
                              </Link>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No favorites yet</p>
                      <Button 
                        onClick={() => setActiveSection("models")}
                        className="bg-toyota-red text-white"
                      >
                        Browse Models
                      </Button>
                    </div>
                  )}
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
        <div className="grid grid-cols-5 gap-1 px-2">
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
          <NavItem 
            icon={<Car className="h-5 w-5" />}
            label="Models"
            to="#"
            onClick={() => handleSectionToggle("models")}
            isActive={activeItem === "models" || activeSection === "models"}
          />
          <NavItem 
            icon={<Heart className="h-5 w-5" />}
            label="Favorites"
            to="#"
            onClick={() => handleSectionToggle("favorites")}
            isActive={activeItem === "favorites" || activeSection === "favorites"}
            badge={favorites.length > 0 ? favorites.length : undefined}
          />
          <NavItem 
            icon={<Menu className="h-5 w-5" />}
            label="Menu"
            to="#"
            onClick={toggleMenu}
            isActive={isMenuOpen}
          />
        </div>
      </motion.div>
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
