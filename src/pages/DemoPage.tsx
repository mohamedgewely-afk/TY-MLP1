import React, { useState, useEffect } from 'react';
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
import { demoVehicle, demoGrades, demoFeatures } from '@/data/vehicles';
import { useIsMobile } from '@/hooks/use-mobile';

const DemoPage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [compareCount, setCompareCount] = useState(0);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const isMobile = useIsMobile();

  // Handle modal opening
  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  // Handle actions
  const handleReserve = () => {
    openModal('reserve');
  };

  const handleBuild = () => {
    setIsBuilderOpen(true);
  };

  const handleCompare = () => {
    setIsCompareOpen(true);
  };

  const handleTestDrive = () => {
    openModal('testdrive');
  };

  const handleShare = () => {
    openModal('share');
  };

  const handleFeatureLearnMore = (featureId: string) => {
    openModal(featureId);
  };

  const handleCarouselAction = (itemId: string) => {
    openModal(itemId);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero Section */}
      <PremiumMediaShowcase
        media={demoVehicle.hero}
        title="The Future of Automotive Excellence"
        subtitle="Where luxury meets performance in perfect harmony"
        ctaPrimary={{ label: "Build & Price", action: handleBuild }}
        ctaSecondary={{ label: "Book Test Drive", action: handleTestDrive }}
      />

      {/* Feature Cards */}
      <FeatureCards
        features={demoFeatures}
        onLearnMore={handleFeatureLearnMore}
      />

      {/* 3D Carousel */}
      <ThreeDCardCarousel
        items={demoVehicle.carousel}
        onItemAction={handleCarouselAction}
      />

      {/* Tech Experience */}
      <RefinedTechExperience />

      {/* Primary CTAs */}
      <PrimaryCTAs
        onReserve={handleReserve}
        onTestDrive={handleTestDrive}
        onService={() => openModal('service')}
        onTradeIn={() => openModal('tradein')}
      />

      {/* Navigation Components */}
      <MobileStickyNav
        onCompare={handleCompare}
        onBuild={handleBuild}
        onTestDrive={handleTestDrive}
        onShare={handleShare}
        compareCount={compareCount}
      />

      <DesktopActionPanel
        onReserve={handleReserve}
        onBuild={handleBuild}
        onCompare={handleCompare}
        onTestDrive={handleTestDrive}
        onShare={handleShare}
        compareCount={compareCount}
      />

      {/* Modals */}
      <CarBuilder
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        grades={demoGrades}
      />

      <GradeCompare
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        grades={demoGrades}
      />

      <FeatureModal1
        isOpen={activeModal === 'performance'}
        onClose={closeModal}
      />

      <FeatureModal2
        isOpen={activeModal === 'safety'}
        onClose={closeModal}
      />

      <FeatureModal3
        isOpen={activeModal === 'technology'}
        onClose={closeModal}
      />

      <FeatureModal4
        isOpen={activeModal === 'luxury'}
        onClose={closeModal}
      />

      <FeatureModal5
        isOpen={activeModal === 'efficiency'}
        onClose={closeModal}
      />

      <FeatureModal6
        isOpen={activeModal === 'reserve' || activeModal === 'testdrive' || activeModal === 'service' || activeModal === 'tradein' || activeModal === 'share'}
        onClose={closeModal}
        modalType={activeModal as string}
      />
    </div>
  );
};

export default DemoPage;