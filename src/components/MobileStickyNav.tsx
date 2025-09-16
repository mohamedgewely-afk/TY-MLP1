import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Car,
  Menu,
  ShoppingBag,
  Battery,
  Truck,
  Settings,
  Star,
  Phone,
  X,
  Share2,
  Sliders,
  ChevronUp,
  Download,
  Bolt,
  ChevronRight,
  Calculator,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useOptimizedDeviceInfo } from "@/hooks/use-optimized-device-info";
import { useNavigationState } from "@/hooks/use-navigation-state";
import { useToast } from "@/hooks/use-toast";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { contextualHaptic } from "@/utils/haptic";

/* ───────────────────────────────────────────────
   Toyota Design Tokens
──────────────────────────────────────────────── */
const TOYOTA_RED = "#EB0A1E";
const TOYOTA_GRADIENT =
  "linear-gradient(90deg, #EB0A1E 0%, #CC0000 50%, #8B0000 100%)";

const GR = {
  RED: "#EB0A1E",
  SURFACE: "#0B0B0C",
  EDGE: "#17191B",
  TEXT: "#E6E7E9",
  MUTED: "#9DA2A6",
  BG: {
    carbon: {
      backgroundImage:
        "url('/lovable-uploads/5dc5accb-0a25-49ca-a064-30844fa8836a.png')",
      backgroundSize: "280px 280px",
      backgroundRepeat: "repeat",
      backgroundPosition: "center",
      backgroundColor: "#0B0B0C",
    } as React.CSSProperties,
  },
};

const BTN_PRIMARY =
  "w-full py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-[#EB0A1E] to-[#B10D19] text-white shadow hover:from-[#FF2A3C] hover:to-[#D21320]";
const BTN_SECONDARY =
  "w-full py-3 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/70";
const BTN_GR =
  "w-full py-3 rounded-xl text-sm font-medium bg-[#111315] border border-[#17191B] text-[#E6E7E9] hover:bg-[#141618]";

/* ───────────────────────────────────────────────
   GR Mode Hook
──────────────────────────────────────────────── */
function useGRMode() {
  const initial = () => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("gr");
      if (p === "1" || p === "true") return true;
      const s = localStorage.getItem("toyota.grMode");
      if (s === "1" || s === "true") return true;
    }
    return false;
  };
  const [isGR, setIsGR] = useState<boolean>(initial);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("toyota.grMode", isGR ? "1" : "0");
    }
  }, [isGR]);
  return { isGR, toggleGR: () => setIsGR((v) => !v) };
}

/* ───────────────────────────────────────────────
   Props
──────────────────────────────────────────────── */
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

/* ───────────────────────────────────────────────
   Data
──────────────────────────────────────────────── */
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

/* ───────────────────────────────────────────────
   Component Start
──────────────────────────────────────────────── */
const MobileStickyNav: React.FC<MobileStickyNavProps> = ({
  activeItem = "home",
  vehicle,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
}) => {
  const deviceInfo = useOptimizedDeviceInfo();
  const { toast } = useToast();
  const navigationState = useNavigationState();
  const { isGR, toggleGR } = useGRMode();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([50000, 200000]);
  const [isScrolled, setIsScrolled] = useState(false);

  const fmt = useMemo(
    () => new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-AE"),
    []
  );

  /* Scroll shrink effect */
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setIsScrolled((prev) => (y > 100 ? true : y <= 70 ? false : prev));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Filters */
  const filteredVehicles = useMemo(
    () =>
      vehicles
        .filter((v) => selectedCategory === "all" || v.category.toLowerCase() === selectedCategory)
        .slice(0, 12),
    [selectedCategory]
  );
  const searchResults = useMemo(
    () =>
      vehicles.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8),
    [searchQuery]
  );
  const filteredPreOwnedVehicles = useMemo(
    () =>
      preOwnedVehicles.filter((v) => {
        const categoryMatch = selectedCategory === "all" || v.category === selectedCategory;
        const priceMatch = v.price >= priceRange[0] && v.price <= priceRange[1];
        return categoryMatch && priceMatch;
      }),
    [selectedCategory, priceRange]
  );

  /* Share + brochure */
  const handleShare = async () => {
    if (!vehicle) return;
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${vehicle.name} - Toyota UAE`,
          text: `Check out this ${vehicle.name} starting from AED ${fmt.format(vehicle.price)}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied", description: "Vehicle link copied." });
      }
    } catch {
      /* user cancelled */
    }
  };

  const handleBrochureDownload = () => {
    if (!vehicle) return;
    toast({ title: "Brochure Download", description: "Your brochure is being prepared..." });
    setTimeout(() => {
      toast({ title: "Download Complete", description: `${vehicle.name} brochure downloaded.` });
    }, 1500);
  };

  if (!(deviceInfo.isInitialized && deviceInfo.isMobile)) return null;

  return (
    <>
      {/* Overlay Backdrop */}
      <AnimatePresence>
        {(navigationState.isMenuOpen || navigationState.isActionsExpanded) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={navigationState.resetNavigation}
          />
        )}
      </AnimatePresence>

      {/* ───── Actions Sheet ───── */}
      <AnimatePresence>
        {navigationState.isActionsExpanded && vehicle && (
          <motion.div
            initial={{ y: 320, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 320, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={cn(
              "fixed left-4 right-4 bottom-24 z-50 rounded-2xl shadow-2xl border",
              "p-4",
              isGR
                ? "bg-[#0B0B0C]/95 border-[#17191B]"
                : "bg-white/95 border-gray-200/50 backdrop-blur-xl"
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={cn("font-bold text-lg", isGR ? "text-white" : "text-gray-900")}>
                  {vehicle.name}
                </h3>
                <span className={cn("text-lg font-semibold", isGR ? "text-red-400" : "text-toyota-red")}>
                  AED {fmt.format(vehicle.price)}
                </span>
              </div>
              <Button
                onClick={() => navigationState.setActionsExpanded(false)}
                variant="outline"
                size="sm"
                className={cn(
                  "p-2 rounded-full",
                  isGR
                    ? "border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                    : "border-gray-200 text-gray-600 hover:bg-gray-100"
                )}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            {/* Primary actions */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Button
                onClick={() => {
                  onBookTestDrive?.();
                  navigationState.setActionsExpanded(false);
                }}
                className={isGR ? BTN_GR : BTN_PRIMARY}
              >
                <Car className="h-4 w-4 mr-2" />
                Test Drive
              </Button>

              <Button
                onClick={() => {
                  onCarBuilder?.();
                  navigationState.setActionsExpanded(false);
                }}
                className={isGR ? BTN_GR : BTN_SECONDARY}
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>

            {/* Secondary actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button onClick={onFinanceCalculator} className={isGR ? BTN_GR : BTN_SECONDARY}>
                <Calculator className="h-4 w-4 mr-1" />
                Finance
              </Button>
              <Button onClick={handleBrochureDownload} className={isGR ? BTN_GR : BTN_SECONDARY}>
                <Download className="h-4 w-4 mr-1" />
                Brochure
              </Button>
              <Button onClick={handleShare} className={isGR ? BTN_GR : BTN_SECONDARY}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>

            {/* Footer */}
            <div className={cn("mt-4 pt-3 text-center text-xs", isGR ? "text-neutral-400" : "text-gray-500")}>
              From AED 899/month • Free delivery • 7-day return
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── Menu Sheet ───── */}
      <AnimatePresence>
        {navigationState.isMenuOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className={cn(
              "fixed bottom-16 left-0 right-0 rounded-t-3xl shadow-2xl z-50 overflow-hidden border-t",
              "max-h-[80vh]",
              isGR ? "bg-[#0B0B0C] border-[#17191B]" : "bg-white border-t-4 border-red-600"
            )}
            role="dialog"
            aria-modal="true"
          >
            {/* Menu Header */}
            <div
              className={cn(
                "flex items-center justify-between p-4 border-b",
                isGR ? "border-[#17191B]" : "border-gray-200"
              )}
            >
              <div>
                <h3 className={cn("font-bold text-lg tracking-wide", isGR ? "text-white" : "text-black")}>
                  Toyota Connect
                </h3>
                <p className={cn("text-sm", isGR ? "text-neutral-400" : "text-red-600")}>
                  {isGR ? "GR Performance Hub" : "Your gateway to Toyota"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* GR toggle */}
                <button
                  type="button"
                  onClick={toggleGR}
                  aria-pressed={isGR}
                  className={cn(
                    "h-8 rounded-full px-3 text-xs font-semibold transition-colors",
                    isGR
                      ? "bg-[#1a1c1f] text-white border border-[#17191B]"
                      : "bg-gray-200 text-gray-800"
                  )}
                >
                  GR
                </button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigationState.resetNavigation}
                  className={cn(
                    "rounded-full h-8 w-8 p-0",
                    isGR ? "text-white hover:bg-[#16181A]" : "text-red-600 hover:bg-red-100"
                  )}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* ───── Menu Body ───── */}
            <div className="overflow-y-auto max-h-[calc(75vh-100px)] scrollbar-hide">
              {/* Quick Actions */}
              {navigationState.activeSection === "quick-actions" && (
                <motion.div
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-900")}>
                    Quick Actions
                  </h4>
                  <Carousel opts={{ align: "start" }} className="w-full mb-6">
                    <CarouselContent>
                      {[
                        { id: "test-drive", title: "Book a Test Drive", description: "Experience Toyota", icon: <Car className="h-5 w-5" />, link: "/test-drive" },
                        { id: "offers", title: "Latest Offers", description: "Discover deals", icon: <Star className="h-5 w-5" />, link: "/offers" },
                        { id: "service", title: "Service Booking", description: "Keep it Toyota", icon: <Settings className="h-5 w-5" />, link: "/service" },
                      ].map((card) => (
                        <CarouselItem key={card.id} className="pl-4 basis-2/3">
                          <Link
                            to={card.link}
                            onClick={navigationState.resetNavigation}
                            aria-label={card.title}
                            className="block rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-700"
                          >
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={cn(
                                "h-32 rounded-2xl shadow-lg overflow-hidden",
                                isGR ? "bg-[#0B0B0C] border border-[#17191B]" : "bg-gradient-to-r from-[#EB0A1E] to-[#8B0000]"
                              )}
                            >
                              <div className="flex flex-col justify-between h-full p-4 text-white">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="font-semibold text-base">{card.title}</h3>
                                    <p className="text-xs opacity-90">{card.description}</p>
                                  </div>
                                  {card.icon}
                                </div>
                                <div className="flex justify-end">
                                  <ChevronRight className="h-4 w-4 opacity-80" />
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </motion.div>
              )}

              {/* Browse Models */}
              {navigationState.activeSection === "models" && (
                <motion.div className="p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-900")}>Browse Models</h4>
                  <Carousel opts={{ align: "start" }} className="w-full mb-6">
                    <CarouselContent>
                      {vehicleCategories.map((category) => (
                        <CarouselItem key={category.id} className="basis-auto pl-3">
                          <button
                            onClick={() => setSelectedCategory(category.id)}
                            aria-pressed={selectedCategory === category.id}
                            className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-xl transition-all min-w-[80px]",
                              selectedCategory === category.id
                                ? isGR
                                  ? "bg-[#141618] border border-red-700"
                                  : "bg-gradient-to-r from-[#EB0A1E] to-[#8B0000] text-white"
                                : isGR
                                ? "bg-[#101214] border border-[#17191B] text-neutral-300"
                                : "bg-gray-100 text-gray-800"
                            )}
                          >
                            {category.icon}
                            <span className="mt-2 text-xs font-medium">{category.name}</span>
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                  <Carousel opts={{ align: "start" }}>
                    <CarouselContent>
                      {filteredVehicles.map((v) => (
                        <CarouselItem key={v.name} className="basis-2/3 pl-4">
                          <Link
                            to={`/vehicle/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`}
                            onClick={navigationState.resetNavigation}
                            aria-label={`View ${v.name}`}
                            className="block rounded-xl overflow-hidden shadow-md"
                          >
                            {isGR ? (
                              <div className="rounded-2xl border border-[#17191B] bg-[#0B0B0C]">
                                <img src={v.image} alt={v.name} className="w-full h-40 object-cover" />
                                <div className="p-4 text-white">
                                  <h3 className="font-semibold">{v.name}</h3>
                                  <p className="text-sm text-neutral-400">From AED {fmt.format(v.price)}</p>
                                </div>
                              </div>
                            ) : (
                              <Card className="overflow-hidden border-0 shadow-lg">
                                <img src={v.image} alt={v.name} className="w-full h-40 object-cover" />
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-gray-900">{v.name}</h3>
                                  <p className="text-sm text-gray-500">From AED {fmt.format(v.price)}</p>
                                </CardContent>
                              </Card>
                            )}
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </motion.div>
              )}

              {/* Search */}
              {navigationState.activeSection === "search" && (
                <motion.div className="p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-900")}>Find Your Toyota</h4>
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search models, features..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2",
                        isGR
                          ? "bg-[#0B0B0C] border-[#17191B] text-white placeholder:text-neutral-500"
                          : "bg-white border-gray-200 text-gray-900"
                      )}
                    />
                  </div>
                  {searchQuery ? (
                    <div className="space-y-3">
                      {searchResults.map((v) => (
                        <Link
                          key={v.name}
                          to={`/vehicle/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`}
                          className="block rounded-xl overflow-hidden shadow-sm"
                          onClick={navigationState.resetNavigation}
                        >
                          {isGR ? (
                            <div className="flex items-center bg-[#0B0B0C] border border-[#17191B] rounded-xl p-3">
                              <img src={v.image} alt={v.name} className="h-16 w-24 object-cover rounded-md mr-3" />
                              <div className="flex-1">
                                <h3 className="text-white font-medium">{v.name}</h3>
                                <p className="text-xs text-neutral-400">AED {fmt.format(v.price)}</p>
                              </div>
                            </div>
                          ) : (
                            <Card className="p-3 flex items-center">
                              <img src={v.image} alt={v.name} className="h-16 w-24 object-cover rounded-md mr-3" />
                              <div>
                                <h3 className="text-gray-900 font-medium">{v.name}</h3>
                                <p className="text-xs text-gray-500">AED {fmt.format(v.price)}</p>
                              </div>
                            </Card>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {searchSuggestions.map((s) => (
                        <button
                          key={s.term}
                          onClick={() => setSearchQuery(s.term)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm",
                            isGR
                              ? "bg-[#0B0B0C] border border-[#17191B] text-white"
                              : "bg-gray-100 text-gray-800"
                          )}
                        >
                          {s.term}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Pre-Owned */}
              {navigationState.activeSection === "pre-owned" && (
                <motion.div className="p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-900")}>Pre-Owned Vehicles</h4>
                  <Carousel opts={{ align: "start" }}>
                    <CarouselContent>
                      {filteredPreOwnedVehicles.map((v) => (
                        <CarouselItem key={v.name} className="basis-2/3 pl-4">
                          <Link
                            to={`/pre-owned/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`}
                            onClick={navigationState.resetNavigation}
                            className="block rounded-xl overflow-hidden shadow-md"
                          >
                            {isGR ? (
                              <div className="bg-[#0B0B0C] border border-[#17191B] rounded-2xl">
                                <img src={v.image} alt={v.name} className="w-full h-40 object-cover" />
                                <div className="p-4 text-white">
                                  <h3 className="font-semibold">{v.name}</h3>
                                  <p className="text-sm text-red-400">AED {fmt.format(v.price)}</p>
                                  <p className="text-xs text-neutral-400">{v.mileage}</p>
                                </div>
                              </div>
                            ) : (
                              <Card className="overflow-hidden border-0 shadow-md">
                                <img src={v.image} alt={v.name} className="w-full h-40 object-cover" />
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-gray-900">{v.name}</h3>
                                  <p className="text-sm text-toyota-red">AED {fmt.format(v.price)}</p>
                                  <p className="text-xs text-gray-500">{v.mileage}</p>
                                </CardContent>
                              </Card>
                            )}
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───── Bottom Nav ───── */}
      <motion.nav
        role="navigation"
        aria-label="Primary"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-xl border-t",
          isGR
            ? "bg-[#0B0B0C]/95 border-[#17191B] shadow-[0_-6px_30px_rgba(0,0,0,.5)]"
            : "bg-white/90 border-gray-200 shadow-[0_-6px_30px_rgba(0,0,0,.15)]"
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div className={cn("grid gap-1 px-2 items-center", vehicle ? "grid-cols-5" : "grid-cols-4")}>
          <NavItem icon={<Car className="h-5 w-5" />} label="Models" onClick={() => navigationState.setActiveSection("models")} isActive={navigationState.activeSection === "models"} grMode={isGR} />
          <NavItem icon={<ShoppingBag className="h-5 w-5" />} label="Pre-Owned" onClick={() => navigationState.setActiveSection("pre-owned")} isActive={navigationState.activeSection === "pre-owned"} grMode={isGR} />
          {vehicle && (
            <NavItem icon={<Bolt className="h-5 w-5 text-white" />} label="Actions" onClick={() => navigationState.setActionsExpanded(!navigationState.isActionsExpanded)} isActive={navigationState.isActionsExpanded} grMode={isGR} highlight />
          )}
          <NavItem icon={<Search className="h-5 w-5" />} label="Search" onClick={() => navigationState.setActiveSection("search")} isActive={navigationState.activeSection === "search"} grMode={isGR} />
          <NavItem icon={<Menu className="h-5 w-5 text-red-600" />} label="Menu" onClick={() => navigationState.setMenuOpen(true)} isActive={navigationState.isMenuOpen} grMode={isGR} />
        </div>
      </motion.nav>
    </>
  );
};

/* ─────────── NavItem Component ─────────── */
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  grMode?: boolean;
  highlight?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, onClick, isActive = false, grMode = false, highlight = false }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center py-2 rounded-lg transition-all",
        grMode ? (isActive ? "bg-[#141618] text-red-400" : "text-neutral-300 hover:bg-[#101214]") : isActive ? "text-toyota-red bg-red-50" : "text-gray-600 hover:text-gray-900"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center h-10 w-10 rounded-full transition-all",
          highlight ? (grMode ? "bg-[#1D1F22] border border-[#17191B]" : "bg-toyota-red text-white") : ""
        )}
      >
        {icon}
      </div>
      <span className="text-xs font-medium mt-1">{label}</span>
    </button>
  );
};

export default MobileStickyNav;
