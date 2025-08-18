import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search, Car, Menu, ShoppingBag, ChevronRight, Battery, Truck,
  Settings, Star, Phone, X, Share2, MapPin, Tag, Calculator,
  TrendingUp, Sliders, ChevronUp, Download, Bolt
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

/* ========= GR TOKENS ========= */
const GR_RED = "#EB0A1E";
const GR_DARK = "#0A0A0B";
const GR_GRADIENT = "linear-gradient(135deg, #EB0A1E 0%, #B30000 45%, #6A0000 100%)";

/* Carbon fiber via pure CSS (two rotated repeating-gradients) */
const carbonStyle: React.CSSProperties = {
  backgroundImage: `
    repeating-linear-gradient(45deg, #111 0 6px, #0c0c0c 6px 12px),
    repeating-linear-gradient(-45deg, #121212 0 6px, #0b0b0b 6px 12px)
  `,
  backgroundBlendMode: "multiply",
};

/* Checkered tape accent (SVG data URI) */
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

/* ========= TYPES ========= */
interface MobileStickyNavProps {
  activeItem?: string;
  onMenuToggle?: () => void;
  vehicle?: VehicleModel;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onBookTestDrive?: () => void;
  onCarBuilder?: () => void;
  onFinanceCalculator?: () => void;
  /** New: switch GR visual style on/off (defaults to true) */
  grMode?: boolean;
}

/* ========= STATIC DATA (unchanged) ========= */
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
  { name: "2022 Toyota Camry LE", price: 89000, mileage: "25,000 km", year: 2022,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    category: "sedan" },
  { name: "2021 Toyota RAV4 XLE", price: 95000, mileage: "35,000 km", year: 2021,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/4ac2d27b-b1c8-4f71-a6d6-67146ed048c0/renditions/93d25a70-0996-4500-ae27-13e6c6bd24fc?binary=true&mformat=true",
    category: "suv" },
  { name: "2023 Toyota Prius Hybrid", price: 78000, mileage: "15,000 km", year: 2023,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    category: "hybrid" },
  { name: "2020 Toyota Corolla SE", price: 65000, mileage: "45,000 km", year: 2020,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    category: "sedan" },
  { name: "2022 Toyota Highlander Limited", price: 145000, mileage: "20,000 km", year: 2022,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    category: "suv" },
  { name: "2021 Toyota GR Supra 3.0", price: 185000, mileage: "12,000 km", year: 2021,
    image: "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
    category: "performance" },
];

/* ========= COMPONENT ========= */
const MobileStickyNavGR: React.FC<MobileStickyNavProps> = ({
  activeItem = "home",
  onMenuToggle,
  vehicle,
  isFavorite = false,
  onToggleFavorite,
  onBookTestDrive,
  onCarBuilder,
  onFinanceCalculator,
  grMode = true,
}) => {
  const { isMobile, deviceCategory, screenSize, isInitialized } = useDeviceInfo();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([50000, 200000]);
  const [isActionsExpanded, setIsActionsExpanded] = useState(false);
  const [forceVisible, setForceVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const { toast } = useToast();

  // Reduced-motion
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(!!mq?.matches);
    apply();
    mq?.addEventListener?.("change", apply);
    return () => mq?.removeEventListener?.("change", apply);
  }, []);

  // Locale formatter
  const fmt = useMemo(
    () => new Intl.NumberFormat(typeof navigator !== "undefined" ? navigator.language : "en-AE"),
    []
  );

  // Force visible on small screens
  useEffect(() => {
    setForceVisible(window.innerWidth <= 500);
  }, []);

  // Shrink on scroll
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const up = y < lastScrollY;
      if (y > 96 && !isScrolled) setIsScrolled(true);
      if (y <= 72 && isScrolled) setIsScrolled(false);
      setLastScrollY(y);
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
  }, [isScrolled, lastScrollY]);

  const filteredVehicles = vehicles
    .filter(v => selectedCategory === "all" || v.category.toLowerCase() === selectedCategory)
    .slice(0, 12);
  const searchResults = vehicles
    .filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 8);
  const filteredPreOwnedVehicles = preOwnedVehicles.filter(v =>
    (selectedCategory === "all" || v.category === selectedCategory) &&
    v.price >= priceRange[0] && v.price <= priceRange[1]
  );

  const handleSectionToggle = (section: string) => {
    if (activeSection === section) { setActiveSection(null); setIsMenuOpen(false); }
    else { setActiveSection(section); setIsMenuOpen(true); }
  };
  const toggleMenu = () => {
    if (isMenuOpen) { setIsMenuOpen(false); setActiveSection(null); }
    else { setIsMenuOpen(true); setActiveSection("quick-actions"); }
  };

  const handleShare = async () => {
    if (!vehicle) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${vehicle.name} - Toyota UAE`,
          text: `Check out this ${vehicle.name} starting from AED ${fmt.format(vehicle.price)}`,
          url: window.location.href
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied", description: "Vehicle link has been copied to clipboard." });
    }
  };
  const handleBrochureDownload = () => {
    if (!vehicle) return;
    toast({ title: "Brochure Download", description: "Preparing your brochure..." });
    setTimeout(() => toast({ title: "Download Complete", description: `${vehicle.name} brochure downloaded.` }), 1600);
  };

  const shouldShowNav = isInitialized && (isMobile || forceVisible);
  if (!shouldShowNav) return null;

  /* ======== GR EASING: snappier, more aggressive ======== */
  const spring = { type: "spring", stiffness: 420, damping: 28, mass: 0.7 };
  const easeOutExpo = [0.16, 1, 0.3, 1];

  return (
    <>
      {/* DIM OVERLAY */}
      <AnimatePresence>
        {(isMenuOpen || isActionsExpanded) && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => { setIsMenuOpen(false); setActiveSection(null); setIsActionsExpanded(false); }}
          />
        )}
      </AnimatePresence>

      {/* VEHICLE ACTIONS (Bottom Card) */}
      <AnimatePresence>
        {isActionsExpanded && vehicle && (
          <motion.div
            role="dialog" aria-modal="true" aria-label="Vehicle quick actions"
            initial={{ y: 320, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 320, opacity: 0 }}
            transition={spring}
            className="fixed left-4 right-4 bottom-24 z-50 rounded-2xl border shadow-2xl overflow-hidden"
            style={{ borderColor: "#1a1a1a", backgroundColor: "#0c0c0d" }}
          >
            {/* Checkered top accent */}
            <div className="h-2" style={{ backgroundImage: CHECKER_URI, backgroundSize: "auto 100%" }} />
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-white tracking-wide">{vehicle.name}</h3>
                  <span className="text-lg font-bold" style={{ color: GR_RED }}>
                    AED {fmt.format(vehicle.price)}
                  </span>
                </div>
                <Button
                  onClick={() => setIsActionsExpanded(false)}
                  variant="outline" size="sm"
                  className="p-2 rounded-full border border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                  aria-label="Collapse actions"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <motion.div whileHover={{ scale: reduceMotion ? 1 : 1.03 }} whileTap={{ scale: reduceMotion ? 1 : 0.97 }}>
                  <Button
                    onClick={() => { onBookTestDrive?.(); setIsActionsExpanded(false); }}
                    className="w-full py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
                    style={{ background: GR_GRADIENT }}
                  >
                    <Car className="h-4 w-4 mr-2" /> Test Drive
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: reduceMotion ? 1 : 1.03 }} whileTap={{ scale: reduceMotion ? 1 : 0.97 }}>
                  <Button
                    onClick={() => { onCarBuilder?.(); setIsActionsExpanded(false); }}
                    variant="outline"
                    className="w-full py-3 rounded-xl text-sm font-semibold border border-red-700 text-red-400 hover:bg-red-950/40"
                  >
                    <Settings className="h-4 w-4 mr-2" /> Configure
                  </Button>
                </motion.div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => { onFinanceCalculator?.(); setIsActionsExpanded(false); }}
                  variant="outline"
                  className="w-full py-2 rounded-lg text-xs border border-neutral-700 text-neutral-200 hover:bg-neutral-800">
                  <Calculator className="h-4 w-4 mb-1" /> Finance
                </Button>
                <Button onClick={() => { handleBrochureDownload(); setIsActionsExpanded(false); }}
                  variant="outline"
                  className="w-full py-2 rounded-lg text-xs border border-neutral-700 text-neutral-200 hover:bg-neutral-800">
                  <Download className="h-4 w-4 mb-1" /> Brochure
                </Button>
                <Button onClick={() => { handleShare(); setIsActionsExpanded(false); }}
                  variant="outline"
                  className="w-full py-2 rounded-lg text-xs border border-neutral-700 text-neutral-200 hover:bg-neutral-800">
                  <Share2 className="h-4 w-4 mb-1" /> Share
                </Button>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-800">
                <p className="text-xs text-neutral-400 text-center">
                  From AED 899/month • Free delivery • 7-day return
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM SHEET MENU (GR skin) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            role="dialog" aria-modal="true" aria-label="Toyota Connect menu"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={spring}
            className="fixed bottom-16 left-0 right-0 rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-hidden border-t-4"
            style={{
              borderImage: `${GR_GRADIENT} 1`,
              backgroundColor: GR_DARK,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-800" style={carbonStyle}>
              <div>
                <h3 className="font-black text-white text-lg tracking-wide">Toyota Connect</h3>
                <p className="text-sm text-neutral-300">GR Performance Hub</p>
              </div>
              <Button
                variant="ghost" size="sm" onClick={() => setIsMenuOpen(false)}
                className="rounded-full h-8 w-8 p-0 text-white hover:bg-white/10"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="overflow-y-auto max-h-[calc(75vh-100px)]">
              {/* Quick Actions */}
              {activeSection === "quick-actions" && (
                <motion.div className="p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <h4 className="text-neutral-200 font-semibold mb-4">Quick Actions</h4>
                  <Carousel opts={{ align: "start" }} className="w-full mb-6">
                    <CarouselContent>
                      {quickMenuItems.map((card) => (
                        <CarouselItem key={card.title} className="basis-2/3 pl-4">
                          <Link to={card.link} onClick={() => setIsMenuOpen(false)} aria-label={card.title}>
                            <motion.div whileHover={{ y: reduceMotion ? 0 : -2, boxShadow: reduceMotion ? undefined : "0 10px 30px rgba(235,10,30,.25)" }} transition={{ duration: .25, ease: easeOutExpo }}>
                              <Card className="h-32 overflow-hidden border border-neutral-800"
                                    style={{ background: GR_GRADIENT }}>
                                <CardContent className="flex flex-col justify-between h-full p-4 text-white">
                                  <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                      <h3 className="font-bold text-base tracking-wide">{card.title}</h3>
                                      <p className="text-xs/5 opacity-95">{card.description}</p>
                                    </div>
                                    <div className="opacity-95">{card.icon}</div>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <div className="h-1 w-24 rounded-full bg-white/40" />
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
                    <Button variant="outline" className="h-12 justify-start border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                            onClick={() => handleSectionToggle("models")}>
                      <Car className="h-4 w-4 mr-2" /> Browse Models
                    </Button>
                    <Button variant="outline" className="h-12 justify-start border-neutral-700 text-neutral-200 hover:bg-neutral-800"
                            onClick={() => handleSectionToggle("search")}>
                      <Search className="h-4 w-4 mr-2" /> Find Vehicle
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Models */}
              {activeSection === "models" && (
                <motion.div className="p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <h4 className="text-neutral-200 font-semibold mb-4">Browse Models</h4>
                  <div className="mb-6">
                    <Carousel opts={{ align: "start" }}>
                      <CarouselContent>
                        {vehicleCategories.map((category) => (
                          <CarouselItem key={category.id} className="basis-auto pl-3">
                            <motion.button
                              onClick={() => setSelectedCategory(category.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl min-w-[84px] border",
                                selectedCategory === category.id
                                  ? "text-white border-red-700"
                                  : "text-neutral-200 border-neutral-800 hover:bg-neutral-900"
                              )}
                              style={selectedCategory === category.id ? { background: GR_GRADIENT } : carbonStyle}
                              whileHover={{ scale: reduceMotion ? 1 : 1.04 }} whileTap={{ scale: reduceMotion ? 1 : 0.96 }}
                              aria-pressed={selectedCategory === category.id} aria-label={`Filter ${category.name}`}
                            >
                              <span className="mb-2">{category.icon}</span>
                              <span className="text-[11px] font-medium whitespace-nowrap tracking-wide">{category.name}</span>
                            </motion.button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  <Carousel opts={{ align: "start" }}>
                    <CarouselContent>
                      {filteredVehicles.map((v) => (
                        <CarouselItem key={v.name} className="basis-2/3 pl-4">
                          <Link to={`/vehicle/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`}
                                onClick={() => setIsMenuOpen(false)} aria-label={`View ${v.name}`}
                                className="rounded-xl">
                            <motion.div whileHover={{ y: reduceMotion ? 0 : -2 }} transition={{ duration: .25, ease: easeOutExpo }}>
                              <Card className="overflow-hidden border border-neutral-800 bg-black">
                                <div className="aspect-[16/10] w-full relative" style={carbonStyle}>
                                  {v.image && (
                                    <img src={v.image} alt={v.name} className="w-full h-full object-cover mix-blend-screen opacity-90"
                                         loading="lazy" decoding="async" />
                                  )}
                                  {/* diagonal GR ribbon */}
                                  <div className="absolute -left-10 -top-10 h-20 w-40 rotate-[-15deg] opacity-90"
                                       style={{ background: GR_GRADIENT }} />
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-bold text-base mb-1 text-white tracking-wide">{v.name}</h3>
                                  <p className="text-sm text-neutral-300 mb-3">From AED {fmt.format(v.price)}</p>
                                  <div className="flex justify-between items-center">
                                    <span className="text-[11px] px-2 py-1 rounded-full font-semibold"
                                          style={{ background: "rgba(235,10,30,0.12)", color: GR_RED }}>
                                      {v.category}
                                    </span>
                                    <span className="text-red-400 text-sm font-semibold flex items-center">
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
                    <Link to={`/new-cars${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="inline-flex items-center justify-center font-semibold text-red-400 hover:text-red-300">
                      View All {selectedCategory !== "all" ? vehicleCategories.find(c => c.id === selectedCategory)?.name : ""} Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Search */}
              {activeSection === "search" && (
                <motion.div className="p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <h4 className="text-neutral-200 font-semibold mb-4">Find Your Toyota</h4>
                  <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <input
                      type="text" placeholder="Search models, features..."
                      value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-800 bg-neutral-950 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-700"
                      aria-label="Search vehicles"
                    />
                  </div>

                  {searchQuery ? (
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-neutral-400">Search Results</h5>
                      <Carousel opts={{ align: "start" }}>
                        <CarouselContent>
                          {searchResults.map((v) => (
                            <CarouselItem key={v.name} className="basis-2/3 pl-4">
                              <Link to={`/vehicle/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`}
                                    onClick={() => setIsMenuOpen(false)} className="rounded-xl" aria-label={`View ${v.name}`}>
                                <Card className="h-24 overflow-hidden border border-neutral-800 bg-neutral-950">
                                  <CardContent className="flex items-center h-full p-4">
                                    <div className="w-16 h-12 rounded-lg mr-3 flex-shrink-0 overflow-hidden" style={carbonStyle}>
                                      {v.image && <img src={v.image} alt={v.name} className="w-full h-full object-cover mix-blend-screen opacity-90" loading="lazy" decoding="async" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-medium text-sm text-white truncate">{v.name}</h3>
                                      <p className="text-xs text-neutral-400">AED {fmt.format(v.price)}</p>
                                    </div>
                                    <ChevronRight className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                                  </CardContent>
                                </Card>
                              </Link>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h5 className="text-sm font-medium text-neutral-400">Popular Searches</h5>
                      <Carousel opts={{ align: "start" }}>
                        <CarouselContent>
                          {searchSuggestions.map((s) => (
                            <CarouselItem key={s.term} className="basis-auto pl-3">
                              <button
                                onClick={() => setSearchQuery(s.term)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-950 text-neutral-100 hover:bg-neutral-900"
                                aria-label={`Search ${s.term}`}
                              >
                                {s.icon}
                                <span className="text-sm">{s.term}</span>
                              </button>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Pre-Owned */}
              {activeSection === "pre-owned" && (
                <motion.div className="p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                  <h4 className="text-neutral-200 font-semibold mb-4">Pre-Owned Vehicles</h4>
                  <div className="mb-6">
                    <Carousel opts={{ align: "start" }}>
                      <CarouselContent>
                        {vehicleCategories.map((category) => (
                          <CarouselItem key={category.id} className="basis-auto pl-3">
                            <motion.button
                              onClick={() => setSelectedCategory(category.id)}
                              className={cn(
                                "flex flex-col items-center justify-center p-4 rounded-xl min-w-[84px] border",
                                selectedCategory === category.id
                                  ? "text-white border-red-700"
                                  : "text-neutral-200 border-neutral-800 hover:bg-neutral-900"
                              )}
                              style={selectedCategory === category.id ? { background: GR_GRADIENT } : carbonStyle}
                              whileHover={{ scale: reduceMotion ? 1 : 1.04 }} whileTap={{ scale: reduceMotion ? 1 : 0.96 }}
                              aria-pressed={selectedCategory === category.id} aria-label={`Filter ${category.name}`}
                            >
                              <span className="mb-2">{category.icon}</span>
                              <span className="text-[11px] font-medium whitespace-nowrap tracking-wide">{category.name}</span>
                            </motion.button>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>

                  {/* Price slider */}
                  <div className="mb-6 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-medium text-neutral-200">Price Range</h5>
                      <span className="text-sm text-neutral-400">
                        AED {fmt.format(priceRange[0])} - AED {fmt.format(priceRange[1])}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Sliders className="h-5 w-5" style={{ color: GR_RED }} />
                      <input type="range" min={30000} max={300000} step={10000} value={priceRange[0]}
                             onChange={(e) => setPriceRange([Math.min(parseInt(e.target.value), priceRange[1]), priceRange[1]])}
                             className="flex-1 h-2 rounded-lg appearance-none bg-neutral-800 cursor-pointer" aria-label="Minimum price" />
                      <input type="range" min={30000} max={300000} step={10000} value={priceRange[1]}
                             onChange={(e) => setPriceRange([priceRange[0], Math.max(parseInt(e.target.value), priceRange[0])])}
                             className="flex-1 h-2 rounded-lg appearance-none bg-neutral-800 cursor-pointer" aria-label="Maximum price" />
                    </div>
                  </div>

                  <Carousel opts={{ align: "start" }}>
                    <CarouselContent>
                      {filteredPreOwnedVehicles.map((v) => (
                        <CarouselItem key={v.name} className="basis-2/3 pl-4">
                          <Link to={`/pre-owned/${encodeURIComponent(v.name.toLowerCase().replace(/\s+/g, "-"))}`}
                                onClick={() => setIsMenuOpen(false)} aria-label={`View ${v.name}`} className="rounded-xl">
                            <motion.div whileHover={{ y: reduceMotion ? 0 : -2 }} transition={{ duration: .25, ease: easeOutExpo }}>
                              <Card className="overflow-hidden border border-neutral-800 bg-neutral-950">
                                <div className="aspect-[16/10] w-full relative" style={carbonStyle}>
                                  <img src={v.image} alt={v.name} className="w-full h-full object-cover mix-blend-screen opacity-90"
                                       loading="lazy" decoding="async" />
                                  <div className="absolute top-2 right-2">
                                    <span className="px-2 py-1 rounded-full text-xs font-bold text-white shadow"
                                          style={{ background: GR_GRADIENT }}>
                                      {v.year}
                                    </span>
                                  </div>
                                </div>
                                <CardContent className="p-4">
                                  <h3 className="font-semibold text-base mb-1 text-white tracking-wide">{v.name}</h3>
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm font-bold" style={{ color: GR_RED }}>AED {fmt.format(v.price)}</p>
                                    <p className="text-xs text-neutral-400">{v.mileage}</p>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-[11px] px-2 py-1 rounded-full font-semibold"
                                          style={{ background: "rgba(235,10,30,0.12)", color: GR_RED }}>
                                      Certified Pre-Owned
                                    </span>
                                    <span className="text-red-400 text-sm font-semibold flex items-center">
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
                    <Link to={`/pre-owned${selectedCategory !== "all" ? `?category=${selectedCategory}` : ""}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="inline-flex items-center justify-center font-semibold text-red-400 hover:text-red-300">
                      View All Pre-Owned {selectedCategory !== "all" ? vehicleCategories.find(c => c.id === selectedCategory)?.name : ""} Models
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN STICKY NAV — GR look */}
      <motion.nav
        role="navigation" aria-label="Primary"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] pb-safe-area-inset-bottom",
          "border-t shadow-[0_-10px_30px_rgba(0,0,0,.35)]",
          grMode ? "backdrop-blur-xl" : "",
        )}
        style={{
          backgroundColor: grMode ? "rgba(10,10,11,0.9)" : "rgba(255,255,255,0.9)",
          borderColor: grMode ? "#141414" : "#e5e7eb",
        }}
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        transition={spring}
      >
        {/* thin checkered strip */}
        {grMode && <div className="h-1.5" style={{ backgroundImage: CHECKER_URI, backgroundSize: "auto 100%" }} />}

        <motion.div
          className={cn("grid gap-1 px-2 items-center", vehicle ? "grid-cols-5" : "grid-cols-4")}
          animate={{ minHeight: isScrolled ? 48 : 56, paddingTop: isScrolled ? 2 : 4, paddingBottom: isScrolled ? 2 : 4 }}
          transition={{ duration: .35, ease: easeOutExpo }}
        >
          <NavItem
            label="Models"
            icon={<Car className={cn(isScrolled ? "h-4 w-4" : "h-5 w-5", "text-neutral-100")} />}
            to="#"
            onClick={() => handleSectionToggle("models")}
            isActive={activeItem === "models" || activeSection === "models"}
            isScrolled={isScrolled}
            grMode={grMode}
          />
          <NavItem
            label="Pre-Owned"
            icon={<ShoppingBag className={cn(isScrolled ? "h-4 w-4" : "h-5 w-5", "text-neutral-100")} />}
            to="#"
            onClick={() => handleSectionToggle("pre-owned")}
            isActive={activeItem === "pre-owned" || activeSection === "pre-owned"}
            isScrolled={isScrolled}
            grMode={grMode}
          />
          {vehicle && (
            <NavItem
              label="Actions"
              icon={
                <div className="relative">
                  <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: "rgba(235,10,30,0.45)" }} />
                  <div className="relative rounded-full p-2" style={{ background: GR_GRADIENT }}>
                    <Bolt className={cn(isScrolled ? "h-3 w-3" : "h-4 w-4", "text-white")} />
                  </div>
                </div>
              }
              to="#"
              onClick={() => setIsActionsExpanded(prev => !prev)}
              isActive={isActionsExpanded}
              isScrolled={isScrolled}
              grMode={grMode}
            />
          )}
          <NavItem
            label="Search"
            icon={<Search className={cn(isScrolled ? "h-4 w-4" : "h-5 w-5", "text-neutral-100")} />}
            to="#"
            onClick={() => handleSectionToggle("search")}
            isActive={activeItem === "search" || activeSection === "search"}
            isScrolled={isScrolled}
            grMode={grMode}
          />
          <NavItem
            label="Menu"
            icon={<Menu className={cn(isScrolled ? "h-4 w-4" : "h-5 w-5", grMode ? "text-red-400" : "text-red-600")} />}
            to="#"
            onClick={toggleMenu}
            isActive={isMenuOpen}
            isScrolled={isScrolled}
            grMode={grMode}
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
  grMode?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon, label, to, isActive = false, onClick, badge, isScrolled = false, grMode = true
}) => {
  const spring = { type: "spring", stiffness: 420, damping: 28, mass: 0.7 };
  const content = (
    <>
      <div className="flex flex-col items-center justify-center relative w-full"
           style={{ minHeight: isScrolled ? 40 : 44 }}>
        <motion.div
          className={cn(
            "p-2 rounded-xl relative touch-target flex items-center justify-center",
            grMode
              ? (isActive ? "bg-red-900/40" : "bg-black/20 hover:bg-black/30")
              : (isActive ? "bg-red-50" : "bg-white"),
            grMode ? "text-neutral-100" : "text-gray-700",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            grMode ? "focus-visible:ring-red-700 focus-visible:ring-offset-black" : "focus-visible:ring-red-600"
          )}
          animate={{ minWidth: isScrolled ? 36 : 44, minHeight: isScrolled ? 36 : 44, padding: isScrolled ? 6 : 8 }}
          transition={spring}
          whileHover={{ scale: isActive ? 1.08 : 1.04 }}
          whileTap={{ scale: 0.95 }}
          aria-current={isActive ? "page" : undefined}
        >
          {icon}
          {badge != null && (
            <motion.div
              className="absolute -top-1 -right-1 rounded-full h-5 w-5 flex items-center justify-center font-bold text-white"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 18 }}
              style={{ background: GR_GRADIENT, boxShadow: "0 6px 16px rgba(235,10,30,.4)" }}
            >
              {badge > 9 ? "9+" : badge}
            </motion.div>
          )}
        </motion.div>

        {/* Label */}
        <AnimatePresence mode="wait">
          {!isScrolled && (
            <motion.span
              className={cn("text-[11px] text-center font-semibold mt-1 leading-tight tracking-wide",
                            grMode ? (isActive ? "text-red-400" : "text-neutral-300") : (isActive ? "text-red-600" : "text-gray-600"))}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: .2 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* GR active dot */}
      {isActive && (
        <motion.div
          layoutId="navIndicator"
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full"
          initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1, y: isScrolled ? -2 : -4 }}
          transition={{ duration: .25 }}
          style={{ background: GR_GRADIENT, boxShadow: "0 0 0 4px rgba(235,10,30,0.18)" }}
        />
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="relative flex items-center justify-center px-1 py-2 rounded-lg"
        style={{ WebkitTapHighlightColor: "transparent", minHeight: isScrolled ? 48 : 56 }}
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className="relative flex items-center justify-center px-1 py-2 rounded-lg"
      style={{ WebkitTapHighlightColor: "transparent", minHeight: isScrolled ? 48 : 56 }}
      aria-current={isActive ? "page" : undefined}
    >
      {content}
    </Link>
  );
};

export default MobileStickyNavGR;
