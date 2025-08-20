import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
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

  const galleryImages = [
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
  ];

  const calculateEMI = (price: number) => {
    const principal = price * 0.8;
    const rate = 0.035 / 12;
    const tenure = 60;
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  };

  const monthlyEMI = vehicle ? calculateEMI(vehicle.price) : 0;
  const toggleFavorite = () => {
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
  };


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

  const handleOfferClick = (offer: any) => {
    setSelectedOffer(offer);
    setIsOffersModalOpen(true);
  };

  const onTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    if (distance < -50) setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  useEffect(() => {
    const foundVehicle = vehicles.find((v) => {
      if (v.id === vehicleName) return true;
      const slug = v.name.toLowerCase().replace(/^toyota\\s+/, "").replace(/\\s+/g, "-");
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

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentImageIndex((p) => (p + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(id);
  }, [galleryImages.length]);
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
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    window.addEventListener("resize", measure);
    requestAnimationFrame(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [slides.length]);

  const pageCount = Math.max(1, Math.ceil(slides.length / cardsPerView));

  const scrollToPage = (page: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const clamped = Math.max(0, Math.min(page, pageCount - 1));
    rail.scrollTo({ left: clamped * rail.clientWidth, behavior: "smooth" });
  };
  const handlePrev = () => scrollToPage(activePage - 1);
  const handleNext = () => scrollToPage(activePage + 1);

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
      setActivePage(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToIndex = (idx: number) => {
    const page = Math.floor(idx / Math.max(1, cardsPerView));
    scrollToPage(page);
  };

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

  const safeModelEnd = vehicle.name.split(" ").pop() || "Toyota";
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
          <InteractiveSpecsTech vehicle={vehicle} />
          <OffersSection onOfferClick={handleOfferClick} />
          <VehicleMediaShowcase vehicle={vehicle} />
          <RefinedTechExperience vehicle={vehicle} />

  
<section className="py-16 lg:py-24 bg-gradient-to-b from-background via-muted/40 to-background">
  <div className="toyota-container max-w-none">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-10 text-center"
    >
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-5 py-2 text-sm font-semibold">
        <Sparkles className="h-4 w-4" />
        Tailored to Every Model
      </div>
      <h2 className="mt-4 text-4xl lg:text-6xl font-extrabold tracking-tight">
        Craft Your {safeModelEnd} Journey
      </h2>
      <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-base lg:text-lg">
        Tap into Toyota's unique experiences. Slide through innovation, safety, and smart tech.
      </p>
    </motion.div>
       <div className="relative">
      {/* Arrows */}
      <button
        aria-label="Previous"
        onClick={handlePrev}
        disabled={activePage === 0}
        className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-background/90 ring-1 ring-border hover:bg-accent disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        aria-label="Next"
        onClick={handleNext}
        disabled={activePage >= pageCount - 1}
        className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-background/90 ring-1 ring-border hover:bg-accent disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Slide Rail */}
      <div
        ref={railRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 px-1 touch-pan-x hide-scrollbar"
      >
        {slides.map((s, i) => (
          <div
            key={s.key}
            ref={i === 0 ? firstCardRef : undefined}
            className="snap-start shrink-0 bg-background/80 backdrop-blur rounded-3xl shadow-md ring-1 ring-border transition hover:shadow-lg"
            style={{
              flex: `0 0 calc((100% - ${(cardsPerView - 1) * GAP_PX}px) / ${cardsPerView})`,
            }}
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
                loading="lazy"
              />
            </div>
            <CardContent className="p-5 space-y-3">
              <div className="inline-flex items-center gap-2 text-primary text-sm font-semibold">
                {s.icon}
                {s.title}
              </div>
              <h3 className="text-lg font-bold">{s.subtitle}</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                {s.meta.map((m) => (
                  <li key={m} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    {m}
                  </li>
                ))}
              </ul>
              <Button
                size="sm"
                variant="ghost"
                className="text-primary hover:underline mt-2"
                onClick={s.cta.onClick}
              >
                {s.cta.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {Array.from({ length: pageCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToPage(i)}
            className={`h-2.5 rounded-full transition-all ${
              activePage === i
                ? "w-8 bg-primary"
                : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
            }`}
          />
        ))}
      </div>
      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button variant="outline" onClick={() => setIsOffersModalOpen(true)} className="justify-start">
          <Tag className="mr-2 h-4 w-4" />
          View Offers
        </Button>
        <Button variant="outline" onClick={() => setIsFinanceOpen(true)} className="justify-start">
          <Gauge className="mr-2 h-4 w-4" />
          Estimate EMI • {monthlyEMI.toLocaleString()} AED/mo
        </Button>
        <Button variant="outline" onClick={() => setIsBookingOpen(true)} className="justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          Book Test Drive
        </Button>
        <Button variant="outline" onClick={() => setIsCarBuilderOpen(true)} className="justify-start">
          <PencilRuler className="mr-2 h-4 w-4" />
          Build Your {safeModelEnd}
        </Button>
      </div>
    </div>
  </div>
</section>

          <EnhancedLifestyleGallery vehicle={vehicle} />

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
