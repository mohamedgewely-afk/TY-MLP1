import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ChevronLeft,
  Calendar,
  Fuel,
  Shield,
  Heart,
  Share2,
  Download,
  Settings,
  ChevronRight,
  Car,
  PencilRuler,
  Tag,
  MapPin,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Zap,
  Leaf,
  Award,
  Users,
  Star,
  ArrowRight,
  Check,
  Clock,
  Globe,
  Smartphone,
  Sparkles,
  Layers,
  Target,
  Battery,
  Gauge,
  Wind,
  Lock,
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
import MobileStickyNav from "@/components/MobileStickyNav";
import RefinedTechExperience from "@/components/vehicle-details/RefinedTechExperience";
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

const VehicleDetails = () => {
  // -------- Hooks (always on top; never behind conditionals) --------
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isCarBuilderOpen, setIsCarBuilderOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [cardWidth, setCardWidth] = useState(320); // measured later

  const { toast } = useToast();
  const { personaData } = usePersona(); // not using personaData.nickname
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);

  const heroImageRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroImageRef);

  // Rail refs (for swipeable Experience Rail)
  const railRef = useRef<HTMLDivElement>(null);
  const firstCardRef = useRef<HTMLDivElement>(null);

  // -------- Effects (still above any conditional return) --------
  // Resolve vehicle and initial state
  useEffect(() => {
    const foundVehicle = vehicles.find((v) => {
      if (v.id === vehicleName) return true;
      const slugFromName = v.name.toLowerCase().replace(/^toyota\s+/, "").replace(/\s+/g, "-");
      return slugFromName === vehicleName;
    });

    if (foundVehicle) {
      setVehicle(foundVehicle);
      document.title = `${foundVehicle.name} | Toyota UAE`;
    }

    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((fav: string) => fav === foundVehicle?.name));

    window.scrollTo(0, 0);
  }, [vehicleName]);

  // Listen to global "openCarBuilder" event
  useEffect(() => {
    const handleOpenCarBuilder = (event: CustomEvent) => {
      const { step, config } = event.detail;
      setIsCarBuilderOpen(true);
      // if (config) setBuilderConfig(config);
    };
    window.addEventListener("openCarBuilder", handleOpenCarBuilder as EventListener);
    return () => window.removeEventListener("openCarBuilder", handleOpenCarBuilder as EventListener);
  }, []);

  // Measure card width for precise snapping
  useEffect(() => {
    const el = firstCardRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      setCardWidth(Math.round(rect.width));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-rotate hero only when in view
  useEffect(() => {
    if (!isHeroInView) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHeroInView]);

  // Keep activeSlide in sync with scroll position
  useEffect(() => {
    const container = railRef.current;
    if (!container) return;
    const onScroll = () => {
      const GAP_PX = 16;
      const idx = Math.round(container.scrollLeft / (cardWidth + GAP_PX));
      setActiveSlide(Math.max(0, Math.min(idx, slides.length - 1)));
    };
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [cardWidth]);

  // -------- Static data (non-hooks) --------
  const galleryImages = [
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/789539dd-acfe-43aa-98a0-9ce5202ad482/renditions/2c61418f-a1b7-4899-93a8-65582ee09a0d?binary=true&mformat=true",
  ];

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    if (isRightSwipe) setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

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

  const calculateEMI = (price: number) => {
    const principal = price * 0.8; // 80% financing
    const rate = 0.035 / 12; // 3.5% annual rate
    const tenure = 60; // 5 years
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  };

  const handleOfferClick = (offer: any) => {
    setSelectedOffer(offer);
    setIsOffersModalOpen(true);
  };

  // Guarded values that depend on vehicle (used after guard below)
  const monthlyEMI = vehicle ? calculateEMI(vehicle.price) : 0;

  // Slides are model‑agnostic and use your handlers
  const slides: Slide[] = [
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
      meta: ["Flexible EMI", "Trade‑in support", "Top‑rated service"],
      cta: { label: "Calculate EMI", onClick: () => setIsFinanceOpen(true) },
    },
    {
      key: "build",
      title: "Build & Offers",
      subtitle: "Pick your trim, colors, accessories.",
      image: galleryImages[5],
      icon: <PencilRuler className="h-5 w-5" />,
      meta: ["Live price", "Compare trims", "Limited‑time offers"],
      cta: { label: "Start Building", onClick: () => setIsCarBuilderOpen(true) },
    },
  ];

  // Arrow navigation for rail
  const GAP_PX = 16;
  const scrollToIndex = (idx: number) => {
    const el = railRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, slides.length - 1));
    el.scrollTo({ left: clamped * (cardWidth + GAP_PX), behavior: "smooth" });
  };
  const handlePrev = () => scrollToIndex(activeSlide - 1);
  const handleNext = () => scrollToIndex(activeSlide + 1);

  // -------- Early return AFTER all hooks are declared --------
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

  // -------- Render --------
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
      <div className={`relative overflow-hidden ${isMobile ? "pb-28" : "pb-32"}`}>
        {/* Hero */}
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

          {/* ============================== */}
          {/* EXPERIENCE RAIL (Model-agnostic) */}
          {/* ============================== */}
          <section className="py-12 lg:py-20 relative bg-gradient-to-b from-background via-muted/30 to-background">
            <div className="toyota-container">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8 lg:mb-10 text-center"
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-medium">
                  <Sparkles className="h-4 w-4" />
                  Tailored to Every Model
                </div>
                <h2 className="mt-3 text-3xl lg:text-5xl font-black">
                  Craft Your {vehicle.name.split(" ").pop()} Journey
                </h2>
                <p className="mt-2 text-muted-foreground max-w-3xl mx-auto">
                  Swipe to explore performance, safety, connectivity and ownership — then act with a tap.
                </p>
              </motion.div>

              <div className="relative">
                {/* Desktop arrows */}
                <button
                  aria-label="Previous"
                  onClick={handlePrev}
                  className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-background/90 shadow ring-1 ring-black/10 hover:bg-accent"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="Next"
                  onClick={handleNext}
                  className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full bg-background/90 shadow ring-1 ring-black/10 hover:bg-accent"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Swipeable rail */}
                <div
                  ref={railRef}
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide px-1"
                >
                  {slides.map((s, i) => (
                    <div
                      key={s.key}
                      ref={i === 0 ? firstCardRef : undefined}
                      className="snap-center shrink-0 w-[280px] md:w-[340px] lg:w-[360px]"
                    >
                      <Card className="relative overflow-hidden h-full group">
                        <div className="absolute inset-0">
                          <img src={s.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/0" />
                        </div>
                        <CardContent className="relative z-10 p-5 text-white flex flex-col h-full">
                          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1 w-max">
                            {s.icon}
                            <span className="text-xs font-semibold">{s.title}</span>
                          </div>
                          <h3 className="mt-3 text-xl font-black">{s.subtitle}</h3>
                          {s.meta && (
                            <ul className="mt-3 space-y-1 text-white/85 text-sm">
                              {s.meta.map((m) => (
                                <li key={m} className="inline-flex items-center gap-2">
                                  <Check className="h-4 w-4 text-emerald-300" />
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          <div className="mt-auto pt-4">
                            {s.cta ? (
                              <Button
                                size="sm"
                                className="bg-white text-black hover:bg-white/90"
                                onClick={s.cta.onClick}
                              >
                                {s.cta.label}
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="secondary"
                                className="bg-white text-black hover:bg-white/90"
                                onClick={() => setIsBookingOpen(true)}
                              >
                                Book a Test Drive
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Pagination dots */}
                <div className="mt-5 flex items-center justify-center gap-2">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => scrollToIndex(i)}
                      className={`h-2.5 rounded-full transition-all ${
                        activeSlide === i ? "w-8 bg-primary" : "w-2.5 bg-muted-foreground/40 hover:bg-muted-foreground/60"
                      }`}
                    />
                  ))}
                </div>

                {/* Quick actions */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" onClick={() => setIsCarBuilderOpen(true)} className="justify-start">
                    <PencilRuler className="mr-2 h-4 w-4" />
                    Build Your {vehicle.name.split(" ").pop()}
                  </Button>
                  <Button variant="outline" onClick={() => setIsFinanceOpen(true)} className="justify-start">
                    <Gauge className="mr-2 h-4 w-4" />
                    Estimate EMI • {monthlyEMI.toLocaleString()} AED/mo
                  </Button>
                  <Button variant="outline" onClick={() => setIsOffersModalOpen(true)} className="justify-start">
                    <Tag className="mr-2 h-4 w-4" />
                    View Offers
                  </Button>
                  <Button variant="outline" onClick={() => setIsBookingOpen(true)} className="justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Test Drive
                  </Button>
                </div>
              </div>
            </div>
          </section>
          {/* END Experience Rail */}

          <section className="py-8 lg:py-16 bg-muted/30">
            <VehicleGallery />
          </section>

          <EnhancedLifestyleGallery vehicle={vehicle} />

          <section className="py-8 lg:py-16 bg-muted/30">
            <RelatedVehicles currentVehicle={vehicle} />
          </section>

          <PreOwnedSimilar currentVehicle={vehicle} />

          <VehicleFAQ vehicle={vehicle} />
        </React.Suspense>

        {/* Action Panel - Desktop Only */}
        <ActionPanel
          vehicle={vehicle}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onBookTestDrive={() => setIsBookingOpen(true)}
          onCarBuilder={() => setIsCarBuilderOpen(true)}
          onFinanceCalculator={() => setIsFinanceOpen(true)}
        />
      </div>

      {/* Offers Modal */}
      <OffersModal
        isOpen={isOffersModalOpen}
        onClose={() => {
          setIsOffersModalOpen(false);
          setSelectedOffer(null);
        }}
        selectedOffer={selectedOffer}
      />

      {/* Existing Modals */}
      <BookTestDrive isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} vehicle={vehicle} />
      <FinanceCalculator isOpen={isFinanceOpen} onClose={() => setIsFinanceOpen(false)} vehicle={vehicle} />
      <CarBuilder isOpen={isCarBuilderOpen} onClose={() => setIsCarBuilderOpen(false)} vehicle={vehicle} />
    </ToyotaLayout>
  );
};

export default VehicleDetails;
