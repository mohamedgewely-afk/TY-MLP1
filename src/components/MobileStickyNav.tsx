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
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { contextualHaptic } from "@/utils/haptic";

/**
 * PREMIUM / LUX LOOK & FEEL – with same UX + images
 *  - same props + behavior
 *  - dark GR and light premium themes
 *  - subtle glass, gradient hairlines, soft depth, minimal paints
 *  - motion respects prefers-reduced-motion
 */

/* ───────────────── tokens ───────────────── */
const TOYOTA_RED = "#EB0A1E";
const TOYOTA_GRADIENT = "linear-gradient(90deg, #EB0A1E 0%, #C40E1B 45%, #8B0D14 100%)";

const GR_RED = "#EB0A1E";
const GR_EDGE = "#1A1D21";
const GR_SURFACE = "#0C0D0F";
const GR_TEXT = "#E7E9EC";
const GR_MUTED = "#A0A7AE";

const carbonMatte: React.CSSProperties = {
  backgroundImage: "url('/lovable-uploads/5dc5accb-0a25-49ca-a064-30844fa8836a.png')",
  backgroundSize: "260px 260px",
  backgroundRepeat: "repeat",
  backgroundPosition: "center",
  backgroundColor: GR_SURFACE,
};

const hairline = (color = "rgba(255,255,255,.08)") => ({
  boxShadow: `inset 0 0 0 1px ${color}`,
});

const GLASS_LIGHT = "bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70";
const GLASS_DARK = "bg-[rgba(13,14,16,.75)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(13,14,16,.55)]";

const GR_BTN_PRIMARY =
  "bg-gradient-to-b from-[#EB0A1E] to-[#B10D19] text-white shadow-[0_10px_30px_rgba(235,10,30,.25)] hover:from-[#FF2A3C] hover:to-[#D21320] focus-visible:ring-2 focus-visible:ring-red-600";
const GR_BTN_SURFACE =
  "bg-[#121417] border border-[#1F2328] text-[#E7E9EC] hover:bg-[#14171A] focus-visible:ring-2 focus-visible:ring-red-700";

/* ───────────────── stateful GR toggle ───────────────── */
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

/* ───────────────── props ───────────────── */
interface MobileStickyNavProps {
  activeItem?: string;
  vehicle?: VehicleModel;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
}

/* ───────────────── data ───────────────── */
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

/* Pre-owned sample cards (same images kept) */
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

/* ───────────────── component ───────────────── */
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

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([50000, 200000]);
  const [isScrolled, setIsScrolled] = useState(false);

  const { isGR, toggleGR } = useGRMode();
  const [userTouchedCategory, setUserTouchedCategory] = useState(false);

  // motion
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(!!mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // GR preset category
  useEffect(() => {
    if (isGR && !userTouchedCategory) setSelectedCategory("performance");
  }, [isGR, userTouchedCategory]);

  const fmt = useMemo(
    () => new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-AE"),
    []
  );

  // scroll shrink with rAF
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const threshold = 96;
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

  // reset on route change
  useEffect(() => {
    navigationState.resetNavigation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  // filters
  const filteredVehicles = useMemo(
    () => vehicles.filter((v) => selectedCategory === "all" || v.category.toLowerCase() === selectedCategory).slice(0, 12),
    [selectedCategory]
  );

  const searchResults = useMemo(
    () => vehicles.filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 8),
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

  // nav helpers
  const handleSectionToggle = (section: string) => {
    contextualHaptic.stepProgress();
    if (navigationState.activeSection === section) navigationState.resetNavigation();
    else navigationState.setActiveSection(section);
  };

  const handleCategoryClick = (id: string) => {
    contextualHaptic.buttonPress();
    setSelectedCategory(id);
    setUserTouchedCategory(true);
  };

  const toggleMenu = () => {
    contextualHaptic.stepProgress();
    if (navigationState.isMenuOpen) navigationState.resetNavigation();
    else navigationState.setActiveSection("quick-actions");
  };

  // sharing / brochure
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
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
      }
      toast({ title: "Link Copied", description: "Vehicle link copied to clipboard." });
    } catch {
      /* ignored */
    }
  };

  const handleBrochureDownload = () => {
    if (!vehicle) return;
    contextualHaptic.buttonPress();
    toast({ title: "Preparing brochure…", description: "Your download will start shortly." });
    // integrate real download here
  };

  const shouldShowNav = deviceInfo.isInitialized && deviceInfo.isMobile;

  /* spring tuned for luxury softness */
  const spring = reduceMotion
    ? { duration: 0.12 }
    : { type: "spring", stiffness: 260, damping: 26, mass: 0.8 } as const;

  /* ───────── ACTION tab: premium magnetic button with halo ───────── */
  const [attractOn, setAttractOn] = useState(false);
  const [attractCycles, setAttractCycles] = useState(0);
  const [showCoachmark, setShowCoachmark] = useState(false);

  useEffect(() => {
    if (!shouldShowNav || reduceMotion || navigationState.isActionsExpanded || navigationState.isMenuOpen) return;
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

    const kick = () => {
      if (interacted) return;
      setShowCoachmark(true);
      setAttractOn(true);
      setAttractCycles(1);
      cycleTimer = window.setInterval(() => {
        setAttractCycles((c) => {
          const n = c + 1;
          if (n >= 3) {
            if (cycleTimer) window.clearInterval(cycleTimer);
            setAttractOn(false);
            setShowCoachmark(false);
          } else {
            setAttractOn(false);
            requestAnimationFrame(() => setAttractOn(true));
          }
          return n;
        });
      }, 3800);
    };

    idleTimer = window.setTimeout(kick, 5200);

    const onInteract = () => reset();
    window.addEventListener("pointerdown", onInteract, { passive: true });
    window.addEventListener("keydown", onInteract);
    window.addEventListener("scroll", onInteract, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onInteract);
      if (idleTimer) window.clearTimeout(idleTimer);
      if (cycleTimer) window.clearInterval(cycleTimer);
    };
  }, [shouldShowNav, reduceMotion, navigationState.isActionsExpanded, navigationState.isMenuOpen]);

  const coachVariants = {
    hidden: { opacity: 0, y: 8, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 18 } },
    exit: { opacity: 0, y: 8, scale: 0.98, transition: { duration: 0.14 } },
  } as const;

  const haloPulse = !reduceMotion
    ? {
        opacity: [0, 0.6, 0],
        scale: [1, 1.7, 2.1],
        transition: { duration: 1.2, times: [0, 0.55, 1], ease: "easeInOut" },
      }
    : {};

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
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-40"
            onClick={navigationState.resetNavigation}
          />
        )}
      </AnimatePresence>

      {/* Actions Sheet (vehicle quick actions) */}
      <AnimatePresence>
        {navigationState.isActionsExpanded && (
          <motion.div
            initial={{ y: 320, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 320, opacity: 0 }}
            transition={spring}
            className={cn(
              "fixed left-3 right-3 bottom-24 z-50 rounded-2xl border overflow-hidden",
              isGR ? GLASS_DARK : GLASS_LIGHT
            )}
            style={isGR ? { ...carbonMatte, ...hairline("#1f2328") } : { ...hairline("rgba(0,0,0,.06)") }}
            role="dialog"
            aria-modal="true"
            aria-label="Vehicle quick actions"
          >
            <div className={cn("flex items-center justify-between p-4", isGR ? "border-b border-[#21262c]" : "border-b border-black/10")}
                 style={isGR ? undefined : { background: "linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.4))" }}>
              <div>
                <h3 className={cn("font-semibold text-base", isGR ? "text-white" : "text-gray-900")}>{vehicle?.name ?? "Toyota"}</h3>
                {vehicle && (
                  <span className={cn("text-sm font-bold", isGR ? "text-red-400" : "text-red-600")}>
                    AED {fmt.format(vehicle.price)}
                  </span>
                )}
              </div>
              <Button
                onClick={() => navigationState.setActionsExpanded(false)}
                variant="outline"
                size="sm"
                className={cn("rounded-full h-8 w-8 p-0", isGR ? "border-[#2a2f36] text-neutral-200 hover:bg-[#13161a]" : "border-black/10 hover:bg-black/5")}
                aria-label="Collapse actions"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button
                  onClick={() => { onBookTestDrive?.(); navigationState.setActionsExpanded(false); }}
                  className={cn("w-full h-11 rounded-xl text-sm font-medium", isGR ? GR_BTN_PRIMARY : "text-white", !isGR && "bg-[radial-gradient(55%_120%_at_50%_0%,#ff5a66_0%,#EB0A1E_25%,#C40E1B_60%,#8B0D14_100%)] shadow-[0_10px_30px_rgba(235,10,30,.25)]")}
                >
                  <Car className="h-4 w-4 mr-2" /> Test Drive
                </Button>
                <Button
                  onClick={() => { onCarBuilder?.(); navigationState.setActionsExpanded(false); }}
                  className={cn("w-full h-11 rounded-xl text-sm font-medium", isGR ? GR_BTN_SURFACE : "border border-black/10 bg-white/70 hover:bg-white")}
                >
                  <Settings className="h-4 w-4 mr-2" /> Configure
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => { onFinanceCalculator?.(); navigationState.setActionsExpanded(false); }}
                        variant="outline"
                        className={cn("w-full h-10 rounded-lg text-xs", isGR ? GR_BTN_SURFACE : "border border-black/10 bg-white/70 hover:bg-white")}
                >
                  <Calculator className="h-4 w-4 mr-1" /> Finance
                </Button>
                <Button onClick={() => { handleBrochureDownload(); navigationState.setActionsExpanded(false); }}
                        variant="outline"
                        className={cn("w-full h-10 rounded-lg text-xs", isGR ? GR_BTN_SURFACE : "border border-black/10 bg-white/70 hover:bg-white")}
                >
                  <Download className="h-4 w-4 mr-1" /> Brochure
                </Button>
                <Button onClick={() => { handleShare(); navigationState.setActionsExpanded(false); }}
                        variant="outline"
                        className={cn("w-full h-10 rounded-lg text-xs", isGR ? GR_BTN_SURFACE : "border border-black/10 bg-white/70 hover:bg-white")}
                >
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </div>

              <p className={cn("text-[11px] text-center mt-4", isGR ? "text-neutral-400" : "text-gray-600")}>
                From AED 899/month • Free delivery • 7-day return
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main menu sheet – untouched behavior, elevated visuals would reuse same patterns if needed */}
      <AnimatePresence>
        {navigationState.isMenuOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={spring}
            className={cn(
              "fixed bottom-16 left-0 right-0 rounded-t-[28px] z-50 overflow-hidden border-t",
              isGR ? GLASS_DARK : GLASS_LIGHT
            )}
            style={isGR ? { ...carbonMatte, ...hairline("#1f2328") } : { ...hairline("rgba(0,0,0,.08)") }}
            role="dialog"
            aria-modal="true"
            aria-label="Toyota Connect menu"
          >
            <div className={cn("flex items-center justify-between p-4", isGR ? "border-b border-[#21262c]" : "border-b border-black/10")}
                 style={isGR ? undefined : { background: "linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.4))" }}>
              <div>
                <h3 className={cn("font-semibold text-lg tracking-[.02em]", isGR ? "text-white" : "text-gray-900")}>Toyota Connect</h3>
                <p className={cn("text-sm", isGR ? "text-neutral-300" : "text-red-600")}>{isGR ? "GR Performance Hub" : "Your gateway to Toyota"}</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={toggleGR} aria-pressed={isGR} aria-label="Toggle GR mode"
                        className={cn("inline-flex items-center h-8 rounded-full px-3 text-xs font-semibold",
                                      isGR ? "bg-[#171a1e] text-[#E7E9EC]" : "bg-gray-200/70 text-gray-800")}
                        style={isGR ? hairline("#232830") : hairline("rgba(0,0,0,.08)") as React.CSSProperties}
                >GR</button>
                <Button variant="ghost" size="sm" onClick={navigationState.resetNavigation}
                        className={cn("rounded-full h-8 w-8 p-0", isGR ? "text-[#E7E9EC] hover:bg-[#15181b]" : "text-red-600 hover:bg-red-50")}
                        aria-label="Close menu">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Sections – models/search/pre-owned are visually tuned below */}
            <div className="overflow-y-auto max-h-[75vh] scrollbar-hide">
              {navigationState.activeSection === "quick-actions" && (
                <motion.div className="p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
                  <h4 className={cn("text-sm font-semibold mb-3", isGR ? "text-neutral-300" : "text-gray-700")}>Quick Actions</h4>
                  <Carousel opts={{ align: "start" }} className="w-full mb-5">
                    <CarouselContent>
                      {[
                        { id: "test-drive", title: "Book Test Drive", icon: <Car className="h-7 w-7" />, link: "/test-drive", description: "Experience Toyota firsthand" },
                        { id: "offers", title: "Latest Offers", icon: <ShoppingBag className="h-7 w-7" />, link: "/offers", description: "Exclusive deals available" },
                        { id: "configure", title: "Build & Price", icon: <Settings className="h-7 w-7" />, link: "/configure", description: "Customize your Toyota" },
                      ].map((card) => (
                        <CarouselItem key={card.id} className="pl-4 basis-2/3 sm:basis-1/2">
                          <Link to={card.link} onClick={navigationState.resetNavigation} className="block focus-visible:ring-2 focus-visible:ring-red-600 rounded-2xl">
                            <motion.div whileHover={reduceMotion ? {} : { scale: 1.02 }} whileTap={reduceMotion ? {} : { scale: 0.98 }}>
                              {isGR ? (
                                <div className={cn("h-32 overflow-hidden rounded-2xl border", GLASS_DARK)} style={{ ...carbonMatte, ...hairline("#252a31") }}>
                                  <div className="flex flex-col justify-between h-full p-4 text-[#E7E9EC]">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <h3 className="font-semibold text-base">{card.title}</h3>
                                        <p className="text-xs opacity-90">{card.description}</p>
                                      </div>
                                      <div className="opacity-90">{card.icon}</div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                      <div className="h-[3px] w-24 rounded-full bg-red-800/50" />
                                      <ChevronRight className="h-4 w-4 opacity-90" />
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <Card className={cn("h-32 overflow-hidden border-0 shadow-xl", GLASS_LIGHT)}>
                                  <CardContent className="flex flex-col justify-between h-full p-4 text-gray-900">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <h3 className="font-semibold text-base">{card.title}</h3>
                                        <p className="text-xs text-gray-600">{card.description}</p>
                                      </div>
                                      <div className="opacity-90 text-red-600">{card.icon}</div>
                                    </div>
                                    <div className="flex justify-end">
                                      <ChevronRight className="h-4 w-4 text-red-600/80" />
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </motion.div>
                          </Link>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>

                  <div className="grid grid-cols-2 gap-3">
                    <Button className={cn("h-11 justify-start", isGR ? GR_BTN_SURFACE : "border border-black/10 bg-white/70 hover:bg-white")} onClick={() => handleSectionToggle("models")}> <Car className="h-4 w-4 mr-2"/> Browse Models</Button>
                    <Button className={cn("h-11 justify-start", isGR ? GR_BTN_SURFACE : "border border-black/10 bg-white/70 hover:bg-white")} onClick={() => handleSectionToggle("search")}> <Search className="h-4 w-4 mr-2"/> Find Vehicle</Button>
                  </div>
                </motion.div>
              )}

              {/* Models section – cards with premium depth */}
              {navigationState.activeSection === "models" && (
                <SectionModels isGR={isGR} onCategory={handleCategoryClick} selectedCategory={selectedCategory} filteredVehicles={filteredVehicles} />
              )}

              {/* Search section – unchanged logic, refined visuals */}
              {navigationState.activeSection === "search" && (
                <SectionSearch isGR={isGR} searchQuery={searchQuery} setSearchQuery={setSearchQuery} searchResults={searchResults} />
              )}

              {/* Pre-owned – refined visuals */}
              {navigationState.activeSection === "pre-owned" && (
                <SectionPreOwned isGR={isGR} selectedCategory={selectedCategory} onCategory={handleCategoryClick} priceRange={priceRange} setPriceRange={setPriceRange} filteredPreOwnedVehicles={filteredPreOwnedVehicles} fmt={fmt} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav – premium bar with gradient hairline and magnetic ACTIONS */}
      <motion.nav
        role="navigation"
        aria-label="Primary"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] border-t",
          isGR ? GLASS_DARK : GLASS_LIGHT
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={spring}
        style={isGR ? { ...carbonMatte, ...hairline("#1f2328") } : hairline("rgba(0,0,0,.08)")}
      >
        <div className={cn("grid gap-1 px-2 items-center", vehicle ? "grid-cols-5" : "grid-cols-4")}
             style={{ willChange: "transform" }}>
          <NavItem icon={<Car className={cn(isGR ? "text-neutral-100" : "text-gray-700", "h-5 w-5")} />} label="Models" to="#" onClick={() => handleSectionToggle("models")} isActive={activeItem === "models" || navigationState.activeSection === "models"} grMode={isGR} />
          <NavItem icon={<ShoppingBag className={cn(isGR ? "text-neutral-100" : "text-gray-700", "h-5 w-5")} />} label="Pre-Owned" to="#" onClick={() => handleSectionToggle("pre-owned")} isActive={activeItem === "pre-owned" || navigationState.activeSection === "pre-owned"} grMode={isGR} />

          {/* Center ACTIONS – catchy glowing capsule */}
          {vehicle && (
            <div className="relative flex items-center justify-center">
              {/* coachmark */}
              <AnimatePresence>
                {showCoachmark && !navigationState.isActionsExpanded && (
                  <motion.div className={cn("absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold shadow-lg",
                                            isGR ? "bg-[#15181b] text-neutral-100 border border-[#21262c]" : "bg-white text-gray-900 border border-black/10")}
                              variants={coachVariants} initial="hidden" animate="visible" exit="exit">
                    Try Actions
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                onClick={() => {
                  navigationState.setActionsExpanded(!navigationState.isActionsExpanded);
                  if (!navigationState.isActionsExpanded) { setAttractOn(false); setShowCoachmark(false); }
                }}
                className="relative group inline-flex items-center justify-center"
                aria-pressed={navigationState.isActionsExpanded}
                aria-label="Open quick actions"
              >
                {/* halo pulse */}
                <AnimatePresence>
                  {attractOn && (
                    <motion.span className="absolute inset-0 rounded-full" animate={haloPulse} exit={{ opacity: 0 }}
                                  style={{ background: "radial-gradient(closest-side, rgba(235,10,30,.28), rgba(235,10,30,0))" }} />
                  )}
                </AnimatePresence>

                {/* glossy capsule */}
                <span
                  className={cn(
                    "relative rounded-full p-2 transition-transform",
                    isGR ? "shadow-[inset_0_0_0_1px_#232830] bg-[#171a1e]" : "shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]",
                  )}
                  style={isGR ? undefined : { background: TOYOTA_GRADIENT }}
                >
                  <Bolt className="text-white h-4 w-4" />
                </span>
              </button>
            </div>
          )}

          <NavItem icon={<Search className={cn(isGR ? "text-neutral-100" : "text-gray-700", "h-5 w-5")} />} label="Search" to="#" onClick={() => handleSectionToggle("search")} isActive={activeItem === "search" || navigationState.activeSection === "search"} grMode={isGR} />
          <NavItem icon={<Menu className={cn(isGR ? "text-red-400" : "text-red-600", "h-5 w-5")} />} label="Menu" to="#" onClick={toggleMenu} isActive={navigationState.isMenuOpen} grMode={isGR} />
        </div>
      </motion.nav>
    </>
  );
};

/* ───────────────── Subsections as small pure components (visual-only tweaks) ───────────────── */

const SectionModels: React.FC<{
  isGR: boolean;
  selectedCategory: string;
  onCategory: (id: string) => void;
  filteredVehicles: VehicleModel[];
}> = ({ isGR, selectedCategory, onCategory, filteredVehicles }) => {
  const fmt = useMemo(() => new Intl.NumberFormat(), []);
  const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div className="p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <h4 className={cn("text-sm font-semibold mb-3", isGR ? "text-neutral-300" : "text-gray-700")}>Browse Models</h4>

      <Carousel opts={{ align: "start" }} className="w-full mb-5">
        <CarouselContent>
          {vehicleCategories.map((c) => (
            <CarouselItem key={c.id} className="basis-auto pl-3">
              <motion.button
                onClick={() => onCategory(c.id)}
                className={cn("flex flex-col items-center justify-center p-3 rounded-xl min-w-[80px]",
                              selectedCategory === c.id ? (isGR ? "" : "text-white scale-105") : (isGR ? "hover:bg-[#121418]" : "bg-gray-100 hover:bg-gray-200"))}
                style={isGR ? { ...carbonMatte, ...hairline("#232830"), color: selectedCategory === c.id ? GR_TEXT : GR_MUTED } : (selectedCategory === c.id ? { background: TOYOTA_GRADIENT } : undefined)}
                whileHover={reduceMotion ? {} : { scale: 1.04 }} whileTap={reduceMotion ? {} : { scale: 0.96 }}
                aria-pressed={selectedCategory === c.id}
              >
                <span className="mb-2">{c.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">{c.name}</span>
              </motion.button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {filteredVehicles.map((v) => (
            <CarouselItem key={v.name} className="pl-4 basis-2/3 sm:basis-1/2">
              <Link to={`/vehicle/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`} className="block rounded-2xl focus-visible:ring-2 focus-visible:ring-red-600">
                <motion.div whileHover={reduceMotion ? {} : { scale: 1.02 }} whileTap={reduceMotion ? {} : { scale: 0.98 }}>
                  {isGR ? (
                    <div className={cn("overflow-hidden rounded-2xl border", GLASS_DARK)} style={{ ...carbonMatte, ...hairline("#242a31") }}>
                      <div className="aspect-[16/10] w-full relative" style={carbonMatte}>
                        {v.image && (
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover mix-blend-screen opacity-90" loading="lazy" decoding="async" />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-base mb-1 text-white">{v.name}</h3>
                        <p className="text-sm mb-3 text-neutral-400">From AED {fmt.format(v.price)}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: "#15171A", border: `1px solid ${GR_EDGE}`, color: GR_MUTED }}>{v.category}</span>
                          <span className="text-sm font-semibold flex items-center text-red-400">View <ChevronRight className="h-3 w-3 ml-1"/></span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Card className={cn("overflow-hidden border-0 shadow-xl", GLASS_LIGHT)}>
                      <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200 relative">
                        {v.image && (
                          <img src={v.image} alt={v.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-base mb-1 text-gray-900">{v.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">From AED {fmt.format(v.price)}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">{v.category}</span>
                          <span className="text-red-600 text-sm font-semibold flex items-center">View <ChevronRight className="h-3 w-3 ml-1"/></span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-5 text-center">
        <Link to={`/new-cars${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
              className={cn("font-semibold inline-flex items-center justify-center rounded-lg",
                             isGR ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700")}
        >
          View All {selectedCategory !== "all" ? vehicleCategories.find((c) => c.id === selectedCategory)?.name : ""} Models
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

const SectionSearch: React.FC<{
  isGR: boolean;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  searchResults: VehicleModel[];
}> = ({ isGR, searchQuery, setSearchQuery, searchResults }) => {
  const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div className="p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <h4 className={cn("text-sm font-semibold mb-3", isGR ? "text-neutral-300" : "text-gray-700")}>Find Your Toyota</h4>
      <div className="relative mb-5">
        <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4", isGR ? "text-neutral-400" : "text-gray-400")} />
        <input
          type="text"
          placeholder="Search models, features..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn("w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:border-transparent",
                        isGR ? "border-[#22272e] bg-[#0e1113] text-white placeholder:text-neutral-500 focus:ring-red-700" : "border-black/10 focus:ring-[#EB0A1E] bg-white/80")}
          aria-label="Search vehicles"
        />
      </div>

      {searchQuery ? (
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {searchResults.map((v) => (
              <CarouselItem key={v.name} className="basis-2/3 pl-4">
                <Link to={`/vehicle/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`} className="block rounded-2xl focus-visible:ring-2 focus-visible:ring-red-600">
                  {isGR ? (
                    <div className={cn("h-24 overflow-hidden rounded-2xl border", GLASS_DARK)} style={{ ...carbonMatte, ...hairline("#232830") }}>
                      <div className="flex items-center h-full p-4">
                        <div className="w-16 h-12 rounded-lg mr-3 overflow-hidden" style={carbonMatte}>
                          {v.image && (
                            <img src={v.image} alt={v.name} className="w-full h-full object-cover rounded-lg mix-blend-screen opacity-90" loading="lazy" decoding="async" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm truncate text-white">{v.name}</h3>
                          <p className="text-xs text-neutral-400">AED {new Intl.NumberFormat().format(v.price)}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                      </div>
                    </div>
                  ) : (
                    <Card className={cn("h-24 overflow-hidden border-0 shadow-lg", GLASS_LIGHT)}>
                      <CardContent className="flex items-center h-full p-4">
                        <div className="w-16 h-12 bg-gray-100 rounded-lg mr-3 overflow-hidden">
                          {v.image && (
                            <img src={v.image} alt={v.name} className="w-full h-full object-cover rounded-lg" loading="lazy" decoding="async" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 truncate">{v.name}</h3>
                          <p className="text-xs text-gray-600">AED {new Intl.NumberFormat().format(v.price)}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-red-600/70 flex-shrink-0" />
                      </CardContent>
                    </Card>
                  )}
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-full">
          <CarouselContent>
            {searchSuggestions.map((s) => (
              <CarouselItem key={s.term} className="basis-auto pl-3">
                <button onClick={() => setSearchQuery(s.term)} className={cn("flex items-center space-x-2 px-4 py-2 rounded-full",
                                               isGR ? "border border-[#232830] bg-[#0e1113] text-neutral-100" : "bg-gray-100 hover:bg-gray-200")}> {s.icon} <span className="text-sm">{s.term}</span> </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </motion.div>
  );
};

const SectionPreOwned: React.FC<{
  isGR: boolean;
  selectedCategory: string;
  onCategory: (id: string) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  filteredPreOwnedVehicles: typeof preOwnedVehicles;
  fmt: Intl.NumberFormat;
}> = ({ isGR, selectedCategory, onCategory, priceRange, setPriceRange, filteredPreOwnedVehicles, fmt }) => {
  const reduceMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div className="p-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
      <h4 className={cn("text-sm font-semibold mb-3", isGR ? "text-neutral-300" : "text-gray-700")}>Pre-Owned Vehicles</h4>

      <Carousel opts={{ align: "start" }} className="w-full mb-5">
        <CarouselContent>
          {vehicleCategories.map((category) => (
            <CarouselItem key={category.id} className="basis-auto pl-3">
              <motion.button onClick={() => onCategory(category.id)}
                className={cn("flex flex-col items-center justify-center p-3 rounded-xl min-w-[80px]",
                               selectedCategory === category.id ? (isGR ? "" : "text-white scale-105") : (isGR ? "hover:bg-[#121418]" : "bg-gray-100 hover:bg-gray-200"))}
                style={isGR ? { ...carbonMatte, ...hairline("#232830"), color: selectedCategory === category.id ? GR_TEXT : GR_MUTED } : (selectedCategory === category.id ? { background: TOYOTA_GRADIENT } : undefined)}
                whileHover={reduceMotion ? {} : { scale: 1.04 }} whileTap={reduceMotion ? {} : { scale: 0.96 }}>
                <span className="mb-2">{category.icon}</span>
                <span className="text-xs font-medium whitespace-nowrap">{category.name}</span>
              </motion.button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className={cn("mb-5 p-4 rounded-xl", isGR ? GLASS_DARK : GLASS_LIGHT)} style={isGR ? hairline("#232830") : hairline("rgba(0,0,0,.08)") as React.CSSProperties}>
        <div className="flex items-center justify-between mb-3">
          <h5 className={cn("text-sm font-medium", isGR ? "text-neutral-200" : "text-gray-800")}>Price Range</h5>
          <span className={cn("text-sm", isGR ? "text-neutral-400" : "text-gray-600")}>AED {fmt.format(priceRange[0])} – AED {fmt.format(priceRange[1])}</span>
        </div>
        <div className="flex items-center gap-3">
          <Sliders className={cn("h-5 w-5", isGR ? "text-red-500" : "text-red-600")} />
          <input type="range" min={30000} max={300000} step={10000} value={priceRange[0]}
                 onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value, 10), priceRange[1]), priceRange[1]])}
                 className={cn("flex-1 h-2 rounded-lg appearance-none cursor-pointer", isGR ? "bg-[#1a1e23]" : "bg-gray-200")} aria-label="Minimum price" />
          <input type="range" min={30000} max={300000} step={10000} value={priceRange[1]}
                 onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value, 10), priceRange[0])])}
                 className={cn("flex-1 h-2 rounded-lg appearance-none cursor-pointer", isGR ? "bg-[#1a1e23]" : "bg-gray-200")} aria-label="Maximum price" />
        </div>
      </div>

      <Carousel opts={{ align: "start" }} className="w-full">
        <CarouselContent>
          {filteredPreOwnedVehicles.map((v) => (
            <CarouselItem key={v.name} className="pl-4 basis-2/3 sm:basis-1/2">
              <Link to={`/pre-owned/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`} className="block rounded-2xl focus-visible:ring-2 focus-visible:ring-red-600">
                <motion.div whileHover={reduceMotion ? {} : { scale: 1.02 }} whileTap={reduceMotion ? {} : { scale: 0.98 }}>
                  {isGR ? (
                    <div className={cn("overflow-hidden rounded-2xl border", GLASS_DARK)} style={{ ...carbonMatte, ...hairline("#242a31") }}>
                      <div className="aspect-[16/10] w-full relative" style={carbonMatte}>
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover mix-blend-screen opacity-90" loading="lazy" decoding="async" />
                        <div className="absolute top-2 right-2">
                          <span className="text-white px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: "#171a1e", border: `1px solid ${GR_EDGE}` }}>{v.year}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-base mb-1 text-white">{v.name}</h3>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-bold text-red-400">AED {fmt.format(v.price)}</p>
                          <p className="text-xs text-neutral-400">{v.mileage}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: "#15171A", border: `1px solid ${GR_EDGE}`, color: GR_MUTED }}>Certified Pre-Owned</span>
                          <span className="text-sm font-semibold flex items-center text-red-400">View <ChevronRight className="h-3 w-3 ml-1"/></span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Card className={cn("overflow-hidden border-0 shadow-xl", GLASS_LIGHT)}>
                      <div className="aspect-[16/10] w-full bg-gradient-to-br from-gray-100 to-gray-200 relative">
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        <div className="absolute top-2 right-2">
                          <span className="text-white px-2 py-1 rounded-full text-xs font-medium" style={{ background: TOYOTA_GRADIENT }}>{v.year}</span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-base mb-1 text-gray-900">{v.name}</h3>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-bold text-red-600">AED {fmt.format(v.price)}</p>
                          <p className="text-xs text-gray-600">{v.mileage}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">Certified Pre-Owned</span>
                          <span className="text-red-600 text-sm font-semibold flex items-center">View <ChevronRight className="h-3 w-3 ml-1"/></span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="mt-5 text-center">
        <Link to={`/pre-owned${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
              className={cn("font-semibold inline-flex items-center justify-center rounded-lg",
                             isGR ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700")}
        >
          View All Pre-Owned {selectedCategory !== "all" ? vehicleCategories.find((c) => c.id === selectedCategory)?.name : ""} Models
          <ChevronRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

/* ───────────────── NavItem (visual polish only) ───────────────── */
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  onClick?: () => void;
  grMode?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive = false, onClick, grMode = false }) => {
  const base = (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className={cn(
          "p-2 rounded-xl transition-all flex items-center justify-center",
          isActive
            ? grMode
              ? "bg-[#14171b] text-[#E7E9EC] shadow-[inset_0_0_0_1px_#20252b]"
              : "text-red-700 bg-red-50"
            : grMode
            ? "text-[#E7E9EC] bg-[#0f1114] shadow-[inset_0_0_0_1px_#1b2026] hover:bg-[#12151a]"
            : "text-gray-700 hover:text-gray-900"
        )}
        style={{ minWidth: 44, minHeight: 44 }}
      >
        {icon}
      </div>
      <span className={cn("text-[11px] mt-1 font-medium", grMode ? (isActive ? "text-red-300" : "text-neutral-300") : isActive ? "text-red-700" : "text-gray-600")}>
        {label}
      </span>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} className="relative flex items-center justify-center px-1 py-2" style={{ WebkitTapHighlightColor: "transparent" }}>
        {base}
      </button>
    );
  }
  return (
    <Link to={to} className="relative flex items-center justify-center px-1 py-2">
      {base}
    </Link>
  );
};

export default MobileStickyNav;
