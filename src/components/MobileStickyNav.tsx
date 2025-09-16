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
  Shield,
  MessageSquare,
  User,
  Wrench,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useOptimizedDeviceInfo } from "@/hooks/use-optimized-device-info";
import { useNavigationState } from "@/hooks/use-navigation-state";
import { useToast } from "@/hooks/use-toast";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { contextualHaptic } from "@/utils/haptic";

/* ───────────────────────────────────────────────
   Toyota / GR Design Tokens
──────────────────────────────────────────────── */
const TOYOTA_RED = "#EB0A1E";
const TOYOTA_RED_DEEP = "#CC0000";
const TOYOTA_GRADIENT = "linear-gradient(90deg, #EB0A1E, #CC0000, #8B0000)";

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
} as const;

const BTN_PRIMARY =
  "w-full py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-[#EB0A1E] to-[#B10D19] text-white shadow hover:from-[#FF2A3C] hover:to-[#D21320] focus-visible:ring-2 focus-visible:ring-red-600";
const BTN_SECONDARY =
  "w-full py-3 rounded-xl text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white/70 focus-visible:ring-2 focus-visible:ring-red-600";
const BTN_GR =
  "w-full py-3 rounded-xl text-sm font-medium bg-[#111315] border border-[#17191B] text-[#E6E7E9] hover:bg-[#141618] focus-visible:ring-2 focus-visible:ring-red-700";

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
  const toggleGR = () => setIsGR((v) => !v);
  return { isGR, toggleGR };
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
   Static UI Data
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
   Utility
──────────────────────────────────────────────── */
const fmtCurrency = (value: number, locale = "en-AE") =>
  new Intl.NumberFormat(locale).format(value);

/* ───────────────────────────────────────────────
   Component
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

  // UI State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([50000, 200000]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userTouchedCategory, setUserTouchedCategory] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(!!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // GR preset for category
  useEffect(() => {
    if (isGR && !userTouchedCategory) setSelectedCategory("performance");
  }, [isGR, userTouchedCategory]);

  // Currency formatter
  const fmt = useMemo(
    () => new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-AE"),
    []
  );

  /* Scroll shrink */
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const threshold = 100;
      setIsScrolled((prev) => (y > threshold ? true : y <= threshold * 0.7 ? false : prev));
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

  /* Handlers */
  const handleCategoryClick = (id: string) => {
    contextualHaptic.buttonPress();
    setSelectedCategory(id);
    setUserTouchedCategory(true);
  };

  const handleShare = async () => {
    if (!vehicle) return;
    contextualHaptic.buttonPress();
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${vehicle.name} - Toyota UAE`,
          text: `Check out this ${vehicle.name} starting from AED ${fmt.format(vehicle.price)}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Link Copied", description: "Vehicle link copied to clipboard." });
      }
    } catch {/* user cancelled */}
  };

  const handleBrochureDownload = () => {
    if (!vehicle) return;
    contextualHaptic.buttonPress();
    toast({ title: "Brochure Download", description: "Your brochure is being prepared..." });
    setTimeout(() => {
      toast({ title: "Download Complete", description: `${vehicle.name} brochure downloaded.` });
    }, 1500);
  };

  const shouldShowNav = deviceInfo.isInitialized && deviceInfo.isMobile;

  const spring = isGR
    ? { type: "spring", stiffness: 420, damping: 28, mass: 0.7 }
    : { type: "spring", stiffness: 260, damping: 20 };

  /* Attract animation + coachmark */
  const [attractOn, setAttractOn] = useState(false);
  const [showCoachmark, setShowCoachmark] = useState(false);
  const [attractCycles, setAttractCycles] = useState(0);

  useEffect(() => {
    if (!deviceInfo.isInitialized || !deviceInfo.isMobile) return;
    if (reduceMotion) return;
    if (navigationState.isActionsExpanded || navigationState.isMenuOpen) return;

    let idleTimer: number | null = null;
    let cycleTimer: number | null = null;
    let interacted = false;

    const reset = () => {
      interacted = true;
      setAttractOn(false);
      setShowCoachmark(false);
      setAttractCycles(0);
      if (idleTimer) window.clearTimeout(idleTimer);
      if (cycleTimer) window.clearInterval(cycleTimer);
    };

    const kickOff = () => {
      if (interacted) return;
      setShowCoachmark(true);
      setAttractOn(true);
      setAttractCycles(1);

      cycleTimer = window.setInterval(() => {
        setAttractCycles((c) => {
          const next = c + 1;
          if (next >= 3) {
            if (cycleTimer) window.clearInterval(cycleTimer);
            setAttractOn(false);
            setShowCoachmark(false);
          } else {
            setAttractOn(false);
            requestAnimationFrame(() => setAttractOn(true));
          }
          return next;
        });
      }, 4000);
    };

    const arm = () => {
      if (idleTimer) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(kickOff, 6000);
    };

    const onUserInteract = () => reset();
    const onScroll = () => reset();

    window.addEventListener("pointerdown", onUserInteract, { passive: true });
    window.addEventListener("keydown", onUserInteract);
    window.addEventListener("scroll", onScroll, { passive: true });

    arm();

    return () => {
      window.removeEventListener("pointerdown", onUserInteract);
      window.removeEventListener("keydown", onUserInteract);
      window.removeEventListener("scroll", onScroll);
      if (idleTimer) window.clearTimeout(idleTimer);
      if (cycleTimer) window.clearInterval(cycleTimer);
    };
  }, [
    deviceInfo.isInitialized,
    deviceInfo.isMobile,
    reduceMotion,
    navigationState.isActionsExpanded,
    navigationState.isMenuOpen,
  ]);

  const coachVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 18 } },
    exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.15 } },
  };

  const attractVariants = {
    rest: { scale: 1, rotate: 0, filter: "drop-shadow(0 0 0 rgba(235,10,30,0))" },
    attract: reduceMotion
      ? { scale: 1, rotate: 0, filter: "drop-shadow(0 0 0 rgba(235,10,30,0))" }
      : {
          scale: [1, 1.06, 1],
          rotate: [0, -4, 4, 0],
          filter: [
            "drop-shadow(0 0 0 rgba(235,10,30,0))",
            "drop-shadow(0 6px 12px rgba(235,10,30,.35))",
            "drop-shadow(0 0 0 rgba(235,10,30,0))",
          ],
          transition: { duration: 0.9, times: [0, 0.5, 1], ease: "easeInOut" },
        },
  };

  const pulseVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: reduceMotion
      ? { opacity: 0, scale: 0.8 }
      : {
          opacity: [0, 0.8, 0],
          scale: [1, 1.6, 2],
          transition: { duration: 1.2, times: [0, 0.5, 1], ease: "easeInOut" },
        },
  };

  /* Early return AFTER hooks */
  if (!shouldShowNav) return null;

  return (
    <>
      {/* Backdrop for overlays */}
      <AnimatePresence>
        {(navigationState.isMenuOpen || navigationState.isActionsExpanded) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={navigationState.resetNavigation}
          />
        )}
      </AnimatePresence>

      {/* Actions sheet */}
      <AnimatePresence>
        {navigationState.isActionsExpanded && vehicle && (
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={spring}
            className={cn(
              "fixed left-4 right-4 bottom-24 z-50 rounded-2xl shadow-2xl border p-4",
              isGR ? "" : "bg-white/95 backdrop-blur-xl border-gray-200/50"
            )}
            style={isGR ? GR.BG.carbon : undefined}
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={cn("font-bold", isGR ? "text-white" : "text-gray-900")}>
                  {vehicle.name}
                </h3>
                <span className={cn("text-lg font-bold", isGR ? "text-red-400" : "text-primary")}>
                  AED {fmt.format(vehicle.price)}
                </span>
              </div>
              <Button
                onClick={() => navigationState.setActionsExpanded(false)}
                variant="outline"
                size="sm"
                className={cn(
                  "p-2 rounded-full",
                  isGR ? "border-neutral-700 text-neutral-200 hover:bg-neutral-800" : "border-gray-200 text-gray-600 hover:bg-gray-100"
                )}
                aria-label="Collapse actions"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

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

            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() => {
                  onFinanceCalculator?.();
                  navigationState.setActionsExpanded(false);
                }}
                variant="outline"
                className={cn("w-full py-2 rounded-lg text-xs", isGR ? BTN_GR : BTN_SECONDARY)}
                aria-label="Finance calculator"
              >
                <Calculator className="h-4 w-4 mb-1" />
                Finance
              </Button>

              <Button
                onClick={() => {
                  handleBrochureDownload();
                  navigationState.setActionsExpanded(false);
                }}
                variant="outline"
                className={cn("w-full py-2 rounded-lg text-xs", isGR ? BTN_GR : BTN_SECONDARY)}
                aria-label="Download brochure"
              >
                <Download className="h-4 w-4 mb-1" />
                Brochure
              </Button>

              <Button
                onClick={() => {
                  handleShare();
                  navigationState.setActionsExpanded(false);
                }}
                variant="outline"
                className={cn("w-full py-2 rounded-lg text-xs", isGR ? BTN_GR : BTN_SECONDARY)}
                aria-label="Share"
              >
                <Share2 className="h-4 w-4 mb-1" />
                Share
              </Button>
            </div>

            <div className={cn("mt-4 pt-3 border-t text-center text-xs", isGR ? "border-neutral-800 text-neutral-400" : "border-gray-200 text-gray-500")}>
              From AED 899/month • Free delivery • 7-day return
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu Sheet */}
      <AnimatePresence>
        {navigationState.isMenuOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            className={cn(
              "fixed bottom-16 left-0 right-0 rounded-t-3xl shadow-2xl z-50 overflow-hidden border-t",
              "max-h-[80vh]",
              isGR ? "border-[1px]" : "border-t-4"
            )}
            style={isGR ? GR.BG.carbon : { backgroundColor: "white", borderImage: `${TOYOTA_GRADIENT} 1` }}
            role="dialog"
            aria-modal="true"
            aria-label="Toyota Connect menu"
          >
            <div className="flex items-center justify-between p-4 border-b" style={isGR ? { borderColor: GR.EDGE } : undefined}>
              <div>
                <h3 className={cn("font-bold text-lg", isGR ? "text-white" : "text-black")} style={{ letterSpacing: ".02em" }}>
                  Toyota Connect
                </h3>
                <p className={cn("text-sm", isGR ? "text-neutral-300" : "text-red-600")}>
                  {isGR ? "GR Performance Hub" : "Your gateway to Toyota"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleGR}
                  aria-pressed={isGR}
                  aria-label="Toggle GR performance mode"
                  className={cn(
                    "inline-flex items-center h-8 rounded-full px-3 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2",
                    isGR
                      ? "bg-[#1a1c1f] text-[#E6E7E9] hover:bg-[#16181A] focus-visible:ring-red-700"
                      : "bg-gray-200/70 text-gray-800"
                  )}
                  title="GR Mode"
                >
                  GR
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={navigationState.resetNavigation}
                  className={cn("rounded-full h-8 w-8 p-0", isGR ? "text-[#E6E7E9] hover:bg-[#16181A]" : "text-red-600 hover:bg-red-100")}
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Toyota Connect Content */}
            <div className="overflow-y-auto max-h-[calc(75vh-100px)] scrollbar-hide">
              {/* Quick Actions */}
              <section className="p-6">
                <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-900")}>
                  Quick Actions
                </h4>
                <Carousel opts={{ align: "start" }} className="w-full mb-6">
                  <CarouselContent>
                    {[
                      { id: "test-drive", title: "Book Test Drive", icon: <Car className="h-7 w-7" />, link: "/test-drive", description: "Experience Toyota firsthand" },
                      { id: "offers", title: "Latest Offers", icon: <ShoppingBag className="h-7 w-7" />, link: "/offers", description: "Exclusive deals available" },
                      { id: "configure", title: "Build & Price", icon: <Settings className="h-7 w-7" />, link: "/configure", description: "Customize your Toyota" },
                      { id: "service", title: "Service Booking", icon: <Wrench className="h-7 w-7" />, link: "/service", description: "Professional maintenance" },
                    ].map((card) => (
                      <CarouselItem key={card.id} className="pl-4 basis-2/3">
                        <Link
                          to={card.link}
                          onClick={navigationState.resetNavigation}
                          aria-label={card.title}
                          className="block rounded-xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-700"
                        >
                          <motion.div
                            whileHover={reduceMotion ? {} : { scale: 1.02 }}
                            whileTap={reduceMotion ? {} : { scale: 0.98 }}
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

                {/* Toyota Connect Grids */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "New Vehicles", icon: <Car className="h-5 w-5" />, action: () => navigationState.setActiveSection("models") },
                    { title: "Pre‑Owned", icon: <ShoppingBag className="h-5 w-5" />, action: () => navigationState.setActiveSection("pre-owned") },
                    { title: "Offers", icon: <Star className="h-5 w-5" />, link: "/offers" },
                    { title: "Finance Calculator", icon: <Calculator className="h-5 w-5" />, action: () => { onFinanceCalculator?.(); navigationState.resetNavigation(); } },
                    { title: "Trade‑In", icon: <Shield className="h-5 w-5" />, link: "/trade-in" },
                    { title: "Download Brochure", icon: <Download className="h-5 w-5" />, action: () => { handleBrochureDownload(); navigationState.resetNavigation(); } },
                    { title: "Service & Maintenance", icon: <Wrench className="h-5 w-5" />, link: "/service" },
                    { title: "Contact Us", icon: <Phone className="h-5 w-5" />, link: "/contact" },
                    { title: "Toyota Blue App", icon: <ExternalLink className="h-5 w-5" />, link: "/app" },
                    { title: "Find a Showroom", icon: <MapPin className="h-5 w-5" />, link: "/showrooms" },
                  ].map((item, idx) => (
                    <div key={idx}>
                      {item.link ? (
                        <Link
                          to={item.link}
                          onClick={navigationState.resetNavigation}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl transition-colors",
                            isGR ? "border border-[#17191B] bg-[#0B0B0C] text-[#E6E7E9] hover:bg-[#121416]" : "bg-gray-50 hover:bg-gray-100"
                          )}
                        >
                          {item.icon}
                          <span className={cn("text-sm font-medium", isGR ? "text-[#E6E7E9]" : "text-gray-900")}>
                            {item.title}
                          </span>
                        </Link>
                      ) : (
                        <button
                          onClick={item.action}
                          className={cn(
                            "w-full flex items-center gap-3 p-4 rounded-xl transition-colors",
                            isGR ? "border border-[#17191B] bg-[#0B0B0C] text-[#E6E7E9] hover:bg-[#121416]" : "bg-gray-50 hover:bg-gray-100"
                          )}
                        >
                          {item.icon}
                          <span className={cn("text-sm font-medium", isGR ? "text-[#E6E7E9]" : "text-gray-900")}>
                            {item.title}
                          </span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Browse Models */}
              {navigationState.activeSection === "models" && (
                <motion.section
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-900")}>
                    Browse Models
                  </h4>

                  {/* Body Type Filter Chips */}
                  <Carousel opts={{ align: "start" }} className="w-full mb-6">
                    <CarouselContent>
                      {vehicleCategories.map((category) => (
                        <CarouselItem key={category.id} className="basis-auto pl-3">
                          <button
                            onClick={() => handleCategoryClick(category.id)}
                            className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-xl transition-all min-w-[80px]",
                              selectedCategory === category.id
                                ? isGR
                                  ? "bg-[#141618] border border-red-700 text-[#E6E7E9]"
                                  : "text-white"
                                : isGR
                                ? "bg-[#101214] border border-[#17191B] text-neutral-300"
                                : "bg-gray-100 text-gray-800"
                            )}
                            style={
                              selectedCategory === category.id && !isGR
                                ? { background: TOYOTA_GRADIENT }
                                : undefined
                            }
                            aria-pressed={selectedCategory === category.id}
                            aria-label={`Filter ${category.name}`}
                          >
                            {category.icon}
                            <span className="mt-2 text-xs font-medium">{category.name}</span>
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  {/* Models Carousel */}
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
                                <div className="aspect-[16/10] w-full relative" style={GR.BG.carbon as React.CSSProperties}>
                                  {v.image && (
                                    <img src={v.image} alt={v.name} className="w-full h-full object-cover mix-blend-screen opacity-90" />
                                  )}
                                </div>
                                <div className="p-4 text-white">
                                  <h3 className="font-semibold">{v.name}</h3>
                                  <p className="text-sm text-neutral-400">From AED {fmt.format(v.price)}</p>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: "#15171A", border: `1px solid ${GR.EDGE}`, color: GR.MUTED }}>
                                      {v.category}
                                    </span>
                                    <span className="text-sm font-semibold flex items-center" style={{ color: GR.RED }}>
                                      View <ChevronRight className="h-3 w-3 ml-1" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <Card className="overflow-hidden border-0 shadow-lg bg-white/70 backdrop-blur-xl">
                                <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200">
                                  {v.image && <img src={v.image} alt={v.name} className="w-full h-full object-cover" />}
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-gray-900">{v.name}</h3>
                                  <p className="text-sm text-gray-500">From AED {fmt.format(v.price)}</p>
                                  <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs bg-red-100 text-[#CC0000] px-2 py-1 rounded-full font-medium">{v.category}</span>
                                    <span className="text-[#CC0000] text-sm font-semibold flex items-center">
                                      View <ChevronRight className="h-3 w-3 ml-1" />
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  {/* View All */}
                  <div className="mt-6 text-center">
                    <Link
                      to={`/new-cars${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
                      className={cn("font-semibold flex items-center justify-center rounded-lg", isGR ? "text-red-400 hover:text-red-300" : "text-[#CC0000] hover:text-red-700")}
                      onClick={navigationState.resetNavigation}
                    >
                      View All{" "}
                      {selectedCategory !== "all" ? vehicleCategories.find((c) => c.id === selectedCategory)?.name : ""}{" "}
                      Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.section>
              )}

              {/* Search */}
              {navigationState.activeSection === "search" && (
                <motion.section
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-900")}>
                    Find Your Toyota
                  </h4>

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
                          : "border-gray-200 focus:ring-[#CC0000]"
                      )}
                      aria-label="Search vehicles"
                    />
                  </div>

                  {searchQuery ? (
                    <div className="space-y-3">
                      {searchResults.map((v) => (
                        <Link
                          key={v.name}
                          to={`/vehicle/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`}
                          onClick={navigationState.resetNavigation}
                          className="block rounded-xl overflow-hidden shadow-sm"
                          aria-label={`View ${v.name}`}
                        >
                          {isGR ? (
                            <div className="flex items-center bg-[#0B0B0C] border border-[#17191B] rounded-xl p-3">
                              <img src={v.image} alt={v.name} className="h-16 w-24 object-cover rounded-md mr-3" />
                              <div className="flex-1">
                                <h3 className="text-white font-medium">{v.name}</h3>
                                <p className="text-xs text-neutral-400">AED {fmt.format(v.price)}</p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                            </div>
                          ) : (
                            <Card className="p-3 flex items-center">
                              <img src={v.image} alt={v.name} className="h-16 w-24 object-cover rounded-md mr-3" />
                              <div className="flex-1">
                                <h3 className="text-gray-900 font-medium">{v.name}</h3>
                                <p className="text-xs text-gray-500">AED {fmt.format(v.price)}</p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
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
                            "px-4 py-2 rounded-full text-sm transition-colors",
                            isGR
                              ? "border border-[#17191B] bg-[#0B0B0C] text-[#E6E7E9] hover:bg-[#121416]"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          )}
                          aria-label={`Search ${s.term}`}
                        >
                          {s.term}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.section>
              )}

              {/* Pre‑Owned */}
              {navigationState.activeSection === "pre-owned" && (
                <motion.section
                  className="p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <h4 className={cn("text-lg font-semibold mb-4", isGR ? "text-neutral-200" : "text-gray-900")}>
                    Pre‑Owned Vehicles
                  </h4>

                  {/* Category Filter Chips */}
                  <Carousel opts={{ align: "start" }} className="w-full mb-6">
                    <CarouselContent>
                      {vehicleCategories.map((category) => (
                        <CarouselItem key={category.id} className="basis-auto pl-3">
                          <button
                            onClick={() => handleCategoryClick(category.id)}
                            className={cn(
                              "flex flex-col items-center justify-center p-4 rounded-xl transition-all min-w-[80px]",
                              selectedCategory === category.id
                                ? isGR
                                  ? "bg-[#141618] border border-red-700 text-[#E6E7E9]"
                                  : "text-white"
                                : isGR
                                ? "bg-[#101214] border border-[#17191B] text-neutral-300"
                                : "bg-gray-100 text-gray-800"
                            )}
                            style={
                              selectedCategory === category.id && !isGR
                                ? { background: TOYOTA_GRADIENT }
                                : undefined
                            }
                            aria-pressed={selectedCategory === category.id}
                            aria-label={`Filter ${category.name}`}
                          >
                            {category.icon}
                            <span className="mt-2 text-xs font-medium">{category.name}</span>
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  {/* Price Range */}
                  <div className={cn("mb-6 p-4 rounded-xl", isGR ? "border" : "bg-gray-50")} style={isGR ? { ...(GR.BG.carbon as React.CSSProperties), borderColor: GR.EDGE } : undefined}>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className={cn("text-sm font-medium", isGR ? "text-neutral-200" : "text-gray-700")}>
                        Price Range
                      </h5>
                      <span className={cn("text-sm", isGR ? "text-neutral-400" : "text-gray-500")}>
                        AED {fmt.format(priceRange[0])} - AED {fmt.format(priceRange[1])}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sliders className="h-5 w-5" style={{ color: isGR ? GR.RED : TOYOTA_RED_DEEP }} />
                      <input
                        type="range"
                        min={30000}
                        max={300000}
                        step={10000}
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value, 10), priceRange[1]), priceRange[1]])}
                        className={cn("flex-1 h-2 rounded-lg appearance-none cursor-pointer", isGR ? "bg-neutral-800" : "bg-gray-200")}
                        aria-label="Minimum price"
                      />
                      <input
                        type="range"
                        min={30000}
                        max={300000}
                        step={10000}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value, 10), priceRange[0])])}
                        className={cn("flex-1 h-2 rounded-lg appearance-none cursor-pointer", isGR ? "bg-neutral-800" : "bg-gray-200")}
                        aria-label="Maximum price"
                      />
                    </div>
                  </div>

                  {/* Pre‑Owned Carousel */}
                  <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent>
                      {filteredPreOwnedVehicles.map((v) => (
                        <CarouselItem key={v.name} className="basis-2/3 pl-4">
                          <Link
                            to={`/pre-owned/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`}
                            onClick={navigationState.resetNavigation}
                            aria-label={`View ${v.name}`}
                            className="block rounded-xl overflow-hidden shadow-md"
                          >
                            {isGR ? (
                              <div className="overflow-hidden rounded-2xl border" style={{ ...(GR.BG.carbon as React.CSSProperties), borderColor: GR.EDGE }}>
                                <div className="aspect-[16/10] w-full relative" style={GR.BG.carbon as React.CSSProperties}>
                                  <img src={v.image} alt={v.name} className="w-full h-full object-cover mix-blend-screen opacity-90" />
                                  <div className="absolute top-2 right-2">
                                    <span className="text-white px-2 py-1 rounded-full text-xs font-medium shadow-md" style={{ backgroundColor: "#1a1c1f", border: `1px solid ${GR.EDGE}` }}>
                                      {v.year}
                                    </span>
                                  </div>
                                </div>
                                <div className="p-4">
                                  <h3 className="font-semibold text-base mb-1" style={{ color: GR.TEXT }}>
                                    {v.name}
                                  </h3>
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-bold" style={{ color: GR.RED }}>
                                      AED {fmt.format(v.price)}
                                    </p>
                                    <p className="text-xs" style={{ color: GR.MUTED }}>
                                      {v.mileage}
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: "#15171A", border: `1px solid ${GR.EDGE}`, color: GR.MUTED }}>
                                      Certified Pre‑Owned
                                    </span>
                                    <span className="text-sm font-semibold flex items-center" style={{ color: GR.RED }}>
                                      View <ChevronRight className="h-3 w-3 ml-1" />
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <Card className="overflow-hidden border-0 shadow-lg bg-white/70 backdrop-blur-xl">
                                <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200 relative">
                                  <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                                  <div className="absolute top-2 right-2">
                                    <span className="text-white px-2 py-1 rounded-full text-xs font-medium shadow-md" style={{ background: TOYOTA_GRADIENT }}>
                                      {v.year}
                                    </span>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-gray-900">{v.name}</h3>
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-bold text-[#CC0000]">AED {fmt.format(v.price)}</p>
                                    <p className="text-xs text-gray-500">{v.mileage}</p>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs bg-red-100 text-[#CC0000] px-2 py-1 rounded-full font-medium">Certified Pre‑Owned</span>
                                    <span className="text-[#CC0000] text-sm font-semibold flex items-center">
                                      View <ChevronRight className="h-3 w-3 ml-1" />
                                    </span>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  <div className="mt-6 text-center">
                    <Link
                      to={`/pre-owned${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
                      className={cn("font-semibold flex items-center justify-center rounded-lg", isGR ? "text-red-400 hover:text-red-300" : "text-[#CC0000] hover:text-red-700")}
                      onClick={navigationState.resetNavigation}
                    >
                      View All Pre‑Owned{" "}
                      {selectedCategory !== "all" ? vehicleCategories.find((c) => c.id === selectedCategory)?.name : ""}{" "}
                      Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.section>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav with ATTRACT on Actions */}
      <motion.nav
        role="navigation"
        aria-label="Primary"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] backdrop-blur-xl border-t",
          isGR ? "" : "bg-white/90 border-gray-200 shadow-[0_-6px_30px_rgba(0,0,0,.15)]",
          "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          height: "auto",
          paddingTop: deviceInfo.deviceCategory === "smallMobile" ? "0.125rem" : "0.25rem",
          paddingBottom: deviceInfo.deviceCategory === "smallMobile" ? "0.125rem" : "0.25rem",
        }}
        transition={spring}
        style={
          isGR ? { ...(GR.BG.carbon as React.CSSProperties), borderColor: GR.EDGE, boxShadow: "0 -12px 30px rgba(0,0,0,.45)" } : undefined
        }
      >
        <div className={cn("grid gap-1 px-2 items-center", vehicle ? "grid-cols-5" : "grid-cols-4")}>
          <NavItem
            icon={<Car className={cn(isGR ? "text-neutral-100" : "", "transition-all", "h-5 w-5")} />}
            label="Models"
            to="#"
            onClick={() => navigationState.setActiveSection("models")}
            isActive={activeItem === "models" || navigationState.activeSection === "models"}
            isScrolled={isScrolled}
            grMode={isGR}
          />
          <NavItem
            icon={<ShoppingBag className={cn(isGR ? "text-neutral-100" : "", "transition-all", "h-5 w-5")} />}
            label="Pre‑Owned"
            to="#"
            onClick={() => navigationState.setActiveSection("pre-owned")}
            isActive={activeItem === "pre-owned" || navigationState.activeSection === "pre-owned"}
            isScrolled={isScrolled}
            grMode={isGR}
          />

          {/* ACTIONS with attract animation + coachmark */}
          {vehicle && (
            <div className="relative">
              {/* Coachmark */}
              <AnimatePresence>
                {showCoachmark && !navigationState.isActionsExpanded && (
                  <motion.div
                    className={cn(
                      "absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
                      isGR ? "bg-[#16181A] text-neutral-100 border border-[#212428]" : "bg-white text-gray-900 border border-gray-200"
                    )}
                    variants={coachVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    Try Actions
                    <div
                      className={cn(
                        "absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8",
                        isGR ? "border-t-[#16181A] border-l-transparent border-r-transparent" : "border-t-white border-l-transparent border-r-transparent"
                      )}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <NavItem
                icon={
                  <motion.div className="relative" variants={attractVariants} animate={attractOn ? "attract" : "rest"}>
                    {/* soft pulse halo */}
                    <AnimatePresence>
                      {attractOn && !reduceMotion && (
                        <motion.span
                          className="absolute inset-0 rounded-full"
                          variants={pulseVariants}
                          initial="hidden"
                          animate="show"
                          exit="hidden"
                          style={{ background: "radial-gradient(closest-side, rgba(235,10,30,.25), rgba(235,10,30,0))" }}
                        />
                      )}
                    </AnimatePresence>

                    <div
                      className="relative rounded-full p-2"
                      style={isGR ? { backgroundColor: "#1D1F22", border: `1px solid ${GR.EDGE}` } : { backgroundColor: TOYOTA_RED }}
                    >
                      <Bolt className="text-white h-4 w-4" />
                    </div>
                  </motion.div>
                }
                label="Actions"
                to="#"
                onClick={() => {
                  navigationState.setActionsExpanded(!navigationState.isActionsExpanded);
                  if (!navigationState.isActionsExpanded) {
                    setAttractOn(false);
                    setShowCoachmark(false);
                  }
                }}
                isActive={navigationState.isActionsExpanded}
                isScrolled={isScrolled}
                grMode={isGR}
              />
            </div>
          )}

          <NavItem
            icon={<Search className={cn(isGR ? "text-neutral-100" : "", "transition-all", "h-5 w-5")} />}
            label="Search"
            to="#"
            onClick={() => navigationState.setActiveSection("search")}
            isActive={activeItem === "search" || navigationState.activeSection === "search"}
            isScrolled={isScrolled}
            grMode={isGR}
          />
          <NavItem
            icon={<Menu className={cn(isGR ? "text-red-400" : "text-red-600", "transition-all", "h-5 w-5")} />}
            label="Menu"
            to="#"
            onClick={() => navigationState.setMenuOpen(true)}
            isActive={navigationState.isMenuOpen}
            isScrolled={isScrolled}
            grMode={isGR}
          />
        </div>
      </motion.nav>
    </>
  );
};

/* ───────────────────────────────────────────────
   NavItem
──────────────────────────────────────────────── */
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: () => void;
  isScrolled?: boolean;
  grMode?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  to,
  isActive = false,
  onClick,
  isScrolled = false,
  grMode = false,
}) => {
  const getSize = () => (isScrolled ? "36px" : "48px");

  return (
    <button onClick={onClick} className="relative flex flex-col items-center justify-center px-1 py-2 rounded-lg">
      <motion.div
        className={cn(
          "p-2 rounded-xl transition-all relative flex items-center justify-center",
          isActive
            ? grMode
              ? "bg-[#141618] text-[#E6E7E9] scale-110 shadow-[inset_0_0_0_1px_#17191B]"
              : "text-[#CC0000] bg-red-50 scale-110"
            : grMode
            ? "text-[#E6E7E9] bg-[#101214] hover:bg-[#121416] shadow-[inset_0_0_0_1px_#17191B]"
            : "text-gray-600 hover:text-gray-800"
        )}
        animate={{ minWidth: getSize(), minHeight: getSize(), padding: isScrolled ? "6px" : "8px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: isActive ? 1.1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-current={isActive ? "page" : undefined}
        style={{ WebkitTapHighlightColor: "transparent", minHeight: "44px", minWidth: "44px" }}
      >
        {icon}
      </motion.div>
      {!isScrolled && (
        <span
          className={cn(
            "text-xs text-center font-medium mt-1 leading-tight transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]",
            grMode ? (isActive ? "text-red-300" : "text-neutral-300") : isActive ? "text-[#CC0000]" : "text-gray-600"
          )}
        >
          {label}
        </span>
      )}
    </button>
  );
};

export default MobileStickyNav;