import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home, Search, Car, Menu, ShoppingBag, ChevronRight, Battery, Truck, Settings, Star, Phone, X,
  Share2, MapPin, Tag, Calculator, TrendingUp, Sliders, Plus, ChevronUp, Download, Heart, Bolt, Moon, Sun
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/theme-provider";

import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MobileStickyNavProps {
  activeItem?: string;
  onMenuToggle?: () => void;
  vehicle?: VehicleModel;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
}

const vehicleCategories = [
  { id: "all", name: "All", icon: <Car className="h-5 w-5" /> },
  { id: "sedan", name: "Sedan", icon: <Car className="h-5 w-5" /> },
  { id: "suv", name: "SUV", icon: <Truck className="h-5 w-5" /> },
  { id: "hybrid", name: "Hybrid", icon: <Battery className="h-5 w-5" /> },
  { id: "performance", name: "GR Performance", icon: <Star className="h-5 w-5" /> },
  { id: "commercial", name: "Commercial", icon: <ShoppingBag className="h-5 w-5" /> }
];

// Add tag metadata for each vehicle for badge rendering
const extendedVehicles = vehicles.map((v, i) => ({
  ...v,
  tag: i % 2 === 0 ? "New" : i % 3 === 0 ? "Hot Deal" : null // example logic
}));

const quickMenuItems = [
  { title: "Book Service", icon: <Settings className="h-6 w-6" />, color: "bg-blue-500", link: "/service" },
  { title: "Find Dealer", icon: <MapPin className="h-6 w-6" />, color: "bg-green-500", link: "/dealers" },
  { title: "Offers & Deals", icon: <Tag className="h-6 w-6" />, color: "bg-orange-500", link: "/offers" },
  { title: "Finance Calculator", icon: <Calculator className="h-6 w-6" />, color: "bg-purple-500", link: "/finance" },
  { title: "Trade-In Value", icon: <TrendingUp className="h-6 w-6" />, color: "bg-cyan-500", link: "/trade-in" },
  { title: "Contact Us", icon: <Phone className="h-6 w-6" />, color: "bg-red-500", link: "/contact" }
];
const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
  activeItem = "home",
  onMenuToggle,
  vehicle,
  isFavorite = false,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator
}) => {
  const { theme, toggleTheme } = useTheme();
  const { isMobile, isTablet, deviceCategory, screenSize, isInitialized } = useDeviceInfo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([50000, 200000]);
  const [isActionsExpanded, setIsActionsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    let ticking = false;
    const updateScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 100);
      setLastScrollY(y);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleShare = async () => {
    if (!vehicle) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.name} - Toyota`,
          text: `Check out this Toyota: ${vehicle.name}`,
          url: window.location.href
        });
      } catch (err) {
        console.error("Share error:", err);
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied", description: "Copied to clipboard." });
    }
  };

  const handleCategoryClick = (id: string) => {
    setSelectedCategory(id);
  };

  const handleSectionToggle = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
      setIsMenuOpen(false);
    } else {
      setActiveSection(section);
      setIsMenuOpen(true);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setActiveSection(isMenuOpen ? null : "quick-actions");
  };

  const filteredVehicles = extendedVehicles.filter(
    (v) => selectedCategory === "all" || v.category.toLowerCase() === selectedCategory
  );

  const searchResults = extendedVehicles.filter((v) =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (!isInitialized || !isMobile) return null;

  return (
    <>
      {/* Overlay when menu is open */}
      <AnimatePresence>
        {(isMenuOpen || isActionsExpanded) && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setIsMenuOpen(false);
              setActiveSection(null);
              setIsActionsExpanded(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Sticky Navigation Bar */}
      <motion.div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700 shadow-lg"
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 250, damping: 25 }}
      >
        <div className={cn("grid grid-cols-5 gap-1 px-3 py-2")}>
          <NavItem
            icon={<Car className="h-5 w-5" />}
            label="Models"
            isActive={activeSection === "models"}
            onClick={() => handleSectionToggle("models")}
          />
          <NavItem
            icon={<ShoppingBag className="h-5 w-5" />}
            label="Used"
            isActive={activeSection === "pre-owned"}
            onClick={() => handleSectionToggle("pre-owned")}
          />
          <NavItem
            icon={<Search className="h-5 w-5" />}
            label="Search"
            isActive={activeSection === "search"}
            onClick={() => handleSectionToggle("search")}
          />
          <NavItem
            icon={<Menu className="h-5 w-5" />}
            label="Menu"
            isActive={isMenuOpen}
            onClick={toggleMenu}
          />
          <button
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="text-xs mt-1">{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </div>
      </motion.div>
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center",
        "text-gray-500 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
      )}
    >
      <motion.div
        className={cn(
          "p-2 rounded-full",
          isActive ? "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400" : ""
        )}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
      </motion.div>
      <span className="text-xs">{label}</span>
    </button>
  );
};
      {/* Bottom Sheet Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed bottom-16 left-0 right-0 bg-white dark:bg-zinc-900 rounded-t-2xl shadow-xl z-50 border-t-4 border-red-600 max-h-[75vh] overflow-y-auto"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="p-4">
              {activeSection === "quick-actions" && (
                <>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {quickMenuItems.map((item) => (
                      <Link to={item.link} key={item.title} onClick={() => setIsMenuOpen(false)}>
                        <div className={cn("rounded-xl p-4 text-white flex flex-col items-start", item.color)}>
                          <div className="mb-2">{item.icon}</div>
                          <span className="text-sm font-semibold">{item.title}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Button onClick={() => handleSectionToggle("models")} variant="outline" className="w-full">
                    <Car className="mr-2 h-4 w-4" />
                    Browse Models
                  </Button>
                </>
              )}

              {activeSection === "models" && (
                <>
                  <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">Models</h3>
                  <div className="flex space-x-2 mb-4 overflow-x-auto scrollbar-hide">
                    {vehicleCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={cn(
                          "px-3 py-2 rounded-full text-sm whitespace-nowrap",
                          selectedCategory === cat.id
                            ? "bg-red-600 text-white font-semibold"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  {/* Vehicle Cards */}
                  <div className="space-y-4">
                    {filteredVehicles.slice(0, 10).map((vehicle) => (
                      <Link
                        key={vehicle.name}
                        to={`/vehicle/${encodeURIComponent(vehicle.name.toLowerCase().replace(/\s+/g, '-'))}`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Card className="overflow-hidden hover:shadow-md transition">
                          <div className="relative">
                            <img src={vehicle.image} alt={vehicle.name} className="w-full h-40 object-cover" />
                            {vehicle.tag && (
                              <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                {vehicle.tag}
                              </span>
                            )}
                          </div>
                          <CardContent className="p-3">
                            <h4 className="text-base font-bold text-gray-800 dark:text-white mb-1">{vehicle.name}</h4>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-red-600 font-semibold">
                                AED {vehicle.price.toLocaleString()}
                              </span>
                              <ChevronRight className="h-4 w-4 text-red-500" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
