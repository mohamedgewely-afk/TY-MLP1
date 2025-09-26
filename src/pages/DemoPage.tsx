import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PremiumMediaShowcase from '@/components/hero/PremiumMediaShowcase';
import MobileStickyNav from '@/components/nav/MobileStickyNav';
import DesktopActionPanel from '@/components/nav/DesktopActionPanel';
import FeatureCards from '@/components/cards/FeatureCards';
import ThreeDCardCarousel from '@/components/carousel/ThreeDCardCarousel';
import CarBuilder from '@/components/builder/CarBuilder';
import GradeCompare from '@/components/compare/GradeCompare';
import RefinedTechExperience from '@/components/tech/RefinedTechExperience';
import PrimaryCTAs from '@/components/cta/PrimaryCTAs';
import FeatureModal1 from '@/components/modals/FeatureModal1';
import FeatureModal2 from '@/components/modals/FeatureModal2';
import FeatureModal3 from '@/components/modals/FeatureModal3';
import FeatureModal4 from '@/components/modals/FeatureModal4';
import FeatureModal5 from '@/components/modals/FeatureModal5';
import FeatureModal6 from '@/components/modals/FeatureModal6';
import { vehicleData } from '@/data/vehicles';
import { grades } from '@/data/grades';
import { specs } from '@/data/specs';
import { useToast } from '@/hooks/use-toast';

interface ModalState {
  modal1: boolean;
  modal2: boolean;
  modal3: boolean;
  modal4: boolean;
  modal5: boolean;
  modal6: boolean;
  carBuilder: boolean;
  gradeCompare: boolean;
}

const DemoPage: React.FC = () => {
  const { toast } = useToast();
  const [compareList, setCompareList] = useState<string[]>([]);
  const [modals, setModals] = useState<ModalState>({
    modal1: false,
    modal2: false,
    modal3: false,
    modal4: false,
    modal5: false,
    modal6: false,
    carBuilder: false,
    gradeCompare: false,
  });

  const openModal = useCallback((modalKey: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalKey]: true }));
  }, []);

  const closeModal = useCallback((modalKey: keyof ModalState) => {
    setModals(prev => ({ ...prev, [modalKey]: false }));
  }, []);

  const handleCompareToggle = useCallback((gradeId: string) => {
    setCompareList(prev => {
      if (prev.includes(gradeId)) {
        return prev.filter(id => id !== gradeId);
      } else if (prev.length < 4) {
        return [...prev, gradeId];
      } else {
        toast({
          title: "Maximum reached",
          description: "You can compare up to 4 grades at once.",
          variant: "destructive",
        });
        return prev;
      }
    });
  }, [toast]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Toyota Land Cruiser - Premium SUV',
          text: 'Check out this amazing Toyota Land Cruiser',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "URL copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  }, [toast]);

  const handleTestDrive = useCallback(() => {
    // Analytics stub
    console.log('Analytics: book_test_drive', { vehicle: 'land-cruiser' });
    
    toast({
      title: "Test Drive Requested",
      description: "We'll contact you shortly to schedule your test drive.",
    });
  }, [toast]);

  const handleReserve = useCallback(() => {
    // Analytics stub
    console.log('Analytics: reserve_vehicle', { vehicle: 'land-cruiser' });
    
    toast({
      title: "Reservation Started",
      description: "Complete your reservation with our sales team.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <PremiumMediaShowcase
        media={vehicleData.hero}
        title="Land Cruiser"
        subtitle="Legendary Performance Redefined"
        ctaPrimary={{
          label: "Build & Price",
          action: () => openModal('carBuilder')
        }}
        ctaSecondary={{
          label: "Book Test Drive",
          action: handleTestDrive
        }}
      />

      {/* Navigation Components */}
      <MobileStickyNav
        compareCount={compareList.length}
        onCompare={() => openModal('gradeCompare')}
        onBuild={() => openModal('carBuilder')}
        onTestDrive={handleTestDrive}
        onShare={handleShare}
      />

      <DesktopActionPanel
        compareCount={compareList.length}
        onReserve={handleReserve}
        onBuild={() => openModal('carBuilder')}
        onCompare={() => openModal('gradeCompare')}
        onTestDrive={handleTestDrive}
        onShare={handleShare}
      />

      {/* Main Content Sections */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Feature Highlights */}
        <FeatureCards
          highlights={vehicleData.highlights}
          onLearnMore={(id) => {
            const modalMap: Record<string, keyof ModalState> = {
              'performance': 'modal1',
              'safety': 'modal2',
              'technology': 'modal3',
              'luxury': 'modal4',
              'efficiency': 'modal5',
              'capability': 'modal6',
            };
            const modalKey = modalMap[id];
            if (modalKey) openModal(modalKey);
          }}
        />

        {/* 3D Carousel */}
        <ThreeDCardCarousel
          items={vehicleData.carousel}
          onItemAction={(id) => {
            console.log('Analytics: carousel_action', { item: id });
          }}
        />

        {/* Car Builder */}
        <section id="builder" className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl lg:text-6xl font-light tracking-tight mb-6">
                Build Your
                <span className="text-brand-primary"> Perfect</span> Land Cruiser
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Configure every detail to match your vision
              </p>
            </motion.div>
            
            <div className="flex justify-center">
              <button
                onClick={() => openModal('carBuilder')}
                className="group relative overflow-hidden rounded-2xl bg-brand-primary text-white px-8 py-4 text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-brand-primary/25"
              >
                <span className="relative z-10">Start Building</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            </div>
          </div>
        </section>

        {/* Grade Comparison */}
        <GradeCompare
          grades={grades}
          specs={specs}
          compareList={compareList}
          onCompareToggle={handleCompareToggle}
          onOpenComparison={() => openModal('gradeCompare')}
        />

        {/* Tech Experience */}
        <RefinedTechExperience
          features={vehicleData.techFeatures || []}
        />

        {/* Primary CTAs */}
        <PrimaryCTAs
          onReserve={handleReserve}
          onTestDrive={handleTestDrive}
          onService={() => {
            toast({
              title: "Service Booking",
              description: "Redirecting to service portal...",
            });
          }}
          onTradeIn={() => {
            toast({
              title: "Trade-In Evaluation",
              description: "Starting trade-in assessment...",
            });
          }}
        />
      </motion.main>

      {/* Modals */}
      <FeatureModal1
        isOpen={modals.modal1}
        onClose={() => closeModal('modal1')}
        feature={vehicleData.highlights[0]}
      />
      <FeatureModal2
        isOpen={modals.modal2}
        onClose={() => closeModal('modal2')}
        feature={vehicleData.highlights[1]}
      />
      <FeatureModal3
        isOpen={modals.modal3}
        onClose={() => closeModal('modal3')}
        feature={vehicleData.highlights[2]}
      />
      <FeatureModal4
        isOpen={modals.modal4}
        onClose={() => closeModal('modal4')}
        feature={vehicleData.highlights[3]}
      />
      <FeatureModal5
        isOpen={modals.modal5}
        onClose={() => closeModal('modal5')}
        feature={vehicleData.highlights[4]}
      />
      <FeatureModal6
        isOpen={modals.modal6}
        onClose={() => closeModal('modal6')}
        feature={vehicleData.highlights[5]}
      />

      <CarBuilder
        isOpen={modals.carBuilder}
        onClose={() => closeModal('carBuilder')}
        grades={grades}
        onReserve={(config) => {
          console.log('Analytics: start_build', config);
          closeModal('carBuilder');
          handleReserve();
        }}
      />

      <div className="fixed inset-0 pointer-events-none z-50">
        {modals.gradeCompare && (
          <div className="pointer-events-auto">
            <GradeCompare
              grades={grades}
              specs={specs}
              compareList={compareList}
              onCompareToggle={handleCompareToggle}
              onClose={() => closeModal('gradeCompare')}
              isModal={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoPage;