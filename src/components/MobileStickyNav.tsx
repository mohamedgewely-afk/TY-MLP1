
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Car, Heart, Search, Phone, Menu, MapPin, Calculator, Calendar, MessageCircle, Star, Award, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { vehicles } from "@/data/vehicles";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { VehicleModel } from "@/types/vehicle";

interface MobileStickyNavProps {
  activeItem?: string;
  vehicle?: VehicleModel;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
}

const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
  activeItem,
  vehicle,
  isFavorite,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator
}) => {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [viewportHeight, setViewportHeight] = useState(0);
  const isMobile = useIsMobile();

  // Calculate dynamic viewport height for better panel sizing
  useEffect(() => {
    const updateHeight = () => {
      setViewportHeight(window.innerHeight);
    };
    
    updateHeight();
    window.addEventListener('resize', updateHeight);
    window.addEventListener('orientationchange', updateHeight);
    
    return () => {
      window.removeEventListener('resize', updateHeight);
      window.removeEventListener('orientationchange', updateHeight);
    };
  }, []);

  // Calculate optimal panel height
  const getPanelHeight = () => {
    const stickyNavHeight = 80; // Height of sticky navigation
    const safeAreaBottom = 34; // Safe area for notched devices
    const headerHeight = 60; // Space for potential header
    const totalOffset = stickyNavHeight + safeAreaBottom + headerHeight;
    
    return Math.min(viewportHeight - totalOffset, viewportHeight * 0.85);
  };

  const closePanel = () => setActivePanel(null);

  // Enhanced categories with better organization
  const categories = [
    { name: "SUV", vehicles: vehicles.filter(v => v.category === "SUV"), icon: "🚙", color: "bg-blue-500" },
    { name: "Sedan", vehicles: vehicles.filter(v => v.category === "Sedan"), icon: "🚗", color: "bg-green-500" },
    { name: "Hybrid", vehicles: vehicles.filter(v => v.category === "Hybrid"), icon: "🌱", color: "bg-emerald-500" },
    { name: "Commercial", vehicles: vehicles.filter(v => v.category === "Commercial"), icon: "🚐", color: "bg-orange-500" },
    { name: "Sports", vehicles: vehicles.filter(v => v.category === "Sports"), icon: "🏎️", color: "bg-red-500" }
  ];

  // Context-aware quick actions - prioritize vehicle-specific actions when available
  const quickActions = vehicle ? [
    { icon: Calendar, label: "Test Drive", action: onBookTestDrive, color: "text-green-600" },
    { icon: Car, label: "Build & Price", action: onCarBuilder, color: "text-blue-600" },
    { icon: Calculator, label: "Finance", action: onFinanceCalculator, color: "text-purple-600" },
    { icon: Heart, label: isFavorite ? "Remove Favorite" : "Add Favorite", action: onToggleFavorite, color: isFavorite ? "text-red-600" : "text-pink-600" },
    { icon: MessageCircle, label: "Chat Support", href: "/support", color: "text-purple-600" },
    { icon: Phone, label: "Call Us", href: "tel:800-TOYOTA", color: "text-red-600" }
  ] : [
    { icon: Calculator, label: "Finance Calculator", href: "/finance", color: "text-blue-600" },
    { icon: Calendar, label: "Book Test Drive", href: "/test-drive", color: "text-green-600" },
    { icon: MessageCircle, label: "Chat Support", href: "/support", color: "text-purple-600" },
    { icon: MapPin, label: "Find Dealer", href: "/dealers", color: "text-orange-600" },
    { icon: Phone, label: "Call Us", href: "tel:800-TOYOTA", color: "text-red-600" },
    { icon: Star, label: "Reviews", href: "/reviews", color: "text-yellow-600" }
  ];

  const searchFilters = [
    "All Vehicles", "New Arrivals", "Best Sellers", "Hybrid Models", "Under AED 100k", "Family Cars", "Luxury Cars"
  ];

  const menuItems = [
    { icon: Award, label: "Toyota Service", href: "/service" },
    { icon: Shield, label: "Warranty", href: "/warranty" },
    { icon: Users, label: "About Toyota", href: "/about" },
    { icon: Star, label: "Testimonials", href: "/testimonials" },
    { icon: MapPin, label: "Locations", href: "/locations" },
    { icon: Phone, label: "Contact", href: "/contact" }
  ];

  if (!isMobile) return null;

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={closePanel}
          />
        )}
      </AnimatePresence>

      {/* Panels */}
      <AnimatePresence>
        {activePanel && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-20 left-0 right-0 z-50 bg-background border-t border-border rounded-t-3xl shadow-2xl"
            style={{ 
              height: `${getPanelHeight()}px`,
              maxHeight: `${getPanelHeight()}px`
            }}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm rounded-t-3xl">
              <h3 className="text-lg font-semibold capitalize">{activePanel}</h3>
              <Button variant="ghost" size="icon" onClick={closePanel}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Panel Content with Proper Scrolling */}
            <div className="flex-1 overflow-y-auto pb-safe" style={{ height: `${getPanelHeight() - 60}px` }}>
              {/* Models Panel - Enhanced with current vehicle context */}
              {activePanel === "models" && (
                <div className="p-4 space-y-6">
                  {/* Current Vehicle Highlight */}
                  {vehicle && (
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 mb-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <img
                          src={vehicle.image}
                          alt={vehicle.name}
                          className="w-20 h-15 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-primary">Currently Viewing</h4>
                          <h5 className="text-lg font-bold">{vehicle.name}</h5>
                          <p className="text-sm text-muted-foreground">
                            From AED {vehicle.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={onBookTestDrive} className="flex-1">
                          Test Drive
                        </Button>
                        <Button size="sm" variant="outline" onClick={onCarBuilder} className="flex-1">
                          Build & Price
                        </Button>
                      </div>
                    </div>
                  )}

                  {categories.map((category) => (
                    <div key={category.name} className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center text-white text-sm`}>
                          {category.icon}
                        </div>
                        <h4 className="font-semibold text-foreground">{category.name}</h4>
                        <Badge variant="secondary">{category.vehicles.length}</Badge>
                      </div>
                      <div className="grid grid-cols-1 gap-3 ml-11">
                        {category.vehicles.slice(0, 4).map((categoryVehicle) => (
                          <Link
                            key={categoryVehicle.name}
                            to={`/vehicle/${categoryVehicle.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="flex items-center space-x-3 p-3 rounded-xl bg-card hover:bg-accent transition-colors"
                            onClick={closePanel}
                          >
                            <img
                              src={categoryVehicle.image}
                              alt={categoryVehicle.name}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium truncate">{categoryVehicle.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                From AED {categoryVehicle.price.toLocaleString()}
                              </p>
                            </div>
                          </Link>
                        ))}
                        {category.vehicles.length > 4 && (
                          <Link
                            to={`/vehicles?category=${category.name.toLowerCase()}`}
                            className="text-sm text-primary font-medium p-3 text-center hover:bg-accent rounded-xl transition-colors"
                            onClick={closePanel}
                          >
                            View All {category.name} Models ({category.vehicles.length})
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pre-Owned Panel */}
              {activePanel === "pre-owned" && (
                <div className="p-4 space-y-4">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
                    <h4 className="font-semibold mb-2">Certified Pre-Owned</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Quality assured vehicles with comprehensive warranty
                    </p>
                    <Button size="sm" className="w-full">
                      Browse Pre-Owned
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium">Popular Pre-Owned Models</h5>
                    {vehicles.slice(0, 6).map((preOwnedVehicle) => (
                      <div key={preOwnedVehicle.name} className="flex items-center justify-between p-3 bg-card rounded-xl">
                        <div className="flex items-center space-x-3">
                          <img
                            src={preOwnedVehicle.image}
                            alt={preOwnedVehicle.name}
                            className="w-12 h-9 object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-sm">{preOwnedVehicle.name}</p>
                            <p className="text-xs text-muted-foreground">2022-2023 Models Available</p>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-primary">
                          From AED {Math.round(preOwnedVehicle.price * 0.7).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" className="w-full" onClick={closePanel}>
                      <Link to="/pre-owned">View All Pre-Owned Vehicles</Link>
                    </Button>
                  </div>
                </div>
              )}

              {/* Enhanced Actions Panel - Context-aware */}
              {activePanel === "actions" && (
                <div className="p-4">
                  {vehicle && (
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 mb-6">
                      <h4 className="font-semibold mb-2">{vehicle.name} Actions</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Quick actions for your selected vehicle
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action) => (
                      <div
                        key={action.label}
                        className="flex flex-col items-center space-y-2 p-4 bg-card rounded-xl hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => {
                          if (action.action) {
                            action.action();
                            closePanel();
                          } else if (action.href) {
                            window.location.href = action.href;
                          }
                        }}
                      >
                        <div className={`w-12 h-12 bg-secondary rounded-full flex items-center justify-center ${action.color}`}>
                          <action.icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-center">{action.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Panel */}
              {activePanel === "search" && (
                <div className="p-4 space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search vehicles..."
                      className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium">Quick Filters</h5>
                    <div className="flex flex-wrap gap-2">
                      {searchFilters.map((filter) => (
                        <Button key={filter} variant="outline" size="sm" className="text-xs">
                          {filter}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium">Popular Searches</h5>
                    {["Camry Hybrid", "RAV4", "Highlander", "Corolla Cross"].map((search) => (
                      <button
                        key={search}
                        className="w-full text-left p-3 bg-card rounded-xl hover:bg-accent transition-colors"
                        onClick={closePanel}
                      >
                        <div className="flex items-center space-x-3">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{search}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu Panel */}
              {activePanel === "menu" && (
                <div className="p-4 space-y-4">
                  <div className="grid gap-3">
                    {menuItems.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="flex items-center space-x-3 p-3 bg-card rounded-xl hover:bg-accent transition-colors"
                        onClick={closePanel}
                      >
                        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                          <item.icon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 text-center">
                      <h5 className="font-semibold mb-2">Need Help?</h5>
                      <p className="text-sm text-muted-foreground mb-3">
                        Contact our customer service team
                      </p>
                      <Button size="sm" className="w-full">
                        <Phone className="h-4 w-4 mr-2" />
                        Call 800-TOYOTA
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-md border-t border-border pb-safe">
        <div className="flex items-center justify-around px-2 py-3">
          {[
            { key: "models", icon: Car, label: "Models" },
            { key: "pre-owned", icon: Heart, label: "Pre-Owned" },
            { key: "actions", icon: Calculator, label: "Actions" },
            { key: "search", icon: Search, label: "Search" },
            { key: "menu", icon: Menu, label: "Menu" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActivePanel(activePanel === item.key ? null : item.key)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200 ${
                activePanel === item.key
                  ? "bg-primary text-primary-foreground scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileStickyNav;
