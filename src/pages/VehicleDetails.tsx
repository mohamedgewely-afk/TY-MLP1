import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import ActionPanel from "@/components/vehicle-details/ActionPanel";
import EnhancedHeroSection from "@/components/vehicle-details/EnhancedHeroSection";
import EnhancedLifestyleGallery from "@/components/vehicle-details/EnhancedLifestyleGallery";
import PreOwnedSimilar from "@/components/vehicle-details/PreOwnedSimilar";
import VehicleFAQ from "@/components/vehicle-details/VehicleFAQ";

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  image: string;
  icon: React.ReactNode;
  meta?: string[];
  cta?: { label: string; onClick: () => void };
};

const GAP_PX = 24; // must match gap-6

export default function VehicleDetails() {
  const { vehicleName } = useParams<{ vehicleName: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [vehicle, setVehicle] = useState<VehicleModel | null>(null);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [isCarBuilderOpen, setIsCarBuilderOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Quick View
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [quickViewIndex, setQuickViewIndex] = useState(0);
  const openQuickView = (i: number) => { setQuickViewIndex(i); setIsQuickViewOpen(true); };

  // Carousel (PAGE-BASED)
  const railRef = useRef<HTMLDivElement>(null);
  const [cardsPerView, setCardsPerView] = useState(1);
  const [activePage, setActivePage] = useState(0);
  const pageCount = Math.max(1, Math.ceil(slides().length / cardsPerView));

  // Data
  function slides(): Slide[] {
    const galleryImages = [
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/33e1da1e-df0b-4ce1-ab7e-9eee5e466e43/renditions/e661ede5-10d4-43d3-b507-3e9cf54d1e51?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/c0db2583-2f04-4dc7-922d-9fc0e7ef1598/items/1ed39525-8aa4-4501-bc27-71b2ef371c94/renditions/a205edda-0b79-444f-bccb-74f1e08d092e?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/99361037-8c52-4705-bc51-c2cea61633c6/items/aa9464a6-1f26-4dd0-a3a1-b246f02db11d/renditions/b8ac9e21-da97-4c00-9efc-276d36d797c2?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/adc19d33-a26d-4448-8ae6-9ecbce2bb2d8/items/5ae14c90-6ca2-49dd-a596-e3e4b2bf449b/renditions/62240799-f5a0-4728-80b3-c928ff0d6985?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/c4e12e8a-9dec-46b0-bf28-79b0ce12d68a/renditions/46932519-51bd-485e-bf16-cf1204d3226a?binary=true&mformat=true",
      "https://dam.alfuttaim.com/dx/api/dam/v1/collections/b3900f39-1b18-4f3e-9048-44efedd76327/items/561ac4b4-3604-4e66-ae72-83e2969d7d65/renditions/ccb433bd-1203-4de2-ab2d-5e70f3dd5c24?binary=true&mformat=true",
    ];
    return [
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
        cta: { label: "Calculate EMI", onClick: handleFinanceCalculator },
      },
      {
        key: "build",
        title: "Build & Offers",
        subtitle: "Pick your trim, colors, accessories.",
        image: galleryImages[5],
        icon: <PencilRuler className="h-5 w-5" />,
        meta: ["Live price", "Compare trims", "Limited‑time offers"],
        cta: { label: "Start Building", onClick: handleCarBuilder },
      },
    ];
  }

  // Vehicle + page title
  useEffect(() => {
    const found = vehicles.find((v) => {
      if (v.id === vehicleName) return true;
      const slug = v.name.toLowerCase().replace(/^toyota\s+/, "").replace(/\s+/g, "-");
      return slug === vehicleName;
    });
    if (found) {
      setVehicle(found);
      document.title = `${found.name} | Toyota UAE`;
    }
  }, [vehicleName]);

  // Decide cardsPerView purely from rail width (no measuring cards)
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const measure = () => {
      const w = rail.clientWidth;
      let per = 1;
      if (w >= 1280) per = 4;      // desktop
      else if (w >= 1024) per = 3; // large tablet
      else if (w >= 640) per = 2;  // tablet
      else per = 1;                // mobile
      setCardsPerView(per);
      // keep page in range if layout changed
      setActivePage((p) => Math.min(p, Math.ceil(slides().length / per) - 1));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(rail);
    window.addEventListener("resize", measure);
    requestAnimationFrame(measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // Scroll helpers: **one full rail width per page**
  const scrollToPage = (page: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const clamped = Math.max(0, Math.min(page, Math.ceil(slides().length / cardsPerView) - 1));
    rail.scrollTo({ left: clamped * rail.clientWidth, behavior: "smooth" });
  };
  const handlePrev = () => scrollToPage(activePage - 1);
  const handleNext = () => scrollToPage(activePage + 1);

  // Track active page
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const onScroll = () => {
      const idx = Math.round(rail.scrollLeft / Math.max(1, rail.clientWidth));
      setActivePage(idx);
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  // Close QuickView before opening other modals (prevents z-index stacking on mobile)
  const runAfterCloseQuickView = (fn: () => void) => {
    if (isQuickViewOpen) {
      setIsQuickViewOpen(false);
      setTimeout(fn, 0);
    } else {
      fn();
    }
  };

  // Actions
  const handleToggleFavorite = () => {
    setIsFavorite((x) => !x);
    toast({ title: !isFavorite ? "Added to favorites" : "Removed from favorites", description: vehicle?.name });
  };
  const handleBookTestDrive = () => setIsBookingOpen(true);
  const handleCarBuilder = () => setIsCarBuilderOpen(true);
  const handleFinanceCalculator = () => setIsFinanceOpen(true);
  const handleOfferClick = (offer: any) => { setSelectedOffer(offer); setIsOffersModalOpen(true); };

  if (!vehicle) return <div />;

  // Card flex-basis: pure CSS math (no measuring)
  const basis = (per: number) =>
    `calc((100% - ${GAP_PX * (per - 1)}px) / ${per})`;

  const s = slides();
  const safeModelEnd = (vehicle?.name || "Toyota").split(" ").pop() || "Toyota";
  const activeFirstIndex = activePage * cardsPerView;

  return (
    <ToyotaLayout
      activeNavItem="models"
      vehicle={vehicle}
      isFavorite={isFavorite}
      onToggleFavorite={handleToggleFavorite}
      onBookTestDrive={handleBookTestDrive}
      onCarBuilder={handleCarBuilder}
      onFinanceCalculator={handleFinanceCalculator}
    >
      <EnhancedHeroSection
        vehicle={vehicle}
        galleryImages={[
          s[0].image, s[1].image, s[2].image, s[3].image, s[4].image, s[5].image
        ]}
        monthlyEMI={Math.round((vehicle?.price || 0) * 0.8 * (0.035/12) * Math.pow(1+0.035/12,60) / (Math.pow(1+0.035/12,60)-1))}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onBookTestDrive={handleBookTestDrive}
        onCarBuilder={handleCarBuilder}
      />

      <OffersSection onOfferClick={handleOfferClick} />
      <VehicleMediaShowcase vehicle={vehicle} />

      {/* EXPERIENCE RAIL */}
      <section className="py-12 lg:py-20 bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="toyota-container max-w-none w-full">
          <motion.div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-medium">
              <Sparkles className="h-4 w-4" /> Tailored to Every Model
            </div>
            <h2 className="mt-3 text-3xl lg:text-5xl font-black">Craft Your {safeModelEnd} Journey</h2>
          </motion.div>

          <div className="relative">
            {/* arrows: move exactly one page */}
            <button
              aria-label="Previous"
              onClick={handlePrev}
              className="hidden lg:flex absolute -left-8 top-1/2 -translate-y-1/2 z-10 h-14 w-14 items-center justify-center rounded-full bg-card shadow ring-1 ring-border"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              aria-label="Next"
              onClick={handleNext}
              className="hidden lg:flex absolute -right-8 top-1/2 -translate-y-1/2 z-10 h-14 w-14 items-center justify-center rounded-full bg-card shadow ring-1 ring-border"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* rail: pure flex sizing, swipeable, page-sized scroll */}
            <div
              ref={railRef}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") { e.preventDefault(); handleNext(); }
                else if (e.key === "ArrowLeft") { e.preventDefault(); handlePrev(); }
                else if (e.key === "Home") { e.preventDefault(); scrollToPage(0); }
                else if (e.key === "End") { e.preventDefault(); scrollToPage(pageCount - 1); }
              }}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-0 pb-2"
              style={{ scrollbarWidth: "none" as any }}
            >
              {s.map((slide, i) => (
                <motion.div
                  key={slide.key}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Card ${i + 1} of ${s.length}: ${slide.title}`}
                  initial={{ opacity: 0.95, scale: 0.995 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="snap-start shrink-0 rounded-2xl shadow-xl ring-1 ring-border bg-card overflow-hidden cursor-pointer"
                  style={{ flex: `0 0 ${basis(cardsPerView)}`, width: basis(cardsPerView) }}
                  onClick={() => openQuickView(i)}
                >
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-4 md:p-5">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-[11px] font-semibold w-max">
                      {slide.icon}
                      {slide.title}
                    </div>
                    <h3 className="mt-2 text-base md:text-lg font-extrabold">{slide.subtitle}</h3>
                    {slide.meta && (
                      <ul className="mt-3 grid grid-cols-1 gap-1.5">
                        {slide.meta.map((m) => (
                          <li key={m} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Check className="h-4 w-4 text-primary" /> {m}
                          </li>
                        ))}
                      </ul>
                    )}
                    {slide.cta && (
                      <Button
                        className="mt-4 w-full md:w-auto"
                        onClick={(e) => { e.stopPropagation(); runAfterCloseQuickView(slide.cta!.onClick); }}
                      >
                        {slide.cta.label} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* pagination by PAGE */}
            <div className="mt-6 mx-auto max-w-5xl">
              <div className="flex items-center gap-2">
                {Array.from({ length: pageCount }).map((_, p) => (
                  <button
                    key={p}
                    aria-label={`Go to page ${p + 1}`}
                    aria-current={activePage === p}
                    onClick={() => scrollToPage(p)}
                    className={`h-2.5 flex-1 rounded-full transition-all ${
                      activePage === p ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
              <p className="sr-only" aria-live="polite">
                Page {activePage + 1} of {pageCount}. Cards {activeFirstIndex + 1}–
                {Math.min(activeFirstIndex + cardsPerView, s.length)} visible.
              </p>
            </div>

            {/* connected journey */}
            <div className="mt-4 max-w-5xl mx-auto hidden md:flex items-center justify-between gap-3 rounded-2xl bg-card ring-1 ring-border px-4 py-3">
              <div className="text-sm text-muted-foreground">
                Page {activePage + 1} of {pageCount} • Cards {activeFirstIndex + 1}–
                {Math.min(activeFirstIndex + cardsPerView, s.length)}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handlePrev} disabled={activePage === 0}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button size="sm" onClick={() => scrollToPage(activePage + 1)} disabled={activePage >= pageCount - 1}>
                  Next Page <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => openQuickView(activeFirstIndex)} disabled={activeFirstIndex >= s.length}>
                  Quick View
                </Button>
              </div>
            </div>

            {/* quick actions (ordered) */}
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
              <Button variant="outline" onClick={() => setIsOffersModalOpen(true)} className="justify-center">
                <Tag className="mr-2 h-4 w-4" /> View Offers
              </Button>
              <Button variant="outline" onClick={handleFinanceCalculator} className="justify-center">
                <Gauge className="mr-2 h-4 w-4" /> Estimate EMI • {calculateEMI(vehicle?.price || 0).toLocaleString()} AED/mo
              </Button>
              <Button variant="outline" onClick={handleBookTestDrive} className="justify-center">
                <Calendar className="mr-2 h-4 w-4" /> Book Test Drive
              </Button>
              <Button variant="outline" onClick={handleCarBuilder} className="justify-center">
                <PencilRuler className="mr-2 h-4 w-4" /> Build Your {safeModelEnd}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* rest */}
      <section className="py-8 lg:py-16 bg-muted/30">
        <VehicleGallery />
      </section>
      <EnhancedLifestyleGallery vehicle={vehicle} />
      <section className="py-8 lg:py-16 bg-muted/30">
        <RelatedVehicles currentVehicle={vehicle} />
      </section>
      <PreOwnedSimilar currentVehicle={vehicle} />
      <VehicleFAQ vehicle={vehicle} />

      {/* Quick View */}
      <Dialog open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden z-[60]">
          {s[quickViewIndex] && (
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <img src={s[quickViewIndex].image} alt={s[quickViewIndex].title} className="w-full h-full object-cover" />
              <div className="p-6 space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold w-max">
                  {s[quickViewIndex].icon}
                  {s[quickViewIndex].title}
                </div>
                <h3 className="text-2xl font-extrabold">{s[quickViewIndex].subtitle}</h3>
                {s[quickViewIndex].meta && (
                  <ul className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    {s[quickViewIndex].meta!.map((m) => (
                      <li key={m} className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> {m}</li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-3">
                  {s[quickViewIndex].cta ? (
                    <Button onClick={() => runAfterCloseQuickView(s[quickViewIndex].cta!.onClick)}>
                      {s[quickViewIndex].cta!.label} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={() => runAfterCloseQuickView(handleBookTestDrive)}>
                      Book a Test Drive <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const next = (quickViewIndex + 1) % s.length;
                      setQuickViewIndex(next);
                      const nextPage = Math.floor(next / cardsPerView);
                      scrollToPage(nextPage);
                    }}
                  >
                    Next: {s[(quickViewIndex + 1) % s.length].title}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modals */}
      <OffersModal
        isOpen={isOffersModalOpen}
        onClose={() => { setIsOffersModalOpen(false); setSelectedOffer(null); }}
        selectedOffer={selectedOffer}
      />
      <BookTestDrive isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} vehicle={vehicle} />
      <FinanceCalculator isOpen={isFinanceOpen} onClose={() => setIsFinanceOpen(false)} vehicle={vehicle} />
      <CarBuilder isOpen={isCarBuilderOpen} onClose={() => setIsCarBuilderOpen(false)} vehicle={vehicle} />

      {/* Desktop action panel */}
      <ActionPanel
        vehicle={vehicle}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onBookTestDrive={handleBookTestDrive}
        onCarBuilder={handleCarBuilder}
        onFinanceCalculator={handleFinanceCalculator}
      />
    </ToyotaLayout>
  );
}
