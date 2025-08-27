
import React, { useState, Suspense, useCallback, useMemo } from "react";
import NavigationDots from "./NavigationDots";
import OptimizedStorySection from "./OptimizedStorySection";
import EnhancedLoading from "@/components/ui/enhanced-loading";
import { useSectionVisibility } from "@/hooks/use-section-visibility";
import { useCleanup } from "@/hooks/use-cleanup";
import { createStorySections } from "@/data/story-sections";

interface StorytellingProps {
  galleryImages: string[];
  monthlyEMI: number;
  setIsBookingOpen: (open: boolean) => void;
  navigate: (path: string) => void;
  setIsFinanceOpen: (open: boolean) => void;
  onSafetyExplore: () => void;
  onConnectivityExplore: () => void;
  onHybridTechExplore: () => void;
  onInteriorExplore: () => void;
}

const StorytellingSection: React.FC<StorytellingProps> = ({
  galleryImages,
  monthlyEMI,
  setIsBookingOpen,
  navigate,
  setIsFinanceOpen,
  onSafetyExplore,
  onConnectivityExplore,
  onHybridTechExplore,
  onInteriorExplore
}) => {
  const [activeStorySection, setActiveStorySection] = useState(0);
  const { addCleanup } = useCleanup();
  const { sectionRef, isVisible } = useSectionVisibility({
    threshold: 0.1,
    rootMargin: '0px 0px -20% 0px'
  });

  // Create modal handlers object to pass to createStorySections
  const modalHandlers = useMemo(() => ({
    onSafetyExplore,
    onConnectivityExplore,
    onHybridTechExplore,
    onInteriorExplore
  }), [onSafetyExplore, onConnectivityExplore, onHybridTechExplore, onInteriorExplore]);

  // Memoize story sections to prevent recreation
  const storySection = useMemo(() => createStorySections(
    galleryImages,
    monthlyEMI,
    setIsBookingOpen,
    navigate,
    setIsFinanceOpen,
    modalHandlers
  ), [galleryImages, monthlyEMI, setIsBookingOpen, navigate, setIsFinanceOpen, modalHandlers]);

  // Memoized callback for better performance
  const handleSectionClick = useCallback((index: number) => {
    setActiveStorySection(index);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-12 lg:py-16 xl:py-28 bg-muted/30"
      style={{ contain: 'layout style' }}
    >
      <NavigationDots
        sections={storySection}
        activeSection={activeStorySection}
        onSectionClick={handleSectionClick}
        isVisible={isVisible}
      />

      <div className="toyota-container max-w-[1600px] xl:max-w-[1800px] space-y-20 lg:space-y-32 xl:space-y-40">
        <Suspense fallback={<EnhancedLoading variant="skeleton" />}>
          {storySection.map((section, index) => (
            <OptimizedStorySection
              key={section.id}
              section={section}
              index={index}
              setActiveStorySection={handleSectionClick}
            />
          ))}
        </Suspense>
      </div>
    </section>
  );
};

export default StorytellingSection;
