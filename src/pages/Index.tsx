
import React from "react";
import ToyotaLayout from "@/components/ToyotaLayout";
import { usePersona } from "@/contexts/PersonaContext";
import PersonaSelector from "@/components/home/PersonaSelector";
import HeroCarousel from "@/components/home/HeroCarousel";
import { heroSlides } from "@/data/vehicles";
import PerformanceSection from "@/components/home/PerformanceSection";
import OffersSection from "@/components/home/OffersSection";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import PreOwnedSection from "@/components/home/PreOwnedSection";

// Persona-specific homepage experiences
import FamilyFirstHomepage from "@/components/personas/FamilyFirstHomepage";
import TechEnthusiastHomepage from "@/components/personas/TechEnthusiastHomepage";
import EcoWarriorHomepage from "@/components/personas/EcoWarriorHomepage";
import UrbanExplorerHomepage from "@/components/personas/UrbanExplorerHomepage";
import BusinessCommuterHomepage from "@/components/personas/BusinessCommuterHomepage";
import WeekendAdventurerHomepage from "@/components/personas/WeekendAdventurerHomepage";
import PersonaBadge from "@/components/home/PersonaBadge";

const Index = () => {
  const { selectedPersona, personaData } = usePersona();

  // Handler for persona selection completion
  const handlePersonaSelection = () => {
    // Scroll to top after persona selection
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render the appropriate persona-specific homepage
  const renderPersonaHomepage = () => {
    switch (selectedPersona) {
      case "family-first":
        return <FamilyFirstHomepage />;
      case "tech-enthusiast":
        return <TechEnthusiastHomepage />;
      case "eco-warrior":
        return <EcoWarriorHomepage />;
      case "urban-explorer":
        return <UrbanExplorerHomepage />;
      case "business-commuter":
        return <BusinessCommuterHomepage />;
      case "weekend-adventurer":
        return <WeekendAdventurerHomepage />;
      default:
        return null;
    }
  };

  return (
    <ToyotaLayout>
      {/* Show default content when no persona is selected */}
      {!selectedPersona ? (
        <>
          <HeroCarousel slides={heroSlides} />
          <FeaturedVehicles />
          <PerformanceSection />
          <OffersSection />
          <PreOwnedSection />
          <PersonaSelector onSelect={handlePersonaSelection} />
        </>
      ) : (
        // Render the persona-specific homepage
        renderPersonaHomepage()
      )}

      {/* Persona Badge - Show when a persona is selected */}
      {selectedPersona && <PersonaBadge />}
    </ToyotaLayout>
  );
};

export default Index;
