import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Shield,
  Award,
  PencilRuler,
  Tag,
  Smartphone,
  Gauge,
  Wind,
  ArrowRight,
  Check,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { vehicles } from "@/data/vehicles";
import { VehicleModel } from "@/types/vehicle";
import ToyotaLayout from "@/components/ToyotaLayout";
import VehicleGallery from "@/components/vehicle-details/VehicleGallery";
import BookTestDrive from "@/components/vehicle-details/BookTestDrive";
import FinanceCalculator from "@/components/vehicle-details/FinanceCalculator";
import RelatedVehicles from "@/components/vehicle-details/RelatedVehicles";
import LifestyleGallery from "@/components/vehicle-details/LifestyleGallery";
import CarBuilder from "@/components/vehicle-details/CarBuilder";
import VehicleMediaShowcase from "@/components/vehicle-details/VehicleMediaShowcase";
import OffersSection from "@/components/home/OffersSection";
import OffersModal from "@/components/home/OffersModal";
import { usePersona } from "@/contexts/PersonaContext";
import { useIsMobile } from "@/hooks/use-mobile";
import ActionPanel from "@/components/vehicle-details/ActionPanel";
import EnhancedHeroSection from "@/components/vehicle-details/EnhancedHeroSection";
import InteractiveSpecsTech from "@/components/vehicle-details/InteractiveSpecsTech";
import EnhancedLifestyleGallery from "@/components/vehicle-details/EnhancedLifestyleGallery";
import PreOwnedSimilar from "@/components/vehicle-details/PreOwnedSimilar";
import VehicleFAQ from "@/components/vehicle-details/VehicleFAQ";
import VirtualShowroom from "@/components/vehicle-details/VirtualShowroom";

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  icon: React.ReactNode;
  meta?: string[];
  cta?: { label: string; onClick: () => void };
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

  // carousel
  const [activeSlide, setActiveSlide] = useState(0);
  const [cardWidth, setCardWidth] = useState(360);
  const railRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  // quick view modal
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewIndex, setQuickViewIndex] = useState(0);
  const openQuickView = (i: number) => {
    setQuickViewIndex(i);
    setIsQuickViewOpen(true);
  };

  const { toast } = useToast();
  const { personaData } = usePersona();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // gallery
  const galleryImages = [
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
  ];

  // finance calc
  const calculateEMI = (price: number) => {
    const principal = price * 0.8;
    const rate = 0.035 / 12;
    const tenure = 60;
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  };
  const monthlyEMI = vehicle ? calculateEMI(vehicle.price) : 0;

  // Handler functions
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite ? "Vehicle removed from your favorites" : "Vehicle added to your favorites",
    });
  };

  const handleBookTestDrive = () => setIsBookingOpen(true);
  const handleCarBuilder = () => setIsCarBuilderOpen(true);
  const handleFinanceCalculator = () => setIsFinanceOpen(true);

  // slides
  const slides: Slide[] = [
    {
      key: "performance",
      title: "Performance",
      subtitle: "Feel the surge of hybrid power, always in command.",
      image: galleryImages[2],
      icon: <Gauge className="h-5 w-5" />,
      meta: ["Smooth acceleration", "Balanced handling", "Quiet cabin"],
      cta: { label: "Feel it – Test Drive", onClick: handleBookTestDrive },
    },
    {
      key: "safety",
      title: "Safety Sense",
      subtitle: "Guardian tech that's always watching out for you.",
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
      meta: ["Voice control", "Remote start", "OTA-ready"],
      cta: { label: "Explore Connectivity", onClick: () => navigate("/connect") },
    },
    {
      key: "comfort",
      title: "Comfort & Climate",
      subtitle: "Dual-zone control and clean air tech.",
      image: galleryImages[3],
      icon: <Wind className="h-5 w-5" />,
      meta: ["HEPA filtration", "Whisper quiet", "Smart venting"],
      cta: { label: "Inside the Cabin", onClick: () => navigate("/interior") },
    },
    {
      key: "ownership",
      title: "Ownership",
      subtitle: "Clear pricing, finance made simple.",
      image: galleryImages[4],
      icon: <Award className="h-5 w-5" />,
      meta: ["Flexible EMI", "Trade-in support", "Top-rated service"],
      cta: { label: "Calculate EMI", onClick: handleFinanceCalculator },
    },
    {
      key: "build",
      title: "Build & Offers",
      subtitle: "Pick your trim, colors, accessories.",
      image: galleryImages[5],
      icon: <PencilRuler className="h-5 w-5" />,
      meta: ["Live price", "Compare trims", "Limited-time offers"],
      cta: { label: "Start Building", onClick: handleCarBuilder },
    },
  ];

  // set vehicle
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
  }, [vehicleName]);

  // measure card width once
  useEffect(() => {
    if (!firstCardRef.current) return;
    const measure = () => {
      setCardWidth(Math.round(firstCardRef.current!.getBoundingClientRect().width));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(firstCardRef.current);
    return () => ro.disconnect();
  }, []);

  const scrollToIndex = (i: number) => {
    const el = railRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(i, slides.length - 1));
    el.scrollTo({ left: clamped * (cardWidth + GAP_PX), behavior: "smooth" });
  };

  const handlePrev = () => scrollToIndex(activeSlide - 1);
  const handleNext = () => scrollToIndex(activeSlide + 1);

  // update activeSlide on scroll
  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / (cardWidth + GAP_PX));
      setActiveSlide(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [cardWidth]);

  // keyboard nav
  const onRailKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") { e.preventDefault(); handleNext(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); handlePrev(); }
    else if (e.key === "Home") { e.preventDefault(); scrollToIndex(0); }
    else if (e.key === "End") { e.preventDefault(); scrollToIndex(slides.length - 1); }
  };

  if (!vehicle) return <div>Vehicle Not Found</div>;

  // Experience Card
  const ExperienceCard: React.FC<{ slide: Slide; index: number; isActive: boolean; }> = ({ slide, index, isActive }) => (
    <motion.div
      ref={index === 0 ? firstCardRef : undefined}
      role="group"
      aria-roledescription="slide"
      aria-label={`Slide ${index + 1} of ${slides.length}: ${slide.title}`}
      initial={{ opacity: 0.85, scale: 0.98 }}
      animate={{ opacity: isActive ? 1 : 0.9, scale: isActive ? 1 : 0.98 }}
      className="snap-center shrink-0 w-[92vw] lg:w-[85vw] rounded-3xl shadow-2xl ring-1 ring-border bg-card overflow-hidden cursor-pointer"
      onClick={() => openQuickView(index)}
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 aspect-[4/3] md:aspect-auto overflow-hidden">
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold w-max">
            {slide.icon}
            {slide.title}
          </div>
          <h3 className="mt-3 text-xl md:text-2xl font-extrabold">{slide.subtitle}</h3>
          {slide.meta && (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {slide.meta.map((m) => (
                <li key={m} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" /> {m}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6">
            {slide.cta && (
              <Button onClick={slide.cta.onClick}>
                {slide.cta.label} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const safeModelEnd = (vehicle?.name || "Toyota").split(" ").pop() || "Toyota";

  return (
    <ToyotaLayout vehicle={vehicle}>
      <EnhancedHeroSection
        vehicle={vehicle}
        galleryImages={galleryImages}
        monthlyEMI={monthlyEMI}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onBookTestDrive={handleBookTestDrive}
        onCarBuilder={handleCarBuilder}
      />

      <OffersSection onOfferClick={setSelectedOffer} />
      <VehicleMediaShowcase vehicle={vehicle} />

      {/* Experience Rail */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="toyota-container max-w-none w-full">
          <motion.div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-medium">
              <Sparkles className="h-4 w-4" /> Tailored to Every Model
            </div>
            <h2 className="mt-3 text-3xl lg:text-5xl font-black">Craft Your {safeModelEnd} Journey</h2>
          </motion.div>

          <div className="relative">
            {/* arrows */}
            <button onClick={handlePrev} className="hidden lg:flex absolute -left-8 top-1/2 -translate-y-1/2 z-10 h-14 w-14 items-center justify-center rounded-full bg-card shadow ring-1 ring-border">
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button onClick={handleNext} className="hidden lg:flex absolute -right-8 top-1/2 -translate-y-1/2 z-10 h-14 w-14 items-center justify-center rounded-full bg-card shadow ring-1 ring-border">
              <ChevronRight className="h-6 w-6" />
            </button>

            <div
              ref={railRef}
              tabIndex={0}
              onKeyDown={onRailKeyDown}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-1 pb-2"
            >
              {slides.map((s, i) => (
                <ExperienceCard key={s.key} slide={s} index={i} isActive={activeSlide === i} />
              ))}
            </div>

            {/* dots */}
            <div className="mt-6 mx-auto max-w-5xl">
              <div className="flex items-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    aria-current={activeSlide === i}
                    className={`h-2.5 flex-1 rounded-full ${activeSlide === i ? "bg-primary" : "bg-muted-foreground/30"}`}
                  />
                ))}
              </div>
            </div>

            {/* connected journey footer */}
            <div className="mt-4 max-w-5xl mx-auto hidden md:flex items-center justify-between gap-3 rounded-2xl bg-card ring-1 ring-border px-4 py-3">
              <div className="text-sm text-muted-foreground">
                Step {activeSlide + 1} of {slides.length}: <span className="font-medium">{slides[activeSlide]?.title}</
