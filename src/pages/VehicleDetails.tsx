import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import { ChevronLeft, Calendar, Fuel, Shield, Heart, Share2, Download, Settings, ChevronRight, Car, PencilRuler, Tag, MapPin, Play, Pause, Volume2, VolumeX, Zap, Leaf, Award, Users, Star, ArrowRight, Check, Clock, Globe, Smartphone, Sparkles, Layers, Target, Battery, Gauge, Wind, Lock } from "lucide-react";
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

/** =============================
 *  CinematicShowreel (inline)
 *  ============================= */
type Scene = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  metric?: string;
  description: string;
  bg: string;
  tint: string; // tailwind gradient like "from-slate-900/60 to-slate-800/40"
};

function CinematicShowreel({
  scenes,
  heading,
  tagline,
}: {
  scenes: Scene[];
  heading: string;
  tagline: string;
}) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Autoplay (respects prefers-reduced-motion)
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => setActive((i) => (i + 1) % scenes.length), 6000);
    return () => clearInterval(id);
  }, [scenes.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActive((i) => (i + 1) % scenes.length);
      if (e.key === "ArrowLeft") setActive((i) => (i - 1 + scenes.length) % scenes.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scenes.length]);

  // Scroll to active (mobile horizontal snap)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const child = el.children[active] as HTMLElement | undefined;
    if (!child) return;
    child.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }, [active]);

  return (
    <section className="relative bg-black text-white" aria-labelledby="showreel-title">
      <div className="toyota-container py-10 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-xs tracking-wide">
          <Sparkles className="h-4 w-4" />
          <span>Signature Experience</span>
        </div>
        <h2 id="showreel-title" className="mt-4 text-3xl lg:text-5xl font-extrabold">
          {heading}
        </h2>
        <p className="mt-3 text-white/70 max-w-3xl mx-auto">{tagline}</p>
      </div>

      {/* Rail */}
      <div
        ref={containerRef}
        className="relative flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 px-4 pb-8"
      >
        {scenes.map((s, i) => (
          <motion.div
            key={s.title + i}
            className="relative snap-start w-[92vw] md:w-[80vw] lg:w-[70vw] h-[70vh] lg:h-[78vh] rounded-3xl overflow-hidden flex-shrink-0"
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: active === i ? 1 : 0.7, scale: active === i ? 1 : 0.98 }}
            transition={{ type: "spring", stiffness: 100, damping: 18 }}
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${s.bg})` }}
              aria-hidden
            />
            {/* Tint */}
            <div className={`absolute inset-0 bg-gradient-to-br ${s.tint}`} aria-hidden />
            {/* Content */}
            <div className="relative z-10 h-full w-full p-6 lg:p-10 flex flex-col justify-end">
              <div className="flex items-center gap-3 text-white/90">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur">
                  {s.icon}
                </div>
                <span className="uppercase tracking-widest text-xs lg:text-sm">{s.subtitle}</span>
              </div>
              <h3 className="mt-3 text-2xl lg:text-4xl font-black">{s.title}</h3>
              {s.metric && (
                <div className="mt-1 text-lg lg:text-2xl text-white/85 font-semibold">{s.metric}</div>
              )}
              <p className="mt-3 text-white/80 max-w-xl">{s.description}</p>
            </div>

            {/* Edge gradients for readability */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black/50 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black/40 to-transparent" />

            {/* Click to activate */}
            <button
              type="button"
              aria-label={`Show scene ${i + 1}`}
              onClick={() => setActive(i)}
              className="absolute inset-0"
              tabIndex={-1}
            />
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="toyota-container pb-12">
        <div className="flex items-center justify-between gap-4">
          {/* Dots */}
          <div className="flex items-center gap-2">
            {scenes.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to scene ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === active ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
                }`}
                onClick={() => setActive(i)}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActive((a) => (a - 1 + scenes.length) % scenes.length)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Previous"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActive((a) => (a + 1) % scenes.length)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition"
              aria-label="Next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const VehicleDetails = () => {
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
  const { toast } = useToast();
  const { personaData } = usePersona();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const y = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);
  
  const heroImageRef = useRef<HTMLDivElement>(null);
  const isHeroInView = useInView(heroImageRef);

  useEffect(() => {
    const foundVehicle = vehicles.find(v => {
      if (v.id === vehicleName) return true;
      const slugFromName = v.name.toLowerCase().replace(/^toyota\s+/, '').replace(/\s+/g, '-');
      return slugFromName === vehicleName;
    });
    
    if (foundVehicle) {
      setVehicle(foundVehicle);
      document.title = `${foundVehicle.name} | Toyota UAE`;
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: string) => fav === foundVehicle?.name));
    
    window.scrollTo(0, 0);
  }, [vehicleName]);

  // Add event listener for car builder
  useEffect(() => {
    const handleOpenCarBuilder = (event: CustomEvent) => {
      const { step, config } = event.detail;
      setIsCarBuilderOpen(true);
      if (config) {
        // accept dynamic config if needed
      }
    };

    window.addEventListener('openCarBuilder', handleOpenCarBuilder as EventListener);
    return () => {
      window.removeEventListener('openCarBuilder', handleOpenCarBuilder as EventListener);
    };
  }, []);

  // Official images
  const galleryImages = [
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
    "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/789539dd-acfe-43aa-98a0-9ce5202ad482/renditions/2c61418f-a1b7-4899-93a8-65582ee09a0d?binary=true&mformat=true"
  ];

  // Auto-rotate gallery images
  useEffect(() => {
    if (!isHeroInView) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHeroInView, galleryImages.length]);

  // Touch handlers
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
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter((fav: string) => fav !== vehicle.name);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
      toast({ title: "Removed from favorites", description: `${vehicle.name} has been removed from your favorites.` });
    } else {
      favorites.push(vehicle.name);
      localStorage.setItem('favorites', JSON.stringify(favorites));
      setIsFavorite(true);
      toast({ title: "Added to favorites", description: `${vehicle.name} has been added to your favorites.` });
    }
    window.dispatchEvent(new Event('favorites-updated'));
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

  // Model‑agnostic base features we’ll project into the showreel scenes
  const premiumFeatures = [
    { 
      icon: <Zap className="h-8 w-8" />, 
      title: "Powertrain Intelligence", 
      value: "Immediate Response", 
      description: "Optimized power delivery engineered for smooth, confident acceleration.",
      color: "from-primary to-primary/80",
      bgPattern: "bg-gradient-to-br from-primary/5 to-primary/10",
      image: galleryImages[0]
    },
    { 
      icon: <Shield className="h-8 w-8" />, 
      title: "Toyota Safety Sense", 
      value: "360° Confidence", 
      description: "Proactive driver assistance that helps protect what matters most.",
      color: "from-green-500 to-emerald-400",
      bgPattern: "bg-gradient-to-br from-green-50 to-emerald-50",
      image: galleryImages[1]
    },
    { 
      icon: <Gauge className="h-8 w-8" />, 
      title: "Dynamic Performance", 
      value: "Precision Control", 
      description: "Balanced chassis dynamics for comfort in the city and control on the highway.",
      color: "from-orange-500 to-red-400",
      bgPattern: "bg-gradient-to-br from-orange-50 to-red-50",
      image: galleryImages[2]
    },
    { 
      icon: <Leaf className="h-8 w-8" />, 
      title: "Efficiency & Care", 
      value: "Lower Emissions", 
      description: "Smart efficiency features that help you go further with a lighter footprint.",
      color: "from-emerald-500 to-green-400",
      bgPattern: "bg-gradient-to-br from-emerald-50 to-green-50",
      image: galleryImages[3]
    }
  ];

  // Build showreel scenes from features (model-agnostic)
  const scenes: Scene[] = [
    {
      icon: premiumFeatures[0].icon,
      title: "Feel the Immediate Response",
      subtitle: premiumFeatures[0].title,
      metric: premiumFeatures[0].value,
      description: premiumFeatures[0].description,
      bg: premiumFeatures[0].image,
      tint: "from-slate-900/70 to-slate-800/30",
    },
    {
      icon: premiumFeatures[1].icon,
      title: "Protected Before You React",
      subtitle: premiumFeatures[1].title,
      metric: premiumFeatures[1].value,
      description: premiumFeatures[1].description,
      bg: premiumFeatures[1].image,
      tint: "from-emerald-900/70 to-emerald-800/30",
    },
    {
      icon: premiumFeatures[2].icon,
      title: "Precision in Every Curve",
      subtitle: premiumFeatures[2].title,
      metric: premiumFeatures[2].value,
      description: premiumFeatures[2].description,
      bg: premiumFeatures[2].image,
      tint: "from-orange-900/70 to-red-800/30",
    },
    {
      icon: premiumFeatures[3].icon,
      title: "Drive Further, Leave Less",
      subtitle: premiumFeatures[3].title,
      metric: premiumFeatures[3].value,
      description: premiumFeatures[3].description,
      bg: premiumFeatures[3].image,
      tint: "from-emerald-900/70 to-green-800/30",
    },
  ];

  const handleOfferClick = (offer: any) => {
    setSelectedOffer(offer);
    setIsOffersModalOpen(true);
  };

  // EMI (kept as-is)
  const calculateEMI = (price: number) => {
    const principal = price * 0.8;
    const rate = 0.035 / 12;
    const tenure = 60;
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  };
  const monthlyEMI = calculateEMI(vehicle.price);

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
      <div className={`relative overflow-hidden ${isMobile ? 'pb-28' : 'pb-32'}`}>
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
          {/* Virtual Showroom */}
          <VirtualShowroom vehicle={vehicle} />

          {/* >>> NEW CINEMATIC SHOWREEL (replaces old grid section) <<< */}
          <CinematicShowreel
            scenes={scenes}
            heading={`Why Choose ${vehicle.name.split(" ").pop()}?`}
            tagline="A smarter drive—immersive power, proactive safety, and seamless connectivity."
          />

          {/* Tech + Offers + Media */}
          <InteractiveSpecsTech vehicle={vehicle} />
          <OffersSection onOfferClick={handleOfferClick} />
          <VehicleMediaShowcase vehicle={vehicle} />

          {/* Gallery */}
          <section className="py-8 lg:py-16 bg-muted/30">
            <VehicleGallery />
          </section>

          {/* Lifestyle */}
          <EnhancedLifestyleGallery vehicle={vehicle} />

          {/* Related */}
          <section className="py-8 lg:py-16 bg-muted/30">
            <RelatedVehicles currentVehicle={vehicle} />
          </section>

          {/* Pre-Owned */}
          <PreOwnedSimilar currentVehicle={vehicle} />

          {/* FAQ */}
          <VehicleFAQ vehicle={vehicle} />
        </React.Suspense>

        {/* Action Panel */}
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

      {/* Other Modals */}
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
