import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Calendar, Fuel, Shield, Heart, Share2, Download,
  Settings, Car, PencilRuler, Tag, MapPin, Play, Pause, Volume2, VolumeX,
  Zap, Leaf, Award, Users, Star, ArrowRight, Check, Clock, Globe, Smartphone,
  Sparkles, Layers, Target, Battery, Gauge, Wind, Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";

import ToyotaLayout from "@/components/ToyotaLayout";
import VehicleSpecs from "@/components/vehicle-details/VehicleSpecs";
import VehicleGallery from "@/components/vehicle-details/VehicleGallery";
import VehicleFeatures from "@/components/vehicle-details/VehicleFeatures";
import BookTestDrive from "@/components/vehicle-details/BookTestDrive";
import FinanceCalculator from "@/components/vehicle-details/FinanceCalculator";
import RelatedVehicles from "@/components/vehicle-details/RelatedVehicles";
import TechnologyShowcase from "@/components/vehicle-details/TechnologyShowcase";
import LifestyleGallery from "@/components/vehicle-details/LifestyleGallery";
import CarBuilder from "@/components/vehicle-details/CarBuilder";
import VehicleMediaShowcase from "@/components/vehicle-details/VehicleMediaShowcase";
import OffersSection from "@/components/home/OffersSection";
import OffersModal from "@/components/home/OffersModal";

import { usePersona } from "@/contexts/PersonaContext";
import { useIsMobile } from "@/hooks/use-mobile";

import ActionPanel from "@/components/vehicle-details/ActionPanel";
import RefinedTechExperience from "@/components/vehicle-details/RefinedTechExperience";
import EnhancedHeroSection from "@/components/vehicle-details/EnhancedHeroSection";
import InteractiveSpecsTech from "@/components/vehicle-details/InteractiveSpecsTech";
import EnhancedLifestyleGallery from "@/components/vehicle-details/EnhancedLifestyleGallery";
import PreOwnedSimilar from "@/components/vehicle-details/PreOwnedSimilar";
import VehicleFAQ from "@/components/vehicle-details/VehicleFAQ";
import VirtualShowroom from "@/components/vehicle-details/VirtualShowroom";
import AnimatedCounter from "@/components/ui/animated-counter";

// Full-bleed wrapper for desktop (keeps mobile as-is)
const Bleed: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`lg:ml-[calc(50%-50vw)] lg:mr-[calc(50%-50vw)] lg:w-screen ${className}`}>
    {children}
  </div>
);
// Bleed only toward the viewport edge on desktop (prevents covering the text column)
const BleedRight: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`lg:mr-[calc(50%-50vw)] ${className}`}>{children}</div>
);
const BleedLeft: React.FC<React.PropsWithChildren<{ className?: string }>> = ({ children, className = "" }) => (
  <div className={`lg:ml-[calc(50%-50vw)] ${className}`}>{children}</div>
);
// Parallax image that drifts slightly on scroll (respects prefers-reduced-motion)
const ParallaxImg: React.FC<{ src: string; alt: string; className?: string }> = ({ src, alt, className = "" }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });

  // Stronger drift + subtle fade
  const y = useTransform(scrollYProgress, [0, 1], ["-4vh", "4vh"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.85, 1, 1, 0.9]);

  return (
    <div ref={wrapperRef} className={`relative overflow-hidden pointer-events-none ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={reduce ? {} : { y, opacity }}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
};

const GAP_PX = 24;

const VehicleDetails = () => {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isCarBuilderOpen, setIsCarBuilderOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const [activeSlide, setActiveSlide] = useState(0);
  const [cardWidth, setCardWidth] = useState(360);
  const firstCardRef = useRef<HTMLDivElement>(null);

  const railRef = useRef<HTMLDivElement>(null);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [activePage, setActivePage] = useState(0);

  const { toast } = useToast();
  const { personaData } = usePersona();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Optimized gallery images with proper loading
  const galleryImages = React.useMemo(() => [
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/789c17df-5a4f-4c58-8e98-6377f42ab595/renditions/ad3c8ed5-9496-4aef-8db4-1387eb8db05b?binary=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/ddf77cdd-ab47-4c48-8103-4b2aad8dcd32/items/d2f50a41-fe45-4cb5-9516-d266382d4948/renditions/99b517e5-0f60-443e-95c6-d81065af604b?binary=true",
  ], []);

  const calculateEMI = React.useCallback((price: number) => {
    const principal = price * 0.8;
    const rate = 0.035 / 12;
    const tenure = 60;
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  }, []);

  const monthlyEMI = React.useMemo(() => vehicle ? calculateEMI(vehicle.price) : 0, [vehicle, calculateEMI]);

  // Enhanced storytelling sections with 6 total sections
  const storySection = useMemo(() => [
    {
      id: 'performance',
      title: 'Immediate response with confident control.',
      subtitle: 'Performance',
      description: 'Smooth acceleration, balanced handling, and a whisper-quiet cabin make every drive a pleasure.',
      image: galleryImages[2],
      stats: [
        { label: 'Acceleration', value: '0-100', unit: 'km/h in 8.9s' },
        { label: 'Power Output', value: 196, unit: 'HP' },
        { label: 'Top Speed', value: 180, unit: 'km/h' }
      ],
      cta: { label: 'Feel it – Test Drive', action: () => setIsBookingOpen(true) },
      layout: 'text-left'
    },
    {
      id: 'safety',
      title: 'Proactive protection, 360° awareness.',
      subtitle: 'Safety Sense',
      description: 'Adaptive cruise, collision assist, and intelligent lane guidance keep you safe.',
      image: galleryImages[1],
      stats: [
        { label: 'Safety Rating', value: 5, unit: 'Stars' },
        { label: 'Safety Features', value: 10, unit: 'Advanced Systems' },
        { label: 'Response Time', value: 0.5, unit: 'Seconds' }
      ],
      cta: { label: 'See Safety Suite', action: () => navigate('/safety') },
      layout: 'text-right'
    },
    {
      id: 'connected',
      title: 'Wireless Apple CarPlay & Android Auto.',
      subtitle: 'Connected Life',
      description: 'Stay connected with voice control, OTA updates, and smart integration.',
      image: galleryImages[0],
      stats: [
        { label: 'Screen Size', value: 9, unit: 'Inches' },
        { label: 'Wireless Charging', value: 15, unit: 'W Fast Charge' },
        { label: 'Apps', value: 100, unit: 'Compatible' }
      ],
      cta: { label: 'Explore Connectivity', action: () => navigate('/connect') },
      layout: 'text-left'
    },
    {
      id: 'sustainable',
      title: 'Hybrid efficiency meets real-world performance.',
      subtitle: 'Sustainable Innovation',
      description: 'Advanced hybrid technology that reduces emissions while delivering exceptional performance.',
      image: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      stats: [
        { label: 'Fuel Economy', value: 4.5, unit: 'L/100km' },
        { label: 'CO₂ Reduction', value: 40, unit: '% Less Emissions' },
        { label: 'Electric Range', value: 65, unit: 'km EV Mode' }
      ],
      cta: { label: 'Explore Hybrid Tech', action: () => navigate('/hybrid') },
      layout: 'text-right'
    },
    {
      id: 'comfort',
      title: 'Crafted for comfort, designed for life.',
      subtitle: 'Premium Comfort & Design',
      description: 'Luxurious materials, ergonomic design, and spacious interior create your personal sanctuary.',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
      stats: [
        { label: 'Premium Materials', value: 12, unit: 'Soft-Touch Surfaces' },
        { label: 'Seating Space', value: 95, unit: 'cm Legroom' },
        { label: 'Climate Zones', value: 2, unit: 'Independent Control' }
      ],
      cta: { label: 'Experience Interior', action: () => navigate('/interior') },
      layout: 'text-left'
    },
    {
      id: 'ownership',
      title: 'Clear pricing, finance made simple.',
      subtitle: 'Ownership',
      description: `Get estimated EMI of ${monthlyEMI.toLocaleString()} AED/mo or build your deal online.`,
      image: galleryImages[1],
      stats: [
        { label: 'Monthly EMI', value: monthlyEMI, unit: 'AED/mo' },
        { label: 'Warranty', value: 5, unit: 'Years Coverage' },
        { label: 'Service Network', value: 50, unit: 'Centers in UAE' }
      ],
      cta: { label: 'Calculate EMI', action: () => setIsFinanceOpen(true) },
      layout: 'text-right'
    }
  ], [galleryImages, monthlyEMI, setIsBookingOpen, navigate, setIsFinanceOpen]);

  const [activeStorySection, setActiveStorySection] = useState(0);

  const toggleFavorite = useCallback(() => {
    if (!vehicle) return;
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: string) => fav !== vehicle.name);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({ title: "Removed from favorites", description: `${vehicle.name} has been removed from your favorites.` });
    } else {
      favorites.push(vehicle.name);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsFavorite(true);
      toast({ title: "Added to favorites", description: `${vehicle.name} has been added to your favorites.` });
    }
    window.dispatchEvent(new Event("favorites-updated"));
  }, [vehicle, isFavorite, toast]);

  const slides = [
    {
      key: "performance",
      title: "Performance",
      subtitle: "Immediate response with confident control.",
      image: galleryImages[2],
      icon: <Gauge className="h-5 w-5" />,
      meta: ["Smooth acceleration", "Balanced handling", "Quiet cabin"],
      cta: { label: "Feel it – Test Drive", onClick: () => setIsBookingOpen(true) },
    },
    {
      key: "safety",
      title: "Safety Sense",
      subtitle: "Proactive protection, 360° awareness.",
      image: galleryImages[1],
      icon: <Shield className="h-5 w-5" />,
      meta: ["Adaptive systems", "Collision assist", "Lane guidance"],
      cta: { label: "See Safety Suite", onClick: () => navigate("/safety") },
    },
    {
      key: "connected",
      title: "Connected Life",
      subtitle: "Wireless Apple CarPlay & Android Auto.",
      image: galleryImages[0],
      icon: <Smartphone className="h-5 w-5" />,
      meta: ["Voice control", "Remote start", "OTA‑ready"],
      cta: { label: "Explore Connectivity", onClick: () => navigate("/connect") },
    },
    {
      key: "comfort",
      title: "Comfort & Climate",
      subtitle: "Dual‑zone control and clean air tech.",
      image: galleryImages[1],
      icon: <Wind className="h-5 w-5" />,
      meta: ["HEPA filtration", "Whisper quiet", "Smart venting"],
      cta: { label: "Inside the Cabin", onClick: () => navigate("/interior") },
    },
    {
      key: "ownership",
      title: "Ownership",
      subtitle: "Clear pricing, finance made simple.",
      image: galleryImages[2],
      icon: <Award className="h-5 w-5" />,
      meta: ["Flexible EMI", "Trade‑in support", "Top‑rated service"],
      cta: { label: "Calculate EMI", onClick: () => setIsFinanceOpen(true) },
    },
    {
      key: "build",
      title: "Build & Offers",
      subtitle: "Pick your trim, colors, accessories.",
      image: galleryImages[0],
      icon: <PencilRuler className="h-5 w-5" />,
      meta: ["Live price", "Compare trims", "Limited‑time offers"],
      cta: { label: "Start Building", onClick: () => setIsCarBuilderOpen(true) },
    },
  ];

  const handleOfferClick = useCallback((offer: any) => {
    setSelectedOffer(offer);
    setIsOffersModalOpen(true);
  }, []);

  const onTouchStart = useCallback((e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX), []);
  const onTouchMove = useCallback((e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX), []);
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    if (distance < -50) setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  }, [touchStart, touchEnd, galleryImages.length]);

  useEffect(() => {
    const foundVehicle = vehicles.find((v) => {
      if (v.id === vehicleName) return true;
      const slug = v.name.toLowerCase().replace(/^toyota\s+/, "").replace(/\s+/g, "-");
      return slug === vehicleName;
    });

    if (foundVehicle) {
      setVehicle(foundVehicle);
      document.title = `${foundVehicle.name} | Toyota UAE`;
    }

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: string) => fav === foundVehicle?.name));

    window.scrollTo(0, 0);
  }, [vehicleName]);

  // Optimized image carousel timer - single interval with proper cleanup
  useEffect(() => {
    if (galleryImages.length <= 1) return;
    
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [galleryImages.length]);

  // Optimized resize observer for cards
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const measure = () => {
      const w = rail.clientWidth;
      let per = 1;
      if (w >= 1280) per = 4;
      else if (w >= 1024) per = 3;
      else if (w >= 640) per = 2;
      else per = 1;
      setCardsPerView(per);
      setActivePage((p) => Math.min(p, Math.ceil(slides.length / per) - 1));
    };

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(rail);
    
    // Initial measurement
    requestAnimationFrame(measure);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [slides.length]);

  const pageCount = Math.max(1, Math.ceil(slides.length / cardsPerView));

  const scrollToPage = useCallback((page: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const clamped = Math.max(0, Math.min(page, pageCount - 1));
    rail.scrollTo({ left: clamped * rail.clientWidth, behavior: "smooth" });
  }, [pageCount]);

  const handlePrev = useCallback(() => scrollToPage(activePage - 1), [scrollToPage, activePage]);
  const handleNext = useCallback(() => scrollToPage(activePage + 1), [scrollToPage, activePage]);

  // Optimized scroll handler
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const idx = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
          setActivePage(idx);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToIndex = useCallback((idx: number) => {
    const page = Math.floor(idx / Math.max(1, cardsPerView));
    scrollToPage(page);
  }, [cardsPerView, scrollToPage]);

  if (!vehicle) {
    return (
      <ToyotaLayout>
        <div className="toyota-container py-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
            <p className="mb-6">The vehicle you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </motion.div>
        </div>
      </ToyotaLayout>
    );
  }

  const safeModelEnd = vehicle?.name.split(" ").pop() || "Toyota";
  
  return (
    <ToyotaLayout
      activeNavItem="models"
      vehicle={vehicle}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      onBookTestDrive={() => setIsBookingOpen(true)}
      onCarBuilder={() => setIsCarBuilderOpen(true)}
      onFinanceCalculator={() => setIsFinanceOpen(true)}
    >
      <div
        className={`relative overflow-hidden ${isMobile ? "pb-28" : "pb-32"}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <EnhancedHeroSection
          vehicle={vehicle}
          galleryImages={galleryImages}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookTestDrive={() => setIsBookingOpen(true)}
          onCarBuilder={() => setIsCarBuilderOpen(true)}
          monthlyEMI={monthlyEMI}
        />

        <React.Suspense fallback={<div className="h-96 flex items-center justify-center">Loading...</div>}>
          <VirtualShowroom vehicle={vehicle} />
          
          <section className="py-8 lg:py-16 bg-muted/30">
            <VehicleGallery />
          </section>

          {/* Enhanced Storytelling Sections */}
          <section className="relative py-16 lg:py-28 bg-muted/30">
            {/* Section Navigation Indicators */}
            <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-20 hidden lg:flex flex-col space-y-2">
              {storySection.map((section, index) => (
                <motion.button
                  key={section.id}
                  onClick={() => {
                    setActiveStorySection(index);
                    document.getElementById(`story-${section.id}`)?.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'center'
                    });
                  }}
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    activeStorySection === index 
                      ? 'bg-primary border-primary scale-125' 
                      : 'bg-transparent border-gray-400 hover:border-gray-600'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <div className="toyota-container max-w-[1600px] xl:max-w-[1800px] space-y-32 lg:space-y-40">
              {storySection.map((section, index) => (
                <motion.div
                  key={section.id}
                  id={`story-${section.id}`}
                  className="grid lg:grid-cols-12 gap-10 items-center isolate"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  onViewportEnter={() => setActiveStorySection(index)}
                >
                  {section.layout === 'text-left' ? (
                    <>
                      {/* Text Content - Left */}
                      <motion.div
                        className="lg:col-span-5 relative z-10 space-y-6"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <div>
                          <motion.div 
                            className="flex items-center space-x-2 mb-3"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <span className="w-8 h-1 bg-primary"></span>
                            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                              {section.subtitle}
                            </span>
                          </motion.div>
                          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight">
                            {section.title}
                          </h2>
                          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            {section.description}
                          </p>
                        </div>

                        {/* Animated Stats */}
                        <motion.div 
                          className="grid grid-cols-3 gap-4 mb-8"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                        >
                          {section.stats.map((stat, i) => (
                            <div key={i} className="text-center">
                              <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                                {typeof stat.value === 'number' ? (
                                  <AnimatedCounter 
                                    value={stat.value} 
                                    duration={2}
                                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                                  />
                                ) : (
                                  stat.value
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">
                                {stat.unit}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Button 
                            onClick={section.cta.action}
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4"
                          >
                            {section.cta.label}
                          </Button>
                        </motion.div>
                      </motion.div>

                      {/* Image - Right */}
                      <motion.div
                        className="lg:col-span-7"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        viewport={{ once: true }}
                      >
                        <BleedRight>
                          <div className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group">
                            <ParallaxImg
                              src={section.image}
                              alt={section.subtitle}
                              className="w-full h-[52vw] max-h-[560px] lg:h-[72vh] xl:h-[78vh] transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                        </BleedRight>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* Image - Left */}
                      <motion.div
                        className="lg:col-span-7 order-2 lg:order-1"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        viewport={{ once: true }}
                      >
                        <BleedLeft>
                          <div className="relative z-0 rounded-3xl lg:rounded-none ring-1 ring-border lg:ring-0 shadow-xl lg:shadow-none overflow-hidden group">
                            <ParallaxImg
                              src={section.image}
                              alt={section.subtitle}
                              className="w-full h-[52vw] max-h-[560px] lg:h-[72vh] xl:h-[78vh] transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </div>
                        </BleedLeft>
                      </motion.div>

                      {/* Text Content - Right */}
                      <motion.div
                        className="lg:col-span-5 order-1 lg:order-2 relative z-10 space-y-6"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      >
                        <div>
                          <motion.div 
                            className="flex items-center space-x-2 mb-3 justify-start lg:justify-end"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
                              {section.subtitle}
                            </span>
                            <span className="w-8 h-1 bg-primary"></span>
                          </motion.div>
                          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 leading-tight lg:text-right">
                            {section.title}
                          </h2>
                          <p className="text-muted-foreground text-lg mb-8 leading-relaxed lg:text-right">
                            {section.description}
                          </p>
                        </div>

                        {/* Animated Stats */}
                        <motion.div 
                          className="grid grid-cols-3 gap-4 mb-8"
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.6 }}
                        >
                          {section.stats.map((stat, i) => (
                            <div key={i} className="text-center">
                              <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">
                                {typeof stat.value === 'number' ? (
                                  <AnimatedCounter 
                                    value={stat.value} 
                                    duration={2}
                                    decimals={stat.value % 1 !== 0 ? 1 : 0}
                                  />
                                ) : (
                                  stat.value
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground font-medium">
                                {stat.unit}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {stat.label}
                              </div>
                            </div>
                          ))}
                        </motion.div>

                        <motion.div
                          className="flex lg:justify-end"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.7 }}
                        >
                          <Button 
                            onClick={section.cta.action}
                            size="lg"
                            variant={section.id === 'safety' || section.id === 'connected' ? 'outline' : 'default'}
                            className={section.id === 'safety' || section.id === 'connected' 
                              ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4" 
                              : "bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4"
                            }
                          >
                            {section.cta.label}
                          </Button>
                        </motion.div>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          <OffersSection onOfferClick={handleOfferClick} />
          <VehicleMediaShowcase vehicle={vehicle} />
          <RefinedTechExperience vehicle={vehicle} />
          
          <section className="py-8 lg:py-16 bg-muted/30">
            <InteractiveSpecsTech vehicle={vehicle} />
          </section>

          <section className="py-8 lg:py-16 bg-muted/30">
            <RelatedVehicles currentVehicle={vehicle} />
          </section>

          <PreOwnedSimilar currentVehicle={vehicle} />
          <VehicleFAQ vehicle={vehicle} />
        </React.Suspense>

        <ActionPanel
          vehicle={vehicle}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookTestDrive={() => setIsBookingOpen(true)}
          onCarBuilder={() => setIsCarBuilderOpen(true)}
          onFinanceCalculator={() => setIsFinanceOpen(true)}
        />
      </div>

      <OffersModal
        isOpen={isOffersModalOpen}
        onClose={() => {
          setIsOffersModalOpen(false);
          setSelectedOffer(null);
        }}
        selectedOffer={selectedOffer}
      />

      <BookTestDrive
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        vehicle={vehicle}
      />

      <FinanceCalculator
        isOpen={isFinanceOpen}
        onClose={() => setIsFinanceOpen(false)}
        vehicle={vehicle}
      />

      <CarBuilder
        isOpen={isCarBuilderOpen}
        onClose={() => setIsCarBuilderOpen(false)}
        vehicle={vehicle}
      />
    </ToyotaLayout>
  );
};

export default VehicleDetails;
