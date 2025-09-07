
import React, { useState, useCallback, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import ToyotaLayout from "@/components/ToyotaLayout";
import ActionPanel from "@/components/vehicle-details/ActionPanel";
import EnhancedHeroSection from "@/components/vehicle-details/EnhancedHeroSection";
import VehicleConfiguration from "@/components/vehicle-details/VehicleConfiguration";
import VehicleModals from "@/components/vehicle-details/VehicleModals";
import SectionNavigation from "@/components/vehicle-details/SectionNavigation";
import EnhancedLoading from "@/components/ui/enhanced-loading";
import OffersSection from "@/components/home/OffersSection";

import { usePersona } from "@/contexts/PersonaContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVehicleData } from "@/hooks/use-vehicle-data";
import { useCleanup } from "@/hooks/use-cleanup";
import { useNetworkAware } from "@/hooks/use-network-aware";
import { useEnhancedGestures } from "@/hooks/use-enhanced-gestures";
import { useImageCarousel } from "@/hooks/use-image-carousel";
import { useOptimizedDeviceInfo } from "@/hooks/use-optimized-device-info";
import { useWebVitalsOptimized, useMemoryPressure } from "@/utils/performance-web-vitals";
import { createLazyComponent, preloadOnFastNetwork } from "@/utils/lazy-components";
import { cn } from "@/lib/utils";

// Lazy load heavy components with intelligent preloading
const VehicleSpecs = createLazyComponent(
  () => import("@/components/vehicle-details/VehicleSpecs"),
  () => window.innerWidth > 768 // Preload on desktop
);

// VehicleGallery - Hidden as requested
// const VehicleGallery = createLazyComponent(
//   () => import("@/components/vehicle-details/VehicleGallery")
// );

const VehicleFeatures = createLazyComponent(
  () => import("@/components/vehicle-details/VehicleFeatures")
);

const RelatedVehicles = createLazyComponent(
  () => import("@/components/vehicle-details/RelatedVehicles")
);

const TechnologyShowcase = createLazyComponent(
  () => import("@/components/vehicle-details/TechnologyShowcase")
);

const VehicleMediaShowcase = createLazyComponent(
  () => import("@/components/vehicle-details/VehicleMediaShowcase")
);

const RefinedTechExperience = createLazyComponent(
  () => import("@/components/vehicle-details/RefinedTechExperience")
);

const StorytellingSection = createLazyComponent(
  () => import("@/components/vehicle-details/StorytellingSection")
);

const PreOwnedSimilar = createLazyComponent(
  () => import("@/components/vehicle-details/PreOwnedSimilar")
);

const VehicleFAQ = createLazyComponent(
  () => import("@/components/vehicle-details/VehicleFAQ")
);

const VirtualShowroom = createLazyComponent(
  () => import("@/components/vehicle-details/VirtualShowroom")
);

// Preload components on fast networks
preloadOnFastNetwork(() => import("@/components/vehicle-details/VehicleGallery"));
preloadOnFastNetwork(() => import("@/components/vehicle-details/StorytellingSection"));

const VehicleDetails = () => {
  // Modal states - memoized to prevent unnecessary re-renders
  const [modals, setModals] = useState({
    isBookingOpen: false,
    isFinanceOpen: false,
    isCarBuilderOpen: false,
    isOffersModalOpen: false,
    isSafetyModalOpen: false,
    isConnectivityModalOpen: false,
    isHybridTechModalOpen: false,
    isInteriorModalOpen: false
  });
  
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [carBuilderInitialGrade, setCarBuilderInitialGrade] = useState<string>();
  const [selectedGrade, setSelectedGrade] = useState<string>();

  // Hooks with performance optimizations
  const { personaData } = usePersona();
  const { isMobile, deviceCategory } = useOptimizedDeviceInfo();
  const { addCleanup } = useCleanup();
  const { shouldPreloadContent, isSlowConnection, isFastConnection } = useNetworkAware();
  const { vehicle, isFavorite, galleryImages, monthlyEMI, toggleFavorite, navigate } = useVehicleData();
  const { reportMetric } = useWebVitalsOptimized();
  const { isLowMemory } = useMemoryPressure();

  const { currentImageIndex, nextImage, previousImage, setCurrentImageIndex } = useImageCarousel({
    images: galleryImages
  });

  // Memoized modal handlers to prevent re-renders
  const modalHandlers = useMemo(() => ({
    updateModal: (key: string, value: boolean) => {
      setModals(prev => ({ ...prev, [key]: value }));
    },
    handleOfferClick: (offer: any) => {
      setSelectedOffer(offer);
      setModals(prev => ({ ...prev, isOffersModalOpen: true }));
    },
    handleSafetyExplore: () => setModals(prev => ({ ...prev, isSafetyModalOpen: true })),
    handleConnectivityExplore: () => setModals(prev => ({ ...prev, isConnectivityModalOpen: true })),
    handleHybridTechExplore: () => setModals(prev => ({ ...prev, isHybridTechModalOpen: true })),
    handleInteriorExplore: () => setModals(prev => ({ ...prev, isInteriorModalOpen: true })),
    handleConfigureWithGrade: (grade?: string) => {
      setCarBuilderInitialGrade(grade);
      setModals(prev => ({ ...prev, isCarBuilderOpen: true }));
    },
    handleGradeSelect: (grade: string) => {
      setSelectedGrade(grade);
      console.log('Grade selected:', grade);
    }
  }), []);

  // Performance monitoring
  React.useEffect(() => {
    const startTime = performance.now();
    reportMetric({
      name: 'vehicle-details-mount',
      value: 0,
      rating: 'good',
      delta: 0
    });
    
    return () => {
      const endTime = performance.now();
      reportMetric({
        name: 'vehicle-details-unmount',
        value: endTime - startTime,
        rating: endTime - startTime < 1000 ? 'good' : 'needs-improvement',
        delta: 0
      });
    };
  }, [reportMetric]);

  // Enhanced gesture handlers with performance optimization
  const gesturesRef = useEnhancedGestures({
    onSwipeLeft: nextImage,
    onSwipeRight: previousImage,
    onDoubleTap: toggleFavorite,
    hapticFeedback: isMobile && 'vibrate' in navigator
  });

  // Cleanup on unmount
  React.useEffect(() => {
    addCleanup(() => {
      console.log('VehicleDetails cleanup');
    });
  }, [addCleanup]);

  // Determine what content to render based on device capabilities
  const shouldRenderHeavyContent = !isSlowConnection && !isLowMemory();
  const shouldUseSuspense = isFastConnection && !isLowMemory();

  if (!vehicle) {
    return (
      <ToyotaLayout>
        <div className="toyota-container py-16 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="space-y-4"
          >
            <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
            <p className="mb-6">The vehicle you're looking for doesn't exist.</p>
            <Button asChild className="min-h-[44px] min-w-[44px]">
              <Link to="/" aria-label="Return to home page">Return to Home</Link>
            </Button>
          </motion.div>
        </div>
      </ToyotaLayout>
    );
  }

  return (
    <ToyotaLayout
      activeNavItem="models"
      vehicle={vehicle}
      isFavorite={isFavorite}
      onToggleFavorite={toggleFavorite}
      onBookTestDrive={() => modalHandlers.updateModal('isBookingOpen', true)}
      onCarBuilder={() => modalHandlers.updateModal('isCarBuilderOpen', true)}
      onFinanceCalculator={() => modalHandlers.updateModal('isFinanceOpen', true)}
    >
      <div
        ref={gesturesRef as React.RefObject<HTMLDivElement>}
        className={cn(
          `relative overflow-hidden ${isMobile ? "pb-28" : "pb-32"}`,
          'motion-reduce:transition-none motion-reduce:transform-none'
        )}
        role="main"
        aria-label="Vehicle details page"
      >
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Skip to main content
        </a>

        <div id="main-content">
          <section id="hero">
            <EnhancedHeroSection
              vehicle={vehicle}
              galleryImages={galleryImages}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onBookTestDrive={() => modalHandlers.updateModal('isBookingOpen', true)}
              onCarBuilder={() => modalHandlers.updateModal('isCarBuilderOpen', true)}
              monthlyEMI={monthlyEMI}
            />
          </section>

          {shouldRenderHeavyContent ? (
            shouldUseSuspense ? (
              <Suspense fallback={<EnhancedLoading variant="branded" text="Loading experience..." />}>
                <section id="virtual-showroom">
                  <VirtualShowroom vehicle={vehicle} />
                </section>
                
                <section id="media-showcase">
                  <VehicleMediaShowcase vehicle={vehicle} />
                </section>

                <StorytellingSection
                  galleryImages={galleryImages}
                  monthlyEMI={monthlyEMI}
                  setIsBookingOpen={(value: boolean) => modalHandlers.updateModal('isBookingOpen', value)}
                  navigate={navigate}
                  setIsFinanceOpen={(value: boolean) => modalHandlers.updateModal('isFinanceOpen', value)}
                  onSafetyExplore={modalHandlers.handleSafetyExplore}
                  onConnectivityExplore={modalHandlers.handleConnectivityExplore}
                  onHybridTechExplore={modalHandlers.handleHybridTechExplore}
                  onInteriorExplore={modalHandlers.handleInteriorExplore}
                />

                <section id="offers">
                  <OffersSection onOfferClick={modalHandlers.handleOfferClick} />
                </section>
                
                <section id="tech-experience">
                  <RefinedTechExperience vehicle={vehicle} />
                </section>
              </Suspense>
            ) : (
              <>
                <section id="virtual-showroom">
                  <VirtualShowroom vehicle={vehicle} />
                </section>
                
                <section id="media-showcase">
                  <Suspense fallback={<EnhancedLoading variant="skeleton" />}>
                    <VehicleMediaShowcase vehicle={vehicle} />
                  </Suspense>
                </section>

                <Suspense fallback={<EnhancedLoading variant="skeleton" />}>
                  <StorytellingSection
                    galleryImages={galleryImages}
                    monthlyEMI={monthlyEMI}
                    setIsBookingOpen={(value: boolean) => modalHandlers.updateModal('isBookingOpen', value)}
                    navigate={navigate}
                    setIsFinanceOpen={(value: boolean) => modalHandlers.updateModal('isFinanceOpen', value)}
                    onSafetyExplore={modalHandlers.handleSafetyExplore}
                    onConnectivityExplore={modalHandlers.handleConnectivityExplore}
                    onHybridTechExplore={modalHandlers.handleHybridTechExplore}
                    onInteriorExplore={modalHandlers.handleInteriorExplore}
                  />
                </Suspense>

                <section id="offers">
                  <OffersSection onOfferClick={modalHandlers.handleOfferClick} />
                </section>
                
                <section id="tech-experience">
                  <Suspense fallback={<EnhancedLoading variant="skeleton" />}>
                    <RefinedTechExperience vehicle={vehicle} />
                  </Suspense>
                </section>
              </>
            )
          ) : (
            // Lightweight version for slow connections/low memory
            <>
              <section className="py-8 lg:py-16 bg-muted/30">
                <div className="toyota-container">
                  <h2 className="text-2xl font-bold mb-8">Vehicle Overview</h2>
                  <p className="text-muted-foreground mb-4">
                    Detailed content optimized for your connection speed.
                  </p>
                </div>
              </section>
              <OffersSection onOfferClick={modalHandlers.handleOfferClick} />
            </>
          )}
          
          <section id="configuration">
            <VehicleConfiguration 
              vehicle={vehicle}
              onCarBuilder={modalHandlers.handleConfigureWithGrade}
              onTestDrive={() => modalHandlers.updateModal('isBookingOpen', true)}
              onGradeSelect={modalHandlers.handleGradeSelect}
            />
          </section>

          {shouldRenderHeavyContent && (
            <Suspense fallback={<EnhancedLoading variant="skeleton" />}>
              <section id="related" className="py-8 lg:py-16 bg-muted/30" aria-labelledby="related-vehicles-heading">
                <h2 id="related-vehicles-heading" className="sr-only">Related Vehicles</h2>
                <RelatedVehicles currentVehicle={vehicle} />
              </section>

              <PreOwnedSimilar currentVehicle={vehicle} />
              
              <section id="faq">
                <VehicleFAQ vehicle={vehicle} />
              </section>
            </Suspense>
          )}

          <ActionPanel
            vehicle={vehicle}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onBookTestDrive={() => modalHandlers.updateModal('isBookingOpen', true)}
            onCarBuilder={() => modalHandlers.updateModal('isCarBuilderOpen', true)}
            onFinanceCalculator={() => modalHandlers.updateModal('isFinanceOpen', true)}
          />
        </div>

        {/* Section Navigation */}
        <SectionNavigation />
      </div>

      <VehicleModals
        vehicle={vehicle}
        isBookingOpen={modals.isBookingOpen}
        setIsBookingOpen={(value) => modalHandlers.updateModal('isBookingOpen', value)}
        isFinanceOpen={modals.isFinanceOpen}
        setIsFinanceOpen={(value) => modalHandlers.updateModal('isFinanceOpen', value)}
        isCarBuilderOpen={modals.isCarBuilderOpen}
        setIsCarBuilderOpen={(value) => modalHandlers.updateModal('isCarBuilderOpen', value)}
        isOffersModalOpen={modals.isOffersModalOpen}
        setIsOffersModalOpen={(value) => modalHandlers.updateModal('isOffersModalOpen', value)}
        selectedOffer={selectedOffer}
        setSelectedOffer={setSelectedOffer}
        isSafetyModalOpen={modals.isSafetyModalOpen}
        setIsSafetyModalOpen={(value) => modalHandlers.updateModal('isSafetyModalOpen', value)}
        isConnectivityModalOpen={modals.isConnectivityModalOpen}
        setIsConnectivityModalOpen={(value) => modalHandlers.updateModal('isConnectivityModalOpen', value)}
        isHybridTechModalOpen={modals.isHybridTechModalOpen}
        setIsHybridTechModalOpen={(value) => modalHandlers.updateModal('isHybridTechModalOpen', value)}
        isInteriorModalOpen={modals.isInteriorModalOpen}
        setIsInteriorModalOpen={(value) => modalHandlers.updateModal('isInteriorModalOpen', value)}
        carBuilderInitialGrade={carBuilderInitialGrade}
      />
    </ToyotaLayout>
  );
};

export default React.memo(VehicleDetails);
