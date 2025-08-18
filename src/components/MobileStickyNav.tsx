import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Home, Search, Car, Menu, ShoppingBag, ChevronLeft, ChevronRight, Battery, Truck, 
  Settings, Star, Phone, X, Share2, MapPin, Tag, Calculator, TrendingUp, Sliders, 
  Plus, ChevronUp, Download, Heart, Zap, Bolt, Activity 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { useToast } from "@/hooks/use-toast";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/* ─────────────────────────────────────────────────────────
   BRAND + GR MODE TOKENS (ADD-ONLY, NON-BREAKING)
   ───────────────────────────────────────────────────────── */
const TOYOTA_RED = "#CC0000";
const TOYOTA_GRADIENT = "linear-gradient(90deg, #EB0A1E, #CC0000, #8B0000)";

/** GR tokens */
const GR_RED = "#EB0A1E";
const GR_DARK = "#0A0A0B";
const GR_GRADIENT = "linear-gradient(135deg, #EB0A1E 0%, #B30000 45%, #6A0000 100%)";

/** Carbon fiber (pure CSS) */
const carbonStyle: React.CSSProperties = {
  backgroundImage: `
    repeating-linear-gradient(45deg, #111 0 6px, #0c0c0c 6px 12px),
    repeating-linear-gradient(-45deg, #121212 0 6px, #0b0b0b 6px 12px)
  `,
  backgroundBlendMode: "multiply",
};

/** Checkered accent bar (SVG data URI) */
const CHECKER_URI =
  "url(\"data:image/svg+xml;utf8,\
  <svg xmlns='http://www.w3.org/2000/svg' width='40' height='8' viewBox='0 0 40 8'>\
    <rect width='40' height='8' fill='black'/>\
    <rect x='0' y='0' width='4' height='4' fill='white'/>\
    <rect x='8' y='0' width='4' height='4' fill='white'/>\
    <rect x='16' y='0' width='4' height='4' fill='white'/>\
    <rect x='24' y='0' width='4' height='4' fill='white'/>\
    <rect x='32' y='0' width='4' height='4' fill='white'/>\
    <rect x='4' y='4' width='4' height='4' fill='white'/>\
    <rect x='12' y='4' width='4' height='4' fill='white'/>\
    <rect x='20' y='4' width='4' height='4' fill='white'/>\
    <rect x='28' y='4' width='4' height='4' fill='white'/>\
    <rect x='36' y='4' width='4' height='4' fill='white'/>\
  </svg>\")";

/* ─────────────────────────────────────────────────────────
   PROPS (ADD-ONLY: grMode?)
   ───────────────────────────────────────────────────────── */
interface MobileStickyNavProps {
  activeItem?: string;
  onMenuToggle?: () => void;
  // Vehicle action props (optional, for vehicle detail pages)
  vehicle?: VehicleModel;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
  /** NEW: activate GR visuals + default filtering */
  grMode?: boolean;
}

/* ─────────────────────────────────────────────────────────
   DATA (unchanged)
   ───────────────────────────────────────────────────────── */
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

const preOwnedVehicles = [
  {
    name: "2022 Toyota Camry LE",
    price: 89000,
    mileage: "25,000 km",
    year: 2022,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    category: "sedan",
  },
  {
    name: "2021 Toyota RAV4 XLE",
    price: 95000,
    mileage: "35,000 km",
    year: 2021,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    category: "suv",
  },
  {
    name: "2023 Toyota Prius Hybrid",
    price: 78000,
    mileage: "15,000 km",
    year: 2023,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    category: "hybrid",
  },
  {
    name: "2020 Toyota Corolla SE",
    price: 65000,
    mileage: "45,000 km",
    year: 2020,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    category: "sedan",
  },
  {
    name: "2022 Toyota Highlander Limited",
    price: 145000,
    mileage: "20,000 km",
    year: 2022,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    category: "suv",
  },
  {
    name: "2021 Toyota GR Supra 3.0",
    price: 185000,
    mileage: "12,000 km",
    year: 2021,
    image:
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
    category: "performance",
  },
];

/* ─────────────────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────────────────── */
const MobileStickyNav: React.FC<MobileStickyNavProps> = ({ 
  activeItem = "home", 
  onMenuToggle,
  vehicle,
  isFavorite = false,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
  grMode, // NEW prop (optional)
}) => {
  const { isMobile, isTablet, deviceCategory, screenSize, isInitialized, deviceModel, isIPhone } = useDeviceInfo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([50000, 200000]);
  const [isActionsExpanded, setIsActionsExpanded] = useState(false);
  const [debugVisible, setDebugVisible] = useState(false);
  const [forceVisible, setForceVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const { toast } = useToast();

  /* Reduced motion (kept gentle for a11y) */
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(!!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  /* GR MODE: derive from prop, URL, or storage (persist) */
  const getInitialGR = (): boolean => {
    if (typeof window !== "undefined") {
      const urlGR = new URLSearchParams(window.location.search).get("gr");
      if (urlGR === "1" || urlGR === "true") return true;
      const stored = localStorage.getItem("toyota.grMode");
      if (stored === "1" || stored === "true") return true;
    }
    return !!grMode;
  };
  const [isGR, setIsGR] = useState<boolean>(getInitialGR);
  // sync prop changes
  useEffect(() => {
    if (typeof grMode === "boolean") setIsGR(grMode);
  }, [grMode]);
  // persist
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("toyota.grMode", isGR ? "1" : "0");
    }
  }, [isGR]);

  // User-touched category guard (so we don't override after user picks)
  const [userTouchedCategory, setUserTouchedCategory] = useState(false);

  // Locale-safe formatter
  const fmt = useMemo(
    () => new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-AE"),
    []
  );

  // Enhanced device detection debugging and force visibility
  useEffect(() => {
    const viewportWidth = window.innerWidth;
    const shouldForceVisible = viewportWidth <= 500; 
    
    setForceVisible(shouldForceVisible);
    if (process.env.NODE_ENV === "development") {
      setDebugVisible(true);
      setTimeout(() => setDebugVisible(false), 8000);
    }
  }, [isMobile, isTablet, deviceCategory, screenSize, isInitialized, deviceModel, isIPhone]);

  // Shrink-on-scroll
  useEffect(() => {
    let ticking = false;    
    const updateScrollState = () => {
      const scrollY = window.scrollY;
      const scrollThreshold = 100;
      const scrollingUp = scrollY < lastScrollY;
      setIsScrollingUp(scrollingUp);
      if (scrollY > scrollThreshold && !isScrolled) setIsScrolled(true);
      else if (scrollY <= scrollThreshold * 0.7 && isScrolled) setIsScrolled(false);
      setLastScrollY(scrollY);
      ticking = false;
    };
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isScrolled]);

  /* ────── NEW: Default to GR Performance when GR is active ────── */
  useEffect(() => {
    if (isGR && !userTouchedCategory) {
      setSelectedCategory("performance");
    }
  }, [isGR, userTouchedCategory]);

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

  const filteredVehicles = vehicles
    .filter(vehicle => selectedCategory === "all" || vehicle.category.toLowerCase() === selectedCategory)
    .slice(0, 12);

  const searchResults = vehicles
    .filter(vehicle => vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 8);

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
    setUserTouchedCategory(true);
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

  const handleShare = async () => {
    if (!vehicle) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.name} - Toyota UAE`,
          text: `Check out this amazing ${vehicle.name} starting from AED ${fmt.format(vehicle.price)}`,
          url: window.location.href,
        });
      } catch (error) {
        // noop
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Vehicle link has been copied to clipboard.",
      });
    }
  };

  const handleBrochureDownload = () => {
    if (!vehicle) return;
    toast({
      title: "Brochure Download",
      description: "Your brochure is being prepared and will be downloaded shortly.",
    });
    setTimeout(() => {
      toast({
        title: "Download Complete",
        description: `${vehicle.name} brochure has been downloaded.`,
      });
    }, 1600);
  };

  const shouldShowNav = isInitialized && (isMobile || forceVisible);
  if (!shouldShowNav) return null;

  /* GR motion personality */
  const springGR = { type: "spring", stiffness: 420, damping: 28, mass: 0.7 };
  const springNormal = { type: "spring", stiffness: 260, damping: 20 };
  const spring = isGR ? springGR : springNormal;
  const easeOutExpo = [0.16, 1, 0.3, 1];

  return (
    <>
      {/* Debug banner (development only) */}
      {debugVisible && (
        <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-xs p-2 z-[9999] animate-fade-in">
          <div className="text-center font-mono">
            DEBUG: {deviceCategory} | {screenSize.width}x{screenSize.height} | {deviceModel} | Mobile: {isMobile ? '✅' : '❌'} | Forced: {forceVisible ? '✅' : '❌'} | GR: {isGR ? 'ON' : 'OFF'}
          </div>
        </div>
      )}

      {/* Overlay */}
      <AnimatePresence>
        {(isMenuOpen || isActionsExpanded) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => {
              setIsMenuOpen(false);
              setActiveSection(null);
              setIsActionsExpanded(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Vehicle Actions Panel */}
      <AnimatePresence>
        {isActionsExpanded && vehicle && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Vehicle quick actions"
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={spring}
            className={cn(
              "fixed left-4 right-4 bottom-24 z-50 rounded-2xl shadow-2xl border p-4",
              isGR ? "bg-black/90 border-neutral-800" : "bg-white/95 backdrop-blur-xl border-gray-200/50"
            )}
            style={isGR ? carbonStyle : undefined}
          >
            {/* GR checkered accent */}
            {isGR && <div className="h-2 w-full mb-3" style={{ backgroundImage: CHECKER_URI, backgroundSize: "auto 100%" }} />}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={cn("font-bold", isGR ? "text-white tracking-wide" : "text-gray-900")}>
                  {vehicle.name}
                </h3>
                <span className={cn("text-lg font-bold", isGR ? "text-red-400" : "text-primary")}>
                  AED {fmt.format(vehicle.price)}
                </span>
              </div>
              <Button
                onClick={() => setIsActionsExpanded(false)}
                variant="outline"
                size="sm"
                className={cn(
                  "p-2 rounded-full",
                  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]",
                  isGR ? "border-neutral-700 text-neutral-200 hover:bg-neutral-800" : ""
                )}
                aria-label="Collapse actions"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            {/* Main Actions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <motion.div whileHover={{ scale: reduceMotion ? 1 : 1.02 }} whileTap={{ scale: reduceMotion ? 1 : 0.98 }}>
                <Button 
                  onClick={() => {
                    onBookTestDrive?.();
                    setIsActionsExpanded(false);
                  }}
                  className={cn(
                    "w-full py-3 rounded-xl text-sm font-medium text-white shadow-lg",
                    isGR ? "" : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  )}
                  style={isGR ? { background: GR_GRADIENT } : undefined}
                >
                  <Car className="h-4 w-4 mr-2" />
                  Test Drive
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: reduceMotion ? 1 : 1.02 }} whileTap={{ scale: reduceMotion ? 1 : 0.98 }}>
                <Button 
                  onClick={() => {
                    onCarBuilder?.();
                    setIsActionsExpanded(false);
                  }}
                  variant="outline"
                  className={cn(
                    "w-full border py-3 rounded-xl text-sm font-medium",
                    isGR ? "border-red-700 text-red-400 hover:bg-red-950/40" : "border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-white/70"
                  )}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
              </motion.div>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button 
                onClick={() => {
                  onFinanceCalculator?.();
                  setIsActionsExpanded(false);
                }}
                variant="outline"
                className={cn(
                  "w-full border py-2 rounded-lg text-xs",
                  isGR ? "border-neutral-700 text-neutral-200 hover:bg-neutral-800" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/70"
                )}
              >
                <Calculator className="h-4 w-4 mb-1" />
                Finance
              </Button>

              <Button 
                onClick={() => {
                  handleBrochureDownload();
                  setIsActionsExpanded(false);
                }}
                variant="outline"
                className={cn(
                  "w-full border py-2 rounded-lg text-xs",
                  isGR ? "border-neutral-700 text-neutral-200 hover:bg-neutral-800" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/70"
                )}
              >
                <Download className="h-4 w-4 mb-1" />
                Brochure
              </Button>

              <Button 
                onClick={() => {
                  handleShare();
                  setIsActionsExpanded(false);
                }}
                variant="outline"
                className={cn(
                  "w-full border py-2 rounded-lg text-xs",
                  isGR ? "border-neutral-700 text-neutral-200 hover:bg-neutral-800" : "border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/70"
                )}
              >
                <Share2 className="h-4 w-4 mb-1" />
                Share
              </Button>
            </div>

            {/* Quick Info */}
            <div className={cn("mt-4 pt-3 border-t", isGR ? "border-neutral-800" : "border-gray-200")}>
              <p className={cn("text-xs text-center", isGR ? "text-neutral-400" : "text-muted-foreground")}>
                From AED 899/month • Free delivery • 7-day return
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Sheet (menu) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Toyota Connect menu"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            className={cn(
              "fixed bottom-16 left-0 right-0 rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-hidden border-t-4",
              isGR ? "" : "bg-white dark:bg-black"
            )}
            style={isGR ? { borderImage: `${GR_GRADIENT} 1`, backgroundColor: GR_DARK } : { borderImage: `${TOYOTA_GRADIENT} 1` }}
          >
            {/* Header */}
            <div className={cn(
              "flex items-center justify-between p-4 border-b",
              isGR ? "border-neutral-800" : "",
            )}
            style={isGR ? carbonStyle : undefined}>
              <div>
                <h3 className={cn("font-bold text-lg", isGR ? "text-white tracking-wide" : "text-black dark:text-red-500")}>
                  Toyota Connect
                </h3>
                <p className={cn("text-sm", isGR ? "text-neutral-300" : "text-red-600 dark:text-red-400")}>
                  {isGR ? "GR Performance Hub" : "Your gateway to Toyota"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "rounded-full h-8 w-8 p-0 hover:bg-red-100 dark:hover:bg-red-900",
                  "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]",
                  isGR ? "text-white hover:bg-white/10" : "text-red-600"
                )}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* GR checkered strip */}
            {isGR && <div className="h-1.5" style={{ backgroundImage: CHECKER_URI, backgroundSize: "auto 100%" }} />}

            <div className="overflow-y-auto max-h-[calc(75vh-100px)] scrollbar-hide">
              {/* Quick Actions Section */}
              {activeSection === "quick-actions" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-800 dark:text-gray-200")}>
                    Quick Actions
                  </h4>
                  
                  <Carousel opts={{ align: "start" }} className="w-full mb-6">
                    <CarouselContent>
                      {quickActionCards.map((card) => (
                        <CarouselItem key={card.id} className="basis-2/3 pl-4">
                          <Link to={card.link} onClick={() => setIsMenuOpen(false)} aria-label={card.title}>
                            <motion.div
                              whileHover={{ scale: reduceMotion ? 1 : 1.02, y: isGR && !reduceMotion ? -2 : 0 }}
                              whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                              transition={{ duration: .25, ease: easeOutExpo }}
                            >
                              <Card
                                className={cn(
                                  "h-32 overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-shadow",
                                  isGR ? "border border-neutral-800" : "",
                                  isGR ? "" : card.color
                                )}
                                style={isGR ? { background: GR_GRADIENT } : undefined}
                              >
                                <CardContent className={cn("flex flex-col justify-between h-full p-4", isGR ? "text-white" : "")}>
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                      <h3 className="font-semibold text-base">{card.title}</h3>
                                      <p className="text-xs opacity-90">{card.description}</p>
                                    </div>
                                    <div className={cn(isGR ? "opacity-95" : "opacity-80")}>
                                      {card.icon}
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    {isGR ? <div className="h-1 w-24 rounded-full bg-white/40" /> : <span />}
                                    <ChevronRight className="h-4 w-4 opacity-90" />
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
                      className={cn(
                        "h-12 text-left justify-start focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]",
                        isGR ? "border-neutral-700 text-neutral-200 hover:bg-neutral-800" : ""
                      )}
                      onClick={() => handleSectionToggle("models")}
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Browse Models
                    </Button>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "h-12 text-left justify-start focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]",
                        isGR ? "border-neutral-700 text-neutral-200 hover:bg-neutral-800" : ""
                      )}
                      onClick={() => handleSectionToggle("search")}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Find Vehicle
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Models Section */}
              {activeSection === "models" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-800 dark:text-gray-200")}>
                    Browse Models
                  </h4>
                  
                  {/* Category selector */}
                  <div className="mb-6">
                    <Carousel opts={{ align: "start" }} className="w-full">
                      <CarouselContent>
                        {vehicleCategories.map((category) => (
                          <CarouselItem key={category.id} className="basis-auto pl-3">
                            <motion.button
                              onClick={() => handleCategoryClick(category.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl transition-all min-w-[80px] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]",
                                selectedCategory === category.id 
                                  ? (isGR ? "text-white shadow-lg scale-105 border border-red-700" : "bg-toyota-red text-white shadow-lg scale-105") 
                                  : (isGR ? "text-neutral-200 border border-neutral-800 hover:bg-neutral-900" : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700")
                              )}
                              style={
                                selectedCategory === category.id
                                  ? (isGR ? { background: GR_GRADIENT } : undefined)
                                  : (isGR ? carbonStyle : undefined)
                              }
                              whileHover={{ scale: reduceMotion ? 1 : 1.05 }}
                              whileTap={{ scale: reduceMotion ? 1 : 0.95 }}
                              aria-pressed={selectedCategory === category.id}
                              aria-label={`Filter ${category.name}`}
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
                            aria-label={`View ${vehicle.name}`}
                            className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000] rounded-xl"
                          >
                            <motion.div 
                              whileHover={{ scale: reduceMotion ? 1 : 1.02, y: isGR && !reduceMotion ? -2 : 0 }} 
                              whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                              transition={{ duration: .25, ease: easeOutExpo }}
                            >
                              <Card className={cn(
                                "overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow",
                                isGR ? "border border-neutral-800 bg-black" : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl"
                              )}>
                                <div className={cn("aspect-[16/10] w-full", isGR ? "relative" : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700")}
                                     style={isGR ? carbonStyle : undefined}>
                                  {vehicle.image && (
                                    <img 
                                      src={vehicle.image} 
                                      alt={vehicle.name} 
                                      className={cn("w-full h-full object-cover", isGR ? "mix-blend-screen opacity-90" : "")}
                                      loading="lazy" decoding="async"
                                    />
                                  )}
                                  {/* GR ribbon */}
                                  {isGR && (
                                    <div className="absolute -left-10 -top-10 h-20 w-40 rotate-[-15deg] opacity-90" style={{ background: GR_GRADIENT }} />
                                  )}
                                </div>
                                <CardContent className="p-4">
                                  <h3 className={cn("font-semibold text-base mb-1", isGR ? "text-white tracking-wide" : "text-gray-900 dark:text-gray-100")}>{vehicle.name}</h3>
                                  <p className={cn("text-sm mb-3", isGR ? "text-neutral-300" : "text-gray-500 dark:text-gray-400")}>
                                    From AED {fmt.format(vehicle.price)}
                                  </p>
                                  <div className="flex justify-between items-center">
                                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium",
                                      isGR ? "bg-[rgba(235,10,30,0.12)] text-red-400" : "bg-toyota-red/10 text-toyota-red"
                                    )}>
                                      {vehicle.category}
                                    </span>
                                    <span className={cn("text-sm font-semibold flex items-center",
                                      isGR ? "text-red-400" : "text-toyota-red"
                                    )}>
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
                      className={cn(
                        "font-semibold flex items-center justify-center hover:text-red-300 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000] rounded-lg",
                        isGR ? "text-red-400" : "text-toyota-red hover:text-red-700"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View All {selectedCategory !== 'all' ? vehicleCategories.find(c => c.id === selectedCategory)?.name : ''} Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Search Section */}
              {activeSection === "search" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-800 dark:text-gray-200")}>
                    Find Your Toyota
                  </h4>
                  
                  {/* Search input */}
                  <div className="relative mb-6">
                    <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", isGR ? "text-neutral-400" : "text-gray-400")} />
                    <input
                      type="text"
                      placeholder="Search models, features..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent",
                        isGR 
                          ? "border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-500 focus:ring-red-700"
                          : "border-gray-200 focus:ring-toyota-red dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      )}
                      aria-label="Search vehicles"
                    />
                  </div>

                  {searchQuery ? (
                    /* Search results */
                    <div className="space-y-3">
                      <h5 className={cn("text-sm font-medium", isGR ? "text-neutral-400" : "text-gray-600 dark:text-gray-400")}>Search Results</h5>
                      <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                          {searchResults.map((vehicle) => (
                            <CarouselItem key={vehicle.name} className="basis-2/3 pl-4">
                              <Link 
                                to={`/vehicle/${encodeURIComponent(vehicle.name.toLowerCase().replace(/\s+/g, '-'))}`}
                                onClick={() => setIsMenuOpen(false)}
                                className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000] rounded-xl"
                                aria-label={`View ${vehicle.name}`}
                              >
                                <Card className={cn("h-24 overflow-hidden hover:shadow-lg transition-shadow",
                                  isGR ? "border border-neutral-800 bg-neutral-950" : ""
                                )}>
                                  <CardContent className="flex items-center h-full p-4">
                                    <div className={cn("w-16 h-12 rounded-lg mr-3 flex-shrink-0",
                                      isGR ? "overflow-hidden" : "bg-gray-100 dark:bg-gray-800"
                                    )}
                                    style={isGR ? carbonStyle : undefined}>
                                      {vehicle.image && (
                                        <img 
                                          src={vehicle.image} 
                                          alt={vehicle.name} 
                                          className={cn("w-full h-full object-cover rounded-lg", isGR ? "mix-blend-screen opacity-90" : "")}
                                          loading="lazy" decoding="async"
                                        />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className={cn("font-medium text-sm truncate", isGR ? "text-white" : "text-gray-900 dark:text-gray-100")}>{vehicle.name}</h3>
                                      <p className={cn("text-xs", isGR ? "text-neutral-400" : "text-gray-500 dark:text-gray-400")}>
                                        AED {fmt.format(vehicle.price)}
                                      </p>
                                    </div>
                                    <ChevronRight className={cn("h-4 w-4 flex-shrink-0", isGR ? "text-neutral-400" : "text-gray-400")} />
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
                      <h5 className={cn("text-sm font-medium", isGR ? "text-neutral-400" : "text-gray-600 dark:text-gray-400")}>Popular Searches</h5>
                      <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent>
                          {searchSuggestions.map((suggestion) => (
                            <CarouselItem key={suggestion.term} className="basis-auto pl-3">
                              <button
                                onClick={() => setSearchQuery(suggestion.term)}
                                className={cn(
                                  "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]",
                                  isGR ? "border border-neutral-800 bg-neutral-950 text-neutral-100 hover:bg-neutral-900"
                                       : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                )}
                                aria-label={`Search ${suggestion.term}`}
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

              {/* Pre-Owned Section */}
              {activeSection === "pre-owned" && (
                <motion.div 
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-800 dark:text-gray-200")}>
                    Pre-Owned Vehicles
                  </h4>
                  
                  {/* Category selector */}
                  <div className="mb-6">
                    <Carousel opts={{ align: "start" }} className="w-full">
                      <CarouselContent>
                        {vehicleCategories.map((category) => (
                          <CarouselItem key={category.id} className="basis-auto pl-3">
                            <motion.button
                              onClick={() => handleCategoryClick(category.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl transition-all min-w-[80px] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]",
                                selectedCategory === category.id 
                                  ? (isGR ? "text-white shadow-lg scale-105 border border-red-700" : "bg-toyota-red text-white shadow-lg scale-105") 
                                  : (isGR ? "text-neutral-200 border border-neutral-800 hover:bg-neutral-900" : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700")
                              )}
                              style={
                                selectedCategory === category.id
                                  ? (isGR ? { background: GR_GRADIENT } : undefined)
                                  : (isGR ? carbonStyle : undefined)
                              }
                              whileHover={{ scale: reduceMotion ? 1 : 1.05 }}
                              whileTap={{ scale: reduceMotion ? 1 : 0.95 }}
                              aria-pressed={selectedCategory === category.id}
                              aria-label={`Filter ${category.name}`}
                            >
                              <span className="mb-2">{category.icon}</span>
                              <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
                            </motion.button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  {/* Price Range */}
                  <div className={cn("mb-6 p-4 rounded-xl", isGR ? "bg-neutral-950 border border-neutral-800" : "bg-gray-50 dark:bg-gray-800")}>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className={cn("text-sm font-medium", isGR ? "text-neutral-200" : "text-gray-700 dark:text-gray-300")}>
                        Price Range
                      </h5>
                      <span className={cn("text-sm", isGR ? "text-neutral-400" : "text-gray-500 dark:text-gray-400")}>
                        AED {fmt.format(priceRange[0])} - AED {fmt.format(priceRange[1])}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sliders className={cn("h-5 w-5", isGR ? "" : "text-toyota-red")} style={isGR ? { color: GR_RED } : undefined} />
                      <input
                        type="range"
                        min="30000"
                        max="300000"
                        step="10000"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1]), priceRange[1]])}
                        className={cn("flex-1 h-2 rounded-lg appearance-none cursor-pointer", isGR ? "bg-neutral-800" : "bg-gray-200")}
                        aria-label="Minimum price"
                      />
                      <input
                        type="range"
                        min="30000"
                        max="300000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0])])}
                        className={cn("flex-1 h-2 rounded-lg appearance-none cursor-pointer", isGR ? "bg-neutral-800" : "bg-gray-200")}
                        aria-label="Maximum price"
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
                            aria-label={`View ${vehicle.name}`}
                            className="focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000] rounded-xl"
                          >
                            <motion.div 
                              whileHover={{ scale: reduceMotion ? 1 : 1.02, y: isGR && !reduceMotion ? -2 : 0 }} 
                              whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                              transition={{ duration: .25, ease: easeOutExpo }}
                            >
                              <Card className={cn("overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow",
                                isGR ? "border border-neutral-800 bg-neutral-950" : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl"
                              )}>
                                <div className={cn("aspect-[16/10] w-full relative", isGR ? "" : "bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700")}
                                     style={isGR ? carbonStyle : undefined}>
                                  <img 
                                    src={vehicle.image} 
                                    alt={vehicle.name} 
                                    className={cn("w-full h-full object-cover", isGR ? "mix-blend-screen opacity-90" : "")}
                                    loading="lazy" decoding="async"
                                  />
                                  <div className="absolute top-2 right-2">
                                    <span
                                      className={cn("px-2 py-1 rounded-full text-xs font-medium shadow-md",
                                        isGR ? "text-white" : "text-white"
                                      )}
                                      style={{ background: isGR ? GR_GRADIENT : TOYOTA_GRADIENT }}
                                    >
                                      {vehicle.year}
                                    </span>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <h3 className={cn("font-semibold text-base mb-1", isGR ? "text-white tracking-wide" : "text-gray-900 dark:text-gray-100")}>
                                    {vehicle.name}
                                  </h3>
                                  <div className="flex justify-between items-center mb-2">
                                    <p className={cn("text-sm font-bold", isGR ? "text-red-400" : "text-toyota-red")}>
                                      AED {fmt.format(vehicle.price)}
                                    </p>
                                    <p className={cn("text-xs", isGR ? "text-neutral-400" : "text-gray-500 dark:text-gray-400")}>
                                      {vehicle.mileage}
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium",
                                      isGR ? "bg-[rgba(235,10,30,0.12)] text-red-400" : "bg-toyota-red/10 text-toyota-red"
                                    )}>
                                      Certified Pre-Owned
                                    </span>
                                    <span className={cn("text-sm font-semibold flex items-center",
                                      isGR ? "text-red-400" : "text-toyota-red"
                                    )}>
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
                      className={cn(
                        "font-semibold flex items-center justify-center hover:text-red-300 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000] rounded-lg",
                        isGR ? "text-red-400" : "text-toyota-red hover:text-red-700"
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      View All Pre-Owned {selectedCategory !== 'all' ? vehicleCategories.find(c => c.id === selectedCategory)?.name : ''} Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sticky Nav */}
      <motion.nav 
        role="navigation"
        aria-label="Primary"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100]",
          "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
          "pb-safe-area-inset-bottom",
          isGR 
            ? "backdrop-blur-xl border-t shadow-[0_-10px_30px_rgba(0,0,0,.35)]"
            : "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 shadow-2xl"
        )}
        style={isGR ? { backgroundColor: "rgba(10,10,11,0.92)", borderColor: "#141414" } : undefined}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={spring}
      >
        {/* GR checkered top strip */}
        {isGR && <div className="h-1.5" style={{ backgroundImage: CHECKER_URI, backgroundSize: "auto 100%" }} />}

        <motion.div 
          className={cn(
            "grid gap-1 px-2 items-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            vehicle ? 'grid-cols-5' : 'grid-cols-4'
          )}
          animate={{
            minHeight: isScrolled ? 48 : 56,
            paddingTop: isScrolled ? 2 : 4,
            paddingBottom: isScrolled ? 2 : 4
          }}
          transition={{ duration: .35, ease: easeOutExpo }}
        >
          <NavItem 
            icon={<Car className={cn(isGR ? "text-neutral-100" : "text-current", isScrolled ? "h-4 w-4" : "h-5 w-5")} />}
            label="Models"
            to="#"
            onClick={() => handleSectionToggle("models")}
            isActive={activeItem === "models" || activeSection === "models"}
            isScrolled={isScrolled}
            grMode={isGR}
          />
          <NavItem 
            icon={<ShoppingBag className={cn(isGR ? "text-neutral-100" : "text-current", isScrolled ? "h-4 w-4" : "h-5 w-5")} />}
            label="Pre-Owned"
            to="#"
            onClick={() => handleSectionToggle("pre-owned")}
            isActive={activeItem === "pre-owned" || activeSection === "pre-owned"}
            isScrolled={isScrolled}
            grMode={isGR}
          />
          
          {/* Vehicle Actions Item (only shown on vehicle detail pages) */}
          {vehicle && (
            <NavItem 
              icon={
                <div className="relative">
                  {/* GR pulse */}
                  {isGR && <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: "rgba(235,10,30,0.45)" }} />}
                  <div className={cn("relative rounded-full p-2", isGR ? "" : "bg-red-500")} style={isGR ? { background: GR_GRADIENT } : undefined}>
                    <Bolt className={cn("text-white", isScrolled ? "h-3 w-3" : "h-4 w-4")} />
                  </div>
                </div>
              }
              label="Actions"
              to="#"
              onClick={() => setIsActionsExpanded(!isActionsExpanded)}
              isActive={isActionsExpanded}
              isScrolled={isScrolled}
              grMode={isGR}
            />
          )}

          <NavItem 
            icon={<Search className={cn(isGR ? "text-neutral-100" : "text-current", isScrolled ? "h-4 w-4" : "h-5 w-5")} />}
            label="Search"
            to="#"
            onClick={() => handleSectionToggle("search")}
            isActive={activeItem === "search" || activeSection === "search"}
            isScrolled={isScrolled}
            grMode={isGR}
          />
          <NavItem 
            icon={<Menu className={cn(isGR ? "text-red-400" : "text-red-500", isScrolled ? "h-4 w-4" : "h-5 w-5")} />}
            label="Menu"
            to="#"
            onClick={toggleMenu}
            isActive={isMenuOpen}
            isScrolled={isScrolled}
            grMode={isGR}
          />
        </motion.div>
      </motion.nav>
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
  isScrolled?: boolean;
  /** NEW: switch visuals if true */
  grMode?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive = false, onClick, badge, isScrolled = false, grMode = false }) => {
  const content = (
    <>
      <div className="flex flex-col items-center justify-center relative w-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
           style={{ minHeight: isScrolled ? '40px' : '44px' }}>
        <motion.div 
          className={cn(
            "p-2 rounded-xl transition-all relative touch-target duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "flex items-center justify-center focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#CC0000]",
            isActive 
              ? (grMode ? "bg-red-900/40 text-red-300 scale-110" : "text-toyota-red bg-red-50 dark:bg-red-950 scale-110") 
              : (grMode ? "text-neutral-100 bg-black/20 hover:bg-black/30" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300")
          )}
          animate={{
            minWidth: isScrolled ? '36px' : '44px',
            minHeight: isScrolled ? '36px' : '44px',
            padding: isScrolled ? '6px' : '8px'
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          }
          whileHover={{ scale: isActive ? 1.08 : 1.04 }}
          whileTap={{ scale: 0.95 }}
          aria-current={isActive ? "page" : undefined}
        >
          {icon}
          {typeof badge === "number" && (
            <motion.div
              className="absolute -top-1 -right-1 rounded-full h-5 w-5 flex items-center justify-center font-bold text-white"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 600, damping: 18 }}
              style={{
                background: grMode
                  ? "linear-gradient(135deg, #EB0A1E 0%, #B30000 45%, #6A0000 100%)"
                  : "linear-gradient(90deg, #EB0A1E, #CC0000, #8B0000)",
                boxShadow: "0 6px 16px rgba(235,10,30,.4)",
              }}
            >
              {badge > 9 ? "9+" : badge}
            </motion.div>
          )}
        </motion.div>

        {/* Label (hidden when shrunk) */}
        <AnimatePresence mode="wait">
          {!isScrolled && (
            <motion.span
              className={cn(
                "text-[11px] text-center font-medium mt-1 leading-tight",
                grMode
                  ? isActive
                    ? "text-red-300"
                    : "text-neutral-300"
                  : isActive
                    ? "text-toyota-red"
                    : "text-gray-600 dark:text-gray-400"
              )}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Active indicator dot */}
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1, y: isScrolled ? -2 : -4 }}
          transition={{ duration: 0.25 }}
          style={{
            background: grMode
              ? "linear-gradient(135deg, #EB0A1E 0%, #B30000 45%, #6A0000 100%)"
              : "#EB0A1E",
            boxShadow: grMode ? "0 0 0 4px rgba(235,10,30,0.18)" : "none",
          }}
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="relative flex items-center justify-center px-1 py-2 rounded-lg"
        style={{
          WebkitTapHighlightColor: "transparent",
          minHeight: isScrolled ? 48 : 56,
        }}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className="relative flex items-center justify-center px-1 py-2 rounded-lg"
      style={{
        WebkitTapHighlightColor: "transparent",
        minHeight: isScrolled ? 48 : 56,
      }}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
};

export default MobileStickyNav;